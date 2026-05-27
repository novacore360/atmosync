import { openDB } from 'idb';

const DB_NAME = 'atmosync-offline';
const DB_VERSION = 1;

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Weather data store
      if (!db.objectStoreNames.contains('weather')) {
        const weatherStore = db.createObjectStore('weather', { keyPath: 'id' });
        weatherStore.createIndex('timestamp', 'timestamp');
      }
      
      // Goals store
      if (!db.objectStoreNames.contains('goals')) {
        const goalsStore = db.createObjectStore('goals', { keyPath: 'id' });
        goalsStore.createIndex('type', 'type');
      }
      
      // Sync queue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        syncStore.createIndex('status', 'status');
      }
      
      // User preferences store
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'key' });
      }
    },
  });
}

export const offlineStorage = {
  // Weather Data
  async saveWeatherData(data) {
    const db = await getDB();
    await db.put('weather', {
      id: 'current',
      ...data,
      timestamp: Date.now(),
    });
    
    // Also save to localStorage as fallback
    localStorage.setItem('weather-cache', JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  },

  async getWeatherData() {
    try {
      const db = await getDB();
      const data = await db.get('weather', 'current');
      
      if (data && (Date.now() - data.timestamp < 3600000)) {
        return data;
      }
      
      // Fallback to localStorage
      const cached = localStorage.getItem('weather-cache');
      if (cached) {
        const { data: weatherData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 7200000) {
          return weatherData;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting weather data:', error);
      return null;
    }
  },

  // Goals
  async saveGoal(goal) {
    const db = await getDB();
    await db.put('goals', {
      ...goal,
      updatedAt: Date.now(),
    });
  },

  async getGoals() {
    const db = await getDB();
    return db.getAll('goals');
  },

  // Sync Queue
  async addToSyncQueue(action) {
    const db = await getDB();
    await db.add('syncQueue', {
      action,
      status: 'pending',
      timestamp: Date.now(),
    });
  },

  async getSyncQueue() {
    const db = await getDB();
    return db.getAllFromIndex('syncQueue', 'status', 'pending');
  },

  async clearSyncQueue() {
    const db = await getDB();
    const pendingItems = await db.getAllFromIndex('syncQueue', 'status', 'pending');
    for (const item of pendingItems) {
      await db.delete('syncQueue', item.id);
    }
  },

  // User Preferences
  async savePreference(key, value) {
    const db = await getDB();
    await db.put('preferences', { key, value });
    localStorage.setItem(`pref-${key}`, JSON.stringify(value));
  },

  async getPreference(key) {
    try {
      const db = await getDB();
      const pref = await db.get('preferences', key);
      if (pref) return pref.value;
      
      const localPref = localStorage.getItem(`pref-${key}`);
      return localPref ? JSON.parse(localPref) : null;
    } catch (error) {
      return null;
    }
  },
};
