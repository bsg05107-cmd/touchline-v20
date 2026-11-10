/* TOUCHLINE CLASSIC v23 runtime helpers */
(() => {
  'use strict';
  document.documentElement.classList.add('touchline-classic-v23');
  document.title = 'TOUCHLINE Classic — Draft Cup';

  let skipping = false;
  function skipPackLikeIntro() {
    const button = document.querySelector('.ace-screen-clean .ace-open');
    if (!button || skipping) return;
    skipping = true;
    requestAnimationFrame(() => {
      button.click();
      setTimeout(() => { skipping = false; }, 120);
    });
  }

  function statRows(player) {
    if (!player || !player.stats) return [];
    if (player.positions && player.positions.includes('GK')) {
      return [
        ['DIV', player.stats.diving], ['HAN', player.stats.handling],
        ['KIC', player.stats.kicking], ['REF', player.stats.reflexes],
        ['POS', player.stats.positioning], ['OVR', player.ovr]
      ];
    }
    return [
      ['PAC', player.stats.pace], ['SHO', player.stats.shooting],
      ['PAS', player.stats.passing], ['DRI', player.stats.dribbling],
      ['DEF', player.stats.defending], ['PHY', player.stats.physical]
    ];
  }

  function addCandidateSummary() {
    const sheet = document.querySelector('.candidate-sheet');
    if (!sheet || sheet.querySelector('.classic-selection-summary')) return;
    const selected = sheet.querySelector('.candidate-card.selected');
    if (!selected) return;
    const id = selected.dataset.candidate;
    let player = null;
    try {
      if (typeof PLAYERS !== 'undefined') player = PLAYERS.find(p => p.id === id);
    } catch (_) {}
    if (!player) return;
    const chem = selected.querySelector('.chem-pill')?.textContent?.trim() || '';
    const summary = document.createElement('section');
    summary.className = 'classic-selection-summary';
    summary.innerHTML = `
      <div class="classic-selection-head">
        <strong>${String(player.name || '').replace(/[&<>"']/g, '')}</strong>
        <span>${chem}</span>
      </div>
      <div class="classic-stats">
        ${statRows(player).map(([label, value]) => `
          <div class="classic-stat"><b>${value}</b><small>${label}</small></div>
        `).join('')}
      </div>`;
    const action = sheet.querySelector('.sheet-action');
    if (action) sheet.insertBefore(summary, action);
  }

  function normalizeCopy() {
    const head = document.querySelector('.ace-choices-head h1');
    if (head) head.textContent = '첫 스타 선택';
    const cup = document.querySelector('.cup-brand h1');
    if (cup) cup.textContent = '유럽 클럽 토너먼트';
  }

  function enhance() {
    skipPackLikeIntro();
    addCandidateSummary();
    normalizeCopy();
  }

  const app = document.getElementById('app');
  if (app) new MutationObserver(enhance).observe(app, { childList: true, subtree: true });
  enhance();
})();
