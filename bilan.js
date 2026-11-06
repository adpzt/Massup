"use strict";
/* ═══ 🫀 PAGE BILAN — DA « Graphite Énergie » (livraison Claude Design, intégrée le 02/11/2026) ═══
   Référence : design_delivery/MASSUP_livraison/livraison_bilan/ (bilan.html = HTML attendu, HANDOFF.md = règles).
   Une page SANS cartes : en-tête (global, index.html) · alertes · situation (prénom, saison, poids, kcal 7 j) ·
   objectifs de la semaine · nutrition (7 j | aujourd'hui) · pas | sommeil · poids & corps · notes · Melati (repliée).
   Écrans plein écran ouverts d'ici : espace Poids (nouveau), Nutrition (intake.js), Pas (steps.js), Sommeil (sleep.js).
   Feuilles du bas : pesée, mensurations, nuit. Données : celles de l'app (DB, STEPS, SLEEP, INTAKE, PV) — rien de nouveau
   n'est stocké ici, sauf l'état d'affichage (onglet, point lu, repli) qui ne quitte pas la mémoire. */
var BILAN=(function(){
  var NB=' ';
  var $=function(id){ return document.getElementById(id); };
  // Saisons (décisions Adrien 12/10, 19/10, 02/11) : prise de masse jusqu'au 3 janvier, objectif 76 kg (pas encore atteint) ;
  // sèche du 4 janvier au 1er juin : ~68 kg et surtout ~12 % de masse grasse (le % prime sur le kilo)
  var SAISONS=[
    {id:'masse',lbl:'Prise de masse',start:'2026-03-01',end:'2027-01-03',cible:76},
    {id:'seche',lbl:'Sèche',start:'2027-01-04',end:'2027-06-01',cible:68,gras:12}
  ];
  // ── Nouveautés (03/11, demande d'Adrien : « les jours où il y a des nouveautés, un pop-up à l'arrivée dans l'app ») ──
  // À CHAQUE mise en ligne d'une nouveauté visible : ajouter une entrée EN TÊTE (id = date AAAA-MM-JJ), 3 à 6 lignes courtes.
  // Elle s'affiche une fois par appareil (localStorage massup_news = id déjà vu), sur le Bilan, avant la saisie de la nuit.
  var NEWS=[
    {id:'2026-11-06',t:'Compteur de séries à ta main (6 novembre)',items:[
      ['🎯','Sur l’intro de chaque exo : ton poids du jour + les reps visées (8, 10, 12…). La barre « Séries à X kg × N » suit ton choix, à l’intro et pendant le repos.'],
      ['🔁','Reps par défaut = tes 5 dernières séances à ce poids, jamais sous le bas de la fourchette du programme.'],
      ['½','Une série à 1 ou 2 reps de la cible compte pour ½ (cible 12 : 11 et 10 = ½, 9 = 0). Ta note /20 ne change pas.'],
      ['🥤','« Shaker » devient « Créatine » : avec ou sans shaker, c’est la créatine qui compte.']
    ]},
    {id:'2026-11-05',t:'Couleurs des pas (5 novembre)',items:[
      ['\uD83D\uDC5F','Nouveaux paliers : vert dès 7\u00a0000 pas, gris dès 5\u00a0000, rouge en dessous, rouge sang sous 2\u00a0000. 10\u00a0000 reste gold.'],
      ['\u2705','La stat « Jours à … pas » compte maintenant les jours à 7\u00a0000. Le malus de la note (sous 1\u00a0000 pas) ne change pas.']
    ]},
    {id:'2026-11-04c',t:'Petites finitions (4 novembre)',items:[
      ['\u2696\uFE0F','Tes pesées Renpho (via Santé) arrivent toutes seules dans ton historique, sans jamais écraser ce que tu notes à la main.'],
      ['\uD83E\uDE79','Deux séances le même jour : la douleur de la première n\u2019est plus effacée par la seconde.'],
      ['\uD83D\uDCC5','Calendrier plus lisible : les jours du mois d\u2019avant et les étiquettes S-1\u2026S-5 ne sont plus délavés.']
    ]},
    {id:'2026-11-04b',t:'La Sèche est prête (4 novembre)',items:[
      ['\uD83D\uDDD3\uFE0F','Ta saison Sèche est construite : elle démarre toute seule le lundi 4 janvier. D\u2019ici là, rien ne change.'],
      ['\uD83D\uDC41','Pour la voir avant : Réglages \u203A Saison Sèche \u203A « Voir l\u2019aperçu ». Rien n\u2019est enregistré, tu coupes quand tu veux.'],
      ['\uD83C\uDF7D\uFE0F','Au programme : 2\u00a0450\u00a0kcal et 160\u00a0g de protéines, 3 séances + 1 course, un objectif abdos, et une note qui récompense le maintien de tes charges.']
    ]},
    {id:'2026-11-04',t:'Corrections du 4 novembre',items:[
      ['\u23F0','Tes séances « manque de temps » déjà faites sont re-notées (celle du 3/11 passe de 14 à 18).'],
      ['\u2696\uFE0F','Charge conseillée en fin de séance : le vrai cran de la machine (fini les 99\u00a0kg impossibles), et le − / + avance d\u2019un cran.'],
      ['\uD83C\uDF7D\uFE0F','Calendrier : la fiche d\u2019un jour ne montre plus que les kcal et G · P · L (le détail reste dans Nutrition).'],
      ['\uD83E\uDE79','Anciennes séances : un arrêt douleur sans zone s\u2019affiche « zone non notée » (plus « poignet » par défaut).']
    ]},
    {id:'2026-11-03c',t:'Petites corrections (3 novembre, soir)',items:[
      ['\u23F0','« Manque de temps » en fin de séance : un exo passé ne compte plus dans la note, un exo écourté est jugé sur ses séries faites.'],
      ['\uD83D\uDD25','Abdo passé : non noté (plus de 0) jusqu\u2019au 7 décembre, où il devient obligatoire.'],
      ['\uD83D\uDCCA','Barre « séries à la charge » par palier de reps : 24\u00a0kg \u00d7\u00a08, puis \u00d7 10, puis \u00d7 12 — monter de 2 reps relance la barre.'],
      ['\uD83C\uDF7D\uFE0F','Fiche d\u2019un jour : nutrition 3\u00d7 plus compacte, flèche du détail corrigée. Page Sommeil : plus de défilement de côté.']
    ]},
    {id:'2026-11-03b',t:'Bilans plus clairs (3 novembre)',items:[
      ['\uD83D\uDCCB','Bilan de séance : une seule ligne par exo, la décision et ta prochaine charge.'],
      ['\uD83C\uDFAF','Bilan de la semaine : une consigne, la plus importante.'],
      ['\u2696\uFE0F','Notation des exos plus juste : ton plan bien fait (OK · dur · dur · échec) reste noté haut, les séries sous la fourchette coûtent un peu plus.'],
      ['\uD83D\uDD01','Tes séances et ta semaine du 26 octobre sont recalculées avec ce barème.']
    ]},
    {id:'2026-11-03',t:'Nouveautés du 3 novembre',items:[
      ['\uD83C\uDFC6','Nouvelle notation /20 depuis la semaine du 26 octobre : Salle /10, Nutrition /6 (tes vraies données Yazio), Activité.'],
      ['\uD83C\uDFC3','La course et le malus des jours sous 1 000 pas comptent à partir de la semaine du 7 décembre.'],
      ['\uD83D\uDD12','Ta note est gravée le lundi matin, après ton \u21bb (Yazio + pas) : ensuite elle ne bouge plus.'],
      ['\uD83D\uDD0D','Notes : touche une semaine pour voir pourquoi tu as cette note.'],
      ['\uD83D\uDCAA','Indice de force dans Progression, sous l\u2019évolution des poids.'],
      ['\uD83C\uDF19','Sommeil : au lit avant minuit, réveil entre 7\u00a0h et 9\u00a0h.']
    ]}
  ];
  var S={tab:'today',notes:false,sel:null,psel:null,per:'all',pall:false,conf:null,mconf:null,mOpen:false,allw:false,mel:false,pop:null,screen:null,sheet:null};

  /* ── Format français ── */
  function fr(v,d){ return Number(v).toFixed(d).replace('.',','); }
  function nf(v){ return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g,NB); }
  function sgn(v,d){ return (v>0?'+':v<0?'−':'±')+fr(Math.abs(v),d); }
  function hm(m){ return Math.floor(m/60)+NB+'h'+NB+String(m%60).padStart(2,'0'); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function u(t){ return '<span class="bl-unit">'+t+'</span>'; }
  function ymd(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function addD(s,n){ var d=new Date(s+'T12:00:00'); d.setDate(d.getDate()+n); return ymd(d); }
  function days(a,b){ return Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/86400000); }
  function dlab(s){ return new Date(s+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'}); }
  function dshort(s){ return new Date(s+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'}); }
  function mshort(s){ return new Date(s+'T12:00:00').toLocaleDateString('fr-FR',{month:'short'}); }
  function today(){ return todayStr(); }
  function noteN(v){ return v<8?1:v<12?2:v<14?3:v<18?4:5; }
  var NOTE_PAL=['','rouge sang','rouge','gris','bleu','gold'];

  function saison(d){ d=d||today(); var id=(typeof SAISON!=='undefined')?SAISON.idAt(d):(d>=SAISONS[1].start?'seche':'masse'); return id==='seche'?SAISONS[1]:SAISONS[0]; }
  function seche(){ return saison().id==='seche'; }
  // Couleurs du poids selon la saison (04/11) : en masse, monter = vert ; en Sèche, baisser = vert, et le rythme
  // est vert dans la zone −0,35 à −0,55 kg/sem (gris un peu lent, rouge hors zone : plateau ou trop rapide)
  function dCls(d){ if(d==null) return ''; return seche()?(d<=0?'bl-pos':'bl-neg'):(d>=0?'bl-pos':'bl-neg'); }
  function rCls(r){ if(r==null) return ''; if(!seche()) return r>=0?'bl-pos':'bl-neg'; var z=SAISON.CFG.seche.rate; return r>=z[0]&&r<=z[1]?'bl-pos':(r>z[1]&&r<=-0.15)?'bl-mut':'bl-neg'; }
  function weights(){ return (DB.bodyWeight||[]).filter(function(b){ return b&&b.date&&parseFloat(b.weight_kg)>0; }); }

  /* ══════════ PAGE BILAN ══════════ */
  function alertsHtml(){
    var L=[];
    if(typeof _pushState!=='undefined'&&_pushState&&_pushState.state==='lost'){
      var denied=_pushState.reason==='denied';
      L.push(['🔕','Notifications coupées',denied?'Réglages':'Réactiver',denied?'openSettings()':'enablePushNotifications()']);
    }
    if(typeof SAISON!=='undefined'&&SAISON.previewAt(today())) L.push(['👁','Aperçu Sèche','Quitter','SAISON.setPreview(false)']);
    if(typeof SPORT!=='undefined'&&SPORT.active()) L.push(['🏃','Course en cours','Reprendre','SPORT.resume()']);
    if(seche()){
      // Plateau 2 semaines (cardio salle conditionnel, décision 12/10) : pente des pesées sur 14 jours au-dessus de −0,15 kg/sem
      var R14=null; try{ R14=bwRate(weights(),14); }catch(e){}
      if(R14&&R14.rate>-0.15) L.push(['🫀','Plateau 2 sem.','+ cardio',"BILAN.go('poids')"]);
      // Photo du mois (les 3 premiers jours du mois ; l'app ne stocke pas les photos)
      var dm=parseInt(today().slice(8,10),10), pk='massup_photo_'+today().slice(0,7), seen=false; try{ seen=localStorage.getItem(pk)==='1'; }catch(e){}
      if(dm<=3&&!seen) L.push(['📸','Photo du mois','Faite',"BILAN.photoDone()"]);
    }
    var wk=null; try{ wk=wrPendingWeek(); }catch(e){}
    if(wk) L.push(['📊','Bilan de la semaine prêt',dshort(wk),"wrOpen('"+wk+"')"]);
    var mk=null; try{ mk=mrPendingMonth(); }catch(e){}
    if(mk) L.push(['🗓️','Bilan du mois prêt',mrMonthLabel(mk).split(' ')[0],"mrOpen('"+mk+"')"]);
    if(!L.length) return '';
    return '<nav class="bl-alerts" aria-label="Alertes">'+L.map(function(a){
      return '<button type="button" class="bl-alert" onclick="'+a[3]+'"><span aria-hidden="true">'+a[0]+'</span><span class="bl-alert__t">'+a[1]+'</span><span class="bl-meta">'+esc(a[2])+'</span><span class="bl-mut" aria-hidden="true">›</span></button>';
    }).join('')+'</nav>';
  }

  function situationHtml(){
    var p=DB.profile||{}, name=p.name||'Adrien', sa=saison(), prv=typeof SAISON!=='undefined'&&SAISON.previewAt(today()), j=Math.max(0,days(today(),sa.id==='masse'?SAISONS[1].start:sa.end));
    var ws=weights(), last=ws[ws.length-1], prev=ws[ws.length-2];
    var poids=last
      ? '<button type="button" class="bl-hero__it" onclick="BILAN.go(\'poids\')"><div class="bl-lbl">⚖️ Poids</div><div class="bl-num bl-hero__v"><span class="bl-hero-txt">'+fr(parseFloat(last.weight_kg),1)+'</span>'+u('kg')+'</div><div class="bl-hero__s">'
        +(prev?'<span class="'+dCls(last.weight_kg-prev.weight_kg)+'">'+sgn(last.weight_kg-prev.weight_kg,1)+' kg</span> ':'')+'<span class="bl-mut">· '+dshort(last.date)+'</span></div></button>'
      : '<div class="bl-hero__it"><div class="bl-lbl">⚖️ Poids</div><button type="button" class="bl-btn bl-btn--primary bl-btn--sm" style="margin-top:12px" onclick="BILAN.sheet(\'pesee\')">+ 1re pesée</button></div>';
    var kc=null, goal=2900;
    if(typeof INTAKE!=='undefined'){ var w=INTAKE.last15(); kc=INTAKE.avg(w.start,w.end,'kcal').v; goal=INTAKE.NUT[0].goal; }
    var kcal=kc!=null
      ? '<button type="button" class="bl-hero__it" onclick="INTAKE.open()"><div class="bl-lbl">🍽️ kcal · 15 jours</div><div class="bl-num bl-hero__v"><span class="bl-hero-txt">'+nf(kc)+'</span></div><div class="bl-hero__s bl-mut">sur '+nf(goal)+' · '+Math.round(kc/goal*100)+NB+'%</div></button>'
      : '<div class="bl-hero__it"><div class="bl-lbl">🍽️ kcal · 15 jours</div><div class="bl-num bl-hero__v bl-mut">—</div><div class="bl-hero__s bl-mut">rien de Yazio</div></div>';
    return '<section class="bl-sit"><div class="bl-sit__top"><h1 class="bl-sit__name">'+esc(name)+'</h1><span class="bl-pill">'+sa.lbl+(prv?' · aperçu':' · J-'+j)+'</span></div><div class="bl-hero">'+poids+kcal+'</div></section>';
  }

  function objectivesHtml(B0){
    var mon=rankMonday(today()), o=nutObjectives(mon);
    var run=Math.max(nutWeekCount('run',mon),runWeekAuto(mon));
    var rows=[
      ['maison','🍲','Plats maison',nutWeekCount('maison',mon),o.maison||10,true],
      ['shaker','🥤','Créatine',nutWeekCount('shaker',mon),o.shk||7,true],
      ['run','🏃','Courir',run,o.run||1,true]
    ];
    if(seche()){ var ab=0; try{ ab=abdoWeekAuto(mon); }catch(e){} rows.push(['abdos','🔥','Séances avec abdos',ab,SAISON.CFG.seche.abdos,false]); }
    return '<section class="bl-obj" aria-label="Objectifs de la semaine">'+rows.map(function(r){
      var k=r[0],v=r[3],g=r[4],done=v>=g, cls=done?'is-done':v===0?'is-zero':'';
      var cap=r[5]?nutTapMax(k):g;
      return '<div class="bl-obj__row"><span class="bl-obj__e" aria-hidden="true">'+r[1]+'</span><div style="min-width:0"><div class="bl-obj__n">'+r[2]+'</div><div class="bl-trk"><i class="'+(done?'is-done':'')+'" style="width:'+Math.min(100,v/g*100).toFixed(0)+'%"></i></div></div>'
        +'<span class="bl-num bl-obj__v '+cls+'">'+String(v).replace('.',',')+u('/'+g)+'</span>'
        +(r[5]?'<button type="button" class="bl-plus'+(k==='run'?' bl-plus--soft':'')+(S.pop===k?' is-pop':'')+'" onclick="BILAN.inc(\''+k+'\')" aria-label="Ajouter 1 · '+r[2]+' ('+v+' sur '+g+')"'+(v>=cap?' disabled':'')+'>+</button>'
          :'<span class="bl-obj__auto" aria-label="automatique">'+(done?'✓':'')+'</span>')+'</div>';
    }).join('')+'</section>';
  }

  // Étiquette d'une macro (règles d'INTAKE : min, cible 70 g / 80 g max pour les lipides, max)
  function macroTag(n,v){
    if(n.kind==='max') return v>n.goal?['au-dessus','bl-warn','is-warn']:['✓ sous le max','bl-pos',''];
    if(n.kind==='target') return v>n.max?['au-dessus','bl-warn','is-warn']:v>n.goal?['✓ acceptable','bl-pos','']:['✓ cible','bl-pos',''];
    return v>=n.goal?['✓ objectif','bl-pos','']:[Math.round(v/n.goal*100)+NB+'%','',''];
  }
  function macroCell(n,v){
    if(v==null) return '<div class="bl-macro"><div class="bl-macro__n"><i class="bl-dot" style="background:var(--in-'+n.col+')"></i>'+n.lbl+'</div><div class="bl-num bl-macro__v bl-mut">—</div><div class="bl-trk"></div><div class="bl-macro__t">non noté</div></div>';
    var t=macroTag(n,v), ref=n.kind==='target'?n.max:n.goal;
    return '<div class="bl-macro"><div class="bl-macro__n"><i class="bl-dot" style="background:var(--in-'+n.col+')"></i>'+n.lbl+'</div>'
      +'<div class="bl-num bl-macro__v '+(t[1]==='bl-warn'?'bl-warn':'')+'">'+nf(v)+u('/'+n.goal+' g'+(n.kind==='max'?' max':''))+'</div>'
      +'<div class="bl-trk"><i class="'+t[2]+'" style="width:'+Math.min(100,v/ref*100).toFixed(0)+'%;'+(t[2]?'':'background:var(--in-'+n.col+')')+'"></i></div><div class="bl-macro__t '+t[1]+'">'+t[0]+'</div></div>';
  }
  function nutritionHtml(){
    var head='<div class="bl-sec__head"><h2 class="bl-sec__t"><span aria-hidden="true">🍽️</span>Nutrition</h2><button type="button" class="bl-ib" onclick="INTAKE.open()" aria-label="Ouvrir la page Nutrition">›</button></div>';
    var seg='<div class="bl-seg" role="tablist" style="margin-top:10px"><button type="button" role="tab" aria-selected="'+(S.tab==='today')+'" onclick="BILAN.tab(\'today\')">Aujourd’hui</button><button type="button" role="tab" aria-selected="'+(S.tab==='15j')+'" onclick="BILAN.tab(\'15j\')">15 derniers jours</button></div>';
    if(typeof INTAKE==='undefined') return '';
    var N=INTAKE.NUT, BY={}; N.forEach(function(x){ BY[x.k]=x; });
    var body, any=Object.keys(INTAKE.days()).length>0;
    var vals={}, meta='';
    if(S.tab==='15j'){ var w=INTAKE.last15(); ['kcal','glu','prot','lip'].forEach(function(k){ var a=INTAKE.avg(w.start,w.end,k); vals[k]=a.v; if(k==='kcal') meta=a.n+'/15 jours'; }); }
    else { var d=INTAKE.day(today()); ['kcal','glu','prot','lip'].forEach(function(k){ vals[k]=d&&d[k]>0?d[k]:null; }); meta='en cours'; }
    if(!any) body='<div class="bl-empty"><span class="bl-empty__t">Rien reçu de Yazio</span><button type="button" class="bl-btn bl-btn--ghost bl-btn--sm" onclick="BILAN.refresh()">↻ Faire venir mes totaux</button></div>';
    else if(vals.kcal==null) body='<div class="bl-empty"><span class="bl-empty__t">'+(S.tab==='today'?'Aucun repas noté aujourd’hui':'Aucun jour noté sur les 15 derniers jours')+'</span><button type="button" class="bl-btn bl-btn--ghost bl-btn--sm" onclick="BILAN.refresh()">↻ Actualiser</button></div>';
    else body='<div class="bl-kcal"><span class="bl-num bl-kcal__v">'+nf(vals.kcal)+u('/ '+nf(BY.kcal.goal)+' kcal')+'</span><span class="bl-meta">'+meta+'</span></div>'
      +'<div class="bl-trk bl-trk--lg" style="margin-top:12px"><i class="is-kcal" style="width:'+Math.min(100,vals.kcal/BY.kcal.goal*100).toFixed(0)+'%"></i></div>'
      +'<div class="bl-macros">'+macroCell(BY.glu,vals.glu)+macroCell(BY.prot,vals.prot)+macroCell(BY.lip,vals.lip)+'</div>';
    return '<section class="bl-sec">'+head+seg+body+'</section>';
  }

  var TIER={gold:'var(--st-gold)',green:'var(--st-green)',gray:'var(--st-gray)',red:'var(--st-red)',blood:'var(--st-blood)'};
  function sleepZone(m){ return m!=null&&m>=420&&m<=540; }
  function duoHtml(){
    var t=today(), mon=rankMonday(t), L='LMMJVSD';
    var pas='';
    if(typeof STEPS!=='undefined'){
      var W=STEPS.week(mon), v0=STEPS.stepsOf(t), goal=50000;
      var mx=Math.max(12000,Math.max.apply(null,W.days.map(function(x){ return x.v||0; })));
      var bars=W.days.map(function(x,i){
        var no=x.fut||x.v==null;
        return '<span class="'+(x.d===t?'is-today':'')+'"><i style="height:'+(no?100:Math.max(6,x.v/mx*100)).toFixed(0)+'%;background:'+(no?'var(--bl-track)':TIER[STEPS.tier(x.v)]||'var(--bl-bar)')+'"></i><em>'+L[i]+'</em></span>';
      }).join('');
      pas='<div><button type="button" class="bl-sec__head" onclick="STEPS.open()"><h2 class="bl-sec__t bl-sec__t--sm"><span aria-hidden="true">👟</span>Pas</h2><span class="bl-mut" aria-hidden="true">›</span></button>'
        +'<div class="bl-num bl-big'+(v0==null?' bl-mut':'')+'">'+(v0==null?'—':nf(v0))+'</div>'
        +'<div class="bl-kv">moy. <b>'+(W.avg==null?'—':nf(W.avg))+'</b> / j</div>'
        +'<div class="bl-kv"><b>'+nf(W.sum)+'</b> / 50'+NB+'000</div>'
        +'<div class="bl-trk" style="margin-top:8px"><i class="'+(W.sum>=goal?'is-done':'')+'" style="width:'+Math.min(100,W.sum/goal*100).toFixed(0)+'%"></i></div>'
        +'<div class="bl-mini bl-mini--tall">'+bars+'</div></div>';
    }
    var som='';
    if(typeof SLEEP!=='undefined'){
      var key=SLEEP._night(), log=DB.sleepLog||{}, nights=[];
      for(var i=6;i>=0;i--){ var k=addD(key,-i), e=log[k]||{}; nights.push({k:k,m:SLEEP._duration(e.bed,e.wake),e:e}); }
      var cur=nights[6], valid=nights.filter(function(n){ return n.m!=null; });
      var avgm=valid.length?Math.round(valid.reduce(function(a,n){ return a+n.m; },0)/valid.length):null;
      var sb=nights.map(function(n,i){
        return '<span class="'+(i===6?'is-today':'')+'"><i style="height:'+(n.m==null?100:Math.min(100,n.m/600*100)).toFixed(0)+'%;background:'+(n.m==null?'var(--bl-track)':sleepZone(n.m)?'var(--bl-sleep-ok)':'var(--bl-sleep-ko)')+'"></i><em>'+new Date(addD(n.k,1)+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'narrow'})+'</em></span>';
      }).join('');
      var top=cur.m==null
        ? '<div class="bl-num bl-big bl-mut">—</div>'
        : '<div class="bl-num bl-big">'+hm(cur.m)+(sleepZone(cur.m)?'<span class="bl-zone-ok" aria-label="dans la zone">✓</span>':'')+'</div>';
      som='<div><button type="button" class="bl-sec__head" onclick="SLEEP.open()"><h2 class="bl-sec__t bl-sec__t--sm"><span aria-hidden="true">🌙</span>Sommeil</h2><span class="bl-mut" aria-hidden="true">›</span></button>'+top
        +'<div class="bl-kv">moy. <b>'+(avgm==null?'—':hm(avgm))+'</b></div>'
        +(cur.m==null?'<button type="button" class="bl-edit bl-edit--sm bl-edit--cta" onclick="BILAN.sheet(\'nuit\')">🌙 Noter ma nuit</button>'
          :'<button type="button" class="bl-edit bl-edit--sm" onclick="BILAN.sheet(\'nuit\')" aria-label="Modifier la nuit"><span>'+esc(cur.e.bed)+' → '+esc(cur.e.wake)+'</span><span aria-hidden="true">✎</span></button>')
        +'<div class="bl-mini bl-mini--tall">'+sb+'</div></div>';
    }
    return '<section class="bl-duo">'+pas+som+'</section>';
  }

  /* ── Courbe de poids (SVG + HTML, sans Chart.js — HANDOFF §4) ── */
  function weightModel(per,w,h){
    var ws=weights(), end=today();
    var from=per==='3m'?addD(end,-91):per==='6m'?addD(end,-182):(ws[0]?ws[0].date:end);
    var data=ws.filter(function(b){ return b.date>=from; }).map(function(b){ return {d:b.date,v:parseFloat(b.weight_kg),t:new Date(b.date+'T12:00:00').getTime()}; });
    if(!data.length) return null;
    var vals=data.map(function(p){ return p.v; }), sa=SAISONS[0];
    var lo=Math.min.apply(null,vals), hi=Math.max.apply(null,vals);
    var y0=Math.min(Math.floor(lo-1),67), y1=Math.ceil(Math.max(hi,sa.cible)+1);
    var t0=new Date(from+'T12:00:00').getTime(), T=Math.max(86400000,new Date(end+'T12:00:00').getTime()-t0);
    var Y=function(v){ return h-(v-y0)/(y1-y0)*h; };
    var pts=data.map(function(p,k){
      var x=4+(p.t-t0)/T*(w-8), y=Y(p.v);
      return {x:x,y:y,v:p.v,d:p.d,lx:(x/w*100).toFixed(2),ty:(y/h*100).toFixed(2),dl:k>0?sgn(p.v-data[k-1].v,1):''};
    });
    // Tendance tracée : moyenne glissante centrée sur 3 pesées (HANDOFF §4)
    var tr=pts.map(function(p,i){ var a=data.slice(Math.max(0,i-1),i+2); return [p.x,Y(a.reduce(function(q,r){ return q+r.v; },0)/a.length)]; });
    var line=tr.map(function(p,i){ return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1); }).join(' ');
    var step=(y1-y0)>8?4:2, grid=[];
    for(var v=Math.ceil(y0/step)*step;v<=y1;v+=step) grid.push([(Y(v)/h*100).toFixed(1),v]);
    // Repères de mois : au plus 5, placés à leur vraie date
    var ax=[], m=new Date(from+'T12:00:00'); m.setDate(1); m.setMonth(m.getMonth()+1);
    var months=[]; while(ymd(m)<=end){ months.push(ymd(m)); m.setMonth(m.getMonth()+1); }
    var every=Math.max(1,Math.ceil(months.length/5));
    months.forEach(function(ms,i){ if((months.length-1-i)%every===0){ var x=4+(new Date(ms+'T12:00:00').getTime()-t0)/T*(w-8); ax.push([(x/w*100).toFixed(1),mshort(ms)]); } });
    var bw=bwTrend(ws);
    return {pts:pts,line:line,area:line+' L'+(tr[tr.length-1][0]).toFixed(1)+' '+h+' L'+tr[0][0].toFixed(1)+' '+h+' Z',y76:Y(sa.cible),y68:Y(SAISONS[1].cible),grid:grid,ax:ax,h:h,w:w,
      trend:bw.length?bw[bw.length-1].y:null};
  }
  function chartHtml(md,selIdx,lg){
    var sel=selIdx!=null&&md.pts[selIdx]?md.pts[selIdx]:null, c=lg?'psel':'sel';
    return '<div class="bl-chart'+(lg?' bl-chart--lg':'')+'">'
      +(lg?md.grid.map(function(g){ return '<i class="bl-chart__grid" style="top:'+g[0]+'%"></i><span class="bl-chart__yl" style="top:'+g[0]+'%">'+g[1]+'</span>'; }).join(''):'')
      +'<svg viewBox="0 0 '+md.w+' '+md.h+'" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="bl-area-'+c+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acc);stop-opacity:.24"/><stop offset="1" style="stop-color:var(--acc);stop-opacity:0"/></linearGradient></defs>'
      +'<line class="bl-chart__goal" x1="0" x2="'+md.w+'" y1="'+md.y76.toFixed(1)+'" y2="'+md.y76.toFixed(1)+'"/>'
      +(lg?'<line class="bl-chart__target" x1="0" x2="'+md.w+'" y1="'+md.y68.toFixed(1)+'" y2="'+md.y68.toFixed(1)+'"/>':'')
      +'<path class="bl-chart__area" style="fill:url(#bl-area-'+c+')" d="'+md.area+'"/><path class="bl-chart__line" d="'+md.line+'"/></svg>'
      +'<span class="bl-chart__tag" style="top:'+(md.y76/md.h*100).toFixed(1)+'%">objectif masse '+SAISONS[0].cible+' kg</span>'
      +md.pts.map(function(p){ return '<i class="bl-chart__dot" style="left:'+p.lx+'%;top:'+p.ty+'%"></i>'; }).join('')
      +(sel?'<i class="bl-chart__v" style="left:'+sel.lx+'%"></i><i class="bl-chart__ring" style="left:'+sel.lx+'%;top:'+sel.ty+'%"></i>':'')
      +'<button type="button" class="bl-chart__hit" data-c="'+c+'" onclick="BILAN.pick(event,this)" aria-label="Lire une pesée sur la courbe"></button></div>';
  }
  function axHtml(md,lg){ return '<div class="bl-ax bl-ax--abs'+(lg?' bl-ax--lg':'')+'">'+md.ax.map(function(a){ return '<span style="left:'+a[0]+'%">'+a[1]+'</span>'; }).join('')+'</div>'; }
  function rateTxt(){ var R=bwRate(weights()); return R?'<span class="'+rCls(R.rate)+'" style="font-weight:800">'+sgn(R.rate,2)+' kg/sem</span>':''; }
  function readHtml(md,selIdx,withDelta){
    var sel=selIdx!=null?md.pts[selIdx]:null;
    if(!sel) return '<div class="bl-read"><span>Tendance <span class="bl-num" style="font-size:18px">'+(md.trend==null?'—':fr(md.trend,1)+' kg')+'</span></span>'+rateTxt()+'</div>';
    return '<div class="bl-read" aria-live="polite"><span class="bl-read__d"><span class="bl-mut">'+dlab(sel.d)+'</span><span class="bl-num" style="font-size:18px">'+fr(sel.v,1)+' kg</span>'+(withDelta&&sel.dl?'<span class="bl-mut" style="font-size:12px">'+sel.dl+'</span>':'')+'</span>'
      +'<button type="button" class="bl-ib" style="margin-right:-10px" onclick="BILAN.unpick(\''+(withDelta?'psel':'sel')+'\')" aria-label="Fermer la lecture">✕</button></div>';
  }
  function weightHtml(){
    var ws=weights(), inner;
    if(ws.length<2) inner='<div class="bl-empty"><span class="bl-empty__t">'+(ws.length?'Encore une pesée pour tracer la courbe':'Aucune pesée pour l’instant')+'</span></div>';
    else { var md=weightModel('all',350,150); inner=readHtml(md,S.sel,false)+chartHtml(md,S.sel,false)+axHtml(md,false); }
    return '<section class="bl-sec"><button type="button" class="bl-sec__head" onclick="BILAN.go(\'poids\')"><h2 class="bl-sec__t"><span aria-hidden="true">⚖️</span>Poids &amp; corps</h2><span class="bl-mut" style="font-weight:800;font-size:16px;padding-right:12px" aria-hidden="true">›</span></button>'+inner
      +'<div class="bl-actions"><button type="button" class="bl-btn bl-btn--primary" onclick="BILAN.sheet(\'pesee\')">+ Pesée</button><button type="button" class="bl-btn bl-btn--ghost" onclick="BILAN.sheet(\'mensu\')">📏 Mensurations</button></div></section>';
  }

  function notesHtml(B0,curWs){
    var sa=saison(), rows=[];
    function det(B){ return fmtSeances(B.salle)+'/'+B.goal+' séance'+(B.goal>1?'s':''); }
    rows.push(['Cette semaine','en cours · '+det(B0),B0.note,"BILAN.note('"+curWs+"')"]);
    var ws=rankAddDays(curWs,-7), B=bilanNoteWeek(ws); if(B.salle) rows.push(['Sem. du '+dshort(ws),det(B)+(B.graved?' · gravée':''),B.note,"BILAN.note('"+ws+"')"]);
    var t=today(), pm=new Date(parseInt(t.slice(0,4),10),parseInt(t.slice(5,7),10)-2,1), pmk=pm.getFullYear()+'-'+String(pm.getMonth()+1).padStart(2,'0');
    var M=null; try{ M=bilanNoteMonth(pmk); }catch(e){}
    if(M&&M.salle) rows.push([mrMonthLabel(pmk),'mois · '+M.salle+' séances',M.note,"mrOpen('"+pmk+"',true)"]);
    var older=[], season=rankCurrentSeason();
    for(var j=2;j<=30;j++){ var w2=rankAddDays(curWs,-7*j); if(season&&w2<season.start) break; var B2=bilanNoteWeek(w2); if(B2.salle&&saison(w2).id!==saison(rankAddDays(w2,7)).id) older.push(['Saison 1 · Prise de masse','archivée, relisible',null,'']); if(B2.salle) older.push(['Sem. du '+dshort(w2),det(B2)+(B2.graved?' · gravée':''),B2.note,"BILAN.note('"+w2+"')"]); }
    if(S.allw) rows=rows.concat(older);
    var row=function(r){ if(r[2]==null) return '<div class="bl-nsep">'+r[0]+' <span class="bl-mut">· '+r[1]+'</span></div>'; return '<button type="button" class="bl-nrow" onclick="'+r[3]+'"><div style="min-width:0"><div class="bl-nrow__n">'+r[0]+'</div><div class="bl-nrow__s">'+r[1]+'</div></div><div class="bl-num bl-nrow__v" style="color:var(--bl-note-'+noteN(r[2])+')">'+fr(r[2],1)+u('/20')+'<span class="bl-mut bl-nrow__a" aria-hidden="true">›</span></div></button>'; };
    return '<button type="button" class="bl-fold" aria-expanded="'+S.notes+'" aria-controls="blNotes" onclick="BILAN.toggle(\'notes\')"><span aria-hidden="true" style="font-size:18px">🏆</span><span>Notes</span><span class="bl-fold__i" aria-hidden="true">›</span></button>'
      +(S.notes?'<div class="bl-notes" id="blNotes">'+rows.map(row).join('')+(older.length?'<button type="button" class="bl-more" onclick="BILAN.toggle(\'allw\')">'+(S.allw?'Moins ▴':'Toutes les semaines ▾')+'</button>':'')+'</div>':'');
  }

  function melatiHtml(){
    if(typeof PV==='undefined') return '';
    return '<button type="button" class="bl-fold" aria-expanded="'+S.mel+'" aria-controls="bilanPartner" onclick="BILAN.toggle(\'mel\')"><span aria-hidden="true" style="font-size:20px">🌸</span><span>Progression de Melati</span><span class="bl-fold__i" aria-hidden="true">›</span></button>'
      +'<div class="bl-mel" id="bilanPartner"'+(S.mel?'':' hidden')+'></div>';
  }

  function render(){
    var host=$('bilanPage'); if(!host) return;
    try{ if(typeof INTAKE!=='undefined'&&INTAKE.syncGoals) INTAKE.syncGoals(); }catch(e){}
    var curWs=rankMonday(today()), B0=bilanNoteWeek(curWs);
    host.innerHTML=alertsHtml()+'<div class="bl-topcard">'+situationHtml()+'<hr class="bl-hr">'+objectivesHtml(B0)+'</div>'+nutritionHtml()+'<hr class="bl-hr">'+duoHtml()+'<hr class="bl-hr">'+weightHtml()+'<hr class="bl-hr">'+notesHtml(B0,curWs)+'<hr class="bl-hr">'+melatiHtml();
    S.pop=null;
    try{ if(typeof PV!=='undefined'&&S.mel) PV.render(); }catch(e){ console.warn('[MASSUP] PV:',e); }
    if(S.screen) renderScreen();
    if(S.sheet) renderSheet();
    if(!autoNews()) autoNight();
  }

  /* ══════════ ESPACE POIDS (plein écran) ══════════ */
  function top(t,sub,right){ return '<div class="bl-top"><button type="button" class="bl-ib bl-ib--fill" onclick="BILAN.back()" aria-label="Fermer">✕</button><div style="min-width:0"><h1 class="bl-top__t">'+t+'</h1>'+(sub?'<span class="bl-top__s">'+sub+'</span>':'')+'</div>'+(right||'<span></span>')+'</div>'; }
  function poidsHtml(){
    var ws=weights(), last=ws[ws.length-1], prev=ws[ws.length-2], L=bodyMeasList();
    var measEmpty='<section class="bl-sec"><div class="bl-sec__head"><h2 class="bl-sec__t"><span aria-hidden="true">📏</span>Mensurations</h2></div><div class="bl-empty"><span>Point de départ avant la sèche du 4 janvier.</span><button type="button" class="bl-btn bl-btn--ghost bl-btn--sm" onclick="BILAN.sheet(\'mensu\')">+ Mesurer</button></div></section>';
    if(!last) return top('⚖️ Poids &amp; corps')+'<section class="bl-sec"><div class="bl-empty"><span class="bl-empty__t">Aucune pesée pour l’instant</span><button type="button" class="bl-btn bl-btn--primary" onclick="BILAN.sheet(\'pesee\')">+ Première pesée</button></div></section><hr class="bl-hr">'+(L.length?measHtml(L):measEmpty);
    var cur=parseFloat(last.weight_kg), R=bwRate(ws), tr=bwTrend(ws), t=today();
    var n7=ws.filter(function(b){ return b.date>addD(t,-7); }).length;
    var d30=R?R.rate/7*30:null, first=ws[0], tot=cur-parseFloat(first.weight_kg);
    var stat=function(l,v,s,cls){ return '<div><div class="bl-lbl">'+l+'</div><div class="bl-num bl-stats__v '+(cls||'')+'">'+v+'</div><div class="bl-stats__s">'+s+'</div></div>'; };
    var h=top('⚖️ Poids &amp; corps')
      +'<section class="bl-sec" style="padding-top:26px"><div class="bl-lbl">Dernière pesée · '+dlab(last.date)+'</div>'
      +'<div class="bl-num" style="font-size:68px;margin-top:10px"><span class="bl-hero-txt">'+fr(cur,1)+'</span>'+u('kg')+'</div>'
      +(prev?'<div style="font-size:13px;font-weight:800;margin-top:10px"><span class="'+dCls(cur-prev.weight_kg)+'">'+sgn(cur-prev.weight_kg,1)+' kg</span> <span class="bl-mut">vs '+dlab(prev.date)+'</span></div>':'')
      +'<div class="bl-stats">'
      +stat('Tendance',fr(tr[tr.length-1].y,1)+u('kg'),'moy. 7 jours')
      +stat('Rythme',R?sgn(R.rate,2):'—',(seche()?'kg/sem · vise −0,35 à −0,55':'kg/sem · 4 sem.'),R?rCls(R.rate):'')
      +stat('Pesées',n7+u('/7 j'),'objectif 3+'+(n7>=3?' ✓':''))
      +stat('30 jours',d30==null?'—':sgn(d30,1)+u('kg'),d30==null?'pas assez de pesées':'au rythme actuel',d30==null?'':dCls(d30))
      +stat('Saison',sgn(tot,1)+u('kg'),'depuis '+dshort(first.date),tot>=0?'bl-pos':'bl-neg')
      +stat('Sèche',SAISONS[1].gras+u('% gras'),SAISONS[1].cible+' kg · 1 juin')
      +'</div></section><hr class="bl-hr">';
    // Frise masse → sèche (dates des saisons)
    var a=SAISONS[0], b=SAISONS[1], span=days(a.start,b.end), done=Math.max(0,Math.min(days(a.start,a.end),days(a.start,t)));
    var rest=Math.max(0,days(a.start,a.end)-done), sec=days(b.start,b.end), now=Math.max(0,Math.min(100,days(a.start,t)/span*100));
    var trv=tr[tr.length-1].y, reached=trv>=a.cible;
    h+='<section class="bl-sec"><div class="bl-sec__head" style="min-height:0"><h2 class="bl-sec__t bl-sec__t--sm">Prise de masse → sèche</h2><span class="bl-pos" style="font-size:12px;font-weight:800">J-'+Math.max(0,days(t,b.start))+'</span></div>'
      +'<div class="bl-tl" aria-hidden="true" style="grid-template-columns:'+done+'fr '+(rest||0.001)+'fr '+sec+'fr"><span></span><span></span><span></span></div><div class="bl-tl__now"><i style="left:'+now.toFixed(1)+'%"></i></div>'
      +'<div class="bl-tl__l"><div><div>Masse · fin '+dshort(a.end)+'</div><div class="bl-mut" style="margin-top:3px">'+a.cible+' kg '+(reached?'✓ atteint':'visés · encore '+fr(a.cible-trv,1))+'</div></div><div style="text-align:right"><div>Sèche · '+dshort(b.start)+' → '+dshort(b.end)+'</div><div class="bl-mut" style="margin-top:3px">'+b.cible+' kg · '+b.gras+' % de gras</div></div></div></section><hr class="bl-hr">';
    if(ws.length>=2){
      var md=weightModel(S.per,320,220);
      h+='<section class="bl-sec"><div class="bl-sec__head"><h2 class="bl-sec__t"><span aria-hidden="true">📈</span>Courbe</h2></div>'
        +'<div class="bl-seg" role="tablist" style="margin-top:8px">'+[['3m','3 mois'],['6m','6 mois'],['all','Saison']].map(function(x){ return '<button type="button" role="tab" aria-selected="'+(S.per===x[0])+'" onclick="BILAN.per(\''+x[0]+'\')">'+x[1]+'</button>'; }).join('')+'</div>'
        +'<div style="margin-top:10px">'+readHtml(md,S.psel,true)+'</div>'+chartHtml(md,S.psel,true)+axHtml(md,true)
        +'<div class="bl-leg"><span><i style="background:var(--acc);height:3px"></i>tendance</span><span><i style="background:var(--acc);width:7px;height:7px;border-radius:4px"></i>pesée</span><span><i style="background:var(--acc);height:2px"></i>masse '+SAISONS[0].cible+' kg</span><span><i style="background:var(--bl-target);height:2px"></i>sèche '+SAISONS[1].cible+' kg</span></div></section><hr class="bl-hr">';
    }
    var all=ws.slice().reverse(), list=all.slice(0,S.pall?all.length:6);
    h+='<section class="bl-sec"><div class="bl-sec__head"><h2 class="bl-sec__t"><span aria-hidden="true">📋</span>Pesées</h2><span class="bl-meta">'+ws.length+' au total</span></div>'
      +list.map(function(b,k){
        var p=all[k+1], dv=p?Math.round((b.weight_kg-p.weight_kg)*10)/10:0;
        if(S.conf===b.date) return '<div class="bl-confirm"><span>Supprimer '+fr(parseFloat(b.weight_kg),1)+' kg ?</span><button type="button" class="bl-btn bl-btn--ghost bl-btn--sm" onclick="BILAN.conf(null)">Annuler</button><button type="button" class="bl-btn bl-btn--danger bl-btn--sm" onclick="BILAN.delW(\''+b.date+'\')">Supprimer</button></div>';
        return '<div class="bl-prow"><span class="bl-prow__d">'+dlab(b.date)+'</span><span class="bl-num" style="font-size:18px">'+fr(parseFloat(b.weight_kg),1)+u('kg')+'</span><span class="bl-prow__dl '+(dv>0?'bl-pos':dv<0?'bl-neg':'bl-mut')+'">'+(p?(dv===0?'=':sgn(dv,1)):'')+'</span><button type="button" class="bl-ib" onclick="BILAN.conf(\''+b.date+'\')" aria-label="Supprimer la pesée du '+dlab(b.date)+'">🗑</button></div>';
      }).join('')
      +(all.length>6?'<button type="button" class="bl-more" onclick="BILAN.toggle(\'pall\')">'+(S.pall?'Moins ▴':'Tout l’historique ▾')+'</button>':'')+'</section><hr class="bl-hr">';
    h+=(L.length?measHtml(L):measEmpty);
    h+='<div class="bl-sticky"><button type="button" class="bl-btn bl-btn--primary bl-btn--block" style="min-height:54px;font-size:16px" onclick="BILAN.sheet(\'pesee\')">+ Nouvelle pesée</button></div>';
    return h;
  }
  function measHtml(L){
    var last=L[L.length-1];
    var h='<section class="bl-sec"><div class="bl-sec__head"><h2 class="bl-sec__t"><span aria-hidden="true">📏</span>Mensurations</h2><span class="bl-meta">'+dlab(last.date)+'</span></div><div class="bl-mgrid">'
      +BODY_MEAS.map(function(M){
        var cur=last.v[M.k], first=null; for(var i=0;i<L.length;i++){ if(L[i].v[M.k]!=null){ first=L[i]; break; } }
        var d=(cur!=null&&first&&first.date!==last.date)?Math.round((cur-first.v[M.k])*10)/10:null;
        return '<div><div class="bl-lbl">'+M.l+'</div><div class="bl-num" style="font-size:25px;margin-top:6px">'+(cur!=null?fr(cur,1)+u('cm'):'—')+'</div><div style="font-size:12px;font-weight:800;margin-top:4px" class="'+(d==null||d===0?'bl-mut':(seche()&&M.k==='taille')?(d<0?'bl-pos':'bl-neg'):!M.up?'bl-mut':d>0?'bl-pos':'bl-neg')+'">'+(d==null?'point de départ':sgn(d,1)+' <span class="bl-mut">depuis le '+dshort(first.date)+'</span>')+'</div></div>';
      }).join('')+'</div>'
      +'<button type="button" class="bl-btn bl-btn--ghost bl-btn--block" style="margin-top:22px;min-height:48px" onclick="BILAN.sheet(\'mensu\')">+ Mesurer</button>'
      +'<button type="button" class="bl-more" onclick="BILAN.toggle(\'mOpen\')">'+(S.mOpen?'Masquer les mesures ▴':'Historique des mesures ▾')+'</button>';
    if(S.mOpen){
      h+='<table class="bl-mtable"><thead><tr><th>Date</th><th>Bras</th><th>Poitr.</th><th>Taille</th><th>Cuisse</th><th><span class="bl-sr">Supprimer</span></th></tr></thead><tbody>'
        +L.slice().reverse().map(function(e){
          if(S.mconf===e.date) return '<tr><td colspan="6"><div class="bl-confirm" style="border:0"><span>Supprimer le '+dshort(e.date)+' ?</span><button type="button" class="bl-btn bl-btn--ghost bl-btn--sm" onclick="BILAN.mconf(null)">Annuler</button><button type="button" class="bl-btn bl-btn--danger bl-btn--sm" onclick="BILAN.delM(\''+e.date+'\')">Supprimer</button></div></td></tr>';
          return '<tr><td>'+dshort(e.date)+'</td>'+BODY_MEAS.map(function(M){ return '<td>'+(e.v[M.k]!=null?fr(e.v[M.k],1):'—')+'</td>'; }).join('')+'<td style="width:44px"><button type="button" class="bl-ib" onclick="BILAN.mconf(\''+e.date+'\')" aria-label="Supprimer la mesure du '+dshort(e.date)+'">🗑</button></td></tr>';
        }).join('')+'</tbody></table>';
    }
    return h+'</section>';
  }
  function renderScreen(){
    var ov=$('blScreen');
    if(!S.screen){ if(ov) ov.remove(); return; }
    var fresh=!ov;
    if(fresh){ ov=document.createElement('div'); ov.id='blScreen'; ov.className='bl-overlay'; document.body.appendChild(ov); }
    var sc=ov.scrollTop;
    ov.innerHTML='<div class="bl-page'+(fresh?' bl-screen-in':'')+'">'+(S.screen==='note'?noteHtml(S.noteWs):poidsHtml())+'</div>';
    ov.scrollTop=sc;
  }

  /* ══════════ DÉTAIL DE LA NOTE (« pourquoi j'ai X », notation v5 — 03/11) ══════════ */
  function noteHtml(ws){
    var B=bilanNoteWeek(ws), D=noteWeekDetail(B), tot=B.note, n=noteN(tot), cur=ws===rankMonday(today());
    var sun=rankAddDays(ws,6), mon=rankAddDays(ws,7), foot=(B.graved?'Gravée le '+(B.at?new Date(B.at).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'short'}):dlab(mon))+' · elle ne changera plus.':B.v===5?(Date.now()>=new Date(mon+'T05:00:00').getTime()?'Sera gravée dès ton prochain \u21bb (Yazio + pas).':'Sera gravée lundi '+dshort(mon)+' au matin, après ton \u21bb (Yazio + pas) fait après dimanche 20 h.'):'Gravée avec le barème de l\u2019époque.')+(B.scaled?' Note sur 19 ramenée à 20 : la course compte dès le 7 décembre.':'');
    var mt=D.malus.reduce(function(a,m){ return a+m.p; },0);
    var h=top('\uD83C\uDFC6 Ta note',(cur?'Cette semaine':'Semaine du '+dshort(ws))+(B.v===5?'':' · barème d\u2019époque'))
      +'<section class="bl-sec"><div class="bl-lbl">'+(cur?'En cours':'Semaine du '+dshort(ws)+' \u2192 '+dshort(sun))+'</div>'
      +'<div class="bl-score"><span class="bl-num bl-score__v"><span class="'+(n===5?'bl-gold-txt':'')+'" style="'+(n===5?'':'color:var(--bl-note-'+n+')')+'">'+fr(tot,1)+'</span>'+u('/20')+'</span><span style="font-size:12px;font-weight:800;color:var(--bl-note-'+n+')">'+NOTE_PAL[n]+'</span></div>'
      +'<div class="bl-scale" aria-hidden="true"><i style="background:var(--bl-note-1)"></i><i style="background:var(--bl-note-2)"></i><i style="background:var(--bl-note-3)"></i><i style="background:var(--bl-note-4)"></i><i style="background:var(--bl-note-5)"></i></div>'
      +'<div style="position:relative;height:0"><i style="position:absolute;left:'+Math.min(100,tot/20*100).toFixed(1)+'%;top:-14px;width:4px;height:20px;margin-left:-2px;border-radius:2px;background:var(--txt)"></i></div>'
      +'<div class="bl-scale__l"><span>0</span><span>8</span><span>12</span><span>14</span><span>18</span></div></section><hr class="bl-hr">'
      +'<section class="bl-sec" style="padding-top:6px">'+D.pil.map(function(P){
        return '<div class="bl-pil"><div class="bl-pil__h"><span class="bl-pil__n">'+P.i+' '+P.l+'</span><span class="bl-num" style="font-size:23px">'+fr(P.p,1)+u('/'+P.m)+'</span></div>'
          +'<div class="bl-trk bl-trk--lg" style="margin-top:10px"><i class="'+(P.p>=P.m?'is-done':'')+'" style="width:'+Math.min(100,P.p/P.m*100).toFixed(0)+'%"></i></div>'
          +P.c.map(function(c){ return '<div class="bl-crit"><span>'+c[0]+'</span><span class="bl-mut">'+c[1]+'</span><span class="bl-crit__p">'+fr(c[2],1)+'/'+c[3]+'</span></div>'; }).join('')+'</div>';
      }).join('')+'</section><hr class="bl-hr">'
      +'<section class="bl-sec"><div style="display:flex;align-items:baseline;justify-content:space-between"><span class="bl-pil__n">\uD83E\uDE78 Malus</span><span class="bl-num" style="font-size:20px;color:'+(mt?'var(--bl-note-1)':'var(--acc)')+'">'+(mt?'\u2212'+fr(mt,1):'0')+'</span></div>'
      +(D.malus.length?'<div class="bl-malus">'+D.malus.map(function(m){ return '<div class="bl-malus__r"><span class="bl-num" style="font-size:16px;color:var(--bl-note-1)">\u2212'+fr(m.p,1)+'</span><span>'+esc(m.l)+'</span></div>'; }).join('')+'</div>':'<div class="bl-pos" style="margin-top:10px;font-size:13px;font-weight:800">\u2713 Aucun malus'+(cur?' pour l\u2019instant':'')+'</div>')
      +'<div class="bl-meta" style="font-weight:700;margin-top:20px;white-space:normal">'+foot+'</div>'
      +(noteWeekClosed(ws)?'<button type="button" class="bl-btn bl-btn--ghost bl-btn--block" style="margin-top:18px" onclick="BILAN.back();wrOpen(\''+ws+'\',true)">\uD83D\uDCCA Revoir le bilan de la semaine</button>':'')
      +'</section>';
    return h;
  }

  /* ══════════ FEUILLES DU BAS ══════════ */
  var F={};
  function sheetHtml(){
    var ws=weights(), last=ws[ws.length-1];
    var head=function(t,lbl){ return '<div class="bl-sheet__grab"></div><div class="bl-sheet__h"><h2 class="bl-sheet__t">'+t+'</h2><button type="button" class="bl-ib bl-ib--fill" onclick="BILAN.close()" aria-label="Fermer">✕</button></div>'; };
    var dateField=function(){ return '<label class="bl-field" style="margin-top:18px"><span class="bl-sr">Date</span><input type="date" class="bl-field__in" value="'+F.date+'" max="'+today()+'" onchange="BILAN.set(\'date\',this.value)"><span aria-hidden="true">📅</span></label>'; };
    if(S.sheet==='pesee'){
      var dv=last?Math.round((F.kg-parseFloat(last.weight_kg))*10)/10:null;
      return head('⚖️ Nouvelle pesée')+dateField()
        +'<div class="bl-wrow"><button type="button" class="bl-step" onclick="BILAN.step(\'kg\',-0.1)" aria-label="Moins 0,1 kg">−</button><div class="bl-num" style="font-size:61px" aria-live="polite">'+fr(F.kg,1)+'<span class="bl-unit">kg</span></div><button type="button" class="bl-step" onclick="BILAN.step(\'kg\',0.1)" aria-label="Plus 0,1 kg">+</button></div>'
        +'<div style="text-align:center;font-size:14px;font-weight:800;margin-top:14px">'+(dv==null?'<span class="bl-mut">Première pesée</span>':'<span class="'+(dv>0?'bl-pos':dv<0?'bl-neg':'bl-mut')+'">'+(dv===0?'= 0,0':sgn(dv,1))+' kg</span> <span class="bl-mut">vs '+dlab(last.date)+'</span>')+'</div>'
        +'<button type="button" class="bl-btn bl-btn--primary bl-btn--block" style="margin-top:28px;min-height:56px;font-size:16px" onclick="BILAN.save()">Enregistrer ✓</button>';
    }
    if(S.sheet==='mensu'){
      return head('📏 Mensurations')+dateField()+'<div style="margin-top:8px">'+BODY_MEAS.map(function(M){
        var v=F.m[M.k], p=F.prev[M.k], dv=(v!=null&&p!=null)?Math.round((v-p)*10)/10:null;
        return '<div class="bl-mens"><div style="min-width:0"><div style="font-size:14px;font-weight:800">'+M.l+'</div><div class="bl-meta" style="font-size:11px;font-weight:700;margin-top:3px;white-space:normal;line-height:1.3">'+M.h+'</div></div>'
          +'<button type="button" class="bl-step" onclick="BILAN.step(\''+M.k+'\',-0.5)" aria-label="'+M.l+' moins 0,5 cm">−</button><div style="text-align:center"><div class="bl-num" style="font-size:25px">'+(v==null?'—':fr(v,1))+'</div>'
          +'<div style="font-size:10px;font-weight:800;margin-top:4px" class="'+(dv==null||dv===0||!M.up?'bl-mut':dv>0?'bl-pos':'bl-neg')+'">'+(p==null?'cm':dv===0||dv==null?'préc. '+fr(p,1):sgn(dv,1)+' cm')+'</div></div>'
          +'<button type="button" class="bl-step" onclick="BILAN.step(\''+M.k+'\',0.5)" aria-label="'+M.l+' plus 0,5 cm">+</button></div>';
      }).join('')+'</div><button type="button" class="bl-btn bl-btn--primary bl-btn--block" style="margin-top:26px;min-height:56px;font-size:16px" onclick="BILAN.save()">Enregistrer ✓</button>';
    }
    if(S.sheet==='news'){
      // Toutes les nouveautés pas encore vues sur cet appareil (la plus récente en premier)
      var seenId=newsSeen(), unseen=NEWS.filter(function(x){ return x.id>seenId; }), N={t:(unseen[0]||NEWS[0]).t,items:[].concat.apply([],(unseen.length?unseen:[NEWS[0]]).map(function(x){ return x.items; }))};
      return head('\u2728 Nouveautés')+'<div class="bl-meta" style="margin-top:2px">'+esc(N.t)+'</div>'
        +'<div class="bl-news">'+N.items.map(function(it){ return '<div><span aria-hidden="true">'+it[0]+'</span><p>'+esc(it[1])+'</p></div>'; }).join('')+'</div>'
        +'<button type="button" class="bl-btn bl-btn--primary bl-btn--block" style="margin-top:22px;min-height:54px;font-size:17px" onclick="BILAN.close()">C\u2019est noté \u2713</button>';
    }
    if(S.sheet==='nuit'){
      var d=((F.wake-F.bed)%1440+1440)%1440, inz=sleepZone(d), nk=F.night;
      var lbl=dlab(nk).replace(/\.$/,'')+' → '+dlab(addD(nk,1));
      var hh=function(m){ m=((m%1440)+1440)%1440; return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); };
      return '<div class="bl-sheet__grab"></div><div style="display:grid;grid-template-columns:44px minmax(0,1fr) 44px;align-items:center;gap:8px"><button type="button" class="bl-ib" onclick="BILAN.nightNav(-1)" aria-label="Nuit précédente">‹</button><div style="text-align:center;min-width:0"><h2 class="bl-sheet__t" style="font-size:20px">Ta nuit</h2><div class="bl-meta" style="margin-top:2px">'+lbl+'</div></div><button type="button" class="bl-ib bl-ib--fill" onclick="BILAN.close()" aria-label="Fermer">✕</button></div>'
        +'<div style="text-align:center;margin-top:26px"><div class="bl-num bl-hero-txt" style="font-size:65px" aria-live="polite">'+hm(d)+'</div><div style="margin-top:12px"><span class="bl-pill '+(inz?'':'bl-pill--line bl-neg')+'">'+(inz?'✓ dans la zone 7-9 h':d<420?'sous 7 h':'au-dessus de 9 h')+'</span></div></div>'
        +'<div class="bl-time">'+[['bed','🛏️ Couché'],['wake','☀️ Levé']].map(function(x){
          return '<div class="bl-time__c"><div class="bl-lbl">'+x[1]+'</div><label class="bl-time__v"><span class="bl-sr">'+x[1]+'</span><input type="time" value="'+hh(F[x[0]])+'" onchange="BILAN.time(\''+x[0]+'\',this.value)">'+hh(F[x[0]])+'</label>'
            +'<div class="bl-time__s"><button type="button" class="bl-step" style="width:48px;height:48px" onclick="BILAN.step(\''+x[0]+'\',-5)" aria-label="5 minutes plus tôt">−</button><button type="button" class="bl-step" style="width:48px;height:48px" onclick="BILAN.step(\''+x[0]+'\',5)" aria-label="5 minutes plus tard">+</button></div></div>';
        }).join('')+'</div><button type="button" class="bl-btn bl-btn--primary bl-btn--block" style="margin-top:26px;min-height:56px;font-size:16px" onclick="BILAN.save()">Enregistrer ✓</button>';
    }
    return '';
  }
  function renderSheet(){
    var L=$('blSheet');
    if(!S.sheet){ if(L) L.remove(); document.removeEventListener('keydown',onKey); return; }
    var fresh=!L;
    if(fresh){ L=document.createElement('div'); L.id='blSheet'; L.className='bl-layer'; document.body.appendChild(L); document.addEventListener('keydown',onKey); }
    var lbl={pesee:'Nouvelle pesée',mensu:'Mensurations',nuit:'Saisie de la nuit',news:'Nouveautés'}[S.sheet];
    L.innerHTML='<div class="bl-scrim'+(fresh?'':' is-still')+'" onclick="BILAN.close()"></div><div class="bl-sheet bl-page-font'+(fresh?'':' is-still')+'" role="dialog" aria-modal="true" aria-label="'+lbl+'">'+sheetHtml()+'</div>';
  }
  function onKey(e){ if(e.key==='Escape') close(); }
  function minOf(t){ return /^\d{2}:\d{2}$/.test(t||'')?Number(t.slice(0,2))*60+Number(t.slice(3)):null; }
  function loadNight(k){
    var e=(DB.sleepLog||{})[k]||{}, b=minOf(e.bed), w=minOf(e.wake);
    var p=null; for(var i=1;i<=14&&!p;i++){ var q=(DB.sleepLog||{})[addD(k,-i)]; if(q&&minOf(q.bed)!=null&&minOf(q.wake)!=null) p=q; }
    F={night:k,bed:b!=null?b:(p?minOf(p.bed):23*60),wake:w!=null?w:(p?minOf(p.wake):7*60+15)};
  }
  function openSheet(kind){
    var ws=weights(), last=ws[ws.length-1];
    if(kind==='pesee') F={date:today(),kg:last?Math.round((parseFloat(last.weight_kg)+0.1)*10)/10:70};
    else if(kind==='mensu'){ var L=bodyMeasList(), lv=L.length?L[L.length-1].v:{}; F={date:today(),m:{},prev:{}}; BODY_MEAS.forEach(function(M){ F.prev[M.k]=lv[M.k]!=null?lv[M.k]:null; F.m[M.k]=lv[M.k]!=null?lv[M.k]:null; }); }
    else if(kind==='nuit') loadNight(SLEEP._night());
    else if(kind!=='news') return;
    S.sheet=kind; renderSheet();
  }
  function close(){ if(S.sheet==='news'){ markNews(); setTimeout(autoNight,400); } S.sheet=null; renderSheet(); }
  function step(k,d){
    if(S.sheet==='pesee') F.kg=Math.max(30,Math.min(200,Math.round((F.kg+d)*10)/10));
    else if(S.sheet==='mensu'){ var v=F.m[k]!=null?F.m[k]:(F.prev[k]!=null?F.prev[k]:{bras:35,poitrine:95,taille:80,cuisse:55}[k]); F.m[k]=Math.max(10,Math.min(200,Math.round((v+d)*10)/10)); }
    else if(S.sheet==='nuit') F[k]=((F[k]+d)%1440+1440)%1440;
    renderSheet();
  }
  function save(){
    if(S.sheet==='pesee'){
      if(!F.date){ showToast('Choisis une date.'); return; }
      if(!(F.kg>=30&&F.kg<=200)){ showToast('Poids invalide (30-200 kg).'); return; }
      if(!DB.bodyWeight) DB.bodyWeight=[];
      var idx=DB.bodyWeight.findIndex(function(b){ return b.date===F.date; });
      if(idx>=0) DB.bodyWeight[idx].weight_kg=F.kg; else DB.bodyWeight.push({date:F.date,weight_kg:F.kg,note:''});
      DB.bodyWeight.sort(function(a,b){ return a.date.localeCompare(b.date); });
      saveDB(); showToast('✓ Pesée enregistrée');
    } else if(S.sheet==='mensu'){
      if(!F.date){ showToast('Choisis une date.'); return; }
      var e={}, n=0; BODY_MEAS.forEach(function(M){ if(F.m[M.k]!=null){ e[M.k]=F.m[M.k]; n++; } });
      if(!n){ showToast('Entre au moins une mesure.'); return; }
      if(!DB.bodyMeas) DB.bodyMeas={};
      e.at=Date.now(); DB.bodyMeas[F.date]=e;
      saveDB(); showToast('✓ Mensurations enregistrées');
    } else if(S.sheet==='nuit'){
      var hh=function(m){ return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); };
      if(!SLEEP._save(F.night,hh(F.bed),hh(F.wake))) return;
      showToast('✓ Nuit enregistrée');
    }
    S.sheet=null; renderSheet(); renderSante();
  }
  function newsSeen(){ try{ return localStorage.getItem('massup_news')||''; }catch(e){ return '9999'; } }
  function autoNews(){
    if(!NEWS.length||S.sheet||S.screen||S.newsShown) return false;
    var v=document.getElementById('view-sante'); if(!v||!v.classList.contains('active')) return false;
    if(NEWS[0].id<=newsSeen()) return false;
    S.newsShown=1; setTimeout(function(){ if(!S.sheet&&!S.screen) openSheet('news'); },300);
    return true;
  }
  function markNews(){ try{ localStorage.setItem('massup_news',NEWS[0].id); }catch(e){} }
  // Comme avant (01/11) : la saisie de la nuit s'ouvre d'office, une fois par jour, si la nuit n'est pas notée
  function autoNight(){
    if(typeof SLEEP==='undefined'||S.sheet||S.screen) return;
    var v=document.getElementById('view-sante'); if(!v||!v.classList.contains('active')) return;
    if(new Date().getHours()<5) return;
    var k=SLEEP._night(), e=(DB.sleepLog||{})[k]||{};
    if(SLEEP._duration(e.bed,e.wake)!=null) return;
    var key='massup_nightAsk', t=today();
    try{ if(localStorage.getItem(key)===t) return; localStorage.setItem(key,t); }catch(err){ return; }
    setTimeout(function(){ if(!S.sheet&&!S.screen) openSheet('nuit'); },350);
  }

  /* ── Actions ── */
  function pick(ev,btn){
    var c=btn.getAttribute('data-c'), r=btn.getBoundingClientRect(), x=(ev.clientX-r.left)/r.width;
    var md=c==='psel'?weightModel(S.per,320,220):weightModel('all',350,150); if(!md) return;
    var best=0,bd=1e9; md.pts.forEach(function(p,i){ var d=Math.abs(p.x/md.w-x); if(d<bd){ bd=d; best=i; } });
    S[c]=S[c]===best?null:best;
    if(c==='psel') renderScreen(); else render();
  }
  function unpick(c){ S[c]=null; if(c==='psel') renderScreen(); else render(); }
  document.addEventListener('click',function(e){
    if(S.sel!=null&&!e.target.closest('.bl-chart')&&!e.target.closest('.bl-read')&&e.target.closest('#bilanPage')){ S.sel=null; render(); }
    else if(S.psel!=null&&!e.target.closest('.bl-chart')&&!e.target.closest('.bl-read')&&e.target.closest('#blScreen')){ S.psel=null; renderScreen(); }
  });
  function inc(k){ S.pop=k; nutTapWeek(k); }
  function toggle(k){
    S[k]=!S[k];
    if(k==='mel'&&S.mel){ try{ PV.pull(false); }catch(e){} }
    if(k==='pall'||k==='mOpen') renderScreen(); else render();
  }

  return {
    render:render,
    photoDone:function(){ try{ localStorage.setItem('massup_photo_'+today().slice(0,7),'1'); }catch(e){} render(); },
    refresh:function(){ try{ INTAKE.refresh(); }catch(e){ try{ STEPS.refresh(); }catch(e2){} } try{ PV.pull(true); }catch(e){} },
    go:function(s){ S.screen=s; S.psel=null; renderScreen(); document.body.style.overflow='hidden'; },
    note:function(ws){ S.screen='note'; S.noteWs=ws; var ov=$('blScreen'); if(ov) ov.remove(); renderScreen(); document.body.style.overflow='hidden'; },
    back:function(){ S.screen=null; S.conf=null; S.mconf=null; renderScreen(); document.body.style.overflow=''; },
    sheet:openSheet, close:close, step:step, save:save,
    set:function(k,v){ F[k]=v; renderSheet(); },
    time:function(k,v){ var m=minOf(v); if(m!=null){ F[k]=m; renderSheet(); } },
    nightNav:function(d){ var k=addD(F.night,d); if(k>SLEEP._night()) return; loadNight(k); renderSheet(); },
    tab:function(v){ S.tab=v; render(); },
    per:function(v){ S.per=v; S.psel=null; renderScreen(); },
    pick:pick, unpick:unpick, inc:inc, toggle:toggle,
    conf:function(d){ S.conf=d; renderScreen(); },
    delW:function(d){ S.conf=null; deleteBodyWeightEntry(d); showToast('Pesée supprimée'); },
    mconf:function(d){ S.mconf=d; renderScreen(); },
    delM:function(d){ S.mconf=null; if(!DB.bodyMeas) DB.bodyMeas={}; DB.bodyMeas[d]={del:1,at:Date.now()}; saveDB(); renderSante(); showToast('Mesure supprimée'); },
    noteN:noteN, notePal:function(v){ return NOTE_PAL[noteN(v)]; }, SAISONS:SAISONS,
    _state:S
  };
})();
