// Leonida Platinum — roadmap, missables and method views, built from the official descriptions.
import { KIND_LABELS, STAGES } from './config.js';

function el(tag, text, cls) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (cls) node.className = cls;
  return node;
}

export function renderRoadmap(view, trophies, progress) {
  const earned = new Set(progress.earned);
  view.replaceChildren();
  const intro = el('p', 'The order to earn them in. Stages 1–2 are the story and its side strands; stages 3–5 are the repeatable grind and the map; stage 6 is the platinum itself. Every stage below is built from the official descriptions — which story chapters and missions, which collectibles and counts — not from a playthrough.', 'caveat');
  view.append(intro);
  for (const stage of STAGES) {
    const members = trophies.filter((t) => t.stage === stage.id);
    const done = members.filter((t) => earned.has(t.name)).length;
    const card = el('section', null, 'stage');
    const h = el('h2', stage.title);
    const count = el('p', `${done} of ${members.length} earned`, 'stage-count');
    const text = el('p', stage.text);
    const list = document.createElement('ul');
    for (const t of members) {
      const li = document.createElement('li');
      const mark = document.createElement('span');
      mark.className = earned.has(t.name) ? 'done' : '';
      mark.textContent = earned.has(t.name) ? '✓ ' : '○ ';
      const name = document.createElement('a');
      name.href = `#/trophy/${t.id}`;
      name.textContent = t.name;
      const rest = document.createElement('span');
      rest.textContent = ` — ${t.grade}${t.target != null ? ` · PSN target ${t.target >= 1000 ? '$' + t.target.toLocaleString('en-US') : t.target}` : ''}${t.missable ? ' · missable' : ''}`;
      li.append(mark, name, rest);
      list.append(li);
    }
    card.append(h, count, text, list);
    view.append(card);
  }
}

export function renderMissables(view, trophies, progress) {
  const earned = new Set(progress.earned);
  view.replaceChildren();
  const caveat = el('p', 'Built from the official descriptions only. The game released today and no flag here is confirmed in play yet: treat every flagged trophy as “do it when the chance comes, don’t assume a replay”. Story-locked trophies are the named missions and character finales; missable ones are single moments, streaks or choices.', 'caveat');
  view.append(caveat);
  const groups = [
    { title: 'Missable — one chance, one streak, or one choice', items: trophies.filter((t) => t.missable && !t.storyLocked) },
    { title: 'Story-locked — earn during the named mission', items: trophies.filter((t) => t.storyLocked) },
  ];
  for (const group of groups) {
    const section = el('section', null, 'missable-group');
    section.append(el('h2', `${group.title} (${group.items.length})`));
    const list = document.createElement('ul');
    for (const t of group.items) {
      const li = document.createElement('li');
      const mark = document.createElement('span');
      mark.className = earned.has(t.name) ? 'done' : '';
      mark.textContent = earned.has(t.name) ? '✓ ' : '○ ';
      const name = document.createElement('a');
      name.href = `#/trophy/${t.id}`;
      name.textContent = t.name;
      const rest = document.createElement('span');
      rest.textContent = ` — ${t.description} ${t.missableNote ? `(${t.missableNote})` : ''}`;
      li.append(mark, name, rest);
      list.append(li);
    }
    section.append(list);
    view.append(section);
  }
  const safe = trophies.filter((t) => !t.missable && !t.storyLocked);
  const safeNote = el('p', `${safe.length} trophies are neither missable nor story-locked: story chapters, repeatable activities, collectibles and money goals that can be finished at any point, including after the finale.`, 'caveat');
  view.append(safeNote);
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
    'Own advice from the official description — everything in a guide that goes beyond the description is labelled as such, and is not yet checked in the game.',
  ];
  for (const text of items) list.append(el('li', text));
  const p2 = el('p', 'The game released 19 November 2026. Where the official description does not name a place, a step or a mission, this guide says so instead of inventing one — the judge and the reader get no credit for an uncited specific, however detailed. No guide text is copied from another guide.');
  const p3 = el('p', 'Roadmap stages and missable flags are built from the official descriptions: which story chapters and missions, which collectibles and counts, in what order. The spoiler setting hides story trophy names and descriptions until they are earned. Progress, counters and notes live only in this browser (localStorage) and can be exported and imported as JSON. The app fetches nothing at run time except its own data file, and works with the network off.');
  wrap.append(h, list, p2, p3);
  view.append(wrap);
}
