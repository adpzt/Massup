"use strict";
/* ═══════════════════════════════════════════════════════════════════════════
   MASSUP — « NOUS DEUX 💞 » (26/08/2026) — module PARTAGÉ Adrien ⇄ Melati.
   Mode OBSERVATION strict : chaque app pousse un RÉSUMÉ lecture seule de sa
   progression dans la table Supabase `partner_state` (partner_state.sql) et LIT
   celui de l'autre. Rien ici n'écrit jamais dans les données de l'autre — la
   seule écriture est sa PROPRE ligne (RLS auth.uid()). Les vraies bases restent
   dans user_state (privé).
   + « petit mot » : un message laissé à l'autre, qui s'ouvre en animation juste
   avant le début de sa séance (LiveUp ou mobilité). Vu = marqué côté receveur.
   Chaque app fournit un adaptateur via PV.init({...}) :
     me/other          : 'adrien' | 'melati'
     meName/otherName  : prénoms · meIco/otherIco : emoji
     client()          : client supabase (ou null si hors ligne / CDN KO)
     snapshot()        : données résumées à pousser (jours + compteurs)
     tiles(days,dates) : HTML des compteurs de la semaine de l'AUTRE
     dayHtml(date,day) : HTML du bilan d'un jour de l'AUTRE (lecture seule)
     daySport(day)     : type couleur de la case (legs|pull|push|others|maison) ou null
     dayMobi(day)      : true → contour accent (mobilité / étirements)
     daySalsa(day)     : true → case turquoise (salsa de Melati) ; sport + salsa = bandeau turquoise en bas (29/08)
     getMsg()/setMsg(m): mon mot pour l'autre (persisté dans MA base)
     getSeen()/setSeen(id) : id du dernier mot de l'autre que j'ai vu
     loveEmojis        : particules de l'animation (ce que l'AUTRE m'envoie)
   Batterie iOS : animations one-shot uniquement, aucun setInterval, 1 fetch au
   boot + à l'ouverture du Bilan (≥ 60 s d'écart) + à l'ouverture d'une séance.
   ═══════════════════════════════════════════════════════════════════════════ */
var PV=(function(){
  var cfg=null, P=null, KEY=null, _lastPull=0, _pulling=false, _missing=false, _err=null, _off=0, _lastPushJson=null;
  var DAYL=['L','M','M','J','V','S','D'];
  var MOIS=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  var JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  function $(i){ return document.getElementById(i); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function pad(n){ return String(n).padStart(2,'0'); }
  function dstr(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function today(){ return dstr(new Date()); }
  function addDays(s,n){ var d=new Date(s+'T12:00:00'); d.setDate(d.getDate()+n); return dstr(d); }
  function monday(s){ var d=new Date(s+'T12:00:00'); var k=(d.getDay()+6)%7; d.setDate(d.getDate()-k); return dstr(d); }
  function fmtLong(s){ var d=new Date(s+'T12:00:00'); return JOURS[d.getDay()]+' '+d.getDate()+' '+MOIS[d.getMonth()]; }
  function fmtShort(s){ var p=s.split('-'); return p[2]+'/'+p[1]; }
  function ago(iso){
    if(!iso) return '';
    var m=Math.round((Date.now()-new Date(iso).getTime())/60000);
    if(m<1) return 'à l\'instant'; if(m<60) return 'il y a '+m+' min';
    var h=Math.round(m/60); if(h<24) return 'il y a '+h+' h';
    var j=Math.round(h/24); return 'il y a '+j+' j';
  }
  function fmtAt(iso){ var d=new Date(iso); return pad(d.getDate())+'/'+pad(d.getMonth()+1)+' à '+pad(d.getHours())+':'+pad(d.getMinutes()); }

  function init(c){
    cfg=c; KEY=c.me+'_partner_cache';
    try{ P=JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){ P=null; }
  }
  function partner(){ return P; }

  // ── LECTURE : la ligne de l'autre (jamais la mienne) ──
  function pull(force){
    if(!cfg) return Promise.resolve();
    var now=Date.now();
    if(!force&&now-_lastPull<60000) return Promise.resolve();
    var sb=cfg.client&&cfg.client();
    if(!sb){ _err='offline'; render(); return Promise.resolve(); }
    if(_pulling) return Promise.resolve();
    _pulling=true;
    var btn=$('pvRefresh'); if(btn) btn.classList.add('spin');
    return sb.from('partner_state').select('app,data,updated_at').eq('app',cfg.other).order('updated_at',{ascending:false}).limit(1)
      .then(function(r){
        _pulling=false; _lastPull=Date.now();
        if(r.error){
          _missing=/partner_state|does not exist|42P01/i.test(r.error.message||'')||r.error.code==='42P01';
          _err=r.error.message||'erreur'; render(); return;
        }
        _missing=false; _err=null;
        var row=r.data&&r.data[0];
        if(row&&row.data){
          P=row.data; P._updated=row.updated_at;
          try{ localStorage.setItem(KEY,JSON.stringify(P)); }catch(e){}
        }
        render();
      }).catch(function(e){ _pulling=false; _err=e&&e.message||'erreur'; render(); });
  }
  // ── ÉCRITURE : MA ligne seulement (résumé + mon mot + « vu »). Rien d'autre. ──
  function push(){
    if(!cfg||!cfg.snapshot) return;
    if(cfg.canPush&&!cfg.canPush()) return; // ex. pull cloud pas encore réussi / compte croisé → on ne pousse rien
    var sb=cfg.client&&cfg.client(); if(!sb) return;
    var data; try{ data=cfg.snapshot(); }catch(e){ console.warn('[PV] snapshot:',e); return; }
    if(!data) return;
    var json=JSON.stringify(data);
    if(json===_lastPushJson) return; // rien de neuf → pas de requête (batterie/quota)
    sb.auth.getUser().then(function(res){
      var uid=res.data&&res.data.user&&res.data.user.id; if(!uid) return;
      sb.from('partner_state').upsert({user_id:uid,app:cfg.me,data:data,updated_at:new Date().toISOString()},{onConflict:'user_id'})
        .then(function(r){ if(r.error){ if(!/partner_state|42P01/i.test(r.error.message||'')) console.warn('[PV] push:',r.error.message); } else _lastPushJson=json; });
    });
  }

  // ── RENDU (section « Nous deux » en bas du Bilan) ──
  function weekDates(){ var m=addDays(monday(today()),-7*_off); var a=[]; for(var i=0;i<7;i++) a.push(addDays(m,i)); return a; }
  function nav(d){ _off=Math.max(0,Math.min(8,_off+d)); render(); }
  function render(){
    var el=$('bilanPartner'); if(!el||!cfg) return;
    var h='<div class="slbl">💞 Nous deux</div><div class="wn-card pv-card">';
    h+='<div class="pv-head"><span class="pv-ava">'+cfg.otherIco+'</span>'
      +'<div class="pv-id"><div class="pv-name">'+esc(cfg.otherName)+'</div>'
      +'<div class="pv-sub">'+(P&&P._updated?'mis à jour '+ago(P._updated):'sa progression, en lecture')+'</div></div>'
      +'<button class="pv-refresh" id="pvRefresh" onclick="PV.pull(true)" title="Actualiser">↻</button></div>';
    if(!P){
      if(_missing) h+='<div class="pv-empty">☁️ La table <strong>partner_state</strong> n\'existe pas encore côté Supabase — exécute <strong>partner_state.sql</strong> dans le SQL Editor, puis ↻.</div>';
      else if(_err==='offline') h+='<div class="pv-empty">📴 Hors ligne — la progression de '+esc(cfg.otherName)+' s\'affichera à la prochaine connexion.</div>';
      else h+='<div class="pv-empty">'+esc(cfg.otherName)+' n\'a pas encore ouvert son app depuis la mise à jour — dès sa prochaine séance, sa semaine apparaît ici 💫</div>';
    } else {
      var dates=weekDates();
      var days=dates.map(function(d){ return (P.days&&P.days[d])||null; });
      var isCur=_off===0;
      h+='<div class="pv-wnav"><button class="pv-wbtn" onclick="PV.nav(1)" '+(_off>=8?'disabled':'')+'>‹</button>'
        +'<span class="pv-wlbl">'+(isCur?'Cette semaine':'Semaine du '+fmtShort(dates[0]))+'</span>'
        +'<button class="pv-wbtn" onclick="PV.nav(-1)" '+(isCur?'disabled':'')+'>›</button></div>';
      h+='<div class="pv-tiles">'+(cfg.tiles?cfg.tiles(days,dates,P):'')+'</div>';
      h+='<div class="pv-strip">';
      var t=today();
      // Case colorée = sport · contour = mobilité/étirements · les deux = les deux. Zéro emoji (Adrien 26/08).
      dates.forEach(function(d,i){
        var day=days[i];
        var has=!!(day&&cfg.hasContent?cfg.hasContent(day):day);
        var sport=day&&cfg.daySport?cfg.daySport(day):null;
        var mobi=!!(day&&cfg.dayMobi&&cfg.dayMobi(day));
        var salsa=!!(day&&cfg.daySalsa&&cfg.daySalsa(day));
        var cls='pv-d'+(has?' has':'')+(sport?' sport t-'+sport:'')+(mobi?' mobi':'')+(salsa?' salsa':'')+(d===t?' today':'')+(d>t?' fut':'');
        h+='<button class="'+cls+'" '+(has?'onclick="PV.openDay(\''+d+'\')"':'disabled')+'>'
          +'<span class="pv-d-l">'+DAYL[i]+'</span><span class="pv-d-n">'+parseInt(d.slice(8),10)+'</span></button>';
      });
      h+='</div>';
      h+='<div class="pv-hint">touche un jour pour voir son bilan</div>';
    }
    // ── Petit mot ──
    var mine=cfg.getMsg?cfg.getMsg():null;
    var seen=!!(mine&&P&&P.seen===mine.id);
    h+='<div class="pv-msg"><div class="pv-msg-title">💌 Un mot pour '+esc(cfg.otherName)+'<span class="pv-msg-hint">s\'ouvre en animation juste avant sa prochaine séance</span></div>';
    h+='<textarea class="pv-ta" id="pvMsgTxt" rows="2" maxlength="220" placeholder="'+esc(cfg.placeholder||'Écris-lui un petit mot…')+'"></textarea>';
    h+='<div class="pv-msg-row"><span class="pv-status">'+(mine?'Dernier mot envoyé '+fmtAt(mine.at)+' · '+(seen?'<b class="ok">vu ✓</b>':'<b>pas encore ouvert</b>'):'Aucun mot envoyé pour l\'instant')+'</span>'
      +'<button class="pv-send" onclick="PV.send()">Envoyer 💌</button></div>';
    if(mine) h+='<div class="pv-mine">« '+esc(mine.text)+' »</div>';
    if(P&&P.msg&&P.msg.text){
      h+='<div class="pv-last"><div class="pv-last-t">'+cfg.otherIco+' Son dernier mot pour toi <span>'+fmtAt(P.msg.at)+'</span></div>'
        +'<div class="pv-last-x">« '+esc(P.msg.text)+' »</div>'
        +'<button class="pv-replay" onclick="PV.showLove(null,true)">▶ Revoir l\'animation</button></div>';
    }
    h+='</div></div>';
    el.innerHTML=h;
  }
  function send(){
    var ta=$('pvMsgTxt'); if(!ta) return;
    var txt=(ta.value||'').trim();
    if(!txt){ ta.focus(); return; }
    var m={id:String(Date.now()),text:txt.slice(0,220),at:new Date().toISOString()};
    if(cfg.setMsg) cfg.setMsg(m); // persiste dans MA base (→ ma ligne partner_state via la synchro)
    ta.value='';
    push();
    render();
    if(cfg.toast) cfg.toast('💌 Envoyé — '+cfg.otherName+' le verra avant sa prochaine séance');
  }

  // ── Bilan d'un jour de l'autre (lecture seule, dans le modal jour existant) ──
  function openDay(date){
    var day=P&&P.days&&P.days[date]; if(!day) return;
    var t=$('dayModalTitle'), c=$('dayModalContent'), m=$('dayModal');
    if(!t||!c||!m) return;
    t.innerHTML='<div class="dm-date"><span class="dm-date-day">'+esc(cfg.otherName)+' · '+fmtLong(date)+'</span></div>'
      +'<button class="modal-close hc-close" onclick="closeDayModal()">✕</button>';
    var body=''; try{ body=cfg.dayHtml?cfg.dayHtml(date,day):''; }catch(e){ body='<div class="dm-empty">Bilan illisible</div>'; }
    c.innerHTML=body||'<div class="dm-empty">Rien ce jour-là.</div>';
    m.classList.add('open');
  }

  // ── L'ANIMATION 💌 : le mot de l'autre, juste avant le GO ──
  // showLove(cb, force) : si un mot non lu existe → overlay, cb à la fermeture ; sinon cb() direct.
  var _cb=null, _hT=null;
  function showLove(cb,force){
    _cb=cb||null;
    var msg=P&&P.msg;
    var seen=cfg.getSeen?cfg.getSeen():null;
    if(!msg||!msg.text||(!force&&seen===msg.id)){ if(_cb){ var f=_cb; _cb=null; f(); } return; }
    var ov=$('lmOverlay'); if(!ov){ if(_cb){ var g=_cb; _cb=null; g(); } return; }
    if(!force&&cfg.setSeen){ cfg.setSeen(msg.id); push(); } // vu → ma ligne (l'autre voit « vu ✓ »)
    var words=String(msg.text).split(/\s+/).filter(Boolean);
    var wh=''; words.forEach(function(w,i){ wh+='<span class="lm-w" style="animation-delay:'+(1.15+i*0.07).toFixed(2)+'s">'+esc(w)+'</span> '; });
    var em=cfg.loveEmojis||['💗','✨'];
    var hearts='';
    for(var i=0;i<16;i++){
      hearts+='<i style="left:'+(4+Math.random()*92).toFixed(0)+'%;animation-delay:'+(0.9+Math.random()*1.6).toFixed(2)+'s;animation-duration:'+(2.6+Math.random()*1.4).toFixed(2)+'s;font-size:'+(.9+Math.random()*1.1).toFixed(2)+'rem;">'+em[i%em.length]+'</i>';
    }
    ov.innerHTML='<div class="lm-bg"></div>'
      +'<div class="lm-hearts">'+hearts+'</div>'
      +'<div class="lm-stage">'
      +'<div class="lm-env">💌</div>'
      +'<div class="lm-card">'
      +'<div class="lm-from"><span class="lm-ava">'+cfg.otherIco+'</span><span>Un mot de <b>'+esc(cfg.otherName)+'</b></span></div>'
      +'<div class="lm-text">'+wh+'</div>'
      +'<div class="lm-date">écrit '+fmtAt(msg.at)+'</div>'
      +'<button class="lm-cta" onclick="PV.closeLove()">'+esc(cfg.loveCta||'C\'est parti 💪')+'</button>'
      +'</div></div>';
    ov.classList.add('open');
    try{ if(navigator.vibrate) navigator.vibrate([30,40,30]); }catch(e){}
    if(_hT) clearTimeout(_hT);
    _hT=setTimeout(function(){ var hh=ov.querySelector('.lm-hearts'); if(hh) hh.innerHTML=''; },5200); // particules one-shot → DOM nettoyé
  }
  function closeLove(){
    var ov=$('lmOverlay'); if(ov){ ov.classList.remove('open'); ov.innerHTML=''; }
    if(_hT){ clearTimeout(_hT); _hT=null; }
    if(_cb){ var f=_cb; _cb=null; f(); }
  }
  function hasUnread(){ var m=P&&P.msg; return !!(m&&m.text&&(!cfg.getSeen||cfg.getSeen()!==m.id)); }
  return {init:init,pull:pull,push:push,render:render,nav:nav,openDay:openDay,send:send,showLove:showLove,closeLove:closeLove,partner:partner,hasUnread:hasUnread,esc:esc};
})();
