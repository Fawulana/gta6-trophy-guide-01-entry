// Leonida Platinum v3 — fixed configuration: roadmap stages with their gates,
// kind and window labels, the estimator's constants, and the demo seed.
//
// v3 adds, over v2: an availability window on every trophy (when it can be
// earned and what closes it), per-trophy prerequisites, and a per-trophy hour
// estimate that feeds the time-to-platinum estimator. Difficulty and hours are
// this entry's estimates, never official figures.

export const STAGES = [
  {
    id: 1,
    title: 'Stage 1 — Play the story',
    gate: 'Do this stage first, and do not start the final mission until stages 1–2 are done: the named missions and character finales only come around during the story.',
    text: 'Chapters 1–4, the opening mission and every named story mission, through the final mission. Chapter trophies cannot be missed; named-mission trophies are story-locked, so earn them as they come. Work the chapters in order and clear the story-locked side content before the finale — the pre-finale checklist is the gate out of this stage. The platinum path runs the story trophies in this order and never leaves a closing window behind.',
  },
  {
    id: 2,
    title: 'Stage 2 — Side characters & strangers',
    gate: 'Finish this stage before the final mission: the five character finales are story-locked, and a strand left open may not come back.',
    text: 'The five character finales (Andy, Kenton, Billy, Randy, Tyrone), the 8 stranger strands, Bret\u2019s hunt and Cal\u2019s fishing challenge. Finish each strand as it appears — the finales are story-locked, and the stranger strands only count when they close. Do the finales in the order the story offers them; the path lists each finale with its prerequisite (play that character\u2019s strand as it appears).',
  },
  {
    id: 3,
    title: 'Stage 3 — Activities & challenges',
    gate: 'No gate: every trophy here is repeatable and can be finished at any point, including after the finale. Best done between missions and in the post-game.',
    text: 'Shooting Range golds (42), drone races (14 locations), 20 different race wins, 250 stunts, 50 challenges, meditation (18 spots), arcade, bowling and the 9 activity types. Cumulative and repeatable — build the counts passively during the story, then grind the remainder after it. The Shootist (42 golds) is the hardest trophy in this stage; the platinum path puts it late, after the easier activities, because its hours are the longest here.',
  },
  {
    id: 4,
    title: 'Stage 4 — Collectibles & the map',
    gate: 'No gate: nothing here is missable. Explore systematically after the story, or fold it into the story as you travel.',
    text: 'Card sets (3), WAiNK locations (100), 52 areas of Leonida, 100 vehicles discovered, 8 garages and 10 Scooter Bros registrations. Explore the map district by district and let the location counters fill in together — the same sweep advances the areas, the meditation spots, the WAiNK locations and vehicle discovery at once. The estimator credits counter progress, so a half-finished sweep already cuts the hours left.',
  },
  {
    id: 5,
    title: 'Stage 5 — Money & mayhem',
    gate: 'No gate, but plan each robbery before it starts: the vaults, the jewelry store and the three-shop streak are single-attempt moments, and a failed run ends the attempt.',
    text: 'Bank vaults (5), armored trucks, jewelry stores, illegal operations (9 gangs), the wanted-level and partnership moments, and the money goals — $250,000 laundered, $100,000 spent. Plan each robbery\u2019s escape before the entry, launder the takings steadily, and let the $250,000 laundering total grow alongside the robberies. The money trophies cost no extra hours of their own in the estimator — they ride on the robbery hours.',
  },
  {
    id: 6,
    title: 'Stage 6 — Platinum',
    gate: 'The last gate: 100% completion unlocks the platinum. It lands only when every other stage is done.',
    text: '100% completion (gold) unlocks the platinum. It is the sum of every other stage, so it lands last. Use the per-stage bars to see what is left, and clear the emptiest stage first. The estimator counts no hours for these two trophies themselves — their hours are the hours of everything before them.',
  },
];

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side missions',
  activity: 'Activities',
  collectible: 'Collectibles',
  world: 'World & mayhem',
  money: 'Money',
  platinum: 'Platinum',
};

export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

// Difficulty is this entry's estimate (1 easiest, 5 hardest), not an official figure.
export const DIFFICULTY_LABELS = {
  1: 'Easy',
  2: 'Straightforward',
  3: 'Moderate',
  4: 'Demanding',
  5: 'The grind',
};

// Availability windows. A trophy's window is the span in which it can be
// earned; windowCloses names what ends it. "Never" means any time, including
// the post-game. The three buckets below are the filter's options.
export const WINDOW_LABELS = {
  closing: 'Closing soon — story-locked or missable',
  story: 'Story window — a chapter or mission',
  anytime: 'Any time — including post-game',
};

export function windowBucket(trophy) {
  if (trophy.storyLocked || trophy.missable) return 'closing';
  if (trophy.kind === 'story') return 'story';
  return 'anytime';
}

// The estimator's constants. STORY_HOURS_PER_CHAPTER is this entry's estimate
// for one story chapter of play; FINALE_HOURS is the final mission. A trophy's
// hoursEst is its own incremental effort on top of the story (0 for automatic
// chapter trophies and for the two trophies that are sums of the rest). The
// estimator's method is shown in the app, beside the number.
export const STORY_HOURS_PER_CHAPTER = 6;
export const FINALE_HOURS = 1;
export const SESSION_HOURS = 2;

// Demo seed for screenshots: 13 earned, three counters part way. Used only
// with ?demo and only when no progress is saved yet.
export const DEMO_EARNED = [2, 3, 4, 5, 8, 10, 15, 16, 19, 21, 28, 35, 44];
export const DEMO_COUNTS = { 15: 120, 31: 40, 35: 55 };
