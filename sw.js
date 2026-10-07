const CACHE = 'massup-v130';
// (27/08) Melati épinglée sur l'écran d'accueil : ses fichiers entrent au cache pour s'ouvrir hors ligne.
const ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/supabase.js', '/push_timer.js', '/nutria.css', '/nutria_data.js', '/nutria.js', '/partner.js', '/desktop.css',
  '/melati.html', '/melati.css', '/melati.js', '/nutrition.css', '/nutrition_data.js', '/nutrition.js', '/nutriplus.js', '/nutriplus.css', '/steps.js', '/steps.css', '/sleep.js', '/sleep.css', '/melati.webmanifest', '/imgs/melati_icon.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});

// Network-first : on sert toujours la version fraîche quand on est en ligne
// (évite le décalage HTML/JS qui cassait l'app), cache utilisé en repli hors ligne.
// (07/10) Le client Supabase vient du CDN : sans copie locale, l'app ouverte sans réseau à la salle
// démarrait sans lui. Réseau d'abord, copie en cache en repli (réponse opaque acceptée).
var SUPABASE_CDN='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
self.addEventListener('fetch', function(e){
  var url=new URL(e.request.url);
  if(e.request.method==='GET'&&e.request.url===SUPABASE_CDN){
    e.respondWith(
      fetch(e.request).then(function(res){
        if(res&&(res.ok||res.type==='opaque')){ var c=res.clone(); caches.open(CACHE).then(function(cache){ cache.put(SUPABASE_CDN,c); }); }
        return res;
      }).catch(function(){ return caches.match(SUPABASE_CDN).then(function(hit){ return hit||Response.error(); }); })
    );
    return;
  }
  if(e.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.indexOf('/api/')===0) return;
  // (07/10) Vidéos : Safari les lit par morceaux (Range → 206), que le cache refuse. On les laisse au réseau.
  if(e.request.headers.get('range')) return;
  e.respondWith(
    fetch(e.request).then(function(res){
      if(res && res.status===200){ var c=res.clone(); caches.open(CACHE).then(function(cache){ return cache.put(e.request,c); }).catch(function(){}); }
      return res;
    }).catch(function(){ return caches.match(e.request); })
  );
});

self.addEventListener('push', function(e){
  if(!e.data) return;
  e.waitUntil((async function(){
    try{
      var data=e.data.json();
      var clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      if(data.silentWhenVisible&&clientsList.some(function(client){ return client.visibilityState==='visible'; })) return;
      var melati=data.url==='/melati.html';
      await self.registration.showNotification(data.title||'MASSUP', {
        body:data.body||'Tu as un rappel MASSUP.',
        tag:data.tag||'massup-reminder',
        renotify:false,
        icon:melati?'/imgs/melati_icon.png':'/imgs/icon-192.png',
        badge:melati?'/imgs/melati_icon.png':'/imgs/icon-192.png',
        data:{url:data.url||'/'}
      });
    }catch(error){
      console.warn('[MASSUP] Notification push invalide:',error.message);
    }
  })());
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  e.waitUntil((async function(){
    var target=new URL(e.notification.data&&e.notification.data.url||'/',self.location.origin);
    if(target.origin!==self.location.origin) target=new URL('/',self.location.origin);
    var clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    // (07/10) D'abord une fenêtre déjà sur la bonne app (MASSUP / Melati), sinon on en ouvre une :
    // avant, la 1re fenêtre trouvée était redirigée, même si c'était l'autre app.
    var page=function(path){ return path==='/index.html'?'/':path; };
    for(var i=0;i<clientsList.length;i++){
      if(page(new URL(clientsList[i].url).pathname)===page(target.pathname)) return clientsList[i].focus();
    }
    return self.clients.openWindow(target.href);
  })());
});
