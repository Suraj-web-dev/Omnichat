import { Conversation } from '../models/Conversation.js';
import { generate3ModelResponses, synthesizeModelResponses, evaluateModelResponses } from '../services/aiService.js';
import { inMemoryConversations } from './conversationController.js';

function generateId() {
  return 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// 1. Send prompt & generate 3 model outputs in parallel
export async function sendMessageAndGenerate3Models(req, res) {
  try {
    const { id: conversationId } = req.params;
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const isDbConnected = Conversation.db?.readyState === 1;
    let conversation;

    if (isDbConnected) {
      conversation = await Conversation.findOne({ id: conversationId });
    } else {
      conversation = inMemoryConversations.find(c => c.id === conversationId);
    }

    // Auto-create conversation if not present
    if (!conversation) {
      const newChat = {
        id: conversationId,
        title: prompt.trim().slice(0, 32) + (prompt.length > 32 ? '...' : ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      if (isDbConnected) {
        conversation = await Conversation.create(newChat);
      } else {
        conversation = newChat;
        inMemoryConversations.unshift(conversation);
      }
    }

    const userMessageId = generateId();
    const userMessage = {
      id: userMessageId,
      conversationId,
      sender: 'user',
      text: prompt.trim(),
      timestamp: new Date().toISOString()
    };

    // If first message, auto-update title from prompt
    if (conversation.messages.length === 0 || conversation.title === 'New Conversation') {
      conversation.title = prompt.trim().slice(0, 32) + (prompt.length > 32 ? '...' : '');
    }

    // Call OpenAI, Anthropic, and Google Gemini concurrently
    console.log(`[MessageController] Dispatching 3 models for prompt: "${prompt.slice(0, 35)}..."`);
    const modelResponses = await generate3ModelResponses(prompt.trim(), conversation.messages);

    const aiMessageId = generateId();
    const aiMessage = {
      id: aiMessageId,
      conversationId,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      selectedModelId: null, // User will select preferred model
      models: modelResponses
    };

    conversation.messages.push(userMessage, aiMessage);
    conversation.updatedAt = new Date().toISOString();

    if (isDbConnected) {
      await conversation.save();
    }

    return res.status(201).json({
      success: true,
      data: {
        userMessage,
        aiMessage,
        conversation
      }
    });
  } catch (err) {
    console.error('[MessageController] Error sending message:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 2. Choose the winning model for an assistant message
export async function selectWinningModel(req, res) {
  try {
    const { id: conversationId, messageId } = req.params;
    const { selectedModelId } = req.body;

    const isDbConnected = Conversation.db?.readyState === 1;
    let conversation;

    if (isDbConnected) {
      conversation = await Conversation.findOne({ id: conversationId });
    } else {
      conversation = inMemoryConversations.find(c => c.id === conversationId);
    }

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const targetMsg = conversation.messages.find(m => m.id === messageId);
    if (!targetMsg) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    targetMsg.selectedModelId = selectedModelId;
    conversation.updatedAt = new Date().toISOString();

    if (isDbConnected) {
      await conversation.save();
    }

    return res.json({
      success: true,
      message: 'Model winner selected successfully',
      data: targetMsg
    });
  } catch (err) {
    console.error('[MessageController] Error selecting winner model:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 3. Synthesize all 3 model answers into 1 unified Master Answer
export async function synthesizeAndSelectWinner(req, res) {
  try {
    const { id: conversationId, messageId } = req.params;
    const isDbConnected = Conversation.db?.readyState === 1;

    let conversation;
    if (isDbConnected) {
      conversation = await Conversation.findOne({ id: conversationId });
    } else {
      conversation = inMemoryConversations.find(c => c.id === conversationId);
    }

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const msgIndex = conversation.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    const targetMsg = conversation.messages[msgIndex];

    // Find the original user prompt for context
    let prompt = req.body.prompt;
    if (!prompt) {
      if (msgIndex > 0 && conversation.messages[msgIndex - 1]?.sender === 'user') {
        prompt = conversation.messages[msgIndex - 1].text;
      } else {
        prompt = conversation.title || 'User Inquiry';
      }
    }

    console.log(`[MessageController] Synthesizing 3 models for message: ${messageId}`);
    const synthesizedResult = await synthesizeModelResponses(prompt, targetMsg.models);

    // Save synthesized result in message models
    if (targetMsg.models instanceof Map) {
      targetMsg.models.set('synthesized', synthesizedResult);
    } else {
      if (!targetMsg.models) targetMsg.models = {};
      targetMsg.models['synthesized'] = synthesizedResult;
    }

    targetMsg.selectedModelId = 'synthesized';
    conversation.updatedAt = new Date().toISOString();

    if (isDbConnected) {
      conversation.markModified('messages');
      await conversation.save();
    }

    return res.json({
      success: true,
      message: 'Models successfully synthesized into master response',
      data: {
        message: targetMsg,
        synthesized: synthesizedResult
      }
    });
  } catch (err) {
    console.error('[MessageController] Error synthesizing models:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 4. AI Judge: Evaluate and score the 3 model responses
export async function judgeAndScoreMessage(req, res) {
  try {
    const { id: conversationId, messageId } = req.params;
    const isDbConnected = Conversation.db?.readyState === 1;

    let conversation;
    if (isDbConnected) {
      conversation = await Conversation.findOne({ id: conversationId });
    } else {
      conversation = inMemoryConversations.find(c => c.id === conversationId);
    }

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const msgIndex = conversation.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    const targetMsg = conversation.messages[msgIndex];

    // Find original prompt
    let prompt = req.body.prompt;
    if (!prompt) {
      if (msgIndex > 0 && conversation.messages[msgIndex - 1]?.sender === 'user') {
        prompt = conversation.messages[msgIndex - 1].text;
      } else {
        prompt = conversation.title || 'General Query';
      }
    }

    console.log(`[MessageController] AI Judge evaluating message: ${messageId}`);
    const evaluation = await evaluateModelResponses(prompt, targetMsg.models);

    targetMsg.evaluation = evaluation;
    conversation.updatedAt = new Date().toISOString();

    if (isDbConnected) {
      conversation.markModified('messages');
      await conversation.save();
    }

    return res.json({
      success: true,
      message: 'Models successfully judged and scored',
      data: {
        evaluation,
        message: targetMsg
      }
    });
  } catch (err) {
    console.error('[MessageController] Error judging models:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 5. Get all messages for a conversation
export async function getMessagesByConversation(req, res) {
  try {
    const { id: conversationId } = req.params;
    const isDbConnected = Conversation.db?.readyState === 1;

    let conversation;
    if (isDbConnected) {
      conversation = await Conversation.findOne({ id: conversationId });
    } else {
      conversation = inMemoryConversations.find(c => c.id === conversationId);
    }

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    return res.json({
      success: true,
      data: conversation.messages || []
    });
  } catch (err) {
    console.error('[MessageController] Error getting messages:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

