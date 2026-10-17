# The System – instructions for Claude Code

Read `PROJECT_HANDOFF.md` and inspect `gate.html` before editing. This is a single-file, offline, no-server fitness quest game. Do not rewrite it from scratch. Preserve working mechanics, the purple/black/ice-blue look, and the cold, formal, military System voice. Never add accounts, servers, API keys, analytics, network calls, or proof-of-work.

## Working rules
- Work in small phases. After each phase: run it, test the affected state changes, commit with a clear message, and report what changed, what was tested, remaining risks, and decisions that need the owner.
- Report confirmed bugs separately from proposed improvements.
- Keep saves safe: migrate old saves (v1 → latest), validate imports before touching current state, never overwrite a good save with a bad import.
- Keep one source of truth for XP/reward math so shown rewards equal awarded rewards. No double claims.
- Be token-efficient: read only the parts of files you need, edit instead of rewriting, and don't re-read unchanged files.

## Phase 1 – Core fairness (do first)
1. **Rank floors:** a reached rank becomes a floor; XP can drop but not below the floor. Only S can fall, and only to A.
2. **Missed-day cap:** after an absence, apply at most one ordinary missed-day penalty per return.
3. **Gate rules:** needs 5 cleared quest days in Mon–Sun (easy counts; rest days don't), rank D+. Gate opens Friday 18:00 local, expires Sunday midnight. Show eligibility, opening time, time left.
4. **Reward audit:** centralize math. Wheel multiplier stays separate from base Gate XP.
5. **Saves:** migrations + import validation.

## Phase 2 – Gameplay and UX
6. Merge Gate and Co-op into one Gates tab. A joined gate can be left before starting with no penalty; the player's own gate stays available.
7. Co-op: the player earns full XP (owner decision, no server to verify). Two fields: own reps and partner's reps (honor system). The player's share is half the target. Show the formula in the app.
8. Undo/minus buttons on progress counters (-1, -5, custom). No negative progress.
9. First-open tutorial: skippable, shown once, System voice. Cover daily quests, XP, rank floors, rest tokens, gates, co-op.
10. Easy-quest messages: neutral and respectful (e.g. "Streak held. Easy quest logged."). Easy stays 1–2 reps, 1 XP.
11. Quest sizing per exercise: medium amounts depend on the move (e.g. push-ups 10–20, jumping jacks about 5). Hard quests combine two exercises (e.g. push-ups + sit-ups) instead of just more reps.
11a. **Exercise info button:** every quest and gate exercise gets an info (i) button, usable before and after choosing. It opens a panel with 2–4 stick-figure frames showing the movement (start, middle, end position), a short description, 3–4 form cues, and an easier variation. Draw the figures as original inline SVG so it works offline and adds almost no size. Store exercise data in its own `src/exercises/` folder (one data file for all exercises), so adding an exercise never touches other code. Keep form advice conservative and add a short note to stop if something hurts.
12. Show wheel odds; slice sizes match probabilities; show base XP × multiplier = final.
13. Weekly habit: show it clearly, preview next week's on Sunday.
14. Read-only weekly and monthly summaries (clears, streak, XP, gate result, volume). Store compact per-week records only, not every action. Never turn summaries into required tasks.

## Phase 3 – Special keys and gates
15. One wheel slot (of 8) can win a **special key**. Rare. Permanent until used, shown under the weekly gate in "Special gates", gone when empty, shareable with 1–2 friends via a deterministic code. Key rank is the player's rank +1; key rank drives reps, XP and flame color. Lower-rank players facing a higher key get larger targets by rank gap. Weekly gates never exceed the player's own rank.
16. Special gate is a hard compound challenge (e.g. push-ups + squats + sit-ups, optionally a short run). While one is active (up to 5 days) it replaces the daily quests and counts as cleared days. The weekly gate still works. Reward: big XP plus a rest token.
17. Animated flame/electric borders colored by key rank.
17a. **Gate entry and clear sequences (design pass, Phase 5):** Entering a gate plays a gate-opening animation that reveals a slowly drifting still scene by color: red = hellscape, purple = thunderstorm, yellow = speed rush (for legs). Build scenes from original art or code-drawn effects (CSS/canvas gradients, particles, lightning flashes), never from copied series art. Clearing a gate plays a collapse then a shatter into shards; one shard becomes the rest token and flies into the inventory. Keep it short, skippable, and respect reduced-motion settings. Avoid retro mobile-game look; keep the dark System aesthetic.
17b. **Rest token on return:** When the player returns after missing days, offer a choice: spend a token to lose no XP, or lose the XP and keep the token. The missed-day cap still applies.

## Phase 4 – Prestige and secret rank
18. S+ stays purely cosmetic (status only). Keep the glitch discovery sequence and the 3-attempt lock; reset attempts on each prestige so there is no permanent lockout.
19. Prestige after S or S+: reset to EE, gain one permanent star, keep special keys. Stars add an extra daily-quest column (two columns side by side), capped at two columns; further stars are cosmetic. Prestige from S+ gives a gold star with a plus marker, no benefit. Keep the secret key field available on a prestiged run.

## Phase 5 – Release
20. Remove or hide test tools. Remove dead code (old hour-grid picker `tp`/`setT`).
21. Regression tests: rank floors, missed-day cap, week boundaries, gate expiry, reward claims, co-op transitions, import failure.
22. Split into a feature-based folder structure (see "Project structure"); keep it deployable as a standalone file and on GitHub Pages.
23. Original branding and logo, README, GPL-3.0 license. Name: The System. Strip all references to the series, its art, characters, and the old test secret word.

## Project structure
Do this split first, before Phase 1, as its own commit with no behavior changes. One folder per feature, each holding its own logic, styles and tests:

```
the-system/                 <- project root, always run Claude Code from here
  index.html
  CLAUDE.md
  PROJECT_HANDOFF.md
  src/
    core/                   state, save/load, migrations, import/export, dates, seeded random
    ranks/                  XP, ranks, floors, missed-day penalty
    quests/                 daily quests, weekly habit, rest tokens
    gates/                  weekly gate, co-op, special keys, wheel
    prestige/               stars, secret rank
    summaries/              weekly and monthly history
    tutorial/
    ui/                     shared styles, animations, toasts
  tests/
```

Rules: features talk to each other only through `core/`. Add every new feature as its own folder. Always work from the project root so every folder is visible, never from inside a single feature folder. Keep a build step that can still output one standalone `index.html`.

## Art direction
Minimalist and dark: black, violet, ice-blue System panels, drawn in code. No anime characters or mascot art, no AI-generated character portraits, no early-2010s mobile-game look. Put the extra animation effort into the gate area (entry, clear, shatter) since gates are the signature feature.

## Prepare now for later features
- In the weekly summary records (item 14), store a count of completed quests per body part (legs, chest, core, back) per week. This costs almost nothing and lets a future hexagon/radar stat chart ("what you usually choose, where you're strongest") be built later without a save migration.
- Keep gate codes deterministic and include the gate's result format so a future "compete with friends" feature can compare results without a server.

## Out of scope for now
Radar/hexagon stat chart and friend competition (design is prepared above, build later).
Health Connect/steps, real friends/community verification, classes, voice-over, server features.
