import { openDB } from 'idb';

const CACHE_DB_NAME = 'atmosync-cache';
const CACHE_DB_VERSION = 1;

class CacheService {
  constructor() {
    this.db = null;
    this.init();
  }

  async init() {
    this.db = await openDB(CACHE_DB_NAME, CACHE_DB_VERSION, {
      upgrade(db) {
        // API Response Cache
        if (!db.objectStoreNames.contains('apiCache')) {
          const store = db.createObjectStore('apiCache', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('type', 'type');
        }

        // Image Cache
        if (!db.objectStoreNames.contains('imageCache')) {
          const store = db.createObjectStore('imageCache', { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp');
        }

        // Static Assets Cache
        if (!db.objectStoreNames.contains('staticCache')) {
          const store = db.createObjectStore('staticCache', { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp');
        }
      },
    });
  }

  // API Response Caching
  async cacheApiResponse(key, data, type = 'weather', ttl = 3600000) {
    if (!this.db) await this.init();
    
    const cacheEntry = {
      key,
      data,
      type,
      timestamp: Date.now(),
      ttl,
      expiresAt: Date.now() + ttl,
    };

    await this.db.put('apiCache', cacheEntry);
  }

  async getCachedApiResponse(key) {
    if (!this.db) await this.init();
    
    const cached = await this.db.get('apiCache', key);
    
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
      await this.db.delete('apiCache', key);
      return null;
    }
    
    return cached.data;
  }

  async clearApiCache(type = null) {
    if (!this.db) await this.init();
    
    if (type) {
      const all = await this.db.getAllFromIndex('apiCache', 'type', type);
      for (const entry of all) {
        await this.db.delete('apiCache', entry.key);
      }
    } else {
      await this.db.clear('apiCache');
    }
  }

  // Image Caching
  async cacheImage(url, blob) {
    if (!this.db) await this.init();
    
    await this.db.put('imageCache', {
      url,
      blob,
      timestamp: Date.now(),
    });
  }

  async getCachedImage(url) {
    if (!this.db) await this.init();
    
    const cached = await this.db.get('imageCache', url);
    return cached ? cached.blob : null;
  }

  // Cache Management
  async getCacheStats() {
    if (!this.db) await this.init();
    
    const apiCount = await this.db.count('apiCache');
    const imageCount = await this.db.count('imageCache');
    const staticCount = await this.db.count('staticCache');
    
    return {
      apiCache: apiCount,
      imageCache: imageCount,
      staticCache: staticCount,
      total: apiCount + imageCount + staticCount,
    };
  }

  async clearAllCaches() {
    if (!this.db) await this.init();
    
    await this.db.clear('apiCache');
    await this.db.clear('imageCache');
    await this.db.clear('staticCache');
  }

  // LRU Cleanup
  async cleanupOldEntries(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
    if (!this.db) await this.init();
    
    const cutoff = Date.now() - maxAge;
    const stores = ['apiCache', 'imageCache', 'staticCache'];
    
    for (const storeName of stores) {
      const allEntries = await this.db.getAll(storeName);
      for (const entry of allEntries) {
        if (entry.timestamp < cutoff) {
          await this.db.delete(storeName, entry.key || entry.url);
        }
      }
    }
  }
}

export const cacheService = new CacheService();
