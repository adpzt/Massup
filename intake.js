/* ═══ 🍽 NUTRITION DU JOUR (02/11/2026) — MASSUP Adrien ═══
   Les totaux du jour viennent de Yazio → app Santé → raccourci « MASSUP Santé » (1 copie par mesure)
   → /api/health → health_days (clés nu_kcal, nu_glu, nu_prot, nu_lip, nu_fib, nu_sucre, nu_sat, nu_sodium, nu_potassium).
   Ces données NE vont PAS dans DB (le snapshot cloud resterait gonflé à chaque sauvegarde) : le serveur est la
   source, l'app en garde une copie locale (localStorage « massup_intake ») pour l'affichage hors ligne.
   Un jour est « noté » si ses calories > 0 ; un 0 sur une autre mesure = non renseigné par Yazio.
   Demandes d'Adrien (02/11) : moyenne des 7 derniers jours (jamais un « reste à manger » négatif), 3 bulles
   G · P · L (toujours dans cet ordre) avec le quota écrit, page détaillée sur le modèle de l'écran Pas. */
var INTAKE=(function(){
  var A=null, $=function(id){ return document.getElementById(id); };
  var LS='massup_intake';
  // Objectifs : 2 900 kcal (24/08, Adrien vise 2 900-3 000) · 360 G · 150 P · lipides 70 visés, 80 max (02/11)
  var NUT=[
    {k:'kcal',lbl:'Calories',short:'kcal',u:'kcal',goal:2900,kind:'min',col:'kcal'},
    {k:'glu',lbl:'Glucides',short:'G',u:'g',goal:360,kind:'min',col:'glu'},
    {k:'prot',lbl:'Protéines',short:'P',u:'g',goal:150,kind:'min',col:'prot'},
    {k:'lip',lbl:'Lipides',short:'L',u:'g',goal:70,max:80,kind:'target',col:'lip'},
    {k:'fib',lbl:'Fibres',u:'g',goal:30,kind:'min',col:'mic'},
    {k:'sucre',lbl:'Sucres',u:'g',goal:50,kind:'max',col:'mic'},
    {k:'sat',lbl:'Graisses saturées',u:'g',goal:30,kind:'max',col:'mic'},
    {k:'sodium',lbl:'Sodium',u:'mg',goal:2300,kind:'max',col:'mic'},
    {k:'potassium',lbl:'Potassium',u:'mg',goal:3500,kind:'min',col:'mic'}
  ];
  var BY={}; NUT.forEach(function(n){ BY[n.k]=n; });
  var MACROS=['glu','prot','lip'];
  var cache={days:{},syncAt:0}, _pullAt=0, _status=null, _refreshUntil=0;

  function ymd(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function today(){ return ymd(new Date()); }
  function addD(s,n){ var d=new Date(s+'T12:00:00'); d.setDate(d.getDate()+n); return ymd(d); }
  function monOf(s){ var d=new Date(s+'T12:00:00'); d.setDate(d.getDate()-((d.getDay()+6)%7)); return ymd(d); }
  function monthStart(s,delta){ var d=new Date(s+'T12:00:00'); d.setDate(1); d.setMonth(d.getMonth()+delta); return ymd(d); }
  function monthEnd(s){ return addD(monthStart(s,1),-1); }
  function dm(s){ var p=s.split('-'); return p[2]+'/'+p[1]; }
  function fmt(n){ return Math.round(n).toLocaleString('fr-FR'); }
  function longDay(d){ return new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}); }
  function ago(ts){ var m=Math.round((Date.now()-ts)/60000); return m<1?'à l’instant':m<60?'il y a '+m+' min':m<1440?'il y a '+Math.round(m/60)+' h':'il y a '+Math.round(m/1440)+' j'; }

  function load(){ try{ var s=localStorage.getItem(LS); if(s){ var c=JSON.parse(s); if(c&&c.days) cache=c; } }catch(e){} }
  function persist(){ try{ localStorage.setItem(LS,JSON.stringify(cache)); }catch(e){ console.warn('[MASSUP] intake cache :',e); } }
  function day(d){ var e=cache.days[d]; return e&&e.kcal>0?e:null; }
  function val(d,k){ var e=day(d); return e&&e[k]>0?e[k]:null; }

  /* ── Synchro : SES lignes nu_* de health_days (RLS) ── */
  async function pull(force){
    if(!A) return;
    var sb=A.sb&&A.sb(); if(!sb){ _status='off'; return; }
    if(!force&&Date.now()-_pullAt<60000) return;
    _pullAt=Date.now();
    var since=addD(today(),-400), offset=0, rows=[];
    try{
      while(true){
        var r=await sb.from('health_days').select('d,k,v').gte('d',since).like('k','nu_*').order('d').order('k').range(offset,offset+999);
        if(r.error){ _status='err'; rerender(); return; }
        var page=r.data||[]; rows=rows.concat(page);
        if(page.length<1000) break;
        offset+=1000;
      }
      _status='ok';
      var days={};
      rows.forEach(function(row){ var k=String(row.k).slice(3), v=Number(row.v); if(!(v>0)) return; (days[row.d]=days[row.d]||{})[k]=Math.round(v*10)/10; });
      var changed=JSON.stringify(days)!==JSON.stringify(cache.days);
      cache={days:days,syncAt:Date.now()}; persist();
      if(changed){ try{ A.onChange(); }catch(e){} if(Date.now()<_refreshUntil) A.toast('✅ Nutrition Yazio reçue dans MASSUP'); }
      rerender();
    }catch(e){ _status='err'; rerender(); }
  }
  // Même raccourci que les pas : il envoie tout (pas + nutrition + pesée)
  function refresh(){
    _refreshUntil=Date.now()+60000;
    if(A&&A.runShortcut) A.runShortcut();
  }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden||!A) return;
    if(Date.now()<_refreshUntil){ pull(true); [1500,4000,9000].forEach(function(t){ setTimeout(function(){ if(!document.hidden&&Date.now()<_refreshUntil) pull(true); },t); }); }
    else pull(false);
  });

  /* ── Calculs ── */
  // Moyenne d'une mesure sur [start, end] : jours NOTÉS seulement (n = nb de jours notés, total = jours écoulés)
  function avg(start,end,k){
    var s=0,n=0,total=0;
    for(var d=start;d<=end&&d<=today();d=addD(d,1)){ total++; var v=val(d,k); if(v!=null){ s+=v; n++; } }
    return {v:n?s/n:null,n:n,total:total};
  }
  // Les 7 derniers jours COMPLETS (hier et les 6 d'avant) : aujourd'hui, encore en cours, fausserait la moyenne
  function last7(){ var end=addD(today(),-1); return {start:addD(end,-6),end:end}; }
  function pctOf(n,v){ return v==null?0:v/n.goal; }
  function status(n,v){
    if(v==null) return {txt:'non noté',ok:false};
    if(n.kind==='max') return v<=n.goal?{txt:'✓ sous le max',ok:true}:{txt:'au-dessus du max',ok:false};
    if(n.kind==='target') return v<=n.goal?{txt:'✓ dans la cible',ok:true}:v<=n.max?{txt:'✓ sous les '+n.max+' g',ok:true}:{txt:'au-dessus de '+n.max+' g',ok:false};
    return v>=n.goal?{txt:'✓ objectif',ok:true}:{txt:Math.round(v/n.goal*100)+' % de l’objectif',ok:false};
  }
  function quota(n){ return n.kind==='max'?n.goal+' '+n.u+' max':n.kind==='target'?n.goal+' '+n.u+' visés':fmt(n.goal)+' '+n.u; }

  /* ── Pièces d'affichage ── */
  function ring(n,v,size){
    var r=size/2-6, C=2*Math.PI*r, p=Math.min(1,pctOf(n,v));
    return '<svg viewBox="0 0 '+size+' '+size+'" class="in-ring-svg" aria-hidden="true"><circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" class="in-rbg"/>'
      +(v!=null?'<circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" class="in-rfg" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-p)).toFixed(1)+'" transform="rotate(-90 '+size/2+' '+size/2+')"/>':'')+'</svg>';
  }
  function ringsHtml(vals){
    return '<div class="in-rings">'+MACROS.map(function(k){
      var n=BY[k], v=vals[k], st=status(n,v);
      return '<div class="in-ring in-c-'+n.col+'" role="img" aria-label="'+n.lbl+' : '+(v==null?'non noté':fmt(v)+' '+n.u+' par jour sur '+quota(n))+'">'
        +'<div class="in-ring-box">'+ring(n,v,84)+'<div class="in-ring-c"><b>'+(v==null?'—':fmt(v))+'</b><small>'+n.u+'</small></div></div>'
        +'<div class="in-ring-l">'+n.lbl+'</div><div class="in-ring-q">/ '+quota(n)+'</div><div class="in-ring-s'+(st.ok?' ok':'')+'">'+st.txt+'</div></div>';
    }).join('')+'</div>';
  }
  function kcalHtml(v,sub){
    var n=BY.kcal, p=Math.min(1,pctOf(n,v)), st=status(n,v);
    return '<div class="in-kcal"><div class="in-kcal-v"><strong>'+(v==null?'—':fmt(v))+'</strong><span>/ '+fmt(n.goal)+' kcal par jour</span><em class="'+(st.ok?'ok':'')+'">'+st.txt+'</em></div>'
      +'<div class="in-meter" role="progressbar" aria-label="Calories, moyenne par jour" aria-valuemin="0" aria-valuemax="'+n.goal+'" aria-valuenow="'+Math.round(v||0)+'"><i style="width:'+(p*100).toFixed(1)+'%"></i></div>'
      +(sub?'<div class="in-kcal-sub">'+sub+'</div>':'')+'</div>';
  }
  // Répartition de l'énergie G · P · L (segments proportionnels aux kcal : 4 · 4 · 9 kcal/g)
  function splitHtml(vals){
    var e={glu:(vals.glu||0)*4,prot:(vals.prot||0)*4,lip:(vals.lip||0)*9}, tot=e.glu+e.prot+e.lip;
    if(!tot) return '';
    return '<div class="in-split" role="img" aria-label="Répartition des calories : '+MACROS.map(function(k){ return BY[k].lbl+' '+Math.round(e[k]/tot*100)+' %'; }).join(', ')+'">'
      +MACROS.map(function(k){ var sh=e[k]/tot; return sh>0?'<span class="in-c-'+BY[k].col+'" style="flex:'+sh.toFixed(4)+'">'+(sh>=.12?Math.round(sh*100)+' %':'')+'</span>':''; }).join('')+'</div>'
      +'<div class="in-legend">'+MACROS.map(function(k){ return '<span><i class="in-c-'+BY[k].col+'"></i>'+BY[k].lbl+' <b>'+(vals[k]!=null?fmt(vals[k])+' g':'—')+'</b></span>'; }).join('')+'</div>';
  }
  function avgVals(start,end){ var o={},n=0; NUT.forEach(function(x){ var a=avg(start,end,x.k); o[x.k]=a.v; if(x.k==='kcal'){ n=a.n; o._total=a.total; } }); o._n=n; return o; }

  /* ── Carte du Bilan (au-dessus des Pas) ── */
  function cardHtml(){
    var w=last7(), V=avgVals(w.start,w.end), t=day(today());
    var h='<section class="st-card st-card-modern in-card"><div class="st-top"><span class="st-ttl">🍽 Nutrition</span><div class="st-card-actions">'
      +'<button class="st-card-action" type="button" onclick="INTAKE.refresh()" aria-label="Actualiser avec le raccourci" title="Actualiser avec Raccourcis">↻</button>'
      +'<button class="st-card-action" type="button" onclick="INTAKE.open()" aria-label="Ouvrir la page Nutrition" title="Ouvrir en grand">⛶</button></div></div>';
    if(!Object.keys(cache.days).length){
      return h+'<p class="in-empty">Tes totaux Yazio arrivent par le raccourci « MASSUP Santé ». Touche ↻ pour les faire venir.</p></section>';
    }
    h+='<div class="in-period">Moyenne par jour · 7 derniers jours ('+dm(w.start)+' → '+dm(w.end)+') · <b>'+V._n+'/7</b> notés</div>'
      +kcalHtml(V.kcal,'')+ringsHtml(V);
    h+='<button type="button" class="in-today" onclick="INTAKE.open(\''+today()+'\')">'+(t?'Aujourd’hui (en cours) · <b>'+fmt(t.kcal)+' kcal</b> · '+MACROS.map(function(k){ return BY[k].short+' '+(t[k]?fmt(t[k]):'—'); }).join(' · '):'Aujourd’hui · rien de noté pour l’instant')+'<span aria-hidden="true">›</span></button>';
    return h+'</section>';
  }
  function renderCard(){
    if(!A) return;
    var host=$('bilanWeekNut'); if(!host) return;
    var el=$('inCard');
    if(!el){ el=document.createElement('div'); el.id='inCard'; }
    var st=$('stCard'), anchor=st||host.nextSibling;
    if(el.nextSibling!==st||!el.parentNode) host.parentNode.insertBefore(el,anchor);
    el.innerHTML=cardHtml();
    pull(false);
  }

  /* ── Page complète (modèle de l'écran Pas) ── */
  var IN={metric:'kcal',mode:'week',anchor:today(),selected:null,touchX:null,touchY:null};
  function ensureOv(){
    var ov=$('inOverlay'); if(ov) return ov;
    ov=document.createElement('div'); ov.className='as-overlay st-overlay st-overlay-adrien in-overlay'; ov.id='inOverlay';
    ov.innerHTML='<div class="as-frame" aria-hidden="true"></div><div class="as-body" id="inBody"></div>';
    document.body.appendChild(ov); return ov;
  }
  // Sans date : la semaine d'HIER (le dernier jour complet) — un lundi, la semaine en cours n'aurait qu'un jour
  function open(date){
    var d0=date||last7().end;
    IN.mode='week'; IN.anchor=d0; IN.selected=null; IN.pickDate=d0;
    try{ if(typeof closeDayModal==='function') closeDayModal(); }catch(e){}
    ensureOv().classList.add('open'); document.body.style.overflow='hidden'; render(); pull(true);
  }
  function close(){ var ov=$('inOverlay'); if(ov) ov.classList.remove('open'); document.body.style.overflow=''; try{ A.onChange(); }catch(e){} }
  function isOpen(){ var ov=$('inOverlay'); return !!(ov&&ov.classList.contains('open')); }
  function rerender(){ if(isOpen()) render(); else { var c=$('inCard'); if(c) c.innerHTML=cardHtml(); } }

  function periodData(){
    var t=today(), n=BY[IN.metric], pts=[], start, end;
    if(IN.mode==='week'||IN.mode==='month'){
      start=IN.mode==='week'?monOf(IN.anchor):monthStart(IN.anchor,0); end=IN.mode==='week'?addD(start,6):monthEnd(start);
      for(var d=start;d<=end;d=addD(d,1)){
        var num=Number(d.slice(8,10)), last=Number(end.slice(8,10));
        pts.push({start:d,end:d,v:val(d,n.k),fut:d>t,l:IN.mode==='week'?new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short'}).replace('.',''):(num%5===1||num===last?String(num):''),detail:longDay(d)});
      }
    } else {
      var y=Number(IN.anchor.slice(0,4)); start=y+'-01-01'; end=y+'-12-31';
      for(var m=0;m<12;m++){
        var ms=y+'-'+String(m+1).padStart(2,'0')+'-01', me=monthEnd(ms), a=avg(ms,me,n.k);
        pts.push({start:ms,end:me,v:a.v,n:a.n,fut:ms>t,l:new Date(ms+'T12:00:00').toLocaleDateString('fr-FR',{month:'short'}).replace('.',''),detail:new Date(ms+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'})});
      }
    }
    if(IN.selected==null){
      var want=IN.pickDate||null, idx=-1;
      if(want) pts.forEach(function(p,i){ if(p.start<=want&&want<=p.end) idx=i; });
      if(idx<0) for(var i=pts.length-1;i>=0;i--){ if(!pts[i].fut&&pts[i].v!=null){ idx=i; break; } }
      if(idx<0) pts.forEach(function(p,i){ if(p.start<=t&&t<=p.end) idx=i; });
      IN.selected=Math.max(0,idx); IN.pickDate=null;
    }
    return {pts:pts,start:start,end:end};
  }
  function chartHtml(){
    var n=BY[IN.metric], D=periodData(), pts=D.pts, sel=pts[IN.selected]||pts[0];
    var max=n.goal*1.25; pts.forEach(function(p){ if(p.v>max) max=p.v; });
    var title=IN.mode==='week'?dm(D.start)+' – '+dm(D.end):IN.mode==='month'?new Date(D.start+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'}):D.start.slice(0,4);
    var chips='<div class="in-metrics" role="tablist" aria-label="Mesure affichée">'+NUT.map(function(x){ return '<button type="button" role="tab" aria-selected="'+(IN.metric===x.k)+'" class="'+(IN.metric===x.k?'on':'')+'" onclick="INTAKE._metric(\''+x.k+'\')">'+(x.col!=='mic'&&x.col!=='kcal'?'<i class="in-c-'+x.col+'"></i>':'')+x.lbl+'</button>'; }).join('')+'</div>';
    var rng='<div class="st-rng">'+[['week','Semaine'],['month','Mois'],['year','An']].map(function(x){ return '<button type="button" class="'+(IN.mode===x[0]?'on':'')+'" onclick="INTAKE._mode(\''+x[0]+'\')">'+x[1]+'</button>'; }).join('')+'</div>';
    var bars=pts.map(function(p,i){
      var ht=p.v==null?0:Math.max(3,Math.round(p.v/max*100));
      return '<button type="button" class="st-point'+(IN.mode==='month'?' dense':'')+(i===IN.selected?' selected':'')+(p.v==null?' empty':'')+'" onclick="INTAKE._select('+i+')" aria-pressed="'+(i===IN.selected)+'" aria-label="'+p.detail+' : '+(p.v==null?'non noté':fmt(p.v)+' '+n.u+(IN.mode==='year'?' par jour en moyenne':''))+'"'+(p.fut?' disabled':'')+'>'
        +'<span class="st-point-val">'+(p.v==null?'':fmt(p.v))+'</span><span class="st-point-track"><i class="in-c-'+n.col+'" style="height:'+ht+'%"></i><b class="st-goal-line" style="bottom:'+Math.min(100,n.goal/max*100).toFixed(1)+'%"></b></span><span class="st-point-label">'+p.l+'</span></button>';
    }).join('');
    // Détail du point choisi : la valeur, puis pour un jour (ou un mois) les 3 macros dans l'ordre G · P · L
    var detail;
    if(IN.mode==='year'){
      var mv=avgVals(sel.start,sel.end);
      detail='<div class="st-chart-detail"><strong>'+(sel.v==null?'—':fmt(sel.v))+'</strong><span>'+n.u+' · moyenne par jour</span><small>'+sel.detail+' · '+(mv._n||0)+' jour'+(mv._n>1?'s':'')+' notés</small></div>'+(mv._n?splitHtml(mv):'');
    } else {
      var e=day(sel.start);
      detail='<div class="st-chart-detail"><strong>'+(sel.v==null?'—':fmt(sel.v))+'</strong><span>'+n.u+'</span><small>'+sel.detail+(sel.v==null?' · '+(e?'non renseigné par Yazio':'rien de noté dans Yazio'):' · '+status(n,sel.v).txt)+'</small></div>'
        +(e?'<div class="in-day-kcal">'+fmt(e.kcal)+' kcal ce jour-là</div>'+splitHtml(e):'');
    }
    // Stats de la période (jours notés seulement)
    var vs=pts.filter(function(p){ return !p.fut&&p.v!=null; }), stats='';
    if(vs.length){
      var mean=vs.reduce(function(s,p){ return s+p.v; },0)/vs.length;
      var hit=vs.filter(function(p){ return status(n,p.v).ok; }).length;
      var top=vs.slice().sort(function(a,b){ return b.v-a.v; })[0];
      var elapsed=pts.filter(function(p){ return !p.fut; }).length;
      stats='<div class="st-grid in-stats">'
        +'<div><b>'+fmt(mean)+' <small>'+n.u+'</small></b><small>Moyenne par jour'+(IN.mode==='year'?' (mois notés)':'')+'</small></div>'
        +'<div><b>'+vs.length+' / '+elapsed+'</b><small>'+(IN.mode==='year'?'Mois avec des jours notés':'Jours notés')+'</small></div>'
        +'<div><b>'+hit+' / '+vs.length+'</b><small>'+(n.kind==='max'?'Sous le max de '+fmt(n.goal)+' '+n.u:n.kind==='target'?'Sous les '+n.max+' '+n.u:'À l’objectif ('+fmt(n.goal)+' '+n.u+')')+'</small></div>'
        +'<div><b>'+fmt(top.v)+' <small>'+n.u+'</small></b><small>'+(IN.mode==='year'?'Mois le plus haut':'Jour le plus haut')+' · '+(IN.mode==='year'?top.detail:dm(top.start))+'</small></div></div>';
    } else stats='<p class="st-sub">Rien de noté dans Yazio sur cette période.</p>';
    return '<div class="wn-title in-h">Historique</div>'+chips
      +'<div class="st-chart-head st-chart-head-modern">'+rng+'</div>'
      +'<div class="st-chart-nav"><button type="button" onclick="INTAKE._page(-1)" aria-label="Période précédente">‹</button><span>'+n.lbl+' · '+title+'</span><button type="button" onclick="INTAKE._page(1)" aria-label="Période suivante" '+(D.end>=today()?'disabled':'')+'>›</button></div>'
      +detail
      +'<div class="st-chart-wrap"><div class="st-chart-bars adrien mode-'+IN.mode+'">'+bars+'</div></div>'
      +'<div class="st-chart-foot">'+n.lbl+' par jour · trait = '+(n.kind==='max'?'max ':n.kind==='target'?'cible ':'objectif ')+fmt(n.goal)+' '+n.u+'</div>'
      +stats;
  }
  function microsHtml(){
    var w=last7();
    return '<div class="wn-card st-sec in-micros"><div class="wn-title">Le reste · moyenne 7 jours</div>'+NUT.filter(function(x){ return x.col==='mic'; }).map(function(x){
      var a=avg(w.start,w.end,x.k), st=status(x,a.v), p=Math.min(1,pctOf(x,a.v));
      return '<button type="button" class="in-mrow" onclick="INTAKE._metric(\''+x.k+'\',true)"><span class="in-mrow-l">'+x.lbl+'</span><span class="in-mrow-v"><b>'+(a.v==null?'—':fmt(a.v))+'</b> / '+quota(x)+'</span>'
        +'<span class="in-meter in-meter-mic"><i style="width:'+(p*100).toFixed(1)+'%"></i></span><span class="in-mrow-s'+(st.ok?' ok':'')+'">'+st.txt+(a.v!=null&&a.n<a.total?' · '+a.n+' j renseignés':'')+'</span></button>';
    }).join('')+'</div>';
  }
  function render(){
    var body=$('inBody'); if(!body) return;
    var w=last7(), V=avgVals(w.start,w.end);
    var old=body.querySelector('.as-scroll'), top=old?old.scrollTop:0;
    var h='<div class="as-hdr st-header"><div class="as-hdr-left"><button class="as-exit st-exit" onclick="INTAKE.close()" title="Fermer" aria-label="Fermer">✕</button></div>'
      +'<div class="as-hdr-mid"><div class="as-hdr-title">🍽 Nutrition</div><div class="as-hdr-sub">'+(cache.syncAt?'Yazio · synchro '+ago(cache.syncAt):'Yazio → Santé → MASSUP')+'</div></div>'
      +'<div class="as-hdr-right"><button class="as-hbtn" onclick="INTAKE.refresh()" title="Actualiser avec Raccourcis" aria-label="Actualiser">↻</button></div></div>'
      +'<div class="as-scroll st-scroll st-scroll-modern">'
      +'<div class="wn-card st-sec in-sum"><div class="wn-title">Moyenne par jour · 7 derniers jours</div><div class="in-period">'+dm(w.start)+' → '+dm(w.end)+' · <b>'+V._n+'/7</b> jours notés · aujourd’hui exclu (en cours)</div>'+kcalHtml(V.kcal,'')+ringsHtml(V)+'</div>'
      +'<div class="wn-card st-history in-history">'+chartHtml()+'</div>'
      +microsHtml();
    if(_status==='err') h+='<p class="st-sync-error">La synchronisation a échoué. Vérifie la connexion puis actualise.</p>';
    h+='<p class="st-sub in-foot">Source : Yazio → app Santé → raccourci « MASSUP Santé ». Un jour sans rien dans Yazio est « non noté » : il ne compte pas dans les moyennes.</p></div>';
    body.innerHTML=h;
    var sc=body.querySelector('.as-scroll'); if(sc) sc.scrollTop=top;
    bindSwipe();
  }
  function updateHistory(){
    var el=document.querySelector('.in-history'); if(!el) return render();
    el.innerHTML=chartHtml(); bindSwipe();
  }
  function bindSwipe(){
    var wrap=document.querySelector('.in-history .st-chart-wrap'); if(!wrap) return;
    wrap.addEventListener('pointerdown',function(e){ IN.touchX=e.clientX; IN.touchY=e.clientY; });
    wrap.addEventListener('pointerup',function(e){
      if(IN.touchX==null) return;
      var dx=e.clientX-IN.touchX, dy=e.clientY-IN.touchY; IN.touchX=null; IN.touchY=null;
      if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.3) page(dx<0?1:-1);
    });
    wrap.addEventListener('pointercancel',function(){ IN.touchX=null; IN.touchY=null; });
  }
  function page(dir){
    if(dir>0&&periodData().end>=today()) return;
    if(IN.mode==='week') IN.anchor=addD(monOf(IN.anchor),dir*7);
    else if(IN.mode==='month') IN.anchor=monthStart(IN.anchor,dir);
    else IN.anchor=monthStart(IN.anchor,dir*12);
    IN.selected=null; updateHistory();
  }
  function setMode(m){
    if(['week','month','year'].indexOf(m)<0) return;
    var cur=periodData().pts[IN.selected]; if(cur&&IN.mode!=='year') IN.pickDate=cur.start;
    IN.mode=m; IN.selected=null; updateHistory();
  }
  function setMetric(k,scroll){
    if(!BY[k]) return;
    var cur=periodData().pts[IN.selected]; if(cur&&IN.mode!=='year') IN.pickDate=cur.start;
    IN.metric=k; IN.selected=null; updateHistory();
    if(scroll){ var el=document.querySelector('.in-history'); if(el&&el.scrollIntoView) el.scrollIntoView({block:'start',behavior:'smooth'}); }
  }
  function select(i){
    var p=periodData().pts[i]; if(!p||p.fut) return;
    if(IN.mode==='year'){ IN.anchor=p.start; IN.mode='month'; IN.selected=null; }
    else IN.selected=i;
    updateHistory();
  }

  /* ── Modal du calendrier : la nutrition d'un jour, même sans séance ── */
  function dayCardHtml(d){
    var e=day(d); if(!e) return '';
    var n=BY.kcal, st=status(n,e.kcal);
    var mic=NUT.filter(function(x){ return x.col==='mic'&&e[x.k]>0; }).map(function(x){ return x.lbl+' '+fmt(e[x.k])+' '+x.u; }).join(' · ');
    return '<div class="in-dcard"><div class="in-dcard-h"><span>🍽 Nutrition</span><b>'+fmt(e.kcal)+' kcal</b><em class="'+(st.ok?'ok':'')+'">'+st.txt+'</em></div>'
      +splitHtml(e)+(mic?'<div class="in-dcard-mic">'+mic+'</div>':'')
      +'<button type="button" class="in-dcard-more" onclick="INTAKE.open(\''+d+'\')">Voir dans Nutrition ›</button></div>';
  }

  function init(adapter){ A=adapter; load(); }
  return {init:init,renderCard:renderCard,open:open,close:close,refresh:refresh,pull:pull,day:day,val:val,avg:avg,last7:last7,NUT:NUT,
    dayCardHtml:dayCardHtml,days:function(){ return cache.days; },
    _metric:setMetric,_mode:setMode,_select:select,_page:page};
})();
