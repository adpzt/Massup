/* ══════════════════════════════════════════════════════════════════════════════════════════
   STATE_SYNC (13/10/2026) — écriture conditionnelle du snapshot user_state, commun MASSUP + Melati
   Avant : chaque appareil comparait SON compteur de sauvegardes à celui du cloud et faisait un
   upsert aveugle → une copie périmée (Safari vs icône, Mac) pouvait écraser le cloud.
   Maintenant : le serveur numérote les versions (colonne user_state.rev, user_state_cas.sql).
   Chaque appareil retient dans son stockage { uid, base, lrev } :
     · base = dernière version serveur qu'il a vue ou écrite ;
     · lrev = son compteur local au moment de cette synchro (compteur ≠ lrev → modifs pas envoyées).
   Écrire = user_state_put(data, base) : refusé si quelqu'un a écrit entre-temps → l'app relit,
   fusionne, renvoie. Serveur sans la fonction (SQL pas encore appliqué) → ancien upsert.
   ══════════════════════════════════════════════════════════════════════════════════════════ */
var STATE_SYNC=(function(){
  function readMeta(key){
    try{
      var m=JSON.parse(localStorage.getItem(key)||'null');
      return (m&&typeof m==='object')?m:null;
    }catch(e){ return null; }
  }
  function writeMeta(key,meta){
    try{ localStorage.setItem(key,JSON.stringify(meta)); return true; }
    catch(e){ console.warn('[SYNC] repère de synchro non enregistré :',e&&e.message); return false; }
  }
  // Repère valable pour CE compte ? (un autre compte connecté sur le même stockage = repartir de zéro)
  function metaFor(key,uid){
    var m=readMeta(key);
    return (m&&m.uid===uid&&typeof m.base==='number'&&typeof m.lrev==='number')?m:null;
  }
  function isDirty(meta,localRev){ return !meta||meta.lrev!==localRev; }
  // Que faire d'un snapshot cloud lu au démarrage / au retour au premier plan ?
  //   'adopt' : le cloud est plus récent et ce stockage n'a rien de non envoyé → on prend le cloud
  //   'merge' : les deux ont bougé → fusion non destructive (le local gagne à clé égale), puis envoi
  //   'keep'  : le cloud n'a pas bougé depuis notre dernière synchro → rien à reprendre
  // o = { virgin, meta, cloudRev (serveur, null si colonne absente), localRev, legacyCloudRev }
  function plan(o){
    if(o.virgin) return 'adopt';
    if(o.cloudRev==null||!o.meta){
      // Pas de repère serveur (1er lancement après la mise à jour, ou SQL pas appliqué) : ancienne règle
      return (o.legacyCloudRev||0)>(o.localRev||0)?'adopt':'merge';
    }
    if(o.cloudRev===o.meta.base) return 'keep';
    if(o.cloudRev>o.meta.base) return isDirty(o.meta,o.localRev)?'merge':'adopt';
    return 'merge'; // cloud « plus vieux » que notre repère (restauration côté base) : fusion prudente
  }
  // → Promise<{ok:true,rev} | {ok:false,rev} | {legacy:true}> ; rejette sur erreur réseau/serveur
  function put(sb,data,baseRev){
    return sb.rpc('user_state_put',{p_data:data,p_base_rev:baseRev}).then(function(r){
      if(r&&r.error){
        var msg=String(r.error.message||'');
        if(r.error.code==='PGRST202'||/user_state_put/.test(msg)&&/not find|does not exist/i.test(msg)) return {legacy:true};
        throw new Error(msg||'user_state_put');
      }
      var d=r&&r.data;
      if(!d||typeof d.ok!=='boolean') throw new Error('réponse user_state_put illisible');
      return d;
    });
  }
  return {readMeta:readMeta,writeMeta:writeMeta,metaFor:metaFor,isDirty:isDirty,plan:plan,put:put};
})();
