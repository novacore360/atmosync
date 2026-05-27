import React from 'react';
import { motion } from 'framer-motion';
import { WiDaySunny, WiRain, WiCloud } from 'react-icons/wi';

const MiniWidget = ({ weather, compact = false }) => {
  if (!weather) return null;

  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 ${
        compact ? 'p-3' : 'p-4'
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-white/60 ${compact ? 'text-xs' : 'text-sm'}`}>
            Current Weather
          </p>
          <p className={`text-white font-bold ${compact ? 'text-xl' : 'text-2xl'}`}>
            {Math.round(weather.temp)}°C
          </p>
          <p className={`text-white/70 ${compact ? 'text-xs' : 'text-sm'}`}>
            {weather.weather[0]?.main}
          </p>
        </div>
        <div className="text-4xl">
          {weather.weather[0]?.main === 'Clear' && <WiDaySunny className="text-yellow-400" />}
          {weather.weather[0]?.main === 'Rain' && <WiRain className="text-blue-400" />}
          {weather.weather[0]?.main === 'Clouds' && <WiCloud className="text-gray-400" />}
        </div>
      </div>
    </motion.div>
  );
};

export default MiniWidget;
