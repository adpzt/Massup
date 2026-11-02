/* ═══ 🍽 NUTRITION DU JOUR (02/11/2026) — MASSUP Adrien ═══
   Les totaux du jour viennent de Yazio → app Santé → raccourci « MASSUP Santé » (1 copie par mesure)
   → /api/health → health_days (clés nu_kcal, nu_glu, nu_prot, nu_lip, nu_fib, nu_sucre, nu_sat, nu_sodium, nu_potassium).
   Ces données NE vont PAS dans DB (le snapshot cloud resterait gonflé à chaque sauvegarde) : le serveur est la
   source, l'app en garde une copie locale (localStorage « massup_intake ») pour l'affichage hors ligne.
   Un jour est « noté » si ses calories > 0 ; un 0 sur une autre mesure = non renseigné par Yazio.
   Demandes d'Adrien (02/11) : moyenne des 7 derniers jours (jamais un « reste à manger » négatif), G · P · L
   toujours dans cet ordre avec l'objectif écrit, page détaillée sur le modèle de l'écran Pas.
   DA Graphite Énergie (02/11, Claude Design) : la section du Bilan est rendue par bilan.js ; ce fichier garde
   les données, la page Nutrition (sans cartes, préfixe bl-) et la carte de la fiche du calendrier (.bl-daycard). */
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
  function fmt(n){ return Math.round(n).toLocaleString('fr-FR'); }
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
  function status(n,v){
    if(v==null) return {txt:'non noté',ok:false};
    if(n.kind==='max') return v<=n.goal?{txt:'✓ sous le max',ok:true}:{txt:'au-dessus du max',ok:false};
    if(n.kind==='target') return v<=n.goal?{txt:'✓ dans la cible',ok:true}:v<=n.max?{txt:'✓ sous les '+n.max+' g',ok:true}:{txt:'au-dessus de '+n.max+' g',ok:false};
    return v>=n.goal?{txt:'✓ objectif',ok:true}:{txt:Math.round(v/n.goal*100)+' % de l’objectif',ok:false};
  }

  function avgVals(start,end){ var o={},n=0; NUT.forEach(function(x){ var a=avg(start,end,x.k); o[x.k]=a.v; if(x.k==='kcal'){ n=a.n; o._total=a.total; } }); o._n=n; return o; }

  /* ── Page complète — DA « Graphite Énergie » (02/11/2026, livraison Claude Design : screenNutrition) ──
     Sans cartes : 7 derniers jours (kcal + G · P · L en lignes) · Historique (puces, Semaine | Mois | An,
     détail du jour avec la répartition G · P · L, barres, 4 stats) · Le reste (micros) · lien Recettes.
     La carte du Bilan est rendue par bilan.js (section Nutrition). */
  var NB=' ';
  function nb(n){ return fmt(n).replace(/\s/g,NB); }
  function un(t){ return '<span class="bl-unit">'+t+'</span>'; }
  function cvar(n){ return n.col==='kcal'?'var(--acc2)':'var(--in-'+n.col+')'; }
  function refOf(n){ return n.kind==='target'?n.max:n.goal; }
  // [texte, classe du texte, classe de la valeur, classe de la jauge]
  function tagOf(n,v){
    if(n.kind==='max') return v>n.goal?['⚠ au-dessus du max','bl-warn','bl-warn','is-warn']:['✓ sous le max','bl-pos','',''];
    if(n.kind==='target') return v>n.max?['⚠ au-dessus de '+n.max+' '+n.u,'bl-warn','bl-warn','is-warn']:v>n.goal?['✓ sous les '+n.max+' '+n.u,'bl-pos','','']:['✓ dans la cible','bl-pos','',''];
    return v>=n.goal?['✓ objectif atteint','bl-pos','','']:[Math.round(v/n.goal*100)+NB+'% de l’objectif','bl-mut','',''];
  }
  function goalTxt(n){ return '/ '+nb(n.goal)+' '+n.u+(n.kind==='max'?' max':n.kind==='target'?' visés':''); }
  function rowHtml(n,a,big,tap){
    var v=a.v;
    if(v==null) return '<div class="bl-mrow"><div class="bl-mrow__h"><span class="bl-mrow__n">'+(big?'<i class="bl-dot" style="background:'+cvar(n)+'"></i>':'')+n.lbl+'</span><span class="bl-num bl-mrow__v bl-mut"'+(big?'':' style="font-size:22px"')+'>—</span></div><div class="bl-trk'+(big?' bl-trk--lg':'')+'"></div><div class="bl-mrow__t">non renseigné par Yazio</div></div>';
    var t=tagOf(n,v), part=a.n<a.total?' · '+a.n+' j renseignés':'';
    var inner='<div class="bl-mrow__h"><span class="bl-mrow__n">'+(big?'<i class="bl-dot" style="background:'+cvar(n)+'"></i>':'')+n.lbl+'</span><span class="bl-num bl-mrow__v '+t[2]+'"'+(big?'':' style="font-size:22px"')+'>'+nb(v)+un(goalTxt(n))+'</span></div>'
      +'<div class="bl-trk'+(big?' bl-trk--lg':'')+'"><i class="'+t[3]+'" style="width:'+Math.min(100,v/refOf(n)*100).toFixed(0)+'%;'+(t[3]?'':'background:'+cvar(n))+'"></i></div><div class="bl-mrow__t '+t[1]+'">'+t[0]+(big?'':part)+'</div>';
    return tap?'<button type="button" class="bl-mrow bl-mrow--btn" onclick="INTAKE._metric(\''+n.k+'\',true)">'+inner+'</button>':'<div class="bl-mrow">'+inner+'</div>';
  }
  function repHtml(vals){
    var e={glu:(vals.glu||0)*4,prot:(vals.prot||0)*4,lip:(vals.lip||0)*9}, tot=e.glu+e.prot+e.lip;
    if(!tot) return '';
    var p={glu:Math.round(e.glu/tot*100),prot:Math.round(e.prot/tot*100)}; p.lip=100-p.glu-p.prot;
    var cls={glu:'g',prot:'p',lip:'l'}, rep={glu:'glu',prot:'prot',lip:'lip'};
    return '<div class="bl-rep" role="img" aria-label="Répartition des calories : '+MACROS.map(function(k){ return BY[k].lbl.toLowerCase()+' '+p[k]+' %'; }).join(', ')+'">'
      +MACROS.map(function(k){ return p[k]>0?'<span class="bl-rep__'+cls[k]+'" style="flex:'+p[k]+'">'+(p[k]>=9?p[k]+NB+'%':'')+'</span>':''; }).join('')+'</div>'
      +'<div class="bl-repl">'+MACROS.map(function(k){ return '<span><i class="bl-dot" style="background:var(--bl-rep-'+rep[k]+');margin-right:6px"></i>'+BY[k].lbl+' <b>'+(vals[k]!=null?nb(vals[k])+' g':'—')+'</b></span>'; }).join('')+'</div>';
  }
  function cardHtml(){ return ''; }
  function renderCard(){ pull(false); }

  var IN={metric:'kcal',mode:'week',anchor:today(),selected:null,touchX:null,touchY:null};
  function ensureOv(){
    var ov=$('inOverlay'); if(ov) return ov;
    ov=document.createElement('div'); ov.className='bl-overlay in-overlay'; ov.id='inOverlay';
    ov.innerHTML='<div class="bl-page" id="inBody"></div>';
    document.body.appendChild(ov); return ov;
  }
  // Sans date : la semaine d'HIER (le dernier jour complet) — un lundi, la semaine en cours n'aurait qu'un jour
  function open(date){
    var d0=date||last7().end;
    IN.mode='week'; IN.anchor=d0; IN.selected=null; IN.pickDate=d0;
    try{ if(typeof closeDayModal==='function') closeDayModal(); }catch(e){}
    var ov=ensureOv(), fresh=!ov.classList.contains('open');
    ov.classList.add('open'); document.body.style.overflow='hidden'; render(fresh); if(fresh) ov.scrollTop=0; pull(true);
  }
  function close(){ var ov=$('inOverlay'); if(ov) ov.classList.remove('open'); document.body.style.overflow=''; try{ A.onChange(); }catch(e){} }
  function isOpen(){ var ov=$('inOverlay'); return !!(ov&&ov.classList.contains('open')); }
  function rerender(){ if(isOpen()) render(); }
  function periodData(){
    var t=today(), n=BY[IN.metric], pts=[], start, end;
    if(IN.mode==='week'||IN.mode==='month'){
      start=IN.mode==='week'?monOf(IN.anchor):monthStart(IN.anchor,0); end=IN.mode==='week'?addD(start,6):monthEnd(start);
      for(var d=start;d<=end;d=addD(d,1)){
        var num=Number(d.slice(8,10)), last=Number(end.slice(8,10));
        pts.push({start:d,end:d,v:val(d,n.k),fut:d>t,l:IN.mode==='week'?'LMMJVSD'.charAt((new Date(d+'T12:00:00').getDay()+6)%7):(num===1||num%7===1&&num<29?String(num):''),detail:new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})});
      }
    } else {
      var y=Number(IN.anchor.slice(0,4)); start=y+'-01-01'; end=y+'-12-31';
      for(var m=0;m<12;m++){
        var ms=y+'-'+String(m+1).padStart(2,'0')+'-01', me=monthEnd(ms), a=avg(ms,me,n.k);
        pts.push({start:ms,end:me,v:a.v,n:a.n,fut:ms>t,l:'JFMAMJJASOND'.charAt(m),detail:new Date(ms+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'})});
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
  function historyHtml(){
    var n=BY[IN.metric], D=periodData(), pts=D.pts, wk=IN.mode==='week';
    var title=wk?dshort(D.start)+' → '+dshort(D.end):IN.mode==='month'?new Date(D.start+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'}).replace(/^./,function(c){ return c.toUpperCase(); }):D.start.slice(0,4);
    var chips='<div class="bl-chips" role="tablist" aria-label="Mesure affichée">'+NUT.map(function(x){ return '<button type="button" class="bl-chip" role="tab" aria-selected="'+(IN.metric===x.k)+'" onclick="INTAKE._metric(\''+x.k+'\')"><i class="bl-dot" style="background:'+cvar(x)+'"></i>'+x.lbl+'</button>'; }).join('')+'</div>';
    var seg='<div class="bl-seg" role="tablist" style="margin-top:14px">'+[['week','Semaine'],['month','Mois'],['year','An']].map(function(x){ return '<button type="button" role="tab" aria-selected="'+(IN.mode===x[0])+'" onclick="INTAKE._mode(\''+x[0]+'\')">'+x[1]+'</button>'; }).join('')+'</div>';
    var nav='<div class="bl-nav"><button type="button" class="bl-ib" onclick="INTAKE._page(-1)" aria-label="Période précédente">‹</button><span>'+title+'</span><button type="button" class="bl-ib" onclick="INTAKE._page(1)" aria-label="Période suivante"'+(D.end>=today()?' disabled':'')+'>›</button></div>';
    // Détail : le jour choisi (Semaine) ou la moyenne de la période (Mois, An), puis la répartition G · P · L
    var dv, dl, rep='';
    if(wk){
      var sel=pts[IN.selected]||pts[0], e=day(sel.start); dv=sel.v; dl=sel.detail;
      if(e) rep=(n.k!=='kcal'?'<div class="bl-meta" style="margin-top:10px">'+nb(e.kcal)+' kcal ce jour-là</div>':'')+repHtml(e);
    } else {
      var a=avg(D.start,D.end<today()?D.end:today(),n.k), V=avgVals(D.start,D.end<today()?D.end:today()); dv=a.v; dl=title+' · moyenne par jour noté';
      if(V._n) rep=repHtml(V);
    }
    var tg=dv!=null?tagOf(n,dv):null;
    var detail='<div class="bl-detail" aria-live="polite"><div class="bl-lbl">'+dl+'</div><div class="bl-detail__row"><span class="bl-num bl-detail__v '+(tg?tg[2]:'bl-mut')+'">'+(dv==null?'—':nb(dv)+un(n.u))+'</span><span style="font-size:13px;font-weight:800" class="'+(tg?tg[1]:'bl-mut')+'">'+(tg?tg[0].replace(' de l’objectif',''):(wk&&day(pts[IN.selected].start)?'non renseigné':'non noté'))+'</span></div>'+rep+'</div>';
    var vals=pts.filter(function(p){ return !p.fut&&p.v!=null; });
    var topv=Math.max(refOf(n)*1.15,Math.max.apply(null,[0].concat(vals.map(function(p){ return p.v; }))));
    var gp=(refOf(n)/topv*100).toFixed(1);
    var bars='<div class="bl-bars"><i class="bl-bars__goal" style="bottom:'+gp+'%"></i><span class="bl-bars__gl" style="bottom:'+gp+'%">'+(n.kind==='max'?'max ':n.kind==='target'?'max ':'objectif ')+nb(refOf(n))+'</span>'
      +pts.map(function(p,i){
        var na=!p.fut&&p.v==null, over=p.v!=null&&(n.kind==='max'?p.v>n.goal:n.kind==='target'?p.v>n.max:false);
        var bar='<i style="height:'+(p.fut?0:p.v==null?30:Math.max(2,p.v/topv*100)).toFixed(1)+'%;background:'+(over?'var(--yellow)':cvar(n))+'"></i>';
        var cls='bl-bars__b'+(na?' is-na':'');
        return wk?'<button type="button" class="'+cls+'" aria-pressed="'+(i===IN.selected)+'" onclick="INTAKE._select('+i+')" aria-label="'+p.detail+(p.v==null?' · non noté':' · '+fmt(p.v)+' '+n.u)+'"'+(p.fut?' disabled':'')+'>'+bar+'</button>':'<span class="'+cls+'" aria-hidden="true">'+bar+'</span>';
      }).join('')+'</div>'
      +'<div class="bl-bars__x">'+pts.map(function(p,i){ return '<span class="'+(wk&&i===IN.selected?'is-on':'')+'">'+p.l+'</span>'; }).join('')+'</div>';
    var stats;
    if(vals.length){
      var mean=vals.reduce(function(s,p){ return s+p.v; },0)/vals.length;
      var hit=vals.filter(function(p){ return status(n,p.v).ok; }).length, tp=vals.slice().sort(function(a,b){ return b.v-a.v; })[0];
      var elapsed=pts.filter(function(p){ return !p.fut; }).length, na=elapsed-vals.length, yr=IN.mode==='year';
      var st=function(l,v,s){ return '<div><div class="bl-lbl">'+l+'</div><div class="bl-num bl-stats__v">'+v+'</div><div class="bl-stats__s">'+s+'</div></div>'; };
      stats='<div class="bl-stats bl-stats--2">'
        +st('Moyenne',nb(mean)+un(n.u),yr?'par mois noté':'par jour noté')
        +st(yr?'Mois notés':'Jours notés',vals.length+'/'+elapsed,na?na+' non noté'+(na>1?'s':''):'tous notés')
        +st(n.kind==='max'?'Sous le max':n.kind==='target'?'Sous les '+n.max+' g':'À l’objectif',hit+'/'+vals.length,(n.kind==='min'?'≥ ':'≤ ')+nb(refOf(n))+' '+n.u)
        +st(yr?'Mois le plus haut':'Le plus haut',nb(tp.v)+un(n.u),yr?tp.detail:tp.detail)+'</div>';
    } else stats='<div class="bl-empty"><span>Rien de noté dans Yazio sur cette période.</span></div>';
    return '<div class="bl-sec__head" style="min-height:32px"><h2 class="bl-sec__t">Historique</h2></div>'+chips+seg+nav+detail+'<div class="in-swipe">'+bars+'</div>'+stats;
  }
  function dshort(s){ return new Date(s+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'}); }
  function topBar(){
    return '<div class="bl-top"><button type="button" class="bl-ib bl-ib--fill" onclick="INTAKE.close()" aria-label="Fermer">✕</button><div style="min-width:0"><h1 class="bl-top__t">🍽️ Nutrition</h1><span class="bl-top__s">'+(cache.syncAt?'Yazio · '+ago(cache.syncAt):'Yazio · aucune synchro')+'</span></div>'
      +'<button type="button" class="bl-ib bl-ib--fill" onclick="INTAKE.refresh()" aria-label="Actualiser">↻</button></div>';
  }
  function render(fresh){
    var body=$('inBody'); if(!body) return;
    var w=last7(), kc=avg(w.start,w.end,'kcal'), h=topBar();
    if(!Object.keys(cache.days).length){
      h+='<section class="bl-sec"><div class="bl-empty"><span class="bl-empty__t">Rien reçu de Yazio</span><button type="button" class="bl-btn bl-btn--primary" onclick="INTAKE.refresh()">↻ Faire venir mes totaux</button></div></section>';
    } else {
      var n=BY.kcal;
      h+='<section class="bl-sec" style="padding-top:26px"><div class="bl-sec__head" style="min-height:32px"><h2 class="bl-sec__t">7 derniers jours</h2><span class="bl-meta">'+kc.n+'/7 notés</span></div>'
        +(kc.v==null?'<div class="bl-empty"><span class="bl-empty__t">Aucun jour noté</span></div>'
          :'<div class="bl-num" style="font-size:60px;margin-top:18px"><span class="bl-hero-txt">'+nb(kc.v)+'</span>'+un('/ '+nb(n.goal)+' kcal')+'</div>'
          +'<div class="bl-trk bl-trk--xl" style="margin-top:14px"><i class="is-kcal" style="width:'+Math.min(100,kc.v/n.goal*100).toFixed(0)+'%"></i></div>'
          +'<div class="bl-meta" style="margin-top:8px">'+Math.round(kc.v/n.goal*100)+NB+'% · moyenne par jour noté</div>'
          +'<div style="margin-top:14px">'+MACROS.map(function(k){ return rowHtml(BY[k],avg(w.start,w.end,k),true,false); }).join('')+'</div>')
        +'</section><hr class="bl-hr">'
        +'<section class="bl-sec in-history">'+historyHtml()+'</section><hr class="bl-hr">'
        +'<section class="bl-sec"><div class="bl-sec__head" style="min-height:32px"><h2 class="bl-sec__t">Le reste</h2><span class="bl-meta">moy. 7 jours</span></div><div style="margin-top:10px">'
        +NUT.filter(function(x){ return x.col==='mic'; }).map(function(x){ return rowHtml(x,avg(w.start,w.end,x.k),false,true); }).join('')+'</div></section>';
      if(_status==='err') h+='<div class="bl-sec" style="padding-top:0"><div class="bl-errbar">La synchro a échoué · <button type="button" onclick="INTAKE.refresh()">↻ Réessayer</button></div></div>';
      h+='<hr class="bl-hr"><button type="button" class="bl-link" onclick="INTAKE.close();nutriAOpen()"><span aria-hidden="true" style="font-size:22px">🍳</span><span>Idées de recettes</span><span class="bl-mut" aria-hidden="true">›</span></button>';
    }
    body.className='bl-page'+(fresh?' bl-screen-in':'');
    body.innerHTML=h;
    bindSwipe();
  }
  function updateHistory(){
    var el=document.querySelector('#inBody .in-history'); if(!el) return render();
    el.innerHTML=historyHtml(); bindSwipe();
  }
  function bindSwipe(){
    var wrap=document.querySelector('#inBody .in-swipe'); if(!wrap) return;
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
    if(scroll){ var el=document.querySelector('#inBody .in-history'); if(el&&el.scrollIntoView) el.scrollIntoView({block:'start',behavior:'smooth'}); }
  }
  function select(i){
    var p=periodData().pts[i]; if(!p||p.fut) return;
    IN.selected=i; updateHistory();
  }

  /* ── Fiche d'un jour du calendrier (page 3) : la seule carte nutrition (.bl-daycard), même sans séance ── */
  function dayCardHtml(d){
    var e=day(d); if(!e) return '';
    var n=BY.kcal, pct=Math.round(e.kcal/n.goal*100);
    var mic=NUT.filter(function(x){ return x.col==='mic'&&e[x.k]>0; }).map(function(x){
      var over=x.kind==='max'&&e[x.k]>x.goal;
      return '<span class="'+(over?'bl-warn':'bl-mut')+'">'+(x.k==='sat'?'Gr. saturées':x.lbl)+' <b'+(over?'':' style="color:var(--txt)"')+'>'+nb(e[x.k])+' '+x.u+'</b>'+(over?' ⚠':'')+'</span>';
    }).join('');
    return '<div class="bl-daycard"><div class="bl-daycard__h"><span style="font-weight:800;font-size:15px">🍽️ Nutrition</span><span class="'+(pct>=100?'bl-pos':'bl-mut')+'" style="font-size:13px;font-weight:800">'+pct+NB+'%</span></div>'
      +'<div class="bl-num" style="font-size:36px;margin-top:10px">'+nb(e.kcal)+un('/ '+nb(n.goal)+' kcal')+'</div>'+repHtml(e)
      +(mic?'<div class="bl-daymic">'+mic+'</div>':'')
      +'<button type="button" class="bl-sec__link bl-daycard__more" onclick="INTAKE.open(\''+d+'\')">Voir dans Nutrition ›</button></div>';
  }

  function init(adapter){ A=adapter; load(); }
  return {init:init,renderCard:renderCard,open:open,close:close,refresh:refresh,pull:pull,day:day,val:val,avg:avg,last7:last7,NUT:NUT,
    dayCardHtml:dayCardHtml,days:function(){ return cache.days; },
    _metric:setMetric,_mode:setMode,_select:select,_page:page};
})();
