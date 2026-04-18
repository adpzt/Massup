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
  hammercurl: "imgs/hammercurl.gif"
};

// ══════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════
var NOW = new Date();

function getNow(){ return new Date(NOW.getTime()); }
function todayStr(){
  var d=getNow();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

var DB = {
  weights: {},    // {exoKey: [{date, val}]}
  logs: [],       // [{id, date, time, sessions:[], comment}]
  weightSetDate: {} // {exoKey: "YYYY-MM-DD"}  when weight was last set
};

function loadDB(){
  try{
    var s = localStorage.getItem('massup_db');
    if(s){ var d=JSON.parse(s); if(d.weights) DB.weights=d.weights; if(d.logs) DB.logs=d.logs; if(d.weightSetDate) DB.weightSetDate=d.weightSetDate; }
  }catch(e){}
}
function saveDB(){ try{ localStorage.setItem('massup_db',JSON.stringify(DB)); }catch(e){} }

// ══════════════════════════════════════════════════
// PROGRAMME DATA
// ══════════════════════════════════════════════════
var DATA = [
  {id:"s1",t:"push",num:"Séance 1",icon:"&#x1F525;",name:"PUSH",sub:"Pecs · Épaules · Triceps",exos:[
    {key:"chestpress_v",name:"Chest Press Vertical",poids:40,unite:"kg",serie:"4×8",rest:90,cue:"Serre les pecs pour rapprocher les bras.",tips:["Dos bien collé au dossier, pecs sortis.","Expire en poussant, inspire en descendant.","Mouvement contrôlé à la descente."],errs:["Ne pas décoller le dos du dossier.","Ne pas verrouiller les coudes en haut."],img:"chestpress"},
    {key:"dev_incline",name:"Développé Incliné Haltères",poids:16,unite:"kg/côté",serie:"4×8",rest:90,cue:"Coudes à 45°, descends vers le haut des pecs.",tips:["Banc à 30° — pas plus.","Bras jamais totalement tendus en haut.","Mouvement lent dans les deux sens."],errs:["Banc trop incliné = épaules pas pecs.","Ne pas rebondir en bas."],img:"inclinedumbell"},
    {key:"pecdeck",name:"Pec Deck",poids:34,unite:"kg",serie:"4×10",rest:60,cue:"Imagine écraser quelque chose entre tes pecs.",tips:["Poitrine sortie tout au long.","Aller-retour lent, pas de rebond.","Contraction maximale en fermeture."],errs:["Ne pas aller trop vite.","Ne pas laisser les épaules monter."],img:"pecdeck"},
    {key:"elev_lat",name:"Élévation Latérale",poids:6,unite:"kg/main",serie:"4×10",rest:60,cue:"Fais le T — mouvement lent.",tips:["Bras légèrement fléchi tout au long.","Contrôle la descente (3s).","Monter jusqu'à la hauteur des épaules."],errs:["Ne pas balancer le buste.","Ne pas hausser les épaules."],img:"lateralraise"},
    {key:"triceps_corde",name:"Triceps Poulie Corde",poids:16,unite:"kg",serie:"4×10",rest:60,cue:"Écarte la corde en bas pour finir la contraction.",tips:["Coudes collés au corps, immobiles.","Sépare la corde en bas.","Contrôle lent à la remontée."],errs:["Ne pas laisser les coudes s'écarter.","Ne pas utiliser le dos."],img:"tricepscable"}
  ]},
  {id:"s2",t:"pull",num:"Séance 2",icon:"&#x1F4AA;",name:"PULL",sub:"Dos · Biceps",exos:[
    {key:"tirage_vert",name:"Tirage Vertical (Dos)",poids:40,unite:"kg",serie:"4×10",rest:90,cue:"Pecs vers le haut, omoplates se resserrent à la descente.",tips:["Prise légèrement plus large que les épaules.","Dos fixe, pas de balancement.","Tirer les coudes vers les hanches."],errs:["Ne jamais tirer derrière la nuque.","Ne pas balancer avec le corps."],img:"latpulldown"},
    {key:"rowing_pb",name:"Rowing Poulie Basse (Triangle)",poids:36,unite:"kg",serie:"4×8",rest:75,cue:"Tire les coudes vers les hanches.",tips:["Dos et épaules droits.","Omoplates resserrées à chaque rep.","Descente lente pour étirer le dos."],errs:["Ne pas arrondir le dos.","Ne pas balancer le buste."],img:"seatedrow"},
    {key:"rowing_uni",name:"Rowing Unilatéral Poulie",poids:20,unite:"kg",serie:"4×8/bras",rest:75,cue:"Ton coude veut toucher ta poche arrière.",tips:["Buste stable, ne tourne pas.","Coude proche du corps.","Étire bien le dos en descente."],errs:["Ne pas tourner le buste.","Ne pas monter les épaules."],img:"onearmrow"},
    {key:"curl_halt",name:"Curl Haltères",poids:10,unite:"kg",serie:"4×8",rest:60,cue:"Coudes collés au corps. Que les avant-bras qui pivotent.",tips:["Coudes fixes contre les côtes.","Contraction 1s en haut.","Descente lente (3s)."],errs:["Ne pas monter les épaules.","Ne pas balancer le dos."],img:"dumbbellcurl"},
    {key:"curl_poulie",name:"Curl Poulie Basse",poids:10,unite:"kg",serie:"4×10",rest:60,cue:"Serre les biceps en haut pendant 1 seconde.",tips:["Coudes stables, ne bougent pas.","Descente contrôlée.","Garde la tension."],errs:["Ne pas avancer les coudes.","Ne pas remonter trop vite."],img:"cablecurl"}
  ]},
  {id:"s3",t:"legs",num:"Séance 3",icon:"&#x1F9B5;",name:"JAMBES",sub:"Force + Masse",exos:[
    {key:"leg_press",name:"Leg Press",poids:60,unite:"kg",serie:"4×10",rest:90,cue:"Pousse avec les talons — pas les orteils.",tips:["Pieds à largeur d'épaules.","Ne pas tendre complètement les jambes.","Cuisses parallèles au sol en bas."],errs:["Genoux qui rentrent vers l'intérieur.","Fesses qui décollent du siège."],img:"legpress"},
    {key:"leg_ext",name:"Leg Extension (Quadriceps)",poids:35,unite:"kg",serie:"4×12",rest:60,cue:"Contracte les quadriceps à fond en haut.",tips:["Descente lente (3s).","Contraction maximale en extension.","Mouvement contrôlé."],errs:["Ne pas aller trop vite.","Ne pas laisser le siège se soulever."],img:"legextension"},
    {key:"leg_curl",name:"Leg Curl (Ischio-jambiers)",poids:30,unite:"kg",serie:"4×12",rest:60,cue:"Ramène les talons vers les fesses lentement.",tips:["Hanches plaquées contre le banc.","Pointes fléchies vers toi = meilleure activation.","Descente contrôlée (3–4s)."],errs:["Ne pas lever les hanches.","Ne pas aller trop vite."],img:"legcurl"},
    {key:"mollets",name:"Mollets Machine",poids:40,unite:"kg",serie:"4×15",rest:45,cue:"Monte au maximum sur la pointe des pieds.",tips:["Amplitude complète : étirement total en bas.","Tenir 1–2s en haut.","Ne pas rebondir en bas."],errs:["Ne pas faire des demi-mouvements.","Ne pas descendre trop vite."],img:"chestpress"}
  ]},
  {id:"s4",t:"pull2",num:"Séance 4",icon:"&#x1F3AF;",name:"PULL 2",sub:"Dos · Biceps (variante)",exos:[
    {key:"tirage_vert_s4",name:"Tirage Vertical (Dos)",poids:40,unite:"kg",serie:"4×6",rest:90,cue:"Pecs vers le haut, omoplates se resserrent à la descente.",tips:["Prise légèrement plus large que les épaules.","4×6 = charge plus lourde, reste propre.","Omoplates vers le bas avant de tirer."],errs:["Ne jamais tirer derrière la nuque.","Ne pas balancer."],img:"latpulldown"},
    {key:"face_pull",name:"Face Pull",poids:18,unite:"kg",serie:"4×12",rest:60,cue:"Tire la corde vers ton nez, coudes hauts.",tips:["Câble à hauteur du visage.","Coudes à hauteur des épaules.","Rotation externe des épaules en fin."],errs:["Ne pas tirer vers la gorge.","Ne pas laisser les coudes tomber."],img:"facepull"},
    {key:"rowing_pb_s4",name:"Rowing Poulie Basse (Triangle)",poids:36,unite:"kg",serie:"4×8",rest:75,cue:"Tire les coudes vers les hanches — dos droit.",tips:["Omoplates resserrées à chaque rep.","Descente lente.","Dos et épaules droits."],errs:["Ne pas arrondir le dos.","Ne pas balancer le buste."],img:"seatedrow"},
    {key:"curl_incline",name:"Curl Incliné Haltères",poids:8,unite:"kg",serie:"3×10",rest:60,cue:"Laisse les bras pendre derrière toi au départ.",tips:["Banc incliné à 45–60°.","Étirement complet du biceps en bas.","Descente lente."],errs:["Ne pas avancer les coudes.","Ne pas descendre rapidement."],img:"inclinecurl"},
    {key:"curl_marteau",name:"Curl Marteau",poids:8,unite:"kg",serie:"3×10",rest:60,cue:"Poignets neutres — comme tenir un marteau.",tips:["Coudes collés au corps.","Mouvement propre, dos et épaules droits.","Contraction 1s en haut."],errs:["Ne pas rouler les poignets.","Ne pas balancer les coudes."],img:"hammercurl"}
  ]}
];

// Timer state
var timerInterval = null;
var timerEnd = null;
var timerExoId = null;
var calYear, calMonth2;
var weightChart = null, freqChart = null;








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
  setHeader();
  buildSeances();
  var d=getNow(); calYear=d.getFullYear(); calMonth2=d.getMonth();
  buildLogModal();
}

function setHeader(){
  var d=getNow();
  var days=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  var months=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  document.getElementById('hdate').textContent=days[d.getDay()]+' '+d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();
}

// Canonical weights — source of truth, update here when changing defaults
var CANONICAL_WEIGHTS = {
  'chestpress_v':40,'dev_incline':16,'pecdeck':34,'elev_lat':6,'triceps_corde':16,
  'tirage_vert':40,'rowing_pb':36,'rowing_uni':20,'curl_halt':10,'curl_poulie':10,
  'leg_press':60,'leg_ext':35,'leg_curl':30,'mollets':40,
  'tirage_vert_s4':40,'face_pull':18,'rowing_pb_s4':36,'curl_incline':8,'curl_marteau':8,
  'pulldown_bonus':40,'poulie_triceps_av':18,'dev_halt_debout':8,'triceps_barre':18,'vertical_row':35,'shoulder_press':16
};

function initWeights(){
  DATA.forEach(function(s){ s.exos.forEach(function(e){
    var canon = CANONICAL_WEIGHTS[e.key]||e.poids;
    if(!DB.weights[e.key]||!DB.weights[e.key].length){
      // First time: init with canonical weight on Feb 28
      DB.weights[e.key]=[{date:'2026-02-28',val:canon}];
      DB.weightSetDate[e.key]='2026-02-28';
    } else {
      // Already exists: make sure the Feb 28 baseline matches canonical
      var first=DB.weights[e.key][0];
      if(first.date==='2026-02-28' && first.val!==canon){
        first.val=canon;
      }
    }
  });});
  saveDB();
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

// ══════════════════════════════════════════════════
// BUILD SEANCES
// ══════════════════════════════════════════════════
function buildSeances(){
  var sgrid=document.getElementById('sgrid');
  var panelsDiv=document.getElementById('panels');
  sgrid.innerHTML=''; panelsDiv.innerHTML='';

  DATA.forEach(function(s,si){
    var card=document.createElement('div');
    card.className='sc'+(si===0?' active':'');
    card.dataset.t=s.t; card.dataset.id=s.id;
    card.addEventListener('click',function(){ selectSeance(s.id); });
    card.innerHTML='<span class="sc-ico">'+s.icon+'</span><div class="sc-num">'+s.num+'</div><div class="sc-name">'+s.name+'</div><div class="sc-sub">'+s.sub+'</div><div class="sc-ct"><div class="scdot"></div>'+s.exos.length+' exercices</div>';
    sgrid.appendChild(card);

    var total=0; s.exos.forEach(function(e){var m=e.serie.match(/^(\d+)/);if(m)total+=parseInt(m[1]);});

    var exHtml='';
    s.exos.forEach(function(e,ei){
      var sets=''; var m=e.serie.match(/^(\d+)×(.+)$/);
      if(m){var n=parseInt(m[1]),r=m[2];for(var i=1;i<=n;i++)sets+='<div class="sbbl" id="set-'+s.id+'-'+ei+'-'+i+'" onclick="toggleSet(\''+s.id+'\','+ei+','+i+','+n+',\''+e.key+'\')"><span>Série '+i+'</span>'+r+'</div>';}
      var tips=e.tips.map(function(t){return '<div class="tip"><div class="tdot"></div>'+t+'</div>';}).join('');
      var errs=e.errs.map(function(er){return '<div class="erritem"><span class="errx">✕</span>'+er+'</div>';}).join('');
      var days=getDaysSinceWeightChange(e.key);
      var staleHtml='';
      if(days>=14){ staleHtml='<div class="weight-nudge show" id="nudge-'+e.key+'">&#x1F4A1; Tu n\'as pas augmenté ce poids depuis <strong>'+days+' jours</strong>. Si tu complètes toutes tes séries proprement, c\'est le moment d\'ajouter 1kg !</div>'; }
      var w=getCurrentWeight(e.key);
      var prChip=days===0?'<span class="chip chip-up">&#x1F195; Mis à jour aujourd\'hui</span>':'';
      exHtml+='<div class="ex" id="ex-'+s.id+'-'+ei+'">'
        +'<button class="exbtn" onclick="toggleEx(\''+s.id+'\','+ei+')">'
        +'<div class="exnum">'+('0'+(ei+1)).slice(-2)+'</div>'
        +'<div class="exinf"><div class="exname">'+e.name+'</div>'
        +'<div class="exmeta"><span class="chip cw" id="chip-w-'+e.key+'">&#x2696; '+w+' '+e.unite+'</span><span class="chip cs">&#x1F4CA; '+e.serie+'</span>'+prChip+'</div></div>'
        +'<div class="exarr">▾</div></button>'
        +'<div class="exbody"><div class="exinner">'
        +'<div class="demo"><img src="'+IMGS[e.img]+'" alt="'+e.name+'" style="width:100%;height:100%;object-fit:contain;"/><div class="demo-lbl">Démonstration</div></div>'
        +'<div class="exc">'
        +'<div><div class="seclbl">Poids actuel</div>'
        +'<div class="weight-row"><button class="wbtn minus" onclick="changeWeight(\''+e.key+'\',-1,\''+s.id+'\','+ei+',\''+e.unite+'\')">−</button><div class="weight-val" id="wval-'+e.key+'">'+w+'</div><span class="weight-unit">'+e.unite+'</span><button class="wbtn plus" onclick="changeWeight(\''+e.key+'\',1,\''+s.id+'\','+ei+',\''+e.unite+'\')">+</button></div>'
        +'<div class="weight-date" id="wdate-'+e.key+'">Dernière modif. : '+formatDateFr(DB.weightSetDate[e.key])+'</div>'
        +staleHtml+'</div>'
        +'<div><div class="seclbl">Séries — clique pour cocher</div><div class="srow" id="srow-'+s.id+'-'+ei+'">'+sets+'</div></div>'
        +'<div class="rest-timer" id="timer-'+s.id+'-'+ei+'">'
        +'<div class="rt-circle" id="rtc-'+s.id+'-'+ei+'"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="3"/><circle class="fg" cx="22" cy="22" r="18" fill="none" stroke="#7DF9C2" stroke-width="3" stroke-dasharray="113" stroke-dashoffset="0" stroke-linecap="round"/></svg></div>'
        +'<div class="rt-info"><div class="rt-label">Repos</div><div class="rt-time" id="rtt-'+s.id+'-'+ei+'">'+formatTime(e.rest)+'</div><div class="rt-msg" id="rtm-'+s.id+'-'+ei+'">Série terminée !</div></div>'
        +'<button class="rt-stop" onclick="stopTimer(\''+s.id+'\','+ei+')">✕</button>'
        +'</div>'
        +'<div class="cue"><div class="cuelbl">&#x27A1; Cue principal</div><div class="cuetxt">'+e.cue+'</div></div>'
        +'<div><div class="seclbl">Conseils</div><div class="tips">'+tips+'</div></div>'
        +'<div class="errs"><div class="errlbl">⚠ Erreurs à éviter</div>'+errs+'</div>'
        +'</div></div></div></div>';
    });

    var panel=document.createElement('div');
    panel.className='panel'+(si===0?' active':'');
    panel.id='panel-'+s.id; panel.dataset.t=s.t;
    panel.innerHTML='<div class="phdr"><div class="ptw"><div class="plbl">'+s.num+' · '+s.icon+'</div><div class="ptitle">'+s.name+'</div><div class="psub">'+s.sub+'</div></div><div class="pstats"><div><div class="sv">'+s.exos.length+'</div><div class="sl">Exercices</div></div><div><div class="sv">'+total+'</div><div class="sl">Séries</div></div></div></div>'+buildWarmup(s.id,s.t)+'<div class="exlist">'+exHtml+'</div>';
    panelsDiv.appendChild(panel);
  });
}

function selectSeance(id){
  document.querySelectorAll('.sc').forEach(function(c){c.classList.toggle('active',c.dataset.id===id);});
  document.querySelectorAll('.panel').forEach(function(p){p.classList.toggle('active',p.id==='panel-'+id);});
  document.querySelectorAll('.ex').forEach(function(e){e.classList.remove('open');});
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
  var nw=Math.max(0, Math.round(cur+delta));
  var today=todayStr();
  // If last entry is today, update it; otherwise add new
  if(arr.length && arr[arr.length-1].date===today){ arr[arr.length-1].val=nw; }
  else{ arr.push({date:today,val:nw}); }
  DB.weights[key]=arr;
  DB.weightSetDate[key]=today;
  saveDB();
  // Update UI
  var wval=document.getElementById('wval-'+key);
  if(wval) wval.textContent=nw;
  var chip=document.getElementById('chip-w-'+key);
  if(chip) chip.textContent='&#x2696; '+nw+' '+unite;
  var wdate=document.getElementById('wdate-'+key);
  if(wdate) wdate.textContent='Dernière modif. : '+formatDateFr(today);
  var nudge=document.getElementById('nudge-'+key);
  if(nudge) nudge.classList.remove('show');
  showToast(delta>0?'&#x1F4AA; +1kg — Beau travail !':'&#x2193; Poids ajusté à '+nw+' '+unite);
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
  var timerEl=document.getElementById('timer-'+id);
  if(timerEl) timerEl.classList.add('active');
  var total=duration;
  updateTimerUI(id,duration,total);
  timerInterval=setInterval(function(){
    var rem=Math.ceil((timerEnd-Date.now())/1000);
    if(rem<=0){
      clearInterval(timerInterval); timerInterval=null;
      updateTimerUI(id,0,total);
      var msg=document.getElementById('rtm-'+id);
      if(msg) msg.textContent='C\'est parti ! &#x1F4A5;';
      showToast('&#x23F1; Repos terminé — Lance la série !');
      setTimeout(function(){ stopTimer(sid,ei); },2000);
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
      else{ fg.style.stroke='#7DF9C2'; circle.classList.remove('urgent'); }
    }
  }
}

function stopTimer(sid,ei){
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
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
  document.getElementById('logTime').value=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  var el=document.getElementById('seanceCheckboxes'); el.innerHTML='';
  DATA.forEach(function(s){
    var div=document.createElement('div');
    div.className='sc-check'; div.dataset.sid=s.id;
    div.innerHTML='<span class="sc-check-ico">'+s.icon+'</span><span class="sc-check-name">'+s.name+'</span>';
    div.addEventListener('click',function(){ div.classList.toggle('sel'); });
    el.appendChild(div);
  });
}

function openLogModal(){ buildLogModal(); document.getElementById('logModal').classList.add('open'); }
function closeLogModal(){
  document.getElementById('logModal').classList.remove('open');
  document.getElementById('autreCheck').checked=false;
  document.getElementById('autreSport').style.display='none';
  document.getElementById('autreSport').value='';
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
    var autreCbV=document.getElementById('autreCheck');
  var hasAutre=autreCbV&&autreCbV.checked&&document.getElementById('autreSport').value.trim().length>0;
  if(!date||(sessions.length===0&&!hasAutre)){ showToast('⚠ Choisis une séance ou renseigne un autre sport'); return; }
    var autreCb=document.getElementById('autreCheck');
  if(autreCb&&autreCb.checked){
    var autreSportVal=document.getElementById('autreSport').value.trim();
    if(autreSportVal) sessions.push('autre:'+autreSportVal);
  }
  DB.logs.push({id:Date.now(),date:date,time:time,sessions:sessions,comment:comment});
  DB.logs.sort(function(a,b){return b.date.localeCompare(a.date)||(b.time.localeCompare(a.time));});
  saveDB();
  closeLogModal();
  document.getElementById('logComment').value='';
  renderHisto();
  showToast('&#x2705; Séance enregistrée !');
}

function deleteLog(id){
  DB.logs=DB.logs.filter(function(l){return l.id!==id;});
  saveDB(); renderHisto();
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
  for(var i=0;i<offset;i++){ var em=document.createElement('div'); em.className='cal-day empty'; grid.appendChild(em); }
  for(var d=1;d<=days;d++){
    var dateStr=calYear+'-'+String(calMonth2+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var el=document.createElement('div');
    el.className='cal-day'+(dateStr===today?' today':'')+(sessionMap[dateStr]?' has-session':'');
    el.textContent=d;
    if(sessionMap[dateStr]){
      var captured=dateStr;
      el.addEventListener('click',function(){ showDayModal(captured); });
    }
    grid.appendChild(el);
  }
}

function showDayModal(date){
  var logs=DB.logs.filter(function(l){return l.date===date;});
  document.getElementById('dayModalTitle').innerHTML='Séances du '+formatDateFr(date)+' <button class="modal-close" onclick="closeDayModal()">✕</button>';
  var html='';
  logs.forEach(function(l){
    html+='<div style="margin-bottom:1rem;padding:.9rem;background:var(--glass);border:1px solid var(--gb);border-radius:12px;">';
    html+='<div style="font-size:.75rem;color:var(--mut);margin-bottom:.5rem;">'+l.time+'</div>';
    html+='<div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.5rem;">';
    l.sessions.forEach(function(sid){
      if(sid.indexOf('autre:')==0){
        html+='<span class="le-tag chip" style="background:rgba(255,209,102,.1);color:var(--yellow)">&#x1F938; '+sid.replace('autre:','')+'</span>';
      } else {
        var s=DATA.find(function(x){return x.id===sid;}); if(s) html+='<span class="le-tag chip cw">'+s.icon+' '+s.name+'</span>';
      }
    });
    html+='</div>';
    if(l.comment) html+='<div style="font-size:.78rem;color:var(--mut);font-style:italic;">'+l.comment+'</div>';
    html+='</div>';
  });
  document.getElementById('dayModalContent').innerHTML=html;
  document.getElementById('dayModal').classList.add('open');
}
function closeDayModal(){ document.getElementById('dayModal').classList.remove('open'); }

function renderHisto(){
  renderCal();
  var el=document.getElementById('logEntries'); el.innerHTML='';
  if(!DB.logs.length){ el.innerHTML='<div style="text-align:center;color:var(--mut);padding:2rem;font-size:.85rem;">Aucune séance enregistrée pour l\'instant.</div>'; return; }
  DB.logs.forEach(function(l){
    var sessions=l.sessions.map(function(sid){
    if(sid.indexOf('autre:')==0){
      return '<span class="le-tag chip" style="background:rgba(255,209,102,.1);color:var(--yellow)">&#x1F938; '+sid.replace('autre:','')+'</span>';
    }
    var s=DATA.find(function(x){return x.id===sid;});
    return s?'<span class="le-tag chip cw" style="background:rgba(125,249,194,.08)">'+s.icon+' '+s.name+'</span>':'';
  }).join('');
    var div=document.createElement('div');
    div.className='log-entry';
    div.innerHTML='<div class="le-top"><div class="le-date">'+formatDateFr(l.date)+'</div><div style="display:flex;align-items:center;gap:.5rem;"><div class="le-time">'+l.time+'</div><button class="le-del" onclick="deleteLog('+l.id+')">&#x1F5D1;</button></div></div><div class="le-sessions">'+sessions+'</div>'+(l.comment?'<div class="le-comment">'+l.comment+'</div>':'');
    el.appendChild(div);
  });
}

// ══════════════════════════════════════════════════
// CHARTS & STATS
// ══════════════════════════════════════════════════
function buildChartSelect(){
  var sel=document.getElementById('chartSelect'); sel.innerHTML='';
  var all=[];
  DATA.forEach(function(s){ s.exos.forEach(function(e){ if(!all.find(function(x){return x.key===e.key;})) all.push({key:e.key,name:e.name}); }); });
  all.forEach(function(e){ var opt=document.createElement('option'); opt.value=e.key; opt.textContent=e.name; sel.appendChild(opt); });
}

function renderWeightChart(){
  var key=document.getElementById('chartSelect').value;
  var arr=DB.weights[key]||[];
  var labels=arr.map(function(x){return formatDateShort(x.date);});
  var vals=arr.map(function(x){return x.val;});
  var ctx=document.getElementById('weightChart').getContext('2d');
  if(weightChart) weightChart.destroy();
  weightChart=new Chart(ctx,{
    type:'line',
    data:{labels:labels,datasets:[{label:'Poids (kg)',data:vals,borderColor:'#7DF9C2',backgroundColor:'rgba(125,249,194,.08)',borderWidth:2.5,pointBackgroundColor:'#7DF9C2',pointRadius:5,tension:.35,fill:true}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.parsed.y+' kg';}}}},scales:{x:{ticks:{color:'rgba(240,244,255,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(240,244,255,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.06)'}}}}
  });
}

function renderFreqChart(){
  var ctx=document.getElementById('freqChart').getContext('2d');
  if(freqChart) freqChart.destroy();
  // Build 8 weeks
  var weeks=[]; var labels=[];
  var now=getNow();
  for(var w=7;w>=0;w--){
    var wstart=new Date(now); wstart.setDate(wstart.getDate()-w*7-wstart.getDay()+1);
    var wend=new Date(wstart); wend.setDate(wend.getDate()+6);
    var count=DB.logs.filter(function(l){ var d=new Date(l.date); return d>=wstart&&d<=wend; }).length;
    weeks.push(count);
    labels.push('S-'+w);
  }
  labels[7]='Cette sem.';
  freqChart=new Chart(ctx,{
    type:'bar',
    data:{labels:labels,datasets:[{data:weeks,backgroundColor:weeks.map(function(v){return v>=3?'rgba(125,249,194,.5)':v>=1?'rgba(91,142,255,.4)':'rgba(255,255,255,.06)';}),borderRadius:6,borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'rgba(240,244,255,.4)',font:{size:10}},grid:{display:false}},y:{ticks:{color:'rgba(240,244,255,.4)',font:{size:10},stepSize:1},grid:{color:'rgba(255,255,255,.05)'}}}}
  });
}

function renderStats(){
  var total=DB.logs.length;
  var thisWeek=0; var now=getNow();
  var wstart=new Date(now); wstart.setDate(wstart.getDate()-wstart.getDay()+1); wstart.setHours(0,0,0,0);
  DB.logs.forEach(function(l){var d=new Date(l.date);if(d>=wstart)thisWeek++;});
  var streak=0; var d2=new Date(now);
  while(true){
    var ds=d2.getFullYear()+'-'+String(d2.getMonth()+1).padStart(2,'0')+'-'+String(d2.getDate()).padStart(2,'0');
    if(DB.logs.find(function(l){return l.date===ds;})){ streak++; d2.setDate(d2.getDate()-1); } else break;
  }
  document.getElementById('statsGrid').innerHTML=
    '<div class="stat-card accent"><div class="sv">'+total+'</div><div class="sl">Séances totales</div></div>'+
    '<div class="stat-card push-c"><div class="sv">'+thisWeek+'</div><div class="sl">Cette semaine</div></div>'+
    '<div class="stat-card pull-c"><div class="sv">'+streak+'</div><div class="sl">Jours consécutifs</div></div>';
}

function renderProgAlerts(){
  var el=document.getElementById('progList'); el.innerHTML='';
  var all=[]; DATA.forEach(function(s){s.exos.forEach(function(e){if(!all.find(function(x){return x.key===e.key;}))all.push(e);});});
  var alerts=[];
  all.forEach(function(e){
    var days=getDaysSinceWeightChange(e.key);
    var arr=DB.weights[e.key]||[];
    var w=getCurrentWeight(e.key);
    if(days>=21) alerts.push({type:'stale',txt:'<strong>'+e.name+'</strong> — Poids inchangé depuis <strong>'+days+' jours</strong>. Si tes séries sont propres, tu peux tenter +1kg.'});
    else if(days>=14) alerts.push({type:'stale',txt:'<strong>'+e.name+'</strong> — '+days+' jours sans changement de poids. Surveille si tu boucles tes séries facilement.'});
    if(arr.length>=2 && arr[arr.length-1].val>arr[0].val) alerts.push({type:'good',txt:'<strong>'+e.name+'</strong> — Progression de <strong>'+arr[0].val+' → '+arr[arr.length-1].val+' '+e.unite+'</strong> depuis le début &#x1F525;'});
  });
  if(!alerts.length){ el.innerHTML='<div style="color:var(--mut);font-size:.82rem;text-align:center;padding:1.5rem;">Commence à entraîner et noter tes poids pour voir tes progrès ici !</div>'; return; }
  alerts.forEach(function(a){
    var div=document.createElement('div'); div.className='prog-alert '+a.type;
    div.innerHTML='<div class="prog-ico">'+(a.type==='stale'?'&#x26A0;':'&#x1F3C6;')+'</div><div class="prog-txt">'+a.txt+'</div>';
    el.appendChild(div);
  });
}

// ══════════════════════════════════════════════════
// VIEW SWITCHING
// ══════════════════════════════════════════════════
function switchView(name, btn){
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});
  document.querySelectorAll('.bni').forEach(function(b){b.classList.remove('active');});
  document.getElementById('view-'+name).classList.add('active');
  btn.classList.add('active');
  if(name==='histo') renderHisto();
  if(name==='charts'){ buildChartSelect(); renderWeightChart(); renderFreqChart(); renderStats(); renderProgAlerts(); }
  if(name==='extras'){ buildExtras(); }
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

var toastTimer=null;
function showToast(msg){
  var t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){t.classList.remove('show');},2800);
}


// ═══════════════ EXTRAS ═══════════════
var EXTRAS_POULIE_IMG = 'imgs/extras_poulie.jpg';
var EXTRAS_DEV_HALT_IMG = 'imgs/extras_dev_halt.jpg';

var EXTRAS = [
  {
    key:'pulldown_bonus',
    name:'Pulldown',
    poids:40, unite:'kg', serie:'4x10', rest:90,
    imgKey:'latpulldown',
    cue:'Tire les coudes vers les hanches, pecs hauts.',
    tips:['Prise large, plus que les epaules.','Omoplates vers le bas avant de tirer.','Controle lent a la montee.'],
    errs:['Ne pas balancer le buste.','Ne pas tirer derriere la nuque.']
  },
  {
    key:'poulie_triceps_av',
    name:'Poulie Triceps / Avant-bras',
    poids:18, unite:'kg', serie:'4x10', rest:60,
    imgKey:null,
    cue:'Coudes fixes au corps, pousse vers le bas.',
    tips:['Coudes immobiles contre les cotes.','Controle lent a la remontee.','Extension complete en bas.'],
    errs:['Ne pas ecarter les coudes.','Ne pas utiliser le dos.']
  },
  {
    key:'dev_halt_debout',
    name:'Developpe Haltere Debout',
    poids:8, unite:'kg/haltere', serie:'4x8', rest:75,
    imgKey:null,
    cue:'Pousse les halteres vers le haut, coudes alignes avec les epaules.',
    tips:['Pieds largeur epaules, gainage du core.','Coudes a 90 degres au depart.','Descente controlee, pas de rebond.'],
    errs:['Ne pas cambrer le dos.','Ne pas bloquer les coudes en haut.']
  },
  {
    key:'triceps_barre',
    name:'Triceps Poulie Barre',
    poids:18, unite:'kg', serie:'4x10', rest:60,
    imgKey:'tricepscable',
    cue:'Barre fixe, pousse vers le bas en gardant les coudes colles.',
    tips:['Coudes immobiles contre les cotes.','Extension complete en bas.','Remontee lente et controlee.'],
    errs:['Ne pas ecarter les coudes.','Ne pas utiliser le dos.']
  },
  {
    key:'vertical_row',
    name:'Vertical Row Machine',
    poids:35, unite:'kg', serie:'4x10', rest:75,
    imgKey:'seatedrow',
    cue:'Tire les coudes vers les hanches, omoplates qui se resserrent.',
    tips:['Dos droit, epaules basses.','Omoplates resserrees en fin de mouvement.','Descente lente pour etirer le dos.'],
    errs:['Ne pas arrondir le dos.','Ne pas tirer avec les bras uniquement.']
  },
  {
    key:'shoulder_press',
    name:'Shoulder Press',
    poids:16, unite:'kg', serie:'4x10', rest:75,
    imgKey:null,
    cue:'Pousse vers le haut, coudes alignes avec les epaules au depart.',
    tips:['Gainage du core pendant tout le mouvement.','Descente controlee jusqu\u0027a hauteur des epaules.','Ne pas bloquer les coudes en haut.'],
    errs:['Ne pas cambrer le dos.','Ne pas monter les epaules vers les oreilles.']
  }
];

function buildExtras(){
  var el=document.getElementById('extras-list');
  if(!el) return;
  // Init weights
  EXTRAS.forEach(function(e){
    if(!DB.weights[e.key]||!DB.weights[e.key].length){
      DB.weights[e.key]=[{date:'2026-02-28',val:e.poids}];
      DB.weightSetDate[e.key]='2026-02-28';
    }
  });
  saveDB();
  el.innerHTML = '';
  EXTRAS.forEach(function(e,ei){
    var w=getCurrentWeight(e.key);
    var sn=parseInt(e.serie.split('x')[0]);
    var sr=e.serie.split('x')[1];
    var sets='';
    for(var i=1;i<=sn;i++) sets+='<div class="sbbl" id="xset-'+ei+'-'+i+'" onclick="xToggleSet('+ei+','+i+','+sn+',\''+e.key+'\')" ><span>Serie '+i+'</span>'+sr+'</div>';
    var imgSrc=e.imgKey?IMGS[e.imgKey]:((e.key==='dev_halt_debout'||e.key==='shoulder_press')?EXTRAS_DEV_HALT_IMG:EXTRAS_POULIE_IMG);
    var tips=e.tips.map(function(t){return '<div class="tip"><div class="tdot"></div>'+t+'</div>';}).join('');
    var errs=e.errs.map(function(er){return '<div class="erritem"><span class="errx">x</span>'+er+'</div>';}).join('');
    var days=getDaysSinceWeightChange(e.key);
    var nudge=days>=14?'<div class="weight-nudge show">Inchange depuis '+days+' jours. Essaie +1kg si les series sont propres.</div>':'';
    var card=document.createElement('div');
    card.className='ex'; card.id='xex-'+ei;
    card.innerHTML=
      '<button class="exbtn" onclick="xToggleEx('+ei+')">'
        +'<div class="exnum" style="color:rgba(125,249,194,.15)">0'+(ei+1)+'</div>'
        +'<div class="exinf">'
          +'<div class="exname">'+e.name+'</div>'
          +'<div class="exmeta">'
            +'<span class="chip cw" id="xchip-'+e.key+'">'+w+' '+e.unite+'</span>'
            +'<span class="chip cs">'+e.serie+'</span>'
          +'</div>'
        +'</div>'
        +'<div class="exarr">&#x25BE;</div>'
      +'</button>'
      +'<div class="exbody"><div class="exinner">'
        +'<div class="demo"><img src="'+imgSrc+'" alt="'+e.name+'" style="width:100%;height:100%;object-fit:contain;"/><div class="demo-lbl">Demo</div></div>'
        +'<div class="exc">'
          +'<div><div class="seclbl">Poids actuel</div>'
            +'<div class="weight-row">'
              +'<button class="wbtn minus" onclick="xChangeWeight(\''+e.key+'\',-1,'+ei+',\''+e.unite+'\')">-</button>'
              +'<div class="weight-val" id="xwval-'+e.key+'">'+w+'</div>'
              +'<span class="weight-unit">'+e.unite+'</span>'
              +'<button class="wbtn plus" onclick="xChangeWeight(\''+e.key+'\',1,'+ei+',\''+e.unite+'\')">+</button>'
            +'</div>'
            +'<div class="weight-date" id="xwdate-'+e.key+'">Modif : '+formatDateFr(DB.weightSetDate[e.key])+'</div>'
            +nudge
          +'</div>'
          +'<div><div class="seclbl">Series - clique pour cocher</div><div class="srow" id="xsrow-'+ei+'">'+sets+'</div></div>'
          +'<div class="rest-timer" id="xtimer-'+ei+'">'
            +'<div class="rt-circle" id="xrtc-'+ei+'"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="3"/><circle class="fg" cx="22" cy="22" r="18" fill="none" stroke="#7DF9C2" stroke-width="3" stroke-dasharray="113" stroke-dashoffset="0" stroke-linecap="round"/></svg></div>'
            +'<div class="rt-info"><div class="rt-label">Repos</div><div class="rt-time" id="xrtt-'+ei+'">'+formatTime(e.rest)+'</div><div class="rt-msg" id="xrtm-'+ei+'">Serie terminee !</div></div>'
            +'<button class="rt-stop" onclick="xStopTimer('+ei+')">stop</button>'
          +'</div>'
          +'<div class="cue"><div class="cuelbl">Cue principal</div><div class="cuetxt">'+e.cue+'</div></div>'
          +'<div><div class="seclbl">Conseils</div><div class="tips">'+tips+'</div></div>'
          +'<div class="errs"><div class="errlbl">Erreurs a eviter</div>'+errs+'</div>'
        +'</div>'
      +'</div></div></div>';
    el.appendChild(card);
  });
}

function xToggleEx(idx){
  var c=document.getElementById('xex-'+idx);
  var was=c.classList.contains('open');
  document.querySelectorAll('[id^="xex-"]').forEach(function(x){x.classList.remove('open');});
  if(!was) c.classList.add('open');
}

function xToggleSet(ei,si,total,key){
  var btn=document.getElementById('xset-'+ei+'-'+si); if(!btn) return;
  var was=btn.classList.contains('done');
  btn.classList.toggle('done',!was);
  if(!was){
    var exo=EXTRAS.find(function(e){return e.key===key;});
    if(si<total) xStartTimer(ei,exo?exo.rest:60);
    else showToast('Toutes les series terminees !');
  } else { xStopTimer(ei); }
}

function xStartTimer(ei,duration){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null;}
  timerEnd=Date.now()+duration*1000;
  var el=document.getElementById('xtimer-'+ei); if(el) el.classList.add('active');
  xUpdateTimer(ei,duration,duration);
  timerInterval=setInterval(function(){
    var rem=Math.ceil((timerEnd-Date.now())/1000);
    if(rem<=0){
      clearInterval(timerInterval);timerInterval=null;
      xUpdateTimer(ei,0,duration);
      showToast('Repos termine - Lance la serie !');
      setTimeout(function(){xStopTimer(ei);},2000);
    } else { xUpdateTimer(ei,rem,duration); }
  },500);
}

function xUpdateTimer(ei,rem,total){
  var el=document.getElementById('xrtt-'+ei); if(el) el.textContent=formatTime(rem);
  var c=document.getElementById('xrtc-'+ei);
  if(c){var fg=c.querySelector('.fg');if(fg){fg.style.strokeDashoffset=String(113*(1-rem/total));fg.style.stroke=rem<=10?'var(--yellow)':'#7DF9C2';}}
}

function xStopTimer(ei){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null;}
  var el=document.getElementById('xtimer-'+ei); if(el) el.classList.remove('active');
}

function xChangeWeight(key,delta,ei,unite){
  var arr=DB.weights[key]||[];
  var cur=arr.length?arr[arr.length-1].val:0;
  var nw=Math.max(0,Math.round(cur+delta));
  var today=todayStr();
  if(arr.length&&arr[arr.length-1].date===today){arr[arr.length-1].val=nw;}
  else{arr.push({date:today,val:nw});}
  DB.weights[key]=arr; DB.weightSetDate[key]=today; saveDB();
  var v=document.getElementById('xwval-'+key); if(v) v.textContent=nw;
  var c=document.getElementById('xchip-'+key); if(c) c.textContent=nw+' '+unite;
  var d=document.getElementById('xwdate-'+key); if(d) d.textContent='Modif : '+formatDateFr(today);
  showToast(delta>0?'+1kg - Beau travail !':'Poids ajuste a '+nw+' '+unite);
}

// ══════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════
try { init(); } catch(e) {
  document.querySelector('.app').innerHTML = '<div style="padding:2rem;color:#ff6b6b;font-family:monospace;font-size:.8rem;background:#0e1220;border-radius:12px;border:1px solid #ff6b6b33;"><strong>Erreur JS :</strong><br>' + e.message + '<br><br>' + (e.stack||'') + '</div>';
}