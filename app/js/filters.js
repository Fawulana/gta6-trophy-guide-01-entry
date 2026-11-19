// Leonida Platinum — filtering, search, sorting and the spoiler rule.
import { GRADE_ORDER } from './config.js';

// Every filter the checklist offers. Search reads the name, description, guide,
// steps and kind, so a search for "fishing" or "bank vault" finds the trophy.
export function trophyMatches(trophy, filters, earned) {
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.earned === 'earned' && !earned.has(trophy.name)) return false;
  if (filters.earned === 'remaining' && earned.has(trophy.name)) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  if (filters.search) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide} ${(trophy.steps || []).join(' ')} ${trophy.when || ''} ${trophy.kind}`.toLowerCase();
    if (!hay.includes(filters.search.toLowerCase())) return false;
  }
  return true;
}

// Spoiler rule: story trophies stay hidden (name + description) until earned.
export function isSpoilerHidden(trophy, spoilersOn, earned) {
  return spoilersOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

// Sort the checklist. "official" is the list's own order; "grade" puts the
// platinum and golds first; "difficulty" puts the hardest first; "closest"
// puts the trophies nearest completion first (smallest remaining count, then
// easiest), earned trophies last.
export function sortTrophies(trophies, order, progress) {
  const list = [...trophies];
  const counts = progress?.counts || {};
  const earned = new Set(progress?.earned || []);
  const remaining = (t) => (t.target == null ? Infinity : Math.max(0, t.target - (counts[String(t.id)] || 0)));
  if (order === 'grade') {
    list.sort((a, b) => GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade) || a.id - b.id);
  } else if (order === 'difficulty') {
    list.sort((a, b) => (b.difficulty || 1) - (a.difficulty || 1) || a.id - b.id);
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
