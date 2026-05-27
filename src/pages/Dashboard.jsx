import React from 'react';
import { motion } from 'framer-motion';
import CurrentWeather from '../components/Weather/CurrentWeather';
import HourlyForecast from '../components/Weather/HourlyForecast';
import WeeklyForecast from '../components/Weather/WeeklyForecast';
import SmartSuggestions from '../components/Dashboard/SmartSuggestions';
import WellnessGoals from '../components/Dashboard/WellnessGoals';
import { useWeather } from '../context/WeatherContext';

const Dashboard = () => {
  const { loading, error, refreshWeather } = useWeather();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Weather</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={refreshWeather}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

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
          transition={{ delay: 0.2 }}
        >
          Weather Dashboard
        </motion.h1>

        {loading && !error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <CurrentWeather />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HourlyForecast />
              <SmartSuggestions />
            </div>
            
            <WeeklyForecast />
            <WellnessGoals />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
