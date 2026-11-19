// Leonida Platinum — saved progress: earned set, per-trophy PSN counters and notes, in localStorage.
export const STORAGE_KEY = 'leonida-platinum-progress-v1';

export function emptyProgress() {
  return { earned: [], counts: {}, notes: {} };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyProgress();
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned.filter((n) => typeof n === 'string') : [],
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function earnedSet(progress) {
  return new Set(progress.earned);
}

export function setEarned(progress, name, earned) {
  const set = earnedSet(progress);
  if (earned) set.add(name);
  else set.delete(name);
  progress.earned = [...set];
  saveProgress(progress);
}

export function setCount(progress, id, value, target) {
  const n = Math.max(0, Math.min(target, Math.floor(Number(value) || 0)));
  progress.counts[String(id)] = n;
  saveProgress(progress);
  return n;
}

export function setNote(progress, id, text) {
  if (text.trim()) progress.notes[String(id)] = text;
  else delete progress.notes[String(id)];
  saveProgress(progress);
}

export function exportProgress(progress) {
  return JSON.stringify({ app: 'leonida-platinum', version: 1, exportedAt: new Date().toISOString(), ...progress }, null, 2);
}

export function parseImported(text) {
  const parsed = JSON.parse(text);
  const source = Array.isArray(parsed) ? { earned: parsed } : parsed;
  if (!source || typeof source !== 'object') throw new Error('not an object');
  const next = emptyProgress();
  if (Array.isArray(source.earned)) next.earned = source.earned.filter((n) => typeof n === 'string');
  if (source.counts && typeof source.counts === 'object') next.counts = source.counts;
  if (source.notes && typeof source.notes === 'object') next.notes = source.notes;
  return next;
}
