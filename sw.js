const CACHE='samen-thuis-v21-glass-dock';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin){e.respondWith(fetch(e.request));return}e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const x=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,x)))}return r}).catch(()=>caches.match(e.request).then(x=>x||(e.request.mode==='navigate'?caches.match('./index.html'):Response.error()))))});
