import { Conversation } from '../models/Conversation.js';

let inMemoryConversations = [];

function generateId() {
  return 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// 1. Get all conversations
export async function getConversations(req, res) {
  try {
    const isDbConnected = Conversation.db?.readyState === 1;
    if (isDbConnected) {
      const convos = await Conversation.find().sort({ updatedAt: -1 });
      return res.json({ success: true, data: convos });
    }
    return res.json({ success: true, data: inMemoryConversations, source: 'memory' });
  } catch (err) {
    console.error('[ConversationController] Error getting conversations:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 2. Create a new conversation
export async function createConversation(req, res) {
  try {
    const { title } = req.body;
    const newChatId = generateId();
    const newChat = {
      id: newChatId,
      title: title || 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };

    const isDbConnected = Conversation.db?.readyState === 1;
    if (isDbConnected) {
      const created = await Conversation.create(newChat);
      return res.status(201).json({ success: true, data: created });
    }

    inMemoryConversations.unshift(newChat);
    return res.status(201).json({ success: true, data: newChat, source: 'memory' });
  } catch (err) {
    console.error('[ConversationController] Error creating conversation:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 3. Get single conversation by ID
export async function getConversationById(req, res) {
  try {
    const { id } = req.params;
    const isDbConnected = Conversation.db?.readyState === 1;

    if (isDbConnected) {
      const convo = await Conversation.findOne({ id });
      if (!convo) return res.status(404).json({ success: false, error: 'Conversation not found' });
      return res.json({ success: true, data: convo });
    }

    const memoryConvo = inMemoryConversations.find(c => c.id === id);
    if (!memoryConvo) return res.status(404).json({ success: false, error: 'Conversation not found' });
    return res.json({ success: true, data: memoryConvo, source: 'memory' });
  } catch (err) {
    console.error('[ConversationController] Error getting conversation by id:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 4. Rename conversation title
export async function renameConversation(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const isDbConnected = Conversation.db?.readyState === 1;

    if (isDbConnected) {
      const updated = await Conversation.findOneAndUpdate(
        { id },
        { title, updatedAt: new Date().toISOString() },
        { new: true }
      );
      return res.json({ success: true, data: updated });
    }

    const convo = inMemoryConversations.find(c => c.id === id);
    if (convo) {
      convo.title = title;
      convo.updatedAt = new Date().toISOString();
    }
    return res.json({ success: true, data: convo });
  } catch (err) {
    console.error('[ConversationController] Error renaming conversation:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 5. Delete conversation
export async function deleteConversation(req, res) {
  try {
    const { id } = req.params;
    const isDbConnected = Conversation.db?.readyState === 1;

    if (isDbConnected) {
      await Conversation.deleteOne({ id });
      return res.json({ success: true, message: 'Deleted successfully' });
    }

    inMemoryConversations = inMemoryConversations.filter(c => c.id !== id);
    return res.json({ success: true, message: 'Deleted from memory' });
  } catch (err) {
    console.error('[ConversationController] Error deleting conversation:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export { inMemoryConversations };

