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
  evolution: {},   // évolutions de charge en cours (15/08) : key -> {from, to, hi} — hi = nb de séries au poids haut (en fin d'exo)
  nutriA: {day:{},favs:[]} // mode NUTRITION prise de masse (23/08) : day['YYYY-MM-DD'] -> {pdj,dej,din,snacks[],shaker} · favs = ids recettes
};

// ── MISE DE CÔTÉ (15/08/2026, demande Adrien) : rank, objectifs de charges, radar des notes ──
// RIEN n'est supprimé : tout le moteur (rankState, GOALS_JAN, rankLadder, radar...) reste en
// place et se réactive en repassant ces flags à true. Seul l'AFFICHAGE est débranché.
var FEATURE_RANK=false;   // médaille profil, section rank du Bilan, RP dans bilans / modal jour
var FEATURE_GOALS=false;  // section « Objectifs & repères — 1er janvier » (Progression)
var FEATURE_RADAR=false;  // radar « Ton niveau » / araignée des notes d'exo (Progression)
var FEATURE_FULL_BILAN=true; // bilan de SÉANCE complet (slides analyse/notes par exo/classements) — réactivé le 18/08 (retour Adrien : l'épuré du 15/08 enlevait les retours par exo, les classements et la progression des charges qu'il voulait garder). false = note /20 + suggestions seulement.

function loadDB(){
  if(_saveDBTimer) _flushSaveDB(); // une écriture débouncée est en attente → flush avant relecture
  try{
    var s = localStorage.getItem('massup_db');
    if(s){ var d=JSON.parse(s); if(d.weights) DB.weights=d.weights; if(d.logs) DB.logs=d.logs; if(d.weightSetDate) DB.weightSetDate=d.weightSetDate; if(d.bodyWeight) DB.bodyWeight=d.bodyWeight; if(d.healthLogs) DB.healthLogs=d.healthLogs; if(d.health) DB.health=d.health; if(d.healthMeta) DB.healthMeta=d.healthMeta; if(d.sleepLog) DB.sleepLog=d.sleepLog; if(d.templates) DB.templates=d.templates; if(d.profile) DB.profile=d.profile; if(d.deletedWeights) DB.deletedWeights=d.deletedWeights; if(d.deletedBW) DB.deletedBW=d.deletedBW; if(d.deletedLogs) DB.deletedLogs=d.deletedLogs; if(d.nutrition) DB.nutrition=d.nutrition; if(d.reminders) DB.reminders=d.reminders; if(d.painLog) DB.painLog=d.painLog; if(d.rank) DB.rank=d.rank; if(d.prepared) DB.prepared=d.prepared; if(d.dz) DB.dz=d.dz; if(d.evolution) DB.evolution=d.evolution; if(d.nutriA) DB.nutriA=d.nutriA; if(d.pv) DB.pv=d.pv; }
  }catch(e){}
}
// Écriture localStorage débouncée (300ms) : localStorage.setItem est synchrone et bloque le
// thread principal à chaque action — on regroupe. Flush garanti sur pagehide/visibilitychange.
// ── 👟 Pas & activité (29/09, demande Adrien) — module commun steps.js (chargé avant app.js) ──
// Bloc « Pas » sous « Cette semaine » au Bilan, écran complet, données Santé via Raccourci iOS → /api/health.
if(typeof STEPS!=='undefined') STEPS.init({app:'adrien',db:function(){ return DB; },save:function(){ saveDB(); },toast:function(m){ showToast(m); },
  sb:function(){ return (typeof sbClient!=='undefined'&&sbClient)?sbClient:null; },weekPtsMax:3,
  onChange:function(){ if(_currentView==='sante') try{ renderSante(); }catch(e){} }});
if(typeof SLEEP!=='undefined') SLEEP.init({db:function(){ return DB; },save:function(){ saveDB(); },toast:function(m){ showToast(m); }});
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
    {key:"elev_lat",imp:true,name:"Élévation Latérale",poids:6,unite:"kg/main",serie:"4×15",rest:75,cue:"Fais le T — mouvement lent.",tips:["6 kg · 4×15 : la brûlure sur les dernières reps = exactement le stimulus cherché.","Bras légèrement fléchi tout au long, contrôle la descente (3s).","Monter jusqu'à la hauteur des épaules."],errs:["Ne pas balancer le buste.","Ne pas hausser les épaules."],img:"lateralraise"},
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
    {key:"curl_halt",bonus:true,name:"Curl Haltères",poids:10,unite:"kg",serie:"4×8",rest:90,bless:"Reprise en douceur : charge légère, poignet dans l'axe — stoppe à la moindre gêne.",cue:"Coudes collés au corps. Que les avant-bras qui pivotent.",tips:["Coudes fixes contre les côtes.","Contraction 1s en haut.","Descente lente (3s)."],errs:["Ne pas monter les épaules.","Ne pas balancer le dos."],img:"dumbbellcurl"},
    {key:"curl_poulie",hidden:true,name:"Curl Poulie Basse",poids:10,unite:"kg",serie:"4×10",rest:90,cue:"Serre les biceps en haut pendant 1 seconde.",tips:["Coudes stables, ne bougent pas.","Descente contrôlée.","Garde la tension."],errs:["Ne pas avancer les coudes.","Ne pas remonter trop vite."],img:"cablecurl"},
    // curl_incline (supination) réactivé en BONUS le 15/08 (demande Adrien) — même statut que le
    // curl haltères : reprise légère, supination progressive, stop à la moindre gêne au poignet.
    {key:"curl_incline",bonus:true,name:"Curl Incliné Haltères (banc)",poids:8,unite:"kg",serie:"3×10",rest:90,bless:"Supination = à doser : charge légère, tourne les paumes SANS forcer, stoppe à la moindre gêne au poignet.",cue:"Laisse les bras pendre derriere toi au depart.",tips:["Banc incline a 45-60 deg.","Etirement complet du biceps en bas.","Descente lente."],errs:["Ne pas avancer les coudes.","Ne pas descendre rapidement."],img:"inclinecurl"}
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
    // 22/08/2026 — le Pallof repasse en REPS (décision Adrien) : 3×8-10/côté, chaque rep = une
    // tenue gainée de 2-3 s puis retour. La version « 20 s en continu » du 08/08 est remplacée.
    {key:"pallof",cat:"abdo",name:"Pallof Press (poulie)",poids:10,unite:"kg",inc:1,serie:"3×10/côté",rest:45,uni:true,cue:"Poulie à hauteur de sternum, de profil, perpendiculaire à la machine : tends les bras, TIENS 2-3 s sans pivoter, reviens — et recommence.",tips:["Chaque rep = 2-3 s de tenue bras tendus — la pause EST l'exercice.","Fessiers serrés, côtes basses, épaules loin des oreilles.","Très léger par principe : si tu tournes ou te penches, c'est trop lourd. 3×10 propres des deux côtés ? +1 cran de poulie."],errs:["Ne pas laisser la poulie te faire pivoter.","Ne pas enchaîner les reps sans la tenue de 2-3 s."],img:"pallofimg"},
    {key:"dead_bug",cat:"abdo",name:"Dead Bug",unite:"reps",inc:1,repTarget:true,serie:"3×10/côté",rest:45,cue:"Sur le dos, bas du dos PLAQUÉ au sol : tends lentement bras et jambe opposés.",tips:["Le bas du dos ne décolle JAMAIS — c'est tout l'exercice.","Le correctif direct de ton antéversion : c'est du contrôle, pas de la brûlure — ne pas « sentir » est normal.","Expire en tendant, très lent, 2s par répétition."],errs:["Ne pas cambrer quand la jambe descend.","Ne pas aller vite."],img:"deadbugimg"},
    {key:"crunch_poulie",cat:"abdo",hidden:true,name:"Crunch Poulie à genoux",poids:15,unite:"kg",inc:1,serie:"3×12",rest:75,cue:"À genoux dos à la poulie haute, corde tenue contre la tête : ENROULE le buste vers le bas, coudes vers les genoux.",tips:["C'est le dos qui s'arrondit — les hanches ne bougent pas.","Lourd et contrôlé : c'est LUI qui épaissit les abdos et les rend visibles.","Expire à fond en bas, 1s de contraction avant de remonter."],errs:["Ne pas tirer avec les bras.","Ne pas plier aux hanches (le fessier reste posé sur les talons)."],img:"cablecrunch"},
    {key:"hollow_hold",cat:"abdo",hidden:true,name:"Hollow Hold (dish)",unite:"s",inc:5,repTarget:true,serie:"3×20",rest:45,cue:"Sur le dos, bras et jambes tendus décollés du sol, bas du dos plaqué : tiens la position banane.",tips:["Plus les bras et jambes sont loin du corps, plus c'est dur — règle le levier.","Bas du dos collé au sol en permanence.","Respire court, ne bloque pas ta respiration."],errs:["Ne pas cambrer.","Ne pas monter les jambes trop haut pour tricher."],img:"hollowimg"},
    {key:"pompes",cat:"corps",hidden:true,name:"Pompes",unite:"reps",inc:1,repTarget:true,serie:"3×10",rest:60,cue:"Corps gainé, descends la poitrine près du sol et pousse fort.",tips:["Mains un peu plus larges que les épaules.","Corps droit : ni fesses en l'air ni dos cambré.","Descente lente, poussée explosive."],errs:["Ne pas laisser les hanches s'affaisser.","Ne pas faire de demi-amplitude."]},
    {key:"gainage",cat:"corps",imp:true,name:"Gainage planche",unite:"s",inc:5,repTarget:true,serie:"3×40",rest:60,cue:"Aligne tête-dos-bassin, serre le ventre et les fessiers.",tips:["Coudes sous les épaules, appui sur les avant-bras.","Abdos et fessiers contractés tout du long.","Respire normalement, ne bloque pas."],errs:["Ne pas creuser le bas du dos.","Ne pas lever les fesses vers le haut."]},
    {key:"crunch",cat:"abdo",hidden:true,name:"Crunch",unite:"reps",inc:1,repTarget:true,serie:"3×15",rest:45,cue:"Enroule le buste, décolle les omoplates sans tirer sur la nuque.",tips:["Mains aux tempes, pas derrière la tête.","Expire en montant, contracte les abdos.","Mouvement court et contrôlé."],errs:["Ne pas tirer sur la nuque.","Ne pas aller trop vite par à-coups."]},
    // 08/08/2026 — réglages tapis CALIBRÉS sur les mesures d'Adrien (séance test) : 4,5/6 → 120 bpm
    // (bas de zone 2), 5,5/7 → 145 bpm (déjà zone 3). Sa cible 130-140 bpm tombe donc entre les deux
    // → 5 / 6,5. Se compte en MINUTES (cnt:"min"), plus jamais en « reps ».
    {key:"cardio_liss",cat:"cardio",name:"Cardio Zone 2 (tapis / vélo)",unite:"min",cnt:"min",inc:5,repTarget:true,serie:"1×20",rest:0,cue:"TAPIS : inclinaison 5 · vitesse 6,5 km/h · 20 à 25 min NON-STOP, allure constante. Repère : ~130-140 bpm, tu dois pouvoir parler en marchant.",tips:["Tes réglages viennent de TES mesures : 4,5/6 = 120 bpm (trop facile), 5,5/7 = 145 bpm (trop haut). 5 / 6,5 te met pile dedans.","Ajuste en direct SANS changer le format : >140 bpm → −0,5 de vitesse · <125 bpm → +0,5 d'inclinaison. Puis tu ne touches plus à rien.","Un seul bloc continu, APRÈS PUSH ou PULL — jamais avant une séance, jamais après LEGS. +100 pts, max 2/semaine.","Vélo à la place du tapis : résistance moyenne, 70-80 tours/min, mêmes 130-140 bpm."],errs:["Ne pas faire de pyramide (5 min facile / 5 min dur) : la zone 2 est une allure CONSTANTE, pas des intervalles.","Ne pas transformer ça en HIIT (interférence + appétit saccagé) ni le caler un jour LEGS."],img:"bikeimg"},
    {key:"cardio_rameur",cat:"cardio",name:"Rameur Intervalles 30/30",unite:"min",cnt:"min",inc:1,repTarget:true,serie:"1×10",rest:0,cue:"10 min au rameur : 30s d'allure soutenue / 30s tranquille, en alternance.",tips:["Soutenu = tu pousses fort MAIS tu tiens les 10 min — ce n'est pas un sprint.","Jambes d'abord, dos droit, tirée franche.","Parfait en sortie de PUSH/PULL les semaines chargées. +100 pts, max 2/semaine."],errs:["Ne pas sprinter les 30s au maximum (ce n'est pas du HIIT).","Ne pas arrondir le dos en fin de tirée."],img:"rowerimg"},
    {key:"gripper",cat:"corps",name:"Gripper",unite:"kg",inc:5,serie:"3×30s/main",rest:45,uni:true,cue:"Ferme le gripper à fond, tiens 1s, relâche lentement.",tips:["Poignet droit, dans l'axe de l'avant-bras.","Serre au maximum en fin de course.","Travaille les deux mains à égalité."],errs:["Ne pas relâcher d'un coup sec.","Ne pas plier le poignet."]}
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

// ══════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════
function init(){
  loadDB();
  initWeights();
  initHealthLogs();
  initLogs();
  initReminders();
  rebuildPainLogFromLive(); // journal poignet recréé depuis le détail cloud des séances si purgé (11/08)
  // Restauration post-incident 11/08 : pesées connues (docs projet) + profil — one-shot,
  // merge non destructif (ne touche à rien de déjà saisi).
  if(!DB.profile.restore1108){
    mergeBackupIntoDB({
      profile:{name:'Adrien',height:172,goal:'masse',weekGoal:3},
      bodyWeight:[
        {date:'2026-03-11',weight_kg:62.85,note:'restauré (incident 11/08)'},
        {date:'2026-03-22',weight_kg:64.60,note:'restauré (incident 11/08)'},
        {date:'2026-04-01',weight_kg:65.70,note:'restauré (incident 11/08)'},
        {date:'2026-04-14',weight_kg:66.60,note:'restauré (incident 11/08)'},
        {date:'2026-07-30',weight_kg:72.00,note:'restauré (incident 11/08)'}
      ]
    });
    DB.profile.restore1108=true;
    saveDB();
  }
  // Restauration 11/08 (2e passe) — AOÛT reconstruit depuis les screens d'Adrien :
  // séances 30/07→10/08 (détail série par série pour 01/04/05-08, exact des captures),
  // hausses de charges d'août, déclarations hebdo, pesée 30/07 corrigée (71,6 — pas 72),
  // rythme 4 séances/sem (profil du 02/08). La séance du 11/08 vit déjà dans l'app.
  if(!DB.profile.restore1108b){
    var F='facile',O='ok',D='dur',E='echec';
    function _rs(arr){ return arr.map(function(s){return {reps:s[0],feel:s[1],w:s[2]};}); }
    function _rx(key,name,unite,n,reps,w0,w,sets,extra,status){
      return {key:key,name:name,w:w,w0:w0,n:n,reps:reps,unite:unite,cnt:null,
        status:status||'done',extra:!!extra,sets:sets,sk:0};
    }
    mergeBackupIntoDB({
      logs:[
        // ~30/07 — PUSH (3e séance de la semaine du 27/07, visible sur le profil du 02/08 ; jambes encore en pause → pas un LEGS)
        {id:20260730203000,date:'2026-07-30',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
        // 01/08 — PULL (détail exact du screen : CLEAN SWEEP +100, PR Face Pull 22, série bonus Face Pull, MVP tirage)
        {id:20260801203000,date:'2026-08-01',time:'20:30',sessions:['s2'],comment:'',feeling:null,energy:null,duration_min:null,live:{
          exos:[
            _rx('tirage_vert','Tirage Vertical (Dos)','kg',4,8,48,48,_rs([[8,O,48],[8,O,48],[8,D,48],[7,E,48]])),
            _rx('rowing_pb','Rowing Poulie Basse (Triangle)','kg',4,8,44,44,_rs([[7,O,44],[7,D,44],[7,D,44],[8,E,44]])),
            _rx('curl_marteau','Curl Marteau','kg',4,10,10,10,_rs([[8,O,10],[8,D,10],[8,E,10],[6,E,10]])),
            _rx('elev_lat','Élévation Latérale','kg/main',4,12,8,8,_rs([[8,F,8],[8,O,8],[8,D,8],[7,E,8]]),true),
            _rx('curl_corde','Curl Corde Basse (neutre)','kg',4,8,12,12,_rs([[8,F,12],[5,E,12],[8,E,12],[8,E,12]])),
            _rx('face_pull','Face Pull','kg',3,15,20,22,_rs([[8,F,22],[8,F,22],[8,O,22],[8,D,22]])),
            _rx('rowing_uni','Rowing Unilatéral Poulie','kg',4,8,20,20,_rs([[8,O,20],[8,D,20],[6,E,20]]),true,'skipped')
          ],pain:null,painNote:'',context:null,stretch:false,warmup:true}},
        // 02/08 — PUSH (case orange du calendrier ; détail perdu)
        {id:20260802203000,date:'2026-08-02',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
        // 04/08 — PULL + jambes/abdo (détail exact du screen)
        {id:20260804203000,date:'2026-08-04',time:'20:30',sessions:['s2'],comment:'',feeling:null,energy:null,duration_min:null,live:{
          exos:[
            _rx('rowing_pb','Rowing Poulie Basse (Triangle)','kg',4,8,44,48,_rs([[8,F,44],[8,O,44],[8,O,44],[8,D,48]])),
            _rx('rowing_appui','Rowing Machine (appui pectoral)','kg',4,10,35,40,_rs([[10,F,35],[10,E,45],[10,E,40],[9,E,40]])),
            _rx('curl_marteau','Curl Marteau','kg',4,10,10,10,_rs([[10,E,10],[10,D,10],[8,E,10],[7,E,10]])),
            _rx('curl_corde','Curl Corde Basse (neutre)','kg',4,8,12,10,_rs([[8,E,12],[8,E,12],[10,E,10],[10,E,10]])),
            _rx('face_pull','Face Pull','kg',3,15,22,22,_rs([[15,F,22],[15,E,22],[11,E,22]])),
            _rx('shrug_halt','Shrugs Haltères (trapèzes)','kg/main',3,12,20,22,_rs([[12,D,22],[12,D,22],[8,E,22]]),true),
            _rx('elev_lat','Élévation Latérale','kg/main',3,12,8,8,_rs([[12,D,8],[8,E,8],[6,E,8]])),
            _rx('leg_press','Leg Press','kg',3,10,80,80,_rs([[10,D,80],[10,O,80],[10,D,80]])),
            _rx('releve_chaise','Relevés de Jambes (chaise romaine)','reps',3,10,10,10,_rs([[10,O,10],[10,E,10],[10,E,10]]),true)
          ],pain:null,painNote:'',context:null,stretch:false,warmup:true}},
        // 05/08 — PUSH + abdo/jambes (détail exact du screen)
        {id:20260805203000,date:'2026-08-05',time:'20:30',sessions:['s1'],comment:'',feeling:null,energy:null,duration_min:null,live:{
          exos:[
            _rx('dev_incline','Développé Incliné Haltères','kg/côté',4,8,18,20,_rs([[8,F,18],[8,O,18],[8,D,20],[8,E,20]])),
            _rx('chestpress_v','Chest Press Vertical','kg',4,8,50,50,_rs([[8,F,50],[8,D,50],[8,E,50],[8,D,50]])),
            _rx('pecdeck','Pec Deck','kg',4,10,49,44,_rs([[10,E,49],[10,E,49],[10,D,44],[10,D,44]])),
            _rx('elev_lat','Élévation Latérale','kg/main',4,12,8,8,_rs([[10,O,8],[10,D,8],[10,E,8],[10,E,8]])),
            _rx('triceps_corde','Triceps Poulie Corde','kg',4,10,22,22,_rs([[10,O,22],[9,E,22],[8,E,22],[6,E,22]])),
            _rx('crunch_poulie','Crunch Poulie à genoux','kg',3,12,20,22,_rs([[12,D,20],[12,F,18],[12,E,22]]),true),
            _rx('releve_chaise','Relevés de Jambes (chaise romaine)','reps',3,10,10,10,_rs([[10,D,10],[10,D,10],[8,E,10]]),true),
            _rx('leg_ext','Leg Extension (Quadriceps)','kg',4,12,40,40,_rs([[12,O,40],[12,E,40],[8,E,40],[12,E,35]])),
            _rx('dips_assist','Dips Assistée (machine)','kg',3,10,25,40,_rs([[10,F,25],[10,E,45],[10,D,40]]),true)
          ],pain:null,painNote:'',context:null,stretch:true,warmup:true}},
        // 06/08 — LEGS + abdos (crunch poulie, pallof) — détail perdu
        {id:20260806203000,date:'2026-08-06',time:'20:30',sessions:['s3','exo:crunch_poulie','exo:pallof'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
        // 08/08 — PULL + leg curl + relevés chaise romaine + exos bonus — détail perdu
        {id:20260808203000,date:'2026-08-08',time:'20:30',sessions:['s2','exo:leg_curl','exo:releve_chaise'],comment:'Reconstituée (incident 11/08) — détail perdu (nombreux bonus)',feeling:null,energy:null,duration_min:null},
        // 10/08 — PUSH classique + leg press + relevés — détail perdu
        {id:20260810203000,date:'2026-08-10',time:'20:30',sessions:['s1','exo:leg_press','exo:releve_chaise'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null}
      ],
      // Hausses d'août lues sur les screens (fill par date, n'écrase rien)
      weights:{
        face_pull:[{date:'2026-08-01',val:22}],
        rowing_pb:[{date:'2026-08-04',val:48},{date:'2026-08-11',val:52}],
        rowing_appui:[{date:'2026-08-04',val:40}],
        shrug_halt:[{date:'2026-08-04',val:22}],
        dev_incline:[{date:'2026-08-05',val:20}],
        crunch_poulie:[{date:'2026-08-05',val:22}],
        pecdeck:[{date:'2026-08-05',val:44}],
        leg_ext:[{date:'2026-08-05',val:40}],
        dips_assist:[{date:'2026-08-05',val:40}],
        tirage_vert:[{date:'2026-08-11',val:56}]
      },
      // Déclarations hebdo : sem. 27/07 (screen profil 02/08 : 4 pdj, 2 shakers) · sem. 03/08 (dicté par Adrien)
      rank:{weekly:{'2026-07-27':{pdj:4,shaker:2,cardio:0},'2026-08-03':{pdj:4,shaker:2,cardio:1}}},
      // 2 jours étirés sem. 03-09/08 (dicté) — le 05 est visible sur le calendrier
      dz:{'2026-08-05':{stretch:true},'2026-08-08':{stretch:true}}
    });
    // Corrections directes (le merge ne remplace pas l'existant) :
    DB.profile.weekGoal=4; // screen profil 02/08 : « 4 séances/sem »
    (DB.bodyWeight||[]).forEach(function(b){ if(b.date==='2026-07-30'&&b.weight_kg===72){ b.weight_kg=71.6; } }); // vraie pesée du 30/07
    DB.profile.restore1108b=true;
    saveDB();
  }
  // Restauration 11/08 (3e passe) — corrections d'après les screens du 31/07 (calendrier juillet
  // + historique pesées) : la « séance du 30/07 » n'existait pas (la 3e de la semaine du 27/07
  // était la séance MAISON du 28/07, case violette) ; juillet réinjecté en entier (dates + types
  // exacts du calendrier) ; séance du 11/08 recréée (détail du screen — elle avait été perdue
  // entre l'entraînement et la première connexion) ; pesées mai-juillet complétées.
  if(!DB.profile.restore1108c){
    var F2='facile',O2='ok',D2='dur',E2='echec';
    function _rs2(arr){ return arr.map(function(s){return {reps:s[0],feel:s[1],w:s[2]};}); }
    function _rx2(key,name,unite,n,reps,w0,w,sets,extra,status){
      return {key:key,name:name,w:w,w0:w0,n:n,reps:reps,unite:unite,cnt:null,
        status:status||'done',extra:!!extra,sets:sets||[],sk:0};
    }
    // 1) Retirer la séance inventée du 30/07 (restore1108b)
    DB.logs=(DB.logs||[]).filter(function(l){ return String(l.id)!=='20260730203000'; });
    // 2) La séance du 11/08 : ne l'injecter QUE si aucune séance n'existe déjà ce jour-là
    var _has1108=(DB.logs||[]).some(function(l){ return l.date==='2026-08-11'; });
    var _logs=[
      // Juillet 2026 — dates/types EXACTS du screen calendrier (orange=PUSH, bleu=PULL, violet=MAISON)
      {id:20260702203000,date:'2026-07-02',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260704203000,date:'2026-07-04',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260705203000,date:'2026-07-05',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260707203000,date:'2026-07-07',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260708203000,date:'2026-07-08',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260710203000,date:'2026-07-10',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260712203000,date:'2026-07-12',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260713203000,date:'2026-07-13',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260715203000,date:'2026-07-15',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260717203000,date:'2026-07-17',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260720203000,date:'2026-07-20',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260721203000,date:'2026-07-21',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260723203000,date:'2026-07-23',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — détail perdu',feeling:null,energy:null,duration_min:null},
      {id:20260725110000,date:'2026-07-25',time:'11:00',sessions:['sb'],comment:'Reconstituée (incident 11/08) — séance maison',feeling:null,energy:null,duration_min:null},
      {id:20260728110000,date:'2026-07-28',time:'11:00',sessions:['sb'],comment:'Reconstituée (incident 11/08) — séance maison',feeling:null,energy:null,duration_min:null}
    ];
    if(!_has1108){
      _logs.push({id:20260811183000,date:'2026-08-11',time:'18:30',sessions:['s2'],comment:'',feeling:null,energy:null,duration_min:null,live:{
        exos:[
          _rx2('tirage_vert','Tirage Vertical (Dos)','kg',4,8,50,56,_rs2([[8,O2,50],[10,O2,50],[9,D2,56],[8,E2,56]])),
          _rx2('rowing_pb','Rowing Poulie Basse (Triangle)','kg',4,8,48,52,_rs2([[8,O2,48],[8,O2,48],[8,D2,48],[6,E2,52]])),
          _rx2('rowing_appui','Rowing Machine (appui pectoral)','kg',4,10,40,40,_rs2([[10,D2,40],[10,E2,40],[10,E2,40],[9,E2,40]])),
          _rx2('curl_corde','Curl Corde Basse (neutre)','kg',4,10,12,12,_rs2([[10,D2,12],[10,D2,12],[10,E2,12],[8,E2,12]])),
          _rx2('curl_marteau','Curl Marteau','kg',4,10,10,10,_rs2([[10,D2,10],[10,E2,10],[9,E2,10],[5,E2,10]])),
          _rx2('face_pull','Face Pull','kg',3,15,22,22,[],false,'skipped'),
          _rx2('leg_ext','Leg Extension (Quadriceps)','kg',4,12,40,40,[],true,'skipped')
        ],pain:null,painNote:'',context:'blessure',stretch:false,warmup:true}});
    }
    mergeBackupIntoDB({
      logs:_logs,
      // Tirage monté à 50 pendant la séance du 08/08 (base 50 kg au screen du 11/08), PR 56 & 52 le 11/08
      weights:{
        tirage_vert:[{date:'2026-08-08',val:50},{date:'2026-08-11',val:56}],
        rowing_pb:[{date:'2026-08-11',val:52}]
      },
      // Pesées : exactes (historique du screen du 31/07) + approximations lissées sur la courbe
      bodyWeight:[
        {date:'2026-04-26',weight_kg:66.9,note:'restauré (approx. courbe)'},
        {date:'2026-05-07',weight_kg:66.1,note:'restauré (approx. courbe)'},
        {date:'2026-06-06',weight_kg:68.2,note:'restauré (approx. — déduit du +1,3 du 13/06)'},
        {date:'2026-06-13',weight_kg:69.5,note:'restauré (screen 31/07)'},
        {date:'2026-06-19',weight_kg:69.85,note:'restauré (screen 31/07)'},
        {date:'2026-07-05',weight_kg:69.05,note:'restauré (screen 31/07)'},
        {date:'2026-07-14',weight_kg:70.2,note:'restauré (screen 31/07)'}
      ]
    });
    DB.profile.restore1108c=true;
    saveDB();
  }
  // Restauration 11/08 (4e passe) — retours Adrien sur la 3e :
  // · cases violettes du calendrier ≠ séance maison (sb = 0,5 séance) : violet/gris = jour ABDO
  //   (les exos abdo dominent la couleur) → 25 et 28/07 requalifiées en jours abdo (comptent 1) ;
  // · leg extension du 11/08 : exo jambes OBLIGATOIRE de la séance, pas un bonus → extra:false ;
  // · traction assistée : vraie trajectoire dictée (45 kg d'assistance début juin → 25 au 30/07
  //   (canonical) → 20 au 11/08) — remplace l'entrée auto erronée du premier boot.
  if(!DB.profile.restore1108d){
    (DB.logs||[]).forEach(function(l){
      if(String(l.id)==='20260725110000'||String(l.id)==='20260728110000'){
        l.sessions=['exo:crunch_poulie','exo:pallof','exo:releve_chaise'];
        l.comment='Reconstituée (incident 11/08) — jour abdos';
      }
      if(String(l.id)==='20260811183000'&&l.live&&l.live.exos){
        l.live.exos.forEach(function(x){ if(x.key==='leg_ext') x.extra=false; });
      }
    });
    var _taKeep=(DB.weights.traction_assist||[]).filter(function(e){ return e.date>'2026-08-11'; });
    DB.weights.traction_assist=[{date:'2026-06-01',val:45},{date:'2026-07-30',val:25},{date:'2026-08-11',val:20}].concat(_taKeep);
    DB.weightSetDate.traction_assist=DB.weights.traction_assist[DB.weights.traction_assist.length-1].date;
    DB.profile.restore1108d=true;
    saveDB();
  }
  // Restauration 12/08 (5e passe) — retours Adrien du soir :
  // · JUIN reconstruit sur les compteurs EXACTS du screen du 31/07 (sem. 08-14/06 = 4 ·
  //   15-21/06 = 3 · 22-28/06 = 4 · 29/06-05/07 = 4 avec 02+04+05/07 déjà en base → 1 séance
  //   le 30/06). Dates approximatives, alternance PUSH/PULL stricte (pas de LEGS, genoux).
  // · Poids relevés sur SES screens du 11/08 au soir (ses MAJ manuelles avaient pu sauter
  //   avec le bug de persistance) — datés sur les séances correspondantes.
  if(!DB.profile.restore1108e){
    mergeBackupIntoDB({
      logs:[
        {id:20260608203000,date:'2026-06-08',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260610203000,date:'2026-06-10',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260612203000,date:'2026-06-12',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260614203000,date:'2026-06-14',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260616203000,date:'2026-06-16',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260618203000,date:'2026-06-18',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260620203000,date:'2026-06-20',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260622203000,date:'2026-06-22',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260624203000,date:'2026-06-24',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260626203000,date:'2026-06-26',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260628203000,date:'2026-06-28',time:'20:30',sessions:['s1'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null},
        {id:20260630203000,date:'2026-06-30',time:'20:30',sessions:['s2'],comment:'Reconstituée (incident 11/08) — date approximative',feeling:null,energy:null,duration_min:null}
      ],
      weights:{
        leg_curl:[{date:'2026-08-08',val:30}],
        pecdeck:[{date:'2026-08-10',val:48}],
        triceps_corde:[{date:'2026-08-10',val:24}],
        cable_fly:[{date:'2026-08-10',val:12}],
        leg_press:[{date:'2026-08-10',val:85}],
        dips_assist:[{date:'2026-08-10',val:20}],
        curl_halt:[{date:'2026-08-10',val:8}]
      }
    });
    DB.profile.restore1108e=true;
    saveDB();
  }
  // Correction ponctuelle : Curl Marteau suit la même courbe que Curl Haltères, moins la dernière hausse (reste à 8kg).
  if(!DB.profile) DB.profile={};
  if(!DB.profile.martoFix){
    var halt=DB.weights['curl_halt'];
    if(halt&&halt.length){
      var copy=halt.slice(0,Math.max(1,halt.length-1)).map(function(x){return {date:x.date,val:x.val};});
      DB.weights['curl_marteau']=copy;
      DB.weightSetDate['curl_marteau']=copy[copy.length-1].date;
    }
    DB.profile.martoFix=true;
    saveDB();
  }
  // Fusion élévations (02/08, demande Adrien) : « Élévation Latérale (fin de PULL) » était une
  // clé séparée (elev_lat_pull) alors que c'est LE MÊME exercice → historique fusionné dans
  // elev_lat, logs retagués, anciennes entrées cloud purgées via deletedWeights.
  if(!DB.profile.elevMerge0208){
    var _ep=DB.weights['elev_lat_pull'];
    if(_ep&&_ep.length){
      var _eb=DB.weights['elev_lat']||[];
      _ep.forEach(function(en){ if(!_eb.some(function(b){return b.date===en.date;})) _eb.push({date:en.date,val:en.val}); });
      _eb.sort(function(a,b){return a.date.localeCompare(b.date);});
      DB.weights['elev_lat']=_eb;
      DB.deletedWeights=DB.deletedWeights||{};
      DB.deletedWeights['elev_lat_pull']=(DB.deletedWeights['elev_lat_pull']||[]).concat(_ep.map(function(en){return en.date;}));
    }
    delete DB.weights['elev_lat_pull'];
    if(DB.weightSetDate){
      if(DB.weightSetDate['elev_lat_pull']&&(!DB.weightSetDate['elev_lat']||DB.weightSetDate['elev_lat']<DB.weightSetDate['elev_lat_pull'])) DB.weightSetDate['elev_lat']=DB.weightSetDate['elev_lat_pull'];
      delete DB.weightSetDate['elev_lat_pull'];
    }
    (DB.logs||[]).forEach(function(l){
      if(l.sessions) l.sessions=l.sessions.map(function(s){return s==='exo:elev_lat_pull'?'exo:elev_lat':s;});
      if(l.live&&l.live.exos) l.live.exos.forEach(function(x){ if(x.key==='elev_lat_pull') x.key='elev_lat'; });
    });
    DB.profile.elevMerge0208=true;
    saveDB();
  }
  // Refonte PULL + élévations 6 kg (15/08, demande Adrien) : la RÉFÉRENCE élévations passe à
  // 6 kg pour le nouveau format 4×15. L'historique 8 kg reste intact — on AJOUTE une entrée,
  // on n'efface jamais rien (règle « données = sacré »).
  if(!DB.profile.pull1508){
    var _e6=DB.weights['elev_lat']||[];
    var _t6=todayStr();
    if(_e6.length&&_e6[_e6.length-1].date===_t6){ _e6[_e6.length-1].val=6; }
    else if(!_e6.length||_e6[_e6.length-1].val!==6){ _e6.push({date:_t6,val:6}); }
    DB.weights['elev_lat']=_e6;
    DB.weightSetDate['elev_lat']=_t6;
    DB.profile.pull1508=true;
    saveDB();
  }
  // 15/08 soir — NOTES FIGÉES (retour Adrien : « 10/20 et 20/20 que je ne comprends pas ») :
  // la refonte PULL a reclassé des exos principal↔bonus et le recalcul des notes passées avec
  // les flags du jour réécrivait l'histoire. On grave sur chaque log live : le statut `main`
  // de chaque exo tel qu'il était PENDANT la séance (= !extra, exact pour tous les LiveUps),
  // puis la note /20 recalculée sur CE statut — plus jamais recalculée ensuite.
  if(!DB.profile.noteFix1508){
    (DB.logs||[]).forEach(function(l){
      if(!l.live||!(l.live.exos||[]).length) return;
      l.live.exos.forEach(function(x){ if(x.main==null) x.main=!x.extra; });
      if(l.live.note20==null){
        var _ex=liveNotedExos(l.live.exos);
        if(_ex.length){
          var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
          l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
        }
      }
    });
    DB.profile.noteFix1508=true;
    saveDB();
  }
  // 16/08 — genou (retour Adrien) : son Leg Press du LEGS du 16/08 (2/4 séries, arrêt sur vraie
  // douleur au genou) était barré et noté 0/5 : l'ancienne règle exigeait n−1 séries. Il passe en
  // « arrêt douleur » (compté, zéro malus) et la note /20 du log est re-gravée sur les statuts
  // figés — cas prévu par la règle du 15/08 : l'éditeur/une correction assumée re-grave, jamais
  // un recalcul silencieux.
  if(!DB.profile.kneeFix1608){
    (DB.logs||[]).forEach(function(l){
      if(l.date!=='2026-08-16'||!l.live||!(l.live.exos||[]).length) return;
      var touched=false;
      l.live.exos.forEach(function(x){
        if(x.key==='leg_press'&&x.status==='skipped'&&(x.sets||[]).length===2){ x.pain=true; touched=true; }
      });
      if(!touched) return;
      var _ex=liveNotedExos(l.live.exos);
      if(_ex.length){
        var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
        l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
      }
    });
    DB.profile.kneeFix1608=true;
    saveDB();
  }
  // 16/08 soir — barème durci à la demande d'Adrien (« 20/20 trop gentil ») : le LEGS du 16/08
  // se re-juge avec ① arrêt douleur = −0,5 pt/série manquante (leg curl marqué douleur aussi —
  // c'était le genou), ② legday = tous les exos JAMBES jugés principaux (main=true figé).
  if(!DB.profile.legday1608){
    (DB.logs||[]).forEach(function(l){
      if(l.date!=='2026-08-16'||!l.live||!(l.live.exos||[]).length) return;
      if((l.sessions||[]).indexOf('s3')<0) return;
      l.live.exos.forEach(function(x){
        if(x.key==='leg_curl'&&x.status==='skipped'&&(x.sets||[]).length===2) x.pain=true;
        if(rankGroupOf(x.key)==='Jambes') x.main=true;
      });
      var _ex=liveNotedExos(l.live.exos);
      if(_ex.length){
        var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
        l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
      }
    });
    DB.profile.legday1608=true;
    saveDB();
  }
  // 18/08 — barème /5 v3 (retour Adrien : « y'a mieux à faire comme notation ») : échec propre en
  // dernière série = pleine valeur, bonus jugés sur les séries faites, prorata e1RM + correction
  // de charge en linéaire. La note /20 du PULL du 18/08 est re-gravée avec ce barème (sa demande
  // « et celle-là ») — les autres notes restent figées (règle du 15/08).
  if(!DB.profile.noteV3_1808){
    (DB.logs||[]).forEach(function(l){
      if(l.date!=='2026-08-18'||!l.live||!(l.live.exos||[]).length) return;
      var _ex=liveNotedExos(l.live.exos);
      if(_ex.length){
        var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
        l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
      }
    });
    DB.profile.noteV3_1808=true;
    saveDB();
  }
  // 19/08 — audit complet du moteur de notation (demande Adrien « regarde toutes les séances,
  // trouve les erreurs ») : 3 erreurs d'arithmétique corrigées — ① double arrondi (le /20 moyennait
  // des /5 déjà arrondis vers le bas : jusqu'à ~2 pts perdus), ② malus « effondrement » armé par
  // des reps AU-DESSUS de la cible en série 1 (13·10·10·10 cible 10 = 4,5), ③ tolérance d'échec
  // fixe (2 reps) inadaptée aux cibles 15+ (12/15 à l'échec = « vrai raté » comme un 5/8).
  // Toutes les notes /20 sont re-gravées sur leurs statuts principal/bonus FIGÉS (correction
  // assumée, règle du 15/08) — l'arithmétique v3.1 étant partout ≥ l'ancienne, aucune ne baisse.
  if(!DB.profile.note20Raw1908){
    (DB.logs||[]).forEach(function(l){
      if(!l.live||!(l.live.exos||[]).length) return;
      var _ex=liveNotedExos(l.live.exos);
      if(_ex.length){
        var _t=0; _ex.forEach(function(x){ _t+=asScoreExoRaw(x); });
        l.live.note20=Math.max(0,Math.min(20,Math.round(_t/_ex.length*4)));
      }
    });
    DB.profile.note20Raw1908=true;
    saveDB();
  }
  // 22/08/2026 — refonte abdos (décision Adrien) : le Pallof repasse en reps (3×10/côté, tenues
  // 2-3 s) et sa référence est calée sur son poids réel du jour : 10 kg (il l'a donné lui-même).
  // Crunch poulie / hollow → hidden dans DATA (historique intact), dead bug dé-masqué,
  // crunch lesté ajouté — rien à migrer côté données pour eux.
  if(!DB.profile.abdos2208){
    try{
      var _pw=(DB.weights&&DB.weights.pallof)||[];
      if(!_pw.length||_pw[_pw.length-1].val!==10) asApplyWeight('pallof',10);
    }catch(e){}
    DB.profile.abdos2208=true;
    saveDB();
  }
  // 31/08/2026 — pesée transmise après coup par Adrien : 6 août = 71,7 kg. Ajoutée si absente ;
  // la tombstone deletedBW est respectée (si elle est supprimée un jour, elle ne reviendra pas).
  if(!DB.profile.bw0608){
    if(!DB.bodyWeight) DB.bodyWeight=[];
    var _bwHas=DB.bodyWeight.some(function(b){return b.date==='2026-08-06';});
    var _bwDel=(DB.deletedBW||[]).indexOf('2026-08-06')>=0;
    if(!_bwHas&&!_bwDel){
      DB.bodyWeight.push({date:'2026-08-06',weight_kg:71.7,note:''});
      DB.bodyWeight.sort(function(a,b){return a.date.localeCompare(b.date);});
    }
    DB.profile.bw0608=true;
    saveDB();
  }
  // Snapshot mensuel du rank (base du « as-tu évolué en rank ? » des bilans du mois)
  try{ mrSnapLadder(); }catch(e){}
  // Rappel backup JSON tous les 21 jours — le détail fin vit d'abord sur CE téléphone
  try{
    if(!DB.profile.lastBackupTs){ DB.profile.lastBackupTs=Date.now(); saveDB(); }
    else if(Date.now()-DB.profile.lastBackupTs>21*86400000){
      setTimeout(function(){ showToast('&#x1F4E6; Pense au backup JSON (Param&#xE8;tres) &#x2014; 2 secondes pour tout mettre &#xE0; l\'abri'); },2500);
      DB.profile.lastBackupTs=Date.now(); saveDB();
    }
  }catch(e){}
  // Correction ponctuelle (02/08/2026, demande Adrien) : la séance PULL du 01/08 stockait des
  // cibles d'AVANT le recalage du programme (tirage/rowing à 10 au lieu de 4×8) et Adrien
  // croyait tout à 4×8 (cibles pas encore affichées). On recale le log sur le vrai programme
  // et on épingle la revue du coach — c'est elle, LE bilan de cette séance (voir COACH.md 02/08).
  if(!DB.profile.pullFix0108){
    var pl=(DB.logs||[]).find(function(x){return x.date==='2026-08-01'&&x.live&&(x.live.exos||[]).length&&(x.sessions||[]).indexOf('s2')>=0;});
    if(pl){
      pl.live.exos.forEach(function(x){
        if(x.key==='tirage_vert'||x.key==='rowing_pb'){ x.reps=8; }
      });
      pl.live.coachNote='&#x1F9E0; <strong>Revue du coach (02/08)</strong> &#x2014; s&#xE9;ance faite en croyant toutes les cibles &#xE0; 4&#xD7;8 (elles n\'&#xE9;taient pas encore affich&#xE9;es) et jug&#xE9;e &#xE0; l\'&#xE9;poque sur d\'anciennes cibles. Recal&#xE9;e sur le vrai programme&#x202F;: <strong>Tirage Vertical quasi parfait (4,5/5)</strong>, Rowing &#xE0; 1 rep de la cible (3,5/5), volume complet et &#xE9;chec touch&#xE9; en fin d\'exo partout &#x2014; <strong>vraie valeur &#x2248; 14/20 dans son contexte</strong>. La le&#xE7;on &#xE0; garder&#x202F;: Face Pull = 15 reps propres AVANT de monter les kg (reps d\'abord, charge ensuite).';
    }
    DB.profile.pullFix0108=true;
    saveDB();
  }
  // v2 (02/08 soir, décision finale Adrien) : la séance du 01/08 est jugée à 100% dans SON
  // contexte — il visait 4×8 partout (cibles pas encore affichées dans l'app ce jour-là).
  // Toutes les cibles stockées du log passent à 8, la revue de coach épinglée est retirée :
  // les notes recalculées (exos + /20) RACONTENT le contexte, plus besoin d'encadré.
  // ⚠️ Sur-mesure pour CE log uniquement — le barème général et le programme ne bougent pas.
  if(!DB.profile.pullFix0108b){
    var pl2=(DB.logs||[]).find(function(x){return x.date==='2026-08-01'&&x.live&&(x.live.exos||[]).length&&(x.sessions||[]).indexOf('s2')>=0;});
    if(pl2){
      pl2.live.exos.forEach(function(x){ if(x.reps>8) x.reps=8; });
      delete pl2.live.coachNote;
    }
    DB.profile.pullFix0108b=true;
    saveDB();
  }
  // Traction Assistée : départ/actuel à 45kg (corrige l'ancien seed à 40 si non modifié)
  if(!DB.profile.tractionFix){
    var ta=DB.weights['traction_assist'];
    if(!ta || (ta.length===1 && ta[0].val===40)){
      DB.weights['traction_assist']=[{date:'2026-02-28',val:45}];
      DB.weightSetDate['traction_assist']='2026-02-28';
    }
    DB.profile.tractionFix=true;
    saveDB();
  }
  // Seated Dips (Machine) ajouté le 22 juin : corrige l'ancien seed à 0kg/28-fév (qui faussait aussi le compteur de séances)
  if(!DB.profile.dipsFix){
    var sd=DB.weights['seated_dips'];
    if(!sd || (sd.length===1 && sd[0].val===0)){
      var dts=todayStr();
      DB.weights['seated_dips']=[{date:dts,val:35}];
      DB.weightSetDate['seated_dips']=dts;
    }
    DB.profile.dipsFix=true;
    saveDB();
  }
  // 15 juin 2026 : Traction Assistée + Dips Assistée sont des exos récents — leur 1ère entrée de poids est le 15/06.
  // On ramène leur historique à une seule entrée à cette date (en gardant la valeur actuelle).
  if(!DB.profile.juin15Fix){
    ['traction_assist','seated_dips'].forEach(function(k){
      var arr=DB.weights[k];
      var val=(arr&&arr.length)?arr[arr.length-1].val:(CANONICAL_WEIGHTS[k]||0);
      DB.weights[k]=[{date:'2026-06-15',val:val}];
      DB.weightSetDate[k]='2026-06-15';
    });
    DB.profile.juin15Fix=true;
    saveDB();
  }
  // Correction "poids de départ" (juil. 2026) : certains exos bonus ajoutés en cours de route
  // avaient une 1ère entrée FABRIQUÉE au 28/02 à leur poids actuel (faux point de départ dans
  // le tableau de progression). On rétablit leur vraie date/valeur de départ (source progression.md).
  if(!DB.profile.startFix2607){
    var startFixes={
      tirage_pulldown:{date:'2026-03-14',val:40}, // Pulldown ajouté mars @40kg
      dev_militaire:  {date:'2026-03-14',val:20}  // Développé Militaire ajouté mars
    };
    Object.keys(startFixes).forEach(function(k){
      var arr=DB.weights[k];
      if(!arr||!arr.length||arr[0].date!=='2026-02-28') return; // ne touche que la fausse entrée seed
      var fix=startFixes[k];
      var curVal=arr[arr.length-1].val;
      if(arr.length===1){
        DB.weights[k] = (curVal!==fix.val)
          ? [{date:fix.date,val:fix.val},{date:'2026-04-04',val:curVal}]
          : [{date:fix.date,val:fix.val}];
      } else {
        arr[0]={date:fix.date,val:fix.val};
        DB.weights[k]=arr;
      }
      DB.weightSetDate[k]=DB.weights[k][DB.weights[k].length-1].date;
    });
    DB.profile.startFix2607=true;
    saveDB();
  }
  // 06/08/2026 : QUIPROQUO DIPS réglé (deux machines vivaient sous seated_dips).
  // seated_dips = la DIPS MACHINE assise (charge, plus = mieux) : 30 kg au 01/07 → 40 en saison 1.
  // dips_assist (nouveau) = la vraie Dips Assistée (assistance, moins = mieux) : 45 (juin) → 30 (fin S0).
  if(!DB.profile.dipsSplit0608){
    if(!DB.weights['dips_assist']||!DB.weights['dips_assist'].length){
      DB.weights['dips_assist']=[{date:'2026-06-15',val:45},{date:'2026-07-26',val:30}];
      DB.weightSetDate['dips_assist']='2026-07-26';
    }
    var _sd8=(DB.weights['seated_dips']||[]).filter(function(e){return e.date>='2026-08-01';});
    _sd8.unshift({date:'2026-07-01',val:30});
    if(_sd8[_sd8.length-1].val!==40) _sd8.push({date:todayStr(),val:40});
    DB.weights['seated_dips']=_sd8;
    DB.weightSetDate['seated_dips']=_sd8[_sd8.length-1].date;
    DB.profile.dipsSplit0608=true;
    saveDB();
  }
  // 08/08/2026 : DOUBLON TRICEPS FUSIONNÉ (demande Adrien, il avait fait l'exo sous l'ANCIENNE
  // clé le 06/08). « Poulie Triceps / Avant-bras » (poulie_triceps_av) et « Triceps Poulie Barre »
  // (triceps_barre) étaient le MÊME exercice saisi deux fois. Survivant : triceps_barre, renommé
  // « Extension Triceps Poulie (barre) ». Tout ce qui pointait vers l'ancienne clé est retagué —
  // poids, logs, séries en direct, séance préparée, séance LiveUp en cours. Rien n'est perdu.
  if(!DB.profile.tricepsMerge0808){
    var _tOld='poulie_triceps_av', _tNew='triceps_barre';
    var _tp=DB.weights[_tOld];
    if(_tp&&_tp.length){
      var _tn=DB.weights[_tNew]||[];
      _tp.forEach(function(en){
        var hit=null;
        for(var i=0;i<_tn.length;i++){ if(_tn[i].date===en.date){ hit=_tn[i]; break; } }
        // Même jour des deux côtés : c'est un seul exo, la vraie perf est la charge la plus lourde
        if(hit) hit.val=Math.max(hit.val,en.val);
        else _tn.push({date:en.date,val:en.val});
      });
      _tn.sort(function(a,b){return a.date.localeCompare(b.date);});
      DB.weights[_tNew]=_tn;
      DB.deletedWeights=DB.deletedWeights||{};
      DB.deletedWeights[_tOld]=(DB.deletedWeights[_tOld]||[]).concat(_tp.map(function(en){return en.date;}));
    }
    delete DB.weights[_tOld];
    if(DB.weightSetDate){
      if(DB.weightSetDate[_tOld]&&(!DB.weightSetDate[_tNew]||DB.weightSetDate[_tNew]<DB.weightSetDate[_tOld])) DB.weightSetDate[_tNew]=DB.weightSetDate[_tOld];
      delete DB.weightSetDate[_tOld];
    }
    var _tRetagSel=function(sel){
      if(!sel) return;
      if(sel.chosen&&sel.chosen[_tOld]){ sel.chosen[_tNew]=sel.chosen[_tOld]; delete sel.chosen[_tOld]; }
      if(sel.extras) sel.extras=sel.extras.map(function(k){return k===_tOld?_tNew:k;})
        .filter(function(k,i,a){return a.indexOf(k)===i;});
      if(sel.legsMain===_tOld) sel.legsMain=_tNew;
    };
    (DB.logs||[]).forEach(function(l){
      if(l.sessions){
        var _ss=l.sessions.map(function(s){return s==='exo:'+_tOld?'exo:'+_tNew:s;});
        l.sessions=_ss.filter(function(s,i){return _ss.indexOf(s)===i;}); // le retag peut créer un doublon
      }
      if(l.live&&l.live.exos){
        var _kept=null, _out=[];
        l.live.exos.forEach(function(x){
          if(x.key===_tOld) x.key=_tNew;
          if(x.key===_tNew){
            // Les DEUX clés dans la même séance → une seule entrée, séries cumulées
            if(_kept){ _kept.sets=(_kept.sets||[]).concat(x.sets||[]); _kept.n=Math.max(_kept.n||0,_kept.sets.length); return; }
            _kept=x;
          }
          _out.push(x);
        });
        l.live.exos=_out;
      }
    });
    if(DB.prepared) _tRetagSel(DB.prepared.sel);
    // Séance LiveUp en cours (stockée à part de DB) : elle aussi doit suivre
    try{
      var _asRaw=localStorage.getItem('massup_as');
      if(_asRaw&&_asRaw.indexOf(_tOld)>=0){
        var _as=JSON.parse(_asRaw);
        _tRetagSel(_as.sel);
        if(_as.exos) _as.exos.forEach(function(x){ if(x.key===_tOld){ x.key=_tNew; x.name='Extension Triceps Poulie (barre)'; } });
        localStorage.setItem('massup_as',JSON.stringify(_as));
      }
    }catch(e){}
    DB.profile.tricepsMerge0808=true;
    saveDB();
  }
  // 14/08/2026 : DÉVELOPPÉ MILITAIRE converti BARRE → HALTÈRES (retour Adrien : « je suis avec
  // haltères, j'arrive presque pas à 14 »). L'ancien historique était en kg TOTAL de barre, la
  // nouvelle unité est le kg PAR HALTÈRE : tout ce qui dépasse 16 (clairement l'échelle barre)
  // est converti ×0,7 (20 kg barre ≈ 14 kg/côté haltères — l'instabilité coûte ~30 %).
  // L'historique garde sa forme, la référence atterrit sur son vrai 14.
  if(!DB.profile.milHalt1408){
    var _mk='dev_militaire';
    var _mconv=function(v){ return (v!=null&&v>16)?Math.round(v*0.7):v; };
    var _ma=DB.weights[_mk];
    if(_ma&&_ma.length){ _ma.forEach(function(en){ en.val=_mconv(en.val); }); }
    (DB.logs||[]).forEach(function(l){
      if(!l.live||!l.live.exos) return;
      l.live.exos.forEach(function(x){
        if(x.key!==_mk) return;
        x.w=_mconv(x.w); if(x.w0!=null) x.w0=_mconv(x.w0);
        (x.sets||[]).forEach(function(s){ if(s.w!=null) s.w=_mconv(s.w); });
      });
    });
    // LiveUp en cours : le poids de travail doit suivre aussi
    try{
      var _mAsRaw=localStorage.getItem('massup_as');
      if(_mAsRaw&&_mAsRaw.indexOf(_mk)>=0){
        var _mAs=JSON.parse(_mAsRaw);
        if(_mAs.exos) _mAs.exos.forEach(function(x){
          if(x.key!==_mk) return;
          x.weight=_mconv(x.weight); if(x.w0!=null) x.w0=_mconv(x.w0);
          x.name='Développé Militaire Haltères (assis)'; x.unite='kg/côté';
          (x.sets||[]).forEach(function(s){ if(s.w!=null) s.w=_mconv(s.w); });
        });
        localStorage.setItem('massup_as',JSON.stringify(_mAs));
      }
    }catch(e){}
    DB.weightSetDate[_mk]=todayStr();
    DB.profile.milHalt1408=true;
    saveDB();
  }
  setHeader();
  buildSeances();
  // Mise de côté (15/08) : masque les sections statiques du HTML selon les flags FEATURE_*
  try{
    var _ff=function(id,on){ var e=document.getElementById(id); if(e) e.style.display=on?'':'none'; };
    _ff('lblNiveau',FEATURE_RADAR); _ff('secNiveau',FEATURE_RADAR);
    _ff('lblObjectifs',FEATURE_GOALS);
  }catch(e){}
  var d=getNow(); calYear=d.getFullYear(); calMonth2=d.getMonth();
  buildLogModal();
  renderSante();
  // Default view is Bilan — pre-load Chart.js so charts render immediately
  ensureChartJs(function(){
    try{ renderSanteChart(); }catch(e){}
  });
  try{ checkReminders(); }catch(e){}
  try{ asBoot(); }catch(e){ console.warn('[MASSUP] asBoot:',e); }
}

function setHeader(){
  updateHeaderCtx('sante');
}

function updateHeaderCtx(view){
  var el=document.getElementById('hdate'); if(!el) return;
  var d=getNow();
  var days=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  var months=['Jan','F\u00e9v','Mar','Avr','Mai','Juin','Juil','Ao\u00fbt','Sep','Oct','Nov','D\u00e9c'];
  var monthsFull=['Janvier','F\u00e9vrier','Mars','Avril','Mai','Juin','Juillet','Ao\u00fbt','Septembre','Octobre','Novembre','D\u00e9cembre'];
  if(view==='seances'){
    el.textContent='S\u00e9ances \u00b7 '+days[d.getDay()];
  } else if(view==='progression'){
    el.textContent='Progression \u00b7 '+monthsFull[d.getMonth()]+' '+d.getFullYear();
  } else if(view==='sante'){
    var bw=DB.bodyWeight||[];
    var lastBw=bw.length?bw[bw.length-1]:null;
    el.textContent='Bilan'+(lastBw?' \u00b7 '+lastBw.weight_kg+'\u00a0kg':'');
  } else if(view==='accueil'){
    el.textContent=days[d.getDay()]+' '+d.getDate()+' '+months[d.getMonth()];
  }
}

// Message d'encouragement en haut de la vue Séances
function renderGymGreet(){
  var el=document.getElementById('gymGreet'); if(!el) return;
  var now=getNow();
  // Séances cette semaine (lundi -> dimanche) vers l'objectif de 4
  var wstart=new Date(now); var dow=wstart.getDay(); var off=dow===0?6:dow-1;
  wstart.setDate(wstart.getDate()-off); wstart.setHours(0,0,0,0);
  var count=weekValue((DB.logs||[]).filter(function(l){return new Date(l.date)>=wstart;}));
  var GOAL=getWeekGoal();
  var sub;
  if(count<=0) sub='C\'est parti pour la semaine&#x202F;!';
  else if(count<GOAL) sub='Plus que <strong>'+fmtSeances(GOAL-count)+'</strong> pour valider ta semaine &#x1F3AF;';
  else if(count>GOAL) sub='En feu cette semaine&#x202F;! &#x1F525;';
  else sub='Objectif atteint, semaine validée&#x202F;! &#x2705;';
  el.innerHTML='<div class="gym-greet-count"><span class="ggc-num">'+fmtSeances(count)+'</span><span class="ggc-goal">/ '+GOAL+'</span>'
    +'<span class="ggc-cap">séance'+(count>1?'s':'')+'<br>cette semaine</span></div>'
    +'<div class="gym-greet-sub">'+sub+'</div>'
    // 04/08 (demande Adrien) : ＋ = LiveUp (l'entrée principale), 🧘 = espace Détente.
    // La séance manuelle vit en lien discret dans l'écran de choix du LiveUp.
    +'<div class="gg-actions">'
    +'<button class="gg-btn gg-live" onclick="asOpen()" title="LiveUp &#x2014; nouvelle s&#xE9;ance">&#xFF0B;</button>'
    +'<button class="gg-btn" onclick="dzOpen()" title="D&#xE9;tente &#x2014; posture &amp; &#xE9;tirements">&#x1F9D8;</button>'
    +'</div>';
}

// Objectifs & repères — barre 1er poids → cible, avec marqueur du niveau moyen attendu
function renderObjectifs(){
  var el=document.getElementById('objectifs'); if(!el) return;
  // Objectifs de poids mis de côté (15/08, demande Adrien) — GOALS_JAN et le moteur restent
  if(!FEATURE_GOALS){ el.innerHTML=''; return; }
  var wk=weeksUntilGoal();
  var bwt=getProfileBodyWeight();
  function progPct(start,cur,tgt){
    if(tgt<=start) return cur>=tgt?100:0;
    return Math.max(0,Math.min(100,Math.round((cur-start)/(tgt-start)*100)));
  }
  // Trait jaune (v4, 14/08) = où le rythme de la SAISON te place aujourd'hui : % des 22 semaines
  // écoulées (27/07 → 1er janvier), identique pour tous les exos. La barre part du poids de
  // DÉBUT DE SAISON — plus aucune ancre sur mars.
  var _objEnd=new Date(OBJECTIF_DATE+'T00:00:00').getTime();
  function timeFrac(firstDate){
    if(!firstDate) return null;
    var t0=new Date(firstDate+'T00:00:00').getTime();
    if(_objEnd<=t0) return 1;
    return Math.max(0,Math.min(1,(Date.now()-t0)/(_objEnd-t0)));
  }
  var _seasonStart=(function(){ try{ return rankCurrentSeason().start; }catch(e){ return '2026-07-27'; } })();
  var _seasonFrac=(function(){ try{ return goalPace(); }catch(e){ return null; } })();
  function objRow(name,start,cur,tgt,frac,unit){
    if(tgt==null){ // exos sans cible ni standard — juste la progression (0 est une VRAIE cible : dips à 0 assistance)
      var d=Math.round((cur-start)*10)/10;
      return '<div class="obj-row">'
        +'<div class="obj-row-top"><span class="obj-name">'+name+'</span><span class="obj-cur">'+cur+' <small>'+unit+'</small>'+(d>0?' <em class="obj-delta">+'+d+'</em>':'')+'</span></div></div>';
    }
    var inverse=tgt<start; // ex: Traction Assistée → baisser l'assistance = progresser
    // Le point de départ affiché suit la réalité : si le poids actuel est passé SOUS le départ
    // (recalage à la baisse), c'est lui le nouveau départ de la barre (retour Adrien 02/08)
    if(inverse) start=Math.max(start,cur); else start=Math.min(start,cur);
    var done=inverse?(cur<=tgt):(cur>=tgt);
    var pct=done?100:(inverse?Math.max(0,Math.min(100,Math.round((start-cur)/(start-tgt)*100))):progPct(start,cur,tgt));
    var mk=(frac!==null&&frac!==undefined)?Math.max(3,Math.min(97,frac*100)):null;
    var marker=(mk!==null)?'<div class="obj-marker" style="left:'+mk+'%" title="O&#xF9; tu devrais en &#xEA;tre aujourd\'hui"></div>':'';
    return '<div class="obj-row">'
      +'<div class="obj-row-top"><span class="obj-name">'+name+'</span><span class="obj-cur">'+(done?'&#x2705; ':'')+cur+' <small>'+unit+'</small></span></div>'
      +'<div class="obj-scale"><span class="obj-pt">'+start+'</span>'
      +'<div class="obj-bar-wrap"><div class="obj-bar'+(done?' done':'')+'" style="width:'+pct+'%"></div>'+marker+'</div>'
      +'<span class="obj-pt obj-pt-end">'+tgt+'</span></div>'
      +'</div>';
  }
  var html='<div class="bench-card obj-card">';
  html+='<div class="obj-countdown"><span class="obj-cd-num">'+(wk.days>0?wk.weeks:0)+'</span>'
    +'<span class="obj-cd-lbl">'+(wk.days>0?'semaines avant le '+OBJECTIF_LABEL:'échéance atteinte !')+'</span></div>';
  if(bwt){ html+=objRow('&#x2696;&#xFE0F; Poids de corps',BODYWEIGHT_START,bwt,BODYWEIGHT_GOAL,timeFrac((DB.bodyWeight&&DB.bodyWeight.length)?DB.bodyWeight[0].date:'2026-03-11'),'kg'); }
  DATA.forEach(function(s){
    html+='<div class="obj-seance-lbl">'+s.icon+' '+s.name+'</div>';
    s.exos.forEach(function(e){
      if(e.hidden) return; // exos mis de côté (blessure) — données conservées mais pas affichés
      var cur=getCurrentWeight(e.key);
      // v4 : le départ de la barre = le poids au début de la SAISON (27/07), pas le 1er poids de mars
      var start=weightAtDate(e.key,_seasonStart)||cur;
      var std=STRENGTH_STD[e.key];
      var frac=_seasonFrac;
      var tgt=(GOALS_JAN[e.key]!==undefined)?GOALS_JAN[e.key]:((std&&bwt)?Math.round(std.adv*bwt):null);
      var unit=/kg/.test(e.unite)?'kg':e.unite;
      html+=objRow(getExoName(e.key),start,cur,tgt,frac,unit);
    });
  });
  html+='</div>';
  el.innerHTML=html;
}

// Canonical weights — source of truth for current weights
// État réel au 30/07/2026 (compte rendu coaching). Ne sert qu'au premier démarrage :
// les données vivantes (localStorage + Supabase) ne sont jamais écrasées.
var CANONICAL_WEIGHTS = {
  'chestpress_v':50,'dev_incline':18,'pecdeck':54,'elev_lat':8,'triceps_corde':22,'seated_dips':40,'dips_assist':30,
  'tirage_vert':48,'rowing_pb':44,'rowing_uni':20,'rowing_appui':35,'curl_halt':12,'curl_poulie':16,'curl_corde':12,
  'shrug_halt':20,'cable_fly':9,'abduct':25,'adduct':25,
  'leg_press':80,'leg_ext':50,'leg_curl':25,'mollets':40,'hip_thrust':50,
  'curl_incline':8,'curl_incline_neutre':8,'curl_marteau':10,'curl_marteau_croise':10,'face_pull':20,
  'poulie_triceps_av':18,'dev_militaire':14,'triceps_barre':18,'tirage_pulldown':50,'shoulder_press':16,
  'traction_assist':25,
  'pompes':10,'gainage':40,'crunch':15,'gripper':20,
  'crunch_poulie':15,'releve_chaise':10,'pallof':10,'dead_bug':10,'hollow_hold':20,'crunch_leste':5,'cardio_liss':20,'cardio_rameur':10
};

// Full progression history seed (source: MASSUP_progression.md)
var WEIGHT_HISTORY_SEED = {
  'chestpress_v':  [{date:'2026-02-28',val:30},{date:'2026-03-14',val:34},{date:'2026-04-04',val:35},{date:'2026-04-11',val:40}],
  'dev_incline':   [{date:'2026-02-28',val:10},{date:'2026-03-14',val:12},{date:'2026-04-04',val:14},{date:'2026-04-11',val:16}],
  'pecdeck':       [{date:'2026-02-28',val:24},{date:'2026-03-14',val:29},{date:'2026-04-04',val:34}],
  'elev_lat':      [{date:'2026-02-28',val:3}, {date:'2026-03-21',val:4}, {date:'2026-04-04',val:6}],
  'triceps_corde': [{date:'2026-02-28',val:14},{date:'2026-04-04',val:16}],
  'tirage_vert':   [{date:'2026-02-28',val:30},{date:'2026-03-14',val:32},{date:'2026-03-21',val:36},{date:'2026-04-04',val:40},{date:'2026-04-15',val:45}],
  'rowing_pb':     [{date:'2026-02-28',val:28},{date:'2026-03-14',val:32},{date:'2026-04-04',val:36},{date:'2026-04-15',val:40}],
  'rowing_uni':    [{date:'2026-02-28',val:12},{date:'2026-03-14',val:16},{date:'2026-04-04',val:18},{date:'2026-04-11',val:20}],
  'curl_halt':     [{date:'2026-02-28',val:8}, {date:'2026-04-04',val:10}],
  'curl_poulie':   [{date:'2026-02-28',val:8}, {date:'2026-04-04',val:10},{date:'2026-04-15',val:12}],
  'curl_corde':    [{date:'2026-07-30',val:12}],
  'curl_marteau_croise':[{date:'2026-08-14',val:10}], // variante du marteau (14/08) — départ = même échelle que le marteau, un cran en dessous
  'curl_incline_neutre':[{date:'2026-08-15',val:8}], // nouveau principal PULL (refonte 15/08) — départ estimé, à caler à la 1re séance
  'rowing_appui':  [{date:'2026-08-01',val:35}],
  'abduct':        [{date:'2026-08-01',val:25}],
  'adduct':        [{date:'2026-08-01',val:25}],
  'shrug_halt':    [{date:'2026-08-01',val:20}],
  'cable_fly':     [{date:'2026-08-01',val:9}],
  'leg_press':     [{date:'2026-02-28',val:50},{date:'2026-03-14',val:60}],
  'leg_ext':       [{date:'2026-02-28',val:20},{date:'2026-03-14',val:25},{date:'2026-04-04',val:35}],
  'leg_curl':      [{date:'2026-02-28',val:18},{date:'2026-03-07',val:12},{date:'2026-03-21',val:25},{date:'2026-04-04',val:30}],
  'mollets':       [{date:'2026-02-28',val:40}],
  'hip_thrust':    [{date:'2026-06-15',val:50}],
  'tirage_vert_s4':[{date:'2026-02-28',val:30},{date:'2026-03-14',val:32},{date:'2026-03-21',val:36},{date:'2026-04-04',val:40}],
  'face_pull':     [{date:'2026-06-15',val:18}],
  'rowing_pb_s4':  [{date:'2026-02-28',val:28},{date:'2026-03-14',val:32},{date:'2026-04-04',val:36}],
  'curl_incline':  [{date:'2026-02-28',val:6}, {date:'2026-04-04',val:8}],
  'curl_marteau':  [{date:'2026-02-28',val:8}],
  'seated_dips':      [{date:'2026-07-01',val:30}],
  'dips_assist':      [{date:'2026-06-15',val:45},{date:'2026-07-26',val:30}],
  'pulldown_bonus':   [{date:'2026-03-14',val:40}],
  'poulie_triceps_av':[{date:'2026-03-14',val:18}],
  'dev_halt_debout':  [{date:'2026-03-14',val:8}],
  'triceps_barre':    [{date:'2026-03-14',val:18}],
  'vertical_row':     [{date:'2026-04-04',val:35}],
  'shoulder_press':   [{date:'2026-04-04',val:16}]
};

function initWeights(){
  var allKeys=[];
  DATA.forEach(function(s){s.exos.forEach(function(e){if(allKeys.indexOf(e.key)<0)allKeys.push(e.key);});});
  EXTRAS.forEach(function(e){if(allKeys.indexOf(e.key)<0)allKeys.push(e.key);});
  var needsSave=false;
  var needsSync=false;
  allKeys.forEach(function(key){
    var arr=DB.weights[key];
    var seed=WEIGHT_HISTORY_SEED[key];
    // Construire un index par date de l'existant
    var byDate={};
    if(arr&&arr.length) arr.forEach(function(e){ byDate[e.date]=e.val; });
    if(seed){
      if(!arr||!arr.length){
        // Premier démarrage uniquement : initialiser depuis le seed
        DB.weights[key]=seed.map(function(x){return {date:x.date,val:x.val};});
        DB.weightSetDate[key]=seed[seed.length-1].date;
        needsSave=true; needsSync=true;
      }
      // Si des données existent déjà, on fait confiance au DB (pas de réinjection du seed)
    } else if(!arr||!arr.length){
      DB.weights[key]=[{date:'2026-02-28',val:CANONICAL_WEIGHTS[key]||0}];
      DB.weightSetDate[key]='2026-02-28';
      needsSave=true; needsSync=true;
    }
    if(!DB.weightSetDate[key]&&arr&&arr.length){
      DB.weightSetDate[key]=arr[arr.length-1].date; needsSave=true;
    }
  });
  if(needsSave) saveDB();
  if(needsSync&&typeof sbClient!=='undefined'&&sbClient){
    sbClient.auth.getUser().then(function(res){
      var userId=res.data&&res.data.user&&res.data.user.id;
      if(userId) _doSyncToSupabase(userId);
    });
  }
}

function getCurrentWeight(key){
  var arr=DB.weights[key];
  if(!arr||!arr.length) return 0;
  return arr[arr.length-1].val;
}

function getDaysSinceWeightChange(key){
  var d=DB.weightSetDate[key];
  if(!d) return 0;
  var past=new Date(d), now=getNow();
  return Math.floor((now-past)/(1000*60*60*24));
}

// Localise l'exercice et sa séance à partir de sa clé
function findExoIndex(key){
  for(var i=0;i<DATA.length;i++){
    for(var j=0;j<DATA[i].exos.length;j++){
      if(DATA[i].exos[j].key===key) return {sid:DATA[i].id, ei:j, seance:DATA[i], exo:DATA[i].exos[j]};
    }
  }
  return null;
}


// Pondération d'une séance dans l'objectif hebdo :
// séance salle = 1 · séance Maison ('sb') ou autre sport ('autre:') = 0,5 (il en faut 2 pour valoir 1).
// Un exercice isolé ('exo:') n'a pas de poids propre : c'est le log entier (voir logWeight) qui
// décide si une sélection d'exos à la carte vaut une séance complète.
function sessionWeight(sid){
  if(sid==='sb'||sid.indexOf('autre:')===0) return 0.5;
  if(sid.indexOf('exo:')===0) return 0;
  return 1;
}
// Pondération d'UN log (une entrée de séance) dans l'objectif hebdo.
// - séances nommées (push/pull/legs) = 1 chacune · Maison/autre sport = 0,5
// - une sélection d'exercices muscu à la carte ('exo:') = 1 séance complète
//   (peu importe le nombre d'exos choisis), MAIS jamais empilée par-dessus une
//   séance salle déjà comptée dans le même log.
function logWeight(l){
  var w=0, hasExo=false;
  (l && l.sessions || []).forEach(function(sid){
    if(sid.indexOf('exo:')===0){ hasExo=true; }
    else w+=sessionWeight(sid);
  });
  if(hasExo && w<1) w=1;
  return w;
}
// Valeur pondérée totale d'un ensemble de logs (peut être décimale, ex. 2,5)
function weekValue(logs){
  var t=0; (logs||[]).forEach(function(l){ t+=logWeight(l); });
  return Math.round(t*10)/10;
}
// Format FR d'un nombre de séances (virgule décimale, sans zéro superflu)
function fmtSeances(n){ return (Math.round(n*10)/10).toString().replace('.',','); }

// Objectif de séances/semaine — configurable dans Paramètres. Défaut 4.
function getWeekGoal(){
  var g=DB.profile&&DB.profile.weekGoal;
  return (g>=2&&g<=6)?g:4;
}

// Un exo d'une séance EN DIRECT compte dans la progression seulement s'il a été mené
// (presque) au bout : toutes les séries faites, ou skip à 1 série de la fin (ex. 3/4).
// Skip après 1-2 séries ou skip direct = PAS comptabilisé (mais le tag séance reste au calendrier).
// Règle de comptage (16/08, demande Adrien — Leg Press 2/4 barré alors que le travail est réel) :
// TOUT exo compte dès 2 séries (principal comme bonus — avant : n−1 pour les principaux).
// Les séries manquantes pèsent toujours dans la note /5, mais l'historique/progression les garde.
// Arrêt DOULEUR (x.pain) : compté dès la 1re série — la douleur n'efface jamais le travail fait.
function liveExoCounted(x){
  if(!x) return false;
  if(x.status==='done') return true;
  if(x.pain&&(x.sets||[]).length>=1) return true;
  var n=x.n||3;
  return (x.sets||[]).length>=Math.min(2,n); // cardio 1×20min : 1 « série » suffit
}

// Un exo "annexe" = bonus du programme OU ajouté en cours de séance (extra/added).
// Règle (31/07/2026) : un annexe ne compte JAMAIS comme abandon/échec — soit il est
// mené assez loin pour être compté (liveExoCounted), soit il est simplement ignoré
// du bilan (note /20, analyse) et du futur rank. ≥2 séries → visible dans le détail du jour.
function liveExoSide(x){
  if(!x) return false;
  if(x.main!=null) return !x.main; // statut FIGÉ à l'enregistrement (15/08) — insensible aux refontes du programme
  if(x.extra||x.added) return true;
  var info=findExoIndex(x.key);
  return !!(info&&info.exo&&info.exo.bonus);
}
// Exos "engagés" pour la notation : principaux toujours, annexes seulement si complétés.
function liveEngagedExos(list){
  return (list||[]).filter(function(x){ return !liveExoSide(x)||liveExoCounted(x); });
}
// Annexes tentés mais non comptés (pour affichage neutre, jamais en malus)
function liveSideAttempts(list){
  return (list||[]).filter(function(x){ return liveExoSide(x)&&!liveExoCounted(x)&&(x.sets||[]).length>0; });
}
// Note /20 d'un log live : FIGÉE à l'enregistrement (live.note20) — recalcul en secours pour
// les vieux logs. Leçon du 15/08 (retour Adrien « 10/20 et 20/20 incompréhensibles ») : recalculer
// avec les flags bonus/principal du JOUR réécrit l'histoire — la refonte PULL sortait rowing
// appui/marteau/corde de la note des séances passées. La note d'une séance ne doit plus jamais bouger.
function liveLogNote20(l){
  if(!l||!l.live) return null;
  if(l.live.note20!=null) return l.live.note20;
  var ex=liveNotedExos(l.live.exos||[]);
  if(!ex.length) return null;
  var t=0; ex.forEach(function(x){ t+=asScoreExoRaw(x); });
  return Math.max(0,Math.min(20,Math.round(t/ex.length*4)));
}
// Échelle de couleurs des notes /20 (15/08, demande Adrien) :
// ≥18 = GOLD · 14-17 = bleu dynamique MASSUP · 11-13 = vert · 8-10 = orange · <8 = rouge
function note20Cls(n){
  if(n==null) return '';
  return n>=18?'n-gold':n>=14?'n-blue':n>=11?'n-green':n>=8?'n-orange':'n-red';
}
// Exos qui NOTENT le /20 (règle Adrien 02/08) : les PRINCIPAUX uniquement — les bonus rapportent
// des points mais n'entrent jamais dans la note de séance (ni en bien ni en mal).
// Séance 100% à la carte (aucun principal) : les exos choisis SONT le programme du jour → tous notent.
function liveNotedExos(list){
  var eng=liveEngagedExos(list).filter(function(x){ return !exoIsCardio(x.key); }); // le cardio ne se note pas
  var mains=eng.filter(function(x){ return !liveExoSide(x); });
  return mains.length?mains:eng;
}

// Exos passés de PRINCIPAL à BONUS en cours de route : avant cette date, valider la séance
// entière les incluait — leurs compteurs/historiques doivent continuer à compter ces séances-là.
// (Bug corrigé 01/08 : rowing_uni affichait 2 séances au lieu de ~15 après son passage en bonus.)
var BONUS_SINCE={rowing_uni:'2026-08-01',curl_halt:'2026-08-01',mollets:'2026-07-30',hip_thrust:'2026-07-30',
  // Refonte PULL 15/08 : ces trois-là étaient PRINCIPAUX avant — leurs séances passées comptent
  rowing_appui:'2026-08-15',curl_marteau:'2026-08-15',curl_corde:'2026-08-15',curl_incline:'2026-08-15'};
function exoMainForLog(info,key,date){
  if(!info.exo.bonus) return true;
  var d=BONUS_SINCE[key];
  return !!d&&!!date&&date<d;
}
// Combien de séances loggées au poids ACTUEL (depuis la dernière hausse)
function getSessionsAtWeight(key){
  var arr=DB.weights[key]; if(!arr||!arr.length) return 0;
  var sinceDate=arr[arr.length-1].date;
  var info=findExoIndex(key); if(!info) return 0;
  return (DB.logs||[]).filter(function(l){
    if(!l.date||l.date<sinceDate) return false;
    // Séance en direct : la liste live fait foi, exo par exo (règle liveExoCounted).
    if(l.live&&l.live.exos){
      var lx=null;
      l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      return lx?liveExoCounted(lx):false;
    }
    // Valider une séance entière compte ses exos principaux ; un bonus ne compte que s'il est explicitement
    // coché (exo:) — SAUF s'il était encore principal à la date du log (exoMainForLog).
    return (l.sessions||[]).some(function(sid){ return (sid===info.sid && exoMainForLog(info,key,l.date)) || sid==='exo:'+key; });
  }).length;
}

// Message de progression basé sur le nombre de séances au même poids (remplace le compteur de jours)
function getProgressNudge(key){
  var n=getSessionsAtWeight(key);
  if(n>=10) return {lvl:'hot',chip:'&#x1F534; '+n+' séances à ce poids',msg:'<strong>'+n+' séances</strong> au même poids — il est temps de charger plus&#x202F;!'};
  if(n>=6) return {lvl:'warn',chip:'&#x26A0; '+n+' séances à ce poids',msg:'<strong>'+n+' séances</strong> à ce poids — si tes séries passent proprement, tente bientôt un cran de plus.'};
  return null;
}

// Pour les exos Maison "repTarget" : la valeur saisie est l'objectif par série (3 séries)
// ── Unité de ce qu'on COMPTE par série (08/08, retour Adrien) ──────────────────
// Jusqu'ici l'app déduisait « reps ou secondes » de exo.unite, qui est l'unité de CHARGE.
// Faux dès qu'un exo se charge dans une unité et se compte dans une autre :
//   · Pallof Press → charge en kg, se compte en SECONDES de gainage anti-rotation
//   · Cardio zone 2 / rameur → « charge » en min, se compte en MINUTES (affichait « 20 reps »)
// exo.cnt porte désormais l'unité comptée ('reps' | 's' | 'min'), unite reste la charge.
// Les logs enregistrés AVANT le 08/08 n'ont pas de `cnt` : on retombe sur la définition de l'exo.
// C'est une CORRECTION d'étiquette, pas une réécriture — un Pallof s'est toujours tenu en secondes,
// c'est l'app qui l'appelait « reps ». Les objets sans clé (shims d'affichage) gardent l'ancien défaut.
var _CNT_BY_KEY=null;
function cntU(x){
  if(!x) return 'reps';
  if(x.cnt) return x.cnt;
  if(x.key){
    if(!_CNT_BY_KEY){
      _CNT_BY_KEY={};
      try{ DATA.forEach(function(s){ s.exos.forEach(function(e){ if(e.cnt&&!_CNT_BY_KEY[e.key]) _CNT_BY_KEY[e.key]=e.cnt; }); }); }catch(e){}
    }
    if(_CNT_BY_KEY[x.key]) return _CNT_BY_KEY[x.key];
  }
  return x.unite==='s'?'s':'reps';
}
function cntFmt(x,v){ var u=cntU(x); return u==='reps'?(v+' reps'):(u==='s'?(v+'s'):(v+' '+u)); }
function cntShort(x,v){ var u=cntU(x); return u==='s'?(v+'s'):(u==='reps'?String(v):(v+' '+u)); }
function cntStep(x){ var u=cntU(x); return u==='s'?5:1; }          // un hold se règle par crans de 5 s
function cntAsk(x){ var u=cntU(x);
  return u==='s'?'Combien de secondes tenues ?':(u==='min'?'Combien de minutes ?':'Combien de r&#xE9;p&#xE9;titions ?'); }
function repLabel(exo,val){ return cntShort(exo,val); }
// Nombre de séries d'un exo repTarget : lu dans `serie` (le cardio en fait 1, pas 3)
function repTargetN(exo){ var m=(exo.serie||'').match(/^(\d+)[×x]/); return m?parseInt(m[1],10):3; }
function csLabel(exo,val){ return repTargetN(exo)+' × '+(exo.unite==='s'?val+'s':(val+' '+exo.unite)); }
function updateRepTargetDisplay(key,val){
  var info=findExoIndex(key); if(!info||!info.exo.repTarget) return;
  var cs=document.getElementById('chip-s-'+key); if(cs) cs.innerHTML='&#x1F4CA; '+csLabel(info.exo,val);
  var srow=document.getElementById('srow-'+info.sid+'-'+info.ei);
  if(srow) srow.querySelectorAll('.sbbl-r').forEach(function(el){ el.textContent=repLabel(info.exo,val); });
}

// ══════════════════════════════════════════════════
// BUILD SEANCES
// ══════════════════════════════════════════════════
function buildSeances(){
  var gridMain=document.getElementById('sgridMain');
  var gridMini=document.getElementById('sgridMini');
  var panelsDiv=document.getElementById('panels');
  if(!gridMain||!gridMini||!panelsDiv) return;
  gridMain.innerHTML=''; gridMini.innerHTML=''; panelsDiv.innerHTML='';

  DATA.forEach(function(s,si){
    var mini=si>=2; // PUSH + PULL en grand, le reste (Jambes, Bonus, Maison) en petites bulles
    var grid=mini?gridMini:gridMain;
    var card=document.createElement('div');
    card.className='sc'+(si===0?' active':'')+(mini?' sc-mini':'');
    card.dataset.t=s.t; card.dataset.id=s.id;
    card.addEventListener('click',function(){ selectSeance(s.id); });
    var visExos=s.exos.filter(function(e){return !e.hidden;});
    var mainExos=visExos.filter(function(e){return !e.bonus;});
    var bonusExos=visExos.filter(function(e){return e.bonus;});
    // Card v2 (02/08) : icône + nom + sous-titre, point — le numéro et le compte d'exos n'apportaient rien
    card.innerHTML='<span class="sc-ico">'+s.icon+'</span><div class="sc-name">'+s.name+'</div><div class="sc-sub">'+s.sub+'</div>';
    grid.appendChild(card);

    var total=0; mainExos.forEach(function(e){var m=e.serie.match(/^(\d+)/);if(m)total+=parseInt(m[1]);});

    function buildExo(e,ei,dispNum){
      var w=getCurrentWeight(e.key);
      var inc=e.inc||0.5;
      var isKg=/kg/.test(e.unite);
      var hasImg=e.img&&typeof IMGS!=='undefined'&&IMGS[e.img];
      var actLbl=isKg?'Poids actuel':'Valeur actuelle';
      // Séries : pour les exos "repTarget" (Maison), la valeur saisie est l'objectif par série.
      // Le nombre de séries vient de `serie` — le cardio n'en a qu'UNE (08/08), pas 3.
      var sets='';
      if(e.repTarget){
        var rtN=repTargetN(e);
        for(var i=1;i<=rtN;i++)sets+='<div class="sbbl" id="set-'+s.id+'-'+ei+'-'+i+'" onclick="toggleSet(\''+s.id+'\','+ei+','+i+','+rtN+',\''+e.key+'\')"><span>Série '+i+'</span><span class="sbbl-r">'+repLabel(e,w)+'</span></div>';
      } else {
        var m=e.serie.match(/^(\d+)×(.+)$/);
        if(m){var n=parseInt(m[1]),r=m[2];for(var k=1;k<=n;k++)sets+='<div class="sbbl" id="set-'+s.id+'-'+ei+'-'+k+'" onclick="toggleSet(\''+s.id+'\','+ei+','+k+','+n+',\''+e.key+'\')"><span>Série '+k+'</span><span class="sbbl-r">'+r+'</span></div>';}
      }
      var serieLabel=e.repTarget?csLabel(e,w):e.serie;
      var tips=e.tips.map(function(t){return '<div class="tip"><div class="tdot"></div>'+t+'</div>';}).join('');
      var errs=e.errs.map(function(er){return '<div class="erritem"><span class="errx">✕</span>'+er+'</div>';}).join('');
      var days=getDaysSinceWeightChange(e.key);
      var nudge=getProgressNudge(e.key); // encadré jaune (≥6) / rouge (≥10) dans la section dépliée — seule trace du compteur (retour Adrien)
      var staleHtml=nudge?'<div class="weight-nudge show'+(nudge.lvl==='hot'?' nudge-hot':'')+'" id="nudge-'+e.key+'">&#x1F4A1; '+nudge.msg+'</div>':'';
      var prChip=days===0?'<span class="chip chip-up">&#x1F195; Mis à jour aujourd\'hui</span>':'';
      // Retour Adrien 01/08 : plus de compteur « N séances à ce poids » sur la ligne fermée (pas beau) —
      // le détail vit dans la section dépliée (staleHtml). Seul un point rouge discret signale un ≥10.
      var staleChip=(nudge&&nudge.lvl==='hot')?'<span class="stale-dot" title="10 s&#xE9;ances ou plus &#xE0; ce poids &#x2014; ouvre l\'exo pour le d&#xE9;tail">&#x1F534;</span>':'';
      var impCls=e.imp?' ex-imp':'';
      var impTag=e.imp?'<span class="ex-imp-tag" title="Exercice clé pour ton profil">Clé</span>':'';
      return '<div class="ex'+(e.bonus?' ex-bonus':'')+impCls+'" id="ex-'+s.id+'-'+ei+'">'
        +'<button class="exbtn" onclick="toggleEx(\''+s.id+'\','+ei+')">'
        +'<div class="exnum">'+dispNum+'</div>'
        +'<div class="exinf"><div class="exname">'+e.name+impTag+'</div>'
        +'<div class="exmeta"><span class="chip cw" id="chip-w-'+e.key+'">&#x2696;&#xFE0F; '+w+' '+e.unite+'</span><span class="chip cs" id="chip-s-'+e.key+'">&#x1F4CA; '+serieLabel+'</span>'+prChip+staleChip+'</div></div>'
        +'<div class="exarr">▾</div></button>'
        +'<div class="exbody"><div class="exinner'+(hasImg?'':' no-demo')+'">'
        +(hasImg?'<div class="demo"><img src="'+IMGS[e.img]+'" alt="'+e.name+'" style="width:100%;height:100%;object-fit:contain;"/><div class="demo-lbl">Démonstration</div></div>':'')
        +'<div class="exc">'
        +'<div><div class="seclbl">'+actLbl+'</div>'
        +'<div class="weight-row"><button class="wbtn minus" onclick="changeWeight(\''+e.key+'\',-'+inc+',\''+s.id+'\','+ei+',\''+e.unite+'\')">−</button><input class="weight-input" id="wval-'+e.key+'" type="number" step="'+inc+'" min="0" value="'+w+'" oninput="previewWeight(this,\''+e.key+'\',\''+e.unite+'\')" onblur="setWeightDirect(this,\''+e.key+'\',\''+s.id+'\','+ei+',\''+e.unite+'\')" onkeydown="if(event.key===\'Enter\')this.blur()"/><span class="weight-unit">'+e.unite+'</span><button class="wbtn plus" onclick="changeWeight(\''+e.key+'\','+inc+',\''+s.id+'\','+ei+',\''+e.unite+'\')">+</button></div>'
        +'<div class="weight-date" id="wdate-'+e.key+'">Dernière modif. : '+formatDateFr(DB.weightSetDate[e.key])+'</div>'
        +staleHtml+'</div>'
        +'<div><div class="seclbl">Séries — clique pour cocher</div><div class="srow" id="srow-'+s.id+'-'+ei+'">'+sets+'</div></div>'
        +'<div class="rest-timer" id="timer-'+s.id+'-'+ei+'">'
        +'<div class="rt-circle" id="rtc-'+s.id+'-'+ei+'"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="3"/><circle class="fg" cx="22" cy="22" r="18" fill="none" stroke="#71FFB4" stroke-width="3" stroke-dasharray="113" stroke-dashoffset="0" stroke-linecap="round"/></svg></div>'
        +'<div class="rt-info"><div class="rt-label">Repos</div><div class="rt-time" id="rtt-'+s.id+'-'+ei+'">'+formatTime(e.rest)+'</div><div class="rt-msg" id="rtm-'+s.id+'-'+ei+'">Série terminée !</div></div>'
        +'<button class="rt-stop" onclick="stopTimer(\''+s.id+'\','+ei+')">✕</button>'
        +'</div>'
        +'<div class="cue"><div class="cuelbl">&#x27A1; Cue principal</div><div class="cuetxt">'+e.cue+'</div>'+(e.bless?'<div class="cue-bless">&#x1FA79; '+e.bless+'</div>':'')+'</div>'
        +'<div><div class="seclbl">Conseils</div><div class="tips">'+tips+'</div></div>'
        +'<div class="errs"><div class="errlbl">⚠ Erreurs à éviter</div>'+errs+'</div>'
        +'</div></div></div></div>';
    }

    var mainHtml='', bonusHtml='', mainNo=0, bonusNo=0;
    if(s.id==='sb'){
      // OTHERS : trié par catégorie avec en-têtes (Abdos · Poids de corps · Cardio)
      OTHERS_CATS.forEach(function(c){
        var catExos=s.exos.map(function(e,ei){return {e:e,ei:ei};}).filter(function(x){return !x.e.hidden&&(x.e.cat||'corps')===c.id;});
        if(!catExos.length) return;
        mainHtml+='<div class="oth-cat">'+c.ico+' '+c.lbl+'</div>';
        catExos.forEach(function(x){ mainNo++; mainHtml+=buildExo(x.e,x.ei,('0'+mainNo).slice(-2)); });
      });
    } else {
      s.exos.forEach(function(e,ei){
        if(e.hidden) return;
        if(e.bonus){ bonusNo++; bonusHtml+=buildExo(e,ei,'B'+bonusNo); }
        else { mainNo++; mainHtml+=buildExo(e,ei,('0'+mainNo).slice(-2)); }
      });
    }

    var bonusBlock='';
    if(bonusExos.length){
      bonusBlock='<button class="bonus-btn" id="bonusbtn-'+s.id+'" onclick="toggleBonus(\''+s.id+'\')">'
        +'&#x2B50; Exercices bonus <span class="bb-ct">+'+bonusExos.length+'</span><span class="wb-arr">&#x25BE;</span></button>'
        +'<div class="bonus-body" id="bonusbody-'+s.id+'">'+bonusHtml+'</div>';
    }

    var panel=document.createElement('div');
    panel.className='panel'+(si===0?' active':'');
    panel.id='panel-'+s.id; panel.dataset.t=s.t;
    panel.innerHTML='<div class="phdr"><div class="ptw"><div class="plbl">'+s.num+' \u00b7 '+s.icon+'</div><div class="ptitle">'+s.name+'</div><div class="psub">'+s.sub+'</div></div><div class="pstats"><div><div class="sv">'+mainExos.length+'</div><div class="sl">Exercices</div></div><div><div class="sv">'+total+'</div><div class="sl">S\u00e9ries</div></div></div></div>'
      +buildWarmup(s.id,s.t)+'<div class="exlist">'+mainHtml+bonusBlock+'</div>';
      // (section étirements retirée d'OTHERS le 04/08 — tout vit dans l'espace Détente 🧘)
    panelsDiv.appendChild(panel);
  });
}

function toggleStretch(id){
  var g=document.getElementById('stgrp-'+id);
  if(g) g.classList.toggle('open');
}

function selectSeance(id){
  document.querySelectorAll('.sc').forEach(function(c){c.classList.toggle('active',c.dataset.id===id);});
  document.querySelectorAll('.panel').forEach(function(p){p.classList.toggle('active',p.id==='panel-'+id);});
  document.querySelectorAll('.ex').forEach(function(e){e.classList.remove('open');});
}

function toggleBonus(sid){
  var btn=document.getElementById("bonusbtn-"+sid);
  var body=document.getElementById("bonusbody-"+sid);
  if(!btn||!body) return;
  var open=body.classList.contains("open");
  btn.classList.toggle("open",!open);
  body.classList.toggle("open",!open);
}

function toggleEx(sid,idx){
  var card=document.getElementById('ex-'+sid+'-'+idx);
  var wasOpen=card.classList.contains('open');
  document.querySelectorAll('[id^="ex-'+sid+'-"]').forEach(function(c){c.classList.remove('open');});
  if(!wasOpen) card.classList.add('open');
}

// ══════════════════════════════════════════════════
// WEIGHT MANAGEMENT
// ══════════════════════════════════════════════════
function changeWeight(key, delta, sid, ei, unite){
  var arr=DB.weights[key]||[];
  var cur=arr.length?arr[arr.length-1].val:0;
  var nw=Math.max(0, Math.round((cur+delta)*2)/2);
  var today=todayStr();
  if(arr.length && arr[arr.length-1].date===today){ arr[arr.length-1].val=nw; }
  else{ arr.push({date:today,val:nw}); }
  var wasPR=isPR(key,nw,arr);
  DB.weights[key]=arr;
  DB.weightSetDate[key]=today;
  saveDB();
  var wval=document.getElementById('wval-'+key);
  if(wval){ if(wval.tagName==='INPUT') wval.value=nw; else wval.textContent=nw; }
  var chip=document.getElementById('chip-w-'+key);
  if(chip) chip.innerHTML='&#x2696;&#xFE0F; '+nw+' '+unite;
  var wdate=document.getElementById('wdate-'+key);
  if(wdate) wdate.textContent='Dernière modif. : '+formatDateFr(today);
  var nudge=document.getElementById('nudge-'+key);
  if(nudge) nudge.classList.remove('show');
  updateRepTargetDisplay(key,nw);
  asSyncOfficialWeight(key,nw);
  if(wasPR&&delta>0){ showPRCelebration(chip,nw,unite); }
  else{ showToast(delta>0?'&#x1F4AA; +'+delta+' '+unite:'&#x2193; '+nw+' '+unite); }
}
// Le poids OFFICIEL vient de changer : répercuter sur un LiveUp en cours (retour Adrien 02/08).
// La référence (w0) suit toujours ; le poids de travail suit seulement s'il n'a pas été
// personnalisé en séance (weight===ancienne référence).
function asSyncOfficialWeight(key,nw){
  try{
    if(!AS||!AS.exos||!AS.exos.length) return;
    var chg=false;
    AS.exos.forEach(function(x){
      if(x.key!==key) return;
      var untouched=x.weight===x.w0;
      x.w0=nw;
      if(untouched){ x.weight=nw; if(x.repT) x.reps=nw; }
      chg=true;
    });
    if(chg){
      asSave();
      var ov=document.getElementById('asOverlay');
      if(ov&&ov.classList.contains('open')) asRender();
      asRenderBubble();
    }
  }catch(e){}
}

function setWeightDirect(input, key, sid, ei, unite){
  var nw=parseFloat(input.value);
  if(isNaN(nw)||nw<0){input.value=getCurrentWeight(key);return;}
  nw=Math.round(nw*2)/2;
  input.value=nw;
  var arr=DB.weights[key]||[];
  var wasPR=isPR(key,nw,arr);
  var today=todayStr();
  if(arr.length&&arr[arr.length-1].date===today){arr[arr.length-1].val=nw;}
  else{arr.push({date:today,val:nw});}
  DB.weights[key]=arr; DB.weightSetDate[key]=today; saveDB();
  var chip=document.getElementById('chip-w-'+key);
  if(chip) chip.innerHTML='&#x2696;&#xFE0F; '+nw+' '+unite;
  var wdate=document.getElementById('wdate-'+key);
  if(wdate) wdate.textContent='Dernière modif. : '+formatDateFr(today);
  var nudge=document.getElementById('nudge-'+key);
  if(nudge) nudge.classList.remove('show');
  updateRepTargetDisplay(key,nw);
  asSyncOfficialWeight(key,nw);
  if(wasPR){ showPRCelebration(chip,nw,unite); }
  else{ showToast('&#x2705; '+nw+' '+unite+' enregistr\u00e9'); }
}

function previewWeight(input, key, unite) {
  var v = parseFloat(input.value);
  if (isNaN(v) || v < 0) return;
  var chip = document.getElementById('chip-w-' + key);
  if (chip) chip.innerHTML = '&#x2696;&#xFE0F; ' + Math.round(v * 2) / 2 + ' ' + unite;
}

function isPR(key,nw,arr){
  var prev=(arr||DB.weights[key]||[]).filter(function(e){return e.date!==todayStr();});
  if(!prev.length) return false;
  return nw>Math.max.apply(null,prev.map(function(e){return e.val;}));
}

function spawnConfetti(cx,cy){
  var colors=['#71FFB4','#4D9DFF','#FF8452','#C97BFF','#FFC94D'];
  for(var i=0;i<18;i++){
    var dot=document.createElement('div');
    dot.className='confetti-dot';
    dot.style.left=cx+'px'; dot.style.top=cy+'px';
    dot.style.background=colors[i%colors.length];
    var angle=(i/18)*Math.PI*2;
    var dist=60+Math.random()*60;
    dot.style.setProperty('--dx',Math.cos(angle)*dist+'px');
    dot.style.setProperty('--dy',Math.sin(angle)*dist+'px');
    document.body.appendChild(dot);
    setTimeout(function(d){d.remove();},800,dot);
  }
}

function showPRCelebration(el,nw,unite){
  showToast('&#x1F3C6; PR ! '+nw+' '+unite);
  if(el){
    el.classList.add('chip-pr-flash');
    var rect=el.getBoundingClientRect();
    spawnConfetti(rect.left+rect.width/2,rect.top+rect.height/2);
    setTimeout(function(){el.classList.remove('chip-pr-flash');},800);
  }
}

// ══════════════════════════════════════════════════
// SERIES & REST TIMER
// ══════════════════════════════════════════════════
function toggleSet(sid, ei, setIdx, totalSets, exoKey){
  var btn=document.getElementById('set-'+sid+'-'+ei+'-'+setIdx);
  if(!btn) return;
  var wasDone=btn.classList.contains('done');
  btn.classList.toggle('done',!wasDone);
  if(!wasDone){
    // Find rest duration
    var exo=null;
    DATA.forEach(function(s){ s.exos.forEach(function(e){ if(e.key===exoKey) exo=e; }); });
    var rest=exo?exo.rest:60;
    if(setIdx<totalSets){ startTimer(sid,ei,rest); }
    else{ showToast('&#x2705; Toutes les séries terminées !'); }
  } else {
    stopTimer(sid,ei);
  }
}

function startTimer(sid, ei, duration){
  // Stop any running timer
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  var id=sid+'-'+ei;
  timerExoId=id;
  timerEnd=Date.now()+duration*1000;
  updateWorkoutPushTimer(timerEnd,'Repos terminé','Lance ta prochaine série !');
  var timerEl=document.getElementById('timer-'+id);
  if(timerEl) timerEl.classList.add('active');
  var total=duration;
  updateTimerUI(id,duration,total);
  timerInterval=setInterval(function(){
    var rem=Math.ceil((timerEnd-Date.now())/1000);
    if(rem<=0){
      clearInterval(timerInterval); timerInterval=null;
      updateTimerUI(id,0,total);
      if(navigator.vibrate) navigator.vibrate([200,100,200]);
      var msg=document.getElementById('rtm-'+id);
      if(msg) msg.textContent='C\'est parti ! &#x1F4A5;';
      showToast('&#x23F1; Repos terminé — Lance la série !');
      setTimeout(function(){ stopTimer(sid,ei,true); },2000);
    } else {
      updateTimerUI(id,rem,total);
    }
  },500);
}

function updateTimerUI(id, rem, total){
  var el=document.getElementById('rtt-'+id);
  if(el) el.textContent=formatTime(rem);
  var circle=document.getElementById('rtc-'+id);
  if(circle){
    var fg=circle.querySelector('.fg');
    if(fg){
      var pct=rem/total; var circ=113;
      fg.style.strokeDashoffset=String(circ*(1-pct));
      if(rem<=10){ fg.style.stroke='var(--yellow)'; circle.classList.add('urgent'); }
      else{ fg.style.stroke='#71FFB4'; circle.classList.remove('urgent'); }
    }
  }
}

function stopTimer(sid,ei,preservePush){
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  if(!preservePush) updateWorkoutPushTimer(null);
  var id=sid+'-'+ei;
  var timerEl=document.getElementById('timer-'+id);
  if(timerEl) timerEl.classList.remove('active');
}

function formatTime(s){ return Math.floor(s/60)+':'+(s%60<10?'0':'')+s%60; }

// ══════════════════════════════════════════════════
// LOG / HISTORIQUE
// ══════════════════════════════════════════════════
function buildLogModal(){
  var d=getNow();
  document.getElementById('logDate').value=todayStr();
  var startD=sessionStartTime?new Date(sessionStartTime):d;
  document.getElementById('logTime').value=String(startD.getHours()).padStart(2,'0')+':'+String(startD.getMinutes()).padStart(2,'0');
  var el=document.getElementById('seanceCheckboxes'); el.innerHTML='';
  DATA.forEach(function(s){
    var div=document.createElement('div');
    div.className='sc-check'; div.dataset.sid=s.id;
    var main='<div class="sc-check-main" onclick="toggleScCheck(this.closest(\'.sc-check\'))">'
      +'<span class="sc-check-ico">'+s.icon+'</span>'
      +'<div class="sc-check-info"><span class="sc-check-name">'+s.name+'</span>'
      +'<span class="sc-check-sub">'+s.sub+'</span></div>'
      +'<span class="sc-check-tick">&#x2713;</span>'
      +'</div>';
    var visExos=s.exos.filter(function(e){return !e.hidden;});
    var mainExos=visExos.filter(function(e){return !e.bonus;});
    var bonusExos=visExos.filter(function(e){return e.bonus;});
    if(!s.exos.length){
      div.innerHTML=main;
    } else {
      function exoRow(e){
        return '<div class="sc-exo-item'+(e.bonus?' sc-exo-bonus':'')+'" data-exo="'+e.key+'" onclick="toggleExoSel(event,this)">'+e.name+'</div>';
      }
      var exoItems=mainExos.map(exoRow).join('');
      if(bonusExos.length){
        exoItems+='<div class="sc-exo-sep">Bonus</div>'+bonusExos.map(exoRow).join('');
      }
      div.innerHTML=main
        +'<button class="sc-bonus-btn" onclick="toggleScBonus(event,this)" title="Choisir un ou plusieurs exercices"><span>Exercices</span><span class="sc-bonus-arr">&#x25BE;</span></button>'
        +'<div class="sc-exo-list">'+exoItems+'</div>';
    }
    el.appendChild(div);
  });
}

function toggleScCheck(div){
  div.classList.toggle('sel');
  // La sélection de la séance est indépendante des exos bonus cochés.
}

function toggleScBonus(e, btn){
  e.stopPropagation();
  btn.closest('.sc-check').classList.toggle('bonus-open');
}

function toggleExoSel(e, item){
  e.stopPropagation();
  item.classList.toggle('sel');
  var card=item.closest('.sc-check');
  var anySelected=card.querySelectorAll('.sc-exo-item.sel').length>0;
  card.classList.toggle('partial-sel', anySelected && !card.classList.contains('sel'));
}

function openLogModal(){
  buildLogModal();
  var saveBtn=document.querySelector('#logModal .btn-primary');
  if(saveBtn){saveBtn.disabled=false;saveBtn.innerHTML='Enregistrer ✓';saveBtn.classList.remove('btn-save-anim');}
  // Pre-fill duration if session was started
  var durEl=document.getElementById('logDuration');
  if(durEl){ durEl.value=sessionStartTime?Math.round((Date.now()-sessionStartTime)/60000):''; }
  // Reset ratings
  logEnergy=null; logFeeling=null;
  document.querySelectorAll('#logModal .rating-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById('energyLbl').textContent='';
  document.getElementById('feelingLbl').textContent='';
  var detSec=document.getElementById('logDetailsSection');
  var detBtn=document.getElementById('logDetailsToggle');
  if(detSec) detSec.style.display='none';
  if(detBtn) detBtn.classList.remove('open');
  renderTemplateChips();
  document.getElementById('logModal').classList.add('open');
}
function closeLogModal(){
  editingLogId=null;
  document.getElementById('logModal').classList.remove('open');
  document.getElementById('autreCheck').checked=false;
  document.getElementById('autreSport').style.display='none';
  document.getElementById('autreSport').value='';
  logEnergy=null; logFeeling=null;
  document.querySelectorAll('#logModal .rating-btn').forEach(function(b){b.classList.remove('active');});
  var detSec=document.getElementById('logDetailsSection');
  var detBtn=document.getElementById('logDetailsToggle');
  if(detSec) detSec.style.display='none';
  if(detBtn) detBtn.classList.remove('open');
  document.querySelectorAll('#seanceCheckboxes .sc-exo-item.sel').forEach(function(el){ el.classList.remove('sel'); });
  document.querySelectorAll('#seanceCheckboxes .sc-check').forEach(function(c){ c.classList.remove('sel','partial-sel','bonus-open'); });
  if(seanceTimerInterval){ clearInterval(seanceTimerInterval); seanceTimerInterval=null; }
  sessionStartTime=null;
}


function toggleLogDetails(){
  var sec=document.getElementById('logDetailsSection');
  var btn=document.getElementById('logDetailsToggle');
  var open=sec.style.display!=='none';
  sec.style.display=open?'none':'block';
  if(btn) btn.classList.toggle('open',!open);
}

function renderTemplateChips(){
  var wrap=document.getElementById('templateChips');
  if(!wrap) return;
  if(!DB.templates||!DB.templates.length){wrap.style.display='none';return;}
  wrap.style.display='flex';
  wrap.innerHTML=DB.templates.map(function(t,i){
    return '<span class="tpl-chip" onclick="applyTemplate('+i+')">'
      +t.name
      +'<span class="tpl-chip-del" onclick="event.stopPropagation();deleteTemplate('+i+')" title="Supprimer">&#x2715;</span>'
      +'</span>';
  }).join('');
}

function applyTemplate(idx){
  var t=DB.templates[idx]; if(!t) return;
  document.querySelectorAll('#seanceCheckboxes .sc-check').forEach(function(el){
    el.classList.toggle('sel', t.sessions.indexOf(el.dataset.sid)>=0);
  });
}

function saveCurrentAsTemplate(){
  var sessions=[];
  document.querySelectorAll('#seanceCheckboxes .sc-check.sel').forEach(function(el){sessions.push(el.dataset.sid);});
  if(!sessions.length){showToast('&#x26A0; S\u00e9lectionne au moins une s\u00e9ance');return;}
  var name=sessions.map(function(sid){var s=DATA.find(function(x){return x.id===sid;});return s?s.name:sid;}).join(' + ');
  var exists=DB.templates.find(function(t){return t.sessions.join(',')===sessions.join(',');});
  if(exists){showToast('Ce combo existe d\u00e9j\u00e0');return;}
  if(DB.templates.length>=6){showToast('&#x26A0; Maximum 6 templates');return;}
  DB.templates.push({name:name,sessions:sessions});
  saveDB();
  renderTemplateChips();
  showToast('&#x2B50; Template "'+name+'" sauvegard\u00e9');
}

function deleteTemplate(idx){
  DB.templates.splice(idx,1);
  saveDB();
  renderTemplateChips();
}

function toggleAutreSport(){
  var cb=document.getElementById('autreCheck');
  var inp=document.getElementById('autreSport');
  inp.style.display=cb.checked?'block':'none';
}

function saveLog(){
  var date=document.getElementById('logDate').value;
  var time=document.getElementById('logTime').value;
  var comment=document.getElementById('logComment').value.trim();
  var sessions=[];
  document.querySelectorAll('#seanceCheckboxes .sc-check.sel').forEach(function(el){ sessions.push(el.dataset.sid); });
  document.querySelectorAll('#seanceCheckboxes .sc-check:not(.sel) .sc-exo-item.sel').forEach(function(el){ sessions.push('exo:'+el.dataset.exo); });
  var autreCbV=document.getElementById('autreCheck');
  var hasAutre=autreCbV&&autreCbV.checked&&document.getElementById('autreSport').value.trim().length>0;
  if(!date||(sessions.length===0&&!hasAutre)){ showToast('&#x26A0; Choisis une s\u00e9ance ou renseigne un autre sport'); return; }
  var autreCb=document.getElementById('autreCheck');
  if(autreCb&&autreCb.checked){
    var autreSportVal=document.getElementById('autreSport').value.trim();
    if(autreSportVal) sessions.push('autre:'+autreSportVal);
  }
  var durEl=document.getElementById('logDuration');
  var durMin=durEl&&durEl.value?parseInt(durEl.value):null;
  if(durMin&&(isNaN(durMin)||durMin<=0)) durMin=null;
  var logId;
  if(editingLogId){
    logId=editingLogId;
    DB.logs=DB.logs.filter(function(l){return String(l.id)!==String(editingLogId);});
    editingLogId=null;
  } else {
    var existingSessions=[];
    DB.logs.filter(function(l){return l.date===date;}).forEach(function(l){existingSessions=existingSessions.concat(l.sessions);});
    var overlap=sessions.filter(function(s){return s.indexOf("autre:")<0&&existingSessions.indexOf(s)>=0;});
    if(overlap.length){
      var names=overlap.map(function(sid){var s=DATA.find(function(x){return x.id===sid;});return s?s.name:sid;}).join(", ");
      if(!confirm('Tu as déjà une séance "'+names+'" enregistrée ce jour. Continuer quand même ?')) return;
    }
    logId=Date.now();
  }
  DB.logs.push({id:logId,date:date,time:time,sessions:sessions,comment:comment,feeling:logFeeling||null,energy:logEnergy||null,duration_min:durMin||null});
  DB.logs.sort(function(a,b){return b.date.localeCompare(a.date)||(b.time.localeCompare(a.time));});
  saveDB();
  var saveBtn=document.querySelector('#logModal .btn-primary');
  if(saveBtn){saveBtn.disabled=true;saveBtn.innerHTML='&#x2705; Enregistr\u00e9\u00a0!';saveBtn.classList.add('btn-save-anim');}
  setTimeout(function(){
    closeLogModal();
    document.getElementById('logComment').value='';
    var durElSave=document.getElementById('logDuration');if(durElSave) durElSave.value='';
    renderHisto();
    try{ checkReminders(); }catch(e){}
    showToast('\u2705 S\u00e9ance enregistr\u00e9e !');
  },550);
}

function deleteLog(id){
  var sid=String(id);
  var deleted=DB.logs.find(function(l){return String(l.id)===sid;});
  DB.logs=DB.logs.filter(function(l){return String(l.id)!==sid;});
  // Tombstone (12/08) : sans elle, la s\u00e9ance revient du cloud au prochain chargement
  if(!DB.deletedLogs) DB.deletedLogs=[];
  if(DB.deletedLogs.indexOf(sid)<0) DB.deletedLogs.push(sid);
  saveDB(); renderHisto();
  closeDayModal();
  if(deleted){
    showToast('S\u00e9ance supprim\u00e9e', function(){
      DB.logs.push(deleted);
      DB.logs.sort(function(a,b){return b.date.localeCompare(a.date)||(b.time.localeCompare(a.time));});
      DB.deletedLogs=(DB.deletedLogs||[]).filter(function(x){return x!==sid;});
      saveDB(); renderHisto();
      showToast('\u21A9 S\u00e9ance restaur\u00e9e');
    });
  }
}

// ══════════════════════════════════════════════════
// CALENDAR
// ══════════════════════════════════════════════════
function calPrev(){ calMonth2--; if(calMonth2<0){calMonth2=11;calYear--;} renderCal(); }
function calNext(){ calMonth2++; if(calMonth2>11){calMonth2=0;calYear++;} renderCal(); }

function renderCal(){
  var months=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  document.getElementById('calMonth').textContent=months[calMonth2]+' '+calYear;
  var grid=document.getElementById('calGrid'); grid.innerHTML='';
  ['L','M','M','J','V','S','D'].forEach(function(d){ var el=document.createElement('div'); el.className='cal-day-name'; el.textContent=d; grid.appendChild(el); });
  var first=new Date(calYear,calMonth2,1).getDay(); // 0=Sun
  var offset=(first===0)?6:first-1;
  var days=new Date(calYear,calMonth2+1,0).getDate();
  var today=todayStr();
  var sessionMap={};
  DB.logs.forEach(function(l){ if(!sessionMap[l.date]) sessionMap[l.date]=[]; sessionMap[l.date]=sessionMap[l.date].concat(l.sessions); });
  // 04/09 (demande Adrien) : plus de trous en début/fin de mois — les cases des semaines à cheval
  // affichent les VRAIS jours du mois d'avant/d'après (grisés .other, mêmes couleurs, cliquables).
  var trail=(7-(offset+days)%7)%7;
  for(var i=1-offset;i<=days+trail;i++){
    var dt=new Date(calYear,calMonth2,i);
    var other=dt.getMonth()!==calMonth2;
    var d=dt.getDate();
    var dateStr=dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var el=document.createElement('div');
    var sessions=sessionMap[dateStr];
    var cls='cal-day'+(dateStr===today?' today':'')+(other?' other':'');
    var frozen=false;
    try{ frozen=rankInPause(dateStr); }catch(e){}
    if(frozen) cls+=' day-frozen'; // jour en mode gel : style glace ❄
    if(sessions){
      cls+=' has-session';
      if(sessions.length>=2) cls+=' day-hi';
      // Une séance complète cochée (PUSH/PULL/LEGS) impose TOUJOURS sa couleur.
      // La comparaison exo vs exo ne joue que les jours sans séance complète.
      var seanceTypes=sessions.map(function(sid){
        if(sid.indexOf('exo:')===0||sid.indexOf('autre:')===0||sid==='sb') return null;
        var s=DATA.find(function(x){return x.id===sid;});return s?s.t:null;
      }).filter(Boolean);
      var exoTypes=sessions.map(function(sid){
        if(sid.indexOf('exo:')!==0) return null;
        var info=findExoIndex(sid.slice(4)); return info?info.seance.t:null;
      }).filter(Boolean);
      var types=seanceTypes.length?seanceTypes:exoTypes;
      var pushC=types.filter(function(t){return t==='push';}).length;
      var pullC=types.filter(function(t){return t==='pull'||t==='pull2';}).length;
      var legsC=types.filter(function(t){return t==='legs';}).length;
      var hasMaisonAutre=sessions.some(function(sid){return sid==='sb'||sid.indexOf('autre:')===0;})||types.indexOf('bonus')>=0;
      if(pushC>pullC&&pushC>legsC) cls+=' day-push';
      else if(pullC>pushC&&pullC>legsC) cls+=' day-pull';
      else if(legsC>pushC&&legsC>pullC) cls+=' day-legs';
      else if(hasMaisonAutre&&pushC===0&&pullC===0&&legsC===0) cls+=' day-maison';
    }
    el.className=cls;
    el.textContent=d;
    if(frozen){ var fk=document.createElement('span'); fk.className='cd-frost'; fk.innerHTML='&#x2744;'; el.appendChild(fk); }
    // Étirements du jour (espace Détente) : petite bulle 🧘 compacte — la couleur de la case ne change pas
    var stretched=dzDayDone(dateStr); // étirements de séance OU routine matin/soir (26/08)
    if(stretched){ var zk=document.createElement('span'); zk.className='cd-zen'; zk.innerHTML='&#x1F9D8;'; el.appendChild(zk); }
    if(sessionMap[dateStr]||frozen||stretched){ // gelé/étiré cliquable même sans séance
      el.dataset.date=dateStr;
      el.addEventListener('click',function(){ showDayModal(this.dataset.date); });
    }
    grid.appendChild(el);
  }
}

// Détail complet d'une séance en direct (modal jour) : exos, séries, notes /5, /20.
// Règle annexes : principaux toujours affichés ; bonus/ajoutés seulement si ≥2 séries
// (ou complétés), jamais présentés comme des échecs.
function liveLogDetailHtml(l){
  if(!l.live||!(l.live.exos||[]).length) return '';
  var exos=l.live.exos;
  var noted=liveNotedExos(exos);
  // Note /20 recalculée sur les exos PRINCIPAUX (même règle que le bilan de séance — bonus hors note)
  var g=0;
  if(noted.length){
    var t=0; noted.forEach(function(x){ t+=asScoreExoRaw(x); });
    g=Math.max(0,Math.min(20,Math.round(t/noted.length*4)));
  }
  var rows='';
  exos.forEach(function(x){
    var side=liveExoSide(x);
    var counted=liveExoCounted(x);
    var sets=x.sets||[];
    if(side&&!sets.length) return; // annexe jamais commencé → pas dans l'historique
    if(!side&&!sets.length&&x.status==='skipped') {
      rows+='<div class="dld-row"><span class="dld-name" style="color:var(--mut)">'+getExoName(x.key)+'</span><span class="dld-tag" style="color:var(--mut)">passé</span></div>';
      return;
    }
    var setsTxt=fmtSetsW(x,sets);
    // Exos abdo : tag violet OTHERS + 🔥 au lieu de l'étoile (06/08, demande Adrien)
    var infA=findExoIndex(x.key);
    var isAbdo=!!(infA&&infA.exo&&infA.exo.cat==='abdo');
    var right='';
    if(side&&!counted){
      right='<span class="dld-tag" style="color:'+(isAbdo?'#9B8CFF':'var(--yellow)')+'">'+(isAbdo?'🔥':'⭐')+' bonus · '+sets.length+' série'+(sets.length>1?'s':'')+'</span>';
    } else {
      // la note /5 garde ses couleurs de score pour TOUS les exos (retour Adrien 06/08)
      var sc=asScoreExo(x);
      var col=sc>=4?'var(--acc)':sc>=2.5?'var(--yellow)':'var(--red)';
      right='<span class="dld-tag" style="color:'+col+';font-weight:800">'+String(sc).replace('.',',')+'<small style="font-weight:500;color:var(--mut)">/5</small></span>';
    }
    rows+='<div class="dld-row">'
      +'<span class="dld-name">'+(side?(isAbdo?'🔥 ':'⭐ '):'')+getExoName(x.key)+(counted&&x.status==='skipped'&&sets.length<(x.n||3)?' <small style="color:var(--mut)">'+(x.pain?'(arrêt douleur, compté)':'(écourté, compté)')+'</small>':'')+'</span>'
      +right
      +'<div class="dld-sets">'+(setsTxt||(x.w+' '+x.unite))+'</div>'
      +'</div>';
  });
  if(!rows) return '';
  var rpLine='',evLines='';
  if(FEATURE_RANK) try{
    var r=rankSeanceRP(l);
    rpLine=' &middot; <strong style="color:var(--acc)">+'+Math.max(1,Math.round(r.total/LADDER_ECO.seanceDiv))+' RP</strong>'
      +' <span style="color:var(--mut);font-weight:600">'+r.total.toLocaleString('fr-FR')+' pts d\'activit&#xE9;</span>';
    // Détail bonus / malus de la séance (demande Adrien 01/08)
    if(r.events&&r.events.length){
      evLines='<div class="dld-events">';
      r.events.slice(0,10).forEach(function(ev){
        evLines+='<div class="dld-ev'+(ev.rp<0?' neg':'')+'"><span>'+ev.ico+' '+ev.label+'</span><b>'+(ev.rp>0?'+':'')+ev.rp+'</b></div>';
      });
      evLines+='</div>';
    }
  }catch(e){}
  var ctxMap={temps:'&#x23F0; manque de temps',blessure:'&#x1FA79; blessure/douleur',energie:'&#x1F634; &#xE9;nergie/sommeil',malade:'&#x1F912; malade'};
  var ctxLine=(l.live.context&&ctxMap[l.live.context])?'<div style="font-size:.64rem;color:var(--yellow);margin-bottom:.4rem;">Contexte d&#xE9;clar&#xE9; : '+ctxMap[l.live.context]+' &#x2014; malus compens&#xE9;s</div>':'';
  var coachLine=l.live.coachNote?'<div class="dld-coach">'+l.live.coachNote+'</div>':'';
  return '<div class="dld-note">Note de séance <strong style="color:var(--txt)">'+g+'<small style="color:var(--mut)">/20</small></strong>'+rpLine+'</div>'+coachLine+ctxLine+evLines+rows;
}
function toggleLiveDetail(id){
  var el=document.getElementById('dld-'+id); if(!el) return;
  var open=el.style.display!=='none';
  el.style.display=open?'none':'';
  var arr=document.getElementById('dlda-'+id);
  if(arr) arr.innerHTML=open?'&#x25B8;':'&#x25BE;';
}

function showDayModal(date){
  var logs=DB.logs.filter(function(l){return l.date===date;});
  var frozen=false; try{ frozen=rankInPause(date); }catch(e){}
  var sub='';
  if(frozen) sub='\u2744 jour gel\u00e9';
  else if(!logs.length) sub='aucune s\u00e9ance';
  document.getElementById('dayModalTitle').innerHTML=
    '<div class="dm-date"><span class="dm-date-day">'+formatDateFr(date)+'</span>'
    +(sub?'<span class="dm-date-sub">'+sub+'</span>':'')+'</div>'
    +'<button class="modal-close hc-close" onclick="closeDayModal()">\u2715</button>';
  var html='';
  logs.forEach(function(l){
    // ── Normalisation : si TOUS les principaux d'une séance sont là en exos à la carte,
    // on affiche la chip de LA séance à la place (fix « 3 exos jambes ≠ séance LEGS ») ──
    var sess=(l.sessions||[]).slice();
    var exoKeys=sess.filter(function(x){return x.indexOf('exo:')===0;}).map(function(x){return x.slice(4);});
    DATA.forEach(function(sd){
      if(sd.id==='sb'||sess.indexOf(sd.id)>=0) return;
      var mains=sd.exos.filter(function(e){return !e.hidden&&!e.bonus;}).map(function(e){return e.key;});
      if(mains.length&&mains.every(function(k){return exoKeys.indexOf(k)>=0;})){
        sess=sess.filter(function(x){return !(x.indexOf('exo:')===0&&mains.indexOf(x.slice(4))>=0);});
        sess.unshift(sd.id);
      }
    });
    var chips='';
    sess.forEach(function(sid){
      if(sid.indexOf('autre:')==0){
        chips+='<span class="chip chip-maison">&#x1F938; '+sid.replace('autre:','')+'</span>';
      } else if(sid==='sb'){
        var sm=DATA.find(function(x){return x.id==='sb';});
        chips+='<span class="chip chip-maison">'+(sm?sm.icon:'&#x1F3E0;')+' '+(sm?sm.name:'MAISON')+'</span>';
      } else if(sid.indexOf('exo:')==0){
        var exoKey=sid.replace('exo:','');
        var exoParent=null,exoDef=null;
        DATA.forEach(function(ds){ds.exos.forEach(function(e){if(e.key===exoKey){exoParent=ds;exoDef=e;}});});
        if(exoParent){
          // pills : exo abdo = violet OTHERS (06/08, demande Adrien), le reste = couleur de sa séance
          var tc=(exoDef&&exoDef.cat==='abdo')?'maison':(exoParent.t==='pull2'?'pull':exoParent.t);
          chips+='<span class="chip chip-'+tc+'">'+getExoName(exoKey)+'</span>';
        }
        else{chips+='<span class="chip" style="background:rgba(77,157,255,.1);color:var(--acc2)">'+getExoName(exoKey)+'</span>';}
      } else {
        var s=DATA.find(function(x){return x.id===sid;});
        if(s){ var tc=s.t==='pull2'?'pull':s.t; chips+='<span class="chip chip-'+tc+'">'+s.icon+' '+s.name+'</span>'; }
      }
    });
    // Type dominant de la séance → accent couleur de la carte
    var _tc='';
    sess.forEach(function(sid){
      if(_tc) return;
      if(sid==='sb'||sid.indexOf('autre:')===0){ _tc='maison'; return; }
      if(sid.indexOf('exo:')===0){ var inf=findExoIndex(sid.slice(4)); if(inf) _tc=inf.seance.t==='pull2'?'pull':inf.seance.t; return; }
      var sd=DATA.find(function(x){return x.id===sid;}); if(sd) _tc=sd.t==='pull2'?'pull':sd.t;
    });
    if(_tc==='bonus') _tc='maison';
    // Héros (15/08, demande Adrien) : la NOTE /20 gravée de la séance — les RP/pts ne
    // s'affichent que si le rank est réactivé (FEATURE_RANK).
    var pts=0,ptsRP=0,ptsManual=false;
    if(FEATURE_RANK) try{ var _rp=rankSeanceRP(l); pts=_rp.total; ptsManual=!!_rp.manual; ptsRP=pts>0?Math.max(1,Math.round(pts/LADDER_ECO.seanceDiv)):0; }catch(e){}
    var note=liveLogNote20(l);
    var meta=['&#x1F551; '+l.time];
    if(l.duration_min) meta.push('&#x23F1; '+l.duration_min+' min');
    if(l.energy) meta.push('&#x26A1; '+l.energy+'/5');
    if(l.feeling) meta.push('&#x2B50; '+l.feeling+'/5');
    var liveLine='',detailBlock='';
    if(l.live){
      var _eng=liveEngagedExos(l.live.exos||[]);
      var _dn=_eng.filter(function(x){return x.status==='done'||liveExoCounted(x);}).length;
      var _sk=_eng.filter(function(x){return x.status==='skipped'&&!liveExoCounted(x);}).length;
      var _st=(l.live.exos||[]).reduce(function(a,x){return a+(x.sets?x.sets.length:0);},0);
      liveLine='<div class="dm-live">&#x25B6; LiveUp &middot; '+_dn+' exo'+(_dn>1?'s':'')+' &middot; '+_st+' s&#xE9;ries'
        +(_sk?' &middot; '+_sk+' pass&#xE9;'+(_sk>1?'s':''):'')
        +(l.live.pains&&l.live.pains.length?' &middot; &#x1FA79; '+painZonesTxt(l.live.pains)
          :(l.live.painAny==null&&l.live.pain!==null&&l.live.pain!==undefined?' &middot; poignet '+l.live.pain+'/5':''))+'</div>';
      var _detail=liveLogDetailHtml(l);
      if(_detail){
        detailBlock='<button class="dld-toggle" onclick="toggleLiveDetail(\''+l.id+'\')">D&#xE9;tail de la s&#xE9;ance <span id="dlda-'+l.id+'">&#x25B8;</span></button>'
          +'<div class="dld-body" id="dld-'+l.id+'" style="display:none">'+_detail+'</div>';
      }
    }
    var canResume=!!l.live&&l.date===todayStr();
    var hasLive=!!(l.live&&(l.live.exos||[]).length);
    html+='<div class="hc-log'+(_tc?' dm-t-'+_tc:'')+'">'
      +'<div class="hc-chips">'+chips+'</div>'
      +'<div class="hc-hero">'
      +(note!==null
        ?'<div class="hc-pts"><span class="hc-pts-v '+note20Cls(note)+'">'+note+'<small style="font-size:.42em;font-weight:800;color:var(--mut);"> /20</small></span>'
          +'<span class="hc-pts-l">'+(note>=18?'&#x1F3C6; s&#xE9;ance en or':note>=14?'&#x1F4AA; grosse s&#xE9;ance':note>=11?'&#x2705; s&#xE9;ance solide':note>=8?'&#x1F615; s&#xE9;ance en retrait':'&#x1F6A8; s&#xE9;ance rat&#xE9;e')+'</span></div>'
        :'<div class="hc-pts"><span class="hc-pts-v" style="font-size:1.1rem;color:var(--mut);">s&#xE9;ance manuelle</span><span class="hc-pts-l">pas de d&#xE9;tail s&#xE9;rie par s&#xE9;rie</span></div>')
      +(FEATURE_RANK?'<div class="hc-note"><span class="hc-note-v">'+(ptsRP>0?'+':'')+ptsRP+'</span><span class="hc-note-l">RP'+(ptsManual?' &#xB7; forfait':'')+'</span></div>':'')
      +'</div>'
      +'<div class="hc-meta">'+meta.join('&#x2002;&#xB7;&#x2002;')+'</div>'
      +(l.comment?'<div class="dm-comment">&#xAB;&#x202F;'+l.comment+'&#x202F;&#xBB;</div>':'')
      +liveLine
      +detailBlock
      +'<div class="dm-actrow">'
      +(canResume?'<button class="dm-resume" onclick="asResumeLog(\''+l.id+'\')">&#x25B6; Reprendre</button>':'')
      +(hasLive?'<button class="dm-report" onclick="asViewReport(\''+l.id+'\')">&#x1F4CA; Bilan</button>':'')
      +'<button class="dle-edit">&#x270E; Modifier</button>'
      +'<button class="dle-del" title="Supprimer">&#x1F5D1;</button>'
      +'</div>'
      +'</div>';
  });
  // Jour gelé : bannière + dégel (même sans séance)
  var frozenBanner='';
  if(frozen){
    var _p=((DB.rank&&DB.rank.pauses)||[]).find(function(p){return p.start<=date&&date<=p.end;});
    frozenBanner='<div class="dm-frozen">&#x2744; Jour gel&#xE9;'+(_p?(_p.type==='blessure'?' &#xB7; &#x1FA79; blessure':' &#xB7; &#x1F3D6; vacances'):'')+' &#x2014; rank prot&#xE9;g&#xE9;, z&#xE9;ro malus'
      +'<button class="dm-unfreeze" onclick="delRankPauseByDate(\''+date+'\')">D&#xE9;geler</button></div>';
  }
  if(!logs.length&&!frozen){
    html='<div class="dm-empty">Rien ce jour-l&#xE0;.</div>';
  }
  // Étirements du jour (espace Détente) — carte compacte sous les séances
  if(dzDayDone(date)){
    var _dz=DB.dz[date], _zl=[];
    if(_dz.stretch) _zl.push('<strong>&#xC9;tirements de s&#xE9;ance</strong>'+(_dz.stCt?' <span class="dm-zen-sub">plan sur '+_dz.stCt+' exercices</span>':''));
    if(_dz.am) _zl.push('&#x2600;&#xFE0F; <strong>Routine du matin</strong>');
    if(_dz.pm) _zl.push('&#x1F319; <strong>Routine du soir</strong>');
    html+='<div class="dm-zen">&#x1F9D8; '+_zl.join(' &#xB7; ')+'</div>';
  }
  document.getElementById('dayModalContent').innerHTML=frozenBanner+html;
  document.querySelectorAll('#dayModalContent .dle-del').forEach(function(btn,i){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      deleteLog(logs[i].id);
    });
  });
  document.querySelectorAll('#dayModalContent .dle-edit').forEach(function(btn,i){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      closeDayModal();
      edOpen(logs[i].id);
    });
  });
  document.getElementById('dayModal').classList.add('open');
}
function closeDayModal(){ document.getElementById('dayModal').classList.remove('open'); }

function renderHisto(){
  renderCal();
  renderNoTrainingBanner();
  var el=document.getElementById('logSummary');
  if(!el) return;
  var now=getNow();
  var mstart=new Date(now.getFullYear(),now.getMonth(),1);
  var thisMonth=DB.logs.filter(function(l){return new Date(l.date)>=mstart;}).length;
  var total=DB.logs.length;
  if(!total){
    el.innerHTML='<div class="empty-state"><div class="empty-state-ico">&#x1F4C5;</div><div class="empty-state-title">Aucune séance encore</div><div class="empty-state-sub">Enregistre ta première séance pour commencer !</div><button class="empty-state-btn" onclick="edOpen(null)">+ Enregistrer une séance</button></div>';
    return;
  }
  var months=['jan','fév','mars','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  el.innerHTML='<div class="log-summary-grid">'
    +'<div class="ls-card accent"><div class="ls-val">'+thisMonth+'</div><div class="ls-lbl">ce mois ('+months[now.getMonth()]+')</div></div>'
    +'<div class="ls-card"><div class="ls-val">'+total+'</div><div class="ls-lbl">séances au total</div></div>'
    +'</div>';
}

// ══════════════════════════════════════════════════
// CHARTS & STATS
// ══════════════════════════════════════════════════
var _allChartOptions=[];
function buildChartSelect(){
  var all=[];
  DATA.forEach(function(s){ s.exos.forEach(function(e){ if(!e.hidden&&!all.find(function(x){return x.key===e.key;})) all.push({key:e.key,name:e.name}); }); });
  EXTRAS.forEach(function(e){ if(!all.find(function(x){return x.key===e.key;})) all.push({key:e.key,name:e.name}); });
  all.sort(function(a,b){
    var aArr=DB.weights[a.key]||[]; var bArr=DB.weights[b.key]||[];
    var aD=aArr.length?aArr[aArr.length-1].date:''; var bD=bArr.length?bArr[bArr.length-1].date:'';
    return bD.localeCompare(aD);
  });
  _allChartOptions=all;
  _renderChartOptions('');
}

function _renderChartOptions(filter){
  var sel=document.getElementById('chartSelect'); sel.innerHTML='';
  var q=filter.toLowerCase().trim();
  var list=q?_allChartOptions.filter(function(e){return e.name.toLowerCase().indexOf(q)>=0;}):_allChartOptions;
  list.forEach(function(e){var opt=document.createElement('option');opt.value=e.key;opt.textContent=e.name;sel.appendChild(opt);});
  renderWeightChart();
}

function filterChartSelect(val){ _renderChartOptions(val); }

function getExoName(key){
  var found=null;
  DATA.forEach(function(s){s.exos.forEach(function(e){if(e.key===key) found=e.name;});});
  if(!found) EXTRAS.forEach(function(e){if(e.key===key) found=e.name;});
  return found||key;
}

function renderWeightChart(){
  if(typeof Chart==='undefined') return;
  var key=document.getElementById('chartSelect').value;
  var arr=DB.weights[key]||[];
  var wrap=document.getElementById('weightChart').parentElement;
  var empty=document.getElementById('weightChartEmpty');
  var alertEl=document.getElementById('weightAlert');
  var statsEl=document.getElementById('weightStats');
  if(!arr.length){
    if(wrap) wrap.style.display='none';
    if(empty) empty.style.display='block';
    if(alertEl) alertEl.innerHTML='';
    if(statsEl) statsEl.style.display='none';
    var sc0=document.getElementById('exoStatsCard'); if(sc0) sc0.innerHTML='';
    return;
  }
  if(wrap) wrap.style.display='block';
  if(empty) empty.style.display='none';
  // Build stats row
  if(statsEl){
    var first=arr[0].val;
    var cur=arr[arr.length-1].val;
    var gain=Math.round((cur-first)*10)/10;
    var gainStr=(gain>0?'+':'')+gain+' kg';
    var gainColor=gain>0?'var(--acc)':gain<0?'var(--red)':'var(--mut)';
    var oneMonthAgo=new Date(); oneMonthAgo.setMonth(oneMonthAgo.getMonth()-1);
    var monthEntry=null; var minDiff=Infinity;
    arr.forEach(function(x){var diff=Math.abs(new Date(x.date)-oneMonthAgo);if(diff<minDiff){minDiff=diff;monthEntry=x;}});
    var monthDiff=monthEntry&&monthEntry.date!==arr[arr.length-1].date?Math.round((cur-monthEntry.val)*10)/10:null;
    var monthStr=monthDiff!==null?(monthDiff>0?'+':'')+monthDiff+' kg':'—';
    var monthColor=monthDiff!==null?(monthDiff>0?'var(--acc)':monthDiff<0?'var(--red)':'var(--mut)'):'var(--mut)';
    statsEl.style.display='grid';
    statsEl.innerHTML='<div class="wsr-card"><div class="wsr-val">'+cur+' <span class="wsr-unit">kg</span></div><div class="wsr-lbl">actuel</div></div>'
      +'<div class="wsr-card"><div class="wsr-val" style="color:'+monthColor+'">'+monthStr+'</div><div class="wsr-lbl">ce mois</div></div>'
      +'<div class="wsr-card"><div class="wsr-val" style="color:'+gainColor+'">'+gainStr+'</div><div class="wsr-lbl">total</div></div>'
      +'<div class="wsr-card"><div class="wsr-val">'+arr.length+'</div><div class="wsr-lbl">mesure'+(arr.length>1?'s':'')+'</div></div>';
  }
  var labels=arr.map(function(x){return formatDateShort(x.date);});
  var vals=arr.map(function(x){return x.val;});
  _weightChartArr = arr;
  var ctx=document.getElementById('weightChart').getContext('2d');
  if(weightChart){
    weightChart.data.labels = labels;
    weightChart.data.datasets[0].data = vals;
    weightChart.update('none');
  } else {
    weightChart=new Chart(ctx,{
      type:'line',
      data:{labels:labels,datasets:[{label:'Poids (kg)',data:vals,borderColor:'#71FFB4',backgroundColor:'rgba(113,255,180,0.14)',borderWidth:2,pointBackgroundColor:'#0B0D12',pointBorderColor:'#71FFB4',pointBorderWidth:2,pointRadius:4,tension:.35,fill:true}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{title:function(items){return formatDateFr(_weightChartArr[items[0].dataIndex].date);},label:function(c){return c.parsed.y+' kg';},afterLabel:function(c){var a=_weightChartArr;var i=c.dataIndex;if(!i)return'';var delta=Math.round((c.parsed.y-a[i-1].val)*10)/10;var days=Math.round((new Date(a[i].date)-new Date(a[i-1].date))/86400000);var t=days>=14?Math.round(days/7)+' sem.':days+'j';return(delta>=0?'+':'')+delta+' kg en '+t;}}}},scales:{x:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.06)'}}}}
    });
  }
  // Weight entry history list
  var histEl=document.getElementById('weightHistory');
  if(histEl){
    var sorted=arr.slice().reverse();
    var listHtml='<div class="wh-toggle" id="whToggle" onclick="toggleWeightHistory()">'
      +'<span class="wh-toggle-arr">&#x25B8;</span> Historique ('+arr.length+' entr\u00e9e'+(arr.length>1?'s':'')+')'
      +'</div>'
      +'<div class="expand-anim" id="whListWrap">'
      +'<div class="wh-list" id="whList">';
    sorted.forEach(function(entry){
      listHtml+='<div class="wh-entry">'
        +'<span class="wh-entry-date">'+formatDateFr(entry.date)+'</span>'
        +'<span class="wh-entry-val"><input class="wh-entry-input" type="number" step="0.5" min="0" value="'+entry.val+'" onblur="editWeightEntry(\''+key+'\',\''+entry.date+'\',this)" onkeydown="if(event.key===\'Enter\')this.blur()"/> kg</span>'
        +'<button class="wh-entry-del" onclick="deleteWeightEntry(\''+key+'\',\''+entry.date+'\')" title="Supprimer cette entrée">&#x2715;</button>'
        +'</div>';
    });
    listHtml+='</div><div class="wh-edit-hint">&#x270F;&#xFE0F; Touche une valeur pour corriger (ex. ton vrai poids de départ)</div></div>';
    histEl.innerHTML=listHtml;
  }
  // Alerte basée sur le nombre de séances au même poids
  if(alertEl){
    var nu=getProgressNudge(key);
    if(nu){
      alertEl.innerHTML='<div class="weight-inline-alert"><div class="wia-ico">'+(nu.lvl==='hot'?'&#x1F534;':'&#x26A0;')+'</div><div>'
        +'<strong>'+getExoName(key)+'</strong> — '+nu.msg+'</div></div>';
    } else { alertEl.innerHTML=''; }
  }
}

function toggleWeightHistory(){
  var wrap=document.getElementById('whListWrap');
  var toggle=document.getElementById('whToggle');
  if(!wrap) return;
  var open=!wrap.classList.contains('open');
  wrap.classList.toggle('open',open);
  if(toggle) toggle.classList.toggle('open',open);
}

function editWeightEntry(key, date, input){
  var arr=DB.weights[key]||[];
  var entry=arr.find(function(x){return x.date===date;});
  if(!entry) return;
  var nw=parseFloat(input.value);
  if(isNaN(nw)||nw<0){ input.value=entry.val; return; }
  nw=Math.round(nw*2)/2;
  if(nw===entry.val){ input.value=nw; return; }
  entry.val=nw;
  DB.weights[key]=arr;
  saveDB();
  // Rafraîchit le panneau exo si visible
  var newCur=arr[arr.length-1].val;
  var wval=document.getElementById('wval-'+key);
  if(wval){ if(wval.tagName==='INPUT') wval.value=newCur; else wval.textContent=newCur; }
  var chip=document.getElementById('chip-w-'+key);
  if(chip){ var ex=findExoIndex(key); if(ex) chip.innerHTML='&#x2696;&#xFE0F; '+newCur+' '+ex.exo.unite; }
  renderWeightChart();
  try{ renderProgressionTable(); renderObjectifs(); }catch(e){}
  showToast('&#x2705; '+formatDateFr(date)+' corrigé : '+nw+' kg');
}

function deleteWeightEntry(key, date){
  var arr=DB.weights[key]||[];
  if(arr.length<=1){showToast('&#x26A0; Impossible de supprimer la seule entrée');return;}
  DB.weights[key]=arr.filter(function(x){return x.date!==date;});
  var remaining=DB.weights[key];
  DB.weightSetDate[key]=remaining.length?remaining[remaining.length-1].date:'';
  // Mark deleted BEFORE saveDB so syncFromSupabase won't restore it on next refresh
  if(!DB.deletedWeights) DB.deletedWeights={};
  if(!DB.deletedWeights[key]) DB.deletedWeights[key]=[];
  if(DB.deletedWeights[key].indexOf(date)<0) DB.deletedWeights[key].push(date);
  saveDB();
  // Also delete the row from Supabase, then clear the marker once confirmed
  if(typeof sbClient!=='undefined'&&sbClient){
    sbClient.auth.getUser().then(function(res){
      var userId=res.data&&res.data.user&&res.data.user.id;
      if(!userId) return;
      sbClient.from('weight_history').delete()
        .eq('user_id',userId).eq('exercise_id',key).eq('recorded_at',date)
        .then(function(){
          if(DB.deletedWeights&&DB.deletedWeights[key]){
            DB.deletedWeights[key]=DB.deletedWeights[key].filter(function(d){return d!==date;});
            saveDB();
          }
        })
        .catch(function(e){console.warn('[MASSUP] weight delete:',e.message);});
    });
  }
  // Update weight-val input in the exercise panel if visible
  var newCur=remaining.length?remaining[remaining.length-1].val:0;
  var wval=document.getElementById('wval-'+key);
  if(wval){ if(wval.tagName==='INPUT') wval.value=newCur; else wval.textContent=newCur; }
  var xval=document.getElementById('xwval-'+key);
  if(xval){ if(xval.tagName==='INPUT') xval.value=newCur; else xval.textContent=newCur; }
  renderWeightChart();
  showToast('Entrée du '+formatDateFr(date)+' supprimée');
}

function renderFreqChart(){
  var barsEl=document.getElementById('freqMiniBars');
  if(!barsEl) return;
  barsEl.innerHTML='';
  var now=getNow();
  var dayNames=['L','M','M','J','V','S','D'];
  for(var w=7;w>=0;w--){
    var wstart=new Date(now);
    var dayOfWeek=wstart.getDay();
    var mondayOff=dayOfWeek===0?6:dayOfWeek-1;
    wstart.setDate(wstart.getDate()-mondayOff-w*7);
    wstart.setHours(0,0,0,0);
    var wend=new Date(wstart); wend.setDate(wend.getDate()+6); wend.setHours(23,59,59,999);
    var count=weekValue(DB.logs.filter(function(l){ var d=new Date(l.date); return d>=wstart&&d<=wend; }));
    var goal=getWeekGoal();
    var cls=count>=goal+1?'freq-bar gold':count>=goal?'freq-bar valid':count>=goal-1?'freq-bar mid':'freq-bar low';
    var lbl=w===0?'★':('S-'+w);
    var bar=document.createElement('div');
    bar.className=cls;
    bar.innerHTML='<span class="freq-bar-num">'+(count?fmtSeances(count):'·')+'</span><span class="freq-bar-lbl">'+lbl+'</span>';
    bar.title=(w===0?'Cette semaine':'Il y a '+w+' sem.')+' · '+fmtSeances(count)+' séance'+(count>1?'s':'');
    barsEl.appendChild(bar);
  }
  var streakEl=document.getElementById('weekStreakInfo');
  if(streakEl){
    var streak=getWeekStreak();
    var wg=getWeekGoal();
    if(streak>=2) streakEl.innerHTML='&#x1F525; <strong style="color:var(--acc)">'+streak+' semaines</strong> consécutives à '+wg+'+ séances !';
    else if(streak===1) streakEl.innerHTML='&#x1F4AA; 1 semaine à '+wg+'+ séances — continue le streak !';
    else streakEl.innerHTML=''; // pas de phrase objectif (retour Adrien 02/08)
  }
}

// (Courbe RP supprimée le 14/08 — demande Adrien : « elle ne sert à rien »)

// ── Volume par muscle : séries dures sur une fenêtre [start..end] (02/08) ──
// Live = vraies séries des exos comptés ; logs manuels = estimation (séries prévues des principaux).
function muscleVolume(startDate,endDate){
  var vol={};
  RADAR_GROUPS.forEach(function(g){ vol[g.label]=0; });
  (DB.logs||[]).forEach(function(l){
    if(!l.date||l.date<startDate||l.date>endDate) return;
    if(l.live&&l.live.exos){
      l.live.exos.forEach(function(x){
        if(!liveExoCounted(x)&&!(liveExoSide(x)&&(x.sets||[]).length>0)) return;
        volAddSets(vol,x.key,(x.sets||[]).length);
      });
      return;
    }
    (l.sessions||[]).forEach(function(sid){
      if(sid.indexOf('exo:')===0){
        var k=sid.slice(4), info=findExoIndex(k);
        if(!info) return;
        volAddSets(vol,k,asParseSerie(info.exo).n);
      } else {
        var s=DATA.find(function(x){return x.id===sid;});
        if(!s||s.t==='bonus') return;
        s.exos.forEach(function(e){
          if(e.hidden||e.bonus) return;
          volAddSets(vol,e.key,asParseSerie(e).n);
        });
      }
    });
  });
  return vol;
}
// Barres HTML réutilisables (Progression + simulation du setup LiveUp + bilan hebdo).
// extra = séries PROJETÉES (sélection en cours) affichées en segment translucide.
// Seuils (validés Adrien 02/08 soir) : <12 gris · 12-16 bleu · 17-25 gold · >25 orange (trop).
function muscleVolumeBarsHtml(vol,extra,compact,extraCls){
  var h='';
  var SCALE=25; // la barre va jusqu'à 25 (au-delà = volume poubelle)
  RADAR_GROUPS.forEach(function(g){
    var v=vol[g.label]||0, x=(extra&&extra[g.label])||0;
    var tot=v+x;
    var pW=Math.min(100,v/SCALE*100), xW=Math.min(100-pW,x/SCALE*100);
    var cls=tot>25?'over':tot>=17?'gold':tot>=12?'ok':'low';
    // les demi-séries du crédit « assistant » s'affichent arrondies (11,5 → 12)
    var vd=Math.round(v), xd=Math.round(x);
    h+='<div class="mv-row'+(compact?' compact':'')+'">'
      +'<span class="mv-name">'+g.label+'</span>'
      +'<div class="mv-bar"><div class="mv-fill '+cls+'" style="width:'+pW+'%"></div>'
      +(xW>0?'<div class="mv-fill '+(extraCls||'ghost')+'" style="width:'+xW+'%"></div>':'')
      +'<span class="mv-t10"></span><span class="mv-t20"></span></div>'
      +'<span class="mv-val '+cls+'">'+vd+(x?'<em>+'+xd+'</em>':'')+'</span>'
      +'</div>';
  });
  return h;
}
// Volume de TOUTE la séance en cours (16/08, demande Adrien — remplace « séries faites
// uniquement » du 15/08) : un exo encore prévu pèse ses séries PROGRAMMÉES (les faites si
// dépassées), un exo passé/écourté ne pèse que ses séries faites, un exo annulé = rien.
function asLivePlannedVol(){
  var v={};
  if(typeof AS==='undefined'||!AS||!AS.exos) return v;
  AS.exos.forEach(function(x){
    var done=(x.sets||[]).length;
    var n=x.status==='skipped'?done:Math.max(done,x.n||0);
    if(!n) return;
    volAddSets(v,x.key,n);
  });
  return v;
}
// Section Progression « Hypertrophie hebdo » : navigable semaine par semaine (‹ ›, 02/08 soir)
var _mvOff=0;
var _mvRange='week';
function mvNav(d){
  _mvOff=Math.min(0,_mvOff+d);
  renderMuscleVolume();
}
function mvSetRange(range){
  _mvRange=range==='month'?'month':'week';
  renderMuscleVolume();
}
function muscleVolumeMonthBarsHtml(vol){
  var max=1;
  RADAR_GROUPS.forEach(function(g){ max=Math.max(max,vol[g.label]||0); });
  var h='';
  RADAR_GROUPS.forEach(function(g){
    var value=vol[g.label]||0;
    var valueLabel=Number.isInteger(value)?String(value):value.toFixed(1).replace('.',',');
    h+='<div class="mv-row mv-month">'
      +'<span class="mv-name">'+g.label+'</span>'
      +'<div class="mv-bar"><div class="mv-fill" style="width:'+Math.round(value/max*100)+'%"></div></div>'
      +'<span class="mv-val">'+valueLabel+'</span>'
      +'</div>';
  });
  return h;
}
function renderMuscleVolume(){
  var el=document.getElementById('muscleVolume'); if(!el) return;
  var today=todayStr(), monday=rankAddDays(rankMonday(today),_mvOff*7);
  var isMonth=_mvRange==='month';
  var start=isMonth?rankAddDays(today,-29):monday;
  var end=isMonth?today:(_mvOff===0?today:rankAddDays(monday,6));
  var vol=muscleVolume(start,end);
  // La séance EN COURS s'affiche en holo en vue semaine, sans gonfler les totaux enregistrés sur 30 jours.
  var live=null;
  if(!isMonth&&_mvOff===0){
    try{ if(typeof AS!=='undefined'&&AS&&AS.exos&&!AS.savedLogId){ var lv=asLivePlannedVol(); if(Object.keys(lv).length) live=lv; } }catch(e){}
  }
  var lbl=isMonth?'30 derniers jours':(_mvOff===0?'Cette semaine':'Sem. du '+formatDateShort(monday));
  var fwd=document.getElementById('mvNavFwd');
  if(fwd){ if(isMonth||_mvOff>=0) fwd.setAttribute('disabled',''); else fwd.removeAttribute('disabled'); }
  var nav=document.getElementById('mvNav');
  if(nav) nav.style.display=isMonth?'none':'flex';
  var weekBtn=document.getElementById('mvRangeWeek');
  var monthBtn=document.getElementById('mvRangeMonth');
  if(weekBtn) weekBtn.classList.toggle('active',!isMonth);
  if(monthBtn) monthBtn.classList.toggle('active',isMonth);
  var head='<div class="mv-head"><span>'+lbl;
  if(isMonth){
    head+='<span class="mv-hint">S&#xE9;ries comptabilis&#xE9;es &#xB7; du '+formatDateShort(start)+' au '+formatDateShort(end)+'</span></span></div>'
      +muscleVolumeMonthBarsHtml(vol)
      +'<div class="mv-month-note">Comparaison des groupes musculaires travaill&#xE9;s sur la p&#xE9;riode : un volume diff&#xE9;rent ne signifie pas &#xE0; lui seul un d&#xE9;s&#xE9;quilibre physique.</div>';
  }else{
    head+='<span class="mv-hint">12+ s&#xE9;ries = &#xE7;a construit &#xB7; 17-25 = gold &#xB7; &gt;25 = rendements d&#xE9;croissants (ok SI tout progresse)</span></span></div>'
      +muscleVolumeBarsHtml(vol,live,false,'holo');
  }
  el.innerHTML=head;
}

// ── Compteurs animés des bilans : tout élément [data-cu] « monte » vers sa valeur ──
function animCountUp(el,dur){
  var target=parseFloat(el.getAttribute('data-cu'));
  if(isNaN(target)) return;
  var dec=parseInt(el.getAttribute('data-cu-dec')||'0',10);
  var suf=el.getAttribute('data-cu-suf')||'';
  var pre=el.getAttribute('data-cu-pre')||'';
  var t0=performance.now(); dur=dur||900;
  function step(t){
    var p=Math.min(1,(t-t0)/dur);
    p=1-Math.pow(1-p,3);
    var v=target*p;
    el.textContent=pre+(dec?v.toFixed(dec).replace('.',','):Math.round(v).toLocaleString('fr-FR'))+suf;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function animCountUpAll(root){
  try{
    var els=(root||document).querySelectorAll('[data-cu]');
    Array.prototype.forEach.call(els,function(el){ animCountUp(el); });
  }catch(e){}
}



// ══════════════════════════════════════════════════
// VIEW SWITCHING
// ══════════════════════════════════════════════════
var _scrollPos={};
var _currentView='sante';
var VIEW_ORDER=['sante','seances','progression','accueil']; // 'nutrition' mise de côté (juil. 2026)
function switchView(name, btn){
  var cur=document.querySelector('.view.active');
  if(cur) _scrollPos[cur.id]=window.scrollY;
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});
  document.querySelectorAll('.bni').forEach(function(b){b.classList.remove('active');});
  var newView=document.getElementById('view-'+name);
  newView.classList.add('active');
  btn.classList.add('active');
  if(_currentView!==name){
    var prevIdx=VIEW_ORDER.indexOf(_currentView);
    var nextIdx=VIEW_ORDER.indexOf(name);
    var slideClass=nextIdx>prevIdx?'slide-right':'slide-left';
    newView.classList.add(slideClass);
    newView.addEventListener('animationend',function handler(){newView.classList.remove(slideClass);newView.removeEventListener('animationend',handler);});
  }
  _currentView=name;
  window.scrollTo(0, _scrollPos['view-'+name]||0);
  updateHeaderCtx(name);
  if(name==='accueil'){ renderDashboard(); }
  if(name==='nutrition'){ renderNutrition(); }
  if(name==='seances'){ renderGymGreet(); }
  if(name==='progression'){
    renderHisto();
    try{ renderFreqChart(); }catch(e){ console.warn('[MASSUP] renderFreqChart error:',e); }
    try{ renderMuscleVolume(); }catch(e){ console.warn('[MASSUP] renderMuscleVolume error:',e); }
    buildChartSelect();
    renderProgressionTable();
    try{ renderObjectifs(); }catch(e){ console.warn('[MASSUP] renderObjectifs:',e); }
    ensureChartJs(function(){
      try{ renderWeightChart(); }catch(e){ console.warn('[MASSUP] renderWeightChart error:',e); }
      try{ renderLevelRadar(); }catch(e){ console.warn('[MASSUP] renderLevelRadar error:',e); }
    });
  }
  if(name==='sante'){
    renderSante();
    updateHeaderCtx('sante');
    if(typeof Chart==='undefined'){
      ensureChartJs(function(){ try{renderSanteChart();}catch(e){} });
    }
  }
}

// ══════════════════════════════════════════════════
// SANTÉ — DONNÉES & FONCTIONS
// ══════════════════════════════════════════════════

var HEALTH_SEED = [
  {date:'2026-03-11',poids:62.85,imc:21.5,graisseCorp_kg:7.42,graisseCorp_pct:11.8,muscleSqlt_kg:35.76,muscleSqlt_pct:56.9,poidsSansMG:55.40,grasSousCutane_pct:10.4,grasVisceral:4,eauTotale_kg:39.97,eauTotale_pct:63.6,masseMusc_kg:52.70,masseMusc_pct:83.9,masseOss_kg:2.77,masseOss_pct:4.4,proteines_kg:12.70,proteines_pct:20.2,metabolisme:1567,ageMeta:18},
  {date:'2026-03-22',poids:64.60,imc:22.1,graisseCorp_kg:8.20,graisseCorp_pct:12.7,muscleSqlt_kg:36.43,muscleSqlt_pct:56.4,poidsSansMG:56.40,grasSousCutane_pct:11.2,grasVisceral:5,eauTotale_kg:40.70,eauTotale_pct:63.0,masseMusc_kg:53.50,masseMusc_pct:82.8,masseOss_kg:2.82,masseOss_pct:4.4,proteines_kg:12.79,proteines_pct:19.8,metabolisme:1586,ageMeta:18},
  {date:'2026-04-01',poids:65.70,imc:22.5,graisseCorp_kg:8.74,graisseCorp_pct:13.3,muscleSqlt_kg:36.73,muscleSqlt_pct:55.9,poidsSansMG:56.90,grasSousCutane_pct:11.7,grasVisceral:5,eauTotale_kg:41.06,eauTotale_pct:62.5,masseMusc_kg:54.10,masseMusc_pct:82.3,masseOss_kg:2.85,masseOss_pct:4.3,proteines_kg:12.94,proteines_pct:19.7,metabolisme:1598,ageMeta:18},
  {date:'2026-04-14',poids:66.60,imc:22.8,graisseCorp_kg:9.19,graisseCorp_pct:13.8,muscleSqlt_kg:37.10,muscleSqlt_pct:55.7,poidsSansMG:57.40,grasSousCutane_pct:12.0,grasVisceral:5,eauTotale_kg:41.43,eauTotale_pct:62.2,masseMusc_kg:54.50,masseMusc_pct:81.8,masseOss_kg:2.87,masseOss_pct:4.3,proteines_kg:13.12,proteines_pct:19.7,metabolisme:1610,ageMeta:18}
];

// Les métriques RENPHO (IMC, masse grasse, muscle...) ont été retirées du Bilan :
// données de balance à impédance trop peu fiables. Seul le POIDS fait référence.
// DB.healthLogs est conservé en base (legacy) mais n'est plus affiché ni saisi.
var santeChart = null;

function initHealthLogs(){
  if(!DB.healthLogs) DB.healthLogs=[];
  var needsSave=false;
  HEALTH_SEED.forEach(function(entry){
    if((DB.deletedBW||[]).indexOf(entry.date)>=0) return; // supprimée par Adrien — ne pas ressusciter (12/08)
    if(!DB.healthLogs.find(function(h){return h.date===entry.date;})){
      DB.healthLogs.push(entry);
      needsSave=true;
    }
    // Mirror poids to bodyWeight if not already there
    if(!DB.bodyWeight.find(function(b){return b.date===entry.date;})){
      DB.bodyWeight.push({date:entry.date,weight_kg:entry.poids,note:'RENPHO'});
      needsSave=true;
    }
  });
  if(needsSave){
    DB.healthLogs.sort(function(a,b){return a.date.localeCompare(b.date);});
    DB.bodyWeight.sort(function(a,b){return a.date.localeCompare(b.date);});
    saveDB();
  }
}

var LOG_SEED = [
  {date:'2026-02-24',sessions:['autre:RITM']},
  {date:'2026-02-28',sessions:['autre:RITM']},
  {date:'2026-03-02',sessions:['autre:RITM']},
  {date:'2026-03-07',sessions:['autre:RITM']},
  {date:'2026-03-09',sessions:['autre:RITM']},
  {date:'2026-03-11',sessions:['autre:Escalade'],comment:'Le Triangle'},
  {date:'2026-03-13',sessions:['autre:RITM']},
  {date:'2026-03-18',sessions:['autre:RITM']},
  {date:'2026-03-20',sessions:['autre:RITM']},
  {date:'2026-03-23',sessions:['autre:RITM']},
  {date:'2026-03-25',sessions:['autre:RITM']},
  {date:'2026-03-27',sessions:['autre:RITM']},
  {date:'2026-03-30',sessions:['autre:RITM']},
  {date:'2026-04-01',sessions:['autre:RITM']},
  {date:'2026-04-03',sessions:['autre:RITM']},
  {date:'2026-04-06',sessions:['autre:RITM']},
  {date:'2026-04-08',sessions:['autre:RITM']},
  {date:'2026-04-10',sessions:['autre:RITM']},
  {date:'2026-04-13',sessions:['autre:RITM']},
  {date:'2026-04-15',sessions:['autre:RITM']},
  {date:'2026-04-18',sessions:['autre:RITM']}
];

function initLogs(){
  var needsSave=false;
  LOG_SEED.forEach(function(entry){
    var key=entry.date+'|'+entry.sessions.join(',');
    var exists=DB.logs.find(function(l){ return (l.date===entry.date&&l.sessions.join(',')===entry.sessions.join(',')); });
    if(!exists){
      DB.logs.push({id:'seed-'+key,date:entry.date,time:'10:00',sessions:entry.sessions,comment:entry.comment||'',feeling:null,energy:null,duration_min:null});
      needsSave=true;
    }
  });
  if(needsSave){
    DB.logs.sort(function(a,b){ return b.date.localeCompare(a.date)||(b.time.localeCompare(a.time)); });
    saveDB();
  }
}

function getWeekStreak(){
  var streak=0;
  var now=getNow();
  for(var w=0;w<=52;w++){
    var wstart=new Date(now);
    var dayOfWeek=wstart.getDay();
    var mondayOffset=dayOfWeek===0?6:dayOfWeek-1;
    wstart.setDate(wstart.getDate()-mondayOffset-w*7);
    wstart.setHours(0,0,0,0);
    var wend=new Date(wstart); wend.setDate(wend.getDate()+6); wend.setHours(23,59,59,999);
    var count=weekValue(DB.logs.filter(function(l){ var d=new Date(l.date); return d>=wstart&&d<=wend; }));
    if(count>=getWeekGoal()){ streak++; }
    else break;
  }
  return streak;
}

function renderSante(){
  try{ renderWeeklyRecapWidget(); }catch(e){}
  try{ renderBilanProfile(); }catch(e){}
  try{ renderBilanWeekNut(); }catch(e){}
  try{ if(typeof STEPS!=='undefined') STEPS.renderCard(); }catch(e){ console.warn('[MASSUP] STEPS:',e); }
  try{ if(typeof SLEEP!=='undefined') SLEEP.renderCard(); }catch(e){ console.warn('[MASSUP] SLEEP:',e); }
  try{ renderBilanNotes(); }catch(e){ console.warn('[MASSUP] renderBilanNotes:',e); }
  try{ renderBilanRank(); }catch(e){ console.warn('[MASSUP] renderBilanRank:',e); }
  renderBilanHero();
  try{ renderBilanWeightStats(); }catch(e){ console.warn('[MASSUP] renderBilanWeightStats:',e); }
  renderSanteChart();
  renderSanteHisto();
  // « Nous deux » (26/08) : progression de Melati en lecture seule + petit mot, tout en bas
  try{ if(typeof PV!=='undefined'){ PV.render(); PV.pull(false); } }catch(e){ console.warn('[MASSUP] PV:',e); }
}

// Graphique d'évolution du poids de corps (seule métrique de référence du Bilan)
function renderSanteChart(){
  if(typeof Chart==='undefined') return;
  if(!document.getElementById('santeChart')) return;
  var data=DB.bodyWeight||[]; if(!data.length) return;
  // Axe X proportionnel au temps réel : chaque point positionné selon sa date (timestamp)
  var pts=data.map(function(b){return {x:new Date(b.date).getTime(),y:parseFloat(b.weight_kg)};});
  _santeChartLogs = data;
  var ctx=document.getElementById('santeChart').getContext('2d');
  if(santeChart){
    santeChart.data.datasets[0].data = pts;
    santeChart.update('none');
  } else {
    santeChart=new Chart(ctx,{
      type:'line',
      data:{datasets:[{label:'Poids (kg)',data:pts,borderColor:'#71FFB4',backgroundColor:'rgba(113,255,180,0.14)',borderWidth:2,pointBackgroundColor:'#0B0D12',pointBorderColor:'#71FFB4',pointBorderWidth:2,pointRadius:4,tension:.35,fill:true}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{title:function(items){return formatDateFr(_santeChartLogs[items[0].dataIndex].date);},label:function(c){return c.parsed.y+' kg';},afterLabel:function(c){var d=_santeChartLogs;var i=c.dataIndex;if(!i)return'';var delta=Math.round((c.parsed.y-parseFloat(d[i-1].weight_kg))*10)/10;var days=Math.round((new Date(d[i].date)-new Date(d[i-1].date))/86400000);var t=days>=14?Math.round(days/7)+' sem.':days+'j';return(delta>=0?'+':'')+delta+' kg en '+t;}}}},scales:{x:{type:'linear',bounds:'data',ticks:{color:'rgba(242,245,250,.4)',font:{size:10},maxRotation:0,autoSkip:true,maxTicksLimit:7,callback:function(v){return tsToShort(v);}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.06)'}}}}
    });
  }
}

function renderSanteHisto(){
  var el=document.getElementById('santeHisto'); if(!el) return;
  var data=(DB.bodyWeight||[]).slice().reverse();
  if(!data.length){el.innerHTML='<div style="color:var(--mut);font-size:.82rem;text-align:center;padding:1.5rem;">Aucune pesee enregistree.</div>'; return;}
  el.innerHTML=data.map(function(b,i){
    var prev=data[i+1];
    var deltaChip='';
    if(prev){
      var d=parseFloat((parseFloat(b.weight_kg)-parseFloat(prev.weight_kg)).toFixed(1));
      if(d!==0){
        // 15/08 (demande Adrien) : la bulle delta se distingue de la bulle poids — VERT FONCÉ
        var col=d>0?'#5FD695':'#FF6B7A';
        var bg=d>0?'rgba(18,74,44,.6)':'rgba(255,107,122,.1)';
        deltaChip='<span class="chip" style="background:'+bg+';color:'+col+(d>0?';border:1px solid rgba(95,214,149,.25)':'')+'">'+(d>0?'+':'')+d+' kg</span>';
      }
    }
    return '<div class="pesee-entry">'
      +'<div class="pe-left">'+(i===0?'<div class="pe-badge">Derniere</div>':'')+'<div class="pe-date">'+formatDateFr(b.date)+'</div></div>'
      +'<div class="pe-right">'
      +'<span class="chip cw">'+b.weight_kg+' kg</span>'
      +deltaChip
      +'</div>'
      +'<button class="le-del" onclick="deleteBodyWeightEntry(\''+b.date+'\')">&#x1F5D1;</button>'
      +'</div>';
  }).join('');
}

function deleteBodyWeightEntry(date){
  DB.bodyWeight=(DB.bodyWeight||[]).filter(function(b){return b.date!==date;});
  // On purge aussi l'éventuelle entrée legacy RENPHO du même jour
  DB.healthLogs=(DB.healthLogs||[]).filter(function(h){return h.date!==date;});
  // Tombstone (12/08) : sans elle, la pesée revient du cloud au prochain chargement
  if(!DB.deletedBW) DB.deletedBW=[];
  if(DB.deletedBW.indexOf(date)<0) DB.deletedBW.push(date);
  saveDB(); renderSante();
}

// ─── PESÉE MODAL (saisie manuelle, sans IA) ───
function openPeseeModal(){
  var dateEl=document.getElementById('peseeDate');
  var wEl=document.getElementById('peseeWeight');
  if(dateEl) dateEl.value=todayStr();
  var bw=DB.bodyWeight||[];
  if(wEl) wEl.value=bw.length?bw[bw.length-1].weight_kg:'';
  document.getElementById('peseeModal').classList.add('open');
  if(wEl) setTimeout(function(){ try{wEl.focus();wEl.select();}catch(e){} },80);
}
function closePeseeModal(){ document.getElementById('peseeModal').classList.remove('open'); }

function peseeAdjust(delta){
  var wEl=document.getElementById('peseeWeight'); if(!wEl) return;
  var bw=DB.bodyWeight||[];
  var v=parseFloat(wEl.value);
  if(isNaN(v)) v=bw.length?parseFloat(bw[bw.length-1].weight_kg):70;
  wEl.value=(Math.round((v+delta)*10)/10).toFixed(1);
}

function savePesee(){
  var dateEl=document.getElementById('peseeDate');
  var wEl=document.getElementById('peseeWeight');
  var date=dateEl?dateEl.value:'';
  var w=wEl?parseFloat(wEl.value):NaN;
  if(!date){showToast('Choisis une date.'); return;}
  if(!w||w<30||w>200){showToast('Poids invalide (30-200 kg).'); return;}
  w=Math.round(w*10)/10;
  if(!DB.bodyWeight) DB.bodyWeight=[];
  var idx=DB.bodyWeight.findIndex(function(b){return b.date===date;});
  if(idx>=0){DB.bodyWeight[idx].weight_kg=w;}
  else{DB.bodyWeight.push({date:date,weight_kg:w,note:''});}
  DB.bodyWeight.sort(function(a,b){return a.date.localeCompare(b.date);});
  saveDB();
  closePeseeModal();
  renderSante();
  showToast('Pesee enregistree !');
}

function toggleProgTable(){
  var sec=document.getElementById('progTableSection');
  var lbl=document.getElementById('progTableToggle');
  if(!sec) return;
  var open=!sec.classList.contains('open');
  sec.classList.toggle('open',open);
  if(lbl) lbl.classList.toggle('open',open);
}

function toggleSanteHisto(){
  var sec=document.getElementById('santeHistoSection');
  var lbl=document.getElementById('santeHistoToggle');
  if(!sec) return;
  var open=!sec.classList.contains('open');
  sec.classList.toggle('open',open);
  if(lbl) lbl.classList.toggle('open',open);
}

// ══════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════
function formatDateFr(str){
  if(!str) return '';
  var p=str.split('-'); var months=['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  return parseInt(p[2])+' '+months[parseInt(p[1])-1]+' '+p[0];
}
function formatDateShort(str){
  if(!str) return ''; var p=str.split('-'); return p[2]+'/'+p[1];
}
// Formate un timestamp (ms, UTC) en JJ/MM — pour les axes proportionnels au temps
function tsToShort(ms){
  var d=new Date(ms); var dd=d.getUTCDate(), mm=d.getUTCMonth()+1;
  return (dd<10?'0'+dd:dd)+'/'+(mm<10?'0'+mm:mm);
}

var toastTimer=null;
var _toastUndoFn=null;
function showToast(msg, undoFn){
  var t=document.getElementById('toast');
  _toastUndoFn=undoFn||null;
  if(undoFn){
    t.innerHTML=msg+'<span class="toast-undo">Annuler &#x21A9;</span>';
    t.classList.add('undoable');
    var undoSpan=t.querySelector('.toast-undo');
    if(undoSpan) undoSpan.addEventListener('click',function(e){
      e.stopPropagation();
      if(_toastUndoFn){var f=_toastUndoFn;_toastUndoFn=null;f();}
      if(toastTimer) clearTimeout(toastTimer);
      t.classList.remove('show','undoable');
    });
  } else {
    t.innerHTML=msg;
    t.classList.remove('undoable');
    _toastUndoFn=null;
  }
  t.classList.add('show');
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){t.classList.remove('show','undoable');_toastUndoFn=null;},4000);
}


// ─── 4.2 Tableau des progressions ───
function renderProgressionTable() {
  var el=document.getElementById('progTable');
  if(!el) return;
  var html='';
  DATA.forEach(function(s){
    html+='<div class="progtbl-section">'
      +'<div class="progtbl-seance-hdr">'+s.icon+' '+s.name+'</div>';
    s.exos.forEach(function(e){
      if(e.hidden) return;
      var arr=DB.weights[e.key]||[];
      if(!arr.length) return;
      var start=arr[0];
      var cur=arr[arr.length-1];
      var delta=cur.val-start.val;
      var pct=start.val>0?Math.round((delta/start.val)*100):0;
      var sign=delta>0?'+':'';
      var col=delta>0?'var(--acc)':delta<0?'var(--red)':'var(--mut)';
      var pctStr=pct!==0?(sign+pct+'%'):'=';
      html+='<div class="progtbl-row">'
        +'<div class="progtbl-name">'+e.name+'</div>'
        +'<div class="progtbl-vals">'
          +'<span class="progtbl-start">'+start.val+' '+e.unite+'</span>'
          +'<span class="progtbl-arrow">&#x2192;</span>'
          +'<span class="progtbl-cur">'+cur.val+' '+e.unite+'</span>'
        +'</div>'
        +'<div class="progtbl-delta" style="color:'+col+'">'+sign+delta+' ('+pctStr+')</div>'
        +'</div>';
    });
    html+='</div>';
  });
  el.innerHTML=html||'<div style="color:var(--mut);padding:1.25rem;text-align:center;font-size:.8rem">Enregistre tes s\u00e9ances pour voir ta progression.</div>';
}

// ══════════════════════════════════════════════════
// PHASE 4 — NOUVELLES FONCTIONS
// ══════════════════════════════════════════════════

// ─── 4.3 Log amélioré ───
var ENERGY_LABELS = ['', 'A plat', 'Moyen', 'Correct', 'Bien', 'En feu !!'];
var FEELING_LABELS = ['', 'Tr\u00e8s dur', 'Difficile', 'Correcte', 'Bonne', 'Parfaite !'];

function setRating(field, val) {
  if(field==='energy'){ logEnergy=val; }
  else { logFeeling=val; }
  var rowId = field==='energy'?'energyRating':'feelingRating';
  var lblId = field==='energy'?'energyLbl':'feelingLbl';
  var labels = field==='energy'?ENERGY_LABELS:FEELING_LABELS;
  var row=document.getElementById(rowId);
  if(!row) return;
  row.querySelectorAll('.rating-btn').forEach(function(btn){
    btn.classList.toggle('active', parseInt(btn.dataset.val)<=val);
  });
  var lbl=document.getElementById(lblId);
  if(lbl) lbl.textContent=labels[val]||'';
}



// ─── 4.4 Rappel séance ───
function getDaysSinceLastSession() {
  if(!DB.logs.length) return null;
  var sorted=DB.logs.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var last=new Date(sorted[0].date);
  var now=getNow(); now.setHours(0,0,0,0); last.setHours(0,0,0,0);
  return Math.floor((now-last)/86400000);
}

function renderNoTrainingBanner() {
  var el=document.getElementById('noTrainingBanner');
  if(!el) return; // bannière retirée du DOM (alertes désactivées 31/07/2026)
  var days=getDaysSinceLastSession();
  if(days===null||days<=2){ el.style.display='none'; return; }
  el.style.display='block';
  var msg;
  if(days===3) msg='Ca fait 3 jours. Une petite s\u00e9ance ce soir ?';
  else if(days<=5) msg='Ca fait '+days+' jours sans s\u00e9ance. Ton corps attend !';
  else msg='Ca fait '+days+' jours ! Le muscle ne pousse pas sans stimulus. Allez !!';
  el.innerHTML='&#x1F552; '+msg;
}

// ─── 4.1 Poids corporel — stats dérivées (Δ7j / Δ30j / rythme / repère bulk) ───
var BULK_TARGET_KG = 76; // repère (pas une cible stricte) : bulk jusqu'au 1er janvier

function renderBilanWeightStats() {
  var el=document.getElementById('bwStatsRow');
  if(!el) return;
  // 15/08 : fusionné dans la carte profil (Δ30j · rythme · total) — Δ7j et repère 76 kg sortis
  // à la demande d'Adrien. Code conservé.
  el.innerHTML=''; return;
  var data=DB.bodyWeight||[];
  if(!data.length){ el.innerHTML=''; return; }
  var last=data[data.length-1];
  var current=parseFloat(last.weight_kg);
  var now=new Date(todayStr());
  var weekAgo=new Date(now.getTime()-7*86400000);
  var monthAgo=new Date(now.getTime()-30*86400000);
  var entryWeekAgo=null, entryMonthAgo=null;
  for(var i=data.length-1;i>=0;i--){
    var ed=new Date(data[i].date);
    if(entryWeekAgo===null&&ed<=weekAgo) entryWeekAgo=parseFloat(data[i].weight_kg);
    if(entryMonthAgo===null&&ed<=monthAgo) entryMonthAgo=parseFloat(data[i].weight_kg);
  }
  function deltaHtml(ref) {
    if(ref===null) return '<span style="color:var(--mut)">--</span>';
    var diff=(current-ref);
    var sign=diff>0?'+':'';
    var col=diff>0?'var(--acc)':diff<0?'var(--red)':'var(--mut)';
    return '<span style="color:'+col+'">'+sign+diff.toFixed(1)+' kg</span>';
  }
  // Rythme kg/sem sur les ~30 derniers jours (sinon depuis le début)
  var refW=entryMonthAgo, refDate=null;
  for(var j=data.length-1;j>=0;j--){ if(new Date(data[j].date)<=monthAgo){refDate=data[j].date;break;} }
  if(refW===null&&data.length>=2){ refW=parseFloat(data[0].weight_kg); refDate=data[0].date; }
  var rateHtml='<span style="color:var(--mut)">--</span>';
  if(refW!==null&&refDate){
    var wks=(now-new Date(refDate))/604800000;
    if(wks>=1){
      var rate=(current-refW)/wks;
      var rCol=rate>0&&rate<=0.5?'var(--acc)':rate>0.5?'var(--yellow)':'var(--mut)';
      rateHtml='<span style="color:'+rCol+'">'+(rate>=0?'+':'')+rate.toFixed(2)+'</span>';
    }
  }
  var remain=Math.max(0,Math.round((BULK_TARGET_KG-current)*10)/10);
  var remainHtml=remain>0
    ? '<span style="color:var(--acc2)">-'+remain+' kg</span>'
    : '<span style="color:var(--acc)">Atteint !</span>';
  el.innerHTML=
    '<div class="bw-stat-card"><div class="bw-stat-val">'+deltaHtml(entryWeekAgo)+'</div><div class="bw-stat-lbl">7 jours</div></div>'
    +'<div class="bw-stat-card"><div class="bw-stat-val">'+deltaHtml(entryMonthAgo)+'</div><div class="bw-stat-lbl">30 jours</div></div>'
    +'<div class="bw-stat-card"><div class="bw-stat-val">'+rateHtml+'</div><div class="bw-stat-lbl">kg / sem</div></div>'
    +'<div class="bw-stat-card"><div class="bw-stat-val">'+remainHtml+'</div><div class="bw-stat-lbl">Repère '+BULK_TARGET_KG+' kg</div></div>';
}


// ══════════════════════════════════════════════════
// FULLSCREEN CHART
// ══════════════════════════════════════════════════
var _fsChartInstance=null;
function openFullscreenChart(){
  var key=document.getElementById('chartSelect').value;
  if(!key) return;
  var overlay=document.getElementById('fsOverlay');
  var titleEl=document.getElementById('fsTitle');
  if(!overlay) return;
  if(titleEl) titleEl.textContent=getExoName(key);
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
  setTimeout(function(){renderFullscreenChart(key);},50);
}
function closeFullscreenChart(){
  var overlay=document.getElementById('fsOverlay');
  if(overlay) overlay.classList.remove('open');
  document.body.style.overflow='';
  if(_fsChartInstance){_fsChartInstance.destroy();_fsChartInstance=null;}
}
function renderFullscreenChart(key){
  if(typeof Chart==='undefined') return;
  var arr=DB.weights[key]||[];
  if(!arr.length) return;
  var labels=arr.map(function(x){return formatDateShort(x.date);});
  var vals=arr.map(function(x){return x.val;});
  var ctx=document.getElementById('fsChart').getContext('2d');
  if(_fsChartInstance) _fsChartInstance.destroy();
  _fsChartInstance=new Chart(ctx,{
    type:'line',
    data:{labels:labels,datasets:[{label:'Poids (kg)',data:vals,borderColor:'#71FFB4',backgroundColor:'rgba(113,255,180,0.14)',borderWidth:2,pointBackgroundColor:'#0B0D12',pointBorderColor:'#71FFB4',pointBorderWidth:2,pointRadius:4,tension:.35,fill:true}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{title:function(items){return formatDateFr(arr[items[0].dataIndex].date);},label:function(c){return c.parsed.y+' kg';},afterLabel:function(c){var i=c.dataIndex;if(!i)return'';var delta=Math.round((c.parsed.y-arr[i-1].val)*10)/10;var days=Math.round((new Date(arr[i].date)-new Date(arr[i-1].date))/86400000);var t=days>=14?Math.round(days/7)+' sem.':days+'j';return(delta>=0?'+':'')+delta+' kg en '+t;}}}},scales:{x:{ticks:{color:'rgba(242,245,250,.5)',font:{size:12}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(242,245,250,.5)',font:{size:12}},grid:{color:'rgba(255,255,255,.06)'}}}}
  });
}

// ══════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════
function getSessionLabel(sid){
  if(sid.indexOf('autre:')===0) return sid.replace('autre:','');
  if(sid.indexOf('exo:')===0) return getExoName(sid.replace('exo:',''));
  var s=DATA.find(function(x){return x.id===sid;}); return s?s.icon+' '+s.name:sid;
}

function renderDashboard(){
  var el=document.getElementById('dashContent'); if(!el) return;
  var now=getNow();
  var name=DB.profile&&DB.profile.name?DB.profile.name:'';
  var last=DB.logs.length?DB.logs[0]:null;
  var daysSinceLast=last?Math.floor((now-new Date(last.date))/86400000):null;
  var lastNames=last?last.sessions.map(getSessionLabel).join(' + '):'';

  var context='', headline='', sub='';
  if(!last){
    context='PRÊT À COMMENCER';
    headline=name?'Lance-toi, '+name+' !':'Lance-toi !';
    sub='Enregistre ta première séance pour commencer à suivre ta progression.';
  } else if(daysSinceLast===0){
    context='SÉANCE DU JOUR · VALIDÉE ✓';
    headline='Bien joué'+(name?', '+name:'')+' !';
    sub=lastNames+(last.duration_min?' · '+last.duration_min+' min':'');
  } else if(daysSinceLast===1){
    context='REPOS · HIER';
    headline='C\'est l\'heure de reprendre'+(name?', '+name:'')+' !';
    sub='Dernière séance : '+lastNames;
  } else if(daysSinceLast===2){
    context='REPOS · 2 JOURS';
    headline='La récupération est faite !';
    sub='Dernière séance : '+lastNames;
  } else if(daysSinceLast<=4){
    context=daysSinceLast+' JOURS SANS SÉANCE';
    headline='Le corps est reposé, la salle t\'attend.';
    sub='Dernière séance : '+lastNames;
  } else {
    context=daysSinceLast+' JOURS SANS SÉANCE';
    headline=daysSinceLast+' jours. Le muscle s\'impatiente !';
    sub='Dernière séance : '+lastNames;
  }

  var html='<div class="accueil-hero">'
    +'<div class="accueil-context">'+context+'</div>'
    +'<div class="accueil-headline">'+headline+'</div>'
    +'<div class="accueil-sub">'+sub+'</div>'
    +'<button class="accueil-cta-btn" onclick="edOpen(null)">+ Enregistrer une séance</button>'
    +'</div>';
  el.innerHTML=html;
}

// ══════════════════════════════════════════════════
// BILAN — fonctions de rendu (poids de corps = seule référence)
// ══════════════════════════════════════════════════
function renderBilanHero(){
  var el=document.getElementById('bilanHero'); if(!el) return;
  // 15/08 : fusionné dans la carte profil (renderBilanProfile v2) — code conservé
  el.innerHTML=''; return;
  var data=DB.bodyWeight||[];
  if(!data.length){
    el.innerHTML='<div class="bilan-hero" style="text-align:center;padding:2rem 1.5rem;">'
      +'<div style="font-size:.78rem;color:var(--mut);margin-bottom:1rem;">Aucune pesée enregistrée pour l\'instant.</div>'
      +'<button class="bilan-pesee-btn" style="font-size:.8rem;padding:.55rem 1rem;" onclick="openPeseeModal()">&#x2696;&#xFE0F; Ajouter ma première pesée</button>'
      +'</div>';
    return;
  }
  var last=data[data.length-1];
  var first=data[0];
  var prev=data.length>1?data[data.length-2]:null;
  var current=parseFloat(last.weight_kg);
  var totalGain=parseFloat((current-parseFloat(first.weight_kg)).toFixed(1));
  var gainSign=totalGain>0?'+':'';
  var gainCol=totalGain>0?'var(--acc)':totalGain<0?'#FF6B7A':'var(--mut)';
  var metaItems=[];
  if(prev){
    var d=parseFloat((current-parseFloat(prev.weight_kg)).toFixed(1));
    var dCol=d>0?'var(--acc)':d<0?'#FF6B7A':'var(--mut)';
    metaItems.push('<span style="color:'+dCol+';font-weight:700">'+(d>0?'+':'')+d+' kg</span> vs pesée préc.');
  }
  metaItems.push('<span style="color:'+gainCol+'" class="bilan-hero-gain">'+gainSign+totalGain+' kg depuis le début</span>');
  el.innerHTML='<div class="bilan-hero">'
    +'<div class="bilan-hero-top">'
    +'<div class="bilan-hero-label">DERNIÈRE PESÉE · '+formatDateFr(last.date)+'</div>'
    +'<button class="bilan-pesee-btn" onclick="openPeseeModal()">+ Pesée</button>'
    +'</div>'
    +'<div class="bilan-weight">'+current+' <span class="bilan-weight-unit">kg</span></div>'
    +'<div class="bilan-hero-meta">'+metaItems.join('<span class="sep">&middot;</span>')+'</div>'
    +'</div>';
}

// ══════════════════════════════════════════════════
// REPÈRES SELON LE PROFIL (force indicative + composition)
// ══════════════════════════════════════════════════
// Multiplicateurs du POIDS DE CORPS pour le poids de TRAVAIL (séries de 8-12 reps), homme.
// Indicatif : les machines varient d'une salle à l'autre — repère, pas vérité absolue.
var STRENGTH_STD = {
  chestpress_v:{beg:.42,int:.60,adv:.82},
  pecdeck:{beg:.36,int:.52,adv:.70},
  dev_incline:{beg:.14,int:.21,adv:.30,perHand:true},
  elev_lat:{beg:.05,int:.09,adv:.14,perHand:true},
  triceps_corde:{beg:.18,int:.26,adv:.36},
  tirage_vert:{beg:.52,int:.70,adv:.92},
  rowing_pb:{beg:.46,int:.62,adv:.82},
  rowing_uni:{beg:.22,int:.31,adv:.42,perHand:true},
  rowing_appui:{beg:.42,int:.58,adv:.78},
  abduct:{beg:.30,int:.45,adv:.62},
  adduct:{beg:.30,int:.45,adv:.62},
  shrug_halt:{beg:.22,int:.34,adv:.50,perHand:true},
  cable_fly:{beg:.08,int:.13,adv:.19,perHand:true},
  curl_halt:{beg:.12,int:.17,adv:.24,perHand:true},
  curl_poulie:{beg:.12,int:.18,adv:.25},
  curl_corde:{beg:.12,int:.18,adv:.25},
  leg_press:{beg:.70,int:1.20,adv:1.90},
  leg_ext:{beg:.40,int:.58,adv:.80},
  leg_curl:{beg:.34,int:.50,adv:.68},
  mollets:{beg:.50,int:.75,adv:1.05},
  curl_incline:{beg:.10,int:.15,adv:.21,perHand:true},
  curl_marteau:{beg:.11,int:.16,adv:.22,perHand:true}
};

function getProfileBodyWeight(){
  var bw=DB.bodyWeight||[];
  if(bw.length) return bw[bw.length-1].weight_kg;
  var logs=DB.healthLogs||[];
  if(logs.length) return logs[logs.length-1].poids;
  return 0;
}

// ══════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════
function openSettings(){
  try{ if(typeof fillAccountEmail==='function') fillAccountEmail(); }catch(e){}
  var p=DB.profile||{};
  var n=document.getElementById('settingsName'); if(n) n.value=p.name||'';
  var h=document.getElementById('settingsHeight'); if(h) h.value=p.height||'';
  var a=document.getElementById('settingsAge'); if(a) a.value=p.age||'';
  var g=document.getElementById('settingsGoal'); if(g) g.value=p.goal||'masse';
  var wg=document.getElementById('settingsWeekGoal'); if(wg) wg.value=String(getWeekGoal());
  try{ renderRankPauses(); }catch(e){}
  renderReminderSettings();
  document.getElementById('settingsModal').classList.add('open');
}
function closeSettings(){ document.getElementById('settingsModal').classList.remove('open'); }
function saveSettings(){
  if(!DB.profile) DB.profile={};
  DB.profile.name=document.getElementById('settingsName').value.trim();
  DB.profile.height=parseInt(document.getElementById('settingsHeight').value)||0;
  DB.profile.age=parseInt(document.getElementById('settingsAge').value)||0;
  DB.profile.goal=document.getElementById('settingsGoal').value;
  var wgEl=document.getElementById('settingsWeekGoal');
  if(wgEl) DB.profile.weekGoal=parseInt(wgEl.value)||4;
  saveDB();
  closeSettings();
  renderDashboard();
  try{ renderGymGreet(); }catch(e){}
  showToast('\u2705 Profil sauvegardé');
}
// ══════════════════════════════════════════════════
// RAPPELS (notifications séance + shaker + inactivité)
// ══════════════════════════════════════════════════
var DAY_LETTERS=['D','L','M','M','J','V','S'];
function defaultReminders(){ return {
  scheduleVersion:2,
  enabled:false,
  hydrationEnabled:true,hydrationTimes:['08:30','11:00','14:30','17:00','19:00','21:00'],
  workoutEnabled:true,workoutNoonTime:'12:00',workoutEveningTime:'18:00',workoutStartedDate:'',
  sleepLogEnabled:true,sleepLogTime:'08:30',bedtimeEnabled:true,bedtimeTime:'23:30',
  days:[1,2,4,5],time:'18:30',shaker:false,inactivity:false,_lastShaker:'',_lastInact:'',_dismissed:''
}; }
function initReminders(){
  if(!DB.reminders) DB.reminders=defaultReminders();
  var d=defaultReminders();
  if(!DB.reminders.scheduleVersion){
    DB.reminders.shaker=false;
    DB.reminders.inactivity=false;
    DB.reminders.scheduleVersion=2;
  }
  Object.keys(d).forEach(function(k){ if(DB.reminders[k]===undefined) DB.reminders[k]=d[k]; });
  if(!Array.isArray(DB.reminders.hydrationTimes)) DB.reminders.hydrationTimes=d.hydrationTimes.slice();
}
function lastSeanceDate(){
  var real=(DB.logs||[]).filter(function(l){ return (l.sessions||[]).length>0; });
  if(!real.length) return null;
  var max=null; real.forEach(function(l){ if(!max||l.date>max) max=l.date; });
  return max;
}
function daysSinceLastSeance(){
  var d=lastSeanceDate(); if(!d) return 999;
  var now=getNow(); var past=new Date(d+'T00:00:00');
  var t=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  return Math.floor((t-past)/86400000);
}
function hasSeanceToday(){
  var t=todayStr();
  return (DB.logs||[]).some(function(l){ return l.date===t && (l.sessions||[]).length>0; });
}
function shakerDoneToday(){ var n=DB.nutrition[todayStr()]; return !!(n&&n.shaker); }
function notifSupported(){ return ('Notification' in window); }
function isStandaloneWebApp(){
  return !!(navigator.standalone===true||(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches));
}
function base64UrlBytes(value){
  var raw=window.atob(value.replace(/-/g,'+').replace(/_/g,'/'));
  var bytes=new Uint8Array(raw.length);
  for(var i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
  return bytes;
}
async function enablePushNotifications(){
  if(!notifSupported()||!navigator.serviceWorker||!window.isSecureContext){ showToast('Notifications push indisponibles dans ce navigateur'); return; }
  if(typeof sbClient==='undefined'||!sbClient){ showToast('Connexion au cloud indisponible : réessaie avec du réseau'); return; }
  var standalone=isStandaloneWebApp();
  if(/iPhone|iPad|iPod/i.test(navigator.userAgent)&&!standalone){
    showToast('Sur iPhone, ajoute MASSUP à l’écran d’accueil puis ouvre son icône');
    return;
  }
  try{
    var permission=Notification.permission;
    if(permission==='default') permission=await Notification.requestPermission();
    if(permission!=='granted'){ showToast('Autorisation de notification refusée'); renderReminderSettings(); return; }
    var configResponse=await fetch('/api/push-config',{cache:'no-store'});
    var config=await configResponse.json();
    if(!configResponse.ok||!config.enabled||!config.publicKey) throw new Error('Web Push non configuré côté serveur');
    var registration=await navigator.serviceWorker.ready;
    if(!registration.pushManager) throw new Error('Push API indisponible dans cette installation');
    var subscription=await registration.pushManager.getSubscription();
    var created=false;
    if(!subscription){
      subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:base64UrlBytes(config.publicKey)});
      created=true;
    }
    var userResult=await sbClient.auth.getUser();
    var user=userResult.data&&userResult.data.user;
    if(userResult.error||!user) throw new Error('Connecte-toi à MASSUP avant d’activer les notifications');
    var json=subscription.toJSON();
    var saved=await sbClient.from('push_subscriptions').upsert({
      endpoint:json.endpoint,
      user_id:user.id,
      p256dh:json.keys&&json.keys.p256dh,
      auth:json.keys&&json.keys.auth,
      time_zone:Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC',
      updated_at:new Date().toISOString()
    },{onConflict:'endpoint'});
    if(saved.error){
      if(created) await subscription.unsubscribe();
      throw new Error('Enregistrement de l’abonnement impossible : '+saved.error.message);
    }
    showToast('Notifications push activées sur cet appareil');
    renderReminderSettings();
  }catch(error){
    console.warn('[MASSUP] Web Push subscription:',error.message);
    showToast('Activation Web Push impossible : '+error.message);
  }
}
async function disablePushNotifications(){
  if(typeof sbClient==='undefined'||!sbClient){ showToast('Connexion au cloud indisponible : réessaie avec du réseau'); return; }
  try{
    var registration=await navigator.serviceWorker.ready;
    var subscription=await registration.pushManager.getSubscription();
    if(!subscription){ renderReminderSettings(); return; }
    var endpoint=subscription.endpoint;
    var removed=await sbClient.from('push_subscriptions').delete().eq('endpoint',endpoint);
    if(removed.error) throw new Error('Suppression de l’abonnement impossible : '+removed.error.message);
    if(!await subscription.unsubscribe()) throw new Error('Le navigateur n’a pas supprimé l’abonnement push');
    showToast('Notifications push désactivées sur cet appareil');
    renderReminderSettings();
  }catch(error){
    console.warn('[MASSUP] Web Push unsubscribe:',error.message);
    showToast('Désactivation Web Push impossible : '+error.message);
  }
}
// Chrono de repos / d'effort → push programmé côté serveur (module commun push_timer.js, 07/10/2026)
var workoutPushTimer=(typeof PushTimer!=='undefined')?PushTimer.create({
  url:SUPABASE_URL,key:SUPABASE_ANON_KEY,tag:'[MASSUP]',
  client:function(){ return (typeof sbClient!=='undefined'&&sbClient)||null; },
  enabled:function(){
    initReminders();
    return !!DB.reminders.enabled&&!(typeof rankInPause==='function'&&rankInPause(todayStr()));
  },
  onError:function(){ showToast('Chrono lancé, mais rappel hors application indisponible'); }
}):null;
function updateWorkoutPushTimer(dueAt,title,body){
  if(!workoutPushTimer) return Promise.resolve();
  return workoutPushTimer.update(dueAt,title,body);
}
function checkReminders(){
  var r=DB.reminders; if(!r||!r.enabled){ renderReminderBanner(null); return; }
  var now=getNow(); var dow=now.getDay(); var today=todayStr();
  var banner=null;
  var since=daysSinceLastSeance();
  if(r.inactivity && since>=2 && since<900){
    banner={type:'inact',msg:'&#x1F634; '+since+' jours sans séance — reprends le rythme aujourd\'hui !'};
  }
  if(!banner && r.shaker && r.days.indexOf(dow)>=0){
    var seance=hasSeanceToday(), shk=shakerDoneToday();
    if(!seance || !shk){
      var parts=[];
      if(!seance) parts.push('ta séance');
      if(!shk) parts.push('ton shaker &#x1F964;');
      banner={type:'day',msg:'&#x1F4AA; Jour de séance ! N\'oublie pas '+parts.join(' et ')+'.',showShaker:!shk};
    }
  }
  renderReminderBanner(banner);
  scheduleNextReminder();
}
var _remindTimer=null;
function scheduleNextReminder(){
  if(_remindTimer) clearTimeout(_remindTimer);
  var r=DB.reminders; if(!r||!r.enabled) return;
  var now=getNow();
  var hm=(r.time||'18:30').split(':');
  var target=new Date(now.getFullYear(),now.getMonth(),now.getDate(),parseInt(hm[0])||18,parseInt(hm[1])||30,0);
  var ms=target-now;
  if(ms<=0) ms=30*60*1000;
  if(ms>2147483647) return;
  _remindTimer=setTimeout(function(){ try{checkReminders();}catch(e){} },ms+1000);
}
function renderReminderBanner(banner){
  var el=document.getElementById('reminderBanner'); if(!el) return;
  if(!banner){ el.innerHTML=''; el.classList.remove('show'); return; }
  if(DB.reminders && DB.reminders._dismissed===todayStr()+':'+banner.type){ el.innerHTML=''; el.classList.remove('show'); return; }
  el.innerHTML='<div class="reminder-banner rb-'+banner.type+'">'
    +'<div class="rb-msg">'+banner.msg+'</div>'
    +'<div class="rb-actions">'
    +(banner.showShaker?'<button class="rb-shaker" onclick="markShakerDone()" title="Valider le shaker du jour">&#x1F964; Fait</button>':'')
    +'<button class="rb-go" onclick="switchToSeances()">Go</button>'
    +'<button class="rb-x" onclick="dismissReminder(\''+banner.type+'\')" title="Masquer">&#x2715;</button>'
    +'</div></div>';
  el.classList.add('show');
}
// Valide le shaker du jour depuis la bannière (l'onglet Nutrition étant mis de côté)
function markShakerDone(){
  var d=ensureNutriDay(todayStr());
  d.shaker=true; saveDB();
  showToast('&#x1F964; Shaker validé !');
  try{ checkReminders(); }catch(e){}
}
function switchToSeances(){
  var btns=document.querySelectorAll('#main-nav .bni');
  if(btns&&btns[1]) switchView('seances',btns[1]);
}
function dismissReminder(type){
  initReminders();
  DB.reminders._dismissed=todayStr()+':'+type;
  saveDB();
  renderReminderBanner(null);
}
function reminderTimeValue(value,fallback){
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value||'')?value:fallback;
}
function renderReminderSettings(){
  var el=document.getElementById('reminderSettings'); if(!el) return;
  initReminders();
  var r=DB.reminders;
  var perm=notifSupported()?Notification.permission:'unsupported';
  var html='';
  html+='<label class="rem-toggle"><input type="checkbox" '+(r.enabled?'checked':'')+' onchange="toggleReminders(this.checked)"> Activer les rappels</label>';
  if(r.enabled){
    if(perm==='unsupported'){
      html+='<div class="rem-note">&#x26A0;&#xFE0F; Ton navigateur ne gère pas les notifications système. La bannière dans l\'app fonctionne quand même.</div>';
    } else if(perm==='denied'){
      html+='<div class="rem-note">&#x1F515; Notifications bloquées. Réactive-les dans Réglages iOS &#x203A; MASSUP. La bannière dans l\'app reste active.</div>';
    } else if(!isStandaloneWebApp()&&/iPhone|iPad|iPod/i.test(navigator.userAgent)){
      html+='<div class="rem-note">Sur iPhone, ajoute MASSUP à l’écran d’accueil et ouvre l’app installée pour activer les notifications push.</div>';
    } else if(perm==='granted'){
      html+='<div class="rem-note rem-ok">&#x2705; Autorisation de notification accordée sur cet appareil.</div>'
        +'<button class="rem-perm-btn" onclick="enablePushNotifications()">&#x1F514; Activer / actualiser cet abonnement</button>'
        +'<button class="rem-perm-btn" onclick="disablePushNotifications()">&#x1F515; Désactiver sur cet appareil</button>';
    } else {
      html+='<button class="rem-perm-btn" onclick="enablePushNotifications()">&#x1F514; Activer les notifications push sur cet appareil</button>';
    }
    html+='<details class="rem-settings-group"><summary>💧 Boire de l’eau <span>6 horaires</span></summary><div class="rem-settings-content"><label class="rem-toggle rem-compact"><input type="checkbox" '+(r.hydrationEnabled?'checked':'')+' onchange="setReminderFlag(\'hydrationEnabled\',this.checked)"> Activer</label>';
    html+='<div class="rem-schedule-list">';
    r.hydrationTimes.forEach(function(time,i){
      html+='<label class="rem-time-cell"><span>#'+(i+1)+'</span><input class="form-input rem-time" aria-label="Heure du rappel eau '+(i+1)+'" type="time" value="'+reminderTimeValue(time,['08:30','11:00','14:30','17:00','19:00','21:00'][i]||'08:30')+'" onchange="setHydrationTime('+i+',this.value)"></label>';
    });
    html+='</div><div class="rem-note">Les rappels simultanés sont regroupés.</div></div></details>';
    html+='<details class="rem-settings-group"><summary>🏋️ Motivation séance</summary><div class="rem-settings-content"><label class="rem-toggle rem-compact"><input type="checkbox" '+(r.workoutEnabled?'checked':'')+' onchange="setReminderFlag(\'workoutEnabled\',this.checked)"> Activer</label>';
    html+='<label class="rem-schedule-row"><span>Proposition de séance</span><input class="form-input rem-time" type="time" value="'+reminderTimeValue(r.workoutNoonTime,'12:00')+'" onchange="setReminderClock(\'workoutNoonTime\',this.value)"></label>';
    html+='<label class="rem-schedule-row"><span>Relance si pas commencée</span><input class="form-input rem-time" type="time" value="'+reminderTimeValue(r.workoutEveningTime,'18:00')+'" onchange="setReminderClock(\'workoutEveningTime\',this.value)"></label>';
    html+='<div class="rem-note">Après une journée sans séance ; la relance s’annule si tu démarres.</div></div></details>';
    html+='<details class="rem-settings-group"><summary>🌙 Renseigner le sommeil</summary><div class="rem-settings-content"><label class="rem-toggle rem-compact"><input type="checkbox" '+(r.sleepLogEnabled?'checked':'')+' onchange="setReminderFlag(\'sleepLogEnabled\',this.checked)"> Activer</label>';
    html+='<label class="rem-schedule-row"><span>Le matin</span><input class="form-input rem-time" type="time" value="'+reminderTimeValue(r.sleepLogTime,'08:30')+'" onchange="setReminderClock(\'sleepLogTime\',this.value)"></label>';
    html+='<div class="rem-note">Seulement si la nuit précédente n’est pas notée.</div></div></details>';
    html+='<details class="rem-settings-group"><summary>😴 Rappel du coucher</summary><div class="rem-settings-content"><label class="rem-toggle rem-compact"><input type="checkbox" '+(r.bedtimeEnabled?'checked':'')+' onchange="setReminderFlag(\'bedtimeEnabled\',this.checked)"> Activer</label>';
    html+='<label class="rem-schedule-row"><span>Heure</span><input class="form-input rem-time" type="time" value="'+reminderTimeValue(r.bedtimeTime,'23:30')+'" onchange="setReminderClock(\'bedtimeTime\',this.value)"></label></div></details>';
    html+='<div class="rem-note rem-freeze-note">&#x2744; Toutes les notifications sont suspendues pendant les jours de gel.</div>';
  }
  el.innerHTML=html;
}
function toggleReminders(on){
  initReminders(); DB.reminders.enabled=on; saveDB();
  if(!on) updateWorkoutPushTimer(null);
  renderReminderSettings();
  try{ checkReminders(); }catch(e){}
}
function setReminderFlag(flag,val){ initReminders(); DB.reminders[flag]=val; saveDB(); try{checkReminders();}catch(e){} }
function setReminderClock(field,value){
  initReminders();
  if(['workoutNoonTime','workoutEveningTime','sleepLogTime','bedtimeTime'].indexOf(field)<0) return;
  DB.reminders[field]=reminderTimeValue(value,DB.reminders[field]||'08:30');
  saveDB();
}
function setHydrationTime(index,value){
  initReminders();
  if(!Number.isInteger(index)||index<0||index>=DB.reminders.hydrationTimes.length) return;
  DB.reminders.hydrationTimes=DB.reminders.hydrationTimes.slice();
  DB.reminders.hydrationTimes[index]=reminderTimeValue(value,DB.reminders.hydrationTimes[index]);
  saveDB();
}

// ══════════════════════════════════════════════════
// NUTRITION
// ══════════════════════════════════════════════════
var NUTRI_MEALS=[
  {key:'petit_dej',label:'Petit-déj',icon:'&#x1F950;'},
  {key:'dejeuner', label:'Déjeuner', icon:'&#x1F37D;&#xFE0F;'},
  {key:'diner',    label:'Dîner',    icon:'&#x1F319;'},
  {key:'shaker',   label:'Shaker',    icon:'&#x1F964;'}
];
function nutriGoal(){
  var p=DB.profile||{};
  return {kcal:p.kcalGoal||3100, prot:p.protGoal||140};
}
function getNutriDay(date){
  var d=DB.nutrition[date];
  if(!d){ d={kcal:null,prot:null,petit_dej:false,dejeuner:false,diner:false,shaker:false}; }
  return d;
}
function ensureNutriDay(date){
  if(!DB.nutrition[date]) DB.nutrition[date]={kcal:null,prot:null,petit_dej:false,dejeuner:false,diner:false,shaker:false};
  return DB.nutrition[date];
}
// Nettoie les jours totalement vides pour ne pas fausser les moyennes
function pruneNutriDay(date){
  var d=DB.nutrition[date]; if(!d) return;
  var empty=(d.kcal===null||d.kcal===undefined||d.kcal==='')&&(d.prot===null||d.prot===undefined||d.prot==='')
    &&!d.petit_dej&&!d.dejeuner&&!d.diner&&!d.shaker;
  if(empty) delete DB.nutrition[date];
}
function nutriEntriesInWindow(days){
  var out=[]; var now=getNow();
  var cutoff=new Date(now.getFullYear(),now.getMonth(),now.getDate()-(days-1));
  Object.keys(DB.nutrition).forEach(function(dt){
    var d=new Date(dt+'T00:00:00');
    if(d>=cutoff && d<=now){ var e=DB.nutrition[dt]; out.push({date:dt,kcal:e.kcal,prot:e.prot,petit_dej:e.petit_dej,dejeuner:e.dejeuner,diner:e.diner,shaker:e.shaker}); }
  });
  out.sort(function(a,b){return a.date.localeCompare(b.date);});
  return out;
}
function setNutriKcal(input){
  var date=todayStr(); var d=ensureNutriDay(date);
  var v=parseInt(input.value,10);
  d.kcal=(isNaN(v)||v<0)?null:v;
  pruneNutriDay(date); saveDB();
  renderNutrition();
}
function setNutriProt(input){
  var date=todayStr(); var d=ensureNutriDay(date);
  var v=parseInt(input.value,10);
  d.prot=(isNaN(v)||v<0)?null:v;
  pruneNutriDay(date); saveDB();
  renderNutrition();
}
function toggleMeal(key){
  var date=todayStr(); var d=ensureNutriDay(date);
  d[key]=!d[key];
  pruneNutriDay(date); saveDB();
  renderNutrition();
  if(key==='shaker'){ try{ checkReminders(); }catch(e){} }
}
function editNutriGoal(){
  var g=nutriGoal();
  var nk=prompt('Objectif calories par jour (kcal) :', g.kcal);
  if(nk===null) return;
  var np=prompt('Objectif protéines par jour (g) :', g.prot);
  if(np===null) return;
  if(!DB.profile) DB.profile={};
  var vk=parseInt(nk,10), vp=parseInt(np,10);
  if(!isNaN(vk)&&vk>0) DB.profile.kcalGoal=vk;
  if(!isNaN(vp)&&vp>0) DB.profile.protGoal=vp;
  saveDB(); renderNutrition();
  showToast('&#x2705; Objectif mis à jour');
}
function renderNutrition(){
  var el=document.getElementById('nutritionContent'); if(!el) return;
  var date=todayStr();
  var d=getNutriDay(date);
  var g=nutriGoal();
  var kcal=(d.kcal===null||d.kcal===undefined)?0:d.kcal;
  var prot=(d.prot===null||d.prot===undefined)?0:d.prot;
  var kpct=g.kcal?Math.min(1,kcal/g.kcal):0;
  var ppct=g.prot?Math.min(1,prot/g.prot):0;
  var C=2*Math.PI*52;
  var off=C*(1-kpct);
  var over=g.kcal&&kcal>g.kcal*1.12;
  var ringCol=over?'#F4A261':(kcal>=g.kcal*0.85?'#71FFB4':'#4D9DFF');
  var remain=g.kcal-kcal;
  var centerSub= kcal===0?'à saisir':(remain>0?('reste '+remain):(remain===0?'pile !':('+'+Math.abs(remain))));

  var html='';
  // ── Widget principal : anneau calories ──
  html+='<div class="slbl" style="margin-bottom:.5rem;">Aujourd\'hui — '+formatDateFr(date)+'</div>';
  html+='<div class="nutri-hero chart-section">'
    +'<div class="nutri-ring-wrap">'
      +'<svg width="150" height="150" viewBox="0 0 120 120" class="nutri-ring">'
        +'<circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="9"/>'
        +'<circle cx="60" cy="60" r="52" fill="none" stroke="'+ringCol+'" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 60 60)"/>'
      +'</svg>'
      +'<div class="nutri-ring-center"><div class="nutri-ring-kcal">'+kcal+'</div><div class="nutri-ring-goal">/ '+g.kcal+' kcal</div><div class="nutri-ring-sub">'+centerSub+'</div></div>'
    +'</div>'
    +'<div class="nutri-hero-inputs">'
      +'<label class="nutri-in-lbl">Calories mangées aujourd\'hui</label>'
      +'<div class="nutri-in-row"><input class="nutri-input" type="number" inputmode="numeric" min="0" step="10" value="'+(d.kcal!==null&&d.kcal!==undefined?d.kcal:'')+'" placeholder="0" onblur="setNutriKcal(this)" onkeydown="if(event.key===\'Enter\')this.blur()"/><span class="nutri-in-unit">kcal</span></div>'
      +'<div class="nutri-prot-bar-wrap"><div class="nutri-prot-top"><span>Protéines</span><span>'+prot+' / '+g.prot+' g</span></div>'
        +'<div class="nutri-prot-bar"><div class="nutri-prot-fill" style="width:'+(ppct*100).toFixed(0)+'%"></div></div></div>'
      +'<div class="nutri-in-row" style="margin-top:.5rem;"><input class="nutri-input nutri-input-sm" type="number" inputmode="numeric" min="0" step="5" value="'+(d.prot!==null&&d.prot!==undefined?d.prot:'')+'" placeholder="0" onblur="setNutriProt(this)" onkeydown="if(event.key===\'Enter\')this.blur()"/><span class="nutri-in-unit">g prot. (optionnel)</span></div>'
    +'</div>'
  +'</div>';

  // ── Cochables du jour ──
  html+='<div class="slbl" style="margin-top:1.25rem;margin-bottom:.5rem;">Ma journée</div>';
  html+='<div class="nutri-meals">';
  NUTRI_MEALS.forEach(function(m){
    var on=!!d[m.key];
    html+='<button class="nutri-meal'+(on?' on':'')+'" onclick="toggleMeal(\''+m.key+'\')">'
      +'<span class="nutri-meal-ico">'+m.icon+'</span><span class="nutri-meal-lbl">'+m.label+'</span>'
      +'<span class="nutri-meal-check">'+(on?'&#x2713;':'')+'</span></button>';
  });
  html+='</div>';

  // ── Statistiques 30 jours ──
  var w30=nutriEntriesInWindow(30);
  var kcalDays=w30.filter(function(e){return e.kcal!==null&&e.kcal!==undefined&&e.kcal>0;});
  var avgKcal=kcalDays.length?Math.round(kcalDays.reduce(function(a,e){return a+e.kcal;},0)/kcalDays.length):0;
  var protDays=w30.filter(function(e){return e.prot!==null&&e.prot!==undefined&&e.prot>0;});
  var avgProt=protDays.length?Math.round(protDays.reduce(function(a,e){return a+e.prot;},0)/protDays.length):0;
  var shakerCount=w30.filter(function(e){return e.shaker;}).length;
  var shakerPerWeek=Math.round(shakerCount/(30/7)*10)/10;
  var pdjPris=w30.filter(function(e){return e.petit_dej;}).length;
  var pdjLoupe=w30.filter(function(e){return !e.petit_dej;}).length; // sur jours suivis
  html+='<div class="slbl" style="margin-top:1.25rem;margin-bottom:.5rem;">Moyennes · 30 derniers jours</div>';
  html+='<div class="nutri-stats">'
    +'<div class="nutri-stat"><div class="nutri-stat-val">'+avgKcal+'</div><div class="nutri-stat-lbl">kcal / jour</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val">'+(avgProt||'—')+'</div><div class="nutri-stat-lbl">g prot. / jour</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val">'+shakerPerWeek+'</div><div class="nutri-stat-lbl">shakers / sem.</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val" style="color:var(--acc)">'+pdjPris+'</div><div class="nutri-stat-lbl">ptit-déj pris</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val" style="color:'+(pdjLoupe>0?'var(--red)':'var(--mut)')+'">'+pdjLoupe+'</div><div class="nutri-stat-lbl">ptit-déj loupés</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val">'+kcalDays.length+'</div><div class="nutri-stat-lbl">jours suivis</div></div>'
  +'</div>';

  // ── Bande 14 jours ──
  var w14=nutriEntriesInWindow(14);
  var byDate={}; w14.forEach(function(e){byDate[e.date]=e;});
  var bars='';
  var now=getNow();
  for(var i=13;i>=0;i--){
    var dd=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);
    var ds=dd.getFullYear()+'-'+String(dd.getMonth()+1).padStart(2,'0')+'-'+String(dd.getDate()).padStart(2,'0');
    var e=byDate[ds];
    var k=e&&e.kcal?e.kcal:0;
    var h=g.kcal?Math.max(4,Math.min(100,Math.round(k/g.kcal*100))):4;
    var col=k===0?'rgba(255,255,255,.08)':(k>g.kcal*1.12?'#F4A261':(k>=g.kcal*0.85?'#71FFB4':'#4D9DFF'));
    var sk=e&&e.shaker?'<span class="nutri-day-sk">&#x1F964;</span>':'';
    bars+='<div class="nutri-day" title="'+formatDateFr(ds)+' : '+(k||'—')+' kcal"><div class="nutri-day-bar-wrap"><div class="nutri-day-bar" style="height:'+h+'%;background:'+col+'"></div></div>'+sk+'<div class="nutri-day-lbl">'+dd.getDate()+'</div></div>';
  }
  html+='<div class="slbl" style="margin-top:1.25rem;margin-bottom:.5rem;">14 derniers jours</div>';
  html+='<div class="chart-section nutri-14"><div class="nutri-days">'+bars+'</div>'
    +'<div class="nutri-14-legend"><span><span class="nl-dot" style="background:#4D9DFF"></span>en dessous</span><span><span class="nl-dot" style="background:#71FFB4"></span>proche/atteint</span><span><span class="nl-dot" style="background:#F4A261"></span>dépassé</span></div></div>';

  // ── Objectif éditable ──
  html+='<div class="nutri-goal-edit" onclick="editNutriGoal()">&#x2699;&#xFE0F; Objectif : <strong>'+g.kcal+' kcal</strong> · <strong>'+g.prot+' g</strong> de protéines <span class="nutri-goal-chev">modifier</span></div>';
  html+='<div style="height:1.5rem"></div>';

  el.innerHTML=html;
}

function exportBackupJSON(){
  var blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(blob); var a=document.createElement('a');
  var d=new Date(); var stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  a.href=url; a.download='massup_backup_'+stamp+'.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  DB.profile.lastBackupTs=Date.now(); saveDB();
  showToast('\uD83D\uDCE6 Backup téléchargé');
}
// ── Merge NON destructif d'un snapshot complet (backup JSON OU user_state cloud) ──
// Le snapshot comble les trous, les données locales gagnent en cas de conflit.
// Utilisé par importBackupJSON() et par la synchro user_state (supabase.js).
function mergeBackupIntoDB(bk){
  if(!bk||typeof bk!=='object') return false;
  // Poids par exo : entrées du snapshot absentes en local (jamais celles supprimées localement)
  if(bk.weights){ Object.keys(bk.weights).forEach(function(k){
    if(!DB.weights[k]) DB.weights[k]=[];
    var delW=(DB.deletedWeights&&DB.deletedWeights[k])||[];
    (bk.weights[k]||[]).forEach(function(e){
      if(delW.indexOf(e.date)>=0) return; // tombstone
      if(!DB.weights[k].some(function(x){return x.date===e.date;})) DB.weights[k].push(e);
    });
    DB.weights[k].sort(function(a,b){return a.date<b.date?-1:1;});
  }); }
  if(bk.weightSetDate){ Object.keys(bk.weightSetDate).forEach(function(k){ if(!DB.weightSetDate[k]||DB.weightSetDate[k]<bk.weightSetDate[k]) DB.weightSetDate[k]=bk.weightSetDate[k]; }); }
  // Séances : un ID du snapshot absent en local est ajouté (sauf s'il a été supprimé localement)
  if(bk.logs){ bk.logs.forEach(function(l){
    if((DB.deletedLogs||[]).indexOf(String(l.id))>=0) return; // tombstone
    if(!(DB.logs||[]).some(function(x){return String(x.id)===String(l.id);})) DB.logs.push(l);
  }); DB.logs.sort(function(a,b){return b.date.localeCompare(a.date);}); }
  // Poids corporel / santé / journal poignet : merge par date (tombstones pesées respectées)
  ['bodyWeight','healthLogs','painLog'].forEach(function(key){
    if(!bk[key]) return; if(!DB[key]) DB[key]=[];
    var delBW=(key==='bodyWeight'||key==='healthLogs')?(DB.deletedBW||[]):[];
    bk[key].forEach(function(e){
      if(delBW.indexOf(e.date)>=0) return; // tombstone
      if(!DB[key].some(function(x){return x.date===e.date;})) DB[key].push(e);
    });
    DB[key].sort(function(a,b){return a.date<b.date?-1:1;});
  });
  if(bk.health){
    if(!DB.health) DB.health={};
    Object.keys(bk.health).forEach(function(d){
      var local=DB.health[d]||(DB.health[d]={});
      Object.keys(bk.health[d]||{}).forEach(function(k){ if(local[k]==null) local[k]=bk.health[d][k]; });
    });
  }
  if(bk.healthMeta){
    if(!DB.healthMeta) DB.healthMeta={};
    Object.keys(bk.healthMeta).forEach(function(k){ if(DB.healthMeta[k]==null) DB.healthMeta[k]=bk.healthMeta[k]; });
  }
  if(bk.sleepLog){
    if(!DB.sleepLog) DB.sleepLog={};
    Object.keys(bk.sleepLog).forEach(function(d){
      var local=DB.sleepLog[d]||(DB.sleepLog[d]={});
      Object.keys(bk.sleepLog[d]||{}).forEach(function(k){ if(local[k]===undefined) local[k]=bk.sleepLog[d][k]; });
    });
  }
  // Nutrition / détente : merge par jour
  ['nutrition','dz'].forEach(function(key){
    if(!bk[key]) return; if(!DB[key]) DB[key]={};
    Object.keys(bk[key]).forEach(function(d){ if(!DB[key][d]) DB[key][d]=bk[key][d]; });
  });
  // Mode NUTRITION masse (23/08) : journées par date + favoris en union
  if(bk.nutriA){
    if(!DB.nutriA) DB.nutriA={day:{},favs:[]};
    if(bk.nutriA.day){ if(!DB.nutriA.day) DB.nutriA.day={};
      Object.keys(bk.nutriA.day).forEach(function(d){ if(!DB.nutriA.day[d]) DB.nutriA.day[d]=bk.nutriA.day[d]; }); }
    if(bk.nutriA.favs){ if(!DB.nutriA.favs) DB.nutriA.favs=[];
      bk.nutriA.favs.forEach(function(f){ if(DB.nutriA.favs.indexOf(f)<0) DB.nutriA.favs.push(f); }); }
  }
  // Profil : le snapshot ne remplace que ce qui est vide localement
  if(bk.profile){ Object.keys(bk.profile).forEach(function(k){ if(DB.profile[k]===undefined||DB.profile[k]===''||DB.profile[k]===0) DB.profile[k]=bk.profile[k]; }); }
  if(bk.reminders&&!DB.reminders) DB.reminders=bk.reminders;
  // Rank : merge fin (pauses / déclarations hebdo / snapshots mensuels)
  if(bk.rank){
    if(!DB.rank) DB.rank={pauses:[]};
    if(bk.rank.pauses&&bk.rank.pauses.length&&(!DB.rank.pauses||!DB.rank.pauses.length)) DB.rank.pauses=bk.rank.pauses;
    if(bk.rank.weekly){ if(!DB.rank.weekly) DB.rank.weekly={};
      Object.keys(bk.rank.weekly).forEach(function(w){ if(!DB.rank.weekly[w]) DB.rank.weekly[w]=bk.rank.weekly[w]; }); }
    if(bk.rank.ladderSnaps){ if(!DB.rank.ladderSnaps) DB.rank.ladderSnaps={};
      Object.keys(bk.rank.ladderSnaps).forEach(function(m){ if(DB.rank.ladderSnaps[m]==null) DB.rank.ladderSnaps[m]=bk.rank.ladderSnaps[m]; }); }
  }
  if(bk.templates&&bk.templates.length&&(!DB.templates||!DB.templates.length)) DB.templates=bk.templates;
  if(bk.deletedWeights&&!Object.keys(DB.deletedWeights||{}).length) DB.deletedWeights=bk.deletedWeights;
  if(bk.prepared&&!DB.prepared) DB.prepared=bk.prepared;
  return true;
}

// La base locale est-elle « vierge » (fraîche après une purge Safari) ?
// Si oui, le snapshot cloud est adopté en bloc au lieu d'un merge champ à champ.
function isLocalDBVirgin(){
  return !(DB.logs&&DB.logs.length)&&!(DB.profile&&DB.profile.name)&&!(DB.painLog&&DB.painLog.length);
}

// Reconstruction du journal poignet depuis le détail cloud des séances (11/08) :
// chaque séance LiveUp synchronisée porte live.pain/painNote → si l'entrée
// painLog du jour manque (base locale purgée), on la recrée. Idempotent.
function rebuildPainLogFromLive(){
  if(!DB.painLog) DB.painLog=[];
  var added=false;
  (DB.logs||[]).forEach(function(l){
    if(!l.live||l.live.pain===null||l.live.pain===undefined||!l.date) return;
    if(DB.painLog.some(function(p){return p.date===l.date;})) return;
    DB.painLog.push({date:l.date,level:l.live.pain,note:l.live.painNote||''});
    added=true;
  });
  if(added){ DB.painLog.sort(function(a,b){return a.date.localeCompare(b.date);}); saveDB(); }
}

// Import backup JSON (11/08) — restaure un fichier massup_backup_*.json.
// Merge NON destructif : le backup comble les trous, les données locales plus
// récentes gagnent. Couvre surtout ce que le cloud ne sauvegarde pas
// (profil, journal poignet, nutrition, pauses rank, templates, détente).
function importBackupJSON(){
  var input=document.createElement('input');
  input.type='file'; input.accept='.json,application/json';
  input.onchange=function(){
    var f=input.files&&input.files[0]; if(!f) return;
    var reader=new FileReader();
    reader.onload=function(){
      try{
        var bk=JSON.parse(reader.result);
        if(!bk||typeof bk!=='object'||(!bk.weights&&!bk.logs&&!bk.profile)){ showToast('❌ Fichier invalide — pas un backup MASSUP'); return; }
        mergeBackupIntoDB(bk);
        saveDB(); _flushSaveDB();
        showToast('📦 Backup restauré — '+(bk.logs?bk.logs.length:0)+' séances dans le fichier');
        setTimeout(function(){ location.reload(); },900);
      }catch(e){ showToast('❌ Impossible de lire ce fichier'); }
    };
    reader.readAsText(f);
  };
  input.click();
}


// ══════════════════════════════════════════════════
// EXPORT CSV
// ══════════════════════════════════════════════════
function downloadCSV(filename, content){
  var blob=new Blob(['\uFEFF'+content],{type:'text/csv;charset=utf-8;'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url; a.download=filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function exportSeancesCSV(){
  var rows=['Date,Heure,S\u00e9ances,Dur\u00e9e (min),\u00c9nergie,Ressenti,Commentaire'];
  DB.logs.slice().reverse().forEach(function(l){
    var snames=l.sessions.map(function(sid){
      if(sid.indexOf('autre:')===0) return sid.replace('autre:','');
      if(sid.indexOf('exo:')===0) return getExoName(sid.replace('exo:',''));
      var s=DATA.find(function(x){return x.id===sid;}); return s?s.name:sid;
    }).join(' + ');
    rows.push([l.date,l.time||'','"'+snames+'"',l.duration_min||'',l.energy||'',l.feeling||'','"'+(l.comment||'').replace(/"/g,'""')+'"'].join(','));
  });
  downloadCSV('massup_seances.csv',rows.join('\n'));
  showToast('&#x1F4E5; Export séances téléchargé');
}

function exportPoidsCSV(){
  var bwt=getProfileBodyWeight();
  var p=DB.profile||{};
  var goalMap={masse:'Prise de masse',force:'Force',seche:'Seche',maintien:'Maintien'};
  var sep=',';
  function cell(v){ v=(v===undefined||v===null)?'':String(v); return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }
  function line(arr){ return arr.map(cell).join(sep); }

  // Ordre logique : exos des 4 séances, puis extras, puis le reste
  var order=[], seen={};
  DATA.forEach(function(s){ s.exos.forEach(function(e){ if(!seen[e.key]){ seen[e.key]=1; order.push(e.key); } }); });
  if(typeof EXTRAS!=='undefined') EXTRAS.forEach(function(e){ if(!seen[e.key]){ seen[e.key]=1; order.push(e.key); } });
  Object.keys(DB.weights).forEach(function(k){ if(!seen[k]){ seen[k]=1; order.push(k); } });

  var rows=[];
  // En-tête contextuel pour le coach
  rows.push(line(['MASSUP - Suivi force & poids']));
  rows.push(line(['Poids de corps', bwt?Math.round(bwt)+' kg':'non renseigne']));
  rows.push(line(['Age', (p.age||DEFAULT_AGE)+' ans']));
  rows.push(line(['Objectif', goalMap[p.goal]||'-']));
  rows.push(line(['Date export', todayStr()]));
  rows.push(line(['Note', 'Reperes = estimation indicative selon le poids de corps (machines variables)']));
  rows.push('');
  rows.push(line(['Exercice','Poids actuel','Unite','Derniere modif','Jours sans hausse','Niveau','Statut vs profil','Repere debutant','Repere intermediaire','Repere avance']));

  rows[rows.length-1]=line(['Exercice','Poids depart','1ere date','Poids actuel','Progression','%','Unite','Derniere modif','Jours sans hausse','Niveau','Statut vs profil','Repere debutant','Repere intermediaire','Repere avance']);

  order.forEach(function(key){
    var arr=DB.weights[key]; if(!arr||!arr.length) return;
    var w=getCurrentWeight(key);
    var startVal=arr[0].val, startDate=arr[0].date;
    // Exos assistés : moins d'assistance = progression POSITIVE (bug −56 % corrigé le 14/08)
    var _inv=asIsInverse(key);
    var delta=Math.round((_inv?startVal-w:w-startVal)*10)/10;
    var pct=startVal>0?Math.round(delta/startVal*100):0;
    var std=STRENGTH_STD[key];
    var unit=(std&&std.perHand)?'kg/main':'kg';
    var lastDate=DB.weightSetDate[key]||(arr[arr.length-1]&&arr[arr.length-1].date)||'';
    var days=getDaysSinceWeightChange(key);
    var level='', status='', begK='', intK='', advK='';
    if(std&&bwt){
      begK=Math.round(std.beg*bwt); intK=Math.round(std.int*bwt); advK=Math.round(std.adv*bwt);
      if(w>=advK) level='Avance'; else if(w>=intK) level='Intermediaire'; else if(w>=begK) level='Novice'; else level='Debutant';
      var ratio=intK?w/intK:1;
      status= ratio>=1.10?'En avance':ratio>=0.90?'Dans la moyenne':'A rattraper';
    }
    rows.push(line([getExoName(key)+(_inv?' (assistance : moins = mieux)':''),startVal,startDate,w,(delta>0?'+':'')+delta,(pct>0?'+':'')+pct+'%',unit,lastDate,days,level,status,begK,intK,advK]));
  });
  downloadCSV('massup_poids_force.csv',rows.join('\n'));
  showToast('&#x1F4E5; Export poids + repères téléchargé');
}


// Export complet "coach" — tout dans un seul fichier, sections multiples
function exportCoachCSV(){
  var sep=',';
  function cell(v){ v=(v===undefined||v===null)?'':String(v); return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }
  function line(arr){ return arr.map(cell).join(sep); }
  var bwt=getProfileBodyWeight();
  var p=DB.profile||{};
  var goalMap={masse:'Prise de masse',force:'Force',seche:'Seche',maintien:'Maintien'};
  var g=nutriGoal();
  var R=[];
  // ── Profil ──
  R.push(line(['MASSUP - DOSSIER COMPLET POUR LE COACH']));
  R.push(line(['Genere le', todayStr()]));
  R.push(line(['Prenom', p.name||'Adrien']));
  R.push(line(['Age', (p.age||DEFAULT_AGE)+' ans']));
  R.push(line(['Taille', (p.height||172)+' cm']));
  R.push(line(['Poids de corps actuel', bwt?Math.round(bwt*10)/10+' kg':'?']));
  R.push(line(['Objectif', goalMap[p.goal]||'-']));
  R.push(line(['Objectif nutrition', g.kcal+' kcal / '+g.prot+' g proteines par jour']));
  R.push('');

  // ── Progression des charges (synthese) ──
  // ⚠️ Exos ASSISTÉS (traction/dips assistées) : moins d'assistance = PLUS FORT → la progression
  // est inversée à l'affichage (bug relevé le 14/08 : 45→20 sortait en « −56 % » comme une
  // régression alors que c'est sa meilleure progression).
  R.push(line(['=== FORCE : SYNTHESE PAR EXERCICE ===']));
  R.push(line(['Traction/Dips assistees : le poids = l\'ASSISTANCE de la machine -> moins = plus fort (progression comptee dans le bon sens)']));
  R.push(line(['Exercice','Depart','1ere date','Actuel','Progression','%','Derniere modif']));
  var order=[], seen={};
  DATA.forEach(function(s){ s.exos.forEach(function(e){ if(!seen[e.key]){ seen[e.key]=1; order.push(e.key); } }); });
  Object.keys(DB.weights).forEach(function(k){ if(!seen[k]){ seen[k]=1; order.push(k); } });
  order.forEach(function(key){
    var arr=DB.weights[key]; if(!arr||!arr.length) return;
    var w=arr[arr.length-1].val, startVal=arr[0].val;
    var inv=asIsInverse(key);
    var delta=Math.round(((inv?startVal-w:w-startVal))*10)/10;
    var base=inv?startVal:startVal;
    var pct=base>0?Math.round(delta/base*100):0;
    R.push(line([getExoName(key)+(inv?' (assistance : moins = mieux)':''),startVal,arr[0].date,w,
      (delta>0?'+':'')+delta+(inv?' kg d\'assistance en moins':''),(pct>0?'+':'')+pct+'%',DB.weightSetDate[key]||'']));
  });
  R.push('');

  // ── Historique détaillé des charges ──
  R.push(line(['=== FORCE : HISTORIQUE DETAILLE (1 ligne par mesure) ===']));
  R.push(line(['Exercice','Date','Poids']));
  order.forEach(function(key){
    var arr=DB.weights[key]; if(!arr||!arr.length) return;
    arr.forEach(function(e){ R.push(line([getExoName(key),e.date,e.val])); });
  });
  R.push('');

  // ── Séances (v2 14/08 : note /20, RP, douleur, imprévu, échauffement — TOUT ce que l'app sait) ──
  function _logScore20(l){
    if(!l.live||!l.live.exos||!l.live.exos.length) return '';
    try{
      var ex=liveNotedExos(l.live.exos);
      if(!ex.length) return '';
      var t=0; ex.forEach(function(x){ t+=asScoreExoRaw(x); });
      return Math.max(0,Math.min(20,Math.round(t/ex.length*4)));
    }catch(e){ return ''; }
  }
  function _logRP(l){
    try{ if(!rankLogIsSalle(l)) return ''; return Math.max(1,Math.round(rankSeanceRP(l).total/LADDER_ECO.seanceDiv)); }catch(e){ return ''; }
  }
  var CTX_LBL={temps:'manque de temps',blessure:'blessure/douleur',energie:'energie/sommeil',malade:'malade'};
  R.push(line(['=== SEANCES (1 ligne par seance) ===']));
  R.push(line(['Energie/Ressenti global: 1-5 · Douleur poignet: 0-5 · Douleurs: zones signalees en fin de seance · Note /20 = execution des exos principaux']));
  R.push(line(['Date','Heure','Seances','Duree (min)','Energie (1-5)','Ressenti (1-5)','Note /20','RP gagnes','Douleur poignet','Douleurs (zone niveau/5)','Imprevu','Echauffement','Cardio','Commentaire']));
  DB.logs.slice().sort(function(a,b){return b.date.localeCompare(a.date);}).forEach(function(l){
    var snames=(l.sessions||[]).map(function(sid){
      if(sid.indexOf('autre:')===0) return sid.replace('autre:','');
      if(sid.indexOf('exo:')===0) return getExoName(sid.replace('exo:',''));
      var s=DATA.find(function(x){return x.id===sid;}); return s?s.name:sid;
    }).join(' + ');
    var lv=l.live||{};
    R.push(line([l.date,l.time||'',snames,l.duration_min||'',l.energy||'',l.feeling||'',_logScore20(l),_logRP(l),
      (lv.pain!=null?lv.pain:''),(lv.pains&&lv.pains.length?painZonesTxt(lv.pains):(lv.painAny===false?'aucune':'')),(lv.context?(CTX_LBL[lv.context]||lv.context):''),
      (l.live?(lv.warmup?'oui':'non'):''),l.cardio?'oui':'',l.comment||'']));
  });
  R.push('');

  // ── Étirements / Détente (jours étirés + gestes posture quotidiens) ──
  if(DB.dz&&Object.keys(DB.dz).length){
    R.push(line(['=== ETIREMENTS / DETENTE (par jour) ===']));
    R.push(line(['Date','Etirements faits','Gestes du plan','Posture quotidienne']));
    Object.keys(DB.dz).sort().forEach(function(dt){
      var d=DB.dz[dt];
      var daily=Object.keys(d).filter(function(k){return k!=='stretch'&&k!=='stCt'&&d[k];}).join(' / ');
      R.push(line([dt,d.stretch?'oui':'',d.stCt||'',daily]));
    });
    R.push('');
  }

  // ── Poids de corps (seule métrique de référence — les données RENPHO ont été retirées) ──
  R.push(line(['=== POIDS DE CORPS ===']));
  R.push(line(['Date','Poids (kg)']));
  (DB.bodyWeight||[]).slice().sort(function(a,b){return a.date.localeCompare(b.date);}).forEach(function(b){
    R.push(line([b.date,b.weight_kg]));
  });
  R.push('');

  // ── Nutrition ──
  R.push(line(['=== NUTRITION (par jour) ===']));
  R.push(line(['Date','Calories','Proteines (g)','Petit-dej','Dejeuner','Diner','Shaker']));
  Object.keys(DB.nutrition).sort().forEach(function(dt){
    var d=DB.nutrition[dt];
    R.push(line([dt,(d.kcal!=null?d.kcal:''),(d.prot!=null?d.prot:''),d.petit_dej?'oui':'non',d.dejeuner?'oui':'non',d.diner?'oui':'non',d.shaker?'oui':'non']));
  });
  var w30=nutriEntriesInWindow(30);
  var kd=w30.filter(function(e){return e.kcal;});
  R.push('');
  R.push(line(['Moyenne kcal/jour (30j)', kd.length?Math.round(kd.reduce(function(a,e){return a+e.kcal;},0)/kd.length):0]));
  R.push(line(['Shakers/semaine (30j)', Math.round(w30.filter(function(e){return e.shaker;}).length/(30/7)*10)/10]));
  R.push('');

  // ── Séances en direct : détail série par série + note /5 par exo (v2 14/08) ──
  var liveLogs=(DB.logs||[]).filter(function(l){return l.live;}).sort(function(a,b){return a.date.localeCompare(b.date);});
  if(liveLogs.length){
    R.push(line(['=== SEANCES EN DIRECT (detail par serie) ===']));
    R.push(line(['Ressenti serie: facile / ok (correct) / dur / echec (= muscle au bout, pas un rate) · G/D renseignes sur les unilateraux']));
    R.push(line(['Date','Seance','Exercice','Statut','Compte','Bonus','Note /5','Serie','Poids serie','Reps faites','Reps cible','Ressenti','Ressenti G','Ressenti D']));
    liveLogs.forEach(function(l){
      var sname=(l.sessions||[]).map(function(sid){
        var s=DATA.find(function(x){return x.id===sid;}); return s?s.name:null;
      }).filter(Boolean).join('+')||'Exos a la carte';
      (l.live.exos||[]).forEach(function(x){
        var counted='';
        try{ counted=liveExoCounted(x)?'oui':'non'; }catch(e){}
        var sc='';
        try{ sc=(x.sets&&x.sets.length)?String(asScoreExo(x)).replace('.',','):''; }catch(e){}
        var bonus=x.extra?'oui':'';
        if(!x.sets||!x.sets.length){
          R.push(line([l.date,sname,getExoName(x.key),x.status||'',counted,bonus,sc,'',x.w,'','','','',''])); return;
        }
        x.sets.forEach(function(s,si){
          R.push(line([l.date,sname,getExoName(x.key),x.status||'',counted,bonus,(si===0?sc:''),si+1,(s.w!=null?s.w:x.w),s.reps,x.reps,s.feel||'',s.feelG||'',s.feelD||'']));
        });
      });
      if(l.live.ready&&l.live.ready.length) R.push(line([l.date,sname,'-> Se sent pret a monter sur','','','','','',l.live.ready.map(getExoName).join(' / '),'','','','','']));
    });
    R.push('');
  }

  // ── Objectifs de saison (v4) : départ 30/07 → cible 1er janvier, note /100, médaille ──
  R.push(line(['=== OBJECTIFS SAISON 1 (27/07/2026 -> 01/01/2027) ===']));
  R.push(line(['Note /100: 50 = poids du 30/07 (aucun progres) · 100 = objectif du 1er janvier atteint · Medaille: Bronze III (depart) -> Champion I (objectif)']));
  R.push(line(['Exercice','Depart 30/07','Actuel','Cible 1er jan','Progression saison %','Note /100','Medaille']));
  order.forEach(function(key){
    if(GOALS_JAN[key]==null) return;
    var info=findExoIndex(key);
    if(info&&info.exo&&info.exo.hidden) return;
    var cur=getCurrentWeight(key); if(!cur&&cur!==0) return;
    var st=exoSeasonStartWeight(key);
    var prog=null,lvl=null,med='';
    try{ prog=goalProgress(key); lvl=goalLevel(key); if(prog!==null){ var ld=ladderOf(prog); med=ld.tier.name+' '+ld.div; } }catch(e){}
    R.push(line([getExoName(key),(st!=null?st:''),cur,GOALS_JAN[key],
      (prog!==null?Math.round(prog*100)+'%':''),(lvl!==null?Math.round(lvl*100):''),med]));
  });
  try{
    var _st=rankState();
    R.push(line(['RANK GLOBAL',_st.glob.tier.name+' '+_st.glob.div,_st.glob.rp+' RP','','','','']));
  }catch(e){}
  R.push('');

  // ── Bilans hebdo déclarés (dimanche soir : petit-déj / shakers / cardio) ──
  var _wk=(DB.rank&&DB.rank.weekly)?DB.rank.weekly:null;
  if(_wk&&Object.keys(_wk).length){
    R.push(line(['=== BILANS HEBDO DECLARES ===']));
    R.push(line(['Semaine du','Petits-dejeuners','Shakers','Cardios']));
    Object.keys(_wk).sort().forEach(function(ws){
      var a=_wk[ws]||{};
      R.push(line([ws,(a.pdj!=null?a.pdj:''),(a.shaker!=null?a.shaker:''),(a.cardio!=null?a.cardio:'')]));
    });
    R.push('');
  }

  // ── Journal blessure poignet ──
  if(DB.painLog&&DB.painLog.length){
    R.push(line(['=== JOURNAL BLESSURE POIGNET (styloide ulnaire) ===']));
    R.push(line(['Date','Douleur (0-5)','Note']));
    DB.painLog.forEach(function(p){ R.push(line([p.date,p.level,p.note||''])); });
    R.push('');
  }

  downloadCSV('massup_coach_'+todayStr()+'.csv',R.join('\n'));
  showToast('&#x1F4E5; Dossier complet coach téléchargé');
}

// ══════════════════════════════════════════════════
// MODAL — fermeture clic extérieur + Escape
// ══════════════════════════════════════════════════
(function(){
  var modals={logModal:closeLogModal,dayModal:closeDayModal,peseeModal:closePeseeModal,settingsModal:closeSettings};
  Object.keys(modals).forEach(function(id){
    var overlay=document.getElementById(id);
    if(!overlay) return;
    overlay.addEventListener('click',function(e){
      if(e.target===overlay) modals[id]();
    });
  });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    var fs=document.getElementById('fsOverlay');
    if(fs&&fs.classList.contains('open')){closeFullscreenChart();return;}
    Object.keys(modals).forEach(function(id){
      var overlay=document.getElementById(id);
      if(overlay&&overlay.classList.contains('open')) modals[id]();
    });
  });
})();

// ══════════════════════════════════════════════════
// MODE SÉANCE ACTIVE v2 (retours Adrien 31/07/2026)
// Plein écran guidé : setup → prêt (motivation) → par exo (slides présentation /
// conseils / erreurs → séries → questions → repos avec stats fun) → questions de fin
// → BILAN EN SLIDES noté (/20 global, /5 par exo, fond coloré selon la presta).
// Navigation par boutons explicites, dots en bas, contenu centré et aéré.
// État persistant localStorage 'massup_as' + bulle de reprise en haut du site.
// ══════════════════════════════════════════════════
var AS=null;
var AS_KEY='massup_as';
var _asTimer=null;
var _asAudioCtx=null;
var _asLastBeepSec=null;
var _asLastWorkBeepSec=null;
var _asDir='fwd';
var _asSheetOpen=false; // le menu burger reste ouvert pendant les re-renders (réordonner, sauter...)
var _asSheetAdd=false;  // vue « ajouter un exo » du menu burger
var _asDrag=null;       // état du drag & drop de réordonnancement du burger

// « À l'échec » = état en fin de série (allé au bout du muscle), PAS un ratage — voir setHardFail.
var AS_FEELS=[
  {v:'facile',ico:'&#x1F60C;',lbl:'Facile'},
  {v:'ok',ico:'&#x1F44D;',lbl:'Correct'},
  {v:'dur',ico:'&#x1F975;',lbl:'Dur'},
  {v:'echec',ico:'&#x1F4A5;',lbl:'&#xC0; l\'&#xE9;chec'}
];
var AS_INTER_REST=120; // passé 90→120 s le 05/08 (grille « récup optimale », PCr ~85-90% à 2 min)
var AS_HYPE=[
  'Chaque rep te rapproche du toi de janvier.',
  'La r&#xE9;gularit&#xE9; bat le talent &#x2014; et t\'as les deux.',
  'Personne ne le fera &#xE0; ta place. GO.',
  'Le meilleur moment pour pousser ? Maintenant.',
  'Ton futur toi te dit d&#xE9;j&#xE0; merci.',
  'On construit. Brique par brique.',
  'Vise propre, pas parfait.',
  'La salle est &#xE0; toi ce soir. Prends-la.'
];
var AS_BETWEEN_GOOD=['Solide. Encha&#xEE;ne !','&#xC7;a, c\'est du travail propre.','Excellent &#x2014; garde ce rythme.','Machine. Au suivant !'];
var AS_BETWEEN_ROUGH=['Pas grave &#x2014; le prochain exo est une nouvelle chance.','Respire, bois un coup, on repart.','M&#xEA;me les jours moyens construisent du muscle.'];
var AS_EXIT_SVG='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h5V4"/><path d="M20 9h-5V4"/><path d="M4 15h5v5"/><path d="M20 15h-5v5"/></svg>';
// Échauffement guidé du LiveUp (02/08) : commun + spécifique au type de séance,
// et TOUJOURS une série à vide du 1er exo (répéter le geste avant de charger).
var WARMUPS={
  common:[
    {name:'Cardio l&#xE9;ger',dur:'2 min',cue:'Rameur ou v&#xE9;lo, allure tranquille &#x2014; juste monter la temp&#xE9;rature du corps.'},
    {name:'Rotations &#xE9;paules + bras',dur:'30s',cue:'Grands cercles lents, vers l\'avant puis vers l\'arri&#xE8;re.'},
    {name:'Rotations poignets &amp; coudes',dur:'30s',cue:'En douceur, dans les deux sens.'}
  ],
  push:[
    {name:'Coiffe des rotateurs',dur:'12-15 reps',cue:'Poulie ou halt&#xE8;re TR&#xC8;S l&#xE9;ger, coude au corps, rotation externe &#x2014; assure tes &#xE9;paules.'}
  ],
  pull:[
    {name:'Tirage tr&#xE8;s l&#xE9;ger',dur:'12-15 reps',cue:'&#x2248;50% du poids de travail, amplitude compl&#xE8;te &#x2014; sens tes dorsaux s\'&#xE9;tirer et se contracter.'}
  ],
  legs:[
    {name:'Squats au poids du corps',dur:'12-15',cue:'Descente contr&#xF4;l&#xE9;e, talons au sol, genoux dans l\'axe des pieds.'},
    {name:'Rotations hanches + chevilles',dur:'30s',cue:'Cercles amples, les deux sens &#x2014; genoux et chevilles pr&#xEA;ts &#xE0; charger.'}
  ]
};

// ── Persistance ──
function asSave(){ try{ localStorage.setItem(AS_KEY,JSON.stringify(AS)); }catch(e){} }
function asLoad(){
  try{ var s=localStorage.getItem(AS_KEY); AS=s?JSON.parse(s):null; }catch(e){ AS=null; }
  if(AS && Date.now()-(AS.createdTs||0)>12*3600*1000){ AS=null; try{localStorage.removeItem(AS_KEY);}catch(e){} }
}
function asDiscard(){
  AS=null; _asSheetOpen=false;
  try{ localStorage.removeItem(AS_KEY); }catch(e){}
  if(_asTimer){ clearInterval(_asTimer); _asTimer=null; }
  if(typeof _stTimer!=='undefined'&&_stTimer){ clearInterval(_stTimer); _stTimer=null; }
  asHideOverlay();
  asRenderBubble();
}
function asBoot(){
  asLoad(); asRenderBubble();
  if(AS&&AS.restEnd) asEnsureTick();
  else if(AS&&AS.step==='exo'&&AS.phase==='work'&&AS.exos&&AS.exos[AS.cur]&&asIsTimedExercise(AS.exos[AS.cur])){
    asEnsureWorkTimer(AS.exos[AS.cur]);
    if(AS.workTimerEnd>Date.now()) asEnsureTick();
  }
}
// Économie batterie : app en arrière-plan → on coupe le ticker (les repos sont basés sur des
// timestamps, donc au retour tout est recalculé juste — rien ne se décale).
document.addEventListener('visibilitychange',function(){
  if(document.hidden){
    if(_asTimer){ clearInterval(_asTimer); _asTimer=null; }
  } else if(AS&&(AS.restEnd||AS.phase==='work')){
    asEnsureTick(); asTickFn();
    asRenderBubble();
  }
});

// ── Helpers données ──
function asExoDef(key){
  // Première occurrence = définition de référence (un exo peut vivre dans 2 séances, ex. elev_lat)
  var found=null;
  DATA.forEach(function(s){ s.exos.forEach(function(e){ if(!found&&e.key===key) found={e:e,s:s}; }); });
  return found;
}
function asParseSerie(e){
  if(e.repTarget){ var mm=(e.serie||'').match(/^(\d+)[×x]/); return {n:mm?parseInt(mm[1],10):3,reps:getCurrentWeight(e.key)||10}; }
  var m=(e.serie||'').match(/^(\d+)[×x](\d+)/);
  if(m) return {n:parseInt(m[1],10),reps:parseInt(m[2],10)};
  var m2=(e.serie||'').match(/^(\d+)/);
  return {n:m2?parseInt(m2[1],10):3,reps:10};
}
function asIsInverse(key){ return key==='traction_assist'||key==='dips_assist'; } // seated_dips = charge depuis le 06/08 (dips machine assise)
// eDef/sDef optionnels : quand un même exo vit dans DEUX séances (ex. elev_lat en PUSH 4×10
// et en fin de PULL 3×12 — même clé, même historique), la définition de LA séance lancée fait foi.
function asMakeExo(key,extra,eDef,sDef){
  var e,st;
  if(eDef&&sDef){ e=eDef; st=sDef.t; }
  else{ var d=asExoDef(key); if(!d) return null; e=d.e; st=d.s.t; }
  var t=asParseSerie(e);
  // Évolution de charge en cours : le poids de départ = palier HAUT (il se travaille frais, 22/08)
  var ev=asEvoOf(key);
  return {key:key,name:e.name,img:e.img||null,cue:e.cue||'',bless:e.bless||'',
    tips:(e.tips||[]).slice(0,3),errs:(e.errs||[]).slice(0,2),
    unite:e.unite||'kg',cnt:e.cnt||null,rest:e.rest||60,inc:e.inc||1,repT:!!e.repTarget,uni:!!e.uni,
    n:t.n,reps:t.reps,w0:getCurrentWeight(key),weight:ev?ev.to:getCurrentWeight(key),
    evo:ev?{from:ev.from,to:ev.to,hi:Math.min(ev.hi||1,t.n)}:null,
    t:st,extra:!!extra,added:false,status:'pending',sets:[]};
}

// ── ÉVOLUTION DE CHARGE (15/08/2026, demande Adrien — sens inversé le 22/08/2026) ──
// Entre « je domine 50 » et « tout à 55 », un pont : les PREMIÈRES séries de l'exo passent au
// poids haut (ex. 55·55·50·50 — décision Adrien 22/08 : le poids haut se travaille FRAIS, en
// début d'exo, comme un top set + back-off). Chaque séance où les séries au poids haut tiennent
// → une série de plus au poids haut la fois suivante. Quand TOUT l'exo passe au poids haut →
// la référence est entérinée automatiquement et l'évolution se termine.
// Contrepartie de la fraîcheur : la SÉRIE 1 au poids haut doit passer à la CIBLE PLEINE
// (doctrine 14/08 : série 1 à la cible avec de la réserve), les suivantes gardent la tolérance.
// La référence (DB.weights) ne bouge PAS pendant l'évolution — elle ne bascule qu'à la fin.
function asEvoOf(key){ return (DB.evolution&&DB.evolution[key])?DB.evolution[key]:null; }
function asEvoWeightFor(x,setNo){
  if(!x||!x.evo) return null;
  return setNo<=(x.evo.hi||0)?x.evo.to:x.evo.from;
}
function asEvoPlanStr(x){
  if(!x||!x.evo) return '';
  var parts=[];
  for(var i=1;i<=x.n;i++) parts.push(asEvoWeightFor(x,i));
  return parts.join('&#xB7;');
}
// Cale le poids de travail sur le plan d'évolution au CHANGEMENT de série uniquement
// (une correction manuelle du poids pendant la série n'est jamais écrasée par un re-render)
function asEvoSync(x){
  if(!x||!x.evo||x.bonusMode) return;
  if(x._evoAt===AS.setIdx) return;
  var w=asEvoWeightFor(x,AS.setIdx);
  if(w!=null) x.weight=w;
  x._evoAt=AS.setIdx;
}
function asStartEvo(key){
  var x=AS&&AS.exos?AS.exos.find(function(e){return e.key===key;}):null;
  if(!x) return;
  var curRef=getCurrentWeight(key);
  var to=(AS.suggestW&&AS.suggestW[key]!=null&&AS.suggestW[key]>curRef)?AS.suggestW[key]:curRef+(x.repT?x.inc:1);
  if(!DB.evolution) DB.evolution={};
  DB.evolution[key]={from:curRef,to:to,hi:Math.max(1,Math.floor((x.n||4)/2))};
  saveDB(); asSave(); asRender();
  showToast('&#x26A1; &#xC9;volution lanc&#xE9;e : '+getExoName(key)+' '+curRef+'&#x2192;'+to+' '+x.unite+' d&#xE8;s la prochaine s&#xE9;ance');
}
function asStopEvo(key){
  if(DB.evolution&&DB.evolution[key]){ delete DB.evolution[key]; saveDB(); }
  if(AS){ asSave(); asRender(); }
  showToast('&#xC9;volution arr&#xEA;t&#xE9;e &#x2014; r&#xE9;f&#xE9;rence inchang&#xE9;e ('+getCurrentWeight(key)+')');
}
// Fin de séance : fait avancer chaque évolution selon les séries réellement tenues au poids haut.
// Depuis le 22/08 le poids haut se fait en PREMIER (frais) : la 1re série au poids haut doit
// passer à la CIBLE PLEINE (série fraîche = pas d'excuse, doctrine série 1 du 14/08) ; les
// suivantes gardent la tolérance d'échec du 01/08 (≤2 reps sous la cible = tenue).
function asEvoEvaluate(){
  var out=[];
  (AS.exos||[]).forEach(function(x){
    if(!x.evo) return;
    var ev=asEvoOf(x.key); if(!ev) return;
    if(!liveExoCounted(x)) return; // exo pas mené au bout : l'évolution ne bouge pas
    var hiSets=(x.sets||[]).slice(0,x.n).filter(function(s){return (s.w!=null?s.w:x.weight)>=ev.to;});
    if(!hiSets.length) return; // séance faite sans toucher le palier haut (poids modifié à la main)
    var ok=hiSets.every(function(s,i){ var need=(i===0)?x.reps:x.reps-setTol(x.reps); return s.reps>=need; });
    if(!ok){ out.push({key:x.key,name:x.name,st:'retry',hi:ev.hi,n:x.n,from:ev.from,to:ev.to,unite:x.unite}); return; }
    if((ev.hi||1)>=x.n){
      // Tout l'exo tenu au poids haut → la référence bascule, l'évolution est terminée
      asApplyWeight(x.key,ev.to);
      delete DB.evolution[x.key]; saveDB();
      out.push({key:x.key,name:x.name,st:'done',to:ev.to,unite:x.unite});
    } else {
      ev.hi=Math.min(x.n,(ev.hi||1)+1); saveDB();
      out.push({key:x.key,name:x.name,st:'up',hi:ev.hi,n:x.n,from:ev.from,to:ev.to,unite:x.unite});
    }
  });
  return out;
}
function asApplyWeight(key,nw){
  nw=Math.max(0,Math.round(nw*2)/2);
  var arr=DB.weights[key]||[]; var today=todayStr();
  if(arr.length&&arr[arr.length-1].date===today){ arr[arr.length-1].val=nw; }
  else{ arr.push({date:today,val:nw}); }
  DB.weights[key]=arr; DB.weightSetDate[key]=today; saveDB();
  return nw;
}
function asPendingAfter(){
  for(var i=0;i<AS.exos.length;i++){ if(i!==AS.cur&&AS.exos[i].status==='pending') return i; }
  return -1;
}
// Numéro de la prochaine série d'un exo (les séries PASSÉES via « passer la série » comptent dans la position)
function asNextSetIdx(x){ return (x.sets||[]).length+(x.skippedSets||0)+1; }
// Suppressible du burger : bonus/ajoutés uniquement — JAMAIS les exos de la séance
// ni l'exo jambes choisi au départ du LiveUp (règle Adrien 02/08).
function asExoDeletable(x){ return liveExoSide(x)&&!x.legsPick; }
function asElapsedMin(){ return AS.startTs?Math.max(1,Math.round((Date.now()-AS.startTs)/60000)):0; }
function asPick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
// Tirage SANS REMISE à l'échelle d'un bilan (05/08, retour Adrien « ça se répète ») :
// une variante déjà servie sur un exo n'est resservie sur un autre que si tout le pool est épuisé.
var _asMsgUsed={};
function asPickFresh(arr){
  var free=arr.filter(function(t){return !_asMsgUsed[t];});
  var pool=free.length?free:arr;
  var t=pool[Math.floor(Math.random()*pool.length)];
  _asMsgUsed[t]=1; return t;
}

// Séries affichées AVEC leurs poids réels (04/08, demande Adrien) : le poids s'écrit en tête
// puis à CHAQUE changement en cours d'exo (test de charge ↗ / allègement ↘) — plus jamais le
// seul poids final qui masque un « 3 séries à 48 + 1 à 52 ». Gère les ressentis G/D (unilatéraux).
function fmtSetsW(x,sets){
  sets=sets||x.sets||[];
  var unite=x.unite||'kg';
  var exoW=(x.w!=null?x.w:x.weight);
  if(!sets.length) return exoW!=null?(exoW+' '+unite):'';
  // Quand l'unité COMPTÉE est déjà l'unité de charge (cardio : 20 min de « charge » = 20 min faites),
  // le préfixe de poids répéterait le même nombre — « 20 min · 20 min ». On ne garde que les séries.
  if(cntU(x)===unite) return sets.map(function(s){
    var f=AS_FEELS.find(function(ff){return ff.v===s.feel;});
    return cntShort(x,s.reps)+(f?f.ico:'');
  }).join(' &#xB7; ');
  var prevW=null,parts=[];
  sets.forEach(function(s){
    var w=(s.w!=null?s.w:exoW);
    var pre='';
    if(w!==prevW&&w!=null){
      var cls=prevW===null?'':(w>prevW?' up':' down');
      var arr=prevW===null?'':(w>prevW?'&#x2197;&#x202F;':'&#x2198;&#x202F;');
      pre='<strong class="setw'+cls+'">'+arr+w+'&#x202F;'+unite+'</strong> &#xB7; ';
      prevW=w;
    }
    var ic='';
    if(s.feelG&&s.feelD){
      var fg=AS_FEELS.find(function(ff){return ff.v===s.feelG;});
      var fd=AS_FEELS.find(function(ff){return ff.v===s.feelD;});
      ic=(fg?fg.ico:'')+(fd?fd.ico:'');
    } else {
      var f=AS_FEELS.find(function(ff){return ff.v===s.feel;});
      ic=(f?f.ico:'');
    }
    parts.push(pre+cntShort(x,s.reps)+ic);
  });
  return parts.join(' &#xB7; ');
}

// Stats fun sur un exo depuis le tout début du suivi.
// Les séances pré-mode-direct n'ont pas le détail série par série → on ESTIME :
// chaque exécution ancienne ≈ (séries prévues) séries et (séries × reps cibles) reps.
// Les séances en direct comptent leurs vraies séries/reps. Ça s'affinera avec le temps.
function asExoStats(key){
  var arr=DB.weights[key]||[];
  var start=arr.length?arr[0].val:0, cur=arr.length?arr[arr.length-1].val:0;
  var delta=Math.round((cur-start)*10)/10;
  var execs=0,series=0,reps=0,estim=false;
  var info=findExoIndex(key);
  var def=info?asParseSerie(info.exo):{n:3,reps:10};
  (DB.logs||[]).forEach(function(l){
    if(l.live&&l.live.exos){
      var lx=null; l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      if(lx){
        if(liveExoCounted(lx)) execs++;
        series+=(lx.sets||[]).length;
        (lx.sets||[]).forEach(function(s){reps+=(s.reps||0);});
      }
    } else if(info&&(l.sessions||[]).some(function(sid){ return sid==='exo:'+key||(sid===info.sid&&exoMainForLog(info,key,l.date)); })){
      execs++; series+=def.n; reps+=def.n*def.reps; estim=true;
    }
  });
  return {start:start,cur:cur,delta:delta,execs:execs,series:series,reps:reps,estim:estim,measures:arr.length,atW:getSessionsAtWeight(key)};
}
// Carte stats réutilisable (bulle du repos en mode séance + vue Progression sous le graphe)
function exoStatsHTML(key,title){
  var st=asExoStats(key);
  var info=findExoIndex(key);
  var unite=info?info.exo.unite:'kg';
  // Exos assistés : 45→20 d'assistance = +25 kg portés en plus, pas « −25 » (bug corrigé 14/08)
  var deltaTxt=asIsInverse(key)
    ?((st.delta<0?'&#x2212;':'+')+Math.abs(st.delta)+' '+unite+' d\'assistance'+(st.delta<0?' (= plus fort)':''))
    :((st.delta>0?'+':'')+st.delta+' '+unite);
  var approx=st.estim?'&#x2248;&#x202F;':'';
  return '<div class="as-statbubble">'
    +'<div class="as-sb-title">&#x1F4C8; '+(title||getExoName(key))+' &#x2014; depuis tes d&#xE9;buts</div>'
    +'<div class="as-sb-grid">'
    +'<div class="as-sb-item"><span>'+deltaTxt+'</span>de progression ('+st.start+'&#x2192;'+st.cur+')</div>'
    +'<div class="as-sb-item"><span>'+st.execs+'</span>fois travaill&#xE9;</div>'
    +'<div class="as-sb-item"><span>'+approx+st.series+'</span>s&#xE9;ries au total</div>'
    +'<div class="as-sb-item"><span>'+approx+st.reps+'</span>reps cumul&#xE9;es</div>'
    +'</div>'
    +'<div class="as-sb-foot">'+st.atW+' s&#xE9;ance'+(st.atW>1?'s':'')+' au poids actuel &#xB7; '+st.measures+' mesures'
    +(st.estim?' &#xB7; &#x2248; estim&#xE9; sur l\'historique d\'avant le mode direct':'')+'</div>'
    +'</div>';
}

// ── Sons (WebAudio — il s'entraîne au casque) ──
function asAudio(){
  if(!_asAudioCtx){ try{ _asAudioCtx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(_asAudioCtx&&_asAudioCtx.state==='suspended'){ try{_asAudioCtx.resume();}catch(e){} }
  return _asAudioCtx;
}
function asBeep(freq,dur,delay,vol){
  var ctx=asAudio(); if(!ctx) return;
  try{
    var t=ctx.currentTime+(delay||0);
    var o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(vol||0.25,t+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t+dur+0.05);
  }catch(e){}
}
function asSound(name){
  if(!AS||AS.sound===false) return;
  if(name==='tick'){ asBeep(880,0.09,0,0.22); }
  else if(name==='go'){ asBeep(660,0.12,0,0.3); asBeep(990,0.22,0.14,0.3); }
  else if(name==='set'){ asBeep(520,0.09,0,0.2); asBeep(780,0.12,0.1,0.22); }
  else if(name==='finish'){ asBeep(523,0.16,0,0.3); asBeep(659,0.16,0.17,0.3); asBeep(784,0.34,0.34,0.34); }
}
function asToggleSound(){ AS.sound=(AS.sound===false); asSave(); asRender(); }

// ── Chrono de repos ──
function asStartRest(seconds,phase){
  AS.restTotal=seconds; AS.restEnd=Date.now()+seconds*1000; AS.restOver=false;
  updateWorkoutPushTimer(AS.restEnd,'Repos terminé','Lance ta prochaine série !');
  if(phase) AS.phase=phase;
  _asLastBeepSec=null;
  asSave(); asEnsureTick();
}
function asStopRest(){ updateWorkoutPushTimer(null); AS.restEnd=null; AS.restOver=false; asSave(); }
function asRestRemain(){ return AS&&AS.restEnd?Math.max(0,Math.ceil((AS.restEnd-Date.now())/1000)):0; }
function asIsTimedExercise(x){ return !!x&&cntU(x)==='s'; }
function asWorkRemain(){ return AS&&AS.workTimerEnd?Math.max(0,Math.ceil((AS.workTimerEnd-Date.now())/1000)):0; }
function asEnsureWorkTimer(x){
  if(!asIsTimedExercise(x)||(AS.workTimerSet===AS.setIdx&&AS.workTimerKey===x.key)) return;
  AS.workTimerSet=AS.setIdx;
  AS.workTimerKey=x.key;
  AS.workTimerTotal=Math.max(1,Number(x.reps)||1);
  AS.workTimerEnd=Date.now()+AS.workTimerTotal*1000;
  updateWorkoutPushTimer(AS.workTimerEnd,'Temps écoulé','Ton exercice est terminé.');
  _asLastWorkBeepSec=null;
  asSave();
  asEnsureTick();
}
function asEnsureTick(){ if(_asTimer) return; _asTimer=setInterval(asTickFn,250); }
function asTickFn(){
  if(!AS){ if(_asTimer){clearInterval(_asTimer);_asTimer=null;} return; }
  if(AS.restEnd){
    var restRem=asRestRemain();
    if(restRem<=3&&restRem>0&&restRem!==_asLastBeepSec){ _asLastBeepSec=restRem; asSound('tick'); }
    asUpdateRestUI(restRem);
    if(restRem<=0){
      AS.restEnd=null;
      asSound('go');
      if(navigator.vibrate) navigator.vibrate([180,90,180]);
      asAfterRest();
    }
  }
  var current=AS.exos&&AS.exos[AS.cur];
  var workVisible=AS.step==='exo'&&AS.phase==='work'&&asIsTimedExercise(current)&&AS.workTimerSet===AS.setIdx&&AS.workTimerKey===current.key&&AS.workTimerEnd;
  var workActive=!!workVisible&&asWorkRemain()>0;
  if(workVisible){
    var workRem=asWorkRemain();
    if(workRem<=3&&workRem>0&&workRem!==_asLastWorkBeepSec){ _asLastWorkBeepSec=workRem; asSound('tick'); }
    asUpdateWorkTimerUI(workRem);
    if(workRem===0&&_asLastWorkBeepSec!==0){
      _asLastWorkBeepSec=0;
      asSound('finish');
      if(navigator.vibrate) navigator.vibrate([180,90,180]);
    }
  }
  if(!AS.restEnd&&!workActive){
    if(_asTimer){clearInterval(_asTimer);_asTimer=null;}
  }
}
function asUpdateWorkTimerUI(rem){
  var el=document.getElementById('as-work-time');
  if(el) el.textContent=formatTime(rem);
  var status=document.getElementById('as-work-timer-status');
  if(status) status.textContent=rem?'Temps restant':'Temps cible atteint';
}
function asUpdateRestUI(rem){
  var el=document.getElementById('as-rest-time');
  if(el) el.textContent=formatTime(rem);
  var ring=document.getElementById('as-ring-fg');
  if(ring&&AS.restTotal){
    var C=2*Math.PI*54;
    ring.style.strokeDashoffset=String(C*(1-rem/AS.restTotal));
  }
  var mini=document.getElementById('as-mini-rest');
  if(mini) mini.textContent=formatTime(rem);
  var bub=document.getElementById('asBubbleTime');
  if(bub) bub.textContent=rem>0?formatTime(rem):'';
}
function asAfterRest(){
  if(!AS) return;
  if(AS.phase==='rest'){ AS.phase='work'; asSave(); asRender(); }
  else if(AS.phase==='exorest'){ asGotoNextPending(); }
  else if(AS.phase==='ask'){ AS.restOver=true; asSave(); var h=document.getElementById('as-ask-hint'); if(h) h.innerHTML='&#x23F1; Repos termin&#xE9; &#x2014; valide et encha&#xEE;ne !'; }
  asRenderBubble();
}
function asSkipRest(){ updateWorkoutPushTimer(null); AS.restEnd=null; AS.restOver=false; asSave(); if(AS.phase==='rest'){AS.phase='work';asRender();} else if(AS.phase==='exorest'){asGotoNextPending();} }
function asAddRest(sec){ if(AS.restEnd){ AS.restEnd+=sec*1000; AS.restTotal+=sec; updateWorkoutPushTimer(AS.restEnd,'Repos terminé','Lance ta prochaine série !'); asSave(); asEnsureTick(); } }

// ── Ouverture / fermeture / bulle ──
function asOpen(){
  asLoad();
  if(!AS){
    AS={createdTs:Date.now(),step:'setup',sel:{sid:null,chosen:{},extras:[],legsMain:null},sound:true,
        startTs:null,exos:[],cur:0,setIdx:1,phase:'intro',introIdx:0,restEnd:null,restTotal:0,
        end:{energy:null,feeling:null,pain:null,painNote:''},applied:[],repIdx:0,hype:asPick(AS_HYPE)};
    asSave();
  }
  asShowOverlay();
}
// Reprendre une séance en direct déjà enregistrée AUJOURD'HUI (bouton ▶ Reprendre du modal jour) :
// reconstruit AS depuis log.live (exos, séries, statuts), décale startTs pour que la durée continue,
// et marque resumeLogId → asPersistLog REMPLACERA ce log (même id/date/heure) au lieu d'en créer un.
function asResumeLog(id){
  var l=null;
  (DB.logs||[]).forEach(function(x){ if(String(x.id)===String(id)) l=x; });
  if(!l||!l.live||!(l.live.exos||[]).length){ showToast('&#x26A0; Pas de d&#xE9;tail de s&#xE9;ance &#xE0; reprendre'); return; }
  asLoad();
  if(AS&&AS.startTs&&!confirm('Une séance est déjà en cours — la remplacer par la reprise de celle-ci ?')) return;
  var exos=[];
  l.live.exos.forEach(function(x){
    var e=asMakeExo(x.key,!!x.extra); if(!e) return;
    e.weight=(x.w!=null?x.w:e.weight); e.w0=(x.w0!=null?x.w0:e.w0);
    e.n=x.n||e.n; e.reps=x.reps||e.reps;
    e.status=x.status||'pending'; e.sets=(x.sets||[]).slice(); e.skippedSets=x.sk||0; e.pain=!!x.pain;
    if(x.main!=null) e.main=x.main; // statut principal/bonus gravé — une reprise ne le perd pas (31/08)
    if(e.status==='skipped'&&e.sets.length>=(e.n||3)) e.status='done'; // état hérité : jamais « écourté » à séries pleines
    exos.push(e);
  });
  if(!exos.length){ showToast('&#x26A0; Rien &#xE0; reprendre'); return; }
  var sid=null;
  (l.sessions||[]).forEach(function(s){ if(!sid&&s.indexOf('exo:')!==0&&s.indexOf('autre:')!==0) sid=s; });
  var sdata=sid?DATA.find(function(s){return s.id===sid;}):null;
  AS={createdTs:Date.now(),step:'exo',sel:{sid:sid,chosen:{},extras:[]},sound:true,
    startTs:Date.now()-(l.duration_min||0)*60000,
    exos:exos,cur:0,setIdx:1,phase:'intro',introIdx:0,restEnd:null,restTotal:0,
    end:{energy:l.energy||null,feeling:l.feeling||null,pain:(l.live.pain!=null?l.live.pain:null),painAny:liveLogPainAny(l.live),pains:liveLogPains(l.live),painNote:l.comment||'',context:l.live.context||null,stretch:l.live.stretch===true},
    applied:[],repIdx:0,hype:asPick(AS_HYPE),
    sname:sdata?sdata.name:'Exos &#xE0; la carte',sid:sid,stype:sdata?sdata.t:null,
    resumeLogId:l.id};
  AS.warmupDone=l.live.warmup===true;
  var nxt=-1;
  exos.forEach(function(x,i){ if(nxt<0&&x.status==='pending') nxt=i; });
  if(nxt>=0){ AS.cur=nxt; AS.setIdx=asNextSetIdx(exos[nxt]); AS.phase=exos[nxt].sets.length?'work':'intro'; }
  else {
    // Tout est fait → dernier exo ouvert en MODE BONUS (« s'arrêter là » possible, jamais de 5e série forcée)
    AS.cur=exos.length-1;
    var lx=exos[AS.cur];
    lx.bonusMode=true; lx.bonusFrom=lx.sets.length;
    AS.setIdx=lx.sets.length+1; AS.phase='work'; _asSheetOpen=true;
  }
  asSave();
  closeDayModal();
  asShowOverlay();
  showToast('&#x25B6; Reprise de la s&#xE9;ance &#x2014; encha&#xEE;ne !');
}
// Revoir le BILAN (4 slides) d'une séance détaillée depuis le modal jour — reconstruit AS en
// lecture : savedLogId = le log existant, donc rien n'est re-persisté ni dupliqué.
function asViewReport(id){
  var l=null;
  (DB.logs||[]).forEach(function(x){ if(String(x.id)===String(id)) l=x; });
  if(!l||!l.live||!(l.live.exos||[]).length){ showToast('&#x26A0; Pas de d&#xE9;tail pour cette s&#xE9;ance'); return; }
  var exos=[];
  l.live.exos.forEach(function(x){
    var e=asMakeExo(x.key,!!x.extra); if(!e) return;
    e.weight=(x.w!=null?x.w:e.weight); e.w0=(x.w0!=null?x.w0:e.w0);
    e.n=x.n||e.n; e.reps=x.reps||e.reps;
    e.status=x.status||'done'; e.sets=(x.sets||[]).slice(); e.skippedSets=x.sk||0; e.pain=!!x.pain;
    if(x.main!=null) e.main=x.main; // le bilan relu affiche les statuts gravés, pas ceux du programme du jour
    if(e.status==='skipped'&&e.sets.length>=(e.n||3)) e.status='done';
    exos.push(e);
  });
  if(!exos.length) return;
  var sid=null;
  (l.sessions||[]).forEach(function(s){ if(!sid&&s.indexOf('exo:')!==0&&s.indexOf('autre:')!==0) sid=s; });
  var sdata=sid?DATA.find(function(s){return s.id===sid;}):null;
  AS={createdTs:Date.now(),step:'report',sel:{sid:sid,chosen:{},extras:[]},sound:true,
    startTs:Date.now()-(l.duration_min||0)*60000,
    exos:exos,cur:0,setIdx:1,phase:'intro',introIdx:0,restEnd:null,restTotal:0,
    end:{energy:l.energy||null,feeling:l.feeling||null,pain:(l.live.pain!=null?l.live.pain:null),painAny:liveLogPainAny(l.live),pains:liveLogPains(l.live),painNote:l.comment||'',context:l.live.context||null,stretch:l.live.stretch===true},
    applied:[],repIdx:0,hype:asPick(AS_HYPE),
    sname:sdata?sdata.name:'Exos &#xE0; la carte',sid:sid,stype:sdata?sdata.t:null,
    savedLogId:l.id,viewOnly:true};
  AS.warmupDone=l.live.warmup===true;
  AS.coachNote=l.live.coachNote||null;
  asSave();
  closeDayModal();
  asShowOverlay();
}
function asShowOverlay(){
  var ov=document.getElementById('asOverlay'); if(!ov) return;
  try{ if(typeof PV!=='undefined') PV.pull(false); }catch(e){} // « Nous deux » : un mot frais de Melati avant le GO ?
  ov.classList.add('open');
  document.body.style.overflow='hidden';
  asRender(); asRenderBubble();
  if(AS&&AS.restEnd) asEnsureTick();
  else if(AS&&AS.step==='exo'&&AS.phase==='work'&&AS.exos&&AS.exos[AS.cur]&&asIsTimedExercise(AS.exos[AS.cur])){
    asEnsureWorkTimer(AS.exos[AS.cur]);
    if(AS.workTimerEnd>Date.now()) asEnsureTick();
  }
}
function asHideOverlay(){
  var ov=document.getElementById('asOverlay'); if(ov){ ov.classList.remove('open','as-exorest','as-mood-bad','as-mood-mid','as-mood-good','as-mood-top'); }
  document.body.style.overflow='';
}
function asMinimize(){ asHideOverlay(); asRenderBubble(); }
function asRenderBubble(){
  var b=document.getElementById('asBubble'); if(!b) return;
  var ov=document.getElementById('asOverlay');
  var open=ov&&ov.classList.contains('open');
  if(!AS||open){ b.style.display='none'; return; }
  var txt;
  if(AS.step==='setup'||AS.step==='ready') txt='LiveUp en pr&#xE9;paration';
  else if(AS.step==='warmup') txt=(AS.sname||'LiveUp')+' &#xB7; &#xE9;chauffement';
  else if(AS.step==='stretchend') txt='Bilan du LiveUp en attente'; // état hérité d'avant le 04/08
  else if(AS.step==='end'||AS.step==='report') txt='Bilan du LiveUp en attente';
  else{
    var x=AS.exos[AS.cur];
    txt=(AS.sname||'LiveUp')+' &#xB7; Exo '+(AS.cur+1)+'/'+AS.exos.length;
  }
  b.style.display='flex';
  b.innerHTML='<span class="as-bubble-dot"></span><span class="as-bubble-txt">'+txt+'</span><span class="as-bubble-time" id="asBubbleTime">'+(AS.restEnd?formatTime(asRestRemain()):'')+'</span>';
}

// ── Rendu principal ──
function asMoodClass(){
  if(AS.step!=='report') return '';
  var g=asGlobalScore();
  return g<7?'as-mood-bad':g<11?'as-mood-mid':g<15?'':g<18?'as-mood-good':'as-mood-top';
}
function asRender(){
  var body=document.getElementById('asBody'); if(!body||!AS) return;
  var renderKey=AS.step+'|'+(AS.phase||'')+'|'+(AS.step==='report'?(AS.repIdx||0):'');
  var previousKey=body.getAttribute('data-render-key');
  var html='';
  if(AS.step==='setup') html=asRenderSetup();
  else if(AS.step==='setup2') html=asRenderSetup2();
  else if(AS.step==='ready') html=asRenderReady();
  else if(AS.step==='warmup') html=asRenderWarmup();
  else if(AS.step==='exo') html=asRenderExo();
  else if(AS.step==='stretchend') html=asRenderEnd(); // état hérité (étape supprimée le 04/08)
  else if(AS.step==='end') html=asRenderEnd();
  else if(AS.step==='report') html=asRenderReport();
  if(typeof STEPS!=='undefined') STEPS.renderPreservingScroll(body,html,previousKey===renderKey);
  else body.innerHTML=html;
  body.setAttribute('data-render-key',renderKey);
  body.classList.remove('as-anim-fwd','as-anim-back');
  void body.offsetWidth;
  body.classList.add(_asDir==='back'?'as-anim-back':'as-anim-fwd');
  _asDir='fwd';
  if(AS.step==='report') animCountUpAll(body); // chiffres qui montent sur le bilan
  var ov=document.getElementById('asOverlay');
  if(ov){
    ov.classList.remove('as-exorest','as-mood-bad','as-mood-mid','as-mood-good','as-mood-top');
    if(AS.step==='exo'&&AS.phase==='exorest') ov.classList.add('as-exorest');
    var mc=asMoodClass(); if(mc) ov.classList.add(mc);
  }
  asRenderBubble();
}
// Header : grille 44 / 1fr / 44 → titre TOUJOURS centré. Sortie = icône nue à gauche,
// à droite une colonne burger puis son.
function asHeader(title,sub,showList){
  return '<div class="as-hdr">'
    +'<div class="as-hdr-left">'
    +'<button class="as-exit" onclick="asMinimize()" title="R&#xE9;duire &#x2014; la s&#xE9;ance continue">'+AS_EXIT_SVG+'</button>'
    +(asCanBack()?'<button class="as-hbtn as-backbtn" onclick="asBack()" title="Retour">&#x2039;</button>':'')
    +'</div>'
    +'<div class="as-hdr-mid"><div class="as-hdr-title">'+title+'</div>'+(sub?'<div class="as-hdr-sub">'+sub+'</div>':'')+'</div>'
    +'<div class="as-hdr-right">'
    +(showList?'<button class="as-hbtn" onclick="asToggleSheet(true)" title="Liste des exercices">&#x2630;</button>':'')
    +'<button class="as-hbtn" onclick="asToggleSound()" title="Sons">'+(AS.sound===false?'&#x1F507;':'&#x1F50A;')+'</button>'
    +'</div></div>';
}
// Bouton retour du header (v3 — retour Adrien 14/08 : « je peux pas bien revenir en arrière ») :
// retour = ROUVRIR la dernière série validée (reps + ressenti + POIDS corrigeables), on remonte
// série par série jusqu'à la série 1, PUIS on continue dans l'exo PRÉCÉDENT (même terminé) —
// tout le LiveUp se remonte. intro slide N → slide N-1 · question → série en cours ·
// série/repos → dernière série validée · plus rien dans l'exo → dernier set de l'exo d'avant.
function asEditPend(x,idx){
  var s=x.sets[idx];
  return {reps:s.reps,feel:s.feel||null,feelG:s.feelG||null,feelD:s.feelD||null,
    w:(s.w!=null?s.w:x.weight),setNo:idx+1,editIdx:idx};
}
// Exo précédent (dans l'ordre de la séance) qui a au moins une série validée
function asPrevExoWithSets(){
  if(!AS||!AS.exos) return -1;
  for(var i=AS.cur-1;i>=0;i--){ if((AS.exos[i].sets||[]).length) return i; }
  return -1;
}
function asCanBack(){
  if(!AS||AS.step!=='exo') return false;
  var x=AS.exos[AS.cur];
  if(AS.phase==='ask'){ var p=AS.pend; return !p||p.editIdx==null||p.editIdx>0||asPrevExoWithSets()>=0; }
  if(AS.phase==='intro') return AS.introIdx>0||(x&&x.sets.length>0)||asPrevExoWithSets()>=0;
  if(AS.phase==='work') return true;
  if(AS.phase==='rest'||AS.phase==='exorest') return (x&&x.sets.length>0)||asPrevExoWithSets()>=0;
  return false;
}
// Saute sur le DERNIER set d'un exo précédent (édition en place — statuts et repos inchangés)
function asBackToPrevExo(){
  var pi=asPrevExoWithSets(); if(pi<0) return false;
  AS.cur=pi;
  var px=AS.exos[pi];
  AS.pend=asEditPend(px,px.sets.length-1);
  AS.phase='ask';
  return true;
}
function asBack(){
  if(!asCanBack()) return;
  var x=AS.exos[AS.cur];
  _asDir='back';
  if(AS.phase==='ask'&&AS.pend&&AS.pend.editIdx!=null){
    if(AS.pend.editIdx>0) AS.pend=asEditPend(x,AS.pend.editIdx-1); // série précédente (jusqu'à la série 1)
    else if(!asBackToPrevExo()) return; // série 1 → dernier set de l'exo d'avant
  }
  else if(AS.phase==='ask'&&AS.pend){ AS.pend=null; AS.phase='work'; } // annule la saisie, retour à la série en cours
  else if(AS.phase==='intro'&&AS.introIdx>0){ AS.introIdx--; }
  else if(x.sets.length>0){
    AS.pend=asEditPend(x,x.sets.length-1); // rouvre la dernière série validée (édition EN PLACE, le repos continue)
    AS.phase='ask';
  }
  else if(asBackToPrevExo()){ /* exo tout neuf → on remonte à l'exo d'avant */ }
  else if(AS.phase==='work'){ AS.phase='intro'; AS.introIdx=0; }
  asSave(); asRender();
}
// Dots exos — affichés EN BAS, juste au-dessus des boutons
function asDots(){
  var d='<div class="as-dots">';
  AS.exos.forEach(function(x,i){
    var c='as-dot';
    if(x.status==='done') c+=' done'; else if(x.status==='skipped') c+=' skip';
    if(i===AS.cur&&AS.step==='exo') c+=' cur';
    d+='<span class="'+c+'"></span>';
  });
  return d+'</div>';
}
function asSlideDots(n,cur,fnName){
  var d='<div class="as-dots as-dots-slides">';
  for(var i=0;i<n;i++){ d+='<span class="as-dot'+(i===cur?' cur':'')+'" onclick="'+fnName+'('+i+')"></span>'; }
  return d+'</div>';
}

// ── Écran 1 : CHOIX DE LA SÉANCE (v2 01/08 — grandes cartes, une par séance) ──
function asRenderSetup(){
  var sel=AS.sel;
  var h=asHeader('LiveUp','c\'est quoi le programme ce soir&#x202F;?',false);
  h+='<div class="as-scroll">';
  // Séance préparée à l'avance : lancement direct (✕ pour la retirer et pouvoir en composer une autre)
  if(DB.prepared){
    h+='<div class="as-prep-card" onclick="asLaunchPrepared()">'
      +'<span class="as-prep-ico">&#x26A1;</span>'
      +'<span class="as-bigcard-txt"><span class="as-bigcard-name">'+DB.prepared.sname+'</span>'
      +'<span class="as-bigcard-sub">pr&#xE9;par&#xE9;e &#xE0; l\'avance &#xB7; '+DB.prepared.count+' exercices</span></span>'
      +'<button class="as-prep-del" onclick="event.stopPropagation();asDeletePrepared()" title="Supprimer">&#x2715;</button>'
      +'<span class="as-bigcard-go">&#x25B6;</span></div>';
  }
  h+='<div class="as-choose">';
  DATA.forEach(function(s){
    var vis=s.exos.filter(function(e){return !e.hidden;});
    if(!vis.length) return;
    var mains=vis.filter(function(e){return !e.bonus;}).length;
    var bonus=vis.length-mains;
    h+='<button class="as-bigcard'+(sel.sid===s.id?' on':'')+'" data-t="'+s.t+'" onclick="asChooseSeance(\''+s.id+'\')">'
      +'<span class="as-bigcard-ico">'+s.icon+'</span>'
      +'<span class="as-bigcard-txt"><span class="as-bigcard-name">'+s.name+'</span>'
      +'<span class="as-bigcard-sub">'+s.sub+'</span>'
      +'<span class="as-bigcard-ct">'+mains+' exos'+(bonus?' &#xB7; '+bonus+' bonus':'')+'</span></span>'
      +'<span class="as-bigcard-go">&#x203A;</span></button>';
  });
  h+='</div>';
  // Une séance préparée existe → pas de « à la carte » tant qu'elle n'est pas lancée ou supprimée (✕)
  if(!DB.prepared){
    h+='<button class="as-carte-link" onclick="asChooseCarte()">&#x1F3AF; Ou compose une s&#xE9;ance &#xE0; la carte &#x203A;</button>';
  }
  // Séance manuelle (autre sport, oubli) — reléguée ici en discret (04/08, l'ancien ＋ de la vue Séances)
  h+='<button class="as-carte-link as-manual-link" onclick="asManualEntry()">&#x270D;&#xFE0F; Ou enregistre une s&#xE9;ance manuelle <span class="as-lbl-hint">autre sport, oubli</span> &#x203A;</button>';
  h+='</div>';
  h+='<div class="as-foot"><button class="as-ghost-btn" onclick="asCancelSetup()">Annuler</button></div>';
  return h;
}
function asManualEntry(){ asCancelSetup(); edOpen(null); }
function asChooseSeance(sid){
  if(AS.sel.sid!==sid){ AS.sel.sid=sid; AS.sel.chosen={}; AS.sel.legsMain=null; }
  if(!AS.sel.extras) AS.sel.extras=[];
  AS.step='setup2'; asSave(); asRender();
}
function asChooseCarte(){
  AS.sel.sid=null; AS.sel.chosen={}; AS.sel.legsMain=null;
  if(!AS.sel.extras) AS.sel.extras=[];
  AS.step='setup2'; asSave(); asRender();
}
function asBackToChoose(){ _asDir='back'; AS.step='setup'; asSave(); asRender(); }

// ── Règle jambes (01/08) : une séance PUSH ou PULL doit embarquer AU MOINS 1 exo jambes.
// Anti-routine : si la dernière séance push/pull n'avait qu'UN exo jambes et que c'est le même
// qui est seul sélectionné → il faut en ajouter un 2e (le même reste autorisé, mais pas seul).
function asLegsKeys(){
  var s3=DATA.find(function(x){return x.id==='s3';});
  return s3?s3.exos.filter(function(e){return !e.hidden;}).map(function(e){return e.key;}):[];
}
function asLastLegsPick(){
  var legsKeys=asLegsKeys();
  var logs=(DB.logs||[]).slice().sort(function(a,b){return b.date.localeCompare(a.date)||((b.time||'').localeCompare(a.time||''));});
  for(var i=0;i<logs.length;i++){
    var l=logs[i];
    if(!(l.sessions||[]).some(function(sid){return sid==='s1'||sid==='s2';})) continue;
    var picked=[];
    if(l.live&&l.live.exos){ l.live.exos.forEach(function(x){ if(legsKeys.indexOf(x.key)>=0&&picked.indexOf(x.key)<0) picked.push(x.key); }); }
    else{ (l.sessions||[]).forEach(function(sid){ if(sid.indexOf('exo:')===0&&legsKeys.indexOf(sid.slice(4))>=0) picked.push(sid.slice(4)); }); }
    return picked; // la plus récente séance push/pull fait foi
  }
  return [];
}
// v3 (02/08) : l'exo jambes du jour est UN SEUL exo (sel.legsMain) et il est PRINCIPAL
// (il compte dans le /20). Les autres exos jambes se prennent en bonus comme le reste.
// Anti-routine : si c'est le même exo jambes seul que la dernière fois → il faut un 2e en bonus.
function asLegsRequirement(){
  var sel=AS.sel;
  if(!sel.sid) return {ok:true,msg:''};
  var s=DATA.find(function(x){return x.id===sel.sid;});
  if(!s||(s.t!=='push'&&s.t!=='pull')) return {ok:true,msg:''};
  if(!sel.legsMain) return {ok:false,msg:'&#x1F9B5; Choisis <strong>ton exo jambes du jour</strong> pour valider ta s&#xE9;ance.'};
  var legsKeys=asLegsKeys();
  var bonusLegs=(sel.extras||[]).filter(function(k){return legsKeys.indexOf(k)>=0&&k!==sel.legsMain;});
  var prev=asLastLegsPick();
  if(!bonusLegs.length&&prev.length===1&&prev[0]===sel.legsMain){
    return {ok:false,msg:'&#x1F9B5; <strong>'+getExoName(sel.legsMain)+'</strong> &#xE9;tait d&#xE9;j&#xE0; ton seul exo jambes la derni&#xE8;re fois &#x2014; garde-le si tu veux, mais ajoute un 2e exo jambes en bonus.'};
  }
  return {ok:true,msg:''};
}
// ── Règle abdos (04/08) : toute séance PUSH/PULL/LEGS doit embarquer AU MOINS 1 exo abdo,
// choisi AU SETUP (remplace le rituel posture de fin — les étirements vivent dans Détente 🧘).
function asAbdoRequirement(){
  var sel=AS.sel;
  if(!sel.sid) return {ok:true,msg:''}; // à la carte : libre
  var s=DATA.find(function(x){return x.id===sel.sid;});
  if(!s||s.t==='bonus') return {ok:true,msg:''};
  var keys=(sel.extras||[]).slice();
  if(sel.legsMain) keys.push(sel.legsMain);
  s.exos.forEach(function(e){
    if(e.hidden) return;
    if(sel.chosen[e.key]!==false&&(sel.chosen[e.key]===true||!e.bonus)) keys.push(e.key);
  });
  var has=keys.some(function(k){ var i=findExoIndex(k); return !!(i&&i.exo&&i.exo.cat==='abdo'); });
  if(has) return {ok:true,msg:''};
  return {ok:false,msg:'&#x1F525; Choisis <strong>ton exo abdo du jour</strong> (relev&#xE9;s, crunch lest&#xE9;, pallof, dead bug) &#x2014; il fait partie de chaque s&#xE9;ance.'};
}
// Marqueur d'exo dans les listes de choix (règle Adrien 02/08) :
// cle (U+1F511) = exo clé du profil · étoile = exo principal · rien = bonus. La clé gagne sur l'étoile.
function exoPickMark(e){
  if(!e) return '';
  if(e.cat) return ''; // abdos / poids de corps / cardio : pas d'étoile ni de clé (05/08, demande Adrien)
  if(e.imp) return '<span class="as-pick-b">&#x1F511;</span>';
  if(!e.bonus) return '<span class="as-pick-b">&#x2B50;</span>';
  return '';
}

// ── Écran 1b : PERSONNALISATION (exos de la séance, jambes du jour, bonus en boutons) ──
function asRenderSetup2(){
  var sel=AS.sel;
  if(!sel.extras) sel.extras=[];
  if(!sel.statusOv) sel.statusOv={};
  // Migration douce (31/08) : l'ancien carteSide (bonus à la carte) devient statusOv
  if(sel.carteSide){ Object.keys(sel.carteSide).forEach(function(k){ if(sel.carteSide[k]) sel.statusOv[k]='bonus'; }); delete sel.carteSide; }
  if(!sel.bFilter) sel.bFilter='all';
  var s=sel.sid?DATA.find(function(x){return x.id===sel.sid;}):null;
  var isPP=!!(s&&(s.t==='push'||s.t==='pull'));
  var h=asHeader(s?s.name:'&#xC0; la carte',s?'personnalise ta s&#xE9;ance':'choisis tes exercices',false);
  h+='<div class="as-scroll">';
  if(s){
    var vis=s.exos.filter(function(e){return !e.hidden;});
    // ── Bloc 1 : LA séance choisie (couleur par type, base verrouillée du jour) ──
    h+='<div class="as-sec sec-'+s.t+'">';
    h+='<div class="as-sec-head"><span>'+s.icon+' '+s.name+'</span><span class="as-sec-lock">&#x1F512; ta s&#xE9;ance</span></div>';
    h+='<div class="as-lbl">Exercices <span class="as-lbl-hint">d&#xE9;coche ce que tu ne feras pas</span></div>';
    h+='<div class="as-exo-picks">';
    vis.filter(function(e){return !e.bonus;}).forEach(function(e){
      var on=sel.chosen[e.key]!==false;
      h+='<button class="as-pick'+(on?' on':'')+'" onclick="asToggleExo(\''+e.key+'\',this)">'+exoPickMark(e)+e.name+'<span class="as-pick-tick">&#x2713;</span></button>';
    });
    h+='</div>';
    var bonusEx=vis.filter(function(e){return e.bonus;});
    if(bonusEx.length){
      h+='<div class="as-lbl">Bonus de la s&#xE9;ance <span class="as-lbl-hint">si t\'as le temps et l\'&#xE9;nergie</span></div>';
      h+='<div class="as-exo-picks">';
      bonusEx.forEach(function(e){
        var on=sel.chosen[e.key]===true;
        h+='<button class="as-pick'+(on?' on':'')+' bonus" onclick="asToggleExo(\''+e.key+'\',this)">'+exoPickMark(e)+e.name+'<span class="as-pick-tick">&#x2713;</span></button>';
      });
      h+='</div>';
    }
    h+='</div>';
    // ── Bloc 2 (violet) : l'exo JAMBES du jour — UN principal, obligatoire sur PUSH / PULL ──
    if(isPP){
      var req=asLegsRequirement();
      h+='<div class="as-sec sec-req as-legs-zone'+(req.ok?' ok':'')+'" style="animation-delay:.06s">';
      h+='<div class="as-sec-head"><span>&#x1F9B5; Ton exo jambes du jour</span><span class="as-sec-lock">1 seul &#x2014; principal</span></div>';
      h+='<div class="as-exo-picks" id="asLegsPicks">';
      var prev=asLastLegsPick();
      asLegsKeys().forEach(function(k){
        var on=sel.legsMain===k;
        var wasLast=prev.length===1&&prev[0]===k;
        h+='<button class="as-pick legs'+(on?' on':'')+'" data-k="'+k+'" onclick="asPickLegsMain(\''+k+'\')">'+getExoName(k)+(wasLast?' <em class="as-pick-last">derni&#xE8;re fois</em>':'')+'<span class="as-pick-tick">&#x2713;</span></button>';
      });
      h+='</div>';
      h+='<div class="as-legs-hint" id="asLegsHint" '+(req.ok?'style="display:none"':'')+'>'+req.msg+'</div>';
      h+='</div>';
    }
    // ── Bloc 3 (violet) : l'exo ABDO du jour — obligatoire sur toute séance salle (règle 04/08) ──
    if(s.t!=='bonus'){
      var reqA0=asAbdoRequirement();
      h+='<div class="as-sec sec-req'+(reqA0.ok?' ok':'')+'" id="asAbdoZone" style="animation-delay:.12s">';
      h+='<div class="as-sec-head"><span>&#x1F525; Ton exo abdo du jour</span><span class="as-sec-lock">1 obligatoire</span></div>';
      h+='<div class="as-exo-picks">';
      asAbdoOptions().forEach(function(e){
        var onA=(sel.extras||[]).indexOf(e.key)>=0;
        h+='<button class="as-pick legs'+(onA?' on':'')+'" data-k="'+e.key+'" onclick="asToggleExtra(\''+e.key+'\',this)">'+e.name+'<span class="as-pick-tick">&#x2713;</span></button>';
      });
      h+='</div>';
      h+='<div class="as-legs-hint" id="asAbdoHint" '+(reqA0.ok?'style="display:none"':'')+'>'+reqA0.msg+'</div>';
      h+='</div>';
    }
  }
  // ── Bloc 🎯 principal ↔ bonus (22/08 à la carte, étendu 31/08 à TOUTES les séances —
  // demande Adrien : machine en maintenance/prise → l'exo de remplacement doit pouvoir compter
  // comme PRINCIPAL, et un exo « en plus » doit pouvoir compter vraiment, pas juste en bonus).
  h+='<div class="as-sec sec-req ok" id="asCarteZone" style="animation-delay:'+(s?'.15s':'.12s')+'">'+asCarteZoneHtml()+'</div>';
  // ── Bloc 4 : COMPLÈTE ta séance — tous les autres exos, filtrables (05/08) :
  // chips par séance + « Jamais fait » + 🔋 muscles sous 15 séries (dès la 3e séance de la semaine)
  h+='<div class="as-sec sec-plus" style="animation-delay:.18s">';
  h+='<div class="as-sec-head"><span>&#x2795; Compl&#xE8;te ta s&#xE9;ance</span><span class="as-sec-lock">en bonus</span></div>';
  h+='<div class="as-chips" id="asBonusChips">'+asSetup2ChipsHtml()+'</div>';
  h+='<div id="asBonusList">'+asSetup2BonusListHtml()+'</div>';
  h+='</div>';
  // Simulation VOLUME en direct : plein = déjà fait cette semaine, clair = ta sélection (02/08)
  h+='<div class="as-volsim" id="asVolSim">'+asSetup2VolSimHtml()+'</div>';
  h+='</div>';
  var count=asCountSelection();
  var reqF=asLegsRequirement();
  var reqAF=asAbdoRequirement();
  var minOk=!sel.sid||count>=5; // une séance = 5 exos minimum (règle Adrien 01/08)
  var okAll=!!(count&&reqF.ok&&reqAF.ok&&minOk);
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asBackToChoose()">&#x2039;</button>'
    // Enregistrer la sélection pour un prochain LiveUp (03/08) — masqué si une séance préparée existe déjà
    +(DB.prepared?'':'<button class="as-ghost-btn" id="asSetup2Save" '+(okAll?'':'disabled')+' onclick="asSavePrepared()">&#x1F5D3; Pour plus tard</button>')
    +'<button class="as-cta" id="asSetup2Cta" '+(okAll?'':'disabled')+' onclick="asToReady()">Continuer &#x203A;<span class="as-cta-sub" id="asSetup2Sub">'+count+' exercice'+(count>1?'s':'')+(sel.sid&&!minOk?' &#xB7; min 5':'')+'</span></button>'
    +'</div>';
  return h;
}
// ── Choix PRINCIPAL / BONUS par exo (22/08 à la carte, généralisé 31/08 — demande Adrien) ──
// Défauts : programme de la séance (⭐ du programme = principal) · à la carte = tout principal ·
// extras ajoutés = bonus. L'écart au défaut vit dans sel.statusOv[key]='main'|'bonus'.
// Le statut se fige sur x.main dès la création des exos du LiveUp (asToReady) et reste
// modifiable en pleine séance via la liste du burger (asToggleMainAt).
function asSetupDefaultMain(k){
  var sel=AS.sel;
  if(!sel.sid) return true; // à la carte : tout principal par défaut
  if(k===sel.legsMain) return true; // l'exo jambes du jour est principal par règle (02/08)
  if(asSetupMainLocked(k)) return true; // legday : tous les exos jambes sont principaux (16/08)
  var s=DATA.find(function(x){return x.id===sel.sid;});
  var e=s?s.exos.find(function(x){return x.key===k&&!x.hidden;}):null;
  return !!(e&&!e.bonus); // principal du programme = principal, le reste (bonus/extras) = bonus
}
// Statut non négociable au setup : sur un LEGS, tout exo jambes est principal (règle 16/08,
// asApplyLegsMain le re-force de toute façon au gravage — la zone 🎯 doit dire la vérité).
function asSetupMainLocked(k){
  var sel=AS.sel;
  if(!sel.sid) return false;
  var s=DATA.find(function(x){return x.id===sel.sid;});
  return !!(s&&s.t==='legs'&&rankGroupOf(k)==='Jambes');
}
function asSetupEffMain(k){
  var ov=AS.sel.statusOv&&AS.sel.statusOv[k];
  if(ov) return ov==='main';
  return asSetupDefaultMain(k);
}
// Les exos actuellement sélectionnés (exos de la séance cochés + extras), pour la zone 🎯
function asSetupSelectedKeys(){
  var sel=AS.sel, keys=[];
  if(sel.sid){
    var s=DATA.find(function(x){return x.id===sel.sid;});
    if(s) s.exos.forEach(function(e){
      if(e.hidden) return;
      if(sel.chosen[e.key]!==false&&(sel.chosen[e.key]===true||!e.bonus)) keys.push(e.key);
    });
  }
  (sel.extras||[]).forEach(function(k){
    if(k===sel.legsMain) return; // sa zone violette dit déjà « principal »
    if(keys.indexOf(k)<0) keys.push(k);
  });
  return keys;
}
function asCarteZoneHtml(){
  var sel=AS.sel;
  var carte=!sel.sid;
  var keys=asSetupSelectedKeys();
  var h='<div class="as-sec-head"><span>&#x1F3AF; '+(carte?'Ta s&#xE9;ance &#xE0; la carte':'Principal &#x2194; bonus')+'</span><span class="as-sec-lock">&#x2B50; = principal (note /20)</span></div>';
  if(!keys.length) return h+'<div class="as-legs-hint">S&#xE9;lectionne tes exercices '+(carte?'en dessous':'au-dessus')+' &#x2014; ils appara&#xEE;tront ici. Un tap pour basculer principal &#x2194; bonus.</div>';
  h+='<div class="as-lbl">Un tap = principal &#x2194; bonus <span class="as-lbl-hint">machine HS ou prise ? ton rempla&#xE7;ant devient principal ici</span></div><div class="as-exo-picks">';
  keys.forEach(function(k){
    var main=asSetupEffMain(k);
    var locked=asSetupMainLocked(k);
    h+='<button class="as-pick '+(main?'legs on':'bonus')+'" data-k="'+k+'" onclick="asToggleCarteMain(\''+k+'\')">'
      +(main?'<span class="as-pick-b">'+(locked?'&#x1F512;':'&#x2B50;')+'</span>':'')+getExoName(k)
      +'<span class="as-pick-tick">'+(main?'&#x2713;':'bonus')+'</span></button>';
  });
  h+='</div>';
  return h;
}
function asToggleCarteMain(k){
  var sel=AS.sel;
  if(!sel.statusOv) sel.statusOv={};
  if(asSetupMainLocked(k)){ showToast('&#x1F9B5; Legday : tous les exos jambes sont principaux (r&#xE8;gle du 16/08).'); return; }
  var next=asSetupEffMain(k)?'bonus':'main';
  if(next===(asSetupDefaultMain(k)?'main':'bonus')) delete sel.statusOv[k]; // retour au défaut → pas d'écart à retenir
  else sel.statusOv[k]=next;
  var z=document.getElementById('asCarteZone');
  if(z) z.innerHTML=asCarteZoneHtml();
  asSave();
}
// ── Setup v2 (05/08) : blocs colorés + bonus filtrables ──
// Abdos proposés dans le bloc dédié : cat 'abdo', visibles, hors séance choisie (multi-sélection via extras)
function asAbdoOptions(){
  var sel=AS.sel, out=[];
  DATA.forEach(function(sx){
    if(sx.id===sel.sid) return;
    sx.exos.forEach(function(e){
      if(e.hidden||(e.cat||'')!=='abdo') return;
      if(out.some(function(o){return o.key===e.key;})) return;
      out.push(e);
    });
  });
  return out;
}
// Options du bloc bonus : tout le reste — on ne REPROPOSE jamais un exo déjà pris ailleurs
// (exos de la séance, exo jambes du jour, abdos qui vivent dans leur bloc dédié)
function asBonusOptions(){
  var sel=AS.sel, out=[];
  var s=sel.sid?DATA.find(function(x){return x.id===sel.sid;}):null;
  DATA.forEach(function(sx){
    if(sx.id===sel.sid) return;
    sx.exos.forEach(function(e){
      if(e.hidden) return;
      if(sel.sid&&(e.cat||'')==='abdo') return;
      if(sel.legsMain===e.key) return;
      if(s&&s.exos.some(function(se){return se.key===e.key;})) return;
      if(out.some(function(o){return o.e.key===e.key;})) return;
      out.push({e:e,sx:sx});
    });
  });
  return out;
}
function asExoNeverDone(key){
  try{ return execsBetween(key,'2026-03-01',todayStr())===0; }catch(e){ return false; }
}
function asWeekSalleCount(){
  var ws=rankMonday(todayStr());
  return (DB.logs||[]).filter(function(l){return l.date>=ws&&l.date<=todayStr()&&rankLogIsSalle(l);}).length;
}
// Volume (séries) de la SÉLECTION courante par muscle — partagé simulation / filtre 🔋
function asSelectionVol(){
  var extra={};
  var sel=AS.sel;
  var s=sel.sid?DATA.find(function(x){return x.id===sel.sid;}):null;
  if(s){
    s.exos.forEach(function(e){
      if(e.hidden) return;
      var on=sel.chosen[e.key]!==false&&(sel.chosen[e.key]===true||!e.bonus);
      if(on) volAddSets(extra,e.key,asParseSerie(e).n);
    });
  }
  if(sel.legsMain){ var li=findExoIndex(sel.legsMain); if(li) volAddSets(extra,sel.legsMain,asParseSerie(li.exo).n); }
  (sel.extras||[]).forEach(function(k){
    if(k===sel.legsMain) return;
    var i2=findExoIndex(k); if(i2) volAddSets(extra,k,asParseSerie(i2.exo).n);
  });
  return extra;
}
// Muscles encore sous 15 séries (fait + sélection) → le filtre 🔋 propose de quoi les remplir
function asGapGroups(){
  var end=todayStr(), start=rankMonday(end);
  var done=muscleVolume(start,end);
  var extra=asSelectionVol();
  return RADAR_GROUPS.map(function(g){return g.label;})
    .filter(function(lb){ return lb!=='Abdos'&&((done[lb]||0)+(extra[lb]||0))<15; }); // abdos : bloc dédié
}
function asSetup2ChipsHtml(){
  var f=AS.sel.bFilter||'all';
  var chips=[{id:'all',lbl:'Tout'}];
  DATA.forEach(function(sx){ if(sx.id!==AS.sel.sid) chips.push({id:sx.id,lbl:sx.icon+' '+sx.name}); });
  var opts=asBonusOptions();
  if(opts.some(function(o){return asExoNeverDone(o.e.key);})) chips.push({id:'new',lbl:'&#x1F195; Jamais fait'});
  if(asWeekSalleCount()>=2) chips.push({id:'gap',lbl:'&#x1F50B; En retard'});
  if(!chips.some(function(c){return c.id===f;})){ AS.sel.bFilter='all'; f='all'; }
  return chips.map(function(c){
    return '<button class="as-chip'+(f===c.id?' on':'')+'" onclick="asSetBFilter(\''+c.id+'\')">'+c.lbl+'</button>';
  }).join('');
}
function asSetup2BonusListHtml(){
  var sel=AS.sel, f=sel.bFilter||'all';
  var opts=asBonusOptions();
  function pickBtn(e){
    var on=(sel.extras||[]).indexOf(e.key)>=0;
    return '<button class="as-pick bonus'+(on?' on':'')+'" data-k="'+e.key+'" onclick="asToggleExtra(\''+e.key+'\',this)">'+exoPickMark(e)+e.name+'<span class="as-pick-tick">&#x2713;</span></button>';
  }
  var h='';
  if(f==='new'){
    var news=opts.filter(function(o){return asExoNeverDone(o.e.key);});
    if(!news.length) return '<div class="as-bonus-empty">Tout a d&#xE9;j&#xE0; &#xE9;t&#xE9; fait au moins une fois &#x1F389;</div>';
    h+='<div class="as-exo-picks">';
    news.forEach(function(o){ h+=pickBtn(o.e); });
    h+='</div>';
    return h;
  }
  if(f==='gap'){
    var gaps=asGapGroups();
    if(!gaps.length) return '<div class="as-bonus-empty">&#x1F50B; Tous les muscles sont &#xE0; 15+ s&#xE9;ries cette semaine &#x2014; rien &#xE0; rattraper.</div>';
    gaps.forEach(function(lb){
      var list=opts.filter(function(o){return rankGroupOf(o.e.key)===lb;});
      if(!list.length) return;
      h+='<div class="as-lbl">'+lb+' <span class="as-lbl-hint">sous 15 s&#xE9;ries cette semaine</span></div><div class="as-exo-picks">';
      list.forEach(function(o){ h+=pickBtn(o.e); });
      h+='</div>';
    });
    return h||'<div class="as-bonus-empty">Rien &#xE0; proposer pour les muscles en retard.</div>';
  }
  DATA.forEach(function(sx){
    if(sx.id===sel.sid) return;
    if(f!=='all'&&sx.id!==f) return;
    var catOpts=opts.filter(function(o){return o.sx.id===sx.id;}).map(function(o){return o.e;});
    if(!catOpts.length) return;
    if(sx.id==='sb'){
      OTHERS_CATS.forEach(function(c){
        var l2=catOpts.filter(function(e){return (e.cat||'corps')===c.id;});
        if(!l2.length) return;
        h+='<div class="as-lbl">'+c.ico+' '+c.lbl+(c.id==='cardio'?' <span class="as-lbl-hint">+100 pts &#xB7; max 2/sem</span>':'')+'</div><div class="as-exo-picks">';
        l2.forEach(function(e){ h+=pickBtn(e); });
        h+='</div>';
      });
    } else {
      h+='<div class="as-lbl">'+sx.icon+' '+sx.name+'</div><div class="as-exo-picks">';
      catOpts.forEach(function(e){ h+=pickBtn(e); });
      h+='</div>';
    }
  });
  return h;
}
// MAJ ciblée du bloc bonus (pas de re-render complet : la page ne saute pas)
function asSetBFilter(id){
  AS.sel.bFilter=id;
  var l=document.getElementById('asBonusList'); if(l) l.innerHTML=asSetup2BonusListHtml();
  var c=document.getElementById('asBonusChips'); if(c) c.innerHTML=asSetup2ChipsHtml();
  asSave();
}
// Enregistrer la sélection courante comme SÉANCE PRÉPARÉE (lancée depuis l'écran de choix, ✕ pour la retirer)
function asSavePrepared(){
  var _req=asLegsRequirement();
  if(!_req.ok){ showToast('&#x1F9B5; Il te faut ton exo jambes du jour'); return; }
  if(!asAbdoRequirement().ok){ showToast('&#x1F525; Il te faut ton exo abdo du jour'); return; }
  if(AS.sel.sid&&asCountSelection()<5){ showToast('&#x26A0; Une s&#xE9;ance = 5 exercices minimum'); return; }
  if(!asCountSelection()){ showToast('&#x26A0; S&#xE9;lectionne au moins un exercice'); return; }
  var s=AS.sel.sid?DATA.find(function(x){return x.id===AS.sel.sid;}):null;
  DB.prepared={
    sel:JSON.parse(JSON.stringify(AS.sel)),
    sname:s?s.name:'Exos &#xE0; la carte',
    count:asCountSelection(),
    date:todayStr()
  };
  saveDB();
  _asDir='back'; AS.step='setup'; asSave(); asRender();
  showToast('&#x26A1; S&#xE9;ance enregistr&#xE9;e &#x2014; elle t\'attend au prochain LiveUp');
}
function asLaunchPrepared(){
  if(!DB.prepared) return;
  AS.sel=JSON.parse(JSON.stringify(DB.prepared.sel));
  if(!AS.sel.extras) AS.sel.extras=[];
  AS.fromPrep=true;
  asToReady();
}
function asDeletePrepared(){
  if(!confirm('Supprimer la séance préparée ?')) return;
  DB.prepared=null;
  saveDB();
  asRender();
  showToast('S&#xE9;ance pr&#xE9;par&#xE9;e supprim&#xE9;e');
}
function asCountSelection(){
  var sel=AS.sel, c=0;
  if(sel.sid){
    var s=DATA.find(function(x){return x.id===sel.sid;});
    s.exos.forEach(function(e){
      if(e.hidden) return;
      var on=sel.chosen[e.key]!==false&&(sel.chosen[e.key]===true||!e.bonus);
      if(on) c++;
    });
  }
  if(sel.legsMain) c++;
  c+=(sel.extras||[]).length;
  return c;
}
// Volume par muscle projeté : semaine en cours (lundi → aujourd'hui) + la sélection du setup
function asSetup2VolSimHtml(){
  var end=todayStr(), start=rankMonday(end);
  var done=muscleVolume(start,end);
  var extra=asSelectionVol();
  return '<div class="mv-head">Ta semaine muscle par muscle <span class="mv-hint">compt&#xE9; en <strong>s&#xE9;ries</strong> (1 exo de 4&#xD7;8 = 4) &#xB7; les compos&#xE9;s cr&#xE9;ditent &#xBD; &#xE0; leurs muscles assistants &#xB7; plein = d&#xE9;j&#xE0; fait &#xB7; clair = s&#xE9;lection &#xB7; cible 10-20</span></div>'
    +muscleVolumeBarsHtml(done,extra,true);
}
// MAJ ciblée du pied de page (compteur + hint jambes + simulation volume) — AUCUN re-render :
// la page ne saute plus en haut à chaque sélection (retour Adrien 02/08)
function asRefreshSetup2Foot(){
  var vs=document.getElementById('asVolSim');
  if(vs){ try{ vs.innerHTML=asSetup2VolSimHtml(); }catch(e){} }
  var count=asCountSelection();
  var req=asLegsRequirement();
  var reqA=asAbdoRequirement();
  var minOk=!AS.sel.sid||count>=5;
  var allOk=!!(count&&req.ok&&reqA.ok&&minOk);
  var cta=document.getElementById('asSetup2Cta');
  if(cta){ if(allOk) cta.removeAttribute('disabled'); else cta.setAttribute('disabled',''); }
  var sv=document.getElementById('asSetup2Save');
  if(sv){ if(allOk) sv.removeAttribute('disabled'); else sv.setAttribute('disabled',''); }
  var sub=document.getElementById('asSetup2Sub');
  if(sub) sub.innerHTML=count+' exercice'+(count>1?'s':'')+(AS.sel.sid&&!minOk?' &#xB7; min 5':'');
  var hint=document.getElementById('asLegsHint');
  if(hint){ hint.innerHTML=req.msg; hint.style.display=req.ok?'none':''; }
  var hintA=document.getElementById('asAbdoHint');
  if(hintA){ hintA.innerHTML=reqA.msg; hintA.style.display=reqA.ok?'none':''; }
  var zone=document.querySelector('.as-legs-zone');
  if(zone) zone.classList.toggle('ok',req.ok);
  var zoneA=document.getElementById('asAbdoZone');
  if(zoneA) zoneA.classList.toggle('ok',reqA.ok);
  var zoneC=document.getElementById('asCarteZone');
  if(zoneC) zoneC.innerHTML=asCarteZoneHtml();
}
function asToggleExo(key,btn){
  var s=DATA.find(function(x){return x.id===AS.sel.sid;});
  var e=s?s.exos.find(function(x){return x.key===key;}):null;
  var cur=AS.sel.chosen[key];
  var isOn=cur!==false&&(cur===true||(e&&!e.bonus));
  AS.sel.chosen[key]=!isOn;
  if(isOn&&AS.sel.statusOv) delete AS.sel.statusOv[key]; // exo retiré → il reviendra à son statut par défaut
  if(btn) btn.classList.toggle('on',!isOn);
  asRefreshSetup2Foot();
  asSave();
}
function asToggleExtra(key,btn){
  var ex=AS.sel.extras||[];
  var i=ex.indexOf(key);
  if(i>=0) ex.splice(i,1); else ex.push(key);
  if(i>=0&&AS.sel.statusOv) delete AS.sel.statusOv[key]; // exo retiré → il reviendra à son statut par défaut si re-choisi
  AS.sel.extras=ex;
  if(btn) btn.classList.toggle('on',i<0);
  asRefreshSetup2Foot();
  asSave();
}
function asPickLegsMain(key){
  var sel=AS.sel;
  sel.legsMain=(sel.legsMain===key)?null:key;
  // il sort des bonus s'il y était (et son bouton bonus se décoche)
  if(sel.legsMain){
    sel.extras=(sel.extras||[]).filter(function(k){return k!==key;});
    var bb=document.querySelector('.as-exo-picks .as-pick.bonus[data-k="'+key+'"]');
    if(bb) bb.classList.remove('on');
  }
  var zone=document.getElementById('asLegsPicks');
  if(zone){
    Array.prototype.forEach.call(zone.querySelectorAll('.as-pick'),function(b){
      b.classList.toggle('on',b.getAttribute('data-k')===sel.legsMain);
    });
  }
  asRefreshSetup2Foot();
  asSave();
}
function asCancelSetup(){ if(AS.startTs){ asMinimize(); return; } asDiscard(); }
function asToReady(){
  var _req=asLegsRequirement();
  if(!_req.ok){ showToast('&#x1F9B5; Il te faut ton exo jambes du jour pour continuer'); return; }
  // Séance préparée AVANT la règle abdo (04/08) : on laisse passer, le hint fera le rappel au prochain setup
  if(!AS.fromPrep&&!asAbdoRequirement().ok){ showToast('&#x1F525; Il te faut ton exo abdo du jour pour continuer'); return; }
  if(AS.sel.sid&&asCountSelection()<5){ showToast('&#x26A0; Une s&#xE9;ance = 5 exercices minimum'); return; }
  var sel=AS.sel, list=[];
  if(sel.sid){
    var s=DATA.find(function(x){return x.id===sel.sid;});
    s.exos.forEach(function(e){
      if(e.hidden) return;
      var on=sel.chosen[e.key]!==false&&(sel.chosen[e.key]===true||!e.bonus);
      if(!on) return;
      var x=asMakeExo(e.key,!!e.bonus,e,s); // la définition de CETTE séance fait foi (cible/repos)
      if(x){ x.main=asSetupEffMain(e.key); list.push(x); } // statut FIGÉ dès la création (31/08 : choisi au setup, même sur une séance programme)
    });
    AS.sname=s.name; AS.sid=s.id; AS.stype=s.t;
  } else { AS.sname='Exos &#xE0; la carte'; AS.sid=null; AS.stype=null; }
  // Exo jambes du jour = PRINCIPAL (compte dans le /20, non supprimable) — règle Adrien 02/08
  if(sel.legsMain&&(AS.stype==='push'||AS.stype==='pull')){
    var lx=asMakeExo(sel.legsMain,false);
    if(lx){ lx.legsPick=true; lx.main=true; list.push(lx); }
  }
  var carte=!sel.sid; // séance 100% à la carte (22/08) : principal/bonus choisi exo par exo au setup
  sel.extras.forEach(function(k){
    if(k===sel.legsMain) return;
    if(list.some(function(li){return li.key===k;})) return; // déjà dans la séance (exo partagé)
    var isMain=asSetupEffMain(k);
    // x.extra garde la PROVENANCE (ajouté hors programme) — x.main porte le statut jugé (31/08)
    var x=asMakeExo(k,carte?!isMain:true);
    if(!x) return;
    x.main=isMain;
    list.push(x);
  });
  if(!list.length) return;
  // Les principaux d'abord, les bonus en fin de séance (l'ordre reste réglable à l'écran suivant)
  list.sort(function(a,b){ return (a.main===false?1:0)-(b.main===false?1:0); });
  AS.exos=list; AS.cur=0; AS.setIdx=1; AS.phase='intro'; AS.introIdx=0; AS.step='ready';
  asSave(); asRender();
}

// ── Écran 2 : prêt / motivation / ordre ──
function asRenderReady(){
  var h=asHeader('Pr&#xEA;t &#xE0; envoyer ?',AS.sname+' &#xB7; '+AS.exos.length+' exercices',false);
  h+='<div class="as-scroll as-center">';
  h+='<div class="as-hype-wrap"><div class="as-ready-hype">&#x1F525;</div>'
    +'<div class="as-hype-msg">&#xAB;&#x202F;'+(AS.hype||AS_HYPE[0])+'&#x202F;&#xBB;</div></div>';
  h+='<div class="as-lbl">Ordre des exercices <span class="as-lbl-hint">glisse avec &#x283F; pour r&#xE9;ordonner</span></div>';
  h+='<div class="as-order">';
  AS.exos.forEach(function(x,i){
    h+='<div class="as-orow">'
      +'<span class="as-drag" onpointerdown="asDragStart(event,'+i+',\'.as-orow\')" title="Glisser pour r&#xE9;ordonner">&#x283F;</span>'
      +'<span class="as-orow-name">'+x.name+(x.main===false?' <em>bonus</em>':(x.extra?' <em>+</em>':''))+'</span>'
      +'<span class="as-orow-meta">'+(x.repT&&cntU(x)===x.unite?'':x.weight+' '+x.unite+' &#xB7; ')+x.n+'&#xD7;'+cntShort(x,x.reps)+'</span></div>';
  });
  h+='</div></div>';
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asBackToSetup()">&#x2039; Retour</button>'
    +'<button class="as-cta as-cta-go" onclick="asGo()">GO &#x1F4AA;<span class="as-cta-sub">d&#xE9;marrer la s&#xE9;ance</span></button>'
    +'</div>';
  return h;
}
function asBackToSetup(){ _asDir='back'; AS.step='setup2'; asSave(); asRender(); }
// « Nous deux » (26/08) : si Melati a laissé un mot non lu → il s'ouvre en animation AVANT le GO
function asGo(){
  if(typeof PV!=='undefined'&&PV.hasUnread()){ PV.showLove(asGoReal); return; }
  asGoReal();
}
function asGoReal(){
  asAudio();
  // Séance lancée depuis la préparation → la séance préparée est consommée
  if(AS.fromPrep){ DB.prepared=null; saveDB(); AS.fromPrep=false; }
  initReminders();
  DB.reminders.workoutStartedDate=todayStr();
  saveDB();
  AS.startTs=Date.now(); AS.step='warmup'; AS.cur=0; AS.setIdx=1; AS.phase='intro'; AS.introIdx=0;
  asSound('go');
  asSave(); asRender();
}
// ── Étape ÉCHAUFFEMENT (02/08 — même esprit que les étirements de fin) ──
function asRenderWarmup(){
  var first=AS.exos[0];
  var items=(WARMUPS.common||[]).concat(WARMUPS[AS.stype]||[]);
  var h=asHeader('&#xC9;chauffement','5 min qui prot&#xE8;gent tes articulations',false);
  h+='<div class="as-scroll">';
  h+='<div class="as-warmup-note">&#x1F525; Un muscle chaud pousse plus fort et se blesse moins. 5 minutes, pas plus &#x2014; et tes premi&#xE8;res s&#xE9;ries te le rendent direct.</div>';
  h+='<div class="as-stretch-list" style="margin-top:.8rem;">';
  items.forEach(function(it){
    h+='<div class="as-stretch-item"><div class="as-sti-body"><div class="as-sti-name">'+it.name+'</div>'
      +'<div class="as-sti-dur">&#x23F1; '+it.dur+'</div>'
      +'<div class="as-sti-cue">'+it.cue+'</div></div></div>';
  });
  if(first){
    h+='<div class="as-stretch-item" style="border-color:rgba(113,255,180,.3);"><div class="as-sti-body">'
      +'<div class="as-sti-name">1 s&#xE9;rie &#xE0; vide &#x2014; '+first.name+'</div>'
      +'<div class="as-sti-dur">&#x23F1; 12-15 reps tr&#xE8;s l&#xE9;g&#xE8;res</div>'
      +'<div class="as-sti-cue">R&#xE9;p&#xE8;te le geste EXACT de ton 1er exo avant de charger &#x2014; la meilleure assurance qui existe.</div></div></div>';
  }
  h+='</div>';
  h+='<div style="text-align:center;margin-top:.9rem;"><button class="as-st-btn" id="as-st-btn" onclick="asStretchStart(300,\'&#x1F525; Chaud ? Alors GO !\')">&#x25B6; Chrono 5:00</button></div>';
  h+='</div>';
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asWarmupGo(false)">Passer</button>'
    +'<button class="as-cta as-cta-go" onclick="asWarmupGo(true)">&#xC9;chauff&#xE9; &#x2713;<span class="as-cta-sub">exo 1&#x202F;: '+(first?first.name:'')+'</span></button>'
    +'</div>';
  return h;
}
function asWarmupGo(done){
  if(_stTimer){ clearInterval(_stTimer); _stTimer=null; }
  AS.warmupDone=!!done;
  AS.step='exo'; AS.phase='intro'; AS.introIdx=0;
  asSave(); asRender();
}

// ── Écran 3 : exercice ──
function asRenderExo(){
  var x=AS.exos[AS.cur];
  if(!x) return asRenderEnd();
  var sub='Exo '+(AS.cur+1)+'/'+AS.exos.length+' &#xB7; '+asElapsedMin()+' min';
  var h=asHeader(AS.sname,sub,true);
  // Écrans série + timer : tout tient SANS scroll (retour Adrien 02/08)
  var fit=(AS.phase==='work'||AS.phase==='rest'||AS.phase==='exorest');
  h+='<div class="as-scroll'+(AS.phase!=='intro'?' as-center':'')+(fit?' as-fit':'')+'" data-t="'+(x.t||'')+'">';
  if(AS.phase==='intro') h+=asRenderIntro(x);
  else if(AS.phase==='work') h+=asRenderWork(x);
  else if(AS.phase==='ask') h+=asRenderAsk(x);
  else if(AS.phase==='rest') h+=asRenderRest(x,false);
  else if(AS.phase==='exorest') h+=asRenderRest(x,true);
  h+='</div>';
  h+=asDots();
  h+=asExoFoot(x);
  h+=asSheet();
  return h;
}
function asExoFoot(x){
  if(AS.phase==='intro'){
    var last=AS.introIdx>=2;
    return '<div class="as-foot">'
      +'<button class="as-ghost-btn" onclick="asIntroNav(-1)" '+(AS.introIdx===0?'disabled':'')+'>&#x2039;</button>'
      +'<button class="as-cta" onclick="'+(last?'asStartExo()':'asIntroNav(1)')+'">'
      +(last?'C\'est parti &#x1F4AA;<span class="as-cta-sub">s&#xE9;rie 1/'+x.n+'</span>':'Suivant &#x203A;<span class="as-cta-sub">'+(AS.introIdx===0?'les conseils':'les erreurs &#xE0; &#xE9;viter')+'</span>')
      +'</button>'
      +(last?'':'<button class="as-ghost-btn" onclick="asStartExo()" title="Passer l\'intro">&#x23E9;</button>')
      +'</div>';
  }
  return '';
}
function asIntroNav(d){
  _asDir=d<0?'back':'fwd';
  AS.introIdx=Math.max(0,Math.min(2,AS.introIdx+d));
  asSave(); asRender();
}
function asIntroGoto(i){ _asDir=i<AS.introIdx?'back':'fwd'; AS.introIdx=i; asSave(); asRender(); }
function asWeightRow(x,small){
  return '<div class="as-wrow'+(small?' small':'')+'">'
    +'<button class="as-wbtn" onclick="asChgW(-1)">&#x2212;</button>'
    +'<input class="as-winput" id="asW" type="number" step="0.5" min="0" value="'+x.weight+'" onblur="asSetW(this)" onkeydown="if(event.key===\'Enter\')this.blur()"/>'
    +'<span class="as-wunit">'+x.unite+'</span>'
    +'<button class="as-wbtn plus" onclick="asChgW(1)">+</button></div>';
}
// ⚠️ Le poids modifié EN séance est LOCAL à la séance (il tague les séries via s.w et
// module les RP au prorata) — la RÉFÉRENCE (DB.weights) ne s'édite que hors mode séance
// (panneau Séances) ou via « Appliquer +1 kg » du bilan (asApplySuggest).
function asChgW(dir){
  var x=AS.exos[AS.cur];
  var inc=x.repT?x.inc:1;
  x.weight=Math.max(0,Math.round((x.weight+dir*inc)*2)/2);
  if(x.repT) x.reps=x.weight;
  asSave();
  var inp=document.getElementById('asW'); if(inp) inp.value=x.weight;
  var chip=document.getElementById('as-wchip'); if(chip) chip.textContent=x.weight+' '+x.unite;
  // repTarget : la valeur réglée EST l'objectif de la série — l'objectif affiché doit suivre
  if(x.repT){ var tg=document.querySelector('.as-target-reps'); if(tg) tg.innerHTML=cntFmt(x,x.reps); }
}
function asSetW(input){
  var x=AS.exos[AS.cur];
  var v=parseFloat(input.value);
  if(isNaN(v)||v<0){ input.value=x.weight; return; }
  x.weight=Math.max(0,Math.round(v*2)/2);
  if(x.repT) x.reps=x.weight;
  input.value=x.weight; asSave();
}
// Intro en 3 slides : présentation → conseils → erreurs à éviter
function asRenderIntro(x){
  asEvoSync(x);
  var h='<div class="as-intro">';
  if(AS.introIdx===0){
    var hasImg=x.img&&IMGS[x.img];
    h+='<div class="as-exo-kicker">Exercice '+(AS.cur+1)+'</div>';
    h+='<div class="as-exo-name xl">'+x.name+'</div>';
    h+='<div class="as-exo-target">'+x.n+' s&#xE9;rie'+(x.n>1?'s':'')+' &#xD7; '+cntFmt(x,x.reps)+(x.uni?'/c&#xF4;t&#xE9;':'')
      +(x.rest>0?' &#xB7; repos '+(x.rest>=90?formatTime(x.rest):x.rest+'s'):'')+'</div>';
    // Record actuel de l'exo (22/08, demande Adrien) : la meilleure exécution passée, même juge
    // que la slide Classements (force estimée e1RM par série, toutes charges confondues).
    try{
      var _rs=recSessions(x.key,x.n).filter(function(s2){return (s2.sets||[]).length;});
      if(_rs.length){
        var _ro={inv:asIsInverse(x.key),isKg:/kg/.test(x.unite||'')&&!x.repT};
        _rs.sort(function(a,b){ var c=recCompare(a,b,x.n,_ro); return c!==0?c:a.date.localeCompare(b.date); });
        var _rb=_rs[0];
        h+='<div class="as-record-chip">&#x1F3C6; Record &#xE0; battre : '+recSetsFmt(_rb,x.unite,x.cnt)+' <em>'+formatDateShort(_rb.date)+'</em></div>';
      } else {
        h+='<div class="as-record-chip first">&#x1F3C6; Premi&#xE8;re fois &#x2014; la perf du jour pose le record.</div>';
      }
    }catch(e){}
    if(hasImg) h+='<div class="as-demo"><img src="'+IMGS[x.img]+'" alt="'+x.name+'" loading="lazy"/></div>';
    h+='<div class="as-cue">&#x27A1; '+x.cue+(x.bless?'<div class="cue-bless">&#x1FA79; '+x.bless+'</div>':'')+'</div>';
    h+='<div class="as-lbl" style="text-align:center;">Poids de travail <span class="as-lbl-hint">cette s&#xE9;ance seulement &#xB7; r&#xE9;f. '+x.w0+' '+x.unite+'</span></div>'+asWeightRow(x);
    if(x.evo) h+='<div class="as-evo-chip">&#x26A1; &#xC9;volution en cours : '+x.evo.from+'&#x2192;'+x.evo.to+' '+x.unite+' &#xB7; aujourd\'hui '+asEvoPlanStr(x)+' &#x2014; le poids se cale tout seul &#xE0; chaque s&#xE9;rie</div>';
  } else if(AS.introIdx===1){
    h+='<div class="as-exo-kicker">'+x.name+'</div>';
    h+='<div class="as-exo-name xl">&#x2713; &#xC0; faire</div>';
    h+='<div class="as-intro-list">';
    x.tips.forEach(function(t,i){ h+='<div class="as-do big" style="animation-delay:'+(i*0.08)+'s">'+t+'</div>'; });
    h+='</div>';
  } else {
    h+='<div class="as-exo-kicker">'+x.name+'</div>';
    h+='<div class="as-exo-name xl err">&#x2715; &#xC0; &#xE9;viter</div>';
    h+='<div class="as-intro-list">';
    x.errs.forEach(function(t,i){ h+='<div class="as-dont big" style="animation-delay:'+(i*0.08)+'s">'+t+'</div>'; });
    h+='</div>';
  }
  h+='</div>'+asSlideDots(3,AS.introIdx,'asIntroGoto');
  return h;
}
function asStartExo(){ AS.phase='work'; AS.setIdx=asNextSetIdx(AS.exos[AS.cur]); asSave(); asRender(); }
function asRenderWork(x){
  asEnsureWorkTimer(x);
  asEvoSync(x);
  var h='<div class="as-work">';
  h+='<div class="as-exo-kicker">'+AS.sname+'</div>';
  h+='<div class="as-exo-name lg">'+x.name+'</div>';
  if(x.evo&&!x.bonusMode) h+='<div class="as-evo-chip">&#x26A1; &#xC9;volution '+x.evo.from+'&#x2192;'+x.evo.to+' '+x.unite+' &#xB7; plan '+asEvoPlanStr(x)+'</div>';
  if(x.bonusMode){
    var bn=x.sets.length-(x.bonusFrom!=null?x.bonusFrom:x.n)+1;
    h+='<div class="as-serie-big"><span class="as-serie-lbl" style="color:var(--yellow)">S&#xC9;RIE BONUS</span><span class="as-serie-num">'+Math.max(1,bn)+'</span>'
      +'<span class="as-serie-target">volume gratuit &#xB7; <span id="as-wchip">'+x.weight+' '+x.unite+'</span></span></div>';
  } else {
    // Exo « repTarget » compté dans son unité de charge (cardio en min) : objectif et chip diraient
    // deux fois la même chose (« objectif 20 min · 20 min ») → on n'en affiche qu'un.
    var _same=x.repT&&cntU(x)===x.unite;
    h+='<div class="as-serie-big"><span class="as-serie-lbl">S&#xC9;RIE</span><span class="as-serie-num">'+AS.setIdx+'<em>/'+x.n+'</em></span>'
      +'<span class="as-serie-target">objectif <strong class="as-target-reps">'+cntFmt(x,x.reps)+'</strong>'+(x.uni?' par c&#xF4;t&#xE9;':'')
      +(_same?'<span id="as-wchip" hidden></span>':' &#xB7; <span id="as-wchip">'+x.weight+' '+x.unite+'</span>')+'</span></div>';
  }
  if(asIsTimedExercise(x)){
    h+='<div class="as-work-timer"><div class="as-work-timer-readout"><span class="as-work-time" id="as-work-time">'+formatTime(asWorkRemain())+'</span><span class="as-work-timer-status" id="as-work-timer-status">'+(asWorkRemain()?'Temps restant':'Temps cible atteint')+'</span></div>'
      +'</div>';
  }
  h+=asWeightRow(x,true);
  h+='<button class="as-bigdone" onclick="asSetDone()">&#x2713; S&#xE9;rie termin&#xE9;e</button>';
  if(x.bonusMode){
    h+='<button class="as-stopbonus" onclick="asStopBonus()">&#x2713; S\'arr&#xEA;ter l&#xE0;</button>';
  } else {
    // Passer UNE série ≠ passer l'exo — deux actions distinctes, discrètes (retour Adrien 02/08)
    h+='<div class="as-skip-row">'
      +'<button class="as-skip-pill" onclick="asSkipSet()">&#x23ED; Passer la s&#xE9;rie</button>'
      +'<button class="as-skip-pill" onclick="asSkipExo()">&#x23ED;&#x23ED; Passer l\'exo</button>'
      +'</div>';
    // Arrêt douleur/blessure (16/08, demande Adrien — genou) : distinct d'un skip. L'exo est
    // compté sur les séries faites, zéro malus, contexte « blessure » pré-rempli en fin de séance.
    h+='<div class="as-skip-row">'
      +'<button class="as-skip-pill pain" onclick="asStopPain()">&#x1FA79; J\'arr&#xEA;te &#x2014; douleur / blessure</button>'
      +'</div>';
  }
  // Chrono skippé par erreur (14/08) : relance le repos de l'exo sans rien perdre
  if(!AS.restEnd&&(x.sets.length>0||(x.skippedSets||0)>0)&&x.rest>0){
    h+='<div class="as-skip-row"><button class="as-skip-pill" onclick="asRestartRest()">&#x21BA; Relancer le repos ('+(x.rest>=90?formatTime(x.rest):x.rest+'s')+')</button></div>';
  }
  h+='</div>';
  return h;
}
// Relance le chrono de repos depuis l'écran de série (skip par erreur, retour en arrière...)
function asRestartRest(){
  var x=AS.exos[AS.cur]; if(!x||!x.rest) return;
  asStartRest(x.rest,'rest');
  asRender();
}
function asSetDone(){
  var x=AS.exos[AS.cur];
  updateWorkoutPushTimer(null);
  AS.workTimerEnd=null;
  AS.workTimerKey=null;
  AS.pend={reps:x.reps,feel:null,feelG:null,feelD:null,setNo:AS.setIdx};
  var isLastSet=!x.bonusMode&&AS.setIdx>=x.n;
  var hasNext=asPendingAfter()>=0;
  asSound('set');
  if(!isLastSet) asStartRest(x.rest,'ask');
  else if(hasNext) asStartRest(AS_INTER_REST,'ask');
  else { AS.phase='ask'; asStopRest(); }
  asSave(); asRender();
}
// Passer UNE série : elle est sautée sans être comptée, on avance dans l'exo.
// Sauter la dernière → l'exo se termine écourté (compté si règle « à 1 série près »).
function asSkipSet(){
  var x=AS.exos[AS.cur]; if(!x||x.bonusMode) return;
  updateWorkoutPushTimer(null);
  AS.workTimerEnd=null;
  AS.workTimerKey=null;
  if(AS.setIdx>=x.n){
    x.skippedSets=(x.skippedSets||0)+1;
    if(x.sets.length>=Math.max(1,x.n-1)){ x.status='done'; }
    else { x.status='skipped'; x.skippedBy='user'; }
    var counted=liveExoCounted(x);
    showToast(counted?'&#x23ED; Derni&#xE8;re s&#xE9;rie pass&#xE9;e &#x2014; exo compt&#xE9; ('+x.sets.length+'/'+x.n+')':'&#x23ED; '+x.name+' &#xE9;court&#xE9; (non comptabilis&#xE9;)');
    var nxt=asPendingAfter();
    if(nxt<0){ asFinishWorkout(); return; }
    asStartRest(AS_INTER_REST,'exorest');
    asSave(); asRender(); return;
  }
  x.skippedSets=(x.skippedSets||0)+1;
  AS.setIdx=asNextSetIdx(x);
  showToast('&#x23ED; S&#xE9;rie pass&#xE9;e &#x2192; s&#xE9;rie '+AS.setIdx+'/'+x.n);
  asSave(); asRender();
}
// Sortir du mode « séries bonus » : l'exo reste terminé (4/4 même sans série bonus faite)
function asStopBonus(){
  var x=AS.exos[AS.cur]; if(!x) return;
  var did=x.sets.length>(x.bonusFrom!=null?x.bonusFrom:x.n);
  x.bonusMode=false; delete x.bonusFrom;
  x.status='done';
  asStopRest();
  var nxt=asPendingAfter();
  if(nxt<0){ asFinishWorkout(); return; }
  if(did){ asStartRest(AS_INTER_REST,'exorest'); asSave(); asRender(); }
  else asGotoNextPending();
}
function asRenderAsk(x){
  var p=AS.pend||{reps:x.reps,feel:null};
  var h='<div class="as-mini-timer'+(AS.restEnd?'':' off')+'">&#x23F1; <span id="as-mini-rest">'+formatTime(asRestRemain())+'</span> repos</div>';
  h+='<div class="as-exo-kicker">'+x.name+'</div>';
  var _pLbl=p.setNo>x.n?'S&#xE9;rie bonus':'S&#xE9;rie '+p.setNo+'/'+x.n;
  h+='<div class="as-exo-name lg">'+(p.editIdx!=null?'&#x270E; Corriger la s&#xE9;rie '+p.setNo+'/'+x.n:_pLbl+' &#x2014; alors&#x202F;?')+'</div>';
  h+='<div class="as-ask-card">';
  h+='<div class="as-lbl">'+cntAsk(x)+(x.uni?' <span class="as-lbl-hint">par c&#xF4;t&#xE9;</span>':'')+'</div>';
  var _st=cntStep(x);
  h+='<div class="as-reps-row"><button class="as-wbtn" onclick="asPendReps(-'+_st+')">&#x2212;</button>'
    +'<span class="as-reps-val" id="asPendReps">'+cntShort(x,p.reps)+'</span>'
    +'<button class="as-wbtn plus" onclick="asPendReps('+_st+')">+</button></div>';
  // Correction d'une série validée (14/08) : le POIDS de la série se corrige ici aussi —
  // « je me suis trompé sur le poids » ne demande plus de passer par l'éditeur du calendrier.
  if(p.editIdx!=null&&cntU(x)!==x.unite){
    var _wst=x.repT?x.inc:1;
    h+='<div class="as-lbl" style="margin-top:.9rem;">Poids de cette s&#xE9;rie</div>';
    h+='<div class="as-reps-row"><button class="as-wbtn" onclick="asPendW(-'+_wst+')">&#x2212;</button>'
      +'<span class="as-reps-val" id="asPendW">'+(p.w!=null?p.w:x.weight)+'<small> '+x.unite+'</small></span>'
      +'<button class="as-wbtn plus" onclick="asPendW('+_wst+')">+</button></div>';
  }
  if(x.uni){
    // Exo unilatéral : un ressenti par côté (demande Adrien 01/08)
    h+='<div class="as-lbl" style="margin-top:.9rem;">&#x1F448; C&#xF4;t&#xE9; GAUCHE &#x2014; c\'&#xE9;tait comment ?</div>';
    h+='<div class="as-feel-row">';
    AS_FEELS.forEach(function(f){
      h+='<button class="as-feel'+(p.feelG===f.v?' on':'')+'" onclick="asPendFeel(\''+f.v+'\',\'g\')"><span>'+f.ico+'</span>'+f.lbl+'</button>';
    });
    h+='</div>';
    h+='<div class="as-lbl" style="margin-top:.7rem;">C&#xF4;t&#xE9; DROIT &#x1F449; &#x2014; c\'&#xE9;tait comment ?</div>';
    h+='<div class="as-feel-row">';
    AS_FEELS.forEach(function(f){
      h+='<button class="as-feel'+(p.feelD===f.v?' on':'')+'" onclick="asPendFeel(\''+f.v+'\',\'d\')"><span>'+f.ico+'</span>'+f.lbl+'</button>';
    });
    h+='</div>';
  } else {
    h+='<div class="as-lbl" style="margin-top:.9rem;">C\'&#xE9;tait comment ?</div>';
    h+='<div class="as-feel-row">';
    AS_FEELS.forEach(function(f){
      h+='<button class="as-feel'+(p.feel===f.v?' on':'')+'" onclick="asPendFeel(\''+f.v+'\')"><span>'+f.ico+'</span>'+f.lbl+'</button>';
    });
    h+='</div>';
  }
  var okFeel=x.uni?(p.feelG&&p.feelD):!!p.feel;
  h+='<div class="as-ask-hint" id="as-ask-hint">'+(AS.restOver?'&#x23F1; Repos termin&#xE9; &#x2014; valide et encha&#xEE;ne !':'')+'</div>';
  h+='<button class="as-cta as-cta-full" '+(okFeel?'':'disabled')+' onclick="asValidateSet()">Valider &#x2713;</button>';
  h+='</div>';
  return h;
}
function asPendReps(d){
  if(!AS.pend) return;
  AS.pend.reps=Math.max(0,AS.pend.reps+d);
  asSave();
  var x=AS.exos[AS.cur];
  var el=document.getElementById('asPendReps'); if(el) el.textContent=cntShort(x,AS.pend.reps);
}
// Correction du poids d'une série déjà validée (mode édition uniquement)
function asPendW(d){
  if(!AS.pend||AS.pend.editIdx==null) return;
  var x=AS.exos[AS.cur];
  var cur=AS.pend.w!=null?AS.pend.w:x.weight;
  AS.pend.w=Math.max(0,Math.round((cur+d)*2)/2);
  asSave();
  var el=document.getElementById('asPendW');
  if(el) el.innerHTML=AS.pend.w+'<small> '+x.unite+'</small>';
}
function asPendFeel(v,side){
  if(!AS.pend) return;
  if(side==='g') AS.pend.feelG=v;
  else if(side==='d') AS.pend.feelD=v;
  else AS.pend.feel=v;
  asSave(); asRender();
}
// Le plus dur des deux côtés donne le ressenti global de la série (compat notes /5, analyse, historique)
function asWorseFeel(a,b){
  var W={facile:0,ok:1,dur:2,echec:3};
  return (W[a]||0)>=(W[b]||0)?a:b;
}
function asValidateSet(){
  var x=AS.exos[AS.cur], p=AS.pend;
  if(!p) return;
  if(x.uni){ if(!p.feelG||!p.feelD) return; p.feel=asWorseFeel(p.feelG,p.feelD); }
  else if(!p.feel) return;
  // Édition EN PLACE d'une série déjà validée (via bouton retour) : on corrige, on ne ré-empile pas
  if(p.editIdx!=null){
    var s0=x.sets[p.editIdx];
    if(s0){
      s0.reps=p.reps; s0.feel=p.feel; if(x.uni){ s0.feelG=p.feelG; s0.feelD=p.feelD; }
      // 14/08 : le poids de la série se corrige aussi — et si c'est la DERNIÈRE série validée,
      // le poids de travail de l'exo suit (le prochain set repart du poids corrigé).
      if(p.w!=null){ s0.w=p.w; if(p.editIdx===x.sets.length-1&&x.status!=='done') x.weight=p.w; }
    }
    AS.pend=null;
    if(x.status==='done'){
      var nx=asPendingAfter();
      if(AS.restEnd&&nx>=0){ AS.phase='exorest'; asSave(); asRender(); return; }
      if(nx>=0){ asGotoNextPending(); return; }
      asFinishWorkout(); return;
    }
    AS.setIdx=asNextSetIdx(x);
    AS.phase=AS.restEnd?'rest':'work';
    asSave(); asRender(); return;
  }
  var set={reps:p.reps,feel:p.feel,w:x.weight};
  if(x.uni){ set.feelG=p.feelG; set.feelD=p.feelD; }
  x.sets.push(set);
  AS.pend=null;
  // Mode séries bonus : on boucle en travail tant qu'il ne dit pas « s'arrêter là »
  if(x.bonusMode){
    AS.setIdx=x.sets.length+1;
    AS.phase=AS.restEnd?'rest':'work';
    asSave(); asRender(); return;
  }
  var isLastSet=x.sets.length+(x.skippedSets||0)>=x.n;
  if(!isLastSet){
    AS.setIdx=asNextSetIdx(x);
    AS.phase=AS.restEnd?'rest':'work';
  } else {
    x.status='done';
    var nxt=asPendingAfter();
    if(nxt>=0){
      if(AS.restEnd){ AS.phase='exorest'; }
      else { asGotoNextPending(); asSave(); asRender(); return; }
    } else { asFinishWorkout(); return; }
  }
  asSave(); asRender();
}
// Bulle stats fun affichée pendant le repos
function asStatBubble(x){ return exoStatsHTML(x.key,x.name); }
function asRenderRest(x,inter){
  if(!inter) asEvoSync(x); // le poids affiché pour la prochaine série suit le plan d'évolution
  var rem=asRestRemain();
  var C=2*Math.PI*54;
  var nxtIdx=inter?asPendingAfter():-1;
  var nxt=nxtIdx>=0?AS.exos[nxtIdx]:null;
  var h='<div class="as-rest-wrap'+(inter?' inter':'')+'">';
  h+='<div class="as-rest-lbl">'+(inter?'Exo termin&#xE9; &#x1F389;':'Repos')+'</div>';
  if(inter){
    var lastGood=x.sets.length&&x.sets.every(function(s){return !setHardFail(s,x.reps);});
    h+='<div class="as-between-msg">'+asPick(lastGood?AS_BETWEEN_GOOD:AS_BETWEEN_ROUGH)+'</div>';
  }
  h+='<div class="as-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="7"/>'
    +'<circle id="as-ring-fg" cx="60" cy="60" r="54" fill="none" stroke="'+(inter?'var(--yellow)':'var(--acc)')+'" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(AS.restTotal?(C*(1-rem/AS.restTotal)).toFixed(1):0)+'" transform="rotate(-90 60 60)"/></svg>'
    +'<div class="as-ring-center"><div class="as-ring-time" id="as-rest-time">'+formatTime(rem)+'</div><div class="as-ring-sub">'+(inter&&nxt?'ensuite&#x202F;:':'prochaine s&#xE9;rie')+'</div></div></div>';
  if(inter&&nxt) h+='<div class="as-next-exo">&#x1F449; '+nxt.name+'</div>';
  else if(!inter) h+='<div class="as-next-exo dim">'+(x.bonusMode?'S&#xE9;rie bonus':'S&#xE9;rie '+AS.setIdx+'/'+x.n)+' &#xB7; '+x.weight+' '+x.unite+'</div>';
  h+='<div class="as-rest-btns"><button class="as-ghost-btn" onclick="asAddRest(30)">+30s</button>'
    +(inter?'<button class="as-ghost-btn" onclick="asOneMoreSet()">&#x21BB; S&#xE9;ries bonus</button>':'')
    +'<button class="as-ghost-btn" onclick="asSkipRest()">Passer &#x23ED;</button></div>';
  h+=asStatBubble(inter&&nxt?nxt:x);
  h+='</div>';
  return h;
}
// « Séries bonus » à la fin d'un exo (repos inter-exos) : l'exo RESTE terminé,
// on empile du volume tant qu'il veut, « s'arrêter là » disponible à tout moment.
function asOneMoreSet(){
  var x=AS.exos[AS.cur]; if(!x) return;
  x.bonusMode=true;
  if(x.bonusFrom==null) x.bonusFrom=x.sets.length;
  AS.setIdx=x.sets.length+1;
  asStopRest();
  AS.phase='work';
  asSave(); asRender();
}
function asGotoNextPending(){
  var nxt=asPendingAfter();
  if(nxt<0){ asFinishWorkout(); return; }
  updateWorkoutPushTimer(null);
  AS.cur=nxt; AS.setIdx=asNextSetIdx(AS.exos[nxt]); AS.phase='intro'; AS.introIdx=0; AS.restEnd=null;
  asSave(); asRender();
}
function asSkipExo(){
  var x=AS.exos[AS.cur];
  updateWorkoutPushTimer(null);
  AS.workTimerEnd=null;
  AS.workTimerKey=null;
  x.status='skipped'; x.skippedBy='user';
  var counted=liveExoCounted(x);
  showToast(counted?'&#x23ED; '+x.name+' &#xE9;court&#xE9; ('+x.sets.length+'/'+x.n+' &#x2014; compt&#xE9; quand m&#xEA;me)':'&#x23ED; '+x.name+' pass&#xE9; (non comptabilis&#xE9;)');
  var nxt=asPendingAfter();
  if(nxt<0){ asFinishWorkout(); return; }
  AS.cur=nxt; AS.setIdx=asNextSetIdx(AS.exos[nxt]); AS.phase='intro'; AS.introIdx=0; AS.restEnd=null;
  asSave(); asRender();
}
// Arrêt sur douleur/blessure (16/08, demande Adrien après son genou au LEGS) : ce n'est PAS un
// skip — le travail fait est compté (dès 1 série), la note /5 se calcule sur les séries FAITES
// (zéro malus de séries manquantes), et le contexte de fin « blessure/douleur » est pré-rempli
// pour compenser les malus rank. Doctrine §4 : la douleur articulaire n'est jamais négociée.
function asStopPain(){
  var x=AS.exos[AS.cur]; if(!x) return;
  updateWorkoutPushTimer(null);
  AS.workTimerEnd=null;
  AS.workTimerKey=null;
  x.status='skipped'; x.skippedBy='pain'; x.pain=true;
  if(AS.end&&!AS.end.context) AS.end.context='blessure';
  var counted=liveExoCounted(x);
  showToast(counted
    ?'&#x1FA79; '+x.name+' arr&#xEA;t&#xE9; &#xE0; '+x.sets.length+'/'+x.n+' &#x2014; compt&#xE9;, jug&#xE9; sur les s&#xE9;ries faites (&#x2212;0,5/s&#xE9;rie manquante). Bien jou&#xE9; d\'&#xE9;couter la douleur.'
    :'&#x1FA79; '+x.name+' arr&#xEA;t&#xE9; (douleur) &#x2014; non compt&#xE9;, z&#xE9;ro malus.');
  asStopRest();
  var nxt=asPendingAfter();
  if(nxt<0){ asFinishWorkout(); return; }
  AS.cur=nxt; AS.setIdx=asNextSetIdx(AS.exos[nxt]); AS.phase='intro'; AS.introIdx=0; AS.restEnd=null;
  asSave(); asRender();
}
function asFinishWorkout(){
  updateWorkoutPushTimer(null);
  _asSheetOpen=false; _asSheetAdd=false;
  AS.exos.forEach(function(x){ x.bonusMode=false; delete x.bonusFrom; });
  // 04/08 : plus d'étape étirements dans le LiveUp — exos finis → questions de fin → bilan.
  // Les étirements vivent dans l'espace Détente (🧘), l'abdo du jour est choisi AU SETUP.
  AS.step='end'; AS.phase='intro'; asStopRest();
  asSound('finish');
  asSave(); asRender();
}
// (Étape « étirements de fin » supprimée le 04/08 — les étirements vivent dans l'espace Détente 🧘,
// le rituel posture y devient une routine quotidienne, et l'abdo du jour se choisit AU SETUP.)

// ── Sheet liste exos (v3 02/08 : drag & drop, croix rouge, vue ajout, 3 boutons) ──
function asSheet(){
  var h='<div class="as-sheet'+(_asSheetOpen?' open':'')+'" id="asSheet" onclick="if(event.target===this)asToggleSheet(false)"><div class="as-sheet-in" id="asSheetIn">';
  h+='<div class="as-sheet-grab"></div>';
  if(_asSheetAdd){
    h+=asSheetAddView();
    h+='</div></div>';
    return h;
  }
  var doneCt=AS.exos.filter(function(x){return x.status==='done';}).length;
  h+='<div class="as-sheet-title"><span>Ton LiveUp<small>'+doneCt+'/'+AS.exos.length+' exos termin&#xE9;s &#xB7; '+asElapsedMin()+' min</small></span><button class="as-hbtn" onclick="asToggleSheet(false)">&#x2715;</button></div>';
  AS.exos.forEach(function(x,i){
    var side=liveExoSide(x);
    var extraSets=x.sets.length>x.n?x.sets.length-x.n:0;
    var st=x.status==='done'?'&#x2705;':x.status==='skipped'?(x.pain?'&#x1FA79;':'&#x23ED;'):(i===AS.cur?'&#x25B6;':String(i+1));
    // Bonus jamais barrés (02/08) ; un écourté COMPTÉ non plus (16/08 — 2/4 séries = du vrai travail)
    var cls=(i===AS.cur?' cur':'')+(x.status==='done'?' is-done':'')+(x.status==='skipped'&&!side&&!liveExoCounted(x)?' is-skip':'');
    // Pastille statut tappable (31/08, demande Adrien) : ⭐ = principal (note /20), « bonus » sinon —
    // un tap la bascule, même en pleine séance (machine HS → le remplaçant devient principal).
    var pill=exoIsCardio(x.key)?'':' <button class="as-shmain'+(side?'':' on')+'" onclick="asToggleMainAt('+i+')" title="Basculer principal / bonus">'+(side?'bonus':'&#x2B50; principal')+'</button>';
    h+='<div class="as-shrow'+cls+'" data-i="'+i+'">'
      +'<span class="as-drag" onpointerdown="asDragStart(event,'+i+')" title="Glisser pour r&#xE9;ordonner">&#x283F;</span>'
      +'<span class="as-shst">'+st+'</span>'
      +'<span class="as-shname"><span class="as-shtop">'+x.name+pill+'</span><small>'+Math.min(x.sets.length,x.n)+'/'+x.n+' s&#xE9;ries'+(extraSets?' &#xB7; +'+extraSets+' bonus':'')+' &#xB7; '+x.weight+' '+x.unite+'</small></span>'
      +'<span class="as-shbtns">'
      +(x.status==='pending'&&i!==AS.cur?'<button class="go" onclick="asJumpTo('+i+')" title="Faire maintenant">&#x25B6;</button>':'')
      +(x.status==='pending'&&i!==AS.cur&&!side?'<button onclick="asSkipAt('+i+')" title="Sauter">&#x23ED;</button>':'')
      +(x.status==='done'?'<button class="go" onclick="asBonusAt('+i+')" title="S&#xE9;ries bonus">&#xFF0B;</button>':'')
      +(x.status==='skipped'?'<button onclick="asRedo('+i+')" title="Reprendre">&#x21BB;</button>':'')
      +(asExoDeletable(x)?'<button class="del" onclick="asDeleteAt('+i+')" title="Retirer de la s&#xE9;ance">&#x2715;</button>':'')
      +'</span></div>';
  });
  // ── Hypertrophie de la séance : l'avancée par muscle en HOLO ──
  // 16/08 (demande Adrien) : le holo montre TOUTE la séance prévue, pas seulement les séries
  // faites — chaque exo encore prévu pèse ses séries PROGRAMMÉES, un exo passé/écourté ne pèse
  // que ses séries faites, un exo annulé sans série ne pèse rien.
  try{
    var _hyStart=rankMonday(todayStr());
    var _hyBase=muscleVolume(_hyStart,todayStr());
    var _hyLive=AS.savedLogId?{}:asLivePlannedVol();
    h+='<div class="as-sheet-hype"><div class="as-sheet-hype-title">Hypertrophie hebdo <small>plein = d&#xE9;j&#xE0; fait &#xB7; <span class="holo-txt">holo = s&#xE9;ance pr&#xE9;vue</span></small></div>'
      +muscleVolumeBarsHtml(_hyBase,_hyLive,true,'holo')+'</div>';
  }catch(e){}
  h+='<div class="as-sheet-foot">'
    +'<button class="as-cta-mini" onclick="asSheetShowAdd(true)">&#xFF0B; Ajouter</button>'
    +'<button class="as-ghost-btn" onclick="asFinishNow()">&#x1F3C1; Terminer</button>'
    +'<button class="as-ghost-btn danger" onclick="asAbort()">Abandonner</button>'
    +'</div>';
  h+='</div></div>';
  return h;
}
// Vue « ajouter un exercice » v2 (14/08, demande Adrien) : le MÊME affichage qu'au setup —
// bonus de TA séance en priorité sur fond couleur, jambes et abdos en violet, chips de filtre
// (par séance, 🆕 jamais fait, 🔋 muscles en retard) et volume hebdo projeté. Les exos déjà
// dans la séance en cours ne sont jamais reproposés — SAUF s'ils ont été passés sans aucune
// série (bug corrigé 22/08, retour Adrien : un exo retiré ne réapparaissait plus jamais).
var _asAddFilter='all';
function asLiveAddOpts(){
  var out=[];
  DATA.forEach(function(sx){ sx.exos.forEach(function(e){
    if(e.hidden) return;
    // Un exo passé sans aucune série faite = « retiré » → il redevient proposable (asAddKey le ravive)
    if(AS.exos.some(function(x){return x.key===e.key&&!(x.status==='skipped'&&!(x.sets||[]).length);})) return;
    if(out.some(function(o){return o.e.key===e.key;})) return;
    out.push({e:e,sx:sx});
  });});
  return out;
}
// Le bloc jambes dédié ne s'affiche que sur un LiveUp PUSH/PULL (comme la règle jambes du setup)
function asLiveLegsBlock(){
  return !!(AS.sid&&(AS.stype==='push'||AS.stype==='pull'));
}
// Volume déjà engagé par la séance en cours (séries prévues, vraies séries si dépassées)
function asLiveVol(){
  var extra={};
  (AS.exos||[]).forEach(function(x){
    if(x.status==='skipped'&&!(x.sets||[]).length) return;
    volAddSets(extra,x.key,Math.max((x.sets||[]).length,x.n||0));
  });
  return extra;
}
function asLiveGapGroups(){
  var end=todayStr(), start=rankMonday(end);
  var done=muscleVolume(start,end);
  var extra=asLiveVol();
  return RADAR_GROUPS.map(function(g){return g.label;})
    .filter(function(lb){ return lb!=='Abdos'&&((done[lb]||0)+(extra[lb]||0))<15; });
}
function asAddPickBtn(e,cls){
  return '<button class="as-pick '+(cls||'bonus')+'" onclick="asAddKey(\''+e.key+'\')">'+exoPickMark(e)+e.name+'<span class="as-pick-tick">&#xFF0B;</span></button>';
}
// Options du bloc « complète » : hors séance du jour, hors abdos (bloc dédié), hors jambes si bloc dédié
function asLiveAddRestOpts(){
  var legsBlock=asLiveLegsBlock();
  return asLiveAddOpts().filter(function(o){
    if(o.sx.id===AS.sid) return false;
    if((o.e.cat||'')==='abdo') return false;
    if(legsBlock&&o.sx.id==='s3') return false;
    return true;
  });
}
function asLiveAddChipsHtml(){
  var f=_asAddFilter;
  var legsBlock=asLiveLegsBlock();
  var chips=[{id:'all',lbl:'Tout'}];
  DATA.forEach(function(sx){
    if(sx.id===AS.sid) return;
    if(legsBlock&&sx.id==='s3') return; // les jambes ont leur bloc violet dédié
    chips.push({id:sx.id,lbl:sx.icon+' '+sx.name});
  });
  var opts=asLiveAddRestOpts();
  if(opts.some(function(o){return asExoNeverDone(o.e.key);})) chips.push({id:'new',lbl:'&#x1F195; Jamais fait'});
  if(asWeekSalleCount()>=2) chips.push({id:'gap',lbl:'&#x1F50B; En retard'});
  if(!chips.some(function(c){return c.id===f;})){ _asAddFilter='all'; f='all'; }
  return chips.map(function(c){
    return '<button class="as-chip'+(f===c.id?' on':'')+'" onclick="asAddSetFilter(\''+c.id+'\')">'+c.lbl+'</button>';
  }).join('');
}
function asLiveAddListHtml(){
  var f=_asAddFilter;
  var opts=asLiveAddRestOpts();
  var h='';
  if(f==='new'){
    var news=opts.filter(function(o){return asExoNeverDone(o.e.key);});
    if(!news.length) return '<div class="as-bonus-empty">Tout a d&#xE9;j&#xE0; &#xE9;t&#xE9; fait au moins une fois &#x1F389;</div>';
    h+='<div class="as-exo-picks">';
    news.forEach(function(o){ h+=asAddPickBtn(o.e); });
    return h+'</div>';
  }
  if(f==='gap'){
    var gaps=asLiveGapGroups();
    if(!gaps.length) return '<div class="as-bonus-empty">&#x1F50B; Tous les muscles sont &#xE0; 15+ s&#xE9;ries cette semaine &#x2014; rien &#xE0; rattraper.</div>';
    gaps.forEach(function(lb){
      var list=opts.filter(function(o){return rankGroupOf(o.e.key)===lb;});
      if(!list.length) return;
      h+='<div class="as-lbl">'+lb+' <span class="as-lbl-hint">sous 15 s&#xE9;ries cette semaine</span></div><div class="as-exo-picks">';
      list.forEach(function(o){ h+=asAddPickBtn(o.e); });
      h+='</div>';
    });
    return h||'<div class="as-bonus-empty">Rien &#xE0; proposer pour les muscles en retard.</div>';
  }
  DATA.forEach(function(sx){
    if(f!=='all'&&sx.id!==f) return;
    var catOpts=opts.filter(function(o){return o.sx.id===sx.id;}).map(function(o){return o.e;});
    if(!catOpts.length) return;
    if(sx.id==='sb'){
      OTHERS_CATS.forEach(function(c){
        var l2=catOpts.filter(function(e){return (e.cat||'corps')===c.id;});
        if(!l2.length) return;
        h+='<div class="as-lbl">'+c.ico+' '+c.lbl+(c.id==='cardio'?' <span class="as-lbl-hint">+100 pts &#xB7; max 2/sem</span>':'')+'</div><div class="as-exo-picks">';
        l2.forEach(function(e){ h+=asAddPickBtn(e); });
        h+='</div>';
      });
    } else {
      h+='<div class="as-lbl">'+sx.icon+' '+sx.name+'</div><div class="as-exo-picks">';
      catOpts.forEach(function(e){ h+=asAddPickBtn(e); });
      h+='</div>';
    }
  });
  return h;
}
// MAJ ciblée (pas de re-render : la sheet ne saute pas)
function asAddSetFilter(id){
  _asAddFilter=id;
  var l=document.getElementById('asAddList'); if(l) l.innerHTML=asLiveAddListHtml();
  var c=document.getElementById('asAddChips'); if(c) c.innerHTML=asLiveAddChipsHtml();
}
function asSheetAddView(){
  var h='<div class="as-sheet-title"><span>Ajouter un exercice<small>il arrive en bonus &#x2014; sa pastille dans la liste le passe en principal</small></span><button class="as-hbtn" onclick="asSheetShowAdd(false)">&#x2039;</button></div>';
  var opts=asLiveAddOpts();
  var s=AS.sid?DATA.find(function(x){return x.id===AS.sid;}):null;
  // ── Bloc 1 : les exos restants de TA séance — proposés en priorité, fond couleur séance ──
  if(s){
    var mine=opts.filter(function(o){return o.sx.id===s.id;});
    if(mine.length){
      h+='<div class="as-sec sec-'+s.t+'"><div class="as-sec-head"><span>'+s.icon+' '+s.name+'</span><span class="as-sec-lock">en priorit&#xE9; &#x2014; ta s&#xE9;ance</span></div><div class="as-exo-picks">';
      mine.forEach(function(o){ h+=asAddPickBtn(o.e); });
      h+='</div></div>';
    }
  }
  // ── Bloc 2 (violet) : jambes — la règle jambes vaut aussi en cours de séance ──
  if(asLiveLegsBlock()){
    var legs=opts.filter(function(o){return o.sx.id==='s3';});
    if(legs.length){
      h+='<div class="as-sec sec-req ok"><div class="as-sec-head"><span>&#x1F9B5; Jambes</span></div><div class="as-exo-picks">';
      legs.forEach(function(o){ h+=asAddPickBtn(o.e,'legs'); });
      h+='</div></div>';
    }
  }
  // ── Bloc 3 (violet) : abdos ──
  var abdos=opts.filter(function(o){return (o.e.cat||'')==='abdo'&&o.sx.id!==AS.sid;});
  if(abdos.length){
    h+='<div class="as-sec sec-req ok"><div class="as-sec-head"><span>&#x1F525; Abdos</span></div><div class="as-exo-picks">';
    abdos.forEach(function(o){ h+=asAddPickBtn(o.e,'legs'); });
    h+='</div></div>';
  }
  // ── Bloc 4 : tout le reste, filtrable (mêmes chips qu'au setup) ──
  h+='<div class="as-sec sec-plus"><div class="as-sec-head"><span>&#x2795; Compl&#xE8;te ta s&#xE9;ance</span><span class="as-sec-lock">en bonus</span></div>';
  h+='<div class="as-chips" id="asAddChips">'+asLiveAddChipsHtml()+'</div>';
  h+='<div id="asAddList">'+asLiveAddListHtml()+'</div></div>';
  // Volume hebdo projeté : plein = déjà fait cette semaine, clair = ta séance en cours
  try{
    var end=todayStr(), start=rankMonday(end);
    h+='<div class="as-volsim"><div class="mv-head">Ta semaine muscle par muscle <span class="mv-hint">plein = d&#xE9;j&#xE0; fait &#xB7; clair = ta s&#xE9;ance en cours &#xB7; cible 10-20 s&#xE9;ries</span></div>'
      +muscleVolumeBarsHtml(muscleVolume(start,end),asLiveVol(),true)+'</div>';
  }catch(e){}
  return h;
}
function asSheetShowAdd(v){ _asSheetAdd=!!v; asRender(); }
function asAddKey(key){
  // L'exo est déjà dans la séance, passé sans série (= retiré) → on le RAVIVE au lieu d'en
  // empiler un doublon (bug corrigé 22/08 : il ne réapparaissait plus dans le menu d'ajout)
  var prev=AS.exos.find(function(e){return e.key===key;});
  if(prev){
    if(prev.status==='skipped'&&!(prev.sets||[]).length){
      prev.status='pending'; delete prev.pain; delete prev.skippedBy;
      _asSheetAdd=false;
      asSave(); asRender();
      showToast('&#x21BB; '+prev.name+' de retour dans ta s&#xE9;ance');
    }
    return;
  }
  var x=asMakeExo(key,true); if(!x) return;
  x.added=true;
  AS.exos.push(x);
  _asSheetAdd=false;
  asSave(); asRender();
  showToast('&#xFF0B; '+x.name+' ajout&#xE9; &#xE0; ta s&#xE9;ance');
}
function asToggleSheet(open){
  _asSheetOpen=!!open;
  var wasAdd=_asSheetAdd;
  if(!open) _asSheetAdd=false;
  var sh=document.getElementById('asSheet');
  if(sh) sh.classList.toggle('open',_asSheetOpen);
  if(!open&&wasAdd) asRender(); // referme la vue ajout pour la prochaine ouverture
}
// 31/08 (demande Adrien) : principal ↔ bonus se change AUSSI en pleine séance — machine en
// maintenance/prise → l'exo de remplacement compte comme PRINCIPAL dans la note /20, et un exo
// fait « en plus » peut compter vraiment. Le statut vit sur x.main, figé au gravage comme au setup.
function asToggleMainAt(i){
  var x=AS.exos[i]; if(!x) return;
  if(exoIsCardio(x.key)){ showToast('Le cardio ne se note pas &#x2014; il reste hors /20.'); return; }
  if(AS.stype==='legs'&&rankGroupOf(x.key)==='Jambes'){ showToast('&#x1F9B5; Legday : tous les exos jambes sont principaux (r&#xE8;gle du 16/08).'); return; }
  x.main=liveExoSide(x); // bonus → principal, principal → bonus
  asSave(); asRender();
  showToast(x.main
    ?'&#x2B50; '+x.name+' compte comme PRINCIPAL &#x2014; il entre dans la note /20.'
    :'&#x1F381; '+x.name+' passe en bonus &#x2014; not&#xE9; pour toi, hors note /20.');
}
function asJumpTo(i){
  var x=AS.exos[i]; if(!x||x.status!=='pending') return;
  updateWorkoutPushTimer(null);
  AS.cur=i; AS.setIdx=asNextSetIdx(x); AS.phase=x.sets.length?'work':'intro'; AS.introIdx=0; AS.restEnd=null;
  asToggleSheet(false); asSave(); asRender();
}
function asSkipAt(i){
  var x=AS.exos[i]; if(!x) return;
  x.status='skipped'; x.skippedBy='user';
  asSave(); asRender();
}
function asRedo(i){
  var x=AS.exos[i]; if(!x) return;
  updateWorkoutPushTimer(null);
  x.status='pending'; x.skippedSets=0; delete x.pain; delete x.skippedBy;
  AS.cur=i; AS.setIdx=asNextSetIdx(x); AS.phase=x.sets.length?'work':'intro'; AS.introIdx=0; AS.restEnd=null;
  asToggleSheet(false); asSave(); asRender();
}
// Séries bonus sur un exo TERMINÉ (bouton ＋ du burger) : il reste terminé, zéro 5e série forcée
function asBonusAt(i){
  var x=AS.exos[i]; if(!x||x.status!=='done') return;
  updateWorkoutPushTimer(null);
  x.bonusMode=true;
  if(x.bonusFrom==null) x.bonusFrom=x.sets.length;
  AS.cur=i; AS.setIdx=x.sets.length+1; AS.phase='work'; AS.introIdx=0; AS.restEnd=null;
  asToggleSheet(false); asSave(); asRender();
}
// Croix rouge : retirer un exo bonus/ajouté de la liste (les exos de la séance et
// l'exo jambes du départ ne sont pas supprimables)
function asDeleteAt(i){
  var x=AS.exos[i]; if(!x||!asExoDeletable(x)) return;
  if(x.sets.length&&!confirm('Retirer '+x.name+' ? Ses '+x.sets.length+' série(s) seront perdues.')) return;
  var wasCur=(i===AS.cur);
  AS.exos.splice(i,1);
  if(!AS.exos.length){ asDiscard(); return; }
  if(AS.cur>i) AS.cur--;
  if(wasCur){
    var idx=-1;
    AS.exos.forEach(function(e,k){ if(idx<0&&e.status==='pending') idx=k; });
    AS.cur=idx>=0?idx:Math.min(AS.cur,AS.exos.length-1);
    var c=AS.exos[AS.cur];
    AS.setIdx=asNextSetIdx(c); AS.phase=(c.status==='pending'&&!c.sets.length)?'intro':'work'; AS.introIdx=0;
    asStopRest();
  }
  asSave(); asRender();
}
// ── Drag & drop (poignée ⠿) — burger ET écran « Prêt » ──
// v2 (02/08 — l'insertion DOM en cours de geste cassait le drag sur iOS) : listeners au niveau
// document, la ligne suit le doigt en transform, les autres glissent visuellement, l'ordre
// n'est commité qu'au lâcher. Zéro mutation du DOM pendant le geste.
function asDragStart(ev,i,sel){
  if(ev.preventDefault) ev.preventDefault();
  if(_asDrag) return;
  sel=sel||'.as-shrow';
  var row=ev.target&&ev.target.closest?ev.target.closest(sel):null; if(!row) return;
  var parent=row.parentNode;
  var rows=Array.prototype.slice.call(parent.querySelectorAll(sel));
  var from=rows.indexOf(row); if(from<0) return;
  var r0=row.getBoundingClientRect();
  var step=rows.length>1?(rows[1].getBoundingClientRect().top-rows[0].getBoundingClientRect().top):r0.height+7;
  _asDrag={row:row,rows:rows,from:from,to:from,startY:ev.clientY,step:Math.max(step,r0.height),
    curKey:AS.exos[AS.cur]?AS.exos[AS.cur].key:null};
  row.classList.add('dragging');
  document.addEventListener('pointermove',asDragMove,{passive:false});
  document.addEventListener('pointerup',asDragEnd);
  document.addEventListener('pointercancel',asDragEnd);
  document.addEventListener('touchmove',asDragBlockScroll,{passive:false});
}
function asDragBlockScroll(e){ if(_asDrag) e.preventDefault(); }
function asDragMove(ev){
  if(!_asDrag) return;
  if(ev.preventDefault) ev.preventDefault();
  var d=_asDrag;
  if(!d.row.isConnected){ asDragEnd(ev); return; } // un re-render a détruit la liste → on lâche proprement
  var dy=ev.clientY-d.startY;
  d.row.style.transform='translateY('+dy+'px)';
  var to=Math.max(0,Math.min(d.rows.length-1,d.from+Math.round(dy/d.step)));
  if(to!==d.to){
    d.to=to;
    d.rows.forEach(function(r,k){
      if(r===d.row) return;
      var sh=0;
      if(k>d.from&&k<=to) sh=-d.step;
      else if(k<d.from&&k>=to) sh=d.step;
      r.style.transform=sh?'translateY('+sh+'px)':'';
    });
  }
}
function asDragEnd(){
  if(!_asDrag) return;
  var d=_asDrag; _asDrag=null;
  document.removeEventListener('pointermove',asDragMove);
  document.removeEventListener('pointerup',asDragEnd);
  document.removeEventListener('pointercancel',asDragEnd);
  document.removeEventListener('touchmove',asDragBlockScroll);
  d.row.classList.remove('dragging');
  d.rows.forEach(function(r){ r.style.transform=''; });
  if(d.to!==d.from&&d.from<AS.exos.length&&d.to<AS.exos.length){
    var moved=AS.exos.splice(d.from,1)[0];
    AS.exos.splice(d.to,0,moved);
    if(d.curKey){ AS.exos.forEach(function(x,k){ if(x.key===d.curKey) AS.cur=k; }); }
    asSave();
  }
  asRender();
}
function asFinishNow(){
  AS.exos.forEach(function(x){ if(x.status==='pending'&&!x.sets.length){ x.status='skipped'; x.skippedBy='auto'; } else if(x.status==='pending'){ x.status='done'; } });
  asToggleSheet(false);
  asFinishWorkout();
}
function asAbort(){
  if(!confirm('Abandonner la séance ? Rien ne sera enregistré.')) return;
  asDiscard();
}

// ── Écran 4 : questions de fin ──
// Logs d'avant le 07/10 : seule la douleur poignet existait (0 = aucune)
function liveLogPainAny(lv){ if(!lv) return null; if(lv.painAny!=null) return lv.painAny; if(lv.pain==null) return null; return lv.pain>0; }
function liveLogPains(lv){ if(!lv) return []; if(lv.pains) return lv.pains.map(function(p){return {z:p.z,lvl:p.lvl};}); return lv.pain>0?[{z:'poignet',lvl:lv.pain}]:[]; }
function asRenderEnd(){
  var e=AS.end;
  var h=asHeader('S&#xE9;ance termin&#xE9;e &#x1F4AA;',asElapsedMin()+' min &#xB7; '+AS.sname,false);
  h+='<div class="as-scroll">';
  function scale(lbl,field,from,to,hints){
    var v=e[field];
    var s='<div class="as-lbl">'+lbl+'</div><div class="as-scale-hint"><span>'+hints[0]+'</span><span>'+hints[1]+'</span></div><div class="as-scale">';
    for(var i=from;i<=to;i++){ s+='<button class="as-scale-btn'+(v===i?' on':'')+'" onclick="asEndSet(\''+field+'\','+i+')">'+i+'</button>'; }
    return s+'</div>';
  }
  h+=scale('&#x26A1; &#xC9;nergie pendant la s&#xE9;ance','energy',1,5,['&#xC0; plat','En feu']);
  h+=scale('&#x2B50; Ressenti global','feeling',1,5,['Tr&#xE8;s dur','Parfaite']);
  h+=asPainBlock(e);
  // Contexte de séance (optionnel) : explique une séance courte ou en retrait —
  // enrichit les données ET compense les malus rank (temps/blessure = 0 malus, énergie/malade = ÷2)
  var CTXS=[
    {v:null,ico:'&#x1F44C;',lbl:'RAS'},
    {v:'temps',ico:'&#x23F0;',lbl:'Manque de temps'},
    {v:'blessure',ico:'&#x1FA79;',lbl:'Blessure / douleur'},
    {v:'energie',ico:'&#x1F634;',lbl:'&#xC9;nergie / sommeil'},
    {v:'malade',ico:'&#x1F912;',lbl:'Malade'}
  ];
  h+='<div class="as-lbl">Un impr&#xE9;vu aujourd\'hui&#x202F;? <span class="as-lbl-hint">explique une s&#xE9;ance courte ou en retrait &#x2014; &#xE7;a compense les points</span></div>';
  h+='<div class="as-ctx-row">';
  CTXS.forEach(function(c){
    var on=(e.context||null)===c.v;
    h+='<button class="as-ctx-btn'+(on?' on':'')+'" onclick="asEndCtx('+(c.v?'\''+c.v+'\'':'null')+')">'+c.ico+' '+c.lbl+'</button>';
  });
  h+='</div>';
  h+='<div class="as-lbl">Note (optionnel)</div>';
  h+='<textarea class="as-note" id="asPainNote" rows="2" placeholder="Machine prise, douleur sur un exo, ce qui a bien march&#xE9;...">'+(e.painNote||'')+'</textarea>';
  // Exécutions au poids actuel (remplace « je me sens prêt à monter »)
  var doneEx=AS.exos.filter(function(x){return liveExoCounted(x);});
  if(doneEx.length){
    h+='<div class="as-lbl">&#x1F4CA; Ex&#xE9;cutions au poids actuel <span class="as-lbl-hint">aujourd\'hui inclus</span></div>';
    h+='<div class="as-execs">';
    doneEx.forEach(function(x){
      var n=getSessionsAtWeight(x.key)+1;
      h+='<div class="as-exec-row"><span class="as-exec-name">'+x.name+'</span><span class="as-exec-ct'+(n>=5?' hot':'')+'">'+n+' s&#xE9;ance'+(n>1?'s':'')+' &#xE0; '+x.weight+' '+x.unite+'</span></div>';
    });
    h+='</div>';
  }
  h+='</div>';
  var ok=e.energy&&e.feeling&&asPainAnswered(e);
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asBackToExo()">&#x2039; Retour</button>'
    +'<button class="as-cta" '+(ok?'':'disabled')+' onclick="asSaveAndReport()">Voir le bilan &#x203A;</button>'
    +'</div>';
  return h;
}
// ── Douleur de fin de séance (07/10, demande Adrien) : « une douleur ? » non/oui → où (plusieurs
// zones possibles) + intensité 1-5 par zone → quel exo a été raccourci à cause d'elle (optionnel).
// Un exo coché = arrêt douleur (x.pain) : jugé sur ses séries faites, comme le bouton 🩹 en séance.
// live.pain reste le niveau POIGNET (0 si pas de douleur au poignet) : le journal du poignet continue.
var PAIN_ZONES=[['poignet','Poignet'],['coude','Coude'],['epaule','&#xC9;paule'],['nuque','Nuque / cou'],['hautdos','Haut du dos'],
  ['basdos','Bas du dos'],['hanche','Hanche'],['genou','Genou'],['cheville','Cheville / pied'],['autre','Autre']];
function painZoneLabel(z){ for(var i=0;i<PAIN_ZONES.length;i++) if(PAIN_ZONES[i][0]===z) return PAIN_ZONES[i][1]; return z; }
function painZonesTxt(pains){ return (pains||[]).map(function(p){ return painZoneLabel(p.z).toLowerCase()+(p.lvl?' '+p.lvl+'/5':''); }).join(', '); }
function asPainAnswered(e){ return e.painAny===false||(e.painAny===true&&(e.pains||[]).length>0&&e.pains.every(function(p){return p.lvl>=1;})); }
function asPainShortened(){ // exos raccourcis ou passés : candidats « à cause de la douleur »
  return AS.exos.map(function(x,i){return {x:x,i:i};}).filter(function(o){ var d=(o.x.sets||[]).length; if(o.x.status==='pending') return false; if(o.x.pain) return true; if(!d&&liveExoSide(o.x)) return false; return d<(o.x.n||3); });
}
function asPainBlock(e){
  // Un arrêt douleur fait pendant la séance (bouton 🩹) répond déjà « oui »
  if(e.painAny==null&&AS.exos.some(function(x){return x.pain;})) e.painAny=true;
  var h='<div class="as-lbl">&#x1FA79; Une douleur pendant la s&#xE9;ance&#x202F;?</div><div class="as-ctx-row">'
    +'<button class="as-ctx-btn'+(e.painAny===false?' on':'')+'" onclick="asPainAny(false)">&#x1F44C; Non</button>'
    +'<button class="as-ctx-btn'+(e.painAny===true?' on':'')+'" onclick="asPainAny(true)">&#x1FA79; Oui</button></div>';
  if(e.painAny!==true) return h;
  var pains=e.pains||[];
  h+='<div class="as-lbl">O&#xF9;&#x202F;? <span class="as-lbl-hint">plusieurs zones possibles</span></div><div class="as-ctx-row">';
  PAIN_ZONES.forEach(function(z){
    var on=pains.some(function(p){return p.z===z[0];});
    h+='<button class="as-ctx-btn'+(on?' on':'')+'" onclick="asPainZone(\''+z[0]+'\')">'+z[1]+'</button>';
  });
  h+='</div>';
  pains.forEach(function(p){
    h+='<div class="as-lbl">'+painZoneLabel(p.z)+' &#x2014; intensit&#xE9;</div><div class="as-scale-hint"><span>L&#xE9;g&#xE8;re</span><span>Forte</span></div><div class="as-scale">';
    for(var i=1;i<=5;i++) h+='<button class="as-scale-btn'+(p.lvl===i?' on':'')+'" onclick="asPainLvl(\''+p.z+'\','+i+')">'+i+'</button>';
    h+='</div>';
  });
  var cand=asPainShortened();
  h+='<div class="as-lbl">Un exo raccourci &#xE0; cause de &#xE7;a&#x202F;? <span class="as-lbl-hint">optionnel &#x2014; il sera jug&#xE9; sur les s&#xE9;ries faites</span></div>';
  if(!cand.length) h+='<div class="as-lbl-hint" style="margin:-.3rem 0 .9rem;">Aucun exo &#xE9;court&#xE9; aujourd\'hui.</div>';
  else{
    h+='<div class="as-ctx-row">';
    cand.forEach(function(o){
      var x=o.x, d=(x.sets||[]).length;
      h+='<button class="as-ctx-btn'+(x.pain?' on':'')+'" onclick="asPainExo('+o.i+')">'+x.name+' <small>'+d+'/'+(x.n||3)+'</small></button>';
    });
    h+='</div>';
  }
  return h;
}
function asKeepEndNote(){ var note=document.getElementById('asPainNote'); if(note) AS.end.painNote=note.value; }
function asPainAny(v){
  asKeepEndNote();
  AS.end.painAny=v;
  if(!AS.end.pains) AS.end.pains=[];
  if(v===false){
    AS.end.pains=[];
    AS.exos.forEach(function(x){ if(x.pain){ x.pain=false; if(x.skippedBy==='pain') x.skippedBy='user'; } });
    if(AS.end.context==='blessure') AS.end.context=null;
  }
  asSave(); asRender();
}
function asPainZone(z){
  asKeepEndNote();
  var pains=AS.end.pains||(AS.end.pains=[]);
  var i=pains.findIndex(function(p){return p.z===z;});
  if(i>=0) pains.splice(i,1); else pains.push({z:z,lvl:null});
  asSave(); asRender();
}
function asPainLvl(z,v){
  asKeepEndNote();
  (AS.end.pains||[]).forEach(function(p){ if(p.z===z) p.lvl=v; });
  asSave(); asRender();
}
function asPainExo(i){
  asKeepEndNote();
  var x=AS.exos[i]; if(!x) return;
  if(x.pain){ x.pain=false; if(x.skippedBy==='pain') x.skippedBy='user'; }
  else{ x.pain=true; if(x.status==='skipped') x.skippedBy='pain'; if(!AS.end.context) AS.end.context='blessure'; }
  asSave(); asRender();
}
function asEndSet(field,v){
  var note=document.getElementById('asPainNote');
  if(note) AS.end.painNote=note.value;
  AS.end[field]=v; asSave(); asRender();
}
function asEndCtx(v){
  var note=document.getElementById('asPainNote');
  if(note) AS.end.painNote=note.value;
  AS.end.context=v; asSave(); asRender();
}
// Retour aux exos depuis les étirements : rouvre le dernier exo en MODE BONUS
// (jamais de série forcée ni d'exo re-marqué « pending »)
function asBackToExo(){
  _asDir='back';
  var idx=-1;
  AS.exos.forEach(function(x,i){ if(x.status==='pending') idx=(idx<0?i:idx); });
  AS.cur=idx>=0?idx:AS.exos.length-1;
  var x=AS.exos[AS.cur];
  if(x.status==='done'){ x.bonusMode=true; if(x.bonusFrom==null) x.bonusFrom=x.sets.length; }
  else if(x.status==='skipped'){ x.status='pending'; delete x.pain; delete x.skippedBy; }
  AS.setIdx=x.sets.length+1; AS.phase=(x.status==='pending'&&!x.sets.length)?'intro':'work'; AS.introIdx=0;
  AS.step='exo'; asSave(); asRender();
}
function asSaveAndReport(){
  var note=document.getElementById('asPainNote');
  if(note) AS.end.painNote=note.value;
  if(!AS.savedLogId){ asPersistLog(); }
  // Évolutions de charge : évaluées UNE fois, au moment où le log est figé (15/08)
  if(!AS.evoResults){ try{ AS.evoResults=asEvoEvaluate(); }catch(e){ AS.evoResults=[]; } }
  AS.step='report'; AS.repIdx=0; asSave(); asRender();
}
// Séance LEGS (16/08, demande Adrien — « le legday EST la séance principale ») : tous les exos
// JAMBES sont jugés comme des principaux — les bonus jambes (abducteurs, adducteurs, mollets…)
// entrent dans le /20. Le statut se fige sur x.main juste avant le gravage de la note.
function asApplyLegsMain(){
  if(typeof AS==='undefined'||!AS||AS.stype!=='legs') return;
  (AS.exos||[]).forEach(function(x){
    if(rankGroupOf(x.key)==='Jambes') x.main=true;
  });
}
function asPersistLog(){
  asApplyLegsMain();
  var sessions=[];
  if(AS.sid) sessions.push(AS.sid);
  AS.exos.forEach(function(x){
    // État hérité d'un passer/reprendre : toutes les séries faites = exo terminé, jamais « écourté »
    if(x.status==='skipped'&&(x.sets||[]).length>=(x.n||3)) x.status='done';
  });
  AS.exos.forEach(function(x){
    // Principal raté → pas de tag (couvert par la séance de toute façon) ;
    // bonus/ajouté → tagué dès la 1re série faite (règle 02/08 : tout ce qui est fait est enregistré).
    // À la carte (pas de tag séance) : TOUT exo avec ≥1 série garde son tag, principal compris (22/08).
    if(!liveExoCounted(x)&&!((liveExoSide(x)||!AS.sid)&&(x.sets||[]).length>0)) return;
    if(AS.sid&&!x.extra&&!x.added&&!x.legsPick) return; // couvert par la séance (l'exo jambes du jour, lui, est tagué)
    sessions.push('exo:'+x.key);
  });
  if(!sessions.length&&AS.sid) sessions.push(AS.sid);
  var d=getNow();
  // Séance reprise : on remplace le log d'origine (même id / date / heure) au lieu d'en créer un second
  var prevLog=null;
  if(AS.resumeLogId){
    for(var pi=0;pi<DB.logs.length;pi++){
      if(String(DB.logs[pi].id)===String(AS.resumeLogId)){ prevLog=DB.logs.splice(pi,1)[0]; break; }
    }
  }
  var logId=prevLog?prevLog.id:Date.now();
  // Niveau POIGNET (journal du poignet / chirurgien) dérivé de la question générale
  if(AS.end.painAny===false) AS.end.pain=0;
  else if(AS.end.painAny===true){ var _pw=(AS.end.pains||[]).find(function(p){return p.z==='poignet';}); AS.end.pain=_pw&&_pw.lvl?_pw.lvl:0; }
  var live={
    // main = statut principal/bonus FIGÉ au moment de la séance (15/08) : les refontes de
    // programme ne réécrivent plus les notes passées. note20 = la note /20 gravée (idem).
    exos:AS.exos.map(function(x){return {key:x.key,w:x.weight,w0:x.w0,n:x.n,reps:x.reps,unite:x.unite,cnt:x.cnt||null,status:x.status,extra:!!(x.extra||x.added),main:!liveExoSide(x),sets:x.sets,sk:x.skippedSets||0,pain:!!x.pain,evo:x.evo?{from:x.evo.from,to:x.evo.to,hi:x.evo.hi}:null};}),
    pain:AS.end.pain,painAny:AS.end.painAny,pains:(AS.end.pains||[]).filter(function(p){return p.lvl;}),painNote:AS.end.painNote||'',
    context:AS.end.context||null,
    stretch:AS.end.stretch===true,
    // (rituel posture de fin supprimé le 04/08 — abdo obligatoire au setup + routines dans Détente)
    warmup:AS.warmupDone===true
  };
  try{ live.note20=asGlobalScore(); }catch(e){} // la note /20 se grave ici, une fois pour toutes
  // Reprise après gel (26/08) : contexte figé avec la note — le coach relit la séance avec
  try{ live.reprise=gelRepriseCtx(prevLog?prevLog.date:todayStr()); }catch(e){ live.reprise=null; }
  DB.logs.push({id:logId,date:prevLog?prevLog.date:todayStr(),
    time:prevLog&&prevLog.time?prevLog.time:String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'),
    sessions:sessions,comment:AS.end.painNote||'',
    feeling:AS.end.feeling||null,energy:AS.end.energy||null,
    duration_min:asElapsedMin(),live:live});
  DB.logs.sort(function(a,b){return b.date.localeCompare(a.date)||((b.time||'').localeCompare(a.time||''));});
  if(!DB.painLog) DB.painLog=[];
  if(AS.end.pain!==null&&AS.end.pain!==undefined){
    DB.painLog=DB.painLog.filter(function(p){return p.date!==todayStr();});
    DB.painLog.push({date:todayStr(),level:AS.end.pain,zones:(AS.end.pains||[]).filter(function(p){return p.lvl;}),note:AS.end.painNote||''});
    DB.painLog.sort(function(a,b){return a.date.localeCompare(b.date);});
  }
  AS.savedLogId=logId;
  saveDB();
}

// ══════════════════════════════════════════════════
// NOTES & BILAN — /5 par exo, /20 global, moteur à règles (~80 messages)
// ══════════════════════════════════════════════════
// ⚠️ SÉMANTIQUE « ÉCHEC » (règle Adrien 01/08) : « échec » = ÉTAT en fin de série (allé au bout
// de ce que le muscle pouvait donner), PAS un ratage. Une série à l'échec qui atteint la cible —
// ou la frôle à 2 reps près (6/8, 8/10) — est une série RÉUSSIE : c'est exactement là que ça
// construit. Le seul vrai raté = échec à PLUS de 2 reps sous la cible (5/8, 7/10...).
// Cette règle s'applique partout : note /5, analyse du bilan, RP du rank.
// Tolérance « échec propre » PROPORTIONNELLE à la cible (19/08, audit notation) : la fenêtre
// fixe de 2 reps était calibrée pour des cibles de 8-10 — sur un exo métabolique à 15, un
// 12/15 à l'échec (80 % de la cible, RIR 0) était classé « vrai raté » comme un 5/8.
// Règle : 2 reps jusqu'à une cible de 12, ~20 % de la cible au-delà (15 → 3, 20 → 4).
function setTol(target){ return Math.max(2,Math.round((target||0)*0.2)); }
function setHardFail(s,target){
  if(s.feel!=='echec') return false;
  if(!target) return false;
  return s.reps<target-setTol(target);
}
// Série « pas menée au bout » (règle Adrien 02/08) : reps SOUS la cible avec un ressenti
// Facile/Correct/Dur (pas « À l'échec ») = l'effort d'aller au bout n'a pas été fait.
// Ex. 8/10 « dur » : s'arrêter à dur sans toucher l'échec, c'est laisser des reps sur la table → pénalisé.
function setSoftFail(s,target){
  if(!target) return false;
  if(s.feel==='echec') return false;
  return s.reps<target;
}
// Note /5 d'un exo : 2,5 pts séries faites + 1,5 pts reps vs cible + 1 pt propreté (vrais ratés uniquement),
// LE TOUT × prorata des charges (01/08, retour Adrien : des séries faites SOUS le poids de référence
// dévaluent la note % pour % — plancher 60% ; plus lourd ne gonfle pas la note, le PR s'en charge).
// Qualité d'UNE série (0..1) — le cœur de la note /5 (v3 18/08, alignée sur la doctrine §3) :
// cible atteinte = 1 · échec à ≤2 reps SUR LA DERNIÈRE série programmée = 1 (« l'échec se garde
// pour la dernière série » 14/08 + « ≤2 reps = pas de malus » 01/08 : c'est l'exécution parfaite,
// elle ne coûte plus 0,15) · échec à ≤2 reps plus tôt dans l'exo = 0,85 (signal pacing/charge,
// pas un raté) · vrai raté (échec 3+ sous) = 0,4 ·
// arrêtée sous la cible SANS échec = 0,65 à 1 rep près, sinon 0,5 (0,4 si « facile »).
function asSetQuality(s,target,isLast){
  if(!target) return 1;
  if(s.reps>=target) return 1;
  if(s.feel==='echec') return s.reps>=target-setTol(target)?(isLast?1:0.85):0.4;
  if(s.feel==='facile') return 0.4;
  return s.reps>=target-1?0.65:0.5;
}
// Note /5 v3 (18/08) : moyenne des qualités de série sur les n prévues (série manquante ≈ 0,25),
// −0,5 si effondrement (≥3 reps perdues entre 1re et dernière), × prorata des charges².
// Trois affinages v3 (retour Adrien sur la séance du 18/08) :
// ① échec propre sur la DERNIÈRE série programmée = pleine valeur (asSetQuality) ;
// ② un exo BONUS se juge sur ses séries FAITES (un bonus est du volume volontaire — sa note
//    dit la qualité de ce qui a été fait, les séries « manquantes » ne diluent plus) ;
// ③ prorata par série à la force estimée (e1RM Epley) quand elle dépasse le ratio de poids brut
//    (des reps au-dessus de la cible à un poids allégé comptent — jamais en malus), et une
//    CORRECTION de charge (baisse après un échec sous la cible plus lourd) qui remplit la cible
//    se paie en linéaire, pas au carré : le pilotage prescrit par la doctrine ne coûte plus double.
// Note /5 AFFICHÉE : arrondie VERS LE BAS au demi-point — la note se mérite. Les moyennes
// (/20, courbe de fatigue, clean sweep) utilisent asScoreExoRaw : le double arrondi coûtait
// jusqu'à ~2 pts de /20 (5 exos à 4,8 réels → affichés 4,5 → 18/20 au lieu de 19) — audit 19/08.
function asScoreExo(x){ return Math.max(0,Math.floor(asScoreExoRaw(x)*2)/2); }
function asScoreExoRaw(x){
  if(!x.sets.length) return 0;
  if(x.status==='skipped'&&!liveExoCounted(x)) return 0;
  var n=x.n||3;
  var sets=x.sets.slice(0,n); // les séries BONUS au-delà du programme ne notent pas (points bonus uniquement)
  // Arrêt DOULEUR (16/08, durci le soir même — retour Adrien « 20/20 trop gentil ») : l'exécution
  // est jugée sur les séries FAITES, mais chaque série manquante coûte 0,5 pt. Pas de malus
  // d'effondrement ni de prorata charges (la douleur explique la chute, pas l'effort).
  var painMiss=0;
  if(x.pain){ painMiss=Math.max(0,n-sets.length); n=Math.max(1,sets.length); }
  else if(liveExoSide(x)){ n=Math.max(1,sets.length); } // ② bonus : jugé sur les séries faites
  var progLast=x.n||3; // rang de la dernière série PROGRAMMÉE (l'échec s'y garde, règle 14/08)
  var inv=asIsInverse(x.key);
  var isKg=/kg/.test(x.unite||'')&&x.w0>0;
  var qSum=0;
  sets.forEach(function(s,si){
    var q=asSetQuality(s,x.reps,si===progLast-1);
    // Série de TEST au-dessus de la référence (04/08, demande Adrien) : à ≤2 reps de la cible,
    // la surcharge compense les reps manquantes (force estimée PLUS HAUTE qu'une série pleine
    // à la référence) → pleine valeur. Un 7@52 ne vaut plus moins qu'un 8@48.
    if(isKg&&!inv&&x.reps){
      var sw=(s.w!=null?s.w:(x.w!=null?x.w:x.weight))||0;
      if(sw>x.w0&&s.reps>=x.reps-setTol(x.reps)) q=Math.max(q,1);
    }
    qSum+=q;
  });
  qSum+=0.25*(n-sets.length); // séries manquantes : presque rien
  var base=5*(qSum/n);
  if(painMiss) base-=0.5*painMiss; // arrêt douleur : −0,5 pt par série non faite
  // Effondrement (fix 19/08, audit) : mesuré depuis min(série 1, CIBLE) — des reps AU-DESSUS de
  // la cible en série 1 n'arment plus le malus (13·10·10·10 cible 10 valait 4,5 : absurde). Et pas
  // de malus si la dernière série reste dans la tolérance de la cible (c'est une série réussie).
  if(!x.pain&&sets.length>=2){
    var _lastS=sets[sets.length-1];
    var _effDrop=Math.min(sets[0].reps,x.reps||sets[0].reps)-_lastS.reps;
    if(_effDrop>=3&&!(x.reps&&_lastS.reps>=x.reps-setTol(x.reps))){
      // Pas un « effondrement » si la dernière série est portée PLUS LOURD que la première (test de charge)
      var _xw=(x.w!=null?x.w:x.weight);
      var _wF=(sets[0].w!=null?sets[0].w:_xw)||0, _wL=(_lastS.w!=null?_lastS.w:_xw)||0;
      if(!(isKg&&!inv&&_wL>_wF)) base-=0.5;
    }
  }
  var ratio=1;
  if(isKg&&!x.pain){ // arrêt douleur : alléger pour finir ne coûte rien (même règle que le ctx blessure)
    var rs=0, corrected=false;
    sets.forEach(function(s,si){
      var sw=(s.w!=null?s.w:x.w)||0;
      // ③ Correction de charge en cours d'exo : la série précédente était un échec SOUS la cible
      // à un poids PLUS LOURD → baisser et remplir = le pilotage que la doctrine prescrit
      // (« série à l'échec = on baisse d'un cran immédiatement », 14/08) — linéaire, pas au carré.
      if(si>0){
        var p=sets[si-1], pw=(p.w!=null?p.w:x.w)||0;
        if(!inv&&pw>sw&&p.feel==='echec'&&x.reps&&p.reps<x.reps) corrected=true;
        if(!inv&&sw>pw) corrected=false; // le poids remonte → on n'est plus dans la correction
      }
      var r=sw>0?(inv?x.w0/sw:sw/x.w0):1;
      // ③ Force estimée par série (e1RM Epley, même juge que les classements 04/08) : une série
      // allégée avec PLUS de reps que la cible vaut sa force réelle, pas son poids brut.
      // max(poids, e1RM) : l'e1RM ne peut qu'aider — les reps manquantes sont déjà payées par la qualité.
      if(!inv&&x.reps&&s.reps>0&&sw>0){
        var re=(sw*(1+s.reps/30))/(x.w0*(1+x.reps/30));
        r=Math.max(r,re);
      }
      r=Math.min(1,r);
      var pen=(corrected&&x.reps&&s.reps>=x.reps)?r:r*r; // au carré : −26% de charge ≈ −45% de valeur de série
      rs+=Math.max(0.5,pen);
    });
    ratio=rs/sets.length;
  }
  var val=Math.max(0,base*ratio);
  // ── CHARGE DOMINÉE (v3.2, 31/08 — retour Adrien « mes 18-20 tombent trop facilement ») ──
  // Exo complet, toutes les séries à la cible et TOUTES ressenties « Facile » = RIR 4+ partout :
  // le plan est exécuté mais le stimulus n'y est pas (doctrine §3 : une série utile finit à 0-3
  // reps de l'échec) → /5 plafonné à 4,5. Le 0,5 revient dès qu'une série est au moins « Correct »
  // ou qu'une série est portée plus lourd que la référence (test de charge). L'analyse dit déjà
  // « ce poids ne te mérite plus » — la note arrête juste de dire 5/5 en même temps.
  if(!x.pain&&x.reps&&sets.length>=progLast&&!exoIsCardio(x.key)){
    var domin=sets.every(function(s){ return s.reps>=x.reps&&s.feel==='facile'; });
    if(domin&&isKg&&!inv&&sets.some(function(s){ var sw=(s.w!=null?s.w:(x.w!=null?x.w:x.weight))||0; return sw>x.w0; })) domin=false;
    if(domin) val=Math.min(val,4.5);
  }
  return val; // valeur BRUTE — l'arrondi d'affichage vit dans asScoreExo
}
// ── /20 v3.2 (31/08, demande Adrien « regarde si mes 18/20 sont mérités ») ──
// Trois duretés ciblées, validées au banc de test sur les vraies fonctions (mêmes invariants
// que l'audit 19/08, 30 000 exos fuzzés, zéro nouvelle non-monotonie) :
// ① CHARGE DOMINÉE : voir asScoreExoRaw — tout-Facile à la cible = 4,5 max par exo.
// ② LE 20 SE MÉRITE : 20/20 seulement si AUCUN exo noté ne descend sous 4,75 brut (vraie séance
//    parfaite). Avant : un softFail ou un exo écourté se noyait dans la moyenne (20/20 quand même).
// ③ ARRONDI VERS LE BAS : le /20 s'arrondit désormais comme le /5 affiché (« la note se mérite »,
//    règle d'affichage du 15/08 étendue à la note de séance). La moyenne reste sur les valeurs
//    BRUTES — l'acquis anti-double-arrondi du 19/08 est conservé.
// Les notes déjà gravées ne bougent PAS (règle 15/08) : v3.2 ne joue que sur les prochaines
// séances et sur les corrections assumées via l'éditeur.
function asNote20From(list){
  var ex=liveNotedExos(list);
  if(!ex.length) return 0;
  var t=0, mn=5;
  ex.forEach(function(x){ var v=asScoreExoRaw(x); t+=v; if(v<mn) mn=v; });
  var g=Math.floor(t/ex.length*4+1e-9);
  if(g>=20&&mn<4.75) g=19;
  return Math.max(0,Math.min(20,g));
}
function asGlobalScore(){
  // Le /20 se joue sur les exos PRINCIPAUX (liveNotedExos) : les bonus gardent leur note /5
  // affichée mais ne pèsent pas dans la note de séance — ils ne rapportent que des points.
  return asNote20From(AS.exos);
}
function asGradeInfo(g){
  if(g<7) return {cls:'bad',emoji:'&#x1F62B;',title:'Tr&#xE8;s mauvaise s&#xE9;ance',anim:'shake'};
  if(g<11) return {cls:'mid',emoji:'&#x1F610;',title:'S&#xE9;ance en demi-teinte',anim:'none'};
  if(g<15) return {cls:'ok',emoji:'&#x1F44D;',title:'S&#xE9;ance correcte',anim:'pop'};
  if(g<18) return {cls:'good',emoji:'&#x1F4AA;',title:'Tr&#xE8;s bonne s&#xE9;ance',anim:'bounce'};
  return {cls:'top',emoji:'&#x1F3C6;',title:'S&#xE9;ance de champion',anim:'bounce'};
}
function asGradeSummary(g,doneCt,skipCt,total){
  if(g<7){
    if(doneCt<=Math.ceil(total/3)) return 'Seulement <strong>'+doneCt+'/'+total+' exos</strong> men&#xE9;s au bout aujourd\'hui. &#xC7;a arrive &#x2014; mais soyons honn&#xEA;tes&#x202F;: ce n\'est pas avec &#xE7;a qu\'on construit. Regarde ce qui a bloqu&#xE9; (temps ? &#xE9;nergie ? douleur ?) et corrige-le d&#xE8;s la prochaine.';
    return 'Trop de s&#xE9;ries incompl&#xE8;tes ou loin de la cible aujourd\'hui. Pas de panique&#x202F;: identifie LA cause (sommeil, bouffe, charges trop hautes) et reviens plus fort.';
  }
  if(g<11) return 'Du bon et du moins bon&#x202F;: '+doneCt+'/'+total+' exos au bout'+(skipCt?', '+skipCt+' pass&#xE9;'+(skipCt>1?'s':''):'')+'. La base est l&#xE0;, le d&#xE9;tail p&#xEA;che. Les slides suivantes te disent exactement quoi ajuster.';
  if(g<15) return 'S&#xE9;ance solide&#x202F;: '+doneCt+'/'+total+' exos men&#xE9;s au bout. Pas parfaite, mais c\'est ce genre de s&#xE9;ances r&#xE9;guli&#xE8;res qui font les prises de masse r&#xE9;ussies.';
  if(g<18) return 'Grosse s&#xE9;ance&#x202F;: '+doneCt+'/'+total+' exos, s&#xE9;ries pleines, ex&#xE9;cution propre. Continue exactement comme &#xE7;a.';
  return total+'/'+total+' ou presque, s&#xE9;ries pleines, z&#xE9;ro rel&#xE2;chement. La d&#xE9;finition d\'une s&#xE9;ance parfaite. Chapeau.';
}
function asAnalyzeExo(x){
  var out={key:x.key,name:x.name,lines:[],suggest:0,tone:'mid'};
  var tRep=x.reps, n=x.n, sets=x.sets;
  var inv=asIsInverse(x.key);
  var counted=liveExoCounted(x);
  var side=liveExoSide(x);
  if(exoIsCardio(x.key)){
    out.tone=counted?'good':'skip';
    out.lines.push(counted
      ?'&#x1F3C3; Cardio valid&#xE9; &#x2014; +100 pts (max 2/semaine). La zone 2 ne se note pas&#x202F;: elle limite le gras du bulk sans voler ta r&#xE9;cup. Bien jou&#xE9; de l\'avoir cal&#xE9; en fin de s&#xE9;ance.'
      :'&#x1F3C3; Cardio commenc&#xE9; mais pas termin&#xE9; &#x2014; non compt&#xE9;, z&#xE9;ro p&#xE9;nalit&#xE9;.');
    return out;
  }
  if(side&&!counted&&sets.length){
    out.tone='skip';
    out.lines.push('&#x2B50; Bonus tent&#xE9; ('+sets.length+' s&#xE9;rie'+(sets.length>1?'s':'')+') &#x2014; z&#xE9;ro malus, c\'est du volume gratuit. D&#xE8;s 2 s&#xE9;ries il sera compt&#xE9; en bonus.');
    return out;
  }
  // Arrêt douleur (16/08) : message dédié, compté sans malus, et JAMAIS de suggestion de
  // hausse dessus — la seule consigne est de protéger l'articulation et de recalibrer à froid.
  if(x.pain){
    out.tone=counted?'good':'skip';
    out.lines.push(counted
      ?'&#x1FA79; Arr&#xEA;t&#xE9; sur douleur &#xE0; '+sets.length+'/'+n+' s&#xE9;ries &#x2014; <strong>compt&#xE9;</strong>&#x202F;: l\'ex&#xE9;cution est jug&#xE9;e sur les s&#xE9;ries faites, &#x2212;0,5 pt par s&#xE9;rie manquante. Tu as fait exactement ce qu\'il fallait&#x202F;: une douleur articulaire ne se n&#xE9;gocie pas.'
      :'&#x1FA79; Arr&#xEA;t&#xE9; sur douleur avant la 1re s&#xE9;rie &#x2014; z&#xE9;ro malus. Bonne d&#xE9;cision.');
    if(counted) out.lines.push('Si la douleur revient au m&#xEA;me endroit &#xE0; la prochaine s&#xE9;ance&#x202F;: on baisse la charge de ~20&#x202F;% ou on change de variante sur le m&#xEA;me pattern (&#xA7;4) &#x2014; et si &#xE7;a persiste au repos, on consulte.');
    return out;
  }
  if(x.status==='skipped'&&!counted){
    out.tone='skip';
    out.lines.push(x.skippedBy==='auto'
      ? asPick(['Non fait (s&#xE9;ance &#xE9;court&#xE9;e). Non comptabilis&#xE9; &#x2014; &#xE0; recaser la prochaine fois.','Pas eu le temps &#x2014; non compt&#xE9; dans ta progression. Priorit&#xE9; &#xE0; cet exo la prochaine s&#xE9;ance.'])
      : asPick(['Pass&#xE9; t&#xF4;t &#x2014; non comptabilis&#xE9; dans ta progression, aucun souci, &#xE7;a arrive.','Saut&#xE9; aujourd\'hui (non compt&#xE9;). Si c\'&#xE9;tait la machine prise&#x202F;: pense au bouton &#xAB;&#x202F;faire maintenant&#x202F;&#xBB;.']));
    return out;
  }
  if(side&&counted){
    // 22/08 : le wording « points » est mort avec le rank (15/08). Et si la séance n'a AUCUN
    // principal (vieille séance à la carte), les bonus notent en réalité le /20 — on ne ment plus.
    var _notedHere=false;
    try{ _notedHere=(typeof AS!=='undefined'&&AS&&AS.exos)?liveNotedExos(AS.exos).some(function(e){return e.key===x.key;}):false; }catch(e){}
    out.lines.push(_notedHere
      ?'&#x2B50; S&#xE9;ance sans exo principal &#x2014; tes exos du jour SONT le programme : celui-ci compte dans le /20.'
      :'&#x2B50; Exo bonus &#x2014; not&#xE9; pour toi, hors note /20 de la s&#xE9;ance.');
  }
  // Un « skipped » avec toutes ses séries = un exo terminé (état hérité d'un passer/reprendre) — jamais « écourté »
  if(x.status==='skipped'&&counted&&sets.length<n){
    out.tone='good';
    out.lines.push(asPick([
      '&#x1F4AA; &#xC9;court&#xE9; &#xE0; '+sets.length+'/'+n+' s&#xE9;ries mais l\'essentiel est fait &#x2014; <strong>compt&#xE9;</strong> dans ta progression.',
      '&#x1F4AA; '+sets.length+'/'+n+' s&#xE9;ries puis stop &#x2014; le gros du travail est fait, l\'exo est <strong>compt&#xE9;</strong>.']));
  }
  if(!sets.length){ out.lines.push('Aucune s&#xE9;rie enregistr&#xE9;e.'); return out; }
  var reps=sets.map(function(s){return s.reps;});
  var feels=sets.map(function(s){return s.feel;});
  var first=reps[0], last=reps[reps.length-1];
  var drop=first-last;
  var hitAll=reps.every(function(r){return r>=tRep;});
  // Règle échec (voir setHardFail) : échec ≠ raté. On sépare les VRAIS ratés (loin de la cible)
  // des séries menées à l'échec sur/près de la cible (= excellent travail).
  var hardFails=sets.filter(function(s){return setHardFail(s,tRep);}).length;
  var softFails=sets.slice(0,n).filter(function(s){return setSoftFail(s,tRep);}).length; // sous la cible SANS échec (02/08)
  var echecs=feels.filter(function(f){return f==='echec';}).length;
  var toFailure=echecs-hardFails; // échecs "propres" : à ≤2 reps de la cible
  var nearAll=reps.every(function(r){return r>=tRep-setTol(tRep);}); // toutes les séries à ≤2 reps de la cible
  var lastFeel=feels[feels.length-1];
  var allEasy=feels.every(function(f){return f==='facile';});
  var fullSets=sets.length>=n;
  // Trajectoire des CHARGES série par série (01/08 — retour Adrien : « je suis remonté au poids
  // actuel, il me suggère de monter ») : pas de suggestion de hausse si des séries sont sous la réf.
  var isKg=/kg/.test(x.unite||'')&&!x.repT;
  var ws=sets.map(function(s){return s.w!=null?s.w:x.weight;});
  var minW=Math.min.apply(null,ws), maxW=Math.max.apply(null,ws);
  var atRef=function(w){ return inv? w<=x.w0 : w>=x.w0; };
  var allAtRef=!isKg||x.w0<=0||ws.every(atRef);
  var someUnder=isKg&&x.w0>0&&!allAtRef;
  var pyramidUp=isKg&&!inv&&sets.length>=2&&ws[0]<ws[ws.length-1];
  var dropSetW=isKg&&!inv&&sets.length>=2&&ws[0]>ws[ws.length-1];
  var stag=0; try{ stag=getSessionsAtWeight(x.key); }catch(e){}
  var wUp=x.weight>x.w0, wDown=x.weight<x.w0;
  var unit=cntU(x)==='s'?'s':(cntU(x)==='min'?' min':' reps');

  // Monter le poids EN séance = un TEST DE CHARGE assumé (règle Adrien 04/08) : c'est sa façon
  // de grimper petit à petit, on ne l'engueule plus par principe. On juge le test sur les seules
  // séries faites AU nouveau poids : cible tenue ou frôlée (≤2 reps, même à l'échec) = test VALIDÉ.
  // Seul un vrai décrochage (3+ reps sous la cible au nouveau poids) = test prématuré, dit sans drame.
  var wUpVerdict=null;
  if(wUp&&!inv&&isKg&&tRep){
    var topSets=sets.filter(function(s){ return (s.w!=null?s.w:x.weight)>=x.weight; });
    if(!topSets.length) topSets=[sets[sets.length-1]];
    var topMiss=topSets.filter(function(s){ return s.reps<tRep-setTol(tRep); }).length;
    var topHit=topSets.every(function(s){ return s.reps>=tRep; });
    wUpVerdict=topMiss>0?'fail':(topHit?'ok':'test');
  }
  if(wUpVerdict==='ok'){
    out.lines.push(asPick(['&#x1F53C; Mont&#xE9; &#xE0; '+x.weight+' '+x.unite+' en pleine s&#xE9;ance avec la cible tenue au nouveau poids &#x2014; test de charge valid&#xE9; du premier coup, c\'est exactement comme &#xE7;a qu\'on grimpe.','&#x1F53C; +'+(Math.round((x.weight-x.w0)*10)/10)+' '+x.unite+' en cours de s&#xE9;ance, cible tenue &#x2014; test r&#xE9;ussi, '+x.weight+' '+x.unite+' est ta nouvelle r&#xE9;f&#xE9;rence.']));
    // Test validé ⇒ la slide suggestions PROPOSE d'entériner le poids testé (05/08 — avant,
    // « nouvelle référence » était annoncé mais jamais proposé à l'application)
    out.suggest=1; out.suggestTo=x.weight;
  } else if(wUpVerdict==='test'){
    out.tone='good';
    out.lines.push(asPick([
      '&#x1F9EA; Test de charge&#x202F;: mont&#xE9; &#xE0; '+x.weight+' '+x.unite+' en s&#xE9;ance et tenu &#xE0; 1-2 reps de la cible &#x2014; test <strong>valid&#xE9;</strong>, c\'est comme &#xE7;a qu\'on progresse cran par cran. Garde '+x.weight+' '+x.unite+' et grappille les reps manquantes au prochain passage.',
      '&#x1F9EA; Mont&#xE9; &#xE0; '+x.weight+' '+x.unite+' pour te tester&#x202F;: &#xE0; 1-2 reps de la cible d&#xE8;s le premier essai, le test passe. '+x.weight+' '+x.unite+' devient ta r&#xE9;f&#xE9;rence &#x2014; s&#xE9;ries pleines dessus et on remonte.']));
    out.suggest=1; out.suggestTo=x.weight; // test tenu ⇒ proposer d'entériner la nouvelle référence
  } else if(wUpVerdict==='fail'){
    out.tone='down';
    if(isKg&&!x.repT) out.suggest=-1;
    out.lines.push(asPick([
      '&#x1F9EA; Test &#xE0; '+x.weight+' '+x.unite+' tent&#xE9; &#x2014; bien vu d\'essayer, mais 3+ reps sous la cible au nouveau poids&#x202F;: trop t&#xF4;t AUJOURD\'HUI. Repars de '+x.w0+' '+x.unite+', remplis toutes les s&#xE9;ries, et retente le test en fin d\'exo dans 1-2 s&#xE9;ances.',
      '&#x1F9EA; Le test &#xE0; '+x.weight+' '+x.unite+' ne passe pas encore (reps trop loin de la cible) &#x2014; aucun mal &#xE0; tester, c\'est l\'info qu\'on cherchait. Reviens &#xE0; '+x.w0+' '+x.unite+', s&#xE9;ries pleines, et le test repassera tout seul.']));
  }
  else if(wUp&&inv){
    out.lines.push('Assistance mont&#xE9;e en cours d\'exo &#x2014; ok pour finir proprement.');
    // Si l'assistance finale a produit des séries valides, on propose d'en faire la nouvelle
    // référence (05/08 — cas dips : parti sous la réf, fini à une assistance qui marche)
    if(tRep&&sets[sets.length-1].reps>=tRep-setTol(tRep)&&ws[ws.length-1]!==x.w0){
      out.suggest=-1; out.suggestTo=ws[ws.length-1];
    }
  }
  else if(wUp) out.lines.push(asPick(['&#x1F53C; Mont&#xE9; &#xE0; '+x.weight+' '+x.unite+' en pleine s&#xE9;ance avec la cible remplie &#x2014; belle audace, et la bonne fa&#xE7;on de le faire.','&#x1F53C; +'+(Math.round((x.weight-x.w0)*10)/10)+' '+x.unite+' pendant la s&#xE9;ance, cible tenue &#x2014; joli.']));
  if(wDown&&!inv) out.lines.push(asPick(['&#x1F53D; Poids r&#xE9;duit en cours d\'exo &#x2014; bonne d&#xE9;cision, mieux vaut propre que lourd.','&#x1F53D; Charge ajust&#xE9;e &#xE0; la baisse &#x2014; c\'est de la lucidit&#xE9;, pas un recul.']));
  if(wDown&&inv) out.lines.push('&#x1F53D; Assistance r&#xE9;duite &#xE0; '+x.weight+' kg &#x2014; c\'est &#xC7;A la progression sur cet exo&#x202F;!');

  var batteryFired=false;
  if(wUpVerdict==='test'||wUpVerdict==='fail'){
    // Le verdict du test de charge dit déjà quoi faire — pas de double lecture contradictoire derrière.
  } else if(fullSets&&hitAll&&someUnder){
    // Des séries sous la référence : PAS de suggestion de hausse, quelle que soit la facilité.
    out.tone='good';
    if(pyramidUp&&atRef(ws[ws.length-1])){
      out.lines.push(asPick([
        '&#x1F53A; Mont&#xE9;e progressive '+ws[0]+' &#x2192; '+ws[ws.length-1]+' '+x.unite+' &#x2014; bonne fa&#xE7;on de se remettre dedans. Prochaine &#xE9;tape&#x202F;: TOUTES les s&#xE9;ries &#xE0; la r&#xE9;f&#xE9;rence ('+x.w0+' '+x.unite+'), et l&#xE0; on parlera de hausse.',
        '&#x1F53A; Pyramide montante jusqu\'&#xE0; ta r&#xE9;f&#xE9;rence &#x2014; propre. La hausse se d&#xE9;cidera quand la charge pleine tiendra sur toutes les s&#xE9;ries.']));
    } else if(dropSetW){
      out.lines.push(asPick([
        '&#x1F53B; Charges descendues en cours d\'exo ('+ws[0]+' &#x2192; '+ws[ws.length-1]+' '+x.unite+') &#x2014; si c\'&#xE9;tait un drop set voulu, parfait&#x202F;; sinon la 1re s&#xE9;rie t\'a co&#xFB;t&#xE9; trop cher.',
        '&#x1F53B; Tu as all&#xE9;g&#xE9; en cours de route &#x2014; lucide. La prochaine fois pars 1 cran sous ta 1re charge pour tenir les 4 s&#xE9;ries.']));
    } else {
      out.lines.push('&#x2696;&#xFE0F; Des s&#xE9;ries faites sous ta r&#xE9;f&#xE9;rence ('+minW+' vs '+x.w0+' '+x.unite+') &#x2014; les reps passent, mais la hausse attendra des s&#xE9;ries pleines &#xE0; pleine charge.');
    }
  } else if(fullSets&&hitAll&&allEasy&&allAtRef){
    out.tone='up'; out.suggest=1;
    out.lines.push(asPick([
      '&#x1F680; '+n+'/'+n+' s&#xE9;ries, toutes les reps, tout en facile &#x2014; ce poids ne te m&#xE9;rite plus. Monte d\'un cran.',
      '&#x1F680; Trop facile aujourd\'hui&#x202F;: s&#xE9;ries pleines sans forcer. La prochaine fois, cran au-dessus.',
      '&#x1F680; Tu domines ce poids. Un cran de plus d&#xE8;s la prochaine s&#xE9;ance, sans h&#xE9;siter.']));
    // v3.2 (31/08) : la note dit désormais la même chose que ce message — charge dominée = 4,5 max
    out.lines.push('&#x1F3AF; Note plafonn&#xE9;e &#xE0; <strong>4,5/5</strong>&#x202F;: tout &#xAB;&#x202F;Facile&#x202F;&#xBB; = le muscle n\'a pas approch&#xE9; l\'&#xE9;chec, le stimulus n\'y est pas. Le 5/5 revient avec la charge d\'au-dessus.');
  } else if(fullSets&&hitAll&&echecs===0&&allAtRef){
    // Règle Adrien : toutes les séries, toutes les reps, ZÉRO échec → la hausse est recommandée (même si la fin était dure)
    out.tone='up'; out.suggest=1;
    out.lines.push(asPick([
      '&#x2705; S&#xE9;ries pleines sans jamais toucher l\'&#xE9;chec &#x2014; tu es m&#xFB;r pour +1 kg.',
      '&#x2705; Objectif rempli de bout en bout, z&#xE9;ro &#xE9;chec&#x202F;: la hausse est valid&#xE9;e, tente-la au prochain passage.']));
  } else if(fullSets&&hitAll&&toFailure>0&&!hardFails&&allAtRef){
    out.tone='good';
    out.lines.push(asPickFresh([
      '&#x1F4AA; S&#xE9;ries pleines en allant chercher l\'&#xE9;chec &#x2014; c\'est EXACTEMENT l&#xE0; que le muscle se construit. Poids parfaitement calibr&#xE9;, encore 1-2 s&#xE9;ances comme &#xE7;a et on monte.',
      '&#x1F4AA; Cible atteinte ET &#xE9;chec touch&#xE9; en fin d\'exo&#x202F;: le sc&#xE9;nario id&#xE9;al d\'une s&#xE9;rie de prise de masse. On consolide, la hausse arrive vite.',
      '&#x1F4AA; Le combo parfait&#x202F;: toutes les reps, et l\'&#xE9;chec touch&#xE9; sur la fin. Ce poids travaille pour toi &#x2014; encore un passage comme &#xE7;a et on monte.',
      '&#x1F4AA; Cible remplie, &#xE9;chec en fin d\'exo &#x2014; z&#xE9;ro rep laiss&#xE9;e dans le sac. Exactement le travail qui fait grossir.']));
  } else if(fullSets&&!hitAll&&nearAll&&!hardFails&&!softFails){
    out.tone='good';
    out.lines.push(asPick([
      '&#x1F3AF; &#xC0; 1-2'+unit+' de la cible'+(toFailure?' en allant &#xE0; l\'&#xE9;chec &#x2014; s&#xE9;rie tout &#xE0; fait normale, rien de rat&#xE9;':'')+'&#x202F;: garde ce poids et grappille les reps manquantes.',
      '&#x1F3AF; Presque complet'+(toFailure?' (&#xE9;chec &#xE0; 1-2 reps de la cible = travail r&#xE9;ussi)':'')+'&#x202F;: m&#xEA;me poids la prochaine fois, s&#xE9;ries pleines puis on monte.']));
  } else if(hardFails>=2||(!hitAll&&!softFails&&reps.filter(function(r){return tRep-r>setTol(tRep);}).length>=2)){
    // ≥2 séries vraiment loin de la cible — UN seul raté isolé ne mérite pas ce discours (branche suivante)
    out.tone='down';
    if(isKg&&!x.repT) out.suggest=-1; // baisse conseillée → proposée dans la slide suggestions
    out.lines.push(asPick([
      '&#x26A0; Plusieurs s&#xE9;ries loin de la cible (3 reps ou plus manquantes) &#x2014; la charge du jour te d&#xE9;passe. Un cran en dessous et tu reprends le contr&#xF4;le du mouvement.',
      '&#x26A0; Trop de s&#xE9;ries arrach&#xE9;es loin de la cible. Reviens un cran plus bas&#x202F;: mieux vaut '+n+' s&#xE9;ries pleines qui construisent que '+n+' s&#xE9;ries &#xE0; moiti&#xE9;.',
      '&#x26A0; Les reps s\'effondrent d&#xE8;s que la fatigue arrive &#x2014; c\'est le signe d\'un poids un cran trop haut AUJOURD\'HUI. Redescends, remplis les s&#xE9;ries, et il retombera vite.',
      '&#x26A0; &#xC0; ce niveau d\'&#xE9;cart avec la cible, tu travailles la force du jour, pas l\'hypertrophie. Un cran plus bas = plus de reps de qualit&#xE9; = plus de muscle.']));
    if(reps.length>=3&&reps[0]>=tRep&&echecs>=sets.length-1&&drop>=3){
      batteryFired=true; // remplace le message « gros écart 1re/dernière » — un seul conseil repos, pas deux
      out.lines.push('&#x1F50B; 1re s&#xE9;rie correcte puis tout &#xE0; l\'&#xE9;chec en chute libre &#x2014; soit le repos est trop court pour ce poids, soit la 1re s&#xE9;rie a tout br&#xFB;l&#xE9;. Teste +30s de repos AVANT de toucher &#xE0; la charge.');
    }
  } else if(hardFails===1&&sets.length>=n&&!softFails){
    out.tone='good';
    out.lines.push(asPick([
      '&#x2696;&#xFE0F; Une seule s&#xE9;rie vraiment loin de la cible &#x2014; charge bien calibr&#xE9;e dans l\'ensemble, tu es au bon endroit pour progresser.',
      '&#x2696;&#xFE0F; Un seul vrai raté sur l\'exo&#x202F;: &#xE7;a fait partie du jeu. Reste sur ce poids et vise les s&#xE9;ries pleines.']));
  } else if(softFails>0&&fullSets){
    // Règle effort 02/08 : sous la cible en s'arrêtant à « dur » = pas allé au bout → note sabrée
    out.tone=side?'mid':'down';
    var softFeels=sets.slice(0,n).filter(function(s){return setSoftFail(s,tRep);}).map(function(s){return s.feel;});
    var easySoft=softFeels.indexOf('facile')>=0;
    out.lines.push(asPick(easySoft?[
      '&#x1F6A9; S&#xE9;rie sous la cible ressentie &#xAB;&#x202F;facile&#x202F;&#xBB; &#x2014; l&#xE0; c\'est ni la charge ni la fatigue, c\'est le compteur de reps qui s\'est arr&#xEA;t&#xE9; trop t&#xF4;t. Ces reps-l&#xE0; sont gratuites, prends-les.',
      '&#x1F6A9; Du &#xAB;&#x202F;facile&#x202F;&#xBB; sous la cible&#x202F;: tu avais largement les '+tRep+unit+' dans les bras. Vise le compte exact &#x2014; chaque rep abandonn&#xE9;e est de la croissance abandonn&#xE9;e.'
    ]:[
      '&#x1F6A9; '+softFails+' s&#xE9;rie'+(softFails>1?'s':'')+' arr&#xEA;t&#xE9;e'+(softFails>1?'s':'')+' &#xE0; &#xAB;&#x202F;dur&#x202F;&#xBB; sous la cible &#x2014; dur, c\'est justement le moment o&#xF9; les reps comptent double. 1 ou 2 de plus et t\'&#xE9;tais &#xE0; l\'&#xE9;chec ou &#xE0; la cible&#x202F;: c\'est L&#xC0; que &#xE7;a se joue.',
      '&#x1F6A9; Cible manqu&#xE9;e sans &#xE9;chec d&#xE9;clar&#xE9; ('+softFails+' s&#xE9;rie'+(softFails>1?'s':'')+') &#x2014; le muscle avait encore des reps. R&#xE8;gle simple&#x202F;: la s&#xE9;rie se termine &#xE0; la cible OU &#xE0; l\'&#xE9;chec, jamais avant.',
      '&#x1F6A9; '+softFails+' s&#xE9;rie'+(softFails>1?'s':'')+' l&#xE2;ch&#xE9;e'+(softFails>1?'s':'')+' sous la cible au moment o&#xF9; &#xE7;a pique &#x2014; c\'est payer le prix de la s&#xE9;ance sans encaisser les gains&#x202F;: les derni&#xE8;res reps difficiles SONT l\'exercice.',
      '&#x1F6A9; Sous la cible en t\'arr&#xEA;tant avant l\'&#xE9;chec &#x2014; si la charge est bonne, va au bout&#x202F;; si elle est trop lourde, dis-le avec un &#xAB;&#x202F;&#xE0; l\'&#xE9;chec&#x202F;&#xBB; honn&#xEA;te. Entre les deux, ni le muscle ni la note n\'y trouvent leur compte.']));
  } else if(!fullSets){
    out.tone=counted?'good':'mid';
    out.lines.push(asPick([
      '&#x23F8; '+sets.length+'/'+n+' s&#xE9;ries faites &#x2014; exo &#xE9;court&#xE9;. Si c\'&#xE9;tait la fatigue, place-le plus t&#xF4;t dans la s&#xE9;ance.',
      '&#x23F8; S&#xE9;ries incompl&#xE8;tes ('+sets.length+'/'+n+'). Pas grave&#x202F;: la r&#xE9;gularit&#xE9; compte plus que la perfection.']));
  } else {
    out.lines.push('&#x1F44D; Exo valid&#xE9; &#x2014; continue comme &#xE7;a.');
  }

  // Écart 1re/dernière : silence si le conseil repos est déjà passé (batterie), si l'écart
  // s'explique par un test de charge en cours d'exo (ce n'est pas de la fatigue, c'est le poids),
  // ou si le message « échec dès la série 1 » plus spécifique va le couvrir juste après.
  var s1Fail=feels[0]==='echec'&&sets.length>=2&&last<first;
  if(sets.length>=2&&drop>=3&&!batteryFired&&!wUpVerdict&&!s1Fail){
    out.lines.push(asPick([
      '&#x1F4C9; Gros &#xE9;cart entre 1&#xE8;re ('+first+unit+') et derni&#xE8;re s&#xE9;rie ('+last+unit+') &#x2014; premi&#xE8;re s&#xE9;rie trop ch&#xE8;re ou repos trop court. Essaie +15-30s de repos.',
      '&#x1F4C9; Tu perds '+drop+unit+' entre le d&#xE9;but et la fin&#x202F;: pars un poil moins vite sur la 1&#xE8;re s&#xE9;rie pour finir plus fort.']));
  } else if(sets.length>=2&&drop<=0&&hitAll){
    out.lines.push(asPickFresh([
      '&#x1F4C8; Derni&#xE8;re s&#xE9;rie aussi solide que la premi&#xE8;re &#x2014; excellente gestion de l\'effort.',
      '&#x1F4C8; Z&#xE9;ro baisse de r&#xE9;gime entre les s&#xE9;ries&#x202F;: la r&#xE9;cup est bien calibr&#xE9;e.',
      '&#x1F4C8; Les reps tiennent du d&#xE9;but &#xE0; la fin &#x2014; pacing propre, rien &#xE0; retoucher.',
      '&#x1F4C8; Aucune s&#xE9;rie sacrifi&#xE9;e en route&#x202F;: la charge et le repos sont au bon r&#xE9;glage.']));
  }
  if(softFails>0&&!fullSets){
    out.lines.push('&#x1F6A9; Et sur les s&#xE9;ries faites, '+softFails+' arr&#xEA;t&#xE9;e'+(softFails>1?'s':'')+' sous la cible sans &#xE9;chec &#x2014; termine tes s&#xE9;ries&#x202F;: cible ou &#xE9;chec, pas entre les deux.');
  }
  // « Compteur mental » : ≥3 séries pile au même chiffre SOUS la cible, quasi sans échec →
  // il compte jusqu'à un nombre fixe au lieu de suivre la cible de L'exo (leçon du 01/08)
  if(fullSets&&tRep&&echecs<=1){
    var _same={};
    reps.slice(0,n).forEach(function(r){ _same[r]=(_same[r]||0)+1; });
    var _mode=null;
    Object.keys(_same).forEach(function(k){ if(_mode===null||_same[k]>_same[_mode]) _mode=k; });
    if(_mode!==null&&_same[_mode]>=3&&parseInt(_mode,10)<tRep){
      out.lines.push('&#x1F522; '+_same[_mode]+' s&#xE9;ries pile &#xE0; '+_mode+' reps alors que la cible est '+tRep+' &#x2014; on dirait un compteur mental arr&#xEA;t&#xE9; au m&#xEA;me chiffre. La cible affich&#xE9;e en gros sur l\'&#xE9;cran de s&#xE9;rie d&#xE9;cide de la fin, pas l\'habitude&#x202F;: chaque exo a la sienne (8, 10, 12 ou 15).');
    }
  }
  // Série qui décroche isolément entre deux séries normales : rarement la force
  for(var _oi=1;_oi<reps.length-1;_oi++){
    if(reps[_oi-1]-reps[_oi]>=3&&reps[_oi+1]-reps[_oi]>=3){
      out.lines.push('&#x1F9E9; Ta s&#xE9;rie '+(_oi+1)+' d&#xE9;croche toute seule ('+reps[_oi]+' entre '+reps[_oi-1]+' et '+reps[_oi+1]+') &#x2014; un trou isol&#xE9; comme &#xE7;a, c\'est rarement la force&#x202F;: prise, r&#xE9;glage de si&#xE8;ge ou d&#xE9;concentration. &#xC0; surveiller, pas &#xE0; dramatiser.');
      break;
    }
  }
  if(stag>=6&&out.suggest===1){
    out.lines.push('&#x23F3; '+stag+' s&#xE9;ances &#xE0; ce poids &#x2014; le signal est clair, la hausse est due.');
  } else if(stag>=8&&out.suggest===0&&out.tone!=='down'){
    out.lines.push(asPickFresh([
      '&#x23F3; '+stag+' s&#xE9;ances au m&#xEA;me poids. Si &#xE7;a coince, change d\'angle&#x202F;: tempo plus lent, +1 rep par s&#xE9;rie, ou +0,5 kg.',
      '&#x23F3; '+stag+' s&#xE9;ances &#xE0; cette charge &#x2014; pas grave si les s&#xE9;ries se remplissent, sinon micro-progression&#x202F;: +1 rep avant +1 kg.',
      '&#x23F3; '+stag+' passages sans bouger le poids&#x202F;: prochaine cible = 1 rep de plus par s&#xE9;rie, la hausse suivra toute seule.']));
  }
  // ── Situations additionnelles (01/08 — enrichissement du moteur) ──
  // Cible littéralement explosée → proposer un saut de 2 crans
  if(fullSets&&allAtRef&&echecs===0&&tRep&&reps.every(function(r){return r>=tRep+3;})){
    out.suggest=1; out.suggestBig=true; out.tone='up';
    out.lines.push('&#x1F680;&#x1F680; Toutes les s&#xE9;ries &#xE0; +3 reps ou plus au-dessus de la cible &#x2014; ce poids est trop l&#xE9;ger pour toi&#x202F;: saute directement 2 crans.');
  }
  // Échec dès la série 1 : ne le signaler que s'il a COÛTÉ la suite (reps qui déclinent après).
  // L'échec est un état, pas un ratage (règle Adrien) — si les séries suivantes tiennent ou montent
  // (ex. 8·8·10·10), la 1re série à l'échec n'a rien cassé : on se tait.
  if(s1Fail){
    out.lines.push('&#x1F975; &#xC0; l\'&#xE9;chec d&#xE8;s la s&#xE9;rie 1 et les reps d&#xE9;clinent derri&#xE8;re &#x2014; &#xE9;chauffement trop court ou charge du jour ambitieuse&#x202F;: garde 1-2 reps de marge sur la premi&#xE8;re s&#xE9;rie, elle pr&#xE9;pare les suivantes.');
  }
  // Séries volontaires au-delà du prévu
  if(sets.length>n){
    out.lines.push('&#x1F501; '+(sets.length-n)+' s&#xE9;rie'+(sets.length-n>1?'s':'')+' bonus au-del&#xE0; du programme &#x2014; du volume gratuit qui paie direct en points.');
  }
  // Ressenti en dents de scie : « facile » APRÈS une série à l'échec, à poids constant.
  // (1re série fraîche facile → échec en fin d'exo = le pattern NORMAL de la fatigue qui s'accumule,
  // on ne le signale plus — fausse alerte historique du 04/08.)
  if(sets.length>=3&&!wUpVerdict&&!wDown){
    var _sawEchec=false,_easyAfter=false;
    feels.forEach(function(f){ if(f==='echec')_sawEchec=true; else if(f==='facile'&&_sawEchec)_easyAfter=true; });
    if(_easyAfter){
      out.lines.push('&#x1F3A2; Une s&#xE9;rie &#xAB;&#x202F;facile&#x202F;&#xBB; APR&#xC8;S une s&#xE9;rie &#xE0; l\'&#xE9;chec &#x2014; ressenti en dents de scie&#x202F;: v&#xE9;rifie r&#xE9;glage/amplitude constants d\'une s&#xE9;rie &#xE0; l\'autre.');
    }
  }
  // Première fois / grand retour sur l'exo
  try{
    var _stt=asExoStats(x.key);
    if(_stt.execs<=1){
      out.lines.push('&#x1F195; Premi&#xE8;re fois sur cet exo &#x2014; s&#xE9;ance de calibration&#x202F;: retiens le poids qui te laisse ~2 reps de marge, la vraie progression d&#xE9;marre maintenant.');
      // Calibration ⇒ proposer de CALER la référence sur le dernier poids ayant produit une
      // série valide (cible à -2 près) — ajustable au stepper avant d'appliquer (05/08)
      if(isKg&&tRep&&out.suggestTo==null){
        var _cw=null;
        sets.forEach(function(s2){ var w2=(s2.w!=null?s2.w:x.weight); if(s2.reps>=tRep-setTol(tRep)) _cw=w2; });
        if(_cw!=null&&_cw!==getCurrentWeight(x.key)) out.suggestTo=_cw;
      }
    } else {
      var _prevd=rankLastExecBefore(x.key,todayStr());
      if(_prevd){
        var _gap=Math.round((getNow()-new Date(_prevd))/86400000);
        if(_gap>=30) out.lines.push('&#x267B;&#xFE0F; '+_gap+' jours sans cet exo &#x2014; bon retour. Les 1res s&#xE9;ances de reprise sous-performent toujours un peu&#x202F;: ne juge pas ce poids trop vite.');
      }
    }
  }catch(e){}
  // Exos unilatéraux : détection d'asymétrie gauche/droite sur les ressentis de la séance
  if(x.uni){
    var W={facile:0,ok:1,dur:2,echec:3};
    var gT=0,dT=0,both=0;
    sets.forEach(function(s){ if(s.feelG&&s.feelD){ gT+=(W[s.feelG]||0); dT+=(W[s.feelD]||0); both++; } });
    if(both&&gT>dT) out.lines.push('&#x1F448; C&#xF4;t&#xE9; GAUCHE plus dur que le droit aujourd\'hui &#x2014; normal, c\'est le c&#xF4;t&#xE9; faible qui d&#xE9;cide de la charge. Ne monte pas tant que le gauche ne valide pas proprement.');
    else if(both&&dT>gT) out.lines.push('&#x1F449; C&#xF4;t&#xE9; DROIT plus dur que le gauche aujourd\'hui &#x2014; c\'est lui qui d&#xE9;cide de la charge : ne monte pas tant qu\'il ne valide pas proprement.');
    else if(both) out.lines.push('&#x2696;&#xFE0F; Gauche et droite au m&#xEA;me niveau &#x2014; parfait, z&#xE9;ro d&#xE9;s&#xE9;quilibre &#xE0; signaler.');
  }
  if(x.key==='rowing_uni'&&out.suggest!==1){
    out.lines.push('&#x1F511; Exo focus d&#xE9;blocage&#x202F;: vise +1 rep par s&#xE9;ance plut&#xF4;t que +1 kg, et verrouille le buste (z&#xE9;ro rotation).');
  }
  // Note faible sur un principal → on ferme TOUJOURS avec un plan concret pour la prochaine
  try{
    if(!side&&counted&&sets.length&&tRep){
      var _fsc=asScoreExo(x);
      if(_fsc<=2.5){
        var _plan=out.suggest===-1
          ?(inv?'un cran d\'assistance EN PLUS (plus facile)':'un cran de charge EN DESSOUS')
          :'le m&#xEA;me poids';
        out.lines.push('&#x1F4CC; Plan pour la prochaine&#x202F;: '+_plan+', '+n+' s&#xE9;ries, objectif <strong>'+tRep+unit+'</strong> par s&#xE9;rie, derni&#xE8;re s&#xE9;rie &#xE0; l\'&#xE9;chec honn&#xEA;te. On rejuge l&#xE0;-dessus.');
      }
    }
  }catch(e){}
  return out;
}
function asAnalyzeSession(){
  var notes=[];
  var e=AS.end;
  var dur=asElapsedMin();
  // ❄ Reprise après gel (26/08) : EN PREMIER — tout le reste de l'analyse se lit avec ce contexte
  try{ var _rep=asRepriseCtx(); if(_rep) notes.push(gelRepriseNote(_rep)); }catch(err){}
  // Les exos annexes (bonus/ajoutés) non complétés ne comptent ni en done ni en skip
  var _eng=liveEngagedExos(AS.exos);
  var doneCt=_eng.filter(function(x){return x.status==='done'||liveExoCounted(x);}).length;
  var skipCt=_eng.filter(function(x){return x.status==='skipped'&&!liveExoCounted(x);}).length;
  var allSets=AS.exos.reduce(function(a,x){return a+x.sets.length;},0);
  var tonnage=0;
  AS.exos.forEach(function(x){
    if(!/kg/.test(x.unite)||asIsInverse(x.key)) return;
    x.sets.forEach(function(s){ tonnage+=(s.w||x.weight)*s.reps; });
  });
  var perfect=doneCt===_eng.length&&_eng.every(function(x){return x.status!=='done'||x.sets.slice(0,x.n).every(function(s){return s.reps>=x.reps;});});

  // Durée jugée au rythme PAR SÉRIE (04/09, retour Adrien : « ça me dit toujours trop long ») :
  // les repos prescrits sont de 2-3 min sur les composés (COACH.md §3) → 3-4,5 min/série chargée
  // (repos + exécution + réglages) est le rythme NORMAL du programme, pas une séance qui traîne.
  // L'ancien seuil 10 min/exo condamnait mécaniquement tout exo à 4 séries fait dans les règles.
  var _worked=AS.exos.filter(function(x){return x.sets.length;}).length||1;
  var _setPace=allSets?dur/allSets:99;
  if(dur<30) notes.push(asPick(['&#x26A1; S&#xE9;ance expresse ('+dur+' min) &#x2014; efficace. Si tu avais plus de temps, un exo bonus aurait sa place.','&#x26A1; '+dur+' min chrono &#x2014; dense et sans blabla. Parfait quand la journ&#xE9;e est charg&#xE9;e.']));
  else if(_setPace<=4.5) notes.push(asPick(['&#x23F1; '+dur+' min pour '+allSets+' s&#xE9;ries &#x2014; rythme sain, repos complets tenus&#x202F;: exactement le programme.','&#x23F1; '+dur+' min, '+_worked+' exos&#x202F;: bonne densit&#xE9; de travail, pile ce qu\'il faut.']));
  else if(_setPace<=5.5) notes.push('&#x23F1; '+dur+' min pour '+allSets+' s&#xE9;ries &#x2014; rythme tranquille mais dans les clous&#x202F;: les repos complets font partie du programme.');
  else notes.push(asPick(['&#x23F1; '+(Math.round(_setPace*10)/10).toString().replace('.',',')+' min par s&#xE9;rie en moyenne &#x2014; l&#xE0; il y a vraiment du temps mort (machines prises&#x202F;?)&#x202F;: r&#xE9;organise l\'ordre via le menu &#x2630; plut&#xF4;t que d\'attendre.','&#x23F1; '+dur+' min pour '+allSets+' s&#xE9;ries &#x2014; s&#xE9;ance qui s\'&#xE9;tire au-del&#xE0; des repos pr&#xE9;vus. Vise des repos chronom&#xE9;tr&#xE9;s&#x202F;: le timer est l&#xE0; pour &#xE7;a.']));

  if(perfect&&!skipCt&&doneCt>0) notes.push('&#x1F3C6; S&#xE9;ance PARFAITE&#x202F;: tous les exos, toutes les s&#xE9;ries, toutes les reps. &#xC7;a ne se voit pas tous les jours.');
  else if(!skipCt&&doneCt>0) notes.push(asPick(['&#x2705; Tous les exos pr&#xE9;vus ont &#xE9;t&#xE9; faits &#x2014; la constance, c\'est &#xE7;a qui construit.','&#x2705; Programme d&#xE9;roul&#xE9; en entier, rien laiss&#xE9; de c&#xF4;t&#xE9;.']));
  if(skipCt===1) notes.push('&#x23ED; 1 exo pass&#xE9; &#x2014; aucun impact si &#xE7;a reste occasionnel. Il est not&#xE9; pour la prochaine.');
  else if(skipCt>=2) notes.push('&#x23ED; '+skipCt+' exos pass&#xE9;s &#x2014; s&#xE9;ance all&#xE9;g&#xE9;e. Mieux vaut &#xE7;a que z&#xE9;ro s&#xE9;ance&#x202F;: tu es venu, c\'est l\'essentiel.');

  if(e.energy&&e.feeling){
    if(e.energy<=2&&e.feeling>=4) notes.push(asPick(['&#x1F31F; Arriv&#xE9; &#xE0; plat, reparti avec une bonne s&#xE9;ance &#x2014; ce sont les s&#xE9;ances qui comptent double mentalement.','&#x1F31F; Peu d\'&#xE9;nergie mais belle s&#xE9;ance&#x202F;: exactement le genre de victoire qui forge la r&#xE9;gularit&#xE9;.']));
    else if(e.energy<=2&&e.feeling<=2) notes.push(asPick(['&#x1F634; Jour sans, &#xE7;a arrive. V&#xE9;rifie sommeil + repas d\'avant-s&#xE9;ance (glucides 1-2h avant). Tu es quand m&#xEA;me venu&#x202F;: respect.','&#x1F634; &#xC9;nergie et ressenti au plancher &#x2014; surveille ton sommeil et tes apports du jour. Une s&#xE9;ance moyenne faite bat une s&#xE9;ance parfaite annul&#xE9;e.']));
    else if(e.energy>=4&&e.feeling>=4) notes.push(asPick(['&#x1F525; Plein d\'&#xE9;nergie + s&#xE9;ance top&#x202F;: c\'est le moment de pousser les hausses de poids sugg&#xE9;r&#xE9;es.','&#x1F525; Grosse forme aujourd\'hui &#x2014; note ce que tu as mang&#xE9;/dormi hier, c\'est ta recette gagnante.']));
    else if(e.energy>=4&&e.feeling<=2) notes.push('&#x1F914; Bonne &#xE9;nergie mais s&#xE9;ance ressentie difficile &#x2014; souvent un signe que les charges ont mont&#xE9; trop vite quelque part. Le d&#xE9;tail par exo suit.');
    else notes.push(asPick(['&#x1F44C; S&#xE9;ance solide dans l\'ensemble &#x2014; c\'est la r&#xE9;gularit&#xE9; de ces s&#xE9;ances &#xAB;&#x202F;normales&#x202F;&#xBB; qui fait la prise de masse.','&#x1F44C; Rien d\'exceptionnel, rien de rat&#xE9;&#x202F;: une brique de plus au mur. C\'est comme &#xE7;a qu\'on construit.']));
  }

  if(e.context==='temps') notes.push('&#x23F0; S&#xE9;ance sous contrainte de temps &#x2014; not&#xE9;. Les exos pass&#xE9;s ne co&#xFB;tent rien aujourd\'hui&#x202F;: venir quand m&#xEA;me, c\'est d&#xE9;j&#xE0; la victoire.');
  else if(e.context==='blessure') notes.push('&#x1FA79; Blessure/douleur d&#xE9;clar&#xE9;e &#x2014; les all&#xE8;gements et exos pass&#xE9;s sont compens&#xE9;s. G&#xE9;rer &gt; forcer.');
  else if(e.context==='energie') notes.push('&#x1F634; Jour en sous-r&#xE9;gime d&#xE9;clar&#xE9; &#x2014; malus r&#xE9;duits. Surveille sommeil + repas d\'avant s&#xE9;ance.');
  else if(e.context==='malade') notes.push('&#x1F912; Malade et quand m&#xEA;me venu &#x2014; malus r&#xE9;duits. &#xC9;coute ton corps, l&#xE8;ve le pied si besoin.');
  // ── Situations additionnelles (01/08) ──
  // Courbe de fatigue : la 2e moitié des exos décroche (ou l'inverse)
  var engOrder=_eng.filter(function(x){return x.sets.length;});
  if(engOrder.length>=4){
    var half=Math.floor(engOrder.length/2), a1=0, a2=0;
    engOrder.slice(0,half).forEach(function(x){a1+=asScoreExoRaw(x);});
    engOrder.slice(-half).forEach(function(x){a2+=asScoreExoRaw(x);});
    a1/=half; a2/=half;
    if(a1-a2>=1) notes.push('&#x1F4C9; Tes derniers exos d&#xE9;crochent nettement par rapport au d&#xE9;but &#x2014; la fatigue parle&#x202F;: glucides 1-2h avant s&#xE9;ance, ou place tes exos prioritaires plus t&#xF4;t.');
    else if(a2-a1>=1) notes.push('&#x1F4C8; Fin de s&#xE9;ance plus forte que le d&#xE9;but &#x2014; tu es long &#xE0; chauffer&#x202F;: allonge l\'&#xE9;chauffement pour rentabiliser tes premiers exos.');
  }
  // Pattern trans-exos : des séries arrêtées sous la cible sans échec sur PLUSIEURS exos
  // = il ne suit probablement pas les cibles (elles varient de 8 à 15 selon l'exo)
  var _softExos=_eng.filter(function(x){
    if(!x.sets.length||!x.reps) return false;
    return x.sets.slice(0,x.n||3).filter(function(s){return setSoftFail(s,x.reps);}).length>=2;
  }).length;
  if(_softExos>=3) notes.push('&#x1F522; Sur '+_softExos+' exos, tes s&#xE9;ries s\'arr&#xEA;tent sous la cible sans &#xE9;chec &#x2014; le sc&#xE9;nario classique du compte fixe dans la t&#xEA;te. Rappel&#x202F;: chaque exo a SA cible (8, 10, 12 ou 15 reps), elle est affich&#xE9;e en gros sur l\'&#xE9;cran de s&#xE9;rie&#x202F;: c\'est elle qui d&#xE9;cide de la fin, pas l\'habitude.');
  // Homogénéité : un maillon faible ou une séance à deux visages se voit d'un coup d'œil
  var _scored=_eng.filter(function(x){return x.sets.length;}).map(function(x){return {n:getExoName(x.key),s:asScoreExo(x)};});
  if(_scored.length>=3){
    var _mx=_scored.reduce(function(a,b){return b.s>a.s?b:a;});
    var _mn=_scored.reduce(function(a,b){return b.s<a.s?b:a;});
    if(_mn.s>=4) notes.push('&#x1F48E; Aucun maillon faible&#x202F;: tous les principaux &#xE0; 4/5 ou plus. C\'est le profil des s&#xE9;ances qui font monter les charges partout en m&#xEA;me temps.');
    else if(_mx.s-_mn.s>=2.5) notes.push('&#x1F3AD; S&#xE9;ance &#xE0; deux visages&#x202F;: '+_mx.n+' brillant ('+String(_mx.s).replace('.',',')+'/5) pendant que '+_mn.n+' d&#xE9;croche ('+String(_mn.s).replace('.',',')+'/5). Regarde son analyse&#x202F;: souvent un simple probl&#xE8;me de charge ou de placement dans la s&#xE9;ance.');
  }
  // Densité de travail
  if(dur>0&&allSets>=12&&allSets/dur>=0.5) notes.push('&#x26A1; '+allSets+' s&#xE9;ries en '+dur+' min &#x2014; s&#xE9;ance dense, repos tenus&#x202F;: c\'est du travail rentable.');
  // Volume inhabituel
  if(_eng.length>=7) notes.push('&#x1F3D7;&#xFE0F; '+_eng.length+' exos engag&#xE9;s &#x2014; grosse s&#xE9;ance de volume. Mange &#xE0; la hauteur derri&#xE8;re, c\'est l&#xE0; que &#xE7;a se gagne.');
  // Échauffement (nouvelle étape 02/08) — préparation = performance, sans culpabiliser
  if(AS.warmupDone===false) notes.push('&#x1F525; &#xC9;chauffement pass&#xE9; aujourd\'hui &#x2014; 5 min de pr&#xE9;paration = de meilleures premi&#xE8;res s&#xE9;ries et des &#xE9;paules/poignets qui durent. Essaie de le garder.');
  // Étirements de fin (+15 pts) — voir COACH.md : posture = SA priorité, pas la souplesse pour la souplesse
  if(e.stretch===true) notes.push('&#x1F9D8; &#xC9;tirements de fin valid&#xE9;s &#x2014; 2 min de fl&#xE9;chisseurs de hanche par jambe&#x202F;: le geste posture n&#xB0;1 de ton profil.');
  else if(DB.dz&&DB.dz[todayStr()]&&DB.dz[todayStr()].stretch) notes.push('&#x1F9D8; &#xC9;tirements du jour d&#xE9;j&#xE0; faits dans l\'espace D&#xE9;tente &#x2014; +15 pts au bilan de la semaine, ta posture te dit merci.');
  var _pains=(e.pains||[]).filter(function(p){return p.lvl;});
  if(e.painAny===false||(e.painAny==null&&e.pain===0)) notes.push('&#x1FA79; Z&#xE9;ro douleur aujourd\'hui &#x2014; les prises neutres et l\'&#xE9;chauffement font le job.');
  _pains.forEach(function(p){
    var lv=p.lvl, z=painZoneLabel(p.z);
    if(p.z==='poignet'){
      if(lv<=2) notes.push('&#x1FA79; Poignet&#x202F;: g&#xEA;ne l&#xE9;g&#xE8;re ('+lv+'/5) &#x2014; dans le cadre pr&#xE9;vu. Continue les prises neutres et surveille que &#xE7;a ne monte pas.');
      else if(lv===3) notes.push('&#x1FA79; Poignet&#x202F;: douleur moyenne (3/5) &#x2014; all&#xE8;ge les exos de tirage la prochaine fois et gla&#xE7;age 10 min ce soir si &#xE7;a chauffe.');
      else notes.push('&#x26A0;&#xFE0F; Poignet&#x202F;: douleur forte ('+lv+'/5). Ne force pas dessus&#x202F;: prochaine s&#xE9;ance sans tirage lourd, et mentionne-le au chirurgien. Le journal garde la trace.');
    }
    else if(lv<=2) notes.push('&#x1FA79; '+z+'&#x202F;: g&#xEA;ne l&#xE9;g&#xE8;re ('+lv+'/5) &#x2014; surveille-la &#xE0; la prochaine s&#xE9;ance, sur les m&#xEA;mes exos.');
    else if(lv===3) notes.push('&#x1FA79; '+z+'&#x202F;: douleur moyenne (3/5) &#x2014; all&#xE8;ge les exos qui la sollicitent la prochaine fois, et glace 10 min ce soir si &#xE7;a chauffe.');
    else notes.push('&#x26A0;&#xFE0F; '+z+'&#x202F;: douleur forte ('+lv+'/5). Ne charge pas cette zone &#xE0; la prochaine s&#xE9;ance (variante ou autre exo), et si &#xE7;a persiste au repos, on consulte.');
  });

  var prev=null;
  (DB.logs||[]).forEach(function(l){
    if(!l.live||String(l.id)===String(AS.savedLogId)) return;
    if(AS.sid&&(l.sessions||[]).indexOf(AS.sid)<0) return;
    if(!prev||l.date>prev.date) prev=l;
  });
  if(prev&&tonnage>0){
    var pt=0;
    (prev.live.exos||[]).forEach(function(x){
      if(!/kg/.test(x.unite||'kg')||asIsInverse(x.key)) return;
      (x.sets||[]).forEach(function(s){ pt+=(s.w||x.w||0)*s.reps; });
    });
    if(pt>0){
      var diff=Math.round((tonnage-pt)/pt*100);
      if(diff>=8) notes.push('&#x1F4CA; Volume total '+Math.round(tonnage)+' kg soulev&#xE9;s&#x202F;: <strong>+'+diff+'%</strong> vs ta derni&#xE8;re s&#xE9;ance comparable. La surcharge progressive est l&#xE0;.');
      else if(diff<=-10) notes.push('&#x1F4CA; Volume en baisse ('+diff+'%) vs la derni&#xE8;re fois &#x2014; normal si s&#xE9;ance &#xE9;court&#xE9;e ou jour sans, &#xE0; surveiller si &#xE7;a se r&#xE9;p&#xE8;te.');
      else notes.push('&#x1F4CA; Volume stable vs la derni&#xE8;re s&#xE9;ance comparable ('+Math.round(tonnage)+' kg soulev&#xE9;s au total).');
    }
  } else if(tonnage>0){
    notes.push('&#x1F4CA; '+Math.round(tonnage)+' kg soulev&#xE9;s au total sur '+allSets+' s&#xE9;ries &#x2014; premi&#xE8;re r&#xE9;f&#xE9;rence enregistr&#xE9;e, on comparera d&#xE8;s la prochaine.');
  }

  // Compteur hebdo FIGÉ au moment de la séance (fix 02/08) : le bilan de la 1re séance de la
  // semaine dit 1/4 pour toujours, même relu après la 3e — on ne compte que les logs d'avant.
  var _refLog=(DB.logs||[]).find(function(l){return String(l.id)===String(AS.savedLogId);});
  var _refD=_refLog?_refLog.date:todayStr();
  var _refT=_refLog?(_refLog.time||'23:59'):'23:59';
  var wstart=new Date(_refD+'T00:00:00'); var dow=wstart.getDay(); var off=dow===0?6:dow-1;
  wstart.setDate(wstart.getDate()-off); wstart.setHours(0,0,0,0);
  var wk=weekValue((DB.logs||[]).filter(function(l){
    if(new Date(l.date)<wstart) return false;
    if(l.date>_refD) return false;
    if(l.date===_refD&&(l.time||'')>_refT&&String(l.id)!==String(AS.savedLogId)) return false;
    return true;
  }));
  var goal=getWeekGoal();
  if(wk>=goal) notes.push('&#x1F4C5; '+fmtSeances(wk)+'/'+goal+' cette semaine &#x2014; objectif hebdo valid&#xE9;&#x202F;!');
  else if(wk===goal-1||wk===goal-0.5) notes.push('&#x1F4C5; S&#xE9;ance n&#xB0;'+fmtSeances(wk)+' de la semaine ('+fmtSeances(wk)+'/'+goal+') &#x2014; plus qu\'une et la semaine est verte.');
  else notes.push('&#x1F4C5; S&#xE9;ance n&#xB0;'+fmtSeances(wk)+' de la semaine ('+fmtSeances(wk)+'/'+goal+').');

  if(e.stretch!==true&&!(DB.dz&&DB.dz[todayStr()]&&DB.dz[todayStr()].stretch)) notes.push('&#x1F9CE; Avant de dormir&#x202F;: passe par l\'espace <strong>D&#xE9;tente &#x1F9D8;</strong> &#x2014; &#xAB;&#x202F;&#xC9;tirer ma s&#xE9;ance du jour&#x202F;&#xBB; te fait le plan en ~10 min (+15 pts au bilan hebdo). Fl&#xE9;chisseurs de hanche non-n&#xE9;gociables.');
  return notes;
}

// ── Stats déterministes du bilan (04/09) : alimentent les TUILES de la slide Analyse ──
// Miroir volontaire des calculs d'asAnalyzeSession (qui, elle, génère les PHRASES, gravées une
// fois dans AS.reportNotes) : ici tout se recalcule à chaque rendu, anciens bilans compris.
function asRepStats(){
  var dur=asElapsedMin();
  var eng=liveEngagedExos(AS.exos);
  var doneCt=eng.filter(function(x){return x.status==='done'||liveExoCounted(x);}).length;
  var skipCt=eng.filter(function(x){return x.status==='skipped'&&!liveExoCounted(x);}).length;
  var allSets=AS.exos.reduce(function(a,x){return a+x.sets.length;},0);
  var tonnage=0;
  AS.exos.forEach(function(x){
    if(!/kg/.test(x.unite)||asIsInverse(x.key)) return;
    x.sets.forEach(function(s){ tonnage+=(s.w||x.weight)*s.reps; });
  });
  var perfect=doneCt===eng.length&&eng.every(function(x){return x.status!=='done'||x.sets.slice(0,x.n).every(function(s){return s.reps>=x.reps;});});
  var prev=null,prevDiff=null;
  (DB.logs||[]).forEach(function(l){
    if(!l.live||String(l.id)===String(AS.savedLogId)) return;
    if(AS.sid&&(l.sessions||[]).indexOf(AS.sid)<0) return;
    if(!prev||l.date>prev.date) prev=l;
  });
  if(prev&&tonnage>0){
    var pt=0;
    (prev.live.exos||[]).forEach(function(x){
      if(!/kg/.test(x.unite||'kg')||asIsInverse(x.key)) return;
      (x.sets||[]).forEach(function(s){ pt+=(s.w||x.w||0)*s.reps; });
    });
    if(pt>0) prevDiff=Math.round((tonnage-pt)/pt*100);
  }
  var _refLog=(DB.logs||[]).find(function(l){return String(l.id)===String(AS.savedLogId);});
  var _refD=_refLog?_refLog.date:todayStr();
  var _refT=_refLog?(_refLog.time||'23:59'):'23:59';
  var wstart=new Date(_refD+'T00:00:00'); var dow=wstart.getDay(); var off=dow===0?6:dow-1;
  wstart.setDate(wstart.getDate()-off); wstart.setHours(0,0,0,0);
  var wk=weekValue((DB.logs||[]).filter(function(l){
    if(new Date(l.date)<wstart) return false;
    if(l.date>_refD) return false;
    if(l.date===_refD&&(l.time||'')>_refT&&String(l.id)!==String(AS.savedLogId)) return false;
    return true;
  }));
  return {dur:dur,eng:eng,doneCt:doneCt,skipCt:skipCt,allSets:allSets,setPace:allSets?dur/allSets:0,
    tonnage:tonnage,prevDiff:prevDiff,perfect:perfect,wk:wk,goal:getWeekGoal()};
}
// Une tuile du verdict visuel (label · grosse valeur · sous-ligne colorée par l'état)
function asAnaTile(lbl,val,unit,sub,tone){
  return '<div class="as-ana-tile t-'+tone+'"><span class="as-ana-lbl">'+lbl+'</span>'
    +'<span class="as-ana-val">'+val+(unit?'<small>'+unit+'</small>':'')+'</span>'
    +'<span class="as-ana-sub">'+sub+'</span></div>';
}
// Un « point clé » : emoji + accroche sur UNE ligne, tap = la phrase complète.
// L'accroche = le début de la note jusqu'au premier séparateur naturel (— · : · point).
function asAnaRow(n){
  var m=/^\s*((?:&#x[0-9A-Fa-f]+;)+)\s*([\s\S]*)$/.exec(n);
  var ico=m?m[1]:'&#x1F4DD;';
  var body=m?m[2]:n;
  var cut=-1;
  [' &#x2014; ','&#x202F;: ','&#x202F;:',' : ','. '].forEach(function(sep){
    var i=body.indexOf(sep);
    if(i>15&&(cut<0||i<cut)) cut=i;
  });
  var head=cut>0?body.slice(0,cut):body;
  var more=cut>0;
  return '<div class="as-ana-row'+(more?'':' nomore')+'"'+(more?' onclick="this.classList.toggle(\'open\')"':'')+'>'
    +'<span class="as-ana-ico">'+ico+'</span>'
    +'<span class="as-ana-body"><span class="as-ana-head">'+head+'</span><span class="as-ana-full">'+body+'</span></span>'
    +(more?'<span class="as-ana-arr">&#x25BE;</span>':'')
    +'</div>';
}

// ── Chrono d'étirement (slide étirements du bilan) ──
var _stTimer=null;
function asStretchStart(sec,endLbl){
  if(_stTimer){ clearInterval(_stTimer); _stTimer=null;
    var b0=document.getElementById('as-st-btn'); if(b0) b0.innerHTML='&#x25B6; Relancer '+formatTime(sec);
    return;
  }
  var end=Date.now()+sec*1000;
  var b=document.getElementById('as-st-btn');
  if(b) b.innerHTML='<span id="as-st-time">'+formatTime(sec)+'</span> &#x2014; rel&#xE2;che, respire...';
  _stTimer=setInterval(function(){
    var rem=Math.max(0,Math.ceil((end-Date.now())/1000));
    var t=document.getElementById('as-st-time'); if(t) t.textContent=formatTime(rem);
    if(rem<=0){
      clearInterval(_stTimer); _stTimer=null;
      asSound('go');
      if(navigator.vibrate) navigator.vibrate([180,90,180]);
      var b2=document.getElementById('as-st-btn'); if(b2) b2.innerHTML=endLbl||'&#x1F504; Change de jambe &#x2014; relancer 2:00';
    }
  },250);
}
// Slide étirements : fléchisseurs de hanche en héro (non-négociable) + routine du type de séance
// ══════════════════════════════════════════════════
// ESPACE DÉTENTE 🧘 (04/08, demande Adrien) — bouton dédié de la vue Séances.
// ① Posture au quotidien : LES gestes pour SON corps (antéversion bassin, épaules enroulées,
//    tête/nuque, mâchoire) — coche du jour, zéro points, juste la routine.
// ② Étirements sur mesure : sélection d'exos OU dernière séance → LE plan d'étirements optimal
//    (couverture pondérée des muscles travaillés, 6 gestes max + le héro fléchisseurs, jamais long).
// Valider les étirements coche DB.dz[jour].stretch → bulle 🧘 au calendrier + 15 pts/jour
// comptés AU BILAN HEBDO (cap 4/sem). Plus aucun point par séance (04/08 soir).
// ══════════════════════════════════════════════════
var DZ=null;
// Routines quotidiennes posture/apparence — construites sur SON diagnostic (COACH.md) :
// antéversion du bassin, épaules enroulées (pecs raides + fixateurs faibles), tête d'écran, mâchoire.
// Chaque item a sa page détail (image, conseils, erreurs, chrono) — tap = détail, rond = coche du jour.
var DZ_DAILY=[
  {id:'hip',ico:'&#x1F9CE;',name:'Fl&#xE9;chisseurs de hanche',dose:'2 min / jambe',vid:'imgs/vids/dz_hip.mp4',pic:'imgs/dz_hip.jpg',secs:120,side:true,
    cue:'Fente &#xE0; genou, fesse arri&#xE8;re serr&#xE9;e, bassin qui avance. Dos neutre.',
    why:'Ton n&#xB0;1 &#x2014; corrige l\'ant&#xE9;version du bassin.',
    tips:['Serre la fesse AVANT d\'avancer le bassin.','Plus profond &#xE0; chaque expiration.'],
    errs:['Cambrer pour aller plus loin.','Rebondir.']},
  {id:'chin',ico:'&#x1F9CD;',name:'Chin tucks',dose:'2&#xD7;15',vid:'imgs/vids/dz_chin.mp4',pic:'imgs/dz_chin.jpg',secs:null,
    cue:'Menton vers l\'arri&#xE8;re (double menton), nuque longue, 2 s.',
    why:'Recule la t&#xEA;te avanc&#xE9;e par les &#xE9;crans.',
    tips:['Debout ou allong&#xE9;, la nuque s\'allonge vers le haut.'],
    errs:['Baisser le menton vers la poitrine &#x2014; le geste est horizontal.']},
  {id:'langue',ico:'&#x1F445;',name:'Langue au palais',dose:'toute la journ&#xE9;e',secs:null,
    cue:'Langue enti&#xE8;re coll&#xE9;e au palais, dents d&#xE9;coll&#xE9;es, l&#xE8;vres ferm&#xE9;es, respiration par le nez.',
    why:'Posture de repos de la m&#xE2;choire &#x2014; dessine le bas du visage sur des mois.',
    tips:['Rep&#xE8;re&#x202F;: dis &#xAB;&#x202F;ning&#x202F;&#xBB;, garde la position de fin.'],
    errs:['Serrer les dents.']},
  {id:'pecs',ico:'&#x1F6AA;',name:'Ouverture pecs',dose:'30 s / c&#xF4;t&#xE9;',vid:'imgs/vids/dz_chest.mp4',pic:'imgs/dz_chest.jpg',secs:30,side:true,
    cue:'Avant-bras contre le cadre, coude &#xE0; hauteur d\'&#xE9;paule, avance d\'un petit pas.',
    why:'Pecs raides = &#xE9;paules enroul&#xE9;es.',
    tips:['&#xC9;paules basses.','Varie la hauteur du coude.'],
    errs:['Cambrer.','Forcer si &#xE7;a pince.']},
  {id:'scap',ico:'&#x1F9B4;',name:'R&#xE9;tractions scapulaires',dose:'2&#xD7;10 &#xB7; 2 s',vid:'imgs/vids/dz_scap.mp4',pic:'imgs/dz_scap.jpg',secs:null,
    cue:'Omoplates vers l\'arri&#xE8;re-bas, 2 s, rel&#xE2;che lentement.',
    why:'L\'antagoniste de tes &#xE9;paules enroul&#xE9;es.',
    tips:['Z&#xE9;ro mat&#xE9;riel, debout ou assis.'],
    errs:['Hausser les &#xE9;paules.']},
  {id:'deadbug',ico:'&#x1FAB2;',name:'Dead bug lent',dose:'2&#xD7;10',vid:'imgs/vids/dz_deadbug.mp4',pic:'imgs/dz_deadbug.jpg',secs:null,
    cue:'Sur le dos, bas du dos plaqu&#xE9;&#x202F;: tends lentement bras et jambe oppos&#xE9;s.',
    why:'Apprend au bassin &#xE0; rester neutre.',
    tips:['Expire en tendant.','2-3 s par rep.'],
    errs:['Le bas du dos qui d&#xE9;colle.']}
];
// Muscles réellement sollicités par chaque exo (pour le générateur d'étirements)
var DZ_MUSCLE_OF={
  dev_incline:['pecs','epaules','triceps'],chestpress_v:['pecs','triceps'],pecdeck:['pecs'],
  cable_fly:['pecs'],seated_dips:['pecs','triceps'],dev_militaire:['epaules','triceps'],
  shoulder_press:['epaules','triceps'],elev_lat:['epaules'],pompes:['pecs','triceps'],
  triceps_corde:['triceps'],poulie_triceps_av:['triceps'],triceps_barre:['triceps'],
  tirage_vert:['dos','biceps'],tirage_pulldown:['dos','biceps'],traction_assist:['dos','biceps'],
  rowing_pb:['dos','biceps','lombaires'],rowing_uni:['dos','biceps'],rowing_appui:['dos','biceps'],
  face_pull:['epaules','trapezes'],shrug_halt:['trapezes'],
  curl_marteau:['biceps','avantbras'],curl_corde:['biceps'],curl_halt:['biceps'],curl_poulie:['biceps'],curl_incline:['biceps'],
  gripper:['avantbras'],
  leg_press:['quadris','fessiers'],leg_ext:['quadris'],leg_curl:['ischios'],mollets:['mollets'],
  hip_thrust:['fessiers','ischios','lombaires'],abduct:['fessiers'],adduct:['adducteurs'],
  crunch_poulie:['abdos'],releve_chaise:['abdos','hanches'],pallof:['abdos'],dead_bug:['abdos'],crunch_leste:['abdos'],
  hollow_hold:['abdos'],crunch:['abdos'],gainage:['abdos'],
  cardio_liss:['quadris','mollets'],cardio_rameur:['dos','quadris']
};
// Bibliothèque d'étirements : covers = muscles couverts (le générateur fait du set-cover pondéré),
// secs = chrono proposé (null = pas de chrono, ex. mouvements lents), side = à faire des 2 côtés.
var DZ_LIB=[
  {id:'chest',covers:['pecs'],name:'Ouverture pectoraux au mur',vid:'imgs/vids/dz_chest.mp4',pic:'imgs/dz_chest.jpg',dur:'30s / c&#xF4;t&#xE9;',secs:30,side:true,cue:'Avant-bras au mur, coude &#xE0; hauteur d\'&#xE9;paule, avance le buste.'},
  {id:'childpose',covers:['dos','epaules','lombaires'],name:'Posture de l\'enfant',vid:'imgs/vids/dz_childpose.mp4',pic:'imgs/dz_childpose.jpg',dur:'40s',secs:40,cue:'Assis sur les talons, bras loin devant, front au sol.'},
  {id:'lat',covers:['dos'],name:'Grand dorsal au mur',vid:'imgs/vids/dz_lat.mp4',pic:'imgs/dz_lat.jpg',dur:'30s',secs:30,cue:'Mains au mur, descends le buste jusqu\'&#xE0; sentir les dorsaux.'},
  {id:'shoulder',covers:['epaules'],name:'&#xC9;paule crois&#xE9;e',vid:'imgs/vids/dz_shoulder.mp4',pic:'imgs/dz_shoulder.jpg',dur:'30s / c&#xF4;t&#xE9;',secs:30,side:true,cue:'Bras tendu en travers de la poitrine, l\'autre le plaque.'},
  {id:'triceps',covers:['triceps'],name:'Triceps au-dessus de la t&#xEA;te',vid:'imgs/vids/dz_triceps.mp4',pic:'imgs/dz_triceps.jpg',dur:'25s / c&#xF4;t&#xE9;',secs:25,side:true,cue:'Coude au plafond, l\'autre main pousse doucement.'},
  {id:'biceps',covers:['biceps'],name:'Biceps au mur',vid:'imgs/vids/dz_biceps.mp4',pic:'imgs/dz_biceps.jpg',dur:'25s / c&#xF4;t&#xE9;',secs:25,side:true,cue:'Main au mur derri&#xE8;re toi, bras tendu, penche-toi en avant.'},
  {id:'forearm',covers:['avantbras'],name:'Avant-bras / poignets',vid:'imgs/vids/dz_forearm.mp4',pic:'imgs/dz_forearm.jpg',dur:'20s / c&#xF4;t&#xE9;',secs:20,side:true,cue:'Bras tendu paume vers le haut, tire les doigts vers le bas. Doux sur le poignet gauche.'},
  {id:'neck',covers:['trapezes'],name:'Nuque / trap&#xE8;zes',vid:'imgs/vids/dz_neck.mp4',pic:'imgs/dz_neck.jpg',dur:'20s / c&#xF4;t&#xE9;',secs:20,side:true,cue:'La main am&#xE8;ne l\'oreille vers l\'&#xE9;paule, l\'autre &#xE9;paule reste basse.'},
  {id:'quad',covers:['quadris'],name:'Quadriceps debout',vid:'imgs/vids/dz_quad.mp4',pic:'imgs/dz_quad.jpg',dur:'30s / c&#xF4;t&#xE9;',secs:30,side:true,cue:'Talon vers la fesse, genoux coll&#xE9;s, bassin neutre.'},
  {id:'ham',covers:['ischios'],name:'Ischio-jambiers',vid:'imgs/vids/dz_ham.mp4',pic:'imgs/dz_ham.jpg',dur:'30s / c&#xF4;t&#xE9;',secs:30,side:true,cue:'Jambe devant tendue, pointe relev&#xE9;e, penche le buste dos droit.'},
  {id:'glute',covers:['fessiers'],name:'Fessiers allong&#xE9; (figure 4)',vid:'imgs/vids/dz_glute.mp4',pic:'imgs/dz_glute.jpg',dur:'30s / c&#xF4;t&#xE9;',secs:30,side:true,cue:'Sur le dos, cheville sur le genou oppos&#xE9;, tire la cuisse vers toi.'},
  {id:'calf',covers:['mollets'],name:'Mollets au mur',vid:'imgs/vids/dz_calf.mp4',pic:'imgs/dz_calf.jpg',dur:'30s / c&#xF4;t&#xE9;',secs:30,side:true,cue:'Jambe arri&#xE8;re tendue, talon au sol, pousse le mur.'},
  {id:'adductor',covers:['adducteurs'],name:'Papillon (adducteurs)',vid:'imgs/vids/dz_adductor.mp4',pic:'imgs/dz_adductor.jpg',dur:'30s',secs:30,cue:'Assis, plantes de pieds jointes, genoux vers le sol, dos droit.'},
  {id:'cat',covers:['abdos','dos','lombaires'],name:'Chat-vache',vid:'imgs/vids/dz_cat.mp4',pic:'imgs/dz_cat.jpg',dur:'8 lents',secs:null,cue:'&#xC0; quatre pattes, arrondis puis creuse le dos en respirant.'},
  {id:'back',covers:['lombaires'],name:'Enroul&#xE9;-d&#xE9;roul&#xE9; debout',vid:'imgs/vids/mobi_enroul.mp4',img:'st_back',dur:'8 lents',secs:null,cue:'Enroule puis d&#xE9;roule la colonne vert&#xE8;bre par vert&#xE8;bre, genoux souples.'}
];
// LE plan pour une combinaison d'exos : poids par muscle = nb d'exos qui le sollicitent,
// puis set-cover glouton (chaque geste choisi couvre le plus de muscle « en attente » possible).
// Cap 6 gestes + le héro fléchisseurs (toujours là — posture) : jamais long, jamais chiant.
function dzGenPlan(keys){
  var weight={};
  (keys||[]).forEach(function(k){
    (DZ_MUSCLE_OF[k]||[]).forEach(function(m){ weight[m]=(weight[m]||0)+1; });
  });
  delete weight.hanches; // couvert par le héro fléchisseurs
  var uncovered={}; Object.keys(weight).forEach(function(m){ uncovered[m]=true; });
  var plan=[];
  while(Object.keys(uncovered).length&&plan.length<6){
    var best=null,bestScore=0;
    DZ_LIB.forEach(function(st){
      if(plan.indexOf(st)>=0) return;
      var sc=0; st.covers.forEach(function(m){ if(uncovered[m]) sc+=(weight[m]||0); });
      if(sc>bestScore){ bestScore=sc; best=st; }
    });
    if(!best) break;
    plan.push(best);
    best.covers.forEach(function(m){ delete uncovered[m]; });
  }
  return plan;
}
function dzPlanMinutes(plan){
  var s=240; // héro fléchisseurs 2 min/jambe
  plan.forEach(function(it){ s+=(it.secs||25)*(it.side?2:1)+10; });
  return Math.max(5,Math.round(s/60));
}
// Exos d'un log (pour « étirer ma dernière séance »)
function dzLogKeys(l){
  var keys=[];
  function push(k){ if(keys.indexOf(k)<0) keys.push(k); }
  if(l.live&&l.live.exos){ l.live.exos.forEach(function(x){ if((x.sets||[]).length) push(x.key); }); }
  else (l.sessions||[]).forEach(function(sid){
    if(sid.indexOf('exo:')===0){ push(sid.slice(4)); return; }
    var s=DATA.find(function(x){return x.id===sid;});
    if(s&&s.t!=='bonus') s.exos.forEach(function(e){ if(!e.hidden&&!e.bonus) push(e.key); });
  });
  return keys;
}
function dzRecentLogs(){
  return (DB.logs||[]).filter(function(l){ return dzLogKeys(l).length>0; }).slice(0,2);
}
function dzOpen(){
  DZ={view:'home',sel:{},planKeys:null,planFrom:null};
  dzRender();
  var ov=document.getElementById('dzOverlay');
  if(ov){ ov.classList.add('open'); document.body.style.overflow='hidden'; }
}
function dzClose(){
  if(_dzTimer){ clearInterval(_dzTimer); _dzTimer=null; }
  DZ=null;
  var ov=document.getElementById('dzOverlay');
  if(ov) ov.classList.remove('open');
  document.body.style.overflow='';
}
function dzGoto(v){ DZ.view=v; dzRender(); }
function dzToggleSel(k,btn){
  DZ.sel[k]=!DZ.sel[k];
  if(btn) btn.classList.toggle('on',DZ.sel[k]);
  var cta=document.getElementById('dzPickCta');
  var ct=Object.keys(DZ.sel).filter(function(x){return DZ.sel[x];}).length;
  if(cta){ if(ct) cta.removeAttribute('disabled'); else cta.setAttribute('disabled','');
    var sub=cta.querySelector('.as-cta-sub'); if(sub) sub.textContent=ct+' exercice'+(ct>1?'s':''); }
}
function dzFromLog(id){
  var l=(DB.logs||[]).find(function(x){return String(x.id)===String(id);});
  if(!l) return;
  DZ.planKeys=dzLogKeys(l);
  DZ.planFrom=formatDateShort(l.date);
  dzGoto('plan');
}
function dzFromPick(){
  var keys=Object.keys(DZ.sel).filter(function(k){return DZ.sel[k];});
  if(!keys.length) return;
  DZ.planKeys=keys; DZ.planFrom=null;
  dzGoto('plan');
}
// Valider les étirements : coche du jour → bulle 🧘 au calendrier + pts comptés AU BILAN HEBDO
// (+15/jour, cap 4/sem — plus de bonus par séance depuis le 04/08 soir)
function dzDone(){
  var t=todayStr();
  if(!DB.dz) DB.dz={};
  if(!DB.dz[t]) DB.dz[t]={};
  DB.dz[t].stretch=true;
  if(DZ&&DZ.planKeys) DB.dz[t].stCt=(DZ.planKeys||[]).length;
  saveDB();
  try{ renderCal(); }catch(e){}
  showToast('&#x1F9D8; &#xC9;tirements valid&#xE9;s &#x2014; +15 pts au bilan de la semaine');
  DZ.view='home'; DZ.planKeys=null; DZ.run=null; dzRender();
}
// ── DÉTENTE v3 (26/08 soir, demande Adrien) : ① « Étirer ma séance du jour » EN PREMIER, ② deux
// routines quotidiennes dissociées — ☀️ MATIN 5 min (respiration ventrale + reverse kegels, allongé,
// jamais de statique profond à froid) et 🌙 SOIR ~15 min (hanches → posture → plancher pelvien).
// Avis coach gravé dans COACH.md 26/08 : les gestes posture (fléchisseurs = n°1, chin tucks, scap,
// pecs, dead bug) restent LES bons pour son diagnostic ; on y greffe le bloc plancher pelvien
// (Kegels = preuves cliniques érection/contrôle · reverse kegels = relâchement, indispensable chez un
// lifteur qui bloque sa respiration · squat profond + papillon = hanches ouvertes, périnée relâché).
// PRIVÉ : Melati ne voit qu'« étirements » (drapeau st) — jamais le contenu (DB.dz[jour].am / .pm).
var DZ_STEP_LIB={
  respi:{id:'respi',ico:'&#x1F32C;',name:'Respiration ventrale',dose:'3 min &#xB7; allong&#xE9;',src:'imgs/melati_lyingknees.jpg',secs:180,
    cue:'Main sur le ventre. Inspire 4 s par le nez (le ventre monte), expire 6-8 s par la bouche (il redescend seul).',
    why:'Apprend au p&#xE9;rin&#xE9;e &#xE0; se rel&#xE2;cher &#xE0; chaque expiration.',
    tips:['La poitrine ne bouge pas.'],
    errs:['Forcer l\'expiration.']},
  rkegel:{id:'rkegel',ico:'&#x1F30A;',name:'Reverse kegels',dose:'10 &#xD7; 5 s &#xB7; sur l\'expiration',src:'imgs/melati_lyingknees.jpg',secs:100,
    cue:'Sur l\'expiration, laisse le p&#xE9;rin&#xE9;e s\'ouvrir et descendre (d&#xE9;but d\'un pipi qu\'on laisse venir), sans pousser. 5 s.',
    why:'Le rel&#xE2;chement complet &#x2014; un plancher trop tendu est moins fort et moins sensible.',
    tips:['Juste apr&#xE8;s le squat profond, la sensation est &#xE9;vidente.'],
    errs:['Pousser comme aux toilettes.']},
  kegel:{id:'kegel',ico:'&#x1F4AA;',name:'Kegels',dose:'10 &#xD7; 5 s (10 s de repos) + 10 flashs',src:'imgs/melati_lyingknees.jpg',secs:120,
    cue:'Contracte le p&#xE9;rin&#xE9;e comme pour retenir pipi + gaz, rien d\'autre ne bouge. 5 s, puis rel&#xE2;che 10 s.',
    why:'Le muscle du contr&#xF4;le (&#xE9;rection, &#xE9;jaculation) &#x2014; le plus prouv&#xE9; cliniquement.',
    tips:['Jamais en urinant.','Effet visible en 4-6 semaines.'],
    errs:['Serrer fesses ou abdos &#xE0; la place.','Bloquer la respiration.']},
  squat:{id:'squat',ico:'&#x1F9CE;',name:'Squat profond, talons au sol',dose:'2 min',vid:'imgs/vids/mobi_squatp.mp4',src:'imgs/melati_deepsquat.jpg',secs:120,
    cue:'Pieds un peu plus larges que les &#xE9;paules, descends tout en bas, talons au sol, coudes qui poussent les genoux dehors.',
    why:'Rel&#xE2;che directement le plancher pelvien, ouvre hanches et chevilles.',
    tips:['Talons qui d&#xE9;collent&#x202F;: &#xE9;carte un peu plus ou tiens un meuble.'],
    errs:['Rester &#xE0; mi-hauteur.']},
  papillon:{id:'papillon',ico:'&#x1F98B;',name:'Papillon (adducteurs)',dose:'1 min',vid:'imgs/vids/dz_adductor.mp4',pic:'imgs/dz_adductor.jpg',secs:60,
    cue:'Plantes de pieds jointes, dos long, coudes sur les cuisses.',
    why:'Adducteurs souples = bassin libre.',
    tips:['C\'est le dos droit qui &#xE9;tire, pas la t&#xEA;te qui plonge.'],
    errs:['Appuyer sur les genoux.']}
};
// Les gestes posture historiques (DZ_DAILY : hip, chin, langue, pecs, scap, deadbug) entrent tels quels
DZ_DAILY.forEach(function(d){ DZ_STEP_LIB[d.id]=d; });
// Fléchisseurs de hanche : 2 min PAR jambe (side) — la fiche DZ_DAILY dit 2 min / jambe, secs=120 par côté
DZ_STEP_LIB.hip.side=true;
DZ_STEP_LIB.pecs.side=true;
var DZ_ROUTINES={
  am:{id:'am',ico:'&#x2600;&#xFE0F;',name:'Routine du matin',sub:'au r&#xE9;veil, allong&#xE9; &#x2014; respiration + rel&#xE2;chement',steps:['respi','rkegel']},
  pm:{id:'pm',ico:'&#x1F319;',name:'Routine du soir',sub:'hanches &#x2192; posture &#x2192; plancher pelvien',steps:['hip','squat','papillon','chin','scap','pecs','deadbug','kegel','rkegel']}
};
function dzRoutineSteps(kind){ return (DZ_ROUTINES[kind]?DZ_ROUTINES[kind].steps:[]).map(function(id){ return DZ_STEP_LIB[id]; }).filter(Boolean); }
function dzRoutineMinutes(kind){
  var s=0;
  dzRoutineSteps(kind).forEach(function(st){ s+=st.secs?st.secs*(st.side?2:1)+8:45; });
  return Math.max(1,Math.round(s/60));
}
// Jour « étiré » = étirements de séance OU routine matin OU routine soir (calendrier 🧘, snapshot « Nous deux »)
function dzDayDone(dateStr){ var d=DB.dz&&DB.dz[dateStr]; return !!(d&&(d.stretch||d.am||d.pm)); }
function dzOpenRoutine(kind){ DZ.routine=kind; DZ.view='routine'; dzRender(); }
function dzOpenStep(id,back){ DZ.stepId=id; DZ.stepBack=back||'home'; DZ.view='step'; dzRender(); }
function dzStartRoutine(kind){
  DZ.run={steps:dzRoutineSteps(kind),idx:0,kind:kind};
  DZ.view='run'; dzRender();
}
function dzRoutineDone(kind){
  var t=todayStr();
  if(!DB.dz) DB.dz={};
  if(!DB.dz[t]) DB.dz[t]={};
  DB.dz[t][kind]=true;
  saveDB();
  try{ renderCal(); }catch(e){}
  showToast(kind==='am'?'&#x2600;&#xFE0F; Routine du matin valid&#xE9;e &#x2014; bonne journ&#xE9;e':'&#x1F319; Routine du soir valid&#xE9;e &#x2014; bonne nuit');
  if(DZ){ DZ.view='home'; DZ.run=null; dzRender(); }
}
// ── Runner « comme un LiveUp » : les gestes du plan un par un, chrono intégré ──
function dzStartRun(){
  var plan=dzGenPlan(DZ.planKeys||[]);
  DZ.run={steps:[{hero:true,name:'Fl&#xE9;chisseurs de hanche',vid:'imgs/vids/dz_hip.mp4',pic:'imgs/dz_hip.jpg',dur:'2 min / jambe',secs:120,side:true,
    cue:'Fente &#xE0; genou, fesse arri&#xE8;re serr&#xE9;e, bassin qui avance. Dos neutre.'}].concat(plan),idx:0,kind:null};
  DZ.view='run'; dzRender();
}
function dzRunNav(d){
  if(_dzTimer){ clearInterval(_dzTimer); _dzTimer=null; }
  var n=DZ.run.idx+d;
  if(n<0){ var k=DZ.run.kind; DZ.run=null; if(k){ DZ.routine=k; DZ.view='routine'; } else DZ.view='plan'; dzRender(); return; }
  if(n>=DZ.run.steps.length){ if(DZ.run.kind) dzRoutineDone(DZ.run.kind); else dzDone(); return; }
  DZ.run.idx=n; dzRender();
}
// Chrono générique par geste (un seul à la fois)
var _dzTimer=null;
function dzTimer(btnId,sec){
  if(_dzTimer){ clearInterval(_dzTimer); _dzTimer=null;
    var b0=document.getElementById(btnId); if(b0) b0.innerHTML='&#x25B6; '+formatTime(sec);
    return;
  }
  var end=Date.now()+sec*1000;
  var b=document.getElementById(btnId);
  if(b) b.innerHTML='<span class="dz-t" id="'+btnId+'-t">'+formatTime(sec)+'</span><small>respire...</small>';
  _dzTimer=setInterval(function(){
    var rem=Math.max(0,Math.ceil((end-Date.now())/1000));
    var t=document.getElementById(btnId+'-t'); if(t) t.textContent=formatTime(rem);
    if(rem<=0){
      clearInterval(_dzTimer); _dzTimer=null;
      asSound('go');
      if(navigator.vibrate) navigator.vibrate([180,90,180]);
      var b2=document.getElementById(btnId); if(b2) b2.innerHTML='&#x1F504; Autre c&#xF4;t&#xE9; / relancer';
    }
  },250);
}
function dzStepImg(st){ return st.pic||st.src||(st.img?IMGS[st.img]:null); }
// Média d'un geste : VIDÉO (MuscleWiki, démonstrateur homme — 26/08) en priorité, sinon image.
// Vidéo = autoplay muet en boucle, une seule à l'écran (fiche ou runner) — batterie OK.
function dzMedia(st){
  var img=dzStepImg(st);
  if(st.vid) return '<video class="dz-det-vid" src="'+st.vid+'"'+(img?' poster="'+img+'"':'')+' autoplay muted loop playsinline preload="metadata"></video>';
  if(img) return '<img class="dz-det-img" src="'+img+'" alt="'+st.name+'" loading="lazy"/>';
  return '';
}
function dzRender(){
  var body=document.getElementById('dzBody'); if(!body||!DZ) return;
  var h='<div class="as-hdr">'
    +'<button class="as-exit" onclick="dzClose()" title="Fermer">'+AS_EXIT_SVG+'</button>'
    +'<div class="as-hdr-mid"><div class="as-hdr-title">&#x1F9D8; D&#xE9;tente</div>'
    +'<div class="as-hdr-sub">&#xE9;tirements &#xB7; posture &#xB7; r&#xE9;cup</div></div>'
    +'<div class="as-hdr-right"></div></div>';
  if(DZ.view==='home'){
    var day=(DB.dz&&DB.dz[todayStr()])||{};
    h+='<div class="as-scroll">';
    // ① EN PREMIER : étirer ma séance (du jour si elle existe, sinon les 2 dernières)
    h+='<div class="as-lbl">&#x1F9D8; &#xC9;tirements de s&#xE9;ance <span class="as-lbl-hint">le plan optimis&#xE9; pour ce que tu as travaill&#xE9;</span></div>';
    var recents=dzRecentLogs();
    recents.forEach(function(l){
      var keys=dzLogKeys(l);
      var isToday=l.date===todayStr();
      h+='<button class="dz-logbtn'+(isToday?' today':'')+'" onclick="dzFromLog(\''+l.id+'\')">'
        +'<span class="dz-logico">&#x26A1;</span>'
        +'<span class="dz-logtxt"><span class="dz-logname">&#xC9;tirer ma s&#xE9;ance '+(isToday?'du jour':'du '+formatDateShort(l.date))+'</span>'
        +'<span class="dz-logsub">'+keys.length+' exercices &#x2192; plan optimis&#xE9;'+(isToday&&day.stretch?' &#xB7; &#x2705; fait':'')+'</span></span>'
        +'<span class="as-bigcard-go">&#x203A;</span></button>';
    });
    h+='<button class="as-carte-link" onclick="dzGoto(\'pick\')">&#x270B; Ou je choisis mes exercices moi-m&#xEA;me &#x203A;</button>';
    // ② Au quotidien : deux routines dissociées
    h+='<div class="as-lbl" style="margin-top:1.1rem;">&#x1F4C5; Au quotidien <span class="as-lbl-hint">tape pour voir le d&#xE9;tail et lancer</span></div>';
    ['am','pm'].forEach(function(k){
      var r=DZ_ROUTINES[k], on=!!day[k];
      h+='<button class="dz-logbtn'+(on?' today':'')+'" onclick="dzOpenRoutine(\''+k+'\')">'
        +'<span class="dz-logico">'+r.ico+'</span>'
        +'<span class="dz-logtxt"><span class="dz-logname">'+r.name+' <em style="font-style:normal;color:var(--yellow);font-size:.85em;">'+dzRoutineMinutes(k)+' min</em></span>'
        +'<span class="dz-logsub">'+r.sub+'</span></span>'
        +'<span class="dz-dcheck'+(on?'':'')+'" style="'+(on?'border-color:var(--acc);background:rgba(113,255,180,.12);':'')+'">'+(on?'&#x2713;':'')+'</span></button>';
    });
    // ③ L'habitude de toute la journée
    var lg=DZ_STEP_LIB.langue;
    if(lg) h+='<button class="as-carte-link" style="margin-top:.4rem;" onclick="dzOpenStep(\'langue\',\'home\')">'+lg.ico+' Langue au palais &#x2014; toute la journ&#xE9;e &#x203A;</button>';
    h+='</div>';
    h+='<div class="as-foot"><button class="as-ghost-btn" onclick="dzClose()">Fermer</button></div>';
  } else if(DZ.view==='routine'){
    // ── Présentation d'une routine : ses gestes (tap = fiche), puis « C'est parti » ──
    var r=DZ_ROUTINES[DZ.routine]; if(!r){ DZ.view='home'; dzRender(); return; }
    var steps=dzRoutineSteps(DZ.routine), onR=!!(DB.dz&&DB.dz[todayStr()]&&DB.dz[todayStr()][DZ.routine]);
    h+='<div class="as-scroll">';
    h+='<div class="as-rep-slide-title">'+r.ico+' '+r.name+' <small>&#x2248; '+dzRoutineMinutes(DZ.routine)+' min</small></div>';
    h+='<div class="dz-plan-meta">'+r.sub+(DZ.routine==='am'?' &#x2014; jamais de statique profond &#xE0; froid&#x202F;: on respire et on rel&#xE2;che, c\'est tout.':' &#x2014; les hanches d\'abord (le corps chauffe), la posture, puis le plancher pelvien pour finir rel&#xE2;ch&#xE9;.')+'</div>';
    h+='<div class="dz-daily">';
    steps.forEach(function(st){
      h+='<button class="dz-dcard" onclick="dzOpenStep(\''+st.id+'\',\'routine\')">'
        +'<span class="dz-dico">'+(st.ico||'&#x1F9D8;')+'</span>'
        +'<span class="dz-dbody"><span class="dz-dname">'+st.name+' <em>'+(st.dose||st.dur||'')+'</em></span>'
        +'<span class="dz-dwhy">'+(st.why||st.cue||'')+'</span></span>'
        +'<span class="as-bigcard-go">&#x203A;</span></button>';
    });
    h+='</div>';
    if(onR) h+='<div class="dz-done-note">&#x2705; D&#xE9;j&#xE0; faite aujourd\'hui &#x2014; la refaire ne fait pas de mal.</div>';
    h+='</div>';
    h+='<div class="as-foot">'
      +'<button class="as-ghost-btn" onclick="dzGoto(\'home\')">&#x2039;</button>'
      +'<button class="as-ghost-btn" onclick="dzRoutineDone(\''+DZ.routine+'\')">D&#xE9;j&#xE0; faite &#x2713;</button>'
      +'<button class="as-cta" onclick="dzStartRoutine(\''+DZ.routine+'\')">C\'est parti &#x203A;<span class="as-cta-sub">guid&#xE9;, geste par geste</span></button>'
      +'</div>';
  } else if(DZ.view==='pick'){
    h+='<div class="as-scroll">';
    h+='<div class="as-lbl">Qu\'as-tu travaill&#xE9;&#x202F;? <span class="as-lbl-hint">m&#xEA;me un mix de plusieurs s&#xE9;ances</span></div>';
    DATA.forEach(function(s){
      var vis=s.exos.filter(function(e){return !e.hidden&&DZ_MUSCLE_OF[e.key];});
      if(!vis.length) return;
      h+='<div class="as-lbl">'+s.icon+' '+s.name+'</div><div class="as-exo-picks">';
      vis.forEach(function(e){
        h+='<button class="as-pick'+(DZ.sel[e.key]?' on':'')+'" onclick="dzToggleSel(\''+e.key+'\',this)">'+e.name+'<span class="as-pick-tick">&#x2713;</span></button>';
      });
      h+='</div>';
    });
    h+='</div>';
    var ct=Object.keys(DZ.sel).filter(function(k){return DZ.sel[k];}).length;
    h+='<div class="as-foot">'
      +'<button class="as-ghost-btn" onclick="dzGoto(\'home\')">&#x2039;</button>'
      +'<button class="as-cta" id="dzPickCta" '+(ct?'':'disabled')+' onclick="dzFromPick()">G&#xE9;n&#xE9;rer mon plan &#x203A;<span class="as-cta-sub">'+ct+' exercice'+(ct>1?'s':'')+'</span></button>'
      +'</div>';
  } else if(DZ.view==='step'||DZ.view==='daily'){
    // ── Fiche d'un geste : image, pourquoi, conseils, erreurs, chrono ──
    var dd=DZ_STEP_LIB[DZ.stepId||DZ.dailyId];
    if(!dd){ DZ.view='home'; dzRender(); return; }
    var dmedia=dzMedia(dd);
    var back=DZ.stepBack==='routine'&&DZ.routine?'dzOpenRoutine(\''+DZ.routine+'\')':'dzGoto(\'home\')';
    h+='<div class="as-scroll">';
    h+='<div class="dz-detail">'
      +(dmedia||'<div class="dz-det-ico">'+(dd.ico||'&#x1F9D8;')+'</div>')
      +'<div class="dz-det-name">'+dd.name+'</div>'
      +'<div class="dz-det-dose">'+(dd.dose||'')+'</div>'
      +(dd.why?'<div class="dz-det-why">'+dd.why+'</div>':'')
      +'<div class="dz-det-cue">'+dd.cue+'</div>'
      +(dd.secs?'<button class="as-st-btn" id="dz-det-btn" onclick="dzTimer(\'dz-det-btn\','+dd.secs+')">&#x25B6; Lancer '+formatTime(dd.secs)+(dd.side?' <small>/ c&#xF4;t&#xE9;</small>':'')+'</button>':'')
      +'</div>';
    if(dd.tips&&dd.tips.length){
      h+='<div class="as-lbl">&#x1F4A1; Conseils</div><div class="dz-det-list">';
      dd.tips.forEach(function(t){ h+='<div class="dz-det-li ok">'+t+'</div>'; });
      h+='</div>';
    }
    if(dd.errs&&dd.errs.length){
      h+='<div class="as-lbl">&#x26D4; &#xC0; ne pas faire</div><div class="dz-det-list">';
      dd.errs.forEach(function(t){ h+='<div class="dz-det-li bad">'+t+'</div>'; });
      h+='</div>';
    }
    h+='</div>';
    h+='<div class="as-foot"><button class="as-ghost-btn" onclick="'+back+'">&#x2039; Retour</button></div>';
  } else if(DZ.view==='run'&&DZ.run){
    // ── Runner façon LiveUp : un geste par écran, chrono, Suivant ──
    var st=DZ.run.steps[DZ.run.idx];
    var tot=DZ.run.steps.length;
    var rk=DZ.run.kind?DZ_ROUTINES[DZ.run.kind]:null;
    h+='<div class="as-scroll as-center">';
    h+='<div class="dz-run-prog">'+(rk?rk.ico+' '+rk.name+' &#xB7; ':'&#xC9;tirement ')+(DZ.run.idx+1)+' / '+tot+'</div>';
    h+='<div class="dz-detail">'
      +dzMedia(st)
      +'<div class="dz-det-name">'+st.name+(st.hero?' <span class="as-sth-tag">non-n&#xE9;gociable</span>':'')+'</div>'
      +'<div class="dz-det-dose">&#x23F1; '+(st.dur||st.dose||'')+'</div>'
      +'<div class="dz-det-cue">'+st.cue+'</div>'
      +(st.secs?'<button class="as-st-btn" id="dz-run-btn" onclick="dzTimer(\'dz-run-btn\','+st.secs+')">&#x25B6; Lancer '+formatTime(st.secs)+(st.side?' <small>/ c&#xF4;t&#xE9;</small>':'')+'</button>':'')
      +'</div>';
    h+='</div>';
    h+='<div class="as-foot">'
      +'<button class="as-ghost-btn" onclick="dzRunNav(-1)">&#x2039;</button>'
      +'<button class="as-cta" onclick="dzRunNav(1)">'+(DZ.run.idx>=tot-1?'Terminer &#x2713;':'Fait, suivant &#x203A;')+'</button>'
      +'</div>';
  } else {
    var plan=dzGenPlan(DZ.planKeys||[]);
    h+='<div class="as-scroll">';
    h+='<div class="as-rep-slide-title">&#x1F9D8; Ton plan d\'&#xE9;tirements'+(DZ.planFrom?' <small>s&#xE9;ance du '+DZ.planFrom+'</small>':'')+'</div>';
    h+='<div class="dz-plan-meta">&#x23F1; &#x2248; '+dzPlanMinutes(plan)+' min &#x2014; fl&#xE9;chisseurs de hanche + '+plan.length+' gestes qui couvrent tout ce que tu as travaill&#xE9;.</div>';
    h+='<div class="as-stretch-hero">'
      +'<img src="imgs/dz_hip.jpg" alt="Fl&#xE9;chisseurs de hanche" loading="lazy"/>'
      +'<div class="as-sth-body"><div class="as-sth-name">Fl&#xE9;chisseurs de hanche <span class="as-sth-tag">non-n&#xE9;gociable</span></div>'
      +'<div class="as-sth-dur">2 min PAR jambe</div></div></div>';
    h+='<div class="as-stretch-list">';
    plan.forEach(function(it){
      var img=dzStepImg(it);
      h+='<div class="as-stretch-item">'
        +(img?'<img src="'+img+'" alt="'+it.name+'" loading="lazy"/>':'')
        +'<div class="as-sti-body"><div class="as-sti-name">'+it.name+'</div>'
        +'<div class="as-sti-dur">&#x23F1; '+it.dur+'</div>'
        +'<div class="as-sti-cue">'+it.cue+'</div></div></div>';
    });
    h+='</div>';
    h+='</div>';
    h+='<div class="as-foot">'
      +'<button class="as-ghost-btn" onclick="dzGoto(\'home\')">&#x2039;</button>'
      +'<button class="as-ghost-btn" onclick="dzDone()">D&#xE9;j&#xE0; faits &#x2713;</button>'
      +'<button class="as-cta" onclick="dzStartRun()">C\'est parti &#x203A;<span class="as-cta-sub">guid&#xE9;, geste par geste</span></button>'
      +'</div>';
  }
  body.innerHTML=h;
}

// ── CLASSEMENTS PAR EXO (03/08, refondu 04/08 — demande Adrien) ──
// Où se classe la session d'aujourd'hui parmi TOUTES les exécutions de l'exo, toutes charges
// confondues ? Critère n°1 = force estimée moyenne par série (e1RM d'Epley : poids×(1+reps/30),
// série manquante = 0) — un « presque 4×8 » à 52 kg bat un 4×8 parfait à 48 kg, parce que la
// surcharge portée est plus haute. Égalité → ① total de reps ② séquence série par série
// ③ ressenti (mêmes reps plus faciles = mieux). Exos inversés (assistances) : moins d'assistance
// d'abord, puis les mêmes critères. Exos sans kg (reps/s) : total de reps/secondes.
function recFeelSum(sets,n){
  var W={facile:0,ok:1,dur:2,echec:3};
  var t=0; sets.slice(0,n).forEach(function(s){ t+=(W[s.feel]!==undefined?W[s.feel]:1); });
  return t;
}
function recE1RM(sess,n){
  var t=0;
  for(var i=0;i<n;i++){
    var s=sess.sets[i];
    if(!s) continue;
    var w=(s.w!=null?s.w:sess.w)||0;
    t+=w*(1+(s.reps||0)/30);
  }
  return t/n;
}
function recAvgW(sess,n){
  var t=0,c=0;
  sess.sets.slice(0,n).forEach(function(s){ t+=((s.w!=null?s.w:sess.w)||0); c++; });
  return c?t/c:0;
}
function recCompare(a,b,n,opts){ // <0 = a meilleur que b
  opts=opts||{};
  if(opts.inv){
    var wa=recAvgW(a,n), wb=recAvgW(b,n);
    if(Math.abs(wa-wb)>0.01) return wa-wb; // moins d'assistance = mieux
  } else if(opts.isKg){
    var ea=recE1RM(a,n), eb=recE1RM(b,n);
    if(Math.abs(ea-eb)>0.05) return eb-ea; // plus de force estimée = mieux
  }
  var ra=a.sets.slice(0,n).map(function(s){return s.reps;});
  var rb=b.sets.slice(0,n).map(function(s){return s.reps;});
  var ta=ra.reduce(function(x,y){return x+y;},0), tb=rb.reduce(function(x,y){return x+y;},0);
  if(ta!==tb) return tb-ta;
  for(var i=0;i<Math.max(ra.length,rb.length);i++){
    var va=ra[i]||0, vb=rb[i]||0;
    if(va!==vb) return vb-va;
  }
  return recFeelSum(a.sets,n)-recFeelSum(b.sets,n);
}
// Toutes les exécutions COMPTÉES d'un exo, toutes charges (log du jour inclus s'il est persisté)
function recSessions(key,n){
  var out=[];
  (DB.logs||[]).forEach(function(l){
    if(!l.live||!l.live.exos) return;
    l.live.exos.forEach(function(x){
      if(x.key!==key) return;
      if(!liveExoCounted(x)) return;
      out.push({date:l.date,id:l.id,w:(x.w!=null?x.w:null),sets:(x.sets||[]).slice(0,n)});
    });
  });
  return out;
}
function recSetsFmt(sess,unite,cnt){
  return fmtSetsW({w:sess.w,unite:unite,cnt:cnt||null},sess.sets);
}
// Étendue des charges d'une session pour l'en-tête (« 48→52 kg » si test en cours d'exo)
function recWRange(sess,unite){
  var ws=sess.sets.map(function(s){return (s.w!=null?s.w:sess.w);}).filter(function(w){return w!=null;});
  if(!ws.length) return (sess.w!=null?sess.w+' '+unite:'');
  var mn=Math.min.apply(null,ws), mx=Math.max.apply(null,ws);
  return (mn===mx?mn:mn+'&#x2192;'+mx)+' '+unite;
}
// La slide Classements du bilan de séance
function asRenderRecordsSlide(){
  var h='<div class="as-rep-slide-title">&#x1F3C6; Classements &#x2014; toutes charges</div>';
  var any=false;
  asReportDisplayExos().forEach(function(x){
    if(!liveExoCounted(x)||exoIsCardio(x.key)||!x.sets.length) return;
    var n=x.n||3;
    var opts={inv:asIsInverse(x.key),isKg:/kg/.test(x.unite||'')&&!x.repT};
    var sess=recSessions(x.key,n);
    var today=sess.find(function(s2){return String(s2.id)===String(AS.savedLogId);});
    if(!today) return;
    any=true;
    sess.sort(function(a,b){ var c=recCompare(a,b,n,opts); return c!==0?c:a.date.localeCompare(b.date); });
    var rank=sess.indexOf(today)+1;
    var best=sess[0];
    var isBest=rank===1;
    // Podium (31/08, demande Adrien) : le top 2/3 all-time se voit aussi — argent/bronze,
    // seulement s'il y a au moins une session battue derrière (2e/2 = dernier, pas un podium).
    var podium=!isBest&&rank<=3&&sess.length>rank;
    var badge=sess.length===1
      ?'<span class="rec2-badge first">1re fois</span>'
      :(isBest?'<span class="rec2-badge gold">&#x1F947; record</span>'
        :podium&&rank===2?'<span class="rec2-badge silver">&#x1F948; 2<small>e</small> / '+sess.length+'</span>'
        :podium?'<span class="rec2-badge bronze">&#x1F949; 3<small>e</small> / '+sess.length+'</span>'
        :'<span class="rec2-badge">'+rank+'<small>e</small> / '+sess.length+'</span>');
    h+='<div class="rec2-card'+(isBest&&sess.length>1?' best':(podium?' podium':''))+'">'
      +'<div class="rec2-top"><span class="rec2-name">'+x.name+'</span>'
      +'<span class="rec2-w">'+recWRange(today,x.unite)+'</span>'+badge+'</div>'
      +'<div class="rec2-line"><span class="rec2-l-lbl">aujourd\'hui</span><span class="rec2-sets">'+recSetsFmt(today,x.unite,x.cnt)+'</span></div>'
      +(sess.length===1
        ?'<div class="rec2-note">La r&#xE9;f&#xE9;rence est pos&#xE9;e &#x2014; c\'est elle qu\'il faudra battre.</div>'
        :(isBest
          ?'<div class="rec2-note gold">Ta meilleure version de cet exo &#x2014; le sommet du classement est &#xE0; toi.</div>'
          :'<div class="rec2-line"><span class="rec2-l-lbl">record</span><span class="rec2-sets dim">'+recSetsFmt(best,x.unite,x.cnt)+' <em>'+formatDateShort(best.date)+'</em></span></div>'))
      +'</div>';
  });
  if(!any) h+='<div class="as-rep-note">Pas encore de classement &#x2014; les exos du jour n\'ont pas encore d\'historique comparable.</div>';
  else h+='<div class="as-rep-footer-note">Classement toutes charges confondues, par force estim&#xE9;e par s&#xE9;rie (poids &#xD7; reps) &#x2014; un &#xAB;&#x202F;presque parfait&#x202F;&#xBB; plus lourd bat un parfait plus l&#xE9;ger.</div>';
  return h;
}

// ── Bilan en slides : 0 note · 1 analyse · 2 notes par exo · 3 classements · 4 suggestions ──
// (les étirements guidés vivent désormais AVANT les questions de fin — étape stretchend)
// La slide « notes » affiche TOUS les exos travaillés, bonus compris (règle Adrien 02/08).
function asReportDisplayExos(){
  return AS.exos.filter(function(x){ return !liveExoSide(x)||(x.sets||[]).length>0; });
}
function asRepGoto(i){ _asDir=i<AS.repIdx?'back':'fwd'; AS.repIdx=Math.max(0,Math.min(FEATURE_FULL_BILAN?4:1,i)); asSave(); asRender(); }
function asRepNav(d){ asRepGoto(AS.repIdx+d); }
function asRenderReport(){
  var _eng=liveNotedExos(AS.exos);
  var _disp=asReportDisplayExos();
  var _side=liveSideAttempts(AS.exos);
  if(!AS.reportExos||AS.reportExos.length!==_disp.length){ _asMsgUsed={}; AS.reportExos=_disp.map(function(x){return asAnalyzeExo(x);}); asSave(); }
  if(!AS.reportNotes){ AS.reportNotes=asAnalyzeSession(); asSave(); }
  var g=asGlobalScore();
  var gi=asGradeInfo(g);
  var doneCt=_eng.filter(function(x){return x.status==='done'||liveExoCounted(x);}).length;
  var skipCt=_eng.filter(function(x){return x.status==='skipped'&&!liveExoCounted(x);}).length;
  var allSets=AS.exos.reduce(function(a,x){return a+x.sets.length;},0);
  var h=asHeader('Bilan du LiveUp',AS.sname+' &#xB7; '+asElapsedMin()+' min',false);
  var i=AS.repIdx;
  // Bilan épuré (15/08, demande Adrien) : juste la note /20 + les suggestions de charge.
  // Les slides analyse / note par exo / records restent dans le code (FEATURE_FULL_BILAN).
  var nSlides=FEATURE_FULL_BILAN?5:2;
  var view=FEATURE_FULL_BILAN?i:(i===0?0:4);
  h+='<div class="as-scroll'+(i===0?' as-center':'')+'">';
  if(view===0){
    h+='<div class="as-grade-wrap g-'+gi.cls+'">'
      +'<div class="as-grade-emoji anim-'+gi.anim+'">'+gi.emoji+'</div>'
      +'<div class="as-grade-note"><span class="as-grade-num" data-cu="'+g+'">0</span><span class="as-grade-sur">/20</span></div>'
      +'<div class="as-grade-title t-'+gi.cls+'">'+gi.title+'</div>'
      +'<div class="as-grade-sum">'+asGradeSummary(g,doneCt,skipCt,_eng.length)+'</div>'
      +(function(){ try{ var r=asRepriseCtx(); return r?'<div style="margin:.55rem 0 .1rem;"><span class="rep-badge">&#x2744; reprise apr&#xE8;s '+r.days+' j d\'arr&#xEA;t &#x2014; souvent un peu plus l&#xE9;g&#xE8;re, note lue avec indulgence</span></div>':''; }catch(e){ return ''; } })()
      +'<div class="as-rep-stats">'
      +'<div class="as-rep-stat"><span>'+doneCt+'/'+_eng.length+'</span>exos</div>'
      +'<div class="as-rep-stat"><span>'+allSets+'</span>s&#xE9;ries</div>'
      +'<div class="as-rep-stat"><span>'+asElapsedMin()+'</span>min</div>'
      +'<div class="as-rep-stat"><span>'+(skipCt||0)+'</span>pass&#xE9;s</div>'
      +'</div>'
      +(_side.length?'<div style="font-size:.68rem;color:var(--mut);margin-top:.7rem;">&#x2B50; '+_side.length+' bonus tent&#xE9;'+(_side.length>1?'s':'')+' ('+_side.map(function(x){return x.name||getExoName(x.key);}).join(', ')+') &#x2014; hors note, z&#xE9;ro malus</div>':'')
      +(function(){
        // RANK : RP gagnés sur cette séance (log déjà persisté par asSaveAndReport)
        if(!FEATURE_RANK) return ''; // rank mis de côté (15/08)
        try{
          var log=(DB.logs||[]).find(function(l){return String(l.id)===String(AS.savedLogId);});
          if(!log) return '';
          var r=rankSeanceRP(log);
          var top=r.events.filter(function(ev){return ev.rp>0;}).sort(function(a,b){return b.rp-a.rp;}).slice(0,3);
          return '<div class="as-rank-gain">&#x1F3C5; <strong>+'+Math.max(1,Math.round(r.total/LADDER_ECO.seanceDiv))+' RP au rank</strong> <span class="as-rank-conv">'+r.total.toLocaleString('fr-FR')+' pts d\'activit&#xE9;</span>'
            +(top.length?'<span class="as-rank-ev">'+top.map(function(ev){return ev.ico+' '+ev.label+' +'+ev.rp;}).join(' &middot; ')+'</span>':'')+'</div>';
        }catch(e){ return ''; }
      })()
      +((FEATURE_RANK&&g<12)?'<div style="font-size:.64rem;color:var(--mut);margin-top:.55rem;line-height:1.5;">&#x1F4A1; Les <strong>RP</strong> viennent du travail fourni ET de sa qualit&#xE9; (les s&#xE9;ries mal ex&#xE9;cut&#xE9;es paient moiti&#xE9; moins, le CLEAN SWEEP saute sous 12/20) &#x2014; la <strong>note /20</strong>, elle, juge l\'ex&#xE9;cution pure.</div>':'')
      +'</div>';
  } else if(view===1){
    // ── Analyse v2 (04/09, retour Adrien : « trop de texte, je lis pas ») ──
    // 1) TUILES : rythme / exos / volume / semaine — les chiffres et leur verdict couleur,
    //    lisibles sans lire. Les notes texte qui redisaient ça (⏱ 📅 📊 ⚡) sont retirées.
    // 2) POINTS CLÉS : le reste de l'analyse en accroches d'UNE ligne, tap = phrase complète.
    var S=asRepStats();
    h+='<div class="as-rep-slide-title">&#x1F4DD; Analyse de la s&#xE9;ance</div>';
    h+='<div class="as-ana-grid">';
    var pv,pu,ps,pt;
    if(S.dur<30){ pv=S.dur; pu=' min'; ps='s&#xE9;ance expresse &#x26A1;'; pt='good'; }
    else if(!S.allSets){ pv=S.dur; pu=' min'; ps='&#x2014;'; pt='flat'; }
    else{
      pv=String(Math.round(S.setPace*10)/10).replace('.',','); pu=' min/s&#xE9;rie';
      if(S.setPace<=4.5){ ps='repos tenus, rythme sain'; pt='good'; }
      else if(S.setPace<=5.5){ ps='tranquille, dans les clous'; pt='mid'; }
      else{ ps='temps morts &#x2014; r&#xE9;organise via &#x2630;'; pt='warn'; }
    }
    h+=asAnaTile('&#x23F1; Rythme',pv,pu,ps,pt);
    var es=(S.perfect&&!S.skipCt&&S.doneCt>0)?'parfaite&#x202F;: toutes les reps &#x1F3C6;':(S.skipCt?S.skipCt+' pass&#xE9;'+(S.skipCt>1?'s':''):'programme complet');
    h+=asAnaTile('&#x1F4CB; Exos',S.doneCt+'/'+S.eng.length,'',es,S.skipCt>=2?'mid':(S.doneCt>0?'good':'flat'));
    if(S.tonnage>0){
      var vs,vt;
      if(S.prevDiff==null){ vs='1re r&#xE9;f&#xE9;rence enregistr&#xE9;e'; vt='flat'; }
      else if(S.prevDiff>=8){ vs='+'+S.prevDiff+'% vs derni&#xE8;re comparable'; vt='good'; }
      else if(S.prevDiff<=-10){ vs=S.prevDiff+'% vs derni&#xE8;re comparable'; vt='warn'; }
      else{ vs=(S.prevDiff>0?'+':'')+S.prevDiff+'% &#x2014; stable'; vt='flat'; }
      h+=asAnaTile('&#x1F3CB;&#xFE0F; Volume',Math.round(S.tonnage).toLocaleString('fr-FR'),' kg',vs,vt);
    } else h+=asAnaTile('&#x1F3CB;&#xFE0F; Volume',S.allSets,' s&#xE9;ries','poids du corps / assist&#xE9;','flat');
    h+=asAnaTile('&#x1F4C5; Semaine',fmtSeances(S.wk)+'/'+S.goal,'',S.wk>=S.goal?'objectif hebdo valid&#xE9; &#x1F389;':'s&#xE9;ance n&#xB0;'+fmtSeances(S.wk),S.wk>=S.goal?'good':'flat');
    h+='</div>';
    var rows=(AS.reportNotes||[]).filter(function(n){ return !/^\s*&#x(23F1|1F4C5|1F4CA|26A1);/i.test(n); });
    if(rows.length||AS.coachNote){
      h+='<div class="as-rep-slide-title" style="font-size:.85rem;padding:.1rem 0 .5rem;">&#x1F50E; Points cl&#xE9;s <span class="as-rep-slide-hint">tape une ligne pour le d&#xE9;tail</span></div>';
      h+='<div class="as-ana-rows">'
        +(AS.coachNote?'<div class="as-rep-note as-rep-coach">'+AS.coachNote+'</div>':'')
        +rows.map(asAnaRow).join('')+'</div>';
    }
  } else if(view===2){
    h+='<div class="as-rep-slide-title">&#x1F4CB; Note par exercice</div>';
    AS.reportExos.forEach(function(r,idx){
      var x=_disp[idx];
      if(!x) return;
      var side=liveExoSide(x);
      var counted=liveExoCounted(x);
      var sc=asScoreExo(x);
      var setsTxt=fmtSetsW(x);
      var _inf=findExoIndex(x.key);
      var isAbdo=!!(_inf&&_inf.exo&&_inf.exo.cat==='abdo');
      // Exos abdo : badge et carte en violet OTHERS, jamais en vert (06/08, demande Adrien)
      var badge=(side&&!counted)
        ?'<span class="as-rep-score '+(isAbdo?'s-abdo':'s-mid')+'" style="font-size:.62rem;">'+(isAbdo?'&#x1F525;':'&#x2B50;')+' tent&#xE9;</span>'
        :'<span class="as-rep-score s-'+(sc>=4?'good':sc>=2.5?'mid':'bad')+'">'+String(sc).replace('.',',')+'<small>/5</small></span>';
      h+='<div class="as-rep-exo tone-'+r.tone+(isAbdo?' cat-abdo':'')+'">'
        +'<div class="as-rep-exo-top"><span class="as-rep-exo-name">'+(side?(isAbdo?'<span class="abdo-mark">&#x1F525;</span> ':'&#x2B50; '):'')+r.name+'</span>'
        +badge+'</div>'
        +'<div class="as-rep-exo-w">'+(setsTxt||(x.weight+' '+x.unite))+(side?' &#xB7; <em style="'+(isAbdo?'color:#9B8CFF':'color:var(--mut)')+';font-style:normal;">bonus'+(isAbdo?' abdo':'')+' &#x2014; hors note /20</em>':'')+'</div>'
        +r.lines.map(function(l){return '<div class="as-rep-line">'+l+'</div>';}).join('')
        +'</div>';
    });
  } else if(view===3){
    h+=asRenderRecordsSlide();
  } else {
    h+='<div class="as-rep-slide-title">&#x1F680; Et maintenant ?</div>';
    if(!AS.suggestW) AS.suggestW={};
    var any=false;
    // ⚡ Évolutions de charge : ce que la séance du jour a fait avancer (15/08)
    (AS.evoResults||[]).forEach(function(ev){
      any=true;
      var msg=ev.st==='done'
        ?'&#x2705; <strong>&#xC9;volution termin&#xE9;e !</strong> Toutes les s&#xE9;ries tenues au poids haut &#x2014; nouvelle r&#xE9;f&#xE9;rence <strong>'+ev.to+' '+ev.unite+'</strong>.'
        :ev.st==='up'
        ?'&#x26A1; S&#xE9;ries au poids haut tenues &#x2014; la prochaine fois : <strong>'+ev.hi+'/'+ev.n+' s&#xE9;ries &#xE0; '+ev.to+' '+ev.unite+'</strong>'+(ev.hi>=ev.n?' (derni&#xE8;re marche avant la bascule)':'')+'.'
        :'&#x1F504; S&#xE9;ries au poids haut pas encore tenues &#x2014; on retente le m&#xEA;me palier ('+ev.hi+'/'+ev.n+' &#xE0; '+ev.to+' '+ev.unite+') la prochaine fois. Z&#xE9;ro drame : c\'est le principe de la marche.';
      h+='<div class="as-rep-exo tone-'+(ev.st==='retry'?'down':'up')+'"><div class="as-rep-exo-top"><span class="as-rep-exo-name">'+ev.name+'</span>'
        +'<span class="as-rep-exo-w">&#x26A1; &#xE9;volution</span></div>'
        +'<div class="as-rep-line">'+msg+'</div></div>';
    });
    AS.reportExos.forEach(function(r){
      if(r.suggest!==1&&r.suggest!==-1&&r.suggestTo==null) return;
      var x=AS.exos.find(function(e){return e.key===r.key;})||AS.exos.find(function(e){return e.name===r.name;});
      if(!x) return;
      any=true;
      var up=r.suggest===1||(r.suggest!==-1&&r.suggestTo!=null);
      var inv=asIsInverse(x.key);
      var inc=x.repT?x.inc:1;
      // suggestTo (05/08) = valeur ABSOLUE proposée (test validé, calibration, assistance qui marche)
      // — sinon la reco classique ±1 cran. Le stepper part de la reco absolue quand elle existe.
      var reco=r.suggestTo!=null?r.suggestTo
              :(up?(inv?Math.max(0,x.weight-inc):x.weight+inc*(r.suggestBig?2:1))
                  :(inv?x.weight+inc:Math.max(0,x.weight-inc)));
      var hdr=r.suggestTo!=null
        ?(inv?'&#x1F9ED; assistance &#xE0; caler':(r.suggest===1?'&#x1F53C; test valid&#xE9; &#x2014; ent&#xE9;rine':'&#x1F9ED; r&#xE9;f&#xE9;rence &#xE0; caler'))
        :(up?(inv?'&#x1F53C; moins d\'assistance valid&#xE9;e':'&#x1F53C; hausse valid&#xE9;e')
            :(inv?'&#x1F53D; plus d\'assistance conseill&#xE9;e':'&#x1F53D; baisse conseill&#xE9;e'));
      if(AS.suggestW[x.key]==null) AS.suggestW[x.key]=(r.suggestTo!=null?r.suggestTo:x.weight);
      var nw=AS.suggestW[x.key];
      // Anti double-application (bug 05/08 : bilan relu = poids +8 au lieu de +4) : si la
      // RÉFÉRENCE a déjà bougé depuis le début de cette séance (w0), la suggestion est
      // considérée déjà consommée — un bilan revu ne peut plus ré-augmenter le poids.
      var curRef=getCurrentWeight(x.key);
      var refMoved=x.w0!=null&&curRef!=null&&Math.abs(curRef-x.w0)>0.01;
      var applied=AS.applied.indexOf(x.key)>=0||refMoved;
      h+='<div class="as-rep-exo tone-'+(up?'up':'down')+'"><div class="as-rep-exo-top"><span class="as-rep-exo-name">'+x.name+'</span>'
        +'<span class="as-rep-exo-w">'+hdr+' &#xB7; reco '+reco+' '+x.unite+'</span></div>';
      var evoNow=asEvoOf(x.key);
      if(evoNow&&!refMoved){
        // Évolution déjà lancée sur cet exo : le plan remplace le stepper
        h+='<div class="as-rep-line">&#x26A1; <strong>&#xC9;volution en cours</strong> : '+evoNow.from+'&#x2192;'+evoNow.to+' '+x.unite+' &#xB7; prochaine s&#xE9;ance '+evoNow.hi+'/'+x.n+' s&#xE9;rie'+(evoNow.hi>1?'s':'')+' au poids haut.'
          +' <button class="as-ghost-btn" style="font-size:.62rem;padding:.25rem .5rem;" onclick="asStopEvo(\''+x.key+'\')">Arr&#xEA;ter</button></div>';
      } else if(applied){
        h+='<button class="as-apply done" disabled>&#x2705; Appliqu&#xE9; &#x2014; r&#xE9;f. actuelle '+(refMoved?curRef:x.weight)+' '+x.unite+'</button>';
      } else {
        h+='<div class="as-sugg-row">'
          +'<button class="as-wbtn" onclick="asSuggestChg(\''+x.key+'\',-0.5)">&#x2212;</button>'
          +'<span class="as-sugg-val">'+nw+'<small> '+x.unite+'</small></span>'
          +'<button class="as-wbtn plus" onclick="asSuggestChg(\''+x.key+'\',0.5)">+</button>'
          +'<button class="as-apply" '+((curRef!=null?nw===curRef:nw===x.weight)?'disabled':'')+' onclick="asApplySuggest(\''+x.key+'\')">'+(inv?'Appliquer cette assistance':'Appliquer &#x2713;')+'</button>'
          +'</div>';
        // ⚡ Alternative à la bascule sèche (15/08, demande Adrien) : hausse validée sur un exo
        // en kg → proposer la transition progressive 55·55·50·50 (poids haut frais en premier, 22/08).
        if(up&&!inv&&!x.repT&&/kg/.test(x.unite||'')&&(x.n||0)>=2){
          h+='<button class="as-apply as-evo-start" onclick="asStartEvo(\''+x.key+'\')">&#x26A1; Commencer l\'&#xE9;volution <small>('+x.weight+'&#x2192;'+nw+' en douceur : le poids haut en premier, frais)</small></button>';
        }
      }
      h+='</div>';
    });
    if(!any) h+='<div class="as-rep-note">Pas d\'ajustement de poids sugg&#xE9;r&#xE9; aujourd\'hui &#x2014; consolide les charges actuelles, la hausse viendra toute seule.</div>';
    h+='<div class="as-rep-footer-note">&#x1F4CB; Tout le d&#xE9;tail (s&#xE9;ries, reps, ressentis, douleur) part dans l\'export &#xAB;&#x202F;Tout pour le coach&#x202F;&#xBB;.</div>';
  }
  h+='</div>';
  h+=asSlideDots(nSlides,i,'asRepGoto');
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="asRepNav(-1)" '+(i===0?'disabled':'')+'>&#x2039;</button>'
    +(i<nSlides-1?'<button class="as-cta" onclick="asRepNav(1)">Suivant &#x203A;'+(FEATURE_FULL_BILAN?(i===2?'<span class="as-cta-sub">classements</span>':(i===3?'<span class="as-cta-sub">suggestions</span>':'')):'<span class="as-cta-sub">suggestions</span>')+'</button>'
         :'<button class="as-cta" onclick="asDone()">Terminer &#x1F389;</button>')
    +'</div>';
  return h;
}
function asSuggestChg(key,delta){
  if(!AS.suggestW) AS.suggestW={};
  var v=AS.suggestW[key]!=null?AS.suggestW[key]:0;
  AS.suggestW[key]=Math.max(0,Math.round((v+delta)*2)/2);
  asSave(); asRender();
}
function asApplySuggest(key,nw){
  var x=AS.exos.find(function(e){return e.key===key;});
  if(!x||AS.applied.indexOf(key)>=0) return;
  // Garde-fou anti double-application : si la référence a déjà changé depuis le début de la
  // séance (suggestion déjà appliquée, ou poids édité au panneau Séances), on n'empile pas.
  var curRef=getCurrentWeight(key);
  if(x.w0!=null&&curRef!=null&&Math.abs(curRef-x.w0)>0.01){
    AS.applied.push(key); asSave(); asRender();
    showToast('&#x2705; D&#xE9;j&#xE0; pris en compte &#x2014; '+getExoName(key)+' est &#xE0; '+curRef+' '+x.unite);
    return;
  }
  if(nw==null) nw=(AS.suggestW&&AS.suggestW[key]!=null)?AS.suggestW[key]:x.weight;
  x.weight=asApplyWeight(key,nw);
  AS.applied.push(key);
  asSave(); asRender();
  showToast('&#x1F4AA; '+getExoName(key)+' &#x2192; '+x.weight+' '+x.unite+' pour la prochaine');
}
function asDone(){
  asSound('finish');
  spawnConfetti(window.innerWidth/2,180);
  asDiscard();
  try{ renderGymGreet(); renderHisto(); }catch(e){}
  showToast('&#x1F389; S&#xE9;ance enregistr&#xE9;e &#x2014; bien jou&#xE9; !');
}

// ══════════════════════════════════════════════════
// ÉDITEUR DE SÉANCE PLEIN ÉCRAN (remplace le modal « Nouvelle séance »)
// Création manuelle ET modification depuis le calendrier (y compris séances en direct).
// ══════════════════════════════════════════════════
var ED=null;
function edOpen(logId){
  var log=logId?DB.logs.find(function(l){return String(l.id)===String(logId);}):null;
  ED={logId:log?log.id:null,
      date:log?log.date:todayStr(),
      time:log?(log.time||''):(function(){var d=getNow();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');})(),
      seances:{},exos:{},autre:'',cardio:log?!!log.cardio:false,
      energy:log?(log.energy||null):null,feeling:log?(log.feeling||null):null,
      dur:log?(log.duration_min||''):'',comment:log?(log.comment||''):'',
      live:log&&log.live?JSON.parse(JSON.stringify(log.live)):null,
      liveSid:null};
  if(log){
    (log.sessions||[]).forEach(function(sid){
      if(sid.indexOf('autre:')===0){ ED.autre=sid.slice(6); }
      else if(sid.indexOf('exo:')===0){ ED.exos[sid.slice(4)]=true; }
      else { ED.seances[sid]=true; if(ED.live&&!ED.liveSid) ED.liveSid=sid; }
    });
  }
  edRender();
  var ov=document.getElementById('edOverlay');
  if(ov){ ov.classList.add('open'); document.body.style.overflow='hidden'; }
}
function edClose(){
  ED=null;
  var ov=document.getElementById('edOverlay');
  if(ov) ov.classList.remove('open');
  document.body.style.overflow='';
}
function edField(id){ var el=document.getElementById(id); return el?el.value:''; }
function edSyncFields(){
  if(!ED) return;
  ED.date=edField('edDate')||ED.date;
  ED.time=edField('edTime');
  ED.autre=edField('edAutre');
  ED.dur=edField('edDur');
  ED.comment=edField('edComment');
}
function edRender(){
  var body=document.getElementById('edBody'); if(!body||!ED) return;
  var h='<div class="as-hdr">'
    +'<button class="as-exit" onclick="edClose()" title="Fermer sans enregistrer">'+AS_EXIT_SVG+'</button>'
    +'<div class="as-hdr-mid"><div class="as-hdr-title">'+(ED.logId?'Modifier la s&#xE9;ance':'Nouvelle s&#xE9;ance')+'</div>'
    +'<div class="as-hdr-sub">'+formatDateFr(ED.date)+'</div></div>'
    +'<div class="as-hdr-right"></div></div>';
  h+='<div class="as-scroll">';
  // Date / heure
  h+='<div class="ed-dt"><div class="ed-dt-f"><label class="as-lbl">Date</label><input class="ed-input" type="date" id="edDate" value="'+ED.date+'" onchange="edSyncFields();edRender()"/></div>'
    +'<div class="ed-dt-f"><label class="as-lbl">Heure</label><input class="ed-input" type="time" id="edTime" value="'+(ED.time||'')+'"/></div></div>';
  if(ED.live){
    // ── Séance en direct : correction exo par exo ──
    h+='<div class="as-lbl">LiveUp &#x2014; corrige tes s&#xE9;ries <span class="as-lbl-hint">reps &#xB7; poids &#xB7; retirer</span></div>';
    ED.live.exos.forEach(function(x,xi){
      var counted=liveExoCounted(x);
      h+='<div class="ed-lexo'+(counted?'':' off')+'">'
        +'<div class="ed-lexo-top"><span class="ed-lexo-name">'+getExoName(x.key)+'</span>'
        +'<span class="ed-lexo-status">'+(x.status==='skipped'?(counted?(x.pain?'arr&#xEA;t douleur &#xB7; compt&#xE9;':'&#xE9;court&#xE9; &#xB7; compt&#xE9;'):'pass&#xE9; &#xB7; non compt&#xE9;'):(counted?'compt&#xE9;':'non compt&#xE9;'))+'</span>'
        +'<button class="ed-lexo-del" onclick="edRemoveLiveExo('+xi+')" title="Retirer de la s&#xE9;ance">&#x1F5D1;</button></div>'
        // 08/08 : l'objectif par série est éditable ici (Adrien corrige un Pallof en secondes ou un
        // cardio en minutes après coup → sans ça, la note /5 se juge contre une cible obsolète).
        // Sur un exo « repTarget » (cardio), la valeur EST la cible : un seul champ, pas deux.
        +(edIsRepT(x.key)
          ?'<div class="ed-lexo-w"><label>'+(cntU(x)==='min'?'Dur&#xE9;e / s&#xE9;rie':'Objectif / s&#xE9;rie')+'</label>'
            +'<input class="ed-input sm" type="number" min="0" value="'+(x.reps!=null?x.reps:x.w)+'" onblur="edLiveTarget('+xi+',this)"/> '+cntU(x)+'</div>'
          :'<div class="ed-lexo-w"><label>Poids de r&#xE9;f.</label>'
            +'<input class="ed-input sm" type="number" step="0.5" value="'+x.w+'" onblur="edLiveW('+xi+',this)"/> '+(x.unite||'kg')
            +'<label>Objectif / s&#xE9;rie</label>'
            +'<input class="ed-input sm" type="number" min="0" value="'+(x.reps||0)+'" onblur="edLiveTarget('+xi+',this)"/> '+cntU(x)+'</div>');
      if(x.sets&&x.sets.length){
        var isKg=/kg/.test(x.unite||'kg');
        h+='<div class="ed-sets" id="edsets-'+xi+'">';
        x.sets.forEach(function(s,si){
          var sw=(s.w!=null?s.w:x.w);
          var diff=isKg&&sw!==x.w; // poids changé sur CETTE série → mis en évidence
          h+='<div class="ed-set'+(diff?' wdiff':'')+'"><span>S'+(si+1)+'</span>'
            +'<input class="ed-input sm" type="number" value="'+s.reps+'" onblur="edLiveReps('+xi+','+si+',this)"/><em>'+cntU(x)+'</em>'
            +edFeelBtns(x,xi,si,s)
            +(isKg?'<input class="ed-input sm w'+(diff?' diff':'')+'" type="number" step="0.5" value="'+sw+'" onblur="edLiveSetW('+xi+','+si+',this)" title="Poids de cette s&#xE9;rie"/><em>kg</em>':'')
            +'<button class="ed-set-del" onclick="edDelLiveSet('+xi+','+si+')" title="Supprimer la s&#xE9;rie">&#x2715;</button></div>';
        });
        h+='<button class="as-mini-btn" onclick="edAddLiveSet('+xi+')">+ s&#xE9;rie</button></div>';
      } else {
        h+='<div class="ed-sets"><span class="ed-nosets">Aucune s&#xE9;rie</span><button class="as-mini-btn" onclick="edAddLiveSet('+xi+')">+ s&#xE9;rie</button></div>';
      }
      h+='</div>';
    });
  } else {
    // ── Séances / exos (création ou log classique) ──
    h+='<div class="as-lbl">Qu\'as-tu fait ? <span class="as-lbl-hint">touche une s&#xE9;ance pour la valider en entier</span></div>';
    h+='<div class="as-setup-grid">';
    DATA.forEach(function(s){
      var vis=s.exos.filter(function(e){return !e.hidden;});
      if(!vis.length) return;
      var on=!!ED.seances[s.id];
      h+='<button class="as-scard'+(on?' on':'')+'" data-t="'+s.t+'" onclick="edToggleSeance(\''+s.id+'\')">'
        +'<span class="as-scard-ico">'+s.icon+'</span><span class="as-scard-name">'+s.name+'</span>'
        +'<span class="as-scard-ct">'+(on?'valid&#xE9;e &#x2713;':vis.filter(function(e){return !e.bonus;}).length+' exos')+'</span></button>';
    });
    h+='</div>';
    h+='<div class="as-lbl">Ou des exercices &#xE0; la carte <span class="as-lbl-hint">en plus ou &#xE0; la place</span></div>';
    DATA.forEach(function(s){
      var vis=s.exos.filter(function(e){return !e.hidden;});
      if(!vis.length) return;
      var selCt=vis.filter(function(e){return ED.exos[e.key];}).length;
      var open=!!ED._open&&ED._open===s.id;
      h+='<div class="ed-exogrp'+(open?' open':'')+'">'
        +'<button class="ed-exogrp-btn" onclick="edToggleGrp(\''+s.id+'\')">'+s.icon+' '+s.name+(selCt?' <span class="ed-exogrp-ct">'+selCt+'</span>':'')+'<span class="wb-arr">&#x25BE;</span></button>';
      if(open){
        h+='<div class="as-exo-picks" style="margin:.4rem 0 .6rem;">';
        vis.forEach(function(e){
          var on=!!ED.exos[e.key];
          h+='<button class="as-pick'+(on?' on':'')+(e.bonus?' bonus':'')+'" onclick="edToggleExo(\''+e.key+'\')">'+exoPickMark(e)+e.name+'<span class="as-pick-tick">&#x2713;</span></button>';
        });
        h+='</div>';
      }
      h+='</div>';
    });
    h+='<div class="as-lbl">Autre sport <span class="as-lbl-hint">boxe, escalade, course...</span></div>';
    h+='<input class="ed-input" type="text" id="edAutre" placeholder="Ex: Boxe, Escalade..." value="'+(ED.autre||'').replace(/"/g,'&quot;')+'"/>';
    // Cardio déclaré (04/08) : course, foot... → remplit le compteur cardio de la semaine (obj. 2)
    h+='<button class="as-ctx-btn ed-cardio'+(ED.cardio?' on':'')+'" onclick="edSyncFields();ED.cardio=!ED.cardio;edRender()">'+(ED.cardio?'&#x2713; ':'')+'&#x1F3C3; &#xC7;a comptait cardio <span class="as-lbl-hint">remplit l\'objectif 2/sem</span></button>';
    // Convertir un log manuel en séance détaillée (séries/reps/poids → note /20, bilan, vrais RP)
    var hasSel=Object.keys(ED.seances||{}).some(function(k){return ED.seances[k];})||Object.keys(ED.exos||{}).some(function(k){return ED.exos[k];});
    if(hasSel){
      h+='<button class="ed-detail-btn" onclick="edBuildLiveFromSessions()">&#x1F3AC; D&#xE9;tailler les s&#xE9;ries de cette s&#xE9;ance<span class="ed-detail-sub">poids &#xB7; reps par s&#xE9;rie &#x2192; note /20, bilan et vrais points</span></button>';
    }
  }
  // Détails
  h+='<div class="as-lbl" style="margin-top:1.1rem;">D&#xE9;tails <span class="as-lbl-hint">optionnel</span></div>';
  function scale(lbl,field,hints){
    var v=ED[field];
    var s='<div class="ed-scale-lbl">'+lbl+'</div><div class="as-scale-hint"><span>'+hints[0]+'</span><span>'+hints[1]+'</span></div><div class="as-scale ed-scale">';
    for(var i=1;i<=5;i++){ s+='<button class="as-scale-btn'+(v===i?' on':'')+'" onclick="edSetScale(\''+field+'\','+i+')">'+i+'</button>'; }
    return s+'</div>';
  }
  h+=scale('&#x26A1; &#xC9;nergie','energy',['&#xC0; plat','En feu']);
  h+=scale('&#x2B50; Ressenti','feeling',['Tr&#xE8;s dur','Parfaite']);
  h+='<div class="ed-dt" style="margin-top:.6rem;"><div class="ed-dt-f"><label class="as-lbl">Dur&#xE9;e (min)</label><input class="ed-input" type="number" id="edDur" min="1" max="300" placeholder="45" value="'+(ED.dur||'')+'"/></div></div>';
  h+='<label class="as-lbl">Commentaire</label><textarea class="as-note" id="edComment" rows="2" placeholder="Comment tu t\'es senti...">'+(ED.comment||'')+'</textarea>';
  if(ED.logId){
    h+='<button class="ed-del-btn" onclick="edDelete()">&#x1F5D1; Supprimer cette s&#xE9;ance</button>';
  }
  h+='</div>';
  h+='<div class="as-foot">'
    +'<button class="as-ghost-btn" onclick="edClose()">Annuler</button>'
    +'<button class="as-cta" onclick="edSave()">'+(ED.logId?'Modifier &#x2713;':'Enregistrer &#x2713;')+'</button>'
    +'</div>';
  body.innerHTML=h;
}
function edToggleSeance(sid){ edSyncFields(); ED.seances[sid]=!ED.seances[sid]; edRender(); }
function edToggleExo(key){ edSyncFields(); ED.exos[key]=!ED.exos[key]; edRender(); }
function edToggleGrp(sid){ edSyncFields(); ED._open=(ED._open===sid)?null:sid; edRender(); }
function edSetScale(field,v){ edSyncFields(); ED[field]=(ED[field]===v)?null:v; edRender(); }
function edLiveW(xi,input){
  var x=ED.live.exos[xi]; if(!x) return;
  var v=parseFloat(input.value);
  if(isNaN(v)||v<0){ input.value=x.w; return; }
  var old=x.w;
  x.w=Math.round(v*2)/2; input.value=x.w;
  // ne suit que les séries qui étaient au poids de référence — les poids custom par série sont préservés
  (x.sets||[]).forEach(function(s){ if(s.w==null||s.w===old) s.w=x.w; });
  edRefreshSetW(xi);
}
function edLiveSetW(xi,si,input){
  var x=ED.live.exos[xi]; if(!x||!x.sets[si]) return;
  var v=parseFloat(input.value);
  if(isNaN(v)||v<0){ input.value=(x.sets[si].w!=null?x.sets[si].w:x.w); return; }
  x.sets[si].w=Math.round(v*2)/2;
  input.value=x.sets[si].w;
  edRefreshSetW(xi);
}
// MAJ ciblée (pas de re-render sur blur, sinon le tap sur « Modifier ✓ » serait avalé) :
// resynchronise valeurs + surlignage « poids différent » des séries d'un exo.
function edRefreshSetW(xi){
  var x=ED.live.exos[xi]; if(!x) return;
  var wrap=document.getElementById('edsets-'+xi); if(!wrap) return;
  var isKg=/kg/.test(x.unite||'kg');
  var rows=wrap.querySelectorAll('.ed-set');
  (x.sets||[]).forEach(function(s,si){
    var r=rows[si]; if(!r) return;
    var sw=(s.w!=null?s.w:x.w);
    var diff=isKg&&sw!==x.w;
    r.classList.toggle('wdiff',diff);
    var wi=r.querySelector('input.w');
    if(wi){ wi.value=sw; wi.classList.toggle('diff',diff); }
  });
}
function edLiveReps(xi,si,input){
  var x=ED.live.exos[xi]; if(!x||!x.sets[si]) return;
  var v=parseInt(input.value,10);
  if(isNaN(v)||v<0){ input.value=x.sets[si].reps; return; }
  x.sets[si].reps=v;
}
// Un exo « repTarget » (cardio) : la valeur réglée EST la cible de la série, pas une charge
function edIsRepT(key){ var info=findExoIndex(key); return !!(info&&info.exo.repTarget); }
// ── Ressenti par série éditable après coup (08/08) ────────────────────────────
// C'est le ressenti qui décide de la note /5 (règle EFFORT : sous la cible SANS « à l'échec » =
// effort non terminé = pénalisé). Corriger les reps sans pouvoir corriger le ressenti donnait
// une note fausse dans les deux sens. Bouton compact qui fait défiler Facile → Correct → Dur → Échec.
function edIsUni(x,s){
  if(s&&(s.feelG||s.feelD)) return true;
  if(s&&s.feel) return false; // série d'avant le passage uni de l'exo (ex. curl croisé, 31/08) : un seul ressenti, on l'édite tel quel
  var info=findExoIndex(x.key); return !!(info&&info.exo.uni);
}
function edFeelIco(v){ var f=AS_FEELS.find(function(ff){return ff.v===v;}); return f?f.ico:'&#x2013;'; }
function edFeelBtns(x,xi,si,s){
  var uni=edIsUni(x,s);
  var btn=function(side,val){
    var f=AS_FEELS.find(function(ff){return ff.v===val;});
    return '<button class="ed-feel" onclick="edCycleFeel('+xi+','+si+',\''+side+'\')" '
      +'title="'+(side==='g'?'Gauche':(side==='d'?'Droite':'Ressenti'))+' : '+(f?f.lbl:'non renseign&#xE9;')+' &#x2014; tape pour changer">'
      +(side==='g'?'<i>G</i>':(side==='d'?'<i>D</i>':''))+edFeelIco(val)+'</button>';
  };
  return uni?(btn('g',s.feelG)+btn('d',s.feelD)):btn('',s.feel);
}
function edCycleFeel(xi,si,side){
  var x=ED.live.exos[xi]; if(!x||!x.sets[si]) return;
  var s=x.sets[si];
  var prop=side==='g'?'feelG':(side==='d'?'feelD':'feel');
  var i=AS_FEELS.findIndex(function(f){return f.v===s[prop];});
  s[prop]=AS_FEELS[(i+1)%AS_FEELS.length].v;
  var wrap=document.getElementById('edsets-'+xi);
  if(wrap){
    var rows=wrap.querySelectorAll('.ed-set');
    if(rows[si]){
      var btns=rows[si].querySelectorAll('.ed-feel');
      var bi=side==='d'?1:0;
      if(btns[bi]) btns[bi].innerHTML=(side==='g'?'<i>G</i>':(side==='d'?'<i>D</i>':''))+edFeelIco(s[prop]);
    }
  }
}
// Cible par série corrigée après coup (08/08) — c'est elle que la note /5 et l'analyse comparent
// aux séries réellement faites. Sur un repTarget, cible et « poids » sont la même valeur.
function edLiveTarget(xi,input){
  var x=ED.live.exos[xi]; if(!x) return;
  var v=parseInt(input.value,10);
  if(isNaN(v)||v<0){ input.value=(x.reps!=null?x.reps:0); return; }
  x.reps=v;
  if(edIsRepT(x.key)) x.w=v;
  input.value=v;
}
function edDelLiveSet(xi,si){
  var x=ED.live.exos[xi]; if(!x) return;
  x.sets.splice(si,1);
  if(!x.sets.length&&x.status==='done') x.status='skipped';
  edRender();
}
function edAddLiveSet(xi){
  var x=ED.live.exos[xi]; if(!x) return;
  x.sets.push({reps:x.reps||10,feel:'ok',w:x.w});
  if(x.sets.length>=x.n) x.status='done';
  edRender();
}
// Convertit un log MANUEL (séance cochée / exos à la carte) en séance détaillée éditable :
// génère les exos avec leurs séries préremplies (reps cibles, poids actuel, ressenti « Correct »),
// à corriger ensuite série par série. À la sauvegarde le log gagne un vrai `live` → note /20,
// bilan au modal jour, points de séance réels au rank (demande Adrien 01/08).
function edBuildLiveFromSessions(){
  edSyncFields();
  var exos=[];
  var firstSid=null;
  DATA.forEach(function(s){
    if(!ED.seances[s.id]) return;
    if(!firstSid&&s.id!=='sb') firstSid=s.id;
    var extra=firstSid!==s.id; // exos d'une 2e séance cochée → tagués à la carte pour la sauvegarde
    s.exos.forEach(function(e){
      if(e.hidden||e.bonus) return;
      var t=asParseSerie(e);
      var w=getCurrentWeight(e.key)||0;
      var sets=[];
      for(var i=0;i<t.n;i++) sets.push({reps:t.reps,feel:'ok',w:w});
      exos.push({key:e.key,w:w,w0:w,n:t.n,reps:t.reps,unite:e.unite||'kg',cnt:e.cnt||null,status:'done',extra:extra,sets:sets});
    });
  });
  Object.keys(ED.exos||{}).forEach(function(k){
    if(!ED.exos[k]) return;
    if(exos.some(function(x){return x.key===k;})) return;
    var info=findExoIndex(k); if(!info) return;
    var t=asParseSerie(info.exo);
    var w=getCurrentWeight(k)||0;
    var sets=[];
    for(var i=0;i<t.n;i++) sets.push({reps:t.reps,feel:'ok',w:w});
    exos.push({key:k,w:w,w0:w,n:t.n,reps:t.reps,unite:info.exo.unite||'kg',cnt:info.exo.cnt||null,status:'done',extra:true,sets:sets});
  });
  if(!exos.length){ showToast('&#x26A0; Coche d\'abord une s&#xE9;ance ou des exercices'); return; }
  ED.live={exos:exos,pain:null,painNote:'',context:null};
  ED.liveSid=firstSid;
  showToast('&#x1F3AC; S&#xE9;ries pr&#xE9;remplies (reps cibles, ressenti Correct) &#x2014; corrige ce qui diff&#xE8;re');
  edRender();
}
function edRemoveLiveExo(xi){
  var x=ED.live.exos[xi]; if(!x) return;
  if(!confirm('Retirer '+getExoName(x.key)+' de cette séance ?')) return;
  ED.live.exos.splice(xi,1);
  edRender();
}
function edDelete(){
  if(!ED.logId) return;
  var id=ED.logId;
  edClose();
  deleteLog(id);
}
function edSave(){
  edSyncFields();
  if(!ED.date){ showToast('&#x26A0; Choisis une date'); return; }
  var sessions=[];
  if(ED.live){
    if(ED.liveSid) sessions.push(ED.liveSid);
    ED.live.exos.forEach(function(x){
      if(!liveExoCounted(x)) return;
      if(ED.liveSid&&!x.extra) return;
      sessions.push('exo:'+x.key);
    });
    if(!sessions.length&&ED.liveSid) sessions.push(ED.liveSid);
    if(!sessions.length&&ED.live.exos.length){ // tout retiré/non compté : garder une trace exos
      ED.live.exos.forEach(function(x){ if(x.sets&&x.sets.length) sessions.push('exo:'+x.key); });
    }
  } else {
    Object.keys(ED.seances).forEach(function(sid){ if(ED.seances[sid]) sessions.push(sid); });
    Object.keys(ED.exos).forEach(function(k){
      if(!ED.exos[k]) return;
      var info=findExoIndex(k);
      // exo déjà couvert par une séance validée (exo principal) → pas de doublon
      if(info&&sessions.indexOf(info.sid)>=0&&!info.exo.bonus) return;
      sessions.push('exo:'+k);
    });
  }
  if(ED.autre&&ED.autre.trim()) sessions.push('autre:'+ED.autre.trim());
  if(!sessions.length){ showToast('&#x26A0; Choisis une s&#xE9;ance ou des exercices'); return; }
  // Détection de doublon (hors édition du même log)
  var existing=[];
  DB.logs.filter(function(l){return l.date===ED.date&&String(l.id)!==String(ED.logId||'');}).forEach(function(l){existing=existing.concat(l.sessions||[]);});
  var overlap=sessions.filter(function(s){return s.indexOf('autre:')<0&&existing.indexOf(s)>=0;});
  if(overlap.length){
    var names=overlap.map(function(sid){var s=DATA.find(function(x){return x.id===sid;});return s?s.name:sid.replace('exo:','');}).join(', ');
    if(!confirm('Tu as déjà "'+names+'" ce jour-là. Continuer quand même ?')) return;
  }
  var durMin=ED.dur?parseInt(ED.dur,10):null;
  if(durMin&&(isNaN(durMin)||durMin<=0)) durMin=null;
  var logId=ED.logId||Date.now();
  // RANK : total avant, pour le récap de rectification (séance oubliée ajoutée après coup)
  var _rpBefore=null, _rpSeason=null;
  if(FEATURE_RANK) try{ _rpSeason=rankSeasonOf(ED.date); if(_rpSeason) _rpBefore=rankCompute(_rpSeason).total; }catch(e){}
  if(ED.logId) DB.logs=DB.logs.filter(function(l){return String(l.id)!==String(ED.logId);});
  var entry={id:logId,date:ED.date,time:ED.time||'',sessions:sessions,comment:ED.comment||'',
    feeling:ED.feeling||null,energy:ED.energy||null,duration_min:durMin};
  if(ED.cardio) entry.cardio=true;
  if(ED.live){
    entry.live=ED.live;
    // Une correction de séries/cibles change la note : on re-grave note20 sur les statuts FIGÉS (main)
    // — au barème COURANT (v3.2), comme toute correction assumée (règle 15/08).
    try{
      if(liveNotedExos(ED.live.exos||[]).length) entry.live.note20=asNote20From(ED.live.exos);
    }catch(e){}
  }
  DB.logs.push(entry);
  DB.logs.sort(function(a,b){return b.date.localeCompare(a.date)||((b.time||'').localeCompare(a.time||''));});
  saveDB();
  // 14/08 (bug Adrien : « ajuster le temps dans modifier ne change pas le bilan ») : si le bilan
  // LiveUp de CE log est encore en mémoire (AS.savedLogId), on recale sa durée et on invalide
  // l'analyse mise en cache — le bilan revu reflète durée ET séries corrigées.
  try{
    if(typeof AS!=='undefined'&&AS&&AS.savedLogId&&String(AS.savedLogId)===String(logId)){
      if(durMin) AS.startTs=Date.now()-durMin*60000;
      AS.reportExos=null; AS.reportNotes=null;
      asSave();
      var _asOv=document.getElementById('asOverlay');
      if(_asOv&&_asOv.classList.contains('open')) asRender();
    }
  }catch(e){}
  edClose();
  renderHisto();
  try{ renderGymGreet(); }catch(e){}
  showToast('&#x2705; S&#xE9;ance '+(ED&&ED.logId?'modifi&#xE9;e':'enregistr&#xE9;e')+' !');
  // Récap RP de l'ajustement (différé pour ne pas écraser le toast principal)
  try{
    if(_rpBefore!==null&&_rpSeason){
      var _d=rankCompute(_rpSeason).total-_rpBefore;
      if(Math.abs(_d)>=1){
        setTimeout(function(){ showToast('&#x1F3C5; Ajustement activit&#xE9; : '+(_d>0?'+':'')+_d.toLocaleString('fr-FR')+' pts '+(_d>0?'r&#xE9;cup&#xE9;r&#xE9;s':'')); },1900);
      }
    }
  }catch(e){}
}

// ══════════════════════════════════════════════════
// BILAN — carte profil (en-tête de la vue)
// ══════════════════════════════════════════════════
// Carte profil v2 (15/08 soir, demande Adrien) : UNE carte propre qui fusionne l'identité,
// la dernière pesée en héros et l'essentiel du poids (Δ30j · rythme · total depuis mars).
// Sortis (sa demande) : « X séances/sem », le Δ 7 jours et la distance au repère 76 kg.
// renderBilanHero / renderBilanWeightStats sont débranchés mais conservés plus bas.
function renderBilanProfile(){
  var el=document.getElementById('bilanProfile'); if(!el) return;
  var p=DB.profile||{};
  var name=p.name||'Adrien';
  var age=p.age||DEFAULT_AGE;
  var height=p.height||172;
  var goalMap={masse:'Prise de masse',force:'Force',seche:'S&#xE8;che',maintien:'Maintien'};
  var initials=name.slice(0,2).toUpperCase();
  var data=DB.bodyWeight||[];
  var last=data.length?data[data.length-1]:null;
  var prev=data.length>1?data[data.length-2]:null;
  var first=data.length?data[0]:null;
  var current=last?parseFloat(last.weight_kg):null;
  var dPrev=(last&&prev)?Math.round((current-parseFloat(prev.weight_kg))*10)/10:null;
  var total=(last&&first)?Math.round((current-parseFloat(first.weight_kg))*10)/10:null;
  // (01/09) Bug Δ30j corrigé : l'ancienne version prenait la 1re pesée antérieure à J-30
  // par rapport à AUJOURD'HUI — avec des pesées espacées, la référence pouvait dater de
  // 45-60 j et le delta affiché « /30 jours » était gonflé (ex. +3,5 kg à tort).
  // Désormais : fenêtre ancrée sur la DERNIÈRE pesée, référence = pesée la plus proche
  // de (dernière − 30 j), et delta ramené à 30 jours au prorata du nombre de jours
  // réellement écoulés entre les deux pesées. Même prorata pour le kg/semaine.
  var d30=null, rate=null;
  if(last&&data.length>=2){
    var lastT=new Date(last.date).getTime(), targetT=lastT-30*86400000;
    var ref=null,best=Infinity;
    for(var k=0;k<data.length-1;k++){
      var gap=Math.abs(new Date(data[k].date).getTime()-targetT);
      if(gap<=best){ best=gap; ref=data[k]; }
    }
    var refDays=(lastT-new Date(ref.date).getTime())/86400000;
    if(refDays>=7){ // en dessous d'une semaine d'écart, extrapoler n'a pas de sens
      var perDay=(current-parseFloat(ref.weight_kg))/refDays;
      d30=Math.round(perDay*30*10)/10;
      rate=Math.round(perDay*7*100)/100;
    }
  }
  function fmtD(v,dec){ return v==null?'--':(v>0?'+':'')+String(dec?v.toFixed(dec):v).replace('.',','); }
  var h='<div class="bp-card bp-v2">'
    +'<div class="bp-head">'
    +'<div class="bp-avatar">'+initials+'</div>'
    +'<div class="bp-id"><div class="bp-name">'+name+'</div>'
    +'<div class="bp-sub">'+age+' ans &#xB7; '+height+' cm &#xB7; Ectomorphe &#xB7; <strong style="color:var(--acc)">'+(goalMap[p.goal]||'Prise de masse')+'</strong></div></div>'
    +(function(){
      if(!FEATURE_RANK) return ''; // rank mis de côté (15/08) — se réactive via le flag
      try{
        var st=rankState();
        return '<div class="bp-rank bp-rank-hex" title="'+st.glob.rp+' RP — '+st.season.label+'" onclick="openSeasonModal('+st.season.id+')">'
          +rankMedalHtml(st.globalTier,st.globalDiv,38,true)
          +'<span class="bp-rank-tier" style="color:'+st.globalTier.color+'">'+st.globalTier.name+'</span>'
          +'</div>';
      }catch(e){ return ''; }
    })()
    +'</div>';
  if(current!=null){
    h+='<div class="bp-weigh">'
      +'<div class="bp-weigh-main">'
      +'<div class="bp-weigh-lbl">DERNI&#xC8;RE PES&#xC9;E &#xB7; '+formatDateFr(last.date)+'</div>'
      +'<div class="bp-weigh-v">'+String(current).replace('.',',')+' <span class="bp-weigh-u">kg</span></div>'
      +(dPrev!=null?'<div class="bp-weigh-meta"><span style="color:'+(dPrev>0?'#5FD695':dPrev<0?'#FF6B7A':'var(--mut)')+';font-weight:800">'+fmtD(dPrev)+' kg</span> vs pes&#xE9;e pr&#xE9;c&#xE9;dente</div>':'')
      +'</div>'
      +'<button class="bilan-pesee-btn" onclick="openPeseeModal()">+ Pes&#xE9;e</button>'
      +'</div>';
    h+='<div class="bp-stats">'
      +'<div class="bp-stat"><span class="bp-stat-v" style="color:'+(d30>0?'var(--acc)':'var(--mut)')+'">'+fmtD(d30)+'</span><span class="bp-stat-l">kg / 30 jours</span></div>'
      +'<div class="bp-stat"><span class="bp-stat-v" style="color:'+(rate!=null&&rate>0&&rate<=0.5?'var(--acc)':rate>0.5?'var(--yellow)':'var(--mut)')+'">'+fmtD(rate,2)+'</span><span class="bp-stat-l">kg / semaine</span></div>'
      +'<div class="bp-stat"><span class="bp-stat-v" style="color:var(--acc2)">'+fmtD(total)+'</span><span class="bp-stat-l">depuis mars</span></div>'
      +'</div>';
  } else {
    h+='<div class="bp-weigh"><div class="bp-weigh-main"><div class="bp-weigh-lbl">AUCUNE PES&#xC9;E</div></div>'
      +'<button class="bilan-pesee-btn" onclick="openPeseeModal()">+ Pes&#xE9;e</button></div>';
  }
  h+='</div>';
  el.innerHTML=h;
}

// ══════════════════════════════════════════════════
// PROGRESSION — radar points forts / points faibles
// ══════════════════════════════════════════════════
var _radarChart=null;
var RADAR_GROUPS=[
  {label:'Pecs',keys:['chestpress_v','pecdeck','dev_incline','cable_fly','seated_dips','dips_assist']},
  {label:'Épaules',keys:['elev_lat','shrug_halt','face_pull','shoulder_press','dev_militaire']},
  {label:'Triceps',keys:['triceps_corde','triceps_barre']},
  {label:'Dos',keys:['tirage_vert','rowing_pb','rowing_uni','rowing_appui','tirage_pulldown','traction_assist']},
  {label:'Biceps',keys:['curl_marteau','curl_marteau_croise','curl_incline_neutre','curl_corde','curl_halt','curl_poulie','curl_incline']},
  {label:'Jambes',keys:['leg_press','leg_ext','leg_curl','mollets','abduct','adduct','hip_thrust']},
  // Abdos ajoutés au volume hebdo le 06/08 (demande Adrien) — gainage inclus (c'est du tronc)
  {label:'Abdos',keys:['crunch_poulie','releve_chaise','pallof','dead_bug','hollow_hold','crunch','gainage','crunch_leste']}
];
// Crédit « muscle assistant » pour le VOLUME hebdo (05/08, question Adrien) : chaque série
// d'un polyarticulaire compte 1 pour son muscle cible + 0,5 pour l'assistant (un tirage
// travaille aussi les biceps, une presse les triceps/épaules) — standard hypertrophie.
// N'affecte QUE les barres de volume, jamais le rank ni les notes.
var VOL_SECONDARY={
  tirage_vert:{'Biceps':.5},tirage_pulldown:{'Biceps':.5},traction_assist:{'Biceps':.5},
  rowing_pb:{'Biceps':.5},rowing_appui:{'Biceps':.5},rowing_uni:{'Biceps':.5},
  chestpress_v:{'Épaules':.5,'Triceps':.5},dev_incline:{'Épaules':.5,'Triceps':.5},
  seated_dips:{'Triceps':.5},dips_assist:{'Triceps':.5},dev_militaire:{'Triceps':.5},shoulder_press:{'Triceps':.5},
  face_pull:{'Dos':.5}
};
function volAddSets(vol,key,n){
  if(!n) return;
  var g=rankGroupOf(key);
  if(g) vol[g]=(vol[g]||0)+n;
  var sec=VOL_SECONDARY[key];
  if(sec) Object.keys(sec).forEach(function(g2){ vol[g2]=(vol[g2]||0)+n*sec[g2]; });
}
// Nombre d'exécutions COMPTÉES d'un exo dans les X derniers jours (règle liveExoCounted)
function execsInWindow(key,days){
  var cutoff=new Date(getNow().getTime()-days*86400000);
  var info=findExoIndex(key); if(!info) return 0;
  return (DB.logs||[]).filter(function(l){
    if(!l.date||new Date(l.date)<cutoff) return false;
    if(l.live&&l.live.exos){
      var lx=null; l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      return lx?liveExoCounted(lx):false;
    }
    return (l.sessions||[]).some(function(sid){ return sid==='exo:'+key||(sid===info.sid&&exoMainForLog(info,key,l.date)); });
  }).length;
}
// Nombre d'exécutions COMPTÉES d'un exo depuis une date (règle liveExoCounted)
function execsSince(key,startDate){
  var info=findExoIndex(key); if(!info) return 0;
  return (DB.logs||[]).filter(function(l){
    if(!l.date||l.date<startDate) return false;
    if(l.live&&l.live.exos){
      var lx=null; l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      return lx?liveExoCounted(lx):false;
    }
    return (l.sessions||[]).some(function(sid){ return sid==='exo:'+key||(sid===info.sid&&exoMainForLog(info,key,l.date)); });
  }).length;
}
// Un exo n'entre dans le radar que s'il fait partie de la pratique ACTUELLE d'Adrien :
// pas masqué (blessure/abandon) ET réellement exécuté DEPUIS LE DÉBUT DE LA SAISON en cours
// (retour Adrien 01/08 : « ma vraie note » = seulement les exos refaits cette saison).
// → tant qu'un exo n'a pas été refait cette saison, il n'entre pas dans la note ; le groupe
//   retombe sur les exos avec données (fallback) pour ne pas afficher un radar vide en début de saison.
function radarActiveKey(k){
  var info=findExoIndex(k);
  if(!info||info.exo.hidden) return false;
  if(!STRENGTH_STD[k]) return false;
  if(!getCurrentWeight(k)) return false;
  var ss=rankCurrentSeason().start;
  return execsSince(k,ss)>0;
}
// Score d'un exo, ancré sur les paliers réels : 0 = débutant, 50 = intermédiaire, 100 = avancé
// (interpolation par segments, pour que la légende affichée soit exacte)
function radarExoScore(k,bwt){
  var std=STRENGTH_STD[k]; if(!std) return null;
  var w=getCurrentWeight(k); if(!w) return null;
  var beg=std.beg*bwt, itm=(std.int||((std.beg+std.adv)/2))*bwt, adv=std.adv*bwt;
  var s;
  if(w<=itm) s=(w-beg)/Math.max(0.01,(itm-beg))*50;
  else s=50+(w-itm)/Math.max(0.01,(adv-itm))*50;
  return Math.max(0,Math.min(115,Math.round(s)));
}
// v3 : les notes du radar = les mêmes que le rank — progression de saison vers l'objectif du
// 1er janvier (100 = objectif atteint). Un groupe sans exo refait cette saison = 0 (Bronze III).
function radarScores(){
  var lad;
  try{ lad=rankLadder(); }catch(e){ return null; }
  return lad.groups.map(function(g){
    return {label:g.label,score:g.p!==null?Math.round(Math.min(1,g.p)*100):0,rated:g.p!==null,ahead:g.ahead};
  });
}
// v3 : détail par groupe musculaire — note pondérée par coefficients, tier + division,
// exos pas encore refaits = Bronze III (hors calcul), avance sur le rythme en dégradé bleu.
function radarDetailHtml(){
  var lad; try{ lad=rankLadder(); }catch(e){ return ''; }
  var h='';
  lad.groups.forEach(function(g){
    h+='<div class="nv-group'+(g.p!==null?'':' off')+'">'
      +'<div class="nv-ghead">'
      +'<span class="nv-gname">'+g.label+'</span>'
      +'<span class="nv-tier"'+(g.rated?' style="background:'+g.lad.tier.grad+';color:'+g.lad.tier.txt+';"':'')+' title="M&#xE9;daille = chemin de SAISON parcouru vers l\'objectif">'+g.lad.tier.name+' '+g.lad.div+'</span>'
      +(g.p!==null?'<span class="nv-gscore'+(g.ahead?' ahead':'')+'">'+Math.round(Math.min(1,g.p)*100)+'<small>/100</small></span>':'<span class="nv-gscore muted">&#x2014;</span>')
      +'</div>'
      +'<div class="nv-rows">';
    g.rows.forEach(function(r){
      // « à refaire cette saison » : plus de mention — la ligne est juste grisée comme les « à faire » (02/08)
      h+='<div class="nv-row'+(r.active&&!r.stale?'':' off')+'">'
        +'<span class="nv-coef c'+r.coef+'" title="Poids de cet exo dans la note du groupe">&#xD7;'+r.coef+'</span>'
        +'<span class="nv-name">'+getExoName(r.key)+'</span>'
        +(r.active&&!r.stale
          ?'<span class="nv-val'+(r.ahead?' ahead':'')+'">'+Math.round(Math.min(1,r.p)*100)+'<small>/100</small></span>'
          :'<span class="nv-val muted">&#xE0; faire</span>')
        +'</div>';
    });
    h+='</div></div>';
  });
  // (Texte d'explication sous les notes /100 SUPPRIMÉ le 14/08 — demande Adrien. La règle vit
  // dans COACH.md : note 50 = poids du 30/07 · 100 = objectif du 1er janvier · bleu = en avance.)
  return h;
}
function toggleRadarDetail(){
  var el=document.getElementById('radarDetail'); if(!el) return;
  var open=el.style.display!=='none';
  if(!open) el.innerHTML=radarDetailHtml();
  el.style.display=open?'none':'';
  var arr=document.getElementById('radarDetailArr');
  if(arr) arr.innerHTML=open?'&#x25B8;':'&#x25BE;';
}
function renderLevelRadar(){
  if(!FEATURE_RADAR) return; // araignée des notes mise de côté (15/08)
  if(typeof Chart==='undefined') return;
  var cv=document.getElementById('radarChart'); if(!cv) return;
  var lad; try{ lad=rankLadder(); }catch(e){ return; }
  var note=document.getElementById('radarNote');
  var labels=lad.groups.map(function(g){return g.label;});
  var vals=lad.groups.map(function(g){return g.p!==null?Math.round(Math.min(1,g.p)*100):0;});
  // rythme attendu PAR GROUPE (ancré sur les niveaux de départ des exos du groupe)
  var paceVals=lad.groups.map(function(g){return Math.round((g.paceP!=null?g.paceP:lad.pace)*100);});
  // Échelle FIXE 50→100 (06/08, demande Adrien) : centre = 50, bord = 100 — un 60 et un 65 se
  // distinguent à l'œil. Les DONNÉES ne bougent pas : seul l'affichage est borné (une note sous
  // 50 se dessine au centre, le tooltip garde la vraie valeur).
  var rMin=50;
  var dispVals=vals.map(function(v,i){return lad.groups[i].p!==null?Math.max(rMin,v):rMin;});
  var dispPace=paceVals.map(function(v){return Math.max(rMin,v);});
  var ctx=cv.getContext('2d');
  var grad=ctx.createLinearGradient(0,0,300,300);
  grad.addColorStop(0,'#71FFB4'); grad.addColorStop(.55,'#3FD9FF'); grad.addColorStop(1,'#5B7CFF');
  var ds=[
    {label:'Niveau',data:dispVals,borderColor:grad,backgroundColor:'rgba(63,217,255,.13)',borderWidth:2,
     pointBackgroundColor:'#71FFB4',pointBorderColor:'rgba(11,13,18,.85)',pointBorderWidth:2,pointRadius:4.5},
    {label:'Rythme attendu',data:dispPace,borderColor:'rgba(255,201,77,.4)',borderDash:[5,5],borderWidth:1.2,
     backgroundColor:'transparent',pointRadius:0,fill:false}
  ];
  if(_radarChart){
    _radarChart.data.labels=labels;
    _radarChart.data.datasets=ds;
    _radarChart.options.scales.r.min=rMin;
    _radarChart._raw={vals:vals,pace:paceVals};
    _radarChart.update('none');
  } else {
    _radarChart=new Chart(ctx,{
      type:'radar',
      data:{labels:labels,datasets:ds},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){
          // vraie valeur (pas la valeur bornée à 50 de l'affichage)
          var raw=c.chart._raw;
          var v=raw?(c.datasetIndex===0?raw.vals[c.dataIndex]:raw.pace[c.dataIndex]):c.parsed.r;
          return c.dataset.label+' : '+v+' / 100';
        }}}},
        scales:{r:{min:rMin,max:100,ticks:{display:false},
          grid:{color:'rgba(255,255,255,.07)'},angleLines:{color:'rgba(255,255,255,.07)'},
          pointLabels:{color:'rgba(242,245,250,.65)',font:{size:11,weight:'700',family:'Manrope'}}}}}
    });
    _radarChart._raw={vals:vals,pace:paceVals};
  }
  if(note){
    var rated=lad.groups.filter(function(g){return g.p!==null;});
    var line;
    if(!rated.length){
      line='Refais tes exos en s&#xE9;ance pour activer tes notes &#x2014; chaque groupe d&#xE9;marre &#xE0; Bronze III.';
    } else {
      var sorted=rated.slice().sort(function(a,b){return b.p-a.p;});
      var best=sorted[0], worst=sorted[sorted.length-1];
      line='&#x1F4AA; Point fort&#x202F;: <strong>'+best.label+'</strong> &#xB7; &#x1F3AF; &#xC0; pousser&#x202F;: <strong>'+worst.label+'</strong>';
    }
    note.innerHTML=line
      +'<br><span class="radar-hint">centre 50 = ton d&#xE9;part de saison (27/07) &#xB7; bord 100 = objectif du 1er janvier &#xB7; pointill&#xE9;s jaunes = o&#xF9; le rythme de la saison te place aujourd\'hui</span>'
      +'<button class="rdd-toggle" onclick="toggleRadarDetail()">Le d&#xE9;tail par muscle <span id="radarDetailArr">&#x25B8;</span></button>'
      +'<div id="radarDetail" style="display:none"></div>';
  }
}

// ══════════════════════════════════════════════════
// RANK APEX — moteur de points (spec : massup_rank_concepts.md)
// Tout est RECALCULÉ depuis DB.logs à la volée (déterministe, aucun état à corrompre) :
// corriger une séance dans le calendrier régénère automatiquement les RP.
// ══════════════════════════════════════════════════
var RANK_SEASONS=[
  {id:0,label:'Saison 0',start:'2026-03-02',end:'2026-07-26'},
  {id:1,label:'Saison 1 · Bulk',start:'2026-07-27',end:'2027-01-03'}
];
// L'économie complète — balance : une séance live pleine ≈ 600-800 RP ; une semaine à 4 ≈ 3 000 RP ;
// une semaine ratée (2 séances) coûte ~300 ; une semaine blanche ≈ −800 − decay. Voir doc §2.
var RANK_ECO={
  serie:[10,15,25,40],        // RP de base par série (position 1→4+, la 4e+ prévue vaut 40)
  serieBonus:60,              // 1re série volontaire au-delà du prévu (« ↻ +1 série »)
  serieBonusExtra:10,         // séries volontaires suivantes (anti-farm)
  qFull:1.25,qOk:1.0,qLow:0.5, // multiplicateur qualité : cible atteinte (échec compris) / proche / raté-ou-pas-au-bout (0,5 depuis le 02/08 : l'exécution pèse VRAIMENT sur les pts)
  cleanSweep:100,             // tous les principaux comptés, toutes séries prévues faites
  pr:80,prCap:3,              // hausse de poids validée en séance (assistance baissée si inversé)
  refresh:30,refreshGapDays:75, // refaire un exo gelé (pas compté depuis 75 j+)
  mvp:25,                     // meilleur exo (note /5) si ≥3 exos engagés
  precision:10,precisionCap:3, // dernière série d'un exo ressentie « facile »
  skipMain:-30,dropMain:-10,  // principal skippé direct / lâché à 1-2 séries
  floor:15,                   // plancher : une séance live validée rapporte toujours ≥ +15 net
  annexCap:3,                 // annexes RP-éligibles max par séance (exo jambes obligatoire + bonus)
  manualSalle:600,            // forfait séance loggée sans le mode direct (× logWeight) — jamais sanctionnée
  dayCap:1000,                // RP max/jour (anti double-séance farm)
  wRatioMin:0.6,wRatioMax:1.4, // bornes du prorata poids de série vs référence (s.w/w0)
  pdjRP:30,pdjPerfect:60,     // nutrition hebdo : petit-déj = LA priorité (obj. 4/sem — 04/08) + bonus 7/7
  shakerRP:15,shakerBonus:30, // shaker (obj. 2/sem — 04/08) + bonus ≥6
  cardioPts:100,cardioCap:2,  // cardio OTHERS : forfait par cardio validé, max 2/semaine (03/08)
  cardioW1:15,cardioW2:15,    // check hebdo cardio : aligné sur le shaker (04/08) — la séance cardio paie déjà ses 100 pts
  stretchPts:15,stretchCap:4, // étirements (espace Détente) : +15/jour étiré, cap 4/sem — comptés AU BILAN HEBDO (04/08)
  week5:500,week4:200,week2:-300,week1:-600,week0:-800, // check hebdo (v = weekValue, 3 = neutre)
  streak:[0,0,150,250,350,450], // bonus additionnel par longueur de streak de semaines à ≥4 (cap)
  offGrace:3,offBase:25,offMult:1.5,offDayCap:200, // decay : dès le 4e jour off consécutif, 25×1,5^n, cap 200/j
  divisions:[0,1500,3500]     // seuils RP de saison par groupe → division III / II / I
};
var RANK_TIERS=[
  {name:'Bronze',  color:'#E8A87C',grad:'linear-gradient(150deg,#E8A87C,#B87843 55%,#8A4E2A)',txt:'#3A2003',min:-999},
  {name:'Argent',  color:'#F0F3F8',grad:'linear-gradient(150deg,#F0F3F8,#BCC4D2 55%,#8A93A5)',txt:'#1A1D24',min:25},
  {name:'Or',      color:'#E8B23A',grad:'linear-gradient(150deg,#FFE9A0,#E8B23A 55%,#9C6B12)',txt:'#3A2803',glow:'0 0 12px rgba(232,178,58,0.5)',min:45},
  {name:'Platine', color:'#8ED8E8',grad:'linear-gradient(150deg,#C8F4FF,#7BC0D4 55%,#3E8CA8)',txt:'#062733',min:65},
  {name:'Diamant', color:'#8FD0FF',grad:'linear-gradient(150deg,#EAF8FF,#8FD0FF 45%,#3E7BFF)',txt:'#062033',glow:'0 0 14px rgba(110,180,255,0.55)',min:85},
  {name:'Champion',color:'#FFB25E',grad:'linear-gradient(150deg,#FFE9A0,#FF9D4D 45%,#FF5D9E)',txt:'#3A1503',glow:'0 0 16px rgba(255,140,90,0.55)',min:101}
];

// ══════════════════════════════════════════════════
// RANK v3 (01/08/2026 — refonte Adrien) : le rank = PROGRESSION VERS LES OBJECTIFS DU 1ER JANVIER.
// - Par exo : p = (poids actuel − poids au début de la Saison Bulk) / (objectif − poids de début).
//   Inversé pour traction/dips (moins d'assistance = mieux). p=0 → Bronze III · p=1 → objectif atteint.
// - Par groupe : moyenne PONDÉRÉE par coefficients (5 principal ciblé · 3 bonus ciblé · 2 secondaire).
//   Seuls les exos refaits cette saison notent ; un exo jamais refait = Bronze III, hors calcul.
// - Échelle : 18 crans (6 tiers × 3 divisions) · 100 RP par division · 1800 RP = Champion I = TOUS les objectifs.
// - Global = moyenne des 6 groupes (groupe non activé = 0) → atteindre tous les poids cibles au
//   1er janvier 2027 = Champion partout, garanti par construction.
var RANK_COEF_GROUPS=[
  {label:'Pecs',exos:{dev_incline:5,chestpress_v:5,pecdeck:5,cable_fly:3,seated_dips:3,dips_assist:3}},
  // elev_lat_pull retiré (02/08, demande Adrien) : même mouvement que elev_lat → une seule entrée Épaules
  {label:'Épaules',exos:{elev_lat:5,face_pull:5,shoulder_press:3,dev_militaire:3,shrug_halt:3}},
  {label:'Triceps',exos:{triceps_corde:5,triceps_barre:3,seated_dips:3,dips_assist:3,chestpress_v:2,dev_incline:2}},
  {label:'Dos',exos:{tirage_vert:5,rowing_pb:5,rowing_appui:5,tirage_pulldown:3,traction_assist:3,rowing_uni:3,face_pull:2}},
  // Refonte PULL 15/08 : croisé + incliné neutre = principaux (5), marteau/corde = bonus (3)
  {label:'Biceps',exos:{curl_marteau_croise:5,curl_incline_neutre:5,curl_marteau:3,curl_corde:3,curl_halt:3,tirage_vert:2,rowing_pb:2}},
  {label:'Jambes',exos:{leg_press:5,leg_ext:5,leg_curl:5,mollets:3,hip_thrust:3,abduct:3,adduct:3}}
];
function weightAtDate(key,dateStr){
  var arr=DB.weights[key]||[]; var v=null;
  for(var i=0;i<arr.length;i++){ if(arr[i].date<=dateStr) v=arr[i].val; }
  if(v==null&&arr.length) v=arr[0].val;
  return v;
}
// ═══ GOALS v4 (14/08/2026, « repars à zéro ») : TOUT est ancré sur la SAISON EN COURS. ═══
// Un exo = un point de départ (son poids au début de saison, 27/07) + une cible au 1er janvier.
// Fini l'ancre de mars : la saison fait 22 semaines, le rythme attendu = le % de semaines
// écoulées, identique pour tous les exos — lisible et honnête.
// ── ANCRE OFFICIELLE de la Saison 1 : les poids RÉELS du 30/07/2026 (fichier retrouvé par
// Adrien le 14/08 — « état de la progression 30 juillet »). C'est LE point zéro de la saison :
// Bronze III / note 50 = ces poids-là, Champion / note 100 = l'objectif du 1er janvier.
// Les entrées de DB.weights autour du 27/07 étaient partiellement périmées (seeds d'avril) →
// les ancres sont gravées ici, plus jamais dérivées d'un historique flou.
// Exos absents du fichier (ajoutés début août) : ancre = leur 1re charge RÉELLE de la saison.
var START_S1={
  // PUSH (fichier 30/07)
  chestpress_v:50,dev_incline:18,pecdeck:44,elev_lat:8,triceps_corde:20,
  // PULL (fichier 30/07)
  tirage_vert:48,rowing_pb:44,rowing_uni:20,curl_halt:12,curl_marteau:10,curl_poulie:16,
  face_pull:20,traction_assist:30,
  // Bonus / autres (fichier 30/07)
  triceps_barre:18,dips_assist:30,
  // LEGS (fichier 30/07)
  leg_press:75,leg_ext:30,leg_curl:20,
  // Calibrés en début de saison (pas dans le fichier) — 1re charge réelle
  curl_corde:12,rowing_appui:35,shrug_halt:20,cable_fly:12,abduct:25,adduct:25,
  seated_dips:30,tirage_pulldown:50,shoulder_press:16,curl_incline:8,
  dev_militaire:14,curl_marteau_croise:10,curl_incline_neutre:8,mollets:40,hip_thrust:50,
  crunch_poulie:20,releve_chaise:10,pallof:10,hollow_hold:20,gainage:40,crunch:15,gripper:20,
  crunch_leste:5 // ajouté au programme le 22/08 — ancre = 1re charge réelle
};
// Poids au DÉBUT de la saison : ancre officielle START_S1 pour la Saison 1,
// sinon (saison 0 rétro / exo hors table) le 1er poids connu à la date de départ.
function exoSeasonStartWeight(key,season){
  season=season||rankCurrentSeason();
  if(season.id===1&&START_S1[key]!=null) return START_S1[key];
  return weightAtDate(key,season.start);
}
// Objectifs « champion » RÉTRO-CALCULÉS de la Saison 0 (mars → 26 juillet) : le rythme parfait-mais-humain
// d'un débutant de 21 ans en surplus depuis ses poids de la 1re séance de mars, vacances (3 sem.) comprises.
// → openSeasonModal(0) note la saison 0 contre CES cibles (ce qu'un sans-faute aurait donné).
var GOALS_S0={
  chestpress_v:52,dev_incline:18,pecdeck:52,elev_lat:8,triceps_corde:24,dips_assist:22,
  tirage_vert:50,rowing_pb:46,rowing_uni:22,curl_marteau:14,curl_halt:14,curl_poulie:14,curl_incline:10,face_pull:22,
  tirage_pulldown:54,traction_assist:25,shoulder_press:20,dev_militaire:17,triceps_barre:22,poulie_triceps_av:22, // dev_militaire converti en kg/côté haltères (14/08 : ×0,7)
  leg_press:90,leg_ext:52,leg_curl:38,mollets:52,hip_thrust:62
};
function seasonGoals(season){ return (season&&season.id===0)?GOALS_S0:GOALS_JAN; }
function goalProgress(key,season){
  season=season||rankCurrentSeason();
  var goals=seasonGoals(season);
  var goal=goals[key]; if(goal==null) return null;
  var over=season.end<todayStr();
  var cur=over?weightAtDate(key,season.end):getCurrentWeight(key); if(cur==null) return null;
  // v4 : le départ = le poids au DÉBUT DE LA SAISON (plus jamais le 1er poids de mars)
  var w0=exoSeasonStartWeight(key,season); if(w0==null) w0=cur;
  if(asIsInverse(key)){ if(w0<=goal) return 1; return Math.max(0,(w0-cur)/(w0-goal)); }
  if(w0>=goal) return 1;
  return Math.max(0,(cur-w0)/(goal-w0));
}
// ── NOTE /100 v4 (14/08, refonte Adrien : « 50 = vraiment en retard · 100 = objectif atteint ») ──
// La note d'un exo = où ton poids actuel se situe entre TON DÉPART DE SAISON et l'objectif du
// 1er janvier, remappé sur l'échelle 50 → 100 :
//   50  = encore à ton poids de départ (semaine 1 c'est normal, semaine 15 c'est un vrai retard)
//   100 = objectif du 1er janvier atteint
// Elle bouge UNIQUEMENT quand la référence bouge (hausse validée / recalage). Assistances
// (dips/tractions) : même logique, sur l'assistance qui descend (départ → cible).
// La MÉDAILLE raconte la même saison sur l'échelle Bronze → Champion. Les RP globaux et portes
// Champion suivent seasonWeightProgress (même ancre v4) — l'économie garde sa promesse.
function goalLevel(key,season){
  var p=goalProgress(key,season);
  if(p===null) return null;
  return Math.max(0,Math.min(1,0.5+0.5*p));
}
// Où il "devrait" en être aujourd'hui : % du temps de SAISON écoulé (27/07 → 1er janvier).
// Semaine 3/22 → ~14 % du chemin attendu — pareil pour tous les exos, simple à lire.
function goalPace(season){
  season=season||rankCurrentSeason();
  var t0=new Date(season.start+'T00:00:00'), t1=new Date(OBJECTIF_DATE+'T00:00:00');
  if(t1<=t0) return 1;
  return Math.max(0,Math.min(1,(getNow()-t0)/(t1-t0)));
}
// p (0..1) → cran 0-17 · tier · division · RP (100 par division, 1800 au total)
function ladderOf(p){
  var pc=Math.max(0,Math.min(1,p||0));
  var step=Math.min(17,Math.floor(pc*18));
  return {step:step,tier:RANK_TIERS[Math.floor(step/3)],div:['III','II','I'][step%3],rp:Math.round(pc*1800)};
}
// Exécutions COMPTÉES d'un exo dans une fenêtre [start..end]
function execsBetween(key,startDate,endDate){
  var info=findExoIndex(key); if(!info) return 0;
  return (DB.logs||[]).filter(function(l){
    if(!l.date||l.date<startDate||l.date>endDate) return false;
    if(l.live&&l.live.exos){
      var lx=null; l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      return lx?liveExoCounted(lx):false;
    }
    return (l.sessions||[]).some(function(sid){ return sid==='exo:'+key||(sid===info.sid&&exoMainForLog(info,key,l.date)); });
  }).length;
}
// Exo NOTÉ = pratiqué au moins une fois depuis le début du suivi (saison 0) ou ≥2 poids enregistrés
// (preuve de pratique). Les exos tout neufs jamais faits (seed unique) restent Bronze III « à faire ».
function rankExoActive(key,season){
  season=season||rankCurrentSeason();
  var over=season.end<todayStr();
  if(over){
    var upto=(DB.weights[key]||[]).filter(function(e){return e.date<=season.end;});
    if(upto.length>1) return true;
    return execsBetween(key,season.start,season.end)>0;
  }
  if((DB.weights[key]||[]).length>1) return true;
  if(execsSince(key,RANK_SEASONS[0].start)>0) return true;
  return !!DB.weightSetDate&&!!DB.weightSetDate[key]&&DB.weightSetDate[key]>=season.start;
}
// Note d'un exo = 85 pts de CHARGES (tout le chemin depuis le début, vers l'objectif de la saison)
// + 15 pts de RÉGULARITÉ **de la saison** (1er passage +5, puis +2, cap 15 ≈ 6 passages).
// → l'acquis des saisons passées reste, mais chaque saison il faut re-gagner ses 15 pts d'assiduité,
//   et Champion (≥83%) reste hors de portée sans se rapprocher des poids cibles de la saison.
function exoLadderScore(key,season){
  // v3 (06/08) : la note = le NIVEAU pur (plus de bonus de régularité). Un exo jamais
  // réellement exécuté depuis mars = « à faire », même si des poids ont été seedés.
  season=season||rankCurrentSeason();
  if(!getCurrentWeight(key)) return null;
  if(asExoNeverDone(key)) return null;
  return goalLevel(key,season);
}
// Un exo noté mais pas encore refait CETTE saison (pour le tag « à refaire » du détail)
function exoStaleThisSeason(key){ return rankExoActive(key)&&execsSince(key,rankCurrentSeason().start)===0; }
// État complet du ladder : 6 groupes (avec le détail par exo) + global.
// Sans argument = saison courante ; avec une saison close = rank final rétro-calculé
// (poids à la fin de la saison vs objectifs de CETTE saison — GOALS_S0 pour la saison 0).
function rankLadder(season){
  season=season||rankCurrentSeason();
  var over=season.end<todayStr();
  var pace=over?1:goalPace();
  var goals=seasonGoals(season);
  var groups=RANK_COEF_GROUPS.map(function(g){
    var rows=[],wSum=0,pSum=0,eSum=0,wpSum=0,ppSum=0;
    Object.keys(g.exos).forEach(function(k){
      var info=findExoIndex(k); if(!info) return;
      if(info.exo.hidden&&goals[k]==null) return; // masqué ET hors objectifs de la saison → ignoré
      if(!over&&info.exo.hidden) return;          // saison courante : les masqués n'apparaissent pas
      var coef=g.exos[k];
      var p=exoLadderScore(k,season); // NOTE /100 (v4 : 50 = départ de saison · 100 = objectif)
      // rythme attendu (v4) : le % de semaines de saison écoulées, sur la même échelle 50→100
      var exp=Math.min(1,0.5+0.5*pace);
      // MÉDAILLE : progression de saison (départ → objectif) — exos réellement pratiqués
      var prog=(p!==null&&rankExoActive(k,season))?goalProgress(k,season):null;
      var st=!over&&p!==null&&exoStaleThisSeason(k);
      rows.push({key:k,coef:coef,p:p,prog:prog,active:p!==null,stale:st,ahead:p!==null&&p>=exp});
      // les « à faire » (pas refaits cette saison) n'entrent ni dans la note du groupe ni dans le rythme
      if(p!==null&&!st){ wSum+=coef; pSum+=coef*Math.min(1,p); eSum+=coef*exp; }
      if(prog!==null){ wpSum+=coef; ppSum+=coef*Math.min(1,prog); }
    });
    rows.sort(function(a,b){return b.coef-a.coef||((b.p||0)-(a.p||0));});
    var p=wSum?pSum/wSum:null;
    var paceP=wSum?eSum/wSum:pace;
    var prog=wpSum?ppSum/wpSum:null;
    return {label:g.label,p:p,prog:prog,lad:ladderOf(prog||0),rows:rows,rated:prog!==null,ahead:p!==null&&p>=paceP,paceP:paceP};
  });
  var gp=groups.reduce(function(a,g){return a+(g.p||0);},0)/(groups.length||1);
  return {groups:groups,p:gp,lad:ladderOf(gp),pace:pace,ahead:gp>=pace};
}
var _rankGroupOf=null;
function rankGroupOf(key){
  if(!_rankGroupOf){
    _rankGroupOf={};
    RADAR_GROUPS.forEach(function(g){ g.keys.forEach(function(k){ _rankGroupOf[k]=g.label; }); });
  }
  return _rankGroupOf[key]||null;
}
function rankSeasonOf(dateStr){
  for(var i=0;i<RANK_SEASONS.length;i++){
    var s=RANK_SEASONS[i];
    if(dateStr>=s.start&&dateStr<=s.end) return s;
  }
  return null;
}
function rankCurrentSeason(){ return rankSeasonOf(todayStr())||RANK_SEASONS[RANK_SEASONS.length-1]; }
function rankInPause(dateStr){
  var ps=(DB.rank&&DB.rank.pauses)||[];
  return ps.some(function(p){ return dateStr>=p.start&&dateStr<=p.end; });
}
// ── MODE GEL ↔ COACH INTERNE (26/08, demande Adrien) ──
// Le gel ne protège plus seulement le rank (débranché) : il informe le coach.
//   · gelWeekGoal(ws)   : objectif de séances de la semaine RAMENÉ au prorata des jours non gelés
//                         (4/sem avec 3 jours gelés → 2 ; semaine entièrement gelée → 0, pas de note)
//   · gelRepriseCtx(d)  : la séance du jour d est-elle une REPRISE après ≥3 jours gelés depuis la
//                         dernière séance ? → {days, type, gap} gravé dans live.reprise, lu par le bilan
//                         de séance (note remise en contexte), le modal jour et l'analyse.
function gelPauseAt(dateStr){
  var ps=(DB.rank&&DB.rank.pauses)||[];
  for(var i=0;i<ps.length;i++){ if(ps[i].start<=dateStr&&dateStr<=ps[i].end) return ps[i]; }
  return null;
}
function gelDaysInWeek(ws){
  var n=0; for(var i=0;i<7;i++){ if(rankInPause(rankAddDays(ws,i))) n++; }
  return n;
}
// Règle Adrien (26/08 soir, simplifiée) : le gel est exceptionnel → rien ne change SAUF si la semaine
// compte ≥2 jours gelés : l'objectif de séances est alors plafonné à 3 (et le bilan hebdo le dit).
function gelWeekGoal(ws){
  var g=getWeekGoal(), f=gelDaysInWeek(ws);
  if(f<2) return g;
  return Math.min(g,3);
}
function gelRepriseCtx(dateStr){
  var last=null;
  (DB.logs||[]).forEach(function(l){ if(l.date&&l.date<dateStr&&(l.sessions||[]).length&&(!last||l.date>last)) last=l.date; });
  var from=last?rankAddDays(last,1):rankAddDays(dateStr,-60);
  var frozen=0,type=null,d;
  for(d=from; d<dateStr; d=rankAddDays(d,1)){ var p=gelPauseAt(d); if(p){ frozen++; type=p.type; } }
  if(frozen<=3) return null; // « plus de 3 jours » de gel (règle Adrien 26/08)
  var gap=Math.round((new Date(dateStr+'T12:00:00')-new Date((last||from)+'T12:00:00'))/86400000);
  return {days:frozen,type:type||'vacances',gap:gap};
}
function gelTypeLbl(t){ return t==='blessure'?'&#x1FA79; blessure':'&#x1F3D6; vacances'; }
function gelRepriseNote(rep){
  var n=rep.days;
  var base='&#x2744; <strong>S&#xE9;ance de reprise</strong> apr&#xE8;s '+n+' jours d\'arr&#xEA;t ('+gelTypeLbl(rep.type)+') &#x2014; une reprise est souvent un peu plus l&#xE9;g&#xE8;re, la note se lit avec indulgence&#x202F;: ';
  if(rep.type==='blessure') return base+'10 &#xE0; 20&#x202F;% sous tes charges sur la zone touch&#xE9;e, stop &#xE0; la moindre g&#xEA;ne. On juge la vraie forme dans 2 s&#xE9;ances.';
  return base+(n>=10?'&#x2212;5 &#xE0; &#x2212;10&#x202F;% de reps ou de charge est normal et revient en 1-2 s&#xE9;ances. ':'un l&#xE9;ger flottement sur les derni&#xE8;res reps est normal. ')
    +'Charges de ta derni&#xE8;re s&#xE9;ance, pas plus &#x2014; la vraie note se lit &#xE0; la prochaine.';
}
function gelWeekMsg(frozen,goal,type){
  return '&#x2744; '+frozen+' jours gel&#xE9;s cette semaine ('+gelTypeLbl(type)+') &#x2014; objectif ramen&#xE9; &#xE0; <strong>'+goal+' s&#xE9;ances</strong>.';
}
function gelWeekType(ws){
  for(var i=0;i<7;i++){ var p=gelPauseAt(rankAddDays(ws,i)); if(p) return p.type; }
  return 'vacances';
}
// Une entrée "salle" = séance s1/s2/s3 cochée OU exos à la carte (exo:) — sb/autre = activité, pas salle
function rankLogIsSalle(l){
  return (l.sessions||[]).some(function(sid){
    if(sid.indexOf('exo:')===0) return true;
    var s=DATA.find(function(x){return x.id===sid;});
    return !!(s&&s.t!=='bonus');
  });
}
// Dernière exécution COMPTÉE d'un exo avant une date (pour le bonus REFRESH)
function rankLastExecBefore(key,dateStr){
  var best=null;
  var info=findExoIndex(key);
  (DB.logs||[]).forEach(function(l){
    if(!l.date||l.date>=dateStr) return;
    var ok=false;
    if(l.live&&l.live.exos){
      var lx=null; l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      ok=lx?liveExoCounted(lx):false;
    } else if(info){
      ok=(l.sessions||[]).some(function(sid){ return sid==='exo:'+key||(sid===info.sid&&exoMainForLog(info,key,l.date)); });
    }
    if(ok&&(!best||l.date>best)) best=l.date;
  });
  return best;
}
// ── RP d'une séance (le cœur du barème) ──
// Retourne {total, byGroup:{label:rp}, events:[{ico,label,rp}], manual:bool}
function rankSeanceRP(l){
  var out={total:0,byGroup:{},events:[],manual:!l.live};
  function add(rp,group){ out.total+=rp; if(group){ out.byGroup[group]=(out.byGroup[group]||0)+rp; } }
  if(!l.live||!(l.live.exos||[]).length){
    var f=Math.round(logWeight(l)*RANK_ECO.manualSalle);
    if(f>0){ out.total=f; out.events.push({ico:'&#x1F4DD;',label:'Séance enregistrée (forfait hors mode direct)',rp:f}); }
    return out;
  }
  var exos=l.live.exos;
  var ctx=l.live.context||null; // contexte déclaré en fin de séance (temps/blessure/energie/malade)
  // Cardio déjà validé PLUS TÔT dans la même semaine (cap 2/sem sur le +100)
  var cardioBefore=0;
  try{
    var wsC=rankMonday(l.date), weC=rankAddDays(wsC,6);
    (DB.logs||[]).forEach(function(o){
      if(String(o.id)===String(l.id)||!o.live||!o.live.exos) return;
      if(o.date<wsC||o.date>weC) return;
      if(o.date>l.date||(o.date===l.date&&(o.time||'')>(l.time||''))) return;
      o.live.exos.forEach(function(x2){ if(exoIsCardio(x2.key)&&liveExoCounted(x2)) cardioBefore++; });
    });
  }catch(e){}
  var cardioUsed=0;
  var annexUsed=0, prCt=0, precCt=0, malus=0;
  var bestScore=-1, bestExo=null;
  var engagedCt=0;
  // ⚠️ Séance À LA CARTE (aucun exo principal) : les exos choisis SONT le programme du jour —
  // ils comptent tous comme principaux (fix 01/08 : le cap annexe écrasait ces séances à ~250 pts).
  var hasMain=exos.some(function(x){return !liveExoSide(x);});
  exos.forEach(function(x){
    var side=hasMain?liveExoSide(x):false, counted=liveExoCounted(x);
    var grp=rankGroupOf(x.key);
    var name=getExoName(x.key);
    var inv=asIsInverse(x.key);
    // Cardio (OTHERS) : forfait +100 pts, plafonné à 2/semaine — jamais de RP de séries ni de note
    if(exoIsCardio(x.key)){
      if(!counted) return;
      if(cardioBefore+cardioUsed>=RANK_ECO.cardioCap){ out.events.push({ico:'&#x1F3C3;',label:'Cardio (cap 2/sem atteint)',rp:0}); return; }
      cardioUsed++;
      add(RANK_ECO.cardioPts,null);
      out.events.push({ico:'&#x1F3C3;',label:'Cardio valid&#xE9; : '+name,rp:RANK_ECO.cardioPts});
      return;
    }
    if(side&&!counted) return;                       // annexe non complété : neutre absolu
    if(side&&counted){ if(annexUsed>=RANK_ECO.annexCap){ return; } annexUsed++; }
    if(!side&&!counted){                             // principal raté : micro-malus (compensé si contexte déclaré)
      var m=(x.sets&&x.sets.length)?RANK_ECO.dropMain:RANK_ECO.skipMain;
      if(ctx==='temps'||ctx==='blessure') m=0;       // séance écourtée justifiée : pas de malus
      else if(ctx==='energie'||ctx==='malade') m=Math.round(m/2);
      if(m){ malus+=m; out.events.push({ico:'&#x23ED;',label:name+' '+((x.sets&&x.sets.length)?'lâché tôt':'skippé'),rp:m}); }
      return;
    }
    engagedCt++;
    var n=x.n||3;
    (x.sets||[]).forEach(function(s,i){
      var pos=i+1, base;
      if(pos<=n) base=RANK_ECO.serie[Math.min(pos,4)-1];
      else if(pos===n+1) base=RANK_ECO.serieBonus;
      else base=RANK_ECO.serieBonusExtra;
      // Règle échec (setHardFail) : un échec sur/près de la cible est une série réussie, pas un malus.
      // Règle effort (setSoftFail, 02/08) : sur un PRINCIPAL, s'arrêter sous la cible sans aller
      // à l'échec (« dur » à 8/10) = effort non terminé → qLow. Les bonus gardent l'ancienne tolérance.
      var q;
      if(x.reps&&s.reps>=x.reps) q=RANK_ECO.qFull;                       // cible atteinte — échec compris (aller au bout = parfait)
      else if(x.reps&&s.feel==='echec'&&s.reps>=x.reps-setTol(x.reps)) q=RANK_ECO.qOk; // échec dans la tolérance de la cible = série normale
      else if(x.reps&&s.feel!=='echec'&&s.reps>=x.reps*0.8) q=(side?RANK_ECO.qOk:RANK_ECO.qLow);
      else q=RANK_ECO.qLow;
      // Prorata poids : une série plus légère que la référence rapporte moins (% pour %),
      // plus lourde rapporte plus. Inversé pour traction/dips (moins d'assistance = mieux).
      var ratio=1;
      if(/kg/.test(x.unite||'')&&x.w0>0){
        var sw=(s.w!=null?s.w:x.w);
        if(sw>0) ratio=inv?(x.w0/sw):(sw/x.w0);
        ratio=Math.max(RANK_ECO.wRatioMin,Math.min(RANK_ECO.wRatioMax,ratio));
        if(ctx==='blessure'&&ratio<1) ratio=1;       // blessure déclarée : alléger ne coûte rien
      }
      add(Math.round(base*q*ratio),grp);
      if(pos===n+1) out.events.push({ico:'&#x1F501;',label:'Série bonus sur '+name,rp:Math.round(base*q*ratio)});
    });
    // PR : poids monté en séance (assistance BAISSÉE pour les exos inversés)
    var pr=inv?(x.w<x.w0):(x.w>x.w0&&/kg/.test(x.unite||''));
    if(pr&&prCt<RANK_ECO.prCap){ prCt++; add(RANK_ECO.pr,grp); out.events.push({ico:'&#x1F3C6;',label:'PR appliqué : '+name+' → '+x.w+' '+x.unite,rp:RANK_ECO.pr}); }
    // PRÉCISION : dernière série « facile » = marge détectée
    var lastSet=(x.sets||[])[(x.sets||[]).length-1];
    if(lastSet&&lastSet.feel==='facile'&&precCt<RANK_ECO.precisionCap){ precCt++; add(RANK_ECO.precision,grp); }
    // REFRESH : exo gelé réactivé
    var prev=rankLastExecBefore(x.key,l.date);
    if(prev){
      var gap=Math.round((new Date(l.date)-new Date(prev))/86400000);
      if(gap>RANK_ECO.refreshGapDays){ add(RANK_ECO.refresh,grp); out.events.push({ico:'&#x267B;',label:name+' réactivé ('+gap+' j)',rp:RANK_ECO.refresh}); }
    }
    // MVP tracking
    var sc=asScoreExo(x);
    if(sc>bestScore){ bestScore=sc; bestExo={key:x.key,name:name,grp:grp}; }
  });
  if(engagedCt>=3&&bestExo){ add(RANK_ECO.mvp,bestExo.grp); out.events.push({ico:'&#x2B50;',label:'MVP : '+bestExo.name,rp:RANK_ECO.mvp}); }
  // Étirements de fin déclarés : petit bonus (posture — voir COACH.md)
  if(l.live.stretch){ add(15,null); out.events.push({ico:'&#x1F9D8;',label:'&#xC9;tirements de fin',rp:15}); }
  // CLEAN SWEEP : tous les principaux comptés avec toutes les séries prévues —
  // ET une exécution qui suit (note ≥ 12/20, règle 02/08) : le volume seul ne suffit plus
  var mains=exos.filter(function(x){return hasMain?!liveExoSide(x):true;});
  if(mains.length&&mains.every(function(x){return liveExoCounted(x)&&(x.sets||[]).length>=(x.n||3);})){
    var _cn=liveNotedExos(exos),_ct=0;
    _cn.forEach(function(x){_ct+=asScoreExoRaw(x);});
    var _cg=_cn.length?Math.round(_ct/_cn.length*4):0;
    if(_cg>=12){ add(RANK_ECO.cleanSweep,null); out.events.push({ico:'&#x1F9F9;',label:'CLEAN SWEEP',rp:RANK_ECO.cleanSweep}); }
  }
  out.total+=malus;
  if(out.total<RANK_ECO.floor){ out.total=RANK_ECO.floor; } // plancher séance validée
  return out;
}
// weekValue avec la règle « dimanche 20h » : une séance loggée un dimanche après 20h
// ne compte pas dans le check de SA semaine (elle garde ses RP de séance)
function rankWeekValue(logs){
  return weekValue(logs.filter(function(l){
    var d=new Date(l.date+'T00:00');
    if(d.getDay()!==0) return true;
    return !l.time||l.time<='20:00';
  }));
}
function _rankFmt(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function rankMonday(dateStr){
  var d=new Date(dateStr+'T00:00');
  var off=d.getDay()===0?6:d.getDay()-1;
  d.setDate(d.getDate()-off);
  return _rankFmt(d);
}
function rankAddDays(dateStr,n){
  var d=new Date(dateStr+'T00:00'); d.setDate(d.getDate()+n);
  return _rankFmt(d);
}
// ── Calcul complet d'une saison ──
// {total, seanceRP, weeklyRP, decayRP, byGroup, weeks[], seances, bestStreak, streak, thisWeekV, events[]}
function rankCompute(season){
  var today=todayStr();
  var res={season:season,total:0,seanceRP:0,weeklyRP:0,decayRP:0,byGroup:{},weeks:[],seances:0,bestStreak:0,streak:0,thisWeekV:0,events:[]};
  var logs=(DB.logs||[]).filter(function(l){return l.date>=season.start&&l.date<=season.end&&l.date<=today;})
    .sort(function(a,b){return a.date.localeCompare(b.date);});
  if(!logs.length) return res;
  // Les checks (hebdo + decay) démarrent à la 1re séance SALLE de la saison
  var firstSalle=null;
  logs.forEach(function(l){ if(!firstSalle&&rankLogIsSalle(l)) firstSalle=l.date; });
  // 1) RP de séances, plafonnés par jour
  var byDay={};
  logs.forEach(function(l){
    var r=rankSeanceRP(l);
    res.seances+=1;
    byDay[l.date]=byDay[l.date]||{rp:0,byGroup:{}};
    byDay[l.date].rp+=r.total;
    Object.keys(r.byGroup).forEach(function(g){ byDay[l.date].byGroup[g]=(byDay[l.date].byGroup[g]||0)+r.byGroup[g]; });
  });
  Object.keys(byDay).forEach(function(d){
    var day=byDay[d];
    var rp=Math.min(RANK_ECO.dayCap,day.rp);
    var scale=day.rp>0?rp/day.rp:1;
    res.seanceRP+=rp;
    Object.keys(day.byGroup).forEach(function(g){ res.byGroup[g]=(res.byGroup[g]||0)+Math.round(day.byGroup[g]*scale); });
  });
  if(!firstSalle){ res.total=res.seanceRP; return res; }
  // 2) Check hebdo + streak (semaines complètes uniquement, hors semaines 100% en pause)
  var wStart=rankMonday(firstSalle);
  var lastClosed=rankMonday(today); // la semaine courante (non close) est exclue…
  // …SAUF le dimanche dès 20h : la semaine se clôture ce soir-là (règle officielle du check hebdo,
  // alignée avec le bilan dominical — fix 02/08 : la semaine en cours manquait au popup saison)
  var _nowRC=getNow();
  if(_nowRC.getDay()===0&&_nowRC.getHours()>=20) lastClosed=rankAddDays(lastClosed,7);
  var seasonEndMonday=rankAddDays(rankMonday(season.end),7);
  var streak=0;
  for(var ws=wStart; ws<lastClosed&&ws<seasonEndMonday; ws=rankAddDays(ws,7)){
    var we=rankAddDays(ws,6);
    if(we>season.end) break;
    var wLogs=logs.filter(function(l){return l.date>=ws&&l.date<=we;});
    var pausedDays=0;
    for(var k=0;k<7;k++){ if(rankInPause(rankAddDays(ws,k))) pausedDays++; }
    if(pausedDays>=4){ res.weeks.push({start:ws,v:null,rp:0,paused:true}); continue; } // semaine en pause : ni malus ni streak break
    var v=rankWeekValue(wLogs);
    var rp=0;
    if(v>=4){
      streak++;
      rp=(v>=5?RANK_ECO.week5:RANK_ECO.week4)+RANK_ECO.streak[Math.min(streak,RANK_ECO.streak.length-1)];
    } else {
      streak=0;
      rp=v>=3?0:v>=2?RANK_ECO.week2:v>=1?RANK_ECO.week1:RANK_ECO.week0;
    }
    if(streak>res.bestStreak) res.bestStreak=streak;
    // Nutrition + cardio déclarés au bilan de semaine
    var nut=0, ans=(DB.rank&&DB.rank.weekly)?DB.rank.weekly[ws]:null;
    if(ans){
      nut=(ans.pdj||0)*RANK_ECO.pdjRP+((ans.pdj||0)>=7?RANK_ECO.pdjPerfect:0)
         +(ans.shaker||0)*RANK_ECO.shakerRP+((ans.shaker||0)>=6?RANK_ECO.shakerBonus:0);
      if((ans.cardio||0)>=1) nut+=RANK_ECO.cardioW1;
      if((ans.cardio||0)>=2) nut+=RANK_ECO.cardioW2;
    }
    // Étirements de la semaine (espace Détente, compté AUTO — 04/08) : +15/jour étiré, cap 4
    var stW=0;
    for(var k2=0;k2<7;k2++){ var dd2=rankAddDays(ws,k2); if(DB.dz&&DB.dz[dd2]&&DB.dz[dd2].stretch) stW++; }
    nut+=Math.min(stW,RANK_ECO.stretchCap)*RANK_ECO.stretchPts;
    res.weeklyRP+=rp+nut;
    res.weeks.push({start:ws,v:v,rp:rp,nut:nut,streak:streak});
  }
  res.streak=streak;
  // Semaine courante (info, pas encore checkée)
  var cwStart=rankMonday(today);
  res.thisWeekV=rankWeekValue(logs.filter(function(l){return l.date>=cwStart;}));
  // 3) Decay : jours off consécutifs.
  //  - salle ou séance maison → REMET le compteur à zéro
  //  - autre sport (foot...) ou pause déclarée → GÈLE le jour (ni reset, ni incrément)
  var resetDays={}, freezeDays={};
  logs.forEach(function(l){
    if(rankLogIsSalle(l)||(l.sessions||[]).indexOf('sb')>=0) resetDays[l.date]=true;
    else freezeDays[l.date]=true;
  });
  var decayEnd=today<season.end?today:season.end;
  var offRun=0;
  for(var d=firstSalle; d<=decayEnd; d=rankAddDays(d,1)){
    if(resetDays[d]){ offRun=0; continue; }
    if(freezeDays[d]||rankInPause(d)) continue; // jour gelé
    offRun++;
    if(offRun>RANK_ECO.offGrace){
      res.decayRP-=Math.min(RANK_ECO.offDayCap,Math.round(RANK_ECO.offBase*Math.pow(RANK_ECO.offMult,offRun-RANK_ECO.offGrace-1)));
    }
  }
  res.total=res.seanceRP+res.weeklyRP+res.decayRP;
  return res;
}
// ── Tiers & état global ──
function rankTierFor(score){
  var t=RANK_TIERS[0];
  RANK_TIERS.forEach(function(x){ if(score>=x.min) t=x; });
  return t;
}
function rankDivision(rpGroup){
  var dv=RANK_ECO.divisions;
  return rpGroup>=dv[2]?'I':rpGroup>=dv[1]?'II':'III';
}
// ══ RANK v4 (option A validée par Adrien) — LE RANK GLOBAL = MOTEUR D'EFFORT COMPLET ══
// Les 6 ranks de MUSCLES restent 100% progression de poids (= ton niveau, perso).
// Le rank GLOBAL cumule TOUT : chaque série/rep/qualité de séance, les checks hebdo (4=petit
// bonus, 5=gros bonus, streak=très gros et rare), la nutrition (objectifs 5 petits-déj · 3 shakers/sem),
// la progression des poids vers les cibles (25% du budget), moins les pénalités d'inactivité.
// Budget calibré : saison parfaite ≈ 1950 RP · Champion I = 1800 (≈92% du parfait) ·
// farmeur sans progression plafonne ~Diamant · progresseur sans assiduité plafonne ~Platine.
var LADDER_ECO={
  seanceDiv:65,        // pts d'activité de séance → RP ladder (séance parfaite ≈ 650 pts ≈ 10 RP)
  week4:5,week5:9,     // semaine validée à 4 (petit bonus) · à 5+ (gros bonus)
  streakCap:6,         // streak : +min(n-1,6) par semaine consécutive à ≥4 — long streak = très rare, très payant
  weekBad:-5,weekVeryBad:-10,weekBlank:-15, // semaine à 2 / à 1 / blanche
  pdjGoal:4,pdjPts:4,pdjPerfect:6,          // petits-déj = LA priorité : objectif ≥4 (+4), 7/7 (+6) — 04/08
  shakerGoal:2,shakerPts:2,shakerPerfect:3, // shakers : objectif ≥2 (+2), 6+ (+3) — 04/08
  cardioPts:1,cardioPts2:2,                 // cardio aligné sur le shaker : ≥1/sem (+1), 2/sem (+2) — 04/08
  stretchGoal:2,stretchLPts:1,stretchLPts2:2, // étirements : ≥2 jours (+1), ≥4 (+2) — 04/08
  decayDiv:65,         // pénalités d'inactivité (decay activité, ramené à l'échelle ladder)
  progBudget:500,      // part progression des poids (~28%) — au prorata pondéré par les coefs
  // Plafonds par source + PORTES CHAMPION : l'assiduité seule ne suffit jamais —
  // Champion (≥1500) exige ≥75% du chemin des charges, Champion I/II (≥1700) en exige ≥90%.
  seanceCap:950,weeklyCap:220,nutCap:190,
  champGateP:0.75,champGateHiP:0.9
};
// Progression de poids PURE (sans régularité) — moyenne des groupes, pondérée par coefs
function seasonWeightProgress(season){
  season=season||rankCurrentSeason();
  var goals=seasonGoals(season);
  var tot=0,cnt=0;
  RANK_COEF_GROUPS.forEach(function(g){
    var wS=0,pS=0;
    Object.keys(g.exos).forEach(function(k){
      if(goals[k]==null) return;
      var info=findExoIndex(k); if(!info) return;
      if(!rankExoActive(k,season)) return;
      var p=goalProgress(k,season); if(p===null) return;
      wS+=g.exos[k]; pS+=g.exos[k]*Math.min(1,p);
    });
    if(wS) tot+=pS/wS;
    cnt++;
  });
  return cnt?tot/cnt:0;
}
function rankGlobalLadder(season){
  season=season||rankCurrentSeason();
  var comp=null; try{ comp=rankCompute(season); }catch(e){}
  // 1) Séances — chaque série, chaque rep, la qualité, les événements (moteur d'activité)
  var seance=comp?comp.seanceRP/LADDER_ECO.seanceDiv:0;
  // 2) Hebdo + streaks (règles Adrien : 4 petit bonus · 5 gros · streak très gros)
  var weekly=0,streak=0;
  ((comp&&comp.weeks)||[]).forEach(function(w){
    if(w.paused||w.v===null) return;
    if(w.v>=4){ streak++; weekly+=(w.v>=5?LADDER_ECO.week5:LADDER_ECO.week4)+Math.min(streak-1,LADDER_ECO.streakCap); }
    else{ streak=0; weekly+=(w.v>=3?0:(w.v>=2?LADDER_ECO.weekBad:(w.v>=1?LADDER_ECO.weekVeryBad:LADDER_ECO.weekBlank))); }
  });
  // 3) Nutrition hebdo — déclaration du lundi prioritaire, sinon les coches de la semaine
  var nut=0;
  ((comp&&comp.weeks)||[]).forEach(function(w){
    var ans=(DB.rank&&DB.rank.weekly)?DB.rank.weekly[w.start]:null;
    var pdj=ans?(ans.pdj||0):nutWeekCount('petit_dej',w.start);
    var shk=ans?(ans.shaker||0):nutWeekCount('shaker',w.start);
    if(pdj>=7) nut+=LADDER_ECO.pdjPerfect; else if(pdj>=LADDER_ECO.pdjGoal) nut+=LADDER_ECO.pdjPts;
    if(shk>=6) nut+=LADDER_ECO.shakerPerfect; else if(shk>=LADDER_ECO.shakerGoal) nut+=LADDER_ECO.shakerPts;
    var crd=ans?(ans.cardio||0):Math.max(nutWeekCount('cardio',w.start),cardioWeekAuto(w.start));
    if(crd>=2) nut+=LADDER_ECO.cardioPts2; else if(crd>=1) nut+=LADDER_ECO.cardioPts;
    var stz=0;
    for(var k3=0;k3<7;k3++){ var dd3=rankAddDays(w.start,k3); if(DB.dz&&DB.dz[dd3]&&DB.dz[dd3].stretch) stz++; }
    if(stz>=4) nut+=LADDER_ECO.stretchLPts2; else if(stz>=LADDER_ECO.stretchGoal) nut+=LADDER_ECO.stretchLPts;
  });
  // 4) Progression des poids vers les cibles de la saison
  var pW=seasonWeightProgress(season);
  var prog=LADDER_ECO.progBudget*pW;
  // 5) Pénalités d'inactivité
  var pen=comp?comp.decayRP/LADDER_ECO.decayDiv:0;
  // Plafonds par source (voir LADDER_ECO) — les malus hebdo ne sont pas plafonnés, eux
  seance=Math.min(LADDER_ECO.seanceCap,seance);
  weekly=Math.min(LADDER_ECO.weeklyCap,weekly);
  nut=Math.min(LADDER_ECO.nutCap,nut);
  var total=Math.max(0,seance+weekly+nut+prog+pen);
  // Portes Champion : pas de tier Champion sans les charges (règle « champion = objectifs »)
  if(pW<LADDER_ECO.champGateP) total=Math.min(total,1499);
  else if(pW<LADDER_ECO.champGateHiP) total=Math.min(total,1699);
  var g=ladderOf(total/1800);
  g.rp=Math.min(1800,Math.round(total));
  g.parts={seance:Math.round(seance),weekly:Math.round(weekly),nut:Math.round(nut),prog:Math.round(prog),pen:Math.round(pen)};
  return g;
}
// État courant (v4) : groupes = niveau (poids) · global = effort complet.
function rankState(){
  var season=rankCurrentSeason();
  var lad=rankLadder();
  var glob=rankGlobalLadder(season);
  return {season:season,lad:lad,groups:lad.groups,glob:glob,globalTier:glob.tier,globalDiv:glob.div};
}
// ── UI RANK v2 (Bento Glass) : médaillon hexagonal, jauge de tier, popup de saison ──
function rankMedalHtml(tier,inner,size,withGlow){
  var w=size||46, h=Math.round(w*50/46);
  return '<div class="rk-hex" style="width:'+w+'px;height:'+h+'px;background:'+tier.grad+';color:'+tier.txt+';font-size:'+Math.round(w*0.33)+'px;'
    +(withGlow&&tier.glow?'filter:drop-shadow('+tier.glow+');':'')+'">'
    +(inner||'')+'</div>';
}
function renderBilanRank(){
  // Rank mis de côté (15/08, demande Adrien) — tout le moteur reste : repasser FEATURE_RANK à true
  if(!FEATURE_RANK){ var el0=document.getElementById('bilanRank'); if(el0) el0.innerHTML=''; return; }
  var el=document.getElementById('bilanRank'); if(!el) return;
  var st,comp=null;
  try{ st=rankState(); }catch(e){ console.warn('[MASSUP] rank:',e); el.innerHTML=''; return; }
  try{ comp=rankCompute(st.season); }catch(e){}
  var s=st.season, glob=st.glob, gt=glob.tier;
  var daysLeft=Math.max(0,Math.round((new Date(s.end)-new Date(todayStr()))/86400000));
  var goal=getWeekGoal();
  // Jauge : progression DANS la division en cours (100 RP par division)
  var pct=glob.step>=17?100:Math.round(glob.rp%100);
  // Division suivante (même tier → « Division II » ; changement de tier → « Or III »)
  var nextLbl='MAX';
  if(glob.step<17){
    var ns=glob.step+1, nt=RANK_TIERS[Math.floor(ns/3)], nd=['III','II','I'][ns%3];
    nextLbl=(nt===gt?'Division '+nd:nt.name+' '+nd);
  }
  var h='<div class="rk-card v3">'
    +'<div class="rk-head2">'
    +rankMedalHtml(gt,glob.div,58,true)
    +'<div class="rk-head2-mid">'
    +'<div class="rk-tier-name" style="color:'+gt.color+'">'+gt.name+' '+glob.div+'</div>'
    +'<div class="rk-season2">'+s.label+' &middot; '+daysLeft+' j restants</div>'
    +'</div>'
    +'<div class="rk-head2-rp"><span class="rk-rp-big">'+glob.rp.toLocaleString('fr-FR')+'</span><span class="rk-rp-unit">RP</span></div>'
    +'</div>'
    // Jauge : Division actuelle ——— Division suivante (pas de chiffres, juste la progression)
    +'<div class="rk-gauge-row"><span>Division '+glob.div+'</span><span>'+nextLbl+'</span></div>'
    +'<div class="rk-gauge"><div class="rk-gauge-fill" style="width:'+pct+'%;background:'+gt.grad+';'+(gt.glow?'box-shadow:'+gt.glow+';':'')+'"></div></div>'
    // (répartition des points + « cette semaine » retirés — retour Adrien 03/08 : la carte respire)
    // 6 groupes : hexagone + tier + division (pas encore activé = Bronze III grisé)
    +'<div class="rk-groups2 v3">';
  st.groups.forEach(function(g){
    h+='<div class="rk-group2'+(g.rated?'':' off')+(g.ahead&&g.rated?' ahead':'')+'">'
      +rankMedalHtml(g.lad.tier,g.lad.div,34,g.rated)
      +'<div class="rk-g2-txt"><span class="rk-g2-name">'+g.label+'</span>'
      +'<span class="rk-g2-tier" style="color:'+(g.rated?g.lad.tier.color:'var(--mut)')+'">'+g.lad.tier.name+' '+g.lad.div+(g.rated?'':' &#xB7; &#xE0; activer')+'</span></div>'
      +'</div>';
  });
  h+='</div>'
    // Saisons → POPUP au tap
    +'<div class="rk-seasons-row">';
  RANK_SEASONS.forEach(function(sn){
    if(sn.start>todayStr()) return;
    var cur=sn.id===s.id;
    h+='<button class="rk-season-btn'+(cur?' cur':'')+'" onclick="openSeasonModal('+sn.id+')">'+sn.label+(cur?' &middot; en cours':'')+' &#x203A;</button>';
  });
  h+='</div></div>';
  el.innerHTML=h;
}
// ── POPUP récap de saison : le rank atteint d'abord, les RP ensuite ──
// v2 (02/08 soir) : interface « sport dynamique » — héros XXL animé, grilles alignées,
// stats en tuiles Saira, semaines rejouables (▶) dès qu'elles sont closes / déclarables.
function openSeasonModal(id){
  var s=RANK_SEASONS.find(function(x){return x.id===id;}); if(!s) return;
  var over=s.end<todayStr();
  var cur=!over&&s.start<=todayStr();
  var c=rankCompute(s);
  var lad=rankLadder(s);
  var glob=rankGlobalLadder(s);
  var gt=glob.tier, gDiv=glob.div;
  var okW=c.weeks.filter(function(w){return w.v!==null&&w.v>=4;}).length;
  var badW=c.weeks.filter(function(w){return w.v!==null&&w.v<3;}).length;
  // Une semaine est REJOUABLE si close — ou déclarable dès le dimanche 20h (même règle que le widget)
  var _now=getNow();
  var _avail=rankMonday(todayStr());
  if(!(_now.getDay()===0&&_now.getHours()>=20)) _avail=rankAddDays(_avail,-7);
  var h='<div class="sn2-hdr">'
    +'<div><div class="sn2-season">'+s.label+'</div>'
    +'<div class="sn2-dates">'+formatDateFr(s.start)+' &rarr; '+formatDateFr(s.end)+(over?'':' &middot; <span style="color:var(--acc);font-weight:800">EN COURS</span>')+'</div></div>'
    +'<button class="modal-close" onclick="closeSeasonModal()">&#x2715;</button></div>';
  // ── Héros : médaillon XXL + tier + RP animé ──
  h+='<div class="sn2-hero">'
    +rankMedalHtml(gt,gDiv,96,true)
    +'<div class="sn2-tier" style="color:'+gt.color+'">'+gt.name+' <span>'+gDiv+'</span></div>'
    +'<div class="sn2-rp"><span data-cu="'+glob.rp+'">0</span><small>RP</small></div>'
    +'<div class="sn2-sub">'+(over?'Rank final &#x2014; not&#xE9; contre les objectifs de l\'&#xE9;poque':'Progression vers le 1er janvier')+'</div>'
    +'</div>';
  // ── 6 muscles ──
  h+='<div class="sn2-groups">';
  lad.groups.forEach(function(g){
    h+='<div class="sn2-group'+(g.rated?'':' off')+'">'+rankMedalHtml(g.lad.tier,g.lad.div,30)
      +'<span class="sn2-g-name">'+g.label+'</span>'
      +'<span class="sn2-g-div" style="color:'+g.lad.tier.color+'">'+g.lad.tier.name+' '+g.lad.div+'</span></div>';
  });
  h+='</div>';
  // ── Stats en tuiles ──
  h+='<div class="sn2-stats">'
    +'<div class="sn2-stat"><span data-cu="'+c.seances+'">0</span>s&#xE9;ances</div>'
    +'<div class="sn2-stat good"><span data-cu="'+okW+'">0</span>sem. &#x2265;4</div>'
    +'<div class="sn2-stat'+(badW?' bad':'')+'"><span data-cu="'+badW+'">0</span>rat&#xE9;e'+(badW>1?'s':'')+'</div>'
    +'<div class="sn2-stat fire"><span data-cu="'+c.bestStreak+'">0</span>&#x1F525; record</div>'
    +'</div>';
  // ── Sources de points en chips ──
  h+='<div class="sn2-src">'
    +'<span class="sn2-chip"><em>s&#xE9;ances</em><b style="color:var(--acc)">+'+c.seanceRP.toLocaleString('fr-FR')+'</b></span>'
    +'<span class="sn2-chip"><em>hebdo+nutrition</em><b style="color:'+(c.weeklyRP>=0?'var(--acc2)':'var(--red)')+'">'+(c.weeklyRP>=0?'+':'')+c.weeklyRP.toLocaleString('fr-FR')+'</b></span>'
    +'<span class="sn2-chip"><em>p&#xE9;nalit&#xE9;s</em><b style="color:'+(c.decayRP<0?'var(--red)':'var(--mut)')+'">'+c.decayRP.toLocaleString('fr-FR')+'</b></span>'
    +'</div>';
  // ── Podium des séances ──
  var logs=(DB.logs||[]).filter(function(l){return l.date>=s.start&&l.date<=s.end;});
  var scored=logs.map(function(l){ var t=0; try{ t=rankSeanceRP(l).total; }catch(e){} return {l:l,rp:t}; })
    .sort(function(a,b){return b.rp-a.rp;}).slice(0,3);
  if(scored.length&&scored[0].rp>0){
    h+='<div class="sn2-lbl">&#x1F3C6; Meilleures s&#xE9;ances</div><div class="sn2-podium">';
    scored.forEach(function(x,i){
      h+='<div class="sn2-prow"><span class="sn2-p-med">'+['&#x1F947;','&#x1F948;','&#x1F949;'][i]+'</span>'
        +'<span class="sn2-p-date">'+formatDateFr(x.l.date)+'</span>'
        +'<span class="sn2-p-rp">+'+Math.max(1,Math.round(x.rp/LADDER_ECO.seanceDiv))+' RP</span></div>';
    });
    h+='</div>';
  }
  // ── Semaine par semaine (grille alignée) — ▶ = revoir/faire le bilan ──
  if(c.weeks.length){
    h+='<div class="sn2-lbl">&#x1F4C6; Semaine par semaine <span class="sn2-lbl-hint">&#x25B6; = bilan de la semaine</span></div><div class="sn2-weeks">';
    c.weeks.slice().reverse().forEach(function(w){
      if(w.paused){
        h+='<div class="sn2-wrow paused"><span class="sn2-w-date">'+formatDateShort(w.start)+'</span><span class="sn2-w-se">&#x1F3D6; pause</span><span class="sn2-w-rp">&#x2014;</span><span class="sn2-w-btn"></span></div>';
        return;
      }
      var col=w.rp>0?'var(--acc)':w.rp<0?'var(--red)':'var(--mut)';
      var canReplay=(DB.rank&&DB.rank.weekly&&DB.rank.weekly[w.start])||(cur&&w.start<=_avail);
      h+='<div class="sn2-wrow">'
        +'<span class="sn2-w-date">'+formatDateShort(w.start)+'</span>'
        +'<span class="sn2-w-se">'+fmtSeances(w.v)+' s&#xE9;ance'+(w.v>1?'s':'')+(w.streak>=2?' &#x1F525;':'')+(w.nut?' <small style="color:var(--yellow)">&#x1F37D;</small>':'')+'</span>'
        +'<span class="sn2-w-rp" style="color:'+col+'">'+(w.rp>0?'+':'')+w.rp.toLocaleString('fr-FR')+'</span>'
        +'<span class="sn2-w-btn">'+(canReplay?'<button class="sn-replay" onclick="wrReplay(\''+w.start+'\')" title="Bilan de cette semaine">&#x25B6;</button>':'')+'</span>'
        +'</div>';
    });
    h+='</div>';
  }
  // ── Bilans du mois de la saison (rejouables) ──
  var months=[],mkSeen={};
  logs.forEach(function(l){
    if(!rankLogIsSalle(l)) return;
    var mk=l.date.slice(0,7);
    if(!mkSeen[mk]){ mkSeen[mk]=1; months.push(mk); }
  });
  var curMk=todayStr().slice(0,7);
  months=months.filter(function(mk){return mk<curMk;}).sort().reverse();
  if(months.length){
    h+='<div class="sn2-lbl">&#x1F5D3; Bilans du mois</div><div class="sn2-weeks">';
    months.forEach(function(mk){
      h+='<div class="sn2-wrow"><span class="sn2-w-date" style="grid-column:1/3;">'+mrMonthLabel(mk)+'</span>'
        +'<span class="sn2-w-rp"></span>'
        +'<span class="sn2-w-btn"><button class="sn-replay" onclick="mrReplay(\''+mk+'\')" title="Bilan de ce mois">&#x25B6;</button></span></div>';
    });
    h+='</div>';
  }
  var bodyEl=document.getElementById('seasonModalBody');
  bodyEl.innerHTML=h;
  document.getElementById('seasonModal').classList.add('open');
  animCountUpAll(bodyEl);
}
function closeSeasonModal(){ document.getElementById('seasonModal').classList.remove('open'); }

// ══════════════════════════════════════════════════
// BILAN DE LA SEMAINE — recap plein écran du lundi + déclaration nutrition
// (petits-déj = grosse importance, shakers = importance moyenne → RP au check hebdo)
// ══════════════════════════════════════════════════
var WR=null;
// La dernière semaine close (lundi→dimanche terminé) de la saison courante, non encore déclarée.
// Dès le DIMANCHE 20h (demande Adrien 02/08), la semaine qui se termine le soir même devient déclarable —
// aligné sur le check hebdo du rank (dimanche 20h).
function wrPendingWeek(){
  var season=rankCurrentSeason();
  var today=todayStr();
  if(today<season.start) return null;
  var lastMonday=rankMonday(today);
  var target=rankAddDays(lastMonday,-7); // la semaine précédente, close dimanche soir
  var _d=getNow();
  if(_d.getDay()===0&&_d.getHours()>=20) target=lastMonday; // dimanche 20h+ : la semaine en cours se déclare
  if(target<rankMonday(season.start)) return null;
  // il faut au moins une séance salle dans la saison avant/pendant cette semaine
  var hasSalle=(DB.logs||[]).some(function(l){return l.date>=season.start&&l.date<=rankAddDays(target,6)&&rankLogIsSalle(l);});
  if(!hasSalle) return null;
  var answered=DB.rank&&DB.rank.weekly&&DB.rank.weekly[target];
  return answered?null:target;
}
function renderWeeklyRecapWidget(){
  var el=document.getElementById('weeklyRecapWidget'); if(!el) return;
  var h='';
  var wk=wrPendingWeek();
  if(wk){
    h+='<button class="wr-widget" onclick="wrOpen(\''+wk+'\')">'
      +'<span class="wr-w-ico">&#x1F4CA;</span>'
      +'<span class="wr-w-txt"><strong>Ton bilan de la semaine est pr&#xEA;t</strong><br>'
      +'<small>Semaine du '+formatDateFr(wk)+' &#x2014; d&#xE9;clare tes petits-d&#xE9;j &amp; shakers, d&#xE9;couvre ton score</small></span>'
      +'<span class="wr-w-arr">&#x203A;</span></button>';
  }
  var mk=null;
  try{ mk=mrPendingMonth(); }catch(e){}
  if(mk){
    h+='<button class="wr-widget mr-widget" onclick="mrOpen(\''+mk+'\')">'
      +'<span class="wr-w-ico">&#x1F5D3;</span>'
      +'<span class="wr-w-txt"><strong>Ton bilan du mois est pr&#xEA;t</strong><br>'
      +'<small>'+mrMonthLabel(mk)+' &#x2014; charges, ex&#xE9;cution, records&#x202F;: tout ton mois en face</small></span>'
      +'<span class="wr-w-arr">&#x203A;</span></button>';
  }
  el.innerHTML=h;
}
// ── « Cette semaine » (sous la carte profil) : coche quotidienne petit-déj / shaker ──
// Alimente DB.nutrition[date].petit_dej / .shaker → préremplit le bilan du lundi (à confirmer).
// Compteur hebdo : on compte les 7 jours de la semaine (les coches sont déclaratives, un tap = +1)
function nutWeekCount(field,weekStart){
  var c=0;
  for(var i=0;i<7;i++){
    var e=DB.nutrition[rankAddDays(weekStart,i)];
    if(e&&e[field]) c++;
  }
  return c;
}
// Tap = +1 sur la semaine (stocké en remplissant les jours lun→dim) · après 7, retour à 0.
function nutTapWeek(field){
  var monday=rankMonday(todayStr());
  var next=(nutWeekCount(field,monday)+1)%8;
  for(var i=0;i<7;i++){
    var d=rankAddDays(monday,i);
    if(i<next){ ensureNutriDay(d)[field]=true; }
    else if(DB.nutrition[d]){ DB.nutrition[d][field]=false; pruneNutriDay(d); }
  }
  saveDB();
  renderBilanWeekNut();
}
// Cardios AUTO-détectés dans la semaine : exos cat cardio des LiveUps + séances manuelles
// marquées cardio (case « ça comptait cardio » sur course, foot, escalade... — 04/08)
function cardioWeekAuto(monday){
  var end=rankAddDays(monday,6), c=0;
  (DB.logs||[]).forEach(function(l){
    if(l.date<monday||l.date>end) return;
    if(l.cardio) c++;
    if(!l.live||!l.live.exos) return;
    l.live.exos.forEach(function(x){ if(exoIsCardio(x.key)&&liveExoCounted(x)) c++; });
  });
  return c;
}
function renderBilanWeekNut(){
  var el=document.getElementById('bilanWeekNut'); if(!el) return;
  var monday=rankMonday(todayStr());
  var o=nutObjectives(monday); // v2 (15/08) : pdj obj 5 · créatine obj 5 · cardio obj 3 (hors note)
  var pdj=nutWeekCount('petit_dej',monday), shk=nutWeekCount('shaker',monday);
  var crd=Math.max(nutWeekCount('cardio',monday),cardioWeekAuto(monday));
  el.innerHTML='<div class="wn-card">'
    +'<div class="wn-title">Cette semaine <span class="wn-hint">tape pour ajouter &#xB7; confirm&#xE9; au bilan du dimanche</span></div>'
    +'<div class="wn-row">'
    +'<button class="wn-tile'+(pdj>0?' on':'')+(pdj>=o.pdj?' full':'')+'" onclick="nutTapWeek(\'petit_dej\')">'
    +'<span class="wn-ico">&#x1F373;</span><span class="wn-count">'+pdj+'<small>/7</small></span><span class="wn-lbl">petits-d&#xE9;j &#xB7; obj. '+o.pdj+'</span></button>'
    +'<button class="wn-tile'+(shk>0?' on':'')+(shk>=o.shk?' full':'')+'" onclick="nutTapWeek(\'shaker\')">'
    +'<span class="wn-ico">'+o.shkIco+'</span><span class="wn-count">'+shk+'<small>/7</small></span><span class="wn-lbl">'+o.shkLbl+' &#xB7; obj. '+o.shk+'</span></button>'
    +'<button class="wn-tile'+(crd>0?' on':'')+(crd>=o.cardio?' full':'')+'" onclick="nutTapWeek(\'cardio\')">'
    +'<span class="wn-ico">&#x1F3C3;</span><span class="wn-count">'+crd+'<small>/'+o.cardio+'</small></span><span class="wn-lbl">cardio &#xB7; hors note</span></button>'
    +'</div></div>';
}
// ── NOTE /20 des bilans (15/08/2026, demande Adrien : « le bilan = juste une note /20 ») ──
// Barème transparent, même logique semaine et mois :
//   assiduité /8  = séances salle vs objectif hebdo
//   exécution /8  = moyenne des notes /20 des LiveUps (sans LiveUp noté : suit l'assiduité)
//   nutrition /4  = petits-déj (obj 4 → 2 pts) + shakers (obj 2 → 2 pts)
// ── Objectifs nutrition hebdo v2 (15/08 soir, demande Adrien) : petits-déj 5/sem · CRÉATINE
// 5 j/sem (remplace le suivi shakers — MÊME champ de stockage `shaker`, seul le label change) ·
// cardio 3/sem mais HORS note (il ne fait ni gagner ni perdre de points).
// Les semaines d'avant le 10/08 se relisent avec leurs objectifs de l'époque (4 pdj / 2 shakers).
var NUT_V2_START='2026-08-10';
function nutObjectives(ws){
  var v2=!ws||ws>=NUT_V2_START;
  return v2?{pdj:5,shk:5,shkLbl:'cr&#xE9;atine',shkIco:'&#x1F9EA;',cardio:3}
           :{pdj:4,shk:2,shkLbl:'shakers',shkIco:'&#x1F964;',cardio:2};
}
function bilanNoteWeek(ws){
  var we=rankAddDays(ws,6);
  var logs=(DB.logs||[]).filter(function(l){return l.date>=ws&&l.date<=we;});
  var salle=logs.filter(rankLogIsSalle);
  // ❄ Mode gel (26/08) : ≥2 jours gelés dans la semaine → objectif plafonné à 3 (gelWeekGoal). Rien d'autre.
  var goal=gelWeekGoal(ws);
  var vRatio=Math.min(1,salle.length/Math.max(1,goal));
  var notes=[];
  logs.forEach(function(l){
    var n20=liveLogNote20(l); // notes FIGÉES (15/08)
    if(n20!=null) notes.push(n20);
  });
  var avg=notes.length?notes.reduce(function(a,b){return a+b;},0)/notes.length:null;
  var ans=DB.rank&&DB.rank.weekly&&DB.rank.weekly[ws];
  var pdj=ans?(ans.pdj||0):nutWeekCount('petit_dej',ws);
  var shk=ans?(ans.shaker||0):nutWeekCount('shaker',ws);
  var o=nutObjectives(ws);
  // 29/09 (demande Adrien) : les PAS entrent dans la note (/3, moyenne ≥ 8 000) et la créatine pèse moins
  // (2 → 1 pt). Barème : assiduité /7 · exécution /7 · petit-déj /2 · créatine /1 · pas /3.
  // Semaine sans données de pas (< 4 jours) : calculée sur 17 pts puis ramenée sur 20 — zéro pénalité à l'aveugle.
  var pA=vRatio*7;
  var pE=(avg!=null?avg/20:vRatio)*7;
  var pN=Math.min(1,pdj/o.pdj)*2+Math.min(1,shk/o.shk)*1;
  var sw=typeof STEPS!=='undefined'?STEPS.week(ws):null, pP=typeof STEPS!=='undefined'?STEPS.weekPts(ws,3):null;
  var raw=pA+pE+pN+(pP!=null?pP:0);
  var note=Math.round((pP!=null?raw:raw*20/17)*2)/2;
  return {note:note,pA:Math.round(pA*10)/10,pE:Math.round(pE*10)/10,pN:Math.round(pN*10)/10,pP:pP,stepAvg:sw?sw.avg:null,
    salle:salle.length,goal:goal,avg:avg,pdj:pdj,shk:shk,declared:!!ans};
}
// Note du mois = moyenne des notes des semaines qui DÉMARRENT dans le mois (arrondi 0,5)
function bilanNoteMonth(mk){
  var mStart=mk+'-01', mEnd=mrMonthEnd(mk);
  var ws=rankMonday(mStart); if(ws<mStart) ws=rankAddDays(ws,7);
  var notes=[],salle=0;
  while(ws<=mEnd){
    var B=bilanNoteWeek(ws);
    notes.push(B.note); salle+=B.salle;
    ws=rankAddDays(ws,7);
  }
  if(!notes.length) return null;
  return {note:Math.round(notes.reduce(function(a,b){return a+b;},0)/notes.length*2)/2,
    weeks:notes.length,salle:salle};
}
// Section « Notes /20 » v2 (15/08 soir, retour Adrien « c'est boring ») : bandeau SAISON 2 ·
// PRISE DE MASSE, la semaine en cours en HÉROS coloré, les 2 précédentes + le dernier mois en
// lignes, et une flèche pour déplier les semaines plus anciennes en compact.
// Échelle couleurs (sa règle) : ≥18 gold · 14-17 bleu MASSUP · 11-13 vert · 8-10 orange · <8 rouge.
var _bnMore=false;
function bnToggleMore(){ _bnMore=!_bnMore; renderBilanNotes(); }
function renderBilanNotes(){
  var el=document.getElementById('bilanNotes'); if(!el) return;
  var today=todayStr();
  var curWs=rankMonday(today);
  var season=rankCurrentSeason();
  function noteHtml(n){ return '<span class="bn-note '+note20Cls(n)+'">'+String(n).replace('.',',')+'<small>/20</small></span>'; }
  function row(lbl,det,n,click,compact){
    return '<div class="bn-row'+(compact?' compact':'')+'" onclick="'+click+'">'
      +'<span class="bn-lbl">'+lbl+'</span><span class="bn-detail">'+det+'</span>'+noteHtml(n)+'</div>';
  }
  // ── Héros : la semaine en cours ──
  var B0=bilanNoteWeek(curWs);
  var c0=note20Cls(B0.note);
  var h='<div class="bn-card bn-v2">';
  h+='<div class="bn-season"><span class="bn-season-t">PRISE DE MASSE</span></div>';
  h+='<div class="bn-hero" onclick="wrOpen(\''+curWs+'\',true)">'
    +'<div class="bn-hero-note '+c0+'"><span class="bn-hero-v">'+String(B0.note).replace('.',',')+'</span><span class="bn-hero-sur">/20</span></div>'
    +'<div class="bn-hero-side"><span class="bn-hero-lbl">Cette semaine</span>'
    +'<span class="bn-hero-det">'+fmtSeances(B0.salle)+'/'+B0.goal+' s&#xE9;ances'+(B0.avg!=null?' &#xB7; ex&#xE9;c. '+String(Math.round(B0.avg*10)/10).replace('.',',')+'/20':'')+(B0.stepAvg!=null?' &#xB7; &#x1F45F; '+String(Math.round(B0.stepAvg/100)/10).replace('.',',')+'k':'')+'</span>'
    +'<span class="bn-hero-bar"><i class="'+c0+'" style="width:'+Math.max(4,Math.min(100,B0.note/20*100))+'%"></i></span></div>'
    +'<span class="bn-hero-arr">&#x203A;</span></div>';
  // ── Les 2 semaines précédentes ──
  for(var i=1;i<=2;i++){
    var ws=rankAddDays(curWs,-7*i);
    var B=bilanNoteWeek(ws);
    if(!B.salle) continue;
    h+=row('Sem. du '+formatDateShort(ws),fmtSeances(B.salle)+'/'+B.goal+' s&#xE9;ances'+(B.avg!=null?' &#xB7; ex&#xE9;c. '+String(Math.round(B.avg*10)/10).replace('.',',')+'/20':''),B.note,'wrOpen(\''+ws+'\',true)');
  }
  // ── Le dernier mois fermé ──
  var pm=new Date(parseInt(today.slice(0,4),10),parseInt(today.slice(5,7),10)-2,1);
  var pmk=pm.getFullYear()+'-'+String(pm.getMonth()+1).padStart(2,'0');
  var M=bilanNoteMonth(pmk);
  if(M&&M.salle){
    h+='<div class="bn-sep">Dernier mois</div>';
    h+=row(mrMonthLabel(pmk),M.salle+' s&#xE9;ances',M.note,'mrOpen(\''+pmk+'\',true)');
  }
  // ── Flèche : les semaines plus anciennes, en compact ──
  var older='';
  for(var j=3;j<=9;j++){
    var ws2=rankAddDays(curWs,-7*j);
    if(ws2<season.start) break;
    var B2=bilanNoteWeek(ws2);
    if(!B2.salle) continue;
    older+=row(formatDateShort(ws2),fmtSeances(B2.salle)+'/'+B2.goal,B2.note,'wrOpen(\''+ws2+'\',true)',true);
  }
  if(older){
    h+='<button class="bn-more" onclick="bnToggleMore()">'+(_bnMore?'&#x25BE; Masquer les anciennes semaines':'&#x25B8; Toutes les semaines de la saison')+'</button>';
    if(_bnMore) h+='<div class="bn-older">'+older+'</div>';
  }
  h+='</div>';
  el.innerHTML=h;
}
// v2 (02/08) : bilan en SLIDES animées qui te parlent — intro → séances → exécution → muscles →
// nutrition/poids (déclaration) → verdict (récap À LA FIN). Compteurs animés [data-cu].
function wrOpen(weekStart,replay){
  var prev=(DB.rank&&DB.rank.weekly&&DB.rank.weekly[weekStart])||null;
  // Préremplissage depuis les coches quotidiennes de la semaine concernée (à confirmer/corriger)
  var tp=nutWeekCount('petit_dej',weekStart), ts=nutWeekCount('shaker',weekStart);
  var tc=Math.max(nutWeekCount('cardio',weekStart),cardioWeekAuto(weekStart));
  WR={week:weekStart,we:rankAddDays(weekStart,6),idx:0,replay:!!replay,saved:!!prev,
      pdj:prev?prev.pdj:(tp>0?tp:null),shaker:prev?prev.shaker:(ts>0?ts:null),
      cardio:prev?(prev.cardio||0):tc,
      tracked:!prev&&(tp>0||ts>0)};
  try{ WR.A=wrAnalyze(weekStart); }catch(e){ WR.A=null; console.warn('[MASSUP] wrAnalyze:',e); }
  document.getElementById('wrOverlay').classList.add('open');
  document.body.style.overflow='hidden';
  wrRender();
}
function wrReplay(weekStart){ closeSeasonModal(); wrOpen(weekStart,true); }
function wrClose(){
  WR=null;
  document.getElementById('wrOverlay').classList.remove('open');
  document.body.style.overflow='';
  try{ renderSante(); }catch(e){}
}
function wrSetCount(field,v){ WR[field]=v; wrRender(); }
function wrSubmit(){
  if(WR.pdj===null||WR.shaker===null){ showToast('R&#xE9;ponds aux deux questions !'); return; }
  if(!DB.rank) DB.rank={pauses:[]};
  if(!DB.rank.weekly) DB.rank.weekly={};
  DB.rank.weekly[WR.week]={pdj:WR.pdj,shaker:WR.shaker,cardio:WR.cardio||0};
  saveDB();
  WR.saved=true;
  try{ WR.A=wrAnalyze(WR.week); }catch(e){}
  wrGoto(5);
}
var _wrDir='fwd';
function wrGoto(i){ _wrDir=i<WR.idx?'back':'fwd'; WR.idx=Math.max(0,Math.min(5,i)); wrRender(); }
function wrCountRow(field,label,hint){
  var h='<div class="as-lbl">'+label+' <span class="as-lbl-hint">'+hint+'</span></div><div class="wr-count-row">';
  for(var i=0;i<=7;i++){
    h+='<button class="wr-count-btn'+(WR[field]===i?' on':'')+'" onclick="wrSetCount(\''+field+'\','+i+')">'+i+'</button>';
  }
  return h+'</div>';
}
// Toute l'analyse de la semaine, calculée UNE fois à l'ouverture
function wrAnalyze(ws){
  var we=rankAddDays(ws,6);
  var seasonOf=rankSeasonOf(ws)||rankCurrentSeason();
  var comp=rankCompute(seasonOf);
  var w=comp.weeks.find(function(x){return x.start===ws;})||null;
  var logs=(DB.logs||[]).filter(function(l){return l.date>=ws&&l.date<=we;})
    .sort(function(a,b){return a.date.localeCompare(b.date)||((a.time||'').localeCompare(b.time||''));});
  var salle=logs.filter(rankLogIsSalle);
  var v=w?w.v:rankWeekValue(logs);
  var frozen=gelDaysInWeek(ws);      // ❄ jours gelés (26/08) → objectif au prorata, message dédié
  var goal=gelWeekGoal(ws);
  var seancePts=0;
  logs.forEach(function(l){ try{ seancePts+=rankSeanceRP(l).total; }catch(e){} });
  // Détail par séance : type dominant, note /20, pts
  var det=salle.map(function(l){
    var type=null;
    (l.sessions||[]).forEach(function(sid){
      if(type) return;
      if(sid.indexOf('exo:')===0){ var inf=findExoIndex(sid.slice(4)); if(inf) type=inf.seance.t; return; }
      if(sid.indexOf('autre:')===0||sid==='sb'){ type='maison'; return; }
      var sd=DATA.find(function(x){return x.id===sid;}); if(sd) type=sd.t;
    });
    var note=liveLogNote20(l); // note FIGÉE de la séance (15/08)
    var pts=0; try{ pts=rankSeanceRP(l).total; }catch(e){}
    return {date:l.date,type:type||'maison',note:note,pts:pts,live:!!l.live};
  });
  var best=null,worst=null;
  det.forEach(function(d){
    if(!best||d.pts>best.pts) best=d;
    if(d.note!==null&&(!worst||d.note<worst.note)) worst=d;
  });
  var notes=det.filter(function(d){return d.note!==null;}).map(function(d){return d.note;});
  var avgNote=notes.length?Math.round(notes.reduce(function(a,b){return a+b;},0)/notes.length*10)/10:null;
  // Erreurs récurrentes + points positifs (PR, séries bonus) sur les séances live
  var errs={},prs=[],bonusSeries=0,tonnage=0;
  // Jours étirés de la semaine : espace Détente (DB.dz) + legacy live.stretch — jours DISTINCTS
  var _stDays={};
  for(var _sd=0;_sd<7;_sd++){ var _dd=rankAddDays(ws,_sd); if(DB.dz&&DB.dz[_dd]&&DB.dz[_dd].stretch) _stDays[_dd]=true; }
  salle.forEach(function(l){ if(l.live&&l.live.stretch) _stDays[l.date]=true; });
  var stretchCt=Object.keys(_stDays).length;
  salle.forEach(function(l){
    if(!l.live) return;
    (l.live.exos||[]).forEach(function(x){
      var sets=x.sets||[],n=x.n||3;
      var sf=sets.slice(0,n).filter(function(s){return setSoftFail(s,x.reps);}).length;
      var hf=sets.slice(0,n).filter(function(s){return setHardFail(s,x.reps);}).length;
      if(sf||hf){
        if(!errs[x.key]) errs[x.key]={soft:0,hard:0};
        errs[x.key].soft+=sf; errs[x.key].hard+=hf;
      }
      if(sets.length>n) bonusSeries+=sets.length-n;
      if(/kg/.test(x.unite||'')&&!asIsInverse(x.key)) sets.forEach(function(s){ tonnage+=(s.w!=null?s.w:x.w||0)*s.reps; });
    });
    try{ rankSeanceRP(l).events.forEach(function(ev){ if(ev.label.indexOf('PR appliqu')>=0) prs.push(ev.label.replace('PR appliqué : ','')); }); }catch(e){}
  });
  // 16/08 soir (retour Adrien : « les erreurs ne m'aident pas ») : chaque erreur embarque la
  // cible de reps et la charge de référence → le message devient un PLAN chiffré, pas un constat.
  var topErrs=Object.keys(errs).map(function(k){
    var e=errs[k];
    var inf=findExoIndex(k);
    var reps=null; try{ if(inf) reps=asParseSerie(inf.exo).reps; }catch(e2){}
    var wNow=null; try{ wNow=weightAtDate(k,we); }catch(e3){}
    return {key:k,name:getExoName(k),soft:e.soft,hard:e.hard,tot:e.soft+e.hard,reps:reps,w:wNow};
  }).sort(function(a,b){return b.tot-a.tot;}).filter(function(e){return e.tot>=2;}).slice(0,3);
  // Volume par muscle + délaissés (<6 = à peine touché) + sous la fenêtre (<12)
  var vol=muscleVolume(ws,we);
  var neglected=RADAR_GROUPS.map(function(g){return g.label;}).filter(function(lb){return (vol[lb]||0)<6;});
  var underWin=RADAR_GROUPS.map(function(g){return g.label;}).filter(function(lb){var v0=vol[lb]||0;return v0>=6&&v0<12;});
  // Semaine précédente (comparaison)
  var pws=rankAddDays(ws,-7);
  var prevLogs=(DB.logs||[]).filter(function(l){return l.date>=pws&&l.date<ws;});
  var prevPts=0; prevLogs.forEach(function(l){ try{ prevPts+=rankSeanceRP(l).total; }catch(e){} });
  var prevV=rankWeekValue(prevLogs);
  // Poids de corps
  var bw=(DB.bodyWeight||[]).slice().sort(function(a,b){return a.date.localeCompare(b.date);});
  var bwEnd=null,bwPrev=null;
  bw.forEach(function(b){ if(b.date<=we) bwEnd=b; if(b.date<ws) bwPrev=b; });
  var bwDelta=(bwEnd&&bwPrev&&bwEnd.date>=ws)?Math.round((bwEnd.weight_kg-bwPrev.weight_kg)*10)/10:null;
  return {ws:ws,we:we,w:w,comp:comp,logs:logs,salle:salle,v:v,goal:goal,seancePts:seancePts,det:det,
    best:best,worst:worst,avgNote:avgNote,topErrs:topErrs,prs:prs,bonusSeries:bonusSeries,
    stretchCt:stretchCt,tonnage:Math.round(tonnage),vol:vol,neglected:neglected,underWin:underWin,
    prevPts:prevPts,prevV:prevV,bwDelta:bwDelta,bwEnd:bwEnd,frozen:frozen};
}
// Banque de messages du bilan hebdo (règles simples sur v / streak / nutrition / decay)
function wrMessages(w,comp,weekLogs,decayWeek){
  var msgs=[];
  var v=w?w.v:0;
  // ❄ Mode gel (26/08) : jours gelés → objectif au prorata ; semaine (quasi) entièrement gelée → aucun jugement d'assiduité
  var _fz=(WR&&WR.A&&WR.A.frozen)||0;
  if(_fz>=2) msgs.push(gelWeekMsg(_fz,(WR.A.goal!=null?WR.A.goal:getWeekGoal()),gelWeekType(WR.week)));
  if(_fz>=5){ /* semaine quasi entièrement gelée : le message gel suffit */ }
  else if(v>=5) msgs.push(asPick(['&#x1F451; CINQ s&#xE9;ances. Semaine l&#xE9;gendaire &#x2014; c\'est rare, savoure.','&#x1F451; 5 s&#xE9;ances&#x202F;: tu as sur-d&#xE9;livr&#xE9;. Attention quand m&#xEA;me &#xE0; la r&#xE9;cup&#xE9;ration.']));
  else if(v>=4) msgs.push(asPick(['&#x2705; Objectif 4/4 atteint &#x2014; c\'est exactement ce rythme qui construit la masse.','&#x2705; 4 s&#xE9;ances&#x202F;: le contrat est rempli, ni plus ni moins. Solide.']));
  else if(v>=3) msgs.push(asPick(['&#x1F44D; 3 s&#xE9;ances &#x2014; le minimum est assur&#xE9;. La 4e la semaine prochaine&#x202F;?','&#x1F44D; Minimum tenu (3). Pas de perte, pas de bonus&#x202F;: la cible reste 4.']));
  else if(v>=2) msgs.push(FEATURE_RANK
    ?asPick(['&#x26A0;&#xFE0F; 2 s&#xE9;ances &#x2014; semaine rat&#xE9;e c&#xF4;t&#xE9; rank (&#x2212;300). Une semaine, &#xE7;a se rattrape. Deux, &#xE7;a devient une habitude.','&#x26A0;&#xFE0F; Semaine &#xE0; 2&#x202F;: le muscle ne d&#xE9;sapprend pas en une semaine, mais le rank oui (&#x2212;300).'])
    :'&#x26A0;&#xFE0F; 2 s&#xE9;ances &#x2014; semaine rat&#xE9;e. Une semaine, &#xE7;a se rattrape. Deux, &#xE7;a devient une habitude.');
  else if(v>=1) msgs.push('&#x1F6A8; 1 seule s&#xE9;ance'+(FEATURE_RANK?' (&#x2212;600 RP)':'')+'. Qu\'est-ce qui a bloqu&#xE9;&#x202F;? Identifie LA cause et vire-la.');
  else msgs.push('&#x1F6A8; Semaine blanche'+(FEATURE_RANK?' (&#x2212;800 RP)':'')+'. Le plus dur c\'est de recommencer&#x202F;: programme ta prochaine s&#xE9;ance MAINTENANT.');
  if(w&&w.streak>=2) msgs.push('&#x1F525; Streak de '+w.streak+' semaines &#xE0; 4+'+(FEATURE_RANK?' &#x2014; bonus +'+RANK_ECO.streak[Math.min(w.streak,RANK_ECO.streak.length-1)]+' pts. Chaque semaine de plus paye plus.':' &#x2014; c\'est la r&#xE9;gularit&#xE9; qui construit, pas les coups d\'&#xE9;clat.'));
  // Nutrition (objectifs v2 depuis le 10/08 : pdj 5 · créatine 5)
  var _on=nutObjectives(WR.week);
  if(WR.pdj>=7) msgs.push('&#x1F31F; 7/7 petits-d&#xE9;j&#x202F;: LE levier n&#xB0;1 de ta prise de masse, verrouill&#xE9;.'+(FEATURE_RANK?' +'+(7*RANK_ECO.pdjRP+RANK_ECO.pdjPerfect)+' pts.':''));
  else if(WR.pdj>=_on.pdj) msgs.push('&#x1F373; '+WR.pdj+'/7 petits-d&#xE9;j &#x2014; objectif '+_on.pdj+' rempli. C\'est TA priorit&#xE9; nutrition&#x202F;: chaque jour de plus paie.');
  else if(WR.pdj>=_on.pdj-1) msgs.push('&#x1F373; '+WR.pdj+'/7 petits-d&#xE9;j &#x2014; &#xE0; un jour de l\'objectif de '+_on.pdj+'. Rappel&#x202F;: sauter le petit-d&#xE9;j = quasi impossible de manger assez sur la journ&#xE9;e.');
  else msgs.push('&#x1F6A8; '+WR.pdj+'/7 petits-d&#xE9;j &#x2014; c\'est LE maillon faible de ta semaine (objectif '+_on.pdj+' minimum). Pr&#xE9;pare-le la veille s\'il le faut.');
  if(_on.shk>=5){
    if(WR.shaker>=_on.shk) msgs.push('&#x1F9EA; '+WR.shaker+'/7 jours de cr&#xE9;atine &#x2014; objectif '+_on.shk+' rempli. Sa seule condition d\'efficacit&#xE9;, c\'est la constance&#x202F;: gagn&#xE9;.');
    else if(WR.shaker>=3) msgs.push('&#x1F9EA; '+WR.shaker+'/7 jours de cr&#xE9;atine (objectif '+_on.shk+') &#x2014; la cr&#xE9;atine ne marche que satur&#xE9;e&#x202F;: m&#xEA;me heure chaque jour, s&#xE9;ance ou pas.');
    else msgs.push('&#x1F6A8; '+WR.shaker+'/7 jours de cr&#xE9;atine seulement &#x2014; en dessous de 5, la saturation retombe et elle ne sert &#xE0; rien. Cale-la sur un rituel fixe (petit-d&#xE9;j).');
  } else {
    if(WR.shaker>=6) msgs.push('&#x1F964; '+WR.shaker+' shakers &#x2014; les prot&#xE9;ines suivent, impeccable.');
    else if(WR.shaker>=2) msgs.push('&#x1F964; '+WR.shaker+' shakers &#x2014; objectif 2 rempli, les prot&#xE9;ines de base sont l&#xE0;.');
    else msgs.push('&#x1F964; '+WR.shaker+' shaker'+(WR.shaker>1?'s':'')+' seulement (objectif 2) &#x2014; le moyen le moins cher de tenir tes prot&#xE9;ines. Cale-le apr&#xE8;s s&#xE9;ance.');
  }
  if(WR.A&&WR.A.stretchCt>=2) msgs.push('&#x1F9D8; '+WR.A.stretchCt+' jour'+(WR.A.stretchCt>1?'s':'')+' d\'&#xE9;tirements &#x2014;'+(FEATURE_RANK?' +'+(Math.min(WR.A.stretchCt,RANK_ECO.stretchCap)*RANK_ECO.stretchPts)+' pts.':'')+' ta posture se construit l&#xE0;.');
  if(FEATURE_RANK&&decayWeek<0) msgs.push('&#x1F4C9; '+Math.abs(decayWeek)+' pts perdus en p&#xE9;nalit&#xE9; cette semaine (jours off cons&#xE9;cutifs). Un jour de sport, m&#xEA;me l&#xE9;ger, g&#xE8;le le compteur.');
  // Meilleure séance de la semaine (aux points si rank actif — sinon elle est déjà donnée à la note en slide 1)
  if(FEATURE_RANK){
    var best=null,bestRp=0;
    weekLogs.forEach(function(l){ try{ var r=rankSeanceRP(l).total; if(r>bestRp){bestRp=r;best=l;} }catch(e){} });
    if(best&&bestRp>0) msgs.push('&#x1F3C6; Meilleure s&#xE9;ance&#x202F;: '+formatDateFr(best.date)+' (+'+bestRp.toLocaleString('fr-FR')+' pts).');
  }
  return msgs;
}
var WR_TYPE_ICO={push:'&#x1F4AA;',pull:'&#x1F3CB;',pull2:'&#x1F3CB;',legs:'&#x1F9B5;',maison:'&#x1F3E0;'};
// v3 (02/08 soir) : contenu CENTRÉ verticalement (wr-inner), chiffres XXL, entrées échelonnées
// (15/08 soir, retour Adrien : les bilans hebdo/mensuel restent COMPLETS — analyse, best séance,
// conseils. Seuls les RP/pts du rank sont débranchés via FEATURE_RANK ; le verdict = la note /20.)
function wrRender(){
  var body=document.getElementById('wrBody'); if(!body||!WR) return;
  var A=WR.A;
  var i=WR.idx;
  // Thème de célébration (16/08 soir, demande Adrien) : la slide d'ouverture et le verdict
  // prennent une ambiance GOLD (5 séances / note ≥18) ou BLEU MASSUP (objectif rempli / 14-17).
  // Toutes les animations sont ONE-SHOT (règle batterie iOS) — halo, pop, confettis : jamais de boucle.
  var theme='';
  if(!A){ wrClose(); return; }
  if(i===0) theme=A.v>=5?' wr-th-gold':A.v>=A.goal?' wr-th-blue':'';
  if(i===5&&!FEATURE_RANK){ try{ var _tn=bilanNoteWeek(WR.week).note; theme=_tn>=18?' wr-th-gold':_tn>=14?' wr-th-blue':''; }catch(e){} }
  var h='<div class="as-scroll wr-slide'+theme+'" style="padding-top:calc(1.2rem + env(safe-area-inset-top));"><div class="wr-inner">';
  var foot='';
  if(i===0){
    // ── Slide 0 : l'ouverture — le chiffre de la semaine en héros, célébré quand il le mérite ──
    var isGold=A.v>=5, isBlue=!isGold&&A.v>=A.goal;
    var hook=isGold?'Cinq s&#xE9;ances. Tu as sur-d&#xE9;livr&#xE9; &#x2014; savoure, et surveille la r&#xE9;cup.':
      isBlue?'Objectif rempli. C\'est exactement ce rythme qui construit.':
      A.v>=A.goal-1?'Il s\'en est fallu d\'une s&#xE9;ance. Viens voir.':
      A.v>=2?'Semaine l&#xE9;g&#xE8;re &#x2014; on va voir ce qui s\'est pass&#xE9;.':
      A.v>0?'Une seule s&#xE9;ance&#x2026; on en parle.':'Semaine blanche. On en parle, sans se mentir.';
    h+='<div class="wr-say">'+(WR.replay?'Retour sur cette semaine.':'Salut Adrien.')+'</div>';
    h+='<div class="wr-title-xl">Ta semaine</div>';
    h+='<div class="wr-sub">'+formatDateFr(WR.week)+' &rarr; '+formatDateFr(WR.we)+'</div>';
    h+='<div class="wr-hero-wrap">'
      +(theme?'<div class="wr-halo"></div>':'')
      +(isGold?'<div class="wr-confetti"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>':'')
      +'<div class="wr-hero-num"><span class="wr-hero-v" data-cu="'+A.v+'" data-cu-dec="'+(A.v%1?1:0)+'">0</span><span class="wr-hero-sur">/'+A.goal+' s&#xE9;ances</span></div>'
      +'</div>';
    if(isGold) h+='<div class="wr-badge gold">&#x1F451; Semaine l&#xE9;gendaire</div>';
    else if(isBlue) h+='<div class="wr-badge blue">&#x2705; Objectif rempli</div>';
    h+='<div class="wr-hook">'+hook+'</div>';
    // Chips utiles uniquement (16/08 soir : kg soulevés + séries bonus retirés — « aucun intérêt »)
    var chips=[];
    if(A.prs.length) chips.push('<div class="wr-chip n-gold">&#x1F3C6; '+A.prs.length+' PR cette semaine</div>');
    if(A.avgNote!==null) chips.push('<div class="wr-chip '+note20Cls(A.avgNote)+'">&#x1F4DD; '+String(A.avgNote).replace('.',',')+'/20 de moyenne</div>');
    if(A.stretchCt) chips.push('<div class="wr-chip n-green">&#x1F9D8; '+A.stretchCt+' jour'+(A.stretchCt>1?'s':'')+' &#xE9;tir&#xE9;'+(A.stretchCt>1?'s':'')+'</div>');
    else if(A.det.length) chips.push('<div class="wr-chip n-red">&#x1F9D8; 0 &#xE9;tirement</div>');
    if(chips.length) h+='<div class="wr-chips">'+chips.join('')+'</div>';
    foot='<button class="as-ghost-btn" onclick="wrClose()">Plus tard</button>'
      +'<button class="as-cta" onclick="wrGoto(1)">C\'est parti &#x203A;</button>';
  } else if(i===1){
    // ── Slide 1 : tes séances une par une ──
    h+='<div class="wr-say">Tes s&#xE9;ances, une par une.</div>';
    if(!A.det.length){
      h+='<div class="as-rep-note">Aucune s&#xE9;ance salle cette semaine. La reprise commence par UNE s&#xE9;ance programm&#xE9;e &#x2014; pas par de la motivation.</div>';
    } else {
      h+='<div class="wr-selist">';
      A.det.forEach(function(d){
        h+='<div class="wr-serow">'
          +'<span class="wr-se-ico">'+(WR_TYPE_ICO[d.type]||'&#x1F3CB;')+'</span>'
          +'<span class="wr-se-date">'+formatDateFr(d.date)+'</span>'
          +(d.note!==null?'<span class="wr-se-note '+note20Cls(d.note)+'">'+d.note+'/20</span>':'<span class="wr-se-note mut">manuel</span>')
          +(FEATURE_RANK?'<span class="wr-se-rp">+'+Math.max(1,Math.round(d.pts/LADDER_ECO.seanceDiv))+' RP</span>':'')
          +'</div>';
      });
      h+='</div>';
      // Meilleure séance : jugée aux POINTS si le rank est actif, sinon à la NOTE /20 (15/08)
      var bestN=null;
      A.det.forEach(function(d){ if(d.note!==null&&(!bestN||d.note>bestN.note)) bestN=d; });
      if(FEATURE_RANK&&A.best) h+='<div class="as-rep-note">&#x1F3C6; Ta plus grosse s&#xE9;ance&#x202F;: <strong>'+formatDateFr(A.best.date)+'</strong> (+'+A.best.pts.toLocaleString('fr-FR')+' pts). '+(A.best.note>=15?'Et en plus elle &#xE9;tait propre ('+A.best.note+'/20) &#x2014; la semaine parfaite ressemble &#xE0; &#xE7;a.':'')+'</div>';
      else if(bestN) h+='<div class="as-rep-note">&#x1F3C6; Ta meilleure s&#xE9;ance&#x202F;: <strong>'+formatDateFr(bestN.date)+'</strong> ('+bestN.note+'/20)'+(bestN.note>=18?' &#x2014; une s&#xE9;ance en or, la r&#xE9;f&#xE9;rence de ta semaine.':bestN.note>=14?' &#x2014; c\'est elle, ta r&#xE9;f&#xE9;rence de la semaine.':'.')+'</div>';
      if(FEATURE_RANK){
        var dPts=A.prevPts?Math.round((A.seancePts-A.prevPts)/A.prevPts*100):null;
        if(dPts!==null&&Math.abs(dPts)>=15) h+='<div class="as-rep-note">'+(dPts>0?'&#x1F4C8; <strong>+'+dPts+'%</strong> de points vs la semaine derni&#xE8;re ('+fmtSeances(A.prevV)+' s&#xE9;ance'+(A.prevV>1?'s':'')+') &#x2014; la trajectoire est bonne.':'&#x1F4C9; <strong>'+dPts+'%</strong> vs la semaine derni&#xE8;re &#x2014; une semaine plus l&#xE9;g&#xE8;re, &#xE7;a arrive. Deux d\'affil&#xE9;e, &#xE7;a s\'appelle une tendance.')+'</div>';
      } else if(A.prevV!==null&&A.prevV>0&&Math.abs(A.v-A.prevV)>=1){
        h+='<div class="as-rep-note">'+(A.v>A.prevV?'&#x1F4C8; '+fmtSeances(A.v)+' s&#xE9;ances contre '+fmtSeances(A.prevV)+' la semaine derni&#xE8;re &#x2014; la trajectoire est bonne.':'&#x1F4C9; '+fmtSeances(A.v)+' s&#xE9;ances contre '+fmtSeances(A.prevV)+' la semaine derni&#xE8;re &#x2014; une semaine plus l&#xE9;g&#xE8;re, &#xE7;a arrive. Deux d\'affil&#xE9;e, &#xE7;a s\'appelle une tendance.')+'</div>';
      }
    }
    foot='<button class="as-ghost-btn" onclick="wrGoto(0)">&#x2039;</button><button class="as-cta" onclick="wrGoto(2)">Suivant &#x203A;<span class="as-cta-sub">ton ex&#xE9;cution</span></button>';
  } else if(i===2){
    // ── Slide 2 : l'exécution — la qualité de ton travail ──
    h+='<div class="wr-say">Maintenant, COMMENT tu as travaill&#xE9;.</div>';
    if(A.avgNote!==null){
      h+='<div class="wr-hero-num small '+note20Cls(A.avgNote)+'"><span class="wr-hero-v" data-cu="'+A.avgNote+'" data-cu-dec="'+(A.avgNote%1?1:0)+'">0</span><span class="wr-hero-sur">/20 de moyenne</span></div>';
      h+='<div class="wr-hook">'+(A.avgNote>=15?'Ex&#xE9;cution de tr&#xE8;s haut niveau &#x2014; c\'est &#xE7;a qui fait monter les charges.':A.avgNote>=12?'Ex&#xE9;cution correcte. Les d&#xE9;tails ci-dessous valent des points.':'L\'ex&#xE9;cution a co&#xFB;t&#xE9; cher cette semaine &#x2014; regarde bien ce qui suit.')+'</div>';
    }
    // PR d'abord : la meilleure nouvelle de la semaine mérite une vitrine, pas une bulle (16/08 soir)
    if(A.prs.length){
      h+='<div class="wr-pr"><div class="wr-pr-title">&#x1F3C6; PR de la semaine</div>';
      A.prs.forEach(function(p){
        var parts=p.split(' → '); // format des events RP : « Nom → 56 kg »
        h+='<div class="wr-pr-row"><span>'+(parts[0]||p)+'</span><span class="wr-pr-w">'+(parts[1]?'&#x2197; '+parts[1]:'')+'</span></div>';
      });
      h+='<div class="wr-pr-sub">La surcharge progressive, c\'est EXACTEMENT &#xE7;a.</div></div>';
    }
    // Erreurs → PLAN chiffré par exo (16/08 soir : « les descriptions ne m'aident pas »)
    if(A.topErrs.length){
      h+='<div class="as-lbl">&#x1F3AF; &#xC0; corriger la semaine prochaine</div>';
      A.topErrs.forEach(function(e){
        var plan;
        if(e.soft>e.hard){
          plan=e.soft+' s&#xE9;rie'+(e.soft>1?'s':'')+' pos&#xE9;e'+(e.soft>1?'s':'')+' entre la cible et l\'&#xE9;chec. Le plan&#x202F;: '
            +(e.w?'&#xE0; <strong>'+e.w+' kg</strong>, ':'')+'chaque s&#xE9;rie se termine &#xE0; <strong>'+(e.reps||'la cible')+(e.reps?' reps':'')+'</strong> OU &#xE0; l\'&#xE9;chec r&#xE9;el &#x2014; jamais entre les deux. Si &#xE7;a cale encore 2 s&#xE9;ances &#x2192; un cran en dessous et tu remplis.';
        } else {
          plan=e.hard+' vrai'+(e.hard>1?'s':'')+' rat&#xE9;'+(e.hard>1?'s':'')+' (3+ reps sous la cible). Le plan&#x202F;: un cran sous '+(e.w?'<strong>'+e.w+' kg</strong>':'ta r&#xE9;f&#xE9;rence')+', tu remplis toutes les s&#xE9;ries &#xE0; <strong>'+(e.reps||'la cible')+(e.reps?' reps':'')+'</strong> proprement, et tu retestes seulement quand tout passe.';
        }
        h+='<div class="as-rep-note tone-warn"><strong>'+e.name+'</strong><br>'+plan+'</div>';
      });
    } else if(A.det.length){
      h+='<div class="as-rep-note tone-good">&#x2728; Aucune erreur r&#xE9;currente d&#xE9;tect&#xE9;e &#x2014; s&#xE9;ries men&#xE9;es au bout, charges respect&#xE9;es. Rare et pr&#xE9;cieux.</div>';
    }
    // Étirements : le zéro se voit en ROUGE (16/08 soir — « beaucoup plus dramatique »)
    if(A.det.length&&A.stretchCt===0){
      h+='<div class="wr-alert"><div class="wr-alert-title">&#x1F6A8; Z&#xC9;RO &#xE9;tirement cette semaine</div>'
        +'<div class="wr-alert-sub">Tes fl&#xE9;chisseurs de hanche tirent ton bassin vers l\'avant &#xE0; chaque jour sans &#xE9;tirement &#x2014; c\'est LE seul non-n&#xE9;gociable de ta posture. 10 min dans D&#xE9;tente &#x1F9D8;, d&#xE8;s ce soir.</div></div>';
    }
    else if(A.stretchCt>0) h+='<div class="as-rep-note tone-good">&#x1F9D8; '+A.stretchCt+' jour'+(A.stretchCt>1?'s':'')+' d\'&#xE9;tirements cette semaine'+(FEATURE_RANK?' (+'+(Math.min(A.stretchCt,RANK_ECO.stretchCap)*RANK_ECO.stretchPts)+' pts)':'')+' &#x2014; la posture se gagne l&#xE0;.</div>';
    foot='<button class="as-ghost-btn" onclick="wrGoto(1)">&#x2039;</button><button class="as-cta" onclick="wrGoto(3)">Suivant &#x203A;<span class="as-cta-sub">tes muscles</span></button>';
  } else if(i===3){
    // ── Slide 3 : muscle par muscle ──
    h+='<div class="wr-say">Muscle par muscle, qui a travaill&#xE9;&#x202F;?</div>';
    h+='<div class="wr-volwrap">'+muscleVolumeBarsHtml(A.vol,null,false)+'</div>';
    h+='<div class="mv-hint" style="display:block;margin-top:.4rem;">12+ s&#xE9;ries = &#xE7;a construit &#xB7; 17+ = zone gold &#xB7; au-del&#xE0; de 25 = trop</div>';
    if(A.det.length){
      var _gold=RADAR_GROUPS.map(function(g){return g.label;}).filter(function(lb){var v0=A.vol[lb]||0;return v0>=17&&v0<=25;});
      if(_gold.length) h+='<div class="as-rep-note tone-gold">&#x1F3C6; Zone gold&#x202F;: <strong>'+_gold.join(', ')+'</strong> &#x2014; le volume des semaines qui font grandir. &#xC0; tenir, pas &#xE0; d&#xE9;passer.</div>';
      if(A.neglected.length){
        h+='<div class="as-rep-note tone-warn">&#x1F4A4; D&#xE9;laiss&#xE9;'+(A.neglected.length>1?'s':'')+' cette semaine&#x202F;: <strong>'+A.neglected.join(', ')+'</strong>. Un seul bonus bien plac&#xE9; au prochain LiveUp r&#xE9;pare &#xE7;a &#x2014; le setup te montre ces barres en direct.</div>';
      }
      if(A.underWin.length){
        h+='<div class="as-rep-note">&#x1F50E; Sous la fen&#xEA;tre (6-11 s&#xE9;ries)&#x202F;: <strong>'+A.underWin.join(', ')+'</strong> &#x2014; touch&#xE9;s mais pas nourris. 1 bonus bien plac&#xE9; suffit &#xE0; passer les 12.</div>';
      }
      if(!A.neglected.length&&!A.underWin.length){
        h+='<div class="as-rep-note tone-good">&#x2696;&#xFE0F; Tous les muscles dans la fen&#xEA;tre &#x2014; r&#xE9;partition parfaite, z&#xE9;ro trou. Rare.</div>';
      }
    }
    foot='<button class="as-ghost-btn" onclick="wrGoto(2)">&#x2039;</button><button class="as-cta" onclick="wrGoto(4)">Suivant &#x203A;<span class="as-cta-sub">nutrition &amp; poids</span></button>';
  } else if(i===4){
    // ── Slide 4 : nutrition (déclaration) + poids de corps ──
    h+='<div class="wr-say">Le carburant, maintenant. Sois honn&#xEA;te.</div>';
    if(WR.tracked) h+='<div class="wr-tracked-hint">&#x2713; Pr&#xE9;-rempli avec tes coches de la semaine &#x2014; confirme ou corrige.</div>';
    var _o=nutObjectives(WR.week); // v2 (15/08) : pdj 5 · créatine 5 · cardio 3 hors note
    h+=wrCountRow('pdj','&#x1F373; Combien de petits-d&#xE9;jeuners ?','objectif '+_o.pdj+'+ &#x2014; LA priorit&#xE9; nutrition, le levier n&#xB0;1 de ta prise de masse');
    h+=wrCountRow('shaker',_o.shkIco+' Combien de jours de '+_o.shkLbl+' ?','objectif '+_o.shk+(_o.shk>=5?' &#x2014; la cr&#xE9;atine paie par la R&#xC9;GULARIT&#xC9;, pas par la dose':'+ &#x2014; tes prot&#xE9;ines les moins ch&#xE8;res'));
    h+=wrCountRow('cardio','&#x1F3C3; Combien de cardios ?','objectif '+_o.cardio+' &#x2014; hors note : ni gain ni perte, juste le suivi');
    if(A.bwDelta!==null){
      var rate=A.bwDelta;
      var rMsg=rate>0.55?'&#x26A0; Rythme au-dessus de la zone utile (0,25-0,4 kg/sem) &#x2014; si &#xE7;a se r&#xE9;p&#xE8;te 2-3 semaines, on enl&#xE8;ve ~200 kcal.':
        rate>=0.15?'&#x2705; Pile dans la zone de prise propre (0,25-0,4 kg/sem). Continue exactement pareil.':
        rate>=-0.2?'&#x1F50E; Poids stable &#x2014; en bulk, c\'est le signal de manger un peu PLUS.':
        '&#x1F6A8; Poids en baisse en pleine prise de masse &#x2014; l&#xE0; c\'est s&#xFB;r&#x202F;: tu ne manges pas assez.';
      h+='<div class="as-lbl" style="margin-top:1rem;">&#x2696;&#xFE0F; Ton poids</div>'
        +'<div class="wr-bw"><span class="wr-bw-v" data-cu="'+A.bwEnd.weight_kg+'" data-cu-dec="1">0</span><span class="wr-bw-u">kg</span>'
        +'<span class="wr-bw-d '+(rate>0.55?'warn':rate>=0.15?'ok':'warn')+'">'+(rate>0?'+':'')+String(rate).replace('.',',')+' kg cette semaine</span></div>'
        +'<div class="as-rep-note">'+rMsg+'</div>';
    }
    foot='<button class="as-ghost-btn" onclick="wrGoto(3)">&#x2039;</button>'
      +'<button class="as-cta" '+((WR.pdj===null||WR.shaker===null)?'disabled':'')+' onclick="wrSubmit()">Le verdict &#x203A;</button>';
  } else {
    // ── Slide 5 : LE RÉCAP — à la fin, comme il se doit ──
    // 15/08 : le verdict = LA NOTE /20 (couleurs de son échelle). L'ancien héros en points
    // et son breakdown restent dans le code, réactivables via FEATURE_RANK.
    var w=A.comp.weeks.find(function(x){return x.start===WR.week;})||A.w;
    h+='<div class="wr-say">Le verdict de ta semaine.</div>';
    if(FEATURE_RANK){
      var checkRP=w?w.rp:0, nutRP=w?w.nut:0;
      var totalWeek=A.seancePts+checkRP+nutRP;
      var col=totalWeek>=2000?'var(--acc)':totalWeek>=800?'var(--yellow)':'var(--red)';
      h+='<div class="wr-score" style="color:'+col+'"><span data-cu="'+totalWeek+'" data-cu-pre="'+(totalWeek>=0?'+':'')+'">0</span><small> pts &#x2248; +'+Math.max(0,Math.round(totalWeek/LADDER_ECO.seanceDiv))+' RP</small></div>';
      // Breakdown : chaque source SA ligne, propre (retour Adrien 03/08)
      var _pdjPts=(WR.pdj||0)*RANK_ECO.pdjRP+((WR.pdj||0)>=7?RANK_ECO.pdjPerfect:0);
      var _shkPts=(WR.shaker||0)*RANK_ECO.shakerRP+((WR.shaker||0)>=6?RANK_ECO.shakerBonus:0);
      var _crdPts=((WR.cardio||0)>=1?RANK_ECO.cardioW1:0)+((WR.cardio||0)>=2?RANK_ECO.cardioW2:0);
      var _stPts=Math.min(A.stretchCt||0,RANK_ECO.stretchCap)*RANK_ECO.stretchPts;
      h+='<div class="wr-breakdown">'
        +'<div class="wr-b-row"><span>&#x1F3CB; '+fmtSeances(A.v)+' s&#xE9;ance'+(A.v>1?'s':'')+'</span><span style="color:var(--acc)">+'+A.seancePts.toLocaleString('fr-FR')+'</span></div>'
        +'<div class="wr-b-row"><span>&#x1F4C5; Check hebdo'+(w&&w.streak>=2?' &#x1F525;'+w.streak:'')+'</span><span style="color:'+(checkRP>=0?'var(--acc)':'var(--red)')+'">'+(checkRP>=0?'+':'')+checkRP.toLocaleString('fr-FR')+'</span></div>'
        +'<div class="wr-b-row"><span>&#x1F373; '+WR.pdj+'/7 petits-d&#xE9;j</span><span style="color:var(--yellow)">+'+_pdjPts.toLocaleString('fr-FR')+'</span></div>'
        +'<div class="wr-b-row"><span>&#x1F964; '+WR.shaker+'/7</span><span style="color:var(--yellow)">+'+_shkPts.toLocaleString('fr-FR')+'</span></div>'
        +'<div class="wr-b-row"><span>&#x1F3C3; '+(WR.cardio||0)+' cardio</span><span style="color:var(--yellow)">+'+_crdPts.toLocaleString('fr-FR')+'</span></div>'
        +'<div class="wr-b-row"><span>&#x1F9D8; '+(A.stretchCt||0)+' jour'+((A.stretchCt||0)>1?'s':'')+' &#xE9;tir&#xE9;'+((A.stretchCt||0)>1?'s':'')+'</span><span style="color:var(--yellow)">+'+_stPts.toLocaleString('fr-FR')+'</span></div>'
        +'</div>';
    } else {
      var B=bilanNoteWeek(WR.week);
      var _ov=nutObjectives(WR.week);
      h+='<div class="wr-hero-wrap">'
        +(theme?'<div class="wr-halo"></div>':'')
        +(B.note>=18?'<div class="wr-confetti"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>':'')
        +'<div class="wr-note20 '+note20Cls(B.note)+'"><span class="wr-note20-v" data-cu="'+B.note+'"'+(B.note%1?' data-cu-dec="1"':'')+'>0</span><span class="wr-note20-sur">/20</span></div>'
        +'</div>';
      if(B.note>=18) h+='<div class="wr-badge gold">&#x1F451; Semaine en or</div>';
      else if(B.note>=14) h+='<div class="wr-badge blue">&#x1F4AA; Le standard MASSUP</div>';
      h+='<div class="wr-hook">'+(B.note>=18?'C\'est exactement &#xE7;a, une semaine de prise de masse r&#xE9;ussie.':B.note>=14?'Grosse semaine. On encha&#xEE;ne.':B.note>=11?'Semaine solide. La marche au-dessus se joue sur les d&#xE9;tails ci-dessous.':B.note>=8?'Semaine en retrait &#x2014; identifie LE maillon faible et corrige-le d&#xE8;s lundi.':'Semaine rat&#xE9;e. Pas de discours&#x202F;: une s&#xE9;ance programm&#xE9;e MAINTENANT et on repart.')+'</div>';
      h+='<div class="wr-breakdown">'
        +'<div class="wr-b-row"><span>&#x1F3CB; Assiduit&#xE9; &#x2014; '+fmtSeances(B.salle)+'/'+B.goal+' s&#xE9;ances</span><span style="color:var(--acc)">'+String(B.pA).replace('.',',')+' /7</span></div>'
        +'<div class="wr-b-row"><span>&#x1F4DD; Ex&#xE9;cution &#x2014; '+(B.avg!=null?'moy. '+String(Math.round(B.avg*10)/10).replace('.',',')+'/20':'pas de LiveUp')+'</span><span style="color:var(--acc2)">'+String(B.pE).replace('.',',')+' /7</span></div>'
        +'<div class="wr-b-row"><span>&#x1F373;'+_ov.shkIco+' Nutrition &#x2014; '+B.pdj+' pdj &#xB7; '+B.shk+' '+_ov.shkLbl+'</span><span style="color:var(--yellow)">'+String(B.pN).replace('.',',')+' /3</span></div>'
        +'<div class="wr-b-row"><span>&#x1F45F; Pas &#x2014; '+(B.stepAvg!=null?'moy. '+Math.round(B.stepAvg).toLocaleString('fr-FR')+' / 8 000':'pas renseign&#xE9;s')+'</span><span style="color:#3FD68A">'+(B.pP!=null?String(B.pP).replace('.',',')+' /3':'&#x2014; (ramen&#xE9;e sur 20)')+'</span></div>'
        +'</div>';
    }
    h+='<div class="wr-msgs">'+wrMessages(w,A.comp,A.logs,0).slice(0,3).map(function(m){return '<div class="as-rep-note">'+m+'</div>';}).join('')+'</div>';
    foot='<button class="as-ghost-btn" onclick="wrGoto(4)">&#x2039;</button><button class="as-cta" onclick="wrClose()">Terminer &#x1F389;</button>';
  }
  h+='</div></div>';
  h+=asSlideDots(6,i,'wrGoto');
  h+='<div class="as-foot">'+foot+'</div>';
  body.innerHTML=h;
  body.classList.remove('as-anim-fwd','as-anim-back');
  void body.offsetWidth;
  body.classList.add(_wrDir==='back'?'as-anim-back':'as-anim-fwd');
  _wrDir='fwd';
  animCountUpAll(body);
}

// ══════════════════════════════════════════════════
// BILAN DU MOIS (03/08) — tombe le 1er du mois, mêmes slides animées que le bilan hebdo.
// Rejouable depuis le popup saison. Rank : snapshots mensuels (DB.rank.ladderSnaps) pris
// à la 1re ouverture de l'app chaque mois → delta affiché dès que 2 mesures existent.
// ══════════════════════════════════════════════════
var MR=null;
var MR_MONTHS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
function mrMonthLabel(mk){
  var m=parseInt(mk.slice(5,7),10);
  return MR_MONTHS[m-1].charAt(0).toUpperCase()+MR_MONTHS[m-1].slice(1)+' '+mk.slice(0,4);
}
function mrMonthEnd(mk){
  var d=new Date(parseInt(mk.slice(0,4),10),parseInt(mk.slice(5,7),10),0);
  return _rankFmt(d);
}
// Snapshot du rank au 1er passage de chaque mois (base des deltas « as-tu évolué en rank ? »)
function mrSnapLadder(){
  try{
    if(!DB.rank) DB.rank={pauses:[]};
    if(!DB.rank.ladderSnaps) DB.rank.ladderSnaps={};
    var mk=todayStr().slice(0,7);
    if(DB.rank.ladderSnaps[mk]==null){
      DB.rank.ladderSnaps[mk]=rankGlobalLadder().rp;
      saveDB();
    }
  }catch(e){}
}
// Le mois précédent, s'il contient au moins une séance salle et n'a pas encore été vu
function mrPendingMonth(){
  var today=todayStr();
  var prevEnd=rankAddDays(today.slice(0,8)+'01',-1);
  var mk=prevEnd.slice(0,7);
  var mStart=mk+'-01';
  var has=(DB.logs||[]).some(function(l){return l.date>=mStart&&l.date<=prevEnd&&rankLogIsSalle(l);});
  if(!has) return null;
  var seen=DB.rank&&DB.rank.monthly&&DB.rank.monthly[mk];
  return seen?null:mk;
}
function mrAnalyze(mk){
  var mStart=mk+'-01', mEnd=mrMonthEnd(mk);
  var logs=(DB.logs||[]).filter(function(l){return l.date>=mStart&&l.date<=mEnd;})
    .sort(function(a,b){return a.date.localeCompare(b.date)||((a.time||'').localeCompare(b.time||''));});
  var salle=logs.filter(rankLogIsSalle);
  // Jours étirés du mois : espace Détente (DB.dz) + legacy live.stretch — jours distincts
  var _stD={};
  Object.keys(DB.dz||{}).forEach(function(d){ if(d>=mStart&&d<=mEnd&&DB.dz[d]&&DB.dz[d].stretch) _stD[d]=true; });
  logs.forEach(function(l){ if(l.live&&l.live.stretch) _stD[l.date]=true; });
  var stretchCt=Object.keys(_stD).length;
  var pts=0,malusPts=0,prs=[],tonnage=0;
  var bestSe=null,bestNote=null,bestTon=null;
  var errs={};
  logs.forEach(function(l){
    var r=null; try{ r=rankSeanceRP(l); }catch(e){ return; }
    pts+=r.total;
    r.events.forEach(function(ev){
      if(ev.rp<0) malusPts+=ev.rp;
      if(ev.label.indexOf('PR appliqu')>=0) prs.push({label:ev.label.replace('PR appliqué : ',''),date:l.date});
    });
    if(!bestSe||r.total>bestSe.pts) bestSe={date:l.date,pts:r.total};
    if(!l.live||!(l.live.exos||[]).length) return;
    var lt=0;
    l.live.exos.forEach(function(x){
      var sets=x.sets||[],n=x.n||3;
      if(/kg/.test(x.unite||'')&&!asIsInverse(x.key)) sets.forEach(function(s){ lt+=(s.w!=null?s.w:x.w||0)*s.reps; });
      if(exoIsCardio(x.key)) return;
      var sf=sets.slice(0,n).filter(function(s){return setSoftFail(s,x.reps);}).length;
      var hf=sets.slice(0,n).filter(function(s){return setHardFail(s,x.reps);}).length;
      if(sf||hf){ if(!errs[x.key]) errs[x.key]={soft:0,hard:0}; errs[x.key].soft+=sf; errs[x.key].hard+=hf; }
    });
    tonnage+=lt;
    if(!bestTon||lt>bestTon.kg) bestTon={date:l.date,kg:Math.round(lt)};
    var note=liveLogNote20(l); // note FIGÉE de la séance (15/08)
    if(note!=null){
      l._mrNote=note;
      if(!bestNote||note>bestNote.note) bestNote={date:l.date,note:note};
    }
  });
  var notes=logs.map(function(l){return l._mrNote;}).filter(function(n){return n!=null;});
  var avgNote=notes.length?Math.round(notes.reduce(function(a,b){return a+b;},0)/notes.length*10)/10:null;
  var topErrs=Object.keys(errs).map(function(k){var e=errs[k];return {name:getExoName(k),soft:e.soft,hard:e.hard,tot:e.soft+e.hard};})
    .sort(function(a,b){return b.tot-a.tot;}).filter(function(e){return e.tot>=3;}).slice(0,3);
  // Évolutions / régressions des charges sur le mois (dédupliqué, inversé traction/dips)
  var ups=[],downs=[],seenK={};
  DATA.forEach(function(s){ s.exos.forEach(function(e){
    if(e.hidden||seenK[e.key]||!/kg/.test(e.unite||'')) return;
    seenK[e.key]=1;
    var arr=DB.weights[e.key]; if(!arr||!arr.length) return;
    var before=weightAtDate(e.key,rankAddDays(mStart,-1));
    var after=weightAtDate(e.key,mEnd);
    if(before==null||after==null||before===after) return;
    var d=Math.round((after-before)*10)/10;
    var prog=asIsInverse(e.key)?-d:d;
    var item={name:e.name,from:before,to:after,d:d,unite:e.unite,inv:asIsInverse(e.key)};
    if(prog>0) ups.push(item); else downs.push(item);
  });});
  // Semaines du mois (checks, streak) — depuis rankCompute de la saison du mois
  var season=rankSeasonOf(mEnd)||rankSeasonOf(mStart)||rankCurrentSeason();
  var comp=null; try{ comp=rankCompute(season); }catch(e){}
  var weeks=((comp&&comp.weeks)||[]).filter(function(w){return w.start>=rankAddDays(mStart,-6)&&w.start<=mEnd&&!w.paused;});
  var okW=weeks.filter(function(w){return w.v>=4;}).length;
  var badW=weeks.filter(function(w){return w.v!==null&&w.v<3;}).length;
  var bestStreak=0; weeks.forEach(function(w){ if(w.streak>bestStreak) bestStreak=w.streak; });
  var checksPts=0; weeks.forEach(function(w){ checksPts+=w.rp+(w.nut||0); });
  // Nutrition totale du mois (déclarations hebdo, fallback coches)
  var pdj=0,shk=0,crd=0;
  weeks.forEach(function(w){
    var ans=DB.rank&&DB.rank.weekly&&DB.rank.weekly[w.start];
    pdj+=ans?(ans.pdj||0):nutWeekCount('petit_dej',w.start);
    shk+=ans?(ans.shaker||0):nutWeekCount('shaker',w.start);
    crd+=ans?(ans.cardio||0):Math.max(nutWeekCount('cardio',w.start),cardioWeekAuto(w.start));
  });
  // Poids de corps sur le mois
  var bw=(DB.bodyWeight||[]).slice().sort(function(a,b){return a.date.localeCompare(b.date);});
  var bwEnd=null,bwPrev=null;
  bw.forEach(function(b){ if(b.date<=mEnd) bwEnd=b; if(b.date<mStart) bwPrev=b; });
  var bwDelta=(bwEnd&&bwPrev&&bwEnd.date>=mStart)?Math.round((bwEnd.weight_kg-bwPrev.weight_kg)*10)/10:null;
  // Rank : delta de snapshots si 2 mesures encadrent le mois
  var snaps=(DB.rank&&DB.rank.ladderSnaps)||{};
  var nextMk=rankAddDays(mEnd,1).slice(0,7);
  var rankDelta=(snaps[mk]!=null&&snaps[nextMk]!=null)?snaps[nextMk]-snaps[mk]:null;
  return {mk:mk,mStart:mStart,mEnd:mEnd,logs:logs,salle:salle,pts:pts,rpTot:Math.round(pts/LADDER_ECO.seanceDiv),
    rpAvg:salle.length?Math.round(pts/salle.length/LADDER_ECO.seanceDiv):0,
    avgNote:avgNote,topErrs:topErrs,prs:prs,malusPts:malusPts,tonnage:Math.round(tonnage),
    ups:ups,downs:downs,okW:okW,badW:badW,bestStreak:bestStreak,checksPts:checksPts,
    pdj:pdj,shk:shk,crd:crd,bwDelta:bwDelta,bwEnd:bwEnd,rankDelta:rankDelta,stretchCt:stretchCt};
}
function mrOpen(mk,replay){
  MR={mk:mk,idx:0,replay:!!replay};
  try{ MR.A=mrAnalyze(mk); }catch(e){ MR.A=null; console.warn('[MASSUP] mrAnalyze:',e); }
  // 04/09 (retour Adrien : « j'ai appuyé sur la bulle mais elle part pas ») : avant, seen
  // n'était gravé qu'au « Terminer » de la 5e slide — sortir par « Plus tard » (ou un crash
  // d'analyse, qui rendait le tap muet) laissait la bulle à vie. Désormais OUVRIR = VU :
  // la bulle tombe au premier tap, la relecture reste dispo dans Saison › Bilans du mois.
  if(!replay){
    if(!DB.rank) DB.rank={pauses:[]};
    if(!DB.rank.monthly) DB.rank.monthly={};
    if(!DB.rank.monthly[mk]) DB.rank.monthly[mk]={seen:true};
    saveDB();
    try{ renderWeeklyRecapWidget(); }catch(e){}
  }
  if(!MR.A){ MR=null; showToast('&#x26A0; Bilan du mois indisponible (erreur d\'analyse) — dis-le &#xE0; Claude'); return; }
  document.getElementById('wrOverlay').classList.add('open');
  document.body.style.overflow='hidden';
  mrRender();
}
function mrReplay(mk){ closeSeasonModal(); mrOpen(mk,true); }
function mrClose(done){
  if(done){
    if(!DB.rank) DB.rank={pauses:[]};
    if(!DB.rank.monthly) DB.rank.monthly={};
    DB.rank.monthly[MR.mk]={seen:true};
    saveDB();
  }
  MR=null;
  document.getElementById('wrOverlay').classList.remove('open');
  document.body.style.overflow='';
  try{ renderSante(); }catch(e){}
}
var _mrDir='fwd';
function mrGoto(i){ _mrDir=i<MR.idx?'back':'fwd'; MR.idx=Math.max(0,Math.min(4,i)); mrRender(); }
// (15/08 soir : bilan du mois COMPLET conservé — RP/rank gérés par FEATURE_RANK, verdict = note /20.)
function mrRender(){
  var body=document.getElementById('wrBody'); if(!body||!MR||!MR.A) return;
  var A=MR.A, i=MR.idx;
  var h='<div class="as-scroll wr-slide" style="padding-top:calc(1.2rem + env(safe-area-inset-top));"><div class="wr-inner">';
  var foot='';
  if(i===0){
    h+='<div class="wr-say">'+(MR.replay?'Retour sur ce mois.':'Un mois vient de se fermer.')+'</div>';
    h+='<div class="wr-title-xl">'+mrMonthLabel(A.mk)+'</div>';
    h+='<div class="wr-hero-num"><span class="wr-hero-v" data-cu="'+A.salle.length+'">0</span><span class="wr-hero-sur">s&#xE9;ance'+(A.salle.length>1?'s':'')+'</span></div>';
    h+='<div class="wr-hook">'+(A.salle.length>=14?'Un mois de machine. Voyons ce que &#xE7;a a construit.':A.salle.length>=10?'Un vrai mois de travail. Voyons ce que &#xE7;a a construit.':A.salle.length>=6?'Un mois correct &#x2014; regardons o&#xF9; il t\'a emmen&#xE9;.':'Un mois l&#xE9;ger. Regardons quand m&#xEA;me ce qu\'il raconte.')+'</div>';
    h+='<div class="wr-mini-stats">'
      +(FEATURE_RANK?'<div class="wr-ms"><span data-cu="'+A.rpTot+'" data-cu-pre="+">0</span>RP gagn&#xE9;s</div>'
        +'<div class="wr-ms"><span data-cu="'+A.rpAvg+'" data-cu-pre="+">0</span>RP / s&#xE9;ance</div>'
        :'<div class="wr-ms"><span data-cu="'+A.prs.length+'">0</span>PR valid&#xE9;'+(A.prs.length>1?'s':'')+'</div>'
        +(A.avgNote!==null?'<div class="wr-ms"><span data-cu="'+A.avgNote+'"'+(A.avgNote%1?' data-cu-dec="1"':'')+'>0</span>/20 de moyenne</div>':''))
      +'<div class="wr-ms"><span data-cu="'+A.tonnage+'">0</span>kg soulev&#xE9;s</div>'
      +'</div>';
    // « Fermer » (ex-« Plus tard », 04/09) : le bilan est déjà marqué vu à l'ouverture —
    // il se relit à volonté dans Saison › Bilans du mois.
    foot='<button class="as-ghost-btn" onclick="mrClose(false)">Fermer<span style="display:block;font-size:.55rem;opacity:.7;">relisible dans Saison</span></button>'
      +'<button class="as-cta" onclick="mrGoto(1)">C\'est parti &#x203A;</button>';
  } else if(i===1){
    h+='<div class="wr-say">Tes charges &#x2014; le seul juge de paix.</div>';
    if(FEATURE_RANK&&A.rankDelta!==null){
      h+='<div class="wr-hero-num small"><span class="wr-hero-v" data-cu="'+Math.abs(A.rankDelta)+'" data-cu-pre="'+(A.rankDelta>=0?'+':'-')+'">0</span><span class="wr-hero-sur">RP de rank ce mois</span></div>';
    } else if(!FEATURE_RANK){
      h+='<div class="wr-hero-num small"><span class="wr-hero-v" data-cu="'+A.ups.length+'" data-cu-pre="+">0</span><span class="wr-hero-sur">hausse'+(A.ups.length>1?'s':'')+' de charge ce mois</span></div>';
    }
    if(A.ups.length){
      h+='<div class="as-lbl">&#x1F53C; Mont&#xE9;es du mois</div><div class="wr-selist">';
      A.ups.forEach(function(u){
        h+='<div class="wr-serow"><span class="wr-se-ico">'+(u.inv?'&#x1F513;':'&#x1F4C8;')+'</span><span class="wr-se-date">'+u.name+'</span><span class="wr-se-rp">'+u.from+' &#x2192; '+u.to+' '+u.unite+'</span></div>';
      });
      h+='</div>';
    } else {
      h+='<div class="as-rep-note">Aucune hausse de charge ce mois-ci &#x2014; &#xE7;a arrive (reprise, recalages), mais deux mois de suite comme &#xE7;a et on change quelque chose.</div>';
    }
    if(A.downs.length){
      h+='<div class="as-lbl">&#x1F53D; Recalages</div><div class="wr-selist">';
      A.downs.forEach(function(u){
        h+='<div class="wr-serow"><span class="wr-se-ico">&#x2696;&#xFE0F;</span><span class="wr-se-date">'+u.name+'</span><span class="wr-se-note mut">'+u.from+' &#x2192; '+u.to+' '+u.unite+'</span></div>';
      });
      h+='</div><div class="as-rep-note">Recaler un poids vers le bas n\'est pas une r&#xE9;gression&#x202F;: c\'est une calibration honn&#xEA;te. La r&#xE9;gression, c\'est de ne plus venir.</div>';
    }
    foot='<button class="as-ghost-btn" onclick="mrGoto(0)">&#x2039;</button><button class="as-cta" onclick="mrGoto(2)">Suivant &#x203A;<span class="as-cta-sub">ton ex&#xE9;cution</span></button>';
  } else if(i===2){
    h+='<div class="wr-say">Un mois d\'ex&#xE9;cution, en face.</div>';
    if(A.avgNote!==null){
      h+='<div class="wr-hero-num small"><span class="wr-hero-v" data-cu="'+A.avgNote+'" data-cu-dec="'+(A.avgNote%1?1:0)+'">0</span><span class="wr-hero-sur">/20 de moyenne sur le mois</span></div>';
      h+='<div class="wr-hook">'+(A.avgNote>=15?'Un mois propre. C\'est cette r&#xE9;gularit&#xE9;-l&#xE0; qui fait les physiques.':A.avgNote>=12?'Correct dans l\'ensemble &#x2014; les d&#xE9;tails ci-dessous sont ta marge gratuite.':'L\'ex&#xE9;cution a fui ce mois-ci. On resserre.')+'</div>';
    }
    if(A.prs.length) h+='<div class="as-rep-note">&#x1F3C6; <strong>'+A.prs.length+' PR</strong> valid&#xE9;'+(A.prs.length>1?'s':'')+' en s&#xE9;ance ce mois&#x202F;: '+A.prs.slice(0,4).map(function(p){return p.label;}).join(' &middot; ')+'.</div>';
    if(A.topErrs.length){
      h+='<div class="as-lbl">&#x1F6A9; Tes patterns du mois</div>';
      A.topErrs.forEach(function(e){
        h+='<div class="as-rep-note tone-down"><strong>'+e.name+'</strong> &#x2014; '+(e.soft>e.hard?e.soft+' s&#xE9;ries arr&#xEA;t&#xE9;es sous la cible sans &#xE9;chec sur le mois. C\'est LE r&#xE9;flexe &#xE0; casser&#x202F;: cible ou &#xE9;chec.':e.hard+' vrais rat&#xE9;s sur le mois &#x2014; charge chroniquement trop haute, un cran en dessous et on remplit.')+'</div>';
      });
    } else if(A.salle.length){
      h+='<div class="as-rep-note">&#x2728; Aucun pattern d\'erreur r&#xE9;current sur le mois. S&#xE9;rieux et rare.</div>';
    }
    if(FEATURE_RANK&&A.malusPts<0) h+='<div class="as-rep-note">&#x1F4C9; '+Math.abs(A.malusPts)+' pts perdus en malus (exos principaux l&#xE2;ch&#xE9;s/saut&#xE9;s) &#x2014; &#xE0; volume &#xE9;gal, c\'est du RP gratuit qui s\'&#xE9;vapore.</div>';
    foot='<button class="as-ghost-btn" onclick="mrGoto(1)">&#x2039;</button><button class="as-cta" onclick="mrGoto(3)">Suivant &#x203A;<span class="as-cta-sub">r&#xE9;gularit&#xE9; &amp; carburant</span></button>';
  } else if(i===3){
    h+='<div class="wr-say">La r&#xE9;gularit&#xE9; et le carburant.</div>';
    h+='<div class="wr-mini-stats">'
      +'<div class="wr-ms"><span data-cu="'+A.okW+'">0</span>sem. &#x2265;4</div>'
      +'<div class="wr-ms"><span data-cu="'+A.badW+'">0</span>rat&#xE9;e'+(A.badW>1?'s':'')+'</div>'
      +'<div class="wr-ms"><span data-cu="'+A.bestStreak+'">0</span>&#x1F525; streak</div>'
      +'</div>';
    var _om=nutObjectives(A.mEnd); // labels de l'époque du mois (créatine depuis le 10/08)
    h+='<div class="wr-mini-stats" style="margin-top:.6rem;">'
      +'<div class="wr-ms"><span data-cu="'+A.pdj+'">0</span>&#x1F373; petits-d&#xE9;j</div>'
      +'<div class="wr-ms"><span data-cu="'+A.shk+'">0</span>'+_om.shkIco+' '+_om.shkLbl+'</div>'
      +'<div class="wr-ms"><span data-cu="'+A.crd+'">0</span>&#x1F3C3; cardio</div>'
      +'<div class="wr-ms"><span data-cu="'+(A.stretchCt||0)+'">0</span>&#x1F9D8; &#xE9;tirements</div>'
      +'</div>';
    if(A.bwDelta!==null){
      h+='<div class="as-lbl" style="margin-top:1rem;">&#x2696;&#xFE0F; Ton poids sur le mois</div>'
        +'<div class="wr-bw"><span class="wr-bw-v" data-cu="'+A.bwEnd.weight_kg+'" data-cu-dec="1">0</span><span class="wr-bw-u">kg</span>'
        +'<span class="wr-bw-d '+(A.bwDelta>2.2?'warn':A.bwDelta>=0.6?'ok':'warn')+'">'+(A.bwDelta>0?'+':'')+String(A.bwDelta).replace('.',',')+' kg ce mois</span></div>'
        +'<div class="as-rep-note">'+(A.bwDelta>2.2?'&#x26A0; Plus de 2 kg sur un mois&#x202F;: une partie part en gras. Vise 1 &#xE0; 1,7 kg/mois &#x2014; l&#xE8;ve un peu le pied sur le surplus.':A.bwDelta>=0.6?'&#x2705; Rythme de prise propre (1-1,7 kg/mois = la zone). Continue pareil.':'&#x1F50E; Prise trop lente pour un bulk &#x2014; il manque des calories quelque part (petits-d&#xE9;j&#x202F;?).')+'</div>';
    }
    foot='<button class="as-ghost-btn" onclick="mrGoto(2)">&#x2039;</button><button class="as-cta" onclick="mrGoto(4)">Le verdict &#x203A;</button>';
  } else {
    // 15/08 : le verdict du mois = LA NOTE /20 (moyenne des semaines) — le héros en points
    // et son breakdown restent dans le code, réactivables via FEATURE_RANK.
    h+='<div class="wr-say">Le verdict de '+mrMonthLabel(A.mk)+'.</div>';
    if(FEATURE_RANK){
      h+='<div class="wr-score" style="color:var(--acc)"><span data-cu="'+A.pts+'" data-cu-pre="+">0</span><small> pts &#x2248; +'+A.rpTot+' RP</small></div>';
      h+='<div class="wr-breakdown">'
        +'<div class="wr-b-row"><span>&#x1F3CB; '+A.salle.length+' s&#xE9;ances</span><span style="color:var(--acc)">+'+A.pts.toLocaleString('fr-FR')+'</span></div>'
        +'<div class="wr-b-row"><span>&#x1F4C5; Checks hebdo du mois</span><span style="color:'+(A.checksPts>=0?'var(--acc)':'var(--red)')+'">'+(A.checksPts>=0?'+':'')+A.checksPts.toLocaleString('fr-FR')+'</span></div>'
        +(A.rankDelta!==null?'<div class="wr-b-row"><span>&#x1F3C5; Rank</span><span style="color:'+(A.rankDelta>=0?'var(--acc2)':'var(--red)')+'">'+(A.rankDelta>=0?'+':'')+A.rankDelta+' RP</span></div>':'')
        +'</div>';
    } else {
      var M=bilanNoteMonth(A.mk);
      if(M){
        h+='<div class="wr-note20 '+note20Cls(M.note)+'"><span class="wr-note20-v" data-cu="'+M.note+'"'+(M.note%1?' data-cu-dec="1"':'')+'>0</span><span class="wr-note20-sur">/20</span></div>';
        h+='<div class="wr-hook">'+(M.note>=18?'Mois en OR &#x2014; encadre-le, et refais pareil.':M.note>=14?'Gros mois. La prise de masse se construit exactement comme &#xE7;a.':M.note>=11?'Mois solide &#x2014; la marche au-dessus est &#xE0; port&#xE9;e.':M.note>=8?'Mois en retrait &#x2014; UNE priorit&#xE9; pour le prochain, pas cinq.':'Mois &#xE0; oublier. On repart sur une semaine simple&#x202F;: '+getWeekGoal()+' s&#xE9;ances, point.')+'</div>';
        h+='<div class="as-rep-note" style="text-align:center;">Moyenne des '+M.weeks+' semaines du mois (assiduit&#xE9; 8 &#xB7; ex&#xE9;cution 8 &#xB7; nutrition 4).</div>';
      }
    }
    h+='<div class="as-lbl">&#x1F3C6; Records du mois</div><div class="wr-selist">';
    if(A.logs.length){
      var bs=null,bn=null;
      A.logs.forEach(function(l){
        if(FEATURE_RANK){ var r=null; try{ r=rankSeanceRP(l); }catch(e){ return; } if(!bs||r.total>bs.pts) bs={date:l.date,pts:r.total}; }
        if(l._mrNote!=null&&(!bn||l._mrNote>bn.note)) bn={date:l.date,note:l._mrNote};
      });
      if(bs) h+='<div class="wr-serow"><span class="wr-se-ico">&#x1F947;</span><span class="wr-se-date">Meilleure s&#xE9;ance &middot; '+formatDateFr(bs.date)+'</span><span class="wr-se-rp">+'+Math.max(1,Math.round(bs.pts/LADDER_ECO.seanceDiv))+' RP</span></div>';
      if(bn) h+='<div class="wr-serow"><span class="wr-se-ico">'+(bs?'&#x1F4DD;':'&#x1F947;')+'</span><span class="wr-se-date">Meilleure s&#xE9;ance &middot; '+formatDateFr(bn.date)+'</span><span class="wr-se-note '+note20Cls(bn.note)+'">'+bn.note+'/20</span></div>';
      if(A.prs.length) h+='<div class="wr-serow"><span class="wr-se-ico">&#x1F4C8;</span><span class="wr-se-date">'+A.prs.length+' hausse'+(A.prs.length>1?'s':'')+' valid&#xE9;e'+(A.prs.length>1?'s':'')+' en s&#xE9;ance</span><span class="wr-se-rp">'+A.prs.slice(0,2).map(function(p){return p.label;}).join(' &middot; ')+'</span></div>';
      if(A.tonnage>0) h+='<div class="wr-serow"><span class="wr-se-ico">&#x1F3CB;</span><span class="wr-se-date">Tonnage du mois</span><span class="wr-se-rp">'+A.tonnage.toLocaleString('fr-FR')+' kg</span></div>';
    }
    h+='</div>';
    foot='<button class="as-ghost-btn" onclick="mrGoto(3)">&#x2039;</button><button class="as-cta" onclick="mrClose(true)">Terminer &#x1F389;</button>';
  }
  h+='</div></div>';
  h+=asSlideDots(5,i,'mrGoto');
  h+='<div class="as-foot">'+foot+'</div>';
  body.innerHTML=h;
  body.classList.remove('as-anim-fwd','as-anim-back');
  void body.offsetWidth;
  body.classList.add(_mrDir==='back'?'as-anim-back':'as-anim-fwd');
  _mrDir='fwd';
  animCountUpAll(body);
}

// ── Mode gel (bloc autonome sous le calendrier, Progression) : vacances/blessure déclarées →
// decay + checks gelés. Pas de liste : les jours ❄ se voient sur le calendrier et se dégèlent
// depuis le modal jour (bouton « Dégeler cette période »). ──
function renderRankPauses(){ /* plus de liste (retour Adrien 01/08) — conservé pour compat des anciens appels */ }
function addRankPause(){
  var t=document.getElementById('rpType'), s=document.getElementById('rpStart'), e=document.getElementById('rpEnd');
  if(!s.value||!e.value||e.value<s.value){ showToast('&#x26A0; Dates de gel invalides'); return; }
  if(!DB.rank) DB.rank={pauses:[]};
  if(!DB.rank.pauses) DB.rank.pauses=[];
  DB.rank.pauses.push({type:t?t.value:'vacances',start:s.value,end:e.value});
  DB.rank.pauses.sort(function(a,b){return a.start.localeCompare(b.start);});
  saveDB();
  s.value=''; e.value='';
  try{ renderCal(); }catch(err){} // rafraîchit le calendrier (jours ❄)
  showToast('&#x2744; P&#xE9;riode gel&#xE9;e &#x2014; rank prot&#xE9;g&#xE9; sur ces dates');
}
// Dégel depuis le modal jour : retire la période qui couvre cette date
function delRankPauseByDate(dateStr){
  var ps=(DB.rank&&DB.rank.pauses)||[];
  var idx=-1;
  for(var i=0;i<ps.length;i++){ if(ps[i].start<=dateStr&&dateStr<=ps[i].end){ idx=i; break; } }
  if(idx<0) return;
  var p=ps[idx];
  if(!confirm('Dégeler la période du '+formatDateFr(p.start)+' au '+formatDateFr(p.end)+' ?')) return;
  ps.splice(idx,1);
  saveDB();
  closeDayModal();
  try{ renderCal(); }catch(err){}
  showToast('P&#xE9;riode d&#xE9;gel&#xE9;e');
}

// Contexte « reprise après gel » de la séance en cours : gravé dans le log (live.reprise)
// dès l'enregistrement, recalculé en secours si le log n'est pas encore persisté.
function asRepriseCtx(){
  if(!AS) return null;
  if(AS.savedLogId){
    var lg=(DB.logs||[]).find(function(l){return String(l.id)===String(AS.savedLogId);});
    if(lg&&lg.live) return lg.live.reprise||null;
  }
  return gelRepriseCtx(todayStr());
}

// ══════════════════════════════════════════════════
// NOUS DEUX 💞 (26/08/2026) — adaptateur ADRIEN pour partner.js
// Mode observation strict : je pousse un RÉSUMÉ lecture seule de mes jours
// (séances + note, étirements, pdj/créatine/cardio, gel) dans MA ligne
// partner_state ; je LIS celui de Melati. Aucune écriture croisée, jamais.
// ══════════════════════════════════════════════════
var PV_MF={facile:'Facile',ok:'Correct',dur:'Dur',trop:'Trop difficile'};
// Les libellés d'app.js sont écrits en entités HTML (&#xE9;…) : le snapshot part en TEXTE brut
// (l'autre côté échappe tout à l'affichage — sinon « &#x1F525; PUSH » s'affiche tel quel)
function pvDecode(s){
  return String(s==null?'':s).replace(/<[^>]*>/g,'')
    .replace(/&#x([0-9a-fA-F]+);/g,function(_,h){ return String.fromCodePoint(parseInt(h,16)); })
    .replace(/&#(\d+);/g,function(_,d){ return String.fromCodePoint(parseInt(d,10)); })
    .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").trim();
}
function pvLogType(l){
  var t=null;
  (l.sessions||[]).forEach(function(sid){
    if(t) return;
    if(sid==='sb'||sid.indexOf('autre:')===0){ t='maison'; return; }
    if(sid.indexOf('exo:')===0){ var inf=findExoIndex(sid.slice(4)); if(inf) t=inf.seance.t; return; }
    var sd=DATA.find(function(x){return x.id===sid;}); if(sd) t=sd.t;
  });
  if(t==='pull2') t='pull';
  if(t==='bonus'||!t) t='maison';
  return t;
}
function pvSnapshot(){
  var t=todayStr(), from=rankAddDays(t,-63), days={};
  function D(d){ return days[d]||(days[d]={}); }
  (DB.logs||[]).forEach(function(l){
    if(!l.date||l.date<from||l.date>t) return;
    // Titre court : les SÉANCES seulement (les exos à la carte sont listés dessous) — texte décodé (pas d'entités HTML)
    var names=[];
    (l.sessions||[]).forEach(function(sid){
      if(sid.indexOf('exo:')===0) return;
      if(sid.indexOf('autre:')===0){ names.push(sid.slice(6)); return; }
      var sd=DATA.find(function(x){return x.id===sid;}); if(sd) names.push(pvDecode(sd.name));
    });
    var s={n:names.join(' + ')||'À la carte',t:pvLogType(l),note:liveLogNote20(l),
      dur:l.duration_min||null,time:l.time||'',ctx:(l.live&&l.live.context)||null,rep:(l.live&&l.live.reprise)||null,ex:[]};
    if(l.live&&l.live.exos) l.live.exos.forEach(function(x){
      if(!(x.sets&&x.sets.length)) return;
      s.ex.push({n:pvDecode(getExoName(x.key)),w:x.w,u:pvDecode(x.unite||'kg'),pain:!!x.pain,side:!x.main,
        sets:x.sets.map(function(st){return {r:st.reps,f:st.feel||null,w:(st.w!=null?st.w:x.w)};})});
    });
    (D(l.date).s=D(l.date).s||[]).push(s);
  });
  // « étirements » = étirements de séance OU routine matin/soir — le contenu des routines reste PRIVÉ
  Object.keys(DB.dz||{}).forEach(function(d){ if(d>=from&&d<=t&&dzDayDone(d)) D(d).st=1; });
  Object.keys(DB.nutrition||{}).forEach(function(d){
    if(d<from||d>t) return; var n=DB.nutrition[d]||{};
    if(n.petit_dej) D(d).pdj=1; if(n.shaker) D(d).crea=1; // (cardio non partagé — demande Adrien 26/08)
  });
  for(var d=from; d<=t; d=rankAddDays(d,1)){ var p=gelPauseAt(d); if(p) D(d).gel=p.type; }
  return {app:'adrien',name:'Adrien',ico:pvDecode('&#x1F3CB;'),goal:getWeekGoal(),days:days,
    msg:(DB.pv&&DB.pv.msg)||null,seen:(DB.pv&&DB.pv.seen)||null};
}
// Ce que je VOIS de Melati (forme produite par melati.js → pvSnapshot côté Melati) :
//   day = {s:[{n,ico,t,dur,feel,en,note,ex:[{n,w,u,bonus,sets:[reps],feels:[feel]}],recs:[]}],
//          salsa,eau,crea, mobi:[{n,ico,dur,feel,pain,pw,items:[{n,f}]}], kg}
if(typeof PV!=='undefined') PV.init({
  me:'adrien',other:'melati',meName:'Adrien',otherName:'Melati',meIco:'&#x1F3CB;',otherIco:'&#x1F338;',
  client:function(){ return (typeof sbClient!=='undefined'&&sbClient)?sbClient:null; },
  canPush:function(){ return typeof _cloudPullOk==='undefined'||_cloudPullOk; }, // même garde que user_state (11/08)
  snapshot:pvSnapshot,
  toast:function(m){ try{ showToast(m); }catch(e){} },
  placeholder:'Un petit mot pour Melati avant sa séance…',
  loveCta:'C\'est parti 💪',
  loveEmojis:['💗','🌸','✨','💕','🌷'],
  getMsg:function(){ return DB.pv&&DB.pv.msg||null; },
  setMsg:function(m){ if(!DB.pv) DB.pv={}; DB.pv.msg=m; saveDB(); },
  getSeen:function(){ return DB.pv&&DB.pv.seen||null; },
  setSeen:function(id){ if(!DB.pv) DB.pv={}; DB.pv.seen=id; saveDB(); },
  hasContent:function(day){ return !!(day&&((day.s&&day.s.length)||day.salsa||day.crea||(day.mobi&&day.mobi.length)||day.kg)); },
  // Case : colorée = sport · contour = mobilité · les deux = les deux (pas d'emoji — demande Adrien 26/08)
  daySport:function(day){ return (day.s&&day.s.length)?(day.s[0].t||'others'):null; },
  dayMobi:function(day){ return !!(day.mobi&&day.mobi.length); },
  daySalsa:function(day){ return !!day.salsa; }, // 29/08 : le jour de salsa de Melati = case turquoise, comme sur son calendrier
  tiles:function(days,dates,P){
    var c={s:0,salsa:0,crea:0,mobi:0};
    days.forEach(function(d){ if(!d) return; if(d.s) c.s+=d.s.length; if(d.salsa) c.salsa++; if(d.crea) c.crea++; if(d.mobi&&d.mobi.length) c.mobi++; });
    var g=(P&&P.goal)||3;
    function tile(i,v,o,l){ return '<div class="pv-tile'+(v>=o?' full':'')+'"><span class="pv-tile-i">'+i+'</span><span class="pv-tile-v">'+v+'<small>/'+o+'</small></span><span class="pv-tile-l">'+l+'</span></div>'; }
    return tile('🏋️',c.s,g,'s&#xE9;ances')+tile('💃',c.salsa,3,'salsa')+tile('🧪',c.crea,5,'cr&#xE9;atine')+tile('🧘',c.mobi,5,'mobilit&#xE9;'); // (eau non affichée — demande Adrien)
  },
  dayHtml:function(date,day){
    var E=PV.esc, h='';
    (day.s||[]).forEach(function(s){
      h+='<div class="pd-card t-'+(s.t||'others')+'"><div class="pd-head"><span class="pd-name">'+(s.ico||'')+' '+E(s.n)+'</span>'
        +'<span class="pd-meta">'+(s.dur?s.dur+' min':'')+(s.feel?' &#xB7; ressenti '+s.feel+'/5':'')+'</span></div>';
      (s.ex||[]).forEach(function(x){
        var kg=(x.w!=null&&(!x.u||x.u==='reps'))?x.w+' kg &#xB7; ':'';
        var sets=(x.sets||[]).join('&#xB7;');
        h+='<div class="pd-row"><span class="n">'+(x.bonus?'&#x2B50; ':'')+E(x.n)+'</span><span class="v">'+kg+sets+(x.u&&x.u!=='reps'?' '+E(x.u):'')+'</span></div>';
      });
      (s.recs||[]).forEach(function(r){ h+='<div class="pd-txt" style="color:var(--yellow);font-style:normal;">&#x1F3C6; '+E(r)+'</div>'; });
      if(s.note) h+='<div class="pd-txt">&#x1F4DD; '+E(s.note)+'</div>';
      h+='</div>';
    });
    (day.mobi||[]).forEach(function(m){
      h+='<div class="pd-card t-others"><div class="pd-head"><span class="pd-name">'+(m.ico||'🧘')+' '+E(m.n||'Mobilit&#xE9;')+'</span>'
        +'<span class="pd-meta">'+(m.dur?E(m.dur):'')+(m.feel?' &#xB7; ressenti '+m.feel+'/5':'')+'</span></div>';
      if(m.pain&&m.pain!=='non') h+='<div class="pd-txt" style="color:var(--yellow);font-style:normal;">&#x1FA79; Douleur&#x202F;: '+(m.pain==='oui'?'oui':'un peu')+(m.pw?' &#x2014; '+E(m.pw):'')+'</div>';
      else if(m.pain==='non') h+='<div class="pd-txt" style="font-style:normal;">&#x1F642; Aucune douleur</div>';
      (m.items||[]).forEach(function(it){ h+='<div class="pd-row"><span class="n">'+E(it.n)+'</span>'+(it.f?'<span class="mf mf-'+E(it.f)+'">'+(PV_MF[it.f]||E(it.f))+'</span>':'')+'</div>'; });
      h+='</div>';
    });
    var marks=[];
    if(day.salsa) marks.push('💃 salsa'); if(day.crea) marks.push('🧪 cr&#xE9;atine');
    if(day.kg) marks.push('⚖️ '+String(day.kg).replace('.',',')+' kg');
    if(marks.length) h+='<div class="pd-marks">'+marks.join(' &#xB7; ')+'</div>';
    return h;
  }
});

// ══════════════════════════════════════════════════
// BOOT — déclenché par supabase.js après vérif auth
// ══════════════════════════════════════════════════
initAuth();
