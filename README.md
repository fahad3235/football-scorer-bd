# Football Scorer BD

Live football scoreboard for casual local matches in Bangladesh — goals, cards,
a running match clock, and penalty shootouts. Fully offline, bilingual EN/বাংলা,
mobile-first. No account, no server, no network requests: everything lives in
your browser's localStorage.

## Features

1. **Match setup with validation** — team names (1–40 chars) and half length
   (1–60 minutes, default 45). Invalid input shows an inline error.
2. **Live scoreboard** — big score display, running clock (start/pause, auto
   half-time and full-time), period label, yellow/red card totals per team.
3. **Goals and cards** — goal buttons with an optional scorer name, per-team
   yellow/red buttons, a chronological event log, and undo of the last event.
4. **Penalty shootout** — a drawn match at full time offers a shootout: kicks
   alternate team by team, a winner is decided only after a completed round
   (5 rounds minimum, then sudden death), and the result banner reports the
   shootout score.
5. **Finished-match history** — matches saved on End Match, listed with date
   and result, deletable per row, plus strict JSON export/import and a
   typed-DELETE erase-all guard.
6. **Bilingual UI** — EN/বাংলা toggle persisted across reloads, with Bengali
   digits in scores and the clock when Bengali is active.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no CDN.
Game rules live in `js/logic.js` as pure functions so they are unit-testable
without a browser.

## Run locally

Open `index.html` in any modern browser, or serve the folder:

```sh
python3 -m http.server 8000
# open http://localhost:8000/
```

## Tests

```sh
node tests/unit.test.js   # pure-logic tests (13 checks)
node tests/smoke.mjs      # headless-Chrome CDP smoke tests (16 checks)
```

The smoke script uses the stock Playwright `headless_shell` binary and is a
local QA harness; it is not needed to run the app.

## Rules implemented (and their limits)

- The clock counts up and stops automatically at half-time and full time.
  It does not add stoppage/injury time — the referee ends a half with
  "Next phase" or the clock ends it.
- Cards are team totals, not per-player records, so a second yellow is not
  auto-converted to a red. Record the sending-off with the red button.
- A shootout winner needs a completed round and at least 5 rounds; sudden
  death applies from round 6 onward.
- Ending a match early records the score as it stands; it is a casual
  scorekeeper, not a tournament-certified record.

## Limitations

- Data lives only in this browser (localStorage). Clearing site data erases
  history. Export JSON regularly for matches you want to keep.
- No live data, fixtures, or team databases are included — every match is
  entered by hand, so no scores or fixtures can be wrong or stale.
- Not affiliated with any football federation.

## Status

Complete MVP. See `TEST_RESULTS.md` for the verified test results of this build.
