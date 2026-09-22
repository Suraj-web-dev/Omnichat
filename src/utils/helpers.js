import confetti from 'canvas-confetti';

export function fireConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']
  });
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.resolve();
}

export function formatTime(timestamp) {
  if (!timestamp) return '';
  if (typeof timestamp === 'string' && (timestamp.includes('ago') || timestamp.includes('Yesterday'))) {
    return timestamp;
  }
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function generateId() {
  return 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Simple markdown renderer for code blocks, bold, lists, quotes, inline code
export function renderMarkdown(content) {
  if (!content) return '';
  return content;
}

