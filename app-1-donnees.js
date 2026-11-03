// ══════════════════════════════════════════════════
// IMAGES (base64 injected below)
// ══════════════════════════════════════════════════
var IMGS = {
  chestpress: "imgs/chestpress.gif",
  inclinedumbell: "imgs/inclinedumbell.png",
  pecdeck: "imgs/pecdeck.gif",
  lateralraise: "imgs/lateralraise.gif",
  tricepscable: "imgs/tricepscable.gif",
  latpulldown: "imgs/latpulldown.gif",
  seatedrow: "imgs/seatedrow.gif",
  onearmrow: "imgs/onearmrow.png",
  dumbbellcurl: "imgs/dumbbellcurl.gif",
  cablecurl: "imgs/cablecurl.gif",
  legpress: "imgs/legpress.gif",
  legextension: "imgs/legextension.gif",
  legcurl: "imgs/legcurl.gif",
  facepull: "imgs/facepull.gif",
  inclinecurl: "imgs/inclinecurl.gif",
  hammercurl: "imgs/hammercurl.gif",
  extras_poulie: "imgs/extras_poulie.jpg",
  extras_dev_halt: "imgs/extras_dev_halt.jpg",
  shoulderpress: "imgs/shoulderpress.jpg", // .gif référencé avant n'existait pas (image cassée) — corrigé 01/08
  mollets: "imgs/mollets.jpg",
  dipmachine: "imgs/dipmachine.jpg",
  assistedpullup: "imgs/assistedpullup.jpg",
  hipthrust: "imgs/hipthrust.jpg",
  tricepsbar: "imgs/tricepsbar.jpg",
  militarypress: "imgs/militarypress.jpg",
  shrug: "imgs/shrug.jpg",
  cablefly: "imgs/cablefly.jpg",
  isorow: "imgs/isorow.jpg",               // rowing machine à appui pectoral (plate-loaded)
  machinepulldown: "imgs/machinepulldown.jpg", // pulldown machine (bras indépendants)
  ropecurl: "imgs/ropecurl.jpg",           // curl corde poulie basse (prise neutre)
  abductor: "imgs/abductor.jpg",
  adductor: "imgs/adductor.jpg",
  st_chest: "imgs/st_chest.jpg", st_chest2: "imgs/st_chest2.jpg", st_triceps: "imgs/st_triceps.jpg",
  st_shoulder: "imgs/st_shoulder.jpg", st_triceps2: "imgs/st_triceps2.jpg",
  st_childpose: "imgs/st_childpose.jpg", st_lat: "imgs/st_lat.jpg", st_biceps: "imgs/st_biceps.jpg",
  st_cat: "imgs/st_cat.jpg", st_biceps2: "imgs/st_biceps2.jpg",
  st_quad: "imgs/st_quad.jpg", st_ham: "imgs/st_ham.jpg", st_glute: "imgs/st_glute.jpg",
  st_calf: "imgs/st_calf.jpg", st_hipflex: "imgs/st_hipflex.jpg",
  // OTHERS (03/08) — abdos + cardio (source : free-exercise-db)
  cablecrunch: "imgs/cablecrunch.jpg", hanglegraise: "imgs/hanglegraise.jpg",
  pallofimg: "imgs/pallof.jpg", deadbugimg: "imgs/deadbug.jpg", hollowimg: "imgs/scissor.jpg",
  bikeimg: "imgs/bike.jpg", rowerimg: "imgs/rower.jpg",
  st_neck: "imgs/st_neck.jpg", st_hip: "imgs/st_hip.jpg", st_forearm: "imgs/st_forearm.jpg", st_back: "imgs/st_back.jpg"
};

// ── Étirements (section Maison, non trackables) : ~5 par type de séance + communs ──
var STRETCHES=[
  {id:'common',label:'&#x2705; À faire tous les jours',sub:'Mobilité générale',items:[
    {name:'Étirement nuque',img:'st_neck',dur:'20s / côté',cue:'Incline doucement la tête vers l\'épaule, sans forcer.'},
    {name:'Chat-vache (dos)',img:'st_cat',dur:'8 lents',cue:'À quatre pattes, arrondis puis creuse le dos en respirant.'},
    {name:'Fléchisseurs de hanche',img:'st_hip',dur:'30s / côté',cue:'Fente basse, bascule le bassin vers l\'avant.'},
    {name:'Avant-bras / poignets',img:'st_forearm',dur:'20s / côté',cue:'Bras tendu, tire les doigts vers toi puis vers le bas.'},
    {name:'Mobilité dos',img:'st_back',dur:'8 lents',cue:'Enroule-déroule la colonne, mouvement fluide.'}
  ]},
  {id:'push',label:'&#x1F525; Après PUSH',sub:'Pecs · Épaules · Triceps',items:[
    {name:'Ouverture pectoraux',img:'st_chest',dur:'30s / côté',cue:'Main au mur, tourne le buste à l\'opposé.'},
    {name:'Pecs derrière la tête',img:'st_chest2',dur:'25s',cue:'Mains derrière la nuque, ouvre les coudes vers l\'arrière.'},
    {name:'Triceps au-dessus tête',img:'st_triceps',dur:'25s / côté',cue:'Coude vers le plafond, pousse doucement avec l\'autre main.'},
    {name:'Triceps sur le côté',img:'st_triceps2',dur:'20s / côté',cue:'Bras en travers de la poitrine, ramène-le avec l\'autre bras.'},
    {name:'Épaules (rotations)',img:'st_shoulder',dur:'30s',cue:'Grands cercles lents des bras, avant puis arrière.'}
  ]},
  {id:'pull',label:'&#x1F4AA; Après PULL',sub:'Dos · Biceps',items:[
    {name:'Posture de l\'enfant',img:'st_childpose',dur:'40s',cue:'Assis sur les talons, bras tendus loin devant, relâche le dos.'},
    {name:'Grand dorsal au mur',img:'st_lat',dur:'30s / côté',cue:'Une main au mur, penche le buste pour étirer le flanc.'},
    {name:'Biceps debout',img:'st_biceps',dur:'25s / côté',cue:'Bras tendu en arrière, paume vers le haut contre un mur.'},
    {name:'Biceps assis',img:'st_biceps2',dur:'25s',cue:'Mains en appui derrière toi, avance doucement le bassin.'},
    {name:'Étirement dos (chat)',img:'st_cat',dur:'8 lents',cue:'À quatre pattes, arrondis le haut du dos vers le plafond.'}
  ]},
  {id:'legs',label:'&#x1F9B5; Après LEGS',sub:'Quadri · Ischios · Fessiers · Mollets',items:[
    {name:'Quadriceps au sol',img:'st_quad',dur:'30s / côté',cue:'Attrape la cheville, ramène le talon vers la fesse.'},
    {name:'Ischio-jambiers',img:'st_ham',dur:'30s / côté',cue:'Jambe tendue, penche le buste vers l\'avant dos droit.'},
    {name:'Fessiers allongé',img:'st_glute',dur:'30s / côté',cue:'Sur le dos, croise la cheville sur le genou et tire.'},
    {name:'Fléchisseur de hanche',img:'st_hipflex',dur:'30s / côté',cue:'Fente à genou, avance le bassin sans cambrer.'},
    {name:'Mollets au mur',img:'st_calf',dur:'30s / côté',cue:'Jambe arrière tendue, talon au sol, pousse le mur.'}
  ]}
];

// ══════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════
var NOW = new Date();

// (07/10) l'heure réelle à chaque appel : l'app restée ouverte après minuit datait tout de la veille
function getNow(){ return new Date(); }
function todayStr(){
  var d=getNow();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

var DB = {
  weights: {},
  logs: [],
  weightSetDate: {},
  bodyWeight: [],
  healthLogs: [],
  health: {},
  healthMeta: {},
  sleepLog: {},
  templates: [],
  profile: {name:'', height:0, goal:'masse'},
  deletedWeights: {},
  deletedBW: [],   // tombstones pesées : dates supprimées — la synchro ne doit JAMAIS les ressusciter (12/08)
  deletedLogs: [], // tombstones séances : ids supprimés — idem
  nutrition: {},   // 'YYYY-MM-DD' -> {kcal, prot, petit_dej, dejeuner, diner, shaker}
  reminders: null, // {enabled, days:[..], shaker, inactivity}
  painLog: [],     // journal blessure poignet : [{date, level 0-5, note}] — rempli par le Mode Séance Active
  rank: {pauses:[]}, // RANK APEX : pauses déclarées [{type:'vacances'|'blessure', start, end}] — les RP sont recalculés depuis logs
  prepared: null,  // séance LiveUp préparée à l'avance : {sel, sname, count, date} (03/08)
  dz: {},          // espace Détente : 'YYYY-MM-DD' -> {chin:true, langue:true, ..., stretch:true} (04/08)
  pv: {msg:null,seen:null}, // « Nous deux » (26/08) : mon petit mot pour Melati {id,text,at} + id du dernier mot d'elle que j'ai vu
  noteGrav: {},    // notes /20 GRAVÉES (03/11) : lundi -> copie figée de la note (dimanche 20 h) — ne change plus jamais ; à la fusion, la 1re gravure gagne
  bodyMeas: {},    // mensurations (02/11) : date -> {bras, poitrine, taille, cuisse (cm), at:ms} ou {del:1, at} — la plus récente gagne
  recHidden: {},   // perfs retirées des classements par Adrien (01/11) : key -> {logId: {h:1|0, at:ms}} — la plus récente gagne
  evolution: {},   // évolutions de charge en cours (15/08) : key -> {from, to, hi} — hi = nb de séries au poids haut (en fin d'exo)
  nutriA: {day:{},favs:[]} // mode NUTRITION prise de masse (23/08) : day['YYYY-MM-DD'] -> {pdj,dej,din,snacks[],shaker} · favs = ids recettes
};

// ── MISE DE CÔTÉ (15/08/2026, demande Adrien) : rank, objectifs de charges, radar des notes ──
// RIEN n'est supprimé : tout le moteur (rankState, GOALS_JAN, rankLadder, radar...) reste en
// place et se réactive en repassant ces flags à true. Seul l'AFFICHAGE est débranché.
var FEATURE_RANK=false;   // médaille profil, section rank du Bilan, RP dans bilans / modal jour
var FEATURE_GOALS=false;  // section « Objectifs & repères — 1er janvier » (Progression)
var FEATURE_RADAR=false;  // radar « Ton niveau » / araignée des notes d'exo (Progression)
// ⚡ Évolution de charge (poids haut sur les premières séries) : débranchée le 28/10 — le système
// « une seule charge » d'Adrien (même poids sur toutes les séries, double progression) la remplace.
// DB.evolution est gardé tel quel (rien d'effacé) ; true = la remettre.
var FEATURE_EVO=false;
var FEATURE_FULL_BILAN=true; // bilan de SÉANCE complet (slides analyse/notes par exo/classements) — réactivé le 18/08 (retour Adrien : l'épuré du 15/08 enlevait les retours par exo, les classements et la progression des charges qu'il voulait garder). false = note /20 + suggestions seulement.

function loadDB(){
  if(_saveDBTimer) _flushSaveDB(); // une écriture débouncée est en attente → flush avant relecture
  try{
    var s = localStorage.getItem('massup_db');
    if(s){ var d=JSON.parse(s); if(d.weights) DB.weights=d.weights; if(d.logs) DB.logs=d.logs; if(d.weightSetDate) DB.weightSetDate=d.weightSetDate; if(d.bodyWeight) DB.bodyWeight=d.bodyWeight; if(d.healthLogs) DB.healthLogs=d.healthLogs; if(d.health) DB.health=d.health; if(d.healthMeta) DB.healthMeta=d.healthMeta; if(d.sleepLog) DB.sleepLog=d.sleepLog; if(d.templates) DB.templates=d.templates; if(d.profile) DB.profile=d.profile; if(d.deletedWeights) DB.deletedWeights=d.deletedWeights; if(d.deletedBW) DB.deletedBW=d.deletedBW; if(d.deletedLogs) DB.deletedLogs=d.deletedLogs; if(d.nutrition) DB.nutrition=d.nutrition; if(d.reminders) DB.reminders=d.reminders; if(d.painLog) DB.painLog=d.painLog; if(d.rank) DB.rank=d.rank; if(d.prepared) DB.prepared=d.prepared; if(d.dz) DB.dz=d.dz; if(d.evolution) DB.evolution=d.evolution; if(d.recHidden) DB.recHidden=d.recHidden; if(d.bodyMeas) DB.bodyMeas=d.bodyMeas; if(d.noteGrav) DB.noteGrav=d.noteGrav; if(d.nutriA) DB.nutriA=d.nutriA; if(d.pv) DB.pv=d.pv; }
  }catch(e){}
}
// Écriture localStorage débouncée (300ms) : localStorage.setItem est synchrone et bloque le
// thread principal à chaque action — on regroupe. Flush garanti sur pagehide/visibilitychange.
// ── 👟 Pas & activité (29/09, demande Adrien) — module commun steps.js (chargé avant app.js) ──
// Bloc « Pas » sous « Cette semaine » au Bilan, écran complet, données Santé via Raccourci iOS → /api/health.
if(typeof STEPS!=='undefined') STEPS.init({app:'adrien',weekGoal:50000,blood:1000,db:function(){ return DB; },save:function(){ saveDB(); },toast:function(m){ showToast(m); },
  sb:function(){ return (typeof sbClient!=='undefined'&&sbClient)?sbClient:null; },weekPtsMax:3,
  onChange:function(){ if(_currentView==='sante') try{ renderSante(); }catch(e){} }});
if(typeof SLEEP!=='undefined') SLEEP.init({db:function(){ return DB; },save:function(){ saveDB(); },toast:function(m){ showToast(m); }});
// Nutrition du jour (02/11) : totaux Yazio via Santé — hors DB (copie locale), même raccourci que les pas
if(typeof INTAKE!=='undefined') INTAKE.init({sb:function(){ return (typeof sbClient!=='undefined'&&sbClient)?sbClient:null; },toast:function(m){ showToast(m); },
  runShortcut:function(){ if(typeof STEPS!=='undefined') STEPS.refresh(); },
  onChange:function(){ if(_currentView==='sante') try{ renderSante(); }catch(e){} }});
var _saveDBTimer=null;
function saveDB(){
  // Version de sauvegarde (12/08, bug « rien ne persiste au reload ») : chaque save incrémente
  // rev — le boot compare local vs cloud et garde LE PLUS RÉCENT, un onglet périmé ne peut
  // plus écraser les données fraîches, et une erreur d'écriture devient VISIBLE.
  if(!DB.profile) DB.profile={};
  DB.profile.rev=(DB.profile.rev||0)+1;
  DB.profile.savedAt=Date.now();
  if(_saveDBTimer) clearTimeout(_saveDBTimer);
  _saveDBTimer=setTimeout(_flushSaveDB,300);
  if(typeof syncToSupabase==='function') syncToSupabase();
}
function _flushSaveDB(){
  if(_saveDBTimer){ clearTimeout(_saveDBTimer); _saveDBTimer=null; }
  // Garde anti-onglet périmé : si un AUTRE onglet a déjà écrit une version plus récente,
  // on ne l'écrase pas avec notre état vieux — on recharge dessus.
  try{
    var s0=localStorage.getItem('massup_db');
    if(s0){ var cur=JSON.parse(s0);
      if(cur&&cur.profile&&(cur.profile.rev||0)>(DB.profile&&DB.profile.rev||0)){ location.reload(); return; } }
  }catch(e){}
  try{ localStorage.setItem('massup_db',JSON.stringify(DB)); }
  catch(e){ try{ showToast('&#x26A0;&#xFE0F; Sauvegarde locale IMPOSSIBLE ('+((e&&e.name)||'erreur')+') &#x2014; seule la synchro cloud te protège. Dis-le au coach !'); }catch(_e){} }
}
document.addEventListener('visibilitychange', function(){
  if(document.visibilityState==='hidden'){ _flushSaveDB(); }
  else { try{ if(typeof checkReminders==='function') checkReminders(); }catch(e){} }
});
window.addEventListener('pagehide', function(){ _flushSaveDB(); });

// ══════════════════════════════════════════════════
// PROGRAMME DATA
// ══════════════════════════════════════════════════
var EXTRAS = [];
var DATA = [
  // Ordre PUSH modifié le 01/08/2026 (validé Adrien) : Développé Incliné EN PREMIER (haut des pecs
  // = son point anatomiquement faible → travaillé frais), Chest Press en second.
  {id:"s1",t:"push",num:"Séance 1",icon:"&#x1F525;",name:"PUSH",sub:"Pecs · Épaules · Triceps",exos:[
    {key:"dev_incline",imp:true,name:"Développé Incliné Haltères",poids:16,unite:"kg/côté",serie:"4×8",rest:150,cue:"Coudes à 45°, descends vers le haut des pecs — et pense « je rapproche mes coudes » en poussant, pas « je pousse le poids ».",tips:["Tu ne « sens » pas tes pecs ? Descente 3s + pause 1s en bas + baisse de 10% une séance : la connexion vient avec la tension, pas la charge.","Banc à 30° — pas plus.","Bras jamais totalement tendus en haut, mouvement lent dans les deux sens."],errs:["Banc trop incliné = épaules pas pecs.","Ne pas rebondir en bas."],img:"inclinedumbell"},
    // ⭐ transférée au dev_incline le 01/08 (insertion haute des pecs = SA priorité pecs) — chest press reste un pilier.
    {key:"chestpress_v",name:"Chest Press Vertical",poids:40,unite:"kg",serie:"4×8",rest:150,cue:"Serre les pecs pour rapprocher les bras.",tips:["Dos bien collé au dossier, pecs sortis.","Expire en poussant, inspire en descendant.","Mouvement contrôlé à la descente."],errs:["Ne pas décoller le dos du dossier.","Ne pas verrouiller les coudes en haut."],img:"chestpress"},
    {key:"pecdeck",name:"Pec Deck",poids:34,unite:"kg",serie:"4×10",rest:90,cue:"Imagine écraser quelque chose entre tes pecs.",tips:["Poitrine sortie tout au long.","Aller-retour lent, pas de rebond.","Contraction maximale en fermeture."],errs:["Ne pas aller trop vite.","Ne pas laisser les épaules monter."],img:"pecdeck"},
    // 15/08/2026 (décision Adrien) : 6 kg · 4×15 — il redescend d'un cran pour remplir des
    // séries longues propres (11/14 séries sous la cible à 8 kg = charge trop haute, verdict du
    // 14/08 enfin acté). 15 reps = format métabolique → repos 75 s. Retour à 8 kg quand 4×15 passe.
    {key:"elev_lat",imp:true,name:"Élévation Latérale",poids:8,unite:"kg/main",serie:"4×10",rest:90,cue:"Coudes qui mènent, stop à hauteur d'épaule, descente en 3 s.",tips:["8 kg · 8 à 12 reps (01/11) : +1 rep par séance, la hausse vient à 4×12 propres — garde 1 rep en réserve avant la dernière série.","Bras légèrement fléchi tout au long, contrôle la descente (3s).","Monter jusqu'à la hauteur des épaules."],errs:["Ne pas balancer le buste.","Ne pas hausser les épaules."],img:"lateralraise"},
    {key:"triceps_corde",imp:true,name:"Triceps Poulie Corde",poids:16,unite:"kg",serie:"4×10",rest:90,cue:"Écarte la corde en bas pour finir la contraction.",tips:["Coudes collés au corps, immobiles.","Sépare la corde en bas.","Contrôle lent à la remontée."],errs:["Ne pas laisser les coudes s'écarter.","Ne pas utiliser le dos."],img:"tricepscable"},
    // cable_fly ajouté le 01/08/2026 : tension continue = idéal pour la connexion pecs (Adrien ne « sent » pas l'incliné)
    {key:"cable_fly",bonus:true,name:"Écarté Poulie Vis-à-vis",poids:9,unite:"kg/côté",serie:"3×12",rest:90,bless:"Poignées simples, poignets dans l'axe du bras — RAS.",cue:"Bras semi-tendus, ramène les poignées devant toi comme pour applaudir, serre les pecs 1s.",tips:["Tension continue du câble : l'exo parfait pour ENFIN sentir tes pecs travailler.","Un pied devant, buste légèrement penché, gainé.","Ouvre grand en arrière (étirement), ferme en serrant fort."],errs:["Ne pas plier/déplier les coudes pendant le mouvement.","Ne pas prendre lourd au point de balancer le corps."],img:"cablefly"},
    // 06/08/2026 : quiproquo réglé — DEUX machines vivaient sous seated_dips. seated_dips = la
    // DIPS MACHINE assise (charge, plus = mieux, celle qu'Adrien utilise en saison 1) ;
    // dips_assist = la vraie Dips Assistée (assistance sous les pieds, moins = mieux, ère saison 0).
    {key:"seated_dips",bonus:true,name:"Dips Machine (assis)",poids:40,unite:"kg",serie:"3×10",rest:150,bless:"Prise neutre sur les barres, poignets dans l'axe — RAS.",cue:"Assis, buste légèrement penché en avant : pousse les barres vers le bas jusqu'à l'extension, coudes près du corps.",tips:["Ici le poids = la CHARGE : plus c'est haut, plus c'est dur (l'inverse de la dips assistée).","Épaules basses, poitrine sortie du début à la fin.","Descente contrôlée 2-3s, extension complète sans verrouiller sèchement."],errs:["Ne pas hausser les épaules vers les oreilles.","Ne pas écarter les coudes vers l'extérieur."],img:"dipmachine"},
    {key:"dips_assist",bonus:true,name:"Dips Assistée (traction)",poids:30,unite:"kg",serie:"3×10",rest:150,bless:"Poignées parallèles = prise neutre, aucun souci poignet.",cue:"La machine t'aide à remonter : descends contrôlé, pousse pour tendre les bras sans verrouiller les coudes.",tips:["Plus le poids affiché est haut, plus l'assistance est forte — l'objectif est de la baisser avec le temps (cap final : dips au poids du corps).","Coudes près du corps, épaules basses.","Descente lente et complète pour étirer pecs et triceps."],errs:["Ne pas verrouiller brutalement les coudes en haut.","Ne pas hausser les épaules vers les oreilles."],img:"dipmachine"},
    // 08/08/2026 — DOUBLON de triceps_barre (même geste, même barre, même 4×10 à 18 kg). L'entrée
    // reste déclarée UNIQUEMENT pour que les anciens logs sachent encore afficher un nom ; elle est
    // masquée et son historique a été fusionné dans triceps_barre (migration tricepsMerge0808).
    {key:"poulie_triceps_av",bonus:true,hidden:true,merged:"triceps_barre",name:"Extension Triceps Poulie (barre)",poids:18,unite:"kg",serie:"4×10",rest:90,cue:"Coudes fixes au corps, pousse vers le bas.",tips:["Coudes immobiles contre les cotes.","Controle lent a la remontee.","Extension complete en bas."],errs:["Ne pas ecarter les coudes.","Ne pas utiliser le dos."],img:"extras_poulie"},
    // 14/08/2026 — VERSION HALTÈRES (retour Adrien : il le fait aux haltères, pas à la barre).
    // ASSIS avec dossier : plus stable, plus de charge sur les deltoïdes, et zéro tentation de
    // cambrer (son antéversion du bassin). Réf. réelle 14 kg/côté (le 20 d'avant = échelle barre).
    {key:"dev_militaire",bonus:true,name:"Développé Militaire Haltères (assis)",poids:14,unite:"kg/côté",serie:"4×8",rest:150,bless:"Prise neutre ou paumes vers l\'avant : poignet dans l\'axe de l\'avant-bras — RAS.",cue:"Assis, dos collé au dossier, haltères au niveau des épaules : pousse droit au-dessus de la tête jusqu\'aux bras tendus, redescends contrôlé.",tips:["Oui c\'est bien ça : départ haltères AUX ÉPAULES (coudes sous les poignets), montée bras tendus au-dessus de la tête — sans claquer les coudes en haut.","Assis > debout pour toi : le dossier stabilise, tout part dans les épaules, et ton bas du dos ne compense pas.","Les haltères se rapprochent en haut sans s\'entrechoquer, descente 2-3s jusqu\'au niveau des oreilles."],errs:["Ne pas cambrer le bas du dos (reste collé au dossier).","Ne pas s\'arrêter à mi-hauteur : amplitude complète, oreilles → bras tendus."],img:"extras_dev_halt"},
    // Le SEUL pushdown à la barre du programme (fusion du doublon le 08/08 — historique des deux clés réuni ici).
    {key:"triceps_barre",bonus:true,name:"Extension Triceps Poulie (barre)",poids:18,unite:"kg",serie:"4×10",rest:90,cue:"Debout face à la poulie haute, coudes collés aux côtes : pousse la barre vers le bas jusqu'aux cuisses, bras tendus.",tips:["Coudes immobiles contre les côtes — seuls les avant-bras bougent.","Extension complète en bas, courte pause, contraction du triceps.","Remontée lente et contrôlée jusqu'à l'angle droit."],errs:["Ne pas écarter les coudes du corps.","Ne pas pousser avec le buste ni prendre de l'élan avec le dos."],img:"tricepsbar"},
    {key:"shoulder_press",bonus:true,name:"Shoulder Press",poids:16,unite:"kg",serie:"4×10",rest:120,cue:"Pousse vers le haut, coudes alignes avec les epaules au depart.",tips:["Gainage du core pendant tout le mouvement.","Descente controlee jusqu'a hauteur des epaules.","Ne pas bloquer les coudes en haut."],errs:["Ne pas cambrer le dos.","Ne pas monter les epaules vers les oreilles."],img:"shoulderpress"}
  ]},
  // ⚠️ PULL adaptée blessure (juil. 2026, styloïde ulnaire) : prises NEUTRES en priorité, supination interdite.
  // Les anciens exos (curl poulie basse / curl incliné) sont MASQUÉS (hidden:true) mais restent dans le
  // code et gardent tout leur historique de poids — ils reviendront après guérison.
  // 01/08/2026 : curl_halt (curl classique) RÉACTIVÉ en bonus (demande Adrien) ; tirage_vert re-validé
  // avec barre (aucune douleur) et recalé à 4×8 (cible reps réelle d'Adrien).
  {id:"s2",t:"pull",num:"Séance 2",icon:"&#x1F4AA;",name:"PULL",sub:"Dos · Biceps",inj:"S&#xE9;ance adapt&#xE9;e &#xE0; ta blessure au poignet (stylo&#xEF;de ulnaire) : prises <strong>neutres</strong> en priorit&#xE9;, pronation seulement si pas le choix, <strong>jamais de supination</strong>. Stoppe la s&#xE9;rie &#xE0; la moindre douleur.",exos:[
    // ═══ REFONTE PULL 15/08/2026 (demande Adrien) : 6 principaux — Tirage Vertical, Rowing
    // Poulie Basse (Triangle), Rowing Unilatéral, Curl Marteau Croisé, Curl Incliné Neutre
    // (nouveau), Face Pull. Le reste passe en BONUS (rowing_appui, curl_marteau, curl_corde...)
    // + le Curl Incliné classique (banc, supination) sort de hidden → bonus léger de reprise.
    // Lecture coach : 3 patterns de tirage (vertical / horizontal bilatéral / horizontal uni),
    // 2 biceps en prise neutre (croisé = brachial · incliné neutre = longue portion étirée),
    // Face Pull posture. Volume Dos ≈ 13,5 · Biceps ≈ 14 : identique à l'ancien PULL.
    {key:"tirage_vert",imp:true,name:"Tirage Vertical (Dos)",poids:40,unite:"kg",serie:"4×8",rest:150,bless:"Barre OK — testé sans douleur (validé 01/08). Si ça tire un jour, repasse au triangle / poignée V.",cue:"Pecs vers le haut, omoplates se resserrent à la descente.",tips:["Barre validée : prise à peine plus large que les épaules.","Dos fixe, pas de balancement.","Tirer les coudes vers les hanches."],errs:["Ne jamais tirer derrière la nuque.","Ne pas balancer avec le corps."],img:"latpulldown"},
    {key:"rowing_pb",name:"Rowing Poulie Basse (Triangle)",poids:36,unite:"kg",serie:"4×8",rest:120,bless:"Le triangle = prise neutre, parfait pour ton poignet. On garde tel quel.",cue:"Tire les coudes vers les hanches.",tips:["Dos et épaules droits.","Omoplates resserrées à chaque rep.","Descente lente pour étirer le dos."],errs:["Ne pas arrondir le dos.","Ne pas balancer le buste."],img:"seatedrow"},
    // rowing_uni repassé PRINCIPAL le 15/08 (refonte Adrien) — le G/D séparé traque l'asymétrie.
    {key:"rowing_uni",name:"Rowing Unilatéral Poulie",poids:20,unite:"kg",serie:"4×8/bras",rest:90,uni:true,bless:"Poignée simple en prise neutre, poignet bien dans l'axe de l'avant-bras.",cue:"Ton coude veut toucher ta poche arrière.",tips:["Commence toujours par le bras GAUCHE (le faible décide de la charge).","Buste stable, ne tourne pas.","Étire bien le dos en descente."],errs:["Ne pas tourner le buste.","Ne pas monter les épaules."],img:"onearmrow"},
    // 14/08/2026 — variante du Curl Marteau (idée Adrien) : l'haltère monte en diagonale vers
    // l'épaule opposée → accent brachial + long supinateur. PRINCIPAL depuis le 15/08 (refonte) ;
    // le marteau classique vit en bonus pour les jours où il veut alterner.
    // 31/08/2026 — uni:true (retour Adrien : « plus de mal sur la gauche ») : ressenti G/D
    // séparé à chaque série, comme le rowing uni — le côté faible (gauche) décide de la charge.
    {key:"curl_marteau_croise",imp:true,name:"Curl Marteau Croisé",poids:10,unite:"kg",serie:"4×10/bras",rest:90,uni:true,bless:"Prise marteau = neutre : aucun stress pour ton poignet.",cue:"Comme le marteau, mais l\'haltère monte en DIAGONALE vers l\'épaule opposée — un bras après l\'autre.",tips:["Commence toujours par le bras GAUCHE (ton côté le plus dur) — c\'est lui qui décide de la charge.","Ton biceps principal : le brachial épaissit le bras vu de côté.","Coude collé au corps : seul l\'avant-bras traverse devant le buste."],errs:["Ne pas tourner le buste pour aider.","Ne pas laisser le coude partir vers l\'avant."],img:"hammercurl"},
    // 15/08/2026 — NOUVEL exo principal (refonte Adrien) : curl incliné en PRISE NEUTRE — la
    // longue portion du biceps travaillée en étirement, poignet dans l'axe (compatible blessure).
    {key:"curl_incline_neutre",imp:true,name:"Curl Incliné Neutre (banc)",poids:8,unite:"kg",serie:"4×10",rest:90,bless:"Prise neutre (comme le marteau) : le poignet reste dans l'axe — c'est LA version incliné compatible avec ton poignet.",cue:"Banc à 45-60°, bras qui pendent derrière toi, paumes face à face : monte sans tourner les poignets.",tips:["Départ estimé 8 kg : cale la charge à la 1re séance pour finir chaque série à ~2 reps de l'échec.","L'étirement en bas = tout l'intérêt de l'exo : descente 3s, bras long derrière toi.","Coudes fixes : ils ne remontent pas vers l'avant pendant la montée."],errs:["Ne pas décoller le dos du banc.","Ne pas raccourcir l'amplitude en bas (c'est là que ça construit)."],img:"inclinecurl"},
    {key:"face_pull",imp:true,name:"Face Pull",poids:18,unite:"kg",serie:"3×15",rest:75,bless:"Corde en prise neutre : aucun souci pour le poignet, on garde.",cue:"Tire la corde vers le visage, coudes hauts, écarte les mains en fin de mouvement.",tips:["Coudes à hauteur des épaules ou plus haut.","Sépare bien la corde au niveau du visage.","Mouvement contrôlé, sans balancer le buste."],errs:["Ne pas prendre trop lourd au point de reculer le buste.","Ne pas laisser tomber les coudes vers le bas."],img:"facepull"},
    // ── Bonus (refonte 15/08 : les ex-principaux restent dispo, historique intact) ──
    {key:"rowing_appui",bonus:true,name:"Rowing Machine (appui pectoral)",poids:35,unite:"kg",serie:"4×10",rest:120,bless:"Poignées neutres, poitrine collée au support : zéro stress pour le poignet.",cue:"Poitrine plaquée au pad — seuls tes coudes reculent, omoplates serrées 1s en fin de tirage.",tips:["Bonus depuis le 15/08 : à reprendre les jours où tu veux un 4e tirage strict.","Poitrine collée au support du début à la fin.","Tire les coudes vers l'arrière, sans hausser les épaules."],errs:["Ne pas décoller la poitrine du support.","Ne pas raccourcir l'amplitude en fin de série."],img:"isorow"},
    {key:"curl_marteau",bonus:true,name:"Curl Marteau",poids:10,unite:"kg",serie:"4×10",rest:90,bless:"Prise marteau = neutre : zéro stress pour le poignet.",cue:"Poignets neutres — comme tenir un marteau.",tips:["Le classique : à alterner avec le Croisé si tu veux varier d'un PULL à l'autre.","Coudes colles au corps.","Contraction 1s en haut."],errs:["Ne pas rouler les poignets.","Ne pas balancer les coudes."],img:"hammercurl"},
    {key:"curl_corde",bonus:true,name:"Curl Corde Basse (neutre)",poids:12,unite:"kg",serie:"4×10",rest:90,bless:"Corde à la poulie basse, paumes face à face — remplace curl haltères + curl poulie.",cue:"Paumes face à face sur la corde, monte sans tourner les poignets.",tips:["Coudes fixes contre les côtes.","Serre la corde fort, poignets verrouillés dans l'axe.","Descente lente (3s), garde la tension."],errs:["Ne pas tourner les paumes vers le haut (supination).","Ne pas avancer les coudes."],img:"ropecurl"},
    // Élévation latérale RETIRÉE de PULL (04/08, décision Adrien — doublon jugé inutile) :
    // hidden, jamais supprimée. L'exo vit en PUSH (même clé elev_lat, même historique) et le
    // passage à ~5 séances/sem redonne 2 PUSH/semaine → la fréquence deltoïdes est préservée.
    {key:"elev_lat",imp:true,hidden:true,name:"Élévation Latérale",poids:6,unite:"kg/main",serie:"4×15",rest:75,bless:"Haltères en prise neutre — rien à signaler pour le poignet.",cue:"Mouvement lent, monte jusqu'aux épaules — 2e passage épaules de ta semaine.",tips:["C'est LE muscle qui élargit ta carrure : la fréquence paie plus que la charge.","En fin de séance : privilégie 12 reps ultra propres, baisse si la forme se dégrade.","Descente contrôlée 3s, zéro élan."],errs:["Ne pas balancer le buste.","Ne pas hausser les épaules vers les oreilles."],img:"lateralraise"},
    {key:"tirage_pulldown",bonus:true,name:"Pulldown Machine",poids:50,unite:"kg",serie:"4×10",rest:150,bless:"Pronation : seulement si zéro douleur, sinon saute-le ou allège fort.",cue:"Pecs hauts, tire les coudes vers les hanches.",tips:["Prise large, plus que les epaules.","Omoplates vers le bas avant de tirer.","Controle lent a la montee."],errs:["Ne pas balancer le buste.","Ne pas tirer derriere la nuque."],img:"machinepulldown"},
    {key:"traction_assist",bonus:true,imp:true,name:"Traction Assistée (machine)",unite:"kg",serie:"4×10",rest:150,bless:"Prise NEUTRE obligatoire : les poignées parallèles, pas la barre.",cue:"La machine t'aide à monter : tire-toi vers le haut, omoplates serrées, menton au-dessus de la barre.",tips:["Plus le poids affiché est haut, plus l'assistance est forte — l'objectif est de le baisser avec le temps.","Descente lente et complète pour étirer le dos.","Pas de balancement, mouvement propre."],errs:["Ne pas se laisser tomber en bas.","Ne pas hausser les épaules vers les oreilles."],img:"assistedpullup"},
    // shrug_halt ajouté le 01/08/2026 (demande Adrien) : trapèzes hauts = carrure vue de face, prise neutre.
    {key:"shrug_halt",bonus:true,name:"Shrugs Haltères (trapèzes)",poids:20,unite:"kg/main",serie:"3×12",rest:75,bless:"Prise neutre, bras le long du corps : le poignet ne travaille pas.",cue:"Hausse les épaules le plus haut possible, tiens 1s en haut, redescends lentement.",tips:["Bras tendus : ce sont les épaules qui montent, pas les coudes.","La pause d'1s en haut fait tout l'exo.","Amplitude complète : laisse bien étirer en bas entre les reps."],errs:["Ne pas rouler les épaules (juste haut ↔ bas).","Ne pas plier les coudes pour tricher."],img:"shrug"},
    // curl_halt réactivé le 01/08/2026 en BONUS de PULL (demande Adrien) — reprise en douceur, charge légère.
    // 28/10/2026 : retiré puis remis le jour même (Adrien : « je veux pouvoir les faire si besoin »).
    {key:"curl_halt",bonus:true,name:"Curl Haltères",poids:10,unite:"kg",serie:"4×8",rest:90,bless:"Reprise en douceur : charge légère, poignet dans l'axe — stoppe à la moindre gêne.",cue:"Coudes collés au corps. Que les avant-bras qui pivotent.",tips:["Coudes fixes contre les côtes.","Contraction 1s en haut.","Descente lente (3s)."],errs:["Ne pas monter les épaules.","Ne pas balancer le dos."],img:"dumbbellcurl"},
    {key:"curl_poulie",hidden:true,name:"Curl Poulie Basse",poids:10,unite:"kg",serie:"4×10",rest:90,cue:"Serre les biceps en haut pendant 1 seconde.",tips:["Coudes stables, ne bougent pas.","Descente contrôlée.","Garde la tension."],errs:["Ne pas avancer les coudes.","Ne pas remonter trop vite."],img:"cablecurl"},
    // curl_incline (supination) réactivé en BONUS le 15/08 (demande Adrien) — même statut que le
    // curl haltères : reprise légère, supination progressive, stop à la moindre gêne au poignet.
    // 01/11/2026 : MASQUÉ — doublon du Curl Incliné Neutre selon Adrien (aucune série en LiveUp, rien à fusionner).
    {key:"curl_incline",bonus:true,hidden:true,name:"Curl Incliné Haltères (banc)",poids:8,unite:"kg",serie:"3×10",rest:90,bless:"Supination = à doser : charge légère, tourne les paumes SANS forcer, stoppe à la moindre gêne au poignet.",cue:"Laisse les bras pendre derriere toi au depart.",tips:["Banc incline a 45-60 deg.","Etirement complet du biceps en bas.","Descente lente."],errs:["Ne pas avancer les coudes.","Ne pas descendre rapidement."],img:"inclinecurl"}
  ]},
  {id:"s3",t:"legs",num:"Séance 3",icon:"&#x1F9B5;",name:"LEGS",sub:"Force + Masse",exos:[
    {key:"leg_press",imp:true,name:"Leg Press",poids:60,unite:"kg",serie:"4×10",rest:150,cue:"Pousse avec les talons — pas les orteils.",tips:["Pieds à largeur d'épaules.","Ne pas tendre complètement les jambes.","Cuisses parallèles au sol en bas."],errs:["Genoux qui rentrent vers l'intérieur.","Fesses qui décollent du siège."],img:"legpress"},
    {key:"leg_ext",name:"Leg Extension (Quadriceps)",poids:35,unite:"kg",serie:"4×12",rest:90,cue:"Contracte les quadriceps à fond en haut.",tips:["Descente lente (3s).","Contraction maximale en extension.","Mouvement contrôlé."],errs:["Ne pas aller trop vite.","Ne pas laisser le siège se soulever."],img:"legextension"},
    // 16/08 : leg curl masqué (douleur genou récurrente en flexion chargée — décision Adrien+coach),
    // remplacé par le Hip Thrust machine (pattern hanche). Historique conservé, retour possible.
    {key:"leg_curl",hidden:true,name:"Leg Curl (Ischio-jambiers)",poids:30,unite:"kg",serie:"4×12",rest:90,cue:"Ramène les talons vers les fesses lentement.",tips:["Hanches plaquées contre le banc.","Pointes fléchies vers toi = meilleure activation.","Descente contrôlée (3–4s)."],errs:["Ne pas lever les hanches.","Ne pas aller trop vite."],img:"legcurl"},
    {key:"mollets",bonus:true,name:"Mollets Machine",poids:40,unite:"kg",serie:"4×15",rest:75,cue:"Monte au maximum sur la pointe des pieds.",tips:["Amplitude complète : étirement total en bas.","Tenir 1–2s en haut.","Ne pas rebondir en bas."],errs:["Ne pas faire des demi-mouvements.","Ne pas descendre trop vite."],img:"mollets"},
    // 16/08 : bonus → PRINCIPAL (remplace le leg curl, douleur genou — le genou ne travaille
    // quasiment pas sur ce pattern). Version MACHINE à poids ajoutés : la charge = les disques.
    // 1re séance = calibration : caler le poids pour finir chaque série de 10 à ~2 reps de l'échec.
    {key:"hip_thrust",name:"Hip Thrust (machine)",poids:50,unite:"kg",serie:"4×10",rest:150,cue:"Haut du dos calé, pousse avec les talons, monte le bassin jusqu'à aligner épaules, hanches et genoux.",tips:["La charge = les disques ajoutés sur la machine.","Contraction des fessiers 1s en haut.","Garde le bas du dos neutre, ne creuse pas.","Genoux à ~90° en haut du mouvement."],errs:["Ne pas pousser sur les orteils.","Ne pas hypercambrer le bas du dos en haut.","Ne pas raccourcir l'amplitude pour charger plus."],img:"hipthrust"},
    // abduct/adduct ajoutés le 01/08/2026 (demande Adrien — muscler les jambes) : fessier moyen + adducteurs.
    {key:"abduct",bonus:true,name:"Abducteurs Machine",poids:25,unite:"kg",serie:"3×15",rest:60,cue:"Écarte les genoux contre la résistance, pause 1s jambes ouvertes, retour lent.",tips:["Dos collé au dossier, mains sur les poignées.","Écarte au maximum de ton amplitude.","Buste immobile : seules les jambes bougent."],errs:["Ne pas donner d'à-coups.","Ne pas laisser les genoux revenir d'un coup sec."],img:"abductor"},
    {key:"adduct",bonus:true,name:"Adducteurs Machine",poids:25,unite:"kg",serie:"3×15",rest:60,cue:"Serre les genoux l'un vers l'autre, 1s au centre, contrôle le retour.",tips:["Commence à amplitude confortable — les adducteurs n'aiment pas être surpris à froid.","Serre fort 1s au centre.","Retour lent, sans laisser la machine t'écarter d'un coup."],errs:["Ne pas prendre trop lourd (muscle sensible à l'étirement).","Ne pas décoller le bassin du siège."],img:"adductor"}
  ]},
  // OTHERS (ex-MAISON, 03/08) : Abdos · Poids de corps · Cardio anti-interférence bulk.
  // 22/08/2026 — refonte abdos (décision Adrien) : le programme = relevés chaise (flexion basse) ·
  // crunch lesté (flexion haute) · pallof (anti-rotation, repassé en REPS de tenues 2-3 s) ·
  // dead bug (anti-extension, dé-masqué). Crunch poulie et hollow hold → hidden (historique gardé).
  {id:"sb",t:"bonus",num:"Others",icon:"&#x1F525;",name:"OTHERS",sub:"Abdos · Poids de corps · Cardio",exos:[
    {key:"releve_chaise",cat:"abdo",name:"Relevés de Jambes (chaise romaine)",unite:"reps",inc:1,repTarget:true,serie:"3×10",rest:60,cue:"Dos contre le dossier, appui sur les coudes : monte les genoux JUSQU'À ce que le bassin s'enroule et que le bas du dos s'écrase contre le dossier.",tips:["Le repère = bassin enroulé + bas du dos écrasé contre le dossier. Si seules les jambes montent, c'est du psoas et ça aggrave ton antéversion.","Descente lente 2-3s, zéro balancier.","Progression : quand 3×15 passent, haltère de 4 kg entre les pieds."],errs:["Ne pas se balancer.","Ne pas s'arrêter à « lever les genoux » sans enrouler le bassin."],img:"hanglegraise"},
    {key:"crunch_leste",cat:"abdo",name:"Crunch Lesté",poids:5,unite:"kg",inc:2.5,serie:"3×12",rest:75,cue:"Au sol ou sur le banc à crunch, plaque de 5-10 kg tenue sur la poitrine : arrondis le dos, sternum vers le nombril.",tips:["Amplitude courte 20-30 cm, pas plus — c'est une FLEXION haute, pas un sit-up.","Le dos s'arrondit, le bas du dos reste collé : les hanches ne bougent jamais.","Progression : +2,5 kg dès que 3×15 passent proprement."],errs:["Ne pas tirer sur la nuque.","Ne pas monter le buste entier (ça devient du psoas)."]},
    // 12/10/2026 — ajouté à la demande d'Adrien : banc décliné, tête en bas, pieds bloqués en haut.
    {key:"crunch_decline",cat:"abdo",name:"Crunch Banc Décliné",unite:"reps",inc:1,repTarget:true,serie:"3×12",rest:60,cue:"Banc décliné, pieds bloqués sous les boudins, tête vers le bas : enroule le buste vers les genoux, une vertèbre après l'autre, puis redescends lentement.",tips:["Enroule le dos (sternum vers le bassin) au lieu de monter le buste droit : ce sont les abdos qui travaillent, pas les fléchisseurs de hanche.","Remonte jusqu'à ~45° maximum, puis redescends en 2-3 s sans reposer complètement le dos.","Progression : quand 3×15 passent proprement, passe au « Crunch Banc Décliné Lesté » (disque contre la poitrine)."],errs:["Ne pas tirer sur la nuque avec les mains.","Ne pas monter jusqu'à la verticale en tirant avec les jambes (ça devient du psoas et ça aggrave ton antéversion)."]},
    // 26/10/2026 — demande d'Adrien : la suite lestée du crunch décliné, en exo à part (comme le
    // marteau croisé) : la valeur d'un exo « repTarget » est un nombre de reps, pas une charge.
    {key:"crunch_decline_leste",cat:"abdo",name:"Crunch Banc Décliné Lesté",poids:2.5,unite:"kg",inc:2.5,serie:"3×12",rest:75,cue:"Banc décliné, pieds bloqués sous les boudins, disque tenu à plat contre la poitrine (bras croisés dessus) : enroule le buste vers les genoux, puis redescends lentement.",tips:["À prendre quand le crunch décliné au poids de corps passe en 3×15 propres : on repart à 3×12 avec 2,5 kg.","Le disque reste collé au sternum : plus il s'éloigne (bras tendus, derrière la tête), plus c'est dur — ne change pas de position en cours de série.","Progression : +2,5 kg dès que 3×15 passent proprement."],errs:["Ne pas tirer sur la nuque ni lancer le disque pour remonter.","Ne pas monter jusqu'à la verticale en tirant avec les jambes (ça devient du psoas et ça aggrave ton antéversion)."]},
    // 22/08/2026 — le Pallof repasse en REPS (décision Adrien) : 3×8-10/côté, chaque rep = une
    // tenue gainée de 2-3 s puis retour. La version « 20 s en continu » du 08/08 est remplacée.
    {key:"pallof",cat:"abdo",name:"Pallof Press (poulie)",poids:10,unite:"kg",inc:1,serie:"3×10/côté",rest:45,uni:true,cue:"Poulie à hauteur de sternum, de profil, perpendiculaire à la machine : tends les bras, TIENS 2-3 s sans pivoter, reviens — et recommence.",tips:["Chaque rep = 2-3 s de tenue bras tendus — la pause EST l'exercice.","Fessiers serrés, côtes basses, épaules loin des oreilles.","Très léger par principe : si tu tournes ou te penches, c'est trop lourd. 3×10 propres des deux côtés ? +1 cran de poulie."],errs:["Ne pas laisser la poulie te faire pivoter.","Ne pas enchaîner les reps sans la tenue de 2-3 s."],img:"pallofimg"},
    {key:"dead_bug",cat:"abdo",name:"Dead Bug",unite:"reps",inc:1,repTarget:true,serie:"3×10/côté",rest:45,cue:"Sur le dos, bas du dos PLAQUÉ au sol : tends lentement bras et jambe opposés.",tips:["Le bas du dos ne décolle JAMAIS — c'est tout l'exercice.","Le correctif direct de ton antéversion : c'est du contrôle, pas de la brûlure — ne pas « sentir » est normal.","Expire en tendant, très lent, 2s par répétition."],errs:["Ne pas cambrer quand la jambe descend.","Ne pas aller vite."],img:"deadbugimg"},
    {key:"crunch_poulie",cat:"abdo",hidden:true,name:"Crunch Poulie à genoux",poids:15,unite:"kg",inc:1,serie:"3×12",rest:75,cue:"À genoux dos à la poulie haute, corde tenue contre la tête : ENROULE le buste vers le bas, coudes vers les genoux.",tips:["C'est le dos qui s'arrondit — les hanches ne bougent pas.","Lourd et contrôlé : c'est LUI qui épaissit les abdos et les rend visibles.","Expire à fond en bas, 1s de contraction avant de remonter."],errs:["Ne pas tirer avec les bras.","Ne pas plier aux hanches (le fessier reste posé sur les talons)."],img:"cablecrunch"},
    {key:"hollow_hold",cat:"abdo",hidden:true,name:"Hollow Hold (dish)",unite:"s",inc:5,repTarget:true,serie:"3×20",rest:45,cue:"Sur le dos, bras et jambes tendus décollés du sol, bas du dos plaqué : tiens la position banane.",tips:["Plus les bras et jambes sont loin du corps, plus c'est dur — règle le levier.","Bas du dos collé au sol en permanence.","Respire court, ne bloque pas ta respiration."],errs:["Ne pas cambrer.","Ne pas monter les jambes trop haut pour tricher."],img:"hollowimg"},
    {key:"pompes",cat:"corps",name:"Pompes",unite:"reps",inc:1,repTarget:true,serie:"3×10",rest:60,bless:"Poignet : mains sur des poignées de pompes ou des haltères (poignet droit), jamais à plat à la reprise. Stop à la moindre douleur.",cue:"Corps gainé, descends la poitrine près du sol et pousse fort.",tips:["Remises au programme le 12/10 (demande Adrien) : poignées ou haltères au sol pour garder le poignet dans l'axe.","Mains un peu plus larges que les épaules.","Corps droit : ni fesses en l'air ni dos cambré.","Descente lente, poussée explosive."],errs:["Ne pas laisser les hanches s'affaisser.","Ne pas faire de demi-amplitude."]},
    {key:"gainage",cat:"corps",imp:true,name:"Gainage planche",unite:"s",inc:5,repTarget:true,serie:"3×40",rest:60,cue:"Aligne tête-dos-bassin, serre le ventre et les fessiers.",tips:["Coudes sous les épaules, appui sur les avant-bras.","Abdos et fessiers contractés tout du long.","Respire normalement, ne bloque pas."],errs:["Ne pas creuser le bas du dos.","Ne pas lever les fesses vers le haut."]},
    {key:"crunch",cat:"abdo",hidden:true,name:"Crunch",unite:"reps",inc:1,repTarget:true,serie:"3×15",rest:45,cue:"Enroule le buste, décolle les omoplates sans tirer sur la nuque.",tips:["Mains aux tempes, pas derrière la tête.","Expire en montant, contracte les abdos.","Mouvement court et contrôlé."],errs:["Ne pas tirer sur la nuque.","Ne pas aller trop vite par à-coups."]},
    // 08/08/2026 — réglages tapis CALIBRÉS sur les mesures d'Adrien (séance test) : 4,5/6 → 120 bpm
    // (bas de zone 2), 5,5/7 → 145 bpm (déjà zone 3). Sa cible 130-140 bpm tombe donc entre les deux
    // → 5 / 6,5. Se compte en MINUTES (cnt:"min"), plus jamais en « reps ».
    {key:"cardio_liss",cat:"cardio",name:"Cardio (tapis, escalier, vélo…)",unite:"min",cnt:"min",inc:5,repTarget:true,serie:"1×20",rest:0,cue:"TAPIS : inclinaison 5 · vitesse 6,5 km/h · 20 à 25 min NON-STOP, allure constante. Repère : ~130-140 bpm, tu dois pouvoir parler en marchant.",tips:["Tes réglages viennent de TES mesures : 4,5/6 = 120 bpm (trop facile), 5,5/7 = 145 bpm (trop haut). 5 / 6,5 te met pile dedans.","Ajuste en direct SANS changer le format : >140 bpm → −0,5 de vitesse · <125 bpm → +0,5 d'inclinaison. Puis tu ne touches plus à rien.","Un seul bloc continu, APRÈS PUSH ou PULL — jamais avant une séance, jamais après LEGS. +100 pts, max 2/semaine.","Vélo à la place du tapis : résistance moyenne, 70-80 tours/min, mêmes 130-140 bpm."],errs:["Ne pas faire de pyramide (5 min facile / 5 min dur) : la zone 2 est une allure CONSTANTE, pas des intervalles.","Ne pas transformer ça en HIIT (interférence + appétit saccagé) ni le caler un jour LEGS."],img:"bikeimg"},
    {key:"cardio_rameur",cat:"cardio",name:"Rameur Intervalles 30/30",unite:"min",cnt:"min",inc:1,repTarget:true,serie:"1×10",rest:0,cue:"10 min au rameur : 30s d'allure soutenue / 30s tranquille, en alternance.",tips:["Soutenu = tu pousses fort MAIS tu tiens les 10 min — ce n'est pas un sprint.","Jambes d'abord, dos droit, tirée franche.","Parfait en sortie de PUSH/PULL les semaines chargées. +100 pts, max 2/semaine."],errs:["Ne pas sprinter les 30s au maximum (ce n'est pas du HIIT).","Ne pas arrondir le dos en fin de tirée."],img:"rowerimg"},
    {key:"gripper",cat:"corps",name:"Gripper",unite:"kg",inc:5,serie:"3×30s/main",rest:45,uni:true,cue:"Ferme le gripper à fond, tiens 1s, relâche lentement.",tips:["Poignet droit, dans l'axe de l'avant-bras.","Serre au maximum en fin de course.","Travaille les deux mains à égalité."],errs:["Ne pas relâcher d'un coup sec.","Ne pas plier le poignet."]}
  ]},
  // 19/10/2026 — ROUTINE MAISON 🏠 (demande Adrien, recadrée 2 fois le même soir) : une petite séance de
  // 15-20 min LES JOURS SANS SALLE, pour ajouter du volume là où il en manque (pecs = son point faible,
  // jambes, bras) sans voler la récup des séances : TOUJOURS 1-2 reps en réserve, jamais à l'échec,
  // jamais la veille d'une séance qui travaille les mêmes muscles. 2 haltères au même poids → tout en
  // RÉPÉTITIONS (progression = reps puis tempo). Supersets pour tenir en 20 min. Ne compte aucune séance
  // de salle et ne se note pas (asPersistLog / liveLogNote20). Dead Bug retiré (Adrien doute de
  // l'antéversion notée sur photo : non confirmée par la borne de la salle, qui ne voit pas ce plan).
  {id:"sm",t:"bonus",num:"Maison",icon:"&#x1F3E0;",name:"ROUTINE MAISON",sub:"15-20 min · les jours sans salle",exos:[
    {key:"pompes",cat:"corps",imp:true,name:"Pompes sur haltères (amplitude max)",unite:"reps",inc:1,repTarget:true,serie:"3×12",rest:60,bless:"Poignet : mains sur les haltères posés au sol (poignet droit), jamais à plat. Stop à la moindre douleur.",cue:"Mains sur les haltères, corps gainé : descends la poitrine PLUS BAS que les mains (entre les haltères), 1 s d'étirement en bas, puis pousse. Arrête-toi à 1-2 reps de l'échec.",tips:["Ton exo pecs n°1 à la maison : les haltères te font descendre plus bas qu'au sol, et c'est l'étirement en bas qui fait grossir les pecs.","Pas la veille de ton PUSH.","Quand 3×15 passent : descente en 3 s, puis pieds surélevés sur le canapé."],errs:["Ne pas aller à l'échec : tes pecs doivent rester frais pour la salle.","Ne pas laisser le bassin s'affaisser."]},
    {key:"m_rdl",name:"Soulevé de terre roumain haltères",unite:"reps",inc:1,repTarget:true,serie:"3×12",rest:60,cue:"Debout, haltères devant les cuisses, genoux légèrement fléchis : recule les fesses, les haltères glissent jusqu'à mi-tibia, dos plat, 1 s d'étirement, puis remonte en serrant les fessiers.",tips:["Ischios + fessiers, et ton genou reste quasi immobile : le meilleur exo jambes pour toi à la maison.","Avec un poids léger, c'est la descente en 3 s qui fait le travail.","Pas la veille de LEGS."],errs:["Ne pas arrondir le dos.","Ne pas plier les genoux comme un squat."]},
    {key:"m_fentes",name:"Fentes arrière (haltères en main)",unite:"reps",inc:1,repTarget:true,serie:"2×10/jambe",rest:60,uni:true,bless:"Genou : amplitude sans douleur seulement. La fente ARRIÈRE charge beaucoup moins le genou que la fente avant ; stop au moindre pincement.",cue:"Debout, haltères le long du corps : recule une jambe, descends jusqu'à ce que le genou arrière frôle le sol, pousse sur le talon de la jambe avant pour remonter. Jambe GAUCHE d'abord.",tips:["Quadriceps + fessiers : complète le soulevé roumain (arrière des cuisses).","Le genou avant reste au-dessus de la cheville, dans l'axe du pied.","Un seul haltère si l'équilibre est difficile."],errs:["Ne pas laisser le genou avant rentrer vers l'intérieur.","Ne pas forcer sur une douleur de genou."]},
    {key:"m_marteau",name:"Curl marteau (2 haltères)",unite:"reps",inc:1,repTarget:true,serie:"2×12",rest:45,cue:"Debout, paumes face à face, coudes collés au corps : monte, serre 1 s, redescends en 2-3 s.",tips:["En superset avec l'extension triceps : bras complets en 5 min.","Prise neutre = poignet en sécurité.","Pas la veille de ton PULL."],errs:["Ne pas balancer le buste.","Ne pas lâcher la descente."]},
    {key:"m_triceps",name:"Extension triceps au-dessus de la tête (1 haltère)",unite:"reps",inc:1,repTarget:true,serie:"2×12",rest:45,cue:"Assis ou debout, un haltère tenu à deux mains au-dessus de la tête : descends-le loin derrière la nuque en pliant les coudes, puis tends.",tips:["Bras tendu au-dessus de la tête = la longue portion du triceps étirée, celle qui fait le volume du bras.","Les coudes pointent vers le plafond et restent serrés.","Pas la veille de ton PUSH."],errs:["Ne pas écarter les coudes.","Ne pas cambrer le bas du dos."]},
    {key:"m_releves",cat:"abdo",name:"Relevés de jambes au sol (bassin enroulé)",unite:"reps",inc:1,repTarget:true,serie:"2×12",rest:45,cue:"Sur le dos, mains sous les fesses, jambes fléchies : monte les genoux puis décolle le BASSIN du sol en l'enroulant vers toi, redescends lentement.",tips:["Le repère = le bassin qui décolle et s'enroule. Si seules les jambes bougent, ce sont les fléchisseurs de hanche qui travaillent, pas les abdos.","Bas du dos plaqué au sol pendant la descente.","Trop facile : jambes plus tendues, ou un haltère entre les pieds."],errs:["Ne pas balancer les jambes.","Ne pas cambrer en descendant."]},
    {key:"gainage",cat:"corps",name:"Gainage planche",unite:"s",inc:5,repTarget:true,serie:"2×45",rest:45,cue:"Aligne tête-dos-bassin, serre le ventre et les fessiers.",tips:["Coudes sous les épaules, appui sur les avant-bras.","Abdos et fessiers contractés tout du long.","Respire normalement, ne bloque pas."],errs:["Ne pas creuser le bas du dos.","Ne pas lever les fesses vers le haut."]},
    {key:"m_floor_press",bonus:true,name:"Floor Press haltères (prise neutre)",unite:"reps",inc:1,repTarget:true,serie:"3×12",rest:60,bless:"Poignet : paumes face à face, poignet droit dans l'axe de l'avant-bras.",cue:"Allongé au sol, genoux pliés, haltères paumes face à face : descends jusqu'à poser les triceps au sol, 1 s de pause, puis pousse en rapprochant les coudes.",tips:["À la place des pompes si les poignets ou les épaules tirent.","La pause au sol enlève l'élan : les pecs font tout."],errs:["Ne pas rebondir sur le sol.","Ne pas cambrer pour pousser."]},
    {key:"m_rowing",bonus:true,name:"Rowing haltère un bras (appui canapé)",unite:"reps",inc:1,repTarget:true,serie:"2×12/bras",rest:45,uni:true,cue:"Main et genou du même côté sur le canapé, dos plat : tire l'haltère vers la hanche, coude près du corps, 1 s en haut. Bras GAUCHE d'abord.",tips:["Le dos est ton point fort : ce n'est pas la priorité, mais ça équilibre les pompes.","Prise neutre : le poignet ne tourne pas."],errs:["Ne pas tourner le buste pour arracher.","Ne pas arrondir le dos."]},
    {key:"m_mollets",bonus:true,name:"Mollets debout sur une marche (haltères en main)",unite:"reps",inc:1,repTarget:true,serie:"2×20",rest:30,cue:"Avant des pieds sur une marche, haltères en main : monte sur la pointe, 1 s en haut, descends le talon le plus bas possible.",tips:["En fin de routine si tu as 3 minutes de plus.","Amplitude complète : c'est l'étirement en bas qui compte."],errs:["Ne pas rebondir.","Ne pas faire des demi-répétitions."]}
  ]}
];

// Catégories de la box OTHERS (tri d'affichage : Séances, setup LiveUp, ajout burger)
var OTHERS_CATS=[
  {id:'abdo',ico:'&#x1F525;',lbl:'Abdos'},
  {id:'corps',ico:'&#x1F4AA;',lbl:'Poids de corps'},
  {id:'cardio',ico:'&#x1F3C3;',lbl:'Cardio'}
];
function exoIsCardio(key){
  var info=findExoIndex(key);
  return !!(info&&info.exo&&info.exo.cat==='cardio');
}

// ── Objectifs & cibles (déplacés au 1er janvier 2027 — blessure poignet juil. 2026) ──
var OBJECTIF_DATE='2027-01-01';
var OBJECTIF_LABEL='1er janvier';
var BODYWEIGHT_GOAL=76; // repère indicatif (plus de cible chiffrée stricte — bulk jusqu'au 1er jan, sèche ensuite)
var BODYWEIGHT_START=62.85; // départ mars 2026, pour visualiser le chemin parcouru
var DEFAULT_AGE=21;
// Cibles au 1er janvier 2027 — RECALIBRÉES le 01/08/2026 par le coach sur la TRAJECTOIRE RÉELLE
// mars→juillet (ex. chest press +67%, leg ext +150%, tirage +60% en 4 mois malgré 3 sem. de pause) :
// 22 semaines restantes à ~4 séances/sem (~88 séances), 21 ans, surplus calorique, double progression.
// Rythmes appliqués (dégressifs vs les gains débutant) : grosses machines +2,5-3 kg/mois · haltères
// +1-1,5 kg/mois/main · isolation câble +1,5 kg/mois · jambes +4-6 kg/mois · assistance −5-6 kg/mois.
// ⚠️ seated_dips cible 0 = DIPS AU POIDS DU CORPS (exigence Adrien) · traction_assist 5 = quasi sans aide.
// Les exos estimés (rowing_appui, shrug_halt, cable_fly, abduct/adduct) → recaler après la 1re vraie séance.
// Charges en kg ; Maison en reps/s/kg (par série). Cibles inversées (assistance) : seated_dips, traction_assist.
var GOALS_JAN={
  // ═══ GOALS v4.1 — 14/08/2026 soir (fichier des poids réels du 30/07 retrouvé par Adrien) ═══
  // MÉTHODE (son cahier des charges) : la cible = le niveau qu'atteindrait au 1er janvier
  // « quelqu'un comme moi qui aurait tout fait de la bonne manière depuis le début » —
  // c.-à-d. SES départs de mars, SON évolution observée mars → juillet (rythme réel), SA
  // morpho (1m72 · 72 kg · ectomorphe en bulk depuis 5 mois), et sa force RELATIVE entre les
  // exos (dos/lats = fort → cibles hautes tenues · pecs insertion haute + biceps longs =
  // patients → cibles honnêtes · jambes de débutant → grosse marge · poignet = supination
  // bridée jusqu'à ~novembre). Rythme appliqué = son rythme novice observé, dégressé, exécution
  // propre — PAS une prolongation timide, PAS un fantasme.
  // ANCRE : les départs sont les poids RÉELS du 30/07 (START_S1). Note /100 : 50 = ce départ,
  // 100 = la cible ci-dessous. Médaille : Bronze III = aucun progrès depuis le 30/07, Champion =
  // cible atteinte (au rythme prévu : Diamant ~novembre, Champion ~décembre, jamais avant).
  // Vérif faite depuis les départs 30/07 (mars → 30/07 observé, puis projection 5 mois) :
  //   chest 30→50 (+5/mois) ⇒ 68 · pecdeck 24→44 (+5/mois) ⇒ 62 · incliné 10→18 ⇒ 28 ·
  //   tirage 30→48 (+4,5/mois, point fort) ⇒ 72 · rowing 28→44 ⇒ 66 · corde triceps 14→20 ⇒ 30 ·
  //   press 50→75 (+ le novice des jambes) ⇒ 130 · ext 20→30 ⇒ 60 · curl isch. 18→20 ⇒ 42.
  // Garde-fou : une cible ne peut JAMAIS être à moins de ~3 mois de rythme du poids actuel
  // (bug du curl haltères « déjà validé », corrigé 12→16). Soupape : bilan du 1er octobre.
  // PUSH — départs 30/07 : chest 50 · incliné 18 · pecdeck 44 · élév 8 · corde 20
  chestpress_v:68,dev_incline:28,pecdeck:62,elev_lat:12,triceps_corde:30,seated_dips:60,dips_assist:0,
  // PULL — départs 30/07 : tirage 48 · rowing 44 · uni 20 · marteau 10 · face pull 20 · assist 30
  tirage_vert:72,rowing_pb:66,rowing_uni:26,rowing_appui:54,curl_marteau:16,curl_marteau_croise:14,curl_incline_neutre:14,curl_corde:18,face_pull:30,
  shrug_halt:32,cable_fly:18,abduct:45,adduct:45,
  shoulder_press:26,tirage_pulldown:66,
  // dev_militaire passé aux HALTÈRES le 14/08 : départ réel 14 kg/côté → cible 20 kg/côté
  // (1 cran de 2 kg toutes les ~6 semaines — 20 aux haltères au-dessus de la tête, c'est costaud).
  dev_militaire:20,
  // Supination en pause (poignet, reprise ~nov.) : cibles de reprise, 2 mois utiles seulement.
  triceps_barre:26,curl_incline:12,curl_halt:16,traction_assist:0,
  // LEGS — départs 30/07 : press 75 · ext 30 · curl 20 · mollets 40 · hip 50 · abd/add 25
  // (il se juge « vraiment mauvais » en jambes : le novice des jambes MONTE, cibles sérieuses)
  leg_press:130,leg_ext:60,leg_curl:42,mollets:55,hip_thrust:85,
  gainage:90,crunch:30,gripper:40,
  // Abdos OTHERS : crunch lesté +2,5/6 sem, pallof petits crans, relevés → lestés à 3×15.
  crunch_poulie:32,pallof:16,releve_chaise:15,hollow_hold:45,crunch_leste:12.5
};
// Niveau "moyen attendu" en valeur absolue pour les exos Maison (pas de ratio poids de corps).
var MAISON_MOY={ pompes:15, gainage:60, crunch:25, gripper:30 };
function weeksUntilGoal(){
  var now=getNow();
  var end=new Date(OBJECTIF_DATE+'T00:00:00');
  var days=Math.ceil((end-now)/86400000);
  return {days:days,weeks:Math.max(0,Math.round(days/7))};
}

// Timer state
var timerInterval = null;
var timerEnd = null;
var timerExoId = null;
var calYear, calMonth2;
var weightChart = null, freqChart = null;
var _weightChartArr = null;
var _santeChartLogs = null;

var _chartJsLoading = false;
var _chartJsQueue = [];
function ensureChartJs(cb){
  if(typeof Chart !== 'undefined'){ if(cb) cb(); return; }
  if(cb) _chartJsQueue.push(cb);
  if(_chartJsLoading) return;
  _chartJsLoading = true;
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
  s.onload = function(){
    _chartJsLoading = false;
    try{ Chart.defaults.animation.duration = 350; }catch(e){} // anims plus courtes = moins de frames GPU (batterie)
    var q = _chartJsQueue.slice(); _chartJsQueue = [];
    q.forEach(function(fn){ fn(); });
  };
  document.head.appendChild(s);
}
var sessionStartTime = null;
var seanceTimerInterval = null;
var logEnergy = null;
var logFeeling = null;
var editingLogId = null;








var WARMUP = {
  push:{title:"Echauffement PUSH",sub:"Pecs Epaules Triceps - 5 min",steps:[
    {n:1,title:"Rotations epaules",detail:"Grands cercles vers l’avant puis l’arriere. Mouvement lent et ample.",time:"30s avant + 30s arriere"},
    {n:2,title:"Etirement epaule croisee",detail:"Bras tendu croise sur la poitrine. Pousse avec l’autre bras pour sentir l’etirement.",time:"20s chaque cote"},
    {n:3,title:"Rotations des poignets",detail:"Bras tendus devant toi, fais tourner les poignets dans les deux sens.",time:"20s"},
    {n:4,title:"Activation Chest Press",detail:"1 serie a poids leger (10-15kg) x 15 reps lentes. Activer les pecs, pas fatiguer.",time:"1 serie x 15 reps"}
  ]},
  pull:{title:"Echauffement PULL",sub:"Dos Biceps - 5 min",steps:[
    {n:1,title:"Rotations epaules",detail:"Grands cercles avant et arriere. Essentiel avant le tirage.",time:"30s avant + 30s arriere"},
    {n:2,title:"Ouverture poitrine",detail:"Mains dans le dos, pousse la poitrine vers l’avant, epaules vers l’arriere.",time:"30s"},
    {n:3,title:"Activation omoplates",detail:"Bras ecartes, serre les omoplates vers la colonne. Tiens 2s puis relache.",time:"10 reps lentes"},
    {n:4,title:"Activation Tirage Vertical",detail:"1 serie a poids leger (15-20kg) x 15 reps lentes. Focus sur les omoplates.",time:"1 serie x 15 reps"}
  ]},
  pull2:{title:"Echauffement PULL 2",sub:"Dos Biceps - 5 min",steps:[
    {n:1,title:"Rotations epaules",detail:"Grands cercles avant et arriere. Essentiel avant le tirage.",time:"30s avant + 30s arriere"},
    {n:2,title:"Ouverture poitrine",detail:"Mains dans le dos, pousse la poitrine vers l’avant, epaules vers l’arriere.",time:"30s"},
    {n:3,title:"Activation omoplates",detail:"Bras ecartes, serre les omoplates vers la colonne. Tiens 2s puis relache.",time:"10 reps lentes"},
    {n:4,title:"Activation Tirage Vertical",detail:"1 serie a poids leger (15-20kg) x 15 reps lentes. Focus sur les omoplates.",time:"1 serie x 15 reps"}
  ]},
  legs:{title:"Echauffement JAMBES",sub:"Cuisses Ischios - 5 min",steps:[
    {n:1,title:"Rotations de hanches",detail:"Mains sur les hanches, grands cercles dans les deux sens.",time:"30s chaque sens"},
    {n:2,title:"Squats poids du corps",detail:"Descends lentement, dos droit. Active les quadriceps et ouvre les hanches.",time:"15 reps lentes"},
    {n:3,title:"Etirement ischios",detail:"Jambe tendue devant toi, penche le buste vers l’avant doucement.",time:"20s chaque jambe"},
    {n:4,title:"Activation Leg Press",detail:"1 serie a poids leger (20-30kg) x 15 reps lentes. Pousse avec les talons.",time:"1 serie x 15 reps"}
  ]}
};

function buildWarmup(sid,t){
  var w=WARMUP[t]; if(!w) return "";
  var steps=w.steps.map(function(s){
    return "<div class=\"warmup-step\"><div class=\"ws-num\">"+s.n+"</div>"
      +"<div class=\"ws-content\"><div class=\"ws-title\">"+s.title+"</div>"
      +"<div class=\"ws-detail\">"+s.detail+"</div>"
      +"<div class=\"ws-time\">"+s.time+"</div></div></div>";
  }).join("");
  return "<button class=\"warmup-btn\" id=\"wubtn-"+sid+"\" onclick=\"toggleWarmup('"+sid+"')\">"
    +"&#x1F525; Echauffement <span class=\"wb-arr\">&#x25BE;</span></button>"
    +"<div class=\"warmup-body\" id=\"wubody-"+sid+"\">"
    +"<div class=\"warmup-hdr\"><div class=\"warmup-hdr-title\">"+w.title+"</div>"
    +"<div class=\"warmup-hdr-sub\">"+w.sub+"</div></div>"
    +"<div>"+steps+"</div>"
    +"<div class=\"warmup-note\">5 min avant de charger = moins de blessures + meilleures premieres series.</div>"
    +"</div>";
}

function toggleWarmup(sid){
  var btn=document.getElementById("wubtn-"+sid);
  var body=document.getElementById("wubody-"+sid);
  if(!btn||!body) return;
  var open=body.classList.contains("open");
  btn.classList.toggle("open",!open);
  body.classList.toggle("open",!open);
}

