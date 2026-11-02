// Football Scorer BD unit tests. Run: node tests/unit.test.js
'use strict';
const assert = require('assert');
const L = require('../js/logic.js');
const I = require('../js/i18n.js');
let n = 0;
function check(name, fn) { fn(); n++; console.log('ok - ' + name); }

check('setup validation accepts a normal match', () => {
  assert.deepStrictEqual(L.validateSetup('Mohammedan', 'Abahani', 45), []);
});
check('setup validation rejects empty name, long name, bad half', () => {
  assert.deepStrictEqual(L.validateSetup('', 'Abahani', 45), ['teamA']);
  assert.deepStrictEqual(L.validateSetup('A'.repeat(41), 'B', 45), ['teamA']);
  assert.deepStrictEqual(L.validateSetup('A', 'B', 0), ['half']);
  assert.deepStrictEqual(L.validateSetup('A', 'B', 61), ['half']);
  assert.deepStrictEqual(L.validateSetup('A', 'B', 45.5), ['half']);
});
check('clock formats 0, 61 and 2700 seconds', () => {
  assert.strictEqual(L.clockLabel({ elapsedSec: 0 }), '00:00');
  assert.strictEqual(L.clockLabel({ elapsedSec: 61 }), '01:01');
  assert.strictEqual(L.clockLabel({ elapsedSec: 2700 }), '45:00');
});
check('tick auto-advances first half to halftime and stops the clock', () => {
  const m = L.createMatch('A', 'B', 1); m.running = true; m.elapsedSec = 59;
  L.tick(m);
  assert.strictEqual(m.phase, 'halftime');
  assert.strictEqual(m.running, false);
});
check('goals only count in a live half', () => {
  const m = L.createMatch('A', 'B', 45);
  assert.strictEqual(L.addGoal(m, 'A', 'Karim'), true);
  assert.strictEqual(m.goalsA, 1);
  m.phase = 'halftime';
  assert.strictEqual(L.addGoal(m, 'B', ''), false);
  assert.strictEqual(m.goalsB, 0);
});
check('cards count per team and undo rolls back a goal', () => {
  const m = L.createMatch('A', 'B', 45);
  L.addCard(m, 'A', 'yellow'); L.addCard(m, 'B', 'red');
  assert.strictEqual(m.yellowsA, 1); assert.strictEqual(m.redsB, 1);
  L.addGoal(m, 'A', '');
  assert.strictEqual(L.undo(m), true);
  assert.strictEqual(m.goalsA, 0); assert.strictEqual(m.redsB, 1);
  assert.strictEqual(L.undo(m), true); assert.strictEqual(L.undo(m), true);
  assert.strictEqual(L.undo(m), false);
});
check('phase chain first -> halftime -> second -> fulltime', () => {
  const m = L.createMatch('A', 'B', 45);
  assert.strictEqual(L.nextPhase(m), 'halftime');
  assert.strictEqual(L.nextPhase(m), 'second');
  assert.strictEqual(L.nextPhase(m), 'fulltime');
});
check('draw at full time goes to shootout, lead goes straight to done', () => {
  const d = L.createMatch('A', 'B', 45); d.phase = 'fulltime';
  assert.strictEqual(L.nextPhase(d), 'shootout');
  const w = L.createMatch('A', 'B', 45); w.phase = 'fulltime'; w.goalsA = 2;
  assert.strictEqual(L.nextPhase(w), 'done');
  assert.strictEqual(L.matchWinner(w), 'A');
});
check('shootout: 5-round win decided only after the round completes', () => {
  const m = L.createMatch('A', 'B', 45); m.phase = 'shootout';
  // A scores, B misses, repeated; after 4 rounds A leads 4-0 but no decision yet.
  for (let i = 0; i < 4; i++) { L.shootoutKick(m, true); L.shootoutKick(m, false); }
  assert.strictEqual(L.shootoutWinner(m), null);
  L.shootoutKick(m, true); // A 5th kick: mid-round, still no decision
  assert.strictEqual(L.shootoutWinner(m), null);
  L.shootoutKick(m, false); // B misses: 5-0, decided, phase done
  assert.strictEqual(L.shootoutWinner(m), 'A');
  assert.strictEqual(m.phase, 'done');
  assert.strictEqual(L.resultText(m), 'A win on penalties (5-0)');
});
check('shootout: tied after 5 rounds goes to sudden death', () => {
  const m = L.createMatch('A', 'B', 45); m.phase = 'shootout';
  for (let i = 0; i < 5; i++) { L.shootoutKick(m, true); L.shootoutKick(m, true); }
  assert.strictEqual(L.shootoutWinner(m), null);
  L.shootoutKick(m, true); L.shootoutKick(m, false);
  assert.strictEqual(L.shootoutWinner(m), 'A');
});
check('shootout kicks rejected outside shootout phase', () => {
  const m = L.createMatch('A', 'B', 45);
  assert.strictEqual(L.shootoutKick(m, true), false);
  assert.strictEqual(L.shootoutNextTeam(m), 'A');
});
check('history import validation accepts good rows, rejects bad ones', () => {
  const good = [{ teamA: 'A', teamB: 'B', goalsA: 2, goalsB: 1, result: 'A win 2-1', date: '2026-11-02' }];
  assert.strictEqual(L.validateHistoryImport(good), true);
  assert.strictEqual(L.validateHistoryImport([{ teamA: 'A', teamB: 'B', goalsA: 2, goalsB: 1, result: 'x', date: '02/11/2026' }]), false);
  assert.strictEqual(L.validateHistoryImport([{ teamA: 'A', teamB: 'B', goalsA: -1, goalsB: 1, result: 'x', date: '2026-11-02' }]), false);
  assert.strictEqual(L.validateHistoryImport('nope'), false);
});
check('Bengali digits convert 0-9 and clock formatting stays ASCII-safe', () => {
  assert.strictEqual(I.toBnDigits('2026-11-02 45:00'), '\u09e8\u09e6\u09e8\u09ec-\u09e7\u09e7-\u09e6\u09e8 \u09ea\u09eb:\u09e6\u09e6');
  assert.strictEqual(I.fmtClock(3723), '62:03');
  assert.strictEqual(I.I18N.bn.title.length > 0, true);
});
console.log('PASS ' + n + '/' + n + ' unit tests');
