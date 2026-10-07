"use strict";
/* ═══ Chrono → notification push programmée côté serveur (07/10/2026) — commun MASSUP + Melati ═══
   Problème corrigé : le rappel « Repos terminé » arrivait jusqu'à 60 s en retard, ou jamais.
   · Une seule requête (RPC schedule_push_timer) au lieu de 3 en série (getUser réseau + annulation
     + insertion) : quand on verrouille l'iPhone juste après une série, iOS fige la page en quelques
     secondes et les requêtes suivantes ne partaient pas.
   · fetch keepalive + renvoi immédiat à la mise en arrière-plan si la demande n'est pas confirmée.
   · Côté serveur (push_timer_fast.sql) : déclencheur toutes les 5 s au lieu d'une fois par minute.
   Repli automatique sur l'ancienne méthode tant que push_timer_fast.sql n'a pas été exécuté.

   PushTimer.create({
     url, key,            // projet Supabase (URL + clé anon publique)
     client(),            // client supabase-js prêt pour la synchro, ou null (local / non connecté)
     enabled(),           // les rappels sont-ils autorisés en ce moment ?
     tag,                 // préfixe des logs console
     onError(error)       // retour visuel en cas d'échec
   }) → { update(dueAt, title, body), flush() } */
var PushTimer=(function(){
  function create(cfg){
    var revision=0, queue=Promise.resolve(), wanted=null, synced=null, rpcMissing=false;

    async function currentEndpoint(){
      if(!navigator.serviceWorker) return null;
      var registration=await navigator.serviceWorker.ready;
      if(!registration.pushManager) return null;
      var subscription=await registration.pushManager.getSubscription();
      return subscription?subscription.endpoint:null;
    }
    async function currentSession(sb){
      // getSession lit la session locale (réseau seulement si le jeton a expiré), contrairement à getUser
      var result=await sb.auth.getSession();
      var session=result&&result.data&&result.data.session;
      if(!session||!session.access_token) throw new Error('Connecte-toi pour programmer le rappel du chrono');
      return session;
    }
    async function legacySend(sb,session,endpoint,job){
      var uid=session.user&&session.user.id;
      if(!uid) throw new Error('Session sans utilisateur');
      var cancelled=await sb.from('push_timer_events').update({status:'cancelled'})
        .eq('user_id',uid).eq('subscription_endpoint',endpoint)
        .eq('timer_key','workout').eq('status','pending')
        .gt('due_at',new Date().toISOString());
      if(cancelled.error) throw new Error('Annulation du rappel précédent impossible : '+cancelled.error.message);
      if(!job.dueAt) return true;
      var scheduled=await sb.from('push_timer_events').insert({
        user_id:uid,subscription_endpoint:endpoint,timer_key:'workout',
        due_at:new Date(job.dueAt).toISOString(),title:job.title,body:job.body
      });
      if(scheduled.error) throw new Error('Programmation du rappel impossible : '+scheduled.error.message);
      return true;
    }
    async function send(job){
      var sb=cfg.client();
      if(!sb) return false;
      var endpoint=await currentEndpoint();
      if(!endpoint) return false; // pas de notifications push activées sur cet appareil
      var session=await currentSession(sb);
      if(!rpcMissing){
        var response=await fetch(cfg.url+'/rest/v1/rpc/schedule_push_timer',{
          method:'POST',
          keepalive:true, // la requête survit à la mise en arrière-plan de la page
          headers:{apikey:cfg.key,Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},
          body:JSON.stringify({
            p_endpoint:endpoint,
            p_due_at:job.dueAt?new Date(job.dueAt).toISOString():null,
            p_title:job.title||null,
            p_body:job.body||null
          })
        });
        if(response.ok) return true;
        var text='';
        try{ text=await response.text(); }catch(e){}
        if(response.status===404&&/PGRST202|schedule_push_timer/.test(text)) rpcMissing=true; // SQL pas encore exécuté
        else throw new Error('Programmation du rappel impossible ('+response.status+')');
      }
      return legacySend(sb,session,endpoint,job);
    }
    function update(dueAt,title,body){
      if(dueAt&&!cfg.enabled()) dueAt=null;
      var job={dueAt:dueAt||null,title:title||'',body:body||''};
      wanted=job;
      var current=++revision;
      var operation=async function(){
        if(current!==revision) return; // une demande plus récente remplace celle-ci
        if(await send(job)&&wanted===job) synced=job;
      };
      var result=queue.then(operation,operation);
      queue=result.catch(function(error){
        console.warn((cfg.tag||'[PushTimer]')+' Workout timer push:',error.message);
        if(cfg.onError) cfg.onError(error);
      });
      return queue;
    }
    // Écran verrouillé / autre app juste après la série : la dernière demande non confirmée part
    // tout de suite (sans attendre la file, keepalive). L'appel serveur est idempotent.
    function flush(){
      if(!wanted||wanted===synced) return;
      if(wanted.dueAt&&wanted.dueAt<=Date.now()) return;
      var job=wanted;
      send(job).then(function(ok){ if(ok&&wanted===job) synced=job; }).catch(function(){});
    }
    document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='hidden') flush(); });
    window.addEventListener('pagehide',flush);
    return {update:update,flush:flush};
  }
  return {create:create};
})();
