// Catalogue des écrans (repris des captures du 07/10). Chaque écran : [nom, action dans la page, options].
// `go` = code JS exécuté dans la page après le démarrage. `scroll` = sélecteur du conteneur à faire défiler
// pour capturer aussi le bas. `full` = capture de toute la page par tranches.
// Ajouter ici chaque nouvel écran, pour qu'il soit vérifié à chaque passe.
const tab = (root, re) => `[...document.querySelectorAll('${root} .tab')].find(b=>/${re}/i.test(b.textContent)||/${re}/i.test(b.dataset.p||'')).click()`;
const ADRIEN = [
  ['a_bilan', [], { full: true }],
  ['a_seances', ["switchView('seances',document.querySelectorAll('.bni')[1])"], { full: true }],
  ['a_progression', ["switchView('progression',document.querySelectorAll('.bni')[2])"], { full: true }],
  ['a_settings', ['openSettings()']],
  ['a_pesee', ['openPeseeModal()']],
  ['a_logmodal', ['openLogModal()']],
  ['a_liveup', ['asOpen()'], { scroll: '#asOverlay .as-body,#asOverlay' }],
  ['a_detente', ['dzOpen()']],
  ['a_weekreport', ["(function(){var x=new Date();x.setDate(x.getDate()-((x.getDay()+6)%7)-7);wrOpen(x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'));})()"]],
  ['a_steps', ['STEPS.open()'], { scroll: '#stOverlay,.st-overlay' }],
  ['a_sleep', ['SLEEP.open()'], { scroll: '#sleepOverlay' }],
  ['a_nutria_profil', ['nutriAOpen()'], { scroll: '#nutria' }],
  ...['recettes', 'journee', 'semaine', 'calcul'].map(t => ['a_nutria_' + t, ['nutriAOpen()', `document.querySelector('#nutria .tab[data-p="${t}"]').click()`], { scroll: '#nutria' }]),
  ['a_nutria_recipe', ['nutriAOpen()', "document.querySelector('#nutria .tab[data-p=recettes]').click()", "document.querySelector('#nutria .rc').click()"], { scroll: '#na-sheet' }],
  ['a_liveflow', ['asOpen()', "document.querySelector('#asOverlay .as-bigcard').click()", "asPickLegsMain('leg_press')", 'AS.fromPrep=true;asToReady()'], { scroll: '#asOverlay' }],
];
const MELATI = [
  ['m_bilan', [], { full: true }],
  ['m_seances', ["switchView('seances',document.querySelectorAll('.bni')[1])"], { full: true }],
  ['m_progression', ["switchView('progression',document.querySelectorAll('.bni')[2])"], { full: true }],
  ['m_liveup', ['asOpen()'], { scroll: '#asOverlay .as-body,#asOverlay' }],
  ['m_pesee', ['openPeseeModal()']],
  ['m_detente', ['dzOpen()']],
  ['m_steps', ['STEPS.open()']],
  ['m_nutri', ['nutOpen()'], { scroll: '#nutri' }],
  ['m_nutri_recettes', ['nutOpen()', tab('#nutri', 'recet')], { scroll: '#nutri' }],
  ['m_nutri_journee', ['nutOpen()', tab('#nutri', 'journ')], { scroll: '#nutri' }],
  ['m_nutri_semaine', ['nutOpen()', tab('#nutri', 'semaine')], { scroll: '#nutri' }],
  ['m_liveflow', ['asOpen()', "document.querySelector('#asOverlay .as-bigcard').click()"], { scroll: '#asOverlay' }],
];
const POLITIQUE = [
  ['p_accueil', []],
];
module.exports = {
  adrien: { page: 'index.html', seed: 'adrienSeed', list: ADRIEN },
  melati: { page: 'melati.html', seed: 'melatiSeed', list: MELATI },
  politique: { page: 'politique/index.html', seed: null, list: POLITIQUE },
};
