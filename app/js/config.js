// Leonida Platinum — fixed configuration: roadmap stages, kind labels, demo seed.
export const STAGES = [
  { id: 1, title: 'Stage 1 — Play the story', text: 'Chapters 1–4, the opening mission and every named story mission, through the final mission. Chapter trophies cannot be missed; named-mission trophies are story-locked, so earn them as they come.' },
  { id: 2, title: 'Stage 2 — Side characters & strangers', text: 'The five character finales (Andy, Kenton, Billy, Randy, Tyrone), the 8 stranger strands, Bret\u2019s hunt and Cal\u2019s fishing challenge. Finish each strand as it appears — the finales are story-locked.' },
  { id: 3, title: 'Stage 3 — Activities & challenges', text: 'Shooting Range golds (42), drone races (14 locations), 20 different race wins, 250 stunts, 50 challenges, meditation (18 spots), arcade, bowling and the 9 activity types. Cumulative and repeatable — grind the remainder after the story.' },
  { id: 4, title: 'Stage 4 — Collectibles & the map', text: 'Card sets (3), WAiNK locations (100), 52 areas of Leonida, 100 vehicles discovered, 8 garages and 10 Scooter Bros registrations. Explore the map systematically and let the location counters fill in together.' },
  { id: 5, title: 'Stage 5 — Money & mayhem', text: 'Bank vaults (5), armored trucks, jewelry stores, illegal operations (9 gangs), the wanted-level and partnership moments, and the money goals — $250,000 laundered, $100,000 spent. Plan each robbery\u2019s escape before the entry.' },
  { id: 6, title: 'Stage 6 — Platinum', text: '100% completion (gold) unlocks the platinum. It is the sum of every other stage, so it lands last.' },
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

// Demo seed for screenshots: 13 earned, three counters part way. Used only with ?demo and only when no progress is saved yet.
export const DEMO_EARNED = [2, 3, 4, 5, 8, 10, 15, 16, 19, 21, 28, 35, 44];
export const DEMO_COUNTS = { 15: 120, 31: 40, 35: 55 };
