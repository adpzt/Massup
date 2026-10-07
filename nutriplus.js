"use strict";
/* ═══ NUTRI+ (29/09/2026) — commun aux deux modes Nutrition (Adrien = nutria.js · Melati = nutrition.js) ═══
   Demandes Adrien du 28/09 :
   ① « ＋ Créer mon plat » : nom, photo, ingrédients + grammages, étapes → macros calculées sur la table d'aliments.
   ② Onglet « Semaine » : 7 jours midi + soir proposés depuis les FAVORIS, modes « soir → lendemain midi »
      et « grosse session = 4 repas », 🔒 verrouiller · ✕ retirer · ↻ remplacer · « Reproposer », puis la
      LISTE DE COURSES agrégée (quantités, grammages, par rayon, cochable).
   ③ « Les gestes goût » sur chaque fiche : épices revenues dans le gras, déglaçage, acidité finale,
      assaisonnement par couches… choisis selon les ingrédients du plat.
   ZÉRO API, zéro IA : tout est déterministe (tirage à graine, règles). Chaque app fournit un ADAPTATEUR
   (NP.init) — les données restent dans SA base (DB → user_state → cloud). */
var NP=(function(){
  var A=null, $=function(id){ return document.getElementById(id); };
  function norm(s){ return String(s||'').toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[̀-ͯ]/g,''); }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function fr(n){ return String(n).replace('.',','); }
  var JOURS=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'], J3=['L','M','M','J','V','S','D'];
  function ymd(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function monOf(d){ d=new Date(d); d.setHours(12,0,0,0); d.setDate(d.getDate()-((d.getDay()+6)%7)); return ymd(d); }
  function addD(s,n){ var d=new Date(s+'T12:00:00'); d.setDate(d.getDate()+n); return ymd(d); }
  function dm(s){ var p=s.split('-'); return p[2]+'/'+p[1]; }
  function rng(seed){ var a=seed>>>0; return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

  /* ── Table d'aliments (kcal, prot, lip, gluc / 100 g) : celle de NUTRITI·ON (Melati), copiée pour Adrien ── */
  var FOODS_EMB={"poulet":["Filet de poulet",110,23,1.5,0],"cuisse":["Cuisse de poulet",130,21,5,0],"boeuf":["Bœuf haché 5%",137,21,5,0],"boeuffin":["Bœuf émincé fin",150,22,7,0],"steak":["Bavette de bœuf",170,26,7,0],"porc":["Échine de porc",175,20,10,0],"saumon":["Saumon",200,20,13,0],"saumoncru":["Saumon cru extra-frais",200,20,13,0],"cabillaud":["Cabillaud",78,18,0.7,0],"sardine":["Sardines égouttées",220,25,13,0],"thon":["Thon au naturel égoutté",110,25,1,0],"maquereau":["Filets de maquereau",200,19,13,0],"crevette":["Crevettes décortiquées",90,20,1,0],"tofu":["Tofu ferme",145,16,9,2],"tofusoy":["Tofu soyeux",55,6,3,1],"oeuf":["Œufs",143,12.6,9.5,0.7],"skyr":["Skyr 0 %",60,11,0.2,4],"whey":["Whey",400,80,6,8],"lait":["Lait écrémé",34,3.4,0.1,5],"yaourtgrec":["Yaourt grec",93,9,5,3.5],"fromblanc":["Fromage blanc 0 %",47,8,0.2,4],"ricotta":["Ricotta",146,8,11,3],"feta":["Feta",260,14,21,1],"comte":["Comté",415,28,34,0],"parmesan":["Parmesan",392,36,28,0],"riz":["Riz basmati cru",350,7,0.6,78],"pates":["Pâtes crues",355,12,1.5,71],"pdt":["Pommes de terre",77,2,0.1,17],"patdouce":["Patate douce",86,1.6,0.1,20],"boulgour":["Boulgour cru",342,12,1.3,64],"vermriz":["Vermicelles de riz crus",360,6,0.6,80],"galetteriz":["Galettes de riz",387,8,3,81],"painbun":["Pain burger",265,9,4,48],"panko":["Chapelure panko",370,12,2,72],"poischiche":["Pois chiches égouttés",120,7,2,18],"houmous":["Houmous",230,7,17,12],"edamame":["Edamame",122,11,5,9],"brocoli":["Brocoli",34,2.8,0.4,4],"courgette":["Courgette",17,1.2,0.3,2],"poivron":["Poivron",26,1,0.3,5],"epinard":["Épinards frais",23,2.9,0.4,1],"champignon":["Champignons de Paris",22,3,0.3,1],"enoki":["Champignons enoki",22,3,0.3,1],"hvert":["Haricots verts",31,1.8,0.2,5],"chouchi":["Chou chinois",13,1.2,0.2,1],"concombre":["Concombre",15,0.7,0.1,2],"tomate":["Tomates",18,0.9,0.2,3],"oignon":["Oignon",40,1.1,0.1,8],"chou":["Chou vert",25,1.3,0.1,4],"choufleur":["Chou-fleur",25,1.9,0.3,3],"aubergine":["Aubergine",25,1,0.2,3],"pousse":["Pousses de soja",30,3,0.2,2],"bambou":["Pousses de bambou",27,2.6,0.3,4],"salade":["Salade",15,1.4,0.2,1.5],"roquette":["Roquette",25,2.6,0.7,2],"cornichon":["Cornichons",12,0.6,0.2,1.5],"avocat":["Avocat",160,2,15,2],"huile":["Huile d’olive",900,0,100,0],"sesame":["Graines de sésame",570,17,50,10],"amande":["Amandes",600,21,50,9],"noix":["Noix",654,15,65,7],"cajou":["Noix de cajou",570,18,44,27],"cacahuete":["Cacahuètes",590,26,49,8],"bdc":["Beurre de cacahuète",600,25,50,12],"coco":["Noix de coco râpée",660,6,64,8],"laitcoco":["Lait de coco léger",73,0.8,7,1.6],"choconoir":["Chocolat noir 70 %",560,8,42,32],"cacao":["Cacao non sucré",230,20,11,15],"miel":["Miel",300,0,0,80],"compote":["Compote sans sucre",45,0.3,0.2,10],"gochujang":["Gochujang",200,5,1,40],"laoganma":["Laoganma",530,5,45,15],"sriracha":["Sriracha",90,1,1,19],"soja":["Sauce soja",60,6,0,6],"vinriz":["Vinaigre de riz",20,0,0,3],"kimchi":["Kimchi",23,1.6,0.5,2],"moutarde":["Moutarde",66,4,4,6],"currypate":["Pâte de curry vert",120,2,6,12],"ail":["Ail & gingembre frais",110,4,0.5,22],"citron":["Jus de citron",20,0,0,2],"herbes":["Herbes & épices",0,0,0,0],"matcha":["Matcha",0,0,0,0],"framboise":["Framboises",52,1.2,0.7,5],"fraise":["Fraises",33,0.7,0.3,6],"myrtille":["Myrtilles",57,0.7,0.3,12],"banane":["Banane",89,1.1,0.3,20],"pomme":["Pomme",52,0.3,0.2,12],"poire":["Poire",57,0.4,0.1,12],"kiwi":["Kiwis",61,1.1,0.5,12],"peche":["Pêches",39,0.9,0.3,9],"abricot":["Abricots",48,1.4,0.4,9],"prune":["Prunes",46,0.7,0.3,10],"orange":["Orange",47,0.9,0.1,9],"pamplemousse":["Pamplemousse",42,0.8,0.1,8],"clementine":["Clémentines",47,0.9,0.2,10],"melon":["Melon",34,0.8,0.2,8],"pasteque":["Pastèque",30,0.6,0.2,7],"raisin":["Raisin",69,0.7,0.2,17],"figue":["Figues fraîches",74,0.8,0.3,16],"grenade":["Grenade",83,1.7,1.2,15],"passion":["Fruit de la passion",97,2.2,0.7,17],"pruneau":["Pruneaux",240,2.2,0.4,57],"dinde":["Escalope de dinde",105,24,1,0],"dorade":["Dorade",100,20,2.5,0],"halloumifr":["Halloumi",321,22,25,2],"mozza":["Mozzarella",250,18,19,2],"chevre":["Chèvre frais",210,15,16,2.5],"wakame":["Wakame réhydraté",45,3,0.6,7],"nori":["Feuille de nori",350,40,3,40],"fenouil":["Fenouil",31,1.2,0.2,4],"asperge":["Asperges",20,2.2,0.1,2],"butternut":["Courge butternut",45,1,0.1,10],"poireau":["Poireau",31,1.5,0.2,5],"celeri":["Céleri branche",16,0.7,0.2,2],"endive":["Endives",17,0.9,0.1,2],"radis":["Radis",16,0.7,0.1,2],"chourouge":["Chou rouge",31,1.4,0.2,5],"mungo":["Haricots mungo cuits",105,7,0.4,15],"semoule":["Semoule crue",360,12,1,72],"dragon":["Fruit du dragon",60,1.2,0.4,13]};
  function FOODS(){ return (typeof NUTD!=='undefined'&&NUTD.F)?NUTD.F:FOODS_EMB; }
  (function(){ var x={steak10:['Steak haché 10 %',182,20,10,0],rizthai:['Riz thaï sec',355,7,1,78],creme:['Crème légère 15 %',160,3,15,4],beurre:['Beurre',745,0.7,82,0.6],farine:['Farine',364,10,1,76],avoine:['Flocons d’avoine',375,13,7,60],sucre:['Sucre',400,0,0,100]};
    Object.keys(x).forEach(function(k){ if(!FOODS_EMB[k]) FOODS_EMB[k]=x[k]; }); })();

  function store(){ var s=A.store(); if(!s.custom) s.custom=[]; if(!s.weeks) s.weeks={}; return s; }

  /* ═════════════ ① MES PLATS ═════════════ */
  // Plat perso : {id, n, fam, t, temp, por, ing:[{k|null, name, g, m:[kcal,p,l,g]/100 si libre]}], steps:[], photo}
  function ingMacros(e){ var f=e.k&&FOODS()[e.k]; var m=f?[f[1],f[2],f[3],f[4]]:(e.m||[0,0,0,0]); return {k:m[0]*e.g/100,p:m[1]*e.g/100,l:m[2]*e.g/100,g:m[3]*e.g/100}; }
  function dishMacros(d){ // PAR PORTION
    var t={k:0,p:0,l:0,g:0}, n=Math.max(1,d.por||1);
    (d.ing||[]).forEach(function(e){ var m=ingMacros(e); t.k+=m.k;t.p+=m.p;t.l+=m.l;t.g+=m.g; });
    return {k:Math.round(t.k/n),p:Math.round(t.p/n),l:Math.round(t.l/n),g:Math.round(t.g/n)};
  }
  function ingName(e){ var f=e.k&&FOODS()[e.k]; return f?f[0]:(e.name||'?'); }
  function placeholder(emoji){ return 'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#2a211a"/><text x="50" y="66" font-size="52" text-anchor="middle">'+(emoji||'🍽️')+'</text></svg>'); }
  function sync(){ try{ A.syncCustom(store().custom.slice(),{macros:dishMacros,ingName:ingName,placeholder:placeholder}); }catch(e){ console.warn('[NP] sync',e); } }

  var ED=null, _edArm=false;
  function sheetEls(){
    var root=$(A.root);
    if(!$('np-veil')||!root.contains($('np-veil'))){
      var v=document.createElement('div'); v.className='veil'; v.id='np-veil'; v.onclick=closeSheet; root.appendChild(v);
      var s=document.createElement('div'); s.className='sheet np-sheet'; s.id='np-sheet'; s.innerHTML='<div class="grab"></div><div id="np-sh" class="np-sh"></div>'; root.appendChild(s);
    }
  }
  function openSheet(html){ sheetEls(); $('np-sh').innerHTML=html; $('np-veil').classList.add('on'); $('np-sheet').classList.add('on'); }
  function closeSheet(){ var v=$('np-veil'), s=$('np-sheet'); if(v) v.classList.remove('on'); if(s) s.classList.remove('on'); ED=null; PK=null; }
  function openCreate(){ A.closeFiche&&A.closeFiche(); ED={id:null,n:'',fam:'plat',t:20,temp:'chaud',por:A.app==='adrien'?2:1,ing:[],steps:[],photo:null,q:''}; _edArm=false; renderEd(); }
  function openEdit(id){
    var d=store().custom.find(function(x){return x.id===id;}); if(!d) return;
    A.closeFiche&&A.closeFiche();
    ED=JSON.parse(JSON.stringify(d)); ED.q=''; _edArm=false; renderEd();
  }
  function renderEd(keepScroll){
    var d=ED, m=dishMacros(d), F=FOODS();
    var sc=keepScroll&&$('np-sheet')?$('np-sheet').scrollTop:0;
    var h='<div class="np-ed">'
      +'<h2 class="np-h2">'+(d.id?'✏️ Modifier mon plat':'＋ Créer mon plat')+'</h2>'
      +'<label class="np-photo">'+(d.photo?'<img src="'+d.photo+'" alt="">':'<span>📷<b>Ajouter une photo</b><small>appareil photo ou galerie</small></span>')
      +'<input type="file" accept="image/*" id="np-file" hidden></label>'
      +(d.photo?'<button class="np-link" data-a="nophoto" type="button">Retirer la photo</button>':'')
      +'<p class="eyebrow" style="margin-top:14px">Nom du plat</p>'
      +'<input class="np-in" id="np-name" maxlength="60" placeholder="ex : Poulet coco de maman" value="'+esc(d.n)+'">'
      +(A.app==='melati'?'<div class="seg" style="margin-top:10px"><button data-fam="plat" class="'+(d.fam==='plat'?'on':'')+'">Plat</button><button data-fam="sucre" class="'+(d.fam==='sucre'?'on':'')+'">Sucré</button></div>':'')
      +'<div class="seg" style="margin-top:8px"><button data-temp="chaud" class="'+(d.temp==='chaud'?'on':'')+'">Chaud</button><button data-temp="froid" class="'+(d.temp==='froid'?'on':'')+'">Froid</button></div>'
      +'<div class="np-steps2">'
      +'<div><p class="eyebrow">Temps</p><div class="np-stp"><button data-st="t" data-d="-5">−</button><b>'+d.t+' min</b><button data-st="t" data-d="5">+</button></div></div>'
      +'<div><p class="eyebrow">Quantités pour</p><div class="np-stp"><button data-st="por" data-d="-1">−</button><b>'+d.por+' '+(A.app==='adrien'?'plat'+(d.por>1?'s':''):'portion'+(d.por>1?'s':''))+'</b><button data-st="por" data-d="1">+</button></div></div>'
      +'</div>'
      +'<p class="eyebrow" style="margin-top:16px">Ingrédients <span class="np-mut">— tout le plat, en grammes crus</span></p>'
      +(d.ing.length?d.ing.map(function(e,i){
          return '<div class="np-irow"><span class="np-iname">'+esc(ingName(e))+(e.k?'':' <em>libre</em>')+'</span>'
            +'<input class="np-in np-g" type="number" inputmode="decimal" min="0" step="5" data-ig="'+i+'" value="'+e.g+'"><span class="np-u">g</span>'
            +'<button class="np-x" data-idel="'+i+'" aria-label="Retirer">✕</button>'
            +(e.k?'':'<div class="np-free">pour 100 g : <input class="np-in" type="number" inputmode="decimal" data-im="'+i+'" data-mi="0" value="'+(e.m?e.m[0]:0)+'"> kcal · <input class="np-in" type="number" inputmode="decimal" data-im="'+i+'" data-mi="1" value="'+(e.m?e.m[1]:0)+'"> g prot. <small>(lis l’étiquette — sinon laisse 0)</small></div>')
            +'</div>'; }).join(''):'<p class="hint">Cherche un aliment ci-dessous et touche-le pour l’ajouter.</p>')
      +'<div class="search np-search"><input id="np-q" type="search" placeholder="Ajouter un aliment… ex : poulet, riz, courgette" autocomplete="off" value="'+esc(d.q)+'"></div>'
      +'<div class="pick np-found" id="np-found">'+foundHtml(d.q)+'</div>'
      +'<p class="eyebrow" style="margin-top:16px">Étapes <span class="np-mut">— une par ligne</span></p>'
      +'<textarea class="np-in np-ta" id="np-stepsin" rows="5" placeholder="Coupe le poulet en lanières…&#10;Fais revenir 5 min à feu vif…">'+esc((d.steps||[]).join('\n'))+'</textarea>'
      +'<div class="np-mac"><span><b>'+m.k+'</b>kcal</span><span><b>'+m.p+'</b>prot.</span><span><b>'+m.l+'</b>lip.</span><span><b>'+m.g+'</b>gluc.</span><em>par '+(A.app==='adrien'?'plat':'portion')+' · calculé sur la table d’aliments</em></div>'
      +'<button class="go np-save" data-a="save" type="button">'+(d.id?'Enregistrer les changements':'Créer mon plat')+'</button>'
      +(d.id?'<button class="np-del'+(_edArm?' arm':'')+'" data-a="del" type="button">'+(_edArm?'Sûr·e ? Touche encore une fois pour supprimer':'Supprimer ce plat')+'</button>':'')
      +'<button class="np-link" data-a="cancel" type="button">Annuler</button>'
      +'</div>';
    openSheet(h);
    $('np-sheet').scrollTop=sc;
    bindEd();
  }
  function foundHtml(q){
    if(!q||q.length<2) return '';
    var t=norm(q), F=FOODS(), out=[];
    Object.keys(F).forEach(function(k){ if(norm(F[k][0]).indexOf(t)>=0||k.indexOf(t)===0) out.push(k); });
    return out.slice(0,10).map(function(k){ return '<button data-add="'+k+'" type="button">＋ '+esc(F[k][0])+'</button>'; }).join('')
      +'<button data-addfree="1" type="button" class="np-freebtn">＋ « '+esc(q)+' » (aliment libre)</button>';
  }
  function readEd(){ var n=$('np-name'); if(n) ED.n=n.value; var s=$('np-stepsin'); if(s) ED.steps=s.value.split('\n').map(function(x){return x.trim();}).filter(Boolean); }
  function bindEd(){
    var file=$('np-file');
    if(file) file.onchange=function(){ var f=file.files&&file.files[0]; if(!f) return; readEd(); compress(f,function(url){ ED.photo=url; renderEd(true); }); };
    var q=$('np-q');
    if(q) q.oninput=function(){ ED.q=q.value; $('np-found').innerHTML=foundHtml(q.value); };
    $('np-sh').onclick=function(e){
      var b;
      if((b=e.target.closest('[data-add]'))){ readEd(); ED.ing.push({k:b.dataset.add,g:100}); ED.q=''; renderEd(true); return; }
      if(e.target.closest('[data-addfree]')){ readEd(); ED.ing.push({k:null,name:ED.q.trim(),g:100,m:[0,0,0,0]}); ED.q=''; renderEd(true); return; }
      if((b=e.target.closest('[data-idel]'))){ readEd(); ED.ing.splice(+b.dataset.idel,1); renderEd(true); return; }
      if((b=e.target.closest('[data-fam]'))){ readEd(); ED.fam=b.dataset.fam; renderEd(true); return; }
      if((b=e.target.closest('[data-temp]'))){ readEd(); ED.temp=b.dataset.temp; renderEd(true); return; }
      if((b=e.target.closest('[data-st]'))){ readEd(); var k=b.dataset.st; ED[k]=Math.max(k==='t'?5:1,Math.min(k==='t'?240:12,ED[k]+(+b.dataset.d))); renderEd(true); return; }
      if((b=e.target.closest('[data-a]'))){
        var a=b.dataset.a; readEd();
        if(a==='cancel'){ closeSheet(); return; }
        if(a==='nophoto'){ ED.photo=null; renderEd(true); return; }
        if(a==='del'){ if(!_edArm){ _edArm=true; renderEd(true); return; }
          var L=store().custom, i=L.findIndex(function(x){return x.id===ED.id;}); if(i>=0) L.splice(i,1);
          A.save(); sync(); closeSheet(); A.refresh(); A.toast('Plat supprimé'); return; }
        if(a==='save'){
          if(!ED.n.trim()){ A.toast('Donne un nom à ton plat'); return; }
          if(!ED.ing.length){ A.toast('Ajoute au moins un ingrédient'); return; }
          var d={id:ED.id||('cu_'+Date.now().toString(36)),n:ED.n.trim(),fam:ED.fam,t:ED.t,temp:ED.temp,por:ED.por,ing:ED.ing,steps:ED.steps,photo:ED.photo||null,custom:true};
          var L2=store().custom, j=L2.findIndex(function(x){return x.id===d.id;});
          if(j>=0) L2[j]=d; else L2.push(d);
          A.save(); sync(); closeSheet(); A.refresh();
          A.toast(j>=0?'✓ Plat mis à jour':'🍽️ « '+d.n+' » ajouté à tes recettes');
          return;
        }
      }
    };
    $('np-sh').oninput=function(e){
      var t=e.target;
      if(t.dataset.ig!=null){ var v=parseFloat(String(t.value).replace(',','.')); ED.ing[+t.dataset.ig].g=isNaN(v)?0:Math.max(0,v); updMac(); }
      if(t.dataset.im!=null){ var v2=parseFloat(String(t.value).replace(',','.')), e2=ED.ing[+t.dataset.im]; if(!e2.m) e2.m=[0,0,0,0]; e2.m[+t.dataset.mi]=isNaN(v2)?0:v2; updMac(); }
    };
  }
  function updMac(){ var m=dishMacros(ED), el=document.querySelector('#np-sh .np-mac'); if(el){ var b=el.querySelectorAll('b'); b[0].textContent=m.k; b[1].textContent=m.p; b[2].textContent=m.l; b[3].textContent=m.g; } }
  // Photo → carré max 520 px en JPEG (~30-60 Ko) : assez léger pour la sauvegarde cloud
  function compress(file,cb){
    var rd=new FileReader();
    rd.onload=function(){
      var img=new Image();
      img.onload=function(){
        var S=520, w=img.width, h=img.height, sc=Math.min(1,S/Math.max(w,h));
        var c=document.createElement('canvas'); c.width=Math.round(w*sc); c.height=Math.round(h*sc);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        var q=0.74, url=c.toDataURL('image/jpeg',q);
        while(url.length>90000&&q>0.4){ q-=0.08; url=c.toDataURL('image/jpeg',q); }
        cb(url);
      };
      img.onerror=function(){ A.toast('Photo illisible — essaie une autre'); };
      img.src=rd.result;
    };
    rd.readAsDataURL(file);
  }

  /* ═════════════ ② MA SEMAINE + COURSES ═════════════ */
  // 14 repas : index = jour×2 + (0 midi, 1 soir). Une SESSION = un moment où on cuisine, qui nourrit
  // un ou plusieurs repas (c). Modes : « solo » (chaque repas) · « soirmidi » (le soir → lendemain midi,
  // le dimanche soir nourrit le lundi midi) · + grosses sessions (un soir cuisiné pour 4 repas).
  function wkMonDefault(){ var d=new Date(), dow=(d.getDay()+6)%7; var m=monOf(d); return dow>=5?addD(m,7):m; }
  var WK=null; // semaine affichée (clé lundi)
  function weekObj(mon){
    var s=store();
    if(!s.weeks[mon]) s.weeks[mon]={mon:mon,mode:A.defaultMode||'soirmidi',big:[],seed:1,sessions:null,done:{}};
    return s.weeks[mon];
  }
  function buildSessions(w){
    var cov=new Array(14).fill(false), out=[];
    (w.big||[]).slice().sort().forEach(function(d){
      var s=d*2+1; if(cov[s]) return; var c=[];
      for(var i=0;i<4;i++){ var x=(s+i)%14; if(cov[x]) break; c.push(x); cov[x]=true; }
      out.push({c:c,k:null,lock:false,off:false,ban:[]});
    });
    for(var o=0;o<14;o++){
      var s2=(o+1)%14; if(cov[s2]) continue;
      var c2=[s2]; cov[s2]=true;
      if(w.mode==='soirmidi'&&s2%2===1){ var nx=(s2+1)%14; if(!cov[nx]){ c2.push(nx); cov[nx]=true; } }
      out.push({c:c2,k:null,lock:false,off:false,ban:[]});
    }
    // ordre chronologique du 1er repas nourri (le lundi midi nourri par le dimanche soir reste en fin)
    out.sort(function(a,b){ return a.c[0]-b.c[0]; });
    // on garde les choix verrouillés / retirés des sessions qui démarrent au même repas
    if(w.sessions) w.sessions.forEach(function(old){ if(!old.lock&&!old.off) return; var n=out.find(function(x){return x.c[0]===old.c[0];}); if(n){ n.k=old.k; n.lock=old.lock; n.off=old.off; } });
    w.sessions=out;
  }
  function pool(){
    var all=A.plats().filter(function(r){return !r.hidden;});
    var favs=all.filter(function(r){return r.fav;}), others=all.filter(function(r){return !r.fav;});
    others.sort(function(a,b){ return (b.score||0)-(a.score||0); });
    return {favs:favs,others:others,all:all};
  }
  function assign(w,onlyIdx){
    var P=pool(), R=rng(w.seed*2654435761+7);
    function shuf(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(R()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
    var order=shuf(P.favs).concat(shuf(P.others.slice(0,40)));
    if(!order.length) return;
    var used={};
    w.sessions.forEach(function(s,i){ if(s.k&&(s.lock||(onlyIdx!=null&&i!==onlyIdx))) used[s.k]=(used[s.k]||0)+1; });
    var prevProt=null;
    w.sessions.forEach(function(s,i){
      if(s.off){ prevProt=null; return; }
      if(s.lock||(onlyIdx!=null&&i!==onlyIdx)){ var r0=s.k&&A.plats().find(function(x){return x.id===s.k;}); prevProt=r0?r0.prot:null; return; }
      var big=s.c.length>=3, best=null, bestSc=-1e9;
      order.forEach(function(r,rank){
        if(s.ban&&s.ban.indexOf(r.id)>=0) return;
        var sc=-rank-(used[r.id]||0)*200;
        if(prevProt&&r.prot&&r.prot===prevProt) sc-=25;          // pas deux fois la même viande d'affilée
        if(big&&r.temp==='froid') sc-=60;                        // une grosse session = un plat qui se réchauffe bien
        if(sc>bestSc){ bestSc=sc; best=r; }
      });
      if(!best) best=order[0];
      s.k=best.id; used[best.id]=(used[best.id]||0)+1; prevProt=best.prot||null;
    });
  }
  function plan(w,reseed){ if(reseed) w.seed=(w.seed||1)+1; if(!w.sessions) buildSessions(w); assign(w); A.save(); }
  function recOf(id){ return id?A.plats().find(function(x){return x.id===id;}):null; }
  function slotLbl(i){ return JOURS[Math.floor(i/2)].toLowerCase()+' '+(i%2?'soir':'midi'); }
  function renderWeek(){
    var pane=$(A.weekPane); if(!pane) return;
    if(!WK) WK=wkMonDefault();
    var w=weekObj(WK), cur=monOf(new Date());
    var h='<div class="card np-wkhead">'
      +'<p class="eyebrow">🗓️ Ma semaine · repas</p>'
      +'<div class="seg"><button data-wk="'+cur+'" class="'+(WK===cur?'on':'')+'">Cette semaine</button><button data-wk="'+addD(cur,7)+'" class="'+(WK===addD(cur,7)?'on':'')+'">Semaine prochaine</button></div>'
      +'<p class="hint" style="margin-top:8px">'+dm(WK)+' → '+dm(addD(WK,6))+' · midi + soir, tirés de tes <b>favoris ♥</b> ('+pool().favs.length+')'+(pool().favs.length<7?' — complétés par des plats proches':'')+'</p>'
      +'<p class="eyebrow" style="margin-top:12px">Comment tu cuisines ?</p>'
      +'<div class="seg"><button data-mode="solo" class="'+(w.mode==='solo'?'on':'')+'">Chaque repas</button><button data-mode="soirmidi" class="'+(w.mode==='soirmidi'?'on':'')+'">Soir → lendemain midi</button></div>'
      +'<p class="hint" style="margin-top:10px">🍲 Grosse session (le soir, pour 4 repas) :</p>'
      +'<div class="pick np-days">'+J3.map(function(l,d){ return '<button data-big="'+d+'" class="'+((w.big||[]).indexOf(d)>=0?'on':'')+'">'+l+'</button>'; }).join('')+'</div>'
      +'<button class="go" data-a="plan" type="button">'+(w.sessions&&w.sessions.some(function(s){return s.k;})?'↻ Reproposer (garde les 🔒)':'✨ Proposer ma semaine')+'</button>'
      +'</div>';
    if(w.sessions&&w.sessions.some(function(s){return s.k||s.off;})){
      var byStart={}, byCov={};
      w.sessions.forEach(function(s,i){ byStart[s.c[0]]=i; s.c.forEach(function(x,j){ if(j) byCov[x]=i; }); });
      var nCook=0,nMeals=0,kc=0,pc=0;
      w.sessions.forEach(function(s){ var r=recOf(s.k); if(s.off||!r) return; nCook++; nMeals+=s.c.length; kc+=(r.kcal||0)*s.c.length; pc+=(r.p||0)*s.c.length; });
      h+='<div class="np-sum"><span><b>'+nCook+'</b> fois en cuisine</span><span><b>'+nMeals+'</b>/14 repas</span>'+(nMeals?'<span><b>~'+Math.round(kc/nMeals/10)*10+'</b> kcal/repas</span>':'')+'</div>';
      for(var d=0;d<7;d++){
        h+='<div class="slot np-day"><div class="slot-h"><h4>'+JOURS[d]+' <small>'+dm(addD(WK,d))+'</small></h4></div>';
        for(var m=0;m<2;m++){
          var ix=d*2+m, lbl=m?'🌙 Soir':'☀️ Midi';
          if(byStart[ix]!=null){
            var si=byStart[ix], s=w.sessions[si], r=recOf(s.k);
            if(s.off||!r){
              h+='<div class="np-meal off"><span class="np-ml">'+lbl+'</span><span class="np-mn">'+(s.off?'Libre — extérieur, resto, restes…':'À choisir')+'</span><button class="np-b" data-pick="'+si+'" type="button">＋ Choisir</button></div>';
            } else {
              h+='<div class="np-meal"><span class="np-ml">'+lbl+'</span>'
                +'<button class="np-mn np-open" data-open="'+esc(r.id)+'" type="button">'+r.thumb+'<span><b>'+esc(r.n)+'</b><small>'+(s.c.length>1?'🍳 à cuisiner ×'+s.c.length+' '+(A.app==='adrien'?'plats':'portions')+' · ':'')+(r.kcal?r.kcal+' kcal':'')+(r.fav?' · ♥':'')+'</small></span></button>'
                +'<span class="np-acts"><button class="np-b'+(s.lock?' on':'')+'" data-lock="'+si+'" title="Verrouiller" type="button">'+(s.lock?'🔒':'🔓')+'</button>'
                +'<button class="np-b" data-alt="'+si+'" title="Autre plat" type="button">↻</button>'
                +'<button class="np-b" data-off="'+si+'" title="Retirer" type="button">✕</button></span></div>';
            }
          } else if(byCov[ix]!=null){
            var s2=w.sessions[byCov[ix]], r2=recOf(s2.k);
            h+='<div class="np-meal rest"><span class="np-ml">'+lbl+'</span><span class="np-mn">'+(s2.off||!r2?'—':'↩︎ Reste de <b>'+esc(r2.n)+'</b> <small>(cuisiné '+slotLbl(s2.c[0])+')</small>')+'</span></div>';
          }
        }
        h+='</div>';
      }
      h+='<button class="go np-shopbtn" data-a="shop" type="button">🛒 Ma liste de courses</button>';
    } else h+='<p class="hint" style="margin:14px 4px">Choisis ta façon de cuisiner, puis « Proposer ma semaine ». Ajoute des plats en ♥ favoris dans Recettes pour que la semaine te ressemble.</p>';
    pane.innerHTML=h;
    pane.onclick=onWeekClick;
  }
  function onWeekClick(e){
    var w=weekObj(WK), b;
    if((b=e.target.closest('[data-wk]'))){ WK=b.dataset.wk; renderWeek(); return; }
    if((b=e.target.closest('[data-mode]'))){ w.mode=b.dataset.mode; buildSessions(w); if(w.sessions.some(function(s){return s.lock;})||true) assign(w); A.save(); renderWeek(); return; }
    if((b=e.target.closest('[data-big]'))){ var d=+b.dataset.big, L=w.big||(w.big=[]), i=L.indexOf(d); if(i>=0) L.splice(i,1); else L.push(d); buildSessions(w); assign(w); A.save(); renderWeek(); return; }
    if((b=e.target.closest('[data-a="plan"]'))){ var had=w.sessions&&w.sessions.some(function(s){return s.k;}); if(!w.sessions) buildSessions(w); plan(w,had); renderWeek(); A.toast(had?'↻ Nouvelle proposition — les 🔒 sont gardés':'✨ Ta semaine est prête'); return; }
    if((b=e.target.closest('[data-a="shop"]'))){ openShop(); return; }
    if((b=e.target.closest('[data-lock]'))){ var s=w.sessions[+b.dataset.lock]; s.lock=!s.lock; A.save(); renderWeek(); return; }
    if((b=e.target.closest('[data-alt]'))){ var s2=w.sessions[+b.dataset.alt]; if(!s2.ban) s2.ban=[]; if(s2.k) s2.ban.push(s2.k); if(s2.ban.length>=pool().all.length-1) s2.ban=[s2.k]; s2.lock=false; assign(w,+b.dataset.alt); A.save(); renderWeek(); return; }
    if((b=e.target.closest('[data-off]'))){ var s3=w.sessions[+b.dataset.off]; s3.off=true; s3.lock=true; A.save(); renderWeek(); return; }
    if((b=e.target.closest('[data-pick]'))){ openPick(+b.dataset.pick); return; }
    if((b=e.target.closest('[data-open]'))){ A.open(b.dataset.open); return; }
  }
  var PK=null;
  function openPick(si){
    PK={si:si,q:''};
    renderPick();
  }
  function renderPick(){
    var t=norm(PK.q), P=pool(), list=P.favs.concat(P.others).filter(function(r){ return !t||norm(r.n).indexOf(t)>=0; }).slice(0,60);
    var h='<h2 class="np-h2">Choisir un plat</h2>'
      +'<div class="search np-search"><input id="np-pq" type="search" placeholder="Chercher…" value="'+esc(PK.q)+'" autocomplete="off"></div>'
      +'<button class="pickrow" data-poff="1" type="button"><span style="flex:1"><b>🍔 Repas libre</b><span>extérieur, resto, restes du frigo…</span></span></button>'
      +list.map(function(r){ return '<button class="pickrow" data-pk="'+esc(r.id)+'" type="button">'+r.thumb+'<span style="flex:1;min-width:0"><b>'+esc(r.n)+(r.fav?' <i class="hrt">♥</i>':'')+'</b><span>'+(r.kcal?r.kcal+' kcal · ':'')+(r.p?r.p+' g prot.':'')+'</span></span></button>'; }).join('');
    openSheet(h);
    var q=$('np-pq'); if(q) q.oninput=function(){ PK.q=q.value; var s=$('np-sheet').scrollTop; renderPick(); var q2=$('np-pq'); q2.focus(); q2.setSelectionRange(q2.value.length,q2.value.length); $('np-sheet').scrollTop=s; };
    $('np-sh').onclick=function(e){
      var w=weekObj(WK), s=w.sessions[PK.si], b;
      if(e.target.closest('[data-poff]')){ s.off=true; s.lock=true; s.k=null; }
      else if((b=e.target.closest('[data-pk]'))){ s.k=b.dataset.pk; s.off=false; s.lock=true; }
      else return;
      A.save(); closeSheet(); renderWeek();
    };
  }
  /* ── Liste de courses : ingrédients de chaque session × nb de repas nourris, fusionnés par rayon ── */
  var RAYONS=['🥩 Boucherie · poisson','🥚 Frais · crèmerie','🥦 Fruits & légumes','🍚 Féculents · céréales','🫙 Épicerie · sauces','🧂 Placard (vérifie avant d’acheter)'];
  function fmtQty(q,u){
    if(u==='g'||u==='ml'){ var big=u==='g'?'kg':'L'; if(q>=1000) return fr(Math.round(q/100)/10)+' '+big; return (q>=100?Math.round(q/10)*10:Math.max(5,Math.round(q/5)*5))+' '+u; }
    var r=Math.ceil(q*2-1e-9)/2; return fr(r)+(u?' '+u:'');
  }
  function shopItems(w){
    var map={}, order=[];
    (w.sessions||[]).forEach(function(s){
      if(s.off||!s.k) return;
      (A.ingredients(s.k,s.c.length)||[]).forEach(function(it){
        var key=it.key+'|'+(it.unit||'');
        if(!map[key]){ map[key]={key:key,name:it.name,unit:it.unit||'',qty:0,ray:it.ray==null?4:it.ray,txt:it.txt||null,dishes:{}}; order.push(key); }
        map[key].qty+=it.qty||0; map[key].dishes[s.k]=1;
      });
    });
    return order.map(function(k){ return map[k]; });
  }
  function openShop(){
    var w=weekObj(WK), items=shopItems(w);
    if(!w.done) w.done={};
    var h='<h2 class="np-h2">🛒 Liste de courses</h2><p class="hint">Semaine du '+dm(WK)+' · '+items.length+' articles · quantités pour tous les repas planifiés. Coche au fur et à mesure.</p>';
    RAYONS.forEach(function(ray,ri){
      var its=items.filter(function(x){return x.ray===ri;}); if(!its.length) return;
      its.sort(function(a,b){ return a.name.localeCompare(b.name); });
      h+='<p class="eyebrow" style="margin-top:14px">'+ray+'</p>'
        +its.map(function(x){ var on=!!w.done[x.key];
          return '<button class="np-shop'+(on?' on':'')+'" data-sh="'+esc(x.key)+'" type="button"><span class="np-ck">'+(on?'✓':'')+'</span><span class="np-sn">'+esc(x.name)+'</span><b>'+(x.txt?esc(x.txt):fmtQty(x.qty,x.unit))+'</b></button>'; }).join('');
    });
    h+='<button class="go" data-a="copy" type="button">📋 Copier la liste</button><button class="np-link" data-a="uncheck" type="button">Tout décocher</button>';
    openSheet(h);
    $('np-sh').onclick=function(e){
      var b=e.target.closest('[data-sh]');
      if(b){ var k=b.dataset.sh; if(w.done[k]) delete w.done[k]; else w.done[k]=true; A.save(); b.classList.toggle('on'); b.querySelector('.np-ck').textContent=w.done[k]?'✓':''; return; }
      var a=e.target.closest('[data-a]'); if(!a) return;
      if(a.dataset.a==='uncheck'){ w.done={}; A.save(); openShop(); return; }
      if(a.dataset.a==='copy'){
        var txt='Courses semaine du '+dm(WK)+'\n';
        RAYONS.forEach(function(ray,ri){ var its=items.filter(function(x){return x.ray===ri;}); if(!its.length) return; txt+='\n'+ray+'\n'; its.forEach(function(x){ txt+=(w.done[x.key]?'✓ ':'- ')+x.name+' : '+(x.txt||fmtQty(x.qty,x.unit))+'\n'; }); });
        try{ navigator.clipboard.writeText(txt).then(function(){ A.toast('📋 Liste copiée'); },function(){ window.prompt('Copie la liste :',txt); }); }catch(err){ window.prompt('Copie la liste :',txt); }
      }
    };
  }

  /* ═════════════ ③ LES GESTES GOÛT ═════════════ */
  // Règles simples, choisies selon ce qu'il y a VRAIMENT dans le plat (nom des ingrédients + étapes).
  // Zéro calorie ajoutée (eau, citron, vinaigre, sel) sauf mention.
  var SPICES=[['cumin','cumin'],['paprika','paprika'],['curry','curry'],['curcuma','curcuma'],['garam','garam masala'],['ras el hanout','ras el hanout'],['tandoori','tandoori'],['cinq epices','cinq-épices'],['5 epices','cinq-épices'],['piment','piment'],['chili','chili'],['gingembre','gingembre'],['herbes de provence','herbes de Provence'],['cannelle','cannelle'],['coriandre en poudre','coriandre en poudre'],['gochujang','gochujang'],['pate de curry','pâte de curry']];
  function flavorTips(info){
    var T=norm(info.text), fam=info.fam, tips=[];
    function has(re){ return re.test(T); }
    if(fam==='sucre'){
      tips.push(['🧂','Une pincée de sel','Une toute petite pincée de sel dans la pâte ou sur le dessus : elle fait ressortir le sucre, le chocolat et les fruits.']);
      if(has(/avoine|flocon|amande|noix|noisette|cajou|cacahuete|coco/)) tips.push(['🥜','Toaste à sec','Flocons, noix ou coco 2-3 min dans une poêle sèche, en remuant : ils deviennent croustillants et 3× plus parfumés.']);
      if(has(/banane|pomme|poire|fraise|framboise|myrtille|peche|abricot|mangue|kiwi/)) tips.push(['🍋','Un zeste ou quelques gouttes de citron','Sur les fruits : ça les rend plus « fruités » et évite qu’ils noircissent.']);
      tips.push(['🍦','Vanille ou cannelle','Une goutte d’extrait de vanille ou une pincée de cannelle donne une impression de sucré en plus — sans sucre ajouté.']);
      return tips.slice(0,3);
    }
    var sp=[]; SPICES.forEach(function(s){ if(T.indexOf(s[0])>=0&&sp.indexOf(s[1])<0) sp.push(s[1]); });
    if(sp.length) tips.push(['🔥','Les épices revenues dans le gras','Mets '+sp.slice(0,3).join(', ')+' 30 à 45 secondes dans l’huile chaude (feu moyen) AVANT le reste : leurs arômes se libèrent dans le gras. Dès que ça sent fort, on enchaîne — sinon elles brûlent.']);
    var meat=has(/poulet|boeuf|bavette|steak|porc|echine|dinde|cuisse|saumon|cabillaud|crevette|veau|agneau|canard|tofu ferme|halloumi/);
    var pan=info.pan||has(/poele|wok|saisi|saisir|dore|faire revenir|fais revenir|sauteuse|huile/);
    if(meat&&pan){
      tips.push(['🥩','Saisir sans toucher','Poêle bien chaude, et la viande ne bouge PAS pendant les 2 premières minutes : c’est la croûte dorée (réaction de Maillard) qui fait le goût. Pas trop de morceaux à la fois, sinon ça bout au lieu de dorer.']);
      tips.push(['🍳','Déglacer les sucs','La viande retirée, verse 3-4 c. à soupe d’eau'+(has(/soja/)?', de sauce soja':'')+(has(/citron/)?' ou de jus de citron':'')+' dans la poêle encore chaude et gratte le fond avec la spatule : ces sucs caramélisés deviennent la base de ta sauce — 0 calorie.']);
    }
    if(has(/\bail\b|oignon|echalote|poireau/)) tips.push(['🧄','Oignon d’abord, ail ensuite','Fais suer l’oignon 3-4 min avec une pincée de sel (il devient doux et sucré), puis l’ail seulement 30 secondes : l’ail brûle vite et devient amer.']);
    if(has(/concentre|coulis|tomate/)&&has(/concentre/)) tips.push(['🍅','Faire « pincer » le concentré','1 minute de concentré de tomate dans l’huile avant le liquide : il perd son acidité et prend un goût rond, presque caramélisé.']);
    if(has(/soja|miel|teriyaki|aigre|sriracha|gochujang|huitre/)) tips.push(['🍯','Réduire la sauce','Laisse la sauce buller 1-2 min jusqu’à ce qu’elle nappe la cuillère : plus concentrée = plus de goût, et elle accroche à chaque morceau.']);
    if(has(/champignon/)) tips.push(['🍄','Champignons : feu vif, sel à la fin','Poêle très chaude, en une seule couche, sans sel au début : ils dorent au lieu de rendre leur eau. Sale seulement en fin de cuisson.']);
    if(has(/citron|vinaigre|lime|citron vert/)) tips.push(['🍋','Garde un peu d’acidité pour la fin','Ajoute une partie du citron / vinaigre hors du feu, juste avant de servir : cuit, il perd son peps.']);
    else tips.push(['🍋','Une touche d’acidité à la fin','Un filet de citron'+(has(/soja|riz|nouille|vermicelle|gochujang|sesame/)?' (ou de vinaigre de riz)':'')+' juste avant de servir : ça réveille tous les goûts du plat, sans rien ajouter côté calories.']);
    tips.push(['🧂','Assaisonner par couches','Une pincée de sel sur la viande, une sur les légumes, puis tu goûtes la sauce à la fin — bien meilleur que tout le sel d’un coup au moment de servir.']);
    if(has(/coriandre|basilic|persil|ciboulette|menthe|aneth/)) tips.push(['🌿','Herbes fraîches hors du feu','Ajoute-les à la toute fin, hors du feu : cuites, elles perdent leur parfum.']);
    if(has(/sesame|cacahuete|cajou|amande|noix/)) tips.push(['🥜','Graines toastées','1-2 min à sec dans la poêle avant de parsemer : 3× plus de goût pour la même quantité.']);
    if(has(/pates|spaghetti|penne|tagliatelle|capellini/)) tips.push(['🍝','L’eau des pâtes','Garde une louche d’eau de cuisson : son amidon lie la sauce et la rend brillante, sans ajouter de gras.']);
    if(has(/bavette|steak|entrecote|faux-filet|magret/)) tips.push(['⏱','Laisser reposer la viande','2-3 min sur une assiette avant de trancher : le jus reste dans la viande au lieu de couler.']);
    // priorités : épices / saisie+déglaçage / acidité / couches d'abord — 4 gestes max, lisibles
    var pri=['🔥','🥩','🍳','🍋','🧂','🍯','🧄','🍅','🍄','🌿','🥜','🍝','⏱'];
    tips.sort(function(a,b){ return pri.indexOf(a[0])-pri.indexOf(b[0]); });
    return tips.slice(0,4);
  }
  function flavorHtml(info){
    var t=flavorTips(info); if(!t.length) return '';
    return '<div class="np-gout"><p class="eyebrow">🔥 Les gestes goût</p><p class="np-gsub">À glisser dans la recette — ça change tout, sans rien compliquer.</p>'
      +t.map(function(x){ return '<div class="np-gt"><span class="np-gi">'+x[0]+'</span><p><b>'+x[1]+'</b> — '+x[2]+'</p></div>'; }).join('')+'</div>';
  }

  /* ═════════════ intégration ═════════════ */
  function init(adapter){
    A=adapter;
    var root=$(A.root); if(!root) return;
    // onglet « Semaine » (injecté : les HTML des deux apps restent inchangés)
    var main=root.querySelector('main'), nav=root.querySelector('.tabs-in');
    if(main&&!$(A.weekPane)){ var sec=document.createElement('section'); sec.className='pane'; sec.id=A.weekPane; main.appendChild(sec); }
    if(nav&&!nav.querySelector('[data-p="'+A.weekTab+'"]')){
      var b=document.createElement('button'); b.className='tab'; b.dataset.p=A.weekTab;
      b.innerHTML='<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M9 10v10M15 10v10"/></svg>Semaine';
      var tabs=nav.querySelectorAll('.tab'); nav.insertBefore(b,tabs[3]||null);
    }
    // bouton « ＋ Créer mon plat » au-dessus de la recherche
    var rp=$(A.recipesBox);
    if(rp&&!$('np-create-'+A.app)){ var cb=document.createElement('button'); cb.id='np-create-'+A.app; cb.type='button'; cb.className='np-create';
      cb.innerHTML='＋ Créer mon plat <small>ta recette, ta photo — macros calculées</small>'; cb.onclick=openCreate;
      var srch=rp.querySelector('.search'); rp.insertBefore(cb,srch||rp.firstChild); }
    sync();
  }
  return {init:init,sync:sync,openCreate:openCreate,openEdit:openEdit,renderWeek:renderWeek,flavorHtml:flavorHtml,flavorTips:flavorTips,
    dishMacros:dishMacros,_buildSessions:buildSessions,_assign:assign,_shop:shopItems,_week:function(m){ WK=m||WK; return weekObj(WK||wkMonDefault()); },closeSheet:closeSheet};
})();
