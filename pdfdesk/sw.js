// PDF Desk: lets the app install and open offline. Always tries the network first so updates arrive.
const C='pdfdesk-v1';
const CORE=['./','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).catch(()=>{})); });
self.addEventListener('activate',e=>e.waitUntil((async()=>{ for(const k of await caches.keys()) if(k!==C) await caches.delete(k); await self.clients.claim(); })()));
self.addEventListener('fetch',e=>{
  const req=e.request; const u=new URL(req.url);
  if(req.method!=='GET' || u.origin!==location.origin || !u.pathname.startsWith('/pdfdesk/')) return;
  e.respondWith(fetch(req).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(C).then(c=>c.put(req,cp)); } return r; })
    .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./'))));
});
