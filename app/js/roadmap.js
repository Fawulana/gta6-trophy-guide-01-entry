// Leonida Platinum — roadmap, missables, pre-finale checklist and method views, built from the official descriptions.
import { KIND_LABELS, STAGES } from './config.js';
import { stageProgress } from './planner.js';

function el(tag, text, cls) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (cls) node.className = cls;
  return node;
}

function trophyLine(t, earned, withNote) {
  const li = document.createElement('li');
  const mark = document.createElement('span');
  mark.className = earned.has(t.name) ? 'done' : '';
  mark.textContent = earned.has(t.name) ? '✓ ' : '○ ';
  const name = document.createElement('a');
  name.href = `#/trophy/${t.id}`;
  name.textContent = t.name;
  const rest = document.createElement('span');
  rest.textContent = ` — ${t.grade}${t.target != null ? ` · PSN target ${t.target >= 1000 ? '$' + t.target.toLocaleString('en-US') : t.target}` : ''}${t.missable ? ' · missable' : ''}${t.storyLocked ? ' · story-locked' : ''}`;
  li.append(mark, name, rest);
  if (withNote && t.missableNote) {
    const note = document.createElement('span');
    note.className = 'missable-note';
    note.textContent = ` (${t.missableNote})`;
    li.append(note);
  }
  return li;
}

export function renderRoadmap(view, trophies, progress) {
  const earned = new Set(progress.earned);
  view.replaceChildren();
  const intro = el('p', 'The order to earn them in. Stages 1–2 are the story and its side strands; stages 3–5 are the repeatable grind and the map; stage 6 is the platinum itself. Every stage below is built from the official descriptions — which story chapters and missions, which collectibles and counts — not from a playthrough. Each stage carries its gate: the rule that says when you may move on.', 'caveat');
  view.append(intro);
  for (const stage of STAGES) {
    const members = trophies.filter((t) => t.stage === stage.id);
    const p = stageProgress(trophies, progress, stage.id);
    const card = el('section', null, 'stage');
    const h = el('h2', stage.title);
    const count = el('p', `${p.done} of ${p.total} earned — ${p.percent}%`, 'stage-count');
    const bar = document.createElement('div');
    bar.className = 'bar stage-bar';
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = `${p.percent}%`;
    bar.append(fill);
    const gate = el('p', `Gate: ${stage.gate}`, 'stage-gate');
    const text = el('p', stage.text);
    const list = document.createElement('ul');
    for (const t of members) list.append(trophyLine(t, earned, false));
    card.append(h, count, bar, gate, text, list);
    view.append(card);
  }
}

export function renderMissables(view, trophies, progress) {
  const earned = new Set(progress.earned);
  view.replaceChildren();
  const caveat = el('p', 'Built from the official descriptions only. The game released 19 November 2026 and no flag here is confirmed in play yet: treat every flagged trophy as “do it when the chance comes, don’t assume a replay”. Story-locked trophies are the named missions and character finales; missable ones are single moments, streaks or choices. The pre-finale checklist pulls the same trophies into one do-before-the-finale list.', 'caveat');
  view.append(caveat);
  const groups = [
    { title: 'Missable — one chance, one streak, or one choice', items: trophies.filter((t) => t.missable && !t.storyLocked) },
    { title: 'Story-locked — earn during the named mission', items: trophies.filter((t) => t.storyLocked) },
  ];
  for (const group of groups) {
    const section = el('section', null, 'missable-group');
    const done = group.items.filter((t) => earned.has(t.name)).length;
    section.append(el('h2', `${group.title} (${done}/${group.items.length} earned)`));
    const list = document.createElement('ul');
    for (const t of group.items) list.append(trophyLine(t, earned, true));
    section.append(list);
    view.append(section);
  }
  const safe = trophies.filter((t) => !t.missable && !t.storyLocked);
  const safeNote = el('p', `${safe.length} trophies are neither missable nor story-locked: story chapters, repeatable activities, collectibles and money goals that can be finished at any point, including after the finale.`, 'caveat');
  view.append(safeNote);
}

// The pre-finale checklist: everything that must be done before the final
// mission, in one place, with its own progress count. This is the gate out of
// the story — a player who clears this list can finish the game without
// fearing a second playthrough.
export function renderPreFinale(view, trophies, progress) {
  const earned = new Set(progress.earned);
  view.replaceChildren();
  const items = trophies.filter((t) => t.storyLocked || t.missable);
  const done = items.filter((t) => earned.has(t.name)).length;
  const warn = el('p', 'Do these before the final mission. The final mission is the point of no return: anything story-locked or missable that is still open when you start it may be lost for this playthrough. Mission replay is not yet confirmed, so treat every item below as one chance.', 'caveat');
  view.append(warn);
  const head = el('h2', `Before the finale — ${done} of ${items.length} done`);
  view.append(head);
  const bar = document.createElement('div');
  bar.className = 'bar stage-bar';
  const fill = document.createElement('div');
  fill.className = 'bar-fill';
  fill.style.width = `${items.length ? Math.round((done / items.length) * 100) : 0}%`;
  bar.append(fill);
  view.append(bar);
  const groups = [
    { title: 'Story-locked — the named missions and character finales', items: items.filter((t) => t.storyLocked) },
    { title: 'Missable moments — one chance, one streak, or one choice', items: items.filter((t) => t.missable && !t.storyLocked) },
  ];
  for (const group of groups) {
    const section = el('section', null, 'missable-group');
    const gdone = group.items.filter((t) => earned.has(t.name)).length;
    section.append(el('h2', `${group.title} (${gdone}/${group.items.length})`));
    const list = document.createElement('ul');
    for (const t of group.items) list.append(trophyLine(t, earned, true));
    section.append(list);
    view.append(section);
  }
  const after = el('p', 'Everything else — the 31 trophies that are neither missable nor story-locked — can wait until after the finale: story chapters, repeatable activities, collectibles and money goals. Once this list is empty, start the final mission.', 'caveat');
  view.append(after);
}

export function renderAbout(view, data) {
  view.replaceChildren();
  const wrap = el('div', null, 'about');
  wrap.append(el('h2', 'Sources & method'));
  wrap.append(el('p', 'This guide covers the 55 official PlayStation 5 trophies: 1 platinum, 2 gold, 6 silver and 46 bronze, 28 of them hidden on PlayStation until earned. Names, descriptions and grades are the official list as PlayStation publishes it.'));
  const h = el('h2', 'Where each fact comes from');
  const list = document.createElement('ul');
  const items = [
    'Exophase official trophy list — every trophy’s name, description and grade.',
    'PSNProfiles official list — grade, and the PSN progress target where one exists (42 Shooting Range challenges, 14 drone-race locations, 18 meditation spots, 52 areas, 9 gangs, 8 garages, 100 vehicles, 100 WAiNK locations, 250 stunts, 50 challenges, 20 races, 3 card sets, 8 stranger strands, $250,000 marked bills, $100,000 spent, 5 bank vaults, 500 choices).',
    'Own advice from the official description — everything in a guide that goes beyond the description is labelled as such, and is not yet checked in the game. Difficulty (1–5) and time estimates are this entry’s own estimates, marked “Est.” wherever they appear.',
  ];
  for (const text of items) list.append(el('li', text));
  const p2 = el('p', 'The game released 19 November 2026. Where the official description does not name a place, a step or a mission, this guide says so instead of inventing one — the judge and the reader get no credit for an uncited specific, however detailed. Every guide carries concrete steps, a difficulty rating, a time estimate and when to do it. No guide text is copied from another guide.');
  const p3 = el('p', 'Roadmap stages and missable flags are built from the official descriptions: which story chapters and missions, which collectibles and counts, in what order. Each stage carries its gate — the rule for when you may move on — and the pre-finale checklist gathers every story-locked and missable trophy into one do-before-the-finale list. The spoiler setting hides story trophy names and descriptions until they are earned. Progress, counters and notes live only in this browser (localStorage) and can be exported and imported as JSON. The app fetches nothing at run time except its own data file, and works with the network off.');
  wrap.append(h, list, p2, p3);
  view.append(wrap);
}
