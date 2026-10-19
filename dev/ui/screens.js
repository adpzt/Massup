// Catalogue des écrans (repris des captures du 07/10). Chaque écran : [nom, action dans la page, options].
// `go` = code JS exécuté dans la page après le démarrage. `scroll` = sélecteur du conteneur à faire défiler
// pour capturer aussi le bas. `full` = capture de toute la page par tranches.
// Ajouter ici chaque nouvel écran, pour qu'il soit vérifié à chaque passe.
const tab = (root, re) => `[...document.querySelectorAll('${root} .tab')].find(b=>/${re}/i.test(b.textContent)||/${re}/i.test(b.dataset.p||'')).click()`;
// Rend le dossier coach dans la page (contrôle visuel + détection des sections en erreur)
const EXPORT_GO = `(function(){var sh=exportCoachDossier({dryRun:true});var pre=document.createElement('pre');pre.style.cssText='white-space:pre-wrap;font-size:10px;line-height:1.35;padding:8px;color:var(--txt);background:var(--bg)';pre.textContent=sh.map(function(s){return '== '+s.name+' ('+s.rows.length+' lignes)\\n'+s.cols.map(function(c){return c.h;}).join(' | ')+'\\n'+s.rows.slice(0,2).map(function(r){return r.join(' | ');}).join('\\n');}).join('\\n\\n');document.body.innerHTML='';document.body.appendChild(pre);})()`;
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
  // (12/10) Abonnement push perdu : bandeau « Réactiver » + état honnête dans les réglages
  ['a_push_lost', ["Object.defineProperty(Notification,'permission',{get:()=>'granted'});Object.defineProperty(navigator,'standalone',{get:()=>true});initReminders();DB.reminders.enabled=true;_pushState={state:'lost',reason:'subscribe'};renderWeeklyRecapWidget()"]],
  ['a_push_lost_settings', ["Object.defineProperty(Notification,'permission',{get:()=>'granted'});Object.defineProperty(navigator,'standalone',{get:()=>true});initReminders();DB.reminders.enabled=true;_pushState={state:'lost',reason:'subscribe'}", 'openSettings()', "(document.getElementById('reminderSettings')||document.body).scrollIntoView()"]],
  // (12/10) « Un autre sport ? » : course guidée, autres sports, carte du jour, calendrier jaune électrique
  ['a_sport_pick', ['asOpen()', 'asOtherSport()'], { scroll: '#spOverlay .as-scroll' }],
  ['a_sport_warm', ['SPORT.open()', 'SPORT.startRun()']],
  ['a_sport_run', ['SPORT.open()', 'SPORT.startRun()', 'SPORT.go(true)'], { scroll: '#spOverlay .as-scroll' }],
  ['a_sport_done', ['SPORT.open()', 'SPORT.startRun()', 'SPORT.go(true)', 'SPORT.finish()', "SPORT.field('km','5,2');SPORT.setEffort(2)"], { scroll: '#spOverlay .as-scroll' }],
  ['a_sport_other', ['SPORT.open()', "SPORT.pickOther('foot')"]],
  ['a_day_course', ["DB.logs.push({id:777,date:todayStr(),time:'18:30',sessions:['autre:Course'],sport:'course',run:{km:5.2,sec:1830,dplus:42,hr:152,hrMax:176,cad:168,kcal:410,effort:1,pain:'genou',warmup:true},duration_min:31,comment:'Bonne sortie, genou un peu chaud en descente',cardio:true});DB.logs.push({id:778,date:todayStr(),time:'12:00',sessions:['autre:Football'],sport:'foot',effort:2,duration_min:90,comment:''});renderHisto();showDayModal(todayStr())"], { scroll: '#dayModal .modal,#dayModal' }],
  ['a_cal_course', ["(function(){for(var i=1;i<28;i++){var d=rankAddDays(todayStr(),-i);if(!DB.logs.some(function(l){return l.date===d;})){DB.logs.push({id:779,date:d,time:'08:00',sessions:['autre:Course'],sport:'course',run:{km:6,sec:2100},duration_min:35,cardio:true});break;}}})();switchView('progression',document.querySelectorAll('.bni')[2]);renderHisto();document.getElementById('calGrid').scrollIntoView()"]],
  ['a_week_v3', ["nutTapWeek('maison');nutTapWeek('maison');nutTapWeek('shaker');DB.logs.push({id:777,date:todayStr(),time:'18:30',sessions:['autre:Course'],sport:'course',run:{km:5.2,sec:1830,dplus:42,hr:152,hrMax:176,cad:168,kcal:410,effort:1,pain:'genou',warmup:true},duration_min:31,comment:'Bonne sortie, genou un peu chaud en descente',cardio:true});DB.logs.push({id:778,date:todayStr(),time:'12:00',sessions:['autre:Football'],sport:'foot',effort:2,duration_min:90,comment:''});renderBilanWeekNut();(document.getElementById('bilanWeekNut')||document.body).scrollIntoView()"]],
  ['a_wr_v3_decl', ["wrOpen(rankMonday(todayStr()),true);wrGoto(4)"], { scroll: '#wrOverlay .as-scroll' }],
  ['a_wr_v3_verdict', ["WR=null;wrOpen(rankMonday(todayStr()),true);WR.maison=8;WR.shaker=6;WR.run=1;wrSubmit()"], { scroll: '#wrOverlay .as-scroll' }],
  ['a_export_dossier', [EXPORT_GO], { full: true }],
  ['a_liveup_carte', ['asOpen()', 'asChooseCarte()'], { scroll: '#asOverlay .as-scroll' }],
  // (12/10) Modifier une séance : date / heure / durée éditables, la case du calendrier suit la nouvelle date
  ['a_edit_live', ["(function(){var l=DB.logs.find(function(x){return x.live&&x.live.exos&&x.live.exos.length;});edOpen(l.id);})()"], { scroll: '#edOverlay .as-scroll' }],
  ['a_edit_move', [`(function(){
    var l=DB.logs.find(function(x){return x.live&&x.live.exos&&x.live.exos.length;});
    var from=l.date, to=null;
    for(var i=1;i<25;i++){ var d=rankAddDays(todayStr(),-i); if(!DB.logs.some(function(x){return x.date===d;})&&d.slice(0,7)===todayStr().slice(0,7)){ to=d; break; } }
    if(!to) to=rankAddDays(from,1);
    edOpen(l.id);
    document.getElementById('edDate').value=to; edSyncFields(); edRender();
    document.getElementById('edTime').value='07:15'; document.getElementById('edDur').value='52';
    window.confirm=function(){return true;};
    edSave();
    var moved=DB.logs.find(function(x){return String(x.id)===String(l.id);});
    if(!moved||moved.date!==to||moved.time!=='07:15'||moved.duration_min!==52) throw new Error('ECHEC deplacement : '+JSON.stringify(moved&&{date:moved.date,time:moved.time,dur:moved.duration_min})+' attendu '+to);
    if(DB.logs.filter(function(x){return String(x.id)===String(l.id);}).length!==1) throw new Error('ECHEC doublon');
    switchView('progression',document.querySelectorAll('.bni')[2]); renderHisto();
    var cell=[].slice.call(document.querySelectorAll('#calGrid .cal-day')).find(function(c){return c.dataset.date===to;});
    if(to.slice(0,7)===todayStr().slice(0,7)&&(!cell||cell.className.indexOf('has-session')<0)) throw new Error('ECHEC case calendrier '+to);
    document.getElementById('calGrid').scrollIntoView();
  })()`]],
  // (19/10) Cardio détaillé du LiveUp (cardio.js) : machine, paliers, stats, muscles ; course tapis → objectif Courir + 🏃
  ['a_cardio_course', ["asOpen();AS.step='exo';AS.sname='PUSH';AS.startTs=Date.now();AS.exos=[asMakeExo('cardio_liss',true)];AS.cur=0;AS.setIdx=1;AS.phase='work';asRender();asCardioType('course');asCardioInput(0,'kmh',6);asCardioInput(0,'inc',5);asCardioAddSeg();asCardioInput(1,'min',5);asCardioInput(1,'kmh',9);asCardioFeel('dur')"], { scroll: '#asOverlay .as-scroll' }],
  ['a_cardio_escalier', ["asOpen();AS.step='exo';AS.sname='PUSH';AS.startTs=Date.now();AS.exos=[asMakeExo('cardio_liss',true)];AS.cur=0;AS.setIdx=1;AS.phase='work';asRender();asCardioType('escalier');asCardioInput(-1,'kcalM',145)"], { scroll: '#asOverlay .as-scroll' }],
  ['a_cardio_saved', [`(function(){
    asOpen();AS.step='exo';AS.sname='PUSH';AS.startTs=Date.now();AS.exos=[asMakeExo('cardio_liss',true)];AS.cur=0;AS.setIdx=1;AS.phase='work';asRender();asCardioType('course');asCardioInput(0,'min',10);asCardioInput(0,'kmh',6);asCardioInput(0,'inc',5);asCardioFeel('dur');
    var before=runWeekAuto(rankMonday(todayStr()));
    AS.end=AS.end||{};asCardioDone();asPersistLog();
    var l=DB.logs.find(function(x){return String(x.id)===String(AS.savedLogId);});
    var cx=l&&l.live.exos[0];
    if(!cx||!cx.cardio||cx.cardio.type!=='course'||!cx.cardio.res||cx.cardio.res.km!==1||cx.cardio.res.dplus!==50) throw new Error('ECHEC log cardio '+JSON.stringify(cx&&cx.cardio));
    if(runWeekAuto(rankMonday(todayStr()))!==before+1) throw new Error('ECHEC objectif Courir');
    asHideOverlay();renderBilanWeekNut();showDayModal(todayStr());
  })()`], { scroll: '#dayModal .modal,#dayModal' }],
  ['a_cardio_only_report', ["asOpen();AS.step='exo';AS.sname='Cardio';AS.startTs=Date.now();AS.exos=[asMakeExo('cardio_liss',true)];AS.cur=0;AS.setIdx=1;AS.phase='work';asRender();asCardioType('velo');asCardioFeel('ok');AS.end=AS.end||{};asCardioDone();asPersistLog();AS.step='report';AS.repIdx=0;asRender()"], { scroll: '#asOverlay .as-scroll' }],
  // (19/10) Course dehors / à la salle → LiveUp cardio seul ; séance MAISON (2 haltères, tout en reps)
  ['a_sport_where', ['SPORT.open()', 'SPORT.runWhere()'], { scroll: '#spOverlay .as-scroll' }],
  ['a_cardio_gym', ['SPORT.open()', 'SPORT.runWhere()', "SPORT.gym('course')"], { scroll: '#asOverlay .as-scroll' }],
  ['a_maison_setup', ['asOpen()', "asChooseSeance('sm')"], { scroll: '#asOverlay .as-scroll' }],
  ['a_maison_exo', ['asOpen()', "asChooseSeance('sm')", 'asToReady()', 'asGoReal()', 'asWarmupGo()'], { scroll: '#asOverlay .as-scroll' }],
  ['a_maison_report', ['asOpen()', "asChooseSeance('sm')", 'asToReady()', 'asGoReal()', "AS.exos.forEach(function(x){x.sets=[{reps:x.reps,feel:'ok',w:x.weight}];x.status='done';});AS.end=AS.end||{};asPersistLog();var l=DB.logs.find(function(y){return String(y.id)===String(AS.savedLogId);});if(liveLogNote20(l)!==null||logWeight(l)!==0) throw new Error('ECHEC routine notée ou comptée');AS.step='report';AS.repIdx=0;asRender()"], { scroll: '#asOverlay .as-scroll' }],
  ['a_maison_count', [`(function(){
    var l={id:880,date:todayStr(),time:'10:00',sessions:['sm','exo:pompes'],duration_min:35};
    if(logWeight(l)!==0) throw new Error('ECHEC routine maison doit compter 0 séance : '+logWeight(l));
    if(logWeight({sessions:['exo:cardio_liss']})!==0) throw new Error('ECHEC cardio seul');
    DB.logs.push(l); switchView('progression',document.querySelectorAll('.bni')[2]); renderHisto(); document.getElementById('calGrid').scrollIntoView();
  })()`]],
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
  // (19/10) Mes compléments (ordonnances du 13/10) : midi coché, soir à prendre
  ['m_supp', ["toggleSupp('m');(document.getElementById('bilanWeekNut')||document.body).scrollIntoView()"]],
  ['m_nutri', ['nutOpen()'], { scroll: '#nutri' }],
  ['m_nutri_recettes', ['nutOpen()', tab('#nutri', 'recet')], { scroll: '#nutri' }],
  ['m_nutri_journee', ['nutOpen()', tab('#nutri', 'journ')], { scroll: '#nutri' }],
  // (19/10) Plan 14 jours de Melati : jour du jour, jour de salsa, vendredi repas libre, liste de courses, « mettre dans ma journée »
  ['m_nutri_plan', ['nutOpen()', "(function(){var st=document.createElement('style');st.textContent='#nutri *{animation:none!important;transition:none!important}';document.head.appendChild(st);})()", tab('#nutri', 'plan')], { scroll: '#nutri' }],
  ['m_nutri_plan_libre', ['nutOpen()', "(function(){var st=document.createElement('style');st.textContent='#nutri *{animation:none!important;transition:none!important}';document.head.appendChild(st);})()", tab('#nutri', 'plan'), "document.querySelector('#n-p-plan [data-pd=\"4\"]').click()", "document.querySelector('#n-p-plan .pl-courses').open=true"], { scroll: '#nutri' }],
  ['m_nutri_plan_use', ['nutOpen()', "(function(){var st=document.createElement('style');st.textContent='#nutri *{animation:none!important;transition:none!important}';document.head.appendChild(st);})()", tab('#nutri', 'plan'), "window.confirm=function(){return true;};document.querySelector('#n-p-plan [data-pd=\"1\"]').click();document.querySelector('#n-p-plan [data-puse]').click()"], { scroll: '#nutri' }],
  ['m_nutri_semaine', ['nutOpen()', tab('#nutri', 'semaine')], { scroll: '#nutri' }],
  ['m_push_lost', ["DB.reminders.enabled=true;_mlPushState={state:'lost',reason:'subscribe'};mlRenderPushSettings();document.getElementById('mlPushStatus').scrollIntoView()"]],
  ['m_liveflow', ['asOpen()', "document.querySelector('#asOverlay .as-bigcard').click()"], { scroll: '#asOverlay' }],
];
const POLITIQUE = [
  ['p_accueil', [], { full: true }],
  ['p_express', ['POLQ.startExpress()']],
  ['p_resultats', ['POLQ.showResultsFromAnswers()'], { full: true }],
  ['p_candidats', ['POLQ.goCandidats()'], { full: true }],
  ['p_actu', ['POLQ.openActu()'], { full: true }],
  ['p_comparer', ['POLQ.goCompare()'], { full: true }],
  ['p_methodo', ['POLQ.goMethodo()'], { full: true }],
  ['p_profil', ['POLQ.goProfile()'], { full: true }],
  ['p_fiche', ['POLQ.goCandidats()', 'POLQ.toggleCandDir(0)', "(document.getElementById('polCandDir0')||document.body).scrollIntoView()"]],
  ['p_revue', ['POLQ.goReview()'], { full: true }],
];
const POLITIQUE_OWNER = POLITIQUE.map(([n, a, o]) => [n.replace('p_', 'po_'), a, o]);
module.exports = {
  adrien: { page: 'index.html', seed: 'adrienSeed', list: ADRIEN },
  melati: { page: 'melati.html', seed: 'melatiSeed', list: MELATI },
  politique: { page: 'politique/index.html', seed: 'politiqueSeed', list: POLITIQUE },
  politique_owner: { page: 'politique/index.html', seed: 'politiqueOwnerSeed', list: POLITIQUE_OWNER },
};
