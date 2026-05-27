import { useState, useEffect } from 'react';
import { offlineStorage } from '../services/offlineStorage';
import { supabase } from '../services/supabase';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingData = async () => {
    if (syncing) return;
    setSyncing(true);

    try {
      const pendingActions = await offlineStorage.getSyncQueue();
      
      for (const action of pendingActions) {
        try {
          // Sync with Supabase
          const { data, error } = await supabase
            .from('sync_queue')
            .upsert(action.action);

          if (!error) {
            // Remove from local queue if sync successful
            await offlineStorage.clearSyncQueue();
          }
        } catch (err) {
          console.error('Sync failed for action:', action, err);
        }
      }
    } catch (error) {
      console.error('Sync process failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const syncData = async (data) => {
    if (!isOnline) {
      await offlineStorage.addToSyncQueue(data);
      return;
    }
    await syncPendingData();
  };

  return {
    isOnline,
    syncing,
    syncData,
  };
}
