"use strict";
/* ═══ NUTRITI·ON — logique du mode nutrition (23/08/2026) ═══
   Base = prototype « Kitchen Melati » (artifact V1 validé par Adrien), adapté :
   · poids branché sur la DERNIÈRE PESÉE de l'app (une seule saisie de vérité)
   · journée persistée par date dans melati_db (→ synchro cloud automatique)
   · favoris ⭐ persistés · bouton « copier pour Yazio » · images en fichiers imgs/nut/
   · âge dynamique (née oct. 2004) · zéro IA, tout déterministe (spec 40-APP-SPEC).
   Dépend de melati.js (DB, saveDB, showToast, todayStr) et nutrition_data.js (NUTD). */

var NUTRI=(function(){
  var F=NUTD.F, FECLABEL=NUTD.FECLABEL, R=NUTD.R, FEC=NUTD.FEC,
      CAT=NUTD.CAT, VEG=NUTD.VEG, AROMATE=NUTD.AROMATE, CAP=NUTD.CAP,
      DOSE=NUTD.DOSE, UNITE=NUTD.UNITE;
  // r.img = identité stable de la recette (favoris, journée) · r.pic = fichier image (partagé entre recettes proches)
  var IMG={}; R.forEach(function(r){ IMG[r.img]='imgs/nut/'+(r.pic||r.img)+'.webp'; });
  var ROLE={}; CAT.forEach(function(c){ c[1].forEach(function(k){ ROLE[k]=c[0]; }); });

  var TAILLE=164, REF=67, OBJ=55;
  function AGE(){ // née octobre 2004
    return Math.max(21,Math.floor((new Date()-new Date('2004-10-01T12:00:00'))/(365.25*86400000)));
  }
  var $=function(id){ return document.getElementById(id); };
  var poids=67, fam='plat', filtres=new Set(), q='', meal='dej', picked=new Set();
  var have=new Set(), haveOpen=false; // 🧺 « ce que j'ai sous la main » (29/08) — session uniquement, pas persisté
  var inited=false;

  function cibles(p){
    var bmr=10*p+6.25*TAILLE-5*AGE()-161;
    var kcal=Math.max(1500,Math.round((bmr*1.5-400)/10)*10);
    var pro=Math.max(100,Math.round(1.8*p)), lip=Math.max(50,Math.round(0.9*p));
    return {kcal:kcal,pro:pro,lip:lip,glu:Math.round((kcal-pro*4-lip*9)/4)};
  }
  var MEALS={dej:{k:0.345,p:0.33},din:{k:0.345,p:0.33},col:{k:0.145,p:0.25}};
  function nut(l){
    var k=0,p=0,li=0,g=0;
    l.forEach(function(e){ var f=F[e[0]],gr=e[1]; k+=f[1]*gr/100;p+=f[2]*gr/100;li+=f[3]*gr/100;g+=f[4]*gr/100; });
    return {k:Math.round(k),p:Math.round(p),l:Math.round(li),g:Math.round(g)};
  }
  var fPro=function(){ return cibles(poids).pro/cibles(REF).pro; };
  var fKcal=function(){ return cibles(poids).kcal/cibles(REF).kcal; };
  /* ── Variantes (29/08, demande Adrien : « chaque plat en version poulet / bœuf / riz / pâtes… ») ──
     Déterministe : on remplace la protéine principale (même poids) ou le féculent (même poids cru),
     les macros sont recalculées par nut(). Les étapes gardent le texte d'origine + une consigne de cuisson. */
  var MEAT=['poulet','cuisse','dinde','boeuf','boeuffin','steak','porc'], FISH=['saumon','cabillaud','dorade','saumoncru'];
  var SWAPF=['riz','pates','pdt','patdouce','boulgour','semoule','vermriz'];
  var PLBL={poulet:'Poulet',cuisse:'Cuisse de poulet',dinde:'Dinde',boeuf:'Bœuf haché',boeuffin:'Bœuf émincé',steak:'Bavette',porc:'Porc',saumon:'Saumon',cabillaud:'Cabillaud',dorade:'Dorade',saumoncru:'Saumon cru'};
  var FLBL={riz:'Riz',pates:'Pâtes',pdt:'Pommes de terre',patdouce:'Patate douce',boulgour:'Boulgour',semoule:'Semoule',vermriz:'Vermicelles de riz'};
  var COOK={poulet:'poulet : cuit à cœur, 6-8 min',cuisse:'cuisse : 10-12 min, plus juteuse',dinde:'dinde : comme le poulet, 6-8 min',boeuf:'bœuf haché : émietté 5-6 min',boeuffin:'bœuf émincé : saisi 2-3 min à feu vif, il reste rosé',steak:'bavette : 2-3 min par face, repos 2 min, tranchée fine',porc:'porc : cuit à cœur, 6-8 min',saumon:'saumon : 3-4 min par face',cabillaud:'cabillaud : 3-4 min, il s’effeuille',dorade:'dorade : 4-5 min par face',saumoncru:'saumon cru extra-frais, non cuit'};
  function protOf(r){ for(var i=0;i<r.i.length;i++){ var k=r.i[i][0]; if(MEAT.indexOf(k)>=0) return {k:k,fam:MEAT,ix:i}; if(FISH.indexOf(k)>=0) return {k:k,fam:FISH,ix:i}; } return null; }
  function fecOf(r){ for(var i=0;i<r.i.length;i++){ if(SWAPF.indexOf(r.i[i][0])>=0) return {k:r.i[i][0],ix:i,opt:false}; } if(r.f&&SWAPF.indexOf(r.f[0])>=0) return {k:r.f[0],ix:-1,opt:true}; return null; }
  function fecLabel(k){ return FECLABEL[k]||('Avec '+(FLBL[k]||F[k][0]).toLowerCase()); }
  function ingr(r,avecFec,v){
    v=v||{}; var pi=v.p?protOf(r):null, fi=v.f?fecOf(r):null;
    var o=r.i.map(function(e,ix){ var k=e[0],g=e[1],s=e[2],u=e[3];
      if(pi&&ix===pi.ix&&v.p!==k){ k=v.p; u=null; }
      if(fi&&!fi.opt&&ix===fi.ix&&v.f!==k){ k=v.f; u=null; }
      return [k, s?Math.max(5,Math.round(g*(FEC.has(k)?fKcal():fPro())/5)*5):g, u]; });
    if(avecFec&&r.f){ var fk=(fi&&fi.opt)?v.f:r.f[0]; o.push([fk, Math.round(r.f[1]*fKcal()/5)*5, null]); }
    return o;
  }
  function densite(r){ var n=nut(ingr(r,def(r))); return n.k? n.p/n.k*100 : 0; }
  function typeDe(r){ return densite(r)>=9?'proteine':'equilibre'; }
  function etoiles(r){ var d=densite(r); var s=d>=12?3:d>=8?2:1; return '★'.repeat(s)+'☆'.repeat(3-s); }

  function anim(el,to,suf){
    if(!el) return;
    var from=parseFloat(el.dataset.v||el.textContent)||0;
    el.dataset.v=to;
    if(from===to){ el.textContent=to+(suf||''); return; }
    var t0=performance.now();
    (function step(t){ var k=Math.min(1,(t-t0)/440), e=1-Math.pow(1-k,3);
      el.textContent=Math.round(from+(to-from)*e)+(suf||'');
      if(k<1) requestAnimationFrame(step); })(performance.now());
  }

  /* ---------- favoris (persistés + synchro cloud via melati_db) ---------- */
  function favs(){ if(!DB.nutFavs) DB.nutFavs=[]; return DB.nutFavs; }
  function isFav(r){ return favs().indexOf(r.img)>=0; }
  function toggleFav(r){
    var f=favs(), i=f.indexOf(r.img);
    if(i>=0) f.splice(i,1); else f.push(r.img);
    saveDB();
  }
  /* recettes retirées par Melati (bouton « Retirer » à double confirmation) — persistées + cloud via melati_db */
  function hidden(){ if(!DB.nutHidden) DB.nutHidden=[]; return DB.nutHidden; }
  function isHidden(r){ return hidden().indexOf(r.img)>=0; }
  function hideR(r){ if(!isHidden(r)) hidden().push(r.img); saveDB(); }
  // version affichée PAR DÉFAUT = avec féculent quand la recette en propose (pas de mauvaise surprise sur les kcal — Adrien 24/08)
  // (si le filtre « Sans féculent » est actif, tout s'affiche en version sans)
  function def(r){ return !!r.f && !filtres.has('sansfec'); }
  // recette qui NE PEUT PAS se faire sans féculent : féculent dans la base (pâtes, riz intégré…) — celles à option restent proposées en version sans
  function aFec(r){ return r.i.some(function(e){ return FEC.has(e[0]); }); }

  /* ---------- profil ---------- */
  function majProfil(){
    var c=cibles(poids);
    anim($('n-tk'),c.kcal); anim($('n-tp'),c.pro,' g'); anim($('n-tl'),c.lip,' g'); anim($('n-tg'),c.glu,' g');
    $('n-zone').textContent=(c.kcal-200)+' – '+c.kcal;
    anim($('n-rd'),Math.round(c.kcal*0.345/10)*10); anim($('n-rs'),Math.round(c.kcal*0.345/10)*10);
    anim($('n-rc'),Math.round(c.kcal*0.145/10)*10); anim($('n-rm'),Math.round(c.kcal*0.165/10)*10);
    $('n-w').textContent=String(Math.round(poids*10)/10).replace('.',',');
    majCible();
  }
  // Le poids de vérité = la dernière pesée de l'app (une seule saisie, côté Sport).
  function syncPoids(){
    var lp=(DB.pesees&&DB.pesees.length)?DB.pesees[DB.pesees.length-1].kg:65;
    poids=lp;
  }

  /* ---------- recettes ---------- */
  var norm=function(s){ return String(s).toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[\u0300-\u036f]/g,''); };
  /* ── Recherche (29/08) : « riz poulet » = TOUS les mots, cherchés dans le nom ET les ingrédients
     (et le féculent en option), accents/œ ignorés. Un mot qui n'existe que par VARIANTE
     (« poulet » sur un bœuf sauté) matche aussi : la carte propose alors la version poulet. */
  var SYN={pdt:'patate patates pomme de terre',pates:'pate pasta nouilles',boeuf:'viande hachee boeuf',boeuffin:'viande boeuf',steak:'viande boeuf steak',poulet:'volaille',cuisse:'volaille poulet',oeuf:'oeufs omelette',crevette:'crevettes',champignon:'champignons',poivron:'poivrons',hvert:'haricots verts',chouchi:'chou chinois',saumoncru:'saumon',tofusoy:'tofu'};
  function tokens(str){ return norm(str).split(/[\s,+·]+/).filter(function(t){ return t.length>=2; }); }
  function hayOf(r){
    if(r._hay) return r._hay;
    var p=[r.n]; r.i.forEach(function(e){ p.push(F[e[0]][0]); p.push(e[0]); if(SYN[e[0]]) p.push(SYN[e[0]]); });
    if(r.f){ p.push(F[r.f[0]][0]); p.push(r.f[0]); if(SYN[r.f[0]]) p.push(SYN[r.f[0]]); }
    r._hay=norm(p.join(' | ')); r._hayN=norm(r.n); return r._hay;
  }
  function varHay(r){ // ce que la recette PEUT devenir (autres viandes/poissons, autres féculents) → [{k,type,txt}]
    if(r._vh) return r._vh;
    var out=[], pi=protOf(r), fi=fecOf(r);
    if(pi) pi.fam.forEach(function(k){ if(k!==pi.k) out.push({k:k,type:'p',txt:norm(F[k][0]+' '+k+' '+(SYN[k]||''))}); });
    if(fi) SWAPF.forEach(function(k){ if(k!==fi.k) out.push({k:k,type:'f',txt:norm(F[k][0]+' '+k+' '+(SYN[k]||''))}); });
    r._vh=out; return out;
  }
  // → null si la recette ne matche pas, sinon {score, v:{p,f}} (v = variante nécessaire pour matcher)
  function matchQ(r,toks){
    var hay=hayOf(r), score=0, v={};
    for(var i=0;i<toks.length;i++){
      var t=toks[i];
      if(r._hayN.indexOf(t)>=0){ score+=3; continue; }
      if(hay.indexOf(t)>=0){ score+=2; continue; }
      var vh=varHay(r), hit=null;
      for(var j=0;j<vh.length;j++){ if(vh[j].txt.indexOf(t)>=0){ hit=vh[j]; break; } }
      if(!hit) return null;
      if(v[hit.type]&&v[hit.type]!==hit.k) return null; // deux viandes différentes demandées : impossible
      v[hit.type]=hit.k; score+=1;
    }
    return {score:score,v:v};
  }
  /* ── 🧺 « Ce que j'ai sous la main » (29/08) : elle coche ce qu'il y a dans le frigo → les plats faisables
     (tous leurs ingrédients principaux couverts, une variante peut aider), puis ceux à UN ingrédient près. */
  var PANTRY=[
   ['Protéines',[['poulet','Poulet',['poulet','cuisse','dinde']],['boeuf','Bœuf',['boeuf','boeuffin','steak']],['porc','Porc',['porc']],['saumon','Saumon',['saumon','saumoncru']],['poisson','Poisson blanc',['cabillaud','dorade']],['thon','Thon',['thon']],['sardine','Sardines · maquereau',['sardine','maquereau']],['crevette','Crevettes',['crevette']],['tofu','Tofu',['tofu','tofusoy']],['oeuf','Œufs',['oeuf']],['fromage','Feta · fromage',['feta','halloumifr','mozza','chevre','ricotta','comte','parmesan']]]],
   ['Féculents',[['riz','Riz',['riz']],['pates','Pâtes',['pates']],['pdt','Pommes de terre',['pdt']],['patdouce','Patate douce',['patdouce']],['vermriz','Vermicelles de riz',['vermriz']],['boulgour','Boulgour · semoule',['boulgour','semoule']],['poischiche','Pois chiches · houmous',['poischiche','houmous']],['pain','Pain',['painbun']]]],
   ['Légumes',[['brocoli','Brocoli',['brocoli']],['courgette','Courgette',['courgette']],['poivron','Poivron',['poivron']],['epinard','Épinards',['epinard']],['champignon','Champignons',['champignon','enoki']],['hvert','Haricots verts',['hvert']],['chouchi','Chou chinois',['chouchi']],['tomate','Tomate',['tomate']],['chou','Chou',['chou','chourouge']],['choufleur','Chou-fleur',['choufleur']],['aubergine','Aubergine',['aubergine']],['asperge','Asperges',['asperge']],['poireau','Poireau',['poireau']],['fenouil','Fenouil',['fenouil']],['butternut','Butternut',['butternut']],['concombre','Concombre',['concombre']],['salade','Salade',['salade','roquette','endive']]]]
  ];
  var PID={}, PLABEL={}; PANTRY.forEach(function(g){ g[1].forEach(function(it){ PLABEL[it[0]]=it[1]; it[2].forEach(function(k){ PID[k]=it[0]; }); }); });
  function needs(r){ // ids pantry requis par la recette (ingrédients principaux uniquement)
    if(r._needs) return r._needs;
    // ingrédients principaux = ≥ 60 g (un œuf de panure, 25 g de feta ou l'oignon ne bloquent pas un plat)
    var out=[]; r.i.forEach(function(e){ var id=PID[e[0]]; if(id&&e[1]>=60&&out.indexOf(id)<0) out.push(id); });
    r._needs=out; return out;
  }
  // → {miss:[labels], v:{p,f}, used:n} — miss = ce qu'il manque après substitution par variante
  function pantryFit(r){
    var nd=needs(r), miss=[], v={}, used=0, pi=protOf(r), fi=fecOf(r);
    nd.forEach(function(id){
      if(have.has(id)){ used++; return; }
      // variante viande/poisson : elle a une autre protéine de la même famille ?
      if(pi&&PID[pi.k]===id){ var alt=null; pi.fam.forEach(function(k){ if(!alt&&PID[k]&&have.has(PID[k])) alt=k; }); if(alt){ v.p=alt; used++; return; } }
      if(fi&&PID[fi.k]===id){ var altf=null; SWAPF.forEach(function(k){ if(!altf&&PID[k]&&have.has(PID[k])) altf=k; }); if(altf){ v.f=altf; used++; return; } }
      miss.push(PLABEL[id]);
    });
    // féculent en OPTION (r.f) : pas exigé — mais si elle a un autre féculent, on le propose
    if(!fi||!fi.opt||!r.f){} else if(!have.has(PID[r.f[0]])){ var of=null; SWAPF.forEach(function(k){ if(!of&&PID[k]&&have.has(PID[k])) of=k; }); if(of) v.f=of; }
    return {miss:miss,v:v,used:used};
  }
  // Liste = [{r, v:{p,f}, miss:[...], score}] — v = variante à ouvrir, miss = ingrédients manquants (mode 🧺)
  function filtre(){
    var toks=q?tokens(q):[], pantry=fam==='plat'&&have.size>0;
    var rs=[];
    R.forEach(function(r){
      if(r.fam!==fam) return;
      if(isHidden(r)) return;
      if(filtres.has('favs')&&!isFav(r)) return;
      if(filtres.has('sansfec')&&aFec(r)) return;
      if(filtres.has('chaud')&&r.temp!=='chaud') return;
      if(filtres.has('froid')&&r.temp!=='froid') return;
      var o={r:r,v:{},miss:[],score:0};
      if(toks.length){ var m=matchQ(r,toks); if(!m) return; o.score=m.score; o.v=m.v; }
      if(pantry){
        var pf=pantryFit(r);
        if(!pf.used||pf.miss.length>1) return;
        o.miss=pf.miss; o.used=pf.used;
        if(pf.v.p&&!o.v.p) o.v.p=pf.v.p;
        if(pf.v.f&&!o.v.f) o.v.f=pf.v.f;
      }
      rs.push(o);
    });
    if(pantry) rs.sort(function(a,b){ return a.miss.length-b.miss.length || b.used-a.used || b.score-a.score || a.r.n.localeCompare(b.r.n); });
    else if(toks.length) rs.sort(function(a,b){ return b.score-a.score; });
    // « Protéiné » = TRI du plus protéiné au moins protéiné (demande Adrien), pas un filtre
    if(filtres.has('proteine')){
      var byP={}; rs.forEach(function(o){ byP[o.r.img]=nut(ingr(o.r,def(o.r),o.v)).p; });
      rs.sort(function(a,b){ return byP[b.r.img]-byP[a.r.img]; });
    }
    return rs;
  }
  function vTag(v){ // « version bœuf émincé · pâtes »
    var p=[]; if(v.p) p.push(PLBL[v.p]||F[v.p][0]); if(v.f) p.push((FLBL[v.f]||F[v.f][0]).toLowerCase());
    return p.length?'<span class="tag v">🔁 version '+p.join(' · ')+'</span>':'';
  }
  function hasVar(r){ return !!(protOf(r)||fecOf(r)); }
  function thumbCls(r){ return r.fam==='sucre'?'ts':(r.temp==='chaud'?'th':'tf'); }
  function rendrePantry(){
    var btn=$('n-have'), box=$('n-pantry'); if(!btn||!box) return;
    var show=fam==='plat'; btn.style.display=show?'':'none'; box.style.display=(show&&haveOpen)?'':'none';
    btn.className='pantry-btn'+(have.size?' on':'')+(haveOpen?' open':'');
    btn.innerHTML=(have.size?'🧺 '+have.size+' ingrédient'+(have.size>1?'s':'')+' sous la main':'🧺 Ce que j’ai sous la main')+'<span class="pb-arr">'+(haveOpen?'▴':'▾')+'</span>';
    if(!show||!haveOpen) return;
    box.innerHTML='<p class="hint" style="margin-bottom:6px">Coche ce que tu as dans le frigo : je te montre les plats que tu peux cuisiner (et ceux à un ingrédient près).</p>'
      +PANTRY.map(function(g){
        return '<div class="grp"><h4>'+g[0]+'</h4><div class="pick">'
          +g[1].map(function(it){ return '<button data-h="'+it[0]+'" class="'+(have.has(it[0])?'on':'')+'">'+it[1]+'</button>'; }).join('')
          +'</div></div>';
      }).join('')
      +(have.size?'<button class="pclear" data-hclear="1" type="button">Tout décocher</button>':'');
  }
  function rendreListe(){
    var rs=filtre();
    var nh=hidden().filter(function(k){ return rByKey(k)&&rByKey(k).fam===fam; }).length;
    var pantry=fam==='plat'&&have.size>0;
    var cnt;
    if(pantry){
      var ok=rs.filter(function(o){return !o.miss.length;}).length, near=rs.length-ok;
      cnt=(ok?ok+' plat'+(ok>1?'s':'')+' possible'+(ok>1?'s':''):'Aucun plat complet')+(near?' · '+near+' à 1 ingrédient près':'');
    } else cnt=rs.length+(rs.length>1?' recettes':' recette');
    $('n-count').innerHTML=cnt+(filtres.has('proteine')?' · triées par protéines':'')
      +(nh?' <button class="undo" type="button">↺ '+nh+' retirée'+(nh>1?'s':'')+'</button>':'');
    rendrePantry();
    var sep=false;
    $('n-list').innerHTML = rs.length? rs.map(function(o,ix){
      var r=o.r, n=nut(ingr(r,def(r),o.v)), h='';
      if(pantry&&o.miss.length&&!sep){ sep=true; h+='<p class="eyebrow" style="margin:14px 0 6px">À un ingrédient près</p>'; }
      return h+'<button class="rc" data-i="'+R.indexOf(r)+'"'+(o.v.p?' data-vp="'+o.v.p+'"':'')+(o.v.f?' data-vf="'+o.v.f+'"':'')+' style="animation-delay:'+Math.min(ix,12)*40+'ms">'
        +'<span class="thumb '+thumbCls(r)+'"><img src="'+IMG[r.img]+'" alt="" loading="lazy"></span>'
        +'<span class="rb">'
        +'<span class="rtop"><h3>'+r.n+(isFav(r)?' <i class="hrt">♥</i>':'')+'</h3><span class="stars">'+etoiles(r)+'</span></span>'
        +'<span class="meta">'
        +(r.t<=20?'<span class="tag e">Express</span>':'')
        +'<span class="tag '+(r.temp==='chaud'?'h':'c')+'">'+(r.temp==='chaud'?'Chaud':'Froid')+'</span>'
        +'<span class="tag">'+r.t+' min</span>'
        +(r.f?'<span class="tag">2 versions</span>':'')
        +vTag(o.v)
        +(!o.v.p&&!o.v.f&&hasVar(r)?'<span class="tag v">🔁</span>':'')
        +(o.miss.length?'<span class="tag miss">il manque : '+o.miss.join(', ')+'</span>':'')
        +'</span>'
        +'<span class="kc"><b>'+n.k+' kcal</b> · <b class="kp">'+n.p+' g</b> de protéines</span>'
        +'</span></button>';
    }).join('')
    : '<p class="empty"><span class="big">🥕</span>'+(pantry?'Rien de complet avec ça pour l’instant.<br>Coche un féculent ou une protéine en plus.':'Aucune recette ne correspond.<br>Retire un filtre ou change ta recherche.')+'</p>';
  }

  /* ---------- fiche recette ---------- */
  var cur=null, fec=false, rmArm=false, rmT=null, vP=null, vF=null;
  function ouvrir(i,v){ cur=R[i]; fec=def(cur); rmArm=false; vP=(v&&v.p)||null; vF=(v&&v.f)||null; dessine(); $('n-veil').classList.add('on'); $('n-sheet').classList.add('on'); }
  function curV(){ var v={}; if(vP) v.p=vP; if(vF) v.f=vF; return v; }
  function fermer(){ rmArm=false; clearTimeout(rmT); $('n-veil').classList.remove('on'); $('n-sheet').classList.remove('on'); $('n-pick').classList.remove('on'); cur=null; }
  function ligne(e){
    var k=e[0],g=e[1],u=e[2];
    return '<div class="ing"><i>'+F[k][0]+'</i>'+(u?'<b class="u">'+u+'</b>':'<b>'+g+' g</b>')+'</div>';
  }
  function dessine(){
    var r=cur, v=curV(), l=ingr(r,fec,v), n=nut(l), pi=protOf(r), fi=fecOf(r);
    var curF=(fi&&fi.opt)?(vF||r.f[0]):null;
    var varH='';
    if(pi||fi){
      varH+='<p class="eyebrow" style="margin:18px 0 6px">🔁 Variantes — même plat, autre viande ou féculent</p>';
      if(pi) varH+='<div class="grp" style="margin-top:6px"><h4>'+(pi.fam===FISH?'Poisson':'Viande')+'</h4><div class="pick">'
        +pi.fam.map(function(k){ var on=(vP||pi.k)===k; return '<button data-vp="'+k+'" class="'+(on?'on':'')+'">'+(PLBL[k]||F[k][0])+'</button>'; }).join('')+'</div></div>';
      if(fi) varH+='<div class="grp" style="margin-top:8px"><h4>Féculent'+(fi.opt?' (en option)':'')+'</h4><div class="pick">'
        +SWAPF.map(function(k){ var on=(vF||fi.k)===k; return '<button data-vf="'+k+'" class="'+(on?'on':'')+'">'+FLBL[k]+'</button>'; }).join('')+'</div></div>';
      var notes=[];
      if(vP&&pi&&vP!==pi.k) notes.push('dans les étapes, remplace « '+F[pi.k][0].toLowerCase()+' » par « '+F[vP][0].toLowerCase()+' » — même découpe, '+(COOK[vP]||'même cuisson'));
      if(vF&&fi&&vF!==fi.k) notes.push('féculent : « '+F[fi.k][0].toLowerCase()+' » → « '+F[vF][0].toLowerCase()+' », même poids cru, cuisson à part selon le paquet');
      if(notes.length) varH+='<p class="adj" style="margin-top:8px">🔁 Version adaptée : '+notes.join(' · ')+'. Macros recalculées.</p>';
    }
    $('n-sh').innerHTML=
      '<div class="hero">'
      +'<button class="fav'+(isFav(r)?' on':'')+'" id="n-fav" aria-label="Favori">♥</button>'
      +'<button class="x" id="n-x" aria-label="Fermer">✕</button>'
      +'<div class="disc '+thumbCls(r)+'"><img src="'+IMG[r.img]+'" alt=""></div></div>'
      +'<div class="sh">'
      +'<h2>'+r.n+'</h2>'
      +'<div class="shstars">'+etoiles(r)+'</div>'
      +'<div class="meta" style="justify-content:center;margin-top:10px">'
      +(r.t<=20?'<span class="tag e">Express</span>':'')
      +'<span class="tag '+(r.temp==='chaud'?'h':'c')+'">'+(r.temp==='chaud'?'Chaud':'Froid')+'</span>'
      +'<span class="tag">'+r.t+' min</span>'
      +(typeDe(r)==='proteine'?'<span class="tag p">Protéiné</span>':'')
      +'</div>'
      +'<p class="why">'+r.w+'</p>'
      +(r.f?'<div class="seg" style="margin-top:14px">'
        +'<button class="'+(!fec?'on':'')+'" id="n-f0">Sans féculent</button>'
        +'<button class="'+(fec?'on':'')+'" id="n-f1">'+fecLabel(curF||r.f[0])+'</button></div>':'')
      +'<div class="macros">'
      +'<div class="m t a"><b>'+n.k+'</b><small>kcal</small></div>'
      +'<div class="m t b"><b>'+n.p+'</b><small>prot.</small></div>'
      +'<div class="m t c"><b>'+n.l+'</b><small>lip.</small></div>'
      +'<div class="m t d"><b>'+n.g+'</b><small>gluc.</small></div>'
      +'</div>'
      +varH
      +'<p class="eyebrow" style="margin:22px 0 2px">Ingrédients</p>'
      +l.map(ligne).join('')
      +'<p class="adj">Quantités ajustées à '+Math.round(poids*10)/10+' kg</p>'
      +(typeof NP!=='undefined'?NP.flavorHtml({fam:r.fam,text:l.map(function(e){return F[e[0]]?F[e[0]][0]:'';}).join(' ')+' '+r.s.join(' ')}):'')
      +'<p class="eyebrow" style="margin:24px 0 2px">Préparation</p>'
      +'<ol class="steps">'+r.s.map(function(st){return '<li>'+st+'</li>';}).join('')+'</ol>'
      +(r.custom?'<button class="np-editbtn" type="button" onclick="NP.openEdit(\''+r.img+'\')">✏️ Modifier mon plat</button>'
        :'<button class="rm" id="n-del" type="button">Retirer cette recette de l’app</button>')
      +'</div>';
    $('n-x').onclick=fermer;
    // Retirer = 2 taps (anti miss-click) : 1er tap arme le bouton 6 s, 2e tap confirme → la recette disparaît (↺ dans le compteur pour tout remettre)
    if($('n-del')) $('n-del').onclick=function(){
      var b=$('n-del');
      if(!rmArm){ rmArm=true; b.classList.add('arm'); b.textContent='Sûre ? Touche encore une fois — elle disparaît de l’app';
        clearTimeout(rmT); rmT=setTimeout(function(){ rmArm=false; var bb=$('n-del'); if(bb){ bb.classList.remove('arm'); bb.textContent='Retirer cette recette de l’app'; } },6000); return; }
      clearTimeout(rmT); hideR(r); fermer(); rendreListe(); rendreJournee();
    };
    $('n-fav').onclick=function(){ toggleFav(r); dessine(); rendreListe(); };
    if(r.f){ $('n-f0').onclick=function(){fec=false;dessine();}; $('n-f1').onclick=function(){fec=true;dessine();}; }
    // variantes : on redessine en gardant la position de lecture
    $('n-sh').onclick=function(e){
      var bp=e.target.closest('[data-vp]'), bf=e.target.closest('[data-vf]'); if(!bp&&!bf) return;
      if(bp){ vP=bp.dataset.vp===(pi&&pi.k)?null:bp.dataset.vp; }
      if(bf){ vF=bf.dataset.vf===(fi&&fi.k)?null:bf.dataset.vf; if(fi&&fi.opt&&vF) fec=true; }
      var sc=$('n-sheet').scrollTop; dessine(); $('n-sheet').scrollTop=sc;
    };
  }

  /* ---------- journée (persistée par date → cloud) ---------- */
  var SLOTS={dej:{t:'Déjeuner',fam:'plat',pct:0.345},din:{t:'Dîner',fam:'plat',pct:0.345},
             col:{t:'Collation 16h30',fam:'sucre',pct:0.145},ext:{t:'Dessert / extra',fam:'sucre',pct:0.165,opt:true}};
  var pickSlot=null;
  function J(){
    var t=todayStr();
    if(!DB.nutJ||DB.nutJ.date!==t) DB.nutJ={date:t,dej:null,din:null,col:null,ext:null};
    return DB.nutJ;
  }
  // les recettes de la journée sont référencées par leur clé d'image (stable), pas par index
  function rByKey(key){ for(var i=0;i<R.length;i++) if(R[i].img===key) return R[i]; return null; }
  function rendreJournee(){
    var c=cibles(poids), j=J();
    Object.keys(SLOTS).forEach(function(s){
      var el=$('n-slot-'+s), cfg=SLOTS[s], sel=j[s];
      var inner='<div class="slot-h"><h4>'+cfg.t+'</h4><small class="num">~'+Math.round(c.kcal*cfg.pct/10)*10+' kcal'+(cfg.opt?' · optionnel':'')+'</small></div>';
      var r=sel?rByKey(sel.k):null;
      if(!r) inner+='<button class="slot-add" data-slot="'+s+'">+ Choisir '+(cfg.fam==='plat'?'un plat':'une recette sucrée')+'</button>';
      else{
        var n=nut(ingr(r,sel.fec));
        inner+='<div class="slot-r">'
          +'<img src="'+IMG[r.img]+'" alt="">'
          +'<div class="slot-b"><b>'+r.n+'</b><span>'+n.k+' kcal · '+n.p+' g prot.</span>'
          +(r.f?'<button class="fchip '+(sel.fec?'on':'')+'" data-fec="'+s+'">'+(sel.fec?'✓ ':'')+FECLABEL[r.f[0]]+'</button>':'')+'</div>'
          +'<button class="slot-x" data-del="'+s+'" aria-label="Retirer">✕</button>'
          +'</div>';
      }
      el.innerHTML=inner;
    });
    var tot={k:0,p:0,l:0,g:0}, nb=0;
    Object.keys(SLOTS).forEach(function(s){
      var sel=j[s]; if(!sel) return;
      var r=rByKey(sel.k); if(!r) return;
      var n=nut(ingr(r,sel.fec)); tot.k+=n.k;tot.p+=n.p;tot.l+=n.l;tot.g+=n.g; nb++;
    });
    // Tuile macro « atteint / cible » : léger manque = toujours vert · gros dépassement = alerte (demande Adrien)
    function jm(val,cible,lbl,type){
      var cls='ok';
      if(type==='pro') cls = val>=cible*0.85 ? 'ok' : 'low';               // les protéines en plus, c'est toujours bien
      else if(type==='lip') cls = val>cible+25 ? 'high' : (val<45&&nb>=3 ? 'low' : 'ok');
      else cls = val>cible*1.15 ? 'high' : 'ok';                            // glucides : seul l'excès pose question
      return '<div class="jm '+cls+'"><b class="num">'+val+'<i>/'+cible+'</i></b><small>'+lbl+'</small></div>';
    }
    var html='<p class="eyebrow">Bilan de la journée · '+fmtShort(j.date)+'</p>';
    if(nb<3){
      html+='<p class="hint">Choisis au moins le déjeuner, le dîner et la collation pour voir ta note.</p>';
      if(nb>0){
        var ck=tot.k>c.kcal?'high':'ok';
        html+='<div class="jmacros" style="margin-top:12px">'
          +'<div class="jm '+ck+'"><b class="num">'+tot.k+'<i>/'+c.kcal+'</i></b><small>kcal</small></div>'
          +jm(tot.p,c.pro,'prot.','pro')+jm(tot.l,c.lip,'lip.','lip')+jm(tot.g,c.glu,'gluc.','glu')+'</div>';
      }
    } else {
      var res=noteJour(tot);
      var ncl=res.n>=8?'g':res.n>=5?'y':'r';
      var kcl=tot.k>c.kcal?'high':(tot.k<c.kcal-250?'low':'ok');
      html+='<div class="jhero">'
        +'<div class="jnote '+ncl+'"><b class="num">'+res.n+'</b><small>/10</small></div>'
        +'<div class="jkcal '+kcl+'"><b class="num">'+tot.k+'</b><span>/ '+c.kcal+' kcal</span><em>ta zone : '+(c.kcal-200)+' – '+c.kcal+'</em></div>'
        +'</div>'
        +'<div class="jmacros">'+jm(tot.p,c.pro,'protéines','pro')+jm(tot.l,c.lip,'lipides','lip')+jm(tot.g,c.glu,'glucides','glu')+'</div>'
        +'<div class="jdebrief">'+res.ex.map(function(e){
          return '<div class="jd '+(e.ok?'ok':'warn')+'"><span class="jdi">'+(e.ok?'✓':'!')+'</span><p>'+e.t+'</p></div>';
        }).join('')+'</div>';
    }
    $('n-bilan').innerHTML=html;
  }
  function noteJour(tot){
    var c=cibles(poids), n=10, ex=[];
    if(tot.k>c.kcal){ var d=tot.k-c.kcal; n-=Math.ceil(d/60);
      ex.push({ok:false,t:'Tu dépasses ta cible de '+d+' kcal — allège un repas ou retire l’extra.'}); }
    else if(tot.k<c.kcal-250){ var d2=c.kcal-250-tot.k; n-=Math.ceil(d2/120);
      ex.push({ok:false,t:'Journée très légère ('+tot.k+' kcal). Pas un drame — mais demain tu manges normalement, ni plus ni moins.'}); }
    else ex.push({ok:true,t:'Calories dans ta zone ('+tot.k+' / '+(c.kcal-200)+'–'+c.kcal+' kcal).'});
    if(tot.p<c.pro*0.85){ var d3=Math.round(c.pro*0.85-tot.p); n-=Math.ceil(d3/12);
      ex.push({ok:false,t:'Il manque ~'+d3+' g de protéines — ajoute du skyr, des œufs ou grossis une portion de viande.'}); }
    else ex.push({ok:true,t:'Protéines couvertes ('+tot.p+' g / '+c.pro+' g).'});
    if(tot.l<45){ n-=1; ex.push({ok:false,t:'Lipides trop bas ('+tot.l+' g) — ajoute ½ avocat ou des amandes. Vital pour tes hormones.'}); }
    else if(tot.l>c.lip+25){ n-=1; ex.push({ok:false,t:'Lipides élevés ('+tot.l+' g) — vérifie les doses d’huile de la journée.'}); }
    else ex.push({ok:true,t:'Lipides dans la zone ('+tot.l+' g).'});
    return {n:Math.max(1,Math.min(10,n)),ex:ex};
  }
  function ouvrirPick(slot){
    pickSlot=slot;
    var cfg=SLOTS[slot], c=cibles(poids), j=J();
    // Suggestion « dernier repas » (24/08, parité MASSUP) : si le reste de la journée est
    // déjà choisi, on met en tête les recettes qui complètent le mieux la zone kcal +
    // protéines. Wording toujours positif — jamais culpabilisant.
    var tot={k:0,p:0}, nbAutres=0, resteNonOpt=0;
    Object.keys(SLOTS).forEach(function(s){
      if(s===slot) return;
      var sel=j[s], rr=sel?rByKey(sel.k):null;
      if(rr){ var n0=nut(ingr(rr,sel.fec)); tot.k+=n0.k; tot.p+=n0.p; nbAutres++; }
      else if(!SLOTS[s].opt) resteNonOpt++;
    });
    var sugg='';
    if(!j[slot] && nbAutres>=2 && resteNonOpt===0){
      var needK=c.kcal-tot.k, pNeed=Math.max(0,c.pro-tot.p);
      var scored=R.map(function(r,i){return {r:r,i:i};}).filter(function(o){return o.r.fam===cfg.fam&&!isHidden(o.r);})
        .map(function(o){
          var n=nut(ingr(o.r,def(o.r)));
          var s=-Math.abs(n.k-needK)/8 + Math.min(n.p,pNeed)/6;
          if(n.k>needK) s-=(n.k-needK)/8;
          return {o:o,n:n,s:s};
        }).sort(function(a,b){return b.s-a.s;}).slice(0,3);
      if(scored.length){
        sugg='<p class="eyebrow" style="margin:2px 0 8px">✨ Pour compléter ta journée · ~'+Math.max(0,Math.round(needK/10)*10)+' kcal de place</p>'
          +scored.map(function(x){
            var after=tot.k+x.n.k;
            var why=(after<=c.kcal&&after>=c.kcal-200?'finit ta journée pile dans ta zone 🌸':'journée à '+after+' / '+c.kcal+' kcal')
              +(pNeed>0&&x.n.p>=10?' · +'+x.n.p+' g de protéines':'');
            return '<button class="pickrow sug" data-pick="'+x.o.i+'">'
              +'<img src="'+IMG[x.o.r.img]+'" alt="" loading="lazy">'
              +'<span style="flex:1;min-width:0"><b>'+x.o.r.n+(isFav(x.o.r)?' <i class="hrt">♥</i>':'')+'</b><span>'+x.n.k+' kcal · '+x.n.p+' g prot. · '+x.o.r.t+' min</span>'
              +'<i class="sugwhy">'+why+'</i></span></button>';
          }).join('')
          +'<p class="eyebrow" style="margin:14px 0 8px">Toutes les recettes</p>';
      }
    }
    $('n-pk').innerHTML='<h2 style="font-size:19px;margin-bottom:4px">'+cfg.t+'</h2>'
      +'<p class="hint" style="margin-bottom:10px">Touche une recette pour la choisir.</p>'
      +sugg
      +R.map(function(r,i){return {r:r,i:i};}).filter(function(o){return o.r.fam===cfg.fam&&!isHidden(o.r);}).map(function(o){
        var n=nut(ingr(o.r,def(o.r)));
        return '<button class="pickrow" data-pick="'+o.i+'">'
          +'<img src="'+IMG[o.r.img]+'" alt="" loading="lazy">'
          +'<span style="flex:1;min-width:0"><b>'+o.r.n+(isFav(o.r)?' <i class="hrt">♥</i>':'')+'</b><span>'+n.k+' kcal · '+n.p+' g prot. · '+o.r.t+' min</span></span>'
          +'</button>';
      }).join('');
    $('n-veil').classList.add('on'); $('n-pick').classList.add('on');
    $('n-pick').scrollTop=0;
  }

  /* ---------- calculateur ---------- */
  var r5=function(n){return Math.max(5,Math.round(n/5)*5);}, r10=function(n){return Math.max(20,Math.round(n/10)*10);};
  function majCible(){
    var c=cibles(poids), m=MEALS[meal];
    var el=$('n-ct'); if(el) el.textContent=Math.round(c.kcal*m.k/10)*10+' kcal · '+Math.round(c.pro*m.p/5)*5+' g de protéines';
  }
  function rendrePicker(){
    $('n-picker').innerHTML=CAT.map(function(c){
      return '<div class="grp"><h4>'+c[0]+'</h4><div class="pick">'
        +c[1].map(function(k){return '<button data-k="'+k+'" class="'+(picked.has(k)?'on':'')+'">'+F[k][0]+'</button>';}).join('')
        +'</div></div>';
    }).join('');
    $('n-go').disabled=picked.size===0;
  }
  function calculer(){
    var c=cibles(poids), m=MEALS[meal];
    var kc=Math.round(c.kcal*m.k), pc=Math.round(c.pro*m.p);
    var sel=Array.from(picked), by=function(r){return sel.filter(function(k){return ROLE[k]===r;});};
    var pro=by('Protéines'), fecs=by('Féculents'), lgm=by('Légumineuses'), gr=by('Matière grasse');
    var legs=by('Légumes').filter(function(k){return VEG[k];}), aro=by('Légumes').filter(function(k){return AROMATE[k];});
    var out=[];
    if(pro.length){ var per=pc/pro.length; pro.forEach(function(k){ out.push([k,r5(per/(F[k][2]/100))]); }); }
    if(legs.length){
      var som=legs.reduce(function(s,k){return s+VEG[k][0];},0), coef=Math.min(1.15,300/som);
      legs.forEach(function(k){ out.push([k,Math.min(VEG[k][1],r10(VEG[k][0]*coef))]); });
    }
    aro.forEach(function(k){ out.push([k,AROMATE[k]]); });
    if(lgm.length){ var per2=150/lgm.length; lgm.forEach(function(k){ out.push([k,r10(per2)]); }); }
    if(gr.length) out.push([gr[0],DOSE[gr[0]]]);
    if(fecs.length){
      var reste=kc-nut(out).k;
      fecs.forEach(function(k){
        var g=Math.max(0,Math.min(CAP[k],Math.round(reste/fecs.length/(F[k][1]/100)/5)*5));
        if(g>0) out.push([k,g]);
      });
    }
    var n=nut(out), d=kc-n.k;
    // Verdict clair : vert = bon, jaune = il reste de la place, corail = au-dessus (demande Adrien : « qu'on comprenne si c'est bien ou non »)
    var vcl,vico,vtxt;
    if(Math.abs(d)<=70){ vcl='v-ok'; vico='✓'; vtxt='<b>C’est bon, tu peux cuisiner.</b> Ce repas est pile dans ta cible.'; }
    else if(d>0){ vcl='v-low'; vico='＋'; vtxt='<b>Il te reste '+Math.round(d/10)*10+' kcal</b> sur ce repas — ajoute une matière grasse (1 c. à soupe d’huile = 90 kcal), grossis une portion, ou garde-les pour ton dessert.'; }
    else { vcl='v-high'; vico='−'; vtxt='<b>Tu es '+Math.abs(Math.round(d/10)*10)+' kcal au-dessus.</b> Retire la matière grasse, ou choisis une protéine plus maigre.'; }
    var kcl=Math.abs(d)<=70?'ok':(d>0?'low':'high');
    var pcl=n.p>=pc*0.85?'ok':'low';
    $('n-res').innerHTML='<div class="card" style="margin-top:14px">'
      +'<p class="eyebrow">Tes quantités</p>'
      +out.map(function(e){
        var k=e[0],g=e[1];
        var u=UNITE[k]; var extra=k==='oeuf'?Math.round(g/50)+' œufs':(k==='riz'||k==='pates')?g+' g crus':null;
        return '<div class="ing"><i>'+F[k][0]+'</i>'+(u?'<b class="u">'+u+'</b>':'<b>'+(extra||g+' g')+'</b>')+'</div>';
      }).join('')
      +'<div class="jmacros" style="margin:14px 0 10px">'
      +'<div class="jm '+kcl+'"><b class="num">'+n.k+'<i>/'+Math.round(kc/10)*10+'</i></b><small>kcal</small></div>'
      +'<div class="jm '+pcl+'"><b class="num">'+n.p+'<i>/'+pc+'</i></b><small>protéines</small></div>'
      +'<div class="jm ok"><b class="num">'+n.l+'</b><small>lipides</small></div>'
      +'<div class="jm ok"><b class="num">'+n.g+'</b><small>glucides</small></div>'
      +'</div>'
      +'<div class="verdict '+vcl+'"><span class="vi">'+vico+'</span><p>'+vtxt+'</p></div>'
      +'</div>';
  }

  /* ---------- init + événements ---------- */
  function bind(){
    document.querySelectorAll('#nutri .tab').forEach(function(b){ b.onclick=function(){
      document.querySelectorAll('#nutri .tab').forEach(function(x){x.classList.remove('on');});
      document.querySelectorAll('#nutri .pane').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on'); $('n-p-'+b.dataset.p).classList.add('on'); $('nutri').scrollTop=0;
      if(b.dataset.p==='semaine'&&typeof NP!=='undefined') NP.renderWeek();
    };});
    document.querySelectorAll('#nutri [data-fam]').forEach(function(b){ b.onclick=function(){
      document.querySelectorAll('#nutri [data-fam]').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on'); fam=b.dataset.fam; rendreListe();
    };});
    document.querySelectorAll('#nutri [data-meal]').forEach(function(b){ b.onclick=function(){
      document.querySelectorAll('#nutri [data-meal]').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on'); meal=b.dataset.meal; majCible(); if(picked.size) calculer();
    };});
    $('n-q').addEventListener('input',function(e){ q=e.target.value.trim(); rendreListe(); });
    $('n-q').setAttribute('placeholder','Chercher… ex : riz poulet, pâtes bœuf');
    $('n-filters').onclick=function(e){
      var b=e.target.closest('.chip'); if(!b) return;
      var f=b.dataset.f, opp={chaud:'froid',froid:'chaud'};
      if(filtres.has(f)) filtres.delete(f); else { filtres.add(f); if(opp[f]) filtres.delete(opp[f]); }
      document.querySelectorAll('#nutri .chip').forEach(function(c){ c.classList.toggle('on',filtres.has(c.dataset.f)); });
      rendreListe();
    };
    $('n-list').onclick=function(e){ var b=e.target.closest('.rc'); if(b) ouvrir(+b.dataset.i,{p:b.dataset.vp||null,f:b.dataset.vf||null}); };
    $('n-have').onclick=function(){ haveOpen=!haveOpen; rendrePantry(); };
    $('n-pantry').onclick=function(e){
      var c=e.target.closest('[data-hclear]'); if(c){ have.clear(); rendreListe(); return; }
      var b=e.target.closest('[data-h]'); if(!b) return;
      var id=b.dataset.h; if(have.has(id)) have.delete(id); else have.add(id);
      rendreListe();
    };
    $('n-count').onclick=function(e){ if(e.target.closest('.undo')){ DB.nutHidden=[]; saveDB(); rendreListe(); } };
    $('n-veil').onclick=fermer;
    $('n-p-journee').onclick=function(e){
      var add=e.target.closest('[data-slot]'); if(add){ ouvrirPick(add.dataset.slot); return; }
      var del=e.target.closest('[data-del]'); if(del){ J()[del.dataset.del]=null; saveDB(); rendreJournee(); return; }
      var fc=e.target.closest('[data-fec]'); if(fc){ var s=fc.dataset.fec; J()[s].fec=!J()[s].fec; saveDB(); rendreJournee(); return; }
    };
    $('n-pk').onclick=function(e){
      var b=e.target.closest('[data-pick]'); if(!b) return;
      var rp=R[+b.dataset.pick]; J()[pickSlot]={k:rp.img,fec:def(rp)};
      saveDB();
      $('n-pick').classList.remove('on'); $('n-veil').classList.remove('on');
      rendreJournee();
    };
    $('n-picker').onclick=function(e){
      var b=e.target.closest('[data-k]'); if(!b) return;
      var k=b.dataset.k; picked.has(k)?picked.delete(k):picked.add(k);
      rendrePicker(); picked.size?calculer():$('n-res').innerHTML='';
    };
    $('n-go').onclick=calculer;
  }
  /* ── NUTRI+ (29/09) : adaptateur Melati pour nutriplus.js (mes plats · ma semaine + courses · gestes goût) ── */
  var RAY={}; [['poulet','cuisse','dinde','boeuf','boeuffin','steak','porc','saumon','saumoncru','cabillaud','dorade','thon','sardine','maquereau','crevette'],
    ['oeuf','skyr','lait','yaourtgrec','fromblanc','ricotta','feta','comte','parmesan','mozza','chevre','halloumifr','tofu','tofusoy','whey'],
    [],['riz','pates','pdt','patdouce','boulgour','vermriz','galetteriz','painbun','panko','semoule','poischiche','mungo','edamame']]
    .forEach(function(ks,ri){ ks.forEach(function(k){ RAY[k]=ri; }); });
  CAT.forEach(function(c){ if(c[0]==='Légumes') c[1].forEach(function(k){ RAY[k]=2; }); });
  ['concombre','salade','roquette','enoki','pousse','bambou','avocat','citron','herbes','banane','pomme','poire','kiwi','fraise','framboise','myrtille','peche','abricot','orange','mangue','melon','raisin','figue','clementine','prune','pamplemousse','pasteque','grenade','passion','dragon','radis','endive','celeri','chourouge'].forEach(function(k){ if(RAY[k]==null) RAY[k]=2; });
  ['huile','sel','poivre','ail','herbes'].forEach(function(k){ if(RAY[k]==null||k==='huile'||k==='ail') RAY[k]=5; });
  var _pc=null,_pt=0;
  function npPlats(){
    if(_pc&&Date.now()-_pt<1500) return _pc;
    _pc=R.filter(function(r){return r.fam==='plat';}).map(function(r){
      var n=nut(ingr(r,def(r))), pi=protOf(r);
      return {id:r.img,n:r.n,thumb:'<img class="np-th" src="'+IMG[r.img]+'" alt="" loading="lazy">',kcal:n.k,p:n.p,temp:r.temp,fav:isFav(r),hidden:isHidden(r),prot:pi?pi.k:null,score:densite(r),custom:!!r.custom};
    }); _pt=Date.now(); return _pc;
  }
  var NP_AD={app:'melati',root:'nutri',weekPane:'n-p-semaine',weekTab:'semaine',recipesBox:'n-p-recettes',defaultMode:'soirmidi',
    store:function(){ if(!DB.np) DB.np={}; return DB.np; }, save:function(){ _pc=null; saveDB(); },
    toast:function(m){ showToast(m); }, closeFiche:function(){ fermer(); },
    plats:npPlats,
    open:function(id){ var r=rByKey(id); if(r) ouvrir(R.indexOf(r)); },
    ingredients:function(id,n){
      var r=rByKey(id); if(!r) return [];
      return ingr(r,def(r)).map(function(e){
        var k=e[0], f=F[k]||[k], g=e[1]*n;
        if(k==='oeuf') return {key:k,name:'Œufs',qty:Math.max(1,g/55),unit:'œufs',ray:1};
        return {key:k,name:f[0],qty:g,unit:'g',ray:RAY[k]!=null?RAY[k]:4};
      });
    },
    syncCustom:function(list,h){
      for(var i=R.length-1;i>=0;i--) if(R[i].custom) R.splice(i,1);
      list.forEach(function(d){
        var por=Math.max(1,d.por||1);
        var ii=(d.ing||[]).map(function(e,j){ var k=e.k; if(!k||!F[k]){ k='cx_'+d.id+'_'+j; F[k]=[e.name||'Ingrédient',(e.m||[])[0]||0,(e.m||[])[1]||0,(e.m||[])[2]||0,(e.m||[])[3]||0]; } return [k,Math.max(1,Math.round(e.g/por)),0]; });
        R.push({n:d.n,img:d.id,fam:d.fam||'plat',t:d.t||20,temp:d.temp||'chaud',f:null,i:ii,s:(d.steps&&d.steps.length)?d.steps:['Suis ta recette 💗'],w:'Ton plat perso — macros calculées sur tes ingrédients.',custom:true});
        IMG[d.id]=d.photo||h.placeholder('🍽️');
      });
      _pc=null;
    },
    refresh:function(){ _pc=null; rendreListe(); rendreJournee(); var wp=$('n-p-semaine'); if(wp&&wp.classList.contains('on')) NP.renderWeek(); }
  };
  function nutInit(){
    if(inited) return;
    inited=true;
    if(typeof NP!=='undefined') NP.init(NP_AD);
    bind();
    rendrePicker();
  }
  function nutOpen(){
    nutInit();
    if(typeof NP!=='undefined') NP.sync(); // plats perso (après une adoption cloud, DB a pu changer)
    syncPoids();
    majProfil(); rendreListe(); rendreJournee();
    $('nutri').classList.add('on');
    document.body.style.overflow='hidden';
  }
  function nutClose(){
    fermer();
    $('nutri').classList.remove('on');
    document.body.style.overflow='';
  }
  return {open:nutOpen,close:nutClose,_filtre:filtre,_have:have,_setFam:function(f){fam=f;},_setQ:function(v){q=v;},_ingr:ingr,_nut:nut,_R:R};
})();
function nutOpen(){ NUTRI.open(); }
function nutClose(){ NUTRI.close(); }
