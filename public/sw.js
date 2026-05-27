const CACHE_NAME = 'atmosync-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful GET requests
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline fallback - try to serve from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If it's a navigation request, serve the index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Weather update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'weather-alert',
    renotify: true,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Atmosync Weather Alert', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-weather') {
    event.waitUntil(syncWeatherData());
  } else if (event.tag === 'sync-goals') {
    event.waitUntil(syncGoals());
  }
});

async function syncWeatherData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedData = await cache.match('/api/weather-cache');
    
    if (cachedData) {
      const data = await cachedData.json();
      // Attempt to sync with server
      await fetch('/api/sync/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  } catch (error) {
    console.error('Weather sync failed:', error);
  }
}

async function syncGoals() {
  try {
    const db = await openDB('atmosync-offline', 1);
    const pendingGoals = await db.getAllFromIndex('syncQueue', 'status', 'pending');
    
    for (const goal of pendingGoals) {
      try {
        await fetch('/api/sync/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goal)
        });
        await db.delete('syncQueue', goal.id);
      } catch (error) {
        console.error('Goal sync failed:', error);
      }
    }
  } catch (error) {
    console.error('Goals sync failed:', error);
  }
}
