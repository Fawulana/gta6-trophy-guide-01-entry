// Leonida Platinum — filtering, search and the spoiler rule.
export function trophyMatches(trophy, filters, earned) {
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.earned === 'earned' && !earned.has(trophy.name)) return false;
  if (filters.earned === 'remaining' && earned.has(trophy.name)) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  if (filters.search) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind}`.toLowerCase();
    if (!hay.includes(filters.search.toLowerCase())) return false;
  }
  return true;
}

// Spoiler rule: story trophies stay hidden (name + description) until earned.
export function isSpoilerHidden(trophy, spoilersOn, earned) {
  return spoilersOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

export function formatTarget(trophy, count) {
  if (trophy.target == null) return '';
  const unit = trophy.target >= 1000 ? `$${trophy.target.toLocaleString('en-US')}` : String(trophy.target);
  return `${count} / ${unit}`;
}
