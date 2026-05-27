import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/UI/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { offlineStorage } from '../services/offlineStorage';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    unit: 'metric',
    autoRefresh: true,
    refreshInterval: 5,
    notifications: true,
    locationServices: true,
    offlineMode: false,
    dataSync: true,
  });

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await offlineStorage.savePreference('settings', newSettings);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 md:p-8 pt-20 pb-24"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Settings
        </motion.h1>

        <div className="space-y-6">
          {/* Theme Settings */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Theme</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['auto', 'sunrise', 'afternoon', 'night'].map((themeOption) => (
                <motion.button
                  key={themeOption}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(themeOption)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === themeOption
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/50'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {themeOption === 'auto' && '🌅'}
                    {themeOption === 'sunrise' && '🌄'}
                    {themeOption === 'afternoon' && '☀️'}
                    {themeOption === 'night' && '🌙'}
                  </div>
                  <div className="text-sm capitalize">{themeOption}</div>
                </motion.button>
              ))}
            </div>
          </GlassCard>

          {/* Units */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Measurement Units</h3>
            <div className="flex gap-4">
              {['metric', 'imperial'].map((unit) => (
                <motion.button
                  key={unit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateSetting('unit', unit)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all ${
                    settings.unit === unit
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/50'
                  }`}
                >
                  {unit === 'metric' ? '°C, km/h' : '°F, mph'}
                </motion.button>
              ))}
            </div>
          </GlassCard>

          {/* Toggle Settings */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              {[
                { key: 'autoRefresh', label: 'Auto-refresh weather', description: 'Automatically update weather data' },
                { key: 'notifications', label: 'Push notifications', description: 'Receive weather alerts and reminders' },
                { key: 'locationServices', label: 'Location services', description: 'Use GPS for accurate weather' },
                { key: 'offlineMode', label: 'Offline mode', description: 'Use cached data when offline' },
                { key: 'dataSync', label: 'Cloud sync', description: 'Sync data across devices' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-white font-semibold">{item.label}</div>
                    <div className="text-white/50 text-sm">{item.description}</div>
                  </div>
                  <button
                    onClick={() => updateSetting(item.key, !settings[item.key])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings[item.key] ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.span
                      className="inline-block h-4 w-4 rounded-full bg-white"
                      animate={{ x: settings[item.key] ? 24 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Data Management */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Data Management</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors text-left"
              >
                Clear Local Data
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete all synced data? This cannot be undone.')) {
                    // Delete synced data
                  }
                }}
                className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors text-left"
              >
                Delete Synced Data
              </button>
            </div>
          </GlassCard>

          {/* About */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4">About</h3>
            <div className="text-white/70 space-y-2">
              <p>Atmosync v1.0.0</p>
              <p>Premium Weather App with Adaptive Wellness Goals</p>
              <p className="text-sm">Made with ❤️ for weather enthusiasts</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
