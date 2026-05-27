import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import GlassCard from '../components/UI/GlassCard';
import { useWeather } from '../context/WeatherContext';
import { format, subDays } from 'date-fns';

const Statistics = () => {
  const { currentWeather, hourlyForecast } = useWeather();
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    generateMockHistory();
  }, []);

  const generateMockHistory = () => {
    const conditions = ['Clear', 'Clouds', 'Rain', 'Clear', 'Clouds', 'Rain', 'Clear'];
    const mockHistory = Array.from({ length: 7 }, (_, i) => ({
      date: format(subDays(new Date(), 6 - i), 'MM/dd'),
      temp: Math.floor(Math.random() * 15) + 15,
      humidity: Math.floor(Math.random() * 40) + 40,
      uvIndex: Math.floor(Math.random() * 11),
      condition: conditions[i],
    }));
    setWeatherHistory(mockHistory);

    const mockMood = [
      { mood: 'Happy', value: 35 },
      { mood: 'Energetic', value: 25 },
      { mood: 'Calm', value: 20 },
      { mood: 'Tired', value: 15 },
      { mood: 'Other', value: 5 },
    ];
    setMoodData(mockMood);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const StatCard = ({ title, value, unit, icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className={`text-3xl font-bold mb-1`} style={{ color }}>
        {value}{unit}
      </div>
      <div className="text-white/60 text-sm">{title}</div>
    </motion.div>
  );

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
          Statistics & Analytics
        </motion.h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Avg Temperature"
            value={currentWeather?.temp || 22}
            unit="°C"
            icon="🌡️"
            color="#ef4444"
          />
          <StatCard
            title="Avg Humidity"
            value={currentWeather?.humidity || 65}
            unit="%"
            icon="💧"
            color="#3b82f6"
          />
          <StatCard
            title="UV Index"
            value={currentWeather?.uvi || 5}
            unit=""
            icon="☀️"
            color="#f59e0b"
          />
          <StatCard
            title="Wind Speed"
            value={currentWeather?.windSpeed || 12}
            unit=" km/h"
            icon="💨"
            color="#10b981"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Temperature History */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-6">7-Day Temperature</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weatherHistory}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="temp" stroke="#ef4444" fill="url(#tempGradient)" name="Temperature (°C)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* UV Index Trends */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-6">UV Index Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weatherHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} />
                  <Bar dataKey="uvIndex" fill="#f59e0b" name="UV Index" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Humidity Analysis */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Humidity Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} name="Humidity (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Mood/Weather Correlation */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Mood & Weather</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {moodData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-white/70 text-sm">{entry.mood}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Statistics;
