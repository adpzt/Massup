// ══════════════════════════════════════════════════
// BILAN DE LA SEMAINE — recap plein écran du lundi + déclaration nutrition
// (petits-déj = grosse importance, shakers = importance moyenne → RP au check hebdo)
// ══════════════════════════════════════════════════
var WR=null;
// La dernière semaine close (lundi→dimanche terminé) de la saison courante, non encore déclarée.
// Dès le DIMANCHE 20h (demande Adrien 02/08), la semaine qui se termine le soir même devient déclarable —
// aligné sur le check hebdo du rank (dimanche 20h).
// 09/11 (Adrien : « j'ai eu mon bilan alors que je n'avais pas pu tout rafraîchir ») : une semaine v5 n'est proposée
// qu'après un ↻ fait après son dimanche 20 h ET Yazio relu après ce ↻ (mêmes conditions que la gravure) — sinon
// wrWaitWeek() la renvoie et la page Bilan affiche « fais ↻ d'abord ».
function wrDataReady(ws){
  if(ws<NOTE_V5_START) return true;
  var sun20=new Date(rankAddDays(ws,6)+'T20:00:00').getTime(), r=noteRefreshAt();
  if(r<sun20) return false;
  return typeof INTAKE!=='undefined'&&INTAKE.ready&&INTAKE.ready()&&INTAKE.syncAt&&INTAKE.syncAt()>=r;
}
function wrPendingWeek(){ var w=wrPendingWeekRaw(); return w&&wrDataReady(w)?w:null; }
function wrWaitWeek(){ var w=wrPendingWeekRaw(); return w&&!wrDataReady(w)?w:null; }
function wrPendingWeekRaw(){
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
  if(!document.getElementById('weeklyRecapWidget')){ try{ BILAN.render(); }catch(e){} return; } // page Bilan v6 (bilan.js)
  var el=document.getElementById('weeklyRecapWidget'); if(!el) return;
  var h='';
  // (12/10) Abonnement push perdu, pas réparable sans un tap : on le dit en haut du Bilan
  // au lieu de laisser 2 jours sans rappel ni fin de repos, sans un mot
  if(_pushState&&_pushState.state==='lost'){
    var denied=_pushState.reason==='denied';
    h+='<button class="wr-widget" onclick="'+(denied?'openSettings()':'enablePushNotifications()')+'">'
      +'<span class="wr-w-ico">&#x1F515;</span>'
      +'<span class="wr-w-txt"><strong>Notifications coup&#xE9;es sur cet appareil</strong><br>'
      +'<small>'+(denied?'Bloqu&#xE9;es dans R&#xE9;glages iOS &#x203A; Notifications &#x203A; MASSUP'
        :'Rappels et fin de repos n\'arrivent plus &#x2014; touche ici pour les r&#xE9;activer')+'</small></span>'
      +'<span class="wr-w-arr">&#x203A;</span></button>';
  }
  if(typeof SPORT!=='undefined'&&SPORT.active()){
    h+='<button class="wr-widget" onclick="SPORT.resume()">'
      +'<span class="wr-w-ico">&#x1F3C3;</span>'
      +'<span class="wr-w-txt"><strong>Course en cours</strong><br><small>Touche pour reprendre &#x2014; et renseigner tes stats en rentrant</small></span>'
      +'<span class="wr-w-arr">&#x203A;</span></button>';
  }
  var wk=wrPendingWeek();
  if(wk){
    h+='<button class="wr-widget" onclick="wrOpen(\''+wk+'\')">'
      +'<span class="wr-w-ico">&#x1F4CA;</span>'
      +'<span class="wr-w-txt"><strong>Ton bilan de la semaine est pr&#xEA;t</strong><br>'
      +'<small>Semaine du '+formatDateFr(wk)+' &#x2014; d&#xE9;clare tes plats maison &amp; shakers, d&#xE9;couvre ton score</small></span>'
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
    if(!e||!e[field]) continue;
    c+=(typeof e[field]==='number')?e[field]:1; // `maison` compte les repas (0-2/jour)
  }
  return c;
}
// Plafond du compteur hebdo par case (12/10) : 14 plats maison (2/jour), 3 sorties course, 7 sinon
function nutTapMax(field){ return field==='maison'?14:field==='run'?3:7; }
// Tap = +1 sur la semaine (stocké en remplissant les jours lun→dim) · après 7, retour à 0.
function nutTapWeek(field){
  var monday=rankMonday(todayStr());
  var max=nutTapMax(field), per=field==='maison'?2:1;
  var next=(nutWeekCount(field,monday)+1)%(max+1);
  for(var i=0;i<7;i++){
    var d=rankAddDays(monday,i);
    var v=Math.max(0,Math.min(per,next-i*per));
    if(v>0){ ensureNutriDay(d)[field]=per>1?v:true; }
    else if(DB.nutrition[d]){ DB.nutrition[d][field]=per>1?0:false; pruneNutriDay(d); }
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
// Sorties course de la semaine (12/10) : séances « Un autre sport ? › Course » du calendrier
// + course sur tapis saisie dans le cardio d'un LiveUp (19/10, cardio.js)
function runWeekAuto(monday){
  var end=rankAddDays(monday,6);
  return (DB.logs||[]).filter(function(l){ return l.date>=monday&&l.date<=end&&cardioLogHasRun(l); }).length;
}
// Séances de la semaine avec au moins un exo ABDO compté (objectif « abdos » de la Sèche, 04/11 — automatique)
function abdoWeekAuto(monday){
  var end=rankAddDays(monday,6);
  return (DB.logs||[]).filter(function(l){
    if(l.date<monday||l.date>end) return false;
    if(l.live&&l.live.exos) return l.live.exos.some(function(x){ var i=findExoIndex(x.key); return i&&i.exo&&i.exo.cat==='abdo'&&liveExoCounted(x); });
    return (l.sessions||[]).some(function(sid){ if(sid.indexOf('exo:')!==0) return false; var i=findExoIndex(sid.slice(4)); return !!(i&&i.exo&&i.exo.cat==='abdo'); });
  }).length;
}
function renderBilanWeekNut(){
  if(!document.getElementById('bilanWeekNut')){ try{ BILAN.render(); }catch(e){} return; } // page Bilan v6 (bilan.js)
  var el=document.getElementById('bilanWeekNut'); if(!el) return;
  var monday=rankMonday(todayStr());
  var o=nutObjectives(monday); // v3 (12/10) : plat maison obj 10/14 · shaker obj 7 · courir obj 1
  var mai=nutWeekCount('maison',monday), shk=nutWeekCount('shaker',monday);
  var run=Math.max(nutWeekCount('run',monday),runWeekAuto(monday));
  el.innerHTML='<div class="wn-card">'
    +'<div class="wn-title">Cette semaine <span class="wn-hint">tape pour ajouter &#xB7; confirm&#xE9; au bilan du dimanche</span></div>'
    +'<div class="wn-row">'
    +'<button class="wn-tile'+(mai>0?' on':'')+(mai>=o.maison?' full':'')+'" onclick="nutTapWeek(\'maison\')">'
    +'<span class="wn-ico">&#x1F372;</span><span class="wn-count">'+mai+'<small>/'+o.maisonMax+'</small></span><span class="wn-lbl">plats maison<em class="wn-obj">obj. '+o.maison+'</em></span></button>'
    +'<button class="wn-tile'+(shk>0?' on':'')+(shk>=o.shk?' full':'')+'" onclick="nutTapWeek(\'shaker\')">'
    +'<span class="wn-ico">'+o.shkIco+'</span><span class="wn-count">'+shk+'<small>/7</small></span><span class="wn-lbl">cr&#xE9;atine<em class="wn-obj">obj. '+o.shk+'</em></span></button>'
    +'<button class="wn-tile'+(run>0?' on':'')+(run>=o.run?' full':'')+'" onclick="nutTapWeek(\'run\')">'
    +'<span class="wn-ico">&#x1F3C3;</span><span class="wn-count">'+run+'<small>/'+o.run+'</small></span><span class="wn-lbl">courir<em class="wn-obj">'+(monday>=RUN_REQ_START?'obligatoire':'obj. '+o.run)+'</em></span></button>'
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
// ── Objectifs hebdo v3 (12/10/2026, demande Adrien — « je me laisse aller niveau bouffe ») :
// 🍲 PLAT MAISON (midi + soir = 14 repas/sem, objectif 10, champ `maison` = 0-2 par jour) ·
// 🥤 SHAKER whey + créatine OBLIGATOIRE (objectif 7, même champ `shaker`, il pèse lourd) ·
// 🏃 COURIR 1×/sem (champ `run`, ou séance « course » auto). Tout entre dans la note.
// Les semaines d'avant gardent leur barème (une note ne change jamais par recalcul).
var NUT_V3_START='2026-10-12';
// 01/11/2026 (demandes Adrien) — règles datées, jamais rétroactives :
// · dès la semaine du 02/11 : journée sous 1 000 pas = −0,5 pt sur la note de semaine ; 3 séances = rouge (4 = vert) ;
// · dès la semaine du 07/12 (1er lundi de décembre) : courir 1×/semaine OBLIGATOIRE (sans sortie : −1 pt de plus).
var STEP_BLOOD_START='2026-11-02', FREQ_STRICT_START='2026-11-02', RUN_REQ_START='2026-12-07';
// 09/11 (Adrien : « trop sévère — douleurs, corps fragile, je préfère écouter mon corps ») : une séance sous l'objectif
// = 3,5/5 d'assiduité (avant 2,5) → 3/4 avec une qualité parfaite = 8,5/10 en Salle. Dès la semaine du 02/11 (pas encore
// gravée le 09/11 ; une note gravée ne change jamais). La barre de fréquence 3/4 redevient grise (fin du « rouge strict »).
var ASSID_SOFT_START='2026-11-02';
function nutObjectives(ws){
  if(!ws||ws>=NUT_V3_START) return {v:3,maison:10,maisonMax:14,shk:7,shkLbl:'cr&#xE9;atine',shkIco:'&#x1F964;',run:1,pdj:0,cardio:0};
  var v2=ws>=NUT_V2_START;
  return v2?{v:2,pdj:5,shk:5,shkLbl:'cr&#xE9;atine',shkIco:'&#x1F9EA;',cardio:3}
           :{v:1,pdj:4,shk:2,shkLbl:'shakers',shkIco:'&#x1F964;',cardio:2};
}
// Barèmes d'époque v1-v3 (calcul) — l'affichage passe par bilanNoteWeek (gravure + v5) ci-dessous
function bilanNoteWeekCalc(ws){
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
  // v3 (12/10) : assiduité /6 · exécution /6 · shaker /3 · plats maison /2 · courir /1 · pas /2.
  // Sans données de pas : calculée sur 18 puis ramenée sur 20 (zéro pénalité à l'aveugle).
  if(o.v===3){
    var mai=ans?(ans.maison||0):nutWeekCount('maison',ws);
    var run=ans?(ans.run||0):Math.max(nutWeekCount('run',ws),runWeekAuto(ws));
    var r1=function(x){ return Math.round(x*10)/10; };
    var a3=vRatio*6, e3=(avg!=null?avg/20:vRatio)*6;
    var sS=Math.min(1,shk/o.shk)*3, sM=Math.min(1,mai/o.maison)*2, sR=Math.min(1,run/o.run)*1;
    var sw3=typeof STEPS!=='undefined'?STEPS.week(ws):null, p3=typeof STEPS!=='undefined'?STEPS.weekPts(ws,2):null;
    var raw3=a3+e3+sS+sM+sR+(p3!=null?p3:0);
    var base3=p3!=null?raw3:raw3*20/18;
    var blood=(ws>=STEP_BLOOD_START&&typeof STEPS!=='undefined'&&STEPS.bloodDays)?STEPS.bloodDays(ws):0;
    var runReq=ws>=RUN_REQ_START, runMiss=runReq&&run<1?1:0;
    var mal3=blood*0.5+runMiss;
    return {v:3,note:Math.max(0,Math.round((base3-mal3)*2)/2),blood:blood,runReq:runReq,runMiss:runMiss,pA:r1(a3),pE:r1(e3),pS:r1(sS),pM:r1(sM),pR:r1(sR),pN:r1(sS+sM+sR),
      pP:p3,stepAvg:sw3?sw3.avg:null,salle:salle.length,goal:goal,avg:avg,maison:mai,shk:shk,run:run,pdj:0,declared:!!ans};
  }
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
// ══ NOTATION v5 + GRAVURE (03/11/2026, plan validé par Adrien le 02/11) ══
// Semaine = Salle /10 (assiduité /5 sur weekValue : objectif → 5 · −1 → 2,5 (3,5 dès le 02/11) · −2 → 1 ; qualité /5 = moyenne des /20 ÷ 4)
//         + Nutrition /6 (jours ≥ 2 600 kcal /3 · jours ≥ 135 g de protéines /2 · shaker 7/7 /1 — vraies données Yazio)
//         + Activité /4 (pas /2 · nuits ≥ 7 h /1 · course /1 SEULEMENT dès le 07/12 — avant : note sur 19 ramenée à 20 ;
//           ensuite, pas de course = 0/1, sans malus en plus) ; donnée manquante = 0.
// Malus : −0,5 sans pesée dans la semaine · −0,5 par jour < 1 000 pas DÈS LE 07/12 (comme la course) ;
//         plus de malus « muscle en rouge sang » (03/11).
// 03/11 (Adrien) : la v5 s'applique dès la semaine du lundi 26/10 — cette semaine-là est recalculée (ses éventuelles
// gravures d'un autre barème sont ignorées, voir noteGravOf). Avant le 26/10 : barèmes d'époque (v1-v3), gravés tels quels.
// GRAVURE v5 : le LUNDI matin (≥ 5 h) qui suit la semaine, et seulement si un ↻ (raccourci Santé : Yazio + pas) a été
// fait après le dimanche 20 h ET que Yazio a été relu après ce ↻ ; ensuite la note ne bouge PLUS JAMAIS.
// Jamais gravée avant que les données cloud soient chargées (pas de zéros gravés sur un appareil neuf).
var NOTE_V5_START='2026-10-26';
var NOTE_V5={kcalDay:2600,protDay:135,sleepMin:420};
function noteWeekClosed(ws){ return Date.now()>=new Date(rankAddDays(ws,6)+'T20:00:00').getTime(); }
function noteRefreshAt(){ try{ return Number(localStorage.getItem('massup_refreshAt'))||0; }catch(e){ return 0; } }
function noteCanGrave(ws){
  if(typeof _cloudPullOk==='undefined'||!_cloudPullOk) return false;
  if(typeof SAISON!=='undefined'&&SAISON.previewAt(ws)) return false; // aperçu de la Sèche : rien ne se grave (04/11)
  if(ws<NOTE_V5_START) return true; // anciennes semaines : stables, gravées dès que le cloud est chargé
  if(Date.now()<new Date(rankAddDays(ws,7)+'T05:00:00').getTime()) return false; // à partir du lundi matin
  var sun20=new Date(rankAddDays(ws,6)+'T20:00:00').getTime(), r=noteRefreshAt();
  if(r<sun20) return false; // il faut un ↻ fait après le dimanche 20 h
  if(!(typeof INTAKE!=='undefined'&&INTAKE.ready&&INTAKE.ready()&&INTAKE.syncAt&&INTAKE.syncAt()>=r)) return false; // Yazio relu après ce ↻
  return true;
}
// Gravure valable : pour une semaine v5, seule une gravure v5 compte (une gravure d'un autre barème est ignorée)
function noteGravValid(ws,g){
  if(!g||g.note==null) return false;
  if(ws>=NOTE_V5_START&&g.v!==5) return false;
  if(ws>=NOTE_REGRADE_FROM&&ws<'2026-11-02'&&g.rgv!==2) return false; // gravée avant la regravure du 03/11
  if(ws>=ASSID_SOFT_START&&ws<'2026-11-09'&&g.asv!==2) return false; // 09/11 (Adrien : « depuis la semaine dernière ») : semaine du 02/11 gravée avec l'ancienne assiduité → regravée une fois
  return true;
}
function noteGravOf(ws){
  var g=DB.noteGrav&&DB.noteGrav[ws];
  return noteGravValid(ws,g)?g:null;
}
// ── REGRAVURE du 03/11 (accord explicite d'Adrien dans le chat : « tu peux changer la note de la semaine dernière
// aussi… avec le nouveau système ») : les séances depuis le lundi 26/10 sont re-notées avec le barème du 03/11
// (asSetQualityV4 durci, voir FS_FEEL_Q) ; l'ancienne note est gardée dans live.note20Prev. Une seule fois par
// séance (live.n20v = 6). Les semaines ≥ 26/10 se regravent ensuite (rgv 2). Rien avant le 26/10 ne bouge.
var NOTE_REGRADE_FROM='2026-10-26';
function noteRegrade(){
  var n=0;
  (DB.logs||[]).forEach(function(l){
    if(!l||!l.live||l.date<NOTE_REGRADE_FROM||l.live.n20v>=6||l.live.note20==null||!l.live.exos) return;
    // Séances d'avant le barème « une seule charge » (28/10) : jugées elles aussi avec la fourchette (REP_RANGE) et le plan
    // S1 OK · S2-S3 DUR · dernière à l'échec — c'est « le nouveau système » demandé (ex. pec deck 27/10 : échec aux 4 séries).
    l.live.exos.forEach(function(x){
      var R=REP_RANGE[x.key];
      if(x&&!x.rHi&&R&&!exoIsCardio(x.key)){ x.rHiPrev=null; x.repsPrev=x.reps; x.reps=R.r[0]; x.rHi=R.r[1]; }
    });
    var nv=asNote20From(l.live.exos);
    l.live.note20Prev=l.live.note20; l.live.note20=nv; l.live.n20v=6; n++;
  });
  if(n) saveDB();
  return n;
}
// Re-notation « manque de temps » (04/11, demande Adrien : « fais-le, comme ça c'est fait ») : les séances PASSÉES
// déclarées « manque de temps » (et les abdos passés avant le 07/12) reçoivent l'exemption du 03/11. Seul l'ÉCART dû à
// l'exemption s'ajoute à la note gravée (les séances de septembre gardent leur barème d'époque). Une fois par séance
// (live.n20x = 1), ancienne note dans live.note20Prev. Les semaines déjà gravées ne bougent pas.
// Durées gonflées (04/11, audit des bilans) : avant l'horodatage des séries, la durée = ouverture → enregistrement ;
// l'app restée ouverte donnait 250 ou 322 min. Une séance de plus de 3 h sans séries horodatées perd sa durée
// (valeur gardée dans durationRaw). Depuis, asElapsedMin mesure de la 1re à la dernière série.
function fixLongDurations(){
  var n=0;
  (DB.logs||[]).forEach(function(l){
    if(!l||!(l.duration_min>180)||l.durationRaw!=null) return;
    var hasT=l.live&&(l.live.exos||[]).some(function(x){ return (x.sets||[]).some(function(st){ return st.t; }); });
    if(hasT) return;
    l.durationRaw=l.duration_min; l.duration_min=null; n++;
  });
  if(n) saveDB();
  return n;
}
function noteRegradeTemps(){
  var n=0, ch=0;
  (DB.logs||[]).forEach(function(l){
    if(!l||!l.live||l.live.n20x||l.live.note20==null||!l.live.exos||!liveNotedExos(l.live.exos).length) return;
    var ctx=l.live.context||null;
    if(ctx==='temps') l.live.exos.forEach(function(x){ var d=(x.sets||[]).length; if(d>0&&d<(x.n||3)) x.tc=true; });
    var plain=l.live.exos.map(function(x){ var c=Object.assign({},x); delete c.tc; return c; });
    var delta=asNote20From(l.live.exos,ctx,l.date)-asNote20From(plain,null,'9999-12-31');
    if(delta>0){ if(l.live.note20Prev==null) l.live.note20Prev=l.live.note20; l.live.note20=Math.min(20,l.live.note20+delta); ch++; }
    l.live.n20x=1; n++;
  });
  if(n) saveDB();
  return ch;
}
function bilanNoteWeek(ws){
  var g=noteGravOf(ws);
  if(g) return g;
  var B=ws>=NOTE_V5_START?bilanNoteWeekV5(ws):bilanNoteWeekCalc(ws);
  if(noteWeekClosed(ws)&&noteCanGrave(ws)){
    if(!DB.noteGrav) DB.noteGrav={};
    var copy=JSON.parse(JSON.stringify(B)); copy.graved=1; copy.at=Date.now(); copy.rgv=2; copy.asv=2;
    DB.noteGrav[ws]=copy; saveDB();
    return copy;
  }
  return B;
}
function bilanNoteWeekV5(ws){
  var we=rankAddDays(ws,6), t=todayStr(), r1=function(x){ return Math.round(x*10)/10; };
  var logs=(DB.logs||[]).filter(function(l){ return l.date>=ws&&l.date<=we; });
  var ans=DB.rank&&DB.rank.weekly&&DB.rank.weekly[ws];
  // Salle /10
  var v=weekValue(logs), goal=gelWeekGoal(ws);
  var pts=[[0,0],[goal-2,1],[goal-1,ws>=ASSID_SOFT_START?3.5:2.5],[goal,5]], pA=0;
  if(v>=goal) pA=5; else for(var i=1;i<pts.length;i++){ if(v<=pts[i][0]){ var a=pts[i-1],b=pts[i]; pA=v<=a[0]?a[1]:a[1]+(b[1]-a[1])*(v-a[0])/(b[0]-a[0]); break; } }
  pA=Math.max(0,pA);
  var notes=logs.map(liveLogNote20).filter(function(n){ return n!=null; });
  var avg=notes.length?notes.reduce(function(s,n){ return s+n; },0)/notes.length:null;
  var pQ=avg!=null?Math.min(5,avg/4):0;
  // Nutrition /6 (Yazio) — seuils de la SAISON (04/11) : masse ≥ 2 600 kcal · ≥ 135 g P ; Sèche 2 100-2 600 kcal (le déficit) · ≥ 150 g P
  var SZ=(typeof SAISON!=='undefined')?SAISON.cfg(ws):null, NZ=SZ?SZ.note:{kcalLo:NOTE_V5.kcalDay,kcalHi:null,protDay:NOTE_V5.protDay};
  var kd=0, pd=0;
  for(var d=0;d<7;d++){ var day=rankAddDays(ws,d); if(day>t) break;
    var k=typeof INTAKE!=='undefined'?INTAKE.val(day,'kcal'):null, p=typeof INTAKE!=='undefined'?INTAKE.val(day,'prot'):null;
    if(k!=null&&k>=NZ.kcalLo&&(NZ.kcalHi==null||k<=NZ.kcalHi)) kd++; if(p!=null&&p>=NZ.protDay) pd++; }
  var shk=ans?(ans.shaker||0):nutWeekCount('shaker',ws);
  var pK=kd/7*3, pP=pd/7*2, pS=Math.min(1,shk/7);
  // Activité /4
  var pSteps=typeof STEPS!=='undefined'?STEPS.weekPts(ws,2):null, sw=typeof STEPS!=='undefined'?STEPS.week(ws):null;
  var run=ans?(ans.run||0):Math.max(nutWeekCount('run',ws),runWeekAuto(ws));
  var nights=0; for(var n=0;n<7;n++){ var nk=rankAddDays(ws,n-1), e=(DB.sleepLog||{})[nk], m=e&&typeof SLEEP!=='undefined'?SLEEP._duration(e.bed,e.wake):null; if(m!=null&&m>=NOTE_V5.sleepMin) nights++; }
  var pR=run>=1?1:0, pN=nights/7;
  // Malus
  var malus=[];
  // −0,5 par jour < 1 000 pas : seulement dès la semaine du 07/12, comme la course (Adrien, 03/11)
  if(ws>=RUN_REQ_START&&typeof STEPS!=='undefined'){ for(var s=0;s<7;s++){ var sd=rankAddDays(ws,s); if(sd>=t) break; var sv=STEPS.stepsOf(sd);
    if(sv!=null&&sv<1000) malus.push({l:new Date(sd+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})+' · '+Math.round(sv).toLocaleString('fr-FR')+' pas',p:0.5}); } }
  var runOn=ws>=RUN_REQ_START, runMiss=runOn&&run<1;
  if(noteWeekClosed(ws)&&!(DB.bodyWeight||[]).some(function(b){ return b.date>=ws&&b.date<=we; })) malus.push({l:'Aucune pesée dans la semaine',p:0.5});
  var mal=malus.reduce(function(a,m){ return a+m.p; },0);
  var raw=pA+pQ+pK+pP+pS+(pSteps||0)+pN+(runOn?pR:0), tot=runOn?raw:raw*20/19;
  var pil=[
    {k:'salle',i:'🏋️',l:'Salle',m:10,c:[['Assiduité',fmtSeances(v)+'/'+goal+' séances',pA,5],['Qualité',avg!=null?'moy. '+String(r1(avg)).replace('.',',')+'/20':'pas de note',pQ,5]]},
    {k:'nut',i:'🍽️',l:'Nutrition',m:6,c:[[NZ.kcalHi!=null?'Jours dans le déficit ('+NZ.kcalLo.toLocaleString('fr-FR')+'-'+NZ.kcalHi.toLocaleString('fr-FR')+' kcal)':'Jours ≥ '+NZ.kcalLo.toLocaleString('fr-FR')+' kcal',kd+'/7',pK,3],['Jours ≥ '+NZ.protDay+' g de protéines',pd+'/7',pP,2],['Créatine',shk+'/7',pS,1]]},
    {k:'act',i:'👟',l:'Activité',m:runOn?4:3,c:[['Pas',sw&&sw.sum?Math.round(sw.sum).toLocaleString('fr-FR')+'/50 000':'non renseignés',pSteps||0,2],['Nuits ≥ 7 h',nights+'/7',pN,1]].concat(runOn?[['Course',(run>=1?1:0)+'/1',pR,1]]:[])}
  ];
  pil.forEach(function(P){ P.c=P.c.map(function(c){ return [c[0],c[1],r1(c[2]),c[3]]; }); P.p=r1(P.c.reduce(function(a,c){ return a+c[2]; },0)); });
  return {v:5,sz:SZ?SZ.id:'masse',note:Math.max(0,Math.min(20,Math.round((tot-mal)*2)/2)),pil:pil,malus:malus,scaled:runOn?0:1,
    salle:v,goal:goal,avg:avg,stepAvg:sw?sw.avg:null,shk:shk,run:run,maison:ans?(ans.maison||0):nutWeekCount('maison',ws),
    kcalDays:kd,protDays:pd,nights:nights,blood:malus.filter(function(m){ return /pas$/.test(m.l); }).length,runReq:runOn,runMiss:runMiss,declared:!!ans};
}
// Détail commun à toutes les versions (écran « pourquoi j'ai X ») : 3 piliers + malus
function noteWeekDetail(B){
  if(B.v===5) return {pil:B.pil,malus:B.malus};
  var r=function(x){ return x==null?0:x; };
  if(B.v===3) return {pil:[
      {i:'🏋️',l:'Salle',m:12,p:r(B.pA)+r(B.pE),c:[['Assiduité',fmtSeances(B.salle)+'/'+B.goal+' séances',r(B.pA),6],['Exécution',B.avg!=null?'moy. '+String(Math.round(B.avg*10)/10).replace('.',',')+'/20':'pas de LiveUp',r(B.pE),6]]},
      {i:'🍽️',l:'Nutrition',m:6,p:r(B.pS)+r(B.pM)+r(B.pR),c:[['Créatine',B.shk+'/7',r(B.pS),3],['Plats maison',B.maison+'/14',r(B.pM),2],['Courir',B.run+'/1',r(B.pR),1]]},
      {i:'👟',l:'Pas',m:2,p:r(B.pP),c:[['Pas',B.stepAvg!=null?'moy. '+Math.round(B.stepAvg).toLocaleString('fr-FR')+' / j':'non renseignés',r(B.pP),2]]}],
    malus:(B.blood?[{l:B.blood+' journée'+(B.blood>1?'s':'')+' sous 1 000 pas',p:B.blood*0.5}]:[]).concat(B.runMiss?[{l:'Course obligatoire non faite',p:1}]:[])};
  return {pil:[
      {i:'🏋️',l:'Salle',m:14,p:r(B.pA)+r(B.pE),c:[['Assiduité',fmtSeances(B.salle)+'/'+B.goal+' séances',r(B.pA),7],['Exécution',B.avg!=null?'moy. '+String(Math.round(B.avg*10)/10).replace('.',',')+'/20':'pas de LiveUp',r(B.pE),7]]},
      {i:'🍽️',l:'Nutrition',m:3,p:r(B.pN),c:[['Petit-déj + shaker',B.pdj+' · '+B.shk,r(B.pN),3]]},
      {i:'👟',l:'Pas',m:3,p:r(B.pP),c:[['Pas',B.stepAvg!=null?'moy. '+Math.round(B.stepAvg).toLocaleString('fr-FR')+' / j':'non renseignés',r(B.pP),3]]}],malus:[]};
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
  if(!document.getElementById('bilanNotes')){ try{ BILAN.render(); }catch(e){} return; } // page Bilan v6 (bilan.js)
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
  var tm=nutWeekCount('maison',weekStart), tr=Math.max(nutWeekCount('run',weekStart),runWeekAuto(weekStart));
  var v3=nutObjectives(weekStart).v===3;
  WR={week:weekStart,we:rankAddDays(weekStart,6),idx:0,replay:!!replay,saved:!!prev,v3:v3,
      pdj:prev?prev.pdj:(tp>0?tp:null),shaker:prev?prev.shaker:(ts>0?ts:null),
      cardio:prev?(prev.cardio||0):tc,
      maison:prev?(prev.maison!=null?prev.maison:null):(tm>0?tm:null),
      run:prev?(prev.run||0):tr,
      tracked:!prev&&(tp>0||ts>0||tm>0)};
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
function wrMissing(){ return WR.v3?(WR.maison===null||WR.shaker===null):(WR.pdj===null||WR.shaker===null); }
function wrSubmit(){
  if(wrMissing()){ showToast('R&#xE9;ponds aux deux questions !'); return; }
  if(!DB.rank) DB.rank={pauses:[]};
  if(!DB.rank.weekly) DB.rank.weekly={};
  DB.rank.weekly[WR.week]=WR.v3?{v:3,maison:WR.maison,shaker:WR.shaker,run:WR.run||0}
    :{pdj:WR.pdj,shaker:WR.shaker,cardio:WR.cardio||0};
  saveDB();
  WR.saved=true;
  try{ WR.A=wrAnalyze(WR.week); }catch(e){}
  wrGoto(5);
}
var _wrDir='fwd';
function wrGoto(i){ _wrDir=i<WR.idx?'back':'fwd'; WR.idx=Math.max(0,Math.min(5,i)); wrRender(); }
function wrCountRow(field,label,hint,max){
  var h='<div class="as-lbl">'+label+' <span class="as-lbl-hint">'+hint+'</span></div><div class="wr-count-row">';
  for(var i=0;i<=(max||7);i++){
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
      if(sid.indexOf('autre:')===0||sid==='sb'||sid==='sm'){ type='maison'; return; }
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
      // Système du 28/10 : un échec en série 1 ou 2 est l'erreur suivie (pas prêt de monter)
      var ef=x.rHi?fsBlockFails(x,sets):0;
      if(sf||hf||ef){
        if(!errs[x.key]) errs[x.key]={soft:0,hard:0,early:0};
        errs[x.key].lo=x.reps; errs[x.key].unite=x.unite||''; // 03/11 : la cible et l'unité de l'exo tel qu'il a été fait
        errs[x.key].soft+=sf; errs[x.key].hard+=hf; errs[x.key].early=(errs[x.key].early||0)+ef;
      }
      if(sets.length>n) bonusSeries+=sets.length-n;
      if(/kg/.test(x.unite||'')&&!asIsInverse(x.key)) sets.forEach(function(s){ tonnage+=(s.w!=null?s.w:x.w||0)*s.reps; });
    });
    try{ rankSeanceRP(l).events.forEach(function(ev){ if(ev.label.indexOf('PR appliqu')>=0) prs.push(ev.label.replace('PR appliqué : ','')); }); }catch(e){}
  });
  // 03/11 (audit) : un PR par exo (le dernier), jamais « → 0 kg » (série d'essai)
  var _prBy={}; prs.forEach(function(p){ var n=p.split(' → ')[0]; if(!/→ 0 /.test(p)) _prBy[n]=p; }); prs=Object.keys(_prBy).map(function(n){ return _prBy[n]; });
  // 16/08 soir (retour Adrien : « les erreurs ne m'aident pas ») : chaque erreur embarque la
  // cible de reps et la charge de référence → le message devient un PLAN chiffré, pas un constat.
  var topErrs=Object.keys(errs).map(function(k){
    var e=errs[k];
    var inf=findExoIndex(k);
    var reps=null; try{ if(inf) reps=asParseSerie(inf.exo).reps; }catch(e2){}
    if(REP_RANGE[k]&&inf&&!inf.exo.repTarget) reps=REP_RANGE[k].r[0]; // bas de fourchette (28/10)
    if(e.lo) reps=e.lo; // 03/11 (audit) : la cible réellement suivie en séance (élévations 15, pas 8)
    var isKg=/kg/.test(e.unite||'kg'), wNow=null; try{ if(isKg) wNow=weightAtDate(k,we); }catch(e3){} // pas de « kg » sur un exo en reps
    return {key:k,name:getExoName(k),soft:e.soft,hard:e.hard,early:e.early||0,tot:e.soft+e.hard+(e.early||0),reps:reps,w:wNow,u:e.unite||'kg'};
  }).sort(function(a,b){return b.tot-a.tot;}).filter(function(e){return e.tot>=2;}).slice(0,3);
  // Volume par muscle + délaissés (<6 = à peine touché) + sous la fenêtre (<12)
  var vol=muscleVolume(ws,we);
  var neglected=RADAR_GROUPS.map(function(g){return g.label;}).filter(function(lb){return (vol[lb]||0)<6;});
  var underWin=RADAR_GROUPS.map(function(g){return g.label;}).filter(function(lb){var v0=vol[lb]||0;return v0>=6&&v0<volBlueMin(lb);});
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
  if(WR.v3){
    if(WR.shaker>=7) msgs.push('&#x1F964; 7/7 shakers &#x2014; whey + cr&#xE9;atine chaque jour : la base est verrouill&#xE9;e.');
    else if(WR.shaker>=5) msgs.push('&#x1F964; '+WR.shaker+'/7 shakers &#x2014; presque. Cale-le sur un moment FIXE (apr&#xE8;s la s&#xE9;ance ou au r&#xE9;veil) pour ne plus y penser.');
    else msgs.push('&#x1F6A8; '+WR.shaker+'/7 shakers seulement &#x2014; c\'est ta base de prot&#xE9;ines ET ta cr&#xE9;atine (qui ne marche que satur&#xE9;e). Pr&#xE9;pare-le d&#xE8;s le matin.');
    if(WR.maison>=_on.maison) msgs.push('&#x1F372; '+WR.maison+'/14 plats maison &#x2014; objectif rempli : tu sais exactement ce que tu manges.');
    else if(WR.maison>=6) msgs.push('&#x1F372; '+WR.maison+'/14 plats maison (objectif '+_on.maison+') &#x2014; un batch le dimanche r&#xE8;gle la moiti&#xE9; de la semaine.');
    else msgs.push('&#x1F6A8; '+WR.maison+'/14 plats maison &#x2014; trop de livraison : moins de prot&#xE9;ines, plus de sel. Un batch cooking dimanche, et 2 plats maison par jour d&#xE8;s lundi.');
    if((WR.run||0)>=1) msgs.push('&#x1F3C3; '+WR.run+' sortie'+(WR.run>1?'s':'')+' course &#x2014; la base cardio de la s&#xE8;che se construit maintenant.');
    else msgs.push('&#x1F3C3; Pas de course cette semaine &#x2014; 20-25 min faciles suffisent pour habituer tes tendons avant janvier.');
  }
  else if(WR.pdj>=7) msgs.push('&#x1F31F; 7/7 petits-d&#xE9;j&#x202F;: LE levier n&#xB0;1 de ta prise de masse, verrouill&#xE9;.'+(FEATURE_RANK?' +'+(7*RANK_ECO.pdjRP+RANK_ECO.pdjPerfect)+' pts.':''));
  else if(WR.pdj>=_on.pdj) msgs.push('&#x1F373; '+WR.pdj+'/7 petits-d&#xE9;j &#x2014; objectif '+_on.pdj+' rempli. C\'est TA priorit&#xE9; nutrition&#x202F;: chaque jour de plus paie.');
  else if(WR.pdj>=_on.pdj-1) msgs.push('&#x1F373; '+WR.pdj+'/7 petits-d&#xE9;j &#x2014; &#xE0; un jour de l\'objectif de '+_on.pdj+'. Rappel&#x202F;: sauter le petit-d&#xE9;j = quasi impossible de manger assez sur la journ&#xE9;e.');
  else msgs.push('&#x1F6A8; '+WR.pdj+'/7 petits-d&#xE9;j &#x2014; c\'est LE maillon faible de ta semaine (objectif '+_on.pdj+' minimum). Pr&#xE9;pare-le la veille s\'il le faut.');
  if(WR.v3){}
  else if(_on.shk>=5){
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
// ── LA consigne de la semaine (03/11, plan étape 5 : « 1 consigne, pas 10 retours ») ──
// Une seule phrase, la plus importante, dans cet ordre : un muscle sous la fenêtre 3 semaines de suite → l'erreur
// d'exécution la plus fréquente → une séance manquante → la nutrition (Yazio) → sinon « même plan ».
function wrConsigne(ws,A){
  var under=RADAR_GROUPS.map(function(g){ return g.label; }).filter(function(lb){
    for(var k=0;k<3;k++){ var w=rankAddDays(ws,-7*k), v=muscleVolume(w,rankAddDays(w,6))[lb]||0; if(v>=volBlueMin(lb)) return false; }
    return true;
  });
  var FIX={'Jambes':'2 s&#xE9;ries de leg press ou de hip thrust en plus &#xE0; ta s&#xE9;ance LEGS','Abdos':'2 s&#xE9;ries d\'abdos en fin de chaque s&#xE9;ance','Pecs':'2 s&#xE9;ries de chest press en plus au PUSH','Dos':'2 s&#xE9;ries de rowing en plus au PULL','&#xC9;paules':'2 s&#xE9;ries d\'&#xE9;l&#xE9;vations lat&#xE9;rales en plus','Biceps':'2 s&#xE9;ries de curl en plus au PULL','Triceps':'2 s&#xE9;ries de triceps en plus au PUSH'};
  if(under.length) return '<strong>'+under.join(' et ')+'</strong> sous '+volBlueMin(under[0])+' s&#xE9;ries 3 semaines de suite&#x202F;: ajoute '+(FIX[under[0]]||'2 s&#xE9;ries de ce muscle')+'.';
  var e=A.topErrs&&A.topErrs[0];
  if(e){
    if(e.early&&e.early>=e.soft&&e.early>=e.hard) return '<strong>'+e.name+'</strong>&#x202F;: S1 &#xE0; OK, S2 &#xE0; DUR, l\'&#xE9;chec seulement sur la derni&#xE8;re s&#xE9;rie ('+e.early+' &#xE9;chec'+(e.early>1?'s':'')+' trop t&#xF4;t cette semaine).';
    return '<strong>'+e.name+'</strong>&#x202F;: chaque s&#xE9;rie &#xE0; '+(e.reps||'la cible')+(e.reps?' reps':'')+' minimum, ou jusqu\'&#xE0; l\'&#xE9;chec &#x2014; pas d\'arr&#xEA;t entre les deux.';
  }
  if(A.v<A.goal) return 'Cale ta '+(Math.floor(A.v)+1)+'<sup>e</sup> s&#xE9;ance d&#xE8;s maintenant dans ton agenda&#x202F;: l\'assiduit&#xE9; vaut 5 points.';
  try{ var B=bilanNoteWeek(ws); if(B.v===5){ if(B.kcalDays<5) return 'Calories&#x202F;: '+B.kcalDays+'/7 jours &#xE0; 2&#x202F;600 kcal ou plus &#x2014; vise 5 jours sur 7.'; if(B.protDays<5) return 'Prot&#xE9;ines&#x202F;: '+B.protDays+'/7 jours &#xE0; 135 g ou plus &#x2014; vise 5 jours sur 7.'; } }catch(e2){}
  return 'Rien &#xE0; corriger&#x202F;: m&#xEA;me plan, m&#xEA;mes r&#xE8;gles, et monte d&#xE8;s que le haut de fourchette passe partout.';
}
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
    try{ var _cs=wrConsigne(WR.week,A); if(_cs) h+='<div class="wr-consigne"><span>&#x1F3AF; Ta consigne pour la semaine</span><p>'+_cs+'</p></div>'; }catch(e){}
    // Chips utiles uniquement (16/08 soir : kg soulevés + séries bonus retirés — « aucun intérêt »)
    var chips=[];
    if(A.prs.length) chips.push('<div class="wr-chip n-gold">&#x1F3C6; '+A.prs.length+' PR cette semaine</div>');
    if(A.avgNote!==null) chips.push('<div class="wr-chip '+note20Cls(A.avgNote)+'">&#x1F4DD; '+String(A.avgNote).replace('.',',')+'/20 de moyenne</div>');
    if(A.stretchCt) chips.push('<div class="wr-chip n-green">&#x1F9D8; '+A.stretchCt+' jour'+(A.stretchCt>1?'s':'')+' &#xE9;tir&#xE9;'+(A.stretchCt>1?'s':'')+'</div>');
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
      h+='<div class="wr-hook">'+(A.avgNote>=18?'Ex&#xE9;cution en or&#x202F;: ton plan tenu presque partout.':A.avgNote>=14?'Tr&#xE8;s bonne ex&#xE9;cution. Le d&#xE9;tail ci-dessous dit o&#xF9; grappiller.':A.avgNote>=12?'Ex&#xE9;cution correcte&#x202F;: quelques s&#xE9;ries sorties du plan.':'L\'ex&#xE9;cution a co&#xFB;t&#xE9; cher cette semaine &#x2014; regarde ce qui suit.')+'</div>';
    }
    // PR d'abord : la meilleure nouvelle de la semaine mérite une vitrine, pas une bulle (16/08 soir)
    if(A.prs.length){
      h+='<div class="wr-pr"><div class="wr-pr-title">&#x1F3C6; PR de la semaine</div>';
      A.prs.forEach(function(p){
        var parts=p.split(' → '); // format des events RP : « Nom → 56 kg »
        h+='<div class="wr-pr-row"><span>'+(parts[0]||p)+'</span><span class="wr-pr-w">'+(parts[1]?'&#x2197; '+parts[1]:'')+'</span></div>';
      });
      h+='</div>';
    }
    // Erreurs → PLAN chiffré par exo (16/08 soir : « les descriptions ne m'aident pas »)
    if(A.topErrs.length){
      h+='<div class="as-lbl">&#x1F3AF; &#xC0; corriger la semaine prochaine</div>';
      A.topErrs.forEach(function(e){
        var plan;
        if(e.early&&e.early>=e.soft&&e.early>=e.hard){
          plan=e.early+' &#xE9;chec'+(e.early>1?'s':'')+' en s&#xE9;rie 1 ou 2. Le plan&#x202F;: '+(e.w?'&#xE0; <strong>'+e.w+' '+e.u+'</strong>, ':'')
            +'S1 &#xE0; OK (2-3 reps en r&#xE9;serve), S2 &#xE0; DUR (1 en r&#xE9;serve), le max seulement sur la derni&#xE8;re. S1 encore &#xE0; l\'&#xE9;chec sous '+(e.reps||'la cible')+(e.reps?' reps':'')+' &#x2192; un cran en dessous.';
        } else if(e.soft>e.hard){
          plan=e.soft+' s&#xE9;rie'+(e.soft>1?'s':'')+' pos&#xE9;e'+(e.soft>1?'s':'')+' entre la cible et l\'&#xE9;chec. Le plan&#x202F;: '
            +(e.w?'&#xE0; <strong>'+e.w+' '+e.u+'</strong>, ':'')+'chaque s&#xE9;rie atteint au moins <strong>'+(e.reps||'la cible')+(e.reps?' reps':'')+'</strong> (bas de fourchette)&#x202F;; s\'arr&#xEA;ter avant sans &#xE9;chec, c\'est laisser des reps. Si &#xE7;a cale encore 2 s&#xE9;ances &#x2192; un cran en dessous et tu remplis.';
        } else {
          plan=e.hard+' vrai'+(e.hard>1?'s':'')+' rat&#xE9;'+(e.hard>1?'s':'')+' (3+ reps sous la cible). Le plan&#x202F;: un cran sous '+(e.w?'<strong>'+e.w+' '+e.u+'</strong>':'ta r&#xE9;f&#xE9;rence')+', tu remplis toutes les s&#xE9;ries &#xE0; <strong>'+(e.reps||'la cible')+(e.reps?' reps':'')+'</strong> proprement, et tu retestes seulement quand tout passe.';
        }
        h+='<div class="as-rep-note tone-warn"><strong>'+e.name+'</strong><br>'+plan+'</div>';
      });
    } else if(A.det.length){
      h+='<div class="as-rep-note tone-good">&#x2728; Aucune erreur r&#xE9;currente d&#xE9;tect&#xE9;e &#x2014; s&#xE9;ries men&#xE9;es au bout, charges respect&#xE9;es. Rare et pr&#xE9;cieux.</div>';
    }
    // Étirements : le zéro se voit en ROUGE (16/08 soir — « beaucoup plus dramatique »)
    if(A.stretchCt>0) h+='<div class="as-rep-note tone-good">&#x1F9D8; '+A.stretchCt+' jour'+(A.stretchCt>1?'s':'')+' d\'&#xE9;tirements cette semaine'+(FEATURE_RANK?' (+'+(Math.min(A.stretchCt,RANK_ECO.stretchCap)*RANK_ECO.stretchPts)+' pts)':'')+' &#x2014; la posture se gagne l&#xE0;.</div>';
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
    var _o=nutObjectives(WR.week);
    if(WR.v3){
      h+=wrCountRow('maison','&#x1F372; Combien de plats maison ?','sur 14 repas (midi + soir) &#x2014; objectif '+_o.maison+' : cuisiner, c\'est TES calories et TES prot&#xE9;ines',14);
      h+=wrCountRow('shaker','&#x1F964; Combien de jours avec ta cr&#xE9;atine ?','dans le shaker ou avec de l\'eau &#x2014; objectif '+_o.shk+'/7, il p&#xE8;se lourd dans la note');
      h+=wrCountRow('run','&#x1F3C3; Combien de sorties course ?','objectif '+_o.run+' par semaine',3);
    } else {
      h+=wrCountRow('pdj','&#x1F373; Combien de petits-d&#xE9;jeuners ?','objectif '+_o.pdj+'+ &#x2014; LA priorit&#xE9; nutrition, le levier n&#xB0;1 de ta prise de masse');
      h+=wrCountRow('shaker',_o.shkIco+' Combien de jours de '+_o.shkLbl+' ?','objectif '+_o.shk+(_o.shk>=5?' &#x2014; la cr&#xE9;atine paie par la R&#xC9;GULARIT&#xC9;, pas par la dose':'+ &#x2014; tes prot&#xE9;ines les moins ch&#xE8;res'));
      h+=wrCountRow('cardio','&#x1F3C3; Combien de cardios ?','objectif '+_o.cardio+' &#x2014; hors note : ni gain ni perte, juste le suivi');
    }
    if(A.bwDelta!==null){
      var rate=A.bwDelta;
      // Fin de prise de masse (v3, 12/10) : le poids doit rester STABLE jusqu'à la sèche du 4 janvier
      // Sèche (04/11) : la zone utile est −0,35 à −0,55 kg/sem ; plateau = cardio salle, trop rapide = remonter un peu
      var _szW=typeof SAISON!=='undefined'&&SAISON.is('seche',WR.week);
      var rMsg=_szW?(rate>-0.15?'&#x1F50E; Poids qui ne baisse pas &#x2014; si &#xE7;a dure 2 semaines&#x202F;: + 20 &#xE0; 30 min de cardio salle apr&#xE8;s la muscu.':
        rate>-0.35?'&#x1F642; &#xC7;a baisse, un peu lentement (zone : &#x2212;0,35 &#xE0; &#x2212;0,55 kg/sem). Les plats maison font la diff&#xE9;rence.':
        rate>=-0.55?'&#x2705; Pile dans la zone de s&#xE8;che (&#x2212;0,35 &#xE0; &#x2212;0,55 kg/sem). Continue exactement pareil.':
        rate>=-0.8?'&#x26A0; Un peu rapide &#x2014; v&#xE9;rifie tes 160 g de prot&#xE9;ines pour garder le muscle.':
        '&#x1F6A8; Trop rapide (&#x2212;0,8 kg/sem ou plus) &#x2014; remonte d\'environ 150 kcal : on veut perdre du gras, pas du muscle.')
        :WR.v3?(rate>0.3?'&#x26A0; &#xC7;a monte encore &#x2014; on est en fin de prise de masse : l\'objectif est un poids STABLE (73-74 kg max) jusqu\'&#xE0; la s&#xE8;che du 4 janvier.':
        rate>=-0.25?'&#x2705; Poids stable &#x2014; exactement l\'objectif de fin de prise : on garde la force, on ne prend plus.':
        '&#x1F50E; Poids en baisse &#x2014; pas encore la s&#xE8;che : il manque des calories (plats maison + shaker).')
        :rate>0.55?'&#x26A0; Rythme au-dessus de la zone utile (0,25-0,4 kg/sem) &#x2014; si &#xE7;a se r&#xE9;p&#xE8;te 2-3 semaines, on enl&#xE8;ve ~200 kcal.':
        rate>=0.15?'&#x2705; Pile dans la zone de prise propre (0,25-0,4 kg/sem). Continue exactement pareil.':
        rate>=-0.2?'&#x1F50E; Poids stable &#x2014; en bulk, c\'est le signal de manger un peu PLUS.':
        '&#x1F6A8; Poids en baisse en pleine prise de masse &#x2014; l&#xE0; c\'est s&#xFB;r&#x202F;: tu ne manges pas assez.';
      h+='<div class="as-lbl" style="margin-top:1rem;">&#x2696;&#xFE0F; Ton poids</div>'
        +'<div class="wr-bw"><span class="wr-bw-v" data-cu="'+A.bwEnd.weight_kg+'" data-cu-dec="1">0</span><span class="wr-bw-u">kg</span>'
        +'<span class="wr-bw-d '+(_szW?(rate<=-0.35&&rate>=-0.55?'ok':'warn'):(rate>0.55?'warn':rate>=0.15?'ok':'warn'))+'">'+(rate>0?'+':'')+String(rate).replace('.',',')+' kg cette semaine</span></div>'
        +'<div class="as-rep-note">'+rMsg+'</div>';
    }
    foot='<button class="as-ghost-btn" onclick="wrGoto(3)">&#x2039;</button>'
      +'<button class="as-cta" '+(wrMissing()?'disabled':'')+' onclick="wrSubmit()">Le verdict &#x203A;</button>';
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
      // v5 (03/11) : les 3 piliers et les malus, dans le même détail que l'écran « pourquoi j'ai X » du Bilan
      if(B.v===5){ var _D=noteWeekDetail(B), _f=function(x){ return String(Math.round(x*10)/10).replace('.',','); };
        h+='<div class="wr-breakdown">'+_D.pil.map(function(P){ return '<div class="wr-b-row"><span>'+P.i+' '+P.l+' &#x2014; '+P.c.map(function(c){ return c[1]; }).join(' &#xB7; ')+'</span><span>'+_f(P.p)+' /'+P.m+'</span></div>'; }).join('')
          +_D.malus.map(function(m){ return '<div class="wr-b-row"><span>&#x1FA78; '+m.l+'</span><span style="color:var(--x-note-1)">&#x2212;'+_f(m.p)+'</span></div>'; }).join('')+'</div>'; }
      else if(B.v===3) h+='<div class="wr-breakdown">'
        +'<div class="wr-b-row"><span>&#x1F3CB; Assiduit&#xE9; &#x2014; '+fmtSeances(B.salle)+'/'+B.goal+' s&#xE9;ances</span><span style="color:var(--acc)">'+String(B.pA).replace('.',',')+' /6</span></div>'
        +'<div class="wr-b-row"><span>&#x1F4DD; Ex&#xE9;cution &#x2014; '+(B.avg!=null?'moy. '+String(Math.round(B.avg*10)/10).replace('.',',')+'/20':'pas de LiveUp')+'</span><span style="color:var(--acc2)">'+String(B.pE).replace('.',',')+' /6</span></div>'
        +'<div class="wr-b-row"><span>&#x1F964; Cr&#xE9;atine &#x2014; '+B.shk+'/7 jours</span><span style="color:var(--yellow)">'+String(B.pS).replace('.',',')+' /3</span></div>'
        +'<div class="wr-b-row"><span>&#x1F372; Plats maison &#x2014; '+B.maison+'/14</span><span style="color:var(--yellow)">'+String(B.pM).replace('.',',')+' /2</span></div>'
        +'<div class="wr-b-row"><span>&#x1F3C3; Courir &#x2014; '+B.run+' sortie'+(B.run>1?'s':'')+(B.runReq?' (obligatoire)':'')+'</span><span style="color:var(--yellow)">'+String(B.pR).replace('.',',')+' /1</span></div>'
        +(B.runMiss?'<div class="wr-b-row"><span>&#x1F6A8; Course obligatoire non faite</span><span style="color:var(--red)">&#x2212;1</span></div>':'')
        +'<div class="wr-b-row"><span>&#x1F45F; Pas &#x2014; '+(B.stepAvg!=null?'moy. '+Math.round(B.stepAvg).toLocaleString('fr-FR')+' / jour (obj. 50 000 / sem.)':'pas renseign&#xE9;s')+'</span><span style="color:#3FD68A">'+(B.pP!=null?String(B.pP).replace('.',',')+' /2':'&#x2014; (ramen&#xE9;e sur 20)')+'</span></div>'
        +(B.blood?'<div class="wr-b-row"><span>&#x1FA78; '+B.blood+' journ&#xE9;e'+(B.blood>1?'s':'')+' sous 1 000 pas</span><span style="color:var(--red)">&#x2212;'+String(B.blood*0.5).replace('.',',')+'</span></div>':'')
        +'</div>';
      else h+='<div class="wr-breakdown">'
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
      var ef=x.rHi?fsBlockFails(x,sets):0; // échecs en série 1 ou 2 (28/10)
      if(sf||hf||ef){ if(!errs[x.key]) errs[x.key]={soft:0,hard:0,early:0}; errs[x.key].soft+=sf; errs[x.key].hard+=hf; errs[x.key].early+=ef; }
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
  var topErrs=Object.keys(errs).map(function(k){var e=errs[k];return {name:getExoName(k),soft:e.soft,hard:e.hard,early:e.early||0,tot:e.soft+e.hard+(e.early||0)};})
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
  var pdj=0,shk=0,crd=0,mai=0,run=0;
  weeks.forEach(function(w){
    var ans=DB.rank&&DB.rank.weekly&&DB.rank.weekly[w.start];
    mai+=ans?(ans.maison||0):nutWeekCount('maison',w.start);
    run+=ans?(ans.run||0):Math.max(nutWeekCount('run',w.start),runWeekAuto(w.start));
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
    pdj:pdj,shk:shk,crd:crd,mai:mai,run:run,bwDelta:bwDelta,bwEnd:bwEnd,rankDelta:rankDelta,stretchCt:stretchCt};
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
        h+='<div class="as-rep-note tone-down"><strong>'+e.name+'</strong> &#x2014; '+(e.early&&e.early>=e.soft&&e.early>=e.hard?e.early+' &#xE9;checs en s&#xE9;rie 1 ou 2 sur le mois &#x2014; S1 OK, S2 DUR, le max pour la derni&#xE8;re&#x202F;; S1 &#xE0; l\'&#xE9;chec sous le bas de fourchette = un cran en dessous.'
          :e.soft>e.hard?e.soft+' s&#xE9;ries arr&#xEA;t&#xE9;es sous la cible sans &#xE9;chec sur le mois. C\'est LE r&#xE9;flexe &#xE0; casser&#x202F;: au moins le bas de fourchette &#xE0; chaque s&#xE9;rie.':e.hard+' vrais rat&#xE9;s sur le mois &#x2014; charge chroniquement trop haute, un cran en dessous et on remplit.')+'</div>';
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
      +(_om.v===3
        ?'<div class="wr-ms"><span data-cu="'+A.mai+'">0</span>&#x1F372; plats maison</div>'
          +'<div class="wr-ms"><span data-cu="'+A.shk+'">0</span>&#x1F964; cr&#xE9;atine</div>'
          +'<div class="wr-ms"><span data-cu="'+A.run+'">0</span>&#x1F3C3; courses</div>'
        :'<div class="wr-ms"><span data-cu="'+A.pdj+'">0</span>&#x1F373; petits-d&#xE9;j</div>'
          +'<div class="wr-ms"><span data-cu="'+A.shk+'">0</span>'+_om.shkIco+' '+_om.shkLbl+'</div>'
          +'<div class="wr-ms"><span data-cu="'+A.crd+'">0</span>&#x1F3C3; cardio</div>')
      +'<div class="wr-ms"><span data-cu="'+(A.stretchCt||0)+'">0</span>&#x1F9D8; &#xE9;tirements</div>'
      +'</div>';
    if(A.bwDelta!==null){
      h+='<div class="as-lbl" style="margin-top:1rem;">&#x2696;&#xFE0F; Ton poids sur le mois</div>'
        +'<div class="wr-bw"><span class="wr-bw-v" data-cu="'+A.bwEnd.weight_kg+'" data-cu-dec="1">0</span><span class="wr-bw-u">kg</span>'
        +'<span class="wr-bw-d '+((typeof SAISON!=='undefined'&&SAISON.is('seche',A.mEnd))?(A.bwDelta<=-1.5&&A.bwDelta>=-2.4?'ok':'warn'):(A.bwDelta>2.2?'warn':A.bwDelta>=0.6?'ok':'warn'))+'">'+(A.bwDelta>0?'+':'')+String(A.bwDelta).replace('.',',')+' kg ce mois</span></div>'
        +'<div class="as-rep-note">'+((typeof SAISON!=='undefined'&&SAISON.is('seche',A.mEnd))?(A.bwDelta>-0.6?'&#x1F50E; Le poids n\'a presque pas boug&#xE9; ce mois &#x2014; ajoute du cardio salle et serre les plats maison.':A.bwDelta>-1.5?'&#x1F642; &#xC7;a descend, un peu lentement (vise &#x2212;1,5 &#xE0; &#x2212;2,4 kg par mois).':A.bwDelta>=-2.4?'&#x2705; Mois de s&#xE8;che parfait : pile dans la zone (&#x2212;1,5 &#xE0; &#x2212;2,4 kg).':'&#x26A0; Plus de 2,4 kg perdus en un mois &#x2014; remonte un peu les calories pour garder le muscle.'):_om.v===3?(A.bwDelta>1?'&#x26A0; Plus d\'1 kg sur le mois &#x2014; en fin de prise, le poids doit rester stable jusqu\'&#xE0; la s&#xE8;che du 4 janvier.':A.bwDelta>=-1?'&#x2705; Poids stable &#x2014; la fin de prise se passe comme pr&#xE9;vu : la force monte, le poids ne bouge plus.':'&#x1F50E; Poids en baisse avant la s&#xE8;che &#x2014; il manque des calories : plats maison et shaker d\'abord.'):A.bwDelta>2.2?'&#x26A0; Plus de 2 kg sur un mois&#x202F;: une partie part en gras. Vise 1 &#xE0; 1,7 kg/mois &#x2014; l&#xE8;ve un peu le pied sur le surplus.':A.bwDelta>=0.6?'&#x2705; Rythme de prise propre (1-1,7 kg/mois = la zone). Continue pareil.':'&#x1F50E; Prise trop lente pour un bulk &#x2014; il manque des calories quelque part (petits-d&#xE9;j&#x202F;?).')+'</div>';
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
