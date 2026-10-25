importScripts('voice-clips.js');

const CACHE_NAME = 'be-hoc-vui-v4';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './lop1.css',
    './data.js',
    './lop1-data.js',
    './voice-clips.js',
    './app.js',
    './parent.js',
    './lop1.js',
    './manifest.json',
    './icon.svg',
    ...Object.values(VOICE_CLIPS).map(p => './' + p)
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Trả bản đã lưu ngay để chạy offline, đồng thời tải bản mới về cho lần mở sau.
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);

    // File giọng không đổi nội dung (tên theo mã câu), chỉ cần lấy từ bộ nhớ.
    if (url.pathname.includes('/giong/')) {
        e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(c => c || fetch(e.request)));
        return;
    }

    e.respondWith(
        caches.match(e.request).then(cached => {
            const fresh = fetch(e.request).then(response => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
                }
                return response;
            }).catch(() => cached);
            return cached || fresh;
        })
    );
});
