import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { WiDaySunny, WiRain, WiSnow, WiThunderstorm, WiStrongWind } from 'react-icons/wi';

const SmartSuggestions = () => {
  const { suggestions } = useWeather();

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return <WiRain className="text-3xl text-blue-400" />;
      case 'danger': return <WiDaySunny className="text-3xl text-yellow-400" />;
      case 'info': return <WiSnow className="text-3xl text-blue-200" />;
      default: return <WiStrongWind className="text-3xl text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Smart Suggestions</h3>
        
        {suggestions.length === 0 ? (
          <p className="text-white/60 text-center py-8">
            Weather conditions are optimal. Enjoy your day!
          </p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border-l-4 ${
                  suggestion.type === 'danger' ? 'border-red-500' :
                  suggestion.type === 'warning' ? 'border-yellow-500' :
                  'border-blue-500'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-3">
                  {getIcon(suggestion.type)}
                  <h4 className="text-lg font-semibold text-white ml-3">
                    {suggestion.message}
                  </h4>
                </div>
                <ul className="space-y-2">
                  {suggestion.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-white/70 text-sm">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default SmartSuggestions;
