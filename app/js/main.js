// Leonida Platinum — boot, routing, controls and the progress header.
import { DEMO_COUNTS, DEMO_EARNED, GRADE_ORDER } from './config.js';
import { trophyMatches } from './filters.js';
import { nextUpTrophy } from './planner.js';
import { renderAbout, renderMissables, renderPreFinale, renderRoadmap } from './roadmap.js';
import { exportProgress, loadProgress, parseImported, progressSummary, saveProgress } from './store.js';
import { renderChecklist, renderDetail } from './views.js';

const viewEl = document.getElementById('view');
const detailEl = document.getElementById('detailPane');
const resultEl = document.getElementById('resultCount');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kindFilter');
const gradeEl = document.getElementById('gradeFilter');
const earnedEl = document.getElementById('earnedFilter');
const orderEl = document.getElementById('orderFilter');
const missableEl = document.getElementById('missableOnly');
const spoilerEl = document.getElementById('spoilerToggle');
const spoilerNote = document.getElementById('spoilerNote');

const progress = loadProgress();
const params = new URLSearchParams(location.search);

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
if (params.has('demo') && progress.earned.length === 0) {
  progress.earned = DEMO_EARNED.map((id) => byId.get(id)?.name).filter(Boolean);
  progress.counts = { ...DEMO_COUNTS };
  saveProgress(progress);
}

const state = {
  filters: { search: '', kind: 'all', grade: 'all', earned: 'all', order: 'official', missableOnly: false, spoilersOn: false },
  progress,
  selectedId: null,
  matches(t) {
    return trophyMatches(t, this.filters, new Set(this.progress.earned));
  },
  onChange(keepDetail) {
    renderAll(keepDetail);
  },
};

function currentView() {
  const hash = location.hash || '#/';
  const trophy = hash.match(/^#\/trophy\/(\d+)$/);
  if (trophy) return { name: 'checklist', selectedId: Number(trophy[1]) };
  if (hash === '#/roadmap') return { name: 'roadmap', selectedId: null };
  if (hash === '#/missables') return { name: 'missables', selectedId: null };
  if (hash === '#/prefinale') return { name: 'prefinale', selectedId: null };
  if (hash === '#/about') return { name: 'about', selectedId: null };
  return { name: 'checklist', selectedId: null };
}

function renderHeader() {
  const summary = progressSummary(progress, trophies);
  document.getElementById('earnedCount').textContent = String(summary.earned);
  document.getElementById('barFill').style.width = `${summary.percent}%`;
  const counts = GRADE_ORDER.map((g) => {
    const s = summary.byGrade[g] || { got: 0, total: 0 };
    return `${g} ${s.got}/${s.total}`;
  }).join(' · ');
  document.getElementById('gradeCounts').textContent = counts;
  const left = summary.total - summary.earned;
  document.getElementById('platinumNote').textContent = summary.earned === summary.total
    ? 'Platinum earned — Leonida Legend.'
    : `${left} to go — ${summary.percent}% complete.`;
  const next = nextUpTrophy(trophies, progress);
  const nextEl = document.getElementById('nextUp');
  if (next) {
    nextEl.innerHTML = '';
    const label = document.createElement('strong');
    label.textContent = 'Next up: ';
    const link = document.createElement('a');
    link.href = `#/trophy/${next.trophy.id}`;
    link.textContent = next.trophy.name;
    const why = document.createElement('span');
    why.textContent = ` — ${next.reason}`;
    nextEl.append(label, link, why);
  } else {
    nextEl.textContent = 'Every trophy earned — Leonida Legend.';
  }
  spoilerNote.hidden = !state.filters.spoilersOn;
}

function renderAll(keepDetail) {
  const route = currentView();
  state.selectedId = route.selectedId;
  for (const a of document.querySelectorAll('.tabs a')) {
    a.classList.toggle('active', a.dataset.view === route.name || (route.name === 'checklist' && a.dataset.view === 'checklist'));
  }
  renderHeader();
  document.querySelector('.layout').classList.toggle('no-detail', route.name !== 'checklist');
  if (route.name === 'roadmap') {
    resultEl.textContent = '';
    renderRoadmap(viewEl, trophies, progress);
  } else if (route.name === 'missables') {
    resultEl.textContent = '';
    renderMissables(viewEl, trophies, progress);
  } else if (route.name === 'prefinale') {
    resultEl.textContent = '';
    renderPreFinale(viewEl, trophies, progress);
  } else if (route.name === 'about') {
    resultEl.textContent = '';
    renderAbout(viewEl, doc);
  } else {
    const shown = renderChecklist(viewEl, trophies, state);
    resultEl.textContent = `Showing ${shown} of ${trophies.length} trophies · ${progress.earned.length} earned · order: ${state.filters.order}`;
  }
  renderDetail(detailEl, trophies, state);
}

function readControls() {
  state.filters.search = searchEl.value.trim();
  state.filters.kind = kindEl.value;
  state.filters.grade = gradeEl.value;
  state.filters.earned = earnedEl.value;
  state.filters.order = orderEl.value;
  state.filters.missableOnly = missableEl.checked;
  state.filters.spoilersOn = spoilerEl.checked;
}

for (const [el, event] of [[searchEl, 'input'], [kindEl, 'change'], [gradeEl, 'change'], [earnedEl, 'change'], [orderEl, 'change'], [missableEl, 'change'], [spoilerEl, 'change']]) {
  el.addEventListener(event, () => { readControls(); renderAll(); });
}

document.getElementById('exportBtn').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([exportProgress(progress)], { type: 'application/json' }));
  a.download = 'leonida-platinum-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const next = parseImported(await file.text());
    progress.earned = next.earned;
    progress.counts = next.counts;
    progress.notes = next.notes;
    saveProgress(progress);
    renderAll();
  } catch {
    alert('That file is not a Leonida Platinum progress export.');
  }
  e.target.value = '';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks, counters and notes in this browser?')) return;
  progress.earned = [];
  progress.counts = {};
  progress.notes = {};
  saveProgress(progress);
  renderAll();
});

window.addEventListener('hashchange', () => renderAll());
if (params.has('spoiler')) {
  spoilerEl.checked = true;
  readControls();
}
renderAll();
