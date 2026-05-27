import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState(null);
  const [downlinkSpeed, setDownlinkSpeed] = useState(null);

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
      
      if (navigator.connection) {
        setConnectionType(navigator.connection.effectiveType);
        setDownlinkSpeed(navigator.connection.downlink);
      }
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateNetworkStatus);
    }

    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return {
    isOnline,
    connectionType,
    downlinkSpeed,
    isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g',
  };
}
