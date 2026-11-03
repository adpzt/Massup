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
  {v:'ok',ico:'&#x1F44D;',lbl:'OK'}, // « OK » (28/10, vocabulaire d'Adrien) — c'était « Correct »
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

// ── SYSTÈME « UNE SEULE CHARGE » (28/10/2026, demande Adrien) ──
// Constat (30 j au 27/10) : 53 % des séries principales notées « échec », 31 % des séries 1 à
// l'échec → reps perdues ensuite, stagnation, coude/poignet chargés au pire moment.
// Règles (28/10, précisées par Adrien le jour même) : même charge sur toutes les séries ; consigne
// de ressenti par série — S1 vise OK (2-3 en réserve), séries intermédiaires DUR (1), dernière
// ÉCHEC (max de reps). Double progression : la charge monte d'un cran quand TOUTES les séries
// atteignent le HAUT de la fourchette (ex. 10-10-10-11 en 8-10 ; 8-8-8-11 ne suffit pas) et
// qu'il n'y a pas d'échec en série 1 ni en série 2 (« échec en S1 ou S2 = pas prêt de monter »).
// Série 1 à l'échec sous le bas → un cran en dessous. Dans la note, seule la S1 à l'échec coûte.
// step = 1 cran (kg). Pas de séries d'échauffement affichées (Adrien n'a pas le temps).
var REP_RANGE={
  dev_incline:{r:[8,10],step:2}, chestpress_v:{r:[8,10],step:5}, pecdeck:{r:[10,12],step:5},
  elev_lat:{r:[8,12],step:2}, triceps_corde:{r:[10,12],step:2}, triceps_barre:{r:[10,12],step:2}, // élévations : 01/11 (Adrien) retour à 8 kg en 8-12 (6 kg × 15-20 bloquait depuis avril) · 03/11 : ce commentaire avalait les 2 triceps
  shoulder_press:{r:[8,10],step:5}, seated_dips:{r:[8,10],step:5}, dips_assist:{r:[8,10],step:4},
  cable_fly:{r:[10,12],step:1}, dev_militaire:{r:[8,10],step:2},
  tirage_vert:{r:[8,10],step:4}, rowing_pb:{r:[8,10],step:4}, rowing_uni:{r:[8,10],step:2},
  curl_marteau_croise:{r:[10,12],step:2}, curl_incline_neutre:{r:[8,10],step:2}, face_pull:{r:[12,15],step:2},
  rowing_appui:{r:[10,12],step:5}, curl_marteau:{r:[10,12],step:2}, curl_corde:{r:[10,12],step:2},
  tirage_pulldown:{r:[8,10],step:5}, traction_assist:{r:[8,10],step:4}, shrug_halt:{r:[10,12],step:2},
  leg_press:{r:[10,12],step:5}, leg_ext:{r:[10,12],step:5}, hip_thrust:{r:[10,12],step:5},
  mollets:{r:[12,15],step:5}, abduct:{r:[12,15],step:5}, adduct:{r:[12,15],step:2},
  crunch_leste:{r:[12,15],step:2.5}, crunch_decline_leste:{r:[12,15],step:2.5}, pallof:{r:[10,12],step:1}
};
// Consigne de ressenti d'une série (1-based) : 'ok' | 'dur' | 'echec' — null hors système
// (exo sans fourchette, série bonus au-delà du programme).
function fsGoal(x,setNo){
  if(!x||!x.rHi) return null;
  var n=x.n||3;
  if(setNo<1||setNo>n) return null;
  if(setNo===n) return 'echec';
  return setNo===1?'ok':'dur';
}
var FS_GOAL_LBL={ok:'OK',dur:'DUR',echec:'&#xC9;CHEC'};
var FS_GOAL_HINT={ok:'2-3 reps en r&#xE9;serve',dur:'1 rep en r&#xE9;serve',echec:'max de reps, plus une seule possible'};
function fsBlockFails(x,sets){ var n=x.n||3; return (sets||[]).slice(0,Math.min(2,n-1)).filter(function(s){ return s.feel==='echec'; }).length; }
function fsRangeStr(x){ return x&&x.rHi&&x.rHi>x.reps?x.reps+'&#x2013;'+x.rHi:String(x?x.reps:''); }
// Le cran de hausse/baisse (kg) : celui de la table, sinon l'incrément de l'exo.
function fsStep(x){ var rg=REP_RANGE[x.key]; return (rg&&rg.step)||x.inc||1; }
// Intro d'exo : plan des consignes (« S1 OK · S2-S3 DUR · S4 ÉCHEC »)
function fsPlanHtml(x){
  var n=x.n||3, inv=asIsInverse(x.key);
  var h='<div class="as-fs-plan">';
  h+='<div class="as-fs-steps">';
  if(n>=2) h+='<span class="g-ok">S1 OK</span>';
  if(n>=3) h+='<span class="g-dur">'+(n===3?'S2':'S2-S'+(n-1))+' DUR</span>';
  h+='<span class="g-echec">S'+n+' &#xC9;CHEC</span>';
  h+='</div>';
  h+='<div class="as-fs-rule">M&#xEA;me charge partout &#xB7; toutes les s&#xE9;ries &#xE0; '+x.rHi+'+, sans &#xE9;chec en S1'+(n>=3?'-S2':'')+' &#x2192; '+(inv?'moins d\'assistance':'la charge monte')+'</div>';
  h+='</div>';
  return h;
}
// Écran de série : « 🎯 Série 1 — 56 kg × 8–10 — vise OK »
function fsGoalHtml(x,setNo){
  var g=fsGoal(x,setNo); if(!g) return '';
  var inv=asIsInverse(x.key);
  var wHtml='<span id="as-fs-w">'+x.weight+' '+x.unite+'</span>'+(inv?' d\'assist.':'');
  var reps=g==='echec'?' &#xD7; max ('+x.rHi+'+ vis&#xE9;)':' &#xD7; '+fsRangeStr(x);
  return '<div class="as-fs-goal g-'+g+'">&#x1F3AF; S&#xE9;rie '+setNo+' &#x2014; '+wHtml+reps+' &#x2014; vise <strong>'+FS_GOAL_LBL[g]+'</strong>'
    +'<small>'+FS_GOAL_HINT[g]+'</small></div>';
}
// eDef/sDef optionnels : quand un même exo vit dans DEUX séances (ex. elev_lat en PUSH 4×10
// et en fin de PULL 3×12 — même clé, même historique), la définition de LA séance lancée fait foi.
function asMakeExo(key,extra,eDef,sDef){
  var e,st;
  if(eDef&&sDef){ e=eDef; st=sDef.t; }
  else{ var d=asExoDef(key); if(!d) return null; e=d.e; st=d.s.t; }
  var t=asParseSerie(e);
  // Évolution de charge en cours : le poids de départ = palier HAUT (il se travaille frais, 22/08)
  var ev=asEvoOf(key);
  // Fourchette de reps (système « une seule charge », 28/10) : le bas = la cible, le haut = rHi
  var rg=(!e.repTarget&&REP_RANGE[key])?REP_RANGE[key].r:null;
  return {key:key,name:e.name,img:e.img||null,cue:e.cue||'',bless:e.bless||'',
    tips:(e.tips||[]).slice(0,3),errs:(e.errs||[]).slice(0,2),
    unite:e.unite||'kg',cnt:e.cnt||null,rest:e.rest||60,inc:e.inc||1,repT:!!e.repTarget,uni:!!e.uni,
    n:t.n,reps:rg?rg[0]:t.reps,rHi:rg?rg[1]:null,w0:getCurrentWeight(key),weight:ev?ev.to:getCurrentWeight(key),
    evo:ev?{from:ev.from,to:ev.to,hi:Math.min(ev.hi||1,t.n)}:null,
    t:st,extra:!!extra,added:false,status:'pending',sets:[],
    sz:(typeof SAISON!=='undefined'&&SAISON.realIdAt(todayStr())==='seche')?'seche':undefined}; // saison RÉELLE de la séance (04/11)
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
function asEvoOf(key){ return (FEATURE_EVO&&DB.evolution&&DB.evolution[key])?DB.evolution[key]:null; }
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
  var to=(AS.suggestW&&AS.suggestW[key]!=null&&AS.suggestW[key]>curRef)?AS.suggestW[key]:curRef+(x.repT?x.inc:fsStep(x));
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
function asExoDeletable(x){ return liveExoSide(x)&&!x.legsPick&&!x.abdoPick; }
// Durée de séance (01/11, Adrien : « j'oublie parfois d'appuyer sur terminé ») : de la 1re série validée
// à la dernière (en cours de séance : jusqu'à maintenant). Les séries portent leur heure (s.t) ;
// une séance sans heures (avant le 01/11, reprise) garde l'ancien calcul depuis le début.
function asElapsedMin(){
  var ts=[]; (AS&&AS.exos||[]).forEach(function(x){ (x.sets||[]).forEach(function(st){ if(st.t) ts.push(st.t); }); });
  if(ts.length){
    var a=Math.min.apply(null,ts), b=AS.step==='exo'?Date.now():Math.max.apply(null,ts);
    return Math.max(1,Math.round((b-a)/60000));
  }
  return AS.startTs?Math.max(1,Math.round((Date.now()-AS.startTs)/60000)):0;
}
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
  return {start:start,cur:cur,delta:delta,execs:execs,series:series,reps:reps,estim:estim,measures:arr.length,atW:getSessionsAtWeight(key),lc:loadCount(key)};
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
    +'<div class="as-sb-foot">'+st.measures+' mesures' // les séries à la charge vivent dans la barre juste au-dessus (01/11)
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
    e.n=x.n||e.n; e.reps=x.reps||e.reps; e.rHi=x.rHi||null; // fourchette gravée : une vieille séance garde son barème
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
    e.n=x.n||e.n; e.reps=x.reps||e.reps; e.rHi=x.rHi||null; // fourchette gravée : une vieille séance garde son barème
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
  var ov=document.getElementById('asOverlay'); if(ov){ ov.classList.remove('open','as-exorest','as-mood-bad','as-mood-mid','as-mood-ok','as-mood-good','as-mood-top'); }
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
  if(!liveNotedExos(AS.exos).length||AS.sid==='sm') return ''; // cardio seul / routine maison (19/10) : pas de note
  var g=asGlobalScore();
  return g<8?'as-mood-bad':g<12?'as-mood-mid':g<14?'as-mood-ok':g<18?'as-mood-good':'as-mood-top';
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
    ov.classList.remove('as-exorest','as-mood-bad','as-mood-mid','as-mood-ok','as-mood-good','as-mood-top','as-t-push','as-t-pull','as-t-legs','as-t-maison');
    if(AS.step==='exo'&&AS.phase==='exorest') ov.classList.add('as-exorest');
    // DA (02/11) : le cadre et le halo prennent la couleur de la séance (da.css)
    var _sd=null; try{ _sd=DATA.find(function(x){ return x.id===AS.sid; }); }catch(e){}
    var _ty=_sd?_sd.t:(AS.sid==='sm'?'maison':''); _ty=_ty==='pull2'?'pull':(_ty==='others'||_ty==='bonus')?'maison':_ty;
    if(['push','pull','legs','maison'].indexOf(_ty)>=0) ov.classList.add('as-t-'+_ty);
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
  // 12/10 (demande Adrien) : la séance manuelle laisse la place à « Un autre sport ? » (course guidée,
  // foot, escalade…). Une séance existante se corrige toujours depuis le calendrier (✎ Modifier).
  h+='<button class="as-carte-link as-sport-link" onclick="asOtherSport()">&#x1F3C3; Un autre sport&#x202F;? <span class="as-lbl-hint">course, foot, escalade&#x2026;</span> &#x203A;</button>';
  h+='</div>';
  h+='<div class="as-foot"><button class="as-ghost-btn" onclick="asCancelSetup()">Annuler</button></div>';
  return h;
}
function asManualEntry(){ asCancelSetup(); edOpen(null); }
function asOtherSport(){ asCancelSetup(); if(typeof SPORT!=='undefined') SPORT.open(); }
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
// 27/10/2026 (demande Adrien) : jambes et abdo ne sont plus obligatoires à CHAQUE séance —
// seulement si la séance de salle précédente n'en avait pas (au moins 1 série faite).
// Séance précédente = dernier log de salle (hors course, autre sport, cardio seul, routine maison).
function asPrevSessionHas(){
  var legsKeys=asLegsKeys();
  var isLegs=function(k){ return rankGroupOf(k)==='Jambes'||legsKeys.indexOf(k)>=0; };
  var isAbdo=function(k){ var i=findExoIndex(k); return !!(i&&i.exo&&i.exo.cat==='abdo'); };
  var logs=(DB.logs||[]).slice().sort(function(a,b){return b.date.localeCompare(a.date)||((b.time||'').localeCompare(a.time||''));});
  for(var i=0;i<logs.length;i++){
    var l=logs[i];
    if(l.sport||logWeight(l)<=0) continue;
    if((l.sessions||[]).some(function(sid){return sid.indexOf('autre:')===0;})) continue;
    var r={legs:false,abdo:false};
    if(l.live&&l.live.exos){
      l.live.exos.forEach(function(x){
        if(!x.sets||!x.sets.length) return;
        if(isLegs(x.key)) r.legs=true;
        if(isAbdo(x.key)) r.abdo=true;
      });
    } else {
      (l.sessions||[]).forEach(function(sid){
        if(sid==='s3') r.legs=true;
        if(sid.indexOf('exo:')!==0) return;
        if(isLegs(sid.slice(4))) r.legs=true;
        if(isAbdo(sid.slice(4))) r.abdo=true;
      });
    }
    return r;
  }
  return {legs:false,abdo:false}; // aucune séance avant : les deux sont dus
}
// v3 (02/08) : l'exo jambes du jour est UN SEUL exo (sel.legsMain) et il est PRINCIPAL
// (il compte dans le /20). Les autres exos jambes se prennent en bonus comme le reste.
// 27/10 : dû seulement si la séance précédente n'avait pas de jambes (asPrevSessionHas) ;
// l'ancien anti-routine (même exo seul → un 2e en bonus) est retiré, seul le tag « dernière fois » reste.
function asLegsRequirement(){
  var sel=AS.sel;
  if(!sel.sid) return {ok:true,msg:''};
  var s=DATA.find(function(x){return x.id===sel.sid;});
  if(!s||(s.t!=='push'&&s.t!=='pull')) return {ok:true,msg:''};
  var _szL=typeof SAISON!=='undefined'&&SAISON.realIdAt(todayStr())==='seche'; // Sèche (04/11) : « plus de jambes » → à chaque séance
  if(!_szL&&asPrevSessionHas().legs) return {ok:true,msg:''};
  if(!sel.legsMain) return {ok:false,need:true,msg:_szL?'&#x1F9B5; S&#xE8;che&#x202F;: un exo jambes &#xE0; chaque s&#xE9;ance &#x2014; choisis <strong>ton exo jambes du jour</strong>.':'&#x1F9B5; Pas de jambes &#xE0; ta derni&#xE8;re s&#xE9;ance &#x2014; choisis <strong>ton exo jambes du jour</strong> pour valider celle-ci.'};
  return {ok:true,need:true,msg:''};
}
// ── Règle abdos (04/08) : toute séance PUSH/PULL/LEGS doit embarquer AU MOINS 1 exo abdo,
// choisi AU SETUP (remplace le rituel posture de fin — les étirements vivent dans Détente 🧘).
// 12/10/2026 (demande Adrien : « obligation d'un exo abdo par séance ») : vaut aussi à la carte, et l'exo
// abdo choisi devient PRINCIPAL et non supprimable (abdoPick, comme l'exo jambes du jour).
// 27/10 : dû seulement si la séance précédente n'avait pas d'abdo (asPrevSessionHas).
function asAbdoRequirement(){
  var sel=AS.sel;
  var s=sel.sid?DATA.find(function(x){return x.id===sel.sid;}):null;
  if(sel.sid&&(!s||s.t==='bonus')) return {ok:true,msg:''};
  if(asPrevSessionHas().abdo) return {ok:true,msg:''};
  var keys=(sel.extras||[]).slice();
  if(sel.legsMain) keys.push(sel.legsMain);
  if(s) s.exos.forEach(function(e){
    if(e.hidden) return;
    if(sel.chosen[e.key]!==false&&(sel.chosen[e.key]===true||!e.bonus)) keys.push(e.key);
  });
  var has=keys.some(function(k){ var i=findExoIndex(k); return !!(i&&i.exo&&i.exo.cat==='abdo'); });
  if(has) return {ok:true,need:true,msg:''};
  return {ok:false,need:true,msg:'&#x1F525; Pas d\'abdo &#xE0; ta derni&#xE8;re s&#xE9;ance &#x2014; choisis <strong>ton exo abdo du jour</strong> (relev&#xE9;s, crunch d&#xE9;clin&#xE9;, crunch lest&#xE9;, pallof, dead bug), il compte dans la note /20.'};
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
    // ── Bloc 2 (violet) : l'exo JAMBES du jour — UN principal, sur PUSH / PULL (obligatoire si la séance d'avant n'en avait pas, 27/10) ──
    if(isPP){
      var req=asLegsRequirement();
      h+='<div class="as-sec sec-req as-legs-zone'+(req.ok?' ok':'')+'" style="animation-delay:.06s">';
      h+='<div class="as-sec-head"><span>&#x1F9B5; Ton exo jambes du jour</span><span class="as-sec-lock">'+(req.need?'obligatoire aujourd\'hui':'facultatif')+'</span></div>';
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
  }
  // ── Bloc 3 (violet) : l'exo ABDO du jour — obligatoire si la séance d'avant n'en avait pas (27/10 ; avant : toute séance salle, règle 04/08),
  // à la carte comprise depuis le 12/10 ──
  if(!s||s.t!=='bonus'){
    var reqA0=asAbdoRequirement();
    h+='<div class="as-sec sec-req'+(reqA0.ok?' ok':'')+'" id="asAbdoZone" style="animation-delay:.12s">';
    h+='<div class="as-sec-head"><span>&#x1F525; Ton exo abdo du jour</span><span class="as-sec-lock">'+(reqA0.need?'obligatoire aujourd\'hui':'facultatif')+'</span></div>';
    h+='<div class="as-exo-picks">';
    asAbdoOptions().forEach(function(e){
      var onA=(sel.extras||[]).indexOf(e.key)>=0;
      h+='<button class="as-pick legs'+(onA?' on':'')+'" data-k="'+e.key+'" onclick="asToggleExtra(\''+e.key+'\',this)">'+e.name+'<span class="as-pick-tick">&#x2713;</span></button>';
    });
    h+='</div>';
    h+='<div class="as-legs-hint" id="asAbdoHint" '+(reqA0.ok?'style="display:none"':'')+'>'+reqA0.msg+'</div>';
    h+='</div>';
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
    if(sx.id==='sm') return; // ROUTINE MAISON (01/11, Adrien) : jamais proposée en complément — elle se lance seule depuis sa carte
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
// Exécutions RÉELLES (01/11, Adrien : « hip thrust, je ne l'ai jamais fait » — il était compté parce
// qu'il avait été mis dans une séance puis passé) : une séance détaillée compte un exo seulement s'il a
// au moins UNE série enregistrée ; une ancienne séance sans détail, seulement s'il y est coché à part (exo:).
function exoLastDone(key){
  var last=null;
  (DB.logs||[]).forEach(function(l){
    if(!l.date) return;
    var did=false;
    if(l.live&&l.live.exos) did=l.live.exos.some(function(x){ return x.key===key&&(x.sets||[]).length>0; });
    else did=(l.sessions||[]).indexOf('exo:'+key)>=0;
    if(did&&(!last||l.date>last)) last=l.date;
  });
  return last;
}
function asExoNeverDone(key){ return exoLastDone(key)===null; }
// Séances de salle passées depuis la dernière exécution réelle (null = jamais fait)
function exoSessionsSince(key){
  var last=exoLastDone(key); if(!last) return null;
  return (DB.logs||[]).filter(function(l){ return l.date>last&&rankLogIsSalle(l); }).length;
}
var EXO_STALE_SESSIONS=8; // « pas fait depuis longtemps » = 8 séances de salle ou plus sans lui (01/11, Adrien)
function asExoToRevisit(key){ var n=exoSessionsSince(key); return n===null||n>=EXO_STALE_SESSIONS; }
function asRevisitListHtml(opts,btn){
  var never=opts.filter(function(o){ return asExoNeverDone(o.e.key); });
  var old=opts.filter(function(o){ var n=exoSessionsSince(o.e.key); return n!==null&&n>=EXO_STALE_SESSIONS; })
    .sort(function(a,b){ return exoSessionsSince(b.e.key)-exoSessionsSince(a.e.key); });
  if(!never.length&&!old.length) return '<div class="as-bonus-empty">Tout a &#xE9;t&#xE9; fait r&#xE9;cemment &#x1F389;</div>';
  var h='';
  if(never.length){
    h+='<div class="as-lbl">&#x1F195; Jamais fait</div><div class="as-exo-picks">';
    never.forEach(function(o){ h+=btn(o.e); });
    h+='</div>';
  }
  if(old.length){
    h+='<div class="as-lbl">&#x23F3; Pas fait depuis '+EXO_STALE_SESSIONS+'+ s&#xE9;ances</div><div class="as-exo-picks">';
    old.forEach(function(o){ h+=btn(o.e).replace('<span class="as-pick-tick">','<em class="as-pick-last">'+exoSessionsSince(o.e.key)+' s&#xE9;ances</em><span class="as-pick-tick">'); });
    h+='</div>';
  }
  return h;
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
  DATA.forEach(function(sx){ if(sx.id!==AS.sel.sid&&sx.id!=='sm') chips.push({id:sx.id,lbl:sx.icon+' '+sx.name}); });
  var opts=asBonusOptions();
  // 01/11 (Adrien) : « Jamais fait » + « En retard » (presque tout y était) → une seule puce ⏳ :
  // jamais faits + pas faits depuis 8 séances de salle ou plus
  if(opts.some(function(o){return asExoToRevisit(o.e.key);})) chips.push({id:'stale',lbl:'&#x23F3;',title:'Jamais faits ou pas faits depuis '+EXO_STALE_SESSIONS+' s&#xE9;ances'});
  if(!chips.some(function(c){return c.id===f;})){ AS.sel.bFilter='all'; f='all'; }
  return chips.map(function(c){
    return '<button class="as-chip'+(f===c.id?' on':'')+'"'+(c.title?' title="'+c.title+'" aria-label="'+c.title+'"':'')+' onclick="asSetBFilter(\''+c.id+'\')">'+c.lbl+'</button>';
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
  if(f==='stale') return asRevisitListHtml(opts,pickBtn);
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
  // Exo abdo du jour (12/10) : le premier abdo de la séance est PRINCIPAL et non supprimable —
  // seulement quand il était dû (27/10) ; sinon il suit le choix 🎯 comme tout exo.
  var _ab=asAbdoRequirement().need?list.find(function(x){ var i=findExoIndex(x.key); return !!(i&&i.exo&&i.exo.cat==='abdo'); }):null;
  if(_ab){ _ab.abdoPick=true; _ab.main=true; }
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
  // Cardio (19/10, cardio.js) : un seul panneau type de machine + paliers remplace intro, chrono et saisie
  var cardio=exoIsCardio(x.key)&&(AS.phase==='intro'||AS.phase==='work'||AS.phase==='ask');
  if(cardio) fit=false;
  h+='<div class="as-scroll'+(AS.phase!=='intro'&&!cardio?' as-center':'')+(fit?' as-fit':'')+'" data-t="'+(x.t||'')+'">';
  if(cardio) h+=asCardioPanelHtml(x);
  else if(AS.phase==='intro') h+=asRenderIntro(x);
  else if(AS.phase==='work') h+=asRenderWork(x);
  else if(AS.phase==='ask') h+=asRenderAsk(x);
  else if(AS.phase==='rest') h+=asRenderRest(x,false);
  else if(AS.phase==='exorest') h+=asRenderRest(x,true);
  h+='</div>';
  h+=asDots();
  if(!cardio) h+=asExoFoot(x);
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
  var fsw=document.getElementById('as-fs-w'); if(fsw) fsw.textContent=x.weight+' '+x.unite;
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
  var fsw=document.getElementById('as-fs-w'); if(fsw) fsw.textContent=x.weight+' '+x.unite;
}
// Intro en 3 slides : présentation → conseils → erreurs à éviter
function asRenderIntro(x){
  asEvoSync(x);
  var h='<div class="as-intro">';
  if(AS.introIdx===0){
    var hasImg=x.img&&IMGS[x.img];
    h+='<div class="as-exo-kicker">Exercice '+(AS.cur+1)+'</div>';
    h+='<div class="as-exo-name xl">'+x.name+'</div>';
    h+='<div class="as-exo-target">'+x.n+' s&#xE9;rie'+(x.n>1?'s':'')+' &#xD7; '+(x.rHi?fsRangeStr(x)+' reps':cntFmt(x,x.reps))+(x.uni?'/c&#xF4;t&#xE9;':'')
      +(x.rest>0?' &#xB7; repos '+(x.rest>=90?formatTime(x.rest):x.rest+'s'):'')+'</div>';
    if(x.rHi) h+=fsPlanHtml(x);
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
    h+=lcLiveHtml(x);
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
    h+='<div class="as-serie-big"><span class="as-serie-lbl" style="color:var(--yellow)">S&#xC9;RIE BONUS</span><span class="as-serie-num"><b>'+Math.max(1,bn)+'</b></span>'
      +'<span class="as-serie-target">volume gratuit &#xB7; <span id="as-wchip">'+x.weight+' '+x.unite+'</span></span></div>';
  } else {
    // Exo « repTarget » compté dans son unité de charge (cardio en min) : objectif et chip diraient
    // deux fois la même chose (« objectif 20 min · 20 min ») → on n'en affiche qu'un.
    var _same=x.repT&&cntU(x)===x.unite;
    h+='<div class="as-serie-big"><span class="as-serie-lbl">S&#xC9;RIE</span><span class="as-serie-num"><b>'+AS.setIdx+'</b><em>/'+x.n+'</em></span>'
      +'<span class="as-serie-target">objectif <strong class="as-target-reps">'+(x.rHi?(AS.setIdx>=x.n?'max ('+x.rHi+'+)':fsRangeStr(x)+' reps'):cntFmt(x,x.reps))+'</strong>'+(x.uni?' par c&#xF4;t&#xE9;':'')
      +(_same?'<span id="as-wchip" hidden></span>':' &#xB7; <span id="as-wchip">'+x.weight+' '+x.unite+'</span>')+'</span></div>';
    h+=fsGoalHtml(x,AS.setIdx);
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
  var _fsG=fsGoal(x,p.setNo); // consigne de ressenti de cette série (S1 OK · intermédiaires DUR · dernière ÉCHEC)
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
      h+='<button class="as-feel'+(p.feelG===f.v?' on':'')+(f.v===_fsG?' goal':'')+'" onclick="asPendFeel(\''+f.v+'\',\'g\')"><span>'+f.ico+'</span>'+f.lbl+'</button>';
    });
    h+='</div>';
    h+='<div class="as-lbl" style="margin-top:.7rem;">C&#xF4;t&#xE9; DROIT &#x1F449; &#x2014; c\'&#xE9;tait comment ?</div>';
    h+='<div class="as-feel-row">';
    AS_FEELS.forEach(function(f){
      h+='<button class="as-feel'+(p.feelD===f.v?' on':'')+(f.v===_fsG?' goal':'')+'" onclick="asPendFeel(\''+f.v+'\',\'d\')"><span>'+f.ico+'</span>'+f.lbl+'</button>';
    });
    h+='</div>';
  } else {
    h+='<div class="as-lbl" style="margin-top:.9rem;">C\'&#xE9;tait comment ?</div>';
    h+='<div class="as-feel-row">';
    AS_FEELS.forEach(function(f){
      h+='<button class="as-feel'+(p.feel===f.v?' on':'')+(f.v===_fsG?' goal':'')+'" onclick="asPendFeel(\''+f.v+'\')"><span>'+f.ico+'</span>'+f.lbl+'</button>';
    });
    h+='</div>';
  }
  if(fsGoal(x,p.setNo)) h+='<div class="as-fs-defs">Facile = 4+ reps en r&#xE9;serve &#xB7; OK = 2-3 &#xB7; Dur = 1 &#xB7; &#xC9;chec = 0</div>';
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
  var set={reps:p.reps,feel:p.feel,w:x.weight,t:Date.now()}; // t : heure de validation (durée de séance)
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
  h+='<div class="as-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="var(--x-track)" stroke-width="7"/>'
    +'<circle id="as-ring-fg" cx="60" cy="60" r="54" fill="none" stroke="'+(inter?'var(--yellow)':'var(--sess-c,var(--acc))')+'" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(AS.restTotal?(C*(1-rem/AS.restTotal)).toFixed(1):0)+'" transform="rotate(-90 60 60)"/></svg>'
    +'<div class="as-ring-center"><div class="as-ring-time" id="as-rest-time">'+formatTime(rem)+'</div><div class="as-ring-sub">'+(inter&&nxt?'ensuite&#x202F;:':'prochaine s&#xE9;rie')+'</div></div></div>';
  if(inter&&nxt) h+='<div class="as-next-exo">&#x1F449; '+nxt.name+'</div>';
  else if(!inter) h+='<div class="as-next-exo dim">'+(x.bonusMode?'S&#xE9;rie bonus':'S&#xE9;rie '+AS.setIdx+'/'+x.n)+' &#xB7; '+x.weight+' '+x.unite+'</div>';
  // 01/11 (Adrien) : boutons d'abord, puis la barre de séries ; la bulle de stats « depuis tes débuts » est retirée du repos
  h+='<div class="as-rest-btns"><button class="as-ghost-btn" onclick="asAddRest(30)">+30s</button>'
    +(inter?'<button class="as-ghost-btn" onclick="asOneMoreSet()">&#x21BB; S&#xE9;ries bonus</button>':'')
    +'<button class="as-ghost-btn" onclick="asSkipRest()">Passer &#x23ED;</button></div>';
  h+=lcLiveHtml(inter?(nxt||null):x);
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
  DATA.forEach(function(sx){ if(sx.id==='sm'&&AS.sid!=='sm') return; sx.exos.forEach(function(e){
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
  if(opts.some(function(o){return asExoToRevisit(o.e.key);})) chips.push({id:'stale',lbl:'&#x23F3;',title:'Jamais faits ou pas faits depuis '+EXO_STALE_SESSIONS+' s&#xE9;ances'});
  if(!chips.some(function(c){return c.id===f;})){ _asAddFilter='all'; f='all'; }
  return chips.map(function(c){
    return '<button class="as-chip'+(f===c.id?' on':'')+'"'+(c.title?' title="'+c.title+'" aria-label="'+c.title+'"':'')+' onclick="asAddSetFilter(\''+c.id+'\')">'+c.lbl+'</button>';
  }).join('');
}
function asLiveAddListHtml(){
  var f=_asAddFilter;
  var opts=asLiveAddRestOpts();
  var h='';
  if(f==='stale') return asRevisitListHtml(opts,asAddPickBtn);
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
  if(x.abdoPick){ showToast('&#x1F525; L\'exo abdo du jour reste principal &#x2014; il est obligatoire.'); return; }
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
// Séances d'avant le 07/10 : la seule question était « douleur poignet 0-5 » (lv.pain). Un arrêt 🩹 sur un exo
// (x.pain) n'avait pas de zone → « zone non notée » (04/11, audit : il s'affichait « poignet » ou rien).
function liveLogPainStop(lv){ return !!(lv&&(lv.exos||[]).some(function(x){ return x&&x.pain; })); }
function liveLogPainAny(lv){ if(!lv) return null; if(lv.painAny!=null) return lv.painAny; if(liveLogPainStop(lv)) return true; if(lv.pain==null) return null; return lv.pain>0; }
function liveLogPains(lv){ if(!lv) return []; if(lv.pains) return lv.pains.map(function(p){return {z:p.z,lvl:p.lvl};}); var o=lv.pain>0?[{z:'poignet',lvl:lv.pain}]:[]; if(liveLogPainStop(lv)) o.push({z:'nr',lvl:0}); return o; }
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
    h+='<div class="as-lbl">&#x1F4CA; S&#xE9;ries &#xE0; ta charge actuelle <span class="as-lbl-hint">aujourd\'hui inclus &#xB7; objectif adapt&#xE9; &#xE0; chaque exo</span></div>';
    h+='<div class="as-execs">';
    doneEx.forEach(function(x){
      var lc=loadCount(x.key,x); if(!lc) return;
      h+='<div class="as-exec-row"><span class="as-exec-name">'+x.name+'</span><span class="as-exec-ct'+(lc.ratio>=0.75?' hot':'')+'">'+lc.done+' / '+lc.target+' s&#xE9;ries &#xE0; '+lc.lbl+'</span></div>';
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
function painZoneLabel(z){ if(z==='nr') return 'zone non notée'; for(var i=0;i<PAIN_ZONES.length;i++) if(PAIN_ZONES[i][0]===z) return PAIN_ZONES[i][1]; return z; }
function painZonesTxt(pains){ return (pains||[]).map(function(p){ return painZoneLabel(p.z).toLowerCase()+(p.lvl?' '+p.lvl+'/5':''); }).join(', '); }
// Journal du poignet (04/11, incohérence ③) : UNE entrée par jour (fusion par date inchangée), mais qui COMBINE les
// séances du jour — avant, une 2e séance le même jour écrasait la douleur de la 1re. byLog = la part de chaque séance
// (une séance reprise remplace la sienne) ; level = le plus haut, zones réunies (le plus haut par zone), notes à la suite.
function painLogPut(date,logId,part,resumed){
  if(!DB.painLog) DB.painLog=[];
  var e=DB.painLog.find(function(p){ return p.date===date; });
  if(!e){ e={date:date}; DB.painLog.push(e); }
  if(!e.byLog){ e.byLog={}; if(e.level!=null&&!resumed) e.byLog.avant={level:e.level,zones:e.zones||[],note:e.note||''}; }
  e.byLog[String(logId)]=part;
  var lv=0, zm={}, notes=[];
  Object.keys(e.byLog).forEach(function(k){ var b=e.byLog[k]; lv=Math.max(lv,b.level||0);
    (b.zones||[]).forEach(function(z){ zm[z.z]=Math.max(zm[z.z]||0,z.lvl||0); });
    if(b.note&&notes.indexOf(b.note)<0) notes.push(b.note); });
  e.level=lv; e.zones=Object.keys(zm).map(function(z){ return {z:z,lvl:zm[z]}; }); e.note=notes.join(' · ');
  DB.painLog.sort(function(a,b){return a.date.localeCompare(b.date);});
}
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
  AS.end.context=v; asSyncTimeCut(); asSave(); asRender();
}
// « Manque de temps » (03/11) : un exo écourté porte tc → sa note /5 se juge sur ses séries faites (asScoreExoRaw),
// gravé avec le log. Retiré dès que le contexte change.
function asSyncTimeCut(){
  var t=AS&&AS.end&&AS.end.context==='temps';
  (AS.exos||[]).forEach(function(x){ var d=(x.sets||[]).length; if(t&&d>0&&d<(x.n||3)) x.tc=true; else delete x.tc; });
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
// La RÉFÉRENCE suit la charge de travail vers le haut (01/11, bug signalé par Adrien depuis le 12/10 :
// pec deck à 54 en séance pendant 3 semaines, référence restée à 49 — le mode ⚡ Évolution la gelait).
// Exo en kg compté, toutes les séries prévues faites à au moins W (sa plus légère série), chacune au
// bas de la fourchette ou plus, série 1 pas à l'échec, W plus lourd que la référence (assistance :
// plus légère) → référence = W, sans clic. Une baisse reste une proposition du bilan.
function asAutoRefFollow(){
  var out={};
  (AS.exos||[]).forEach(function(x){
    if(x.repT||x.pain||exoIsCardio(x.key)||!/kg/.test(x.unite||'')) return;
    if(!liveExoCounted(x)) return;
    var n=x.n||3, sets=(x.sets||[]).slice(0,n); if(sets.length<n) return;
    var inv=asIsInverse(x.key);
    var ws=sets.map(function(s){ return s.w!=null?s.w:x.weight; });
    var W=inv?Math.max.apply(null,ws):Math.min.apply(null,ws);
    var ref=getCurrentWeight(x.key); if(ref==null||!(W>0)) return;
    if(!(inv?W<ref:W>ref)) return;
    if(sets.some(function(s){ return s.reps<x.reps; })) return;
    if(n>1&&sets[0].feel==='echec') return;
    asApplyWeight(x.key,W); out[x.key]={from:ref,to:W};
  });
  return out;
}
function asSaveAndReport(){
  var note=document.getElementById('asPainNote');
  if(note) AS.end.painNote=note.value;
  if(!AS.savedLogId){ asSyncTimeCut(); asPersistLog(); }
  // Évolutions de charge : évaluées UNE fois, au moment où le log est figé (15/08)
  if(!AS.evoResults){ try{ AS.evoResults=asEvoEvaluate(); }catch(e){ AS.evoResults=[]; } }
  if(!AS.autoRef){ try{ AS.autoRef=asAutoRefFollow(); }catch(e){ AS.autoRef={}; } }
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
    exos:AS.exos.map(function(x){return {key:x.key,w:x.weight,w0:x.w0,n:x.n,reps:x.reps,rHi:x.rHi||undefined,unite:x.unite,cnt:x.cnt||null,status:x.status,extra:!!(x.extra||x.added),main:!liveExoSide(x),sets:x.sets,sk:x.skippedSets||0,pain:!!x.pain,tc:x.tc||undefined,sz:x.sz||undefined,evo:x.evo?{from:x.evo.from,to:x.evo.to,hi:x.evo.hi}:null,cardio:x.cardio&&(x.sets||[]).length?x.cardio:undefined};}),
    pain:AS.end.pain,painAny:AS.end.painAny,pains:(AS.end.pains||[]).filter(function(p){return p.lvl;}),painNote:AS.end.painNote||'',
    context:AS.end.context||null,
    stretch:AS.end.stretch===true,
    // (rituel posture de fin supprimé le 04/08 — abdo obligatoire au setup + routines dans Détente)
    warmup:AS.warmupDone===true
  };
  try{ if(liveNotedExos(AS.exos).length&&AS.sid!=='sm'){ live.note20=asGlobalScore(); live.n20v=6; } }catch(e){} // n20v 6 = barème du 03/11 (pas de regravure) // la note /20 se grave ici, une fois pour toutes (cardio seul : pas de note, 19/10)
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
    painLogPut(prevLog?prevLog.date:todayStr(),logId,{level:AS.end.pain,zones:(AS.end.pains||[]).filter(function(p){return p.lvl;}),note:AS.end.painNote||''},!!prevLog);
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
// ── Barème v4 (28/10, choix d'Adrien) — exos dont le log porte x.rHi ──
// Qualité d'une série = ressenti × reps face au BAS de la fourchette. Séries 1 à n-1 : seul l'échec
// en SÉRIE 1 coûte (0,5 : charge mal choisie, même reps faites) — un DUR/ÉCHEC plus tard vient de
// la fatigue et la dernière série le dira. Dernière série = max de reps : l'échec y vaut plein,
// s'arrêter avant coûte un peu (dur 0,9 · ok 0,8 · facile 0,6).
// Reps : ≥ bas = 1 · à ≤ tolérance sous le bas = 0,8 (1 si dernière série à l'échec : c'est le max
// honnête) · plus loin = 0,5. Plus lourd que la référence en frôlant le bas = reps pleines.
// +1 rep ne baisse jamais la note.
// 03/11 (audit + Adrien : « bonne note = très bonne séance, mais le plan bien fait ne doit pas être mal noté ») :
// une série « facile » là où le plan demandait OK / DUR = charge trop légère → 0,9 / 0,85 (avant 1).
var FS_FEEL_Q={
  ok:{ok:1,dur:0.95,facile:0.9,echec:0.5},
  dur:{dur:1,ok:1,facile:0.85,echec:1},
  echec:{echec:1,dur:0.9,ok:0.8,facile:0.6}
};
function asSetQualityV4(x,s,setNo){
  var g=fsGoal(x,setNo)||'echec';
  var fq=(FS_FEEL_Q[g]&&FS_FEEL_Q[g][s.feel]!=null)?FS_FEEL_Q[g][s.feel]:0.8;
  var lo=x.reps, rq=1;
  if(lo&&s.reps<lo){
    var near=s.reps>=lo-setTol(lo);
    var sw=(s.w!=null?s.w:x.w)||0;
    var heavier=/kg/.test(x.unite||'')&&x.w0>0&&!asIsInverse(x.key)&&sw>x.w0;
    var hold=x.sz==='seche'&&s.reps>=lo-1&&/kg/.test(x.unite||'')&&x.w0>0&&(asIsInverse(x.key)?sw<=x.w0:sw>=x.w0); // Sèche (04/11) : MAINTIEN de la charge à 1 rep près = réussi
    rq=near?((g==='echec'&&s.feel==='echec')||heavier||hold?1:0.75):0.4; // 03/11 : 0,8 → 0,75 · 0,5 → 0,4 (reps sous la fourchette)
  }
  return fq*rq;
}
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
  else if(liveExoSide(x)||x._tc||x.tc){ n=Math.max(1,sets.length); } // ② bonus (ou écourté « manque de temps ») : jugé sur les séries faites
  var progLast=x.n||3; // rang de la dernière série PROGRAMMÉE (l'échec s'y garde, règle 14/08)
  var inv=asIsInverse(x.key);
  var isKg=/kg/.test(x.unite||'')&&x.w0>0;
  var qSum=0;
  var v4=!!x.rHi&&!exoIsCardio(x.key); // barème « une seule charge » (28/10)
  sets.forEach(function(s,si){
    if(v4){ qSum+=asSetQualityV4(x,s,si+1); return; }
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
  // v4 : pas de malus d'effondrement — les reps sous le bas de fourchette et les échecs trop tôt
  // sont déjà payés série par série (et le malus cassait « +1 rep ne baisse jamais la note »).
  if(!x.pain&&sets.length>=2&&!v4){
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
  // v4 : série 1 à l'échec = charge mal choisie → 4/5 max (le seul échec qui coûte, règle du
  // 28/10). Pas sur un arrêt douleur (la douleur explique la série).
  if(v4&&!x.pain&&sets.length>=2&&sets[0].feel==='echec'&&(x.n||3)>1) val=Math.min(val,4);
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
// Exos qui notent le /20, après les exemptions du 03/11 (demandes Adrien) :
// ① contexte « manque de temps » : un exo passé ne note pas, un exo écourté se juge sur ses séries FAITES
//    (comme un bonus) — « des fois j'ai juste pas beaucoup de temps, j'y vais avant le travail » ;
// ② abdo passé AVANT le 07/12 (RUN_REQ_START) : non noté (pas 0) — obligatoire et noté 0 dès le 07/12.
// Si tout est exempté, on garde la liste brute (la séance reste notée).
function liveGradedExos(list,ctx,date){
  var ex=liveNotedExos(list), d=date||todayStr();
  var out=ex.filter(function(x){
    var none=!(x.sets||[]).length||(x.status==='skipped'&&!liveExoCounted(x));
    if(!none) return true;
    if(ctx==='temps') return false;
    var i=findExoIndex(x.key);
    if(d<RUN_REQ_START&&i&&i.exo&&i.exo.cat==='abdo') return false;
    return true;
  }).map(function(x){
    if(ctx==='temps'&&(x.sets||[]).length<(x.n||3)) return Object.assign({},x,{_tc:true});
    return x;
  });
  return out.length?out:ex;
}
function asNote20From(list,ctx,date){
  var ex=liveGradedExos(list,ctx,date);
  if(!ex.length) return 0;
  var t=0, mn=5;
  ex.forEach(function(x){ var v=asScoreExoRaw(x); t+=v; if(v<mn) mn=v; });
  var g=Math.floor(t/ex.length*4+1e-9);
  if(g>=20&&mn<4.75) g=19;
  return Math.max(0,Math.min(20,g));
}
function asSessionDate(){ // date de la séance en cours (reprise d'un log = sa date d'origine)
  if(AS&&AS.resumeLogId){ var l=(DB.logs||[]).find(function(x){ return String(x.id)===String(AS.resumeLogId); }); if(l&&l.date) return l.date; }
  if(AS&&AS.savedLogId){ var m=(DB.logs||[]).find(function(x){ return String(x.id)===String(AS.savedLogId); }); if(m&&m.date) return m.date; }
  return todayStr();
}
function asGlobalScore(){
  // Le /20 se joue sur les exos PRINCIPAUX (liveNotedExos) : les bonus gardent leur note /5
  // affichée mais ne pèsent pas dans la note de séance — ils ne rapportent que des points.
  return asNote20From(AS.exos,AS.end&&AS.end.context,asSessionDate());
}
function asGradeInfo(g){
  // Paliers v5 (02/11) : < 8 · 8-11,5 · 12-13,5 · 14-17,5 · ≥ 18 — mêmes couleurs que toute l'app (--x-note-1..5)
  if(g<8) return {cls:'bad',emoji:'&#x1F62B;',title:'Tr&#xE8;s mauvaise s&#xE9;ance',anim:'shake'};
  if(g<12) return {cls:'mid',emoji:'&#x1F610;',title:'S&#xE9;ance en demi-teinte',anim:'none'};
  if(g<14) return {cls:'ok',emoji:'&#x1F44D;',title:'S&#xE9;ance correcte',anim:'pop'};
  if(g<18) return {cls:'good',emoji:'&#x1F4AA;',title:'Tr&#xE8;s bonne s&#xE9;ance',anim:'bounce'};
  return {cls:'top',emoji:'&#x1F3C6;',title:'S&#xE9;ance de champion',anim:'bounce'};
}
// Synthèse sous la note (03/11, audit) : mêmes paliers que le titre (asGradeInfo : 8 · 12 · 14 · 18) et des FAITS —
// combien d'exos tenus au plan (≥ 4,5/5), lesquels sont à reprendre (< 3,5/5). Plus de phrase toute faite
// (« séries pleines, exécution propre » s'affichait même un jour malade).
function asGradeSummary(g,doneCt,skipCt,total){
  var ex=[]; try{ ex=liveGradedExos(AS.exos,AS.end&&AS.end.context,asSessionDate()).map(function(x){ return {n:x.name||getExoName(x.key),v:asScoreExoRaw(x)}; }); }catch(e){}
  var top=ex.filter(function(e){ return e.v>=4.5; }).length, weak=ex.filter(function(e){ return e.v<3.5; }).sort(function(a,b){ return a.v-b.v; });
  var fact='<strong>'+top+'/'+(ex.length||total)+' exos au plan</strong>'+(skipCt?' &#xB7; '+skipCt+' pass&#xE9;'+(skipCt>1?'s':''):'');
  var fix=weak.length?' &#xC0; reprendre&#x202F;: '+weak.slice(0,3).map(function(e){ return e.n; }).join(', ')+'.':'';
  if(g<8) return fact+'.'+fix+' Trop loin de ton plan aujourd\'hui&#x202F;: m&#xEA;mes charges la prochaine fois, et vise S1 OK &#xB7; S2 dur &#xB7; derni&#xE8;re &#xE0; l\'&#xE9;chec.';
  if(g<12) return fact+'.'+fix+' La base est l&#xE0;, mais plusieurs exos sont sortis du plan.';
  if(g<14) return fact+'.'+fix+' Correct&#x202F;: quelques s&#xE9;ries sous la fourchette ou un &#xE9;chec trop t&#xF4;t.';
  if(g<18) return fact+'.'+(fix||' Plan tenu presque partout.');
  return fact+'.'+(fix||' Plan tenu sur toute la s&#xE9;ance.');
}
// Analyse v4 (28/10, règles d'Adrien) : hausse d'un cran quand TOUTES les séries atteignent le
// HAUT de la fourchette, à la même charge ≥ référence, sans échec en série 1 ni en série 2.
// Série 1 à l'échec sous le bas → un cran en dessous (au bas ou plus : charge à la limite, gardée).
function fsAnalyze(out,x,c){
  var n=c.n, lo=c.lo, hi=x.rHi, inv=c.inv, u=x.unite;
  var sets=c.sets.slice(0,n), ws=c.ws.slice(0,n);
  var step=fsStep(x), ref=x.w0;
  var wTxt=function(w){ return w+' '+u+(inv?' d\'assistance':''); };
  var lastS=c.fullSets?sets[n-1]:null;
  var s1=sets[0], s1Fail=n>1&&s1&&s1.feel==='echec';
  var block=fsBlockFails(x,sets);
  var under=sets.slice(0,n-1).filter(function(s){ return s.reps<lo; }).length;
  var belowTop=sets.filter(function(s){ return s.reps<hi; }).length;
  var sameW=ws.every(function(w){ return w===ws[0]; });
  // Charge de travail = la plus légère des séries (la plus forte assistance) : une série PLUS lourde
  // qui tient aussi le haut ne bloque pas la hausse (01/11, chest press 50·50·50·55×10) et une séance
  // volontairement sous la référence qui tient tout remonte d'un cran (01/11, incliné 4×10 à 22 kg).
  var base=(c.isKg&&ws.length)?(inv?Math.max.apply(null,ws):Math.min.apply(null,ws)):ref;
  if(s1Fail&&s1.reps<lo){
    out.tone='down';
    var msg='&#x1F4A5; S&#xE9;rie 1 &#xE0; l\'&#xE9;chec sous '+lo+' reps = charge trop lourde.';
    if(c.isKg&&ref>0){
      var w1=ws[0]!=null?ws[0]:ref;
      if(inv?w1<ref:w1>ref) msg+=' Reste &#xE0; <strong>'+wTxt(ref)+'</strong> (la r&#xE9;f&#xE9;rence).';
      else { out.suggest=-1; out.suggestTo=inv?ref+step:Math.max(0,ref-step); msg+=' Prochaine fois&#x202F;: <strong>'+wTxt(out.suggestTo)+'</strong>.'; }
    }
    out.lines.push(msg+' Note plafonn&#xE9;e &#xE0; 4/5.');
  } else if(c.fullSets&&!belowTop&&!block){
    out.tone='up';
    var nxt=(c.isKg&&base>0)?(inv?Math.max(0,base-step):base+step):null;
    var beyondRef=nxt!=null&&ref>0&&(inv?nxt<ref:nxt>ref);
    if(nxt==null||beyondRef){ out.suggest=1; if(nxt!=null) out.suggestTo=nxt; }
    out.lines.push('&#x1F680; Toutes les s&#xE9;ries &#xE0; '+hi+'+ &#xE0; '+wTxt(base)+(sameW?'':' (ou plus)')+' sans &#xE9;chec en S1'+(n>=3?'-S2':'')+'&#x202F;: la charge monte'
      +(nxt==null?'.':beyondRef?' &#x2192; <strong>'+wTxt(nxt)+'</strong> la prochaine fois (on repart vers '+lo+' reps).'
        :' &#x2192; <strong>'+wTxt(nxt)+'</strong> la prochaine fois'+(nxt===ref?' (ta r&#xE9;f&#xE9;rence)':' (ta r&#xE9;f&#xE9;rence reste '+wTxt(ref)+')')+'.'));
  } else if(c.fullSets&&!belowTop&&block){
    out.tone='good';
    out.lines.push('&#x1F3AF; Haut de fourchette partout, mais &#xE9;chec en S1'+(n>=3?' ou S2':'')+' &#x2192; pas encore pr&#xEA;t&#x202F;: on garde '+wTxt(ref)+'. La hausse viendra quand S1 finira &#xE0; OK et S2 &#xE0; DUR.');
  } else if(under){
    out.tone='mid';
    out.lines.push('&#x1F4C9; '+under+' s&#xE9;rie'+(under>1?'s':'')+' sous '+lo+' reps &#x2192; m&#xEA;me charge la prochaine fois.');
  } else if(c.fullSets){
    out.tone='good';
    out.lines.push('&#x2705; Dans la fourchette. Pour monter&#x202F;: '+hi+'+ sur toutes les s&#xE9;ries (ex. '+Array(n).fill(hi).join('-')+'), il en manque sur '+belowTop+' s&#xE9;rie'+(belowTop>1?'s':'')+'. Grappille +1 rep par s&#xE9;rie.');
  }
  if(s1Fail&&s1.reps>=lo) out.lines.push('&#x26A0;&#xFE0F; S&#xE9;rie 1 &#xE0; l\'&#xE9;chec&#x202F;: charge &#xE0; ta limite, pas pr&#xEA;t de monter. Elle doit finir &#xE0; OK (2-3 reps de marge). Note plafonn&#xE9;e &#xE0; 4/5.');
  else if(n>=3&&sets[1]&&sets[1].feel==='echec') out.lines.push('&#x26A0;&#xFE0F; S&#xE9;rie 2 &#xE0; l\'&#xE9;chec&#x202F;: pas encore pr&#xEA;t de monter. Vise DUR (1 rep en r&#xE9;serve).');
  if(lastS&&lastS.feel!=='echec') out.lines.push('&#x1F50B; Derni&#xE8;re s&#xE9;rie arr&#xEA;t&#xE9;e avant l\'&#xE9;chec&#x202F;: pousse-la jusqu\'au max de reps.');
  if(!sameW&&c.isKg) out.lines.push('&#x2696;&#xFE0F; Charges diff&#xE9;rentes d\'une s&#xE9;rie &#xE0; l\'autre ('+ws.join(' &#xB7; ')+') &#x2014; la r&#xE8;gle&#x202F;: la m&#xEA;me charge sur toutes les s&#xE9;ries.');
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
      ?(x.cardio?cardioSummary(x.cardio)+' &#x2014; hors note /20.':'&#x1F3C3; Cardio valid&#xE9; &#x2014; hors note /20.')
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
  var _lc=null; try{ _lc=loadCount(x.key); }catch(e){}
  var stag=_lc?_lc.ratio:0, stagTxt=_lc?_lc.done+' / '+_lc.target+' s&#xE9;ries &#xE0; '+_lc.lbl:'';
  var wUp=x.weight>x.w0, wDown=x.weight<x.w0;
  var unit=cntU(x)==='s'?'s':(cntU(x)==='min'?' min':' reps');

  // Monter le poids EN séance = un TEST DE CHARGE assumé (règle Adrien 04/08) : c'est sa façon
  // de grimper petit à petit, on ne l'engueule plus par principe. On juge le test sur les seules
  // séries faites AU nouveau poids : cible tenue ou frôlée (≤2 reps, même à l'échec) = test VALIDÉ.
  // Seul un vrai décrochage (3+ reps sous la cible au nouveau poids) = test prématuré, dit sans drame.
  var wUpVerdict=null;
  if(wUp&&!inv&&isKg&&tRep&&!x.rHi){ // v4 : pas de « test de charge » en séance, la hausse suit la double progression
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
  if(x.rHi){
    fsAnalyze(out,x,{n:n,lo:tRep,sets:sets,reps:reps,feels:feels,ws:ws,inv:inv,isKg:isKg,fullSets:fullSets,atRef:atRef,side:side});
  } else if(wUpVerdict==='test'||wUpVerdict==='fail'){
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
  if(softFails>0&&!fullSets&&!x.rHi){
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
  if(stag>=0.75&&out.suggest===1){
    out.lines.push('&#x23F3; '+stagTxt+' &#x2014; le signal est clair, la hausse est due.');
  } else if(stag>=1&&out.suggest===0&&out.tone!=='down'){
    out.lines.push(asPickFresh([
      '&#x23F3; '+stagTxt+'&#x202F;: l\'objectif est d&#xE9;pass&#xE9;. Si &#xE7;a coince, change d\'angle&#x202F;: tempo plus lent, +1 rep par s&#xE9;rie.',
      '&#x23F3; '+stagTxt+' &#x2014; micro-progression&#x202F;: +1 rep sur une s&#xE9;rie &#xE0; chaque s&#xE9;ance, la hausse suivra.']));
  }
  // ── Situations additionnelles (01/08 — enrichissement du moteur) ──
  // Cible littéralement explosée → proposer un saut de 2 crans
  if(!x.rHi&&fullSets&&allAtRef&&echecs===0&&tRep&&reps.every(function(r){return r>=tRep+3;})){
    out.suggest=1; out.suggestBig=true; out.tone='up';
    out.lines.push('&#x1F680;&#x1F680; Toutes les s&#xE9;ries &#xE0; +3 reps ou plus au-dessus de la cible &#x2014; ce poids est trop l&#xE9;ger pour toi&#x202F;: saute directement 2 crans.');
  }
  // Échec dès la série 1 : ne le signaler que s'il a COÛTÉ la suite (reps qui déclinent après).
  // L'échec est un état, pas un ratage (règle Adrien) — si les séries suivantes tiennent ou montent
  // (ex. 8·8·10·10), la 1re série à l'échec n'a rien cassé : on se tait.
  if(s1Fail&&!x.rHi){
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
        out.lines.push(x.rHi
          ?'&#x1F4CC; Plan pour la prochaine&#x202F;: '+(out.suggestTo!=null?out.suggestTo+' '+x.unite:'la r&#xE9;f&#xE9;rence ('+x.w0+' '+x.unite+')')+' sur toutes les s&#xE9;ries, <strong>'+fsRangeStr(x)+unit+'</strong>&#x202F;: S1 OK, s&#xE9;ries interm&#xE9;diaires DUR, derni&#xE8;re &#xE0; l\'&#xE9;chec. On rejuge l&#xE0;-dessus.'
          :'&#x1F4CC; Plan pour la prochaine&#x202F;: '+_plan+', '+n+' s&#xE9;ries, objectif <strong>'+tRep+unit+'</strong> par s&#xE9;rie, derni&#xE8;re s&#xE9;rie &#xE0; l\'&#xE9;chec honn&#xEA;te. On rejuge l&#xE0;-dessus.');
      }
    }
  }catch(e){}
  return asCoachTrim(out,x);
}
// ── Bilan « pertinent » (03/11, audit de ses 13 vrais bilans d'octobre — étape 5 du plan) ──
// Sous chaque exo : UNE ligne de verdict (la prochaine charge : 🚀 monte · ✅ garde · 📉 même charge · 💥 trop lourd ·
// 🎯 pas encore prêt), puis au plus 2 alertes qui changent vraiment quelque chose (échec S1/S2, cible manquée sans
// échec, gauche/droite, dernière série pas poussée, retour après 30 j, 1re fois, écourté, plan si note faible).
// Retiré : compteur ⏳ (ancien système, chiffres faux), phrases tournantes 📈, « bonne décision de baisser » (contredit
// la règle « même charge »), 🥵 / 🔁 / 🎢 / 🧩 / 🔑 / « gauche = droite », bonus hors note, doublons.
var COACH_VERDICT=['&#x1F4A5;','&#x1F680;','&#x1F3AF;','&#x1F4C9;','&#x2705;','&#x26A0;'];
var COACH_ALERT=['&#x26A0;&#xFE0F; S&#xE9;rie','&#x1F6A9;','&#x1F448;','&#x1F449;','&#x1F50B;','&#x267B;','&#x1F195;','&#x1F4AA; &#xC9;court&#xE9;','&#x1F4AA; ','&#x1F4CC;','&#x2696;&#xFE0F; Charges diff','&#x1FA79;','&#x1F3C3;'];
function asCoachTrim(out,x){
  if(!out||!out.lines||!out.lines.length) return out;
  var src=out.lines, verdict=null, alerts=[], seen={};
  src.forEach(function(l){
    if(seen[l]) return; seen[l]=1;
    if(/^&#x23F3;|^&#x1F4C8;|^&#x1F53D;|^&#x1F53C;|^&#x1F975;|^&#x1F501;|^&#x1F3A2;|^&#x1F9E9;|^&#x1F511;|^&#x2B50;|^&#x1F522;|^&#x2696;&#xFE0F; Gauche|^&#x1F44D;/.test(l)) return;
    var isV=!verdict&&COACH_VERDICT.some(function(p){ return l.indexOf(p)===0; })&&!/^&#x26A0;&#xFE0F; S&#xE9;rie/.test(l);
    if(isV){ verdict=l; return; }
    if(COACH_ALERT.some(function(p){ return l.indexOf(p)===0; })) alerts.push(l);
  });
  // « 💪 écourté » et « 💪 N/4 puis stop » disent la même chose : un seul
  var ec=false; alerts=alerts.filter(function(l){ if(l.indexOf('&#x1F4AA; ')!==0) return true; if(ec) return false; ec=true; return true; });
  out.lines=(verdict?[verdict]:[]).concat(alerts.slice(0,verdict?2:3));
  if(!out.lines.length) out.lines=src.slice(0,1);
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
