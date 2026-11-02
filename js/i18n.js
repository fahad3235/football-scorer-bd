'use strict';
// Football Scorer BD \u2014 UI strings (EN + BN). Bengali kept as \u escapes
// so pushed sources stay pure ASCII (push-argv safety, see README).
var I18N = {
  en: {
    title: 'Football Scorer BD',
    tagline: 'Live football scoreboard for local matches \u2014 goals, cards, clock and shootouts.',
    setupTitle: 'Match setup',
    teamA: 'Team A name', teamB: 'Team B name',
    halfLength: 'Half length (minutes)',
    startMatch: 'Start match',
    liveTitle: 'Live match',
    goalA: 'Goal \u2014 Team A', goalB: 'Goal \u2014 Team B',
    scorerName: 'Scorer name (optional)',
    yellowA: 'Yellow \u2014 A', yellowB: 'Yellow \u2014 B',
    redA: 'Red \u2014 A', redB: 'Red \u2014 B',
    undo: 'Undo last event',
    startClock: 'Start clock', pauseClock: 'Pause clock',
    nextPhase: 'Next phase', endMatch: 'End match', newMatch: 'New match',
    shootoutTitle: 'Penalty shootout',
    shootoutA: 'Team A takes a penalty', shootoutB: 'Team B takes a penalty',
    scored: 'Scored', missed: 'Missed',
    eventsTitle: 'Match events', historyTitle: 'Finished matches',
    exportBtn: 'Export JSON', importBtn: 'Import JSON', eraseBtn: 'Erase all (type DELETE)',
    emptyHistory: 'No finished matches yet. Finish a match and it will appear here.',
    emptyEvents: 'No events yet.',
    tabMatch: 'Match', tabHistory: 'History',
    periodFirst: '1st half', periodBreak: 'Half-time', periodSecond: '2nd half',
    periodFull: 'Full time', periodShootout: 'Shootout', periodDone: 'Match over',
    winnerPrefix: 'Winner: ', drawText: 'Draw',
    wonByGoals: 'won', shootoutNote: 'Shootout decides a drawn knockout match.',
    errNames: 'Enter both team names (1\u201340 characters each).',
    errHalf: 'Half length must be a whole number from 1 to 60 minutes.',
    errScorer: 'Scorer name must be 40 characters or fewer.',
    errImport: 'That file is not a valid Football Scorer export.',
    errErase: 'Type DELETE exactly to erase everything.',
    saved: 'Match saved to history.',
    goalEvent: 'GOAL', cardEvent: 'CARD', shootoutEvent: 'SHOOTOUT',
    footer: 'Offline scorekeeper for casual matches. Not affiliated with any federation; not a tournament-certified record.'
  },
  bn: {
    title: '\u09ab\u09c1\u099f\u09ac\u09b2 \u09b8\u09cd\u0995\u09cb\u09b0\u09be\u09b0 \u09ac\u09bf\u09a1\u09bf',
    tagline: '\u09b8\u09cd\u09a5\u09be\u09a8\u09c0\u09af\u09bc \u09ae\u09cd\u09af\u09be\u099a\u09c7\u09b0 \u09b2\u09be\u0987\u09ad \u09ab\u09c1\u099f\u09ac\u09b2 \u09b8\u09cd\u0995\u09cb\u09b0\u09ac\u09cb\u09b0\u09cd\u09a1 \u2014 \u0997\u09cb\u09b2, \u0995\u09be\u09b0\u09cd\u09a1, \u0998\u09a1\u09bc\u09bf \u0993 \u09b6\u09c1\u099f\u0986\u0989\u099f\u0964',
    setupTitle: '\u09ae\u09cd\u09af\u09be\u099a \u09b8\u09c7\u099f\u0986\u09aa',
    teamA: '\u09a6\u09b2 \u098f-\u098f\u09b0 \u09a8\u09be\u09ae', teamB: '\u09a6\u09b2 \u09ac\u09bf-\u098f\u09b0 \u09a8\u09be\u09ae',
    halfLength: '\u0985\u09b0\u09cd\u09a7\u09c7\u09b0 \u09a6\u09c8\u09b0\u09cd\u0998\u09cd\u09af (\u09ae\u09bf\u09a8\u09bf\u099f)',
    startMatch: '\u09ae\u09cd\u09af\u09be\u099a \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09c1\u09a8',
    liveTitle: '\u09b2\u09be\u0987\u09ad \u09ae\u09cd\u09af\u09be\u099a',
    goalA: '\u0997\u09cb\u09b2 \u2014 \u09a6\u09b2 \u098f', goalB: '\u0997\u09cb\u09b2 \u2014 \u09a6\u09b2 \u09ac\u09bf',
    scorerName: '\u0997\u09cb\u09b2\u09a6\u09be\u09a4\u09be\u09b0 \u09a8\u09be\u09ae (\u0990\u099a\u09cd\u099b\u09bf\u0995)',
    yellowA: '\u09b9\u09b2\u09c1\u09a6 \u2014 \u098f', yellowB: '\u09b9\u09b2\u09c1\u09a6 \u2014 \u09ac\u09bf',
    redA: '\u09b2\u09be\u09b2 \u2014 \u098f', redB: '\u09b2\u09be\u09b2 \u2014 \u09ac\u09bf',
    undo: '\u09b6\u09c7\u09b7 \u0987\u09ad\u09c7\u09a8\u09cd\u099f \u09ac\u09be\u09a4\u09bf\u09b2 \u0995\u09b0\u09c1\u09a8',
    startClock: '\u0998\u09a1\u09bc\u09bf \u099a\u09be\u09b2\u09c1 \u0995\u09b0\u09c1\u09a8', pauseClock: '\u0998\u09a1\u09bc\u09bf \u09a5\u09be\u09ae\u09be\u09a8',
    nextPhase: '\u09aa\u09b0\u09c7\u09b0 \u09a7\u09be\u09aa', endMatch: '\u09ae\u09cd\u09af\u09be\u099a \u09b6\u09c7\u09b7 \u0995\u09b0\u09c1\u09a8', newMatch: '\u09a8\u09a4\u09c1\u09a8 \u09ae\u09cd\u09af\u09be\u099a',
    shootoutTitle: '\u09aa\u09c7\u09a8\u09be\u09b2\u09cd\u099f\u09bf \u09b6\u09c1\u099f\u0986\u0989\u099f',
    shootoutA: '\u09a6\u09b2 \u098f \u09aa\u09c7\u09a8\u09be\u09b2\u09cd\u099f\u09bf \u09a8\u09c7\u09ac\u09c7', shootoutB: '\u09a6\u09b2 \u09ac\u09bf \u09aa\u09c7\u09a8\u09be\u09b2\u09cd\u099f\u09bf \u09a8\u09c7\u09ac\u09c7',
    scored: '\u0997\u09cb\u09b2 \u09b9\u09af\u09bc\u09c7\u099b\u09c7', missed: '\u09ae\u09bf\u09b8 \u09b9\u09af\u09bc\u09c7\u099b\u09c7',
    eventsTitle: '\u09ae\u09cd\u09af\u09be\u099a \u0987\u09ad\u09c7\u09a8\u09cd\u099f', historyTitle: '\u09b8\u09ae\u09be\u09aa\u09cd\u09a4 \u09ae\u09cd\u09af\u09be\u099a',
    exportBtn: 'JSON \u098f\u0995\u09cd\u09b8\u09aa\u09cb\u09b0\u09cd\u099f', importBtn: 'JSON \u0987\u09ae\u09aa\u09cb\u09b0\u09cd\u099f', eraseBtn: '\u09b8\u09ac \u09ae\u09c1\u099b\u09c1\u09a8 (DELETE \u09b2\u09bf\u0996\u09c1\u09a8)',
    emptyHistory: '\u098f\u0996\u09a8\u09cb \u0995\u09cb\u09a8\u09cb \u09b8\u09ae\u09be\u09aa\u09cd\u09a4 \u09ae\u09cd\u09af\u09be\u099a \u09a8\u09c7\u0987\u0964 \u09ae\u09cd\u09af\u09be\u099a \u09b6\u09c7\u09b7 \u09b9\u09b2\u09c7 \u098f\u0996\u09be\u09a8\u09c7 \u09a6\u09c7\u0996\u09be\u09ac\u09c7\u0964',
    emptyEvents: '\u098f\u0996\u09a8\u09cb \u0995\u09cb\u09a8\u09cb \u0987\u09ad\u09c7\u09a8\u09cd\u099f \u09a8\u09c7\u0987\u0964',
    tabMatch: '\u09ae\u09cd\u09af\u09be\u099a', tabHistory: '\u0987\u09a4\u09bf\u09b9\u09be\u09b8',
    periodFirst: '\u09aa\u09cd\u09b0\u09a5\u09ae\u09be\u09b0\u09cd\u09a7', periodBreak: '\u09ac\u09bf\u09b0\u09a4\u09bf', periodSecond: '\u09a6\u09cd\u09ac\u09bf\u09a4\u09c0\u09af\u09bc\u09be\u09b0\u09cd\u09a7',
    periodFull: '\u09aa\u09c2\u09b0\u09cd\u09a3 \u09b8\u09ae\u09af\u09bc', periodShootout: '\u09b6\u09c1\u099f\u0986\u0989\u099f', periodDone: '\u09ae\u09cd\u09af\u09be\u099a \u09b6\u09c7\u09b7',
    winnerPrefix: '\u09ac\u09bf\u099c\u09af\u09bc\u09c0: ', drawText: '\u09a1\u09cd\u09b0',
    wonByGoals: '\u099c\u09bf\u09a4\u09c7\u099b\u09c7', shootoutNote: '\u09a1\u09cd\u09b0 \u09b9\u0993\u09af\u09bc\u09be \u09a8\u0995\u0986\u0989\u099f \u09ae\u09cd\u09af\u09be\u099a \u09b6\u09c1\u099f\u0986\u0989\u099f\u09c7 \u09a8\u09bf\u09b0\u09cd\u09a7\u09be\u09b0\u09bf\u09a4 \u09b9\u09af\u09bc\u0964',
    errNames: '\u09a6\u09c1\u099f\u09bf \u09a6\u09b2\u09c7\u09b0 \u09a8\u09be\u09ae \u09a6\u09bf\u09a8 (\u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u09e7\u2013\u09ea\u09e6 \u0985\u0995\u09cd\u09b7\u09b0)\u0964',
    errHalf: '\u0985\u09b0\u09cd\u09a7\u09c7\u09b0 \u09a6\u09c8\u09b0\u09cd\u0998\u09cd\u09af \u09e7 \u09a5\u09c7\u0995\u09c7 \u09ec\u09e6 \u09ae\u09bf\u09a8\u09bf\u099f\u09c7\u09b0 \u09aa\u09c2\u09b0\u09cd\u09a3\u09b8\u0982\u0996\u09cd\u09af\u09be \u09b9\u09a4\u09c7 \u09b9\u09ac\u09c7\u0964',
    errScorer: '\u0997\u09cb\u09b2\u09a6\u09be\u09a4\u09be\u09b0 \u09a8\u09be\u09ae \u09ea\u09e6 \u0985\u0995\u09cd\u09b7\u09b0\u09c7\u09b0 \u09ac\u09c7\u09b6\u09bf \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09ac\u09c7 \u09a8\u09be\u0964',
    errImport: '\u098f\u0987 \u09ab\u09be\u0987\u09b2\u099f\u09bf \u09ac\u09c8\u09a7 \u09ab\u09c1\u099f\u09ac\u09b2 \u09b8\u09cd\u0995\u09cb\u09b0\u09be\u09b0 \u098f\u0995\u09cd\u09b8\u09aa\u09cb\u09b0\u09cd\u099f \u09a8\u09af\u09bc\u0964',
    errErase: '\u09b8\u09ac \u09ae\u09c1\u099b\u09a4\u09c7 \u09a0\u09bf\u0995 DELETE \u09b2\u09bf\u0996\u09c1\u09a8\u0964',
    saved: '\u09ae\u09cd\u09af\u09be\u099a \u0987\u09a4\u09bf\u09b9\u09be\u09b8\u09c7 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09bf\u09a4 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964',
    goalEvent: '\u0997\u09cb\u09b2', cardEvent: '\u0995\u09be\u09b0\u09cd\u09a1', shootoutEvent: '\u09b6\u09c1\u099f\u0986\u0989\u099f',
    footer: '\u0985\u09a8\u09be\u09a8\u09c1\u09b7\u09cd\u09a0\u09be\u09a8\u09bf\u0995 \u09ae\u09cd\u09af\u09be\u099a\u09c7\u09b0 \u0985\u09ab\u09b2\u09be\u0987\u09a8 \u09b8\u09cd\u0995\u09cb\u09b0\u0995\u09bf\u09aa\u09be\u09b0\u0964 \u0995\u09cb\u09a8\u09cb \u09ab\u09c7\u09a1\u09be\u09b0\u09c7\u09b6\u09a8\u09c7\u09b0 \u09b8\u0999\u09cd\u0997\u09c7 \u09af\u09c1\u0995\u09cd\u09a4 \u09a8\u09af\u09bc; \u099f\u09c1\u09b0\u09cd\u09a8\u09be\u09ae\u09c7\u09a8\u09cd\u099f-\u09b8\u09cd\u09ac\u09c0\u0995\u09c3\u09a4 \u09b0\u09c7\u0995\u09b0\u09cd\u09a1 \u09a8\u09af\u09bc\u0964'
  }
};
var BN_DIGITS = ['\u09e6', '\u09e7', '\u09e8', '\u09e9', '\u09ea', '\u09eb', '\u09ec', '\u09ed', '\u09ee', '\u09ef'];
function toBnDigits(str) {
  return String(str).replace(/[0-9]/g, function (d) { return BN_DIGITS[+d]; });
}
function fmtClock(totalSec) {
  var m = Math.floor(totalSec / 60), s = totalSec % 60;
  return (m < 10 ? '0' + m : '' + m) + ':' + (s < 10 ? '0' + s : '' + s);
}
if (typeof module !== 'undefined') { module.exports = { I18N: I18N, toBnDigits: toBnDigits, fmtClock: fmtClock }; }
if (typeof window !== 'undefined') { window.I18N = I18N; window.toBnDigits = toBnDigits; window.fmtClock = fmtClock; }
