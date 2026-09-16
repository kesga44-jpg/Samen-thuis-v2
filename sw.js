const APP_VERSION='17.1';
const CACHE=`samen-thuis-v${APP_VERSION.replace(/\./g,'-')}`;
const ASSETS=[
  './',
  './index.html',
  './?v=171',
  './styles.css?v=171',
  './app.js?v=171',
  './manifest.webmanifest?v=171',
  './icon.svg?v=171'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin){event.respondWith(fetch(event.request));return;}
  if(event.request.mode==='navigate') {
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(response=>{
          if(response.ok) event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',response.clone())));
          return response;
        })
        .catch(()=>caches.match('./index.html').then(cached=>cached||Response.error()))
    );
    return;
  }
  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        if(response.ok) event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,response.clone())));
        return response;
      })
      .catch(()=>caches.match(event.request).then(cached=>cached||Response.error()))
  );
});
