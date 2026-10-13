const V='hesabino-v30-stable-1';
const A=['./','index.html','manifest.json','icon-192.png','icon-512.png','mascot.svg'];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{const c=await caches.open(V);for(const u of A){try{await c.add(u)}catch(err){/* one optional asset must not abort the whole install */}}await self.skipWaiting()})());
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('hesabino-')&&k!==V).map(k=>caches.delete(k)));await self.clients.claim()})());
});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==self.location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        const fresh=await fetch(r,{cache:'no-store'});
        if(fresh&&fresh.ok){const c=await caches.open(V);c.put('./index.html',fresh.clone()).catch(()=>{});}
        return fresh;
      }catch(err){
        return (await caches.match(r,{ignoreSearch:true}))||(await caches.match('./index.html'))||new Response('حسابینو در حال بارگذاری است؛ اتصال را بررسی و دوباره تلاش کنید.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }
  e.respondWith((async()=>{
    const cached=await caches.match(r,{ignoreSearch:true});
    const fresh=fetch(r).then(async res=>{if(res&&res.ok){const c=await caches.open(V);await c.put(r,res.clone()).catch(()=>{});}return res}).catch(()=>null);
    if(cached){fresh.catch(()=>{});return cached;}
    return (await fresh)||new Response('',{status:504});
  })());
});
