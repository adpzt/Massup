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
  crunch_poulie:['abdos'],releve_chaise:['abdos','hanches'],pallof:['abdos'],dead_bug:['abdos'],crunch_leste:['abdos'],crunch_decline:['abdos'],crunch_decline_leste:['abdos'],
  hollow_hold:['abdos'],crunch:['abdos'],gainage:['abdos'],
  cardio_liss:['quadris','mollets'],cardio_rameur:['dos','quadris'],
  m_floor_press:['pecs','triceps'],m_rowing:['dos','biceps'],m_rdl:['ischios','fessiers','lombaires'],m_marteau:['biceps','avantbras'],
  m_mollets:['mollets'],m_releves:['abdos'],m_posture_y:['epaules','trapezes'],m_fentes:['quadris','fessiers'],m_triceps:['triceps']
};
// Cardio détaillé (19/10) : les muscles suivent la machine choisie (cardio.js › CARDIO_TYPES)
CARDIO_TYPES.forEach(function(t){ DZ_MUSCLE_OF['cardio_t_'+t.id]=t.mus.filter(function(m){ return m!=='biceps'; }); });
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
  if(l.live&&l.live.exos){ l.live.exos.forEach(function(x){ if((x.sets||[]).length) push(x.cardio?'cardio_t_'+x.cardio.type:x.key); }); }
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
function recIsHidden(key,id){ var m=DB.recHidden&&DB.recHidden[key]; return !!(m&&m[String(id)]&&m[String(id)].h); }
function recSessions(key,n,withHidden){
  var out=[];
  (DB.logs||[]).forEach(function(l){
    if(!l.live||!l.live.exos) return;
    if(!withHidden&&recIsHidden(key,l.id)) return; // perf retirée des classements par Adrien (01/11)
    l.live.exos.forEach(function(x){
      if(x.key!==key) return;
      if(!liveExoCounted(x)) return;
      out.push({date:l.date,id:l.id,w:(x.w!=null?x.w:null),sets:(x.sets||[]).slice(0,n)});
    });
  });
  return out;
}
// ── Top 5 des perfs d'un exo (01/11, demande Adrien) — fiche dépliée de l'écran Séances ──
// Même juge que « Record à battre » et la slide Classements (recCompare : e1RM, moins d'assistance,
// ou total de reps). Une perf retirée sort de TOUS les classements ; la 6e remonte.
function recTop(key,limit){
  var d=asExoDef(key); if(!d) return [];
  var n=asParseSerie(d.e).n, o={inv:asIsInverse(key),isKg:/kg/.test(d.e.unite||'')&&!d.e.repTarget};
  var rs=recSessions(key,n).filter(function(x){ return (x.sets||[]).length; });
  rs.sort(function(a,b){ var c=recCompare(a,b,n,o); return c!==0?c:a.date.localeCompare(b.date); });
  return limit?rs.slice(0,limit):rs;
}
function recTopHtml(key){
  var d=asExoDef(key); if(!d) return '';
  var e=d.e, top=recTop(key,5);
  var hidden=Object.keys((DB.recHidden&&DB.recHidden[key])||{}).filter(function(id){ return DB.recHidden[key][id].h; }).length;
  var crit=asIsInverse(key)?'moins d\'assistance = mieux':(/kg/.test(e.unite||'')&&!e.repTarget?'class&#xE9;es par force estim&#xE9;e':'class&#xE9;es par total');
  var h='<div class="seclbl">&#x1F3C6; Meilleures perfs <span class="rec-crit">'+crit+'</span></div>';
  if(!top.length) h+='<div class="rec-empty">Pas encore de perf enregistr&#xE9;e en s&#xE9;ance LiveUp.</div>';
  top.forEach(function(r,i){
    h+='<div class="rec-row'+(i===0?' first':'')+'"><span class="rec-rank">'+(i+1)+'</span>'
      +'<div class="rec-main"><span class="rec-sets">'+recSetsFmt(r,e.unite||'kg',e.cnt)+'</span><span class="rec-date">'+formatDateFr(r.date)+'</span></div>'
      +'<button class="rec-del" type="button" onclick="recHide(\''+key+'\',\''+r.id+'\')" aria-label="Retirer la perf du '+formatDateFr(r.date)+' du classement">&#x2715;</button></div>';
  });
  if(hidden) h+='<button class="rec-restore" type="button" onclick="recRestoreAll(\''+key+'\')">&#x21BA; Remettre '+(hidden>1?'les '+hidden+' perfs retir&#xE9;es':'la perf retir&#xE9;e')+'</button>';
  return h;
}
function recRefresh(key){ document.querySelectorAll('[data-rectop="'+key+'"]').forEach(function(el){ el.innerHTML=recTopHtml(key); }); }
function recHide(key,id){
  if(!confirm('Retirer cette perf du classement ? Elle reste dans l’historique, seulement plus comptée comme record.')) return;
  if(!DB.recHidden) DB.recHidden={};
  if(!DB.recHidden[key]) DB.recHidden[key]={};
  DB.recHidden[key][String(id)]={h:1,at:Date.now()};
  saveDB(); recRefresh(key);
  showToast('Perf retir&#xE9;e du classement &#x2014; la suivante remonte');
}
function recRestoreAll(key){
  var m=DB.recHidden&&DB.recHidden[key]; if(!m) return;
  Object.keys(m).forEach(function(id){ if(m[id].h) m[id]={h:0,at:Date.now()}; });
  saveDB(); recRefresh(key);
  showToast('Perfs remises dans le classement');
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
// Rang de la perf du jour pour chaque exo (même juge que « Record à battre »)
function asTodayRanks(){
  var out=[];
  asReportDisplayExos().forEach(function(x){
    if(!liveExoCounted(x)||exoIsCardio(x.key)||!x.sets.length) return;
    var n=x.n||3;
    var opts={inv:asIsInverse(x.key),isKg:/kg/.test(x.unite||'')&&!x.repT};
    var sess=recSessions(x.key,n);
    var today=sess.find(function(s2){return String(s2.id)===String(AS.savedLogId);});
    if(!today) return;
    sess.sort(function(a,b){ var c=recCompare(a,b,n,opts); return c!==0?c:a.date.localeCompare(b.date); });
    out.push({x:x,n:n,sess:sess,today:today,rank:sess.indexOf(today)+1});
  });
  return out;
}
function asRenderRecordsSlide(){
  var h='<div class="as-rep-slide-title">&#x1F3C6; Classements</div>'; // 01/11 (Adrien) : titre court, charges, date du record et « aujourd'hui » allégés
  var any=false;
  asTodayRanks().forEach(function(R){
    var x=R.x, sess=R.sess, today=R.today, rank=R.rank;
    any=true;
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
      +'<div class="rec2-top"><span class="rec2-name">'+x.name+'</span>'+badge+'</div>'
      +'<div class="rec2-line"><span class="rec2-l-lbl">AJD</span><span class="rec2-sets">'+recSetsFmt(today,x.unite,x.cnt)+'</span></div>'
      +(sess.length===1
        ?'<div class="rec2-note">La r&#xE9;f&#xE9;rence est pos&#xE9;e &#x2014; c\'est elle qu\'il faudra battre.</div>'
        :(isBest
          ?'<div class="rec2-note gold">Ta meilleure version de cet exo &#x2014; le sommet du classement est &#xE0; toi.</div>'
          :'<div class="rec2-line"><span class="rec2-l-lbl">record</span><span class="rec2-sets dim">'+recSetsFmt(best,x.unite,x.cnt)+'</span></div>'))
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
function asRepGoto(i){ _asDir=i<AS.repIdx?'back':'fwd'; AS.repIdx=Math.max(0,Math.min(FEATURE_FULL_BILAN?3:1,i)); asSave(); asRender(); }
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
  // 01/11 (Adrien : « l'analyse, rien ne m'intéresse ») : la slide Analyse sort du parcours —
  // 0 note · 1 note par exo · 2 classements · 3 suggestions (son code reste, view 1).
  var nSlides=FEATURE_FULL_BILAN?4:2;
  var view=FEATURE_FULL_BILAN?[0,2,3,4][Math.min(3,i)]:(i===0?0:4);
  h+='<div class="as-scroll'+(i===0?' as-center':'')+'">';
  var _cdOnly=!_eng.length?AS.exos.find(function(x){ return x.cardio&&(x.sets||[]).length; }):null;
  if(view===0&&AS.sid==='sm'){
    var _done=AS.exos.filter(function(x){ return (x.sets||[]).length; });
    h+='<div class="as-grade-wrap">'
      +'<div class="as-grade-emoji">&#x1F3E0;</div>'
      +'<div class="as-grade-title">Routine faite</div>'
      +'<div class="as-grade-sum">'+_done.length+' exo'+(_done.length>1?'s':'')+' &#xB7; '+allSets+' s&#xE9;ries &#xB7; '+asElapsedMin()+' min. Elle ne se note pas et ne compte pas comme une s&#xE9;ance : c\'est le petit plus des jours sans salle.</div>'
      +'</div>';
  } else if(view===0&&_cdOnly){
    var _ct=cardioType(_cdOnly.cardio.type);
    h+='<div class="as-grade-wrap">'
      +'<div class="as-grade-emoji">'+_ct.ico+'</div>'
      +'<div class="as-grade-title">'+_ct.name+'</div>'
      +'<div class="as-grade-sum">Cardio enregistr&#xE9; &#x2014; il ne se note pas sur 20.'+(_cdOnly.cardio.type==='course'?' Ta sortie &#xAB;&#x202F;Courir&#x202F;&#xBB; de la semaine est coch&#xE9;e.':'')+'</div>'
      +asCardioTotalsHtml(_cdOnly.cardio)
      +'</div>';
  } else if(view===0){
    h+='<div class="as-grade-wrap g-'+gi.cls+'">'
      +'<div class="as-grade-emoji anim-'+gi.anim+'">'+gi.emoji+'</div>'
      +'<div class="as-grade-note"><span class="as-grade-num" data-cu="'+g+'">0</span><span class="as-grade-sur">/20</span></div>'
      +'<div class="as-grade-title t-'+gi.cls+'">'+gi.title+'</div>'
      +'<div class="as-grade-sum">'+asGradeSummary(g,doneCt,skipCt,_eng.length)+'</div>'
      +(function(){ try{ var r=asRepriseCtx(); return r?'<div style="margin:.55rem 0 .1rem;"><span class="rep-badge">&#x2744; reprise apr&#xE8;s '+r.days+' j d\'arr&#xEA;t &#x2014; souvent un peu plus l&#xE9;g&#xE8;re, note lue avec indulgence</span></div>':''; }catch(e){ return ''; } })()
      +(function(){
        // 01/11 (Adrien) : exos faits + records + podiums du jour — séries / minutes / passés retirés
        var rk=[]; try{ rk=asTodayRanks().filter(function(R){ return R.sess.length>1; }); }catch(e){}
        var rec=rk.filter(function(R){ return R.rank===1; }).length;
        var pod=rk.filter(function(R){ return R.rank<=3; }).length;
        return '<div class="as-rep-stats as-rep-stats3">'
          +'<div class="as-rep-stat"><span>'+doneCt+'/'+_eng.length+'</span>exos</div>'
          +'<div class="as-rep-stat'+(rec?' gold':'')+'"><span>'+rec+'</span>record'+(rec>1?'s':'')+'</div>'
          +'<div class="as-rep-stat'+(pod?' podium':'')+'"><span>'+pod+'</span>sur le podium</div>'
          +'</div>';
      })()
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
      // 01/11 (Adrien : « je regarde le nom, ma perf et la note — tout le texte en dessous, c'est un enfer ») :
      // carte compacte ; les retours du coach restent, repliés, et s'ouvrent au tap.
      var _hasL=r.lines&&r.lines.length;
      h+='<div class="as-rep-exo compact tone-'+r.tone+(isAbdo?' cat-abdo':'')+'"'+(_hasL?' role="button" tabindex="0" onclick="this.classList.toggle(\'open\')"':'')+'>'
        +'<div class="as-rep-exo-top"><span class="as-rep-exo-name">'+(side?(isAbdo?'<span class="abdo-mark">&#x1F525;</span> ':'&#x2B50; '):'')+r.name+'</span>'
        +badge+'</div>'
        +'<div class="as-rep-exo-w">'+(setsTxt||(x.weight+' '+x.unite))+(side?' &#xB7; <em class="as-rep-bonus">bonus</em>':'')+(_hasL?'<span class="as-rep-more" aria-hidden="true">&#x25BE;</span>':'')+'</div>'
        +(_hasL?'<div class="as-rep-lines">'+r.lines.map(function(l){return '<div class="as-rep-line">'+l+'</div>';}).join('')+'</div>':'')
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
    Object.keys(AS.autoRef||{}).forEach(function(k){
      var ar=AS.autoRef[k], xa=AS.exos.find(function(e){return e.key===k;}); if(!xa) return;
      any=true;
      h+='<div class="as-rep-exo tone-up"><div class="as-rep-exo-top"><span class="as-rep-exo-name">'+xa.name+'</span><span class="as-rep-exo-w">&#x1F4CC; r&#xE9;f&#xE9;rence mise &#xE0; jour</span></div>'
        +'<div class="as-rep-line">Tu as travaill&#xE9; &#xE0; <strong>'+ar.to+' '+xa.unite+'</strong> sur toutes les s&#xE9;ries&#x202F;: ta r&#xE9;f&#xE9;rence passe de '+ar.from+' &#xE0; '+ar.to+' '+xa.unite+' (automatique).</div></div>';
    });
    AS.reportExos.forEach(function(r){
      if(r.suggest!==1&&r.suggest!==-1&&r.suggestTo==null) return;
      var x=AS.exos.find(function(e){return e.key===r.key;})||AS.exos.find(function(e){return e.name===r.name;});
      if(!x) return;
      any=true;
      var up=r.suggest===1||(r.suggest!==-1&&r.suggestTo!=null);
      var inv=asIsInverse(x.key);
      var inc=x.repT?x.inc:fsStep(x); // 04/11 : le vrai cran de la machine (REP_RANGE.step / inc de l'exo) — « +1 kg » donnait 99 kg, 34 kg (audit 03/11)
      // suggestTo (05/08) = valeur ABSOLUE proposée (test validé, calibration, assistance qui marche)
      // — sinon la reco classique ±1 cran. Le stepper part de la reco absolue quand elle existe.
      var reco=r.suggestTo!=null?r.suggestTo
              :(up?(inv?Math.max(0,x.weight-inc):x.weight+inc*(r.suggestBig?2:1))
                  :(inv?x.weight+inc:Math.max(0,x.weight-inc)));
      var hdr=x.rHi
        ?(up?(inv?'&#x1F53C; moins d\'assistance':'&#x1F53C; haut de fourchette atteint'):(inv?'&#x1F53D; plus d\'assistance':'&#x1F53D; un cran en dessous'))
        :r.suggestTo!=null
        ?(inv?'&#x1F9ED; assistance &#xE0; caler':(r.suggest===1?'&#x1F53C; test valid&#xE9; &#x2014; ent&#xE9;rine':'&#x1F9ED; r&#xE9;f&#xE9;rence &#xE0; caler'))
        :(up?(inv?'&#x1F53C; moins d\'assistance valid&#xE9;e':'&#x1F53C; hausse valid&#xE9;e')
            :(inv?'&#x1F53D; plus d\'assistance conseill&#xE9;e':'&#x1F53D; baisse conseill&#xE9;e'));
      if(AS.suggestW[x.key]==null) AS.suggestW[x.key]=reco; // le stepper part de la reco affichée (avant : du poids actuel)
      var nw=AS.suggestW[x.key];
      // Anti double-application (bug 05/08 : bilan relu = poids +8 au lieu de +4) : si la
      // RÉFÉRENCE a déjà bougé depuis le début de cette séance (w0), la suggestion est
      // considérée déjà consommée — un bilan revu ne peut plus ré-augmenter le poids.
      var curRef=getCurrentWeight(x.key);
      var base0=(AS.autoRef&&AS.autoRef[x.key])?AS.autoRef[x.key].to:x.w0; // la référence suivie automatiquement n'est pas une « suggestion déjà appliquée »
      var refMoved=base0!=null&&curRef!=null&&Math.abs(curRef-base0)>0.01;
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
          +'<button class="as-wbtn" onclick="asSuggestChg(\''+x.key+'\','+(-inc)+')">&#x2212;</button>'
          +'<span class="as-sugg-val">'+nw+'<small> '+x.unite+'</small></span>'
          +'<button class="as-wbtn plus" onclick="asSuggestChg(\''+x.key+'\','+inc+')">+</button>'
          +'<button class="as-apply" '+((curRef!=null?nw===curRef:nw===x.weight)?'disabled':'')+' onclick="asApplySuggest(\''+x.key+'\')">'+(inv?'Appliquer cette assistance':'Appliquer &#x2713;')+'</button>'
          +'</div>';
        // ⚡ Alternative à la bascule sèche (15/08, demande Adrien) : hausse validée sur un exo
        // en kg → proposer la transition progressive 55·55·50·50 (poids haut frais en premier, 22/08).
        if(FEATURE_EVO&&up&&!inv&&!x.repT&&/kg/.test(x.unite||'')&&(x.n||0)>=2){
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
    +(i<nSlides-1?'<button class="as-cta" onclick="asRepNav(1)">Suivant &#x203A;'+(FEATURE_FULL_BILAN?(i===1?'<span class="as-cta-sub">classements</span>':(i===2?'<span class="as-cta-sub">suggestions</span>':(i===0?'<span class="as-cta-sub">note par exo</span>':''))):'<span class="as-cta-sub">suggestions</span>')+'</button>'
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
  var base0=(AS.autoRef&&AS.autoRef[key])?AS.autoRef[key].to:x.w0;
  if(base0!=null&&curRef!=null&&Math.abs(curRef-base0)>0.01){
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
    +'<div class="ed-dt-f"><label class="as-lbl">Heure</label><input class="ed-input" type="time" id="edTime" value="'+(ED.time||'')+'"/></div></div>'
    // 12/10 (demande Adrien) : date, heure et durée ensemble en haut — changer la date déplace la séance au calendrier
    +'<div class="ed-dt"><div class="ed-dt-f"><label class="as-lbl">Dur&#xE9;e (min)</label><input class="ed-input" type="number" inputmode="numeric" id="edDur" min="1" max="300" placeholder="45" value="'+(ED.dur||'')+'"/></div><div class="ed-dt-f"></div></div>';
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
  var _wasEdit=!!ED.logId, _oldDate=null;
  if(_wasEdit){ var _old=DB.logs.find(function(l){return String(l.id)===String(ED.logId);}); _oldDate=_old?_old.date:null; }
  var _newDate=ED.date;
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
      if(liveNotedExos(ED.live.exos||[]).length){ entry.live.note20=asNote20From(ED.live.exos,ED.live.context,ED.date); entry.live.n20v=6; }
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
  // (12/10) ED est déjà remis à null par edClose : le message s'appuie sur l'état capturé avant
  showToast(_wasEdit&&_oldDate&&_oldDate!==_newDate?'&#x1F4C5; S&#xE9;ance d&#xE9;plac&#xE9;e au '+formatDateFr(_newDate)
    :'&#x2705; S&#xE9;ance '+(_wasEdit?'modifi&#xE9;e':'enregistr&#xE9;e')+' !');
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

