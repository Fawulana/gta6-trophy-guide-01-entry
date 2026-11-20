[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Fawulana/gta6-trophy-guide-01-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Fawulana/gta6-trophy-guide-01-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Platinum v3 — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver, 46 bronze.

## What v3 adds over v2

v2 had steps/difficulty/time/when on all 55 trophies, a Next-up planner, a before-the-finale tab and stage gates. v3 adds real content value on top of that:

- **Availability windows on every trophy** — when it can be earned, what closes the window, and what is lost if it closes. The Missables tab is now a windows table (trophy / available / window closes / what is lost), and the pre-finale checklist shows the same table for its 24 items.
- **Optimal platinum path** — a new tab ordering all 55 trophies into one numbered, difficulty-ordered route (story first, closing windows before open ones, easiest first inside each stage, hardest last), each step carrying its window and prerequisites. The route is computed from the data, so the same trophies always give the same path.
- **Time-to-platinum estimator** — a live number in the header (`65.4 h` on the demo seed) that updates from the trophies you tick off and the counters you log: unfinished story chapters count 6 h each, the final mission 1 h, every other trophy its own hour estimate, and a counted trophy (120 of 250 stunts) counts only the share still to do. A dedicated Time estimator tab shows the story/grind split, the sessions of 2 h, and the method.
- **Prerequisites on every trophy** — what must be true before it can be earned (reach the mission, play the strand, have your partner with you, earn Marked Bills first…), shown in the guide pane and on the platinum path, and searchable.
- **Window filter + two new orders** — filter by closing / story / any-time windows, sort by platinum-path order or closing-windows-first.

## What it is

- **Checklist tracker** — tick trophies off; progress, per-trophy PSN counters and notes are saved in the browser (localStorage, v3 key with migration from v1/v2 saves), with export to JSON and import back.
- **Filters & sort** — by kind (story, side missions, activities, collectibles, world & mayhem, money), grade, availability window, earned/remaining, missable-only, plus search across names, guides, steps, windows and prerequisites; sort by official order, platinum-path order, closing windows first, grade, hardest first, or closest to done.
- **Spoiler setting** — hides story trophy names and descriptions until they are earned.
- **Next-up planner** — the header always names the single most useful trophy to chase next (the earliest unearned step on the platinum path, with its window or prerequisite as the reason), and the empty guide pane lists the next five steps in order.
- **Roadmap to the platinum** — six stages in order, built from the official descriptions, each with its gate (the rule for when you may move on) and a live progress bar.
- **Before the finale** — a pre-finale checklist gathering all 24 story-locked and missable trophies into one do-before-the-final-mission list, with its own progress count and windows table.
- **Missables** — 24 trophies flagged from the official descriptions: one-chance moments, streaks and choices, plus 13 story-locked named missions and character finales, each with its window, its closing condition and what is lost.
- **A cited guide for every trophy** — in this entry's own words, with its sources named beside it, concrete steps, a difficulty rating (1–5, this entry's estimate), a time estimate and when to do it.

## Honesty note

The game released 19 November 2026 and this guide has not been checked in the game. Every guide is built from the official description plus the PSN progress target where PSNProfiles lists one (42 Shooting Range challenges, 14 drone-race locations, 18 meditation spots, 52 areas, 9 gangs, 8 garages, 100 vehicles, 100 WAiNK locations, 250 stunts, 50 challenges, 20 races, 3 card sets, 8 stranger strands, $250,000 marked bills, $100,000 spent, 5 bank vaults, 500 choices). Difficulty, time and hours are this entry's estimates, marked "Est." wherever they appear. Windows and prerequisites are built from the official descriptions and the guides — where a window is not pinned down by a source, the guide says so instead of inventing it. No guide text is copied from another guide, and no Rockstar logo or official artwork is used.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

Static files only — no build step, no network at run time. `?demo` seeds 13 earned trophies for a first look (only when no progress is saved yet); `?demo&spoiler` seeds the same progress with the spoiler setting on.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, stdlib only) checks the hand-in first (55 trophies, each with a guide, window, prerequisites and hour estimate; 3–4 screenshots under 256 KiB), then copies `app/` and `screenshots/` to the output dir and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`. It refuses to hand in an empty dossier, so a broken build fails loudly instead of submitting nothing.

## Layout

- `app/index.html` — shell, header with estimator, tabs, controls
- `app/css/style.css` — paper theme, estimator, window table, platinum path
- `app/js/main.js` — boot, routing, controls, progress header, estimator header
- `app/js/config.js` — roadmap stages with gates, kind/window labels, estimator constants, demo seed
- `app/js/store.js` — localStorage progress (v3 key + migration), export/import, progress summary
- `app/js/filters.js` — kind/grade/window/search filters, sorting, spoiler rule, hour formatting
- `app/js/planner.js` — platinum path, Next-up picker, time-to-platinum estimator
- `app/js/views.js` — checklist rows and the per-trophy guide pane (window box, prerequisites)
- `app/js/roadmap.js` — roadmap, platinum path, estimator panel, missables windows table, pre-finale, method
- `app/data/trophies.json` — the 55 official trophies with guides, steps, difficulty, time, when, window, prerequisites and hour estimates

MIT licensed. Built for the make.fun `gta6-trophy-guide-01` bounty.
