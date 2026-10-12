// ============================================================
// QUIZ POLITIQUE 2027 — POSITIONS PAR QUESTION + MATCHING « PROGRAMME »
// Module POLITIQUE — totalement isolé du module muscu. Chargé après data.js.
//
// PRINCIPE (refonte du 29/08/2026, demande Adrien) :
//   On ne compare plus l'utilisateur à un « camp » (moyenne gauche/droite par
//   thème) mais à la POSITION RÉELLE de chaque candidat sur CHAQUE question,
//   telle qu'elle ressort de son programme, de ses votes et de ses déclarations.
//   Le RN peut donc être noté comme LFI sur la retraite à 60/62 ans et comme
//   LR sur l'immigration : chaque question compte pour elle-même, rien n'est
//   « recentré » par la moyenne.
//
// ÉCHELLE : chaque question a ses options notées de 0 (droite) à 10 (gauche)
//   dans data.js. La position d'un candidat est un nombre sur CETTE échelle,
//   en général égal au score de l'option qu'il choisirait (valeur intermédiaire
//   quand il est entre deux options). L'affichage « qui répond quoi » place
//   chaque candidat sous l'option la plus proche de sa position.
//
// CONCORDANCE (inspirée de monvote2027.fr/methodologie, + pondération) :
//   d = |réponse − position|  (0 … 10)
//   concordance = 1 − d / 5    →  +1 accord parfait · 0 neutre (d = 5) · −1 opposé
//   (deux options voisines d'une question à 5 niveaux sont à d = 2,5 → +0,5,
//    exactement le barème ++/+/0/−/−− de monvote2027)
//   Score candidat = Σ coef(q) × concordance(q) ÷ Σ coef(q), coef = pertinence
//   perso (1→1, 2→2, 3→4, 4→7, 5→10) × 2 si question essentielle (data.js).
//   Affichage = (score + 1) ÷ 2 × 100 → 100 % accord total, 50 % neutre, 0 % opposé.
//   Les questions non répondues ou sans position connue sont ignorées.
//
// DONNÉES : une ligne par question = 22 FAMILLES (colonnes ci-dessous) ;
//   chaque candidat hérite de sa famille, les OVERRIDES individuels priment.
//   Sources : programmes 2022/2027 et sorties connues au 29/08/2026 (soir), votes à l'Assemblée
//   et au Sénat (retraites 2023, loi immigration 2024, Zucman 2025, fin de vie
//   2025-26, ZFE 2025, Duplomb 2025…), déclarations publiques (voir actus.js).
//   Positions = appréciation éditoriale datée ; à corriger ici si besoin.
// ============================================================
(function () {
  'use strict';
  var POL = window.POL; if (!POL) return;

  // ── Colonnes (ordre FIXE) ──
  var FAMILIES = ['LO', 'LFI', 'APRES', 'RUFFIN', 'EELV', 'BATHO', 'PCF', 'PS', 'PP', 'PSSD', 'REN', 'DARM', 'HOR', 'DDV', 'LR', 'LISN', 'BERT', 'DLF', 'UPR', 'PATR', 'RN', 'REC'];
  var FAMILY_LABELS = {
    LO: 'Extrême gauche trotskiste (LO, RP, NPA)', LFI: 'La France insoumise', APRES: "L'Après (ex-LFI)", RUFFIN: 'Debout ! (gauche populaire)',
    EELV: 'Les Écologistes', BATHO: 'Génération Écologie', PCF: 'Parti communiste', PS: 'PS aile gauche', PP: 'Place publique', PSSD: 'PS social-démocrate',
    REN: 'Renaissance', DARM: 'Renaissance aile droite', HOR: 'Horizons', DDV: 'La France humaniste', LR: 'Les Républicains', LISN: 'Nouvelle Énergie (libéral)',
    BERT: 'Nous France (gaulliste social)', DLF: 'Debout la France', UPR: 'UPR (Frexit)', PATR: 'Les Patriotes', RN: 'Rassemblement national', REC: 'Reconquête'
  };
  // Candidat → famille
  var FAMILY_OF = {
    // (12/10/2026) nouveaux : Maurel (GRS, gauche républicaine souverainiste → PCF le plus proche), Cazeneuve (La Convention → social-démocratie PSSD), Le Maire (→ REN)
    'Emmanuel Maurel': 'PCF', 'Bernard Cazeneuve': 'PSSD', 'Bruno Le Maire': 'REN',
    'Nathalie Arthaud': 'LO', 'Anasse Kazib': 'LO', 'Selma Labib': 'LO',
    'Jean-Luc Mélenchon': 'LFI', 'Clémentine Autain': 'APRES', 'François Ruffin': 'RUFFIN',
    'Marine Tondelier': 'EELV', 'Delphine Batho': 'BATHO', 'Fabien Roussel': 'PCF',
    'Olivier Faure': 'PS', 'Jérôme Guedj': 'PS', 'Ségolène Royal': 'PS', 'Raphaël Glucksmann': 'PP',
    'François Hollande': 'PSSD', 'Karim Bouamrane': 'PSSD', 'Philippe Brun': 'PSSD',
    'Gabriel Attal': 'REN', 'Gérald Darmanin': 'DARM', 'Édouard Philippe': 'HOR', 'Dominique de Villepin': 'DDV',
    'Bruno Retailleau': 'LR', 'Laurent Wauquiez': 'LR', 'David Lisnard': 'LISN', 'Xavier Bertrand': 'BERT',
    'Nicolas Dupont-Aignan': 'DLF', 'François Asselineau': 'UPR', 'Florian Philippot': 'PATR',
    'Marine Le Pen': 'RN', 'Jordan Bardella': 'RN', 'Éric Zemmour': 'REC'
  };

  // ── Lignes par question : 22 valeurs (0 = droite … 10 = gauche, échelle de la question) ──
  //            LO   LFI  APRES RUF  EELV BATHO PCF  PS   PP   PSSD REN  DARM HOR  DDV  LR   LISN BERT DLF  UPR  PATR RN   REC
  var ROWS = {
    // ÉCONOMIE
    1:   '10   10   10   10   10   7.5  10   10   7.5  5    2.5  2.5  2.5  5    1    0    2.5  2.5  5    2.5  1.5  0',   // impôts
    2:   '10   10   10   10   7    7    10   7    6    5    3    3    1.5  3    1.5  0    3    7    8.5  10   7    3',   // âge retraite
    3:   '10   7    7    7    7    7    8.5  7    5    5    1    1    1    3.5  1    1    3.5  3.5  5    7    2.5  1',   // SMIC
    4:   '10   10   10   10   7    7    10   7    7    5    3    3    3    5    3    0    5    8.5  8.5  8.5  7    3',   // privatisations
    5:   '9    9    9    9    6    6    9    6    6    3    3    3    1.5  3    0    0    3    3    6    6    2    1.5',  // dette (01/09 : RN 3 → 2, règle d'or 3 % constitutionnalisée + 125 Md€ d'économies, Le Monde 29-31/08)
    6:   '5    10   10   10   6    8    10   6    7    4.5  3    3    3    6    3    1.5  6    10   10   10   10   6',   // protectionnisme
    7:   '10   10   10   10   10   10   10   8    6    4.5  1    3    1.5  6    0    0    3    3    6    6    4.5  0',   // droit du travail
    8:   '6    10   10   6    10   10   3    6    4.5  4.5  3    3    3    3    0    0    1.5  0    3    0    0    0',   // nucléaire / ENR
    9:   '9    8    8    9    9    7    9    8    7    5    2    3    3    5    2    1    3    2    5    7    2    1',   // pouvoir d'achat
    10:  '10   10   10   9    9    9    9    7.5  7.5  6    1.5  1.5  1.5  6    0    0    0    0    3    3    0    0',   // héritage
    11:  '8    8    8    8    8    8    8    8    5    5    1    0    1    5    0    0    3    3    5    5    4    0',   // chômage
    12:  '7    8.5  10   7    10   10   7    7    7    5.5  2.5  1    2.5  4    1    1    4    4    4    4    3    1',   // agriculture
    13:  '7    7    7    7    6    6    7    6    6    6    6    6    6    7    5    4    7    7    7    7    7    6',   // industrie
    14:  '10   10   10   7    10   10   8.5  7    7    4    5    4    4    7    2.5  0    4    7    7    7    5.5  4',   // planification
    15:  '10   8    10   10   8    8    8    6    6    6    6    3    3    6    3    0    3    3    3    3    1.5  0',   // startups
    101: '10   10   10   10   8.5  8.5  10   8.5  7.5  6    3    3    1.5  6    0    0    3    3    3    6    3    0',   // taxe Zucman
    102: '10   10   10   10   8    8    10   8    8    5.5  3    3    3    5.5  3    1.5  3    5.5  8    8    8    1.5',  // capitalisation
    103: '10   10   10   7.5  7.5  7.5  10   7.5  7.5  5    5    2.5  0.5  5    0.5  0    2.5  2.5  5    5    4    0',   // fonctionnaires (01/09 : HOR 2,5 → 0,5 et LR 1 → 0,5 — Philippe ET Retailleau assument « −250/300 000 postes » = l'option la plus dure, débat Medef 27/08)
    // SOCIAL & SANTÉ
    16:  '10   10   10   10   8.5  7    10   7    7    6    5    5    4    7    3    3    5    7    7    7    7    3',   // hôpital
    17:  '6    9    9    9    7.5  9    7.5  9    6    6    4    4    4    6    4    2    4    6    6    6    4    4',   // déserts médicaux
    18:  '10   10   10   10   7    7    10   7    7    5    3    3    3    5    3    1.5  3    6    7    7    4    3',   // Sécu
    19:  '7    8.5  8.5  7    8.5  7    7    7    5    5    1.5  0    1.5  5    0    0    1.5  3    5    5    3    0',   // RSA
    20:  '10   10   10   10   8    8    10   8    8    6.5  5    5    5    5    3.5  2    5    5    8    8    5    2',   // dépendance
    21:  '10   10   10   7    7    7    10   7    7    5    4    3    3    5    1    1    3    3    5    5    3    1',   // logement
    22:  '7    10   10   7    10   10   7    8.5  7    7    5.5  4    4    4    4    2    4    4    4    4    2    0',   // égalité F-H
    23:  '10   10   10   8    10   10   10   10   10   8    9    8    8    5    1.5  3    5    1.5  3    3    4    0',   // IVG Constitution
    24:  '7    8.5  8.5  7    8.5  7    7    7.5  7    7    7    4    5    3    1.5  3    3    1.5  5    5    3    1.5',  // fin de vie
    25:  '5    7    7    5    7    7    2    7    7    3    1.5  0    1.5  3    0    3    0    0    3    0    0    0',   // cannabis
    26:  '10   10   10   10   7    7    10   7    7    5    2    1    1    5    1    1    3    3    5    7    3    1',   // pauvreté
    104: '10   10   10   10   8    8    10   8    8    8    3    3    3    6    3    1.5  3    8    8    8    8    6',   // année blanche
    // IMMIGRATION
    27:  '10   8.5  10   6    7.5  5    5    6    5    5    2.5  1.5  2.5  5    1    1.5  2.5  0    2.5  0    0    0',   // immigration légale (01/09 : HOR 3,5 → 2,5 — « fermer les vannes », « lent étouffement » ; il refuse le moratoire Darmanin mais dit clairement « trop »)
    28:  '10   8.5  10   7    8.5  7    7    7    5    5    4    3    3    5    1    1.5  3    0    3    0    0    0',   // sans-papiers
    29:  '10   8.5  10   7    8.5  7    7    7    6    5    3    3    2    5    1.5  3    3    0    3    0    0    0',   // asile
    30:  '10   10   10   7    10   7    4    7    5    4    3    1.5  3    5    0    1.5  3    0    3    0    0    0',   // intégration
    31:  '10   8    10   6    8    6    6    6    6    6    2    1    2    6    1    2    2    0    2    0    0    0',   // regroupement familial
    32:  '10   10   10   5    8    5    4    5    5    4    3    2    3    5    1    2    2    1    4    0    0    0',   // voile
    33:  '10   10   10   7    8.5  7    7    7    7    6    5    3    4    7    3    3    3    1.5  3    0    0    0',   // AME
    34:  '10   10   10   7    10   7    6    8.5  7    7    5    3    5    7    3    3    3    1.5  3    0    0    0',   // « prennent le travail »
    35:  '10   10   10   7    10   7    7    8.5  8.5  7    5    3    5    7    1.5  3    3    0    3    0    1.5  0',   // identité menacée
    36:  '10   8.5  10   7    8.5  7    7    7    5.5  4    2    0    2    4    0    0    2    0    2    0    0    0',   // Frontex
    105: '10   10   10   8    10   8    8    9    8    8    5    2.5  5    8    2.5  2.5  5    1    2.5  0    0    0',   // priorité nationale
    106: '10   10   10   6.5  10   6.5  6.5  8    6.5  6.5  5    3    5    6.5  3    3    4    1.5  3    0    0    0',   // droit du sol
    // SÉCURITÉ & JUSTICE
    37:  '10   8    10   6    8    6    4.5  6    6    4.5  3    1.5  3    6    0    0    1.5  0    3    0    0    0',   // juges
    38:  '10   10   10   7    8.5  7    4    7    7    5    3    1.5  3    5    0    1.5  1.5  0    3    0    0    0',   // violences policières
    39:  '6    8    8    6    8    6    3    6    6    4.5  1.5  0    1.5  6    0    1.5  0    0    3    0    0    0',   // narcotrafic
    40:  '10   9    9    8    9    8    8    8    6    4    3    0    3    4    0    2    2    0    6    5    0    0',   // antiterrorisme
    41:  '10   8.5  10   7    8.5  7    6    7    6    5    3.5  2    3.5  5    2    2    2    2    5    2    2    2',   // prisons
    42:  '10   8.5  10   7    8.5  7    6    7    6    5    3    1.5  3    5    1.5  1.5  1.5  0    5    0    0    0',   // mineurs
    43:  '10   10   10   8.5  10   10   8.5  10   8.5  7    7    5.5  5.5  7    4    3    4    4    4    4    4    2',   // féminicides
    44:  '10   8.5  10   7    8.5  7    6    7    6    5    3    0    3    5    0    0    1.5  0    5    3    1.5  0',   // vidéosurveillance
    45:  '7    7    7    5.5  7    7    5.5  7    7    5.5  4    4    4    4    4    4    4    3    4    4    4    2',   // armes
    46:  '7    9    9    9    9    9    7    8    9    7    5.5  2.5  4    7    2.5  4    4    4    7    4    2.5  2.5',  // cybercriminalité
    // ENVIRONNEMENT
    47:  '7    8.5  10   7    10   10   7    7    7    6    5    4    5    6    3    3    4    3    3    1.5  3    1.5',  // climat
    48:  '5    7    8.5  5    8.5  8.5  5    7    7    5    4    3    4    5    1.5  1.5  1.5  0    3    0    0    0',   // voiture
    49:  '7    8.5  10   7    10   10   6    7    7    5    3    3    3    5    1.5  1.5  3    3    4    3    2    0',   // pesticides
    50:  '9    9    9    9    8    8    9    8    7    6    5    3    5    6    2    2    2    0    2    0    0    0',   // taxe carbone
    51:  '5.5  10   10   5.5  10   10   4    7    7    5.5  5.5  4    5.5  5.5  0    2    0    0    4    0    0    0',   // éoliennes
    52:  '10   10   10   8.5  10   10   7    8.5  8.5  7    5    3    4    5    3    1.5  3    4    5    3    3    1.5',  // pollueurs
    53:  '8    10   10   8    10   10   8    8    8    5    5    3.5  5    6.5  2    2    3.5  3.5  5    2    2    2',   // adaptation
    54:  '7    8.5  10   7    10   10   5.5  7    7    4    2    2    2    5.5  0    0    0    2    4    2    0    0',   // ZAN
    55:  '6    8    10   6    8.5  10   3    6    6    4.5  4    3    3    6    1.5  0    1.5  1.5  3    0    1.5  0',   // consommer moins
    107: '2    4    7    3    10   8.5  3    6    7    5    5    3    5    5    0.5  0.5  0.5  0.5  3    0.5  0.5  0.5',  // ZFE
    // EUROPE & MONDE
    56:  '3    3    4    3    8.5  5    3    7    10   8.5  10   7    8.5  7    4    5    5    1.5  0    0    3    3',   // UE
    57:  '4.5  3    4.5  3    8    6    3    8    10   8    10   8    8    8    6    6    6    3    0    0    4.5  6',   // euro
    58:  '10   8.5  10   8.5  8.5  7    8.5  7    8.5  7    6    5    5    7    5    3    5    7    7    7    4    3',   // GAFAM
    59:  '3    0    1.5  1.5  8.5  5    0    7    8.5  7    8.5  7    7    7    4    5    5    0    0    0    0    1.5',  // armée européenne
    60:  '4    4.5  6    6    7    6    4.5  7    7    7    7    7    7    6    6.5  6.5  6.5  3.5  3    3    4.5  3.5',  // Ukraine
    61:  '8    9    9    9    8    9    9    7    7    5.5  4    4    4    7    7    4    7    8    9    9    8    5.5',  // Mercosur
    62:  '7    7    7    7    6    7    7    6    7    4.5  7    4.5  4.5  7    4.5  4    4.5  7    7    7    6.5  4',   // Chine / USA (01/09 : PP 5 → 7 — Glucksmann est LE candidat de la 3e voie européenne : Chine adversaire, 2 000 Md€ de commande publique réservés aux Européens)
    63:  '9    10   10   8    9    8    9    8    8    6    2.5  2    2.5  8    0    0    2    0    4    0    0    0',   // aide au développement
    64:  '2    2    2    3.5  7    5    2    5.5  6    6    5    6    6    3.5  5.5  6    6    2    2    2    2    3.5',  // OTAN
    108: '10   7.5  8.5  7.5  4    5.5  8.5  4    3    4    3    3    3    5.5  1.5  1.5  3    5.5  5.5  5.5  5    4',   // réarmement 3 %
    109: '9.5  9.5  9.5  8    9.5  8    9.5  8    7.5  7    7    4    4    9.5  3    4    4    7    8    7    2    2',   // Palestine
    // INSTITUTIONS
    65:  '7    10   10   8.5  8.5  7    8.5  7    6    3    3    3    2    3    1    2    2    5    2    5    4    1',   // VIe République
    66:  '8    8    8    8    8    8    8    7    6    5    4    4    2.5  5    1    1    2.5  8    8    8    8    7',   // proportionnelle
    67:  '4    10   8.5  8.5  7    8.5  7    5.5  4    4    5.5  7    4    5.5  7    7    7    8.5  8.5  10   8.5  7',   // référendum / RIC
    68:  '3    3    4    3    6.5  4.5  3    6    4.5  5    4.5  6    6    4.5  6    6.5  6.5  3    3    3    3    3',   // décentralisation
    69:  '10   10   10   10   8.5  10   8.5  7    8.5  7    4    4    4    5.5  4    2    4    7    8.5  8.5  7    4',   // lobbies
    70:  '4    6.5  6.5  6.5  6.5  5    6.5  5    5    5    4.5  4    4    4    4    4    4    6.5  6.5  6.5  5.5  4',   // vote obligatoire
    71:  '8    9    9    8    8    8    8    8    8    6    4    2.5  4    6    1    2.5  2.5  1    4    1    1    1',   // indépendance justice
    72:  '10   10   10   8.5  8.5  7    8.5  6    5    5    5    5    3    5    1    3    3    5    5    7    5    3',   // Sénat
    73:  '6    6.5  6.5  6.5  6.5  6.5  6    5    6.5  6    6.5  3.5  3.5  4.5  3.5  3.5  3.5  4.5  4.5  6.5  3.5  3.5',  // cumul
    74:  '10   10   10   10   9    8    10   8    8    6    4    4    4    6    4    2.5  4    6    6    6    6    4',   // financement partis
    110: '7.5  9    9    9    7.5  6.5  7.5  6.5  6    4    5    2.5  3.5  4    1.5  1.5  3.5  3    4    5    2    1.5',  // exécutif vs Parlement
    // SOCIÉTÉ & VALEURS
    75:  '10   10   10   8.5  10   8.5  8.5  10   10   8.5  8.5  5    6    6    3.5  5    4    2    3.5  6    3.5  2',   // mariage pour tous
    76:  '8.5  7    8.5  7    7    7    6    7    7    6    6    5    6    5    1.5  3    2    1.5  3    4    1.5  0',   // PMA / GPA
    77:  '8.5  7    8.5  5    7    5    4    4    5    3    1.5  1.5  3    5    0    1.5  1.5  1.5  3    0    0    0',   // laïcité école
    78:  '10   10   10   8    10   6    4.5  8    6    4.5  3    1.5  3    6    0    1.5  3    0    3    1.5  0    0',   // identité nationale
    79:  '10   10   10   7    10   10   7    10   8.5  7    6    4    5    5    3    3    4    3    4    3    3    0',   // féminisme
    80:  '10   10   10   7    10   7    5    7    6    5    5    3    4    5    1.5  3    3    1.5  3    1.5  0    0',   // racisme systémique
    81:  '5.5  7    8.5  5.5  8.5  7    7    7    8.5  7    7    5.5  4    4    2.5  2    4    2    0    0    0    0',   // liberté d'expression
    82:  '8.5  10   10   6    10   7    6    8.5  7    5    5    3    4    5    1.5  1.5  1.5  0    3    3    1.5  0',   // droits trans
    83:  '8.5  10   10   7    10   7    8.5  7    7    7    6    3    4    7    0    1.5  3    0    4    1.5  0    0',   // colonisation
    84:  '4    5.5  7    4    5.5  4    3    4    4    3    3    2    3    5.5  2    3    3    2    4    2    2    2',   // religion espace public
    111: '6    6.5  6.5  5    6.5  5    5.5  4.5  5.5  4.5  4    4    4.5  4.5  4    5.5  4.5  4    6    6    4.5  4',   // réseaux sociaux < 15 ans
    // ÉDUCATION & CULTURE
    85:  '10   8.5  10   7    8.5  7    8.5  6    6    5    4.5  3    3    4    1.5  1.5  3    1.5  3    3    1.5  0',   // école privée
    86:  '10   8.5  8.5  8.5  8.5  7    8.5  7    7    5.5  5.5  4    6    5.5  4    2.5  4    5.5  5.5  5.5  5.5  2.5',  // salaires profs
    87:  '10   10   10   8.5  8.5  7    10   7    7    6    5    4    3    6    2    1.5  4    6    7    7    6    1.5',  // frais de fac
    88:  '5    5    5    4.5  5    4.5  5    5    5    5    5    5    5    4.5  4.5  5    4.5  4.5  5    5    4.5  4.5',  // écrans à l'école
    89:  '5    5.5  5.5  5    5.5  5    5    5.5  5.5  5.5  6    5.5  5.5  5    5    5.5  5    5    5    5    5    4.5',  // IA devoirs
    90:  '7    10   10   7    8.5  7    8.5  7    7    5.5  5.5  4    4    7    2.5  2    4    4    5.5  4    2.5  2',   // culture
    91:  '4    3    4    4    8    6    4    6    6    6    5    4    6    4    6    6    6    3    2    3    3    2',   // langues régionales
    92:  '5    6    6    6    5    5    6    6    5    6    7    6    6    5    5.5  5    6    5    5    5    6    5',   // sport à l'école
    93:  '6    6    6    6    6    6    6    6    6    5    4    3    4    4.5  3    3    4    3    4    4.5  3    3',   // redoublement
    94:  '6    2.5  6    5.5  6    5.5  5.5  5    4    4    4.5  3    4    4    2.5  3    2.5  2.5  3    2.5  2.5  2.5',  // service national
    95:  '8.5  8.5  10   7    8.5  7    8.5  7    7    5.5  2.5  2.5  2.5  4    1    1    1    1    4    4    1    1',   // orientation
    96:  '8.5  10   10   7    8.5  7    7    7    6    5    5    3    4    6    1.5  1.5  3    0    4    1.5  0    0',   // histoire coloniale
    97:  '8.5  10   10   7    8.5  7    8.5  8.5  7    5.5  4    2.5  2.5  4    0    0    2    0    4    2    0    0',   // mixité sociale
    98:  '6    6.5  6.5  6    6.5  6    6    6.5  6.5  6    6    5    5    6    5    5    5    5    5    5    4.5  4',   // éducation aux médias
    99:  '5.5  5.5  5.5  5.5  5.5  5.5  5.5  5.5  5.5  5    5    5    5    6    5    5    5    5    5    5    5    5',   // philosophie
    100: '10   10   10   8.5  8.5  7    8.5  8    7    6    5    4    4    6    3    1.5  4    5    6    7    5    1.5',  // bourses
    112: '8    8    9    7    8    7    7    8    7    5.5  4    2.5  4    4    1    2.5  2.5  1    4    4    1    1'    // uniforme
  };

  // ── Exceptions individuelles (priment sur la famille) ──
  var OVERRIDES = {
    // Philippe Brun : dose de capitalisation collective, co-auteur des propositions fiscales PS (taxe Zucman), retraite 62 ans ; « Produire » (19/08) : retour au monopole public d'EDF, « cinq usines par département »
    'Philippe Brun': { 1: 7.5, 2: 7, 4: 8.5, 10: 7, 13: 7, 101: 8.5, 102: 3 },
    // Hollande (« Unir », 26/08 + bonnes feuilles 31/08) : loi Taubira, fin de vie favorable, retraite « 63 ans », resserrement du regroupement familial, quotas sociaux dans le privé sous contrat (financement maintenu), pensions +1 %/an max pendant 5 ans ; 01/09 : REFUSE la taxe Zucman (contribution > 10 M€ à la place) → 101: 3 ; quotas d'immigration de travail → 27: 4
    'François Hollande': { 1: 6, 2: 5, 24: 7, 27: 4, 31: 3, 83: 7, 85: 5, 101: 3, 102: 4, 104: 4, 110: 5.5 },
    // Bouamrane : ligne laïque et « ordre républicain » plus marquée que le PS
    'Karim Bouamrane': { 30: 4, 32: 4, 77: 3, 37: 4.5 },
    // Royal : écologie plus forte que le PS moyen (COP21), pro-nucléaire modérée
    'Ségolène Royal': { 47: 10, 49: 8.5, 55: 7, 8: 6, 94: 4 },
    // Kazib / Labib (NPA, RP) : antinucléaires et plus écologistes que LO
    'Anasse Kazib': { 8: 10, 47: 10, 48: 7, 51: 10, 55: 8 },
    'Selma Labib': { 8: 10, 47: 10, 48: 7, 51: 10, 55: 8 },
    // Arthaud (LO) : le nucléaire n'est pas un combat de LO
    'Nathalie Arthaud': { 8: 6 },
    // Wauquiez : plus ouvert que Retailleau sur l'IVG constitutionnelle / fin de vie (votes 2024-25)
    'Laurent Wauquiez': { 23: 3, 24: 3 },
    // Bardella : ligne RN, un temps plus « libéral » sur la capitalisation et l'euro — rallié à la ligne Le Pen après le départ de Durvye (29/08 : « côte à côte ») ; 31/08 : refuse « une police du vêtement » sur le voile (nuance publique avec Le Pen/Tanguy) → 32: 1
    'Jordan Bardella': { 32: 1, 57: 6, 102: 7 },
    // Darmanin : pour la constitutionnalisation de l'IVG, contre la légalisation du cannabis (ligne DARM), référendum immigration
    'Gérald Darmanin': { 23: 8 },
    // Lisnard : libéral mais ouvert au débat sur le cannabis et fort décentralisateur (AMF)
    'David Lisnard': { 25: 3, 68: 7 },
    // Villepin : très pro-Palestine, gaulliste sur l'OTAN
    'Dominique de Villepin': { 10: 7, 50: 7, 64: 3.5, 109: 9.5 },
    // Faure (Blois, 28/08) : la taxation des héritages, « ce qu'il y a de moins libéral », au cœur de son programme (successions > 2 M€, ISF 1 % > 10 M€)
    'Olivier Faure': { 10: 9 },
    // Guedj : gauche « républicaine, universaliste, laïque » — laïcité stricte
    'Jérôme Guedj': { 32: 4, 77: 3, 84: 3 },
    // Attal (Le Monde 25/08, Medef, tribune 16/08) : certificat d'études et brevet obligatoire, fermeture des 100 collèges ghettos, +200 € pour les profs, référendum pour interdire les réseaux sociaux aux moins de 15 ans ; 01/09 : c'est LUI qui a lancé l'expérimentation de la tenue unique et le « retour de l'autorité » → 112: 2.5 (la ligne REN « au choix des établissements » le sous-cotait)
    'Gabriel Attal': { 67: 6, 86: 6.5, 93: 3, 97: 6, 111: 4.5, 112: 2.5 }
  };
  // Emmanuel Maurel (franceinfo 04/09, débats de la primaire LCI 23/09 · France 2 01/10 · BFMTV 04/10) : positions déclarées pendant la primaire
  OVERRIDES['Emmanuel Maurel'] = {2: 7, 3: 8.5, 4: 8.5, 5: 8, 6: 8.5, 8: 3, 9: 9, 10: 8, 14: 8.5, 16: 8.5, 21: 8.5, 28: 5.5, 56: 4, 59: 4, 60: 7, 67: 7, 77: 3, 85: 8.5, 95: 7, 101: 10, 102: 8.5, 106: 7.5, 108: 4, 109: 9.5, 110: 8};
  // Bernard Cazeneuve (« Lettre aux Français », Public Sénat 17/07) : dose de proportionnelle, Ve République conservée, redressement des comptes — le reste suit la famille sociale-démocrate
  OVERRIDES['Bernard Cazeneuve'] = {5: 3, 66: 4, 110: 5};
  // Bruno Le Maire (manifeste 23/08, plan du 06/09 — franceinfo) : gel des pensions/prestations, ≈100 Md€ d'économies, 65 ans évoqués, capitalisation complémentaire, gel des recrutements, gel de l'IR, fédération européenne à six
  OVERRIDES['Bruno Le Maire'] = {1: 4, 2: 0.5, 5: 1, 56: 9, 102: 3, 103: 3, 104: 1};
  // ── MAJ du 12/10/2026 (sweep de 7 agents, fenêtre 01/09 → 12/10) : positions corrigées, une ligne par candidat ──
  // Marine Le Pen : Q102 8→4 (AFP via Orange 06/10/2026 06/10) · Q103 4→2.5 (Public Sénat 06/10/2026 06/10) · Q5 2→1.5 (Public Sénat 06/10/2026 06/10) · Q21 3→2 (France 3 Hauts-de-France 13/09/2026 13/09)
  OVERRIDES["Marine Le Pen"] = Object.assign(OVERRIDES["Marine Le Pen"] || {}, {5: 1.5, 21: 2, 102: 4, 103: 2.5});
  // Jordan Bardella : Q102 7→4 (AFP via Orange 06/10/2026 06/10) · Q103 4→2.5 (Public Sénat 06/10/2026 06/10) · Q5 2→1.5 (Public Sénat 06/10/2026 06/10)
  OVERRIDES["Jordan Bardella"] = Object.assign(OVERRIDES["Jordan Bardella"] || {}, {5: 1.5, 102: 4, 103: 2.5});
  // Nicolas Dupont-Aignan : Q56 1.5→0 (franceinfo 19/09/2026 19/09) · Q60 3.5→3 (franceinfo 19/09/2026 19/09)
  OVERRIDES["Nicolas Dupont-Aignan"] = Object.assign(OVERRIDES["Nicolas Dupont-Aignan"] || {}, {56: 0, 60: 3});
  // Bruno Retailleau : Q106 3→0 (BFMTV 08/09/2026 08/09) · Q2 1.5→2.5 (franceinfo/LCP 22/09/2026 22/09) · Q102 3→2 (franceinfo/LCP 22/09/2026 22/09) · Q67 7→8 (Le Figaro 02/09/2026 02/09) · Q104 3→5 (Public Sénat 16/09/2026 16/09) · Q32 1→2 (Le JDD 12/09/2026 12/09) · Q77 0→1.5 (Le JDD 12/09/2026 12/09) · Q49 1.5→1 (Le Télégramme 16/09/2026 16/09)
  OVERRIDES["Bruno Retailleau"] = Object.assign(OVERRIDES["Bruno Retailleau"] || {}, {2: 2.5, 32: 2, 49: 1, 67: 8, 77: 1.5, 102: 2, 104: 5, 106: 0});
  // Laurent Wauquiez : Q104 3→4.5 (Les Échos/AFP 04/10/2026 04/10)
  OVERRIDES["Laurent Wauquiez"] = Object.assign(OVERRIDES["Laurent Wauquiez"] || {}, {104: 4.5});
  // Dominique de Villepin : Q97 4→6.5 (La France humaniste 01/09/2026 01/09) · Q85 4→5.5 (La France humaniste 01/09/2026 01/09) · Q86 5.5→6 (La France humaniste 01/09/2026 01/09) · Q38 5→6.5 (franceinfo 05/10/2026 05/10) · Q111 4.5→4 (La France humaniste 01/09/2026 01/09)
  OVERRIDES["Dominique de Villepin"] = Object.assign(OVERRIDES["Dominique de Villepin"] || {}, {38: 6.5, 85: 5.5, 86: 6, 97: 6.5, 111: 4});
  // Édouard Philippe : Q2 1.5→0.5 (franceinfo 29/09/2026 29/09) · Q27 2.5→1.5 (AFP via Boursorama 09/10/2026 08/10) · Q31 2→0.5 (AFP via Boursorama 09/10/2026 08/10) · Q29 2→1.5 (JDN 09/10/2026 08/10) · Q110 3.5→1.5 (franceinfo 08/10/2026 08/10) · Q76 6→5 (franceinfo 08/10/2026 08/10) · Q9 3→2 (franceinfo 08/10/2026 08/10) · Q37 3→1.5 (edouardphilippe.fr, page « Pour une Fran 12/10)
  OVERRIDES["Édouard Philippe"] = Object.assign(OVERRIDES["Édouard Philippe"] || {}, {2: 0.5, 9: 2, 27: 1.5, 29: 1.5, 31: 0.5, 37: 1.5, 76: 5, 110: 1.5});
  // Gabriel Attal : Q5 3→2 (attalpresident.fr 23/09 et 04/10/2026 03/10) · Q14 5→5.5 (attalpresident.fr 23/09/2026 23/09) · Q42 3→2 (attalpresident.fr 30/09/2026 30/09)
  OVERRIDES["Gabriel Attal"] = Object.assign(OVERRIDES["Gabriel Attal"] || {}, {5: 2, 14: 5.5, 42: 2});
  // Raphaël Glucksmann : Q9 7→5 (franceinfo, 23/09/2026 23/09) · Q28 5→6.5 (franceinfo 04/10) · Q10 7.5→8.5 (franceinfo 04/10) · Q109 7.5→8.5 (franceinfo, 23/09/2026 06/10)
  OVERRIDES["Raphaël Glucksmann"] = Object.assign(OVERRIDES["Raphaël Glucksmann"] || {}, {9: 5, 10: 8.5, 28: 6.5, 109: 8.5});
  // Olivier Faure : Q3 7→8.5 (AFP via Boursorama, 17/09/2026 17/09) · Q28 7→8 (AFP via Boursorama, 17/09/2026 04/10) · Q38 7→8.5 (AFP via Boursorama, 17/09/2026 17/09) · Q80 7→8.5 (AFP via Boursorama, 17/09/2026 17/09) · Q109 8→9.5 (Le Grand Continent, 06/10/2026 06/10) · Q14 7→8.5 (AFP via Boursorama, 17/09/2026 17/09)
  OVERRIDES["Olivier Faure"] = Object.assign(OVERRIDES["Olivier Faure"] || {}, {3: 8.5, 14: 8.5, 28: 8, 38: 8.5, 80: 8.5, 109: 9.5});
  // Ségolène Royal : Q60 7→6 (LCP, 09/10/2026 04/10) · Q101 8.5→10 (franceinfo 04/10) · Q109 8→9.5 (LCP, 09/10/2026 23/09)
  OVERRIDES["Ségolène Royal"] = Object.assign(OVERRIDES["Ségolène Royal"] || {}, {60: 6, 101: 10, 109: 9.5});
  // Jérôme Guedj : Q18 7→9 (LCP, 09/10/2026 09/10) · Q2 7→6 (LCP, 09/10/2026 09/10) · Q109 8→7.5 (Le Grand Continent, 06/10/2026 06/10)
  OVERRIDES["Jérôme Guedj"] = Object.assign(OVERRIDES["Jérôme Guedj"] || {}, {2: 6, 18: 9, 109: 7.5});
  // François Hollande : Q102 4→3 (LCP 03/09)
  OVERRIDES["François Hollande"] = Object.assign(OVERRIDES["François Hollande"] || {}, {102: 3});
  // Jean-Luc Mélenchon : Q3 7→8.5 (franceinfo, 17/09/2026 12/09) · Q68 3→4.5 (Outre-mer La 1ère, 07/06/2026 07/06)
  OVERRIDES["Jean-Luc Mélenchon"] = Object.assign(OVERRIDES["Jean-Luc Mélenchon"] || {}, {3: 8.5, 68: 4.5});
  // François Ruffin : Q95 7→8.5 (franceinfo, 05/10 et 09/10/2026 09/10) · Q38 7→8 (franceinfo, 05/10/2026 05/10) · Q58 8.5→9 (franceinfo, 09/10/2026 08/10)
  OVERRIDES["François Ruffin"] = Object.assign(OVERRIDES["François Ruffin"] || {}, {38: 8, 58: 9, 95: 8.5});
  // Marine Tondelier : Q2 7→8 (franceinfo, 30/09/2026 30/09)
  OVERRIDES["Marine Tondelier"] = Object.assign(OVERRIDES["Marine Tondelier"] || {}, {2: 8});


  // ── Parsing des lignes ──
  var POSITIONS = {}; // { qid: { FAMILY: value } }
  Object.keys(ROWS).forEach(function (id) {
    var vals = ROWS[id].trim().split(/\s+/).map(Number);
    if (vals.length !== FAMILIES.length) { try { console.warn('positions.js : Q' + id + ' a ' + vals.length + ' valeurs au lieu de ' + FAMILIES.length); } catch (e) {} }
    var o = {}; FAMILIES.forEach(function (f, i) { if (!isNaN(vals[i])) o[f] = vals[i]; });
    POSITIONS[id] = o;
  });

  // Position d'un candidat sur une question (null si inconnue — ex. questions sur-mesure)
  // ── MAJ du 12/10/2026 — passe 2 « cohérence programme ↔ positions » (8 agents, programmes officiels relus question par question) ──
  // Marine Le Pen : Q4 7→5.5 · Q15 1.5→3 · Q60 4.5→5 · Q64 2→4.5 · Q66 8→6.5 · Q108 5→3 · Q57 4.5→5.5
  OVERRIDES["Marine Le Pen"] = Object.assign(OVERRIDES["Marine Le Pen"] || {}, {4: 5.5, 15: 3, 57: 5.5, 60: 5, 64: 4.5, 66: 6.5, 108: 3});
  // Jordan Bardella : Q4 7→5.5 · Q15 1.5→3 · Q60 4.5→5 · Q64 2→4.5 · Q66 8→6.5 · Q108 5→3
  OVERRIDES["Jordan Bardella"] = Object.assign(OVERRIDES["Jordan Bardella"] || {}, {4: 5.5, 15: 3, 60: 5, 64: 4.5, 66: 6.5, 108: 3});
  // Éric Zemmour : Q64 3.5→4
  OVERRIDES["Éric Zemmour"] = Object.assign(OVERRIDES["Éric Zemmour"] || {}, {64: 4});
  // Nicolas Dupont-Aignan : Q9 2→3.5 · Q101 3→6 · Q103 2.5→4.5 · Q20 5→7.5 · Q105 1→2.5 · Q32 1→2.5 · Q64 2→4 · Q86 5.5→6.5 · Q100 5→4
  OVERRIDES["Nicolas Dupont-Aignan"] = Object.assign(OVERRIDES["Nicolas Dupont-Aignan"] || {}, {9: 3.5, 20: 7.5, 32: 2.5, 64: 4, 86: 6.5, 100: 4, 101: 6, 103: 4.5, 105: 2.5});
  // Florian Philippot : Q4 8.5→9.5 · Q12 4→6.5 · Q49 3→5 · Q54 2→5 · Q58 7→8.5 · Q24 5→3 · Q95 4→2.5 · Q89 5→4.5
  OVERRIDES["Florian Philippot"] = Object.assign(OVERRIDES["Florian Philippot"] || {}, {4: 9.5, 12: 6.5, 24: 3, 49: 5, 54: 5, 58: 8.5, 89: 4.5, 95: 2.5});
  // François Asselineau : Q3 5→7 · Q4 8.5→10 · Q9 5→7 · Q101 3→5.5 · Q102 8→6 · Q11 5→4 · Q16 7→8.5 · Q17 6→4.5 · Q28 3→2 · Q37 3→1 · Q44 5→7 · Q66 8→4.5 · Q67 8.5→9.5 · Q100 6→7 · Q108 5.5→4 · Q112 4→3
  OVERRIDES["François Asselineau"] = Object.assign(OVERRIDES["François Asselineau"] || {}, {3: 7, 4: 10, 9: 7, 11: 4, 16: 8.5, 17: 4.5, 28: 2, 37: 1, 44: 7, 66: 4.5, 67: 9.5, 100: 7, 101: 5.5, 102: 6, 108: 4, 112: 3});
  // David Lisnard : Q27 1.5→0.5 · Q29 3→1 · Q42 1.5→0.5 · Q86 2.5→6 · Q17 2→3.5 · Q50 2→4 · Q52 1.5→3 · Q100 1.5→3 · Q85 1.5→0.5 · Q6 1.5→2.5 · Q15 0→1.5 · Q90 2→3
  OVERRIDES["David Lisnard"] = Object.assign(OVERRIDES["David Lisnard"] || {}, {6: 2.5, 15: 1.5, 17: 3.5, 27: 0.5, 29: 1, 42: 0.5, 50: 4, 52: 3, 85: 0.5, 86: 6, 90: 3, 100: 3});
  // Bruno Retailleau : Q86 4→5.5
  OVERRIDES["Bruno Retailleau"] = Object.assign(OVERRIDES["Bruno Retailleau"] || {}, {86: 5.5});
  // Xavier Bertrand : Q82 1.5→3
  OVERRIDES["Xavier Bertrand"] = Object.assign(OVERRIDES["Xavier Bertrand"] || {}, {82: 3});
  // Édouard Philippe : Q71 4→1.5 · Q44 3→2
  OVERRIDES["Édouard Philippe"] = Object.assign(OVERRIDES["Édouard Philippe"] || {}, {44: 2, 71: 1.5});
  // Gabriel Attal : Q76 6→9
  OVERRIDES["Gabriel Attal"] = Object.assign(OVERRIDES["Gabriel Attal"] || {}, {76: 9});
  // Bruno Le Maire : Q3 1→4 · Q4 3→1.5 · Q6 3→6 · Q9 2→3.5 · Q18 3→1 · Q33 5→3 · Q59 8.5→7 · Q67 5.5→7 · Q68 4.5→6 · Q110 5→2.5 · Q75 8.5→5 · Q77 1.5→3 · Q81 7→4
  OVERRIDES["Bruno Le Maire"] = Object.assign(OVERRIDES["Bruno Le Maire"] || {}, {3: 4, 4: 1.5, 6: 6, 9: 3.5, 18: 1, 33: 3, 59: 7, 67: 7, 68: 6, 75: 5, 77: 3, 81: 4, 110: 2.5});
  // Dominique de Villepin : Q2 3→5.5 · Q64 3.5→5
  OVERRIDES["Dominique de Villepin"] = Object.assign(OVERRIDES["Dominique de Villepin"] || {}, {2: 5.5, 64: 5});
  // Raphaël Glucksmann : Q3 5→7 · Q11 5→7 · Q25 7→5 · Q36 5.5→6.5 · Q66 6→7.5 · Q67 4→7.5 · Q82 7→8 · Q85 6→5 · Q110 6→8 · Q111 5.5→4
  OVERRIDES["Raphaël Glucksmann"] = Object.assign(OVERRIDES["Raphaël Glucksmann"] || {}, {3: 7, 11: 7, 25: 5, 36: 6.5, 66: 7.5, 67: 7.5, 82: 8, 85: 5, 110: 8, 111: 4});
  // François Hollande : Q83 7→5
  OVERRIDES["François Hollande"] = Object.assign(OVERRIDES["François Hollande"] || {}, {83: 5});
  // Bernard Cazeneuve : Q8 4.5→3 · Q21 5→6.5 · Q41 5→7 · Q59 7→5 · Q100 6→7 · Q102 5.5→7
  OVERRIDES["Bernard Cazeneuve"] = Object.assign(OVERRIDES["Bernard Cazeneuve"] || {}, {8: 3, 21: 6.5, 41: 7, 59: 5, 100: 7, 102: 7});
  // Jean-Luc Mélenchon : Q107 4→2 · Q74 10→8.5 · Q32 10→7.5
  OVERRIDES["Jean-Luc Mélenchon"] = Object.assign(OVERRIDES["Jean-Luc Mélenchon"] || {}, {32: 7.5, 74: 8.5, 107: 2});
  // François Ruffin : Q8 6→3 · Q21 7→9 · Q59 1.5→5 · Q64 3.5→5 · Q107 3→4.5 · Q69 10→8.5
  OVERRIDES["François Ruffin"] = Object.assign(OVERRIDES["François Ruffin"] || {}, {8: 3, 21: 9, 59: 5, 64: 5, 69: 8.5, 107: 4.5});
  // Fabien Roussel : Q38 4→5
  OVERRIDES["Fabien Roussel"] = Object.assign(OVERRIDES["Fabien Roussel"] || {}, {38: 5});
  // Clémentine Autain : Q29 10→8.5 · Q36 10→8.5 · Q49 10→8.5
  OVERRIDES["Clémentine Autain"] = Object.assign(OVERRIDES["Clémentine Autain"] || {}, {29: 8.5, 36: 8.5, 49: 8.5});
  // Marine Tondelier : Q110 7.5→8.5 · Q56 8.5→9 · Q62 6→7 · Q32 8→7 · Q77 7→5.5
  OVERRIDES["Marine Tondelier"] = Object.assign(OVERRIDES["Marine Tondelier"] || {}, {32: 7, 56: 9, 62: 7, 77: 5.5, 110: 8.5});
  // Delphine Batho : Q56 5→6.5
  OVERRIDES["Delphine Batho"] = Object.assign(OVERRIDES["Delphine Batho"] || {}, {56: 6.5});
  // Nathalie Arthaud : Q86 10→8.5
  OVERRIDES["Nathalie Arthaud"] = Object.assign(OVERRIDES["Nathalie Arthaud"] || {}, {86: 8.5});
  // Selma Labib : Q86 10→8.5
  OVERRIDES["Selma Labib"] = Object.assign(OVERRIDES["Selma Labib"] || {}, {86: 8.5});
  // Anasse Kazib : Q86 10→8.5 · Q77 8.5→10 · Q82 8.5→10 · Q110 7.5→9
  OVERRIDES["Anasse Kazib"] = Object.assign(OVERRIDES["Anasse Kazib"] || {}, {77: 10, 82: 10, 86: 8.5, 110: 9});
  // Olivier Faure : Q6 6→7 · Q7 8→9 · Q8 6→5 · Q18 7→8.5 · Q21 7→8.5 · Q27 6→7.5 · Q104 8→9 · Q105 9→10 · Q41 7→6 · Q56 7→8.5 · Q59 7→8 · Q67 5.5→8.5 · Q110 6.5→7.5 · Q85 6→5
  OVERRIDES["Olivier Faure"] = Object.assign(OVERRIDES["Olivier Faure"] || {}, {6: 7, 7: 9, 8: 5, 18: 8.5, 21: 8.5, 27: 7.5, 41: 6, 56: 8.5, 59: 8, 67: 8.5, 85: 5, 104: 9, 105: 10, 110: 7.5});
  // Ségolène Royal : Q28 7→5.5 · Q37 6→5 · Q41 7→5.5 · Q42 7→5 · Q48 7→6 · Q50 8→6 · Q66 7→5.5 · Q67 5.5→7
  OVERRIDES["Ségolène Royal"] = Object.assign(OVERRIDES["Ségolène Royal"] || {}, {28: 5.5, 37: 5, 41: 5.5, 42: 5, 48: 6, 50: 6, 66: 5.5, 67: 7});
  // Jérôme Guedj : Q8 6→4 · Q18 9→10 · Q41 7→6 · Q62 6→5 · Q78 8→6 · Q80 7→6 · Q110 6.5→5.5
  OVERRIDES["Jérôme Guedj"] = Object.assign(OVERRIDES["Jérôme Guedj"] || {}, {8: 4, 18: 10, 41: 6, 62: 5, 78: 6, 80: 6, 110: 5.5});
  // Emmanuel Maurel : Q18 10→8 · Q21 8.5→10 · Q29 7→5.5 · Q36 7→5 · Q38 4→5.5 · Q42 6→5 · Q53 8→5 · Q55 3→4.5 · Q59 4→2 · Q64 2→4 · Q68 3→4.5 · Q103 10→8.5 · Q111 5.5→4
  OVERRIDES["Emmanuel Maurel"] = Object.assign(OVERRIDES["Emmanuel Maurel"] || {}, {18: 8, 21: 10, 29: 5.5, 36: 5, 38: 5.5, 42: 5, 53: 5, 55: 4.5, 59: 2, 64: 4, 68: 4.5, 103: 8.5, 111: 4});
  // Philippe Brun : Q1 7.5→9 · Q6 4.5→7.5 · Q7 4.5→7 · Q14 4→6 · Q17 6→7.5 · Q21 5→6 · Q56 8.5→6 · Q86 5.5→7 · Q101 8.5→7.5 · Q104 8→6
  OVERRIDES["Philippe Brun"] = Object.assign(OVERRIDES["Philippe Brun"] || {}, {1: 9, 6: 7.5, 7: 7, 14: 6, 17: 7.5, 21: 6, 56: 6, 86: 7, 101: 7.5, 104: 6});

  function candPos(q, c) {
    if (!q || !c) return null;
    var ov = OVERRIDES[c.name]; if (ov && ov[q.id] != null) return ov[q.id];
    var fam = FAMILY_OF[c.name]; var row = POSITIONS[q.id];
    if (fam && row && row[fam] != null) return row[fam];
    return null;
  }
  // Concordance −1 … +1 entre une réponse et une position (échelle 0-10)
  function concordance(u, p) { return Math.max(-1, Math.min(1, 1 - Math.abs(u - p) / 5)); }
  function pctOf(score) { return Math.round((score + 1) / 2 * 100); }
  // Étiquette d'accord pour une concordance
  function concTag(conc) {
    if (conc >= 0.6) return { cls: 'pol-tag-accord', label: 'Accord' };
    if (conc >= 0.2) return { cls: 'pol-tag-proche', label: 'Proche' };
    if (conc >= -0.3) return { cls: 'pol-tag-ecart', label: 'Écart' };
    return { cls: 'pol-tag-desac', label: 'Désaccord' };
  }
  // Indice de l'option la plus proche d'une position (pour « qui répond quoi »)
  function nearestOption(q, p) {
    var best = -1, bd = Infinity;
    q.options.forEach(function (o, i) { var d = Math.abs(o.score - p); if (d < bd - 1e-9) { bd = d; best = i; } });
    return best;
  }

  // Matching complet d'un candidat sur un jeu de questions.
  // answers : { id: {optIdx} | idx } · importance : { id: 1..5 } · questions : tableau (défaut POL.QUESTIONS)
  // → { pct, score, n, wsum, themes:{s:{score,pct,n,wsum}}, items:[{q,u,p,conc,w,d}], covered }
  function matchByQuestions(answers, importance, questions, cand) {
    importance = importance || {};
    var qs = questions || POL.QUESTIONS;
    var acc = 0, wsum = 0, n = 0, items = [];
    var th = {}; POL.SECTIONS.forEach(function (s) { th[s] = { acc: 0, wsum: 0, n: 0 }; });
    qs.forEach(function (q) {
      var u = POL.answerScore(answers[q.id], q); if (u == null) return;
      var p = candPos(q, cand); if (p == null) return;
      var w = POL.questionCoef(q, importance[q.id]);
      var c = concordance(u, p);
      acc += w * c; wsum += w; n++;
      if (th[q.theme]) { th[q.theme].acc += w * c; th[q.theme].wsum += w; th[q.theme].n++; }
      items.push({ q: q, u: u, p: p, conc: c, w: w, d: Math.abs(u - p) });
    });
    var themes = {};
    POL.SECTIONS.forEach(function (s) { var t = th[s]; var sc = t.wsum > 0 ? t.acc / t.wsum : null; themes[s] = { score: sc, pct: sc == null ? null : pctOf(sc), n: t.n, wsum: t.wsum }; });
    var score = wsum > 0 ? acc / wsum : null;
    return { pct: score == null ? null : pctOf(score), score: score, n: n, wsum: wsum, themes: themes, items: items, covered: n };
  }

  // Concordance moyenne (non pondérée par l'utilisateur) entre DEUX candidats — pour le duel « idées communes »
  function candSimilarity(a, b, questions) {
    var qs = questions || POL.QUESTIONS, acc = 0, n = 0;
    qs.forEach(function (q) { var pa = candPos(q, a), pb = candPos(q, b); if (pa == null || pb == null) return; acc += concordance(pa, pb); n++; });
    return n ? pctOf(acc / n) : null;
  }

  // Répartition des candidats sous chaque option d'une question
  function whoAnswers(q, cands) {
    var by = {}; q.options.forEach(function (o, i) { by[i] = []; });
    (cands || POL.CANDIDATES).forEach(function (c) { var p = candPos(q, c); if (p == null) return; var i = nearestOption(q, p); if (i >= 0) by[i].push({ c: c, p: p }); });
    return by;
  }

  POL.POSITIONS_DATE = '12 octobre 2026';
  POL.FAMILIES = FAMILIES; POL.FAMILY_LABELS = FAMILY_LABELS; POL.FAMILY_OF = FAMILY_OF; POL.POSITIONS = POSITIONS; POL.POSITION_OVERRIDES = OVERRIDES;
  POL.candPos = candPos; POL.concordance = concordance; POL.concPct = pctOf; POL.concTag = concTag;
  POL.nearestOption = nearestOption; POL.matchByQuestions = matchByQuestions; POL.candSimilarity = candSimilarity; POL.whoAnswers = whoAnswers;
})();
