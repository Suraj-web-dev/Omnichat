const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Check if the Express backend is alive and reachable
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, ...data };
  } catch (err) {
    return { online: false, error: err.message };
  }
}

/**
 * Fetch all conversations from MongoDB / backend
 */
export async function fetchConversations() {
  const res = await fetch(`${API_BASE_URL}/conversations`);
  if (!res.ok) throw new Error('Failed to fetch conversations');
  const json = await res.json();
  return json.data || [];
}

/**
 * Create a new conversation session
 */
export async function createConversation(title = 'New Conversation') {
  const res = await fetch(`${API_BASE_URL}/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('Failed to create conversation');
  const json = await res.json();
  return json.data;
}

/**
 * Rename a conversation
 */
export async function renameConversation(id, title) {
  const res = await fetch(`${API_BASE_URL}/conversations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('Failed to rename conversation');
  const json = await res.json();
  return json.data;
}

/**
 * Delete a conversation
 */
export async function deleteConversation(id) {
  const res = await fetch(`${API_BASE_URL}/conversations/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete conversation');
  return true;
}

/**
 * Send user prompt & generate responses from 3 models
 */
export async function sendMessageTo3Models(conversationId, prompt) {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to generate 3-model response');
  }
  const json = await res.json();
  return json.data;
}

/**
 * Save user's selected winning model
 */
export async function selectWinnerModel(conversationId, messageId, selectedModelId) {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages/${messageId}/select`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedModelId })
  });
  if (!res.ok) throw new Error('Failed to update winner selection');
  const json = await res.json();
  return json.data;
}

/**
 * Synthesize all 3 model answers into a unified Master Answer
 */
export async function synthesizeModelResponses(conversationId, messageId, prompt) {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages/${messageId}/synthesize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to synthesize models');
  }
  const json = await res.json();
  return json.data;
}


