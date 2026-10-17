# Rank Tracker (working title "The Gate") – Handoff

Paste this file plus `CLAUDE.md` into a new AI chat to continue (source is built from `src/`). Do not use the name, art or characters of any existing series (trademark). Final app name is still undecided.

## What it is
A free, fully local fitness-quest app with a letter-rank system. Single HTML file, no server, data in `localStorage` (key `gate1`). Owner: ASKEW (Bergen, Norway). Goal: open-source on GitHub, later a native Android app. User prefers brief answers.

Hosted test build: https://claude.ai/artifact/AkzTpgFAVxnSwMFrTtz6qp

## Core mechanics (all implemented)
- **Ranks:** EE, E, D, C, B, A, S. XP thresholds `[0,30,100,250,600,1400,3000]`. Rank is derived from XP, so it can drop.
- **Daily quest:** 3 options, one per random body part (Legs, Chest, Core, Back), tiers Easy/Medium/Hard always listed in that order. Easy = 1 rep, 1 XP (the "save my streak" option). Medium base 10 reps, 4 XP. Hard base 30 reps, 10 XP. Amounts scale by `1+rank*0.4`, XP by `1+rank*0.3`. Seeded by date.
- **Missed day:** lose `2 + rank*2` XP per missed day.
- **Weekly habit:** if one body part was picked on 3+ completed days last week, it becomes a daily habit this week (average amount). A day only counts if both quest and habit are done.
- **Weekend gate (key):** unlocks at rank D after 5 weekday completions, available Fri–Sun, 48 hours. Random body part and key rank (own rank −1 to +3). Target reps `base*(1+keyRank*1.2)`. Key rank vs player rank scales XP (2 steps or more above = 2x, 1 above = 1.5x, same = 1x, below = 0.6^diff). Out-of-reach gates (2+ above) are styled red. Unfinished gates pay 70% of proportional XP.
- **Reward wheel:** finishing a gate shows "Claim reward" and an 8-slice wheel. Solo 1.5–2.2x, co-op 1.8–3x.
- **Co-op gate:** share code = base64 of `{p,kr}`. Joining stores `S.co` for that weekend only; "Use my own gate" switches back. Test code: `7575`.
- **Encouragement toast** after each quest (4 random lines per tier). Zap animation sends a bolt to the rank.
- **Secret rank:** reaching S triggers "Max rank reached", then a glitch and "Secret rank unlocked". A "Secret rank" key field appears only after that, with 3 attempts. Key is stored only as a hash (`SECRET_HASH`, see `tools/hashkey.py`).
- **Daily window:** user picks opening time (hour, minute, AM/PM dropdowns) and 1h or 2h length. Reminder = optional .ics file with a daily alarm 30 min before.
- **Test tools (Setup tab):** Next day, Jump to Friday, +50 XP, Gate unlock toggle. Day offset stored as `S.off`.

## Design
Black background with purple mist, violet panel borders with ice-blue corner brackets, blue-to-violet buttons. Panels look like game "System windows". Plan: later get a custom design from the owner.

## State shape (`S`)
`xp, chk, days{date:{p,done,hb,h}}, gates{weekId:{p,kr,start,prog,done,coop,paid}}, co, win{s,len}, rem, off, force, plus, sec, att, jm`

## Not built yet / ideas
- Food tracking, lift logging with total volume (kg → tons), monthly/yearly recaps (existed in v1 `leveling.html`, dropped from v2)
- Prestige system after S+ (discussed, not decided)
- Google Health (Health Connect) steps for bonus XP, notifications, calendar access: needs a native Android app
- Optional own-API-key AI summary, or export text to paste into a free AI
- Real friends system and community S+ review (needs a server)
- GitHub repo with save points

## Known limits
- Hosted preview blocks file downloads, alerts and network calls to other sites.
- All "proof" is honor-system.
- Keep gate rep targets human-safe; allow splitting into sets.

## Decisions added later
- **Tone:** The "System" is cold and military. It sees the player as potential, not as a person with feelings. Keep all copy short, formal, no cute exclamations.
- **Secret rank sequence:** "Maximum rank confirmed" → glitch → "Anomaly detected / ??? / Secret rank unlocked." Never say how many attempts exist before the player has used some. Currently the panel shows attempts left; consider hiding the count until 1 attempt remains.
- **Planned steps XP (native app only):** 1 XP per 1,000 steps. Daily step cap rises with rank: about 5K–8K below D, 10K from D, 15K from B, 20K at A. Reaching the cap doubles the step XP (10K cap = 20 XP).
- **Prestige:** agreed in principle (ascension with permanent stars, or a retire mode with a message that the player no longer needs the system). Not built.
- **No API key anywhere** in `gate.html`; the app makes no network calls. Keep it free for the owner and users.
- **Distribution:** open source on GitHub (and maybe GitHub Pages). Not planned for Google Play. Use an open-source license (MIT). Avoid the series name, logo, art, character names and the signature catchphrase; the old test secret word is gone. Not legal advice; check trademarks (e.g. Patentstyret/TMview) before naming the app.
- **Secret rank attempts (done):** the attempt count is hidden. After the 2nd wrong key a warning pop-up appears: one attempt remains, failure seals the secret rank until prestige. Prestige would reset the attempts (prestige not built yet).
- **Future polish ideas:** more animation and bounce, real glitch effects, a crackly "bad reception" voice for the System (voice-over).
- **Rest tokens (done):** earned by clearing a gate (wheel claim), max 2. At 2, clearing a gate gives +25% of its base XP instead. A rest day (use a token) keeps the streak, costs no XP, and does NOT count toward the 5 days.
- **Gate unlock (changed):** needs 5 cleared quests anywhere in Mon–Sun (rest days excluded), rank D or higher. The gate lasts up to 48 hours but never past Sunday night, so opening it late gives less time (`g.end`).
- **Backup (done):** Setup tab has JSON export/import via a textarea. State has `v:1` for future migrations.

## Planned (not built): key system and prestige
- **Name:** final app name "The System".
- **Keys:** key rank is the basis for everything (reps, XP, flame color). Normal weekly gates never exceed the player's rank. One wheel slot (of 8) wins a permanent special key, one rank above the player's rank, stored under the weekly gate in a "Special gates" list that disappears when empty. Keys can be shared with 1–2 friends via a deterministic code (same code = same gate). Lower-ranked players facing a higher key get larger rep targets by rank gap. Gates show animated flame/electric borders colored by key rank.
- **Honor system:** saving keys, re-prestiging, and cheating are accepted; nothing is tracked.
- **Prestige:** after S+, ascend to get a star and reset rank to EE. Each star adds one more daily quest: star 1 = two quests shown in two side-by-side columns (each with easy/medium/hard options, any combination allowed). Quest amounts do not scale with stars; the extra quest is the added difficulty. Keys carry across prestiges.
- **Cleanup before release:** remove test tools, add logo, design pass, split into files in the GitHub repo.

## More decisions (latest session)
- **Philosophy:** the app is a motivating gimmick, not punishment. Keep it relatively easy so nobody gets overworked or stressed. No harsh penalties.
- **Tutorial (to build):** first-open walkthrough of each tab. Must explain: daily quests give XP; skipping a day costs XP; rank loss rules (below); gates; rest tokens; co-op.
- **Rank floors (to build):** missing days costs XP but never rank, with one exception. Reaching a rank locks it in as a floor (a D player can't fall below D). S is the only rank that can be lost, and it can only fall back to A, because S must be kept up daily. Never below A once at A or higher.
- **Merge Gate and Co-op into one tab (to build):** co-op is an option inside Gates, not its own tab.
- **Back out of a co-op gate (to build):** before starting, the player can decline or regret a joined gate and return to their own gate with no penalty (they do not lose both).
- **Weekend-only gates (to build/clarify):** gates are a weekend thing so weekdays are not overloaded. Current build opens the gate as soon as 5 quests are cleared; change so it opens only on the weekend (decide: Friday evening or Saturday) while still needing 5 cleared days by Sunday. Open question: exact opening time.
- **Honest co-op results (to build):** players report their own progress; only the XP actually earned is paid for partial completion.
- **Minus button (later):** progress counters get a minus/undo control so an accidental +25 can be corrected (e.g. -1, -5, custom).
- **Classes (far future):** D&D-style classes (berserker, assassin, necromancer, mage...) that shape which workouts you are offered. Server features are later still.
- **Release/licensing:** open source on GitHub under GPL-3.0-or-later (decided Oct 17; see License decision below). App name "The System | Fitness Tracker".

## Design and release notes (Oct 17)
- **Concept art verdict:** the earlier concept art looked like early-2010s mobile games. Do not use that style. Prefer a dark, restrained System look with code-drawn effects.
- **Gate entry:** gate-opening animation revealing a slowly drifting still scene per key color: red = hellscape, purple = thunderstorm, yellow = speed rush (legs). Original art only.
- **Gate clear:** the gate's world collapses and shatters into shards; one shard becomes the rest token and flies to the inventory.
- **Rest token on return:** after missed days, the player chooses: spend a token and lose no XP, or lose the XP and keep the token.
- **Store/privacy plan:** app is fully offline, no ads, no analytics, no accounts. Google Play's Data safety form is filled in manually in Play Console (not automatic); an offline app can declare no data collected. Expect to need a short privacy policy link. Health Connect (steps) adds its own declaration and review. Skip ads: any ad SDK adds data collection and disclosures. Verify current requirements on Google's Play Console Help pages before submitting.

## Exercise info button (Oct 17)
- Each exercise gets an info (i) button: 2–4 original stick-figure SVG frames, short description, form cues, easier variation. Fully offline. Data lives in `src/exercises/`. Reason: players should not leave the app to look up a movement.
- **Market note:** a competitor with AI anime art has about 200K downloads, so the category has demand. Competitors all use accounts/tracking, ads or in-app purchases; none are offline, none have gates or keys, and most are log-your-workout rather than challenge-based.
- **License note:** MIT lets anyone fork and sell the app. A copyleft license (e.g. GPL) would require forks to stay open source. Decide before the first public push. Optional: a donation link (no tracking) for tips.

## Art direction and future selling points (Oct 17)
- **Art:** minimalist dark System look, no anime art, no AI character portraits, no retro mobile-game style. Animation effort goes to the gate area.
- **Future selling point 1:** hexagon/radar stat chart built from the player's own choices (e.g. legs vs chest vs core vs back), showing what they usually pick and where they are strongest. Store per-body-part completion counts in weekly records now so it needs no migration later.
- **Future selling point 2:** competing gates with friends. Fully real-time competition needs a server; an offline version could compare results through shared codes.

## Build progress (kept current so a fresh Claude session can resume)
Repo: private, local git, no remote yet. Never commit keys or secrets (.gitignore blocks .env/*.key/*.pem). Build: `python3 build.py` bundles `src/` into standalone `index.html`. No node available; verify in the browser pane (static snapshot: no localStorage).
- **Done:** project split into `src/<feature>/`; Phase 1 (rank floors `S.fl`, one penalty per return, gate window Fri 18:00 to Sun midnight in game time via `nowMs()`, central reward math in `ranks/rewards.js`, save v3 with `parseSave`/migrations in `core/save.js`); Phase 2 (merged Gates tab, co-op own/partner reps, minus buttons, exercises in `src/exercises/exercises.js` with info panel, per-exercise sizing and hard combos, weighted wheel with odds, weekly habit + Sunday preview, summaries in `summaries/`, tutorial in `tutorial/`).
- **Rules to keep:** every new state field must be added to `sanitize()` in `core/save.js` and to a migration step (bump `SAVE_VERSION`). XP is applied immediately via `gain(x,true)`, banner later via `announce()`.
- **Owner decisions pending:** jumping jacks medium is 20-30 (owner said "about 5"); quest reps scale up to 3.4x at rank S; medium/hard encouragement lines are still warm, not cold System voice; special gate key is returned if the gate expires uncleared (assumption).
- **Phase 3 done:** rest-token choice on return (`pendShow`/`pendResolve`, save v4), weekly gates capped at player rank, keys (`gates/keys.js`, wheel slot 4 at ~4%, codes `SK<rank>-<seed36>`, friend codes via the co-op join box), special gate (`gates/special.js`, XP 2x base, key returned on expiry), flame borders (`ui/flame.css`, color `KC[rank]`).
- **Flags for owner:** weekly gate targets reach 350+ reps at rank A (base*(1+kr*1.2), split into sets); special XP is 2x gate base (rank-D player on a rank-C key earns 360).
- **Phase 4 done:** `prestige/prestige.js` (save v5, `S.stars=[{plus}]`; prestige needs current rank S; resets xp/floor/attempts/plus, keeps keys/history/streak); second daily-quest column (`cols()`, fields `p2`,`done2`,`c2`) from the first non-S+ star. Decision to confirm: with 2 columns both quests must be cleared for the day to count.
- **Phase 5 done:** test tools and dead code removed (tests time-travel with `S.off`); 46 regression tests in `tests/tests.js` (build, then open `tests/runner.html`; stubs localStorage and disables effects); gate entry/clear canvas sequences in `gates/fx.js`; branding (`ui/logo.svg`), README, MIT LICENSE; secret key stored as hash only (`tools/hashkey.py`).
- **Before going public:** the git history still contains the original file with the old test word and series name. Publish from a fresh history (orphan branch or new repo), never push this history. Never commit keys or secrets.
- **Known limits:** features still share globals (not strictly 'only through core'); weekly gate reps reach 350+ at rank A; verified only in the browser pane, so try real localStorage and phone layout yourself; special gate key is returned on expiry; two-column days need both quests.
- **Dev page:** `python3 build.py` also writes `dev.html` (gitignored, own save key `gate1dev`) with a DEV panel (time travel, rank/XP, keys, gate finish, animation previews, wheel). It is built from `tools/dev.js` and never goes in `index.html` or the release.
- **Exercises:** 16 now (`src/exercises/exercises.js`; legs 5, chest 4, core 4, back 3). Adding one entry is enough. Note: key codes map to exercises by seed, so friends comparing a code need the same app version.
- **Branches:** `main` has full history (never push). `release` is a fresh-history snapshot; re-create it from main when publishing.
- **License decision (owner, Oct 17):** GPL-3.0-or-later (not MIT) so forks stay open source. Name: "The System | Fitness Tracker".
