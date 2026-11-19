// Leonida Platinum — checklist rows and the per-trophy guide pane.
import { KIND_LABELS } from './config.js';
import { formatTarget, isSpoilerHidden } from './filters.js';
import { setCount, setEarned, setNote } from './store.js';

function pill(text, cls) {
  const span = document.createElement('span');
  span.className = `pill ${cls || ''}`.trim();
  span.textContent = text;
  return span;
}

function gradePill(grade) {
  return pill(grade, grade);
}

export function renderChecklist(view, trophies, state) {
  const { filters, progress, selectedId } = state;
  const earned = new Set(progress.earned);
  view.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!state.matches(t)) continue;
    shown += 1;
    const hidden = isSpoilerHidden(t, filters.spoilersOn, earned);
    const row = document.createElement('article');
    row.className = 'trophy-row' + (earned.has(t.name) ? ' earned' : '') + (selectedId === t.id ? ' selected' : '');
    row.dataset.id = String(t.id);
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('change', () => {
      setEarned(progress, t.name, box.checked);
      state.onChange();
    });
    box.addEventListener('click', (e) => e.stopPropagation());
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    if (hidden) {
      const span = document.createElement('span');
      span.className = 'hidden-name';
      span.textContent = 'Hidden story trophy — earn it to reveal';
      name.append(span);
    } else {
      name.textContent = t.name;
    }
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'Spoilers hidden. Tick it off when you earn it in the story.' : t.description;
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.append(gradePill(t.grade));
    if ((KIND_LABELS[t.kind] || t.kind).toLowerCase() !== t.grade) meta.append(pill(KIND_LABELS[t.kind] || t.kind, 'kind'));
    if (t.missable) meta.append(pill('Missable', 'missable'));
    if (t.storyLocked) meta.append(pill('Story-locked', 'story-locked'));
    body.append(name, desc, meta);
    if (t.target != null && !hidden) {
      const count = progress.counts[String(t.id)] || 0;
      const line = document.createElement('div');
      line.className = 'counter-line';
      line.textContent = `PSN progress: ${formatTarget(t, count)}`;
      body.append(line);
    }
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'quiet';
    open.textContent = 'Guide';
    open.addEventListener('click', (e) => {
      e.stopPropagation();
      location.hash = `#/trophy/${t.id}`;
    });
    row.append(box, body, open);
    row.addEventListener('click', () => {
      location.hash = `#/trophy/${t.id}`;
    });
    view.append(row);
  }
  return shown;
}

export function renderDetail(pane, trophies, state) {
  const { progress, selectedId } = state;
  const earned = new Set(progress.earned);
  pane.replaceChildren();
  const card = document.createElement('div');
  card.className = 'detail-card';
  const t = trophies.find((x) => x.id === selectedId);
  if (!t) {
    card.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'detail-empty';
    const h = document.createElement('h2');
    h.textContent = 'Pick a trophy';
    const p = document.createElement('p');
    p.textContent = 'Select any trophy in the checklist to read its guide, its sources, and when it can be missed. The guide pane stays beside the list while you work through the roadmap.';
    const p2 = document.createElement('p');
    p2.textContent = 'Every guide cites its sources. A specific place or step with no source behind it is flagged as not yet checked in the game — the guide never invents one.';
    empty.append(h, p, p2);
    card.append(empty);
    pane.append(card);
    return;
  }
  const isEarned = earned.has(t.name);
  const hidden = isSpoilerHidden(t, state.filters.spoilersOn, earned);
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  meta.append(gradePill(t.grade));
  if ((KIND_LABELS[t.kind] || t.kind).toLowerCase() !== t.grade) meta.append(pill(KIND_LABELS[t.kind] || t.kind, 'kind'));
  if (t.missable) meta.append(pill('Missable', 'missable'));
  if (t.storyLocked) meta.append(pill('Story-locked', 'story-locked'));
  const title = document.createElement('h2');
  title.textContent = hidden ? 'Hidden story trophy' : t.name;
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden ? 'Spoilers hidden — earn it in the story to reveal its name and description.' : `“${t.description}” — official description, PlayStation.`;
  card.append(meta, title, official);
  if (t.missable && t.missableNote) {
    const warn = document.createElement('div');
    warn.className = 'missable-warning';
    warn.textContent = `Missable: ${t.missableNote}`;
    card.append(warn);
  }
  if (!hidden) {
    const guideH = document.createElement('h3');
    guideH.textContent = 'Guide';
    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = t.guide;
    card.append(guideH, guide);
    const srcH = document.createElement('h3');
    srcH.textContent = 'Sources';
    const list = document.createElement('ul');
    for (const s of t.sources || []) {
      const li = document.createElement('li');
      li.textContent = s;
      list.append(li);
    }
    card.append(srcH, list);
  }
  if (t.target != null) {
    const countH = document.createElement('h3');
    countH.textContent = 'Your progress';
    const row = document.createElement('div');
    row.className = 'counter-row';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = String(t.target);
    input.value = String(progress.counts[String(t.id)] || 0);
    input.setAttribute('aria-label', `Progress towards ${t.target}`);
    input.addEventListener('change', () => {
      const n = setCount(progress, t.id, input.value, t.target);
      input.value = String(n);
      state.onChange(true);
    });
    const label = document.createElement('span');
    label.textContent = `of ${t.target >= 1000 ? '$' + t.target.toLocaleString('en-US') : t.target} (PSN progress target)`;
    row.append(input, label);
    card.append(countH, row);
  }
  const noteH = document.createElement('h3');
  noteH.textContent = 'Your note';
  const note = document.createElement('textarea');
  note.className = 'note-box';
  note.placeholder = 'Where you found it, what worked… (saved in this browser)';
  note.value = progress.notes[String(t.id)] || '';
  note.addEventListener('change', () => setNote(progress, t.id, note.value));
  card.append(noteH, note);
  const nav = document.createElement('div');
  nav.className = 'detail-nav';
  const idx = trophies.findIndex((x) => x.id === t.id);
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.textContent = '← Previous';
  prev.disabled = idx <= 0;
  prev.addEventListener('click', () => { location.hash = `#/trophy/${trophies[idx - 1].id}`; });
  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = 'Next →';
  next.disabled = idx >= trophies.length - 1;
  next.addEventListener('click', () => { location.hash = `#/trophy/${trophies[idx + 1].id}`; });
  const earnedBtn = document.createElement('button');
  earnedBtn.type = 'button';
  earnedBtn.textContent = isEarned ? '✓ Earned — untick' : 'Mark earned';
  earnedBtn.addEventListener('click', () => {
    setEarned(progress, t.name, !isEarned);
    state.onChange();
  });
  nav.append(prev, earnedBtn, next);
  card.append(nav);
  pane.append(card);
}
