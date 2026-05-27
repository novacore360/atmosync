import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/UI/GlassCard';
import { useWeather } from '../context/WeatherContext';
import { WiThunderstorm, WiFlood, WiHurricane, WiEarthquake } from 'react-icons/wi';

const EmergencyMode = () => {
  const { currentWeather, weatherAlerts } = useWeather();
  const navigate = useNavigate();
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    // Get emergency contacts from storage
    const savedContacts = JSON.parse(localStorage.getItem('emergency-contacts') || '[]');
    setEmergencyContacts(savedContacts.length > 0 ? savedContacts : [
      { name: 'Emergency Services', number: '911', type: 'police' },
      { name: 'Fire Department', number: '911', type: 'fire' },
      { name: 'Ambulance', number: '911', type: 'medical' },
      { name: 'Weather Emergency', number: '1-800-WEATHER', type: 'weather' },
    ]);

    // Get current location
    const savedLocation = localStorage.getItem('last-location');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }

    // Monitor battery
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLevel(battery.level * 100);
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });
      });
    }

    // Check offline status
    setIsOfflineMode(!navigator.onLine);
    window.addEventListener('online', () => setIsOfflineMode(false));
    window.addEventListener('offline', () => setIsOfflineMode(true));

    return () => {
      window.removeEventListener('online', () => setIsOfflineMode(false));
      window.removeEventListener('offline', () => setIsOfflineMode(true));
    };
  }, []);

  const emergencyTips = [
    {
      icon: <WiThunderstorm className="text-5xl text-yellow-400" />,
      title: 'Thunderstorm Safety',
      items: [
        'Stay indoors and away from windows',
        'Unplug electrical appliances',
        'Avoid using landline phones',
        'Stay away from water sources',
        'If outside, avoid tall objects and open fields'
      ]
    },
    {
      icon: <WiFlood className="text-5xl text-blue-400" />,
      title: 'Flood Safety',
      items: [
        'Move to higher ground immediately',
        'Avoid walking or driving through flood waters',
        'Stay away from power lines',
        'Keep emergency kit ready',
        'Follow evacuation orders immediately'
      ]
    },
    {
      icon: <WiHurricane className="text-5xl text-red-400" />,
      title: 'Hurricane/Typhoon Safety',
      items: [
        'Secure loose outdoor objects',
        'Board up windows and doors',
        'Fill bathtub with water',
        'Stay in interior room away from windows',
        'Keep battery-powered radio ready'
      ]
    },
  ];

  const evacuationInfo = {
    centers: [
      { name: 'Community Center', address: '123 Main St', distance: '2.5 km' },
      { name: 'High School Gym', address: '456 School Ave', distance: '5.1 km' },
      { name: 'Public Library', address: '789 Book Rd', distance: '7.3 km' },
    ],
    routes: [
      'Main evacuation route: Highway 101 North',
      'Alternative route: County Road 45 East',
      'Emergency route: Forest Road 12 West'
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-red-900 p-4 md:p-8 pt-20 pb-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Emergency Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          <div className="text-8xl mb-4">🚨</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            EMERGENCY MODE
          </h1>
          <p className="text-xl text-red-300 mb-2">
            Stay calm and follow safety instructions
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              batteryLevel > 50 ? 'bg-green-500' : batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
            } text-white`}>
              Battery: {Math.round(batteryLevel)}%
            </div>
            {isOfflineMode && (
              <div className="px-4 py-2 bg-yellow-500 rounded-full text-sm font-semibold text-black">
                Offline Mode Active
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emergency Contacts */}
          <GlassCard className="p-6 border-l-4 border-red-500">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              📞 Emergency Contacts
            </h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <motion.a
                  key={index}
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-between bg-red-500/20 hover:bg-red-500/30 rounded-xl p-4 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div>
                    <div className="text-white font-semibold">{contact.name}</div>
                    <div className="text-white/60 text-sm">{contact.type}</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{contact.number}</div>
                </motion.a>
              ))}
            </div>
            <button
              onClick={() => {
                const newContact = prompt('Enter contact name:');
                const newNumber = prompt('Enter phone number:');
                if (newContact && newNumber) {
                  const updated = [...emergencyContacts, { name: newContact, number: newNumber, type: 'custom' }];
                  setEmergencyContacts(updated);
                  localStorage.setItem('emergency-contacts', JSON.stringify(updated));
                }
              }}
              className="w-full mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              + Add Emergency Contact
            </button>
          </GlassCard>

          {/* Current Weather Alert */}
          <GlassCard className="p-6 border-l-4 border-yellow-500">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              ⚠️ Active Weather Warnings
            </h3>
            {weatherAlerts && weatherAlerts.length > 0 ? (
              <div className="space-y-3">
                {weatherAlerts.map((alert, index) => (
                  <div key={index} className="bg-yellow-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-white">{alert.event}</h4>
                    <p className="text-white/70 text-sm mt-1">{alert.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">No active severe weather warnings</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Emergency Tips */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">📋 Emergency Safety Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="text-center mb-4">{tip.icon}</div>
                  <h4 className="text-xl font-bold text-white text-center mb-4">{tip.title}</h4>
                  <ul className="space-y-2">
                    {tip.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-white/70 text-sm">
                        <span className="text-red-400 mr-2 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Evacuation Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4">🏃 Evacuation Centers</h3>
            <div className="space-y-3">
              {evacuationInfo.centers.map((center, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold">{center.name}</h4>
                      <p className="text-white/60 text-sm">{center.address}</p>
                    </div>
                    <span className="text-green-400 text-sm">{center.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4">🗺️ Evacuation Routes</h3>
            <div className="space-y-3">
              {evacuationInfo.routes.map((route, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">➡️</span>
                  <p className="text-white/70">{route}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Save Battery', action: () => alert('Enable battery saver mode'), icon: '🔋' },
            { label: 'Share Location', action: () => {
              if (location) {
                navigator.clipboard.writeText(`${location.latitude},${location.longitude}`);
                alert('Location copied!');
              }
            }, icon: '📍' },
            { label: 'First Aid Guide', action: () => window.open('https://www.redcross.org/take-a-class/first-aid'), icon: '🏥' },
            { label: 'Exit Emergency Mode', action: () => navigate('/dashboard'), icon: '🔙' },
          ].map((action, index) => (
            <motion.button
              key={index}
              onClick={action.action}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="text-white text-sm">{action.label}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyMode;
