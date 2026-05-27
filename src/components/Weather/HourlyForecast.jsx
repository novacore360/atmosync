import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../UI/GlassCard';
import WeatherIcon from '../UI/WeatherIcon';
import { useWeather } from '../../context/WeatherContext';
import { format } from 'date-fns';

const HourlyForecast = () => {
  const { hourlyForecast, loading } = useWeather();

  if (loading || !hourlyForecast?.length) {
    return (
      <GlassCard className="p-6 animate-pulse">
        <div className="h-64 bg-white/10 rounded-lg"></div>
      </GlassCard>
    );
  }

  const chartData = hourlyForecast.slice(0, 24).map(hour => ({
    time: format(new Date(hour.time), 'HH:mm'),
    temp: hour.temp,
    rainProbability: hour.rainProbability,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Hourly Forecast</h3>
        
        {/* Temperature Chart */}
        <div className="h-48 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Cards */}
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {hourlyForecast.slice(0, 8).map((hour, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-24 bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-sm text-white/60 mb-2">
                {format(new Date(hour.time), 'HH:mm')}
              </p>
              <WeatherIcon 
                condition={hour.weather?.text || 'Clear'} 
                size="small" 
              />
              <p className="text-lg font-bold text-white mt-2">{Math.round(hour.temp)}°</p>
              {hour.rainProbability > 0 && (
                <p className="text-xs text-blue-300 mt-1">
                  💧 {hour.rainProbability}%
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default HourlyForecast;
