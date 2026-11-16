// ══════════════════════════════════════════════════════════════════════════════
// DOULEUR DE FIN DE SÉANCE — module commun MASSUP + Melati (16/11, demande Adrien)
// Avant : 10 grosses zones fixes + « Autre » et UNE intensité par zone (« la douleur en général est
// inutile, ça dépend beaucoup de l'exo »). Maintenant :
//   ① « Où ? » = champ de recherche sur un catalogue complet (muscles, tendons, articulations, avec
//      précision : « Biceps — bas (près du coude) »…), sans accents, par début de mot ; texte libre
//      possible (« ➕ Ajouter ») si rien ne colle ;
//   ② « Sur quels exos ? » = TOUS les exos faits (même complets) + « Hors exo », avec une intensité
//      1-5 PAR exo, et la zone par exo quand il y en a plusieurs ;
//   ③ le niveau d'une zone = le plus haut de ses exos (live.pains [{z,lvl}] garde son format : export,
//      journal du poignet, coach et historique continuent de marcher).
// Données : x.pp = {lvl,z:[zones]} sur l'exo (MASSUP : live.exos[].pp ; Melati : log.painExos),
// AS.end.painOut = la douleur hors exo. x.pain reste « arrêt / écourté à cause de la douleur » (barème).
// Chaque app fournit : asPainCands() (exos proposés), asPainSetStop(x,on), asKeepEndNote(), asSave(), asRender().
// ══════════════════════════════════════════════════════════════════════════════
// [clé, libellé, mots-clés de recherche] — les 10 clés d'avant le 16/11 sont gardées (vieux logs).
var PAIN_CAT=[
  ['nuque','Nuque / cou','cervicales cou nuque'],
  ['trapezes','Trapèzes','trapeze haut des epaules'],
  ['hautdos','Haut du dos','dos dorsal entre les omoplates thoracique'],
  ['omoplate','Omoplate','scapula rhomboide rhomboides'],
  ['dorsaux','Grand dorsal (côté du dos)','dos lats dorsaux aisselle'],
  ['basdos','Bas du dos','dos lombaires lombaire reins'],
  ['epaule','Épaule','epaule'],
  ['epaule_av','Épaule — avant','epaule deltoide anterieur devant'],
  ['epaule_lat','Épaule — côté','epaule deltoide lateral moyen'],
  ['epaule_ar','Épaule — arrière','epaule deltoide posterieur'],
  ['coiffe','Coiffe des rotateurs (dans l\'épaule)','epaule rotateurs sus epineux tendon profond'],
  ['pecs','Pectoraux','pec pecs poitrine torse'],
  ['pec_haut','Haut des pecs / clavicule','pec pecs clavicule'],
  ['sternum','Sternum / côtes','poitrine cote cotes'],
  ['biceps','Biceps','biceps bras'],
  ['biceps_haut','Biceps — haut (près de l\'épaule)','biceps bras tendon long chef epaule'],
  ['biceps_bas','Biceps — bas (près du coude)','biceps bras tendon distal pli du coude'],
  ['triceps','Triceps','triceps bras arriere'],
  ['triceps_bas','Triceps — bas (près du coude)','triceps bras tendon coude'],
  ['coude','Coude','coude'],
  ['coude_int','Coude — intérieur','coude interne epitrochlee golfeur medial'],
  ['coude_ext','Coude — extérieur','coude externe epicondyle tennis elbow lateral'],
  ['coude_ar','Coude — pointe (arrière)','coude olecrane'],
  ['coude_pli','Pli du coude (devant)','coude creux devant biceps'],
  ['avbras','Avant-bras','avant bras'],
  ['avbras_dessus','Avant-bras — dessus','avant bras extenseurs'],
  ['avbras_dessous','Avant-bras — dessous','avant bras flechisseurs'],
  ['poignet','Poignet','poignet'],
  ['poignet_cub','Poignet — côté petit doigt','poignet cubital ulnaire styloide auriculaire'],
  ['poignet_pouce','Poignet — côté pouce','poignet radial quervain'],
  ['main','Main / doigts','main doigt doigts paume phalange'],
  ['pouce','Pouce','pouce main'],
  ['abdos','Abdos','abdominaux ventre sangle'],
  ['obliques','Obliques / flancs','flanc flancs cote abdos'],
  ['aine','Aine','pli de l aine adducteur'],
  ['hanche','Hanche','hanche'],
  ['flechisseurs','Devant de la hanche (psoas)','hanche psoas flechisseurs'],
  ['fessiers','Fessiers','fesse fesses fessier'],
  ['sciatique','Sciatique (fesse → jambe)','nerf sciatique fesse jambe'],
  ['quadri','Quadriceps (devant de la cuisse)','cuisse quadriceps quadri'],
  ['ischios','Ischios (arrière de la cuisse)','cuisse ischio ischios jambiers'],
  ['adducteurs','Adducteurs (intérieur de la cuisse)','cuisse adducteur interieur'],
  ['abducteurs','Extérieur de la hanche (abducteurs)','hanche abducteur fessier moyen tfl bandelette'],
  ['genou','Genou','genou'],
  ['genou_av','Genou — devant (rotule)','genou rotule tendon rotulien patellaire'],
  ['genou_int','Genou — intérieur','genou interne menisque medial'],
  ['genou_ext','Genou — extérieur','genou externe bandelette ilio tibiale essuie glace lateral'],
  ['genou_ar','Genou — arrière (creux)','genou creux poplite'],
  ['tibia','Tibia','tibia periostite jambe devant'],
  ['mollet','Mollet','mollet mollets jambe gastrocnemien soleaire'],
  ['achille','Tendon d\'Achille','achille talon tendon'],
  ['cheville','Cheville / pied','cheville pied'],
  ['pied','Pied / voûte plantaire','pied plante talon orteil fasciite'],
  ['autre','Autre','',1] // 4e case = jamais proposé (vieux logs seulement : le texte libre le remplace)
];
var PAIN_DEFAULTS=['epaule','coude','poignet','genou','basdos','biceps_bas'];
var PAIN_STOP={de:1,du:1,des:1,la:1,le:1,les:1,l:1,d:1,a:1,au:1,aux:1,et:1,en:1,un:1,une:1,pres:1,proche:1,vers:1,niveau:1,sur:1,mon:1,ma:1,mes:1,j:1,ai:1,mal:1};
var PAIN_SUG=[];
function painNorm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim(); }
function painZoneLabel(z){ if(z==='nr') return 'zone non notée'; for(var i=0;i<PAIN_CAT.length;i++) if(PAIN_CAT[i][0]===z) return PAIN_CAT[i][1]; return z; }
function painZonesTxt(pains){ return (pains||[]).map(function(p){ return painZoneLabel(p.z).toLowerCase()+(p.lvl?' '+p.lvl+'/5':''); }).join(', '); }
function painIsWrist(z){ return String(z||'').indexOf('poignet')===0; }
// Recherche : chaque mot tapé (hors petits mots) doit commencer un mot du libellé ou des mots-clés ;
// on classe par nombre de mots trouvés, puis libellé qui commence par la saisie, puis libellé court.
function painSearch(q,taken){
  var toks=painNorm(q).split(' ').filter(function(t){ return t&&!PAIN_STOP[t]; });
  if(!toks.length) return [];
  var out=[];
  PAIN_CAT.forEach(function(c){
    if(c[3]||(taken&&taken.indexOf(c[0])>=0)) return;
    var words=painNorm(c[1]+' '+c[2]).split(' '), hit=0;
    toks.forEach(function(t){ if(words.some(function(w){ return w.indexOf(t)===0; })) hit++; });
    if(!hit) return;
    out.push({z:c[0],hit:hit,start:painNorm(c[1]).indexOf(toks[0])===0?1:0,len:c[1].length});
  });
  out.sort(function(a,b){ return (b.hit-a.hit)||(b.start-a.start)||(a.len-b.len); });
  var best=out.length?out[0].hit:0;
  return out.filter(function(o){ return o.hit>=Math.min(best,toks.length); }).slice(0,8).map(function(o){ return o.z; });
}
// Zones les plus notées dans l'historique (MASSUP : l.live.pains, Melati : l.pains), puis les classiques
function painFrequent(taken){
  var cnt={};
  (typeof DB!=='undefined'&&DB.logs||[]).forEach(function(l){
    ((l.live&&l.live.pains)||l.pains||[]).forEach(function(p){ if(p&&p.z&&p.z!=='nr'&&p.z!=='autre') cnt[p.z]=(cnt[p.z]||0)+1; });
  });
  var keys=Object.keys(cnt).sort(function(a,b){ return cnt[b]-cnt[a]; });
  PAIN_DEFAULTS.forEach(function(k){ if(keys.indexOf(k)<0) keys.push(k); });
  return keys.filter(function(k){ return taken.indexOf(k)<0; }).slice(0,6);
}
function painCleanTxt(s){ s=String(s||'').replace(/[<>"'`\\]/g,' ').replace(/\s+/g,' ').trim().slice(0,40); return s?s.charAt(0).toUpperCase()+s.slice(1):''; }

// ── État : entrées douloureuses (exos + hors exo) et zones dérivées ──
function painEntries(){
  var out=[];
  (AS.exos||[]).forEach(function(x,i){ if(x.pp) out.push({i:i,x:x,pp:x.pp,name:x.name}); });
  if(AS.end&&AS.end.painOut) out.push({i:-1,x:null,pp:AS.end.painOut,name:'Hors exo'});
  return out;
}
function painDerive(){
  var e=AS.end||(AS.end={}), zs=e.pains||(e.pains=[]);
  var ents=painEntries();
  ents.forEach(function(en){
    if(zs.length===1) en.pp.z=[zs[0].z];
    else en.pp.z=(en.pp.z||[]).filter(function(z){ return zs.some(function(p){ return p.z===z; }); });
  });
  zs.forEach(function(p){
    var m=null;
    ents.forEach(function(en){ if(en.pp.lvl&&en.pp.z.indexOf(p.z)>=0) m=Math.max(m||0,en.pp.lvl); });
    p.lvl=m;
  });
}
function painMissing(e){
  if(e.painAny!==true) return '';
  var zs=e.pains||[], ents=painEntries();
  if(!zs.length) return 'Où as-tu eu mal ? Cherche la zone ci-dessus.';
  if(!ents.length) return 'Coche le ou les exos où tu as eu mal (ou « Hors exo »).';
  for(var i=0;i<ents.length;i++){
    if(!ents[i].pp.lvl) return ents[i].name+' : quelle intensité ?';
    if(!ents[i].pp.z.length) return ents[i].name+' : quelle zone ?';
  }
  for(var j=0;j<zs.length;j++) if(!zs[j].lvl) return painZoneLabel(zs[j].z)+' : sur quel exo ?';
  return '';
}
function asPainAnswered(e){
  if(e.painAny===false) return true;
  if(e.painAny!==true) return false;
  painDerive();
  return !painMissing(e);
}

// ── Rendu ──
function painSugHtml(q){
  var taken=((AS.end&&AS.end.pains)||[]).map(function(p){ return p.z; });
  var keys=painNorm(q)?painSearch(q,taken):painFrequent(taken);
  PAIN_SUG=keys.slice();
  var h=keys.map(function(k,i){ return '<button class="as-ctx-btn" onclick="asPainPick('+i+')">+ '+painZoneLabel(k)+'</button>'; }).join('');
  var txt=painCleanTxt(q);
  if(txt.length>=3&&!keys.some(function(k){ return painNorm(painZoneLabel(k))===painNorm(txt); })){
    PAIN_SUG.push({custom:txt});
    h+='<button class="as-ctx-btn" onclick="asPainPick('+(PAIN_SUG.length-1)+')">➕ Ajouter « '+txt+' »</button>';
  }
  if(!h) h='<span class="as-lbl as-pain-none"><span class="as-lbl-hint">Aucune zone trouvée — continue à taper pour l\'ajouter telle quelle.</span></span>';
  return h;
}
function painScale(ei,v){
  var h='<div class="as-scale-hint"><span>Légère</span><span>Forte</span></div><div class="as-scale">';
  for(var i=1;i<=5;i++) h+='<button class="as-scale-btn'+(v===i?' on':'')+'" onclick="asPainExLvl('+ei+','+i+')">'+i+'</button>';
  return h+'</div>';
}
function asPainBlock(e){
  // Un arrêt douleur fait pendant la séance (bouton 🩹) répond déjà « oui » et coche l'exo
  if(e.painAny==null&&AS.exos.some(function(x){ return x.pain; })) e.painAny=true;
  var h='<div class="as-lbl">🩹 Une douleur pendant la séance ?</div><div class="as-ctx-row">'
    +'<button class="as-ctx-btn'+(e.painAny===false?' on':'')+'" onclick="asPainAny(false)">👌 Non</button>'
    +'<button class="as-ctx-btn'+(e.painAny===true?' on':'')+'" onclick="asPainAny(true)">🩹 Oui</button></div>';
  if(e.painAny!==true) return h;
  AS.exos.forEach(function(x){ if(x.pain&&!x.pp) x.pp={lvl:null,z:[]}; });
  painDerive();
  var zs=e.pains||[];
  // ① Où ?
  h+='<div class="as-lbl">Où ? <span class="as-lbl-hint">tape un muscle, un tendon, une articulation — plusieurs possibles</span></div>';
  if(zs.length){
    h+='<div class="as-ctx-row">';
    zs.forEach(function(p,i){ h+='<button class="as-ctx-btn on" onclick="asPainZoneDel('+i+')" aria-label="Retirer '+painZoneLabel(p.z)+'">'+painZoneLabel(p.z)+' ✕</button>'; });
    h+='</div>';
  }
  h+='<input class="as-note as-pain-q" id="asPainQ" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done"'
    +' placeholder="Ex. : biceps, coude, genou, lombaires…" oninput="asPainQ(this.value)"'
    +' onkeydown="if(event.key===\'Enter\'){event.preventDefault();asPainPick(0);}">';
  h+='<div class="as-ctx-row as-pain-sug" id="asPainSug">'+painSugHtml('')+'</div>';
  // ② Sur quels exos ? (+ intensité par exo)
  var cand=asPainCands();
  h+='<div class="as-lbl">Sur quels exos ? <span class="as-lbl-hint">tous ceux où tu as eu mal, même finis</span></div><div class="as-ctx-row">';
  cand.forEach(function(o){
    h+='<button class="as-ctx-btn'+(o.x.pp?' on':'')+'" onclick="asPainEx('+o.i+')">'+o.x.name+' <small>'+o.d+'/'+o.n+'</small></button>';
  });
  h+='<button class="as-ctx-btn'+(e.painOut?' on':'')+'" onclick="asPainEx(-1)">Hors exo <small>échauffement, repos…</small></button></div>';
  painEntries().forEach(function(en){
    h+='<div class="as-lbl">'+en.name+' — intensité</div>'+painScale(en.i,en.pp.lvl);
    var row='';
    if(zs.length>1) zs.forEach(function(p,zi){
      row+='<button class="as-ctx-btn'+(en.pp.z.indexOf(p.z)>=0?' on':'')+'" onclick="asPainExZone('+en.i+','+zi+')">'+painZoneLabel(p.z)+'</button>';
    });
    var c=en.x&&cand.find(function(o){ return o.i===en.i; });
    if(c&&c.short) row+='<button class="as-ctx-btn'+(en.x.pain?' on':'')+'" onclick="asPainStop('+en.i+')">✂️ Écourté à cause de ça <small>jugé sur les séries faites</small></button>';
    if(row) h+=(zs.length>1?'<div class="as-lbl" style="margin-top:.6rem;"><span class="as-lbl-hint">où, sur cet exo ?</span></div>':'<div style="height:.5rem"></div>')+'<div class="as-ctx-row">'+row+'</div>';
    else h+='<div style="height:.9rem"></div>';
  });
  var miss=painMissing(e);
  if(miss) h+='<div class="as-lbl"><span class="as-lbl-hint">⚠️ '+miss+'</span></div>';
  return h;
}

// ── Actions ──
function painRefresh(){ painDerive(); asSave(); asRender(); }
function asPainQ(v){ var s=document.getElementById('asPainSug'); if(s) s.innerHTML=painSugHtml(v); }
function asPainPick(i){
  var it=PAIN_SUG[i]; if(it==null) return;
  asKeepEndNote();
  var zs=AS.end.pains||(AS.end.pains=[]);
  var z=typeof it==='string'?it:it.custom;
  if(!zs.some(function(p){ return p.z===z; })){
    zs.push({z:z,lvl:null});
    // 2e zone ajoutée : les exos déjà notés gardent la 1re (ils étaient rattachés à elle)
    if(zs.length===2) painEntries().forEach(function(en){ en.pp.z=[zs[0].z]; });
  }
  painRefresh();
}
function asPainZoneDel(i){ asKeepEndNote(); (AS.end.pains||[]).splice(i,1); painRefresh(); }
function asPainEx(i){
  asKeepEndNote();
  if(i<0){ AS.end.painOut=AS.end.painOut?null:{lvl:null,z:[]}; painRefresh(); return; }
  var x=AS.exos[i]; if(!x) return;
  if(x.pp){ delete x.pp; if(x.pain) asPainSetStop(x,false); }
  else x.pp={lvl:null,z:[]};
  painRefresh();
}
function painPP(i){ return i<0?AS.end.painOut:(AS.exos[i]&&AS.exos[i].pp); }
function asPainExLvl(i,v){ asKeepEndNote(); var pp=painPP(i); if(pp) pp.lvl=v; painRefresh(); }
function asPainExZone(i,zi){
  asKeepEndNote();
  var pp=painPP(i), p=(AS.end.pains||[])[zi]; if(!pp||!p) return;
  var k=pp.z.indexOf(p.z); if(k>=0) pp.z.splice(k,1); else pp.z.push(p.z);
  painRefresh();
}
function asPainStop(i){ asKeepEndNote(); var x=AS.exos[i]; if(!x) return; asPainSetStop(x,!x.pain); painRefresh(); }
// Remise à zéro quand on répond « Non »
function painClearAll(){
  AS.end.pains=[]; AS.end.painOut=null;
  AS.exos.forEach(function(x){ delete x.pp; if(x.pain) asPainSetStop(x,false); });
}
// Détail par exo d'une zone (coach, export) — entries = [{name,lvl,z:[...]}]
function painExosFor(z,entries){
  return (entries||[]).filter(function(en){ return en.lvl&&(en.z||[]).indexOf(z)>=0; })
    .map(function(en){ return en.name+' '+en.lvl+'/5'; }).join(', ');
}
