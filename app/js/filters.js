// Leonida Platinum v3 — filtering, search, sorting and the spoiler rule.
// v3 adds: the availability-window filter (closing / story / anytime), search
// across windows and prerequisites, and two new orders — the platinum path
// (the difficulty-ordered earn order) and closing-soonest (windows that shut
// first at the top).
import { GRADE_ORDER, windowBucket } from './config.js';

// Every filter the checklist offers. Search reads the name, description,
// guide, steps, kind, window, what closes it and prerequisites, so a search
// for "fishing", "bank vault", "partner" or "before the finale" finds it.
export function trophyMatches(trophy, filters, earned) {
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.window !== 'all' && windowBucket(trophy) !== filters.window) return false;
  if (filters.earned === 'earned' && !earned.has(trophy.name)) return false;
  if (filters.earned === 'remaining' && earned.has(trophy.name)) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  if (filters.search) {
    const hay = [
      trophy.name, trophy.description, trophy.guide,
      (trophy.steps || []).join(' '), trophy.when || '', trophy.kind,
      trophy.window || '', trophy.windowCloses || '',
      (trophy.prerequisites || []).join(' '),
    ].join(' ').toLowerCase();
    if (!hay.includes(filters.search.toLowerCase())) return false;
  }
  return true;
}

// Spoiler rule: story trophies stay hidden (name + description) until earned.
export function isSpoilerHidden(trophy, spoilersOn, earned) {
  return spoilersOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

// How soon a trophy's window shuts: 0 for a window that closes during the
// story (story-locked or missable), 1 for a chapter window, 2 for any time.
export function windowUrgency(trophy) {
  if (trophy.storyLocked || trophy.missable) return 0;
  if (trophy.kind === 'story') return 1;
  return 2;
}

// Sort the checklist. "official" is the list's own order; "grade" puts the
// platinum and golds first; "difficulty" puts the hardest first; "closest"
// puts the trophies nearest completion first (smallest remaining count, then
// easiest), earned trophies last; "path" follows the platinum path order
// (planner.platinumPath); "window" puts the windows that shut first at the top.
export function sortTrophies(trophies, order, progress, pathOrder) {
  const list = [...trophies];
  const counts = progress?.counts || {};
  const earned = new Set(progress?.earned || []);
  const remaining = (t) => (t.target == null ? Infinity : Math.max(0, t.target - (counts[String(t.id)] || 0)));
  if (order === 'grade') {
    list.sort((a, b) => GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade) || a.id - b.id);
  } else if (order === 'difficulty') {
    list.sort((a, b) => (b.difficulty || 1) - (a.difficulty || 1) || a.id - b.id);
  } else if (order === 'path') {
    const pos = new Map((pathOrder || list).map((t, i) => [t.id, i]));
    list.sort((a, b) => (pos.get(a.id) ?? a.id) - (pos.get(b.id) ?? b.id));
  } else if (order === 'window') {
    list.sort((a, b) => {
      const ea = earned.has(a.name) ? 1 : 0;
      const eb = earned.has(b.name) ? 1 : 0;
      if (ea !== eb) return ea - eb;
      return windowUrgency(a) - windowUrgency(b) || a.stage - b.stage || (a.difficulty || 1) - (b.difficulty || 1) || a.id - b.id;
    });
  } else if (order === 'closest') {
    list.sort((a, b) => {
      const ea = earned.has(a.name) ? 1 : 0;
      const eb = earned.has(b.name) ? 1 : 0;
      if (ea !== eb) return ea - eb;
      return remaining(a) - remaining(b) || (a.difficulty || 1) - (b.difficulty || 1) || a.id - b.id;
    });
  }
  return list;
}

export function formatTarget(trophy, count) {
  if (trophy.target == null) return '';
  const unit = trophy.target >= 1000 ? `$${trophy.target.toLocaleString('en-US')}` : String(trophy.target);
  return `${count} / ${unit}`;
}

// Difficulty as five filled/empty dots, e.g. "◆◆◆○○" for 3 of 5.
export function formatDifficulty(difficulty) {
  const d = Math.max(1, Math.min(5, difficulty || 1));
  return '◆'.repeat(d) + '○'.repeat(5 - d);
}

// Hours as a short label: 0.25 -> "15 min", 0.5 -> "30 min", 2 -> "2 h",
// 2.5 -> "2.5 h". Zero hours means the trophy costs no extra time of its own.
export function formatHours(hours) {
  const h = Number(hours) || 0;
  if (h === 0) return 'no extra time';
  if (h < 1) return `${Math.round(h * 60)} min`;
  return `${h % 1 === 0 ? h : h.toFixed(1)} h`;
}
