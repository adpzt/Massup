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
  ['a_intake_card', ["window.scrollTo(0,(document.getElementById('inCard')||document.body).getBoundingClientRect().top+window.scrollY-90)"]],
  ['a_intake_page', ['INTAKE.open()'], { scroll: '#inOverlay .as-scroll' }],
  ['a_intake_month_prot', ['INTAKE.open()', "INTAKE._mode('month')", "INTAKE._metric('prot')"], { scroll: '#inOverlay .as-scroll' }],
  ['a_intake_year_sodium', ['INTAKE.open()', "INTAKE._mode('year')", "INTAKE._metric('sodium')"], { scroll: '#inOverlay .as-scroll' }],
  ['a_intake_daymodal', ["(function(){var x=new Date();x.setDate(x.getDate()-2);var ds=x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');DB.logs=DB.logs.filter(function(l){return l.date!==ds;});showDayModal(ds);})()"]],
  ['a_weight_trend', ["window.scrollTo(0,(document.getElementById('santeTrend')||document.body).getBoundingClientRect().top+window.scrollY-160)"]],
  ['a_meas_empty', ["DB.bodyMeas={};renderBodyMeas();(document.getElementById('bodyMeas')||document.body).scrollIntoView({block:'center'})"]],
  ['a_meas', ["DB.bodyMeas={'2026-10-03':{bras:34.5,poitrine:96,taille:79,cuisse:55.5,at:1},'2026-11-02':{bras:35.2,poitrine:97.5,taille:79.5,cuisse:55,at:2},'2026-11-01':{del:1,at:3}};_bmHistOpen=true;renderBodyMeas();if(bodyMeasList().length!==2)throw new Error('ECHEC tombstone mensuration');(document.getElementById('bodyMeas')||document.body).scrollIntoView({block:'start'})"]],
  ['a_meas_modal', ["DB.bodyMeas={'2026-10-03':{bras:34.5,poitrine:96,taille:79,cuisse:55.5,at:1}};openMeasModal()"]],
  ['a_progression', ["switchView('progression',document.querySelectorAll('.bni')[2])"], { full: true }],
  ['a_settings', ['openSettings()']],
  ['a_pesee', ['openPeseeModal()']],
  ['a_logmodal', ['openLogModal()']],
  ['a_liveup', ['asOpen()'], { scroll: '#asOverlay .as-body,#asOverlay' }],
  ['a_detente', ['dzOpen()']],
  ['a_weekreport', ["(function(){var x=new Date();x.setDate(x.getDate()-((x.getDay()+6)%7)-7);wrOpen(x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'));})()"]],
  ['a_steps', ['STEPS.open()'], { scroll: '#stOverlay,.st-overlay' }],
  ['a_sleep', ['SLEEP.open()'], { scroll: '#sleepOverlay' }],
  // (01/11) Hypertrophie 30 jours colorée au même barème ; historique des poids avec dates modifiables
  ['a_hyper_30', ["switchView('progression',document.querySelectorAll('.bni')[2])", "_mvRange='month';renderMuscleVolume();document.getElementById('muscleVolume').scrollIntoView()"]],
  ['a_weight_hist', ["switchView('progression',document.querySelectorAll('.bni')[2])", "(function(){window.Chart=window.Chart||function(){return {destroy:function(){},update:function(){}};};DB.weights.traction_assist=[{date:'2026-08-01',val:25},{date:'2026-09-24',val:20},{date:'2026-10-13',val:16}];var s=document.getElementById('chartSelect');var o=document.createElement('option');o.value='traction_assist';s.appendChild(o);s.value='traction_assist';renderWeightChart();toggleWeightHistory();(document.getElementById('weightStats')||document.body).scrollIntoView();})()"]],
  // (01/11) Top 5 des perfs dans la fiche d'un exo (une perf retirée : bouton « Remettre »)
  ['a_rec_top', [`(function(){var mk=function(id,d,w,r,f){return {id:id,date:d,time:'07:00',sessions:['s2'],live:{note20:15,exos:[{key:'tirage_vert',w:w,w0:w,n:4,reps:8,rHi:10,unite:'kg',status:'done',main:true,sets:r.map(function(x,i){return {w:w,reps:x,feel:f[i]};})}]}};};DB.logs.push(mk(9001,'2026-09-02',56,[8,8,8,8],['ok','dur','dur','echec']),mk(9002,'2026-09-11',56,[8,8,10,8],['facile','ok','dur','dur']),mk(9003,'2026-10-10',60,[10,8,8,8],['ok','dur','ok','echec']),mk(9004,'2026-10-15',60,[8,8,8,8],['ok','dur','echec','echec']),mk(9005,'2026-10-25',56,[8,8,8,7],['echec','echec','echec','echec']),mk(9006,'2026-10-29',56,[10,10,10,11],['ok','dur','dur','echec']),mk(9007,'2026-08-21',52,[8,8,8,8],['ok','ok','ok','dur']));DB.recHidden={tirage_vert:{'9003':{h:1,at:1}}};switchView('seances',document.querySelectorAll('.bni')[1]);selectSeance('s2');toggleEx('s2',0);if(recTop('tirage_vert',5).some(function(r){return String(r.id)==='9003';}))throw new Error('ECHEC perf retiree encore classee');document.querySelector('[data-lc=tirage_vert]').scrollIntoView({block:'start'});})()`]],
  // (01/11) Historique sommeil v2 sur 30 nuits ; journée sous 1 000 pas = « rouge sang »
  ['a_sleep_30', ['SLEEP.open()', 'SLEEP._range(30)'], { scroll: '#sleepOverlay' }],
  ['a_steps_blood', ["(function(){var t=new Date();t.setDate(t.getDate()-1);DB.health[t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0')]={steps:640};if(STEPS.tier(640)!=='blood')throw new Error('ECHEC tier rouge sang');STEPS.open();})()"], { scroll: '#stOverlay,.st-overlay' }],
  ['a_nutria_profil', ['nutriAOpen()'], { scroll: '#nutria' }],
  ...['recettes', 'journee', 'semaine', 'calcul'].map(t => ['a_nutria_' + t, ['nutriAOpen()', `document.querySelector('#nutria .tab[data-p="${t}"]').click()`], { scroll: '#nutria' }]),
  ['a_nutria_recipe', ['nutriAOpen()', "document.querySelector('#nutria .tab[data-p=recettes]').click()", "document.querySelector('#nutria .rc').click()"], { scroll: '#na-sheet' }],
  // (12/10) Abonnement push perdu : bandeau « Réactiver » + état honnête dans les réglages
  ['a_push_lost', ["(typeof Notification==='undefined'&&(window.Notification=function(){}));Object.defineProperty(Notification,'permission',{get:()=>'granted'});Object.defineProperty(navigator,'standalone',{get:()=>true});initReminders();DB.reminders.enabled=true;_pushState={state:'lost',reason:'subscribe'};renderWeeklyRecapWidget()"]],
  ['a_push_lost_settings', ["(typeof Notification==='undefined'&&(window.Notification=function(){}));Object.defineProperty(Notification,'permission',{get:()=>'granted'});Object.defineProperty(navigator,'standalone',{get:()=>true});initReminders();DB.reminders.enabled=true;_pushState={state:'lost',reason:'subscribe'}", 'openSettings()', "(document.getElementById('reminderSettings')||document.body).scrollIntoView()"]],
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
  // (01/11) Une séance de salle ne propose jamais les exos de la routine maison (setup + ajout en séance)
  // (01/11) Puce ⏳ : jamais faits (un exo mis puis passé sans série ne compte pas) + pas faits depuis 8 séances
  ['a_stale_chip', ["(function(){DB.logs.push({id:7701,date:rankAddDays(todayStr(),-1),time:'07:00',sessions:['s3'],live:{exos:[{key:'hip_thrust',status:'done',n:4,reps:10,sets:[]},{key:'leg_press',status:'done',n:4,reps:10,sets:[{w:85,reps:10,feel:'ok'}]}]}});if(!asExoNeverDone('hip_thrust'))throw new Error('ECHEC hip thrust compte fait');if(asExoNeverDone('leg_press'))throw new Error('ECHEC leg press');})()", "asOpen()", "asChooseSeance('s1')", "asSetBFilter('stale')", "(document.getElementById('asBonusList')||document.body).scrollIntoView()"], { scroll: '#asOverlay .as-scroll' }],
  ['a_setup_nomaison', ["asOpen()", "asChooseSeance('s1')", "(function(){if(asBonusOptions().some(function(o){return o.sx.id==='sm';}))throw new Error('ECHEC exo maison propose');if(document.querySelector('#sgridMain [data-id=sm],#sgridMini [data-id=sm]'))throw new Error('ECHEC bulle maison');})()"], { scroll: '#asOverlay .as-scroll' }],
  ['a_maison_exo', ['asOpen()', "asChooseSeance('sm')", 'asToReady()', 'asGoReal()', 'asWarmupGo()'], { scroll: '#asOverlay .as-scroll' }],
  ['a_maison_report', ['asOpen()', "asChooseSeance('sm')", 'asToReady()', 'asGoReal()', "AS.exos.forEach(function(x){x.sets=[{reps:x.reps,feel:'ok',w:x.weight}];x.status='done';});AS.end=AS.end||{};asPersistLog();var l=DB.logs.find(function(y){return String(y.id)===String(AS.savedLogId);});if(liveLogNote20(l)!==null||logWeight(l)!==0) throw new Error('ECHEC routine notée ou comptée');AS.step='report';AS.repIdx=0;asRender()"], { scroll: '#asOverlay .as-scroll' }],
  ['a_maison_count', [`(function(){
    var l={id:880,date:todayStr(),time:'10:00',sessions:['sm','exo:pompes'],duration_min:35};
    if(logWeight(l)!==0) throw new Error('ECHEC routine maison doit compter 0 séance : '+logWeight(l));
    if(logWeight({sessions:['exo:cardio_liss']})!==0) throw new Error('ECHEC cardio seul');
    DB.logs.push(l); switchView('progression',document.querySelectorAll('.bni')[2]); renderHisto(); document.getElementById('calGrid').scrollIntoView();
  })()`]],
  // (27/10) Jambes / abdo dus seulement si la séance d'avant n'en avait pas
  ['a_setup_free', [`(function(){
    var t=rankAddDays(todayStr(),1);
    DB.logs.push({id:991,date:t,time:'06:00',sessions:['s1','exo:leg_press','exo:crunch_decline'],live:{exos:[{key:'leg_press',sets:[{reps:10}]},{key:'crunch_decline',sets:[{reps:12}]}]}});
    asOpen(); asChooseSeance('s1');
    if(!asLegsRequirement().ok||asLegsRequirement().need||!asAbdoRequirement().ok||asAbdoRequirement().need) throw new Error('ECHEC jambes/abdo devraient etre facultatifs');
  })()`], { scroll: '#asOverlay .as-scroll' }],
  ['a_setup_due', [`(function(){
    var t=rankAddDays(todayStr(),1), k=DATA.find(function(x){return x.id==='s1';}).exos[0].key;
    DB.logs.push({id:991,date:t,time:'06:00',sessions:['s1'],live:{exos:[{key:k,sets:[{reps:10}]},{key:'leg_press',sets:[]}]}});
    asOpen(); asChooseSeance('s1');
    if(asLegsRequirement().ok||!asLegsRequirement().need||asAbdoRequirement().ok||!asAbdoRequirement().need) throw new Error('ECHEC jambes/abdo devraient etre dus');
  })()`], { scroll: '#asOverlay .as-scroll' }],
  ['a_liveflow', ['asOpen()', "document.querySelector('#asOverlay .as-bigcard').click()", "asPickLegsMain('leg_press')", 'AS.fromPrep=true;asToReady()'], { scroll: '#asOverlay' }],
  // (28/10) Système « une seule charge » : plan d'exo (échauffement + consignes), consigne de série,
  // bouton de consigne à la question, bilan v4 (notes /5 + suggestions)
  // (01/11) Compteur de séries en séance : intro (sous le record) et pendant le repos, segment irisé = aujourd'hui
  ['a_lc_intro', [`DB.logs=(DB.logs||[]).concat([1,2,3,4,5,6,7,8].map(function(k){return {id:8800+k,date:'2026-10-0'+k,time:'07:00',sessions:['s2'],live:{exos:[{key:'tirage_vert',w:56,w0:56,n:4,reps:8,rHi:10,unite:'kg',status:'done',main:true,sets:[56,56,56,56].map(function(w){return {w:w,reps:8,feel:'dur'};})}]}};}));(function(){var x=asMakeExo('tirage_vert'),y=asMakeExo('dev_incline');x.weight=x.w0=56;y.weight=y.w0=24;AS={createdTs:Date.now(),step:'exo',sel:{sid:'s2',chosen:{},extras:[]},sound:false,startTs:Date.now()-600000,exos:[x,y],cur:0,setIdx:1,phase:'intro',introIdx:0,restEnd:null,restTotal:0,end:{},applied:[],repIdx:0,hype:'',sname:'PULL',sid:'s2',stype:'pull'};asSave();asShowOverlay();})()`], { scroll: '#asOverlay' }],
  ['a_lc_rest', [`DB.logs=(DB.logs||[]).concat([1,2,3,4,5,6,7,8].map(function(k){return {id:8800+k,date:'2026-10-0'+k,time:'07:00',sessions:['s2'],live:{exos:[{key:'tirage_vert',w:56,w0:56,n:4,reps:8,rHi:10,unite:'kg',status:'done',main:true,sets:[56,56,56,56].map(function(w){return {w:w,reps:8,feel:'dur'};})}]}};}));(function(){var x=asMakeExo('tirage_vert'),y=asMakeExo('dev_incline');x.weight=x.w0=56;y.weight=y.w0=24;AS={createdTs:Date.now(),step:'exo',sel:{sid:'s2',chosen:{},extras:[]},sound:false,startTs:Date.now()-600000,exos:[x,y],cur:0,setIdx:1,phase:'intro',introIdx:0,restEnd:null,restTotal:0,end:{},applied:[],repIdx:0,hype:'',sname:'PULL',sid:'s2',stype:'pull'};asSave();asShowOverlay();})()`, "AS.exos[0].sets=[{w:56,reps:8,feel:'ok'},{w:56,reps:8,feel:'dur'}];AS.setIdx=3;AS.phase='rest';AS.restTotal=150;AS.restEnd=Date.now()+95000;asSave();asRender()"], { scroll: '#asOverlay' }],
  ['a_fs_intro', [`(function(){var x=asMakeExo('tirage_vert'),y=asMakeExo('dev_incline');x.weight=x.w0=56;y.weight=y.w0=24;AS={createdTs:Date.now(),step:'exo',sel:{sid:'s2',chosen:{},extras:[]},sound:false,startTs:Date.now()-600000,exos:[x,y],cur:0,setIdx:1,phase:'intro',introIdx:0,restEnd:null,restTotal:0,end:{},applied:[],repIdx:0,hype:'',sname:'PULL',sid:'s2',stype:'pull'};asSave();asShowOverlay();})()`], { scroll: '#asOverlay' }],
  ['a_fs_work', [`(function(){var x=asMakeExo('tirage_vert'),y=asMakeExo('dev_incline');x.weight=x.w0=56;y.weight=y.w0=24;AS={createdTs:Date.now(),step:'exo',sel:{sid:'s2',chosen:{},extras:[]},sound:false,startTs:Date.now()-600000,exos:[x,y],cur:0,setIdx:1,phase:'intro',introIdx:0,restEnd:null,restTotal:0,end:{},applied:[],repIdx:0,hype:'',sname:'PULL',sid:'s2',stype:'pull'};asSave();asShowOverlay();})()`, "AS.exos[0].sets=[{w:56,reps:8,feel:'ok'},{w:56,reps:8,feel:'dur'},{w:56,reps:8,feel:'dur'}];AS.setIdx=4;AS.phase='work';asSave();asRender()"], { scroll: '#asOverlay' }],
  ['a_fs_ask', [`(function(){var x=asMakeExo('tirage_vert'),y=asMakeExo('dev_incline');x.weight=x.w0=56;y.weight=y.w0=24;AS={createdTs:Date.now(),step:'exo',sel:{sid:'s2',chosen:{},extras:[]},sound:false,startTs:Date.now()-600000,exos:[x,y],cur:0,setIdx:1,phase:'intro',introIdx:0,restEnd:null,restTotal:0,end:{},applied:[],repIdx:0,hype:'',sname:'PULL',sid:'s2',stype:'pull'};asSave();asShowOverlay();})()`, "AS.phase='work';AS.setIdx=1;asRender();asSetDone()"], { scroll: '#asOverlay' }],
  // (01/11) Bilan allégé : records/podiums en page 1, classement sur une ligne (chest press 50·50·50·55)
  ['a_report_note', [`(function(){var C=function(id,d,ws,rs,f){return {id:id,date:d,time:'07:00',sessions:['s1'],duration_min:55,live:{note20:16,exos:[{key:'chestpress_v',w:ws[ws.length-1],w0:50,n:4,reps:8,rHi:10,unite:'kg',status:'done',main:true,sets:ws.map(function(w,i){return {w:w,reps:rs[i],feel:f[i]};})},{key:'pecdeck',w:54,w0:54,n:4,reps:10,rHi:12,unite:'kg',status:'done',main:true,sets:[10,10,10,11].map(function(r,i){return {w:54,reps:r,feel:['ok','dur','echec','echec'][i]};})}]}};};DB.logs.push(C(993,'2026-09-29',[55,55,55,55],[10,10,10,8],['ok','echec','dur','dur']),C(994,'2026-10-02',[55,60,60,60],[10,8,8,8],['ok','dur','ok','dur']),C(995,'2026-10-23',[55,55,55,55],[8,8,6,6],['echec','echec','echec','echec']),C(996,todayStr(),[50,50,50,55],[10,10,11,10],['ok','facile','ok','echec']));asViewReport(996);})()`], { scroll: '#asOverlay' }],
  ['a_report_rec', [`(function(){var C=function(id,d,ws,rs,f){return {id:id,date:d,time:'07:00',sessions:['s1'],duration_min:55,live:{note20:16,exos:[{key:'chestpress_v',w:ws[ws.length-1],w0:50,n:4,reps:8,rHi:10,unite:'kg',status:'done',main:true,sets:ws.map(function(w,i){return {w:w,reps:rs[i],feel:f[i]};})},{key:'pecdeck',w:54,w0:54,n:4,reps:10,rHi:12,unite:'kg',status:'done',main:true,sets:[10,10,10,11].map(function(r,i){return {w:54,reps:r,feel:['ok','dur','echec','echec'][i]};})}]}};};DB.logs.push(C(993,'2026-09-29',[55,55,55,55],[10,10,10,8],['ok','echec','dur','dur']),C(994,'2026-10-02',[55,60,60,60],[10,8,8,8],['ok','dur','ok','dur']),C(995,'2026-10-23',[55,55,55,55],[8,8,6,6],['echec','echec','echec','echec']),C(996,todayStr(),[50,50,50,55],[10,10,11,10],['ok','facile','ok','echec']));asViewReport(996);})()`, 'asRepGoto(2)'], { scroll: '#asOverlay' }],
  ['a_report_notes', [`(function(){var C=function(id,d,ws,rs,f){return {id:id,date:d,time:'07:00',sessions:['s1'],duration_min:55,live:{note20:16,exos:[{key:'chestpress_v',w:ws[ws.length-1],w0:50,n:4,reps:8,rHi:10,unite:'kg',status:'done',main:true,sets:ws.map(function(w,i){return {w:w,reps:rs[i],feel:f[i]};})},{key:'pecdeck',w:54,w0:54,n:4,reps:10,rHi:12,unite:'kg',status:'done',main:true,sets:[10,10,10,11].map(function(r,i){return {w:54,reps:r,feel:['ok','dur','echec','echec'][i]};})}]}};};DB.logs.push(C(993,'2026-09-29',[55,55,55,55],[10,10,10,8],['ok','echec','dur','dur']),C(994,'2026-10-02',[55,60,60,60],[10,8,8,8],['ok','dur','ok','dur']),C(995,'2026-10-23',[55,55,55,55],[8,8,6,6],['echec','echec','echec','echec']),C(996,todayStr(),[50,50,50,55],[10,10,11,10],['ok','facile','ok','echec']));asViewReport(996);})()`, 'asRepGoto(1)'], { scroll: '#asOverlay' }],
  ['a_fs_notes', [`(function(){var E=function(k,w,lo,hi,a){return {key:k,w:w,w0:w,n:a.length,reps:lo,rHi:hi,unite:k==='dev_incline'?'kg/côté':'kg',status:'done',main:true,sets:a.map(function(t){return {w:w,reps:t[0],feel:t[1]};})};};DB.logs.push({id:992,date:todayStr(),time:'07:00',sessions:['s1'],duration_min:55,live:{note20:15,exos:[E('dev_incline',24,8,10,[[8,'echec'],[8,'dur'],[8,'ok'],[8,'echec']]),E('pecdeck',49,10,12,[[12,'ok'],[12,'dur'],[12,'dur'],[13,'echec']]),E('chestpress_v',50,8,10,[[10,'echec'],[9,'echec'],[8,'echec'],[8,'echec']])]}});asViewReport(992);})()`, 'asRepGoto(1)'], { scroll: '#asOverlay' }],
  ['a_fs_sugg', [`(function(){var E=function(k,w,lo,hi,a){return {key:k,w:w,w0:w,n:a.length,reps:lo,rHi:hi,unite:k==='dev_incline'?'kg/côté':'kg',status:'done',main:true,sets:a.map(function(t){return {w:w,reps:t[0],feel:t[1]};})};};DB.logs.push({id:992,date:todayStr(),time:'07:00',sessions:['s1'],duration_min:55,live:{note20:15,exos:[E('dev_incline',24,8,10,[[8,'echec'],[8,'dur'],[8,'ok'],[8,'echec']]),E('pecdeck',49,10,12,[[12,'ok'],[12,'dur'],[12,'dur'],[13,'echec']]),E('chestpress_v',50,8,10,[[10,'echec'],[9,'echec'],[8,'echec'],[8,'echec']])]}});asViewReport(992);})()`, 'asRepGoto(3)'], { scroll: '#asOverlay' }],
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
module.exports = {
  adrien: { page: 'index.html', seed: 'adrienSeed', list: ADRIEN },
  melati: { page: 'melati.html', seed: 'melatiSeed', list: MELATI },
};
