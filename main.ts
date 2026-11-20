// Leonida Platinum v3 — a GTA VI trophy guide and tracker (Node 22, standard
// library only).
// The guide is this directory's app/ folder: plain static files a browser opens
// at app/index.html (ES modules, CSS, no build step), offline — it loads nothing
// over the network, and its trophy list and guides are app/data/trophies.json.
// v3 adds, on every trophy, an availability window (when it can be earned and
// what closes it), its prerequisites, and an hour estimate that feeds the
// time-to-platinum estimator; the app also gains a difficulty-ordered platinum
// path through all 55 trophies and a window filter. This program hands the
// guide in: it copies app/ and screenshots/ from beside this file to /output
// and writes /output/dossier.json, the summary the judge reads (the
// screenshots, the first load's files and bytes, and the source), with the
// vendored make.fun library. Leave vendor/makefun-frontend.ts as it is: the
// scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The hand-in is a fresh directory: clear a previous run's screenshots and
// dossier first, so a stale file can never be handed in by mistake.
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Sanity-check the hand-in before the dossier is built: the trophy file must
// name all 55 official trophies with a guide, a window, prerequisites and an
// hour estimate, and there must be 3 or 4 screenshots.
const data = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf8'));
const trophies = data.trophies;
if (!Array.isArray(trophies) || trophies.length !== 55) {
  throw new Error(`expected 55 trophies, found ${Array.isArray(trophies) ? trophies.length : 'none'}`);
}
for (const t of trophies) {
  if (typeof t.name !== 'string' || !t.name) throw new Error(`trophy ${t.id} has no name`);
  if (typeof t.guide !== 'string' || !t.guide.trim()) throw new Error(`trophy ${t.name} has no guide`);
  if (typeof t.window !== 'string' || !t.window.trim()) throw new Error(`trophy ${t.name} has no availability window`);
  if (typeof t.windowCloses !== 'string' || !t.windowCloses.trim()) throw new Error(`trophy ${t.name} has no windowCloses`);
  if (!Array.isArray(t.prerequisites) || t.prerequisites.length === 0) throw new Error(`trophy ${t.name} has no prerequisites`);
  if (typeof t.hoursEst !== 'number' || t.hoursEst < 0) throw new Error(`trophy ${t.name} has no hour estimate`);
}
const shots = readdirSync(join(here, 'screenshots')).filter((f) => !f.startsWith('.'));
if (shots.length < 3 || shots.length > 4) throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
for (const shot of shots) {
  const size = statSync(join(here, 'screenshots', shot)).size;
  if (size > 262144) throw new Error(`screenshot ${shot} is ${size} bytes, over the 256 KiB cap`);
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
// The build is deterministic: the same app/ and screenshots/ always produce the same dossier.json bytes.
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

// A hand-in with an empty or unreadable dossier is a broken build: fail loudly
// here instead of letting the grader discover it.
if (statSync(dossierPath).size === 0) throw new Error('dossier.json is empty');
const dossier = JSON.parse(readFileSync(dossierPath, 'utf8'));
console.log(`handed in ${out}: ${trophies.length} trophies, ${shots.length} screenshots, dossier.json ${statSync(dossierPath).size} bytes`);
