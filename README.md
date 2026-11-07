# DUEL//DIVE

A mobile-friendly 2D monster-card roguelike prototype inspired by the era of classic duel card games.

## Run locally

This is a dependency-free browser game and installable progressive web app. From the repository root:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

On a supported mobile browser, use the install prompt in the top-right or the browser's "Add to Home Screen" action. The app shell is cached for offline play after the first visit.

## Package as a native mobile app

The same app can be packaged for Android or iOS with Capacitor:

```bash
npm install
npx cap add android
npx cap add ios
npm run mobile:sync
```

Open the generated native project with `npm run mobile:android` or `npm run mobile:ios`. The PWA remains the browser install path, while Capacitor provides native app projects from the same repository code. `npm run mobile:sync` builds the web bundle into `dist/` and copies it into the native projects, so gameplay changes—including LP persistence, mini-boss healing, shops, and item effects—are shared with mobile.

## Included in this prototype

- 200-wave run map with battles, elite encounters, events, a post-duel shop, and a final core duel
- Energy-based card combat with monsters, spells, traps, shields, healing, draw effects, and enemy intents
- Master Format-inspired duels with 8000 LP, Normal Summons, tribute requirements, monster zones, Battle Phase, and turn phases
- 200-wave draft gauntlet with three-card picks after every clear, escalating difficulty, bosses every 10 waves, randomized protagonist/villain milestones, and a fixed Zarc final boss
- Character-select opening with automatically unlocked series leads, persistent unlocks for completed runs, and four curated 10-card starter packs based on the selected character
- Card rewards, real-world booster-pack entries, guaranteed character packs, healing, consumables, permanent relic buffs, and gold
- Five local save slots with mid-duel snapshots, plus mini-boss victories that restore the player's duel LP to 8000
- Anime vault with Orichalcos cards and selected anime-exclusive monsters, spells, traps, and Synchros
- Bundled 14,616-card JSON catalog with searchable TCG/OCG, anime, token, and skill records
- Responsive layout for desktop and mobile screens

The bundled catalog is normalized from [YGOJSON](https://github.com/iconmaster5326/YGOJSON) release v1 and is used as card metadata/search data plus the roguelike reward pool. Imported cards use a safe gameplay fallback effect; the smaller hand-authored cards retain their custom roguelike effects. The current card art is intentionally represented with original geometric symbols and color treatments so the project remains self-contained.

## Android app

The Android deliverable is a native APK, not an HTML download. Install dependencies, configure an Android SDK and a supported JDK (17 or 21), then run:

```bash
npm run mobile:build
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. It bundles the game assets and runs offline; copy that single APK file to an Android phone to install it. `npm run mobile:sync` updates the native bundle without building.
