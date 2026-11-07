# DUEL//DIVE

A mobile-friendly 2D monster-card roguelike prototype inspired by the era of classic duel card games.

## Run locally

This is a dependency-free browser game and installable progressive web app. From the repository root:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

On a supported mobile browser, use the install prompt in the top-right or the browser's "Add to Home Screen" action. The app shell is cached for offline play after the first visit.

## Included in this prototype

- Branching run map with battles, elite encounters, events, a shop, and a final core duel
- Energy-based card combat with monsters, spells, traps, shields, healing, draw effects, and enemy intents
- Master Format-inspired duels with 8000 LP, Normal Summons, tribute requirements, monster zones, Battle Phase, and turn phases
- 200-wave draft gauntlet with three-card picks after every clear, escalating difficulty, bosses every 10 waves, randomized protagonist/villain milestones, and a fixed Zarc final boss
- Character-select opening with automatically unlocked series leads, persistent unlocks for completed runs, and four curated 10-card starter packs based on the selected character
- Deck viewer, card rewards, gold, relics, and restartable runs
- Anime vault with Orichalcos cards and selected anime-exclusive monsters, spells, traps, and Synchros
- Bundled 14,616-card JSON catalog with searchable TCG/OCG, anime, token, and skill records
- Responsive layout for desktop and mobile screens

The bundled catalog is normalized from [YGOJSON](https://github.com/iconmaster5326/YGOJSON) release v1 and is used as card metadata/search data plus the roguelike reward pool. Imported cards use a safe gameplay fallback effect; the smaller hand-authored cards retain their custom roguelike effects. The current card art is intentionally represented with original geometric symbols and color treatments so the project remains self-contained.
