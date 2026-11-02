'use strict';
// Football Scorer BD \u2014 pure match logic (no DOM). Unit-tested in tests/unit.test.js.
function validateSetup(teamA, teamB, halfMinutes) {
  var errors = [];
  if (typeof teamA !== 'string' || !teamA.trim() || teamA.trim().length > 40) errors.push('teamA');
  if (typeof teamB !== 'string' || !teamB.trim() || teamB.trim().length > 40) errors.push('teamB');
  if (!Number.isInteger(halfMinutes) || halfMinutes < 1 || halfMinutes > 60) errors.push('half');
  return errors;
}

function createMatch(teamA, teamB, halfMinutes) {
  return {
    teamA: teamA.trim(), teamB: teamB.trim(), halfMinutes: halfMinutes,
    goalsA: 0, goalsB: 0, yellowsA: 0, yellowsB: 0, redsA: 0, redsB: 0,
    phase: 'first', elapsedSec: 0, running: false,
    events: [], undoStack: [],
    shootout: { kicks: [], scoreA: 0, scoreB: 0 }
  };
}

function snapshot(m) {
  return JSON.parse(JSON.stringify({
    goalsA: m.goalsA, goalsB: m.goalsB, yellowsA: m.yellowsA, yellowsB: m.yellowsB,
    redsA: m.redsA, redsB: m.redsB, phase: m.phase, elapsedSec: m.elapsedSec,
    events: m.events, shootout: m.shootout
  }));
}
function restore(m, snap) {
  m.goalsA = snap.goalsA; m.goalsB = snap.goalsB;
  m.yellowsA = snap.yellowsA; m.yellowsB = snap.yellowsB;
  m.redsA = snap.redsA; m.redsB = snap.redsB;
  m.phase = snap.phase; m.elapsedSec = snap.elapsedSec;
  m.events = snap.events; m.shootout = snap.shootout;
}
function pushUndo(m) { m.undoStack.push(snapshot(m)); if (m.undoStack.length > 200) m.undoStack.shift(); }
function undo(m) {
  if (!m.undoStack.length) return false;
  restore(m, m.undoStack.pop());
  return true;
}
function clockLabel(m) {
  var mm = Math.floor(m.elapsedSec / 60), ss = m.elapsedSec % 60;
  return (mm < 10 ? '0' + mm : '' + mm) + ':' + (ss < 10 ? '0' + ss : '' + ss);
}
function periodKey(m) {
  return { first: 'periodFirst', halftime: 'periodBreak', second: 'periodSecond',
    fulltime: 'periodFull', shootout: 'periodShootout', done: 'periodDone' }[m.phase] || 'periodFirst';
}
function halfLimitSec(m) { return m.halfMinutes * 60; }
function tick(m) {
  if (!m.running) return;
  m.elapsedSec += 1;
  if (m.phase === 'first' && m.elapsedSec >= halfLimitSec(m)) { m.phase = 'halftime'; m.running = false; }
  else if (m.phase === 'second' && m.elapsedSec >= 2 * halfLimitSec(m)) { m.phase = 'fulltime'; m.running = false; }
}
function nextPhase(m) {
  if (m.phase === 'first') { m.phase = 'halftime'; m.running = false; }
  else if (m.phase === 'halftime') { m.phase = 'second'; m.running = false; }
  else if (m.phase === 'second') { m.phase = 'fulltime'; m.running = false; }
  else if (m.phase === 'fulltime') {
    if (m.goalsA === m.goalsB) { m.phase = 'shootout'; }
    else { m.phase = 'done'; }
  }
  return m.phase;
}
function canScore(m) { return m.phase === 'first' || m.phase === 'second'; }
function addGoal(m, team, scorer) {
  if (!canScore(m)) return false;
  pushUndo(m);
  if (team === 'A') m.goalsA += 1; else m.goalsB += 1;
  m.events.push({ kind: 'goal', team: team, scorer: (scorer || '').slice(0, 40), clock: clockLabel(m) });
  return true;
}
function addCard(m, team, kind) {
  if (m.phase === 'done') return false;
  pushUndo(m);
  if (team === 'A') { if (kind === 'yellow') m.yellowsA += 1; else m.redsA += 1; }
  else { if (kind === 'yellow') m.yellowsB += 1; else m.redsB += 1; }
  m.events.push({ kind: 'card', team: team, card: kind, clock: clockLabel(m) });
  return true;
}
// Shootout: kicks alternate A, B, A, B... Each round = one kick per team.
// Winner decided after a completed round once rounds >= 5, or in sudden
// death (round >= 6) as soon as a round ends with unequal scores.
function shootoutNextTeam(m) {
  return m.shootout.kicks.length % 2 === 0 ? 'A' : 'B';
}
function shootoutKick(m, scored) {
  if (m.phase !== 'shootout') return false;
  var team = shootoutNextTeam(m);
  pushUndo(m);
  m.shootout.kicks.push({ team: team, scored: !!scored });
  if (team === 'A' && scored) m.shootout.scoreA += 1;
  if (team === 'B' && scored) m.shootout.scoreB += 1;
  m.events.push({ kind: 'shootout', team: team, scored: !!scored });
  var w = shootoutWinner(m);
  if (w) m.phase = 'done';
  return true;
}
function shootoutWinner(m) {
  var kicks = m.shootout.kicks;
  if (kicks.length % 2 !== 0) return null; // mid-round: no decision yet
  var rounds = kicks.length / 2;
  if (rounds < 5) return null;
  if (m.shootout.scoreA === m.shootout.scoreB) return null;
  return m.shootout.scoreA > m.shootout.scoreB ? 'A' : 'B';
}
function matchWinner(m) {
  if (m.phase === 'done' && m.shootout.kicks.length > 0) return shootoutWinner(m);
  if (m.phase === 'done' || m.phase === 'fulltime') {
    if (m.goalsA === m.goalsB) return null;
    return m.goalsA > m.goalsB ? 'A' : 'B';
  }
  return null;
}
function resultText(m) {
  var w = matchWinner(m);
  if (m.phase === 'done' && m.shootout.kicks.length > 0 && w) {
    return (w === 'A' ? m.teamA : m.teamB) + ' win on penalties (' +
      m.shootout.scoreA + '-' + m.shootout.scoreB + ')';
  }
  if (!w) return 'Draw ' + m.goalsA + '-' + m.goalsB;
  return (w === 'A' ? m.teamA : m.teamB) + ' win ' + m.goalsA + '-' + m.goalsB;
}
// Strict history-entry validation (export/import).
function validateHistoryEntry(e) {
  if (!e || typeof e !== 'object') return false;
  if (typeof e.teamA !== 'string' || !e.teamA.trim() || e.teamA.length > 40) return false;
  if (typeof e.teamB !== 'string' || !e.teamB.trim() || e.teamB.length > 40) return false;
  if (!Number.isInteger(e.goalsA) || e.goalsA < 0 || e.goalsA > 99) return false;
  if (!Number.isInteger(e.goalsB) || e.goalsB < 0 || e.goalsB > 99) return false;
  if (typeof e.result !== 'string' || !e.result) return false;
  if (typeof e.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) return false;
  return true;
}
function validateHistoryImport(data) {
  return Array.isArray(data) && data.length <= 500 && data.every(validateHistoryEntry);
}
var FootballLogicExport = { validateSetup: validateSetup, createMatch: createMatch, undo: undo,
    clockLabel: clockLabel, periodKey: periodKey, tick: tick, nextPhase: nextPhase,
    canScore: canScore, addGoal: addGoal, addCard: addCard,
    shootoutNextTeam: shootoutNextTeam, shootoutKick: shootoutKick,
    shootoutWinner: shootoutWinner, matchWinner: matchWinner, resultText: resultText,
    validateHistoryEntry: validateHistoryEntry, validateHistoryImport: validateHistoryImport };
if (typeof module !== 'undefined') { module.exports = FootballLogicExport; }
if (typeof window !== 'undefined') { window.FootballLogic = FootballLogicExport; }
