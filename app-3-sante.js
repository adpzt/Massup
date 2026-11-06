// ══════════════════════════════════════════════════
// SANTÉ — DONNÉES & FONCTIONS
// ══════════════════════════════════════════════════

var HEALTH_SEED = [
  {date:'2026-03-11',poids:62.85,imc:21.5,graisseCorp_kg:7.42,graisseCorp_pct:11.8,muscleSqlt_kg:35.76,muscleSqlt_pct:56.9,poidsSansMG:55.40,grasSousCutane_pct:10.4,grasVisceral:4,eauTotale_kg:39.97,eauTotale_pct:63.6,masseMusc_kg:52.70,masseMusc_pct:83.9,masseOss_kg:2.77,masseOss_pct:4.4,proteines_kg:12.70,proteines_pct:20.2,metabolisme:1567,ageMeta:18},
  {date:'2026-03-22',poids:64.60,imc:22.1,graisseCorp_kg:8.20,graisseCorp_pct:12.7,muscleSqlt_kg:36.43,muscleSqlt_pct:56.4,poidsSansMG:56.40,grasSousCutane_pct:11.2,grasVisceral:5,eauTotale_kg:40.70,eauTotale_pct:63.0,masseMusc_kg:53.50,masseMusc_pct:82.8,masseOss_kg:2.82,masseOss_pct:4.4,proteines_kg:12.79,proteines_pct:19.8,metabolisme:1586,ageMeta:18},
  {date:'2026-04-01',poids:65.70,imc:22.5,graisseCorp_kg:8.74,graisseCorp_pct:13.3,muscleSqlt_kg:36.73,muscleSqlt_pct:55.9,poidsSansMG:56.90,grasSousCutane_pct:11.7,grasVisceral:5,eauTotale_kg:41.06,eauTotale_pct:62.5,masseMusc_kg:54.10,masseMusc_pct:82.3,masseOss_kg:2.85,masseOss_pct:4.3,proteines_kg:12.94,proteines_pct:19.7,metabolisme:1598,ageMeta:18},
  {date:'2026-04-14',poids:66.60,imc:22.8,graisseCorp_kg:9.19,graisseCorp_pct:13.8,muscleSqlt_kg:37.10,muscleSqlt_pct:55.7,poidsSansMG:57.40,grasSousCutane_pct:12.0,grasVisceral:5,eauTotale_kg:41.43,eauTotale_pct:62.2,masseMusc_kg:54.50,masseMusc_pct:81.8,masseOss_kg:2.87,masseOss_pct:4.3,proteines_kg:13.12,proteines_pct:19.7,metabolisme:1610,ageMeta:18}
];

// Les métriques RENPHO (IMC, masse grasse, muscle...) ont été retirées du Bilan :
// données de balance à impédance trop peu fiables. Seul le POIDS fait référence.
// DB.healthLogs est conservé en base (legacy) mais n'est plus affiché ni saisi.
var santeChart = null;

function initHealthLogs(){
  if(!DB.healthLogs) DB.healthLogs=[];
  var needsSave=false;
  HEALTH_SEED.forEach(function(entry){
    if((DB.deletedBW||[]).indexOf(entry.date)>=0) return; // supprimée par Adrien — ne pas ressusciter (12/08)
    if(!DB.healthLogs.find(function(h){return h.date===entry.date;})){
      DB.healthLogs.push(entry);
      needsSave=true;
    }
    // Mirror poids to bodyWeight if not already there
    if(!DB.bodyWeight.find(function(b){return b.date===entry.date;})){
      DB.bodyWeight.push({date:entry.date,weight_kg:entry.poids,note:'RENPHO'});
      needsSave=true;
    }
  });
  if(needsSave){
    DB.healthLogs.sort(function(a,b){return a.date.localeCompare(b.date);});
    DB.bodyWeight.sort(function(a,b){return a.date.localeCompare(b.date);});
    saveDB();
  }
}

var LOG_SEED = [
  {date:'2026-02-24',sessions:['autre:RITM']},
  {date:'2026-02-28',sessions:['autre:RITM']},
  {date:'2026-03-02',sessions:['autre:RITM']},
  {date:'2026-03-07',sessions:['autre:RITM']},
  {date:'2026-03-09',sessions:['autre:RITM']},
  {date:'2026-03-11',sessions:['autre:Escalade'],comment:'Le Triangle'},
  {date:'2026-03-13',sessions:['autre:RITM']},
  {date:'2026-03-18',sessions:['autre:RITM']},
  {date:'2026-03-20',sessions:['autre:RITM']},
  {date:'2026-03-23',sessions:['autre:RITM']},
  {date:'2026-03-25',sessions:['autre:RITM']},
  {date:'2026-03-27',sessions:['autre:RITM']},
  {date:'2026-03-30',sessions:['autre:RITM']},
  {date:'2026-04-01',sessions:['autre:RITM']},
  {date:'2026-04-03',sessions:['autre:RITM']},
  {date:'2026-04-06',sessions:['autre:RITM']},
  {date:'2026-04-08',sessions:['autre:RITM']},
  {date:'2026-04-10',sessions:['autre:RITM']},
  {date:'2026-04-13',sessions:['autre:RITM']},
  {date:'2026-04-15',sessions:['autre:RITM']},
  {date:'2026-04-18',sessions:['autre:RITM']}
];

function initLogs(){
  var needsSave=false;
  LOG_SEED.forEach(function(entry){
    var key=entry.date+'|'+entry.sessions.join(',');
    var exists=DB.logs.find(function(l){ return (l.date===entry.date&&l.sessions.join(',')===entry.sessions.join(',')); });
    if(!exists){
      DB.logs.push({id:'seed-'+key,date:entry.date,time:'10:00',sessions:entry.sessions,comment:entry.comment||'',feeling:null,energy:null,duration_min:null});
      needsSave=true;
    }
  });
  if(needsSave){
    DB.logs.sort(function(a,b){ return b.date.localeCompare(a.date)||(b.time.localeCompare(a.time)); });
    saveDB();
  }
}

function getWeekStreak(){
  var streak=0;
  var now=getNow();
  for(var w=0;w<=52;w++){
    var wstart=new Date(now);
    var dayOfWeek=wstart.getDay();
    var mondayOffset=dayOfWeek===0?6:dayOfWeek-1;
    wstart.setDate(wstart.getDate()-mondayOffset-w*7);
    wstart.setHours(0,0,0,0);
    var wend=new Date(wstart); wend.setDate(wend.getDate()+6); wend.setHours(23,59,59,999);
    var count=weekValue(DB.logs.filter(function(l){ var d=new Date(l.date); return d>=wstart&&d<=wend; }));
    if(count>=getWeekGoal()){ streak++; }
    else break;
  }
  return streak;
}

function renderSante(){
  // DA Graphite Énergie (02/11/2026) : toute la page Bilan est rendue par bilan.js (BILAN.render),
  // sans cartes. Les anciens blocs (carte profil, tuiles, courbe Chart.js, historique, mensurations) sont débranchés.
  try{ BILAN.render(); }catch(e){ console.warn('[MASSUP] BILAN:',e); }
  try{ if(typeof STEPS!=='undefined') STEPS.pull(false); }catch(e){}
  try{ if(typeof INTAKE!=='undefined') INTAKE.pull(false); }catch(e){}
  try{ if(typeof PV!=='undefined') PV.pull(false); }catch(e){}
}

// Graphique d'évolution du poids de corps (seule métrique de référence du Bilan)
// 02/11 (demande Adrien) : les pesées en points discrets + la TENDANCE en trait plein (bwTrend) —
// le poids du jour bouge de ±1 kg (eau, sel, créatine), la tendance montre le vrai mouvement.
function renderSanteChart(){
  try{ renderSanteTrendLine(); }catch(e){ console.warn('[MASSUP] renderSanteTrendLine:',e); }
  if(typeof Chart==='undefined') return;
  if(!document.getElementById('santeChart')) return;
  var data=DB.bodyWeight||[]; if(!data.length) return;
  // Axe X proportionnel au temps réel : chaque point positionné selon sa date (timestamp)
  var pts=data.map(function(b){return {x:new Date(b.date).getTime(),y:parseFloat(b.weight_kg)};});
  var trend=bwTrend(data);
  _santeChartLogs = data;
  var ctx=document.getElementById('santeChart').getContext('2d');
  if(santeChart){
    santeChart.data.datasets[0].data = pts;
    santeChart.data.datasets[1].data = trend;
    santeChart.update('none');
  } else {
    santeChart=new Chart(ctx,{
      type:'line',
      data:{datasets:[
        {label:'Pes\u00e9e',data:pts,showLine:false,pointBackgroundColor:'#0B0D12',pointBorderColor:'rgba(113,255,180,.55)',pointBorderWidth:2,pointRadius:3.5,pointHoverRadius:5,order:2},
        {label:'Tendance',data:trend,borderColor:'#71FFB4',backgroundColor:'rgba(113,255,180,0.12)',borderWidth:2.5,pointRadius:0,pointHitRadius:0,pointHoverRadius:0,tension:.35,fill:true,order:1}
      ]},
      options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'nearest',intersect:false,axis:'x'},plugins:{legend:{display:false},tooltip:{filter:function(c){return c.datasetIndex===0;},callbacks:{title:function(items){return formatDateFr(_santeChartLogs[items[0].dataIndex].date);},label:function(c){return c.parsed.y+' kg';},afterLabel:function(c){var i=c.dataIndex;var t=santeChart&&santeChart.data.datasets[1].data[i];return t?'Tendance : '+String(t.y.toFixed(1)).replace('.',',')+' kg':'';}}}},scales:{x:{type:'linear',bounds:'data',ticks:{color:'rgba(242,245,250,.4)',font:{size:10},maxRotation:0,autoSkip:true,maxTicksLimit:7,callback:function(v){return tsToShort(v);}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(242,245,250,.4)',font:{size:10}},grid:{color:'rgba(255,255,255,.06)'}}}}
    });
  }
}
// Tendance (06/11, demande Adrien — pesée quotidienne) : à chaque pesée, moyenne des 5 DERNIÈRES pesées
// (elle comprise), quelle que soit leur date. Avant (02/11) : moyenne des pesées des 7 derniers jours.
function bwTrend(data){
  var sorted=(data||[]).slice().sort(function(a,b){ return a.date<b.date?-1:a.date>b.date?1:0; });
  var at={}; sorted.forEach(function(b,i){ var s=0,n=0; for(var j=Math.max(0,i-4);j<=i;j++){ s+=parseFloat(sorted[j].weight_kg); n++; } at[b.date]=Math.round(s/n*100)/100; });
  return (data||[]).map(function(b){ return {x:new Date(b.date).getTime(),y:at[b.date]}; });
}
// Rythme (02/11) : pente (moindres carrés) des pesées des 28 jours qui finissent à la dernière pesée,
// en kg/semaine — robuste à une pesée « gonflée ». null sans 3 pesées étalées sur 10 jours ou plus.
function bwRate(data,days){
  data=data||[]; days=days||28;
  if(data.length<3) return null;
  var lastT=new Date(data[data.length-1].date).getTime();
  var pts=data.filter(function(b){ return new Date(b.date).getTime()>lastT-days*86400000; })
    .map(function(b){ return {x:(new Date(b.date).getTime()-lastT)/604800000,y:parseFloat(b.weight_kg)}; });
  if(pts.length<3||(pts[pts.length-1].x-pts[0].x)*7<10) return null;
  var mx=0,my=0; pts.forEach(function(p){ mx+=p.x; my+=p.y; }); mx/=pts.length; my/=pts.length;
  var num=0,den=0; pts.forEach(function(p){ num+=(p.x-mx)*(p.y-my); den+=(p.x-mx)*(p.x-mx); });
  if(!den) return null;
  return {rate:num/den,n:pts.length};
}
// Ligne sous le titre du graphique : tendance actuelle + rythme sur 4 semaines + nb de pesées / 7 j
function renderSanteTrendLine(){
  var el=document.getElementById('santeTrend'); if(!el) return;
  var data=DB.bodyWeight||[]; if(!data.length){ el.innerHTML=''; return; }
  var tr=bwTrend(data), cur=tr[tr.length-1].y, R=bwRate(data);
  var n7=data.filter(function(b){ return new Date(b.date).getTime()>new Date(todayStr()).getTime()-7*86400000; }).length;
  function f(v,d){ return String(v.toFixed(d)).replace('.',','); }
  var h='<span class="bw-tr-item"><span class="bw-tr-dash"></span>Tendance <b>'+f(cur,1)+' kg</b></span>';
  if(R) h+='<span class="bw-tr-item">'+(R.rate>=0?'+':'&#x2212;')+f(Math.abs(R.rate),2)+' kg/sem <span class="bw-tr-sub">sur 4 sem.</span></span>';
  h+='<span class="bw-tr-item bw-tr-sub">'+n7+' pes&#xE9;e'+(n7>1?'s':'')+' / 7 j'+(n7<3?' &#xB7; vise 3+':'')+'</span>';
  el.innerHTML=h;
}

function renderSanteHisto(){
  var el=document.getElementById('santeHisto'); if(!el) return;
  var data=(DB.bodyWeight||[]).slice().reverse();
  if(!data.length){el.innerHTML='<div style="color:var(--mut);font-size:.82rem;text-align:center;padding:1.5rem;">Aucune pesee enregistree.</div>'; return;}
  el.innerHTML=data.map(function(b,i){
    var prev=data[i+1];
    var deltaChip='';
    if(prev){
      var d=parseFloat((parseFloat(b.weight_kg)-parseFloat(prev.weight_kg)).toFixed(1));
      if(d!==0){
        // 15/08 (demande Adrien) : la bulle delta se distingue de la bulle poids — VERT FONCÉ
        var col=d>0?'#5FD695':'#FF6B7A';
        var bg=d>0?'rgba(18,74,44,.6)':'rgba(255,107,122,.1)';
        deltaChip='<span class="chip" style="background:'+bg+';color:'+col+(d>0?';border:1px solid rgba(95,214,149,.25)':'')+'">'+(d>0?'+':'')+d+' kg</span>';
      }
    }
    return '<div class="pesee-entry">'
      +'<div class="pe-left">'+(i===0?'<div class="pe-badge">Derniere</div>':'')+'<div class="pe-date">'+formatDateFr(b.date)+'</div></div>'
      +'<div class="pe-right">'
      +'<span class="chip cw">'+b.weight_kg+' kg</span>'
      +deltaChip
      +'</div>'
      +'<button class="le-del" onclick="deleteBodyWeightEntry(\''+b.date+'\')">&#x1F5D1;</button>'
      +'</div>';
  }).join('');
}

function deleteBodyWeightEntry(date){
  DB.bodyWeight=(DB.bodyWeight||[]).filter(function(b){return b.date!==date;});
  // On purge aussi l'éventuelle entrée legacy RENPHO du même jour
  DB.healthLogs=(DB.healthLogs||[]).filter(function(h){return h.date!==date;});
  // Tombstone (12/08) : sans elle, la pesée revient du cloud au prochain chargement
  if(!DB.deletedBW) DB.deletedBW=[];
  if(DB.deletedBW.indexOf(date)<0) DB.deletedBW.push(date);
  saveDB(); renderSante();
}

// ─── PESÉE MODAL (saisie manuelle, sans IA) ───
function openPeseeModal(){
  var dateEl=document.getElementById('peseeDate');
  var wEl=document.getElementById('peseeWeight');
  if(dateEl) dateEl.value=todayStr();
  var bw=DB.bodyWeight||[];
  if(wEl) wEl.value=bw.length?bw[bw.length-1].weight_kg:'';
  document.getElementById('peseeModal').classList.add('open');
  if(wEl) setTimeout(function(){ try{wEl.focus();wEl.select();}catch(e){} },80);
}
function closePeseeModal(){ document.getElementById('peseeModal').classList.remove('open'); }

function peseeAdjust(delta){
  var wEl=document.getElementById('peseeWeight'); if(!wEl) return;
  var bw=DB.bodyWeight||[];
  var v=parseFloat(wEl.value);
  if(isNaN(v)) v=bw.length?parseFloat(bw[bw.length-1].weight_kg):70;
  wEl.value=(Math.round((v+delta)*10)/10).toFixed(1);
}

// Pesées Renpho (via Santé, bw_kg) → historique des pesées (04/11, roadmap étape 3) : AJOUT seulement — un jour qui a
// déjà une pesée (saisie à la main ou autre) n'est jamais modifié, une pesée supprimée (deletedBW) ne revient jamais.
// Seulement à partir du 01/11/2026 : les 9 anciennes pesées Renpho (mars → octobre) ne réécrivent pas l'historique
// sans l'accord d'Adrien (question posée le 04/11).
var RENPHO_IMPORT_FROM='2026-11-01';
function importHealthWeights(map){
  if(!map) return 0;
  if(!DB.bodyWeight) DB.bodyWeight=[];
  var del=DB.deletedBW||[], n=0;
  Object.keys(map).sort().forEach(function(d){
    if(d<RENPHO_IMPORT_FROM||d>todayStr()) return;
    if(del.indexOf(d)>=0) return;
    if(DB.bodyWeight.some(function(b){ return b.date===d; })) return;
    DB.bodyWeight.push({date:d,weight_kg:map[d],note:'Renpho'}); n++;
  });
  if(n){ DB.bodyWeight.sort(function(a,b){ return a.date<b.date?-1:1; }); saveDB(); try{ if(typeof BILAN!=='undefined') BILAN.render(); }catch(e){} }
  return n;
}
function savePesee(){
  var dateEl=document.getElementById('peseeDate');
  var wEl=document.getElementById('peseeWeight');
  var date=dateEl?dateEl.value:'';
  var w=wEl?parseFloat(wEl.value):NaN;
  if(!date){showToast('Choisis une date.'); return;}
  if(!w||w<30||w>200){showToast('Poids invalide (30-200 kg).'); return;}
  w=Math.round(w*10)/10;
  if(!DB.bodyWeight) DB.bodyWeight=[];
  var idx=DB.bodyWeight.findIndex(function(b){return b.date===date;});
  if(idx>=0){DB.bodyWeight[idx].weight_kg=w;}
  else{DB.bodyWeight.push({date:date,weight_kg:w,note:''});}
  DB.bodyWeight.sort(function(a,b){return a.date.localeCompare(b.date);});
  saveDB();
  closePeseeModal();
  renderSante();
  showToast('Pesee enregistree !');
}

function toggleProgTable(){
  var sec=document.getElementById('progTableSection');
  var lbl=document.getElementById('progTableToggle');
  if(!sec) return;
  var open=!sec.classList.contains('open');
  sec.classList.toggle('open',open);
  if(lbl) lbl.classList.toggle('open',open);
}

// ─── MENSURATIONS (02/11, demande Adrien) ───
// Une fois par mois, sous l'historique des pesées. La 1re mesure sert de point de départ (avant la
// sèche du 04/01/2027). Le tour de taille est neutre (ni vert ni rouge) : il monte un peu en prise de masse.
var BODY_MEAS=[
  {k:'bras',l:'Bras',h:'contract&#xE9;, au plus gros',up:1},
  {k:'poitrine',l:'Poitrine',h:'sous les aisselles, poumons vides',up:1},
  {k:'taille',l:'Taille',h:'au nombril, ventre rel&#xE2;ch&#xE9;',up:0},
  {k:'cuisse',l:'Cuisse',h:'au plus gros, debout',up:1}
];
var _bmHistOpen=false;
function bodyMeasList(){
  var m=DB.bodyMeas||{};
  return Object.keys(m).filter(function(d){ return m[d]&&!m[d].del; }).sort().map(function(d){ return {date:d,v:m[d]}; });
}
function renderBodyMeas(){
  var el=document.getElementById('bodyMeas'); if(!el) return;
  var L=bodyMeasList();
  function f(v){ return String(Math.round(v*10)/10).replace('.',','); }
  if(!L.length){
    el.innerHTML='<div class="chart-section bm-card"><div class="bm-empty">Bras, poitrine, taille, cuisse : une fois par mois. La 1re mesure sert de point de d&#xE9;part avant la s&#xE8;che du 4 janvier.</div>'
      +'<button class="bilan-pesee-btn bm-add" onclick="openMeasModal()">+ Mesurer</button></div>';
    return;
  }
  var last=L[L.length-1], h='<div class="chart-section bm-card"><div class="bm-head"><span class="bm-date">'+formatDateFr(last.date)+'</span>'
    +'<button class="bilan-pesee-btn" onclick="openMeasModal()">+ Mesurer</button></div><div class="bm-grid">';
  BODY_MEAS.forEach(function(M){
    var cur=last.v[M.k];
    var first=null; for(var i=0;i<L.length;i++){ if(L[i].v[M.k]!=null){ first=L[i]; break; } }
    var d=(cur!=null&&first&&first.date!==last.date)?Math.round((cur-first.v[M.k])*10)/10:null;
    var col=d==null||d===0||!M.up?'var(--mut)':d>0?'var(--acc)':'var(--red)';
    h+='<div class="bp-stat bm-stat"><span class="bp-stat-l">'+M.l+'</span>'
      +'<span class="bp-stat-v">'+(cur!=null?f(cur)+'<small> cm</small>':'--')+'</span>'
      +(d!=null?'<span class="bm-delta" style="color:'+col+'">'+(d>0?'+':d<0?'&#x2212;':'')+f(Math.abs(d))+' depuis le '+formatDateShort(first.date)+'</span>':'<span class="bm-delta">point de d&#xE9;part</span>')
      +'</div>';
  });
  h+='</div>';
  h+='<button class="bm-hist-btn" onclick="_bmHistOpen=!_bmHistOpen;renderBodyMeas()">'+(_bmHistOpen?'&#x25BE; Masquer l\u2019historique':'&#x25B8; Historique ('+L.length+')')+'</button>';
  if(_bmHistOpen){
    h+='<div class="bm-hist">'+L.slice().reverse().map(function(e){
      return '<div class="pesee-entry"><div class="pe-left"><div class="pe-date">'+formatDateShort(e.date)+'</div></div><div class="pe-right">'
        +BODY_MEAS.filter(function(M){ return e.v[M.k]!=null; }).map(function(M){ return '<span class="chip">'+M.l+' '+f(e.v[M.k])+'</span>'; }).join('')
        +'</div><button class="le-del" onclick="deleteMeas(\''+e.date+'\')" aria-label="Supprimer">&#x1F5D1;</button></div>';
    }).join('')+'</div>';
  }
  el.innerHTML=h+'</div>';
}
function openMeasModal(){
  var L=bodyMeasList(), last=L.length?L[L.length-1].v:{};
  document.getElementById('measDate').value=todayStr();
  document.getElementById('measFields').innerHTML=BODY_MEAS.map(function(M){
    return '<div class="form-row"><label class="form-lbl" for="meas_'+M.k+'">'+M.l+' (cm) <span class="bm-hint">'+M.h+'</span></label>'
      +'<input class="form-input" type="number" inputmode="decimal" step="0.1" min="10" max="200" id="meas_'+M.k+'" placeholder="'+(last[M.k]!=null?String(last[M.k]).replace('.',','):'')+'"/></div>';
  }).join('');
  document.getElementById('measModal').classList.add('open');
}
function closeMeasModal(){ document.getElementById('measModal').classList.remove('open'); }
function saveMeas(){
  var date=document.getElementById('measDate').value;
  if(!date){ showToast('Choisis une date.'); return; }
  var e={}, n=0, bad=false;
  BODY_MEAS.forEach(function(M){
    var raw=(document.getElementById('meas_'+M.k).value||'').replace(',','.');
    if(raw==='') return;
    var v=parseFloat(raw);
    if(isNaN(v)||v<10||v>200){ bad=true; return; }
    e[M.k]=Math.round(v*10)/10; n++;
  });
  if(bad){ showToast('Mesure invalide (10-200 cm).'); return; }
  if(!n){ showToast('Entre au moins une mesure.'); return; }
  if(!DB.bodyMeas) DB.bodyMeas={};
  var prev=DB.bodyMeas[date];
  if(prev&&!prev.del) BODY_MEAS.forEach(function(M){ if(e[M.k]==null&&prev[M.k]!=null) e[M.k]=prev[M.k]; });
  e.at=Date.now();
  DB.bodyMeas[date]=e;
  saveDB(); closeMeasModal(); renderBodyMeas();
  showToast('Mensurations enregistr&#xE9;es');
}
function deleteMeas(date){
  if(!confirm('Supprimer les mensurations du '+formatDateShort(date)+' ?')) return;
  if(!DB.bodyMeas) DB.bodyMeas={};
  DB.bodyMeas[date]={del:1,at:Date.now()};
  saveDB(); renderBodyMeas();
}

function toggleSanteHisto(){
  var sec=document.getElementById('santeHistoSection');
  var lbl=document.getElementById('santeHistoToggle');
  if(!sec) return;
  var open=!sec.classList.contains('open');
  sec.classList.toggle('open',open);
  if(lbl) lbl.classList.toggle('open',open);
}

// ══════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════
function formatDateFr(str){
  if(!str) return '';
  var p=str.split('-'); var months=['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  return parseInt(p[2])+' '+months[parseInt(p[1])-1]+' '+p[0];
}
function formatDateShort(str){
  if(!str) return ''; var p=str.split('-'); return p[2]+'/'+p[1];
}
// Formate un timestamp (ms, UTC) en JJ/MM — pour les axes proportionnels au temps
function tsToShort(ms){
  var d=new Date(ms); var dd=d.getUTCDate(), mm=d.getUTCMonth()+1;
  return (dd<10?'0'+dd:dd)+'/'+(mm<10?'0'+mm:mm);
}

var toastTimer=null;
var _toastUndoFn=null;
function showToast(msg, undoFn){
  var t=document.getElementById('toast');
  _toastUndoFn=undoFn||null;
  if(undoFn){
    t.innerHTML=msg+'<span class="toast-undo">Annuler &#x21A9;</span>';
    t.classList.add('undoable');
    var undoSpan=t.querySelector('.toast-undo');
    if(undoSpan) undoSpan.addEventListener('click',function(e){
      e.stopPropagation();
      if(_toastUndoFn){var f=_toastUndoFn;_toastUndoFn=null;f();}
      if(toastTimer) clearTimeout(toastTimer);
      t.classList.remove('show','undoable');
    });
  } else {
    t.innerHTML=msg;
    t.classList.remove('undoable');
    _toastUndoFn=null;
  }
  t.classList.add('show');
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){t.classList.remove('show','undoable');_toastUndoFn=null;},4000);
}


// ─── 4.2 Tableau des progressions ───
function renderProgressionTable() {
  var el=document.getElementById('progTable');
  if(!el) return;
  var html='';
  DATA.forEach(function(s){
    html+='<div class="progtbl-section">'
      +'<div class="progtbl-seance-hdr">'+s.icon+' '+s.name+'</div>';
    s.exos.forEach(function(e){
      if(e.hidden) return;
      var arr=DB.weights[e.key]||[];
      if(!arr.length) return;
      var start=arr[0];
      var cur=arr[arr.length-1];
      var delta=cur.val-start.val;
      var pct=start.val>0?Math.round((delta/start.val)*100):0;
      var sign=delta>0?'+':'';
      var col=delta>0?'var(--acc)':delta<0?'var(--red)':'var(--mut)';
      var pctStr=pct!==0?(sign+pct+'%'):'=';
      html+='<div class="progtbl-row">'
        +'<div class="progtbl-name">'+e.name+'</div>'
        +'<div class="progtbl-vals">'
          +'<span class="progtbl-start">'+start.val+' '+e.unite+'</span>'
          +'<span class="progtbl-arrow">&#x2192;</span>'
          +'<span class="progtbl-cur">'+cur.val+' '+e.unite+'</span>'
        +'</div>'
        +'<div class="progtbl-delta" style="color:'+col+'">'+sign+delta+' ('+pctStr+')</div>'
        +'</div>';
    });
    html+='</div>';
  });
  el.innerHTML=html||'<div style="color:var(--mut);padding:1.25rem;text-align:center;font-size:.8rem">Enregistre tes s\u00e9ances pour voir ta progression.</div>';
}

// ══════════════════════════════════════════════════
// PHASE 4 — NOUVELLES FONCTIONS
// ══════════════════════════════════════════════════

// ─── 4.3 Log amélioré ───
var ENERGY_LABELS = ['', 'A plat', 'Moyen', 'Correct', 'Bien', 'En feu !!'];
var FEELING_LABELS = ['', 'Tr\u00e8s dur', 'Difficile', 'Correcte', 'Bonne', 'Parfaite !'];

function setRating(field, val) {
  if(field==='energy'){ logEnergy=val; }
  else { logFeeling=val; }
  var rowId = field==='energy'?'energyRating':'feelingRating';
  var lblId = field==='energy'?'energyLbl':'feelingLbl';
  var labels = field==='energy'?ENERGY_LABELS:FEELING_LABELS;
  var row=document.getElementById(rowId);
  if(!row) return;
  row.querySelectorAll('.rating-btn').forEach(function(btn){
    btn.classList.toggle('active', parseInt(btn.dataset.val)<=val);
  });
  var lbl=document.getElementById(lblId);
  if(lbl) lbl.textContent=labels[val]||'';
}



// ─── 4.4 Rappel séance ───
function getDaysSinceLastSession() {
  if(!DB.logs.length) return null;
  var sorted=DB.logs.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var last=new Date(sorted[0].date);
  var now=getNow(); now.setHours(0,0,0,0); last.setHours(0,0,0,0);
  return Math.floor((now-last)/86400000);
}

function renderNoTrainingBanner() {
  var el=document.getElementById('noTrainingBanner');
  if(!el) return; // bannière retirée du DOM (alertes désactivées 31/07/2026)
  var days=getDaysSinceLastSession();
  if(days===null||days<=2){ el.style.display='none'; return; }
  el.style.display='block';
  var msg;
  if(days===3) msg='Ca fait 3 jours. Une petite s\u00e9ance ce soir ?';
  else if(days<=5) msg='Ca fait '+days+' jours sans s\u00e9ance. Ton corps attend !';
  else msg='Ca fait '+days+' jours ! Le muscle ne pousse pas sans stimulus. Allez !!';
  el.innerHTML='&#x1F552; '+msg;
}

// ─── 4.1 Poids corporel — stats dérivées (Δ7j / Δ30j / rythme / repère bulk) ───
var BULK_TARGET_KG = 76; // repère (pas une cible stricte) : bulk jusqu'au 1er janvier

function renderBilanWeightStats() {
  var el=document.getElementById('bwStatsRow');
  if(!el) return;
  // 15/08 : fusionné dans la carte profil (Δ30j · rythme · total) — Δ7j et repère 76 kg sortis
  // à la demande d'Adrien. Code conservé.
  el.innerHTML=''; return;
  var data=DB.bodyWeight||[];
  if(!data.length){ el.innerHTML=''; return; }
  var last=data[data.length-1];
  var current=parseFloat(last.weight_kg);
  var now=new Date(todayStr());
  var weekAgo=new Date(now.getTime()-7*86400000);
  var monthAgo=new Date(now.getTime()-30*86400000);
  var entryWeekAgo=null, entryMonthAgo=null;
  for(var i=data.length-1;i>=0;i--){
    var ed=new Date(data[i].date);
    if(entryWeekAgo===null&&ed<=weekAgo) entryWeekAgo=parseFloat(data[i].weight_kg);
    if(entryMonthAgo===null&&ed<=monthAgo) entryMonthAgo=parseFloat(data[i].weight_kg);
  }
  function deltaHtml(ref) {
    if(ref===null) return '<span style="color:var(--mut)">--</span>';
    var diff=(current-ref);
    var sign=diff>0?'+':'';
    var col=diff>0?'var(--acc)':diff<0?'var(--red)':'var(--mut)';
    return '<span style="color:'+col+'">'+sign+diff.toFixed(1)+' kg</span>';
  }
  // Rythme kg/sem sur les ~30 derniers jours (sinon depuis le début)
  var refW=entryMonthAgo, refDate=null;
  for(var j=data.length-1;j>=0;j--){ if(new Date(data[j].date)<=monthAgo){refDate=data[j].date;break;} }
  if(refW===null&&data.length>=2){ refW=parseFloat(data[0].weight_kg); refDate=data[0].date; }
  var rateHtml='<span style="color:var(--mut)">--</span>';
  if(refW!==null&&refDate){
    var wks=(now-new Date(refDate))/604800000;
    if(wks>=1){
      var rate=(current-refW)/wks;
      var rCol=rate>0&&rate<=0.5?'var(--acc)':rate>0.5?'var(--yellow)':'var(--mut)';
      rateHtml='<span style="color:'+rCol+'">'+(rate>=0?'+':'')+rate.toFixed(2)+'</span>';
    }
  }
  var remain=Math.max(0,Math.round((BULK_TARGET_KG-current)*10)/10);
  var remainHtml=remain>0
    ? '<span style="color:var(--acc2)">-'+remain+' kg</span>'
    : '<span style="color:var(--acc)">Atteint !</span>';
  el.innerHTML=
    '<div class="bw-stat-card"><div class="bw-stat-val">'+deltaHtml(entryWeekAgo)+'</div><div class="bw-stat-lbl">7 jours</div></div>'
    +'<div class="bw-stat-card"><div class="bw-stat-val">'+deltaHtml(entryMonthAgo)+'</div><div class="bw-stat-lbl">30 jours</div></div>'
    +'<div class="bw-stat-card"><div class="bw-stat-val">'+rateHtml+'</div><div class="bw-stat-lbl">kg / sem</div></div>'
    +'<div class="bw-stat-card"><div class="bw-stat-val">'+remainHtml+'</div><div class="bw-stat-lbl">Repère '+BULK_TARGET_KG+' kg</div></div>';
}


// ══════════════════════════════════════════════════
// FULLSCREEN CHART
// ══════════════════════════════════════════════════
var _fsChartInstance=null;
function openFullscreenChart(){
  var key=document.getElementById('chartSelect').value;
  if(!key) return;
  var overlay=document.getElementById('fsOverlay');
  var titleEl=document.getElementById('fsTitle');
  if(!overlay) return;
  if(titleEl) titleEl.textContent=getExoName(key);
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
  setTimeout(function(){renderFullscreenChart(key);},50);
}
function closeFullscreenChart(){
  var overlay=document.getElementById('fsOverlay');
  if(overlay) overlay.classList.remove('open');
  document.body.style.overflow='';
  if(_fsChartInstance){_fsChartInstance.destroy();_fsChartInstance=null;}
}
function renderFullscreenChart(key){
  if(typeof Chart==='undefined') return;
  var arr=DB.weights[key]||[];
  if(!arr.length) return;
  var labels=arr.map(function(x){return formatDateShort(x.date);});
  var vals=arr.map(function(x){return x.val;});
  var ctx=document.getElementById('fsChart').getContext('2d');
  if(_fsChartInstance) _fsChartInstance.destroy();
  _fsChartInstance=new Chart(ctx,{
    type:'line',
    data:{labels:labels,datasets:[{label:'Poids (kg)',data:vals,borderColor:'#71FFB4',backgroundColor:'rgba(113,255,180,0.14)',borderWidth:2,pointBackgroundColor:'#0B0D12',pointBorderColor:'#71FFB4',pointBorderWidth:2,pointRadius:4,tension:.35,fill:true}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{title:function(items){return formatDateFr(arr[items[0].dataIndex].date);},label:function(c){return c.parsed.y+' kg';},afterLabel:function(c){var i=c.dataIndex;if(!i)return'';var delta=Math.round((c.parsed.y-arr[i-1].val)*10)/10;var days=Math.round((new Date(arr[i].date)-new Date(arr[i-1].date))/86400000);var t=days>=14?Math.round(days/7)+' sem.':days+'j';return(delta>=0?'+':'')+delta+' kg en '+t;}}}},scales:{x:{ticks:{color:'rgba(242,245,250,.5)',font:{size:12}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(242,245,250,.5)',font:{size:12}},grid:{color:'rgba(255,255,255,.06)'}}}}
  });
}

// ══════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════
function getSessionLabel(sid){
  if(sid.indexOf('autre:')===0) return sid.replace('autre:','');
  if(sid.indexOf('exo:')===0) return getExoName(sid.replace('exo:',''));
  var s=DATA.find(function(x){return x.id===sid;}); return s?s.icon+' '+s.name:sid;
}

function renderDashboard(){
  var el=document.getElementById('dashContent'); if(!el) return;
  var now=getNow();
  var name=DB.profile&&DB.profile.name?DB.profile.name:'';
  var last=DB.logs.length?DB.logs[0]:null;
  var daysSinceLast=last?Math.floor((now-new Date(last.date))/86400000):null;
  var lastNames=last?last.sessions.map(getSessionLabel).join(' + '):'';

  var context='', headline='', sub='';
  if(!last){
    context='PRÊT À COMMENCER';
    headline=name?'Lance-toi, '+name+' !':'Lance-toi !';
    sub='Enregistre ta première séance pour commencer à suivre ta progression.';
  } else if(daysSinceLast===0){
    context='SÉANCE DU JOUR · VALIDÉE ✓';
    headline='Bien joué'+(name?', '+name:'')+' !';
    sub=lastNames+(last.duration_min?' · '+last.duration_min+' min':'');
  } else if(daysSinceLast===1){
    context='REPOS · HIER';
    headline='C\'est l\'heure de reprendre'+(name?', '+name:'')+' !';
    sub='Dernière séance : '+lastNames;
  } else if(daysSinceLast===2){
    context='REPOS · 2 JOURS';
    headline='La récupération est faite !';
    sub='Dernière séance : '+lastNames;
  } else if(daysSinceLast<=4){
    context=daysSinceLast+' JOURS SANS SÉANCE';
    headline='Le corps est reposé, la salle t\'attend.';
    sub='Dernière séance : '+lastNames;
  } else {
    context=daysSinceLast+' JOURS SANS SÉANCE';
    headline=daysSinceLast+' jours. Le muscle s\'impatiente !';
    sub='Dernière séance : '+lastNames;
  }

  var html='<div class="accueil-hero">'
    +'<div class="accueil-context">'+context+'</div>'
    +'<div class="accueil-headline">'+headline+'</div>'
    +'<div class="accueil-sub">'+sub+'</div>'
    +'<button class="accueil-cta-btn" onclick="edOpen(null)">+ Enregistrer une séance</button>'
    +'</div>';
  el.innerHTML=html;
}

// ══════════════════════════════════════════════════
// BILAN — fonctions de rendu (poids de corps = seule référence)
// ══════════════════════════════════════════════════
function renderBilanHero(){
  var el=document.getElementById('bilanHero'); if(!el) return;
  // 15/08 : fusionné dans la carte profil (renderBilanProfile v2) — code conservé
  el.innerHTML=''; return;
  var data=DB.bodyWeight||[];
  if(!data.length){
    el.innerHTML='<div class="bilan-hero" style="text-align:center;padding:2rem 1.5rem;">'
      +'<div style="font-size:.78rem;color:var(--mut);margin-bottom:1rem;">Aucune pesée enregistrée pour l\'instant.</div>'
      +'<button class="bilan-pesee-btn" style="font-size:.8rem;padding:.55rem 1rem;" onclick="openPeseeModal()">&#x2696;&#xFE0F; Ajouter ma première pesée</button>'
      +'</div>';
    return;
  }
  var last=data[data.length-1];
  var first=data[0];
  var prev=data.length>1?data[data.length-2]:null;
  var current=parseFloat(last.weight_kg);
  var totalGain=parseFloat((current-parseFloat(first.weight_kg)).toFixed(1));
  var gainSign=totalGain>0?'+':'';
  var gainCol=totalGain>0?'var(--acc)':totalGain<0?'#FF6B7A':'var(--mut)';
  var metaItems=[];
  if(prev){
    var d=parseFloat((current-parseFloat(prev.weight_kg)).toFixed(1));
    var dCol=d>0?'var(--acc)':d<0?'#FF6B7A':'var(--mut)';
    metaItems.push('<span style="color:'+dCol+';font-weight:700">'+(d>0?'+':'')+d+' kg</span> vs pesée préc.');
  }
  metaItems.push('<span style="color:'+gainCol+'" class="bilan-hero-gain">'+gainSign+totalGain+' kg depuis le début</span>');
  el.innerHTML='<div class="bilan-hero">'
    +'<div class="bilan-hero-top">'
    +'<div class="bilan-hero-label">DERNIÈRE PESÉE · '+formatDateFr(last.date)+'</div>'
    +'<button class="bilan-pesee-btn" onclick="openPeseeModal()">+ Pesée</button>'
    +'</div>'
    +'<div class="bilan-weight">'+current+' <span class="bilan-weight-unit">kg</span></div>'
    +'<div class="bilan-hero-meta">'+metaItems.join('<span class="sep">&middot;</span>')+'</div>'
    +'</div>';
}

// ══════════════════════════════════════════════════
// REPÈRES SELON LE PROFIL (force indicative + composition)
// ══════════════════════════════════════════════════
// Multiplicateurs du POIDS DE CORPS pour le poids de TRAVAIL (séries de 8-12 reps), homme.
// Indicatif : les machines varient d'une salle à l'autre — repère, pas vérité absolue.
var STRENGTH_STD = {
  chestpress_v:{beg:.42,int:.60,adv:.82},
  pecdeck:{beg:.36,int:.52,adv:.70},
  dev_incline:{beg:.14,int:.21,adv:.30,perHand:true},
  elev_lat:{beg:.05,int:.09,adv:.14,perHand:true},
  triceps_corde:{beg:.18,int:.26,adv:.36},
  tirage_vert:{beg:.52,int:.70,adv:.92},
  rowing_pb:{beg:.46,int:.62,adv:.82},
  rowing_uni:{beg:.22,int:.31,adv:.42,perHand:true},
  rowing_appui:{beg:.42,int:.58,adv:.78},
  abduct:{beg:.30,int:.45,adv:.62},
  adduct:{beg:.30,int:.45,adv:.62},
  shrug_halt:{beg:.22,int:.34,adv:.50,perHand:true},
  cable_fly:{beg:.08,int:.13,adv:.19,perHand:true},
  curl_halt:{beg:.12,int:.17,adv:.24,perHand:true},
  curl_poulie:{beg:.12,int:.18,adv:.25},
  curl_corde:{beg:.12,int:.18,adv:.25},
  leg_press:{beg:.70,int:1.20,adv:1.90},
  leg_ext:{beg:.40,int:.58,adv:.80},
  leg_curl:{beg:.34,int:.50,adv:.68},
  mollets:{beg:.50,int:.75,adv:1.05},
  curl_incline:{beg:.10,int:.15,adv:.21,perHand:true},
  curl_marteau:{beg:.11,int:.16,adv:.22,perHand:true}
};

function getProfileBodyWeight(){
  var bw=DB.bodyWeight||[];
  if(bw.length) return bw[bw.length-1].weight_kg;
  var logs=DB.healthLogs||[];
  if(logs.length) return logs[logs.length-1].poids;
  return 0;
}

// ══════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════
function openSettings(){
  try{ if(typeof fillAccountEmail==='function') fillAccountEmail(); }catch(e){}
  var p=DB.profile||{};
  var n=document.getElementById('settingsName'); if(n) n.value=p.name||'';
  var h=document.getElementById('settingsHeight'); if(h) h.value=p.height||'';
  var a=document.getElementById('settingsAge'); if(a) a.value=p.age||'';
  var g=document.getElementById('settingsGoal'); if(g) g.value=p.goal||'masse';
  var wg=document.getElementById('settingsWeekGoal'); if(wg) wg.value=String(getWeekGoal());
  renderSettingsSeason();
  try{ renderRankPauses(); }catch(e){}
  renderReminderSettings();
  document.getElementById('settingsModal').classList.add('open');
}
function closeSettings(){ document.getElementById('settingsModal').classList.remove('open'); }
function saveSettings(){
  if(!DB.profile) DB.profile={};
  DB.profile.name=document.getElementById('settingsName').value.trim();
  DB.profile.height=parseInt(document.getElementById('settingsHeight').value)||0;
  DB.profile.age=parseInt(document.getElementById('settingsAge').value)||0;
  DB.profile.goal=document.getElementById('settingsGoal').value;
  var wgEl=document.getElementById('settingsWeekGoal');
  if(wgEl) DB.profile.weekGoal=parseInt(wgEl.value)||4;
  saveDB();
  closeSettings();
  renderDashboard();
  try{ renderGymGreet(); }catch(e){}
  showToast('\u2705 Profil sauvegardé');
}
// ══════════════════════════════════════════════════
// RAPPELS (notifications séance + shaker + inactivité)
// ══════════════════════════════════════════════════
var DAY_LETTERS=['D','L','M','M','J','V','S'];
function defaultReminders(){ return {
  scheduleVersion:2,
  enabled:false,
  hydrationEnabled:true,hydrationTimes:['08:30','11:00','14:30','17:00','19:00','21:00'],
  workoutEnabled:true,workoutNoonTime:'12:00',workoutEveningTime:'18:00',workoutStartedDate:'',
  sleepLogEnabled:true,sleepLogTime:'08:30',bedtimeEnabled:true,bedtimeTime:'23:30',
  days:[1,2,4,5],time:'18:30',shaker:false,inactivity:false,_lastShaker:'',_lastInact:'',_dismissed:''
}; }
function initReminders(){
  if(!DB.reminders) DB.reminders=defaultReminders();
  var d=defaultReminders();
  if(!DB.reminders.scheduleVersion){
    DB.reminders.shaker=false;
    DB.reminders.inactivity=false;
    DB.reminders.scheduleVersion=2;
  }
  Object.keys(d).forEach(function(k){ if(DB.reminders[k]===undefined) DB.reminders[k]=d[k]; });
  if(!Array.isArray(DB.reminders.hydrationTimes)) DB.reminders.hydrationTimes=d.hydrationTimes.slice();
}
function lastSeanceDate(){
  var real=(DB.logs||[]).filter(function(l){ return (l.sessions||[]).length>0; });
  if(!real.length) return null;
  var max=null; real.forEach(function(l){ if(!max||l.date>max) max=l.date; });
  return max;
}
function daysSinceLastSeance(){
  var d=lastSeanceDate(); if(!d) return 999;
  var now=getNow(); var past=new Date(d+'T00:00:00');
  var t=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  return Math.floor((t-past)/86400000);
}
function hasSeanceToday(){
  var t=todayStr();
  return (DB.logs||[]).some(function(l){ return l.date===t && (l.sessions||[]).length>0; });
}
function shakerDoneToday(){ var n=DB.nutrition[todayStr()]; return !!(n&&n.shaker); }
function notifSupported(){ return ('Notification' in window); }
function isStandaloneWebApp(){
  return !!(navigator.standalone===true||(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches));
}
function base64UrlBytes(value){
  var raw=window.atob(value.replace(/-/g,'+').replace(/_/g,'/'));
  var bytes=new Uint8Array(raw.length);
  for(var i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
  return bytes;
}
async function enablePushNotifications(){
  if(!notifSupported()||!navigator.serviceWorker||!window.isSecureContext){ showToast('Notifications push indisponibles dans ce navigateur'); return; }
  if(typeof sbClient==='undefined'||!sbClient){ showToast('Connexion au cloud indisponible : réessaie avec du réseau'); return; }
  var standalone=isStandaloneWebApp();
  if(/iPhone|iPad|iPod/i.test(navigator.userAgent)&&!standalone){
    showToast('Sur iPhone, ajoute MASSUP à l’écran d’accueil puis ouvre son icône');
    return;
  }
  try{
    var permission=Notification.permission;
    if(permission==='default') permission=await Notification.requestPermission();
    if(permission!=='granted'){ showToast('Autorisation de notification refusée'); renderReminderSettings(); return; }
    var configResponse=await fetch('/api/push-config',{cache:'no-store'});
    var config=await configResponse.json();
    if(!configResponse.ok||!config.enabled||!config.publicKey) throw new Error('Web Push non configuré côté serveur');
    var registration=await navigator.serviceWorker.ready;
    if(!registration.pushManager) throw new Error('Push API indisponible dans cette installation');
    var subscription=await registration.pushManager.getSubscription();
    var created=false;
    if(!subscription){
      subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:base64UrlBytes(config.publicKey)});
      created=true;
    }
    var userResult=await sbClient.auth.getUser();
    var user=userResult.data&&userResult.data.user;
    if(userResult.error||!user) throw new Error('Connecte-toi à MASSUP avant d’activer les notifications');
    var json=subscription.toJSON();
    var saved=await sbClient.from('push_subscriptions').upsert({
      endpoint:json.endpoint,
      user_id:user.id,
      p256dh:json.keys&&json.keys.p256dh,
      auth:json.keys&&json.keys.auth,
      time_zone:Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC',
      updated_at:new Date().toISOString()
    },{onConflict:'endpoint'});
    if(saved.error){
      if(created) await subscription.unsubscribe();
      throw new Error('Enregistrement de l’abonnement impossible : '+saved.error.message);
    }
    _pushState={state:'ok'};
    setPushOptOut(false);
    showToast('Notifications push activées sur cet appareil');
    renderReminderSettings();
    try{ renderWeeklyRecapWidget(); }catch(e){}
  }catch(error){
    console.warn('[MASSUP] Web Push subscription:',error.message);
    showToast('Activation Web Push impossible : '+error.message);
  }
}
async function disablePushNotifications(){
  if(typeof sbClient==='undefined'||!sbClient){ showToast('Connexion au cloud indisponible : réessaie avec du réseau'); return; }
  setPushOptOut(true); _pushState=null;
  try{ renderWeeklyRecapWidget(); }catch(e){}
  try{
    var registration=await navigator.serviceWorker.ready;
    var subscription=await registration.pushManager.getSubscription();
    if(!subscription){ renderReminderSettings(); return; }
    var endpoint=subscription.endpoint;
    var removed=await sbClient.from('push_subscriptions').delete().eq('endpoint',endpoint);
    if(removed.error) throw new Error('Suppression de l’abonnement impossible : '+removed.error.message);
    if(!await subscription.unsubscribe()) throw new Error('Le navigateur n’a pas supprimé l’abonnement push');
    showToast('Notifications push désactivées sur cet appareil');
    renderReminderSettings();
  }catch(error){
    console.warn('[MASSUP] Web Push unsubscribe:',error.message);
    showToast('Désactivation Web Push impossible : '+error.message);
  }
}
// Chrono de repos / d'effort → push programmé côté serveur (module commun push_timer.js, 07/10/2026)
var workoutPushTimer=(typeof PushTimer!=='undefined')?PushTimer.create({
  url:SUPABASE_URL,key:SUPABASE_ANON_KEY,tag:'[MASSUP]',
  client:function(){ return (typeof sbClient!=='undefined'&&sbClient)||null; },
  enabled:function(){
    initReminders();
    return !!DB.reminders.enabled&&!(typeof rankInPause==='function'&&rankInPause(todayStr()));
  },
  onError:function(){ showToast('Chrono lancé, mais rappel hors application indisponible'); },
  onMissing:function(){ if(pushWatch) pushWatch.run(true); }
}):null;
// Auto-réparation de l'abonnement push (12/10/2026, bug « plus aucune notif depuis 2 jours ») :
// au démarrage, au retour au premier plan et quand un chrono ne trouve plus d'abonnement.
var _pushState=null;
// « Désactiver sur cet appareil » = choix de CET appareil : l'auto-réparation ne doit pas le défaire
function pushOptedOut(){ try{ return localStorage.getItem('massup_push_optout')==='1'; }catch(e){ return false; } }
function setPushOptOut(on){ try{ if(on) localStorage.setItem('massup_push_optout','1'); else localStorage.removeItem('massup_push_optout'); }catch(e){} }
var pushWatch=(typeof PushTimer!=='undefined'&&PushTimer.watchSubscription)?PushTimer.watchSubscription({
  tag:'[MASSUP]',
  client:function(){ return (typeof sbClient!=='undefined'&&sbClient)||null; },
  enabled:function(){ initReminders(); return !!DB.reminders.enabled&&!pushOptedOut(); },
  onState:function(res){
    var was=_pushState&&_pushState.state;
    _pushState=res;
    if(res.state==='healed') showToast('&#x1F514; Notifications r&#xE9;activ&#xE9;es sur cet appareil');
    if(res.state!==was){ renderReminderSettings(); try{ renderWeeklyRecapWidget(); }catch(e){} }
  }
}):null;
function updateWorkoutPushTimer(dueAt,title,body){
  if(!workoutPushTimer) return Promise.resolve();
  return workoutPushTimer.update(dueAt,title,body);
}
function checkReminders(){
  var r=DB.reminders; if(!r||!r.enabled){ renderReminderBanner(null); return; }
  var now=getNow(); var dow=now.getDay(); var today=todayStr();
  var banner=null;
  var since=daysSinceLastSeance();
  if(r.inactivity && since>=2 && since<900){
    banner={type:'inact',msg:'&#x1F634; '+since+' jours sans séance — reprends le rythme aujourd\'hui !'};
  }
  if(!banner && r.shaker && r.days.indexOf(dow)>=0){
    var seance=hasSeanceToday(), shk=shakerDoneToday();
    if(!seance || !shk){
      var parts=[];
      if(!seance) parts.push('ta séance');
      if(!shk) parts.push('ta cr&#xE9;atine &#x1F964;');
      banner={type:'day',msg:'&#x1F4AA; Jour de séance ! N\'oublie pas '+parts.join(' et ')+'.',showShaker:!shk};
    }
  }
  renderReminderBanner(banner);
  scheduleNextReminder();
}
var _remindTimer=null;
function scheduleNextReminder(){
  if(_remindTimer) clearTimeout(_remindTimer);
  var r=DB.reminders; if(!r||!r.enabled) return;
  var now=getNow();
  var hm=(r.time||'18:30').split(':');
  var target=new Date(now.getFullYear(),now.getMonth(),now.getDate(),parseInt(hm[0])||18,parseInt(hm[1])||30,0);
  var ms=target-now;
  if(ms<=0) ms=30*60*1000;
  if(ms>2147483647) return;
  _remindTimer=setTimeout(function(){ try{checkReminders();}catch(e){} },ms+1000);
}
function renderReminderBanner(banner){
  var el=document.getElementById('reminderBanner'); if(!el) return;
  if(!banner){ el.innerHTML=''; el.classList.remove('show'); return; }
  if(DB.reminders && DB.reminders._dismissed===todayStr()+':'+banner.type){ el.innerHTML=''; el.classList.remove('show'); return; }
  el.innerHTML='<div class="reminder-banner rb-'+banner.type+'">'
    +'<div class="rb-msg">'+banner.msg+'</div>'
    +'<div class="rb-actions">'
    +(banner.showShaker?'<button class="rb-shaker" onclick="markShakerDone()" title="Valider la cr&#xE9;atine du jour">&#x1F964; Fait</button>':'')
    +'<button class="rb-go" onclick="switchToSeances()">Go</button>'
    +'<button class="rb-x" onclick="dismissReminder(\''+banner.type+'\')" title="Masquer">&#x2715;</button>'
    +'</div></div>';
  el.classList.add('show');
}
// Valide le shaker du jour depuis la bannière (l'onglet Nutrition étant mis de côté)
function markShakerDone(){
  var d=ensureNutriDay(todayStr());
  d.shaker=true; saveDB();
  showToast('&#x1F964; Créatine validée !');
  try{ checkReminders(); }catch(e){}
}
function switchToSeances(){
  var btns=document.querySelectorAll('#main-nav .bni');
  if(btns&&btns[1]) switchView('seances',btns[1]);
}
function dismissReminder(type){
  initReminders();
  DB.reminders._dismissed=todayStr()+':'+type;
  saveDB();
  renderReminderBanner(null);
}
function reminderTimeValue(value,fallback){
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value||'')?value:fallback;
}
function renderReminderSettings(){
  var el=document.getElementById('reminderSettings'); if(!el) return;
  initReminders();
  var r=DB.reminders;
  var perm=notifSupported()?Notification.permission:'unsupported';
  var html='';
  html+='<label class="rem-toggle"><input type="checkbox" '+(r.enabled?'checked':'')+' onchange="toggleReminders(this.checked)"> Activer les rappels</label>';
  if(r.enabled){
    if(perm==='unsupported'){
      html+='<div class="rem-note">&#x26A0;&#xFE0F; Ton navigateur ne gère pas les notifications système. La bannière dans l\'app fonctionne quand même.</div>';
    } else if(perm==='denied'){
      html+='<div class="rem-note">&#x1F515; Notifications bloquées. Réactive-les dans Réglages iOS &#x203A; MASSUP. La bannière dans l\'app reste active.</div>';
    } else if(!isStandaloneWebApp()&&/iPhone|iPad|iPod/i.test(navigator.userAgent)){
      html+='<div class="rem-note">Sur iPhone, ajoute MASSUP à l’écran d’accueil et ouvre l’app installée pour activer les notifications push.</div>';
    } else if(perm==='granted'){
      var ps=_pushState&&_pushState.state;
      html+=(ps==='lost'
          ?'<div class="rem-note rem-warn">&#x26A0;&#xFE0F; Abonnement perdu sur cet appareil : plus aucune notification. Touche « Activer / actualiser ».</div>'
          :(ps==='ok'||ps==='healed')
          ?'<div class="rem-note rem-ok">&#x2705; Notifications actives sur cet appareil (vérifié).</div>'
          :'<div class="rem-note rem-ok">&#x2705; Autorisation de notification accordée sur cet appareil.</div>')
        +'<button class="rem-perm-btn" onclick="enablePushNotifications()">&#x1F514; Activer / actualiser cet abonnement</button>'
        +'<button class="rem-perm-btn" onclick="disablePushNotifications()">&#x1F515; Désactiver sur cet appareil</button>';
    } else {
      html+='<button class="rem-perm-btn" onclick="enablePushNotifications()">&#x1F514; Activer les notifications push sur cet appareil</button>';
    }
    html+='<details class="rem-settings-group"><summary>💧 Boire de l’eau <span>6 horaires</span></summary><div class="rem-settings-content"><label class="rem-toggle rem-compact"><input type="checkbox" '+(r.hydrationEnabled?'checked':'')+' onchange="setReminderFlag(\'hydrationEnabled\',this.checked)"> Activer</label>';
    html+='<div class="rem-schedule-list">';
    r.hydrationTimes.forEach(function(time,i){
      html+='<label class="rem-time-cell"><span>#'+(i+1)+'</span><input class="form-input rem-time" aria-label="Heure du rappel eau '+(i+1)+'" type="time" value="'+reminderTimeValue(time,['08:30','11:00','14:30','17:00','19:00','21:00'][i]||'08:30')+'" onchange="setHydrationTime('+i+',this.value)"></label>';
    });
    html+='</div><div class="rem-note">Les rappels simultanés sont regroupés.</div></div></details>';
    html+='<details class="rem-settings-group"><summary>🏋️ Motivation séance</summary><div class="rem-settings-content"><label class="rem-toggle rem-compact"><input type="checkbox" '+(r.workoutEnabled?'checked':'')+' onchange="setReminderFlag(\'workoutEnabled\',this.checked)"> Activer</label>';
    html+='<label class="rem-schedule-row"><span>Proposition de séance</span><input class="form-input rem-time" type="time" value="'+reminderTimeValue(r.workoutNoonTime,'12:00')+'" onchange="setReminderClock(\'workoutNoonTime\',this.value)"></label>';
    html+='<label class="rem-schedule-row"><span>Relance si pas commencée</span><input class="form-input rem-time" type="time" value="'+reminderTimeValue(r.workoutEveningTime,'18:00')+'" onchange="setReminderClock(\'workoutEveningTime\',this.value)"></label>';
    html+='<div class="rem-note">Après une journée sans séance ; la relance s’annule si tu démarres.</div></div></details>';
    html+='<details class="rem-settings-group"><summary>🌙 Renseigner le sommeil</summary><div class="rem-settings-content"><label class="rem-toggle rem-compact"><input type="checkbox" '+(r.sleepLogEnabled?'checked':'')+' onchange="setReminderFlag(\'sleepLogEnabled\',this.checked)"> Activer</label>';
    html+='<label class="rem-schedule-row"><span>Le matin</span><input class="form-input rem-time" type="time" value="'+reminderTimeValue(r.sleepLogTime,'08:30')+'" onchange="setReminderClock(\'sleepLogTime\',this.value)"></label>';
    html+='<div class="rem-note">Seulement si la nuit précédente n’est pas notée.</div></div></details>';
    html+='<details class="rem-settings-group"><summary>😴 Rappel du coucher</summary><div class="rem-settings-content"><label class="rem-toggle rem-compact"><input type="checkbox" '+(r.bedtimeEnabled?'checked':'')+' onchange="setReminderFlag(\'bedtimeEnabled\',this.checked)"> Activer</label>';
    html+='<label class="rem-schedule-row"><span>Heure</span><input class="form-input rem-time" type="time" value="'+reminderTimeValue(r.bedtimeTime,'23:30')+'" onchange="setReminderClock(\'bedtimeTime\',this.value)"></label></div></details>';
    html+='<div class="rem-note rem-freeze-note">&#x2744; Toutes les notifications sont suspendues pendant les jours de gel.</div>';
  }
  el.innerHTML=html;
}
function toggleReminders(on){
  initReminders(); DB.reminders.enabled=on; saveDB();
  if(!on) updateWorkoutPushTimer(null);
  renderReminderSettings();
  try{ checkReminders(); }catch(e){}
}
function setReminderFlag(flag,val){ initReminders(); DB.reminders[flag]=val; saveDB(); try{checkReminders();}catch(e){} }
function setReminderClock(field,value){
  initReminders();
  if(['workoutNoonTime','workoutEveningTime','sleepLogTime','bedtimeTime'].indexOf(field)<0) return;
  DB.reminders[field]=reminderTimeValue(value,DB.reminders[field]||'08:30');
  saveDB();
}
function setHydrationTime(index,value){
  initReminders();
  if(!Number.isInteger(index)||index<0||index>=DB.reminders.hydrationTimes.length) return;
  DB.reminders.hydrationTimes=DB.reminders.hydrationTimes.slice();
  DB.reminders.hydrationTimes[index]=reminderTimeValue(value,DB.reminders.hydrationTimes[index]);
  saveDB();
}

// ══════════════════════════════════════════════════
// NUTRITION
// ══════════════════════════════════════════════════
var NUTRI_MEALS=[
  {key:'petit_dej',label:'Petit-déj',icon:'&#x1F950;'},
  {key:'dejeuner', label:'Déjeuner', icon:'&#x1F37D;&#xFE0F;'},
  {key:'diner',    label:'Dîner',    icon:'&#x1F319;'},
  {key:'shaker',   label:'Créatine',  icon:'&#x1F964;'}
];
function nutriGoal(){
  var p=DB.profile||{};
  return {kcal:p.kcalGoal||3100, prot:p.protGoal||140};
}
function getNutriDay(date){
  var d=DB.nutrition[date];
  if(!d){ d={kcal:null,prot:null,petit_dej:false,dejeuner:false,diner:false,shaker:false}; }
  return d;
}
function ensureNutriDay(date){
  if(!DB.nutrition[date]) DB.nutrition[date]={kcal:null,prot:null,petit_dej:false,dejeuner:false,diner:false,shaker:false};
  return DB.nutrition[date];
}
// Nettoie les jours totalement vides pour ne pas fausser les moyennes
function pruneNutriDay(date){
  var d=DB.nutrition[date]; if(!d) return;
  var empty=(d.kcal===null||d.kcal===undefined||d.kcal==='')&&(d.prot===null||d.prot===undefined||d.prot==='')
    &&!d.petit_dej&&!d.dejeuner&&!d.diner&&!d.shaker&&!d.maison&&!d.run&&!d.cardio;
  if(empty) delete DB.nutrition[date];
}
function nutriEntriesInWindow(days){
  var out=[]; var now=getNow();
  var cutoff=new Date(now.getFullYear(),now.getMonth(),now.getDate()-(days-1));
  Object.keys(DB.nutrition).forEach(function(dt){
    var d=new Date(dt+'T00:00:00');
    if(d>=cutoff && d<=now){ var e=DB.nutrition[dt]; out.push({date:dt,kcal:e.kcal,prot:e.prot,petit_dej:e.petit_dej,dejeuner:e.dejeuner,diner:e.diner,shaker:e.shaker}); }
  });
  out.sort(function(a,b){return a.date.localeCompare(b.date);});
  return out;
}
function setNutriKcal(input){
  var date=todayStr(); var d=ensureNutriDay(date);
  var v=parseInt(input.value,10);
  d.kcal=(isNaN(v)||v<0)?null:v;
  pruneNutriDay(date); saveDB();
  renderNutrition();
}
function setNutriProt(input){
  var date=todayStr(); var d=ensureNutriDay(date);
  var v=parseInt(input.value,10);
  d.prot=(isNaN(v)||v<0)?null:v;
  pruneNutriDay(date); saveDB();
  renderNutrition();
}
function toggleMeal(key){
  var date=todayStr(); var d=ensureNutriDay(date);
  d[key]=!d[key];
  pruneNutriDay(date); saveDB();
  renderNutrition();
  if(key==='shaker'){ try{ checkReminders(); }catch(e){} }
}
function editNutriGoal(){
  var g=nutriGoal();
  var nk=prompt('Objectif calories par jour (kcal) :', g.kcal);
  if(nk===null) return;
  var np=prompt('Objectif protéines par jour (g) :', g.prot);
  if(np===null) return;
  if(!DB.profile) DB.profile={};
  var vk=parseInt(nk,10), vp=parseInt(np,10);
  if(!isNaN(vk)&&vk>0) DB.profile.kcalGoal=vk;
  if(!isNaN(vp)&&vp>0) DB.profile.protGoal=vp;
  saveDB(); renderNutrition();
  showToast('&#x2705; Objectif mis à jour');
}
function renderNutrition(){
  var el=document.getElementById('nutritionContent'); if(!el) return;
  var date=todayStr();
  var d=getNutriDay(date);
  var g=nutriGoal();
  var kcal=(d.kcal===null||d.kcal===undefined)?0:d.kcal;
  var prot=(d.prot===null||d.prot===undefined)?0:d.prot;
  var kpct=g.kcal?Math.min(1,kcal/g.kcal):0;
  var ppct=g.prot?Math.min(1,prot/g.prot):0;
  var C=2*Math.PI*52;
  var off=C*(1-kpct);
  var over=g.kcal&&kcal>g.kcal*1.12;
  var ringCol=over?'#F4A261':(kcal>=g.kcal*0.85?'#71FFB4':'#4D9DFF');
  var remain=g.kcal-kcal;
  var centerSub= kcal===0?'à saisir':(remain>0?('reste '+remain):(remain===0?'pile !':('+'+Math.abs(remain))));

  var html='';
  // ── Widget principal : anneau calories ──
  html+='<div class="slbl" style="margin-bottom:.5rem;">Aujourd\'hui — '+formatDateFr(date)+'</div>';
  html+='<div class="nutri-hero chart-section">'
    +'<div class="nutri-ring-wrap">'
      +'<svg width="150" height="150" viewBox="0 0 120 120" class="nutri-ring">'
        +'<circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="9"/>'
        +'<circle cx="60" cy="60" r="52" fill="none" stroke="'+ringCol+'" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 60 60)"/>'
      +'</svg>'
      +'<div class="nutri-ring-center"><div class="nutri-ring-kcal">'+kcal+'</div><div class="nutri-ring-goal">/ '+g.kcal+' kcal</div><div class="nutri-ring-sub">'+centerSub+'</div></div>'
    +'</div>'
    +'<div class="nutri-hero-inputs">'
      +'<label class="nutri-in-lbl">Calories mangées aujourd\'hui</label>'
      +'<div class="nutri-in-row"><input class="nutri-input" type="number" inputmode="numeric" min="0" step="10" value="'+(d.kcal!==null&&d.kcal!==undefined?d.kcal:'')+'" placeholder="0" onblur="setNutriKcal(this)" onkeydown="if(event.key===\'Enter\')this.blur()"/><span class="nutri-in-unit">kcal</span></div>'
      +'<div class="nutri-prot-bar-wrap"><div class="nutri-prot-top"><span>Protéines</span><span>'+prot+' / '+g.prot+' g</span></div>'
        +'<div class="nutri-prot-bar"><div class="nutri-prot-fill" style="width:'+(ppct*100).toFixed(0)+'%"></div></div></div>'
      +'<div class="nutri-in-row" style="margin-top:.5rem;"><input class="nutri-input nutri-input-sm" type="number" inputmode="numeric" min="0" step="5" value="'+(d.prot!==null&&d.prot!==undefined?d.prot:'')+'" placeholder="0" onblur="setNutriProt(this)" onkeydown="if(event.key===\'Enter\')this.blur()"/><span class="nutri-in-unit">g prot. (optionnel)</span></div>'
    +'</div>'
  +'</div>';

  // ── Cochables du jour ──
  html+='<div class="slbl" style="margin-top:1.25rem;margin-bottom:.5rem;">Ma journée</div>';
  html+='<div class="nutri-meals">';
  NUTRI_MEALS.forEach(function(m){
    var on=!!d[m.key];
    html+='<button class="nutri-meal'+(on?' on':'')+'" onclick="toggleMeal(\''+m.key+'\')">'
      +'<span class="nutri-meal-ico">'+m.icon+'</span><span class="nutri-meal-lbl">'+m.label+'</span>'
      +'<span class="nutri-meal-check">'+(on?'&#x2713;':'')+'</span></button>';
  });
  html+='</div>';

  // ── Statistiques 30 jours ──
  var w30=nutriEntriesInWindow(30);
  var kcalDays=w30.filter(function(e){return e.kcal!==null&&e.kcal!==undefined&&e.kcal>0;});
  var avgKcal=kcalDays.length?Math.round(kcalDays.reduce(function(a,e){return a+e.kcal;},0)/kcalDays.length):0;
  var protDays=w30.filter(function(e){return e.prot!==null&&e.prot!==undefined&&e.prot>0;});
  var avgProt=protDays.length?Math.round(protDays.reduce(function(a,e){return a+e.prot;},0)/protDays.length):0;
  var shakerCount=w30.filter(function(e){return e.shaker;}).length;
  var shakerPerWeek=Math.round(shakerCount/(30/7)*10)/10;
  var pdjPris=w30.filter(function(e){return e.petit_dej;}).length;
  var pdjLoupe=w30.filter(function(e){return !e.petit_dej;}).length; // sur jours suivis
  html+='<div class="slbl" style="margin-top:1.25rem;margin-bottom:.5rem;">Moyennes · 30 derniers jours</div>';
  html+='<div class="nutri-stats">'
    +'<div class="nutri-stat"><div class="nutri-stat-val">'+avgKcal+'</div><div class="nutri-stat-lbl">kcal / jour</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val">'+(avgProt||'—')+'</div><div class="nutri-stat-lbl">g prot. / jour</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val">'+shakerPerWeek+'</div><div class="nutri-stat-lbl">cr&#xE9;atine / sem.</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val" style="color:var(--acc)">'+pdjPris+'</div><div class="nutri-stat-lbl">ptit-déj pris</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val" style="color:'+(pdjLoupe>0?'var(--red)':'var(--mut)')+'">'+pdjLoupe+'</div><div class="nutri-stat-lbl">ptit-déj loupés</div></div>'
    +'<div class="nutri-stat"><div class="nutri-stat-val">'+kcalDays.length+'</div><div class="nutri-stat-lbl">jours suivis</div></div>'
  +'</div>';

  // ── Bande 14 jours ──
  var w14=nutriEntriesInWindow(14);
  var byDate={}; w14.forEach(function(e){byDate[e.date]=e;});
  var bars='';
  var now=getNow();
  for(var i=13;i>=0;i--){
    var dd=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);
    var ds=dd.getFullYear()+'-'+String(dd.getMonth()+1).padStart(2,'0')+'-'+String(dd.getDate()).padStart(2,'0');
    var e=byDate[ds];
    var k=e&&e.kcal?e.kcal:0;
    var h=g.kcal?Math.max(4,Math.min(100,Math.round(k/g.kcal*100))):4;
    var col=k===0?'rgba(255,255,255,.08)':(k>g.kcal*1.12?'#F4A261':(k>=g.kcal*0.85?'#71FFB4':'#4D9DFF'));
    var sk=e&&e.shaker?'<span class="nutri-day-sk">&#x1F964;</span>':'';
    bars+='<div class="nutri-day" title="'+formatDateFr(ds)+' : '+(k||'—')+' kcal"><div class="nutri-day-bar-wrap"><div class="nutri-day-bar" style="height:'+h+'%;background:'+col+'"></div></div>'+sk+'<div class="nutri-day-lbl">'+dd.getDate()+'</div></div>';
  }
  html+='<div class="slbl" style="margin-top:1.25rem;margin-bottom:.5rem;">14 derniers jours</div>';
  html+='<div class="chart-section nutri-14"><div class="nutri-days">'+bars+'</div>'
    +'<div class="nutri-14-legend"><span><span class="nl-dot" style="background:#4D9DFF"></span>en dessous</span><span><span class="nl-dot" style="background:#71FFB4"></span>proche/atteint</span><span><span class="nl-dot" style="background:#F4A261"></span>dépassé</span></div></div>';

  // ── Objectif éditable ──
  html+='<div class="nutri-goal-edit" onclick="editNutriGoal()">&#x2699;&#xFE0F; Objectif : <strong>'+g.kcal+' kcal</strong> · <strong>'+g.prot+' g</strong> de protéines <span class="nutri-goal-chev">modifier</span></div>';
  html+='<div style="height:1.5rem"></div>';

  el.innerHTML=html;
}

function exportBackupJSON(){
  var blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(blob); var a=document.createElement('a');
  var d=new Date(); var stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  a.href=url; a.download='massup_backup_'+stamp+'.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  DB.profile.lastBackupTs=Date.now(); saveDB();
  showToast('\uD83D\uDCE6 Backup téléchargé');
}
// ── Merge NON destructif d'un snapshot complet (backup JSON OU user_state cloud) ──
// Le snapshot comble les trous, les données locales gagnent en cas de conflit.
// Utilisé par importBackupJSON() et par la synchro user_state (supabase.js).
function mergeBackupIntoDB(bk){
  if(!bk||typeof bk!=='object') return false;
  // Poids par exo : entrées du snapshot absentes en local (jamais celles supprimées localement)
  if(bk.weights){ Object.keys(bk.weights).forEach(function(k){
    if(!DB.weights[k]) DB.weights[k]=[];
    var delW=(DB.deletedWeights&&DB.deletedWeights[k])||[];
    (bk.weights[k]||[]).forEach(function(e){
      if(delW.indexOf(e.date)>=0) return; // tombstone
      if(!DB.weights[k].some(function(x){return x.date===e.date;})) DB.weights[k].push(e);
    });
    DB.weights[k].sort(function(a,b){return a.date<b.date?-1:1;});
  }); }
  if(bk.weightSetDate){ Object.keys(bk.weightSetDate).forEach(function(k){ if(!DB.weightSetDate[k]||DB.weightSetDate[k]<bk.weightSetDate[k]) DB.weightSetDate[k]=bk.weightSetDate[k]; }); }
  // Séances : un ID du snapshot absent en local est ajouté (sauf s'il a été supprimé localement)
  if(bk.logs){ bk.logs.forEach(function(l){
    if((DB.deletedLogs||[]).indexOf(String(l.id))>=0) return; // tombstone
    if(!(DB.logs||[]).some(function(x){return String(x.id)===String(l.id);})) DB.logs.push(l);
  }); DB.logs.sort(function(a,b){return b.date.localeCompare(a.date);}); }
  // Poids corporel / santé / journal poignet : merge par date (tombstones pesées respectées)
  ['bodyWeight','healthLogs','painLog'].forEach(function(key){
    if(!bk[key]) return; if(!DB[key]) DB[key]=[];
    var delBW=(key==='bodyWeight'||key==='healthLogs')?(DB.deletedBW||[]):[];
    bk[key].forEach(function(e){
      if(delBW.indexOf(e.date)>=0) return; // tombstone
      if(!DB[key].some(function(x){return x.date===e.date;})) DB[key].push(e);
    });
    DB[key].sort(function(a,b){return a.date<b.date?-1:1;});
  });
  if(bk.health){
    if(!DB.health) DB.health={};
    Object.keys(bk.health).forEach(function(d){
      var local=DB.health[d]||(DB.health[d]={});
      Object.keys(bk.health[d]||{}).forEach(function(k){ if(local[k]==null) local[k]=bk.health[d][k]; });
    });
  }
  if(bk.healthMeta){
    if(!DB.healthMeta) DB.healthMeta={};
    Object.keys(bk.healthMeta).forEach(function(k){ if(DB.healthMeta[k]==null) DB.healthMeta[k]=bk.healthMeta[k]; });
  }
  if(bk.sleepLog){
    if(!DB.sleepLog) DB.sleepLog={};
    Object.keys(bk.sleepLog).forEach(function(d){
      var local=DB.sleepLog[d]||(DB.sleepLog[d]={});
      Object.keys(bk.sleepLog[d]||{}).forEach(function(k){ if(local[k]===undefined) local[k]=bk.sleepLog[d][k]; });
    });
  }
  // Nutrition / détente : merge par jour
  ['nutrition','dz'].forEach(function(key){
    if(!bk[key]) return; if(!DB[key]) DB[key]={};
    Object.keys(bk[key]).forEach(function(d){ if(!DB[key][d]) DB[key][d]=bk[key][d]; });
  });
  // Mode NUTRITION masse (23/08) : journées par date + favoris en union
  if(bk.nutriA){
    if(!DB.nutriA) DB.nutriA={day:{},favs:[]};
    if(bk.nutriA.day){ if(!DB.nutriA.day) DB.nutriA.day={};
      Object.keys(bk.nutriA.day).forEach(function(d){ if(!DB.nutriA.day[d]) DB.nutriA.day[d]=bk.nutriA.day[d]; }); }
    if(bk.nutriA.favs){ if(!DB.nutriA.favs) DB.nutriA.favs=[];
      bk.nutriA.favs.forEach(function(f){ if(DB.nutriA.favs.indexOf(f)<0) DB.nutriA.favs.push(f); }); }
  }
  // Profil : le snapshot ne remplace que ce qui est vide localement
  if(bk.profile){ Object.keys(bk.profile).forEach(function(k){ if(DB.profile[k]===undefined||DB.profile[k]===''||DB.profile[k]===0) DB.profile[k]=bk.profile[k]; }); }
  if(bk.reminders&&!DB.reminders) DB.reminders=bk.reminders;
  // Rank : merge fin (pauses / déclarations hebdo / snapshots mensuels)
  if(bk.rank){
    if(!DB.rank) DB.rank={pauses:[]};
    if(bk.rank.pauses&&bk.rank.pauses.length&&(!DB.rank.pauses||!DB.rank.pauses.length)) DB.rank.pauses=bk.rank.pauses;
    if(bk.rank.weekly){ if(!DB.rank.weekly) DB.rank.weekly={};
      Object.keys(bk.rank.weekly).forEach(function(w){ if(!DB.rank.weekly[w]) DB.rank.weekly[w]=bk.rank.weekly[w]; }); }
    if(bk.rank.ladderSnaps){ if(!DB.rank.ladderSnaps) DB.rank.ladderSnaps={};
      Object.keys(bk.rank.ladderSnaps).forEach(function(m){ if(DB.rank.ladderSnaps[m]==null) DB.rank.ladderSnaps[m]=bk.rank.ladderSnaps[m]; }); }
  }
  // Perfs retirées des classements (01/11) : par exo et par séance, la décision la plus récente gagne
  // (un « remettre » plus récent n'est jamais écrasé par un vieux « retirer », et inversement)
  if(bk.recHidden){
    if(!DB.recHidden) DB.recHidden={};
    Object.keys(bk.recHidden).forEach(function(k){
      var loc=DB.recHidden[k]||(DB.recHidden[k]={}), rem=bk.recHidden[k]||{};
      Object.keys(rem).forEach(function(id){ if(!loc[id]||(rem[id]&&rem[id].at>(loc[id].at||0))) loc[id]=rem[id]; });
    });
  }
  // Notes gravées (03/11) : union par semaine ; à semaine égale, la PREMIÈRE gravure gagne (une note gravée ne change jamais)
  if(bk.noteGrav){
    if(!DB.noteGrav) DB.noteGrav={};
    Object.keys(bk.noteGrav).forEach(function(w){
      var r=bk.noteGrav[w], l=DB.noteGrav[w];
      if(!r||r.note==null) return;
      var rOk=noteGravValid(w,r), lOk=noteGravValid(w,l);
      if(rOk&&(!lOk||(r.at||0)<(l.at||0))) DB.noteGrav[w]=r;
    });
  }
  // Mensurations (02/11) : par date, l'entrée la plus récente gagne — une suppression ({del:1}) comprise
  if(bk.bodyMeas){
    if(!DB.bodyMeas) DB.bodyMeas={};
    Object.keys(bk.bodyMeas).forEach(function(d){
      var r=bk.bodyMeas[d], l=DB.bodyMeas[d];
      if(r&&(!l||(r.at||0)>(l.at||0))) DB.bodyMeas[d]=r;
    });
  }
  if(bk.templates&&bk.templates.length&&(!DB.templates||!DB.templates.length)) DB.templates=bk.templates;
  if(bk.deletedWeights&&!Object.keys(DB.deletedWeights||{}).length) DB.deletedWeights=bk.deletedWeights;
  if(bk.prepared&&!DB.prepared) DB.prepared=bk.prepared;
  return true;
}

// Après une fusion avec le cloud en cours d'utilisation : redessiner l'écran ouvert (jamais pendant
// une séance LiveUp, qui a son propre état) et le dire.
function refreshAfterCloudMerge(){
  if(typeof AS!=='undefined'&&AS) return;
  var b=document.querySelector('.bni.active');
  if(b) switchView(_currentView,b);
  showToast('🔄 Synchronisé avec ton autre appareil');
}

// La base locale est-elle « vierge » (fraîche après une purge Safari) ?
// Si oui, le snapshot cloud est adopté en bloc au lieu d'un merge champ à champ.
function isLocalDBVirgin(){
  return !(DB.logs&&DB.logs.length)&&!(DB.profile&&DB.profile.name)&&!(DB.painLog&&DB.painLog.length);
}

// Reconstruction du journal poignet depuis le détail cloud des séances (11/08) :
// chaque séance LiveUp synchronisée porte live.pain/painNote → si l'entrée
// painLog du jour manque (base locale purgée), on la recrée. Idempotent.
function rebuildPainLogFromLive(){
  if(!DB.painLog) DB.painLog=[];
  var added=false;
  (DB.logs||[]).forEach(function(l){
    if(!l.live||l.live.pain===null||l.live.pain===undefined||!l.date) return;
    if(DB.painLog.some(function(p){return p.date===l.date;})) return;
    DB.painLog.push({date:l.date,level:l.live.pain,note:l.live.painNote||''});
    added=true;
  });
  if(added){ DB.painLog.sort(function(a,b){return a.date.localeCompare(b.date);}); saveDB(); }
}

// Import backup JSON (11/08) — restaure un fichier massup_backup_*.json.
// Merge NON destructif : le backup comble les trous, les données locales plus
// récentes gagnent. Couvre surtout ce que le cloud ne sauvegarde pas
// (profil, journal poignet, nutrition, pauses rank, templates, détente).
function importBackupJSON(){
  var input=document.createElement('input');
  input.type='file'; input.accept='.json,application/json';
  input.onchange=function(){
    var f=input.files&&input.files[0]; if(!f) return;
    var reader=new FileReader();
    reader.onload=function(){
      try{
        var bk=JSON.parse(reader.result);
        if(!bk||typeof bk!=='object'||(!bk.weights&&!bk.logs&&!bk.profile)){ showToast('❌ Fichier invalide — pas un backup MASSUP'); return; }
        mergeBackupIntoDB(bk);
        saveDB(); _flushSaveDB();
        showToast('📦 Backup restauré — '+(bk.logs?bk.logs.length:0)+' séances dans le fichier');
        setTimeout(function(){ location.reload(); },900);
      }catch(e){ showToast('❌ Impossible de lire ce fichier'); }
    };
    reader.readAsText(f);
  };
  input.click();
}


// ══════════════════════════════════════════════════
// EXPORT CSV
// ══════════════════════════════════════════════════
function downloadCSV(filename, content){
  var blob=new Blob(['\uFEFF'+content],{type:'text/csv;charset=utf-8;'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url; a.download=filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function exportSeancesCSV(){
  var rows=['Date,Heure,S\u00e9ances,Dur\u00e9e (min),\u00c9nergie,Ressenti,Commentaire'];
  DB.logs.slice().reverse().forEach(function(l){
    var snames=l.sessions.map(function(sid){
      if(sid.indexOf('autre:')===0) return sid.replace('autre:','');
      if(sid.indexOf('exo:')===0) return getExoName(sid.replace('exo:',''));
      var s=DATA.find(function(x){return x.id===sid;}); return s?s.name:sid;
    }).join(' + ');
    rows.push([l.date,l.time||'','"'+snames+'"',l.duration_min||'',l.energy||'',l.feeling||'','"'+(l.comment||'').replace(/"/g,'""')+'"'].join(','));
  });
  downloadCSV('massup_seances.csv',rows.join('\n'));
  showToast('&#x1F4E5; Export séances téléchargé');
}

function exportPoidsCSV(){
  var bwt=getProfileBodyWeight();
  var p=DB.profile||{};
  var goalMap={masse:'Prise de masse',force:'Force',seche:'Seche',maintien:'Maintien'};
  var sep=',';
  function cell(v){ v=(v===undefined||v===null)?'':String(v); return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }
  function line(arr){ return arr.map(cell).join(sep); }

  // Ordre logique : exos des 4 séances, puis extras, puis le reste
  var order=[], seen={};
  DATA.forEach(function(s){ s.exos.forEach(function(e){ if(!seen[e.key]){ seen[e.key]=1; order.push(e.key); } }); });
  if(typeof EXTRAS!=='undefined') EXTRAS.forEach(function(e){ if(!seen[e.key]){ seen[e.key]=1; order.push(e.key); } });
  Object.keys(DB.weights).forEach(function(k){ if(!seen[k]){ seen[k]=1; order.push(k); } });

  var rows=[];
  // En-tête contextuel pour le coach
  rows.push(line(['MASSUP - Suivi force & poids']));
  rows.push(line(['Poids de corps', bwt?Math.round(bwt)+' kg':'non renseigne']));
  rows.push(line(['Age', (p.age||DEFAULT_AGE)+' ans']));
  rows.push(line(['Objectif', goalMap[p.goal]||'-']));
  rows.push(line(['Date export', todayStr()]));
  rows.push(line(['Note', 'Reperes = estimation indicative selon le poids de corps (machines variables)']));
  rows.push('');
  rows.push(line(['Exercice','Poids actuel','Unite','Derniere modif','Jours sans hausse','Niveau','Statut vs profil','Repere debutant','Repere intermediaire','Repere avance']));

  rows[rows.length-1]=line(['Exercice','Poids depart','1ere date','Poids actuel','Progression','%','Unite','Derniere modif','Jours sans hausse','Niveau','Statut vs profil','Repere debutant','Repere intermediaire','Repere avance']);

  order.forEach(function(key){
    var arr=DB.weights[key]; if(!arr||!arr.length) return;
    var w=getCurrentWeight(key);
    var startVal=arr[0].val, startDate=arr[0].date;
    // Exos assistés : moins d'assistance = progression POSITIVE (bug −56 % corrigé le 14/08)
    var _inv=asIsInverse(key);
    var delta=Math.round((_inv?startVal-w:w-startVal)*10)/10;
    var pct=startVal>0?Math.round(delta/startVal*100):0;
    var std=STRENGTH_STD[key];
    var unit=(std&&std.perHand)?'kg/main':'kg';
    var lastDate=DB.weightSetDate[key]||(arr[arr.length-1]&&arr[arr.length-1].date)||'';
    var days=getDaysSinceWeightChange(key);
    var level='', status='', begK='', intK='', advK='';
    if(std&&bwt){
      begK=Math.round(std.beg*bwt); intK=Math.round(std.int*bwt); advK=Math.round(std.adv*bwt);
      if(w>=advK) level='Avance'; else if(w>=intK) level='Intermediaire'; else if(w>=begK) level='Novice'; else level='Debutant';
      var ratio=intK?w/intK:1;
      status= ratio>=1.10?'En avance':ratio>=0.90?'Dans la moyenne':'A rattraper';
    }
    rows.push(line([getExoName(key)+(_inv?' (assistance : moins = mieux)':''),startVal,startDate,w,(delta>0?'+':'')+delta,(pct>0?'+':'')+pct+'%',unit,lastDate,days,level,status,begK,intK,advK]));
  });
  downloadCSV('massup_poids_force.csv',rows.join('\n'));
  showToast('&#x1F4E5; Export poids + repères téléchargé');
}


// Export complet "coach" — tout dans un seul fichier, sections multiples
// ── DOSSIER COACH (Excel) — refonte du 12/10/2026, demande Adrien : « le .md est un enfer, pas de
// nourriture, un max d'infos mais bien monté, plutôt Excel ». Lu ensuite par un agent Claude coach.
// Un classeur .xlsx (généré ici, sans librairie ni réseau) : un onglet « Lisez-moi » qui explique tout,
// une « Synthèse » chiffrée, puis une table propre par sujet (1 ligne = 1 enregistrement, 1 en-tête,
// dates ISO, nombres en nombres). AUCUNE donnée nutrition (décision Adrien). Les clés internes
// orphelines (anciennes séances) et les objectifs de saison 1 (affichage coupé) sont exclus.
function exportCoachCSV(){ exportCoachDossier(); }
var XLSX_LITE=(function(){
  var CRC=null;
  function crc32(b){
    if(!CRC){ CRC=[]; for(var n=0;n<256;n++){ var c=n; for(var k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; CRC[n]=c>>>0; } }
    var x=0xFFFFFFFF; for(var i=0;i<b.length;i++) x=CRC[(x^b[i])&255]^(x>>>8); return (x^0xFFFFFFFF)>>>0;
  }
  // ZIP « stocké » (sans compression) : suffisant pour un classeur de quelques centaines de Ko
  function zip(files){
    var enc=new TextEncoder(), parts=[], central=[], off=0;
    files.forEach(function(f){
      var nm=enc.encode(f.name), d=enc.encode(f.data), crc=crc32(d);
      var h=new DataView(new ArrayBuffer(30));
      h.setUint32(0,0x04034b50,true); h.setUint16(4,20,true); h.setUint16(6,0x0800,true);
      h.setUint16(12,0x21,true); h.setUint32(14,crc,true); h.setUint32(18,d.length,true); h.setUint32(22,d.length,true); h.setUint16(26,nm.length,true);
      parts.push(new Uint8Array(h.buffer),nm,d);
      var c=new DataView(new ArrayBuffer(46));
      c.setUint32(0,0x02014b50,true); c.setUint16(4,20,true); c.setUint16(6,20,true); c.setUint16(8,0x0800,true);
      c.setUint16(14,0x21,true); c.setUint32(16,crc,true); c.setUint32(20,d.length,true); c.setUint32(24,d.length,true); c.setUint16(28,nm.length,true); c.setUint32(42,off,true);
      central.push(new Uint8Array(c.buffer),nm);
      off+=30+nm.length+d.length;
    });
    var size=central.reduce(function(s,p){return s+p.length;},0);
    var e=new DataView(new ArrayBuffer(22));
    e.setUint32(0,0x06054b50,true); e.setUint16(8,files.length,true); e.setUint16(10,files.length,true); e.setUint32(12,size,true); e.setUint32(16,off,true);
    return parts.concat(central,[new Uint8Array(e.buffer)]);
  }
  function esc(v){ return String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function col(i){ var s=''; i++; while(i>0){ var m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=Math.floor((i-1)/26); } return s; }
  function cell(v,r,c,style){
    if(v===null||v===undefined||v==='') return '';
    var ref=col(c)+r, s=style?' s="'+style+'"':'';
    if(typeof v==='number'&&isFinite(v)) return '<c r="'+ref+'"'+s+'><v>'+v+'</v></c>';
    if(typeof v==='boolean') v=v?'oui':'non';
    return '<c r="'+ref+'"'+s+' t="inlineStr"><is><t xml:space="preserve">'+esc(v)+'</t></is></c>';
  }
  // sheet = {name, cols:[{h, w, wrap}], rows:[[...]]}
  function sheetXml(sh){
    var x='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
      +'<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>';
    sh.cols.forEach(function(c,i){ x+='<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+(c.w||14)+'" customWidth="1"/>'; });
    x+='</cols><sheetData><row r="1">'+sh.cols.map(function(c,i){ return cell(c.h,1,i,1); }).join('')+'</row>';
    sh.rows.forEach(function(row,ri){
      x+='<row r="'+(ri+2)+'">'+row.map(function(v,ci){ return cell(v,ri+2,ci,sh.cols[ci]&&sh.cols[ci].wrap?2:0); }).join('')+'</row>';
    });
    x+='</sheetData>';
    if(sh.rows.length&&!sh.noFilter) x+='<autoFilter ref="A1:'+col(sh.cols.length-1)+(sh.rows.length+1)+'"/>';
    return x+'</worksheet>';
  }
  function build(sheets){
    var files=[], ns='http://schemas.openxmlformats.org/';
    files.push({name:'[Content_Types].xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="'+ns+'package/2006/content-types">'
      +'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
      +'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
      +'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
      +sheets.map(function(s,i){ return '<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('')+'</Types>'});
    files.push({name:'_rels/.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="'+ns+'package/2006/relationships"><Relationship Id="rId1" Type="'+ns+'officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'});
    var defs=sheets.map(function(s,i){ return (s.rows.length&&!s.noFilter)?'<definedName name="_xlnm._FilterDatabase" localSheetId="'+i+'" hidden="1">\''+esc(s.name)+'\'!$A$1:$'+col(s.cols.length-1)+'$'+(s.rows.length+1)+'</definedName>':''; }).join('');
    files.push({name:'xl/workbook.xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="'+ns+'spreadsheetml/2006/main" xmlns:r="'+ns+'officeDocument/2006/relationships"><sheets>'
      +sheets.map(function(s,i){ return '<sheet name="'+esc(s.name)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>'; }).join('')+'</sheets>'+(defs?'<definedNames>'+defs+'</definedNames>':'')+'</workbook>'});
    files.push({name:'xl/_rels/workbook.xml.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="'+ns+'package/2006/relationships">'
      +sheets.map(function(s,i){ return '<Relationship Id="rId'+(i+1)+'" Type="'+ns+'officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>'; }).join('')
      +'<Relationship Id="rId'+(sheets.length+1)+'" Type="'+ns+'officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'});
    files.push({name:'xl/styles.xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="'+ns+'spreadsheetml/2006/main">'
      +'<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
      +'<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDCE8F5"/><bgColor indexed="64"/></patternFill></fill></fills>'
      +'<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
      +'<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
      +'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>'
      +'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs>'
      +'<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'});
    sheets.forEach(function(s,i){ files.push({name:'xl/worksheets/sheet'+(i+1)+'.xml',data:sheetXml(s)}); });
    return new Blob(zip(files),{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  return {build:build};
})();

// Pas d'un jour pour l'export : la même lecture que l'app (Santé, sinon saisie à la main) — 04/11
function stepsAt(d){
  if(typeof STEPS!=='undefined'&&STEPS.stepsOf) return STEPS.stepsOf(d);
  var h=DB.health&&DB.health[d]; return h?(h.steps!=null?h.steps:(h.ms!=null?h.ms:null)):null;
}
function exportCoachDossier(opts){
  opts=opts||{};
  var _dec=document.createElement('textarea');
  function txt(v){ if(v===undefined||v===null) return ''; _dec.innerHTML=String(v).replace(/<[^>]*>/g,''); return _dec.value.trim(); }
  function r1(x){ return x==null||!isFinite(x)?null:Math.round(x*10)/10; }
  function r2(x){ return x==null||!isFinite(x)?null:Math.round(x*100)/100; }
  function avg(a){ return a.length?a.reduce(function(s,x){return s+x;},0)/a.length:null; }
  var JOURS=['dim','lun','mar','mer','jeu','ven','sam'];
  function jour(d){ return JOURS[new Date(d+'T12:00:00').getDay()]; }
  var today=todayStr(), p=DB.profile||{}, d30=rankAddDays(today,-30);
  var logs=(DB.logs||[]).slice().sort(function(a,b){return a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||'');});
  var bw=(DB.bodyWeight||[]).slice().sort(function(a,b){return a.date.localeCompare(b.date);});
  // Exos connus du programme (clé → définition + séance) ; les clés orphelines sont ignorées
  var EXO={}, ORDER=[];
  DATA.forEach(function(s){ s.exos.forEach(function(e){ if(!EXO[e.key]){ EXO[e.key]={e:e,s:s}; ORDER.push(e.key); } }); });
  function name(k){ return txt(EXO[k]?EXO[k].e.name:getExoName(k)); }
  function group(k){ var g=rankGroupOf(k); if(g) return g; var c=EXO[k]&&EXO[k].e.cat; return c==='cardio'?'Cardio':c==='corps'?'Corps':c==='abdo'?'Abdos':''; }
  function unitOf(k,x){ return (x&&x.unite)||(EXO[k]&&EXO[k].e.unite)||'kg'; }
  function isLoad(k,x){ var u=unitOf(k,x), d=EXO[k]&&EXO[k].e; return /kg/.test(u)&&!(d&&d.repTarget)&&!asIsInverse(k); }
  function e1rm(w,reps){ return (w>0&&reps>0&&reps<=20)?w*(1+reps/30):null; }
  function sessionLabel(l){
    if(l.sport) return l.sport==='course'?'Course':'Autre sport';
    var names=[], exoOnly=true;
    (l.sessions||[]).forEach(function(sid){
      if(sid.indexOf('exo:')===0) return;
      exoOnly=false;
      if(sid.indexOf('autre:')===0){ names.push(txt(sid.slice(6))); return; }
      var s=DATA.find(function(x){return x.id===sid;}); names.push(s?txt(s.name):sid);
    });
    return names.length?names.join(' + '):(exoOnly?'À la carte':'');
  }
  function sessionSource(l){ return l.live?'LiveUp (série par série)':/Reconstitu/i.test(l.comment||'')?'Reconstituée (après la perte de données du 11/08)':'Saisie manuelle'; }
  function exoStatus(x){
    var c=false; try{ c=liveExoCounted(x); }catch(e){}
    if(x.pain) return 'arrêt douleur';
    if(x.status==='done') return 'fait';
    if(x.status==='skipped') return c?'écourté (compté)':'passé';
    return 'non fait';
  }
  function hardSetsLog(l){ var v={}; if(!l.live||!l.live.exos) return v;
    l.live.exos.forEach(function(x){ var c=false; try{ c=liveExoCounted(x); }catch(e){} if(!c&&!(liveExoSide(x)&&(x.sets||[]).length)) return; volAddSets(v,x.key,(x.sets||[]).length); });
    return v; }
  function logTonnage(l){ var t=0; ((l.live&&l.live.exos)||[]).forEach(function(x){ (x.sets||[]).forEach(function(s){ var w=s.w!=null?s.w:x.w; if(isLoad(x.key,x)&&w&&s.reps) t+=w*s.reps; }); }); return t; }
  var CTX={temps:'manque de temps',blessure:'blessure / douleur',energie:'énergie / sommeil',malade:'malade'};
  var GROUPS=RADAR_GROUPS.map(function(g){return g.label;});
  var sheets=[];

  // ── Séries (calculées d'abord : elles alimentent Exercices et Synthèse) ──
  var setRows=[], exoStats={};
  logs.forEach(function(l){
    if(!l.live||!l.live.exos) return;
    var lbl=sessionLabel(l);
    l.live.exos.forEach(function(x,xi){
      if(!x.sets||!x.sets.length) return;
      var k=x.key, u=unitOf(k,x), cu=cntU(x), load=isLoad(k,x), inv=asIsInverse(k), counted=false, sc=null;
      try{ counted=liveExoCounted(x); }catch(e){}
      try{ sc=asScoreExo(x); }catch(e){}
      var st=exoStats[k]||(exoStats[k]={n:0,n30:0,last:null,best:null,bestDate:null,bestSet:''});
      if(counted){ st.n++; if(l.date>=d30) st.n30++; if(!st.last||l.date>st.last) st.last=l.date; }
      var xn=x.n||x.sets.length;
      x.sets.forEach(function(s,si){
        var w=s.w!=null?s.w:x.w, est=load?e1rm(w,s.reps):null;
        var pos=si+1>xn?'bonus':si===0&&xn>1?'série 1':si+1===xn?'dernière':'intermédiaire';
        var goal=fsGoal(x,si+1);
        if(est!=null&&(!st.best||est>st.best)){ st.best=est; st.bestDate=l.date; st.bestSet=w+' × '+s.reps; }
        setRows.push([l.date,jour(l.date),lbl,xi+1,name(k),group(k),liveExoSide(x)?'bonus':'principal',exoStatus(x),counted,sc,si+1,
          w,u,inv,s.reps,cu,x.reps,(s.reps!=null&&x.reps!=null)?s.reps-x.reps:null,s.feel||'',s.feelG||'',s.feelD||'',x.w0!=null?x.w0:null,r1(est),
          pos,x.rHi||null,goal||'']);
      });
    });
  });

  // ── Lisez-moi ──
  var last=bw.length?bw[bw.length-1]:null;
  var readme=[
    ['Qui','Adrien, '+(p.age||DEFAULT_AGE)+' ans, '+(p.height||172)+' cm, ectomorphe. Musculation depuis le 28/02/2026, salle à 1 min, séances tôt le matin depuis le 27/10/2026 (avant : le soir). Objectif '+getWeekGoal()+' séances de salle par semaine.'],
    ['Phase actuelle','Fin de prise de masse « propre » jusqu\'au 3 janvier 2027 : poids stable (73-74 kg max), on garde et on pousse la force.'],
    ['Phase suivante','Sèche du lundi 4 janvier au 1er juin 2027 : cible ~12 % de gras (~68 kg), 3 séances de muscu + 1 course par semaine, charges lourdes conservées.'],
    ['Poids','Départ '+(bw[0]?bw[0].weight_kg+' kg le '+bw[0].date:'?')+' · dernier '+(last?last.weight_kg+' kg le '+last.date:'?')+'. Composition (borne de salle, 31/08/2026, conditions non standardisées) : 21,3 % de gras affiché (fourchette réaliste 17-22 %), jambes à 97 % de la norme, bras au-dessus.'],
    ['Blessures','Poignet gauche : ancienne fracture de la styloïde ulnaire → prises neutres, pas de supination jusqu\'à ~novembre 2026. Genou : douleur en flexion chargée par épisodes. Coude gauche : douleur interne signalée fin septembre / début octobre. Détail daté : onglet Douleurs.'],
    ['Programme','Rotation PUSH / PULL / LEGS + exos « à la carte ». Règles de l\'app : depuis le 27/10/2026, 1 exo jambes (PUSH/PULL) et 1 exo abdo ne sont obligatoires que si la séance précédente n\'en avait pas (exo du jour alors principal) ; 5 exos minimum. Détail : onglet Exercices.'],
    ['Nutrition','Depuis le 02/11/2026 : totaux du jour notés dans Yazio (via l\'app Santé), onglet « Nutrition ». Un jour absent = rien noté dans Yazio ce jour-là (Adrien ne l\'a pas utilisé tous les jours avant fin octobre 2026). Objectifs : 3 000 kcal et 410 g de glucides depuis le 06/11 (avant : 2 900 kcal, 360 g), 150 g protéines, lipides ~70 g (80 max). Les recettes du module nutrition de l\'app ne sont pas exportées.'],
    ['Charges','En kg. Haltères : kg par main (« kg/main », « kg/côté »). Exos au poids du corps ou en temps : la « charge » est l\'objectif (reps, s, min).'],
    ['Assistance','Traction assistée et Dips assistée : la charge est l\'ASSISTANCE de la machine → moins = plus fort (colonne « Assistance (moins = mieux) »).'],
    ['Ressenti','Par série : facile = 4 reps ou plus en réserve · ok = 2-3 en réserve · dur = 1 en réserve · echec = plus une seule possible. Un raté se lit dans « Écart cible » < 0.'],
    ['Système de charge (28/10/2026)','Même charge sur toutes les séries, 1-2 séries d\'échauffement non comptées. Chaque exo a une fourchette (ex. 8-10). Consigne par série : série 1 = ok, séries intermédiaires = dur, dernière = echec (max de reps) ; à charge égale, la fatigue fait passer de ok à dur. La charge monte d\'un cran quand TOUTES les séries atteignent le haut de la fourchette (ex. 10-10-10-11 en 8-10) sans échec en série 1 ni 2 ; série 1 en échec sous le bas = charge trop lourde. « Cible » = bas de la fourchette. Indicateur clé : % de séries 1 en échec (cible < 10 %).'],
    ['Note /20','Note de séance calculée par l\'app sur l\'exécution des exos principaux (séries faites, reps vs cible, charge vs référence). Note /5 = même chose par exercice. Depuis le 28/10/2026 : seule la série 1 en échec coûte (exo plafonné à 4/5) ; la dernière série, menée au max, compte pleine. Les notes /20 déjà enregistrées ne changent jamais.'],
    ['Note de semaine','Note de l\'app : assiduité, exécution, objectifs hebdo de l\'app (dont des objectifs non sportifs) et pas. Pour le sport seul, lire « Exécution moyenne ».'],
    ['Séries dures','Séries comptées par muscle (1 par série + 0,5 pour le muscle assistant des polyarticulaires). Repère de l\'app par muscle et par semaine : sous 12 rouge, 12-15 gris, 16-19 bleu, 20+ gold, plus de 25 = rendements décroissants (abdos jusqu\'à fin janvier 2027 : sous 8 rouge, 8 gris, 12 bleu, 16 gold).'],
    ['e1RM','Force estimée par série (Epley : charge × (1 + reps / 30)), seulement pour les exos chargés en kg (pas les assistances).'],
    ['Séances anciennes','Février → avril : séances RITM / escalade notées sans détail. Juin → juillet : séances reconstituées après une perte de données (dates approximatives, pas de détail). Détail série par série fiable à partir du 01/08/2026.'],
    ['Onglets','Synthèse · Semaines · Calendrier (1 ligne par jour : séance, note, pas, nutrition, sommeil, poids) · Séances · Séries · Exercices · Historique charges · Poids · Course & sports · Pas · Nutrition · Sommeil · Douleurs · Mobilité.'],
    ['Généré le',today+' depuis l\'app MASSUP (données saisies au jour le jour).']
  ];
  sheets.push({name:'Lisez-moi',noFilter:true,cols:[{h:'Rubrique',w:20},{h:'Contenu',w:120,wrap:true}],rows:readme});

  // ── Synthèse ──
  var S=[];
  function add(ind,val,unit,per,det){ S.push([ind,val,unit||'',per||'',det||'']); }
  if(last){
    var at=function(n){ var lim=rankAddDays(today,-n), v=null; bw.forEach(function(b){ if(b.date<=lim) v=b; }); return v; };
    add('Poids actuel',last.weight_kg,'kg','pesée du '+last.date);
    [30,90].forEach(function(n){ var b=at(n); if(b) add('Variation de poids',r1(last.weight_kg-b.weight_kg),'kg',n+' jours','depuis '+b.weight_kg+' kg le '+b.date); });
    if(bw.length) add('Variation depuis le départ',r1(last.weight_kg-bw[0].weight_kg),'kg','depuis le '+bw[0].date);
  }
  var curMon=rankMonday(today), weeksBack=[];
  for(var i=8;i>=1;i--) weeksBack.push(rankAddDays(curMon,-7*i));
  var wv=weeksBack.map(function(ws){ var we=rankAddDays(ws,6); return weekValue(logs.filter(function(l){return l.date>=ws&&l.date<=we;})); });
  add('Séances de salle par semaine',r1(avg(wv)),'séances','8 dernières semaines closes','objectif '+getWeekGoal()+' · détail : '+wv.join(' / '));
  var n30=logs.filter(function(l){return l.date>=d30;}).map(liveLogNote20).filter(function(n){return n!=null;});
  if(n30.length) add('Note moyenne de séance',r1(avg(n30)),'/20','30 jours',n30.length+' séances notées');
  var dur30=logs.filter(function(l){return l.date>=d30&&l.live&&l.duration_min&&l.duration_min<200;}).map(function(l){return l.duration_min;});
  if(dur30.length) add('Durée moyenne de séance',Math.round(avg(dur30)),'min','30 jours');
  var vol4=muscleVolume(rankAddDays(curMon,-28),rankAddDays(curMon,-1));
  GROUPS.forEach(function(g){ add('Séries dures / semaine — '+g,r1((vol4[g]||0)/4),'séries','moyenne des 4 dernières semaines closes','repère : sous 12 rouge, 12 gris, 16 bleu, 20 gold (abdos jusqu\'à février : 8 / 12 / 16)'); });
  var s30=setRows.filter(function(r){return r[0]>=d30;}), sp30=s30.filter(function(r){return r[6]==='principal';});
  if(sp30.length){
    add('Séries des exos principaux',sp30.length,'séries','30 jours');
    add('Séries principales sous la cible',Math.round(sp30.filter(function(r){return r[17]!=null&&r[17]<0;}).length/sp30.length*100),'%','30 jours','reps faites < reps visées');
    add('Séries principales notées « echec »',Math.round(sp30.filter(function(r){return r[18]==='echec';}).length/sp30.length*100),'%','30 jours','muscle au bout en fin de série');
    // Système « une seule charge » (28/10) : l'échec se garde pour la DERNIÈRE série — cible < 10 %
    var s1=sp30.filter(function(r){return r[23]==='série 1';}), nl=sp30.filter(function(r){return r[23]==='série 1'||r[23]==='intermédiaire';});
    if(s1.length) add('% de séries 1 en échec',Math.round(s1.filter(function(r){return r[18]==='echec';}).length/s1.length*100),'%','30 jours','cible < 10 % · '+s1.length+' séries 1 (charge mal choisie si échec)');
    if(nl.length) add('% de séries en échec hors dernière série',Math.round(nl.filter(function(r){return r[18]==='echec';}).length/nl.length*100),'%','30 jours','repère (un échec en série 2 bloque aussi la hausse) · '+nl.length+' séries avant la dernière');
    add('Séries principales notées « facile »',Math.round(sp30.filter(function(r){return r[18]==='facile';}).length/sp30.length*100),'%','30 jours');
  }
  var ups=[], stag=[];
  ORDER.forEach(function(k){
    var a=DB.weights[k]; if(!a||!a.length||EXO[k].e.hidden) return;
    var cur=a[a.length-1], prev=null; a.forEach(function(e){ if(e.date<d30) prev=e; });
    if(prev&&cur.val!==prev.val&&(asIsInverse(k)?cur.val<prev.val:cur.val>prev.val)) ups.push(name(k)+' '+prev.val+' → '+cur.val);
    var lcS=loadCount(k); if(lcS&&lcS.ratio>=1&&exoStats[k]&&exoStats[k].n30) stag.push(name(k)+' ('+lcS.doneTxt+'/'+lcS.target+' séries à '+lcS.w+(lcS.lvl!=null?'×'+lcS.lvl:'')+')');
  });
  add('Charges de référence en hausse',ups.length,'exercices','30 jours',ups.join(' · '));
  add('Exercices stagnants (objectif de séries à la charge actuelle dépassé — 8 à 20 séances selon la taille du cran, encore pratiqués)',stag.length,'exercices','',stag.join(' · '));
  var ev=FEATURE_EVO?Object.keys(DB.evolution||{}).filter(function(k){return EXO[k];}):[];
  if(ev.length) add('Évolutions de charge en cours',ev.length,'exercices','',ev.map(function(k){var e=DB.evolution[k]; return name(k)+' '+e.from+' → '+e.to+' ('+e.hi+' série(s) au poids haut)';}).join(' · '));
  var st=[]; for(var j=1;j<=30;j++){ var sv=stepsAt(rankAddDays(today,-j)); if(sv) st.push(sv); }
  if(st.length) add('Pas moyens par jour',Math.round(avg(st)),'pas','30 jours',st.length+' jours renseignés');
  var sl=[]; Object.keys(DB.sleepLog||{}).forEach(function(n){ if(n>=d30){ var m=sleepMinutes(DB.sleepLog[n]); if(m) sl.push(m); } });
  if(sl.length) add('Sommeil moyen',r1(avg(sl)/60),'h','30 jours',sl.length+' nuits renseignées');
  var runs=logs.filter(function(l){return l.sport==='course'&&l.run;});
  add('Courses enregistrées',runs.length,'sorties','depuis le 12/10/2026',runs.length?r1(runs.reduce(function(s,l){return s+(l.run.km||0);},0))+' km au total':'objectif 1 par semaine');
  sheets.push({name:'Synthèse',cols:[{h:'Indicateur',w:52},{h:'Valeur',w:10},{h:'Unité',w:12},{h:'Période',w:34},{h:'Détail',w:90,wrap:true}],rows:S});

  // ── Semaines ──
  var firstLog=logs.length?logs[0].date:today, W=[];
  for(var ws=rankMonday(firstLog); ws<=curMon; ws=rankAddDays(ws,7)){
    var we=rankAddDays(ws,6), wl=logs.filter(function(l){return l.date>=ws&&l.date<=we;});
    var vol=muscleVolume(ws,we), tot=0; GROUPS.forEach(function(g){ tot+=vol[g]||0; });
    var notes=wl.map(liveLogNote20).filter(function(n){return n!=null;});
    var ton=wl.reduce(function(s,l){ return s+logTonnage(l); },0);
    var stp=[]; for(var di=0;di<7;di++){ var sv2=stepsAt(rankAddDays(ws,di)); if(sv2) stp.push(sv2); }
    var bwk=null; bw.forEach(function(b){ if(b.date>=ws&&b.date<=we) bwk=b.weight_kg; });
    var slp=[]; for(var dj=0;dj<7;dj++){ var mm=sleepMinutes((DB.sleepLog||{})[rankAddDays(ws,dj)]); if(mm) slp.push(mm); }
    var rk=wl.filter(function(l){return l.sport==='course'&&l.run;});
    var bn=null; try{ bn=bilanNoteWeek(ws).note; }catch(e){}
    var gel=0; try{ gel=gelDaysInWeek(ws); }catch(e){}
    var wsr=setRows.filter(function(r){return r[0]>=ws&&r[0]<=we&&r[6]==='principal';});
    var pctF=function(rows){ return rows.length?Math.round(rows.filter(function(r){return r[18]==='echec';}).length/rows.length*100):null; };
    var wS1=pctF(wsr.filter(function(r){return r[23]==='série 1';})), wNl=pctF(wsr.filter(function(r){return r[23]==='série 1'||r[23]==='intermédiaire';}));
    W.push([ws,ws===curMon?'oui':'',weekValue(wl),getWeekGoal(),notes.length?r1(avg(notes)):null,notes.length,bn]
      .concat(GROUPS.map(function(g){return r1(vol[g]||0);}))
      .concat([r1(tot),Math.round(ton)||null,stp.length?Math.round(avg(stp)):null,rk.length,rk.length?r1(rk.reduce(function(s,l){return s+(l.run.km||0);},0)):null,bwk,slp.length?r1(avg(slp)/60):null,gel||null,wS1,wNl]));
  }
  sheets.push({name:'Semaines',cols:[{h:'Semaine du (lundi)',w:13},{h:'Semaine en cours',w:8},{h:'Séances de salle',w:10},{h:'Objectif',w:9},{h:'Exécution moyenne /20',w:12},{h:'Séances notées',w:9},{h:'Note de semaine /20 (app)',w:12}]
    .concat(GROUPS.map(function(g){return {h:'Séries dures '+g,w:10};}))
    .concat([{h:'Séries dures total',w:10},{h:'Tonnage (kg × reps)',w:12},{h:'Pas moyens / jour',w:11},{h:'Courses',w:8},{h:'Km de course',w:9},{h:'Poids fin de semaine (kg)',w:11},{h:'Sommeil moyen (h)',w:10},{h:'Jours gelés (vacances / blessure)',w:12},{h:'% séries 1 en échec (cible < 10)',w:11},{h:'% échec hors dernière série',w:12}]),rows:W});

  // ── Séances ──
  sheets.push({name:'Séances',cols:[{h:'Date',w:11},{h:'Jour',w:6},{h:'Heure',w:7},{h:'Type',w:22},{h:'Exercices / contenu',w:60,wrap:true},{h:'Source',w:22},{h:'Compte en séances de salle',w:11},{h:'Durée (min)',w:8},{h:'Note /20',w:8},{h:'Énergie (1-5)',w:8},{h:'Ressenti (1-5)',w:8},{h:'Exos principaux faits',w:9},{h:'Exos bonus faits',w:9},{h:'Séries totales',w:8},{h:'Tonnage (kg × reps)',w:10},{h:'Échauffement',w:10},{h:'Imprévu déclaré',w:16},{h:'Douleurs (fin de séance)',w:22,wrap:true},{h:'Commentaire',w:44,wrap:true}],
    rows:logs.map(function(l){
      var lv=l.live||{}, ex=lv.exos||[], mainN=0,bonN=0,sets=0,ton=0, names=[];
      ex.forEach(function(x){ var c=false; try{ c=liveExoCounted(x); }catch(e){} if(c){ if(liveExoSide(x)) bonN++; else mainN++; names.push(name(x.key)); }
        sets+=(x.sets||[]).length; });
      ton=logTonnage(l);
      if(!ex.length) (l.sessions||[]).forEach(function(sid){ if(sid.indexOf('exo:')===0) names.push(name(sid.slice(4))); });
      if(!names.length&&!l.sport) names.push('(détail non saisi)');
      return [l.date,jour(l.date),l.time||'',sessionLabel(l),names.join(' · '),sessionSource(l),logWeight(l),l.duration_min||null,liveLogNote20(l),l.energy||null,l.feeling||null,
        l.live?mainN:null,l.live?bonN:null,l.live?sets:null,l.live?Math.round(ton):null,l.live?(lv.warmup?'oui':'non'):'',lv.context?(CTX[lv.context]||lv.context):'',
        lv.pains&&lv.pains.length?painZonesTxt(lv.pains):(lv.painAny===false?'aucune':''),txt(l.comment)];
    })});

  // ── Séries ──
  sheets.push({name:'Séries',cols:[{h:'Date',w:11},{h:'Jour',w:6},{h:'Séance',w:16},{h:'Ordre de l\'exo',w:7},{h:'Exercice',w:30},{h:'Groupe musculaire',w:11},{h:'Rôle',w:9},{h:'Statut de l\'exo',w:14},{h:'Exo compté',w:7},{h:'Note exo /5',w:7},{h:'N° série',w:6},{h:'Charge',w:8},{h:'Unité de charge',w:9},{h:'Assistance (moins = mieux)',w:9},{h:'Réalisé',w:8},{h:'Unité réalisée',w:8},{h:'Cible',w:7},{h:'Écart cible',w:7},{h:'Ressenti',w:9},{h:'Ressenti gauche',w:9},{h:'Ressenti droit',w:9},{h:'Charge de référence du jour',w:10},{h:'e1RM (kg)',w:9},{h:'Position de la série',w:11},{h:'Haut de fourchette (reps)',w:9},{h:'Consigne de ressenti',w:10}],rows:setRows});

  // ── Exercices ──
  var exoRows=[];
  ORDER.forEach(function(k){
    var d=EXO[k], a=DB.weights[k]||[], es=exoStats[k];
    if(d.e.hidden&&!es) return; // retiré et jamais fait en LiveUp
    var cur=a.length?a[a.length-1]:null, first=a.length?a[0]:null, prev=null; a.forEach(function(e){ if(e.date<d30) prev=e; });
    var inv=asIsInverse(k), dl=(cur&&first)?r1(inv?first.val-cur.val:cur.val-first.val):null, d30v=(cur&&prev)?r1(inv?prev.val-cur.val:cur.val-prev.val):null;
    var evo=FEATURE_EVO&&DB.evolution&&DB.evolution[k];
    var rg=!d.e.repTarget&&REP_RANGE[k], presc=d.e.serie||'';
    if(rg){ var _pm=presc.match(/^(\d+)[×x]\d+(.*)$/); presc=(_pm?_pm[1]:'4')+'×'+rg.r[0]+'-'+rg.r[1]+(_pm?_pm[2]:''); }
    exoRows.push([name(k),k,txt(d.s.name),d.e.hidden?'retiré':d.e.bonus?'bonus':'principal',d.e.imp?'oui':'',group(k),presc,d.e.rest||null,unitOf(k),inv,
      cur?cur.val:null,cur?cur.date:'',(function(){ var lcE=loadCount(k); return lcE&&lcE.done?lcE.doneTxt+' / '+lcE.target:null; })(),first?first.val:null,first?first.date:'',dl,(first&&first.val&&dl!=null)?Math.round(dl/first.val*100):null,d30v,
      es?es.n:0,es?es.n30:0,es&&es.last||'',es&&es.best?r1(es.best):null,es&&es.bestDate||'',es&&es.bestSet||'',evo?evo.from+' → '+evo.to+' ('+evo.hi+' série(s) au poids haut)':'',txt(d.e.bless||'')]);
  });
  sheets.push({name:'Exercices',cols:[{h:'Exercice',w:30},{h:'Clé',w:16},{h:'Séance du programme',w:10},{h:'Rôle',w:9},{h:'Exo clé',w:6},{h:'Groupe musculaire',w:11},{h:'Prescription (séries × fourchette de reps)',w:12},{h:'Repos (s)',w:7},{h:'Unité',w:8},{h:'Assistance (moins = mieux)',w:9},{h:'Charge de référence actuelle',w:10},{h:'Depuis le',w:11},{h:'Séries à la charge actuelle / objectif',w:11},{h:'Charge de départ',w:9},{h:'Date de départ',w:11},{h:'Progression totale',w:9},{h:'Progression %',w:9},{h:'Variation sur 30 j',w:9},{h:'Exécutions LiveUp',w:9},{h:'Exécutions 30 j',w:9},{h:'Dernière exécution',w:11},{h:'Meilleure e1RM (kg)',w:9},{h:'Date meilleure e1RM',w:11},{h:'Meilleure série (charge × reps)',w:12},{h:'Évolution de charge en cours',w:22},{h:'Consigne blessure',w:50,wrap:true}],rows:exoRows});

  // ── Historique des charges de référence ──
  var hist=[];
  ORDER.forEach(function(k){ var pv=null; (DB.weights[k]||[]).forEach(function(e){ hist.push([e.date,name(k),k,e.val,unitOf(k),asIsInverse(k),pv!=null?r2(e.val-pv):null]); pv=e.val; }); });
  hist.sort(function(a,b){return a[0].localeCompare(b[0])||a[1].localeCompare(b[1]);});
  sheets.push({name:'Historique charges',cols:[{h:'Date',w:11},{h:'Exercice',w:30},{h:'Clé',w:16},{h:'Charge de référence',w:10},{h:'Unité',w:8},{h:'Assistance (moins = mieux)',w:9},{h:'Variation',w:9}],rows:hist});

  // ── Poids ──
  sheets.push({name:'Poids',cols:[{h:'Date',w:11},{h:'Poids (kg)',w:9},{h:'Variation (kg)',w:9},{h:'Jours depuis la pesée précédente',w:11},{h:'kg par semaine',w:9},{h:'Note',w:40}],
    rows:bw.map(function(b,i){ var pr=bw[i-1], dd=pr?Math.round((new Date(b.date)-new Date(pr.date))/86400000):null;
      return [b.date,b.weight_kg,pr?r2(b.weight_kg-pr.weight_kg):null,dd,pr&&dd?r2((b.weight_kg-pr.weight_kg)/dd*7):null,txt(b.note||'')]; })});

  // ── Course & sports ──
  var EF=['facile','moyen','dur','très dur'];
  sheets.push({name:'Course & sports',cols:[{h:'Date',w:11},{h:'Heure',w:7},{h:'Sport',w:14},{h:'Distance (km)',w:9},{h:'Durée (min)',w:8},{h:'Allure (min:s / km)',w:10},{h:'Allure (s / km)',w:9},{h:'Vitesse (km/h)',w:9},{h:'Dénivelé + (m)',w:9},{h:'FC moyenne',w:9},{h:'FC max',w:8},{h:'Cadence (pas/min)',w:9},{h:'Calories (kcal)',w:9},{h:'Effort',w:9},{h:'Douleur',w:10},{h:'Échauffement guidé',w:10},{h:'Commentaire',w:44,wrap:true}],
    rows:logs.filter(function(l){ return l.sport||(l.sessions||[]).some(function(s){return s.indexOf('autre:')===0;}); }).map(function(l){
      var r=l.run||{}, pace=r.km&&r.sec?Math.round(r.sec/r.km):null;
      var sp=l.sport==='course'?'Course':txt(((l.sessions||[]).find(function(s){return s.indexOf('autre:')===0;})||'autre:').slice(6));
      return [l.date,l.time||'',sp,r.km||null,r.sec?r1(r.sec/60):(l.duration_min||null),pace?Math.floor(pace/60)+':'+String(pace%60).padStart(2,'0'):'',pace,
        r.km&&r.sec?r1(r.km/(r.sec/3600)):null,r.dplus,r.hr,r.hrMax,r.cad,r.kcal,(r.effort!=null?EF[r.effort]:(l.effort!=null?EF[l.effort]:'')),r.pain||'',l.run?(r.warmup?'oui':'non'):'',txt(l.comment)];
    }).concat(cardioExportRows(logs,txt,r1)).sort(function(a,b){ return String(a[0]+a[1]).localeCompare(String(b[0]+b[1])); })});

  // ── Pas ──
  sheets.push({name:'Pas',cols:[{h:'Date',w:11},{h:'Jour',w:6},{h:'Pas',w:9},{h:'Distance (km)',w:9},{h:'Calories actives (kcal)',w:10},{h:'Étages',w:7},{h:'Saisie manuelle',w:9}],
    // 04/11 (incohérence ④) : même lecture que l'app (STEPS.stepsOf : Santé, sinon saisie à la main, sinon heure par heure)
    // — les jours saisis à la main étaient exclus de l'onglet. « Saisie manuelle » = oui seulement si c'est elle qui compte.
    rows:Object.keys(DB.health||{}).sort().filter(function(d){ var h=DB.health[d]; return h&&(stepsAt(d)!=null||h.km); }).map(function(d){ var h=DB.health[d];
      return [d,jour(d),stepsAt(d),h.km?r2(h.km):null,h.kcal||null,h.floors||null,(h.steps==null&&h.ms!=null)?'oui':'']; })});

  // ── Nutrition (02/11/2026) : totaux Yazio du jour via Santé (INTAKE) ──
  var NU=(typeof INTAKE!=='undefined')?INTAKE.days():{};
  function nu(d,k){ var e=NU[d]; return e&&e.kcal>0&&e[k]>0?r1(e[k]):null; }
  var nuDays=Object.keys(NU).filter(function(d){ return NU[d]&&NU[d].kcal>0; }).sort();
  sheets.push({name:'Nutrition',cols:[{h:'Date',w:11},{h:'Jour',w:6},{h:'Calories (kcal)',w:10},{h:'Glucides (g)',w:9},{h:'Protéines (g)',w:9},{h:'Lipides (g)',w:9},{h:'Fibres (g)',w:8},{h:'Sucres (g)',w:8},{h:'Graisses saturées (g)',w:10},{h:'Sodium (mg)',w:9},{h:'Potassium (mg)',w:10},{h:'Objectif kcal atteint (2 900 → 3 000 dès le 06/11)',w:10},{h:'Protéines ≥ 135 g',w:9}],
    rows:nuDays.map(function(d){ return [d,jour(d),nu(d,'kcal'),nu(d,'glu'),nu(d,'prot'),nu(d,'lip'),nu(d,'fib'),nu(d,'sucre'),nu(d,'sat'),nu(d,'sodium'),nu(d,'potassium'),nu(d,'kcal')>=(d>='2026-11-06'?3000:2900)?'oui':'non',nu(d,'prot')>=135?'oui':'non']; })});

  // ── Calendrier (02/11/2026, demande Adrien) : 1 ligne par jour, même sans séance ──
  var calStart=[logs[0]&&logs[0].date,nuDays[0],bw[0]&&bw[0].date].filter(Boolean).sort()[0]||today, CAL=[];
  for(var cd=calStart;cd<=today;cd=rankAddDays(cd,1)){
    var dl=logs.filter(function(l){ return l.date===cd; });
    var n20=dl.map(function(l){ try{ return liveLogNote20(l); }catch(e){ return null; } }).filter(function(x){ return x!=null; });
    var hh=(DB.health||{})[cd]||{}, stp=hh.steps!=null?hh.steps:(hh.ms!=null?hh.ms:null);
    var sl=(DB.sleepLog||{})[rankAddDays(cd,-1)], slm=sl?sleepMinutes(sl):null;
    var pw=bw.find(function(b){ return b.date===cd; });
    CAL.push([cd,jour(cd),dl.length?'oui':'non',dl.map(sessionLabel).filter(Boolean).join(' + '),n20.length?n20.join(' / '):null,stp,
      nu(cd,'kcal'),nu(cd,'glu'),nu(cd,'prot'),nu(cd,'lip'),slm?r2(slm/60):null,pw?parseFloat(pw.weight_kg):null]);
  }
  sheets.splice(sheets.findIndex(function(x){ return x.name==='Semaines'; })+1,0,{name:'Calendrier',cols:[{h:'Date',w:11},{h:'Jour',w:6},{h:'Séance',w:8},{h:'Type de séance',w:26},{h:'Note /20',w:8},{h:'Pas',w:9},{h:'Calories (kcal)',w:10},{h:'Glucides (g)',w:9},{h:'Protéines (g)',w:9},{h:'Lipides (g)',w:9},{h:'Sommeil de la nuit (h)',w:10},{h:'Poids (kg)',w:9}],rows:CAL});

  // ── Sommeil ──
  sheets.push({name:'Sommeil',cols:[{h:'Nuit du',w:11},{h:'Coucher',w:8},{h:'Réveil',w:8},{h:'Durée (h)',w:8}],
    rows:Object.keys(DB.sleepLog||{}).sort().map(function(n){ var s=DB.sleepLog[n], m=sleepMinutes(s); return [n,s.bed||'',s.wake||'',m?r2(m/60):null]; })});

  // ── Douleurs (toutes les sources, datées) ──
  var P=[];
  logs.forEach(function(l){
    var lv=l.live||{};
    (lv.pains||[]).forEach(function(z){ P.push([l.date,'question de fin de séance',txt(painZoneLabel(z.z)),z.lvl||null,'',txt(l.comment)]); });
    (lv.exos||[]).forEach(function(x){ if(x.pain) P.push([l.date,'exercice arrêté pour douleur','',null,name(x.key),txt(l.comment)]); });
    if(lv.context==='blessure') P.push([l.date,'séance déclarée « blessure / douleur »','',null,'',txt(l.comment)]);
    if(l.run&&l.run.pain) P.push([l.date,'course',l.run.pain,null,'',txt(l.comment)]);
  });
  (DB.painLog||[]).forEach(function(x){ if(x.level>0) P.push([x.date,'journal poignet (0-5)','poignet',x.level,'',txt(x.note)]); });
  P.sort(function(a,b){return a[0].localeCompare(b[0]);});
  sheets.push({name:'Douleurs',cols:[{h:'Date',w:11},{h:'Source',w:30},{h:'Zone',w:12},{h:'Niveau /5',w:8},{h:'Exercice',w:26},{h:'Commentaire de la séance',w:60,wrap:true}],rows:P});

  // ── Mobilité ──
  sheets.push({name:'Mobilité',cols:[{h:'Date',w:11},{h:'Étirements de séance',w:10},{h:'Routine du matin',w:10},{h:'Routine du soir',w:10}],
    rows:Object.keys(DB.dz||{}).sort().filter(function(d){ var z=DB.dz[d]||{}; return z.stretch||z.am||z.pm; }).map(function(d){ var z=DB.dz[d]; return [d,z.stretch?'oui':'',z.am?'oui':'',z.pm?'oui':'']; })});

  if(opts.dryRun) return sheets;
  var blob=XLSX_LITE.build(sheets), url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url; a.download='massup_coach_'+today+'.xlsx';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); },4000);
  showToast('&#x1F4E5; Dossier coach (Excel) t&#xE9;l&#xE9;charg&#xE9;');
  return sheets;
}
// Durée d'une nuit {bed:'23:10', wake:'07:05'} en minutes (passe minuit)
function sleepMinutes(s){
  if(!s||!s.bed||!s.wake) return null;
  var b=s.bed.split(':').map(Number), w=s.wake.split(':').map(Number);
  var m=(w[0]*60+w[1])-(b[0]*60+b[1]); if(m<=0) m+=1440;
  return m>0&&m<1080?m:null;
}

// ══════════════════════════════════════════════════
// MODAL — fermeture clic extérieur + Escape
// ══════════════════════════════════════════════════
(function(){
  var modals={logModal:closeLogModal,dayModal:closeDayModal,peseeModal:closePeseeModal,settingsModal:closeSettings};
  Object.keys(modals).forEach(function(id){
    var overlay=document.getElementById(id);
    if(!overlay) return;
    overlay.addEventListener('click',function(e){
      if(e.target===overlay) modals[id]();
    });
  });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    var fs=document.getElementById('fsOverlay');
    if(fs&&fs.classList.contains('open')){closeFullscreenChart();return;}
    Object.keys(modals).forEach(function(id){
      var overlay=document.getElementById(id);
      if(overlay&&overlay.classList.contains('open')) modals[id]();
    });
  });
})();

