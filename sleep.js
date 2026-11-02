"use strict";

var SLEEP=(function(){
  var A=null, selectedDate=null, range=7;
  var $=function(id){return document.getElementById(id);};
  function pad(n){return String(n).padStart(2,'0');}
  function dateKey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
  function addDays(key,n){var d=new Date(key+'T12:00:00');d.setDate(d.getDate()+n);return dateKey(d);}
  function today(){return dateKey(new Date());}
  function currentNight(){var d=new Date();d.setDate(d.getDate()-1);return dateKey(d);}
  function days(){var db=A.db();if(!db.sleepLog)db.sleepLog={};return db.sleepLog;}
  function entry(key){return days()[key]||{};}
  function duration(bed,wake){
    if(!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(bed||'')||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(wake||''))return null;
    var a=Number(bed.slice(0,2))*60+Number(bed.slice(3)),b=Number(wake.slice(0,2))*60+Number(wake.slice(3));
    if(b===a)return null;
    if(b<a)b+=1440;
    return b-a;
  }
  function validTime(value){return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value||'')?value:'';}
  function fmtDuration(n){return n==null?'—':Math.floor(n/60)+' h'+(n%60?' '+pad(n%60):'');}
  function fmtDate(key,opts){return new Date(key+'T12:00:00').toLocaleDateString('fr-FR',opts||{day:'numeric',month:'short'});}
  function nightLabel(key,opts){
    return 'Nuit du '+fmtDate(key,opts)+' au '+fmtDate(addDays(key,1),opts);
  }
  function record(key){
    return {date:key,data:entry(key),minutes:duration(entry(key).bed,entry(key).wake)};
  }
  function history(count){
    var end=currentNight(),out=[];
    for(var i=count-1;i>=0;i--)out.push(record(addDays(end,-i)));
    return out;
  }
  function saveNight(key,bed,wake){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(key))return false;
    var valid=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
    if((bed!==''&&!valid.test(bed))||(wake!==''&&!valid.test(wake))){
      if(A&&A.toast)A.toast('Heure invalide');
      return false;
    }
    days()[key]={bed:bed,wake:wake};
    A.save();
    renderCard();
    renderOpen();
    return true;
  }
  function saveHome(){
    var bed=$('slp-bed'),wake=$('slp-wake');
    if(bed&&wake)saveNight(currentNight(),bed.value,wake.value);
  }
  function saveSelected(){
    var bed=$('slp-edit-bed'),wake=$('slp-edit-wake');
    if(bed&&wake)saveNight(selectedDate,bed.value,wake.value);
  }
  function cancelEdit(){renderOpen();}
  function summary(items){
    var valid=items.filter(function(x){return x.minutes!=null;}),total=valid.reduce(function(s,x){return s+x.minutes;},0);
    return {count:valid.length,total:total,avg:valid.length?Math.round(total/valid.length):null,best:valid.length?Math.max.apply(null,valid.map(function(x){return x.minutes;})):null};
  }
  // ── v4 (01/11, refonte UX demandée par Adrien : « des bulles sur des bulles, pas très beau ») ──
  // Même langage que l'écran Pas : carte du Bilan = titre + ⛶, la nuit en gros, la moyenne, 7 mini-barres,
  // saisie repliée si la nuit est déjà notée ; page = en-tête libre, UNE carte (onglets, nuit choisie,
  // moyenne, graphique, 4 stats), « Modifier une nuit » replié en dessous.
  function durCls(m){ return m==null?'':m<360?'short':m<420?'mid':m<=540?'good':'long'; }
  var DUR_LBL={short:'Trop court',mid:'Un peu court',good:'Dans la zone',long:'Long'};
  function fmtShort(m){ return m==null?'':Math.floor(m/60)+'h'+(m%60?pad(m%60):''); }
  function rel(t){ if(!validTime(t))return null; var m=Number(t.slice(0,2))*60+Number(t.slice(3)); return (m-1080+1440)%1440; }
  function hhmm(r){ var m=(Math.round(r)+1080)%1440; return pad(Math.floor(m/60))+':'+pad(m%60); }
  // Barres de durée depuis le bas + zone idéale 7-9 h (grille CSS : Safari iOS n'étire pas les enfants d'un <button> en flex)
  function barsHtml(items,idx,opts){
    opts=opts||{};
    var valid=items.filter(function(x){return x.minutes!=null;});
    var maxH=Math.max(10,Math.ceil(Math.max.apply(null,[0].concat(valid.map(function(x){return x.minutes;})))/60));
    var pct=function(min){ return (min/(maxH*60)*100).toFixed(2); };
    var grid='';
    if(!opts.mini) for(var g=2; g<=maxH; g+=2) grid+='<span class="slp-gl" style="bottom:'+pct(g*60)+'%"><em>'+g+'h</em></span>';
    var cols='repeat('+items.length+',minmax(0,1fr))';
    var bars=items.map(function(x,i){
      var c=durCls(x.minutes), h=x.minutes==null?6:pct(x.minutes);
      var tag=opts.mini?'span':'button';
      return '<'+tag+(opts.mini?'':' type="button" onclick="SLEEP._select(\''+x.date+'\')" aria-pressed="'+(i===idx)+'"')+' class="slp-b'+(i===idx?' sel':'')+(c?' '+c:' none')+'" aria-label="'+nightLabel(x.date,{weekday:'long',day:'numeric',month:'long'})+' : '+(x.minutes==null?'non renseignée':fmtDuration(x.minutes)+', '+DUR_LBL[c])+'">'
        +'<span class="slp-fill" style="height:'+h+'%"></span>'+(opts.values&&x.minutes!=null?'<span class="slp-val" style="bottom:calc('+h+'% + 4px)">'+fmtShort(x.minutes)+'</span>':'')
        +'</'+tag+'>';
    }).join('');
    var labels=items.map(function(x,i){
      var t=opts.mini?fmtDate(x.date,{weekday:'narrow'}):items.length<=7?fmtDate(x.date,{weekday:'short'}).replace('.','')+'<b>'+fmtDate(x.date,{day:'numeric'})+'</b>':((items.length-1-i)%7===0?fmtDate(x.date,{day:'numeric'}):'');
      return '<span class="'+(i===idx?'sel':'')+'">'+t+'</span>';
    }).join('');
    return '<div class="slp-chart3'+(items.length>7?' r30':'')+(opts.mini?' mini':'')+'" role="group" aria-label="Durée de sommeil par nuit">'
      +'<div class="slp-area"><span class="slp-zone" style="bottom:'+pct(420)+'%;height:'+(pct(540)-pct(420)).toFixed(2)+'%"></span>'+grid
      +'<div class="slp-bars" style="grid-template-columns:'+cols+'">'+bars+'</div></div>'
      +'<div class="slp-x" style="grid-template-columns:'+cols+'">'+labels+'</div></div>';
  }
  function cardHtml(){
    var key=currentNight(),e=entry(key),week=history(7),s=summary(week),mins=duration(e.bed,e.wake),c=durCls(mins);
    var inZone=week.filter(function(x){ return durCls(x.minutes)==='good'; }).length;
    var b=rel(e.bed);
    return '<section class="st-card st-card-modern slp-card">'
      +'<div class="st-top"><span class="st-ttl">&#x1F319; Sommeil</span><div class="st-card-actions">'
      +'<button class="st-card-action" type="button" onclick="SLEEP.open()" aria-label="Ouvrir la page Sommeil" title="Ouvrir en grand">&#x26F6;</button></div></div>'
      +'<div class="st-card-selected"><strong class="slp-v '+c+'">'+fmtDuration(mins)+'</strong><span>'+nightLabel(key)+(mins!=null?'':' &#xB7; pas encore not&#xE9;e')+'</span>'+(c?'<em class="slp-badge '+c+'">'+DUR_LBL[c]+'</em>':'')+'</div>'
      +'<div class="st-card-weekline"><span>Moyenne 7 nuits</span><strong class="slp-v '+durCls(s.avg)+'">'+(s.avg==null?'&#x2014;':fmtDuration(s.avg))+'</strong><small>'+inZone+'/7 dans la zone 7-9 h</small></div>'
      +barsHtml(week,6,{mini:true})
      +'<details class="slp-quick"'+(mins==null?' open':'')+'><summary>'+(mins!=null?'Couch&#xE9; '+hhmm(b)+' &#x2192; lev&#xE9; '+hhmm(b+mins)+'<span>Modifier</span>':'Noter ta nuit<span>&#xFF0B;</span>')+'</summary>'
      +'<form class="slp-times" onsubmit="SLEEP._saveHome();return false;">'
      +'<label>Couch&#xE9;<input id="slp-bed" type="time" value="'+validTime(e.bed)+'"></label>'
      +'<label>Lev&#xE9;<input id="slp-wake" type="time" value="'+validTime(e.wake)+'"></label>'
      +'<button class="slp-save" type="submit">OK</button></form></details>'
      +'</section>';
  }
  function renderCard(){
    if(!A)return;
    var step=$('stCard'),host=$('bilanWeekNut'),mount=step||host;
    if(!mount||!mount.parentNode)return;
    var el=$('sleepCard');
    if(!el){el=document.createElement('div');el.id='sleepCard';mount.parentNode.insertBefore(el,mount.nextSibling);}
    el.innerHTML=cardHtml();
  }
  function open(){
    range=7;selectedDate=currentNight();
    var ov=$('sleepOverlay');
    if(!ov){ov=document.createElement('div');ov.id='sleepOverlay';ov.className='as-overlay st-overlay st-overlay-adrien slp-overlay';ov.innerHTML='<div class="as-frame" aria-hidden="true"></div><div class="as-body" id="sleepBody"></div>';document.body.appendChild(ov);}
    ov.classList.add('open');document.body.style.overflow='hidden';renderOpen();
  }
  function close(){var ov=$('sleepOverlay');if(ov)ov.classList.remove('open');document.body.style.overflow='';}
  function historyHtml(){
    var items=history(range),s=summary(items),idx=items.findIndex(function(x){return x.date===selectedDate;});
    if(idx<0){idx=items.length-1;selectedDate=items[idx].date;}
    var selected=items[idx], valid=items.filter(function(x){return x.minutes!=null;});
    var beds=valid.map(function(x){return rel(x.data.bed);}).filter(function(v){return v!=null;});
    var bedAvg=beds.length?beds.reduce(function(a,v){return a+v;},0)/beds.length:null;
    var wakeAvg=valid.length?valid.reduce(function(a,x){return a+rel(x.data.bed)+x.minutes;},0)/valid.length:null;
    var spread=beds.length>1?Math.round(Math.sqrt(beds.reduce(function(a,v){return a+(v-bedAvg)*(v-bedAvg);},0)/beds.length)):null;
    var inZone=items.filter(function(x){ return durCls(x.minutes)==='good'; }).length;
    var sb=rel(selected.data.bed), sc=durCls(selected.minutes);
    return '<div class="st-rng slp-rng">'+[[7,'7 nuits'],[30,'30 nuits']].map(function(r){ return '<button type="button" class="'+(range===r[0]?'on':'')+'" onclick="SLEEP._range('+r[0]+')">'+r[1]+'</button>'; }).join('')+'</div>'
      +'<div class="slp-hero"><div class="slp-hero-top"><strong class="slp-v '+sc+'">'+fmtDuration(selected.minutes)+'</strong>'+(sc?'<em class="slp-badge '+sc+'">'+DUR_LBL[sc]+'</em>':'')+'</div>'
      +'<span>'+nightLabel(selected.date,{weekday:'long',day:'numeric',month:'long'})+'</span>'
      +'<small>'+(selected.minutes!=null&&sb!=null?'Couch&#xE9; '+hhmm(sb)+' &#x2192; lev&#xE9; '+hhmm(sb+selected.minutes):'Nuit non renseign&#xE9;e')+'</small></div>'
      +'<div class="st-period-total"><span>Moyenne &#xB7; '+(range===7?'7':'30')+' nuits</span><strong class="slp-v '+durCls(s.avg)+'">'+(s.avg==null?'&#x2014;':fmtDuration(s.avg))+'</strong></div>'
      +barsHtml(items,idx,{values:range===7})
      +'<p class="slp-zone-cap"><i></i>Zone id&#xE9;ale : 7 &#xE0; 9 h</p>'
      +'<div class="st-grid st-period-stats">'
      +'<div><b>'+inZone+' / '+items.length+'</b><small>nuits dans la zone</small></div>'
      +'<div><b>'+(spread==null?'&#x2014;':'&#xB1; '+spread+' min')+'</b><small>r&#xE9;gularit&#xE9; du coucher</small></div>'
      +'<div><b>'+(bedAvg==null?'&#x2014;':hhmm(bedAvg))+'</b><small>coucher moyen</small></div>'
      +'<div><b>'+(wakeAvg==null?'&#x2014;':hhmm(wakeAvg))+'</b><small>r&#xE9;veil moyen</small></div></div>';
  }
  // ── « Ton rythme » v3 (03/11, validé par Adrien) : SA règle « au lit avant minuit » → réveil n'importe quand entre
  // 07:00 et 09:00 (= 7 à 9 h de sommeil, la zone) ; plus de calcul de cycles (impossible à prévoir à la minute).
  // Le seul repère en plus : la régularité du LEVER sur les 7 dernières nuits (± 30 min = régulier).
  function adviceHtml(){
    var items=history(7).filter(function(x){ return x.minutes!=null&&rel(x.data.bed)!=null; });
    var wakes=items.map(function(x){ return rel(x.data.bed)+x.minutes; });
    var wAvg=wakes.length?wakes.reduce(function(a,v){ return a+v; },0)/wakes.length:null;
    var spread=wakes.length>1?Math.round(Math.sqrt(wakes.reduce(function(a,v){ return a+(v-wAvg)*(v-wAvg); },0)/wakes.length)):null;
    var lateBeds=items.filter(function(x){ return rel(x.data.bed)>rel('00:00'); }).length;
    return '<div class="wn-card slp-advice"><div class="wn-title">Ton rythme</div>'
      +'<div class="slp-adv"><div><span>\uD83D\uDECF\uFE0F Au lit avant</span><b>00:00</b></div><div><span>\u2600\uFE0F R\u00e9veil entre</span><b>07:00 <small>\u2192</small> 09:00</b></div></div>'
      +'<p class="slp-adv-sub">'+(spread==null?'Note quelques nuits pour voir ta r\u00e9gularit\u00e9.'
        :(spread<=30?'\u2713 Lever r\u00e9gulier (\u00b1 '+spread+' min)':'Ton lever varie de \u00b1 '+spread+' min \u00b7 vise \u00b1 30 min')+(lateBeds?' \u00b7 '+lateBeds+' coucher'+(lateBeds>1?'s':'')+' apr\u00e8s minuit sur 7':''))+'</p>'
      +'</div>';
  }
  function renderOpen(){
    var ov=$('sleepOverlay'),body=$('sleepBody');if(!ov||!ov.classList.contains('open')||!body)return;
    var sel=record(selectedDate||currentNight());
    body.innerHTML='<div class="as-hdr st-header"><div class="as-hdr-left"><button class="as-exit st-exit" onclick="SLEEP.close()" title="Fermer" aria-label="Fermer">&#x2715;</button></div>'
      +'<div class="as-hdr-mid"><div class="as-hdr-title">&#x1F319; Sommeil</div><div class="as-hdr-sub">objectif : 7 &#xE0; 9 h par nuit</div></div><div class="as-hdr-right"></div></div>'
      +'<div class="as-scroll st-scroll st-scroll-modern"><div class="wn-card st-history slp-history">'+historyHtml()+'</div>'+adviceHtml()
      +'<details class="wn-card st-sec st-manual slp-manual"><summary>Modifier une nuit <small>('+fmtDate(sel.date,{weekday:'short',day:'numeric',month:'short'})+')</small></summary>'
      +'<p class="st-sub">Touche une barre pour choisir la nuit. Heures saisies &#xE0; la main : une estimation, pas une mesure.</p>'
      +'<div class="slp-times"><label>Couch&#xE9;<input id="slp-edit-bed" type="time" value="'+validTime(sel.data.bed)+'"></label>'
      +'<label>Lev&#xE9;<input id="slp-edit-wake" type="time" value="'+validTime(sel.data.wake)+'"></label>'
      +'<button type="button" class="slp-save" onclick="SLEEP._saveSelected()">OK</button></div></details>'
      +'</div>';
  }
  function select(key){selectedDate=key;renderOpen();}
  function setRange(n){if(n!==7&&n!==30)return;range=n;selectedDate=currentNight();renderOpen();}
  return {init:function(adapter){A=adapter;},renderCard:renderCard,open:open,close:close,
    _saveHome:saveHome,_saveSelected:saveSelected,_save:saveNight,_cancelEdit:cancelEdit,_select:select,_range:setRange,_duration:duration,
    _night:currentNight,_summary:summary};
})();
