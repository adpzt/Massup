"use strict";
/* ═══ NUTRITION — mode prise de masse d'Adrien (23/08/2026) ═══
   Jumeau du NUTRITI·ON de Melati, inversé pour la MASSE : le risque c'est de ne PAS manger assez,
   le levier n°1 ce sont les GLUCIDES, les lipides sont plafonnés (100 g/j · 35 g/plat).
   Source de vérité : adrien/nutrition/00-PROFIL-NUTRITION-ADRIEN.md. Zéro IA, tout déterministe.
   Dépend de app.js (DB, saveDB, showToast, todayStr) et nutria_data.js (NUTA). */
var NUTRIA=(function(){
  var C=NUTA.CIBLES, R=NUTA.R, PDJ=NUTA.PDJ, SHAKER=NUTA.SHAKER, SNACKS=NUTA.SNACKS;
  var $=function(id){ return document.getElementById(id); };
  var inited=false, fam='plats', q='', filtres=new Set();

  function ensure(){ if(!DB.nutriA) DB.nutriA={day:{},favs:[]}; if(!DB.nutriA.day) DB.nutriA.day={}; if(!DB.nutriA.favs) DB.nutriA.favs=[]; return DB.nutriA; }
  function J(){ var t=todayStr(), a=ensure(); if(!a.day[t]) a.day[t]={pdj:false,dej:null,din:null,snacks:[],resto:[],shaker:false}; return a.day[t]; }
  function rById(id){ for(var i=0;i<R.length;i++) if(R[i].id===id) return R[i]; return null; }
  function isFav(r){ return ensure().favs.indexOf(r.id)>=0; }
  function toggleFav(r){ var f=ensure().favs,i=f.indexOf(r.id); if(i>=0)f.splice(i,1); else f.push(r.id); saveDB(); }
  function esc(s){ return String(s); }
  // Plat perso avec photo (29/09) : la photo remplace l'emoji dans toutes les vignettes
  function thumbIn(r){ return r.photo?'<img src="'+r.photo+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block">':r.emoji; }

  /* ───────── PROFIL ───────── */
  function renderProfil(){
    var h='';
    h+='<div class="card hero">'
      +'<p class="eyebrow">Les calories · prise de masse</p>'
      +'<div class="na-kbig"><b class="num">'+C.kcal+'</b><span>kcal / jour</span></div>'
      +'<div class="na-sub">~0,7 à 1 kg/mois jusqu’au 1er janvier — pas de sèche avant. Une journée haute isolée n’est rien : c’est la <b>moyenne de la semaine</b> qui compte. Ton vrai risque : <b>ne pas manger assez</b>.</div>'
      +'<div class="tg">'
      +'<div class="t a"><b class="num">'+C.gMin+' g</b><small>glucides · priorité n°1</small></div>'
      +'<div class="t d"><b class="num">'+C.lMax+' g max</b><small>lipides · à surveiller</small></div>'
      +'<div class="t b"><b class="num">'+C.pMin+' g</b><small>protéines · non-sujet</small></div>'
      +'<div class="t c"><b class="num">'+C.platKMin+'–'+C.platKMax+'</b><small>kcal / plat · ≤'+C.platLMax+' g lip.</small></div>'
      +'</div></div>';
    h+='<div class="card" style="margin-top:14px"><p class="eyebrow">'+PDJ.emoji+' Le petit-déj — non négociable</p>'
      +PDJ.items.map(function(i){return '<div class="li">'+i+'</div>';}).join('')
      +'<div class="li dim">Option : '+PDJ.beurre.n+' → +'+PDJ.beurre.k+' kcal · +'+PDJ.beurre.l+' g lip. (à cocher dans la Journée)</div>'
      +'<div class="macros"><div class="m t c"><b>'+PDJ.kcal+'</b><small>kcal</small></div><div class="m t a"><b>'+PDJ.g+'</b><small>gluc.</small></div><div class="m t b"><b>'+PDJ.p+'</b><small>prot.</small></div><div class="m t d"><b>'+PDJ.l+'</b><small>lip.</small></div></div></div>';
    h+='<div class="card" style="margin-top:14px"><p class="eyebrow">'+SHAKER.emoji+' Le shaker — filet de sécurité, PAS un rituel</p>'
      +SHAKER.items.map(function(i){return '<div class="li">'+i+'</div>';}).join('')
      +'<div class="macros"><div class="m t c"><b>'+SHAKER.kcal+'</b><small>kcal</small></div><div class="m t a"><b>'+SHAKER.g+'</b><small>gluc.</small></div><div class="m t b"><b>'+SHAKER.p+'</b><small>prot.</small></div><div class="m t d"><b>'+SHAKER.l+'</b><small>lip.</small></div></div>'
      +'<p class="hint" style="margin-top:8px">Il sort quand un repas a sauté, a été léger, ou retour tard de la salle. <b>2/semaine, ne pas changer.</b> La Journée te le suggère d’elle-même quand il manque des calories en fin de compte.</p></div>';
    h+='<div class="card" style="margin-top:14px"><p class="eyebrow">Bon à savoir</p>'
      +'<div class="acc"><h4>💊 Créatine — 5 g TOUS les jours</h4><p>Dans une compote, jours de repos inclus. Elle marche par saturation (3–4 semaines) — la prendre 2×/semaine dans le shaker ne servait quasiment à rien (erreur corrigée le 16/08). L’heure n’a aucune importance.</p></div>'
      +'<div class="acc"><h4>🥚 Œufs brouillés vs au plat</h4><p>La cuisson ne change rien : 1 œuf = 5 g de lipides, point. Si Yazio affiche plus pour des « œufs brouillés », c’est que l’entrée inclut beurre et lait. Utilise l’entrée « œuf » brute.</p></div>'
      +'<div class="acc"><h4>🍎 Compotes : jamais « sans sucres ajoutés »</h4><p>La classique fait 90 kcal et 20 g de glucides ; la « sans sucres » 55 kcal et 12 g — tu perds 40 % de l’intérêt. Format gourde : bue en 10 secondes debout.</p></div>'
      +'<div class="acc"><h4>🍝 Les pâtes sont une source de protéines</h4><p>300 g de pâtes sèches = 39 g de protéines, autant que 170 g de poulet. Tes féculents t’apportent 30–40 g par jour — c’est systématiquement sous-estimé.</p></div>'
      +'<div class="acc"><h4>😴 Le sommeil — levier n°1</h4><p>Tu dors 5–6 h. La synthèse protéique se fait pendant le sommeil : 3200 kcal parfaites + 5 h de sommeil = tu construis moins. Objectif 7–8 h — devant l’alimentation.</p></div>'
      +'<div class="acc"><h4>📱 Yazio — les 3 règles qui sauvent</h4><p>① Scan code-barres plutôt qu’entrée générique · ② féculents pesés CRUS · ③ vérifier les condiments (45 g de miel loggés au lieu de 7 = +116 kcal). Ton problème n’a jamais été de mal manger — c’est de ne pas savoir ce que tu manges : 630 kcal d’écart constatés sur UN repas.</p></div>'
      +'</div>';
    $('na-p-profil').innerHTML=h;
  }

  /* ───────── RECETTES ───────── */
  /* Recherche insensible aux accents — « pates » matche « Pâtes », et la base du plat
     compte comme texte cherchable : taper « riz » liste tous les plats au riz (24/08). */
  function norm(s){ return String(s).toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
  /* ── Recherche v2 (29/08, retour Adrien « riz poulet → 0 recette ») : TOUS les mots doivent matcher,
     cherchés dans le nom, la base ET chaque ingrédient (accents/œ ignorés). Un mot qui n'existe que par
     VARIANTE (« poulet » sur un plat au porc, « riz » sur un plat de pâtes) matche aussi : la carte
     propose alors directement la version poulet / riz. */
  var have=new Set(), haveOpen=false; // 🧺 ce que j'ai sous la main (session)
  var VP_LBL={poulet:'poulet',porc:'porc',steak:'steak haché',boeuf:'bœuf (bavette)'};
  function tokens(str){ return norm(str).split(/[\s,+·]+/).filter(function(t){ return t.length>=2; }); }
  function hayOf(r){
    if(r._hay) return r._hay;
    var p=[r.n, r.base==='riz'?'riz':(r.base==='pates'?'pates pâtes':'')].concat(r.ing||[]);
    if(r.froid) p.push('froid salade');
    r._hay=norm(p.join(' | ')); r._hayN=norm(r.n); return r._hay;
  }
  function varHay(r){ // [{k,type,txt}] — ce que le plat peut devenir
    if(r._vh) return r._vh;
    var out=[], pi=protInfo(r), fi=fecInfo(r);
    if(pi) Object.keys(PROTV).forEach(function(k){ if(k!==pi.type) out.push({k:k,type:'p',txt:norm(PROTV[k][0]+' '+VP_LBL[k]+' '+(k==='steak'||k==='boeuf'?'viande boeuf':k==='poulet'?'volaille':''))}); });
    if(fi) ['riz','pates'].forEach(function(k){ if(k!==fi.type) out.push({k:k,type:'f',txt:norm(k==='riz'?'riz thai':'pates pâtes pasta')}); });
    r._vh=out; return out;
  }
  function matchQ(r,toks){
    var hay=hayOf(r), score=0, v={};
    for(var i=0;i<toks.length;i++){
      var t=toks[i];
      if(r._hayN.indexOf(t)>=0){ score+=3; continue; }
      if(hay.indexOf(t)>=0){ score+=2; continue; }
      var vh=varHay(r), hit=null;
      for(var j=0;j<vh.length;j++){ if(vh[j].txt.indexOf(t)>=0){ hit=vh[j]; break; } }
      if(!hit) return null;
      if(v[hit.type]&&v[hit.type]!==hit.k) return null;
      v[hit.type]=hit.k; score+=1;
    }
    return {score:score,v:v};
  }
  /* ── 🧺 « Ce que j'ai sous la main » : Adrien coche frigo/placard → plats faisables (ingrédients
     principaux tous couverts, variante viande/féculent autorisée), puis ceux à UN ingrédient près.
     Détection par mots-clés sur les lignes d'ingrédients HORS sauce/assaisonnement (isSauceIng). */
  var PANTRY=[
   ['Protéines',[['poulet','Poulet',/poulet/],['porc','Porc',/porc/],['boeuf','Bœuf · steak',/steak|b(œ|oe)uf|bavette|faux-filet|veau/],['thon','Thon',/thon/],['saumon','Saumon',/saumon/],['poisson','Poisson blanc',/cabillaud|croustibat|colin|poisson/],['crevettes','Crevettes',/crevette/],['oeuf','Œufs',/\b(œ|oe)ufs?\b/],['sardines','Sardines · maquereau',/sardine|maquereau/],['lentilles','Lentilles',/lentille/]]],
   ['Féculents',[['riz','Riz',/\briz\b/],['pates','Pâtes',/p(â|a)tes|penne|capellini|spaghetti|tagliatelle|nouilles/],['pdt','Pommes de terre · gnocchis',/pommes? de terre|\bpdt\b|gnocchi/],['pain','Pain · tortillas',/\bpain\b|tortilla|wrap/]]],
   ['Légumes',[['champignons','Champignons',/champignon/],['haricots','Haricots verts',/haricots? verts?/],['carotte','Carotte',/carotte/],['poivron','Poivron',/poivron/],['brocoli','Brocoli',/brocoli/],['courgette','Courgette',/courgette/],['epinards','Épinards',/(é|e)pinard/],['tomate','Tomates',/tomate/],['salade','Salade · concombre',/salade|laitue|concombre|roquette/],['avocat','Avocat',/avocat/],['pois','Petits pois · maïs',/petits pois|ma(ï|i)s/]]]
  ];
  var PLABEL={}; PANTRY.forEach(function(g){ g[1].forEach(function(it){ PLABEL[it[0]]=it[1]; }); });
  function needs(r){
    if(r._needs) return r._needs;
    var out=[];
    (r.ing||[]).forEach(function(line){
      if(isSauceIng(line)) return; var t=norm(line); if(/^pas de/.test(t)) return;
      PANTRY.forEach(function(g){ g[1].forEach(function(it){ if(it[2].test(t)&&out.indexOf(it[0])<0) out.push(it[0]); }); });
    });
    r._needs=out; return out;
  }
  var PGROUP={poulet:'poulet',porc:'porc',steak:'boeuf',boeuf:'boeuf'};
  function pantryFit(r){
    var nd=needs(r), miss=[], v={}, used=0, pi=protInfo(r), fi=fecInfo(r);
    nd.forEach(function(id){
      if(have.has(id)){ used++; return; }
      if(pi&&PGROUP[pi.type]===id){ var alt=null; Object.keys(PROTV).forEach(function(k){ if(!alt&&k!==pi.type&&have.has(PGROUP[k])) alt=k; }); if(alt){ v.p=alt; used++; return; } }
      if(fi&&fi.type===id){ var o=id==='riz'?'pates':'riz'; if(have.has(o)){ v.f=o; used++; return; } }
      miss.push(PLABEL[id]);
    });
    return {miss:miss,v:v,used:used};
  }
  function filtre(){
    var toks=q?tokens(q):[], pantry=have.size>0, rs=[];
    R.forEach(function(r){
      if(filtres.has('favs')&&!isFav(r)) return;
      if(filtres.has('express')&&r.t>20) return;
      if(filtres.has('prot')&&!(r.p!=null&&r.p>=70)) return;
      var o={r:r,v:{},miss:[],score:0,used:0};
      if(toks.length){ var m=matchQ(r,toks); if(!m) return; o.score=m.score; o.v=m.v; }
      if(pantry){
        if(r.batch) return;
        var pf=pantryFit(r); if(!pf.used||pf.miss.length>1) return;
        o.miss=pf.miss; o.used=pf.used; if(pf.v.p&&!o.v.p) o.v.p=pf.v.p; if(pf.v.f&&!o.v.f) o.v.f=pf.v.f;
      }
      rs.push(o);
    });
    if(pantry) rs.sort(function(a,b){ return a.miss.length-b.miss.length || b.used-a.used || b.score-a.score; });
    else if(toks.length) rs.sort(function(a,b){ return b.score-a.score; });
    return rs;
  }
  function vTag(v){ var p=[]; if(v.p) p.push(VP_LBL[v.p]||v.p); if(v.f) p.push(v.f==='riz'?'riz':'pâtes'); return p.length?'<span class="tag v">🔁 version '+p.join(' · ')+'</span>':''; }
  function renderPantry(){
    var btn=$('na-have'), box=$('na-pantry'); if(!btn||!box) return;
    box.style.display=haveOpen?'':'none';
    btn.className='pantry-btn'+(have.size?' on':'')+(haveOpen?' open':'');
    btn.innerHTML=(have.size?'🧺 '+have.size+' ingrédient'+(have.size>1?'s':'')+' sous la main':'🧺 Ce que j’ai sous la main')+'<span class="pb-arr">'+(haveOpen?'▴':'▾')+'</span>';
    if(!haveOpen) return;
    box.innerHTML='<p class="hint" style="margin-bottom:6px">Coche ce que tu as : je liste les plats faisables (variante viande / riz⇄pâtes autorisée), puis ceux à un ingrédient près.</p>'
      +PANTRY.map(function(g){ return '<div class="cgrp"><h4>'+g[0]+'</h4><div class="pick">'+g[1].map(function(it){ return '<button data-h="'+it[0]+'" class="'+(have.has(it[0])?'on':'')+'">'+it[1]+'</button>'; }).join('')+'</div></div>'; }).join('')
      +(have.size?'<button class="pclear" data-hclear="1" type="button">Tout décocher</button>':'');
  }
  function renderListe(){
    var rs=filtre(), pantry=have.size>0, cnt;
    if(pantry){ var ok=rs.filter(function(o){return !o.miss.length;}).length, near=rs.length-ok;
      cnt=(ok?ok+' plat'+(ok>1?'s':'')+' possible'+(ok>1?'s':''):'Aucun plat complet')+(near?' · '+near+' à 1 ingrédient près':''); }
    else cnt=rs.length+(rs.length>1?' recettes':' recette');
    $('na-count').textContent=cnt;
    renderPantry();
    var sep=false;
    $('na-list').innerHTML=rs.length? rs.map(function(o,ix){
      var r=o.r, h='';
      if(pantry&&o.miss.length&&!sep){ sep=true; h+='<p class="eyebrow" style="margin:14px 0 6px">À un ingrédient près</p>'; }
      var vv=(o.v.p||o.v.f)?applyVar(r,o.v.f||null,o.v.p||null):null;
      var base=o.v.f||r.base;
      return h+'<button class="rc" data-id="'+r.id+'"'+(o.v.p?' data-vp="'+o.v.p+'"':'')+(o.v.f?' data-vf="'+o.v.f+'"':'')+' style="animation-delay:'+Math.min(ix,12)*40+'ms">'
        +'<span class="thumb '+(base==='pates'?'tp':'tr')+'">'+thumbIn(r)+'</span>'
        +'<span class="rb">'
        +'<span class="rtop"><h3>'+r.n+(r.star?' ⭐':'')+(isFav(r)?' <i class="hrt">♥</i>':'')+'</h3></span>'
        +'<span class="meta">'
        +'<span class="tag n">'+(r.batch?'batch ~'+r.batch:(r.plats===2?'2 plats':'1 plat'))+'</span>'
        +(r.t<=20?'<span class="tag e">Express</span>':'<span class="tag">'+r.t+' min</span>')
        +(base?'<span class="tag '+(base==='riz'?'r':'p')+'">'+(base==='riz'?'Riz':'Pâtes')+'</span>':'')
        +(r.froid?'<span class="tag">🧊 Froid</span>':'')
        +(r.cremeux?'<span class="tag w">Crémeux 1-2×/sem</span>':'')
        +(r.inc?'<span class="tag inc">À compléter</span>':'')
        +vTag(o.v)
        +(!o.v.p&&!o.v.f&&(protInfo(r)||fecInfo(r))?'<span class="tag v">🔁</span>':'')
        +(o.miss.length?'<span class="tag miss">il manque : '+o.miss.join(', ')+'</span>':'')
        +'</span>'
        +(r.kcal?'<span class="kc"><b>'+(vv&&vv.changed?'≈'+vv.k:r.kcal)+' kcal'+(r.batch?' / pancake':'')+'</b> · <b class="kg">'+(vv&&vv.changed?vv.g:(r.g||'?'))+' g gluc.</b> · '+(vv&&vv.changed?vv.p:r.p)+' g prot. · '+(vv&&vv.changed?vv.l:r.l)+' g lip.</span>'
                :'<span class="kc" style="opacity:.6">macros à compléter ensemble</span>')
        +'</span></button>';
    }).join('') : '<p class="empty"><span class="big">🍳</span>'+(pantry?'Rien de complet avec ça pour l’instant.<br>Coche un féculent ou une protéine en plus.':'Aucune recette ne correspond.<br>Retire un filtre ou change ta recherche.')+'</p>';
  }
  var cur=null, portA=2, portM=0, varFec=null, varProt=null;
  var MELATI_F=0.55; // une portion Melati ≈ 55 % d'une portion Adrien (~550 kcal, protéinée)
  /* ── Variantes (24/08) : son usage réel = même plat, autre féculent ou autre viande ── */
  var PROTV={poulet:['filet de poulet',110,23,2],porc:['émincé de porc',175,21,6],steak:['steaks hachés 10 %',182,20,10],boeuf:['bavette / bœuf à sauter',150,22,7]};
  function fecInfo(r){
    if(r.noswapf||r.batch) return null;
    for(var i=0;i<r.ing.length;i++){
      var m=r.ing[i].match(/^(\d+)\s*g\s+(riz thaï sec|pâtes sèches|capellini secs)/);
      if(m) return {ix:i,g:+m[1],type:m[2]==='riz thaï sec'?'riz':'pates'};
    }
    return null;
  }
  function protInfo(r){
    if(r.batch) return null;
    for(var i=0;i<r.ing.length;i++){
      var s=r.ing[i];
      var m=s.match(/^(\d+)\s*g\s+(?:filet de poulet|émincé de porc)/);
      if(m) return {ix:i,g:+m[1],type:s.indexOf('poulet')>=0?'poulet':'porc'};
      var m2=s.match(/^(\d+)\s*steaks? hachés/);
      if(m2) return {ix:i,g:(+m2[1])*125,type:'steak'};
      var m3=s.match(/^(\d+)\s*g\s+(?:bavette|bœuf|boeuf)\b/i);
      if(m3) return {ix:i,g:+m3[1],type:'boeuf'};
    }
    return null;
  }
  function applyVar(r,vf,vp){
    var ing=r.ing.slice(), k=r.kcal,p=r.p,g=r.g,l=r.l, changed=false;
    var fi=fecInfo(r), pi=protInfo(r);
    if(fi&&vf&&vf!==fi.type){
      var o=NUTA.CF.fec[fi.type], nn=NUTA.CF.fec[vf];
      k+=(nn[1]-o[1])*fi.g/100; p+=(nn[2]-o[2])*fi.g/100; l+=(nn[3]-o[3])*fi.g/100; g+=(nn[4]-o[4])*fi.g/100;
      ing[fi.ix]=fi.g+' g '+(vf==='riz'?'riz thaï sec':'pâtes sèches');
      changed=true;
    }
    if(pi&&vp&&vp!==pi.type){
      var op=PROTV[pi.type], np=PROTV[vp];
      var gN=vp==='steak'?Math.max(1,Math.round(pi.g/125))*125:pi.g;
      k+=np[1]*gN/100-op[1]*pi.g/100; p+=np[2]*gN/100-op[2]*pi.g/100; l+=np[3]*gN/100-op[3]*pi.g/100;
      ing[pi.ix]=vp==='steak'?(gN/125)+' steaks hachés 10 %':gN+' g '+(vp==='poulet'?'filet de poulet':vp==='boeuf'?'bavette (ou bœuf à sauter) en lanières':'émincé de porc');
      changed=true;
    }
    return {ing:ing,k:Math.round(k/5)*5,p:Math.round(p),g:Math.round(g),l:Math.round(l),changed:changed,fi:fi,pi:pi};
  }
  /* Fiche (24/08 soir) : la sauce / l'assaisonnement est séparée des aliments principaux.
     Heuristique sur le texte de l'ingrédient — les faux positifs connus sont exclus. */
  function isSauceIng(s){
    var t=norm(s);
    if(/^pas de/.test(t)) return false;
    if(/crue|cerises|salade|concombre|avocat|banane|compote|tranche|tortilla|pour la semoule/.test(t)) return false;
    return /sauce|soja|miel|sriracha|ail|paprika|moutarde|creme legere|creme epaisse|creme$|gochujang|huitres|aigre-douce|curry|curcuma|herbes|basilic|coco|bouillon|vinaigre|sesame|sucre|sel|poivre|concentre|tandoori|maizena|assaisonnement|cumin|skyr|olive|\beau\b/.test(t);
  }
  function lvlBadge(l){
    if(l==='rc') return '<span class="lvl rc">🍚</span>';
    if(l===0) return '<span class="lvl z">—</span>';
    return '<span class="lvl n'+l+'">N'+l+'</span>';
  }
  function fmtQ(x){
    var i=Math.floor(x+1e-9), fr=x-i, f='';
    if(fr>=0.875) i++;
    else if(fr>=0.625) f='¾';
    else if(fr>=0.375) f='½';
    else if(fr>=0.125) f='¼';
    return i>0? (f? i+' '+f : ''+i) : (f||'0');
  }
  function scaleIng(s,f){
    if(Math.abs(f-1)<1e-9) return s;
    var m=s.match(/^(\d+(?:[.,]\d+)?|½|¼|¾)\s*/); if(!m) return s;
    var raw=m[1], v=raw==='½'?0.5:(raw==='¼'?0.25:(raw==='¾'?0.75:parseFloat(raw.replace(',','.'))));
    var rest=s.slice(m[0].length), sc=v*f, out;
    if(/^(g|ml)\b/.test(rest)) out=String(Math.max(5,Math.round(sc/5)*5));
    else if(/^(œuf|oeuf|steak|boîte|tranche|gousse|oignon|carotte|compote|Croustibat|banane|cube)/i.test(rest)) out=fmtQ(Math.max(0.5,Math.round(sc*2)/2));
    else out=fmtQ(Math.max(0.25,Math.round(sc*4)/4)); // càs / càc / unités de sauce
    return out+' '+rest;
  }
  function ouvrir(id,keep,v){
    var r=rById(id); if(!r) return; cur=r;
    if(!keep){ portA=2; portM=0; varFec=(v&&v.f)||null; varProt=(v&&v.p)||null; }
    var v=applyVar(r,varFec,varProt);
    var h='<div class="hero">'
      +'<button class="fav'+(isFav(r)?' on':'')+'" id="na-fav" aria-label="Favori">♥</button>'
      +'<button class="x" id="na-x" aria-label="Fermer">✕</button>'
      +'<div class="disc '+(r.base==='pates'?'tp':'tr')+'">'+thumbIn(r)+'</div></div>'
      +'<div class="sh"><h2>'+r.n+(r.star?' ⭐':'')+'</h2>'
      +'<div class="meta" style="justify-content:center;margin-top:10px">'
      +'<span class="tag n">'+(r.batch?'BATCH · ~'+r.batch+' PANCAKES':(r.plats===2?'POUR 2 PLATS':'POUR 1 PLAT'))+'</span>'
      +'<span class="tag">'+r.t+' min</span>'
      +(r.base?'<span class="tag '+(r.base==='riz'?'r':'p')+'">'+(r.base==='riz'?'Riz':'Pâtes')+'</span>':'')
      +(r.froid?'<span class="tag">🧊 Froid</span>':'')
      +(r.cremeux?'<span class="tag w">Crémeux</span>':'')
      +'</div>';
    if(r.kcal){
      h+='<div class="macros" style="margin-top:14px">'
        +'<div class="m t c"><b>'+(v.changed?'≈'+v.k:r.kcal)+'</b><small>kcal'+(r.batch?' / pancake':(r.plats===2?' / plat':''))+'</small></div>'
        +'<div class="m t a"><b>'+(v.changed?v.g:(r.g||'?'))+(r.gEst&&!v.changed?'*':'')+'</b><small>gluc.</small></div>'
        +'<div class="m t b"><b>'+(v.changed?v.p:r.p)+'</b><small>prot.</small></div>'
        +'<div class="m t d'+((v.changed?v.l:r.l)>C.platLMax&&!r.batch?' over':'')+'"><b>'+(v.changed?v.l:r.l)+'</b><small>lip.'+(r.batch?'':' (max '+C.platLMax+')')+'</small></div>'
        +'</div>'
        +(v.changed?'<p class="adj">≈ variante — macros recalculées par calcul, la fiche d’origine reste la référence</p>':'')
        +(r.gEst&&!v.changed?'<p class="adj">* glucides estimés par calcul — à confirmer avec Yazio</p>':'')
        +(r.est&&!v.changed?'<p class="adj">macros entièrement estimées — à confirmer avec Yazio</p>':'');
    }
    if(r.warn) h+='<div class="warnbox">⚠️ '+r.warn+'</div>';
    // ── Variantes féculent / viande (décision 24/08 : son usage réel) ──
    if(v.fi||v.pi){
      h+='<p class="eyebrow" style="margin:18px 0 6px">🔁 Variantes — même plat, autre base ou viande</p>';
      if(v.fi){
        var cf=varFec||v.fi.type;
        h+='<div class="cgrp"><h4>Féculent</h4><div class="pick">'
          +'<button data-vf="riz" class="'+(cf==='riz'?'on':'')+'">Riz thaï</button>'
          +'<button data-vf="pates" class="'+(cf==='pates'?'on':'')+'">Pâtes</button></div></div>';
      }
      if(v.pi){
        var cp=varProt||v.pi.type;
        h+='<div class="cgrp"><h4>Viande</h4><div class="pick">'
          +'<button data-vp="poulet" class="'+(cp==='poulet'?'on':'')+'">Poulet</button>'
          +'<button data-vp="porc" class="'+(cp==='porc'?'on':'')+'">Porc</button>'
          +'<button data-vp="steak" class="'+(cp==='steak'?'on':'')+'">Steak 10 %</button>'
          +'<button data-vp="boeuf" class="'+(cp==='boeuf'?'on':'')+'">Bœuf (bavette)</button></div></div>';
      }
    }
    // ── Meal prep : portions Adrien / Melati (décision 24/08) ──
    var eq=portA+portM*MELATI_F, f=r.batch?1:eq/r.plats;
    if(!r.batch){
      var kv=v.changed?v.k:(r.kcal||1000);
      h+='<p class="eyebrow" style="margin:20px 0 6px">🍱 Meal prep — pour qui tu cuisines ?</p>'
        +'<div class="cgrp"><h4>Portions Adrien · <i>~'+kv+' kcal chacune</i></h4>'
        +'<div class="stepr"><button data-po="a" data-d="-1">−</button><span class="num">'+portA+'</span><button data-po="a" data-d="1">+</button></div></div>'
        +'<div class="cgrp"><h4>Portions Melati 🌸 · <i>~'+Math.round(kv*MELATI_F)+' kcal, protéinée</i></h4>'
        +'<div class="stepr"><button data-po="m" data-d="-1">−</button><span class="num">'+portM+'</span><button data-po="m" data-d="1">+</button></div></div>';
      if(portA===2&&portM===0) h+='<p class="hint" style="margin:6px 0 0">Ton rythme habituel : 2 portions Adrien = ce soir + demain midi.</p>';
      if(portM>0) h+='<div class="note" style="margin-top:10px"><span class="ic">🌸</span><div>Portion Melati ≈ '+Math.round(kv*MELATI_F)+' kcal mais <b>protéinée</b> : au dressage, réduis plutôt son féculent que sa viande.</div></div>';
    }
    // Ingrédients principaux d'un côté, sauce/assaisonnement dans sa box compacte (24/08 soir)
    var ingMain=[], ingSce=[];
    v.ing.forEach(function(i){ (r.batch||!isSauceIng(i)?ingMain:ingSce).push(scaleIng(i,f)); });
    h+='<p class="eyebrow" style="margin:20px 0 2px">Ingrédients'+(r.batch?' · le batch complet':' · '+(portA?portA+' portion'+(portA>1?'s':'')+' Adrien':'')+(portA&&portM?' + ':'')+(portM?portM+' Melati':''))
      +(Math.abs(f-1)>1e-9?' <i style="font-weight:700;opacity:.65">(quantités ×'+(Math.round(f*100)/100)+', arrondies)</i>':'')+'</p>'
      +ingMain.map(function(i){return '<div class="li">'+i+'</div>';}).join('')
      +(ingSce.length?'<div class="scebox"><p class="sce-t">🥣 La sauce · assaisonnement</p>'
        +ingSce.map(function(i){return '<span class="sci">'+i+'</span>';}).join('')+'</div>':'')
      +(typeof NP!=='undefined'?NP.flavorHtml({fam:'plat',pan:r.s.some(function(x){return x[0]===1||x[0]===2||x[0]===3;}),text:r.ing.join(' ')+' '+r.s.map(function(x){return x[1];}).join(' ')}):'')
      +'<p class="eyebrow" style="margin:22px 0 8px">Préparation · niveaux de plaque</p>'
      +'<div class="steps">'+r.s.map(function(st){return '<div class="step">'+lvlBadge(st[0])+'<p>'+st[1]+'</p></div>';}).join('')+'</div>';
    if(r.notes&&r.notes.length) h+='<p class="eyebrow" style="margin:20px 0 6px">Notes</p>'+r.notes.map(function(n){return '<div class="li dim">'+n+'</div>';}).join('');
    if(r.custom) h+='<button class="np-editbtn" type="button" onclick="NP.openEdit(\''+r.id+'\')">✏️ Modifier mon plat</button>';
    h+='</div>';
    $('na-sh').innerHTML=h;
    $('na-x').onclick=fermer;
    $('na-fav').onclick=function(){ toggleFav(r); ouvrir(r.id,true); renderListe(); };
    $('na-sh').onclick=function(e){
      if(!cur) return;
      var vf=e.target.closest('[data-vf]'), vp=e.target.closest('[data-vp]'), b=e.target.closest('[data-po]');
      if(vf) varFec=vf.dataset.vf;
      else if(vp) varProt=vp.dataset.vp;
      else if(b){
        var d=+b.dataset.d;
        if(b.dataset.po==='a') portA=Math.max(0,Math.min(8,portA+d));
        else portM=Math.max(0,Math.min(8,portM+d));
        if(portA+portM===0) portA=1; // au moins une portion
      } else return;
      var sc=$('na-sheet').scrollTop; ouvrir(cur.id,true); $('na-sheet').scrollTop=sc;
    };
    $('na-veil').classList.add('on'); $('na-sheet').classList.add('on');
  }
  function fermer(){ $('na-veil').classList.remove('on'); $('na-sheet').classList.remove('on'); $('na-pick').classList.remove('on'); cur=null; }

  function renderSauces(){
    var h='<div class="card"><p class="eyebrow">Bibliothèque de sauces · classées par lipides</p>'
      +NUTA.SAUCES.map(function(s){
        var cl=s.l<=2?'ok':(s.l<=11?'mid':'hi');
        return '<div class="srow"><div class="sl '+cl+'"><b>'+s.l+'</b><small>g lip.</small></div>'
          +'<div class="sb"><b>'+s.n+(s.riche?' · <i>1-2×/sem</i>':'')+'</b><span>'+s.compo+'</span></div></div>';
      }).join('')+'</div>';
    h+='<div class="note" style="margin-top:12px"><span class="ic">📏</span><div><b>Volume :</b> pour 2 plats de pâtes, 250 ml de sauce minimum — ratio 100 g de crème + <b>200 ml d’eau de cuisson</b> (l’amidon lie sans un gramme de gras).</div></div>';
    h+='<div class="note"><span class="ic">🚨</span><div><b>Anti « goût de crème pure » :</b> TOUTE sauce crémeuse reçoit 1 càs de soja + 1 càc de paprika fumé. Non négociable.</div></div>';
    h+='<div class="card" style="margin-top:12px"><p class="eyebrow">Ta sauce a un problème ?</p>'
      +NUTA.DIAG.map(function(d){return '<div class="drow"><b>'+d[0]+'</b><span>'+d[2]+'</span></div>';}).join('')+'</div>';
    $('na-sauces').innerHTML=h;
  }
  function renderSnacks(){
    var h='<div class="note"><span class="ic">🎯</span><div><b>Le critère snack :</b> beaucoup de glucides, peu de lipides. Ça élimine tout ce qui est feuilleté, sablé ou beurré.</div></div>';
    h+='<div class="card" style="margin-top:12px"><p class="eyebrow">Les formats pratiques (dans la Journée)</p>'
      +SNACKS.map(function(s){return '<div class="srow"><div class="sl ok" style="min-width:64px"><b>'+s.k+'</b><small>kcal</small></div><div class="sb"><b>'+s.emoji+' '+s.n+' · <i>'+s.g+' g gluc / '+s.l+' g lip</i></b><span>'+s.note+'</span></div></div>';}).join('')+'</div>';
    h+='<div class="card" style="margin-top:12px"><p class="eyebrow">Repères / 100 g (glucides · lipides)</p>'
      +NUTA.SNACKS_TABLE.map(function(t){return '<div class="drow"><b>'+t[0]+'</b><span>'+(t[1]!=null?t[1]+' g gluc · ':'')+t[2]+' g lip</span></div>';}).join('')
      +'<p class="hint" style="margin-top:8px">Maïs séché salé : occasionnel — 2× moins efficace que les biscuits cuillère comme vecteur de glucides.</p></div>';
    $('na-snacks').innerHTML=h;
  }

  /* ───────── JOURNÉE ───────── */
  /* Petit-déj composable (24/08 soir) : chaque élément a son compteur. Les anciens jours
     (pdj=true sans pdjC) héritent des quantités par défaut = mêmes totaux qu'avant. */
  function pdjCounts(j){
    if(!j.pdjC){ j.pdjC={}; PDJ.parts.forEach(function(p){ j.pdjC[p.id]=p.def; }); }
    return j.pdjC;
  }
  function pdjTotals(j){
    var t={k:0,p:0,g:0,l:0};
    if(!j.pdj) return t;
    var c=pdjCounts(j);
    PDJ.parts.forEach(function(p){ var n=c[p.id]||0; t.k+=p.k*n;t.p+=p.p*n;t.g+=p.g*n;t.l+=p.l*n; });
    if(j.pdjB){ t.k+=PDJ.beurre.k; t.l+=PDJ.beurre.l; }
    return t;
  }
  /* Le resto remplace un déjeuner ou un dîner (24/08 soir) — j.restoSlot dit lequel. */
  function restoSlot(j){
    if(!(j.resto&&j.resto.length)) return null;
    if(j.restoSlot!=='dej'&&j.restoSlot!=='din') j.restoSlot=!j.dej?'dej':'din';
    return j.restoSlot;
  }
  function jTotals(j){
    var t={k:0,p:0,g:0,l:0};
    if(j.pdj){ var pt=pdjTotals(j); t.k+=pt.k;t.p+=pt.p;t.g+=pt.g;t.l+=pt.l; }
    ['dej','din'].forEach(function(s){ var r=j[s]&&rById(j[s]); if(r&&r.kcal){ t.k+=r.kcal;t.p+=r.p;t.g+=(r.g||0);t.l+=r.l; } });
    (j.snacks||[]).forEach(function(id){ var s=SNACKS.filter(function(x){return x.id===id;})[0]; if(s){ t.k+=s.k;t.p+=s.p;t.g+=s.g;t.l+=s.l; } });
    (j.resto||[]).forEach(function(id){ var s=NUTA.RESTO.filter(function(x){return x.id===id;})[0]; if(s){ t.k+=s.k;t.p+=s.p;t.g+=s.g;t.l+=s.l; } });
    if(j.shaker){ t.k+=SHAKER.kcal;t.p+=SHAKER.p;t.g+=SHAKER.g;t.l+=SHAKER.l; }
    t.k=Math.round(t.k);t.p=Math.round(t.p);t.g=Math.round(t.g);t.l=Math.round(t.l);
    return t;
  }
  function noteJour(t){
    var n=10, ex=[];
    var dk=C.kcal-t.k;
    if(dk>200){ n-=Math.ceil((dk-200)/150); ex.push({ok:false,t:'Il te manque '+dk+' kcal sur les '+C.kcal+'. C’est TON risque n°1 : les journées où tu ne manges pas assez. Un snack glucides ou le shaker filet de sécurité règle ça.'}); }
    else if(t.k>3400){ n-=1; ex.push({ok:false,t:'Journée haute ('+t.k+' kcal). Isolée, ce n’est rien — c’est la moyenne de la semaine qui compte. Ne compense pas demain.'}); }
    else ex.push({ok:true,t:'Calories au niveau ('+t.k+' / '+C.kcal+').'});
    if(t.g<330){ n-=Math.ceil((330-t.g)/30); ex.push({ok:false,t:'Glucides à '+t.g+' g / '+C.gMin+'. C’est LE levier — monte le féculent (150–200 g sec sur le plat) ou ajoute une compote / banane / biscuits cuillère.'}); }
    else ex.push({ok:true,t:'Glucides au niveau ('+t.g+' g / '+C.gMin+') — la priorité n°1 est remplie.'});
    if(t.l>C.lMax){ n-=Math.ceil((t.l-C.lMax)/15); ex.push({ok:false,t:'Lipides à '+t.l+' g (max '+C.lMax+'). Vérifie les sauces crémeuses — 1 à 2 par semaine, pas plus.'}); }
    else ex.push({ok:true,t:'Lipides sous contrôle ('+t.l+' g / '+C.lMax+' max).'});
    if(t.p<135){ n-=1; ex.push({ok:false,t:'Protéines à '+t.p+' g / '+C.pMin+' — rare chez toi. Une boîte de thon ou 2 œufs et c’est réglé.'}); }
    else ex.push({ok:true,t:'Protéines couvertes ('+t.p+' g) — le non-sujet habituel.'});
    return {n:Math.max(1,Math.min(10,n)),ex:ex};
  }
  function renderJournee(){
    var j=J(), rsl=restoSlot(j);
    // PDJ — composable : chaque élément a son compteur (cible affichée = le classique ~655)
    var pdjIn='<div class="slot-h"><h4>🍳 Petit-déj</h4><small class="num">cible ~'+PDJ.kcal+' kcal</small></div>';
    if(!j.pdj) pdjIn+='<button class="slot-add" data-a="pdj">+ Je l’ai pris (le point à ne JAMAIS sauter)</button>';
    else{
      var pc=pdjCounts(j), pt=pdjTotals(j);
      pdjIn+='<button class="slot-add done" data-a="pdj">✓ Pris — '+Math.round(pt.k)+' kcal · '+Math.round(pt.g)+' g gluc.</button>'
        +'<div class="pdjgrid">'+PDJ.parts.map(function(p){
          var n=pc[p.id]||0;
          return '<div class="pdjrow'+(n?'':' off')+'"><span class="pdjn">'+p.emoji+' '+p.n+' <small class="num">'+(n?Math.round(p.k*n)+' kcal':'')+'</small></span>'
            +'<span class="pstep"><button data-pd="'+p.id+'" data-d="-1" aria-label="Moins">−</button><b class="num">'+n+'</b><button data-pd="'+p.id+'" data-d="1" aria-label="Plus">+</button></span></div>';
        }).join('')+'</div>'
        +'<div class="snchips" style="margin-top:8px"><button class="snchip'+(j.pdjB?' on':'')+'" data-a="pdjbeurre">🧈 + beurre 10–15 g'+(j.pdjB?' ✓ (+'+PDJ.beurre.k+' kcal)':'')+'</button></div>'
        +(!pc.compote?'<p class="hint" style="margin-top:7px">Compote décalée ? N’oublie pas les 5 g de créatine plus tard — snack compote 🍎 ou shaker.</p>':'');
    }
    $('na-slot-pdj').innerHTML=pdjIn;
    // DEJ / DIN — cible kcal affichée telle quelle (24/08 : plus de « plus léger »)
    [['dej','🍛 Déjeuner','cible ~1200 kcal'],['din','🌙 Dîner','cible ~950 kcal']].forEach(function(cfg){
      var s=cfg[0], el=$('na-slot-'+s), r=j[s]&&rById(j[s]);
      var inner='<div class="slot-h"><h4>'+cfg[1]+'</h4><small class="num">'+cfg[2]+'</small></div>';
      if(r) inner+='<div class="slot-r"><span class="mini '+(r.base==='pates'?'tp':'tr')+'">'+thumbIn(r)+'</span>'
        +'<div class="slot-b"><b>'+r.n+'</b><span>'+(r.kcal?r.kcal+' kcal · '+(r.g||'?')+' g gluc. · '+r.p+' g prot.':'macros à compléter')+'</span></div>'
        +'<button class="slot-x" data-del="'+s+'">✕</button></div>';
      else if(rsl===s){
        var rk=0,rn=[];
        (j.resto||[]).forEach(function(id){ var x=NUTA.RESTO.filter(function(y){return y.id===id;})[0]; if(x){ rk+=x.k; rn.push(x.emoji); } });
        inner+='<div class="slot-r"><span class="mini">🍔</span>'
          +'<div class="slot-b"><b>Remplacé par l’extérieur</b><span>'+rn.join(' ')+' · '+Math.round(rk)+' kcal — voir l’encart Extérieur</span></div></div>';
      }
      else inner+='<button class="slot-add" data-pickslot="'+s+'">+ Choisir un plat</button>';
      el.innerHTML=inner;
    });
    // SNACKS
    $('na-slot-snacks').innerHTML='<div class="slot-h"><h4>🍌 Snacks glucides</h4><small class="num">le complément · ~100 kcal pièce</small></div>'
      +'<div class="snchips">'+SNACKS.map(function(s){
        var count=(j.snacks||[]).filter(function(x){return x===s.id;}).length;
        return '<button class="snchip'+(count?' on':'')+'" data-sn="'+s.id+'">'+s.emoji+' '+s.n.split('(')[0].split('·')[0].trim()+(count?' ×'+count:'')+'</button>';
      }).join('')+'</div>'
      +((j.snacks||[]).length?'<button class="snclear" data-a="clearsn">Vider les snacks</button>':'');
    // EXTÉRIEUR / RESTO — remplace un déjeuner ou un dîner
    $('na-slot-resto').innerHTML='<div class="slot-h"><h4>🍔 Extérieur / resto</h4><small class="num">remplace un déjeuner / dîner</small></div>'
      +'<div class="snchips">'+NUTA.RESTO.map(function(s){
        var count=(j.resto||[]).filter(function(x){return x===s.id;}).length;
        return '<button class="snchip'+(count?' on':'')+'" data-rs="'+s.id+'">'+s.emoji+' '+s.n+(count?' ×'+count:'')+'</button>';
      }).join('')+'</div>'
      +(rsl?'<div class="snchips" style="margin-top:8px"><span class="hint" style="align-self:center">Ça remplace :</span>'
        +'<button class="snchip'+(rsl==='dej'?' on':'')+'" data-rswap="dej">🍛 le déjeuner</button>'
        +'<button class="snchip'+(rsl==='din'?' on':'')+'" data-rswap="din">🌙 le dîner</button></div>':'')
      +((j.resto||[]).length?'<button class="snclear" data-a="clearrs">Vider</button>':'');
    // SHAKER
    $('na-slot-shaker').innerHTML='<div class="slot-h"><h4>🥤 Shaker</h4><small class="num">filet de sécurité · 2/sem max</small></div>'
      +'<button class="slot-add'+(j.shaker?' done':'')+'" data-a="shaker">'+(j.shaker?'✓ Pris ('+SHAKER.kcal+' kcal · '+SHAKER.p+' g prot.)':'+ Repas sauté / léger ? Sors le shaker')+'</button>';
    // BILAN — un resto compte comme le repas qu'il remplace
    var t=jTotals(j), ready=j.pdj&&(j.dej||rsl==='dej')&&(j.din||rsl==='din');
    var h='<p class="eyebrow">Bilan de la journée · '+todayStr().slice(5).split('-').reverse().join('/')+'</p>';
    function jm(val,cible,lbl,type){
      var cls='ok';
      if(type==='g') cls = val>=cible*0.9 ? 'ok' : 'low';
      else if(type==='l') cls = val>C.lMax ? 'high' : 'ok';
      else if(type==='p') cls = val>=135 ? 'ok' : 'low';
      return '<div class="jm '+cls+'"><b class="num">'+val+'<i>/'+cible+'</i></b><small>'+lbl+'</small></div>';
    }
    if(!ready){
      h+='<p class="hint">Coche le petit-déj et choisis déjeuner + dîner pour voir ta note.</p>';
      if(t.k>0) h+='<div class="jmacros" style="margin-top:12px">'
        +'<div class="jm '+(t.k>=C.kcal*0.9?'ok':'low')+'"><b class="num">'+t.k+'<i>/'+C.kcal+'</i></b><small>kcal</small></div>'
        +jm(t.g,C.gMin,'gluc.','g')+jm(t.l,C.lMax,'lip.','l')+jm(t.p,C.pMin,'prot.','p')+'</div>';
    } else {
      var res=noteJour(t);
      var ncl=res.n>=8?'g':res.n>=5?'y':'r';
      var kcl=(C.kcal-t.k)>200?'low':(t.k>3400?'high':'ok');
      h+='<div class="jhero"><div class="jnote '+ncl+'"><b class="num">'+res.n+'</b><small>/10</small></div>'
        +'<div class="jkcal '+kcl+'"><b class="num">'+t.k+'</b><span>/ '+C.kcal+' kcal</span><em>'+(C.kcal-t.k>0?('il en manque '+(C.kcal-t.k)):'cible atteinte 💪')+'</em></div></div>'
        +'<div class="jmacros">'+jm(t.g,C.gMin,'glucides','g')+jm(t.l,C.lMax,'lipides','l')+jm(t.p,C.pMin,'protéines','p')+'</div>';
      // Suggestion auto du shaker — son vrai rôle de filet (décision 24/08)
      if(!j.shaker && (C.kcal-t.k)>250){
        h+='<div class="verdict v-low" style="margin-top:12px"><span class="vi">🥤</span><p><b>Journée trop basse ('+(C.kcal-t.k)+' kcal manquantes).</b> C’est exactement le rôle du shaker filet de sécurité : +'+SHAKER.kcal+' kcal · +'+SHAKER.p+' g de protéines.<br><button class="slot-add" data-a="shakergo" style="margin-top:8px">🥤 Sors le shaker (+'+SHAKER.kcal+' kcal)</button></p></div>';
      }
      h+='<div class="jdebrief">'+res.ex.map(function(e){return '<div class="jd '+(e.ok?'ok':'warn')+'"><span class="jdi">'+(e.ok?'✓':'!')+'</span><p>'+e.t+'</p></div>';}).join('')+'</div>';
    }
    $('na-bilan').innerHTML=h;
  }
  function pickRowHtml(r,slot,why){
    return '<button class="pickrow'+(why?' sug':'')+'" data-pick="'+r.id+'" data-slot="'+slot+'">'
      +'<span class="mini '+(r.base==='pates'?'tp':'tr')+'">'+thumbIn(r)+'</span>'
      +'<span style="flex:1;min-width:0"><b>'+r.n+(r.star?' ⭐':'')+(isFav(r)?' <i class="hrt">♥</i>':'')+'</b><span>'+r.kcal+' kcal · '+(r.g||'?')+' g gluc. · '+r.p+' g prot.'+(r.l>C.platLMax?' · ⚠️ '+r.l+' g lip.':'')+'</span>'
      +(why?'<i class="sugwhy">'+why+'</i>':'')+'</span></button>';
  }
  /* Suggestion du dernier repas (24/08 soir) : quand le reste de la journée est déjà saisi,
     le picker classe en tête les plats qui remplissent le mieux le quota kcal/glucides
     sans faire déborder les lipides. Déterministe, zéro IA. */
  function suggest(slot,rs){
    var j=J(), rsl=restoSlot(j);
    var other=slot==='dej'?'din':'dej';
    if(!j.pdj||!(j[other]||rsl===other)||j[slot]||rsl===slot) return null;
    var t=jTotals(j);
    var needK=C.kcal-t.k, lLeft=C.lMax-t.l, gLeft=Math.max(0,C.gMin-t.g), pLeft=Math.max(0,C.pMin-t.p);
    var scored=rs.filter(function(r){return r.kcal&&r.id!==j[other];}).map(function(r){
      var s=-Math.abs(r.kcal-needK)/10;
      if(r.l>lLeft) s-=(r.l-lLeft)*2.5;
      s+=Math.min(r.g,gLeft)/12+Math.min(r.p,pLeft)/18;
      return {r:r,s:s};
    }).sort(function(a,b){return b.s-a.s;}).slice(0,3);
    if(!scored.length) return null;
    return {needK:needK,lLeft:lLeft,rows:scored.map(function(o){
      var r=o.r, after=needK-r.kcal;
      var why=(after>=-100?'il restera '+Math.max(0,after)+' kcal':'+'+(-after)+' kcal au-dessus de la cible')
        +' · lip. '+(r.l<=lLeft?r.l+' g OK (marge '+Math.max(0,lLeft)+')':'⚠️ dépasse la marge de '+(r.l-Math.max(0,lLeft))+' g')
        +(gLeft>0?' · +'+Math.min(r.g,gLeft)+' g gluc. utiles':'');
      return pickRowHtml(r,slot,why);
    }).join('')};
  }
  function ouvrirPick(slot){
    var rs=R.filter(function(r){return !r.inc&&!r.batch;});
    var sg=suggest(slot,rs);
    $('na-pk').innerHTML='<h2 style="font-size:19px;margin-bottom:4px">'+(slot==='dej'?'Déjeuner':'Dîner')+'</h2>'
      +'<p class="hint" style="margin-bottom:10px">Touche un plat pour le choisir.</p>'
      +(sg?'<p class="eyebrow" style="margin:2px 0 8px">✨ Conseillés — il te reste '+Math.max(0,sg.needK)+' kcal · marge lipides '+Math.max(0,sg.lLeft)+' g</p>'
        +sg.rows+'<p class="eyebrow" style="margin:14px 0 6px">Tous les plats</p>':'')
      +rs.map(function(r){ return pickRowHtml(r,slot,null); }).join('');
    $('na-veil').classList.add('on'); $('na-pick').classList.add('on'); $('na-pick').scrollTop=0;
  }

  /* ───────── CALCUL ───────── */
  var calc={prot:'poulet',protG:250,oeufs:0,fec:'riz',fecG:150,leg:'champignons',legG:150,sauce:2,huile:true};
  function calcTotals(){
    var CF=NUTA.CF, t={k:0,p:0,l:0,g:0};
    var pr=CF.prot[calc.prot];
    if(calc.prot==='oeuf'){ var n=Math.max(1,Math.round(calc.protG/55)); t.k+=pr[1]*n;t.p+=pr[2]*n;t.l+=pr[3]*n;t.g+=pr[4]*n; }
    else { t.k+=pr[1]*calc.protG/100;t.p+=pr[2]*calc.protG/100;t.l+=pr[3]*calc.protG/100;t.g+=pr[4]*calc.protG/100; }
    if(calc.oeufs){ var o=CF.prot.oeuf; t.k+=o[1]*calc.oeufs;t.p+=o[2]*calc.oeufs;t.l+=o[3]*calc.oeufs;t.g+=o[4]*calc.oeufs; }
    var f=CF.fec[calc.fec]; t.k+=f[1]*calc.fecG/100;t.p+=f[2]*calc.fecG/100;t.l+=f[3]*calc.fecG/100;t.g+=f[4]*calc.fecG/100;
    var lg=CF.leg[calc.leg]; t.k+=lg[1]*calc.legG/100;t.p+=lg[2]*calc.legG/100;t.l+=lg[3]*calc.legG/100;t.g+=lg[4]*calc.legG/100;
    var s=NUTA.SAUCES[calc.sauce]; t.k+=s.k; t.l+=s.l;
    if(calc.huile){ var hu=CF.huile; t.k+=hu[1];t.l+=hu[3]; }
    t.k=Math.round(t.k);t.p=Math.round(t.p);t.l=Math.round(t.l);t.g=Math.round(t.g);
    return t;
  }
  function renderCalc(){
    var CF=NUTA.CF;
    var h='<div class="card"><p class="eyebrow">Compose ton plat (quantités pour 1 plat)</p>';
    h+='<div class="cgrp"><h4>Protéine · <b class="num">'+(calc.prot==='oeuf'?Math.max(1,Math.round(calc.protG/55))+' œufs':calc.protG+' g')+'</b></h4><div class="pick">'
      +Object.keys(CF.prot).map(function(k){return '<button data-ck="prot" data-v="'+k+'" class="'+(calc.prot===k?'on':'')+'">'+CF.prot[k][0].split('(')[0].trim()+'</button>';}).join('')+'</div>'
      +'<div class="stepr"><button data-st="protG" data-d="-25">−</button><span class="num">'+calc.protG+' g</span><button data-st="protG" data-d="25">+</button></div></div>';
    h+='<div class="cgrp"><h4>+ Œufs dans le plat · <b class="num">'+calc.oeufs+'</b></h4>'
      +'<div class="stepr"><button data-st="oeufs" data-d="-1">−</button><span class="num">'+calc.oeufs+' œuf'+(calc.oeufs>1?'s':'')+'</span><button data-st="oeufs" data-d="1">+</button></div></div>';
    h+='<div class="cgrp"><h4>Féculent (pesé SEC) · <b class="num">'+calc.fecG+' g</b> <i>— 100–200 g selon le plat, ~150 g en général</i></h4><div class="pick">'
      +Object.keys(CF.fec).map(function(k){return '<button data-ck="fec" data-v="'+k+'" class="'+(calc.fec===k?'on':'')+'">'+CF.fec[k][0]+'</button>';}).join('')+'</div>'
      +'<div class="stepr"><button data-st="fecG" data-d="-25">−</button><span class="num">'+calc.fecG+' g</span><button data-st="fecG" data-d="25">+</button></div></div>';
    h+='<div class="cgrp"><h4>Légume · <b class="num">'+calc.legG+' g</b></h4><div class="pick">'
      +Object.keys(CF.leg).map(function(k){return '<button data-ck="leg" data-v="'+k+'" class="'+(calc.leg===k?'on':'')+'">'+CF.leg[k][0]+'</button>';}).join('')+'</div>'
      +'<div class="stepr"><button data-st="legG" data-d="-50">−</button><span class="num">'+calc.legG+' g</span><button data-st="legG" data-d="50">+</button></div></div>';
    h+='<div class="cgrp"><h4>Sauce</h4><div class="pick">'
      +NUTA.SAUCES.map(function(s,i){return '<button data-ck="sauce" data-v="'+i+'" class="'+(calc.sauce===i?'on':'')+'">'+s.n+' · '+s.l+'g</button>';}).join('')+'</div></div>';
    h+='<div class="cgrp"><h4>Huile de cuisson</h4><div class="pick">'
      +'<button data-ck="huile" data-v="1" class="'+(calc.huile?'on':'')+'">1 càs tournesol (+10 g lip.)</button>'
      +'<button data-ck="huile" data-v="0" class="'+(!calc.huile?'on':'')+'">Sans huile (poêle à blanc)</button></div></div>';
    h+='</div>';
    // Résultat — kcal en jauge maîtresse, 3 macros compactes avec leurs objectifs (24/08 soir)
    var t=calcTotals();
    var kcl=t.k<C.platKMin?'low':(t.k>C.platKMax+100?'high':'ok');
    var lcl=t.l>C.platLMax?'high':'ok';
    var gcl=t.g>=C.platGMin?'ok':'low';
    var pcl=t.p>=C.platPMin?'ok':'low';
    var vcl,vico,vtxt;
    if(t.l>C.platLMax){ vcl='v-high';vico='−';vtxt='<b>'+t.l+' g de lipides — au-dessus des '+C.platLMax+' g/plat.</b> Change de sauce (soja, déglacée, tomate : 0–2 g), retire l’huile, ou passe sur une protéine plus maigre.'; }
    else if(t.k<C.platKMin){ vcl='v-low';vico='＋';vtxt='<b>Il manque '+(C.platKMin-t.k)+' kcal pour un vrai plat de masse.</b> Le réflexe : monte le féculent — c’est ton levier, pas le gras.'; }
    else if(t.g<C.platGMin){ vcl='v-low';vico='＋';vtxt='<b>'+t.g+' g de glucides seulement.</b> Le plat tient en kcal mais pas en glucides — monte le féculent (jusqu’à 200 g sec si le plat s’y prête).'; }
    else { vcl='v-ok';vico='✓';vtxt='<b>Plat validé :</b> dans la zone '+C.platKMin+'–'+C.platKMax+' kcal, lipides sous '+C.platLMax+' g, glucides au niveau. Tu peux cuisiner.'; }
    var kem=t.k<C.platKMin?('encore '+(C.platKMin-t.k)+' kcal à trouver'):(t.k>C.platKMax+100?'au-dessus de la zone plat':'dans la zone plat de masse');
    h+='<div class="card" style="margin-top:14px"><p class="eyebrow">Ton plat</p>'
      +'<div class="jhero" style="margin:4px 0 8px"><div class="jkcal '+kcl+'"><b class="num">'+t.k+'</b><span>/ '+C.platKMin+'–'+C.platKMax+' kcal</span><em>'+kem+'</em></div></div>'
      +'<div class="jmacros">'
      +'<div class="jm '+gcl+'"><b class="num">'+t.g+'<i>/'+C.platGMin+'+</i></b><small>glucides</small></div>'
      +'<div class="jm '+pcl+'"><b class="num">'+t.p+'<i>/'+C.platPMin+'+</i></b><small>protéines</small></div>'
      +'<div class="jm '+lcl+'"><b class="num">'+t.l+'<i>/'+C.platLMax+' max</i></b><small>lipides</small></div>'
      +'</div>'
      +'<div class="verdict '+vcl+'" style="margin-top:10px"><span class="vi">'+vico+'</span><p>'+vtxt+'</p></div>'
      +'<p class="hint" style="margin-top:10px">Pour 2 plats : double tout, cuis la viande EN 2 FOIS (ta poêle est petite), et sépare féculent / sauce en 2 boîtes — sauf riz sauté.</p></div>';
    // Rendu ciblé dans un conteneur stable : sans lui, chaque tap re-déclenchait
    // l'animation d'entrée du pane (napop, opacity 0 → 1) = le « black screen » de 0,5 s.
    var el=$('na-calc-in');
    if(!el){ $('na-p-calcul').innerHTML='<div id="na-calc-in"></div>'; el=$('na-calc-in'); }
    el.innerHTML=h;
  }

  /* ───────── ÉVÉNEMENTS ───────── */
  function bind(){
    document.querySelectorAll('#nutria .tab').forEach(function(b){ b.onclick=function(){
      document.querySelectorAll('#nutria .tab').forEach(function(x){x.classList.remove('on');});
      document.querySelectorAll('#nutria .pane').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on'); $('na-p-'+b.dataset.p).classList.add('on'); $('nutria').scrollTop=0;
      if(b.dataset.p==='semaine'&&typeof NP!=='undefined') NP.renderWeek();
    };});
    document.querySelectorAll('#nutria [data-fam]').forEach(function(b){ b.onclick=function(){
      document.querySelectorAll('#nutria [data-fam]').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on'); fam=b.dataset.fam;
      $('na-plats').style.display=fam==='plats'?'':'none';
      $('na-sauces').style.display=fam==='sauces'?'':'none';
      $('na-snacks').style.display=fam==='snacks'?'':'none';
    };});
    $('na-q').addEventListener('input',function(e){ q=e.target.value.trim(); renderListe(); });
    $('na-q').setAttribute('placeholder','Chercher… ex : riz poulet, pâtes bœuf');
    $('na-filters').onclick=function(e){
      var b=e.target.closest('.chip'); if(!b) return;
      var f=b.dataset.f;
      if(filtres.has(f)) filtres.delete(f); else filtres.add(f);
      document.querySelectorAll('#nutria .chip').forEach(function(c){ c.classList.toggle('on',filtres.has(c.dataset.f)); });
      renderListe();
    };
    $('na-list').onclick=function(e){ var b=e.target.closest('.rc'); if(b) ouvrir(b.dataset.id,false,{p:b.dataset.vp||null,f:b.dataset.vf||null}); };
    $('na-have').onclick=function(){ haveOpen=!haveOpen; renderPantry(); };
    $('na-pantry').onclick=function(e){
      var c=e.target.closest('[data-hclear]'); if(c){ have.clear(); renderListe(); return; }
      var b=e.target.closest('[data-h]'); if(!b) return;
      var id=b.dataset.h; if(have.has(id)) have.delete(id); else have.add(id);
      renderListe();
    };
    $('na-veil').onclick=fermer;
    $('na-p-journee').onclick=function(e){
      var a=e.target.closest('[data-a]');
      if(a){ var j=J();
        if(a.dataset.a==='pdj'){ j.pdj=!j.pdj; if(!j.pdj) j.pdjB=false; }
        else if(a.dataset.a==='pdjbeurre') j.pdjB=!j.pdjB;
        else if(a.dataset.a==='shaker') j.shaker=!j.shaker;
        else if(a.dataset.a==='shakergo') j.shaker=true;
        else if(a.dataset.a==='clearsn') j.snacks=[];
        else if(a.dataset.a==='clearrs'){ j.resto=[]; delete j.restoSlot; }
        saveDB(); renderJournee(); return; }
      var pd=e.target.closest('[data-pd]');
      if(pd){ var jp=J(), cc=pdjCounts(jp);
        var part=PDJ.parts.filter(function(p){return p.id===pd.dataset.pd;})[0]; if(!part) return;
        cc[part.id]=Math.max(0,Math.min(part.max,(cc[part.id]||0)+(+pd.dataset.d)));
        saveDB(); renderJournee(); return; }
      var rw=e.target.closest('[data-rswap]'); if(rw){ J().restoSlot=rw.dataset.rswap; saveDB(); renderJournee(); return; }
      var ps=e.target.closest('[data-pickslot]'); if(ps){ ouvrirPick(ps.dataset.pickslot); return; }
      var del=e.target.closest('[data-del]'); if(del){ J()[del.dataset.del]=null; saveDB(); renderJournee(); return; }
      var sn=e.target.closest('[data-sn]'); if(sn){ var j2=J(); if(!j2.snacks)j2.snacks=[]; j2.snacks.push(sn.dataset.sn); saveDB(); renderJournee(); return; }
      var rs=e.target.closest('[data-rs]'); if(rs){ var j3=J(); if(!j3.resto)j3.resto=[]; j3.resto.push(rs.dataset.rs); saveDB(); renderJournee(); return; }
    };
    $('na-pk').onclick=function(e){
      var b=e.target.closest('[data-pick]'); if(!b) return;
      J()[b.dataset.slot]=b.dataset.pick; saveDB();
      $('na-pick').classList.remove('on'); $('na-veil').classList.remove('on');
      renderJournee();
    };
    $('na-p-calcul').onclick=function(e){
      var ck=e.target.closest('[data-ck]');
      if(ck){ var k=ck.dataset.ck, v=ck.dataset.v;
        if(k==='sauce') calc.sauce=+v; else if(k==='huile') calc.huile=v==='1'; else calc[k]=v;
        renderCalc(); return; }
      var st=e.target.closest('[data-st]');
      if(st){ var f=st.dataset.st, d=+st.dataset.d;
        calc[f]=Math.max(f==='oeufs'?0:(f==='legG'?0:50), Math.min(f==='oeufs'?6:600, calc[f]+d));
        renderCalc(); return; }
    };
  }
  /* ── NUTRI+ (29/09) : adaptateur Adrien pour nutriplus.js (mes plats · ma semaine + courses · gestes goût) ──
     Ses recettes ont des ingrédients en TEXTE (« 320 g riz thaï sec ») → petit analyseur pour la liste de courses. */
  var UNITS_CNT=/^(boîtes?|boites?|sachets?|tranches?|gousses?|cubes?|briques?|pots?|barquettes?|steaks?|œufs?|oeufs?)\b/i;
  function npClean(t){
    t=t.replace(/\([^)]*\)/g,'').split(/,| — | - |;/)[0];
    // (\b ne marche pas avant une lettre accentuée en JS → on coupe sur les espaces)
    t=t.replace(/\s(émincée?s?|coupée?s?|râpée?s?|égouttée?s?|pressée?s?|découpée?s?|en (?:lamelles|rondelles|dés|lanières|morceaux|cubes|julienne|fines?)|moyen|moyenne|gros|grosse|frais|fraîche|hors du feu|pour la sauce|au choix)(?=\s|$).*$/i,'');
    t=t.replace(/^(de |d’|d')/i,'').replace(/\s+/g,' ').trim();
    return t.charAt(0).toUpperCase()+t.slice(1);
  }
  function npRay(t){
    t=norm(t);
    if(/bouillon|cube|sauce|concentre|fond de/.test(t)) return 4;
    if(/\bsel\b|poivre|huile|paprika|cumin|curry|curcuma|ail en poudre|herbes|epice|cannelle|origan|thym|levure|maizena/.test(t)) return 5;
    if(/poulet|porc|steak|boeuf|bavette|faux-filet|filet|veau|thon|saumon|cabillaud|crevette|poisson|jambon|lardon|dinde|sardine|maquereau|croustibat/.test(t)) return 0;
    if(/\boeufs?\b|\blait\b|creme|skyr|fromage|beurre|mozzarella|parmesan|yaourt|feta|comte/.test(t)) return 1;
    if(/oignon|carotte|champignon|poivron|courgette|brocoli|epinard|tomate|salade|concombre|avocat|citron|banane|haricot|pois|mais|echalote|gingembre|coriandre|persil|ciboulette|basilic|poireau|chou|aubergine|pomme de terre|patate|\bail\b/.test(t)) return 2;
    if(/\briz\b|pates|nouilles|pain|tortilla|wrap|semoule|gnocchi|farine|avoine|capellini|udon|spaghetti|penne|tagliatelle|lentille|chapelure/.test(t)) return 3;
    return 4;
  }
  function npParse(line,f){
    var s=String(line).trim(), m=s.match(/^(\d+(?:[.,]\d+)?|½|¼|¾)\s*(kg|g|ml|cl|l)?\b\s*(.*)$/i);
    if(!m||/^pas de/i.test(s)) return {key:'t:'+norm(npClean(s)),name:npClean(s)||s,qty:0,unit:'',ray:5,txt:'à avoir'};
    var raw=m[1], v=raw==='½'?0.5:raw==='¼'?0.25:raw==='¾'?0.75:parseFloat(raw.replace(',','.')), u=(m[2]||'').toLowerCase(), rest=m[3]||'';
    if(u==='kg'){ v*=1000; u='g'; } else if(u==='cl'){ v*=10; u='ml'; } else if(u==='l'){ v*=1000; u='ml'; }
    if(u){ var nm=npClean(rest); return {key:norm(nm),name:nm.charAt(0).toUpperCase()+nm.slice(1),qty:v*f,unit:u,ray:npRay(nm)}; }
    var cs=rest.match(/^(càs|càc|c\. ?à (?:soupe|café)|cuill\w*)\s*(?:de |d’|d')?(.*)$/i);
    if(cs){ var nm2=npClean(cs[2]); var un=/café|càc/i.test(cs[1])?'càc':'càs'; return {key:norm(nm2)+'#'+un,name:nm2.charAt(0).toUpperCase()+nm2.slice(1),qty:v*f,unit:un,ray:npRay(nm2)===0||npRay(nm2)===3?4:(npRay(nm2)===5?5:4)}; }
    var cu=rest.match(UNITS_CNT), unit='', nm3=rest;
    if(cu&&!/^(œufs?|oeufs?|steaks?)$/i.test(cu[1])){ unit=cu[1].toLowerCase().replace(/s$/,'')+'(s)'; nm3=rest.slice(cu[0].length).replace(/^\s*(de |d’|d')/i,''); }
    nm3=npClean(nm3)||rest;
    return {key:norm(nm3)+'#'+unit,name:nm3.charAt(0).toUpperCase()+nm3.slice(1),qty:v*f,unit:unit,ray:npRay(nm3)};
  }
  var _pc=null,_pt=0;
  var NP_AD={app:'adrien',root:'nutria',weekPane:'na-p-semaine',weekTab:'semaine',recipesBox:'na-plats',defaultMode:'soirmidi',
    store:function(){ var a=ensure(); if(!a.np) a.np={}; return a.np; }, save:function(){ _pc=null; saveDB(); },
    toast:function(m){ showToast(m); }, closeFiche:function(){ fermer(); },
    plats:function(){
      if(_pc&&Date.now()-_pt<1500) return _pc;
      _pc=R.filter(function(r){return !r.inc&&!r.batch;}).map(function(r){ var pi=protInfo(r);
        return {id:r.id,n:r.n,thumb:r.photo?'<img class="np-th" src="'+r.photo+'" alt="">':'<span class="np-th np-emo">'+r.emoji+'</span>',kcal:r.kcal,p:r.p,temp:r.froid?'froid':'chaud',fav:isFav(r),hidden:false,prot:pi?pi.type:null,score:(r.star?50:0)+(r.p||0)/10,custom:!!r.custom}; });
      _pt=Date.now(); return _pc;
    },
    open:function(id){ ouvrir(id,false); },
    ingredients:function(id,n){ var r=rById(id); if(!r) return []; var f=n/Math.max(1,r.plats||1);
      return r.ing.map(function(l){ return npParse(l,f); }).filter(function(it){ return !/^eau\b|^eau de cuisson/i.test(norm(it.name)); }); },
    syncCustom:function(list,h){
      for(var i=R.length-1;i>=0;i--) if(R[i].custom) R.splice(i,1);
      list.forEach(function(d){ var m=h.macros(d);
        R.push({id:d.id,n:d.n,emoji:'🍽️',photo:d.photo||null,plats:Math.max(1,d.por||1),t:d.t||20,kcal:m.k,p:m.p,g:m.g,l:m.l,froid:d.temp==='froid',noswapf:true,custom:true,
          ing:(d.ing||[]).map(function(e){ return Math.round(e.g)+' g '+h.ingName(e).toLowerCase(); }),
          s:((d.steps&&d.steps.length)?d.steps:['Suis ta recette.']).map(function(t){ return [0,t]; })});
      });
      _pc=null;
    },
    refresh:function(){ _pc=null; renderListe(); renderJournee(); var wp=$('na-p-semaine'); if(wp&&wp.classList.contains('on')) NP.renderWeek(); }
  };
  function init(){
    if(inited) return; inited=true;
    if(typeof NP!=='undefined') NP.init(NP_AD);
    renderProfil(); renderSauces(); renderSnacks(); bind();
  }
  function open(){
    init(); ensure();
    if(typeof NP!=='undefined') NP.sync();
    renderListe(); renderJournee(); renderCalc();
    $('nutria').classList.add('on');
    document.body.style.overflow='hidden';
    var m=$('settingsModal'); if(m) m.classList.remove('open');
  }
  function close(){
    fermer();
    $('nutria').classList.remove('on');
    document.body.style.overflow='';
  }
  return {open:open,close:close,_totals:jTotals,_note:noteJour,_calc:calcTotals,_scale:scaleIng,_var:applyVar,_sugg:suggest,_sce:isSauceIng,_filtre:filtre,_have:have,_setQ:function(v){q=v;},_needs:needs};
})();
function nutriAOpen(){ NUTRIA.open(); }
function nutriAClose(){ NUTRIA.close(); }
