// Leonida Platinum v3 — saved progress: earned set, per-trophy PSN counters
// and notes, in localStorage. v3 moves to a new storage key and migrates any
// v1/v2 save it finds, so a returning player's ticks survive the upgrade.
export const STORAGE_KEY = 'leonida-platinum-progress-v3';
export const LEGACY_KEYS = ['leonida-platinum-progress-v1', 'leonida-platinum-progress-v2'];

export function emptyProgress() {
  return { earned: [], counts: {}, notes: {} };
}

function cleanProgress(parsed) {
  if (!parsed || typeof parsed !== 'object') return emptyProgress();
  const counts = {};
  if (parsed.counts && typeof parsed.counts === 'object') {
    for (const [k, v] of Object.entries(parsed.counts)) {
      const n = Math.floor(Number(v) || 0);
      if (n > 0) counts[String(k)] = n;
    }
  }
  const notes = {};
  if (parsed.notes && typeof parsed.notes === 'object') {
    for (const [k, v] of Object.entries(parsed.notes)) {
      if (typeof v === 'string' && v.trim()) notes[String(k)] = v;
    }
  }
  return {
    earned: Array.isArray(parsed.earned) ? [...new Set(parsed.earned.filter((n) => typeof n === 'string'))] : [],
    counts,
    notes,
    updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : undefined,
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return cleanProgress(JSON.parse(raw));
    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (!legacy) continue;
      const migrated = cleanProgress(JSON.parse(legacy));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch {
    // A corrupt save is treated as no save: the tracker starts empty rather
    // than failing to open.
  }
  return emptyProgress();
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
  if (n === 0) delete progress.counts[String(id)];
  else progress.counts[String(id)] = n;
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

// How far a counted trophy has come, as a fraction 0..1, from the saved
// counter. Used by the estimator to credit partial counter progress.
export function counterFraction(trophy, progress) {
  if (trophy.target == null || trophy.target <= 0) return 0;
  const done = Math.min(trophy.target, progress.counts[String(trophy.id)] || 0);
  return done / trophy.target;
}

export function exportProgress(progress) {
  return JSON.stringify({ app: 'leonida-platinum', version: 3, exportedAt: new Date().toISOString(), ...progress }, null, 2);
}

export function parseImported(text) {
  const parsed = JSON.parse(text);
  const source = Array.isArray(parsed) ? { earned: parsed } : parsed;
  if (!source || typeof source !== 'object') throw new Error('not an object');
  const next = cleanProgress(source);
  if (typeof source.updatedAt === 'string') next.updatedAt = source.updatedAt;
  return next;
}
