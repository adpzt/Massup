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

  // ── Parsing des lignes ──
  var POSITIONS = {}; // { qid: { FAMILY: value } }
  Object.keys(ROWS).forEach(function (id) {
    var vals = ROWS[id].trim().split(/\s+/).map(Number);
    if (vals.length !== FAMILIES.length) { try { console.warn('positions.js : Q' + id + ' a ' + vals.length + ' valeurs au lieu de ' + FAMILIES.length); } catch (e) {} }
    var o = {}; FAMILIES.forEach(function (f, i) { if (!isNaN(vals[i])) o[f] = vals[i]; });
    POSITIONS[id] = o;
  });

  // Position d'un candidat sur une question (null si inconnue — ex. questions sur-mesure)
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

  POL.POSITIONS_DATE = '1er septembre 2026';
  POL.FAMILIES = FAMILIES; POL.FAMILY_LABELS = FAMILY_LABELS; POL.FAMILY_OF = FAMILY_OF; POL.POSITIONS = POSITIONS; POL.POSITION_OVERRIDES = OVERRIDES;
  POL.candPos = candPos; POL.concordance = concordance; POL.concPct = pctOf; POL.concTag = concTag;
  POL.nearestOption = nearestOption; POL.matchByQuestions = matchByQuestions; POL.candSimilarity = candSimilarity; POL.whoAnswers = whoAnswers;
})();
