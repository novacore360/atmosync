import React from 'react';
import { motion } from 'framer-motion';
import { WiDaySunny, WiRain, WiCloud, WiSnow } from 'react-icons/wi';
import { format } from 'date-fns';

const LockScreen = ({ weather }) => {
  const getWeatherIcon = (condition) => {
    switch(condition) {
      case 'Clear': return <WiDaySunny className="text-8xl text-yellow-400" />;
      case 'Rain': return <WiRain className="text-8xl text-blue-400" />;
      case 'Snow': return <WiSnow className="text-8xl text-white" />;
      default: return <WiCloud className="text-8xl text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* Time */}
        <div className="text-7xl font-bold text-white mb-2">
          {format(new Date(), 'HH:mm')}
        </div>
        <div className="text-2xl text-white/60 mb-12">
          {format(new Date(), 'EEEE, MMMM d')}
        </div>

        {/* Weather */}
        {weather && (
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-sm mx-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="mb-4">
              {getWeatherIcon(weather.weather[0]?.main)}
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              {Math.round(weather.temp)}°C
            </div>
            <div className="text-xl text-white/70 mb-4">
              {weather.weather[0]?.description}
            </div>
            <div className="flex justify-center space-x-6 text-white/50">
              <span>H: {weather.humidity}%</span>
              <span>W: {weather.windSpeed} m/s</span>
            </div>
          </motion.div>
        )}

        {/* Swipe hint */}
        <motion.div
          className="mt-12 text-white/30"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p>Swipe up to unlock</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LockScreen;
