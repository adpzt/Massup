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
  // Minutes depuis 18:00 : coucher et réveil sur un même axe continu (23:30 → 330, 07:30 → 810)
  function rel(t){ if(!validTime(t))return null; var m=Number(t.slice(0,2))*60+Number(t.slice(3)); return (m-1080+1440)%1440; }
  function hhmm(r){ var m=(Math.round(r)+1080)%1440; return pad(Math.floor(m/60))+':'+pad(m%60); }
  // Couleur de la nuit selon la durée (01/11, refonte demandée par Adrien : « le violet, on comprend rien »)
  function durCls(m){ return m==null?'':m<360?'short':m<420?'mid':m<=540?'good':'long'; }
  function historyHtml(){
    var items=history(range),s=summary(items),idx=items.findIndex(function(x){return x.date===selectedDate;});
    if(idx<0){idx=items.length-1;selectedDate=items[idx].date;}
    var selected=items[idx], valid=items.filter(function(x){return x.minutes!=null;});
    // Axe vertical : 22h → 9h par défaut, élargi à l'heure pleine si une nuit déborde
    var ax0=240, ax1=900;
    valid.forEach(function(x){ var b=rel(x.data.bed); if(b!=null){ ax0=Math.min(ax0,Math.floor(b/60)*60); ax1=Math.max(ax1,Math.ceil((b+x.minutes)/60)*60); } });
    ax1=Math.min(ax1,ax0+1440); var span=ax1-ax0;
    var grid='';
    for(var g=Math.ceil(ax0/120)*120; g<=ax1; g+=120){
      var top=(g-ax0)/span*100;
      grid+='<span class="slp-gl" style="top:'+top+'%"><em>'+String((Math.floor(g/60)+18)%24)+'h</em></span>';
    }
    var cols=items.map(function(x,i){
      var b=rel(x.data.bed), lab=range===7?fmtDate(x.date,{weekday:'short',day:'numeric'}):((items.length-1-i)%5===0?fmtDate(x.date,{day:'numeric'}):'');
      var bar='';
      if(x.minutes!=null&&b!=null){
        var t=(b-ax0)/span*100, h=x.minutes/span*100;
        bar='<i class="slp-bar '+durCls(x.minutes)+'" style="top:'+t.toFixed(2)+'%;height:'+h.toFixed(2)+'%">'+(range===7?'<b>'+fmtDuration(x.minutes).replace(' ','')+'</b>':'')+'</i>';
      } else bar='<i class="slp-bar none"></i>';
      return '<button class="slp-col'+(i===idx?' selected':'')+'" type="button" onclick="SLEEP._select(\''+x.date+'\')" aria-pressed="'+(i===idx)+'" aria-label="'+nightLabel(x.date,{weekday:'long',day:'numeric',month:'long'})+' : '+fmtDuration(x.minutes)+'">'
        +'<span class="slp-lane">'+bar+'</span><span class="slp-day">'+lab+'</span></button>';
    }).join('');
    var bedAvg=valid.length?valid.reduce(function(a,x){return a+rel(x.data.bed);},0)/valid.length:null;
    var wakeAvg=valid.length?valid.reduce(function(a,x){return a+rel(x.data.bed)+x.minutes;},0)/valid.length:null;
    var title=range===7?'7 dernières nuits':'30 dernières nuits';
    var sb=rel(selected.data.bed);
    return '<div class="slp-range"><button class="'+(range===7?'on':'')+'" onclick="SLEEP._range(7)">7 nuits</button><button class="'+(range===30?'on':'')+'" onclick="SLEEP._range(30)">30 nuits</button></div>'
      +'<div class="slp-selected"><strong class="'+durCls(selected.minutes)+'">'+fmtDuration(selected.minutes)+'</strong><span>'+nightLabel(selected.date,{weekday:'long',day:'numeric',month:'long'})+'</span>'
      +(selected.minutes!=null&&sb!=null?'<small>couché '+hhmm(sb)+' &#x2192; levé '+hhmm(sb+selected.minutes)+'</small>':'')+'</div>'
      +'<div class="slp-plot'+(range===30?' slp-plot-30':'')+'" aria-label="'+title+' : heure de coucher et de réveil">'
      +'<div class="slp-grid" aria-hidden="true">'+grid+'</div><div class="slp-cols">'+cols+'</div></div>'
      +'<div class="slp-legend"><span><i class="short"></i>&lt; 6 h</span><span><i class="mid"></i>6-7 h</span><span><i class="good"></i>7-9 h</span><span><i class="long"></i>&gt; 9 h</span></div>'
      +'<div class="slp-stats"><div><strong>'+(s.avg==null?'—':fmtDuration(s.avg))+'</strong><small>Durée moyenne · '+title.toLowerCase()+'</small></div>'
      +'<div><strong>'+(bedAvg==null?'—':hhmm(bedAvg))+'</strong><small>coucher moyen</small></div>'
      +'<div><strong>'+(wakeAvg==null?'—':hhmm(wakeAvg))+'</strong><small>réveil moyen</small></div>'
      +'<div><strong>'+s.count+'/'+items.length+'</strong><small>nuits renseignées</small></div></div>'
      +'<section class="slp-edit"><h2>Modifier cette nuit</h2>'
      +'<p class="slp-edit-date">'+nightLabel(selected.date,{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'</p>'
      +'<div class="slp-times"><div><label for="slp-edit-bed">Heure de dodo</label><input id="slp-edit-bed" type="time" value="'+validTime(selected.data.bed)+'"></div>'
      +'<div><label for="slp-edit-wake">Heure de réveil</label><input id="slp-edit-wake" type="time" value="'+validTime(selected.data.wake)+'"></div></div>'
      +'<div class="slp-edit-actions"><button type="button" class="slp-cancel" onclick="SLEEP._cancelEdit()">Annuler</button><button type="button" class="slp-save" onclick="SLEEP._saveSelected()">Enregistrer cette nuit</button></div></section>'
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
