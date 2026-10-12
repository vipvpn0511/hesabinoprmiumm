const V='hesabino-v30-pages';
const A=['./','index.html','manifest.json','icon-192.png','icon-512.png','mascot.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(A))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>{const n=fetch(r).then(x=>{if(x&&x.ok){const y=x.clone();caches.open(V).then(k=>k.put(r,y))}return x}).catch(()=>c||(r.mode==='navigate'?caches.match('index.html'):Response.error()));return c||n}))});
