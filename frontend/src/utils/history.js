// frontend/src/utils/history.js
const STORAGE_KEY = "study-kit-history";
const MAX_HISTORY_ITEMS = 20;

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(filename, studyKit) {
  const history = getHistory();
  const entry = {
    id: crypto.randomUUID(),
    filename,
    timestamp: Date.now(),
    studyKit,
  };
  const updated = [entry, ...history].slice(0, MAX_HISTORY_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save to history (storage may be full):", e);
  }
  return entry.id;
}

export function deleteFromHistory(id) {
  const updated = getHistory().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function formatRelativeTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}