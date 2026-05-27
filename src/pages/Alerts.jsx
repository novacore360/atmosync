import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/UI/GlassCard';
import { useWeather } from '../context/WeatherContext';
import { WiThunderstorm, WiRain, WiDaySunny, WiSnow, WiStrongWind } from 'react-icons/wi';

const Alerts = () => {
  const { weatherAlerts } = useWeather();
  const [alertPreferences, setAlertPreferences] = useState({
    rain: true,
    storm: true,
    heat: true,
    cold: true,
    uv: true,
    wind: true,
  });

  const mockAlerts = [
    {
      id: 1,
      type: 'storm',
      severity: 'high',
      title: 'Thunderstorm Warning',
      message: 'Severe thunderstorms expected in your area within the next 2 hours. Take necessary precautions.',
      time: '2 hours ago',
      icon: <WiThunderstorm className="text-5xl text-yellow-400" />,
    },
    {
      id: 2,
      type: 'rain',
      severity: 'medium',
      title: 'Heavy Rain Alert',
      message: 'Heavy rainfall expected to continue throughout the evening. Risk of flooding in low-lying areas.',
      time: '4 hours ago',
      icon: <WiRain className="text-5xl text-blue-400" />,
    },
    {
      id: 3,
      type: 'heat',
      severity: 'high',
      title: 'Heat Advisory',
      message: 'Temperatures expected to reach 38°C. Stay hydrated and avoid prolonged sun exposure.',
      time: '6 hours ago',
      icon: <WiDaySunny className="text-5xl text-orange-400" />,
    },
    {
      id: 4,
      type: 'wind',
      severity: 'low',
      title: 'Strong Wind Warning',
      message: 'Wind gusts up to 45 km/h expected. Secure loose outdoor objects.',
      time: '12 hours ago',
      icon: <WiStrongWind className="text-5xl text-gray-400" />,
    },
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 md:p-8 pt-20 pb-24"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Weather Alerts
        </motion.h1>

        {/* Alert Preferences */}
        <GlassCard className="p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Alert Preferences</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(alertPreferences).map(([key, value]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAlertPreferences(prev => ({ ...prev, [key]: !prev[key] }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  value 
                    ? 'border-blue-500 bg-blue-500/20 text-white' 
                    : 'border-white/20 bg-white/5 text-white/50'
                }`}
              >
                <div className="text-2xl mb-2">
                  {key === 'rain' && '🌧️'}
                  {key === 'storm' && '⛈️'}
                  {key === 'heat' && '🔥'}
                  {key === 'cold' && '❄️'}
                  {key === 'uv' && '☀️'}
                  {key === 'wind' && '💨'}
                </div>
                <div className="text-sm capitalize">{key}</div>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        {/* Active Alerts */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white mb-4">Active Alerts</h3>
          {(weatherAlerts.length > 0 ? weatherAlerts : mockAlerts).map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className={`p-6 border-l-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{alert.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-white">{alert.title}</h4>
                      <span className="text-sm text-white/50">{alert.time}</span>
                    </div>
                    <p className="text-white/70 mb-4">{alert.message}</p>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alert.severity === 'high' ? 'bg-red-500 text-white' :
                        alert.severity === 'medium' ? 'bg-yellow-500 text-black' :
                        'bg-blue-500 text-white'
                      }`}>
                        {alert.severity.toUpperCase()} SEVERITY
                      </span>
                      <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Emergency Contacts */}
        <GlassCard className="p-6 mt-8">
          <h3 className="text-2xl font-bold text-white mb-4">Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Emergency Services', number: '911', icon: '🚨' },
              { name: 'Weather Service', number: '1-800-WEATHER', icon: '🌡️' },
              { name: 'Local Hospital', number: '1-800-HOSPITAL', icon: '🏥' },
            ].map((contact, index) => (
              <motion.div
                key={index}
                className="bg-white/5 rounded-xl p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">{contact.icon}</div>
                <div className="text-white font-semibold">{contact.name}</div>
                <div className="text-blue-400">{contact.number}</div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default Alerts;
