"use strict";
/* ═══ Cardio salle détaillé (19/10/2026, demande Adrien) — MASSUP uniquement ═══
   Remplace l'écran « 1 série de N minutes » des exos cardio du LiveUp (cardio_liss, cardio_rameur)
   par un panneau : type de machine (marche / course tapis, escalier, vélo, rameur, elliptique)
   + PALIERS (durée · vitesse · inclinaison sur tapis, durée · niveau ailleurs) → distance, D+,
   kcal estimées (ACSM sur tapis, METs du Compendium ailleurs, au poids du jour), muscles sollicités.
   Stockage : x.cardio sur l'exo du log live = {type, segs:[{min,kmh,inc}|{min,lvl}], kcalM, hr, kmM,
   res:{min,km,dplus,kcal}} — `res` est figé à la validation (une pesée future ne réécrit rien).
   La série reste 1 « série » de x minutes (compat notes, historique, volume).
   Une COURSE tapis remplit l'objectif hebdo « Courir » et pose le 🏃 au calendrier (cardioLogHasRun),
   sans jamais compter comme une sortie de la progression course extérieure (sport.js). */
var CARDIO_TYPES=[
  {id:'marche',name:'Marche tapis',ico:'&#x1F6B6;',tapis:true,def:{min:20,kmh:6.5,inc:5},mus:['fessiers','mollets','ischios']},
  {id:'course',name:'Course tapis',ico:'&#x1F3C3;',tapis:true,def:{min:10,kmh:8,inc:1},mus:['quadris','mollets','ischios','fessiers']},
  {id:'escalier',name:'Escalier',ico:'&#x1FA9C;',lvl:'Niveau',def:{min:10,lvl:6},mus:['fessiers','quadris','mollets']},
  {id:'velo',name:'V&#xE9;lo',ico:'&#x1F6B4;',lvl:'Niveau',def:{min:20,lvl:8},mus:['quadris','fessiers']},
  {id:'rameur',name:'Rameur',ico:'&#x1F6A3;',lvl:'R&#xE9;sistance',def:{min:10,lvl:5},mus:['dos','quadris','ischios','biceps']},
  {id:'elliptique',name:'Elliptique',ico:'&#x26F7;&#xFE0F;',lvl:'Niveau',def:{min:20,lvl:8},mus:['quadris','fessiers','epaules']}
];
var CARDIO_MUS_LBL={quadris:'Quadriceps',mollets:'Mollets',ischios:'Ischios',fessiers:'Fessiers',dos:'Dos',biceps:'Biceps',epaules:'&#xC9;paules'};
var CARDIO_FEELS=[
  {v:'facile',ico:'&#x1F60C;',lbl:'Facile'},
  {v:'ok',ico:'&#x1F44D;',lbl:'Correct'},
  {v:'dur',ico:'&#x1F975;',lbl:'Dur'}
];

function cardioType(id){ return CARDIO_TYPES.find(function(t){ return t.id===id; })||CARDIO_TYPES[0]; }
function cardioNum(v){ var n=parseFloat(String(v==null?'':v).replace(',','.')); return isNaN(n)?null:n; }
function cardioFr(n,d){ if(n==null) return '&#x2014;'; var p=Math.pow(10,d||0); return String(Math.round(n*p)/p).replace('.',','); }
function cardioSegDefault(type){ var d=cardioType(type).def, s={min:d.min}; if(d.kmh!=null){ s.kmh=d.kmh; s.inc=d.inc; } else s.lvl=d.lvl; return s; }

// Dernier type utilisé sur cet exo (le rameur part toujours sur « rameur »)
function cardioLastType(key){
  if(key==='cardio_rameur') return 'rameur';
  var logs=DB.logs||[];
  for(var i=0;i<logs.length;i++){
    var ex=(logs[i].live&&logs[i].live.exos)||[];
    for(var j=0;j<ex.length;j++) if(ex[j].key===key&&ex[j].cardio&&ex[j].cardio.type) return ex[j].cardio.type;
  }
  return 'marche';
}
function cardioEnsure(x){
  if(!x.cardio){
    var t=cardioLastType(x.key);
    x.cardio={type:t,segs:[cardioSegDefault(t)],kcalM:null,hr:null,kmM:null};
  }
  return x.cardio;
}

// ── Calculs ──
// Tapis : équations ACSM (marche 0,1·v + 1,8·v·pente + 3,5 · course 0,2·v + 0,9·v·pente + 3,5, v en m/min),
// kcal = VO2 × kg / 1000 × 5. Autres machines : METs du Compendium indexés sur le niveau.
function cardioMetFor(type,lvl){
  var l=lvl||0, clamp=function(v,a,b){ return Math.max(a,Math.min(b,v)); };
  if(type==='escalier') return clamp(4+0.5*l,4,14);
  if(type==='velo') return clamp(3+0.4*l,3,12);
  if(type==='rameur') return clamp(4+0.5*l,4,12);
  return clamp(3.5+0.3*l,3.5,10); // elliptique
}
function cardioCalc(c,kg){
  kg=kg||70;
  var t=cardioType(c.type), r={min:0,km:0,dplus:0,kcal:0,kcalEst:0};
  (c.segs||[]).forEach(function(s){
    var m=Math.max(0,cardioNum(s.min)||0); if(!m) return;
    r.min+=m;
    if(t.tapis){
      var kmh=Math.max(0,cardioNum(s.kmh)||0), g=Math.max(0,cardioNum(s.inc)||0)/100, v=kmh*1000/60;
      var km=kmh*m/60; r.km+=km; r.dplus+=km*1000*g;
      var vo2=t.id==='course'?0.2*v+0.9*v*g+3.5:0.1*v+1.8*v*g+3.5;
      r.kcalEst+=vo2*kg/1000*5*m;
    } else {
      r.kcalEst+=cardioMetFor(t.id,cardioNum(s.lvl))*3.5*kg/200*m;
    }
  });
  if(!t.tapis){ var kmM=cardioNum(c.kmM); r.km=kmM&&kmM>0?kmM:0; }
  var kM=cardioNum(c.kcalM);
  r.kcal=Math.round(kM&&kM>0?kM:r.kcalEst);
  r.kcalEst=Math.round(r.kcalEst);
  r.min=Math.round(r.min*10)/10;
  r.km=Math.round(r.km*100)/100;
  r.dplus=Math.round(r.dplus);
  r.kmh=r.km&&r.min?r.km/(r.min/60):null;
  return r;
}
function cardioPace(r){
  if(!r.km||!r.min) return null;
  var p=Math.round(r.min*60/r.km);
  return Math.floor(p/60)+'&#x2032;'+String(p%60).padStart(2,'0')+'&#x2033;';
}
function cardioMusTxt(type){ return cardioType(type).mus.map(function(m){ return CARDIO_MUS_LBL[m]; }).join(' &#xB7; '); }
// Résumé une ligne (calendrier, bilan) : « 🏃 Course tapis · 10 min · 1 km · 104 kcal »
function cardioSummary(c){
  if(!c) return '';
  var t=cardioType(c.type), r=c.res||cardioCalc(c,getProfileBodyWeight());
  var p=[t.ico+' '+t.name,cardioFr(r.min,1)+' min'];
  if(r.km) p.push(cardioFr(r.km,2)+' km');
  if(r.dplus) p.push('D+ '+r.dplus+' m');
  if(r.kcal) p.push(r.kcal+' kcal');
  return p.join(' &#xB7; ');
}
// Détail des paliers : « 10 min à 6 km/h · 5 % » / « 15 min niv. 8 »
function cardioSegsTxt(c){
  var t=cardioType(c.type);
  return (c.segs||[]).filter(function(s){ return cardioNum(s.min)>0; }).map(function(s){
    return cardioFr(cardioNum(s.min),1)+' min '+(t.tapis
      ?'&#xE0; '+cardioFr(cardioNum(s.kmh),1)+' km/h &#xB7; '+cardioFr(cardioNum(s.inc),1)+'&#x202F;%'
      :(t.lvl==='R&#xE9;sistance'?'r&#xE9;s. ':'niv. ')+cardioFr(cardioNum(s.lvl),0));
  }).join(' &#x2192; ');
}
// Une course tapis menée au bout = une sortie « Courir » de la semaine (objectif + 🏃 calendrier)
function cardioLogHasRun(l){
  if(!l) return false;
  if(l.sport==='course') return true;
  return !!(l.live&&l.live.exos||[]).some(function(x){
    return x.cardio&&x.cardio.type==='course'&&(x.sets||[]).length>0;
  });
}
// Texte brut pour l'export Excel (les libellés de l'app sont en entités HTML)
function cardioPlain(s){ return String(s||'').replace(/&#x([0-9A-Fa-f]+);/g,function(m,h){ return String.fromCodePoint(parseInt(h,16)); }); }
// Lignes « Course & sports » de l'export coach (mêmes 17 colonnes que les sorties sport.js)
function cardioExportRows(logs,txt,r1){
  var rows=[], FE={facile:'facile',ok:'moyen',dur:'dur',echec:'très dur'};
  logs.forEach(function(l){
    ((l.live&&l.live.exos)||[]).forEach(function(x){
      if(!x.cardio||!(x.sets||[]).length) return;
      var c=x.cardio, r=c.res||cardioCalc(c,getProfileBodyWeight()), t=cardioType(c.type);
      var sec=Math.round(r.min*60), pace=r.km?Math.round(sec/r.km):null;
      rows.push([l.date,l.time||'','Cardio salle · '+cardioPlain(t.name),r.km||null,r1(r.min),pace?Math.floor(pace/60)+':'+String(pace%60).padStart(2,'0'):'',pace,
        r.kmh?r1(r.kmh):null,r.dplus||null,cardioNum(c.hr),null,null,r.kcal||null,FE[(x.sets[0]||{}).feel]||'','','',txt(cardioPlain(cardioSegsTxt(c)))]);
    });
  });
  return rows;
}

// ── Panneau LiveUp ──
function asCardioPanelHtml(x){
  var c=cardioEnsure(x), t=cardioType(c.type);
  var editing=AS.pend&&AS.pend.editIdx!=null;
  var feel=c.feel||(editing?(x.sets[AS.pend.editIdx]||{}).feel:null);
  var h='<div class="cd-panel">';
  h+='<div class="as-exo-kicker">'+AS.sname+'</div>';
  h+='<div class="as-exo-name lg">'+(editing?'&#x270E; Corriger le cardio':'Cardio')+'</div>';
  h+='<div class="as-lbl">Quelle machine&#x202F;?</div><div class="cd-types">';
  CARDIO_TYPES.forEach(function(tt){
    h+='<button class="cd-type'+(tt.id===c.type?' on':'')+(tt.id==='course'?' run':'')+'" onclick="asCardioType(\''+tt.id+'\')"><span class="cd-type-ico">'+tt.ico+'</span><span class="cd-type-name">'+tt.name+'</span></button>';
  });
  h+='</div>';
  if(c.type==='course') h+='<div class="cd-note run">&#x1F3C3; Compte dans ton objectif &#xAB;&#x202F;Courir&#x202F;&#xBB; de la semaine.</div>';
  if(c.type==='marche') h+='<div class="cd-note">Zone 2&#x202F;: 5&#x202F;% &#xB7; 6,5 km/h &#xB7; 20-25 min non-stop, ~130-140 bpm. <button class="cd-link" onclick="asCardioPreset()">Appliquer</button></div>';
  h+='<div class="as-lbl">Paliers <span class="cd-hint">un palier = des r&#xE9;glages tenus</span></div>';
  c.segs.forEach(function(s,i){
    h+='<div class="cd-seg"><div class="cd-seg-head"><span>Palier '+(i+1)+'</span>'
      +(c.segs.length>1?'<button class="cd-seg-del" onclick="asCardioDelSeg('+i+')" aria-label="Retirer le palier '+(i+1)+'">&#x2715;</button>':'')+'</div>'
      +'<div class="cd-seg-grid'+(t.tapis?'':' two')+'">'
      +asCardioField(i,'min','Dur&#xE9;e','min',s.min,'numeric')
      +(t.tapis
        ?asCardioField(i,'kmh','Vitesse','km/h',s.kmh,'decimal')+asCardioField(i,'inc','Inclinaison','%',s.inc,'decimal')
        :asCardioField(i,'lvl',t.lvl,'',s.lvl,'decimal'))
      +'</div></div>';
  });
  h+='<button class="cd-add" onclick="asCardioAddSeg()">&#xFF0B; Ajouter un palier</button>';
  h+='<div id="cdTotals">'+asCardioTotalsHtml(c)+'</div>';
  h+='<details class="cd-more"'+(c.kcalM||c.hr||c.kmM?' open':'')+'><summary>Ce que la machine affiche <span class="cd-hint">optionnel</span></summary><div class="cd-seg-grid'+(t.tapis?' two':'')+'">'
    +asCardioField(-1,'kcalM','Calories','kcal',c.kcalM,'numeric')
    +asCardioField(-1,'hr','FC moyenne','bpm',c.hr,'numeric')
    +(t.tapis?'':asCardioField(-1,'kmM','Distance','km',c.kmM,'decimal'))
    +'</div></details>';
  h+='<div class="as-lbl">C\'&#xE9;tait comment&#x202F;?</div><div class="as-feel-row cd-feels">';
  CARDIO_FEELS.forEach(function(f){
    h+='<button class="as-feel'+(feel===f.v?' on':'')+'" onclick="asCardioFeel(\''+f.v+'\')"><span>'+f.ico+'</span>'+f.lbl+'</button>';
  });
  h+='</div>';
  h+='<button id="cdDone" class="as-cta as-cta-full cd-done'+(feel&&cardioCalc(c).min>0?'':' cd-wait')+'" onclick="asCardioDone()">&#x2713; '+(editing?'Enregistrer la correction':'Cardio termin&#xE9;')+'</button>';
  if(!editing) h+='<div class="as-skip-row"><button class="as-skip-pill" onclick="asSkipExo()">&#x23ED;&#x23ED; Passer le cardio</button></div>';
  h+='</div>';
  return h;
}
function asCardioField(i,f,lbl,unit,val,mode){
  var id='cd-'+(i<0?'x':i)+'-'+f;
  return '<label class="cd-field" for="'+id+'"><span class="cd-field-lbl">'+lbl+'</span>'
    +'<span class="cd-field-box"><input id="'+id+'" class="ed-input cd-input" type="text" inputmode="'+mode+'" autocomplete="off" value="'+(val==null?'':String(val).replace('.',','))+'" oninput="asCardioInput('+i+',\''+f+'\',this.value)">'
    +(unit?'<span class="cd-unit">'+unit+'</span>':'')+'</span></label>';
}
function asCardioTotalsHtml(c){
  var t=cardioType(c.type), r=cardioCalc(c,getProfileBodyWeight());
  var st=[[cardioFr(r.min,1)+' min','Dur&#xE9;e']];
  if(t.tapis){ st.push([cardioFr(r.km,2)+' km','Distance']); st.push([r.dplus+' m','D&#xE9;nivel&#xE9; +']); }
  else if(r.km) st.push([cardioFr(r.km,2)+' km','Distance']);
  st.push([(cardioNum(c.kcalM)>0?'':'&#x2248;&#x202F;')+r.kcal+' kcal',cardioNum(c.kcalM)>0?'Calories (machine)':'Calories']);
  if(t.tapis&&r.km){ st.push([cardioPace(r)+'/km','Allure']); st.push([cardioFr(r.kmh,1)+' km/h','Vitesse moy.']); }
  var h='<div class="sp-stats cd-stats">';
  st.forEach(function(s){ h+='<div class="sp-stat"><b>'+s[0]+'</b><span>'+s[1]+'</span></div>'; });
  h+='</div><div class="cd-mus">&#x1F4AA; '+cardioMusTxt(c.type)+'</div>';
  return h;
}
function asCardioCur(){ var x=AS&&AS.exos&&AS.exos[AS.cur]; return x&&x.cardio?x:null; }
function asCardioRefresh(){
  var x=asCardioCur(); if(!x) return;
  var el=document.getElementById('cdTotals'); if(el) el.innerHTML=asCardioTotalsHtml(x.cardio);
  var b=document.getElementById('cdDone');
  if(b){ var editing=AS.pend&&AS.pend.editIdx!=null, feel=x.cardio.feel||(editing?(x.sets[AS.pend.editIdx]||{}).feel:null);
    b.classList.toggle('cd-wait',!(feel&&cardioCalc(x.cardio).min>0)); }
}
// Saisie sans re-render (garde le focus et le clavier ouverts)
function asCardioInput(i,f,v){
  var x=asCardioCur(); if(!x) return;
  var n=cardioNum(v), val=n==null?null:Math.max(0,n);
  if(i<0) x.cardio[f]=val; else if(x.cardio.segs[i]) x.cardio.segs[i][f]=val;
  asSave(); asCardioRefresh();
}
function asCardioType(id){
  var x=asCardioCur(); if(!x||x.cardio.type===id) return;
  var oldT=cardioType(x.cardio.type), nt=cardioType(id);
  // On garde les durées ; les réglages changent de nature (vitesse/inclinaison ↔ niveau) seulement si besoin
  x.cardio.segs=x.cardio.segs.map(function(s){
    var d=cardioSegDefault(id); d.min=s.min;
    if(!!oldT.tapis===!!nt.tapis){ if(nt.tapis){ d.kmh=s.kmh; d.inc=s.inc; } else d.lvl=s.lvl; }
    return d;
  });
  x.cardio.type=id; if(!nt.tapis) x.cardio.kmM=null;
  asSave(); asRender();
}
function asCardioPreset(){
  var x=asCardioCur(); if(!x) return;
  x.cardio.segs=[{min:20,kmh:6.5,inc:5}];
  asSave(); asRender();
}
function asCardioAddSeg(){
  var x=asCardioCur(); if(!x) return;
  var last=x.cardio.segs[x.cardio.segs.length-1]||cardioSegDefault(x.cardio.type);
  x.cardio.segs.push(JSON.parse(JSON.stringify(last)));
  asSave(); asRender();
  setTimeout(function(){ var el=document.getElementById('cd-'+(x.cardio.segs.length-1)+'-min'); if(el) el.scrollIntoView({block:'center',behavior:'smooth'}); },60);
}
function asCardioDelSeg(i){
  var x=asCardioCur(); if(!x||x.cardio.segs.length<2) return;
  x.cardio.segs.splice(i,1);
  asSave(); asRender();
}
function asCardioFeel(v){
  var x=asCardioCur(); if(!x) return;
  x.cardio.feel=v;
  asSave(); asRender();
}
function asCardioDone(){
  var x=asCardioCur(); if(!x) return;
  var c=x.cardio, editing=AS.pend&&AS.pend.editIdx!=null;
  var feel=c.feel||(editing?(x.sets[AS.pend.editIdx]||{}).feel:null);
  c.segs=c.segs.filter(function(s){ return cardioNum(s.min)>0; });
  if(!c.segs.length){ c.segs=[cardioSegDefault(c.type)]; asRender(); showToast('Indique la dur&#xE9;e de ton palier'); return; }
  // Bouton jamais grisé (un bouton mort sans explication = frustrant) : il dit ce qui manque
  if(!feel){ showToast('Dis-moi d\'abord comment c\'&#xE9;tait &#x1F447;'); var fr=document.querySelector('.cd-feels'); if(fr) fr.scrollIntoView({block:'center',behavior:'smooth'}); return; }
  c.res=cardioCalc(c,getProfileBodyWeight()); // figé : une pesée future ne réécrit pas cette séance
  delete c.feel;
  var mins=Math.max(1,Math.round(c.res.min));
  x.n=1; x.weight=mins;
  if(!editing) AS.pend={reps:mins,feel:feel,setNo:AS.setIdx};
  else { AS.pend.reps=mins; AS.pend.feel=feel; AS.pend.w=mins; }
  asStopRest();
  asValidateSet();
  if(c.type==='course') showToast('&#x1F3C3; Course enregistr&#xE9;e &#x2014; objectif &#xAB;&#x202F;Courir&#x202F;&#xBB; coch&#xE9;');
}
