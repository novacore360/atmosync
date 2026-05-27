import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../UI/GlassCard';
import WeatherIcon from '../UI/WeatherIcon';
import { useWeather } from '../../context/WeatherContext';
import { format } from 'date-fns';

const WeeklyForecast = () => {
  const { weeklyForecast, loading } = useWeather();

  if (loading || !weeklyForecast?.length) {
    return (
      <GlassCard className="p-6 animate-pulse">
        <div className="h-64 bg-white/10 rounded-lg"></div>
      </GlassCard>
    );
  }

  const chartData = weeklyForecast.map(day => ({
    date: format(new Date(day.date), 'EEE'),
    maxTemp: day.maxTemp,
    minTemp: day.minTemp,
    humidity: day.humidity,
    rainProbability: day.rainProbability,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-2xl font-bold text-white mb-6">7-Day Forecast</h3>

        {/* Temperature Range Chart */}
        <div className="h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Bar dataKey="maxTemp" fill="#ef4444" name="Max Temp (°C)" />
              <Bar dataKey="minTemp" fill="#3b82f6" name="Min Temp (°C)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Cards */}
        <div className="space-y-3">
          {weeklyForecast.map((day, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center space-x-4">
                <span className="text-white font-semibold w-16">
                  {format(new Date(day.date), 'EEE')}
                </span>
                <WeatherIcon condition={day.condition?.text || 'Clear'} size="small" />
                <span className="text-white/60 text-sm hidden sm:inline">
                  {day.condition?.text}
                </span>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-sm text-white/60">
                  <span>💧 {day.humidity}%</span>
                  {day.rainProbability > 0 && (
                    <span className="ml-3">🌧️ {day.rainProbability}%</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 font-semibold">{Math.round(day.minTemp)}°</span>
                  <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full"
                      style={{ width: `${((day.maxTemp - day.minTemp) / 20) * 100}%` }}
                    />
                  </div>
                  <span className="text-red-400 font-semibold">{Math.round(day.maxTemp)}°</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default WeeklyForecast;
