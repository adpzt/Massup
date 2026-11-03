// ══════════════════════════════════════════════════
// BILAN — carte profil (en-tête de la vue)
// ══════════════════════════════════════════════════
// Carte profil v2 (15/08 soir, demande Adrien) : UNE carte propre qui fusionne l'identité,
// la dernière pesée en héros et l'essentiel du poids (Δ30j · rythme · total depuis mars).
// Sortis (sa demande) : « X séances/sem », le Δ 7 jours et la distance au repère 76 kg.
// renderBilanHero / renderBilanWeightStats sont débranchés mais conservés plus bas.
function renderBilanProfile(){
  var el=document.getElementById('bilanProfile'); if(!el) return;
  var p=DB.profile||{};
  var name=p.name||'Adrien';
  var age=p.age||DEFAULT_AGE;
  var height=p.height||172;
  var goalMap={masse:'Prise de masse',force:'Force',seche:'S&#xE8;che',maintien:'Maintien'};
  var initials=name.slice(0,2).toUpperCase();
  var data=DB.bodyWeight||[];
  var last=data.length?data[data.length-1]:null;
  var prev=data.length>1?data[data.length-2]:null;
  var first=data.length?data[0]:null;
  var current=last?parseFloat(last.weight_kg):null;
  var dPrev=(last&&prev)?Math.round((current-parseFloat(prev.weight_kg))*10)/10:null;
  var total=(last&&first)?Math.round((current-parseFloat(first.weight_kg))*10)/10:null;
  // (01/09) Bug Δ30j corrigé : l'ancienne version prenait la 1re pesée antérieure à J-30
  // par rapport à AUJOURD'HUI — avec des pesées espacées, la référence pouvait dater de
  // 45-60 j et le delta affiché « /30 jours » était gonflé (ex. +3,5 kg à tort).
  // Désormais : fenêtre ancrée sur la DERNIÈRE pesée, référence = pesée la plus proche
  // de (dernière − 30 j), et delta ramené à 30 jours au prorata du nombre de jours
  // réellement écoulés entre les deux pesées. Même prorata pour le kg/semaine.
  var d30=null, rate=null;
  if(last&&data.length>=2){
    var lastT=new Date(last.date).getTime(), targetT=lastT-30*86400000;
    var ref=null,best=Infinity;
    for(var k=0;k<data.length-1;k++){
      var gap=Math.abs(new Date(data[k].date).getTime()-targetT);
      if(gap<=best){ best=gap; ref=data[k]; }
    }
    var refDays=(lastT-new Date(ref.date).getTime())/86400000;
    if(refDays>=7){ // en dessous d'une semaine d'écart, extrapoler n'a pas de sens
      var perDay=(current-parseFloat(ref.weight_kg))/refDays;
      d30=Math.round(perDay*30*10)/10;
      rate=Math.round(perDay*7*100)/100;
    }
  }
  // 02/11 : avec 3 pesées ou plus sur 4 semaines, le rythme vient de la pente de toutes les pesées
  // (bwRate) — une pesée gonflée par l'eau ne fausse plus le kg/semaine. Sinon, calcul ci-dessus.
  var R=bwRate(data);
  if(R){ rate=Math.round(R.rate*100)/100; d30=Math.round(R.rate/7*30*10)/10; }
  function fmtD(v,dec){ return v==null?'--':(v>0?'+':'')+String(dec?v.toFixed(dec):v).replace('.',','); }
  var h='<div class="bp-card bp-v2">'
    +'<div class="bp-head">'
    +'<div class="bp-avatar">'+initials+'</div>'
    +'<div class="bp-id"><div class="bp-name">'+name+'</div>'
    +'<div class="bp-sub">'+age+' ans &#xB7; '+height+' cm &#xB7; Ectomorphe &#xB7; <strong style="color:var(--acc)">'+(goalMap[p.goal]||'Prise de masse')+'</strong></div></div>'
    +(function(){
      if(!FEATURE_RANK) return ''; // rank mis de côté (15/08) — se réactive via le flag
      try{
        var st=rankState();
        return '<div class="bp-rank bp-rank-hex" title="'+st.glob.rp+' RP — '+st.season.label+'" onclick="openSeasonModal('+st.season.id+')">'
          +rankMedalHtml(st.globalTier,st.globalDiv,38,true)
          +'<span class="bp-rank-tier" style="color:'+st.globalTier.color+'">'+st.globalTier.name+'</span>'
          +'</div>';
      }catch(e){ return ''; }
    })()
    +'</div>';
  if(current!=null){
    h+='<div class="bp-weigh">'
      +'<div class="bp-weigh-main">'
      +'<div class="bp-weigh-lbl">DERNI&#xC8;RE PES&#xC9;E &#xB7; '+formatDateFr(last.date)+'</div>'
      +'<div class="bp-weigh-v">'+String(current).replace('.',',')+' <span class="bp-weigh-u">kg</span></div>'
      +(dPrev!=null?'<div class="bp-weigh-meta"><span style="color:'+(dPrev>0?'#5FD695':dPrev<0?'#FF6B7A':'var(--mut)')+';font-weight:800">'+fmtD(dPrev)+' kg</span> vs pes&#xE9;e pr&#xE9;c&#xE9;dente</div>':'')
      +'</div>'
      +'<button class="bilan-pesee-btn" onclick="openPeseeModal()">+ Pes&#xE9;e</button>'
      +'</div>';
    h+='<div class="bp-stats">'
      +'<div class="bp-stat"><span class="bp-stat-v" style="color:'+(d30>0?'var(--acc)':'var(--mut)')+'">'+fmtD(d30)+'</span><span class="bp-stat-l">kg / 30 jours</span></div>'
      +'<div class="bp-stat"><span class="bp-stat-v" style="color:'+(rate!=null&&rate>0&&rate<=0.5?'var(--acc)':rate>0.5?'var(--yellow)':'var(--mut)')+'">'+fmtD(rate,2)+'</span><span class="bp-stat-l">kg / semaine</span></div>'
      +'<div class="bp-stat"><span class="bp-stat-v" style="color:var(--acc2)">'+fmtD(total)+'</span><span class="bp-stat-l">depuis mars</span></div>'
      +'</div>';
  } else {
    h+='<div class="bp-weigh"><div class="bp-weigh-main"><div class="bp-weigh-lbl">AUCUNE PES&#xC9;E</div></div>'
      +'<button class="bilan-pesee-btn" onclick="openPeseeModal()">+ Pes&#xE9;e</button></div>';
  }
  h+='</div>';
  el.innerHTML=h;
}

// ══════════════════════════════════════════════════
// PROGRESSION — radar points forts / points faibles
// ══════════════════════════════════════════════════
var _radarChart=null;
var RADAR_GROUPS=[
  {label:'Pecs',keys:['chestpress_v','pecdeck','dev_incline','cable_fly','seated_dips','dips_assist','m_floor_press']},
  {label:'Épaules',keys:['elev_lat','shrug_halt','face_pull','shoulder_press','dev_militaire']},
  {label:'Triceps',keys:['triceps_corde','triceps_barre','m_triceps']},
  {label:'Dos',keys:['tirage_vert','rowing_pb','rowing_uni','rowing_appui','tirage_pulldown','traction_assist','m_rowing']},
  {label:'Biceps',keys:['curl_marteau','curl_marteau_croise','curl_incline_neutre','curl_corde','curl_halt','curl_poulie','curl_incline','m_marteau']},
  {label:'Jambes',keys:['leg_press','leg_ext','leg_curl','mollets','abduct','adduct','hip_thrust','m_rdl','m_fentes','m_mollets']},
  // Abdos ajoutés au volume hebdo le 06/08 (demande Adrien) — gainage inclus (c'est du tronc)
  {label:'Abdos',keys:['crunch_poulie','releve_chaise','pallof','dead_bug','hollow_hold','crunch','gainage','crunch_leste','crunch_decline','crunch_decline_leste','m_releves']}
];
// Crédit « muscle assistant » pour le VOLUME hebdo (05/08, question Adrien) : chaque série
// d'un polyarticulaire compte 1 pour son muscle cible + 0,5 pour l'assistant (un tirage
// travaille aussi les biceps, une presse les triceps/épaules) — standard hypertrophie.
// N'affecte QUE les barres de volume, jamais le rank ni les notes.
var VOL_SECONDARY={
  tirage_vert:{'Biceps':.5},tirage_pulldown:{'Biceps':.5},traction_assist:{'Biceps':.5},
  rowing_pb:{'Biceps':.5},rowing_appui:{'Biceps':.5},rowing_uni:{'Biceps':.5},
  chestpress_v:{'Épaules':.5,'Triceps':.5},dev_incline:{'Épaules':.5,'Triceps':.5},
  seated_dips:{'Triceps':.5},dips_assist:{'Triceps':.5},dev_militaire:{'Triceps':.5},shoulder_press:{'Triceps':.5},
  face_pull:{'Dos':.5},
  m_floor_press:{'Triceps':.5},m_rowing:{'Biceps':.5}
};
function volAddSets(vol,key,n){
  if(!n) return;
  var g=rankGroupOf(key);
  if(g) vol[g]=(vol[g]||0)+n;
  var sec=VOL_SECONDARY[key];
  if(sec) Object.keys(sec).forEach(function(g2){ vol[g2]=(vol[g2]||0)+n*sec[g2]; });
}
// Nombre d'exécutions COMPTÉES d'un exo dans les X derniers jours (règle liveExoCounted)
function execsInWindow(key,days){
  var cutoff=new Date(getNow().getTime()-days*86400000);
  var info=findExoIndex(key); if(!info) return 0;
  return (DB.logs||[]).filter(function(l){
    if(!l.date||new Date(l.date)<cutoff) return false;
    if(l.live&&l.live.exos){
      var lx=null; l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      return lx?liveExoCounted(lx):false;
    }
    return (l.sessions||[]).some(function(sid){ return sid==='exo:'+key||(sid===info.sid&&exoMainForLog(info,key,l.date)); });
  }).length;
}
// Nombre d'exécutions COMPTÉES d'un exo depuis une date (règle liveExoCounted)
function execsSince(key,startDate){
  var info=findExoIndex(key); if(!info) return 0;
  return (DB.logs||[]).filter(function(l){
    if(!l.date||l.date<startDate) return false;
    if(l.live&&l.live.exos){
      var lx=null; l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      return lx?liveExoCounted(lx):false;
    }
    return (l.sessions||[]).some(function(sid){ return sid==='exo:'+key||(sid===info.sid&&exoMainForLog(info,key,l.date)); });
  }).length;
}
// Un exo n'entre dans le radar que s'il fait partie de la pratique ACTUELLE d'Adrien :
// pas masqué (blessure/abandon) ET réellement exécuté DEPUIS LE DÉBUT DE LA SAISON en cours
// (retour Adrien 01/08 : « ma vraie note » = seulement les exos refaits cette saison).
// → tant qu'un exo n'a pas été refait cette saison, il n'entre pas dans la note ; le groupe
//   retombe sur les exos avec données (fallback) pour ne pas afficher un radar vide en début de saison.
function radarActiveKey(k){
  var info=findExoIndex(k);
  if(!info||info.exo.hidden) return false;
  if(!STRENGTH_STD[k]) return false;
  if(!getCurrentWeight(k)) return false;
  var ss=rankCurrentSeason().start;
  return execsSince(k,ss)>0;
}
// Score d'un exo, ancré sur les paliers réels : 0 = débutant, 50 = intermédiaire, 100 = avancé
// (interpolation par segments, pour que la légende affichée soit exacte)
function radarExoScore(k,bwt){
  var std=STRENGTH_STD[k]; if(!std) return null;
  var w=getCurrentWeight(k); if(!w) return null;
  var beg=std.beg*bwt, itm=(std.int||((std.beg+std.adv)/2))*bwt, adv=std.adv*bwt;
  var s;
  if(w<=itm) s=(w-beg)/Math.max(0.01,(itm-beg))*50;
  else s=50+(w-itm)/Math.max(0.01,(adv-itm))*50;
  return Math.max(0,Math.min(115,Math.round(s)));
}
// v3 : les notes du radar = les mêmes que le rank — progression de saison vers l'objectif du
// 1er janvier (100 = objectif atteint). Un groupe sans exo refait cette saison = 0 (Bronze III).
function radarScores(){
  var lad;
  try{ lad=rankLadder(); }catch(e){ return null; }
  return lad.groups.map(function(g){
    return {label:g.label,score:g.p!==null?Math.round(Math.min(1,g.p)*100):0,rated:g.p!==null,ahead:g.ahead};
  });
}
// v3 : détail par groupe musculaire — note pondérée par coefficients, tier + division,
// exos pas encore refaits = Bronze III (hors calcul), avance sur le rythme en dégradé bleu.
function radarDetailHtml(){
  var lad; try{ lad=rankLadder(); }catch(e){ return ''; }
  var h='';
  lad.groups.forEach(function(g){
    h+='<div class="nv-group'+(g.p!==null?'':' off')+'">'
      +'<div class="nv-ghead">'
      +'<span class="nv-gname">'+g.label+'</span>'
      +'<span class="nv-tier"'+(g.rated?' style="background:'+g.lad.tier.grad+';color:'+g.lad.tier.txt+';"':'')+' title="M&#xE9;daille = chemin de SAISON parcouru vers l\'objectif">'+g.lad.tier.name+' '+g.lad.div+'</span>'
      +(g.p!==null?'<span class="nv-gscore'+(g.ahead?' ahead':'')+'">'+Math.round(Math.min(1,g.p)*100)+'<small>/100</small></span>':'<span class="nv-gscore muted">&#x2014;</span>')
      +'</div>'
      +'<div class="nv-rows">';
    g.rows.forEach(function(r){
      // « à refaire cette saison » : plus de mention — la ligne est juste grisée comme les « à faire » (02/08)
      h+='<div class="nv-row'+(r.active&&!r.stale?'':' off')+'">'
        +'<span class="nv-coef c'+r.coef+'" title="Poids de cet exo dans la note du groupe">&#xD7;'+r.coef+'</span>'
        +'<span class="nv-name">'+getExoName(r.key)+'</span>'
        +(r.active&&!r.stale
          ?'<span class="nv-val'+(r.ahead?' ahead':'')+'">'+Math.round(Math.min(1,r.p)*100)+'<small>/100</small></span>'
          :'<span class="nv-val muted">&#xE0; faire</span>')
        +'</div>';
    });
    h+='</div></div>';
  });
  // (Texte d'explication sous les notes /100 SUPPRIMÉ le 14/08 — demande Adrien. La règle vit
  // dans COACH.md : note 50 = poids du 30/07 · 100 = objectif du 1er janvier · bleu = en avance.)
  return h;
}
function toggleRadarDetail(){
  var el=document.getElementById('radarDetail'); if(!el) return;
  var open=el.style.display!=='none';
  if(!open) el.innerHTML=radarDetailHtml();
  el.style.display=open?'none':'';
  var arr=document.getElementById('radarDetailArr');
  if(arr) arr.innerHTML=open?'&#x25B8;':'&#x25BE;';
}
function renderLevelRadar(){
  if(!FEATURE_RADAR) return; // araignée des notes mise de côté (15/08)
  if(typeof Chart==='undefined') return;
  var cv=document.getElementById('radarChart'); if(!cv) return;
  var lad; try{ lad=rankLadder(); }catch(e){ return; }
  var note=document.getElementById('radarNote');
  var labels=lad.groups.map(function(g){return g.label;});
  var vals=lad.groups.map(function(g){return g.p!==null?Math.round(Math.min(1,g.p)*100):0;});
  // rythme attendu PAR GROUPE (ancré sur les niveaux de départ des exos du groupe)
  var paceVals=lad.groups.map(function(g){return Math.round((g.paceP!=null?g.paceP:lad.pace)*100);});
  // Échelle FIXE 50→100 (06/08, demande Adrien) : centre = 50, bord = 100 — un 60 et un 65 se
  // distinguent à l'œil. Les DONNÉES ne bougent pas : seul l'affichage est borné (une note sous
  // 50 se dessine au centre, le tooltip garde la vraie valeur).
  var rMin=50;
  var dispVals=vals.map(function(v,i){return lad.groups[i].p!==null?Math.max(rMin,v):rMin;});
  var dispPace=paceVals.map(function(v){return Math.max(rMin,v);});
  var ctx=cv.getContext('2d');
  var grad=ctx.createLinearGradient(0,0,300,300);
  grad.addColorStop(0,'#71FFB4'); grad.addColorStop(.55,'#3FD9FF'); grad.addColorStop(1,'#5B7CFF');
  var ds=[
    {label:'Niveau',data:dispVals,borderColor:grad,backgroundColor:'rgba(63,217,255,.13)',borderWidth:2,
     pointBackgroundColor:'#71FFB4',pointBorderColor:'rgba(11,13,18,.85)',pointBorderWidth:2,pointRadius:4.5},
    {label:'Rythme attendu',data:dispPace,borderColor:'rgba(255,201,77,.4)',borderDash:[5,5],borderWidth:1.2,
     backgroundColor:'transparent',pointRadius:0,fill:false}
  ];
  if(_radarChart){
    _radarChart.data.labels=labels;
    _radarChart.data.datasets=ds;
    _radarChart.options.scales.r.min=rMin;
    _radarChart._raw={vals:vals,pace:paceVals};
    _radarChart.update('none');
  } else {
    _radarChart=new Chart(ctx,{
      type:'radar',
      data:{labels:labels,datasets:ds},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){
          // vraie valeur (pas la valeur bornée à 50 de l'affichage)
          var raw=c.chart._raw;
          var v=raw?(c.datasetIndex===0?raw.vals[c.dataIndex]:raw.pace[c.dataIndex]):c.parsed.r;
          return c.dataset.label+' : '+v+' / 100';
        }}}},
        scales:{r:{min:rMin,max:100,ticks:{display:false},
          grid:{color:'rgba(255,255,255,.07)'},angleLines:{color:'rgba(255,255,255,.07)'},
          pointLabels:{color:'rgba(242,245,250,.65)',font:{size:11,weight:'700',family:'Manrope'}}}}}
    });
    _radarChart._raw={vals:vals,pace:paceVals};
  }
  if(note){
    var rated=lad.groups.filter(function(g){return g.p!==null;});
    var line;
    if(!rated.length){
      line='Refais tes exos en s&#xE9;ance pour activer tes notes &#x2014; chaque groupe d&#xE9;marre &#xE0; Bronze III.';
    } else {
      var sorted=rated.slice().sort(function(a,b){return b.p-a.p;});
      var best=sorted[0], worst=sorted[sorted.length-1];
      line='&#x1F4AA; Point fort&#x202F;: <strong>'+best.label+'</strong> &#xB7; &#x1F3AF; &#xC0; pousser&#x202F;: <strong>'+worst.label+'</strong>';
    }
    note.innerHTML=line
      +'<br><span class="radar-hint">centre 50 = ton d&#xE9;part de saison (27/07) &#xB7; bord 100 = objectif du 1er janvier &#xB7; pointill&#xE9;s jaunes = o&#xF9; le rythme de la saison te place aujourd\'hui</span>'
      +'<button class="rdd-toggle" onclick="toggleRadarDetail()">Le d&#xE9;tail par muscle <span id="radarDetailArr">&#x25B8;</span></button>'
      +'<div id="radarDetail" style="display:none"></div>';
  }
}

// ══════════════════════════════════════════════════
// RANK APEX — moteur de points (spec : massup_rank_concepts.md)
// Tout est RECALCULÉ depuis DB.logs à la volée (déterministe, aucun état à corrompre) :
// corriger une séance dans le calendrier régénère automatiquement les RP.
// ══════════════════════════════════════════════════
var RANK_SEASONS=[
  {id:0,label:'Saison 0',start:'2026-03-02',end:'2026-07-26'},
  {id:1,label:'Saison 1 · Bulk',start:'2026-07-27',end:'2027-01-03'}
];
// L'économie complète — balance : une séance live pleine ≈ 600-800 RP ; une semaine à 4 ≈ 3 000 RP ;
// une semaine ratée (2 séances) coûte ~300 ; une semaine blanche ≈ −800 − decay. Voir doc §2.
var RANK_ECO={
  serie:[10,15,25,40],        // RP de base par série (position 1→4+, la 4e+ prévue vaut 40)
  serieBonus:60,              // 1re série volontaire au-delà du prévu (« ↻ +1 série »)
  serieBonusExtra:10,         // séries volontaires suivantes (anti-farm)
  qFull:1.25,qOk:1.0,qLow:0.5, // multiplicateur qualité : cible atteinte (échec compris) / proche / raté-ou-pas-au-bout (0,5 depuis le 02/08 : l'exécution pèse VRAIMENT sur les pts)
  cleanSweep:100,             // tous les principaux comptés, toutes séries prévues faites
  pr:80,prCap:3,              // hausse de poids validée en séance (assistance baissée si inversé)
  refresh:30,refreshGapDays:75, // refaire un exo gelé (pas compté depuis 75 j+)
  mvp:25,                     // meilleur exo (note /5) si ≥3 exos engagés
  precision:10,precisionCap:3, // dernière série d'un exo ressentie « facile »
  skipMain:-30,dropMain:-10,  // principal skippé direct / lâché à 1-2 séries
  floor:15,                   // plancher : une séance live validée rapporte toujours ≥ +15 net
  annexCap:3,                 // annexes RP-éligibles max par séance (exo jambes obligatoire + bonus)
  manualSalle:600,            // forfait séance loggée sans le mode direct (× logWeight) — jamais sanctionnée
  dayCap:1000,                // RP max/jour (anti double-séance farm)
  wRatioMin:0.6,wRatioMax:1.4, // bornes du prorata poids de série vs référence (s.w/w0)
  pdjRP:30,pdjPerfect:60,     // nutrition hebdo : petit-déj = LA priorité (obj. 4/sem — 04/08) + bonus 7/7
  shakerRP:15,shakerBonus:30, // shaker (obj. 2/sem — 04/08) + bonus ≥6
  cardioPts:100,cardioCap:2,  // cardio OTHERS : forfait par cardio validé, max 2/semaine (03/08)
  cardioW1:15,cardioW2:15,    // check hebdo cardio : aligné sur le shaker (04/08) — la séance cardio paie déjà ses 100 pts
  stretchPts:15,stretchCap:4, // étirements (espace Détente) : +15/jour étiré, cap 4/sem — comptés AU BILAN HEBDO (04/08)
  week5:500,week4:200,week2:-300,week1:-600,week0:-800, // check hebdo (v = weekValue, 3 = neutre)
  streak:[0,0,150,250,350,450], // bonus additionnel par longueur de streak de semaines à ≥4 (cap)
  offGrace:3,offBase:25,offMult:1.5,offDayCap:200, // decay : dès le 4e jour off consécutif, 25×1,5^n, cap 200/j
  divisions:[0,1500,3500]     // seuils RP de saison par groupe → division III / II / I
};
var RANK_TIERS=[
  {name:'Bronze',  color:'#E8A87C',grad:'linear-gradient(150deg,#E8A87C,#B87843 55%,#8A4E2A)',txt:'#3A2003',min:-999},
  {name:'Argent',  color:'#F0F3F8',grad:'linear-gradient(150deg,#F0F3F8,#BCC4D2 55%,#8A93A5)',txt:'#1A1D24',min:25},
  {name:'Or',      color:'#E8B23A',grad:'linear-gradient(150deg,#FFE9A0,#E8B23A 55%,#9C6B12)',txt:'#3A2803',glow:'0 0 12px rgba(232,178,58,0.5)',min:45},
  {name:'Platine', color:'#8ED8E8',grad:'linear-gradient(150deg,#C8F4FF,#7BC0D4 55%,#3E8CA8)',txt:'#062733',min:65},
  {name:'Diamant', color:'#8FD0FF',grad:'linear-gradient(150deg,#EAF8FF,#8FD0FF 45%,#3E7BFF)',txt:'#062033',glow:'0 0 14px rgba(110,180,255,0.55)',min:85},
  {name:'Champion',color:'#FFB25E',grad:'linear-gradient(150deg,#FFE9A0,#FF9D4D 45%,#FF5D9E)',txt:'#3A1503',glow:'0 0 16px rgba(255,140,90,0.55)',min:101}
];

// ══════════════════════════════════════════════════
// RANK v3 (01/08/2026 — refonte Adrien) : le rank = PROGRESSION VERS LES OBJECTIFS DU 1ER JANVIER.
// - Par exo : p = (poids actuel − poids au début de la Saison Bulk) / (objectif − poids de début).
//   Inversé pour traction/dips (moins d'assistance = mieux). p=0 → Bronze III · p=1 → objectif atteint.
// - Par groupe : moyenne PONDÉRÉE par coefficients (5 principal ciblé · 3 bonus ciblé · 2 secondaire).
//   Seuls les exos refaits cette saison notent ; un exo jamais refait = Bronze III, hors calcul.
// - Échelle : 18 crans (6 tiers × 3 divisions) · 100 RP par division · 1800 RP = Champion I = TOUS les objectifs.
// - Global = moyenne des 6 groupes (groupe non activé = 0) → atteindre tous les poids cibles au
//   1er janvier 2027 = Champion partout, garanti par construction.
var RANK_COEF_GROUPS=[
  {label:'Pecs',exos:{dev_incline:5,chestpress_v:5,pecdeck:5,cable_fly:3,seated_dips:3,dips_assist:3}},
  // elev_lat_pull retiré (02/08, demande Adrien) : même mouvement que elev_lat → une seule entrée Épaules
  {label:'Épaules',exos:{elev_lat:5,face_pull:5,shoulder_press:3,dev_militaire:3,shrug_halt:3}},
  {label:'Triceps',exos:{triceps_corde:5,triceps_barre:3,seated_dips:3,dips_assist:3,chestpress_v:2,dev_incline:2}},
  {label:'Dos',exos:{tirage_vert:5,rowing_pb:5,rowing_appui:5,tirage_pulldown:3,traction_assist:3,rowing_uni:3,face_pull:2}},
  // Refonte PULL 15/08 : croisé + incliné neutre = principaux (5), marteau/corde = bonus (3)
  {label:'Biceps',exos:{curl_marteau_croise:5,curl_incline_neutre:5,curl_marteau:3,curl_corde:3,curl_halt:3,tirage_vert:2,rowing_pb:2}},
  {label:'Jambes',exos:{leg_press:5,leg_ext:5,leg_curl:5,mollets:3,hip_thrust:3,abduct:3,adduct:3}}
];
function weightAtDate(key,dateStr){
  var arr=DB.weights[key]||[]; var v=null;
  for(var i=0;i<arr.length;i++){ if(arr[i].date<=dateStr) v=arr[i].val; }
  if(v==null&&arr.length) v=arr[0].val;
  return v;
}
// ═══ GOALS v4 (14/08/2026, « repars à zéro ») : TOUT est ancré sur la SAISON EN COURS. ═══
// Un exo = un point de départ (son poids au début de saison, 27/07) + une cible au 1er janvier.
// Fini l'ancre de mars : la saison fait 22 semaines, le rythme attendu = le % de semaines
// écoulées, identique pour tous les exos — lisible et honnête.
// ── ANCRE OFFICIELLE de la Saison 1 : les poids RÉELS du 30/07/2026 (fichier retrouvé par
// Adrien le 14/08 — « état de la progression 30 juillet »). C'est LE point zéro de la saison :
// Bronze III / note 50 = ces poids-là, Champion / note 100 = l'objectif du 1er janvier.
// Les entrées de DB.weights autour du 27/07 étaient partiellement périmées (seeds d'avril) →
// les ancres sont gravées ici, plus jamais dérivées d'un historique flou.
// Exos absents du fichier (ajoutés début août) : ancre = leur 1re charge RÉELLE de la saison.
var START_S1={
  // PUSH (fichier 30/07)
  chestpress_v:50,dev_incline:18,pecdeck:44,elev_lat:8,triceps_corde:20,
  // PULL (fichier 30/07)
  tirage_vert:48,rowing_pb:44,rowing_uni:20,curl_halt:12,curl_marteau:10,curl_poulie:16,
  face_pull:20,traction_assist:30,
  // Bonus / autres (fichier 30/07)
  triceps_barre:18,dips_assist:30,
  // LEGS (fichier 30/07)
  leg_press:75,leg_ext:30,leg_curl:20,
  // Calibrés en début de saison (pas dans le fichier) — 1re charge réelle
  curl_corde:12,rowing_appui:35,shrug_halt:20,cable_fly:12,abduct:25,adduct:25,
  seated_dips:30,tirage_pulldown:50,shoulder_press:16,curl_incline:8,
  dev_militaire:14,curl_marteau_croise:10,curl_incline_neutre:8,mollets:40,hip_thrust:50,
  crunch_poulie:20,releve_chaise:10,pallof:10,hollow_hold:20,gainage:40,crunch:15,gripper:20,
  crunch_leste:5 // ajouté au programme le 22/08 — ancre = 1re charge réelle
};
// Poids au DÉBUT de la saison : ancre officielle START_S1 pour la Saison 1,
// sinon (saison 0 rétro / exo hors table) le 1er poids connu à la date de départ.
function exoSeasonStartWeight(key,season){
  season=season||rankCurrentSeason();
  if(season.id===1&&START_S1[key]!=null) return START_S1[key];
  return weightAtDate(key,season.start);
}
// Objectifs « champion » RÉTRO-CALCULÉS de la Saison 0 (mars → 26 juillet) : le rythme parfait-mais-humain
// d'un débutant de 21 ans en surplus depuis ses poids de la 1re séance de mars, vacances (3 sem.) comprises.
// → openSeasonModal(0) note la saison 0 contre CES cibles (ce qu'un sans-faute aurait donné).
var GOALS_S0={
  chestpress_v:52,dev_incline:18,pecdeck:52,elev_lat:8,triceps_corde:24,dips_assist:22,
  tirage_vert:50,rowing_pb:46,rowing_uni:22,curl_marteau:14,curl_halt:14,curl_poulie:14,curl_incline:10,face_pull:22,
  tirage_pulldown:54,traction_assist:25,shoulder_press:20,dev_militaire:17,triceps_barre:22,poulie_triceps_av:22, // dev_militaire converti en kg/côté haltères (14/08 : ×0,7)
  leg_press:90,leg_ext:52,leg_curl:38,mollets:52,hip_thrust:62
};
function seasonGoals(season){ return (season&&season.id===0)?GOALS_S0:GOALS_JAN; }
function goalProgress(key,season){
  season=season||rankCurrentSeason();
  var goals=seasonGoals(season);
  var goal=goals[key]; if(goal==null) return null;
  var over=season.end<todayStr();
  var cur=over?weightAtDate(key,season.end):getCurrentWeight(key); if(cur==null) return null;
  // v4 : le départ = le poids au DÉBUT DE LA SAISON (plus jamais le 1er poids de mars)
  var w0=exoSeasonStartWeight(key,season); if(w0==null) w0=cur;
  if(asIsInverse(key)){ if(w0<=goal) return 1; return Math.max(0,(w0-cur)/(w0-goal)); }
  if(w0>=goal) return 1;
  return Math.max(0,(cur-w0)/(goal-w0));
}
// ── NOTE /100 v4 (14/08, refonte Adrien : « 50 = vraiment en retard · 100 = objectif atteint ») ──
// La note d'un exo = où ton poids actuel se situe entre TON DÉPART DE SAISON et l'objectif du
// 1er janvier, remappé sur l'échelle 50 → 100 :
//   50  = encore à ton poids de départ (semaine 1 c'est normal, semaine 15 c'est un vrai retard)
//   100 = objectif du 1er janvier atteint
// Elle bouge UNIQUEMENT quand la référence bouge (hausse validée / recalage). Assistances
// (dips/tractions) : même logique, sur l'assistance qui descend (départ → cible).
// La MÉDAILLE raconte la même saison sur l'échelle Bronze → Champion. Les RP globaux et portes
// Champion suivent seasonWeightProgress (même ancre v4) — l'économie garde sa promesse.
function goalLevel(key,season){
  var p=goalProgress(key,season);
  if(p===null) return null;
  return Math.max(0,Math.min(1,0.5+0.5*p));
}
// Où il "devrait" en être aujourd'hui : % du temps de SAISON écoulé (27/07 → 1er janvier).
// Semaine 3/22 → ~14 % du chemin attendu — pareil pour tous les exos, simple à lire.
function goalPace(season){
  season=season||rankCurrentSeason();
  var t0=new Date(season.start+'T00:00:00'), t1=new Date(OBJECTIF_DATE+'T00:00:00');
  if(t1<=t0) return 1;
  return Math.max(0,Math.min(1,(getNow()-t0)/(t1-t0)));
}
// p (0..1) → cran 0-17 · tier · division · RP (100 par division, 1800 au total)
function ladderOf(p){
  var pc=Math.max(0,Math.min(1,p||0));
  var step=Math.min(17,Math.floor(pc*18));
  return {step:step,tier:RANK_TIERS[Math.floor(step/3)],div:['III','II','I'][step%3],rp:Math.round(pc*1800)};
}
// Exécutions COMPTÉES d'un exo dans une fenêtre [start..end]
function execsBetween(key,startDate,endDate){
  var info=findExoIndex(key); if(!info) return 0;
  return (DB.logs||[]).filter(function(l){
    if(!l.date||l.date<startDate||l.date>endDate) return false;
    if(l.live&&l.live.exos){
      var lx=null; l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      return lx?liveExoCounted(lx):false;
    }
    return (l.sessions||[]).some(function(sid){ return sid==='exo:'+key||(sid===info.sid&&exoMainForLog(info,key,l.date)); });
  }).length;
}
// Exo NOTÉ = pratiqué au moins une fois depuis le début du suivi (saison 0) ou ≥2 poids enregistrés
// (preuve de pratique). Les exos tout neufs jamais faits (seed unique) restent Bronze III « à faire ».
function rankExoActive(key,season){
  season=season||rankCurrentSeason();
  var over=season.end<todayStr();
  if(over){
    var upto=(DB.weights[key]||[]).filter(function(e){return e.date<=season.end;});
    if(upto.length>1) return true;
    return execsBetween(key,season.start,season.end)>0;
  }
  if((DB.weights[key]||[]).length>1) return true;
  if(execsSince(key,RANK_SEASONS[0].start)>0) return true;
  return !!DB.weightSetDate&&!!DB.weightSetDate[key]&&DB.weightSetDate[key]>=season.start;
}
// Note d'un exo = 85 pts de CHARGES (tout le chemin depuis le début, vers l'objectif de la saison)
// + 15 pts de RÉGULARITÉ **de la saison** (1er passage +5, puis +2, cap 15 ≈ 6 passages).
// → l'acquis des saisons passées reste, mais chaque saison il faut re-gagner ses 15 pts d'assiduité,
//   et Champion (≥83%) reste hors de portée sans se rapprocher des poids cibles de la saison.
function exoLadderScore(key,season){
  // v3 (06/08) : la note = le NIVEAU pur (plus de bonus de régularité). Un exo jamais
  // réellement exécuté depuis mars = « à faire », même si des poids ont été seedés.
  season=season||rankCurrentSeason();
  if(!getCurrentWeight(key)) return null;
  if(asExoNeverDone(key)) return null;
  return goalLevel(key,season);
}
// Un exo noté mais pas encore refait CETTE saison (pour le tag « à refaire » du détail)
function exoStaleThisSeason(key){ return rankExoActive(key)&&execsSince(key,rankCurrentSeason().start)===0; }
// État complet du ladder : 6 groupes (avec le détail par exo) + global.
// Sans argument = saison courante ; avec une saison close = rank final rétro-calculé
// (poids à la fin de la saison vs objectifs de CETTE saison — GOALS_S0 pour la saison 0).
function rankLadder(season){
  season=season||rankCurrentSeason();
  var over=season.end<todayStr();
  var pace=over?1:goalPace();
  var goals=seasonGoals(season);
  var groups=RANK_COEF_GROUPS.map(function(g){
    var rows=[],wSum=0,pSum=0,eSum=0,wpSum=0,ppSum=0;
    Object.keys(g.exos).forEach(function(k){
      var info=findExoIndex(k); if(!info) return;
      if(info.exo.hidden&&goals[k]==null) return; // masqué ET hors objectifs de la saison → ignoré
      if(!over&&info.exo.hidden) return;          // saison courante : les masqués n'apparaissent pas
      var coef=g.exos[k];
      var p=exoLadderScore(k,season); // NOTE /100 (v4 : 50 = départ de saison · 100 = objectif)
      // rythme attendu (v4) : le % de semaines de saison écoulées, sur la même échelle 50→100
      var exp=Math.min(1,0.5+0.5*pace);
      // MÉDAILLE : progression de saison (départ → objectif) — exos réellement pratiqués
      var prog=(p!==null&&rankExoActive(k,season))?goalProgress(k,season):null;
      var st=!over&&p!==null&&exoStaleThisSeason(k);
      rows.push({key:k,coef:coef,p:p,prog:prog,active:p!==null,stale:st,ahead:p!==null&&p>=exp});
      // les « à faire » (pas refaits cette saison) n'entrent ni dans la note du groupe ni dans le rythme
      if(p!==null&&!st){ wSum+=coef; pSum+=coef*Math.min(1,p); eSum+=coef*exp; }
      if(prog!==null){ wpSum+=coef; ppSum+=coef*Math.min(1,prog); }
    });
    rows.sort(function(a,b){return b.coef-a.coef||((b.p||0)-(a.p||0));});
    var p=wSum?pSum/wSum:null;
    var paceP=wSum?eSum/wSum:pace;
    var prog=wpSum?ppSum/wpSum:null;
    return {label:g.label,p:p,prog:prog,lad:ladderOf(prog||0),rows:rows,rated:prog!==null,ahead:p!==null&&p>=paceP,paceP:paceP};
  });
  var gp=groups.reduce(function(a,g){return a+(g.p||0);},0)/(groups.length||1);
  return {groups:groups,p:gp,lad:ladderOf(gp),pace:pace,ahead:gp>=pace};
}
var _rankGroupOf=null;
function rankGroupOf(key){
  if(!_rankGroupOf){
    _rankGroupOf={};
    RADAR_GROUPS.forEach(function(g){ g.keys.forEach(function(k){ _rankGroupOf[k]=g.label; }); });
  }
  return _rankGroupOf[key]||null;
}
function rankSeasonOf(dateStr){
  for(var i=0;i<RANK_SEASONS.length;i++){
    var s=RANK_SEASONS[i];
    if(dateStr>=s.start&&dateStr<=s.end) return s;
  }
  return null;
}
function rankCurrentSeason(){ return rankSeasonOf(todayStr())||RANK_SEASONS[RANK_SEASONS.length-1]; }
function rankInPause(dateStr){
  var ps=(DB.rank&&DB.rank.pauses)||[];
  return ps.some(function(p){ return dateStr>=p.start&&dateStr<=p.end; });
}
// ── MODE GEL ↔ COACH INTERNE (26/08, demande Adrien) ──
// Le gel ne protège plus seulement le rank (débranché) : il informe le coach.
//   · gelWeekGoal(ws)   : objectif de séances de la semaine RAMENÉ au prorata des jours non gelés
//                         (4/sem avec 3 jours gelés → 2 ; semaine entièrement gelée → 0, pas de note)
//   · gelRepriseCtx(d)  : la séance du jour d est-elle une REPRISE après ≥3 jours gelés depuis la
//                         dernière séance ? → {days, type, gap} gravé dans live.reprise, lu par le bilan
//                         de séance (note remise en contexte), le modal jour et l'analyse.
function gelPauseAt(dateStr){
  var ps=(DB.rank&&DB.rank.pauses)||[];
  for(var i=0;i<ps.length;i++){ if(ps[i].start<=dateStr&&dateStr<=ps[i].end) return ps[i]; }
  return null;
}
function gelDaysInWeek(ws){
  var n=0; for(var i=0;i<7;i++){ if(rankInPause(rankAddDays(ws,i))) n++; }
  return n;
}
// Règle Adrien (26/08 soir, simplifiée) : le gel est exceptionnel → rien ne change SAUF si la semaine
// compte ≥2 jours gelés : l'objectif de séances est alors plafonné à 3 (et le bilan hebdo le dit).
function gelWeekGoal(ws){
  var g=(typeof SAISON!=='undefined')?SAISON.weekGoal(ws,getWeekGoal()):getWeekGoal(), f=gelDaysInWeek(ws); // Sèche : 3 (04/11)
  if(f<2) return g;
  return Math.min(g,3);
}
function gelRepriseCtx(dateStr){
  var last=null;
  (DB.logs||[]).forEach(function(l){ if(l.date&&l.date<dateStr&&(l.sessions||[]).length&&(!last||l.date>last)) last=l.date; });
  var from=last?rankAddDays(last,1):rankAddDays(dateStr,-60);
  var frozen=0,type=null,d;
  for(d=from; d<dateStr; d=rankAddDays(d,1)){ var p=gelPauseAt(d); if(p){ frozen++; type=p.type; } }
  if(frozen<=3) return null; // « plus de 3 jours » de gel (règle Adrien 26/08)
  var gap=Math.round((new Date(dateStr+'T12:00:00')-new Date((last||from)+'T12:00:00'))/86400000);
  return {days:frozen,type:type||'vacances',gap:gap};
}
function gelTypeLbl(t){ return t==='blessure'?'&#x1FA79; blessure':'&#x1F3D6; vacances'; }
function gelRepriseNote(rep){
  var n=rep.days;
  var base='&#x2744; <strong>S&#xE9;ance de reprise</strong> apr&#xE8;s '+n+' jours d\'arr&#xEA;t ('+gelTypeLbl(rep.type)+') &#x2014; une reprise est souvent un peu plus l&#xE9;g&#xE8;re, la note se lit avec indulgence&#x202F;: ';
  if(rep.type==='blessure') return base+'10 &#xE0; 20&#x202F;% sous tes charges sur la zone touch&#xE9;e, stop &#xE0; la moindre g&#xEA;ne. On juge la vraie forme dans 2 s&#xE9;ances.';
  return base+(n>=10?'&#x2212;5 &#xE0; &#x2212;10&#x202F;% de reps ou de charge est normal et revient en 1-2 s&#xE9;ances. ':'un l&#xE9;ger flottement sur les derni&#xE8;res reps est normal. ')
    +'Charges de ta derni&#xE8;re s&#xE9;ance, pas plus &#x2014; la vraie note se lit &#xE0; la prochaine.';
}
function gelWeekMsg(frozen,goal,type){
  return '&#x2744; '+frozen+' jours gel&#xE9;s cette semaine ('+gelTypeLbl(type)+') &#x2014; objectif ramen&#xE9; &#xE0; <strong>'+goal+' s&#xE9;ances</strong>.';
}
function gelWeekType(ws){
  for(var i=0;i<7;i++){ var p=gelPauseAt(rankAddDays(ws,i)); if(p) return p.type; }
  return 'vacances';
}
// Une entrée "salle" = séance s1/s2/s3 cochée OU exos à la carte (exo:) — sb/autre = activité, pas salle
function rankLogIsSalle(l){
  return (l.sessions||[]).some(function(sid){
    if(sid.indexOf('exo:')===0) return true;
    var s=DATA.find(function(x){return x.id===sid;});
    return !!(s&&s.t!=='bonus');
  });
}
// Dernière exécution COMPTÉE d'un exo avant une date (pour le bonus REFRESH)
function rankLastExecBefore(key,dateStr){
  var best=null;
  var info=findExoIndex(key);
  (DB.logs||[]).forEach(function(l){
    if(!l.date||l.date>=dateStr) return;
    var ok=false;
    if(l.live&&l.live.exos){
      var lx=null; l.live.exos.forEach(function(x){ if(x.key===key) lx=x; });
      ok=lx?liveExoCounted(lx):false;
    } else if(info){
      ok=(l.sessions||[]).some(function(sid){ return sid==='exo:'+key||(sid===info.sid&&exoMainForLog(info,key,l.date)); });
    }
    if(ok&&(!best||l.date>best)) best=l.date;
  });
  return best;
}
// ── RP d'une séance (le cœur du barème) ──
// Retourne {total, byGroup:{label:rp}, events:[{ico,label,rp}], manual:bool}
function rankSeanceRP(l){
  var out={total:0,byGroup:{},events:[],manual:!l.live};
  function add(rp,group){ out.total+=rp; if(group){ out.byGroup[group]=(out.byGroup[group]||0)+rp; } }
  if(!l.live||!(l.live.exos||[]).length){
    var f=Math.round(logWeight(l)*RANK_ECO.manualSalle);
    if(f>0){ out.total=f; out.events.push({ico:'&#x1F4DD;',label:'Séance enregistrée (forfait hors mode direct)',rp:f}); }
    return out;
  }
  var exos=l.live.exos;
  var ctx=l.live.context||null; // contexte déclaré en fin de séance (temps/blessure/energie/malade)
  // Cardio déjà validé PLUS TÔT dans la même semaine (cap 2/sem sur le +100)
  var cardioBefore=0;
  try{
    var wsC=rankMonday(l.date), weC=rankAddDays(wsC,6);
    (DB.logs||[]).forEach(function(o){
      if(String(o.id)===String(l.id)||!o.live||!o.live.exos) return;
      if(o.date<wsC||o.date>weC) return;
      if(o.date>l.date||(o.date===l.date&&(o.time||'')>(l.time||''))) return;
      o.live.exos.forEach(function(x2){ if(exoIsCardio(x2.key)&&liveExoCounted(x2)) cardioBefore++; });
    });
  }catch(e){}
  var cardioUsed=0;
  var annexUsed=0, prCt=0, precCt=0, malus=0;
  var bestScore=-1, bestExo=null;
  var engagedCt=0;
  // ⚠️ Séance À LA CARTE (aucun exo principal) : les exos choisis SONT le programme du jour —
  // ils comptent tous comme principaux (fix 01/08 : le cap annexe écrasait ces séances à ~250 pts).
  var hasMain=exos.some(function(x){return !liveExoSide(x);});
  exos.forEach(function(x){
    var side=hasMain?liveExoSide(x):false, counted=liveExoCounted(x);
    var grp=rankGroupOf(x.key);
    var name=getExoName(x.key);
    var inv=asIsInverse(x.key);
    // Cardio (OTHERS) : forfait +100 pts, plafonné à 2/semaine — jamais de RP de séries ni de note
    if(exoIsCardio(x.key)){
      if(!counted) return;
      if(cardioBefore+cardioUsed>=RANK_ECO.cardioCap){ out.events.push({ico:'&#x1F3C3;',label:'Cardio (cap 2/sem atteint)',rp:0}); return; }
      cardioUsed++;
      add(RANK_ECO.cardioPts,null);
      out.events.push({ico:'&#x1F3C3;',label:'Cardio valid&#xE9; : '+name,rp:RANK_ECO.cardioPts});
      return;
    }
    if(side&&!counted) return;                       // annexe non complété : neutre absolu
    if(side&&counted){ if(annexUsed>=RANK_ECO.annexCap){ return; } annexUsed++; }
    if(!side&&!counted){                             // principal raté : micro-malus (compensé si contexte déclaré)
      var m=(x.sets&&x.sets.length)?RANK_ECO.dropMain:RANK_ECO.skipMain;
      if(ctx==='temps'||ctx==='blessure') m=0;       // séance écourtée justifiée : pas de malus
      else if(ctx==='energie'||ctx==='malade') m=Math.round(m/2);
      if(m){ malus+=m; out.events.push({ico:'&#x23ED;',label:name+' '+((x.sets&&x.sets.length)?'lâché tôt':'skippé'),rp:m}); }
      return;
    }
    engagedCt++;
    var n=x.n||3;
    (x.sets||[]).forEach(function(s,i){
      var pos=i+1, base;
      if(pos<=n) base=RANK_ECO.serie[Math.min(pos,4)-1];
      else if(pos===n+1) base=RANK_ECO.serieBonus;
      else base=RANK_ECO.serieBonusExtra;
      // Règle échec (setHardFail) : un échec sur/près de la cible est une série réussie, pas un malus.
      // Règle effort (setSoftFail, 02/08) : sur un PRINCIPAL, s'arrêter sous la cible sans aller
      // à l'échec (« dur » à 8/10) = effort non terminé → qLow. Les bonus gardent l'ancienne tolérance.
      var q;
      if(x.reps&&s.reps>=x.reps) q=RANK_ECO.qFull;                       // cible atteinte — échec compris (aller au bout = parfait)
      else if(x.reps&&s.feel==='echec'&&s.reps>=x.reps-setTol(x.reps)) q=RANK_ECO.qOk; // échec dans la tolérance de la cible = série normale
      else if(x.reps&&s.feel!=='echec'&&s.reps>=x.reps*0.8) q=(side?RANK_ECO.qOk:RANK_ECO.qLow);
      else q=RANK_ECO.qLow;
      // Prorata poids : une série plus légère que la référence rapporte moins (% pour %),
      // plus lourde rapporte plus. Inversé pour traction/dips (moins d'assistance = mieux).
      var ratio=1;
      if(/kg/.test(x.unite||'')&&x.w0>0){
        var sw=(s.w!=null?s.w:x.w);
        if(sw>0) ratio=inv?(x.w0/sw):(sw/x.w0);
        ratio=Math.max(RANK_ECO.wRatioMin,Math.min(RANK_ECO.wRatioMax,ratio));
        if(ctx==='blessure'&&ratio<1) ratio=1;       // blessure déclarée : alléger ne coûte rien
      }
      add(Math.round(base*q*ratio),grp);
      if(pos===n+1) out.events.push({ico:'&#x1F501;',label:'Série bonus sur '+name,rp:Math.round(base*q*ratio)});
    });
    // PR : poids monté en séance (assistance BAISSÉE pour les exos inversés)
    var pr=inv?(x.w<x.w0):(x.w>x.w0&&/kg/.test(x.unite||''));
    if(pr&&prCt<RANK_ECO.prCap){ prCt++; add(RANK_ECO.pr,grp); out.events.push({ico:'&#x1F3C6;',label:'PR appliqué : '+name+' → '+x.w+' '+x.unite,rp:RANK_ECO.pr}); }
    // PRÉCISION : dernière série « facile » = marge détectée
    var lastSet=(x.sets||[])[(x.sets||[]).length-1];
    if(lastSet&&lastSet.feel==='facile'&&precCt<RANK_ECO.precisionCap){ precCt++; add(RANK_ECO.precision,grp); }
    // REFRESH : exo gelé réactivé
    var prev=rankLastExecBefore(x.key,l.date);
    if(prev){
      var gap=Math.round((new Date(l.date)-new Date(prev))/86400000);
      if(gap>RANK_ECO.refreshGapDays){ add(RANK_ECO.refresh,grp); out.events.push({ico:'&#x267B;',label:name+' réactivé ('+gap+' j)',rp:RANK_ECO.refresh}); }
    }
    // MVP tracking
    var sc=asScoreExo(x);
    if(sc>bestScore){ bestScore=sc; bestExo={key:x.key,name:name,grp:grp}; }
  });
  if(engagedCt>=3&&bestExo){ add(RANK_ECO.mvp,bestExo.grp); out.events.push({ico:'&#x2B50;',label:'MVP : '+bestExo.name,rp:RANK_ECO.mvp}); }
  // Étirements de fin déclarés : petit bonus (posture — voir COACH.md)
  if(l.live.stretch){ add(15,null); out.events.push({ico:'&#x1F9D8;',label:'&#xC9;tirements de fin',rp:15}); }
  // CLEAN SWEEP : tous les principaux comptés avec toutes les séries prévues —
  // ET une exécution qui suit (note ≥ 12/20, règle 02/08) : le volume seul ne suffit plus
  var mains=exos.filter(function(x){return hasMain?!liveExoSide(x):true;});
  if(mains.length&&mains.every(function(x){return liveExoCounted(x)&&(x.sets||[]).length>=(x.n||3);})){
    var _cn=liveNotedExos(exos),_ct=0;
    _cn.forEach(function(x){_ct+=asScoreExoRaw(x);});
    var _cg=_cn.length?Math.round(_ct/_cn.length*4):0;
    if(_cg>=12){ add(RANK_ECO.cleanSweep,null); out.events.push({ico:'&#x1F9F9;',label:'CLEAN SWEEP',rp:RANK_ECO.cleanSweep}); }
  }
  out.total+=malus;
  if(out.total<RANK_ECO.floor){ out.total=RANK_ECO.floor; } // plancher séance validée
  return out;
}
// weekValue avec la règle « dimanche 20h » : une séance loggée un dimanche après 20h
// ne compte pas dans le check de SA semaine (elle garde ses RP de séance)
function rankWeekValue(logs){
  return weekValue(logs.filter(function(l){
    var d=new Date(l.date+'T00:00');
    if(d.getDay()!==0) return true;
    return !l.time||l.time<='20:00';
  }));
}
function _rankFmt(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function rankMonday(dateStr){
  var d=new Date(dateStr+'T00:00');
  var off=d.getDay()===0?6:d.getDay()-1;
  d.setDate(d.getDate()-off);
  return _rankFmt(d);
}
function rankAddDays(dateStr,n){
  var d=new Date(dateStr+'T00:00'); d.setDate(d.getDate()+n);
  return _rankFmt(d);
}
// ── Calcul complet d'une saison ──
// {total, seanceRP, weeklyRP, decayRP, byGroup, weeks[], seances, bestStreak, streak, thisWeekV, events[]}
function rankCompute(season){
  var today=todayStr();
  var res={season:season,total:0,seanceRP:0,weeklyRP:0,decayRP:0,byGroup:{},weeks:[],seances:0,bestStreak:0,streak:0,thisWeekV:0,events:[]};
  var logs=(DB.logs||[]).filter(function(l){return l.date>=season.start&&l.date<=season.end&&l.date<=today;})
    .sort(function(a,b){return a.date.localeCompare(b.date);});
  if(!logs.length) return res;
  // Les checks (hebdo + decay) démarrent à la 1re séance SALLE de la saison
  var firstSalle=null;
  logs.forEach(function(l){ if(!firstSalle&&rankLogIsSalle(l)) firstSalle=l.date; });
  // 1) RP de séances, plafonnés par jour
  var byDay={};
  logs.forEach(function(l){
    var r=rankSeanceRP(l);
    res.seances+=1;
    byDay[l.date]=byDay[l.date]||{rp:0,byGroup:{}};
    byDay[l.date].rp+=r.total;
    Object.keys(r.byGroup).forEach(function(g){ byDay[l.date].byGroup[g]=(byDay[l.date].byGroup[g]||0)+r.byGroup[g]; });
  });
  Object.keys(byDay).forEach(function(d){
    var day=byDay[d];
    var rp=Math.min(RANK_ECO.dayCap,day.rp);
    var scale=day.rp>0?rp/day.rp:1;
    res.seanceRP+=rp;
    Object.keys(day.byGroup).forEach(function(g){ res.byGroup[g]=(res.byGroup[g]||0)+Math.round(day.byGroup[g]*scale); });
  });
  if(!firstSalle){ res.total=res.seanceRP; return res; }
  // 2) Check hebdo + streak (semaines complètes uniquement, hors semaines 100% en pause)
  var wStart=rankMonday(firstSalle);
  var lastClosed=rankMonday(today); // la semaine courante (non close) est exclue…
  // …SAUF le dimanche dès 20h : la semaine se clôture ce soir-là (règle officielle du check hebdo,
  // alignée avec le bilan dominical — fix 02/08 : la semaine en cours manquait au popup saison)
  var _nowRC=getNow();
  if(_nowRC.getDay()===0&&_nowRC.getHours()>=20) lastClosed=rankAddDays(lastClosed,7);
  var seasonEndMonday=rankAddDays(rankMonday(season.end),7);
  var streak=0;
  for(var ws=wStart; ws<lastClosed&&ws<seasonEndMonday; ws=rankAddDays(ws,7)){
    var we=rankAddDays(ws,6);
    if(we>season.end) break;
    var wLogs=logs.filter(function(l){return l.date>=ws&&l.date<=we;});
    var pausedDays=0;
    for(var k=0;k<7;k++){ if(rankInPause(rankAddDays(ws,k))) pausedDays++; }
    if(pausedDays>=4){ res.weeks.push({start:ws,v:null,rp:0,paused:true}); continue; } // semaine en pause : ni malus ni streak break
    var v=rankWeekValue(wLogs);
    var rp=0;
    if(v>=4){
      streak++;
      rp=(v>=5?RANK_ECO.week5:RANK_ECO.week4)+RANK_ECO.streak[Math.min(streak,RANK_ECO.streak.length-1)];
    } else {
      streak=0;
      rp=v>=3?0:v>=2?RANK_ECO.week2:v>=1?RANK_ECO.week1:RANK_ECO.week0;
    }
    if(streak>res.bestStreak) res.bestStreak=streak;
    // Nutrition + cardio déclarés au bilan de semaine
    var nut=0, ans=(DB.rank&&DB.rank.weekly)?DB.rank.weekly[ws]:null;
    if(ans){
      nut=(ans.pdj||0)*RANK_ECO.pdjRP+((ans.pdj||0)>=7?RANK_ECO.pdjPerfect:0)
         +(ans.shaker||0)*RANK_ECO.shakerRP+((ans.shaker||0)>=6?RANK_ECO.shakerBonus:0);
      if((ans.cardio||0)>=1) nut+=RANK_ECO.cardioW1;
      if((ans.cardio||0)>=2) nut+=RANK_ECO.cardioW2;
    }
    // Étirements de la semaine (espace Détente, compté AUTO — 04/08) : +15/jour étiré, cap 4
    var stW=0;
    for(var k2=0;k2<7;k2++){ var dd2=rankAddDays(ws,k2); if(DB.dz&&DB.dz[dd2]&&DB.dz[dd2].stretch) stW++; }
    nut+=Math.min(stW,RANK_ECO.stretchCap)*RANK_ECO.stretchPts;
    res.weeklyRP+=rp+nut;
    res.weeks.push({start:ws,v:v,rp:rp,nut:nut,streak:streak});
  }
  res.streak=streak;
  // Semaine courante (info, pas encore checkée)
  var cwStart=rankMonday(today);
  res.thisWeekV=rankWeekValue(logs.filter(function(l){return l.date>=cwStart;}));
  // 3) Decay : jours off consécutifs.
  //  - salle ou séance maison → REMET le compteur à zéro
  //  - autre sport (foot...) ou pause déclarée → GÈLE le jour (ni reset, ni incrément)
  var resetDays={}, freezeDays={};
  logs.forEach(function(l){
    if(rankLogIsSalle(l)||(l.sessions||[]).indexOf('sb')>=0||(l.sessions||[]).indexOf('sm')>=0) resetDays[l.date]=true;
    else freezeDays[l.date]=true;
  });
  var decayEnd=today<season.end?today:season.end;
  var offRun=0;
  for(var d=firstSalle; d<=decayEnd; d=rankAddDays(d,1)){
    if(resetDays[d]){ offRun=0; continue; }
    if(freezeDays[d]||rankInPause(d)) continue; // jour gelé
    offRun++;
    if(offRun>RANK_ECO.offGrace){
      res.decayRP-=Math.min(RANK_ECO.offDayCap,Math.round(RANK_ECO.offBase*Math.pow(RANK_ECO.offMult,offRun-RANK_ECO.offGrace-1)));
    }
  }
  res.total=res.seanceRP+res.weeklyRP+res.decayRP;
  return res;
}
// ── Tiers & état global ──
function rankTierFor(score){
  var t=RANK_TIERS[0];
  RANK_TIERS.forEach(function(x){ if(score>=x.min) t=x; });
  return t;
}
function rankDivision(rpGroup){
  var dv=RANK_ECO.divisions;
  return rpGroup>=dv[2]?'I':rpGroup>=dv[1]?'II':'III';
}
// ══ RANK v4 (option A validée par Adrien) — LE RANK GLOBAL = MOTEUR D'EFFORT COMPLET ══
// Les 6 ranks de MUSCLES restent 100% progression de poids (= ton niveau, perso).
// Le rank GLOBAL cumule TOUT : chaque série/rep/qualité de séance, les checks hebdo (4=petit
// bonus, 5=gros bonus, streak=très gros et rare), la nutrition (objectifs 5 petits-déj · 3 shakers/sem),
// la progression des poids vers les cibles (25% du budget), moins les pénalités d'inactivité.
// Budget calibré : saison parfaite ≈ 1950 RP · Champion I = 1800 (≈92% du parfait) ·
// farmeur sans progression plafonne ~Diamant · progresseur sans assiduité plafonne ~Platine.
var LADDER_ECO={
  seanceDiv:65,        // pts d'activité de séance → RP ladder (séance parfaite ≈ 650 pts ≈ 10 RP)
  week4:5,week5:9,     // semaine validée à 4 (petit bonus) · à 5+ (gros bonus)
  streakCap:6,         // streak : +min(n-1,6) par semaine consécutive à ≥4 — long streak = très rare, très payant
  weekBad:-5,weekVeryBad:-10,weekBlank:-15, // semaine à 2 / à 1 / blanche
  pdjGoal:4,pdjPts:4,pdjPerfect:6,          // petits-déj = LA priorité : objectif ≥4 (+4), 7/7 (+6) — 04/08
  shakerGoal:2,shakerPts:2,shakerPerfect:3, // shakers : objectif ≥2 (+2), 6+ (+3) — 04/08
  cardioPts:1,cardioPts2:2,                 // cardio aligné sur le shaker : ≥1/sem (+1), 2/sem (+2) — 04/08
  stretchGoal:2,stretchLPts:1,stretchLPts2:2, // étirements : ≥2 jours (+1), ≥4 (+2) — 04/08
  decayDiv:65,         // pénalités d'inactivité (decay activité, ramené à l'échelle ladder)
  progBudget:500,      // part progression des poids (~28%) — au prorata pondéré par les coefs
  // Plafonds par source + PORTES CHAMPION : l'assiduité seule ne suffit jamais —
  // Champion (≥1500) exige ≥75% du chemin des charges, Champion I/II (≥1700) en exige ≥90%.
  seanceCap:950,weeklyCap:220,nutCap:190,
  champGateP:0.75,champGateHiP:0.9
};
// Progression de poids PURE (sans régularité) — moyenne des groupes, pondérée par coefs
function seasonWeightProgress(season){
  season=season||rankCurrentSeason();
  var goals=seasonGoals(season);
  var tot=0,cnt=0;
  RANK_COEF_GROUPS.forEach(function(g){
    var wS=0,pS=0;
    Object.keys(g.exos).forEach(function(k){
      if(goals[k]==null) return;
      var info=findExoIndex(k); if(!info) return;
      if(!rankExoActive(k,season)) return;
      var p=goalProgress(k,season); if(p===null) return;
      wS+=g.exos[k]; pS+=g.exos[k]*Math.min(1,p);
    });
    if(wS) tot+=pS/wS;
    cnt++;
  });
  return cnt?tot/cnt:0;
}
function rankGlobalLadder(season){
  season=season||rankCurrentSeason();
  var comp=null; try{ comp=rankCompute(season); }catch(e){}
  // 1) Séances — chaque série, chaque rep, la qualité, les événements (moteur d'activité)
  var seance=comp?comp.seanceRP/LADDER_ECO.seanceDiv:0;
  // 2) Hebdo + streaks (règles Adrien : 4 petit bonus · 5 gros · streak très gros)
  var weekly=0,streak=0;
  ((comp&&comp.weeks)||[]).forEach(function(w){
    if(w.paused||w.v===null) return;
    if(w.v>=4){ streak++; weekly+=(w.v>=5?LADDER_ECO.week5:LADDER_ECO.week4)+Math.min(streak-1,LADDER_ECO.streakCap); }
    else{ streak=0; weekly+=(w.v>=3?0:(w.v>=2?LADDER_ECO.weekBad:(w.v>=1?LADDER_ECO.weekVeryBad:LADDER_ECO.weekBlank))); }
  });
  // 3) Nutrition hebdo — déclaration du lundi prioritaire, sinon les coches de la semaine
  var nut=0;
  ((comp&&comp.weeks)||[]).forEach(function(w){
    var ans=(DB.rank&&DB.rank.weekly)?DB.rank.weekly[w.start]:null;
    var pdj=ans?(ans.pdj||0):nutWeekCount('petit_dej',w.start);
    var shk=ans?(ans.shaker||0):nutWeekCount('shaker',w.start);
    if(pdj>=7) nut+=LADDER_ECO.pdjPerfect; else if(pdj>=LADDER_ECO.pdjGoal) nut+=LADDER_ECO.pdjPts;
    if(shk>=6) nut+=LADDER_ECO.shakerPerfect; else if(shk>=LADDER_ECO.shakerGoal) nut+=LADDER_ECO.shakerPts;
    var crd=ans?(ans.cardio||0):Math.max(nutWeekCount('cardio',w.start),cardioWeekAuto(w.start));
    if(crd>=2) nut+=LADDER_ECO.cardioPts2; else if(crd>=1) nut+=LADDER_ECO.cardioPts;
    var stz=0;
    for(var k3=0;k3<7;k3++){ var dd3=rankAddDays(w.start,k3); if(DB.dz&&DB.dz[dd3]&&DB.dz[dd3].stretch) stz++; }
    if(stz>=4) nut+=LADDER_ECO.stretchLPts2; else if(stz>=LADDER_ECO.stretchGoal) nut+=LADDER_ECO.stretchLPts;
  });
  // 4) Progression des poids vers les cibles de la saison
  var pW=seasonWeightProgress(season);
  var prog=LADDER_ECO.progBudget*pW;
  // 5) Pénalités d'inactivité
  var pen=comp?comp.decayRP/LADDER_ECO.decayDiv:0;
  // Plafonds par source (voir LADDER_ECO) — les malus hebdo ne sont pas plafonnés, eux
  seance=Math.min(LADDER_ECO.seanceCap,seance);
  weekly=Math.min(LADDER_ECO.weeklyCap,weekly);
  nut=Math.min(LADDER_ECO.nutCap,nut);
  var total=Math.max(0,seance+weekly+nut+prog+pen);
  // Portes Champion : pas de tier Champion sans les charges (règle « champion = objectifs »)
  if(pW<LADDER_ECO.champGateP) total=Math.min(total,1499);
  else if(pW<LADDER_ECO.champGateHiP) total=Math.min(total,1699);
  var g=ladderOf(total/1800);
  g.rp=Math.min(1800,Math.round(total));
  g.parts={seance:Math.round(seance),weekly:Math.round(weekly),nut:Math.round(nut),prog:Math.round(prog),pen:Math.round(pen)};
  return g;
}
// État courant (v4) : groupes = niveau (poids) · global = effort complet.
function rankState(){
  var season=rankCurrentSeason();
  var lad=rankLadder();
  var glob=rankGlobalLadder(season);
  return {season:season,lad:lad,groups:lad.groups,glob:glob,globalTier:glob.tier,globalDiv:glob.div};
}
// ── UI RANK v2 (Bento Glass) : médaillon hexagonal, jauge de tier, popup de saison ──
function rankMedalHtml(tier,inner,size,withGlow){
  var w=size||46, h=Math.round(w*50/46);
  return '<div class="rk-hex" style="width:'+w+'px;height:'+h+'px;background:'+tier.grad+';color:'+tier.txt+';font-size:'+Math.round(w*0.33)+'px;'
    +(withGlow&&tier.glow?'filter:drop-shadow('+tier.glow+');':'')+'">'
    +(inner||'')+'</div>';
}
function renderBilanRank(){
  // Rank mis de côté (15/08, demande Adrien) — tout le moteur reste : repasser FEATURE_RANK à true
  if(!FEATURE_RANK){ var el0=document.getElementById('bilanRank'); if(el0) el0.innerHTML=''; return; }
  var el=document.getElementById('bilanRank'); if(!el) return;
  var st,comp=null;
  try{ st=rankState(); }catch(e){ console.warn('[MASSUP] rank:',e); el.innerHTML=''; return; }
  try{ comp=rankCompute(st.season); }catch(e){}
  var s=st.season, glob=st.glob, gt=glob.tier;
  var daysLeft=Math.max(0,Math.round((new Date(s.end)-new Date(todayStr()))/86400000));
  var goal=getWeekGoal();
  // Jauge : progression DANS la division en cours (100 RP par division)
  var pct=glob.step>=17?100:Math.round(glob.rp%100);
  // Division suivante (même tier → « Division II » ; changement de tier → « Or III »)
  var nextLbl='MAX';
  if(glob.step<17){
    var ns=glob.step+1, nt=RANK_TIERS[Math.floor(ns/3)], nd=['III','II','I'][ns%3];
    nextLbl=(nt===gt?'Division '+nd:nt.name+' '+nd);
  }
  var h='<div class="rk-card v3">'
    +'<div class="rk-head2">'
    +rankMedalHtml(gt,glob.div,58,true)
    +'<div class="rk-head2-mid">'
    +'<div class="rk-tier-name" style="color:'+gt.color+'">'+gt.name+' '+glob.div+'</div>'
    +'<div class="rk-season2">'+s.label+' &middot; '+daysLeft+' j restants</div>'
    +'</div>'
    +'<div class="rk-head2-rp"><span class="rk-rp-big">'+glob.rp.toLocaleString('fr-FR')+'</span><span class="rk-rp-unit">RP</span></div>'
    +'</div>'
    // Jauge : Division actuelle ——— Division suivante (pas de chiffres, juste la progression)
    +'<div class="rk-gauge-row"><span>Division '+glob.div+'</span><span>'+nextLbl+'</span></div>'
    +'<div class="rk-gauge"><div class="rk-gauge-fill" style="width:'+pct+'%;background:'+gt.grad+';'+(gt.glow?'box-shadow:'+gt.glow+';':'')+'"></div></div>'
    // (répartition des points + « cette semaine » retirés — retour Adrien 03/08 : la carte respire)
    // 6 groupes : hexagone + tier + division (pas encore activé = Bronze III grisé)
    +'<div class="rk-groups2 v3">';
  st.groups.forEach(function(g){
    h+='<div class="rk-group2'+(g.rated?'':' off')+(g.ahead&&g.rated?' ahead':'')+'">'
      +rankMedalHtml(g.lad.tier,g.lad.div,34,g.rated)
      +'<div class="rk-g2-txt"><span class="rk-g2-name">'+g.label+'</span>'
      +'<span class="rk-g2-tier" style="color:'+(g.rated?g.lad.tier.color:'var(--mut)')+'">'+g.lad.tier.name+' '+g.lad.div+(g.rated?'':' &#xB7; &#xE0; activer')+'</span></div>'
      +'</div>';
  });
  h+='</div>'
    // Saisons → POPUP au tap
    +'<div class="rk-seasons-row">';
  RANK_SEASONS.forEach(function(sn){
    if(sn.start>todayStr()) return;
    var cur=sn.id===s.id;
    h+='<button class="rk-season-btn'+(cur?' cur':'')+'" onclick="openSeasonModal('+sn.id+')">'+sn.label+(cur?' &middot; en cours':'')+' &#x203A;</button>';
  });
  h+='</div></div>';
  el.innerHTML=h;
}
// ── POPUP récap de saison : le rank atteint d'abord, les RP ensuite ──
// v2 (02/08 soir) : interface « sport dynamique » — héros XXL animé, grilles alignées,
// stats en tuiles Saira, semaines rejouables (▶) dès qu'elles sont closes / déclarables.
function openSeasonModal(id){
  var s=RANK_SEASONS.find(function(x){return x.id===id;}); if(!s) return;
  var over=s.end<todayStr();
  var cur=!over&&s.start<=todayStr();
  var c=rankCompute(s);
  var lad=rankLadder(s);
  var glob=rankGlobalLadder(s);
  var gt=glob.tier, gDiv=glob.div;
  var okW=c.weeks.filter(function(w){return w.v!==null&&w.v>=4;}).length;
  var badW=c.weeks.filter(function(w){return w.v!==null&&w.v<3;}).length;
  // Une semaine est REJOUABLE si close — ou déclarable dès le dimanche 20h (même règle que le widget)
  var _now=getNow();
  var _avail=rankMonday(todayStr());
  if(!(_now.getDay()===0&&_now.getHours()>=20)) _avail=rankAddDays(_avail,-7);
  var h='<div class="sn2-hdr">'
    +'<div><div class="sn2-season">'+s.label+'</div>'
    +'<div class="sn2-dates">'+formatDateFr(s.start)+' &rarr; '+formatDateFr(s.end)+(over?'':' &middot; <span style="color:var(--acc);font-weight:800">EN COURS</span>')+'</div></div>'
    +'<button class="modal-close" onclick="closeSeasonModal()">&#x2715;</button></div>';
  // ── Héros : médaillon XXL + tier + RP animé ──
  h+='<div class="sn2-hero">'
    +rankMedalHtml(gt,gDiv,96,true)
    +'<div class="sn2-tier" style="color:'+gt.color+'">'+gt.name+' <span>'+gDiv+'</span></div>'
    +'<div class="sn2-rp"><span data-cu="'+glob.rp+'">0</span><small>RP</small></div>'
    +'<div class="sn2-sub">'+(over?'Rank final &#x2014; not&#xE9; contre les objectifs de l\'&#xE9;poque':'Progression vers le 1er janvier')+'</div>'
    +'</div>';
  // ── 6 muscles ──
  h+='<div class="sn2-groups">';
  lad.groups.forEach(function(g){
    h+='<div class="sn2-group'+(g.rated?'':' off')+'">'+rankMedalHtml(g.lad.tier,g.lad.div,30)
      +'<span class="sn2-g-name">'+g.label+'</span>'
      +'<span class="sn2-g-div" style="color:'+g.lad.tier.color+'">'+g.lad.tier.name+' '+g.lad.div+'</span></div>';
  });
  h+='</div>';
  // ── Stats en tuiles ──
  h+='<div class="sn2-stats">'
    +'<div class="sn2-stat"><span data-cu="'+c.seances+'">0</span>s&#xE9;ances</div>'
    +'<div class="sn2-stat good"><span data-cu="'+okW+'">0</span>sem. &#x2265;4</div>'
    +'<div class="sn2-stat'+(badW?' bad':'')+'"><span data-cu="'+badW+'">0</span>rat&#xE9;e'+(badW>1?'s':'')+'</div>'
    +'<div class="sn2-stat fire"><span data-cu="'+c.bestStreak+'">0</span>&#x1F525; record</div>'
    +'</div>';
  // ── Sources de points en chips ──
  h+='<div class="sn2-src">'
    +'<span class="sn2-chip"><em>s&#xE9;ances</em><b style="color:var(--acc)">+'+c.seanceRP.toLocaleString('fr-FR')+'</b></span>'
    +'<span class="sn2-chip"><em>hebdo+nutrition</em><b style="color:'+(c.weeklyRP>=0?'var(--acc2)':'var(--red)')+'">'+(c.weeklyRP>=0?'+':'')+c.weeklyRP.toLocaleString('fr-FR')+'</b></span>'
    +'<span class="sn2-chip"><em>p&#xE9;nalit&#xE9;s</em><b style="color:'+(c.decayRP<0?'var(--red)':'var(--mut)')+'">'+c.decayRP.toLocaleString('fr-FR')+'</b></span>'
    +'</div>';
  // ── Podium des séances ──
  var logs=(DB.logs||[]).filter(function(l){return l.date>=s.start&&l.date<=s.end;});
  var scored=logs.map(function(l){ var t=0; try{ t=rankSeanceRP(l).total; }catch(e){} return {l:l,rp:t}; })
    .sort(function(a,b){return b.rp-a.rp;}).slice(0,3);
  if(scored.length&&scored[0].rp>0){
    h+='<div class="sn2-lbl">&#x1F3C6; Meilleures s&#xE9;ances</div><div class="sn2-podium">';
    scored.forEach(function(x,i){
      h+='<div class="sn2-prow"><span class="sn2-p-med">'+['&#x1F947;','&#x1F948;','&#x1F949;'][i]+'</span>'
        +'<span class="sn2-p-date">'+formatDateFr(x.l.date)+'</span>'
        +'<span class="sn2-p-rp">+'+Math.max(1,Math.round(x.rp/LADDER_ECO.seanceDiv))+' RP</span></div>';
    });
    h+='</div>';
  }
  // ── Semaine par semaine (grille alignée) — ▶ = revoir/faire le bilan ──
  if(c.weeks.length){
    h+='<div class="sn2-lbl">&#x1F4C6; Semaine par semaine <span class="sn2-lbl-hint">&#x25B6; = bilan de la semaine</span></div><div class="sn2-weeks">';
    c.weeks.slice().reverse().forEach(function(w){
      if(w.paused){
        h+='<div class="sn2-wrow paused"><span class="sn2-w-date">'+formatDateShort(w.start)+'</span><span class="sn2-w-se">&#x1F3D6; pause</span><span class="sn2-w-rp">&#x2014;</span><span class="sn2-w-btn"></span></div>';
        return;
      }
      var col=w.rp>0?'var(--acc)':w.rp<0?'var(--red)':'var(--mut)';
      var canReplay=(DB.rank&&DB.rank.weekly&&DB.rank.weekly[w.start])||(cur&&w.start<=_avail);
      h+='<div class="sn2-wrow">'
        +'<span class="sn2-w-date">'+formatDateShort(w.start)+'</span>'
        +'<span class="sn2-w-se">'+fmtSeances(w.v)+' s&#xE9;ance'+(w.v>1?'s':'')+(w.streak>=2?' &#x1F525;':'')+(w.nut?' <small style="color:var(--yellow)">&#x1F37D;</small>':'')+'</span>'
        +'<span class="sn2-w-rp" style="color:'+col+'">'+(w.rp>0?'+':'')+w.rp.toLocaleString('fr-FR')+'</span>'
        +'<span class="sn2-w-btn">'+(canReplay?'<button class="sn-replay" onclick="wrReplay(\''+w.start+'\')" title="Bilan de cette semaine">&#x25B6;</button>':'')+'</span>'
        +'</div>';
    });
    h+='</div>';
  }
  // ── Bilans du mois de la saison (rejouables) ──
  var months=[],mkSeen={};
  logs.forEach(function(l){
    if(!rankLogIsSalle(l)) return;
    var mk=l.date.slice(0,7);
    if(!mkSeen[mk]){ mkSeen[mk]=1; months.push(mk); }
  });
  var curMk=todayStr().slice(0,7);
  months=months.filter(function(mk){return mk<curMk;}).sort().reverse();
  if(months.length){
    h+='<div class="sn2-lbl">&#x1F5D3; Bilans du mois</div><div class="sn2-weeks">';
    months.forEach(function(mk){
      h+='<div class="sn2-wrow"><span class="sn2-w-date" style="grid-column:1/3;">'+mrMonthLabel(mk)+'</span>'
        +'<span class="sn2-w-rp"></span>'
        +'<span class="sn2-w-btn"><button class="sn-replay" onclick="mrReplay(\''+mk+'\')" title="Bilan de ce mois">&#x25B6;</button></span></div>';
    });
    h+='</div>';
  }
  var bodyEl=document.getElementById('seasonModalBody');
  bodyEl.innerHTML=h;
  document.getElementById('seasonModal').classList.add('open');
  animCountUpAll(bodyEl);
}
function closeSeasonModal(){ document.getElementById('seasonModal').classList.remove('open'); }

