// Leonida Platinum v3 — the Next-up planner, the platinum path and the
// time-to-platinum estimator.
//
// The platinum path is the difficulty-ordered route through all 55 trophies:
// roadmap stage first (story, then side strands, then activities, then
// collectibles, then money and mayhem, then the platinum itself); inside a
// stage, windows that close go first (story-locked and missable), then the
// easiest trophies, then the hardest. A trophy's prerequisites ride with it
// on the path, so the order never asks for something whose requirement is
// not yet met. The estimator turns the same order into hours: story hours
// for unfinished chapters plus each remaining trophy's own hour estimate,
// with counted trophies credited in proportion to their counter.
import { FINALE_HOURS, SESSION_HOURS, STORY_HOURS_PER_CHAPTER } from './config.js';
import { counterFraction } from './store.js';

export function stageProgress(trophies, progress, stageId) {
  const members = trophies.filter((t) => t.stage === stageId);
  const earned = new Set(progress.earned);
  const done = members.filter((t) => earned.has(t.name)).length;
  return { done, total: members.length, percent: members.length ? Math.round((done / members.length) * 100) : 0 };
}

// Rank key for the platinum path. Lower is earlier. Two trophies are
// pinned by their prerequisites, not by their stage: the final mission
// (id 7) needs Chapters 1–4 and the whole pre-finale checklist, so it ranks
// after stage 2; the platinum (id 1) needs everything, so it ranks last,
// after 100% completion (id 14).
export function effectiveStage(trophy) {
  if (trophy.id === 1) return 7;
  if (trophy.id === 7) return 2.5;
  return trophy.stage;
}

export function pathRank(trophy) {
  const lock = trophy.storyLocked || trophy.missable ? 0 : 1;
  // Difficulty before lock: inside a stage the easiest trophies go first,
  // and among equals the closing windows go first. That puts the chapter
  // trophies (difficulty 1) ahead of the named missions (difficulty 2) in
  // stage 1, while the finales still lead stage 2 on equal difficulty.
  return [effectiveStage(trophy), trophy.difficulty || 1, lock, trophy.id];
}

function comparePath(a, b) {
  const ra = pathRank(a);
  const rb = pathRank(b);
  for (let i = 0; i < ra.length; i += 1) {
    if (ra[i] !== rb[i]) return ra[i] - rb[i];
  }
  return 0;
}

// The optimal platinum route: every trophy in earn order, each with its
// position (1..55), its prerequisites, its window and its hour estimate.
// Pure function of the data: same trophies, same order, every time.
export function platinumPath(trophies) {
  return [...trophies].sort(comparePath).map((t, i) => ({ trophy: t, position: i + 1 }));
}

export function pathPosition(trophies, id) {
  return platinumPath(trophies).find((p) => p.trophy.id === id)?.position ?? null;
}

// Hours still needed for one trophy: 0 when earned; for a counted trophy,
// its estimate scaled by the fraction of the count still to do.
export function hoursLeftFor(trophy, progress) {
  if (new Set(progress.earned).has(trophy.name)) return 0;
  const hours = Number(trophy.hoursEst) || 0;
  if (trophy.target != null) return hours * (1 - counterFraction(trophy, progress));
  return hours;
}

// Story hours still to play: one chapter's worth per unfinished chapter
// trophy (ids 3–6), plus the finale while its gold is unearned.
export function storyHoursLeft(trophies, progress) {
  const earned = new Set(progress.earned);
  const chapters = trophies.filter((t) => [3, 4, 5, 6].includes(t.id) && !earned.has(t.name)).length;
  const finale = trophies.find((t) => t.id === 7);
  const finaleLeft = finale && !earned.has(finale.name) ? FINALE_HOURS : 0;
  return chapters * STORY_HOURS_PER_CHAPTER + finaleLeft;
}

// The time-to-platinum estimator. Returns hours left (story + grind),
// hours done, the total, and the same span in 2-hour sessions. Deterministic:
// the same earned set and counters always give the same numbers.
export function estimateRemaining(trophies, progress) {
  const earned = new Set(progress.earned);
  const grindLeft = trophies.reduce((sum, t) => sum + hoursLeftFor(t, progress), 0);
  const storyLeft = storyHoursLeft(trophies, progress);
  const left = storyLeft + grindLeft;
  const grindTotal = trophies.reduce((sum, t) => sum + (Number(t.hoursEst) || 0), 0);
  const storyTotal = 4 * STORY_HOURS_PER_CHAPTER + FINALE_HOURS;
  const total = storyTotal + grindTotal;
  return {
    hoursLeft: Math.round(left * 10) / 10,
    hoursDone: Math.round((total - left) * 10) / 10,
    hoursTotal: Math.round(total * 10) / 10,
    storyLeft: Math.round(storyLeft * 10) / 10,
    grindLeft: Math.round(grindLeft * 10) / 10,
    sessionsLeft: Math.ceil(left / SESSION_HOURS),
    earnedCount: earned.size,
    totalCount: trophies.length,
  };
}

export const ESTIMATOR_METHOD =
  'Est. method: unfinished story chapters count 6 h each, the final mission 1 h; every other trophy counts its own hour estimate, and a counted trophy (e.g. 120 of 250 stunts) counts only the share still to do. Chapter trophies and the two sum trophies (100% completion, platinum) count 0 h of their own. All figures are this entry\u2019s estimates.';

// The single most useful next trophy: the earliest position on the platinum
// path that is still unearned. The reason names its window or prerequisite,
// so the player sees why this one goes first.
export function nextUpTrophy(trophies, progress) {
  const earned = new Set(progress.earned);
  const path = platinumPath(trophies);
  const step = path.find((p) => !earned.has(p.trophy.name));
  if (!step) return null;
  const t = step.trophy;
  let reason;
  if (t.storyLocked || t.missable) {
    reason = `Path #${step.position} — ${t.windowCloses ? `window closes: ${t.windowCloses}` : 'do it while the chance is here'}`;
  } else if ((t.prerequisites || []).length > 0) {
    reason = `Path #${step.position} — needs: ${t.prerequisites[0]}`;
  } else if (t.target != null) {
    const done = progress.counts[String(t.id)] || 0;
    reason = done > 0
      ? `Path #${step.position} — PSN target ${done} of ${t.target}, keep the count moving`
      : `Path #${step.position} — PSN target ${t.target}, start the count early`;
  } else {
    reason = `Path #${step.position} in the platinum path`;
  }
  return { trophy: t, position: step.position, reason };
}

// The next five steps on the path, for the planner panel: the queue a player
// can work through in order without re-reading the whole roadmap.
export function nextUpList(trophies, progress, count = 5) {
  const earned = new Set(progress.earned);
  return platinumPath(trophies)
    .filter((p) => !earned.has(p.trophy.name))
    .slice(0, count)
    .map((p) => ({ ...nextUpTrophy([p.trophy], progress), trophy: p.trophy, position: p.position, reason: nextUpReason(p) }));
}

function nextUpReason(step) {
  const t = step.trophy;
  if (t.storyLocked || t.missable) return t.windowCloses ? `Window closes: ${t.windowCloses}` : 'Do it while the chance is here';
  if ((t.prerequisites || []).length > 0) return `Needs: ${t.prerequisites[0]}`;
  if (t.target != null) return `PSN target ${t.target}`;
  return 'Next in the platinum path';
}
