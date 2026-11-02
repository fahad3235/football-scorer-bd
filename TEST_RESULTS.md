# Football Scorer BD — test results (run #212, 2026-11-02, 14:00 slot)

## Unit tests: 13/13 PASS (`node tests/unit.test.js`)

- Setup validation: normal match accepted; empty name, 41-char name, half
  0 / 61 / 45.5 rejected with the right field codes.
- Clock: 0 -> 00:00, 61 -> 01:01, 2700 -> 45:00.
- Tick: a 1-minute half at 59s running ticks to half-time and stops.
- Goals only count in a live half (halftime goal rejected).
- Cards count per team; undo rolls back a goal but keeps earlier cards;
  undo on an empty stack returns false.
- Phase chain first -> halftime -> second -> fulltime; draw at full time
  goes to shootout, a lead goes straight to done with the correct winner.
- Shootout: 4-0 after 4 rounds undecided; 5-0 after the completed 5th
  round decided with phase done and result "A win on penalties (5-0)".
- Shootout: 5-5 after 5 rounds undecided; sudden-death round 6 decides it.
- Shootout kicks rejected outside the shootout phase.
- History import: good row accepted; bad date format, negative goals and
  non-array input rejected.
- Bengali digits: "2026-11-02 45:00" -> Bengali digits; fmtClock(3723) = 62:03.

## Headless-Chrome smoke tests: 16/16 PASS (`node tests/smoke.mjs`)

Raw CDP against the stock Playwright headless_shell-1187 binary, `file://` page.
Verified: title renders; setup view visible / live view hidden; empty setup
blocked with inline error; match starts 0-0 with team names; goal A -> 1-0
with a GOAL event row; undo restores 0-0; clock advances past 00:00 while
running; cards line shows 1Y for A and 1R for B; phase chain reaches a 0-0
full-time draw banner; shootout view appears; 5 scored + 5 missed kicks end
5-0 with a "penalties" winner banner; BN toggle changes the title and renders
Bengali digits in the score; 390px viewport has no horizontal overflow;
0 page errors, 0 console errors.

## Repairs during testing

None. First full runs of both suites were green (0 app-logic bugs).
One pre-test design fix: the History button in the live view now switches to
the History tab instead of saving again, so a match cannot be recorded twice.
