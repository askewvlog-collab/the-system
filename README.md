# The System | Fitness Tracker

A free, offline fitness quest game. You get daily quests, earn XP, climb ranks (EE to S), clear weekly gates, and win rare keys to special gates. A cold, formal "System" keeps score. It never judges you: easy quests keep your streak alive, and rank floors stop you from falling far.

- **Offline and private.** One static page. No accounts, servers, analytics, ads or network calls. Progress lives in your browser's local storage; export and import it as text from the Setup tab.
- **Honor system.** Nothing is verified. It is a motivating game, not a tracker.
- **Safe to try.** Stop if anything hurts. Every exercise has an info panel with form cues and an easier variation.

## How it was made

The System is a **vibe-managed creation**: one person with an idea and a lot of taste-testing, building alongside an AI pair-programmer. The concept, the rules and the voice are human. The code, the stick-figure exercise diagrams and the gate animations were written in conversation, drawn in code, and checked by playing the thing.

That is also why some parts are honest placeholders. The icon and the visual identity are a first pass, drawn programmatically. If the project grows, the plan is to bring in real artists for the icon, the branding and the gate art. Until then it stays small, dark and fully original: no borrowed art, no accounts, no tracking.

## Features

Daily quests (easy / medium / hard, sized per exercise) with a weekly habit, rest tokens, rank floors, a Friday-to-Sunday weekly gate with a reward wheel, co-op gates with a friend's code, special keys and compound special gates, prestige stars, weekly and monthly summaries, and a first-open tutorial. Gate entry and clear sequences are drawn in code.

## Roadmap

An Android version (APK) is planned, so it can run as an installed app. It is not available yet. It will stay offline with no accounts or tracking. Health Connect step bonuses, classes and friend comparison are ideas for later.

## Use it

Open `index.html` in a browser, or host the folder (for example on GitHub Pages). Nothing else is needed.

**Install on your phone (PWA).** Open the hosted page in Chrome on Android (or Safari on iPhone), then choose "Install app" / "Add to Home Screen". It then runs fullscreen and works offline. Your progress is stored on that device, so use Setup, Backup to export a copy now and then.

## Develop

Source lives in `src/`, one folder per feature (`core`, `ranks`, `quests`, `gates`, `prestige`, `summaries`, `tutorial`, `exercises`, `ui`). Requires only Python 3.

```bash
python3 build.py        # writes index.html (standalone) and tests/runner.html
```

Open `tests/runner.html` in a browser to run the regression tests; the result appears on the page.
To change the secret-rank key, run `python3 tools/hashkey.py NEWWORD` and paste the number into `SECRET_HASH` in `src/prestige/secret.js`.

## License

GPL-3.0-or-later. Copyright (C) 2026 ASKEW. See `LICENSE`. Forks and redistributions must stay open source under the same license.
