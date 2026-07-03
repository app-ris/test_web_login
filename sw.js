const CACHE = 'invio-documenti-v1';
const FILE_STATICI = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILE_STATICI)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // IMPORTANTE: non mettere mai in cache (né servire dalla cache) le chiamate
  // verso i web service di autenticazione/upload, che vanno sempre in rete.
  const isChiamataApi = e.request.method !== 'GET'
    || url.pathname.endsWith('/login')
    || url.pathname.endsWith('/upload');

  if (isChiamataApi) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
