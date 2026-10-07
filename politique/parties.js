// ============================================================
// PARTIS — métadonnées d'affichage (nom court, logo, page Wikipédia)
// Module POLITIQUE — chargé après data.js. Utilisé par quiz.js (logos dans
// les fiches, la page Comparer, l'annuaire) et par fetch_logos.js (Node) pour
// télécharger les logos depuis Wikipédia dans imgs/logos/<slug>.png.
// Clé = valeur EXACTE du champ `party` des candidats (data.js).
// ============================================================
(function (root) {
  var PARTIES = {
    'Lutte ouvrière (LO)':                        { short: 'LO',            slug: 'lutte-ouvriere',          wiki: 'Lutte ouvrière' },
    'Révolution Permanente':                      { short: 'RP',            slug: 'revolution-permanente',   wiki: 'Révolution permanente (organisation)' },
    'Nouveau Parti anticapitaliste (NPA)':        { short: 'NPA-R',         slug: 'npa',                     wiki: 'Nouveau Parti anticapitaliste' },
    'La France insoumise (LFI)':                  { short: 'LFI',           slug: 'lfi',                     wiki: 'La France insoumise' },
    'Place publique':                             { short: 'PP',            slug: 'place-publique',          wiki: 'Place publique (parti politique)' },
    'Parti socialiste (PS)':                      { short: 'PS',            slug: 'ps',                      wiki: 'Parti socialiste (France)' },
    'PS · La France humaine et forte':            { short: 'PS',            slug: 'ps',                      wiki: 'Parti socialiste (France)' },
    'Debout ! (gauche populaire, ex-LFI)':        { short: 'Debout !',      slug: 'debout',                  wiki: 'Debout ! (parti politique)' },
    "L'Après (ex-LFI)":                           { short: "L'Après",       slug: 'lapres',                  wiki: "L'Après (parti politique)" },
    'Les Écologistes (ex-EELV)':                  { short: 'Écologistes',   slug: 'les-ecologistes',         wiki: 'Les Écologistes (France)' },
    'Génération Écologie':                        { short: 'GE',            slug: 'generation-ecologie',     wiki: 'Génération écologie' },
    'Renaissance':                                { short: 'Renaissance',   slug: 'renaissance',             wiki: 'Renaissance (parti politique)' },
    'Renaissance (ex-LR) · soutient Philippe':    { short: 'Renaissance',   slug: 'renaissance',             wiki: 'Renaissance (parti politique)' },
    'Horizons':                                   { short: 'Horizons',      slug: 'horizons',                wiki: 'Horizons (parti politique)' },
    'Les Républicains (LR)':                      { short: 'LR',            slug: 'lr',                      wiki: 'Les Républicains' },
    'Nous France (indépendant, ex-LR)':           { short: 'Nous France',   slug: 'nous-france',             wiki: 'Nous France' },
    'Nouvelle Énergie (ex-LR)':                   { short: 'Nouvelle Énergie', slug: 'nouvelle-energie',     wiki: 'Nouvelle Énergie' },
    'Debout la France (DLF)':                     { short: 'DLF',           slug: 'dlf',                     wiki: 'Debout la France' },
    'La France humaniste':                        { short: 'France humaniste', slug: 'la-france-humaniste',  wiki: 'La France humaniste' },
    'Union populaire républicaine (UPR)':         { short: 'UPR',           slug: 'upr',                     wiki: 'Union populaire républicaine (2007)' },
    'Rassemblement national (RN)':                { short: 'RN',            slug: 'rn',                      wiki: 'Rassemblement national' },
    'Reconquête':                                 { short: 'Reconquête',    slug: 'reconquete',              wiki: 'Reconquête (parti politique)' },
    'Les Patriotes':                              { short: 'Patriotes',     slug: 'les-patriotes',           wiki: 'Les Patriotes (parti politique)' },
    'Parti communiste français (PCF)':            { short: 'PCF',           slug: 'pcf',                     wiki: 'Parti communiste français' }
  };
  function partyOf(c) { return (c && PARTIES[c.party]) || null; }
  function partyLogo(c) { var p = partyOf(c); return p ? 'imgs/logos/' + p.slug + '.png' : null; }
  function partyShort(c) { var p = partyOf(c); return p ? p.short : (c ? c.party : ''); }
  if (root.POL) { root.POL.PARTIES = PARTIES; root.POL.partyOf = partyOf; root.POL.partyLogo = partyLogo; root.POL.partyShort = partyShort; }
  if (typeof module !== 'undefined' && module.exports) module.exports = { PARTIES: PARTIES };
})(typeof window !== 'undefined' ? window : {});
