const FEEDBACK_KEY = "iqcrag.frontend.feedback";

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function saveFeedback(entry) {
  const current = readJson(FEEDBACK_KEY);
  current.push({
    id: crypto.randomUUID(),
    ...entry,
    createdAt: new Date().toISOString()
  });
  writeJson(FEEDBACK_KEY, current);
  return { ok: true };
}
