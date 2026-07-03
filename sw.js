const CACHE = 'login-wigest-v1';
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

  // Qualsiasi chiamata verso il server Wigest (o qualsiasi POST) va sempre
  // direttamente in rete, mai intercettata o servita dalla cache.
  if (e.request.method !== 'GET' || url.hostname.includes('lucchi.com')) {
    return; // lascia passare senza intercettare
  }

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
