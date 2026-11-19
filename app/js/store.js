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
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : undefined,
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  progress.updatedAt = new Date().toISOString();
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

// One-line summary for the header and the roadmap: earned count, percentage,
// and per-grade and per-stage breakdowns, so the app can show progress
// without re-counting in every view.
export function progressSummary(progress, trophies) {
  const earned = earnedSet(progress);
  const byGrade = {};
  const byStage = {};
  for (const t of trophies) {
    byGrade[t.grade] = byGrade[t.grade] || { got: 0, total: 0 };
    byGrade[t.grade].total += 1;
    if (earned.has(t.name)) byGrade[t.grade].got += 1;
    byStage[t.stage] = byStage[t.stage] || { got: 0, total: 0 };
    byStage[t.stage].total += 1;
    if (earned.has(t.name)) byStage[t.stage].got += 1;
  }
  return {
    earned: earned.size,
    total: trophies.length,
    percent: trophies.length ? Math.round((earned.size / trophies.length) * 100) : 0,
    byGrade,
    byStage,
  };
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
  if (typeof source.updatedAt === 'string') next.updatedAt = source.updatedAt;
  return next;
}
