// This file would be used as a Web Worker
// In Vite, workers can be imported with ?worker suffix

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;

class SyncWorker {
  constructor() {
    this.queue = [];
    this.isSyncing = false;
    this.retryCount = {};
  }

  async init() {
    // Load pending sync items from IndexedDB
    await this.loadQueue();
    
    // Start periodic sync
    this.startPeriodicSync();
    
    // Listen for online event
    self.addEventListener('online', () => this.processQueue());
    
    // Listen for messages from main thread
    self.addEventListener('message', (event) => {
      this.handleMessage(event.data);
    });
  }

  async loadQueue() {
    try {
      // In a worker context, we'd use IndexedDB
      // For now, using a simple array
      const request = indexedDB.open('atmosync-offline', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['syncQueue'], 'readonly');
        const store = transaction.objectStore('syncQueue');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
          this.queue = getAllRequest.result.filter(
            item => item.status === 'pending'
          );
        };
      };
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  async addToQueue(item) {
    const queueItem = {
      id: Date.now().toString(),
      ...item,
      status: 'pending',
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    this.queue.push(queueItem);
    await this.saveQueue();
    
    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.isSyncing || this.queue.length === 0) return;
    
    this.isSyncing = true;
    const itemsToProcess = [...this.queue];
    
    for (const item of itemsToProcess) {
      try {
        await this.syncItem(item);
        
        // Remove successful item from queue
        this.queue = this.queue.filter(q => q.id !== item.id);
        
        // Notify main thread of success
        self.postMessage({
          type: 'SYNC_SUCCESS',
          payload: { id: item.id, type: item.type },
        });
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        
        item.retryCount = (item.retryCount || 0) + 1;
        
        if (item.retryCount >= MAX_RETRIES) {
          // Move to failed queue after max retries
          this.queue = this.queue.filter(q => q.id !== item.id);
          item.status = 'failed';
          
          self.postMessage({
            type: 'SYNC_FAILED',
            payload: { id: item.id, type: item.type, error: error.message },
          });
        } else {
          // Retry later
          item.nextRetry = Date.now() + (SYNC_INTERVAL * item.retryCount);
        }
      }
    }
    
    await this.saveQueue();
    this.isSyncing = false;
  }

  async syncItem(item) {
    // Different sync strategies based on item type
    switch(item.type) {
      case 'weather_data':
        await this.syncWeatherData(item.data);
        break;
      case 'goals':
        await this.syncGoals(item.data);
        break;
      case 'preferences':
        await this.syncPreferences(item.data);
        break;
      case 'alerts':
        await this.syncAlerts(item.data);
        break;
      default:
        await this.syncGeneric(item.data);
    }
  }

  async syncWeatherData(data) {
    const supabaseUrl = self.env?.VITE_SUPABASE_URL;
    const supabaseKey = self.env?.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/weather_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }
  }

  async syncGoals(data) {
    const supabaseUrl = self.env?.VITE_SUPABASE_URL;
    const supabaseKey = self.env?.VITE_SUPABASE_ANON_KEY;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Goals sync failed: ${response.statusText}`);
    }
  }

  async syncPreferences(data) {
    const supabaseUrl = self.env?.VITE_SUPABASE_URL;
    const supabaseKey = self.env?.VITE_SUPABASE_ANON_KEY;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ preferences: data }),
    });

    if (!response.ok) {
      throw new Error(`Preferences sync failed: ${response.statusText}`);
    }
  }

  async syncAlerts(data) {
    const supabaseUrl = self.env?.VITE_SUPABASE_URL;
    const supabaseKey = self.env?.VITE_SUPABASE_ANON_KEY;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Alerts sync failed: ${response.statusText}`);
    }
  }

  async syncGeneric(data) {
    // Generic sync endpoint
    const supabaseUrl = self.env?.VITE_SUPABASE_URL;
    const supabaseKey = self.env?.VITE_SUPABASE_ANON_KEY;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/sync_queue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }
  }

  async saveQueue() {
    // Save queue to IndexedDB
    const request = indexedDB.open('atmosync-offline', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      
      // Clear existing queue
      store.clear();
      
      // Add all items
      this.queue.forEach(item => {
        store.add(item);
      });
    };
  }

  startPeriodicSync() {
    setInterval(() => {
      if (navigator.onLine && this.queue.length > 0) {
        this.processQueue();
      }
    }, SYNC_INTERVAL);
  }

  handleMessage(message) {
    switch(message.type) {
      case 'ADD_TO_QUEUE':
        this.addToQueue(message.payload);
        break;
      case 'PROCESS_QUEUE':
        this.processQueue();
        break;
      case 'CLEAR_QUEUE':
        this.queue = [];
        this.saveQueue();
        break;
      case 'GET_QUEUE_STATUS':
        self.postMessage({
          type: 'QUEUE_STATUS',
          payload: {
            pending: this.queue.length,
            isSyncing: this.isSyncing,
          },
        });
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }
}

// Initialize the worker
const worker = new SyncWorker();
worker.init();
