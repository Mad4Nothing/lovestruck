export function loader(){return new Response(`
const CACHE='lovestruck-v3';
const MAX_AGE=24*60*60*1000; // 1 day in ms
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['/','/manifest.webmanifest','/app-icon.svg'])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('message',event=>{if(event.data?.type==='CACHE_URLS')event.waitUntil(caches.open(CACHE).then(cache=>Promise.all(event.data.urls.map(url=>cache.add(url).catch(()=>{})))));});
// Age of a cached response in ms, from its Date header. Returns Infinity when
// the date is missing or unparseable so the entry is treated as fresh.
function cacheAge(cached){const date=cached.headers.get('date');if(!date)return Infinity;const t=Date.parse(date);return Number.isNaN(t)?Infinity:(Date.now()-t);}
self.addEventListener('fetch',event=>{const req=event.request;const url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/')||url.pathname==='/sw.js')return;
// Navigations are network-first: always serve the latest HTML (which references
// the latest hashed asset URLs) when online, and only fall back to a cached
// page when offline. Stale-while-revalidate on HTML would serve an old document
// pointing at asset hashes that no longer exist after a deploy, leaving the
// page unstyled.
if(req.mode==='navigate'){event.respondWith((async()=>{try{const response=await fetch(req);if(response.ok){const cache=await caches.open(CACHE);cache.put(req,response.clone());cache.put('/',response.clone());}return response;}catch(error){const cache=await caches.open(CACHE);return (await cache.match(req))||(await cache.match('/'))||Response.error();}})());return;}
// Assets (styles, scripts, fonts, images): cache-first with a 1-day TTL.
// Served instantly from cache so the app never loads unstyled on repeat
// visits; revalidated in the background once the entry is older than a day.
// Hashed filenames mean a stale entry is still correct for its document.
event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req);if(cached){if(cacheAge(cached)>MAX_AGE){event.waitUntil(fetch(req).then(response=>{if(response.ok)cache.put(req,response.clone());}).catch(()=>{}));}return cached;}try{const response=await fetch(req);if(response.ok)cache.put(req,response.clone());return response;}catch(error){return Response.error();}})());});
`,{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-cache','Service-Worker-Allowed':'/'}});}
