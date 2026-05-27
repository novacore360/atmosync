import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { WiThunderstorm, WiRain, WiDaySunny, WiSnow, WiStrongWind, WiFlood } from 'react-icons/wi';

const WeatherAlerts = () => {
  const { weatherAlerts } = useWeather();

  const getAlertIcon = (type) => {
    const iconMap = {
      thunderstorm: <WiThunderstorm className="text-4xl text-yellow-400" />,
      rain: <WiRain className="text-4xl text-blue-400" />,
      heat: <WiDaySunny className="text-4xl text-orange-400" />,
      cold: <WiSnow className="text-4xl text-blue-200" />,
      wind: <WiStrongWind className="text-4xl text-gray-400" />,
      flood: <WiFlood className="text-4xl text-blue-500" />,
    };
    return iconMap[type] || <WiDaySunny className="text-4xl text-yellow-400" />;
  };

  const getSeverityStyles = (severity) => {
    switch(severity) {
      case 'extreme':
        return 'border-red-600 bg-red-600/20 text-red-400';
      case 'severe':
        return 'border-red-500 bg-red-500/10 text-red-300';
      case 'moderate':
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-300';
      default:
        return 'border-blue-500 bg-blue-500/10 text-blue-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Weather Alerts</h3>
          {weatherAlerts.length > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
              {weatherAlerts.length} Active
            </span>
          )}
        </div>

        {weatherAlerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-white/60">No active weather alerts</p>
            <p className="text-white/40 text-sm mt-2">You're all clear!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {weatherAlerts.map((alert, index) => (
              <motion.div
                key={alert.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-l-4 rounded-r-xl p-4 ${getSeverityStyles(alert.severity)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-white">
                        {alert.title || alert.event}
                      </h4>
                      {alert.severity && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          alert.severity === 'extreme' ? 'bg-red-600 text-white' :
                          alert.severity === 'severe' ? 'bg-red-500 text-white' :
                          'bg-yellow-500 text-black'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 mb-2">
                      {alert.message || alert.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-white/50">
                      {alert.start && (
                        <span>Start: {new Date(alert.start * 1000).toLocaleString()}</span>
                      )}
                      {alert.end && (
                        <span>End: {new Date(alert.end * 1000).toLocaleString()}</span>
                      )}
                      {alert.sender_name && (
                        <span>Source: {alert.sender_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default WeatherAlerts;
