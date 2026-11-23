// ═══════════════════════════════════════════════════════════════════════════════════════════
// BILAN DE LA SEMAINE v5 (16/11/2026, demandes Adrien) — pages Nutrition détaillée, Pas & sommeil,
// verdict sans bulles imbriquées et « 3 leviers » chiffrés à la place des conseils génériques du dimanche.
// Retours d'Adrien : « bug nombre de séries (écart tableau / phrase) », « bulles buggées, moches »,
// « la notation ne prend pas en compte mes derniers retours (encore écrit shakers…) »,
// « les trucs en mode conseils du dimanche c'est nul ».
// Module PUR (lecture seule) : il ne fait que calculer et rendre du HTML. Appelé par wrRender (app-7-bilans.js)
// au moment de l'affichage — jamais au chargement. Dépendances : INTAKE, STEPS, SLEEP, DB, rankAddDays,
// volScale/volTier/RADAR_GROUPS (app-2), bilanNoteWeek/noteWeekDetail (app-7).
// ═══════════════════════════════════════════════════════════════════════════════════════════
var WK=(function(){
  var NB='\u202f';
  function nf(n,dec){ if(n==null||isNaN(n)) return '—'; var f=Math.pow(10,dec||0); return (Math.round(n*f)/f).toLocaleString('fr-FR').replace(/\u00a0/g,NB); }
  function day(ws,i){ return rankAddDays(ws,i); }
  function today(){ return todayStr(); }
  var DAYL=['lun','mar','mer','jeu','ven','sam','dim'];
  function dayLbl(d){ var i=(new Date(d+'T12:00:00').getDay()+6)%7; return DAYL[i]; }
  function hm(min){ if(min==null) return '—'; min=((Math.round(min)%1440)+1440)%1440; return Math.floor(min/60)+' h '+String(min%60).padStart(2,'0'); }
  function dur(min){ if(min==null) return '—'; min=Math.round(min); return Math.floor(min/60)+' h'+(min%60?' '+String(min%60).padStart(2,'0'):''); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function goalOf(k){ var n=(typeof INTAKE!=='undefined'&&INTAKE.NUT)?INTAKE.NUT.filter(function(x){ return x.k===k; })[0]:null; return n||null; }

  // ── NUTRITION : 7 jours de Yazio (jours COMPLETS seulement, comme les moyennes du Bilan — 09/11) ──
  function nut(ws){
    var keys=['kcal','glu','prot','lip','fib','sucre','sat','sodium','potassium'];
    var days=[], sums={}, cnt={};
    keys.forEach(function(k){ sums[k]=0; cnt[k]=0; });
    for(var i=0;i<7;i++){
      var d=day(ws,i), fut=d>=today(), ok=!fut&&typeof INTAKE!=='undefined'&&INTAKE.complete(d);
      var row={d:d,fut:fut,ok:ok};
      keys.forEach(function(k){ var v=ok?INTAKE.val(d,k):null; row[k]=v; if(v!=null){ sums[k]+=v; cnt[k]++; } });
      days.push(row);
    }
    var avg={}; keys.forEach(function(k){ avg[k]=cnt[k]?sums[k]/cnt[k]:null; });
    var noted=days.filter(function(r){ return r.kcal!=null; });
    var low=null, high=null; noted.forEach(function(r){ if(!low||r.kcal<low.kcal) low=r; if(!high||r.kcal>high.kcal) high=r; });
    var SZ=(typeof SAISON!=='undefined')?SAISON.cfg(ws):null;
    var NZ=SZ&&SZ.note?SZ.note:{kcalLo:2600,kcalHi:null,protDay:135};
    var kd=0, pd=0; noted.forEach(function(r){ if(r.kcal>=NZ.kcalLo&&(NZ.kcalHi==null||r.kcal<=NZ.kcalHi)) kd++; if(r.prot!=null&&r.prot>=NZ.protDay) pd++; });
    var past=days.filter(function(r){ return !r.fut; }).length;
    return {ws:ws,days:days,avg:avg,cnt:cnt,noted:noted.length,past:past,missing:past-noted.length,low:low,high:high,NZ:NZ,kcalDays:kd,protDays:pd,seche:!!(SZ&&SZ.id==='seche')};
  }
  // Diagnostic nutrition : chaque cas a SES solutions (plusieurs, variées) — pas un conseil passe-partout.
  // sev : 3 = gros levier · 2 = à corriger · 1 = détail · 0 = bien
  function nutDiag(N){
    var out=[], A=N.avg, gK=goalOf('kcal'), gG=goalOf('glu'), gP=goalOf('prot'), gL=goalOf('lip'), gF=goalOf('fib'), gS=goalOf('sucre'), gSat=goalOf('sat'), gNa=goalOf('sodium');
    if(!N.noted) return [{sev:3,t:'Rien de Yazio cette semaine',w:'Sans données, impossible de juger tes calories — et la note compte ces jours comme ratés.',o:['Note au moins le dîner et le plus gros repas : une estimation vaut mieux qu’un trou.','Fais ↻ le soir : le raccourci Santé envoie tes totaux Yazio.']}];
    if(N.missing>=2) out.push({sev:2,t:N.missing+' jours sans Yazio',w:'Un jour non noté compte comme raté dans la note (jours ≥ '+nf(N.NZ.kcalLo)+' kcal).',o:['Même approximatif : « plat livré ≈ 900 kcal » suffit.','Scanne les codes-barres le jour même, pas le lendemain.']});
    if(A.kcal!=null&&gK){
      var gap=gK.goal-A.kcal;
      if(N.seche){
        if(A.kcal>(N.NZ.kcalHi||gK.goal+150)) out.push({sev:3,t:'Au-dessus du déficit : '+nf(A.kcal)+' kcal/jour',w:'Zone visée : '+nf(N.NZ.kcalLo)+'-'+nf(N.NZ.kcalHi)+' kcal.',o:['Les lipides partent en premier : sauce, fromage, huile mesurée à la cuillère.','Garde les glucides autour de la séance, allège le soir.']});
      } else if(gap>150){
        var dips=N.low&&N.high&&(N.high.kcal-N.low.kcal)>900;
        var w='Il manque '+nf(gap)+' kcal par jour en moyenne pour l’objectif ('+nf(gK.goal)+').';
        var o=[];
        if(A.glu!=null&&gG&&A.glu<gG.goal-40) o.push('Glucides ('+nf(A.glu)+' g / '+nf(gG.goal)+') : +150 g de riz ou de pâtes cuits au repas = +200 kcal.','Petit-déj express : 60 g de flocons d’avoine + lait + banane = +450 kcal.','2 tranches de pain complet + miel en collation = +250 kcal.');
        if(A.lip!=null&&gL&&A.lip<gL.goal-10) o.push('1 c. à soupe d’huile d’olive sur le plat = +120 kcal, sans volume en plus.','30 g d’amandes ou de noix de cajou = +180 kcal.');
        if(!o.length) o.push('Un shaker « calories liquides » : 300 ml de lait entier + 1 dose de whey + 40 g d’avoine + 1 banane ≈ 650 kcal, en 2 minutes.','Ajoute une collation fixe à 16 h (fromage blanc + granola ≈ 350 kcal).');
        if(dips) o.unshift('Ton jour le plus bas ('+dayLbl(N.low.d)+' : '+nf(N.low.kcal)+' kcal) fait chuter la moyenne : prévois ce jour-là un plat déjà prêt.');
        out.push({sev:gap>400?3:2,t:'Calories : '+nf(A.kcal)+' kcal/jour',w:w,o:o.slice(0,4)});
      } else if(A.kcal>gK.goal+300){
        out.push({sev:1,t:'Calories au-dessus : '+nf(A.kcal)+' kcal/jour',w:'Objectif '+nf(gK.goal)+'. Pas grave en prise si la balance suit (+0,2 à 0,35 kg/sem).',o:['Regarde la page Poids : si ça monte plus vite que 0,35 kg/sem, retire une collation.']});
      } else out.push({sev:0,t:'Calories dans la cible : '+nf(A.kcal)+' kcal/jour',w:N.kcalDays+'/7 jours au-dessus de '+nf(N.NZ.kcalLo)+' kcal.',o:[]});
    }
    if(A.prot!=null&&gP){
      if(A.prot<gP.goal-10) out.push({sev:A.prot<gP.goal-30?3:2,t:'Protéines : '+nf(A.prot)+' g/jour',w:'Objectif '+nf(gP.goal)+' g : il manque '+nf(gP.goal-A.prot)+' g par jour.',o:['1 dose de whey dans ton shaker de créatine = +24 g.','250 g de skyr ou de fromage blanc = +20 à 25 g.','3 œufs au petit-déj = +19 g.','150 g de poulet ou de thon au lieu de 100 g = +12 g.']});
      else out.push({sev:0,t:'Protéines : '+nf(A.prot)+' g/jour',w:N.protDays+'/7 jours au-dessus de '+N.NZ.protDay+' g.',o:[]});
    }
    if(A.lip!=null&&gL&&A.lip>(gL.max||gL.goal)) out.push({sev:2,t:'Lipides : '+nf(A.lip)+' g/jour (max '+nf(gL.max||gL.goal)+')',w:'Le gras prend la place des glucides qui nourrissent tes séances.',o:['Livraison : poulet grillé plutôt que pané, sauce tomate plutôt que crème.','Fromage une fois par jour, pas à chaque repas.','Échange 10 g de lipides (90 kcal) contre 25 g de glucides : même calories, meilleures séances.']});
    if(A.sat!=null&&gSat&&A.sat>gSat.goal) out.push({sev:1,t:'Graisses saturées : '+nf(A.sat)+' g/jour (max '+gSat.goal+')',w:'Beurre, fromage, charcuterie, fast-food.',o:['Huile d’olive à la place du beurre en cuisine.','Jambon de volaille plutôt que saucisson.']});
    if(A.fib!=null&&gF&&A.fib<(gF.low||gF.goal)) out.push({sev:1,t:'Fibres : '+nf(A.fib)+' g/jour (objectif '+gF.goal+')',w:'Digestion, satiété, et tu absorbes mieux un gros volume de nourriture.',o:['1 fruit par jour en plus (pomme, poire, banane).','Pain complet à la place du blanc.','Lentilles ou pois chiches 2 fois par semaine.']});
    if(A.sucre!=null&&gS&&A.sucre>gS.goal) out.push({sev:1,t:'Sucres : '+nf(A.sucre)+' g/jour (max '+gS.goal+')',w:'Céréales sucrées, biscuits, boissons.',o:['Garde le sucré autour de la séance (avant ou juste après).','Avoine + miel plutôt que céréales sucrées le matin.']});
    if(A.sodium!=null&&N.cnt.sodium>=3&&gNa&&A.sodium>gNa.goal) out.push({sev:1,t:'Sel : '+nf(A.sodium)+' mg de sodium/jour',w:'Souvent les plats livrés et préparés.',o:['Bois 2,5 L d’eau ces jours-là.','Un plat maison de plus par semaine fait déjà baisser la moyenne.']});
    return out.sort(function(a,b){ return b.sev-a.sev; });
  }

  // ── PAS & SOMMEIL ──
  // Nuits : clé = date du SOIR (SLEEP._night) — même fenêtre que la note v5 (dimanche soir d'avant → samedi soir).
  function act(ws){
    var sw=typeof STEPS!=='undefined'?STEPS.week(ws):null, goal=50000;
    var steps=sw?sw.days.map(function(x){ return {d:x.d,v:x.v,fut:x.fut||x.d>today()}; }):[];
    var low=steps.filter(function(x){ return !x.fut&&x.v!=null&&x.v<1000; });
    var best=null; steps.forEach(function(x){ if(x.v!=null&&!x.fut&&(!best||x.v>best.v)) best=x; });
    var nights=[];
    for(var n=0;n<7;n++){
      var k=typeof wrNightKey==='function'?wrNightKey(ws,n):day(ws,n-1), e=(DB.sleepLog||{})[k], m=null, bed=null;
      if(e&&e.bed&&e.wake&&typeof SLEEP!=='undefined'){ m=SLEEP._duration(e.bed,e.wake); var bm=Number(e.bed.slice(0,2))*60+Number(e.bed.slice(3)); bed=bm<18*60?bm+1440:bm; }
      nights.push({k:k,m:m,bed:bed,wake:e&&e.wake||null});
    }
    var withM=nights.filter(function(x){ return x.m!=null; });
    var avgM=withM.length?withM.reduce(function(s,x){ return s+x.m; },0)/withM.length:null;
    var beds=nights.filter(function(x){ return x.bed!=null; }).map(function(x){ return x.bed; });
    var avgBed=beds.length?beds.reduce(function(s,b){ return s+b; },0)/beds.length:null;
    var spread=beds.length>=3?Math.max.apply(null,beds)-Math.min.apply(null,beds):null;
    var ok7=withM.filter(function(x){ return x.m>=420; }).length;
    return {ws:ws,steps:steps,sum:sw?sw.sum:0,avg:sw?sw.avg:null,n:sw?sw.n:0,goal:goal,low:low,best:best,
      nights:nights,noted:withM.length,avgM:avgM,avgBed:avgBed,spread:spread,ok7:ok7,lateBed:beds.length?Math.max.apply(null,beds):null,earlyBed:beds.length?Math.min.apply(null,beds):null};
  }
  function actDiag(S){
    var out=[];
    if(!S.n) out.push({sev:2,t:'Pas non reçus',w:'Le raccourci Santé n’a rien envoyé cette semaine.',o:['Fais ↻ sur le Bilan : il envoie les pas et Yazio en une fois.']});
    else{
      var miss=Math.max(0,S.goal-S.sum), past=S.steps.filter(function(x){ return !x.fut; }).length||7;
      if(miss>0){
        var perDay=miss/7, min=Math.round(perDay/100);
        var o=['Marche de '+Math.max(10,min)+' min par jour en plus (≈ 100 pas/min) : c’est tout ce qui manque.','Après le dîner : 15 min dehors (≈ 1 800 pas), ça aide aussi à t’endormir plus tôt.','Les appels au téléphone, en marchant.'];
        if(S.low.length) o.unshift(S.low.length+' jour'+(S.low.length>1?'s':'')+' sans sortir ('+S.low.map(function(x){ return dayLbl(x.d); }).join(', ')+') : une seule sortie de 15 min suffit à passer les 1 000 pas.');
        out.push({sev:miss>20000?3:2,t:nf(S.sum)+' pas sur '+nf(S.goal),w:'Il manque '+nf(miss)+' pas, soit ~'+nf(perDay)+' par jour.'+(S.low.length?' Dès le 4 janvier, chaque jour sous 1 000 pas coûtera 0,5 point.':''),o:o.slice(0,4)});
      } else out.push({sev:0,t:nf(S.sum)+' pas : objectif tenu',w:'Meilleur jour : '+(S.best?dayLbl(S.best.d)+' ('+nf(S.best.v)+')':'—')+'.',o:[]});
    }
    if(!S.noted) out.push({sev:1,t:'Aucune nuit notée',w:'La note compte les nuits de 7 h ou plus (1 point).',o:['Note ta nuit le matin (rappel à 9 h 30 dans les réglages).']});
    else{
      var short=S.avgM!=null&&S.avgM<420, late=S.avgBed!=null&&S.avgBed>=25*60, irr=S.spread!=null&&S.spread>=120;
      if(short||late||irr){
        var o2=[];
        if(late){ var aim=Math.max(23*60+30,Math.round((S.avgBed-45)/15)*15); o2.push('Vise '+hm(aim)+' au lit (45 min plus tôt que ta moyenne) : tu t’entraînes le matin, ton corps récupère la nuit.'); }
        if(irr) o2.push('Couchers entre '+hm(S.earlyBed)+' et '+hm(S.lateBed)+' : fixe surtout l’heure de LEVER, même le week-end, le coucher suit.');
        if(short) o2.push('Il manque '+nf(420-S.avgM)+' min par nuit pour 7 h : décale le réveil seulement si tu ne peux pas te coucher plus tôt.');
        o2.push('Écran coupé 30 min avant, et pas de café après 16 h.');
        out.push({sev:(short?2:1)+(late?1:0),t:'Sommeil : '+dur(S.avgM)+' par nuit, coucher '+hm(S.avgBed),w:S.ok7+'/7 nuits de 7 h ou plus'+(S.noted<7?' ('+(7-S.noted)+' non notée'+(7-S.noted>1?'s':'')+')':'')+'.',o:o2.slice(0,4)});
      } else out.push({sev:0,t:'Sommeil : '+dur(S.avgM)+' par nuit',w:S.ok7+'/7 nuits de 7 h ou plus, coucher moyen '+hm(S.avgBed)+'.',o:[]});
    }
    return out.sort(function(a,b){ return b.sev-a.sev; });
  }

  // ── LES 3 LEVIERS : là où la note a perdu le plus de points, avec l'action chiffrée qui les récupère ──
  function levers(B,ws,A){
    if(!B||B.v!==5) return [];
    var D=noteWeekDetail(B), k20=20/(B.maxRaw||20), N=null, S=null;
    try{ N=nut(ws); }catch(e){} try{ S=act(ws); }catch(e){}
    var L=[];
    D.pil.forEach(function(P){ P.c.forEach(function(c){
      var lost=(c[3]-c[2])*k20; if(lost<0.25) return;
      var lb=c[0], act='';
      if(lb==='Assiduité') act='Bloque tes '+B.goal+' séances dans l’agenda dès lundi (jours fixes). Une séance manquée coûte ~'+nf(2.5*k20,1)+' pt.';
      else if(lb==='Qualité'&&/pas de note/.test(c[1])) act='Fais tes séances en LiveUp : sans note de séance, la qualité compte 0.';
      else if(lb==='Qualité'){ var e=A&&A.topErrs&&A.topErrs[0]; act=e?'Sur '+e.name+' : S1 à OK, S2 à DUR, l’échec seulement à la dernière série.':'Garde 2 reps en réserve en S1 : c’est l’échec trop tôt qui coûte le plus.'; }
      else if(/kcal|déficit/.test(lb)){ var g=goalOf('kcal'); act=N&&N.noted?(N.missing?N.missing+' jour'+(N.missing>1?'s':'')+' sans Yazio comptent comme ratés : note-les, même approximatifs. ':'')+(N.low&&N.low.kcal<N.NZ.kcalLo?'Ton jour le plus bas : '+dayLbl(N.low.d)+' ('+nf(N.low.kcal)+' kcal). Ces jours-là, ajoute un shaker de 650 kcal (lait entier, whey, avoine, banane).':''):'Note Yazio chaque jour : un jour vide compte comme raté.'; if(!act) act='Garde au moins '+nf(N.NZ.kcalLo)+' kcal chaque jour.'; }
      else if(/protéines/.test(lb)) act='+1 dose de whey ou 250 g de skyr chaque jour = +20 à 25 g.';
      else if(lb==='Créatine') act='5 g chaque jour, à heure fixe (au réveil ou avec le café), séance ou pas.';
      else if(lb==='Pas') act=S?'Il manque '+nf(Math.max(0,S.goal-S.sum))+' pas : ~'+nf(Math.max(0,S.goal-S.sum)/700)+' min de marche par jour.':'Marche 20 min par jour.';
      else if(/Nuits/.test(lb)) act=S&&S.avgBed!=null?'Coucher moyen '+hm(S.avgBed)+' : vise 45 min plus tôt, lever à heure fixe.':'Note tes nuits et vise 7 h.';
      else if(lb==='Course') act='20-25 min faciles une fois dans la semaine.';
      else act='À travailler.';
      L.push({l:lb,pil:P.l,i:P.i,lost:lost,a:act,v:c[1]});
    }); });
    D.malus.forEach(function(m){ L.push({l:m.l,pil:'Malus',i:'⚠️',lost:m.p,a:/pesée/i.test(m.l)?'Pèse-toi au moins une fois (idéal : 3 matins, à jeun).':'Sors au moins 15 min par jour.',v:''}); });
    return L.sort(function(a,b){ return b.lost-a.lost; }).slice(0,3);
  }

  // ── Volume par muscle : phrases alignées sur les MÊMES seuils que les barres (volTier, 01/11) ──
  function volNotes(vol){
    var by={blood:[],low:[],ok:[],gold:[],over:[]};
    RADAR_GROUPS.forEach(function(g){ var v=vol[g.label]||0; by[volTier(g.label,v)].push(g.label+' '+Math.round(v)); });
    var c=volScale('Pecs'), out=[];
    if(by.gold.length) out.push({tone:'gold',t:'Zone gold',l:by.gold,s:c.gold+' à 25 séries : le volume qui fait grandir. À tenir, pas à dépasser.'});
    if(by.ok.length) out.push({tone:'ok',t:'Ça construit',l:by.ok,s:c.blue+' à '+(c.gold-1)+' séries.'});
    if(by.low.length) out.push({tone:'low',t:'Ça entretient',l:by.low,s:c.grey+' à '+(c.blue-1)+' séries : 2 séries de plus par séance et ça passe au bleu.'});
    if(by.blood.length) out.push({tone:'blood',t:'Pas assez',l:by.blood,s:'Sous '+c.grey+' séries (abdos : sous '+volScale('Abdos').grey+') : le muscle ne progresse pas.'});
    if(by.over.length) out.push({tone:'over',t:'Trop',l:by.over,s:'Au-delà de 25 séries, la récupération ne suit plus.'});
    return out;
  }
  function volLegend(){ var c=volScale('Pecs'), a=volScale('Abdos'); return '&lt;'+c.grey+' pas assez · '+c.grey+'-'+(c.blue-1)+' entretient · '+c.blue+'-'+(c.gold-1)+' construit · '+c.gold+'+ gold'+(a.blue!==c.blue?' · abdos : '+a.blue+'+ construit':''); }

  // ── RENDU ──
  function bars(list,opt){
    // list : [{lbl, v, cls, txt}] — opt : {max, line, lineLbl}
    var mx=opt.max||1;
    var h='<div class="wk-bars" role="img" aria-label="'+esc(opt.aria||'')+'">';
    // géométrie fixe (semaine.css) : libellé du bas 16 px + écart 4 px, piste de 96 px
    if(opt.line) h+='<i class="wk-bars__line" aria-hidden="true" style="bottom:'+(20+Math.min(1,opt.line/mx)*96).toFixed(1)+'px"></i>';
    list.forEach(function(x){
      var p=x.v!=null?Math.max(3,Math.min(100,x.v/mx*100)):0;
      h+='<div class="wk-bars__col"><span class="wk-bars__val">'+(x.txt!=null?x.txt:'')+'</span><span class="wk-bars__trk"><i class="'+(x.cls||'')+'" style="height:'+p.toFixed(1)+'%"></i></span><span class="wk-bars__lbl">'+x.lbl+'</span></div>';
    });
    return h+'</div>'+(opt.lineLbl?'<div class="wk-bars__legend">'+opt.lineLbl+'</div>':'');
  }
  function diagHtml(list){
    return list.map(function(x){
      var cls=x.sev>=3?'is-hot':x.sev===2?'is-warn':x.sev===1?'is-info':'is-ok';
      return '<div class="wk-diag '+cls+'"><div class="wk-diag__t">'+esc(x.t)+'</div>'+(x.w?'<div class="wk-diag__w">'+esc(x.w)+'</div>':'')
        +(x.o&&x.o.length?'<ul class="wk-diag__o">'+x.o.map(function(o){ return '<li>'+esc(o)+'</li>'; }).join('')+'</ul>':'')+'</div>';
    }).join('');
  }
  function macroRow(k,v){
    var n=goalOf(k); if(!n) return '';
    var ref=n.kind==='target'?(n.max||n.goal):n.goal, p=v!=null?Math.min(100,v/ref*100):0;
    var state=v==null?'':n.kind==='max'?(v>n.goal?'is-warn':'is-ok'):n.kind==='target'?(v>(n.max||n.goal)?'is-warn':'is-ok'):(v>=n.goal?'is-ok':v>=(n.low||n.goal*0.85)?'':'is-warn');
    var tag=v==null?'non noté':n.kind==='max'?(v>n.goal?'au-dessus':'✓ sous le max'):n.kind==='target'?(v>(n.max||n.goal)?'au-dessus':'✓ cible'):(v>=n.goal?'✓ objectif':Math.round(v/n.goal*100)+NB+'%');
    return '<div class="wk-mac"><div class="wk-mac__top"><span class="wk-mac__n">'+n.lbl+'</span><span class="wk-mac__v">'+(v!=null?nf(v):'—')+'<small> / '+nf(n.goal)+' '+n.u+(n.kind==='max'?' max':'')+'</small></span></div>'
      +'<div class="bl-trk"><i class="'+state+'" style="width:'+p.toFixed(0)+'%;'+(state?'':'background:var(--in-'+n.col+')')+'"></i></div><div class="wk-mac__tag '+state+'">'+tag+'</div></div>';
  }
  function stepper(field,label,sub,max){
    var v=WR[field]==null?0:WR[field];
    return '<div class="wk-step"><div class="wk-step__txt"><div class="wk-step__l">'+label+'</div><div class="wk-step__s">'+sub+'</div></div>'
      +'<button type="button" class="wk-step__b" aria-label="Moins" onclick="wrSetCount(\''+field+'\','+Math.max(0,v-1)+')"'+(v<=0?' disabled':'')+'>−</button>'
      +'<span class="wk-step__v" aria-live="polite">'+v+'</span>'
      +'<button type="button" class="wk-step__b" aria-label="Plus" onclick="wrSetCount(\''+field+'\','+Math.min(max,v+1)+')"'+(v>=max?' disabled':'')+'>+</button></div>';
  }
  function nutHtml(ws,A){
    var N=nut(ws), gK=goalOf('kcal'), h='';
    h+='<div class="wr-say">Ton carburant, jour par jour.</div>';
    h+='<div class="wk-hero"><span class="wk-hero__v">'+(N.avg.kcal!=null?nf(N.avg.kcal):'—')+'</span><span class="wk-hero__u">kcal / jour</span></div>';
    h+='<div class="wk-sub">'+(N.noted?'moyenne sur '+N.noted+' jour'+(N.noted>1?'s':'')+' complet'+(N.noted>1?'s':'')+' · objectif '+nf(gK?gK.goal:3000):'aucun jour reçu de Yazio')+'</div>';
    var mx=Math.max(gK?gK.goal*1.15:3400,N.high?N.high.kcal*1.05:0);
    h+=bars(N.days.map(function(r){ var ok=r.kcal!=null&&r.kcal>=N.NZ.kcalLo&&(N.NZ.kcalHi==null||r.kcal<=N.NZ.kcalHi);
      return {lbl:dayLbl(r.d),v:r.kcal,cls:r.kcal==null?'':ok?'is-ok':'is-warn',txt:r.kcal!=null?nf(r.kcal/1000,1)+'k':(r.fut?'':'—')}; }),
      {max:mx,line:N.NZ.kcalLo,lineLbl:'— trait : '+nf(N.NZ.kcalLo)+' kcal, le seuil qui compte dans la note ('+N.kcalDays+'/7 jours)',aria:'Calories par jour'});
    h+='<div class="wk-sec">Macros · moyenne</div>';
    h+=macroRow('glu',N.avg.glu)+macroRow('prot',N.avg.prot)+macroRow('lip',N.avg.lip);
    h+='<div class="wk-sec">Le reste</div><div class="wk-mini">'
      +[['fib','Fibres'],['sucre','Sucres'],['sat','Saturées'],['sodium','Sodium']].map(function(p){ var n=goalOf(p[0]), v=N.avg[p[0]];
        var bad=v!=null&&n&&(n.kind==='max'?v>n.goal:v<(n.low||n.goal));
        return '<div class="wk-mini__c"><span class="wk-mini__n">'+p[1]+'</span><span class="wk-mini__v '+(v==null?'':bad?'is-warn':'is-ok')+'">'+(v!=null?nf(v):'—')+'<small> '+(n?n.u:'')+'</small></span><span class="wk-mini__g">'+(n?(n.kind==='max'?'max ':'obj. ')+nf(n.goal):'')+'</span></div>'; }).join('')+'</div>';
    h+='<div class="wk-sec">Ce qu’il faut en retenir</div>'+diagHtml(nutDiag(N));
    h+='<div class="wk-sec">À confirmer</div>';
    h+=stepper('shaker','🥤 Créatine','jours pris · compte 1 pt dans la note',7);
    h+=stepper('maison','🍲 Plats maison','sur 14 repas · ne compte plus dans la note, juste le suivi',14);
    // Poids : la conséquence directe des calories
    if(A&&A.bwDelta!=null&&A.bwEnd){
      var r=A.bwDelta, sz=typeof SAISON!=='undefined'&&SAISON.is('seche',ws);
      var good=sz?(r<=-0.35&&r>=-0.55):(r>=0.15&&r<=0.4);
      var msg=sz?(r>-0.15?'Ça ne baisse pas : si ça dure 2 semaines, + 20-30 min de cardio salle.':r>-0.35?'Ça baisse, un peu lentement (zone −0,35 à −0,55 kg/sem).':r>=-0.55?'Pile dans la zone de sèche.':'Trop rapide : remonte ~150 kcal, on veut perdre du gras, pas du muscle.')
        :(r>0.4?'Au-dessus de la zone (0,2-0,35 kg/sem) : si ça se répète 2 semaines, retire ~150 kcal.':r>=0.15?'Dans la zone de prise propre (0,2-0,35 kg/sem). Continue.':r>=-0.2?'Stable : en prise, c’est le signal de manger un peu plus.':'En baisse en pleine prise : il manque des calories.');
      h+='<div class="wk-sec">Ton poids</div><div class="wk-bw"><span class="wk-bw__v">'+nf(A.bwEnd.weight_kg,1)+'<small> kg</small></span><span class="wk-bw__d '+(good?'is-ok':'is-warn')+'">'+(r>0?'+':'')+nf(r,1)+' kg</span></div><div class="wk-p">'+msg+'</div>';
    }
    return h;
  }
  function actHtml(ws){
    var S=act(ws), h='';
    h+='<div class="wr-say">Ce qui se passe hors de la salle.</div>';
    h+='<div class="wk-sec wk-sec--first">👟 Pas</div>';
    h+='<div class="wk-hero"><span class="wk-hero__v">'+nf(S.sum)+'</span><span class="wk-hero__u">/ '+nf(S.goal)+' pas</span></div>';
    h+='<div class="bl-trk bl-trk--lg wk-trk"><i class="'+(S.sum>=S.goal?'is-done':'')+'" style="width:'+Math.min(100,S.sum/S.goal*100).toFixed(0)+'%"></i></div>';
    var mx=Math.max(10000,S.best?S.best.v*1.05:0);
    h+=bars(S.steps.map(function(x){ return {lbl:dayLbl(x.d),v:x.v,cls:x.v==null?'':x.v<1000?'is-hot':x.v<5000?'is-warn':x.v>=7000?'is-ok':'',txt:x.v!=null?nf(x.v/1000,1)+'k':(x.fut?'':'—')}; }),
      {max:mx,line:S.goal/7,lineLbl:'— trait : '+nf(S.goal/7)+' pas/jour pour l’objectif',aria:'Pas par jour'});
    h+='<div class="wk-sec">😴 Sommeil</div>';
    h+='<div class="wk-duo"><div><span class="wk-duo__v">'+dur(S.avgM)+'</span><span class="wk-duo__l">par nuit</span></div><div><span class="wk-duo__v">'+hm(S.avgBed)+'</span><span class="wk-duo__l">coucher moyen</span></div><div><span class="wk-duo__v">'+S.ok7+'<small>/7</small></span><span class="wk-duo__l">nuits ≥ 7 h</span></div></div>';
    // Dès la semaine du 23/11 : nuits du lundi soir au dimanche soir, étiquetées par le soir du coucher
    var eve=typeof WR_MORNING_FROM!=='undefined'&&ws>=WR_MORNING_FROM;
    h+=bars(S.nights.map(function(x){ return {lbl:dayLbl(eve?x.k:rankAddDays(x.k,1)),v:x.m,cls:x.m==null?'':x.m>=420?'is-ok':x.m>=360?'is-warn':'is-hot',txt:x.m!=null?(Math.round(x.m/6)/10).toString().replace('.',',')+'h':'—'}; }),
      {max:600,line:420,lineLbl:'— trait : 7 h ('+(eve?'nuit du jour indiqué → réveil le lendemain':'nuit du jour d’avant → réveil le jour indiqué')+')',aria:'Durée de sommeil par nuit'});
    h+='<div class="wk-sec">Ce qu’il faut en retenir</div>'+diagHtml(actDiag(S));
    var runOn=typeof RUN_REQ_START!=='undefined'&&ws>=RUN_REQ_START;
    h+='<div class="wk-sec">À confirmer</div>'+stepper('run','🏃 Course','sorties'+(runOn?' · 1 obligatoire, compte 1 pt':' · comptera dans la note dès le 4 janvier'),3);
    return h;
  }
  function verdictHtml(B,ws,A,theme){
    var D=noteWeekDetail(B), h='', f=function(x){ return nf(x,1); };
    h+='<div class="wr-say">Le verdict de ta semaine.</div>';
    h+='<div class="wr-hero-wrap">'+(theme?'<div class="wr-halo"></div>':'')
      +(B.note>=18?'<div class="wr-confetti"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>':'')
      +'<div class="wr-note20 '+note20Cls(B.note)+'"><span class="wr-note20-v" data-cu="'+B.note+'"'+(B.note%1?' data-cu-dec="1"':'')+'>0</span><span class="wr-note20-sur">/20</span></div></div>';
    if(B.note>=18) h+='<div class="wr-badge gold">👑 Semaine en or</div>';
    else if(B.note>=14) h+='<div class="wr-badge blue">💪 Le standard MASSUP</div>';
    h+='<div class="wk-detail">'+D.pil.map(function(P){
      return '<div class="wk-pil"><div class="wk-pil__top"><span class="wk-pil__l">'+P.i+' '+P.l+'</span><span class="wk-pil__p">'+f(P.p)+'<small> / '+P.m+'</small></span></div>'
        +'<div class="bl-trk"><i class="'+(P.p>=P.m*0.85?'is-done':P.p<P.m*0.5?'is-warn':'')+'" style="width:'+Math.min(100,P.p/P.m*100).toFixed(0)+'%"></i></div>'
        +'<div class="wk-pil__c">'+P.c.map(function(c){ return '<span>'+esc(c[0])+' <b>'+esc(c[1])+'</b> <em>'+f(c[2])+'/'+c[3]+'</em></span>'; }).join('')+'</div></div>';
    }).join('')
      +D.malus.map(function(m){ return '<div class="wk-malus"><span>⚠️ '+esc(m.l)+'</span><b>−'+f(m.p)+'</b></div>'; }).join('')
      +(B.scaled?'<div class="wk-foot">Total sur '+B.maxRaw+', ramené sur 20.</div>':'')+'</div>';
    var L=levers(B,ws,A);
    if(L.length){
      h+='<div class="wk-sec">Tes 3 leviers pour la semaine prochaine</div><ol class="wk-lev">'+L.map(function(x){
        return '<li><div class="wk-lev__top"><span>'+x.i+' '+esc(x.l)+(x.v?' · '+esc(x.v):'')+'</span><b>+'+f(x.lost)+' pt</b></div><div class="wk-lev__a">'+esc(x.a)+'</div></li>';
      }).join('')+'</ol>';
    } else h+='<div class="wk-p wk-p--good">Rien à grappiller : même plan la semaine prochaine.</div>';
    return h;
  }
  return {nut:nut,nutDiag:nutDiag,act:act,actDiag:actDiag,levers:levers,volNotes:volNotes,volLegend:volLegend,nutHtml:nutHtml,actHtml:actHtml,verdictHtml:verdictHtml,_hm:hm};
})();
