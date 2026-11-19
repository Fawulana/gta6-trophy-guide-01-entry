// Leonida Platinum — the Next-up planner: which trophy to chase next, and how
// far each roadmap stage has come. The rule is the roadmap's own order, with
// the pre-finale gate first: an unearned story-locked or missable trophy in the
// earliest open stage always outranks a repeatable grind trophy.

export function stageProgress(trophies, progress, stageId) {
  const members = trophies.filter((t) => t.stage === stageId);
  const earned = new Set(progress.earned);
  const done = members.filter((t) => earned.has(t.name)).length;
  return { done, total: members.length, percent: members.length ? Math.round((done / members.length) * 100) : 0 };
}

// The single most useful next trophy: the earliest stage with anything left,
// story-locked and missable trophies first inside that stage (they are the
// ones that can be lost), then the easiest remaining trophy in it.
export function nextUpTrophy(trophies, progress) {
  const earned = new Set(progress.earned);
  const remaining = trophies.filter((t) => !earned.has(t.name));
  if (remaining.length === 0) return null;
  const byStage = [...remaining].sort((a, b) => {
    if (a.stage !== b.stage) return a.stage - b.stage;
    const lockA = a.storyLocked || a.missable ? 0 : 1;
    const lockB = b.storyLocked || b.missable ? 0 : 1;
    if (lockA !== lockB) return lockA - lockB;
    return (a.difficulty || 1) - (b.difficulty || 1) || a.id - b.id;
  });
  const t = byStage[0];
  let reason;
  if (t.stage <= 2 && (t.storyLocked || t.missable)) {
    reason = t.storyLocked
      ? 'Story-locked — finish it before the final mission'
      : 'Missable — take the chance while it is here';
  } else if (t.target != null) {
    const done = progress.counts[String(t.id)] || 0;
    reason = done > 0
      ? `PSN target ${done} of ${t.target} — keep the count moving`
      : `PSN target ${t.target} — start the count early`;
  } else {
    reason = 'Next in the roadmap order';
  }
  return { trophy: t, reason };
}
