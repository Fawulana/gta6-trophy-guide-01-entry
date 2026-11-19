[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Fawulana/gta6-trophy-guide-01-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Fawulana/gta6-trophy-guide-01-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Platinum — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver, 46 bronze.

## What it is

- **Checklist tracker** — tick trophies off; progress, per-trophy PSN counters and notes are saved in the browser (localStorage), with export to JSON and import back.
- **Filters** — by kind (story, side missions, activities, collectibles, world & mayhem, money), grade, earned/remaining, missable-only, plus search.
- **Spoiler setting** — hides story trophy names and descriptions until they are earned.
- **Roadmap to the platinum** — six stages in order, built from the official descriptions: story, side characters, activities, collectibles, money & mayhem, then 100% completion.
- **Missables** — 24 trophies flagged from the official descriptions: one-chance moments, streaks and choices, plus 13 story-locked named missions and character finales, each with its reason.
- **A cited guide for every trophy** — in this entry's own words, with its sources named beside it.

## Honesty note

The game released 19 November 2026 and this guide has not been checked in the game. Every guide is built from the official description plus the PSN progress target where PSNProfiles lists one (42 Shooting Range challenges, 14 drone-race locations, 18 meditation spots, 52 areas, 9 gangs, 8 garages, 100 vehicles, 100 WAiNK locations, 250 stunts, 50 challenges, 20 races, 3 card sets, 8 stranger strands, $250,000 marked bills, $100,000 spent, 5 bank vaults, 500 choices). Where a place or step is not pinned down by a source, the guide says so instead of inventing it. No guide text is copied from another guide, and no Rockstar logo or official artwork is used.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

Static files only — no build step, no network at run time. `?demo` seeds 13 earned trophies for a first look (only when no progress is saved yet).

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to the output dir and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`.

## Layout

- `app/index.html` — shell, header, tabs, controls
- `app/css/style.css` — paper theme
- `app/js/main.js` — boot, routing, controls, progress header
- `app/js/config.js` — roadmap stages, kind labels, demo seed
- `app/js/store.js` — localStorage progress, export/import
- `app/js/filters.js` — kind/grade/search filters and the spoiler rule
- `app/js/views.js` — checklist rows and the per-trophy guide pane
- `app/js/roadmap.js` — roadmap, missables and method views
- `app/data/trophies.json` — the 55 official trophies with guides

MIT licensed. Built for the make.fun `gta6-trophy-guide-01` bounty.
