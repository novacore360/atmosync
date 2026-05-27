import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { format } from 'date-fns';

const WeatherNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated weather news (in production, fetch from API)
    const mockNews = [
      {
        id: 1,
        title: 'Tropical Storm Watch Issued for Coastal Areas',
        description: 'Meteorologists are monitoring a developing tropical system that could bring heavy rainfall and strong winds to coastal regions this weekend.',
        category: 'Severe Weather',
        severity: 'high',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        source: 'National Weather Service',
      },
      {
        id: 2,
        title: 'Record-Breaking Heatwave Expected Next Week',
        description: 'Temperatures are forecasted to reach unprecedented levels, prompting health officials to issue early warnings for vulnerable populations.',
        category: 'Heat Advisory',
        severity: 'medium',
        time: new Date(Date.now() - 5 * 60 * 60 * 1000),
        source: 'Weather Channel',
      },
      {
        id: 3,
        title: 'Air Quality Improves After Recent Rains',
        description: 'Recent precipitation has helped clear pollutants from the atmosphere, resulting in the best air quality readings in months.',
        category: 'Air Quality',
        severity: 'low',
        time: new Date(Date.now() - 8 * 60 * 60 * 1000),
        source: 'EPA',
      },
      {
        id: 4,
        title: 'La Niña Pattern Expected to Continue',
        description: 'Climate models suggest the current La Niña pattern will persist through the season, affecting global weather patterns.',
        category: 'Climate',
        severity: 'low',
        time: new Date(Date.now() - 12 * 60 * 60 * 1000),
        source: 'NOAA',
      },
    ];

    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-2/3"></div>
      </GlassCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Weather News</h3>
          <span className="text-sm text-white/50">{news.length} updates</span>
        </div>

        <div className="space-y-4">
          {news.map((item) => (
            <motion.div
              key={item.id}
              className={`border-l-4 rounded-r-xl p-4 ${getSeverityColor(item.severity)}`}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-white/50 uppercase">
                  {item.category}
                </span>
                <span className="text-xs text-white/40">
                  {format(item.time, 'HH:mm')}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
              <p className="text-white/60 text-sm mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">Source: {item.source}</span>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Read more →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default WeatherNews;
