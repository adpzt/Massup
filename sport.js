"use strict";
/* ═══ « Un autre sport ? » (12/10/2026, demande Adrien) — MASSUP uniquement ═══
   Remplace la séance manuelle du LiveUp. Deux chemins :
   · COURSE (80 % de l'écran) : échauffement guidé → « Bon courage » (chrono, à faire / à éviter)
     → « J'ai fini » → stats Strava (distance, temps, D+, FC, cadence, kcal, effort, douleur).
   · AUTRES SPORTS (foot, escalade, boxe, natation, autre) : durée + intensité.
   Stockage : un log normal de DB.logs — sessions ['autre:Course'] (ou 'autre:<Sport>'), `sport`
   ('course', 'foot'…), `run` {km, sec, dplus, hr, hrMax, cad, kcal, effort, pain, warmup} pour la
   course, `effort` pour les autres. Une course ne compte JAMAIS comme séance de gym (logWeight = 0)
   et remplit toute seule l'objectif hebdo « Courir » (runWeekAuto). Calendrier : jaune électrique.
   La course en cours survit à la fermeture de l'app (localStorage massup_sport). */
var SPORT=(function(){
  var KEY='massup_sport';
  var OTHERS=[
    {id:'foot',name:'Football',ico:'&#x26BD;'},
    {id:'escalade',name:'Escalade',ico:'&#x1F9D7;'},
    {id:'boxe',name:'Boxe',ico:'&#x1F94A;'},
    {id:'natation',name:'Natation',ico:'&#x1F3CA;'},
    {id:'velo',name:'Vélo',ico:'&#x1F6B4;'},
    {id:'autre',name:'Autre',ico:'&#x1F938;'}
  ];
  // Échauffement course (~8 min) : du plus doux au plus dynamique. Genou fragile → fentes dans l'axe.
  var WARMUP=[
    {name:'Marche rapide puis trot tr&#xE8;s lent',dose:'3 min',sec:180,cue:'Le c&#x153;ur monte doucement. Tu dois pouvoir parler sans effort.'},
    {name:'Chevilles et hanches',dose:'30 s chaque sens',sec:60,cue:'Cercles de cheville pied pos&#xE9; sur la pointe, puis grands cercles de hanche, genou lev&#xE9;.'},
    {name:'Balancements de jambe avant / arri&#xE8;re',dose:'10 par jambe',cue:'Une main contre un mur ou un poteau, la jambe balance librement, sans forcer l\'amplitude.'},
    {name:'Balancements de jambe sur le c&#xF4;t&#xE9;',dose:'10 par jambe',cue:'Face au mur, la jambe passe devant toi de gauche &#xE0; droite. Ouvre les hanches.'},
    {name:'Mont&#xE9;es de genoux',dose:'2 &#xD7; 20 s',sec:40,cue:'Sur place ou en avan&#xE7;ant doucement, appuis l&#xE9;gers sur l\'avant du pied.'},
    {name:'Talons-fesses',dose:'2 &#xD7; 20 s',sec:40,cue:'Rel&#xE2;ch&#xE9;, rapide, le talon vient chercher la fesse.'},
    {name:'Fentes march&#xE9;es',dose:'8 par jambe',cue:'Le genou avant reste dans l\'axe du pied, jamais vers l\'int&#xE9;rieur. Pas trop profond : c\'est un &#xE9;veil, pas une s&#xE9;ance de jambes.'},
    {name:'3 acc&#xE9;l&#xE9;rations progressives',dose:'15-20 s chacune',cue:'Tu pars en trottinant et tu acc&#xE9;l&#xE8;res jusqu\'&#xE0; ~80 %, puis retour en marchant. Lance Strava juste apr&#xE8;s.'}
  ];
  var DO=[
    'Allure FACILE : tu dois pouvoir parler en phrases. Si tu ne peux plus, ralentis, m&#xEA;me si &#xE7;a te para&#xEE;t lent.',
    'Foul&#xE9;e courte et l&#xE9;g&#xE8;re, le pied se pose sous toi (pas loin devant), cadence vive.',
    'Regarde loin devant, &#xE9;paules rel&#xE2;ch&#xE9;es, bras &#xE0; 90&#xB0; qui balancent d\'avant en arri&#xE8;re.',
    'Bois si tu cours plus de 45 min ou s\'il fait chaud.'
  ];
  var DONT=[
    'Partir trop vite les 2 premiers km : c\'est le pi&#xE8;ge n&#xB0;1.',
    'Allonger la foul&#xE9;e en attaquant du talon devant toi : &#xE7;a charge le genou.',
    'Continuer sur une douleur de genou qui augmente : tu marches, tu rentres, tu le notes.',
    'Ajouter plus de 1 km &#xE0; ta plus longue sortie r&#xE9;cente.'
  ];
  var EFFORT=['Facile','Moyen','Dur','Tr&#xE8;s dur'];
  var PAINS=[{id:'',name:'Aucune'},{id:'genou',name:'Genou'},{id:'cheville',name:'Cheville'},{id:'tibia',name:'Tibia'},{id:'autre',name:'Autre'}];
  var S=null, _tick=null;

  // ── utilitaires ──
  function esc(t){ return String(t==null?'':t).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function num(v){ var n=parseFloat(String(v==null?'':v).replace(',','.')); return isNaN(n)?null:n; }
  function nowTime(){ var d=getNow(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
  function fmtDur(sec){
    sec=Math.max(0,Math.round(sec||0));
    var h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60;
    return (h?h+'h'+String(m).padStart(2,'0'):m)+':'+String(s).padStart(2,'0');
  }
  function fmtPace(sec,km){ if(!sec||!km) return null; var p=Math.round(sec/km); return Math.floor(p/60)+'&#x2032;'+String(p%60).padStart(2,'0')+'&#x2033;/km'; }
  function fmtSpeed(sec,km){ if(!sec||!km) return null; return String(Math.round(km/(sec/3600)*10)/10).replace('.',',')+' km/h'; }
  function fmtKm(km){ return String(Math.round(km*100)/100).replace('.',','); }
  function save(){ try{ if(S&&!S.logId&&(S.step==='warm'||S.step==='run'||S.step==='done')) localStorage.setItem(KEY,JSON.stringify(S)); else localStorage.removeItem(KEY); }catch(e){} }
  function load(){ try{ var raw=localStorage.getItem(KEY); return raw?JSON.parse(raw):null; }catch(e){ return null; } }
  function clear(){ try{ localStorage.removeItem(KEY); }catch(e){} }
  // Distance conseillée : la plus longue des 3 dernières sorties + 0,5 km (5 km au départ, 10 km max)
  function targetKm(){
    var runs=(DB.logs||[]).filter(function(l){ return l.sport==='course'&&l.run&&l.run.km; })
      .sort(function(a,b){ return b.date.localeCompare(a.date); }).slice(0,3);
    if(!runs.length) return 5;
    var best=Math.max.apply(null,runs.map(function(l){ return l.run.km; }));
    return Math.min(10,Math.max(5,Math.round((best+0.5)*2)/2));
  }

  // ── ouverture / fermeture ──
  function overlay(){ return document.getElementById('spOverlay'); }
  function show(){
    var ov=overlay(); if(!ov) return;
    ov.classList.add('open');
    document.body.style.overflow='hidden';
    render();
  }
  function open(){
    var cur=load();
    S=cur||{step:'pick'};
    show();
  }
  function resume(){ var cur=load(); if(!cur){ open(); return; } S=cur; show(); }
  function active(){ var cur=load(); return !!(cur&&(cur.step==='warm'||cur.step==='run'||cur.step==='done')); }
  // ✕ : réduit sans rien perdre pendant une course ; ferme sinon
  function close(){
    stopTick();
    var ov=overlay(); if(ov) ov.classList.remove('open');
    document.body.style.overflow='';
    save();
    if(!active()) S=null;
    try{ renderWeeklyRecapWidget(); }catch(e){}
  }
  function abandon(){
    if(!confirm('Abandonner cette course ? Rien ne sera enregistré.')) return;
    S={step:'pick'}; clear(); render();
    try{ renderWeeklyRecapWidget(); }catch(e){}
  }

  // ── navigation ──
  function startRun(){ S={step:'warm',sport:'course',warmIdx:0,startTs:null,warmTs:Date.now(),target:targetKm()}; save(); render(); }
  function warmGoto(i){ if(!S) return; S.warmIdx=Math.max(0,Math.min(WARMUP.length-1,i)); S.stepEnd=null; save(); render(); }
  function warmNext(){
    if(S.warmIdx<WARMUP.length-1){ warmGoto(S.warmIdx+1); return; }
    go(true);
  }
  function go(warmed){ S.step='run'; S.startTs=Date.now(); S.warmup=!!warmed; S.stepEnd=null; save(); render(); }
  function stepTimer(){ var w=WARMUP[S.warmIdx]; if(!w||!w.sec) return; S.stepEnd=Date.now()+w.sec*1000; save(); render(); }
  function finish(){
    var sec=S.startTs?Math.round((Date.now()-S.startTs)/1000):0;
    S.step='done';
    S.form={date:todayStr(),time:S.startTs?timeOf(S.startTs):nowTime(),km:'',min:sec>=60?String(Math.floor(sec/60)):'',s:sec>=60?String(sec%60).padStart(2,'0'):'',
      dplus:'',hr:'',hrMax:'',cad:'',kcal:'',effort:null,pain:'',comment:''};
    save(); render();
  }
  function timeOf(ts){ var d=new Date(ts); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
  function pickOther(id){
    var o=OTHERS.find(function(x){ return x.id===id; }); if(!o) return;
    S={step:'other',sport:id,form:{date:todayStr(),time:nowTime(),name:id==='autre'?'':o.name,dur:'',effort:null,comment:''}};
    render();
  }
  function back(){
    if(!S) return;
    if(S.step==='other'||(S.step==='warm'&&!S.logId)){ if(S.step==='warm'&&!confirm('Annuler cette course ?')) return; S={step:'pick'}; clear(); render(); return; }
    if(S.step==='run'){ S.step='warm'; save(); render(); }
  }

  // ── formulaires ──
  function field(k,v){ if(!S||!S.form) return; S.form[k]=v; if(S.step==='done') { save(); refreshCalc(); } }
  function setEffort(i){ S.form.effort=i; if(S.step==='done') save(); render(); }
  function setPain(id){ S.form.pain=id; save(); render(); }
  function readForm(){
    var root=overlay(); if(!root||!S||!S.form) return;
    root.querySelectorAll('[data-f]').forEach(function(el){ S.form[el.getAttribute('data-f')]=el.value; });
  }
  function calcHtml(){
    var f=S.form, km=num(f.km), sec=(num(f.min)||0)*60+(num(f.s)||0);
    var pace=fmtPace(sec,km), spd=fmtSpeed(sec,km);
    return pace?'&#x26A1; Allure <strong>'+pace+'</strong> &#xB7; vitesse <strong>'+spd+'</strong>':'Renseigne la distance et le temps : l\'allure et la vitesse se calculent toutes seules.';
  }
  function refreshCalc(){ var el=document.getElementById('spCalc'); if(el) el.innerHTML=calcHtml(); }
  function saveRun(){
    readForm();
    var f=S.form, km=num(f.km), sec=Math.round((num(f.min)||0)*60+(num(f.s)||0));
    if(!km||km<=0){ showToast('&#x26A0; Indique la distance (km)'); return; }
    if(!sec){ showToast('&#x26A0; Indique le temps de course'); return; }
    if(!f.date){ showToast('&#x26A0; Choisis une date'); return; }
    var run={km:Math.round(km*100)/100,sec:sec,dplus:num(f.dplus),hr:num(f.hr),hrMax:num(f.hrMax),cad:num(f.cad),kcal:num(f.kcal),
      effort:f.effort,pain:f.pain||'',warmup:S.logId?!!(S.prevRun&&S.prevRun.warmup):!!S.warmup};
    persist({sessions:['autre:Course'],sport:'course',run:run,duration_min:Math.max(1,Math.round(sec/60)),cardio:true},f);
    showToast('&#x1F3C3; Course enregistr&#xE9;e &#x2014; '+fmtKm(run.km)+' km en '+fmtDur(sec));
  }
  function saveOther(){
    readForm();
    var f=S.form, dur=num(f.dur), name=String(f.name||'').trim();
    if(!name){ showToast('&#x26A0; Quel sport ?'); return; }
    if(!dur||dur<=0){ showToast('&#x26A0; Indique la dur&#xE9;e (min)'); return; }
    if(!f.date){ showToast('&#x26A0; Choisis une date'); return; }
    persist({sessions:['autre:'+name],sport:S.sport,effort:f.effort,duration_min:Math.round(dur)},f);
    showToast('&#x2705; '+esc(name)+' enregistr&#xE9; &#x2014; '+Math.round(dur)+' min');
  }
  function persist(data,f){
    var id=S.logId||Date.now();
    if(S.logId) DB.logs=DB.logs.filter(function(l){ return String(l.id)!==String(S.logId); });
    var entry={id:id,date:f.date,time:f.time||'',sessions:data.sessions,comment:String(f.comment||'').trim(),feeling:null,energy:null,duration_min:data.duration_min,sport:data.sport};
    if(data.run) entry.run=data.run;
    if(data.effort!=null) entry.effort=data.effort;
    if(data.cardio) entry.cardio=true;
    DB.logs.push(entry);
    DB.logs.sort(function(a,b){ return b.date.localeCompare(a.date)||((b.time||'').localeCompare(a.time||'')); });
    saveDB();
    S=null; clear(); stopTick();
    var ov=overlay(); if(ov) ov.classList.remove('open');
    document.body.style.overflow='';
    try{ renderHisto(); }catch(e){}
    try{ renderBilanWeekNut(); }catch(e){}
    try{ renderWeeklyRecapWidget(); }catch(e){}
    try{ renderBilanNotes(); }catch(e){}
  }
  // Modifier depuis le calendrier : même formulaire, même id (pas de doublon, pas de tombstone)
  function edit(id){
    var l=(DB.logs||[]).find(function(x){ return String(x.id)===String(id); }); if(!l) return;
    if(l.sport==='course'){
      var r=l.run||{};
      var str=function(v){ return v==null?'':String(v).replace('.',','); };
      S={step:'done',sport:'course',logId:l.id,prevRun:r,form:{date:l.date,time:l.time||'',km:str(r.km),min:String(Math.floor((r.sec||0)/60)),s:String((r.sec||0)%60),
        dplus:str(r.dplus),hr:str(r.hr),hrMax:str(r.hrMax),cad:str(r.cad),kcal:str(r.kcal),effort:r.effort!=null?r.effort:null,pain:r.pain||'',comment:l.comment||''}};
    } else {
      var nm=((l.sessions||[]).find(function(x){ return x.indexOf('autre:')===0; })||'autre:').slice(6);
      S={step:'other',sport:l.sport,logId:l.id,form:{date:l.date,time:l.time||'',name:nm,dur:l.duration_min?String(l.duration_min):'',effort:l.effort!=null?l.effort:null,comment:l.comment||''}};
    }
    show();
  }

  // ── chrono (échauffement + course) ──
  function stopTick(){ if(_tick){ clearInterval(_tick); _tick=null; } }
  function ensureTick(){
    stopTick();
    _tick=setInterval(function(){
      var ov=overlay();
      if(!S||!ov||!ov.classList.contains('open')){ stopTick(); return; }
      var el=document.getElementById('spClock');
      if(S.step==='run'&&el) el.textContent=fmtDur((Date.now()-S.startTs)/1000);
      if(S.step==='warm'&&S.stepEnd&&el){
        var left=Math.max(0,Math.ceil((S.stepEnd-Date.now())/1000));
        el.textContent=fmtDur(left);
        if(!left){ S.stepEnd=null; save(); try{ if(navigator.vibrate) navigator.vibrate(200); }catch(e){} render(); }
      }
    },500);
  }

  // ── rendu ──
  function hdr(title,sub,left){
    return '<div class="as-hdr">'
      +'<div class="as-hdr-left"><button class="as-exit" onclick="SPORT.close()" title="R&#xE9;duire">'+AS_EXIT_SVG+'</button>'
      +(left?'<button class="as-hbtn as-backbtn" onclick="SPORT.back()" title="Retour">&#x2039;</button>':'')+'</div>'
      +'<div class="as-hdr-mid"><div class="as-hdr-title">'+title+'</div>'+(sub?'<div class="as-hdr-sub">'+sub+'</div>':'')+'</div>'
      +'<div class="as-hdr-right"></div></div>';
  }
  function effortRow(){
    var h='<div class="as-exo-picks sp-picks">';
    EFFORT.forEach(function(e,i){ h+='<button class="as-pick'+(S.form.effort===i?' on':'')+'" onclick="SPORT.setEffort('+i+')">'+e+'</button>'; });
    return h+'</div>';
  }
  function input(k,label,unit,mode,ph){
    return '<div class="sp-field"><label class="as-lbl">'+label+(unit?' <span class="as-lbl-hint">'+unit+'</span>':'')+'</label>'
      +'<input class="ed-input" data-f="'+k+'" type="text" inputmode="'+(mode||'decimal')+'" value="'+esc(S.form[k])+'" placeholder="'+(ph||'')+'" oninput="SPORT.field(\''+k+'\',this.value)"/></div>';
  }
  function dateRow(){
    return '<div class="ed-dt"><div class="ed-dt-f"><label class="as-lbl">Date</label><input class="ed-input" data-f="date" type="date" value="'+esc(S.form.date)+'" onchange="SPORT.field(\'date\',this.value)"/></div>'
      +'<div class="ed-dt-f"><label class="as-lbl">Heure</label><input class="ed-input" data-f="time" type="time" value="'+esc(S.form.time)+'" onchange="SPORT.field(\'time\',this.value)"/></div></div>';
  }
  function render(){
    var body=document.getElementById('spBody'); if(!body||!S) return;
    var h='', foot='';
    if(S.step==='pick'){
      h+=hdr('Un autre sport&#x202F;?','pas de muscu aujourd\'hui',false);
      h+='<div class="as-scroll"><div class="sp-pick">';
      h+='<button class="sp-run-card" onclick="SPORT.startRun()">'
        +'<span class="sp-run-ico" aria-hidden="true">&#x1F3C3;</span>'
        +'<span class="sp-run-name">Course</span>'
        +'<span class="sp-run-sub">&#xC9;chauffement guid&#xE9;, conseils pendant la sortie, puis tes stats Strava.</span>'
        +'<span class="sp-run-target">Aujourd\'hui : vise ~'+fmtKm(targetKm())+' km en allure facile</span>'
        +'<span class="sp-run-go">C\'est parti &#x203A;</span></button>';
      h+='<div class="as-lbl">Un autre sport <span class="as-lbl-hint">tu renseignes juste la dur&#xE9;e</span></div>';
      h+='<div class="sp-others">';
      OTHERS.forEach(function(o){ h+='<button class="sp-other" onclick="SPORT.pickOther(\''+o.id+'\')"><span class="sp-other-ico">'+o.ico+'</span><span class="sp-other-name">'+esc(o.name)+'</span></button>'; });
      h+='</div></div></div>';
      foot='<button class="as-ghost-btn" onclick="SPORT.close()">Annuler</button>';
    } else if(S.step==='warm'){
      var w=WARMUP[S.warmIdx];
      h+=hdr('&#xC9;chauffement','course &#xB7; '+(S.warmIdx+1)+'/'+WARMUP.length,true);
      h+='<div class="as-scroll"><div class="sp-step">'
        +'<div class="as-exo-kicker">&#xC9;tape '+(S.warmIdx+1)+'</div>'
        +'<div class="as-exo-name xl">'+w.name+'</div>'
        +'<div class="sp-dose">'+w.dose+'</div>'
        +(S.stepEnd?'<div class="sp-clock" id="spClock">'+fmtDur((S.stepEnd-Date.now())/1000)+'</div>'
          :(w.sec?'<button class="as-ghost-btn sp-timer-btn" onclick="SPORT.stepTimer()">&#x23F1; Lancer '+fmtDur(w.sec)+'</button>':''))
        +'<div class="as-cue">&#x27A1; '+w.cue+'</div>'
        +'</div></div>'+asSlideDots(WARMUP.length,S.warmIdx,'SPORT.warmGoto');
      foot='<button class="as-ghost-btn" onclick="SPORT.go(false)">Passer</button>'
        +'<button class="as-cta" onclick="SPORT.warmNext()">'+(S.warmIdx<WARMUP.length-1?'Suivant &#x203A;':'Je pars courir &#x203A;')+'</button>';
    } else if(S.step==='run'){
      h+=hdr('Bon courage &#x1F4AA;','course en cours',true);
      h+='<div class="as-scroll"><div class="sp-runnow">'
        +'<div class="sp-clock big" id="spClock">'+fmtDur((Date.now()-S.startTs)/1000)+'</div>'
        +'<div class="sp-run-target">Objectif du jour : ~'+fmtKm(S.target||targetKm())+' km, allure facile</div>'
        +'</div>';
      h+='<div class="as-lbl">&#x2713; &#xC0; faire</div><div class="as-intro-list">';
      DO.forEach(function(t){ h+='<div class="as-do big">'+t+'</div>'; });
      h+='</div><div class="as-lbl">&#x2715; &#xC0; &#xE9;viter</div><div class="as-intro-list">';
      DONT.forEach(function(t){ h+='<div class="as-dont big">'+t+'</div>'; });
      h+='</div></div>';
      foot='<button class="as-ghost-btn" onclick="SPORT.abandon()">Abandonner</button>'
        +'<button class="as-cta" onclick="SPORT.finish()">J\'ai fini &#x2713;</button>';
    } else if(S.step==='done'){
      h+=hdr(S.logId?'Modifier la course':'Tes stats','recopie ce que te donne Strava',false);
      h+='<div class="as-scroll">';
      if(!S.logId) h+='<div class="as-rep-note">&#x1F389; Bien jou&#xE9;&#x202F;! Ouvre Strava et recopie tes chiffres&#x202F;: seuls la distance et le temps sont obligatoires.</div>';
      h+=dateRow();
      h+='<div class="sp-form-grid">'
        +input('km','Distance','km','decimal','5,2')
        +'<div class="sp-field"><label class="as-lbl">Temps <span class="as-lbl-hint">min : s</span></label><div class="sp-dur">'
          +'<input class="ed-input" data-f="min" type="text" inputmode="numeric" value="'+esc(S.form.min)+'" oninput="SPORT.field(\'min\',this.value)" aria-label="Minutes"/><span>:</span>'
          +'<input class="ed-input" data-f="s" type="text" inputmode="numeric" value="'+esc(S.form.s)+'" oninput="SPORT.field(\'s\',this.value)" aria-label="Secondes"/></div></div>'
        +'</div>';
      h+='<div class="sp-calc" id="spCalc">'+calcHtml()+'</div>';
      h+='<div class="sp-form-grid">'
        +input('dplus','D&#xE9;nivel&#xE9; +','m','numeric')
        +input('kcal','Calories','kcal','numeric')
        +input('hr','FC moyenne','bpm','numeric')
        +input('hrMax','FC max','bpm','numeric')
        +input('cad','Cadence','pas/min','numeric')
        +'</div>';
      h+='<div class="as-lbl">Ressenti de l\'effort</div>'+effortRow();
      h+='<div class="as-lbl">Une douleur&#x202F;?</div><div class="as-exo-picks sp-picks">';
      PAINS.forEach(function(p){ h+='<button class="as-pick'+((S.form.pain||'')===p.id?' on':'')+'" onclick="SPORT.setPain(\''+p.id+'\')">'+p.name+'</button>'; });
      h+='</div>';
      h+='<div class="as-lbl">Commentaire <span class="as-lbl-hint">facultatif</span></div>'
        +'<textarea class="ed-input" data-f="comment" rows="2" oninput="SPORT.field(\'comment\',this.value)">'+esc(S.form.comment)+'</textarea>';
      h+='</div>';
      foot=(S.logId?'<button class="as-ghost-btn" onclick="SPORT.close()">Annuler</button>':'<button class="as-ghost-btn" onclick="SPORT.abandon()">Abandonner</button>')
        +'<button class="as-cta" onclick="SPORT.saveRun()">Enregistrer &#x2713;</button>';
    } else if(S.step==='other'){
      var o=OTHERS.find(function(x){ return x.id===S.sport; })||OTHERS[OTHERS.length-1];
      h+=hdr(o.ico+' '+(S.sport==='autre'?'Autre sport':esc(o.name)),S.logId?'modifier':'combien de temps&#x202F;?',!S.logId);
      h+='<div class="as-scroll">';
      if(S.sport==='autre'||S.logId) h+='<div class="sp-field"><label class="as-lbl">Sport</label><input class="ed-input" data-f="name" type="text" value="'+esc(S.form.name)+'" placeholder="Tennis, padel, randonn&#xE9;e&#x2026;" oninput="SPORT.field(\'name\',this.value)"/></div>';
      h+=dateRow();
      h+='<div class="sp-form-grid">'+input('dur','Dur&#xE9;e','min','numeric','60')+'</div>';
      h+='<div class="as-lbl">Intensit&#xE9; <span class="as-lbl-hint">facultatif</span></div>'+effortRow();
      h+='<div class="as-lbl">Commentaire <span class="as-lbl-hint">facultatif</span></div>'
        +'<textarea class="ed-input" data-f="comment" rows="2" oninput="SPORT.field(\'comment\',this.value)">'+esc(S.form.comment)+'</textarea>';
      h+='</div>';
      foot='<button class="as-ghost-btn" onclick="'+(S.logId?'SPORT.close()':'SPORT.back()')+'">'+(S.logId?'Annuler':'&#x2039;')+'</button>'
        +'<button class="as-cta" onclick="SPORT.saveOther()">Enregistrer &#x2713;</button>';
    }
    body.innerHTML=h+'<div class="as-foot">'+foot+'</div>';
    if(S.step==='run'||(S.step==='warm'&&S.stepEnd)) ensureTick(); else stopTick();
  }

  // ── carte du jour (modal calendrier) ──
  function dayCardHtml(l){
    var meta=[];
    if(l.time) meta.push('&#x1F551; '+esc(l.time));
    var h;
    if(l.sport==='course'){
      var r=l.run||{};
      var stats=[];
      stats.push(['Temps',fmtDur(r.sec)]);
      if(fmtSpeed(r.sec,r.km)) stats.push(['Vitesse',fmtSpeed(r.sec,r.km)]);
      if(r.dplus!=null) stats.push(['D&#xE9;nivel&#xE9; +',Math.round(r.dplus)+' m']);
      if(r.hr!=null) stats.push(['FC moy.',Math.round(r.hr)+' bpm']);
      if(r.hrMax!=null) stats.push(['FC max',Math.round(r.hrMax)+' bpm']);
      if(r.cad!=null) stats.push(['Cadence',Math.round(r.cad)+' pas/min']);
      if(r.kcal!=null) stats.push(['Calories',Math.round(r.kcal)+' kcal']);
      if(r.effort!=null) stats.push(['Effort',EFFORT[r.effort]||'']);
      var pain=PAINS.find(function(p){ return p.id===(r.pain||''); });
      h='<div class="hc-log dm-t-course">'
        +'<div class="hc-chips"><span class="chip chip-course">&#x1F3C3; Course</span>'+(r.warmup?'<span class="chip chip-course-soft">&#xE9;chauffement &#x2713;</span>':'')+'</div>'
        +'<div class="hc-hero"><div class="hc-pts"><span class="hc-pts-v sp-km">'+(r.km?fmtKm(r.km):'&#x2014;')+'<small> km</small></span>'
        +'<span class="hc-pts-l">'+(fmtPace(r.sec,r.km)?'allure '+fmtPace(r.sec,r.km):'course')+'</span></div></div>'
        +'<div class="sp-stats">'+stats.map(function(s){ return '<div class="sp-stat"><b>'+s[1]+'</b><span>'+s[0]+'</span></div>'; }).join('')+'</div>'
        +(r.pain?'<div class="dm-live sp-pain">&#x1FA79; Douleur signal&#xE9;e : '+(pain?pain.name:esc(r.pain))+'</div>':'');
    } else {
      var nm=((l.sessions||[]).find(function(x){ return x.indexOf('autre:')===0; })||'autre:Sport').slice(6);
      var o=OTHERS.find(function(x){ return x.id===l.sport; });
      h='<div class="hc-log dm-t-maison">'
        +'<div class="hc-chips"><span class="chip chip-maison">'+(o?o.ico:'&#x1F938;')+' '+esc(nm)+'</span></div>'
        +'<div class="hc-hero"><div class="hc-pts"><span class="hc-pts-v sp-km">'+(l.duration_min||'&#x2014;')+'<small> min</small></span>'
        +'<span class="hc-pts-l">'+(l.effort!=null?'intensit&#xE9; '+EFFORT[l.effort].toLowerCase():'autre sport')+'</span></div></div>';
    }
    return h+(meta.length?'<div class="hc-meta">'+meta.join('&#x2002;&#xB7;&#x2002;')+'</div>':'')
      +(l.comment?'<div class="dm-comment">&#xAB;&#x202F;'+esc(l.comment)+'&#x202F;&#xBB;</div>':'')
      +'<div class="dm-actrow"><button class="dle-edit" data-id="'+l.id+'">&#x270E; Modifier</button>'
      +'<button class="dle-del" data-id="'+l.id+'" title="Supprimer">&#x1F5D1;</button></div></div>';
  }

  return {open:open,resume:resume,active:active,close:close,abandon:abandon,back:back,startRun:startRun,
    warmGoto:warmGoto,warmNext:warmNext,go:go,stepTimer:stepTimer,finish:finish,pickOther:pickOther,
    field:field,setEffort:setEffort,setPain:setPain,saveRun:saveRun,saveOther:saveOther,edit:edit,
    dayCardHtml:dayCardHtml,_test:{targetKm:targetKm,fmtPace:fmtPace,fmtSpeed:fmtSpeed,fmtDur:fmtDur}};
})();
