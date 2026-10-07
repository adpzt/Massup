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
  function cardHtml(){
    var key=currentNight(),e=entry(key),week=history(7),s=summary(week),mins=duration(e.bed,e.wake),max=12*60;
    return '<section class="slp-card">'
      +'<div class="slp-card-head"><div><span class="slp-eyebrow">🌙 Sommeil</span><div class="slp-main"><strong>'+fmtDuration(mins)+'</strong><span>'+nightLabel(key)+'</span></div></div>'
      +'<button class="slp-open" type="button" onclick="SLEEP.open()">Historique <span aria-hidden="true">↗</span></button></div>'
      +'<form class="slp-form" onsubmit="SLEEP._saveHome();return false;">'
      +'<div class="slp-times">'
      +'<div><label for="slp-bed">Heure de dodo</label><input id="slp-bed" type="time" value="'+validTime(e.bed)+'"></div>'
      +'<div><label for="slp-wake">Heure de réveil</label><input id="slp-wake" type="time" value="'+validTime(e.wake)+'"></div>'
      +'</div><div class="slp-form-foot"><small>Repère approximatif, saisi manuellement</small><button class="slp-save" type="submit">Enregistrer</button></div></form>'
      +'<div class="slp-foot"><span>Moyenne · 7 dernières nuits</span><strong>'+(s.avg==null?'—':fmtDuration(s.avg))+'</strong><small>'+s.count+' nuit'+(s.count===1?'':'s')+' complète'+(s.count===1?'':'s')+'</small></div>'
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
    if(!ov){ov=document.createElement('div');ov.id='sleepOverlay';ov.className='as-overlay slp-overlay';ov.innerHTML='<div class="as-frame" aria-hidden="true"></div><div class="as-body" id="sleepBody"></div>';document.body.appendChild(ov);}
    ov.classList.add('open');document.body.style.overflow='hidden';renderOpen();
  }
  function close(){var ov=$('sleepOverlay');if(ov)ov.classList.remove('open');document.body.style.overflow='';}
  function historyHtml(){
    var items=history(range),s=summary(items),idx=items.findIndex(function(x){return x.date===selectedDate;});
    if(idx<0){idx=items.length-1;selectedDate=items[idx].date;}
    var selected=items[idx],max=Math.max(12*60,...items.map(function(x){return x.minutes||0;}));
    var bars=items.map(function(x,i){
      var h=x.minutes==null?0:Math.max(3,Math.round(x.minutes/max*100));
      return '<button class="slp-point'+(i===idx?' selected':'')+(x.minutes==null?' empty':'')+'" type="button" onclick="SLEEP._select(\''+x.date+'\')" aria-pressed="'+(i===idx)+'" aria-label="'+fmtDate(x.date,{weekday:'long',day:'numeric',month:'long'})+' : '+fmtDuration(x.minutes)+'">'
        +'<span class="slp-track"><i style="height:'+h+'%"></i></span><span>'+fmtDate(x.date,{day:'numeric',month:'short'})+'</span></button>';
    }).join('');
    var title=range===7?'7 dernières nuits':'30 dernières nuits';
    return '<div class="slp-range"><button class="'+(range===7?'on':'')+'" onclick="SLEEP._range(7)">7 nuits</button><button class="'+(range===30?'on':'')+'" onclick="SLEEP._range(30)">30 nuits</button></div>'
      +'<div class="slp-selected"><strong>'+fmtDuration(selected.minutes)+'</strong><span>'+nightLabel(selected.date,{weekday:'long',day:'numeric',month:'long'})+'</span></div>'
      +'<div class="slp-chart '+(range===30?'slp-chart-30':'')+'" aria-label="'+title+'">'+bars+'</div>'
      +'<section class="slp-edit"><h2>Modifier cette nuit</h2>'
      +'<p class="slp-edit-date">'+nightLabel(selected.date,{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'</p>'
      +'<div class="slp-times"><div><label for="slp-edit-bed">Heure de dodo</label><input id="slp-edit-bed" type="time" value="'+validTime(selected.data.bed)+'"></div>'
      +'<div><label for="slp-edit-wake">Heure de réveil</label><input id="slp-edit-wake" type="time" value="'+validTime(selected.data.wake)+'"></div></div>'
      +'<div class="slp-edit-actions"><button type="button" class="slp-cancel" onclick="SLEEP._cancelEdit()">Annuler</button><button type="button" class="slp-save" onclick="SLEEP._saveSelected()">Enregistrer cette nuit</button></div></section>'
      +'<div class="slp-stats"><div><strong>'+(s.avg==null?'—':fmtDuration(s.avg))+'</strong><small>Moyenne · '+title.toLowerCase()+'</small></div>'
      +'<div><strong>'+s.count+'</strong><small>nuits complètes</small></div>'
      +'<div><strong>'+(s.best==null?'—':fmtDuration(s.best))+'</strong><small>nuit la plus longue</small></div>'
      +'<div><strong>'+fmtDuration(s.total)+'</strong><small>durée cumulée</small></div></div>'
      +'<p class="slp-note">Durée approximative, calculée à partir des heures déclarées. Ce suivi ne mesure ni les phases de sommeil ni les réveils nocturnes.</p>';
  }
  function renderOpen(){
    var ov=$('sleepOverlay'),body=$('sleepBody');if(!ov||!ov.classList.contains('open')||!body)return;
    body.innerHTML='<header class="as-hdr slp-header"><div class="as-hdr-left"><button class="as-exit st-exit" onclick="SLEEP.close()" aria-label="Fermer">✕</button></div><div class="as-hdr-mid"><div class="as-hdr-title">🌙 Sommeil</div><div class="as-hdr-sub">Estimation déclarative · heures saisies manuellement</div></div><div class="as-hdr-right"></div></header><main class="slp-scroll"><section class="wn-card slp-history">'+historyHtml()+'</section></main>';
  }
  function select(key){selectedDate=key;renderOpen();}
  function setRange(n){if(n!==7&&n!==30)return;range=n;selectedDate=currentNight();renderOpen();}
  return {init:function(adapter){A=adapter;},renderCard:renderCard,open:open,close:close,
    _saveHome:saveHome,_saveSelected:saveSelected,_cancelEdit:cancelEdit,_select:select,_range:setRange,_duration:duration,
    _night:currentNight,_summary:summary};
})();
