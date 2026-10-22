// מאפשר לאפליקציה להיפתח גם בלי אינטרנט, ומהר
const CACHE = 'lbk-20261022223741';
const FILES = ['./', 'index.html', 'css/app.css', 'js/core.js', 'js/math.js', 'js/bank.js', 'js/little.js', 'js/math-more.js', 'js/nature.js', 'js/fun.js', 'js/howto.js', 'js/parent.js', 'js/news.js', 'js/demo.js', 'js/review.js', 'js/bdika.js', 'js/auth.js', 'js/app.js', 'vendor/supabase.js', 'js/track.js', 'manifest.webmanifest', 'guide/', 'audio/map.json', 'audio/lily/map.json', 'audio/lily/names/map.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png', 'icons/icon-maskable-512.png', 'icons/favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
// התמונות נשמרות במגירה קבועה: יורדות פעם אחת, ונשארות גם אחרי עדכון של האפליקציה
const IMGS = 'lbk-img';
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('lbk-') && k !== CACHE && k !== IMGS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
  e.waitUntil(warmImages());
});
// אחרי ההתקנה מורידים בשקט את כל התמונות, כדי שהמשחק יעבוד גם בלי אינטרנט
async function warmImages() {
  try {
    const list = await (await fetch('img/list.json', { cache: 'no-cache' })).json(), c = await caches.open(IMGS);
    for (let i = 0; i < list.length; i += 8) {
      await Promise.all(list.slice(i, i + 8).map(async f => { if (!(await c.match(f))) { try { const r = await fetch(f); if (r.ok) await c.put(f, r); } catch { } } }));
    }
  } catch { }
}
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const mine = url.origin === location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$|wikimedia\.org$/.test(url.hostname);
  if (!mine && !fonts) return;
  if (mine && url.pathname.includes('/img/')) {
    e.respondWith(caches.open(IMGS).then(async c => (await c.match(e.request, { ignoreSearch: true })) || fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; })));
    return;
  }
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: mine });
    const net = fetch(e.request, mine ? { cache: 'no-cache' } : {}).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; });
    if (hit) { e.waitUntil(net.catch(() => { })); return hit; }
    return net.catch(async () => (e.request.mode === 'navigate' && await c.match('./')) || Response.error());
  }));
});
