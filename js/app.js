'use strict';
/* Football Scorer BD \u2014 DOM glue. Logic lives in js/logic.js; strings in js/i18n.js. */
(function () {
  var L = window.FootballLogic, STR = window.I18N;
  var lang = localStorage.getItem('fsbd-lang') || 'en';
  var match = null, history = [], timer = null;
  try { history = JSON.parse(localStorage.getItem('fsbd-history') || '[]'); } catch (e) { history = []; }
  if (!L.validateHistoryImport(history)) history = [];

  function t(key) { return STR[lang][key] || STR.en[key] || key; }
  function num(n) { return lang === 'bn' ? toBnDigits(n) : String(n); }
  function $(id) { return document.getElementById(id); }
  function saveHistory() { localStorage.setItem('fsbd-history', JSON.stringify(history)); }

  function renderLang() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-ph'));
    });
    $('langBtn').textContent = lang === 'en' ? '\u09ac\u09be\u0982\u09b2\u09be' : 'English';
    render();
  }
  function setLang(next) {
    lang = next; localStorage.setItem('fsbd-lang', lang); renderLang();
  }

  function showTab(name) {
    $('tab-match').classList.toggle('hidden', name !== 'match');
    $('tab-history').classList.toggle('hidden', name !== 'history');
    $('tabBtn-match').classList.toggle('active', name === 'match');
    $('tabBtn-history').classList.toggle('active', name !== 'match');
    if (name === 'history') renderHistory();
  }

  function render() {
    if (!match) {
      $('setupView').classList.remove('hidden');
      $('liveView').classList.add('hidden');
      return;
    }
    $('setupView').classList.add('hidden');
    $('liveView').classList.remove('hidden');
    $('teamAName').textContent = match.teamA;
    $('teamBName').textContent = match.teamB;
    $('scoreA').textContent = num(match.goalsA);
    $('scoreB').textContent = num(match.goalsB);
    $('clock').textContent = num(L.clockLabel(match));
    $('period').textContent = t(L.periodKey(match));
    $('cardsLine').textContent =
      match.teamA + ' ' + num(match.yellowsA) + 'Y ' + num(match.redsA) + 'R  |  ' +
      match.teamB + ' ' + num(match.yellowsB) + 'Y ' + num(match.redsB) + 'R';
    $('clockBtn').textContent = match.running ? t('pauseClock') : t('startClock');
    $('clockBtn').disabled = !(match.phase === 'first' || match.phase === 'second');
    $('nextPhaseBtn').textContent = t('nextPhase');
    $('nextPhaseBtn').disabled = match.phase === 'done';
    var scoring = L.canScore(match);
    ['goalABtn', 'goalBBtn'].forEach(function (id) { $(id).disabled = !scoring; });
    ['yellowABtn', 'yellowBBtn', 'redABtn', 'redBBtn'].forEach(function (id) {
      $(id).disabled = match.phase === 'done';
    });
    $('undoBtn').disabled = match.undoStack.length === 0;
    $('endMatchBtn').disabled = match.phase === 'done';
    $('shootoutView').classList.toggle('hidden', match.phase !== 'shootout');
    $('shootoutScore').textContent = num(match.shootout.scoreA) + ' - ' + num(match.shootout.scoreB);
    $('shootoutTurn').textContent = match.phase === 'shootout'
      ? (L.shootoutNextTeam(match) === 'A' ? match.teamA : match.teamB) : '';
    $('resultBanner').classList.toggle('hidden', !(match.phase === 'done' || match.phase === 'fulltime'));
    if (match.phase === 'done') {
      $('resultBanner').textContent = t('winnerPrefix') + L.resultText(match);
    } else if (match.phase === 'fulltime') {
      $('resultBanner').textContent = match.goalsA === match.goalsB
        ? t('drawText') + ' ' + num(match.goalsA) + '-' + num(match.goalsB) + ' \u2014 ' + t('shootoutNote')
        : t('winnerPrefix') + L.resultText(match);
    }
    var ev = $('eventsList');
    ev.innerHTML = '';
    if (!match.events.length) { var li = document.createElement('li'); li.textContent = t('emptyEvents'); ev.appendChild(li); }
    match.events.slice().reverse().forEach(function (e) {
      var row = document.createElement('li');
      var label = e.kind === 'goal' ? t('goalEvent') : e.kind === 'card' ? t('cardEvent') : t('shootoutEvent');
      row.textContent = (e.clock || '') + ' \u2014 ' + label + ' ' +
        (e.team === 'A' ? match.teamA : match.teamB) +
        (e.scorer ? ' (' + e.scorer + ')' : '') +
        (e.card ? ' ' + e.card : '') +
        (e.kind === 'shootout' ? (e.scored ? ' \u2713' : ' \u2717') : '');
      ev.appendChild(row);
    });
  }

  function renderHistory() {
    var list = $('historyList'); list.innerHTML = '';
    if (!history.length) { var p = document.createElement('p'); p.textContent = t('emptyHistory'); list.appendChild(p); return; }
    history.slice().reverse().forEach(function (h, idx) {
      var row = document.createElement('div'); row.className = 'hist-row';
      row.innerHTML = '';
      var span = document.createElement('span');
      span.textContent = h.date + ' \u2014 ' + h.teamA + ' ' + num(h.goalsA) + '-' + num(h.goalsB) + ' ' + h.teamB + ' \u2014 ' + h.result;
      var del = document.createElement('button'); del.textContent = '\u00d7'; del.title = 'Delete';
      del.onclick = function () { history.splice(history.length - 1 - idx, 1); saveHistory(); renderHistory(); };
      row.appendChild(span); row.appendChild(del); list.appendChild(row);
    });
  }

  function startClock() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () { if (match && match.running) { L.tick(match); render(); } }, 1000);
  }
  function stopClock() { if (timer) { clearInterval(timer); timer = null; } }

  function finishMatch() {
    if (!match) return;
    var entry = { teamA: match.teamA, teamB: match.teamB, goalsA: match.goalsA,
      goalsB: match.goalsB, result: L.resultText(match),
      date: new Date().toISOString().slice(0, 10) };
    history.push(entry); saveHistory();
    $('feedback').textContent = t('saved');
  }

  function bind() {
    $('langBtn').onclick = function () { setLang(lang === 'en' ? 'bn' : 'en'); };
    $('tabBtn-match').onclick = function () { showTab('match'); };
    $('tabBtn-history').onclick = function () { showTab('history'); };
    $('setupForm').onsubmit = function (e) {
      e.preventDefault();
      var a = $('teamAInput').value, b = $('teamBInput').value;
      var half = parseInt($('halfInput').value, 10);
      var errs = L.validateSetup(a, b, half);
      $('setupError').textContent = errs.length
        ? (errs.indexOf('half') >= 0 ? t('errHalf') : t('errNames')) : '';
      if (errs.length) return;
      match = L.createMatch(a, b, half);
      window.__match = match;
      $('feedback').textContent = '';
      render();
    };
    $('goalABtn').onclick = function () {
      if ($('scorerInput').value.length > 40) { $('feedback').textContent = t('errScorer'); return; }
      if (L.addGoal(match, 'A', $('scorerInput').value.trim())) { $('scorerInput').value = ''; $('feedback').textContent = ''; render(); }
    };
    $('goalBBtn').onclick = function () {
      if ($('scorerInput').value.length > 40) { $('feedback').textContent = t('errScorer'); return; }
      if (L.addGoal(match, 'B', $('scorerInput').value.trim())) { $('scorerInput').value = ''; $('feedback').textContent = ''; render(); }
    };
    $('yellowABtn').onclick = function () { if (L.addCard(match, 'A', 'yellow')) render(); };
    $('yellowBBtn').onclick = function () { if (L.addCard(match, 'B', 'yellow')) render(); };
    $('redABtn').onclick = function () { if (L.addCard(match, 'A', 'red')) render(); };
    $('redBBtn').onclick = function () { if (L.addCard(match, 'B', 'red')) render(); };
    $('undoBtn').onclick = function () { if (L.undo(match)) render(); };
    $('clockBtn').onclick = function () {
      if (!match) return;
      match.running = !match.running; render();
    };
    $('nextPhaseBtn').onclick = function () { L.nextPhase(match); render(); };
    $('endMatchBtn').onclick = function () {
      if (!match) return;
      match.phase = 'done'; match.running = false;
      finishMatch(); render();
    };
    $('newMatchBtn').onclick = function () { match = null; window.__match = null; $('feedback').textContent = ''; render(); };
    $('penScoredBtn').onclick = function () { L.shootoutKick(match, true); render(); };
    $('penMissedBtn').onclick = function () { L.shootoutKick(match, false); render(); };
    $('saveHistoryBtn').onclick = function () { $('tabBtn-history').click(); };
    $('exportBtn').onclick = function () {
      var blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'football-scorer-history.json'; a.click();
    };
    $('importFile').onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var data = JSON.parse(r.result);
          if (!L.validateHistoryImport(data)) throw new Error('bad');
          history = data; saveHistory(); renderHistory(); $('historyFeedback').textContent = '';
        } catch (err) { $('historyFeedback').textContent = t('errImport'); }
      };
      r.readAsText(f);
    };
    $('eraseBtn').onclick = function () {
      if ($('eraseInput').value !== 'DELETE') { $('historyFeedback').textContent = t('errErase'); return; }
      history = []; saveHistory(); $('eraseInput').value = ''; renderHistory();
    };
  }

  window.FootballLogic = L;
  window.FootballApp = { getMatch: function () { return match; }, getHistory: function () { return history; } };
  bind();
  renderLang();
  startClock();
})();
