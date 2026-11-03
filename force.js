"use strict";
/* ═══ 💪 INDICE DE FORCE (03/11/2026, demande d'Adrien — plan étape 4) ═══
   Progression, sous « Évolution des poids » : UNE courbe de sa force générale, base 100 au début de la saison
   (la sèche repartira de 100 le 4 janvier — BILAN.SAISONS).
   Exos clés (polyarticulaires, en kg) : développé incliné, chest press, shoulder press · tirage vertical, rowing
   poulie basse · leg press, hip thrust. 1RM estimé d'une série = charge × (1 + reps/30) (Epley, reps plafonnées à 12),
   on garde la meilleure série de la semaine. Indice CHAÎNÉ semaine après semaine : pour chaque exo déjà connu, rapport
   entre son 1RM de la semaine (ou sa dernière valeur s'il n'a pas été fait) et sa valeur précédente ; moyenne
   géométrique des rapports → l'indice avance de ce facteur. Un exo qui démarre en cours de saison ne fausse rien.
   Lecture seule : rien n'est stocké (tout se recalcule depuis DB.logs). */
var FORCE=(function(){
  var KEYS=[['dev_incline','Développé incliné'],['chestpress_v','Chest press'],['shoulder_press','Shoulder press'],
    ['tirage_vert','Tirage vertical'],['rowing_pb','Rowing poulie basse'],['leg_press','Leg press'],['hip_thrust','Hip thrust']];
  var NB=' ', sel=null;
  function e1(w,r){ return w>0&&r>0?w*(1+Math.min(r,12)/30):0; }
  function monday(d){ return rankMonday(d); }
  function season(){
    var S=(typeof BILAN!=='undefined'&&BILAN.SAISONS)||[{id:'masse',lbl:'Prise de masse',start:'2026-03-01',end:'2027-01-03'}];
    var t=todayStr(); for(var i=0;i<S.length;i++){ if(t<=S[i].end) return S[i]; } return S[S.length-1];
  }
  // Meilleur 1RM estimé par exo clé et par semaine (séances LiveUp)
  function weekly(from){
    var W={};
    (DB.logs||[]).forEach(function(l){
      if(!l||!l.date||l.date<from||!l.live||!l.live.exos) return;
      var wk=monday(l.date);
      l.live.exos.forEach(function(x){
        if(!x||!x.key) return;
        var k=KEYS.find(function(K){ return K[0]===x.key; }); if(!k) return;
        (x.sets||[]).forEach(function(st){
          var v=e1(Number(st.w!=null?st.w:x.w),Number(st.reps));
          if(!v) return;
          var e=W[wk]||(W[wk]={});
          if(!e[x.key]||v>e[x.key]) e[x.key]=v;
        });
      });
    });
    return W;
  }
  function model(){
    var sa=season(), W=weekly(sa.start), weeks=Object.keys(W).sort();
    if(!weeks.length) return null;
    var last={}, first={}, idx=100, pts=[];
    weeks.forEach(function(wk){
      // Tous les exos déjà connus entrent dans la moyenne : un exo non travaillé cette semaine compte « inchangé » (rapport 1).
      // Une semaine où seuls 1 ou 2 exos ont bougé ne fait donc pas bondir l'indice (vérifié sur ses vraies séances, 03/11).
      var known=Object.keys(last), logs=known.map(function(k){
        var v=W[wk][k]!=null?W[wk][k]:last[k];
        return Math.log(Math.max(0.8,Math.min(1.25,v/last[k]))); // un écart > 25 % = changement de machine ou erreur
      });
      if(logs.length) idx*=Math.exp(logs.reduce(function(a,b){ return a+b; },0)/logs.length);
      Object.keys(W[wk]).forEach(function(k){ if(!first[k]) first[k]={v:W[wk][k],d:wk}; last[k]=W[wk][k]; });
      pts.push({wk:wk,v:idx,n:Object.keys(W[wk]).length});
    });
    var lastWk=pts[pts.length-1], ref4=null;
    for(var i=pts.length-1;i>=0;i--){ if(pts[i].wk<=rankAddDays(lastWk.wk,-28)){ ref4=pts[i]; break; } }
    var exos=KEYS.filter(function(K){ return first[K[0]]; }).map(function(K){ return {k:K[0],l:K[1],v:last[K[0]],pct:(last[K[0]]/first[K[0]].v-1)*100}; });
    return {sa:sa,pts:pts,cur:lastWk.v,d4:ref4?(lastWk.v/ref4.v-1)*100:null,exos:exos,start:pts[0].wk};
  }
  function fr(v,d){ return Number(v).toFixed(d).replace('.',','); }
  function sg(v,d){ return (v>0?'+':v<0?'−':'±')+fr(Math.abs(v),d); }
  function dshort(s){ return new Date(s+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'}); }
  function chart(M){
    var w=350,h=150, vals=M.pts.map(function(p){ return p.v; }), lo=Math.min.apply(null,vals.concat([100])), hi=Math.max.apply(null,vals.concat([100]));
    var y0=Math.floor((lo-2)/5)*5, y1=Math.ceil((hi+2)/5)*5;
    var X=function(i){ return M.pts.length<2?w/2:4+i/(M.pts.length-1)*(w-8); }, Y=function(v){ return h-(v-y0)/(y1-y0)*h; };
    var line=M.pts.map(function(p,i){ return (i?'L':'M')+X(i).toFixed(1)+' '+Y(p.v).toFixed(1); }).join(' ');
    var s=sel!=null&&M.pts[sel]?sel:null;
    return '<div class="bl-chart fx-chart">'
      +'<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="fx-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acc2);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--acc2);stop-opacity:0"/></linearGradient></defs>'
      +'<line class="fx-base" x1="0" x2="'+w+'" y1="'+Y(100).toFixed(1)+'" y2="'+Y(100).toFixed(1)+'"/>'
      +'<path style="fill:url(#fx-area)" d="'+line+' L'+X(M.pts.length-1).toFixed(1)+' '+h+' L'+X(0).toFixed(1)+' '+h+' Z"/><path class="fx-line" d="'+line+'"/></svg>'
      +'<span class="bl-chart__tag" style="top:'+(Y(100)/h*100).toFixed(1)+'%">base 100</span>'
      +(s!=null?'<i class="bl-chart__v" style="left:'+(X(s)/w*100).toFixed(2)+'%"></i><i class="bl-chart__ring" style="left:'+(X(s)/w*100).toFixed(2)+'%;top:'+(Y(M.pts[s].v)/h*100).toFixed(2)+'%"></i>':'')
      +'<button type="button" class="bl-chart__hit" onclick="FORCE.pick(event,this)" aria-label="Lire une semaine sur la courbe"></button></div>'
      +'<div class="bl-ax"><span>'+dshort(M.pts[0].wk)+'</span><span>'+dshort(M.pts[M.pts.length-1].wk)+'</span></div>';
  }
  function html(){
    var M=model();
    if(!M) return '<div class="bl-empty"><span class="bl-empty__t">Pas encore de séance LiveUp sur tes exos clés cette saison.</span></div>';
    var p=sel!=null&&M.pts[sel]?M.pts[sel]:null;
    var read=p?'<div class="bl-read"><span class="bl-read__d"><span class="bl-mut">Sem. du '+dshort(p.wk)+'</span><span class="bl-num" style="font-size:18px">'+fr(p.v,1)+'</span><span class="bl-mut" style="font-size:12px">'+p.n+' exo'+(p.n>1?'s':'')+'</span></span><button type="button" class="bl-ib" style="margin-right:-10px" onclick="FORCE.unpick()" aria-label="Fermer la lecture">✕</button></div>'
      :'<div class="bl-read"><span>4 dernières semaines</span><span class="'+(M.d4==null?'bl-mut':M.d4>=0?'bl-pos':'bl-neg')+'" style="font-weight:800">'+(M.d4==null?'—':sg(M.d4,1)+NB+'%')+'</span></div>';
    return '<div class="fx-head"><span class="bl-num fx-v"><span class="bl-hero-txt">'+fr(M.cur,1)+'</span></span><span class="fx-s"><b class="'+(M.cur>=100?'bl-pos':'bl-neg')+'">'+sg(M.cur-100,1)+NB+'%</b> depuis le '+dshort(M.start)+'<small>'+M.sa.lbl+' · base 100</small></span></div>'
      +read+chart(M)
      +'<div class="fx-exos">'+M.exos.map(function(e){ return '<div><span>'+e.l+'</span><span class="bl-mut">≈ '+fr(e.v,0)+' kg</span><b class="'+(e.pct>=0?'bl-pos':'bl-neg')+'">'+sg(e.pct,0)+NB+'%</b></div>'; }).join('')+'</div>'
      +'<p class="fx-note">1RM estimé de ta meilleure série (charge × (1 + reps/30)), moyenne de tes exos clés. La sèche repartira de 100 le 4 janvier.</p>';
  }
  function render(){ var el=document.getElementById('forceIdx'); if(el) el.innerHTML=html(); }
  return {
    render:render, model:model,
    pick:function(ev,btn){ var M=model(); if(!M) return; var r=btn.getBoundingClientRect(), x=(ev.clientX-r.left)/r.width, i=M.pts.length<2?0:Math.round(Math.max(0,Math.min(1,(x*350-4)/(350-8)))*(M.pts.length-1)); sel=sel===i?null:i; render(); },
    unpick:function(){ sel=null; render(); }
  };
})();
