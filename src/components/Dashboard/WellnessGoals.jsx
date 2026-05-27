import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GlassCard from '../UI/GlassCard';
import { useWeather } from '../../context/WeatherContext';
import { offlineStorage } from '../../services/offlineStorage';

const WellnessGoals = () => {
  const { currentWeather } = useWeather();
  const [goals, setGoals] = useState({
    hydration: { current: 0, target: 8, unit: 'glasses' },
    steps: { current: 0, target: 10000, unit: 'steps' },
    outdoorHours: { current: 0, target: 2, unit: 'hours' },
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const savedGoals = await offlineStorage.getGoals();
    if (savedGoals.length > 0) {
      const goalsMap = {};
      savedGoals.forEach(goal => {
        goalsMap[goal.type] = goal;
      });
      setGoals(prev => ({ ...prev, ...goalsMap }));
    }
  };

  const updateGoal = async (type, increment = 1) => {
    const newGoals = {
      ...goals,
      [type]: {
        ...goals[type],
        current: Math.min(goals[type].current + increment, goals[type].target),
      },
    };
    setGoals(newGoals);
    await offlineStorage.saveGoal({ type, ...newGoals[type] });
  };

  const getWeatherAdjustedGoal = (type) => {
    if (!currentWeather) return goals[type];
    
    const temp = currentWeather.temp;
    const adjusted = { ...goals[type] };
    
    switch(type) {
      case 'hydration':
        if (temp > 30) adjusted.target = 12;
        else if (temp > 25) adjusted.target = 10;
        break;
      case 'outdoorHours':
        if (temp > 35 || temp < 5 || currentWeather.weather[0]?.main === 'Rain') {
          adjusted.target = 0;
        }
        break;
    }
    
    return adjusted;
  };

  const goalItems = [
    {
      type: 'hydration',
      icon: '💧',
      label: 'Hydration',
      color: '#3b82f6',
    },
    {
      type: 'steps',
      icon: '👟',
      label: 'Steps',
      color: '#10b981',
    },
    {
      type: 'outdoorHours',
      icon: '🌳',
      label: 'Outdoor Time',
      color: '#f59e0b',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Wellness Goals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goalItems.map((item) => {
            const goal = getWeatherAdjustedGoal(item.type);
            const percentage = (goal.current / goal.target) * 100;
            
            return (
              <motion.div
                key={item.type}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-32 h-32 mx-auto mb-4">
                  <CircularProgressbar
                    value={percentage}
                    text={`${goal.current}/${goal.target}`}
                    styles={buildStyles({
                      textSize: '16px',
                      pathColor: item.color,
                      textColor: '#fff',
                      trailColor: 'rgba(255,255,255,0.1)',
                    })}
                  />
                </div>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-1">{item.label}</h4>
                <p className="text-sm text-white/60 mb-3">
                  {goal.current} / {goal.target} {goal.unit}
                </p>
                <button
                  onClick={() => updateGoal(item.type)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
                >
                  + Add {goal.unit === 'glasses' ? 'Glass' : goal.unit === 'steps' ? '500 Steps' : '30 Min'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default WellnessGoals;
