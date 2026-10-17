# The System | Fitness Tracker

**Play it: https://askewvlog-collab.github.io/the-system/**

A free, offline fitness quest game. You get daily quests, earn XP, climb ranks (EE to S), clear weekly gates, and win rare keys to special gates. A cold, formal "System" keeps score. It never judges you: easy quests keep your streak alive, and rank floors stop you from falling far.

## Install on your phone

Open the link above in Chrome on Android (or Safari on iPhone) and choose **Install app** / **Add to Home Screen**. It runs fullscreen and works offline. On a computer, just open the link, or download `index.html` and open it.

Your progress is stored on that device. Use Setup, Backup to export a copy now and then.

## Privacy

- No accounts, no analytics, no ads, and your data never leaves your device.
- The only network traffic is loading the app itself (the page and its icons). A service worker keeps a copy so it works offline.
- Nothing is verified. It is an honor-system game, not a medical or coaching tool. Stop if anything hurts; every exercise has an info panel with form cues and an easier variation.

## What is in it

Daily quests (easy / medium / hard, sized per exercise) with a weekly habit, rest tokens, rank floors, a Friday-to-Sunday weekly gate with a reward wheel, co-op gates with a friend's code, special keys and compound special gates, prestige stars, weekly and monthly summaries, and a first-open tutorial. Gate entry and clear sequences are drawn in code.

## How it was made

Built by one person and an AI pair-programmer. The concept, the rules and the voice are human. The code, the stick-figure exercise diagrams and the gate animations were written in conversation, drawn in code, and checked by playing the thing.

Some parts are honest first passes. The icon and visual identity are drawn programmatically, and if the project grows the plan is to bring in real artists for the icon, branding and gate art. Until then it stays small, dark and fully original: no borrowed art, no accounts, no tracking.

## Roadmap

An Android version (APK) is planned, so it can run as an installed app. It is not available yet and will stay offline with no accounts or tracking. Ideas for later: recording real workouts (sets, reps, loads) separately from XP, Health Connect step bonuses, classes, friend comparison.

## Develop

`index.html` is **generated**. Edit the files in `src/` (one folder per feature: `core`, `ranks`, `quests`, `gates`, `prestige`, `summaries`, `tutorial`, `exercises`, `ui`) and rebuild. Requires only Python 3.

```bash
python3 build.py        # writes index.html, sw.js and tests/runner.html
```

Open `tests/runner.html` in a browser to run the regression tests (the result appears on the page); they should pass before you contribute. See [CONTRIBUTING.md](CONTRIBUTING.md).

To change the secret-rank key, run `python3 tools/hashkey.py NEWWORD` and paste the number into `SECRET_HASH` in `src/prestige/secret.js`.

## License

GPL-3.0-or-later. Copyright (C) 2026 ASKEW. Chosen on purpose so derivatives stay open source: forks and redistributions must use the same license. See `LICENSE`.
