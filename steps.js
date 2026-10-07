"use strict";
/* ═══ 👟 PAS & ACTIVITÉ (29/09/2026) — commun aux deux apps (MASSUP Adrien · MASSUP Melati) ═══
   Demande Adrien : un endroit DÉDIÉ au nombre de pas, relié à l'app Santé, avec tout l'historique
   et le reste de l'activité. Couleurs : < 6 000 rouge · 6 000 gris · 8 000 vert · 10 000 gold.
   Objectif : MOYENNE de la semaine ≥ 8 000 → compte dans la note de semaine.
   Une web app ne peut PAS lire HealthKit : c'est un Raccourci iOS (automatisation, sans rien toucher)
   qui envoie les totaux journaliers et, si configuré, les heures à /api/health?t=CODE
   → table Supabase health_days (health.sql) → l'app lit ses
   propres jours et les garde dans DB.health (donc aussi dans la sauvegarde user_state).
   Saisie manuelle possible (utilisée seulement quand Santé n'a rien envoyé pour ce jour). */
var STEPS=(function(){
  var A=null, $=function(id){ return document.getElementById(id); };
  var GOAL=8000, WEEK_GOAL=55000, SC='MASSUP Santé';
  var MET={kcal:{ico:'🔥',lbl:'Énergie active',u:'kcal',dec:0},km:{ico:'📏',lbl:'Distance',u:'km',dec:1},exo:{ico:'⏱',lbl:'Minutes d’exercice',u:'min',dec:0},floors:{ico:'🪜',lbl:'Étages montés',u:'',dec:0}};
  function ymd(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function today(){ return ymd(new Date()); }
  function addD(s,n){ var d=new Date(s+'T12:00:00'); d.setDate(d.getDate()+n); return ymd(d); }
  function monOf(s){ var d=new Date(s+'T12:00:00'); d.setDate(d.getDate()-((d.getDay()+6)%7)); return ymd(d); }
  function dm(s){ var p=s.split('-'); return p[2]+'/'+p[1]; }
  function fmt(n){ return Math.round(n).toLocaleString('fr-FR'); }
  function k1(n){ return n>=1000?String(Math.round(n/100)/10).replace('.',',')+'k':String(Math.round(n)); }
  function H(){ var db=A.db(); if(!db.health) db.health={}; return db.health; }
  function meta(){ var db=A.db(); if(!db.healthMeta) db.healthMeta={}; return db.healthMeta; }
  // Valeur du jour : Santé d'abord, sinon la saisie manuelle
  function hourlySteps(d){
    var e=H()[d]; if(!e) return null;
    var sum=0,n=0;
    for(var i=0;i<24;i++){ var v=e['steps_h'+String(i).padStart(2,'0')]; if(v!=null){sum+=v;n++;} }
    return n?sum:null;
  }
  function stepsOf(d){ if(!A) return null; var e=H()[d]; if(!e) return null; if(e.steps!=null) return e.steps; if(e.ms!=null) return e.ms; return hourlySteps(d); }
  function tier(v){ return v==null?'none':v>=10000?'gold':v>=8000?'green':v>=6000?'gray':'red'; }
  var TLBL={gold:'🥇 10 000+',green:'✅ 8 000+',gray:'6 000+',red:'sous 6 000',none:'—'};
  // Semaine : moyenne sur les jours RENSEIGNÉS (jusqu'à aujourd'hui)
  function week(mon){
    var t=today(), days=[], sum=0, n=0;
    for(var i=0;i<7;i++){ var d=addD(mon,i), v=stepsOf(d); days.push({d:d,v:v,fut:d>t}); if(v!=null&&d<=t){ sum+=v; n++; } }
    return {mon:mon,days:days,n:n,avg:n?sum/n:null,sum:sum};
  }
  function selectCardDate(date){
    cardSelectedDate=date;
    var el=$('stCard'); if(el) el.innerHTML=cardHtml();
  }
  // Points dans la note de semaine (max = poids fixé par l'app) — null si < 4 jours renseignés (pas de pénalité à l'aveugle)
  function weekPts(mon,max){
    if(!A) return null;
    if(mon<monOf(today())) return null;
    var w=week(mon), cur=mon===monOf(today());
    if(w.n<(cur?1:4)||w.avg==null) return null;
    var a=w.avg, f=a>=10000?1:a>=8000?0.75+0.25*(a-8000)/2000:a>=6000?0.3+0.45*(a-6000)/2000:Math.max(0,0.3*(a-3000)/3000);
    return Math.round(f*max*10)/10;
  }

  /* ── Synchro : lecture de SES jours dans health_days (RLS) ── */
  var _pullAt=0, _status=null, _refreshUntil=0; // null | 'ok' | 'notable' | 'off' | 'err'
  async function pull(force){
    if(!A) return Promise.resolve();
    var sb=A.sb&&A.sb(); if(!sb){ _status='off'; return Promise.resolve(); }
    if(!force&&Date.now()-_pullAt<60000) return Promise.resolve();
    _pullAt=Date.now();
    var since=addD(today(),-370), offset=0, pageSize=1000, rows=[];
    try{
      while(true){
        var r=await sb.from('health_days').select('d,k,v').gte('d',since).order('d').order('k').range(offset,offset+pageSize-1);
        if(r.error){ _status=/does not exist|42P01|schema cache/i.test((r.error.message||'')+(r.error.code||''))?'notable':'err'; rerenderOpen(); return; }
        var page=r.data||[];
        rows=rows.concat(page);
        if(page.length<pageSize) break;
        offset+=pageSize;
      }
      _status='ok';
      var h=H(), changed=false, last=meta().last||'';
      rows.forEach(function(row){
        var e=h[row.d]||(h[row.d]={}), v=Number(row.v);
        if(row.k==='steps'||/^steps_h\d{2}$/.test(row.k)) v=Math.round(v); else v=Math.round(v*10)/10;
        if(e[row.k]!==v){ e[row.k]=v; changed=true; }
        if(row.d>last) last=row.d;
      });
      if(changed||meta().last!==last){ meta().last=last; meta().syncAt=Date.now(); A.save(); }
      if(changed){
        try{ A.onChange(); }catch(e){}
        if(Date.now()<_refreshUntil) A.toast('✅ Données Santé reçues dans MASSUP');
      }
      rerenderOpen();
    }catch(e){ _status='err'; rerenderOpen(); }
  }
  function ensureToken(){
    var sb=A.sb&&A.sb(); if(!sb) return Promise.resolve(null);
    if(meta().token) return Promise.resolve(meta().token);
    return sb.auth.getUser().then(function(res){
      var uid=res.data&&res.data.user&&res.data.user.id; if(!uid) return null;
      return sb.from('health_tokens').select('token').eq('user_id',uid).maybeSingle().then(function(r){
        if(r.error){ _status=/does not exist|42P01|schema cache/i.test(r.error.message||'')?'notable':'err'; rerenderOpen(); return null; }
        if(r.data&&r.data.token){ meta().token=r.data.token; A.save(); return r.data.token; }
        var a=new Uint8Array(12); crypto.getRandomValues(a);
        var tok=A.app.slice(0,1)+'-'+Array.prototype.map.call(a,function(b){return ('0'+b.toString(16)).slice(-2);}).join('');
        return sb.from('health_tokens').insert({user_id:uid,token:tok,app:A.app}).then(function(w){
          if(w.error){ _status=/does not exist|42P01|schema cache/i.test(w.error.message||'')?'notable':'err'; rerenderOpen(); return null; }
          meta().token=tok; A.save(); return tok;
        });
      });
    });
  }
  function link(){ return meta().token?location.origin+'/api/health?t='+meta().token:null; }

  /* ── Bloc « 👟 Pas » du Bilan ── */
  function cardHtml(){
    var t=today(), v=stepsOf(t), w=week(monOf(t)), J=['L','M','M','J','V','S','D'];
    if(A.app==='adrien'){
      if(!w.days.some(function(x){return x.d===cardSelectedDate;})) cardSelectedDate=t;
      var selected=cardSelectedDate||t, selectedValue=stepsOf(selected);
      var selectedLabel=selected===t?'Aujourd’hui':selected===addD(t,-1)?'Hier':new Date(selected+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
      return '<section class="st-card st-card-modern">'
        +'<div class="st-top"><span class="st-ttl">👟 Pas</span><div class="st-card-actions">'
        +'<button class="st-card-action" type="button" onclick="STEPS.refresh()" aria-label="Actualiser les pas avec le raccourci" title="Actualiser avec Raccourcis">↻</button>'
        +'<button class="st-card-action" type="button" onclick="STEPS.open()" aria-label="Ouvrir la page Pas" title="Ouvrir en grand">⛶</button></div></div>'
        +'<div class="st-card-selected"><strong class="t-'+tier(selectedValue)+'">'+(selectedValue!=null?fmt(selectedValue):'—')+'</strong><span>'+selectedLabel+'</span></div>'
        +'<div class="st-card-weekline"><span>Moyenne cette semaine</span><strong class="t-'+tier(w.avg)+'">'+(w.avg!=null?fmt(w.avg):'—')+'</strong><small>'+fmt(w.sum)+' / '+fmt(WEEK_GOAL)+' pas</small></div>'
        +'<div class="st-week-progress" role="progressbar" aria-label="Progression de l’objectif de pas de la semaine" aria-valuemin="0" aria-valuemax="'+WEEK_GOAL+'" aria-valuenow="'+Math.min(WEEK_GOAL,w.sum)+'"><i style="width:'+Math.min(100,w.sum/WEEK_GOAL*100)+'%"></i></div>'
        +cardWeek(w,selected)+'</section>';
    }
    var mx=12000; w.days.forEach(function(x){ if(x.v>mx) mx=x.v; });
    var bars=w.days.map(function(x,i){
      var hgt=x.v!=null?Math.max(6,Math.round(x.v/mx*100)):0;
      return '<div class="st-bd'+(x.d===t?' now':'')+(x.fut?' fut':'')+'"><span class="st-bv">'+(x.v!=null?k1(x.v):'')+'</span><span class="st-bc"><i class="t-'+tier(x.v)+'" style="height:'+hgt+'%"></i><b class="st-g8" style="bottom:'+(8000/mx*100)+'%"></b></span><span class="st-bl">'+J[i]+'</span></div>';
    }).join('');
    var avgT=tier(w.avg);
    var sync=meta().syncAt?'Santé · '+ago(meta().syncAt):(meta().token?'en attente du Raccourci':'relie l’app Santé ›');
    return '<button class="st-card" type="button" onclick="STEPS.open()">'
      +'<div class="st-top"><span class="st-ttl">👟 Pas</span><span class="st-sync">'+sync+'</span></div>'
      +'<div class="st-main"><div class="st-now t-'+tier(v)+'"><b>'+(v!=null?fmt(v):'—')+'</b><small>aujourd’hui</small></div>'
      +'<div class="st-avg"><span class="st-avgv t-'+avgT+'">'+(w.avg!=null?fmt(w.avg):'—')+'</span><small>moyenne de la semaine · obj. '+fmt(GOAL)+'</small>'
      +'<span class="st-bar"><i class="t-'+avgT+'" style="width:'+(w.avg!=null?Math.min(100,w.avg/10000*100):0)+'%"></i><b style="left:80%"></b></span></div></div>'
      +'<div class="st-week">'+bars+'</div>'
      +'</button>';
  }
  function ago(ts){ var m=Math.round((Date.now()-ts)/60000); return m<1?'à l’instant':m<60?'il y a '+m+' min':m<1440?'il y a '+Math.round(m/60)+' h':'il y a '+Math.round(m/1440)+' j'; }
  function renderCard(){
    if(!A) return;
    var host=$('bilanWeekNut'); if(!host) return;
    var el=$('stCard');
    if(!el){ el=document.createElement('div'); el.id='stCard'; host.parentNode.insertBefore(el,host.nextSibling); }
    el.innerHTML=cardHtml();
    pull(false);
  }

  /* ── Écran complet ── */
  var ST={mode:'week',anchor:today(),selected:null,touchX:null,touchY:null};
  var cardSelectedDate=today();
  function ensureOv(){
    var ov=$('stOverlay'); if(ov) return ov;
    ov=document.createElement('div'); ov.className='as-overlay st-overlay'+(A.app==='adrien'?' st-overlay-adrien':''); ov.id='stOverlay';
    ov.innerHTML='<div class="as-frame" aria-hidden="true"></div><div class="as-body" id="stBody"></div>';
    document.body.appendChild(ov); return ov;
  }
  function open(){
    if(A.app==='adrien'){
      ST.mode='week'; ST.anchor=today();
      var selectedDate=cardSelectedDate, monday=monOf(ST.anchor);
      if(selectedDate<monday||selectedDate>addD(monday,6)) selectedDate=ST.anchor;
      ST.selected=(new Date(selectedDate+'T12:00:00').getDay()+6)%7;
    }
    ensureOv().classList.add('open'); document.body.style.overflow='hidden'; render(); pull(true); ensureToken().then(function(){ render(); });
  }
  function close(){ var ov=$('stOverlay'); if(ov) ov.classList.remove('open'); document.body.style.overflow=''; try{ A.onChange(); }catch(e){} }
  function rerenderOpen(){ var ov=$('stOverlay'); if(ov&&ov.classList.contains('open')) render(); else { var c=$('stCard'); if(c) c.innerHTML=cardHtml(); } }
  function monthStart(s,delta){
    var d=new Date(s+'T12:00:00'); d.setDate(1); d.setMonth(d.getMonth()+delta); return ymd(d);
  }
  function monthEnd(s){ return addD(monthStart(s,1),-1); }
  function monthDays(s){ return Number(monthEnd(s).slice(8,10)); }
  function avgDays(start,end){
    var sum=0,n=0;
    for(var d=start;d<=end&&d<=today();d=addD(d,1)){ var v=stepsOf(d); if(v!=null){sum+=v;n++;} }
    return {v:n?sum/n:null,n:n,sum:sum};
  }
  function periodData(){
    var t=today(), pts=[], start,end,hasHourly=false;
    if(ST.mode==='day'){
      start=ST.anchor; end=start;
      var hours=H()[start]||{}, latestHour=0, dayLabel=new Date(start+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
      for(var hour=0;hour<24;hour++){
        var hv=hours['steps_h'+String(hour).padStart(2,'0')];
        if(hv!=null){hasHourly=true;latestHour=hour;}
        pts.push({start:start,end:start,v:hv==null?null:hv,n:hv==null?0:1,sum:hv||0,hour:hour,l:String(hour)+' h',detail:String(hour).padStart(2,'0')+':00–'+String((hour+1)%24).padStart(2,'0')+':00'});
      }
      if(A.app!=='adrien'){
        var dayValue=stepsOf(start);
        pts=[{start:start,end:end,v:dayValue,n:dayValue==null?0:1,sum:dayValue||0,l:'Jour',detail:dayLabel}];
        hasHourly=false;
      } else if(hasHourly) pts.forEach(function(p){ if(p.hour%3!==0) p.l=''; });
      pts.hourlyDate=dayLabel;
      pts.selectedHour=hasHourly?latestHour:Math.min(new Date().getHours(),23);
    } else if(ST.mode==='week'){
      start=monOf(ST.anchor); end=addD(start,6);
      for(var d=start;d<=end;d=addD(d,1)){
        var v=stepsOf(d), future=d>t;
        pts.push({start:d,end:d,v:v,n:v==null||future?0:1,sum:v||0,l:new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short'}).replace('.',''),detail:new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})});
      }
    } else if(ST.mode==='month'){
      start=monthStart(ST.anchor,0); end=monthEnd(start);
      for(var md=start;md<=end;md=addD(md,1)){
        var mv=stepsOf(md), isFuture=md>t, label=Number(md.slice(8,10));
        pts.push({start:md,end:md,v:mv,n:mv==null||isFuture?0:1,sum:mv||0,l:label%5===1||label===monthDays(start)?String(label):'',detail:new Date(md+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})});
      }
    } else {
      var year=Number(ST.anchor.slice(0,4));
      start=year+'-01-01'; end=year+'-12-31';
      for(var m=0;m<12;m++){
        var mStart=year+'-'+String(m+1).padStart(2,'0')+'-01', mEnd=monthEnd(mStart), avg=avgDays(mStart,mEnd);
        var monthName=new Date(mStart+'T12:00:00').toLocaleDateString('fr-FR',{month:'short'}).replace('.','');
        pts.push({start:mStart,end:mEnd,v:avg.v,n:avg.n,sum:avg.sum,l:monthName,detail:new Date(mStart+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'})});
      }
    }
    var selectedIndex=ST.mode==='day'&&pts.selectedHour!=null?pts.selectedHour:0;
    if(ST.mode==='week') selectedIndex=Math.max(0,Math.min(6,(new Date(ST.anchor+'T12:00:00').getDay()+6)%7));
    else if(ST.mode==='month') selectedIndex=Math.max(0,Math.min(pts.length-1,Number(ST.anchor.slice(8,10))-1));
    else if(ST.mode==='year') selectedIndex=Number(ST.anchor.slice(5,7))-1;
    ST.selected=Math.max(0,Math.min(pts.length-1,ST.selected==null?selectedIndex:ST.selected));
    return {pts:pts,start:start,end:end,selectedIndex:selectedIndex,hasHourly:hasHourly};
  }
  function chartHtml(){
    var data=periodData(), pts=data.pts, selected=pts[ST.selected];
    var max=12000; pts.forEach(function(p){if(p.v>max) max=p.v;});
    var modeLabel={day:'Jour',week:'Semaine',month:'Mois',year:'Année'}[ST.mode];
    var title=ST.mode==='day'?pts.hourlyDate||selected.detail:ST.mode==='week'?dm(data.start)+' – '+dm(data.end):ST.mode==='month'?new Date(data.start+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'}):String(data.start.slice(0,4));
    var bars=pts.map(function(p,i){
      var ht=p.v==null?0:Math.max(3,Math.round(p.v/max*100));
      var selectedClass=i===ST.selected?' selected':'';
      var avgMode=ST.mode==='year';
      return '<button type="button" class="st-point'+(ST.mode==='month'?' dense':'')+(p.hour!=null?' hour-point':'')+selectedClass+(p.v==null?' empty':'')+'" onclick="STEPS._select('+i+')" aria-pressed="'+(i===ST.selected)+'" aria-label="'+p.detail+' : '+(p.v==null?'aucune donnée':fmt(p.v)+(avgMode?' pas de moyenne par jour':' pas'))+'">'
        +'<span class="st-point-val">'+(p.v==null?'':fmt(p.v))+'</span><span class="st-point-track"><i class="t-'+tier(p.v)+'" style="height:'+ht+'%"></i>'+(p.hour==null?'<b class="st-goal-line" style="bottom:'+Math.min(100,GOAL/max*100)+'%"></b>':'')+'</span><span class="st-point-label">'+p.l+'</span></button>';
    }).join('');
    var dailyValue=ST.mode==='day'?stepsOf(ST.anchor):null;
    var value=selected&&selected.v!=null?fmt(selected.v):ST.mode==='day'&&!data.hasHourly&&dailyValue!=null?fmt(dailyValue):'—';
    var valueLabel=ST.mode==='year'?'pas · moyenne par jour':ST.mode==='day'&&data.hasHourly?'pas · '+selected.detail:'pas';
    var detail='';
    if(A.app==='adrien'){
      if(ST.mode==='day') detail=data.hasHourly?(selected&&selected.v!=null?'Total sur cette heure':'Aucune donnée pour cette heure'):'Total de la journée';
      else if(selected&&selected.v!=null) detail=ST.mode==='year'?'moyenne quotidienne':ST.mode==='week'||ST.mode==='month'?'Total du jour sélectionné':'';
    } else detail=selected?(selected.n?selected.n+' jour'+(selected.n>1?'s':'')+' avec données'+(ST.mode==='week'||ST.mode==='month'?' · '+fmt(selected.sum)+' pas au total':''):'aucune donnée pour cette période'):'';
    var detailLine=A.app==='adrien'?detail:(selected?selected.detail:'')+(detail?' · '+detail:'');
    var totalLine=A.app==='adrien'&&ST.mode==='week'?'<div class="st-period-total"><span>Total cette semaine</span><strong>'+fmt(week(monOf(ST.anchor)).sum)+'</strong></div>':'';
    var rangeButtons='<div class="st-rng">'+[['day','Jour'],['week','Semaine'],['month','Mois'],['year','An']].map(function(x){return '<button type="button" class="'+(ST.mode===x[0]?'on':'')+'" onclick="STEPS._mode(\''+x[0]+'\')">'+x[1]+'</button>';}).join('')+'</div>';
    var chartHead=A.app==='adrien'?'<div class="st-chart-head st-chart-head-modern">'+rangeButtons+'</div>':'<div class="st-chart-head"><div><div class="st-chart-title">Historique</div><div class="st-chart-date">'+title+'</div></div>'+rangeButtons+'</div>';
    var chart=ST.mode==='day'&&A.app==='adrien'&&!data.hasHourly
      ?'<div class="st-chart-wrap st-hourly-empty">Le détail heure par heure apparaîtra dès que le Raccourci iOS enverra une valeur par heure, de <code>steps_h00</code> à <code>steps_h23</code>. Le total journalier reste affiché ci-dessus.</div>'
      :'<div class="st-chart-wrap" data-mode="'+ST.mode+'"><div class="st-chart-bars mode-'+ST.mode+(A.app==='adrien'?' adrien':'')+(ST.mode==='day'&&data.hasHourly?' hourly':'')+'">'+bars+'</div></div>';
    return chartHead
      +'<div class="st-chart-nav"><button type="button" onclick="STEPS._page(-1)" aria-label="Période précédente">‹</button><span>'+modeLabel+' · '+title+'</span><button type="button" onclick="STEPS._page(1)" aria-label="Période suivante" '+(data.end>=today()?'disabled':'')+'>›</button></div>'
      +'<div class="st-chart-detail"><strong class="t-'+tier(selected&&selected.v)+'">'+value+'</strong><span>'+valueLabel+'</span><small>'+detailLine+'</small></div>'
      +totalLine
      +chart
      +'<div class="st-chart-foot">'+(A.app==='adrien'&&ST.mode==='day'?data.hasHourly?'Pas par heure · total de la journée affiché dans les statistiques':'Total journalier · objectif '+fmt(GOAL)+' par jour':'Pas quotidiens · objectif '+fmt(GOAL)+' par jour')+'</div>';
  }
  function bindChartSwipe(){
    var wrap=document.querySelector('.st-chart-wrap'); if(!wrap) return;
    wrap.addEventListener('pointerdown',function(e){ ST.touchX=e.clientX; ST.touchY=e.clientY; });
    wrap.addEventListener('pointerup',function(e){
      if(ST.touchX==null) return;
      var dx=e.clientX-ST.touchX,dy=e.clientY-ST.touchY; ST.touchX=null; ST.touchY=null;
      if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.3) page(dx<0?1:-1);
    });
    wrap.addEventListener('pointercancel',function(){ST.touchX=null;ST.touchY=null;});
  }
  function page(direction){
    if(direction>0&&periodData().end>=today()) return;
    if(ST.mode==='day') ST.anchor=addD(ST.anchor,direction);
    else if(ST.mode==='week') ST.anchor=addD(monOf(ST.anchor),direction*7);
    else if(ST.mode==='month') ST.anchor=monthStart(ST.anchor,direction);
    else ST.anchor=monthStart(ST.anchor,direction*12);
    ST.selected=null;
    updateHistory();
  }
  function setMode(mode){
    if(['day','week','month','year'].indexOf(mode)<0) return;
    if(A.app==='adrien'&&mode==='day'&&ST.mode!=='day'){
      var current=periodData().pts[ST.selected];
      if(current) ST.anchor=current.start;
    }
    ST.mode=mode; ST.selected=null; updateHistory();
  }
  function selectPoint(i){
    var p=periodData().pts[i]; if(!p) return;
    if(A.app==='adrien'){
      ST.selected=i;
      if(ST.mode==='week') cardSelectedDate=p.start;
    }
    else if(ST.mode==='year'){ ST.anchor=p.start; ST.mode='month'; ST.selected=null; }
    else if(ST.mode==='month'||ST.mode==='week'){ ST.anchor=p.start; ST.mode='day'; ST.selected=0; }
    else ST.selected=i;
    updateHistory();
  }
  function updateHistory(){
    var el=document.querySelector('.st-history'); if(!el) return;
    var scroll=el.closest('.as-scroll'), top=scroll?scroll.scrollTop:0;
    el.innerHTML=historyHtml();
    if(scroll) scroll.scrollTop=top;
    bindChartSwipe();
  }
  function historyHtml(){
    var S=A.app==='adrien'?periodStats():allTimeStats(), h=chartHtml();
    if(S&&S.cards) h+='<div class="st-grid st-period-stats">'+S.cards.map(function(c){
      return '<div><b class="'+(c.tier?'t-'+c.tier:'')+'">'+c.value+'</b><small>'+c.label+(c.note?' · '+c.note:'')+'</small></div>';
    }).join('')+'</div>';
    else if(S) h+='<div class="st-grid">'
      +'<div><b class="t-'+tier(S.best.v)+'">'+fmt(S.best.v)+'</b><small>record · '+dm(S.best.d)+'</small></div>'
      +'<div><b class="t-'+tier(S.bw?S.bw.avg:null)+'">'+(S.bw?fmt(S.bw.avg):'—')+'</b><small>meilleure semaine'+(S.bw?' · '+dm(S.bw.mon):'')+'</small></div>'
      +'<div><b class="t-'+tier(S.avg)+'">'+fmt(S.avg)+'</b><small>moyenne depuis le '+dm(S.first)+'</small></div>'
      +'<div><b>'+(S.tot>=1e6?String(Math.round(S.tot/1e5)/10).replace('.',',')+' M':fmt(S.tot))+'</b><small>pas au total · '+S.n+' jours</small></div>'
      +'</div>';
    else h+='<p class="st-sub">L’historique apparaîtra dès le premier envoi du Raccourci.</p>';
    return h;
  }
  function periodStats(){
    var start,end,mode=ST.mode;
    if(mode==='day') start=end=ST.anchor;
    else if(mode==='week'){ start=monOf(ST.anchor); end=addD(start,6); }
    else if(mode==='month'){ start=monthStart(ST.anchor,0); end=monthEnd(start); }
    else { start=ST.anchor.slice(0,4)+'-01-01'; end=ST.anchor.slice(0,4)+'-12-31'; }
    var days=[],sum=0,goalDays=0,best=null;
    for(var d=start;d<=end&&d<=today();d=addD(d,1)){
      var v=stepsOf(d); if(v==null) continue;
      days.push({d:d,v:v}); sum+=v;
      if(v>=GOAL) goalDays++;
      if(!best||v>best.v) best={d:d,v:v};
    }
    if(!days.length) return null;
    if(mode==='day'){
      var record=H()[start]||{},activeHours=0,bestHour=null;
      for(var i=0;i<24;i++){
        var hv=record['steps_h'+String(i).padStart(2,'0')];
        if(hv!=null&&hv>0) activeHours++;
        if(hv!=null&&(!bestHour||hv>bestHour.v)) bestHour={hour:i,v:hv};
      }
      var daily=days[0].v;
      return {cards:[
        {value:fmt(daily),label:'Pas sur la journée',tier:tier(daily)},
        {value:activeHours?String(activeHours):'—',label:'Heures actives',note:activeHours?'sur 24':'détail horaire à synchroniser'},
        {value:bestHour?fmt(bestHour.v):'—',label:'Heure la plus active',note:bestHour?String(bestHour.hour).padStart(2,'0')+' h':'détail horaire à synchroniser',tier:bestHour?tier(bestHour.v):''},
        {value:daily>=GOAL?'Atteint':'À faire',label:'Objectif quotidien',note:daily>=GOAL?'✅':fmt(Math.max(0,GOAL-daily))+' pas restants'}
      ]};
    }
    var avg=sum/days.length, cards=[
      {value:fmt(sum),label:'Pas au total'},
      {value:fmt(avg),label:'Moyenne par jour',tier:tier(avg)},
      {value:fmt(best.v),label:'Meilleur jour',note:dm(best.d),tier:tier(best.v)},
      {value:String(goalDays)+' / '+days.length,label:'Jours à '+fmt(GOAL)+' pas'}
    ];
    if(mode==='year'){
      var months={};
      days.forEach(function(x){ var key=x.d.slice(0,7); months[key]=(months[key]||0)+x.v; });
      var bestMonth=Object.keys(months).sort(function(a,b){return months[b]-months[a];})[0];
      cards[2]={value:bestMonth?fmt(months[bestMonth]):'—',label:'Mois le plus actif',note:bestMonth?new Date(bestMonth+'-01T12:00:00').toLocaleDateString('fr-FR',{month:'long'}):'',tier:bestMonth?tier(months[bestMonth]/days.filter(function(x){return x.d.slice(0,7)===bestMonth;}).length):''};
    }
    return {cards:cards};
  }
  function allTimeStats(){
    var h=H(), days=Object.keys(h).filter(function(d){ return stepsOf(d)!=null; }).sort();
    if(!days.length) return null;
    var best=null,tot=0; days.forEach(function(d){ var v=stepsOf(d); tot+=v; if(!best||v>best.v) best={d:d,v:v}; });
    var bw=null, m=monOf(days[0]), mEnd=monOf(today());
    for(;m<=mEnd;m=addD(m,7)){ var w=week(m); if(w.n>=4&&(!bw||w.avg>bw.avg)) bw=w; }
    return {n:days.length,first:days[0],best:best,tot:tot,avg:tot/days.length,bw:bw};
  }
  function render(){
    var body=$('stBody'); if(!body) return;
    var t=today(), v=stepsOf(t), w=week(monOf(t)), pw=week(addD(monOf(t),-7));
    if(A.app==='adrien'){
      periodData();
      var h='<div class="as-hdr st-header"><div class="as-hdr-left"><button class="as-exit st-exit" onclick="STEPS.close()" title="Fermer" aria-label="Fermer">✕</button></div>'
        +'<div class="as-hdr-mid"><div class="as-hdr-title">👟 Pas</div><div class="as-hdr-sub">'+(meta().syncAt?'synchro '+ago(meta().syncAt):'objectif : '+fmt(GOAL)+' pas par jour')+'</div></div>'
        +'<div class="as-hdr-right"><button class="as-hbtn" onclick="STEPS.refresh()" title="Actualiser avec Raccourcis" aria-label="Actualiser">↻</button></div></div>'
        +'<div class="as-scroll st-scroll st-scroll-modern"><div class="wn-card st-history">'+historyHtml()+'</div>';
      var mets=Object.keys(MET).filter(function(k){return Object.keys(H()).some(function(d){return H()[d][k]!=null;});});
      if(mets.length){
        h+='<div class="wn-card st-sec st-activity"><div class="wn-title">Activité · app Santé</div><div class="st-grid">';
        mets.forEach(function(k){
          var m=MET[k], tv=(H()[t]||{})[k], s7=0,n7=0; for(var j=0;j<7;j++){var x=(H()[addD(t,-j)]||{})[k];if(x!=null){s7+=x;n7++;}}
          var f=function(x){return x==null?'—':(m.dec?String(Math.round(x*10)/10).replace('.',','):fmt(x));};
          h+='<div><b>'+m.ico+' '+f(tv)+(m.u?' <small>'+m.u+'</small>':'')+'</b><small>'+m.lbl+' · aujourd’hui</small><small class="st-7">moy. 7 j : '+f(n7?s7/n7:null)+'</small></div>';
        });
        h+='</div></div>';
      }
      var opts=''; for(var k=0;k<7;k++){var dd=addD(t,-k);opts+='<option value="'+dd+'">'+(k===0?'Aujourd’hui':k===1?'Hier':dm(dd))+'</option>';}
      h+='<details class="wn-card st-sec st-manual"><summary>Saisie à la main <small>(au cas où)</small></summary>'
        +'<p class="st-sub">Seulement si le Raccourci n’a rien envoyé pour ce jour — Santé reste prioritaire.</p>'
        +'<div class="st-man"><select id="stMd">'+opts+'</select><input id="stMv" type="number" inputmode="numeric" min="0" max="100000" placeholder="nb de pas"><button type="button" onclick="STEPS._manual()">OK</button></div></details>';
      if(_status==='notable'||_status==='err') h+='<p class="st-sync-error">'+(_status==='notable'?'Connexion Santé incomplète : vérifie l’installation Supabase.':'La synchronisation Santé a échoué. Vérifie la connexion puis actualise.')+'</p>';
      if(link()) h+='<div class="st-copy-link"><span>🔗 Lien du raccourci</span><button type="button" onclick="STEPS._copy()">Copier le lien</button></div>';
      h+='</div>';
      body.innerHTML=h;
      bindChartSwipe();
      return;
    }
    var h='<div class="as-hdr st-header"><div class="as-hdr-left"><button class="as-exit st-exit" onclick="STEPS.close()" title="Fermer" aria-label="Fermer">✕</button></div>'
      +'<div class="as-hdr-mid"><div class="as-hdr-title">👟 Pas</div><div class="as-hdr-sub">'+(meta().syncAt?'synchro Santé '+ago(meta().syncAt):'objectif : '+fmt(GOAL)+' de moyenne par semaine')+'</div></div>'
      +'<div class="as-hdr-right"><button class="as-hbtn" onclick="STEPS.refresh()" title="Actualiser">↻</button></div></div>';
    h+='<div class="as-scroll st-scroll">';
    // Aujourd'hui
    var pct=v!=null?Math.min(1,v/10000):0, C=2*Math.PI*52;
    h+='<div class="st-hero"><svg viewBox="0 0 120 120" class="st-ring"><circle cx="60" cy="60" r="52" class="st-rbg"/><circle cx="60" cy="60" r="52" class="st-rfg t-'+tier(v)+'" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-pct)).toFixed(1)+'" transform="rotate(-90 60 60)"/></svg>'
      +'<div class="st-hc"><b class="t-'+tier(v)+'">'+(v!=null?fmt(v):'—')+'</b><small>pas aujourd’hui</small><em class="t-'+tier(v)+'">'+(v==null?'pas encore de données':v>=10000?'🥇 journée gold':v>=8000?'✅ objectif du jour':'encore '+fmt(8000-v)+' pour 8 000')+'</em></div></div>';
    // Semaine
    h+='<div class="wn-card st-sec st-week-card"><div class="wn-title">Cette semaine</div>'+cardWeek(w)
      +'<div class="st-wl"><span>Moyenne</span><b class="t-'+tier(w.avg)+'">'+(w.avg!=null?fmt(w.avg):'—')+'</b><em>'+(w.avg==null?'':w.avg>=GOAL?'objectif tenu ✅':'il manque '+fmt(GOAL-w.avg)+' / jour')+'</em></div>'
      +'<div class="st-wl"><span>Semaine dernière</span><b class="t-'+tier(pw.avg)+'">'+(pw.avg!=null?fmt(pw.avg):'—')+'</b><em>'+(pw.n?pw.n+' jours renseignés':'')+'</em></div>'
      +'</div>';
    // Historique
    h+='<div class="wn-card st-sec st-history">'+historyHtml()+'</div>';
    // Activité (le reste de Santé)
    var mets=Object.keys(MET).filter(function(k){ return Object.keys(H()).some(function(d){ return H()[d][k]!=null; }); });
    if(mets.length){
      h+='<div class="wn-card st-sec st-activity"><div class="wn-title">Activité · app Santé</div><div class="st-grid">';
      mets.forEach(function(k){
        var m=MET[k], tv=(H()[t]||{})[k], s7=0,n7=0; for(var j=0;j<7;j++){ var x=(H()[addD(t,-j)]||{})[k]; if(x!=null){ s7+=x; n7++; } }
        var f=function(x){ return x==null?'—':(m.dec?String(Math.round(x*10)/10).replace('.',','):fmt(x)); };
        h+='<div><b>'+m.ico+' '+f(tv)+(m.u?' <small>'+m.u+'</small>':'')+'</b><small>'+m.lbl+' · aujourd’hui</small><small class="st-7">moy. 7 j : '+f(n7?s7/n7:null)+'</small></div>';
      });
      h+='</div></div>';
    }
    // Saisie manuelle
    var opts=''; for(var k=0;k<7;k++){ var dd=addD(t,-k); opts+='<option value="'+dd+'">'+(k===0?'Aujourd’hui':k===1?'Hier':dm(dd))+'</option>'; }
    h+='<details class="wn-card st-sec st-manual"><summary>Saisie à la main <small>(au cas où)</small></summary>'
      +'<p class="st-sub">Seulement si le Raccourci n’a rien envoyé pour ce jour — Santé reste prioritaire.</p>'
      +'<div class="st-man"><select id="stMd">'+opts+'</select><input id="stMv" type="number" inputmode="numeric" min="0" max="100000" placeholder="nb de pas"><button type="button" onclick="STEPS._manual()">OK</button></div></details>';
    // Lien personnel utilisé dans le raccourci
    if(_status==='notable'||_status==='err') h+='<p class="st-sync-error">'+(_status==='notable'?'Connexion Santé incomplète : vérifie l’installation Supabase.':'La synchronisation Santé a échoué. Vérifie la connexion puis actualise.')+'</p>';
    if(link()) h+='<div class="st-copy-link"><span>🔗 Lien du raccourci</span><button type="button" onclick="STEPS._copy()">Copier le lien</button></div>';
    h+='</div>';
    var oldScroll=body.querySelector('.as-scroll'), scrollTop=oldScroll?oldScroll.scrollTop:0;
    body.innerHTML=h;
    var newScroll=body.querySelector('.as-scroll'); if(newScroll) newScroll.scrollTop=scrollTop;
    bindChartSwipe();
  }
  function cardWeek(w,selectedDate){
    var t=today(), J=['L','M','M','J','V','S','D'], mx=12000; w.days.forEach(function(x){ if(x.v>mx) mx=x.v; });
    if(A.app==='adrien') return '<div class="st-week big st-week-select">'+w.days.map(function(x,i){var hg=x.v!=null?Math.max(6,Math.round(x.v/mx*100)):0;
      return '<button type="button" class="st-bd'+(x.d===selectedDate?' selected':'')+(x.d===t?' now':'')+(x.fut?' fut':'')+'" onclick="STEPS._selectCard(\''+x.d+'\')" aria-label="'+new Date(x.d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+' : '+(x.v==null?'aucune donnée':fmt(x.v)+' pas')+'" aria-pressed="'+(x.d===selectedDate)+'"><span class="st-bv">'+(x.v!=null?fmt(x.v):'')+'</span><span class="st-bc"><i class="t-'+tier(x.v)+'" style="height:'+hg+'%"></i></span><span class="st-bl">'+J[i]+'</span></button>';}).join('')+'</div>';
    return '<div class="st-week big">'+w.days.map(function(x,i){ var hg=x.v!=null?Math.max(6,Math.round(x.v/mx*100)):0;
      return '<div class="st-bd'+(x.d===t?' now':'')+(x.fut?' fut':'')+'"><span class="st-bv">'+(x.v!=null?k1(x.v):'')+'</span><span class="st-bc"><i class="t-'+tier(x.v)+'" style="height:'+hg+'%"></i><b class="st-g8" style="bottom:'+(8000/mx*100)+'%"></b></span><span class="st-bl">'+J[i]+'</span></div>'; }).join('')+'</div>';
  }
  function refresh(){
    // Le raccourci s'exécute dans une autre app : relire au retour, puis laisser le temps au POST.
    _refreshUntil=Date.now()+60000;
    A.toast('Raccourci lancé — reviens dans MASSUP après son exécution.');
    try{ window.location.href='shortcuts://run-shortcut?name='+encodeURIComponent(SC); }
    catch(e){ _refreshUntil=0; A.toast('Impossible d’ouvrir Raccourcis sur cet appareil.'); }
  }
  function manual(){
    var d=$('stMd').value, v=parseInt($('stMv').value,10);
    if(isNaN(v)||v<0||v>100000){ A.toast('Nombre de pas invalide'); return; }
    var e=H()[d]||(H()[d]={}); e.ms=v; A.save();
    A.toast(e.steps!=null?'Santé a déjà une valeur pour ce jour — elle reste prioritaire':'👟 '+fmt(v)+' pas enregistrés');
    render();
  }
  function copy(){ var L=link(); if(!L) return; try{ navigator.clipboard.writeText(L).then(function(){ A.toast('🔗 Lien copié — colle-le dans le Raccourci'); },function(){ window.prompt('Copie ton lien :',L); }); }catch(e){ window.prompt('Copie ton lien :',L); } }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden||!A) return;
    if(Date.now()<_refreshUntil){
      pull(true);
      [1500,4000,9000].forEach(function(delay){
        setTimeout(function(){ if(!document.hidden&&Date.now()<_refreshUntil) pull(true); },delay);
      });
    } else pull(false);
  });
  function init(adapter){ A=adapter; }
  function renderPreservingScroll(body,html,preserve){
    var oldScroll=body.querySelector('.as-scroll'), scrollTop=oldScroll?oldScroll.scrollTop:0;
    body.innerHTML=html;
    if(preserve&&oldScroll){
      var newScroll=body.querySelector('.as-scroll'); if(newScroll) newScroll.scrollTop=scrollTop;
    }
  }
  return {init:init,renderCard:renderCard,open:open,close:close,refresh:refresh,pull:pull,week:week,weekPts:weekPts,stepsOf:stepsOf,tier:tier,
    renderPreservingScroll:renderPreservingScroll,_mode:setMode,_select:selectPoint,_selectCard:selectCardDate,_page:page,_manual:manual,_copy:copy};
})();
