/* ═══ 🍽 NUTRITION DU JOUR (02/11/2026) — MASSUP Adrien ═══
   Les totaux du jour viennent de Yazio → app Santé → raccourci « MASSUP Santé » (1 copie par mesure)
   → /api/health → health_days (clés nu_kcal, nu_glu, nu_prot, nu_lip, nu_fib, nu_sucre, nu_sat, nu_sodium, nu_potassium).
   Ces données NE vont PAS dans DB (le snapshot cloud resterait gonflé à chaque sauvegarde) : le serveur est la
   source, l'app en garde une copie locale (localStorage « massup_intake ») pour l'affichage hors ligne.
   Un jour est « noté » si ses calories > 0 ; un 0 sur une autre mesure = non renseigné par Yazio.
   Demandes d'Adrien (02/11) : moyenne sur 15 jours (02/11 soir, avant 7 ; jamais un « reste à manger » négatif), G · P · L
   toujours dans cet ordre avec l'objectif écrit, page détaillée sur le modèle de l'écran Pas.
   DA Graphite Énergie (02/11, Claude Design) : la section du Bilan est rendue par bilan.js ; ce fichier garde
   les données, la page Nutrition (sans cartes, préfixe bl-) et la carte de la fiche du calendrier (.bl-daycard). */
var INTAKE=(function(){
  var A=null, $=function(id){ return document.getElementById(id); };
  var LS='massup_intake';
  // Objectifs : 2 900 kcal (24/08, confirmé 02/11) · 360 G · 150 P · lipides 75 visés (dès 60 c'est très bien), 85 = le gros
  // max acceptable un jour de fast-food — c'est la MOYENNE qui compte, pas un jour (Adrien, 02/11 soir)
  var NUT=[
    {k:'kcal',lbl:'Calories',short:'kcal',u:'kcal',goal:2900,kind:'min',col:'kcal'},
    {k:'glu',lbl:'Glucides',short:'G',u:'g',goal:360,kind:'min',col:'glu'},
    {k:'prot',lbl:'Protéines',short:'P',u:'g',goal:150,kind:'min',col:'prot'},
    {k:'lip',lbl:'Lipides',short:'L',u:'g',goal:75,max:85,kind:'target',col:'lip'},
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
  // 15 derniers jours complets (02/11 soir, Adrien : « pour vraiment me rendre compte »)
  function last15(){ var end=addD(today(),-1); return {start:addD(end,-14),end:end}; }
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
  // Étiquettes COURTES (02/11 soir, Adrien : « pas de phrases trop longues ») — [texte, classe texte, classe valeur, classe jauge]
  function tagOf(n,v){
    if(n.kind==='max') return v>n.goal?['\u26a0 au-dessus','bl-warn','bl-warn','is-warn']:['\u2713 sous le max','bl-pos','',''];
    if(n.kind==='target') return v>n.max?['\u26a0 au-dessus','bl-warn','bl-warn','is-warn']:v>n.goal?['\u2713 acceptable','bl-pos','','']:['\u2713 dans la cible','bl-pos','',''];
    return v>=n.goal?['\u2713 objectif','bl-pos','','']:[Math.round(v/n.goal*100)+NB+'%','bl-mut','',''];
  }
  function goalTxt(n){ return '/ '+nb(n.goal)+' '+n.u+(n.kind==='max'?' max':n.kind==='target'?' visés':''); }
  function rowHtml(n,a,big,tap){
    var v=a.v;
    if(v==null) return '<div class="bl-mrow"><div class="bl-mrow__h"><span class="bl-mrow__n">'+(big?'<i class="bl-dot" style="background:'+cvar(n)+'"></i>':'')+n.lbl+'</span><span class="bl-num bl-mrow__v bl-mut"'+(big?'':' style="font-size:20px"')+'>—</span></div><div class="bl-trk'+(big?' bl-trk--lg':'')+'"></div><div class="bl-mrow__t">non renseigné par Yazio</div></div>';
    var t=tagOf(n,v), part=a.n<a.total?' · '+a.n+' j renseignés':'';
    var inner='<div class="bl-mrow__h"><span class="bl-mrow__n">'+(big?'<i class="bl-dot" style="background:'+cvar(n)+'"></i>':'')+n.lbl+'</span><span class="bl-num bl-mrow__v '+t[2]+'"'+(big?'':' style="font-size:20px"')+'>'+nb(v)+un(goalTxt(n))+'</span></div>'
      +'<div class="bl-trk'+(big?' bl-trk--lg':'')+'"><i class="'+t[3]+'" style="width:'+Math.min(100,v/refOf(n)*100).toFixed(0)+'%;'+(t[3]?'':'background:'+cvar(n))+'"></i></div><div class="bl-mrow__t '+t[1]+'">'+t[0]+(big?'':part)+'</div>';
    return tap?'<button type="button" class="bl-mrow bl-mrow--btn" onclick="INTAKE._metric(\''+n.k+'\',true)">'+inner+'</button>':'<div class="bl-mrow">'+inner+'</div>';
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
  // v2 (02/11 soir, retours d'Adrien) : la page s'ouvre sur l'Historique (mesure choisie dans une petite liste),
  // le chiffre du haut = MOYENNE de la période (jours notés), un jour touché montre ses kcal + G · P · L en jauges ;
  // en dessous, les moyennes des 15 derniers jours. Sans date : la semaine d'hier, aucun jour choisi.
  function open(date){
    IN.mode='week'; IN.anchor=date||last7().end; IN.selected=null; IN.pickDate=date||null;
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
        var num=Number(d.slice(8,10));
        pts.push({start:d,end:d,v:val(d,n.k),fut:d>t,l:IN.mode==='week'?'LMMJVSD'.charAt((new Date(d+'T12:00:00').getDay()+6)%7):(num===1||num%7===1&&num<29?String(num):''),detail:new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})});
      }
    } else {
      var y=Number(IN.anchor.slice(0,4)); start=y+'-01-01'; end=y+'-12-31';
      for(var m=0;m<12;m++){
        var ms=y+'-'+String(m+1).padStart(2,'0')+'-01', me=monthEnd(ms), a=avg(ms,me,n.k);
        pts.push({start:ms,end:me,v:a.v,n:a.n,fut:ms>t,l:'JFMAMJJASOND'.charAt(m),detail:new Date(ms+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'})});
      }
    }
    if(IN.mode!=='week') IN.selected=null;
    else if(IN.pickDate){ pts.forEach(function(p,i){ if(p.start===IN.pickDate) IN.selected=i; }); IN.pickDate=null; }
    return {pts:pts,start:start,end:end};
  }
  // Le jour touché : ses kcal, puis G · P · L en jauges (valeur / objectif), plus la mesure choisie si c'est un micro
  function dayHtml(d){
    var e=day(d), n=BY[IN.metric];
    var h='<div class="bl-detail in-day" aria-live="polite"><div class="bl-sec__head" style="min-height:36px"><div class="bl-lbl">'+new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+'</div><button type="button" class="bl-ib" style="margin-right:-12px" onclick="INTAKE._select(-1)" aria-label="Fermer le détail du jour">✕</button></div>';
    if(!e) return h+'<div class="bl-empty" style="padding-top:4px"><span>Rien de noté dans Yazio ce jour-là.</span></div></div>';
    h+=rowHtml(BY.kcal,{v:e.kcal,n:1,total:1},false,false);
    MACROS.forEach(function(k){ h+=rowHtml(BY[k],{v:e[k]>0?e[k]:null,n:1,total:1},false,false); });
    if(n.col==='mic') h+=rowHtml(n,{v:e[n.k]>0?e[n.k]:null,n:1,total:1},false,false);
    return h+'</div>';
  }
  function historyHtml(){
    var n=BY[IN.metric], D=periodData(), pts=D.pts, wk=IN.mode==='week';
    var title=wk?dshort(D.start)+' → '+dshort(D.end):IN.mode==='month'?new Date(D.start+'T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'}).replace(/^./,function(c){ return c.toUpperCase(); }):D.start.slice(0,4);
    var pick='<label class="bl-pick"><i class="bl-dot" style="background:'+cvar(n)+'"></i><span>'+n.lbl+'</span><span aria-hidden="true">▾</span>'
      +'<select aria-label="Mesure affichée" onchange="INTAKE._metric(this.value)">'+NUT.map(function(x){ return '<option value="'+x.k+'"'+(x.k===IN.metric?' selected':'')+'>'+x.lbl+'</option>'; }).join('')+'</select></label>';
    var seg='<div class="bl-seg bl-seg--sm" role="tablist" style="margin-top:12px">'+[['week','Semaine'],['month','Mois'],['year','An']].map(function(x){ return '<button type="button" role="tab" aria-selected="'+(IN.mode===x[0])+'" onclick="INTAKE._mode(\''+x[0]+'\')">'+x[1]+'</button>'; }).join('')+'</div>';
    var nav='<div class="bl-nav"><button type="button" class="bl-ib" onclick="INTAKE._page(-1)" aria-label="Période précédente">‹</button><span>'+title+'</span><button type="button" class="bl-ib" onclick="INTAKE._page(1)" aria-label="Période suivante"'+(D.end>=today()?' disabled':'')+'>›</button></div>';
    // En haut : la MOYENNE de la période (jours notés seulement) ; un jour non noté = un trou dans les barres
    var a=avg(D.start,D.end<today()?D.end:today(),n.k), tg=a.v!=null?tagOf(n,a.v):null;
    var head='<div class="bl-detail" style="padding-bottom:0"><div class="bl-lbl">Moyenne '+(wk?'de la semaine':IN.mode==='month'?'du mois':'de l’année')+'</div>'
      +'<div class="bl-detail__row"><span class="bl-num bl-detail__v '+(tg?tg[2]:'bl-mut')+'">'+(a.v==null?'—':nb(a.v)+un(goalTxt(n)))+'</span>'+(tg?'<span class="'+tg[1]+'" style="font-size:11px;font-weight:800;white-space:nowrap">'+tg[0]+'</span>':'')+'</div></div>';
    var vals=pts.filter(function(p){ return !p.fut&&p.v!=null; });
    var topv=Math.max(refOf(n)*1.15,Math.max.apply(null,[0].concat(vals.map(function(p){ return p.v; }))));
    var gp=(refOf(n)/topv*100).toFixed(1);
    var bars='<div class="bl-bars"><i class="bl-bars__goal" style="bottom:'+gp+'%"></i><span class="bl-bars__gl" style="bottom:'+gp+'%">'+(n.kind==='min'?'objectif ':'max ')+nb(refOf(n))+'</span>'
      +pts.map(function(p,i){
        var na=!p.fut&&p.v==null, over=p.v!=null&&(n.kind==='max'?p.v>n.goal:n.kind==='target'?p.v>n.max:false);
        var bar='<i style="height:'+(p.fut||p.v==null?0:Math.max(2,p.v/topv*100)).toFixed(1)+'%;background:'+(over?'var(--yellow)':cvar(n))+'"></i>';
        var cls='bl-bars__b'+(na?' is-gap':'');
        return wk?'<button type="button" class="'+cls+'" aria-pressed="'+(i===IN.selected)+'" onclick="INTAKE._select('+i+')" aria-label="'+p.detail+(p.v==null?' · non noté':' · '+fmt(p.v)+' '+n.u)+'"'+(p.fut?' disabled':'')+'>'+bar+'</button>':'<span class="'+cls+'" aria-hidden="true">'+bar+'</span>';
      }).join('')+'</div>'
      +'<div class="bl-bars__x">'+pts.map(function(p,i){ return '<span class="'+(wk&&i===IN.selected?'is-on':'')+'">'+p.l+'</span>'; }).join('')+'</div>';
    var sel=wk&&IN.selected!=null&&pts[IN.selected]?dayHtml(pts[IN.selected].start):'';
    return '<div class="bl-sec__head"><h2 class="bl-sec__t">Historique</h2>'+pick+'</div>'+seg+nav+head+'<div class="in-swipe">'+bars+'</div>'+sel;
  }
  function dshort(s){ return new Date(s+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'}); }
  function topBar(){
    return '<div class="bl-top"><button type="button" class="bl-ib bl-ib--fill" onclick="INTAKE.close()" aria-label="Fermer">✕</button><div style="min-width:0"><h1 class="bl-top__t">🍽️ Nutrition</h1></div><span></span></div>';
  }
  function render(fresh){
    var body=$('inBody'); if(!body) return;
    var w=last15(), kc=avg(w.start,w.end,'kcal'), h=topBar();
    if(!Object.keys(cache.days).length){
      h+='<section class="bl-sec"><div class="bl-empty"><span class="bl-empty__t">Rien reçu de Yazio</span><span>Touche ↻ en haut du Bilan.</span></div></section>';
    } else {
      h+='<section class="bl-sec in-history">'+historyHtml()+'</section><hr class="bl-hr">'
        +'<section class="bl-sec"><div class="bl-sec__head" style="min-height:32px"><h2 class="bl-sec__t">15 derniers jours</h2><span class="bl-meta">'+kc.n+'/15 notés</span></div>'
        +'<div style="margin-top:6px">'+rowHtml(BY.kcal,kc,true,false)+MACROS.map(function(k){ return rowHtml(BY[k],avg(w.start,w.end,k),true,false); }).join('')+'</div></section><hr class="bl-hr">'
        +'<section class="bl-sec"><div class="bl-sec__head" style="min-height:32px"><h2 class="bl-sec__t">Le reste</h2><span class="bl-meta">moy. 15 jours</span></div><div style="margin-top:6px">'
        +NUT.filter(function(x){ return x.col==='mic'; }).map(function(x){ return rowHtml(x,avg(w.start,w.end,x.k),false,true); }).join('')+'</div></section>';
      if(_status==='err') h+='<div class="bl-sec" style="padding-top:0"><div class="bl-errbar">La synchro Yazio a échoué · réessaie avec ↻ sur le Bilan</div></div>';
      h+='<hr class="bl-hr"><button type="button" class="bl-link" onclick="INTAKE.close();nutriAOpen()"><span aria-hidden="true" style="font-size:18px">🍳</span><span>Idées de recettes</span><span class="bl-mut" aria-hidden="true">›</span></button>';
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
    IN.mode=m; IN.selected=null; updateHistory();
  }
  function setMetric(k,scroll){
    if(!BY[k]) return;
    IN.metric=k; updateHistory();
    if(scroll){ var el=document.querySelector('#inBody .in-history'); if(el&&el.scrollIntoView) el.scrollIntoView({block:'start',behavior:'smooth'}); }
  }
  // Toucher un jour = son détail ; le retoucher (ou ✕) le referme
  function select(i){
    if(i<0){ IN.selected=null; return updateHistory(); }
    var p=periodData().pts[i]; if(!p||p.fut) return;
    IN.selected=IN.selected===i?null:i; updateHistory();
  }

  /* ── Fiche d'un jour du calendrier (page 3) : la seule carte nutrition (.bl-daycard), même sans séance ── */
  function dayCardHtml(d){
    var e=day(d); if(!e) return '';
    var n=BY.kcal, pct=Math.round(e.kcal/n.goal*100);
    var mic=NUT.filter(function(x){ return x.col==='mic'&&e[x.k]>0; }).map(function(x){
      var over=x.kind==='max'&&e[x.k]>x.goal;
      return '<span class="'+(over?'bl-warn':'bl-mut')+'">'+(x.k==='sat'?'Gr. saturées':x.lbl)+' <b'+(over?'':' style="color:var(--txt)"')+'>'+nb(e[x.k])+' '+x.u+'</b>'+(over?' ⚠':'')+'</span>';
    }).join('');
    return '<div class="bl-daycard"><div class="bl-daycard__h"><span style="font-weight:800;font-size:14px">🍽️ Nutrition</span><span class="'+(pct>=100?'bl-pos':'bl-mut')+'" style="font-size:12px;font-weight:800">'+pct+NB+'%</span></div>'
      +'<div class="bl-num" style="font-size:29px;margin-top:10px">'+nb(e.kcal)+un('/ '+nb(n.goal)+' kcal')+'</div>'
      +'<div style="margin-top:6px">'+MACROS.map(function(k){ return rowHtml(BY[k],{v:e[k]>0?e[k]:null,n:1,total:1},false,false); }).join('')+'</div>'
      +(mic?'<div class="bl-daymic">'+mic+'</div>':'')
      +'<button type="button" class="bl-sec__link bl-daycard__more" onclick="INTAKE.open(\''+d+'\')">Voir dans Nutrition ›</button></div>';
  }

  function init(adapter){ A=adapter; load(); }
  return {init:init,renderCard:renderCard,open:open,close:close,refresh:refresh,pull:pull,day:day,val:val,avg:avg,last7:last7,last15:last15,NUT:NUT,
    dayCardHtml:dayCardHtml,days:function(){ return cache.days; },
    _metric:setMetric,_mode:setMode,_select:select,_page:page};
})();
