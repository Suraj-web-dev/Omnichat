import { useState, useEffect, useCallback } from 'react';
import { INITIAL_CONVERSATIONS, generateDynamicModelResponses } from '../data/dummyData';
import { generateId, fireConfetti } from '../utils/helpers';
import * as api from '../services/api';

const STORAGE_KEY = 'omnichat_sessions_v1';

export function useChat() {
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load chats from localStorage:', e);
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeChatId, setActiveChatId] = useState(() => conversations[0]?.id || null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check backend server on load and sync if available
  useEffect(() => {
    let isMounted = true;
    async function syncBackend() {
      const health = await api.checkBackendHealth();
      if (!isMounted) return;

      setBackendStatus({ online: health.online, checking: false, details: health });

      if (health.online) {
        try {
          const remoteChats = await api.fetchConversations();
          if (isMounted && remoteChats && remoteChats.length > 0) {
            setConversations(remoteChats);
            setActiveChatId(prev => remoteChats.some(c => c.id === prev) ? prev : remoteChats[0]?.id);
          }
        } catch (e) {
          console.warn('Backend reachable but could not sync conversations:', e);
        }
      }
    }

    syncBackend();
    return () => { isMounted = false; };
  }, []);

  // Sync to local storage as safety backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeChatId) || conversations[0] || null;

  // 1. Create a new chat session
  const createNewChat = async () => {
    const newChatId = generateId();
    const newChat = {
      id: newChatId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };

    setConversations(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);

    if (backendStatus.online) {
      try {
        await api.createConversation('New Conversation');
      } catch (err) {
        console.warn('Backend create conversation error:', err);
      }
    }

    return newChat.id;
  };

  // 2. Delete a chat session
  const deleteChat = async (chatId) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      if (activeChatId === chatId) {
        setActiveChatId(filtered[0]?.id || null);
      }
      return filtered;
    });

    if (backendStatus.online) {
      try {
        await api.deleteConversation(chatId);
      } catch (err) {
        console.warn('Backend delete error:', err);
      }
    }
  };

  // 3. Rename a chat
  const renameChat = async (chatId, newTitle) => {
    if (!newTitle.trim()) return;

    setConversations(prev =>
      prev.map(c => c.id === chatId ? { ...c, title: newTitle.trim(), updatedAt: new Date().toISOString() } : c)
    );

    if (backendStatus.online) {
      try {
        await api.renameConversation(chatId, newTitle.trim());
      } catch (err) {
        console.warn('Backend rename error:', err);
      }
    }
  };

  // 4. Send prompt & trigger 3-model parallel answers
  const sendMessage = async (promptText) => {
    if (!promptText.trim() || isGenerating) return;

    let targetChatId = activeChatId;
    if (!targetChatId || !conversations.some(c => c.id === targetChatId)) {
      targetChatId = await createNewChat();
    }

    const userMessageId = generateId();
    const aiMessageId = generateId();

    const userMessage = {
      id: userMessageId,
      sender: 'user',
      text: promptText.trim(),
      timestamp: new Date().toISOString()
    };

    // Pending placeholder for 3 models with loading state
    const pendingAiMessage = {
      id: aiMessageId,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      selectedModelId: null,
      models: {
        'gpt-4o': { modelId: 'gpt-4o', modelName: 'GPT-4o', content: '', latency: '...', tokens: 0, loading: true },
        'claude-3-5-sonnet': { modelId: 'claude-3-5-sonnet', modelName: 'Claude 3.5 Sonnet', content: '', latency: '...', tokens: 0, loading: true },
        'gemini-1-5-pro': { modelId: 'gemini-1-5-pro', modelName: 'Gemini 1.5 Pro', content: '', latency: '...', tokens: 0, loading: true }
      }
    };

    // Optimistically update conversation
    setConversations(prev =>
      prev.map(chat => {
        if (chat.id === targetChatId) {
          const isFirst = chat.messages.length === 0;
          const newTitle = isFirst
            ? promptText.slice(0, 32) + (promptText.length > 32 ? '...' : '')
            : chat.title;
          return {
            ...chat,
            title: newTitle,
            updatedAt: new Date().toISOString(),
            messages: [...chat.messages, userMessage, pendingAiMessage]
          };
        }
        return chat;
      })
    );

    setIsGenerating(true);

    if (backendStatus.online) {
      try {
        // Send to Express Backend
        const result = await api.sendMessageTo3Models(targetChatId, promptText.trim());
        if (result && result.aiMessage) {
          setConversations(prev =>
            prev.map(chat => {
              if (chat.id === targetChatId) {
                return {
                  ...chat,
                  title: result.conversation?.title || chat.title,
                  messages: chat.messages.map(m => m.id === aiMessageId ? result.aiMessage : m)
                };
              }
              return chat;
            })
          );
        }
      } catch (backendError) {
        console.warn('Backend generation failed, falling back to client-side generator:', backendError);
        runClientFallbackGenerator(targetChatId, aiMessageId, promptText);
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Client-side simulated generation
      runClientFallbackGenerator(targetChatId, aiMessageId, promptText);
    }
  };

  const runClientFallbackGenerator = (targetChatId, aiMessageId, promptText) => {
    const generatedResponses = generateDynamicModelResponses(promptText);

    setTimeout(() => {
      updateMessageModelData(targetChatId, aiMessageId, 'gemini-1-5-pro', generatedResponses['gemini-1-5-pro']);
    }, 600);

    setTimeout(() => {
      updateMessageModelData(targetChatId, aiMessageId, 'gpt-4o', generatedResponses['gpt-4o']);
    }, 1000);

    setTimeout(() => {
      updateMessageModelData(targetChatId, aiMessageId, 'claude-3-5-sonnet', generatedResponses['claude-3-5-sonnet']);
      setIsGenerating(false);
    }, 1400);
  };

  const updateMessageModelData = (chatId, messageId, modelKey, modelData) => {
    setConversations(prev =>
      prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  models: {
                    ...msg.models,
                    [modelKey]: { ...modelData, loading: false }
                  }
                };
              }
              return msg;
            })
          };
        }
        return chat;
      })
    );
  };

  // 5. Select preferred winner model
  const selectModelResponse = async (messageId, chosenModelId) => {
    fireConfetti();

    setConversations(prev =>
      prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => {
              if (msg.id === messageId) {
                return { ...msg, selectedModelId: chosenModelId };
              }
              return msg;
            })
          };
        }
        return chat;
      })
    );

    if (backendStatus.online && activeChatId) {
      try {
        await api.selectWinnerModel(activeChatId, messageId, chosenModelId);
      } catch (err) {
        console.warn('Backend selection sync failed:', err);
      }
    }
  };

  // 6. Reopen 3-model comparison
  const unselectModelResponse = async (messageId) => {
    setConversations(prev =>
      prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => {
              if (msg.id === messageId) {
                return { ...msg, selectedModelId: null };
              }
              return msg;
            })
          };
        }
        return chat;
      })
    );

    if (backendStatus.online && activeChatId) {
      try {
        await api.selectWinnerModel(activeChatId, messageId, null);
      } catch (err) {
        console.warn('Backend unselect sync failed:', err);
      }
    }
  };

  // Reset to default sample dummy data
  const resetToSampleData = () => {
    setConversations(INITIAL_CONVERSATIONS);
    setActiveChatId(INITIAL_CONVERSATIONS[0].id);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    conversations,
    activeChatId,
    activeConversation,
    isGenerating,
    backendStatus,
    setActiveChatId,
    createNewChat,
    deleteChat,
    renameChat,
    sendMessage,
    selectModelResponse,
    unselectModelResponse,
    resetToSampleData
  };
}
