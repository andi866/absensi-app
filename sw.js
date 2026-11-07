/* Service worker ELS Absensi.
   - Halaman & config.js: jaringan dulu (pembaruan langsung terlihat), cadangan dari cache bila offline / lambat > 4 detik.
   - Ikon: cache dulu.
   - Semua permintaan ke luar (server Apps Script, font, pustaka) TIDAK disentuh. */
const CACHE = 'els-absensi-2026-11-06.2';
const SHELL = ['./', 'index.html', 'cek.html', 'config.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(SHELL.map(function(u){ return c.add(u).catch(function(){ return null; }); }));
  }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k.indexOf('els-absensi-') === 0 && k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

function networkFirst(req){
  return new Promise(function(resolve){
    var done = false;
    var t = setTimeout(function(){
      caches.match(req, {ignoreSearch: true}).then(function(m){ if(m && !done){ done = true; resolve(m); } });
    }, 4000);
    fetch(req).then(function(res){
      clearTimeout(t);
      if(res && res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
      if(!done){ done = true; resolve(res); }
    }).catch(function(){
      clearTimeout(t);
      caches.match(req, {ignoreSearch: true}).then(function(m){ if(!done){ done = true; resolve(m || Response.error()); } });
    });
  });
}

function cacheFirst(req){
  return caches.match(req).then(function(m){
    return m || fetch(req).then(function(res){
      if(res && res.ok){ var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
      return res;
    });
  });
}

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);
  if(url.origin !== self.location.origin) return;
  var page = req.mode === 'navigate' || /\.(html|js|json|webmanifest)$/.test(url.pathname) || /\/$/.test(url.pathname);
  e.respondWith(page ? networkFirst(req) : cacheFirst(req));
});
