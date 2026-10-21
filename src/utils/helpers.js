import confetti from 'canvas-confetti';

export function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 55,
    origin: { y: 0.8 },
    colors: ['#ffffff', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a']
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
