import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../components/UI/GlassCard';
import { offlineStorage } from '../services/offlineStorage';
import { format, subDays } from 'date-fns';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', unit: '', type: 'hydration' });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadGoals();
    generateMockHistory();
  }, []);

  const loadGoals = async () => {
    const savedGoals = await offlineStorage.getGoals();
    setGoals(savedGoals);
  };

  const generateMockHistory = () => {
    const mockData = Array.from({ length: 7 }, (_, i) => ({
      date: format(subDays(new Date(), 6 - i), 'MM/dd'),
      hydration: Math.floor(Math.random() * 8) + 1,
      steps: Math.floor(Math.random() * 10000) + 2000,
      outdoorHours: Math.floor(Math.random() * 4),
    }));
    setHistory(mockData);
  };

  const addGoal = async () => {
    const goal = {
      id: Date.now().toString(),
      ...newGoal,
      current: 0,
      createdAt: Date.now(),
    };
    await offlineStorage.saveGoal(goal);
    setGoals([...goals, goal]);
    setNewGoal({ title: '', target: '', unit: '', type: 'hydration' });
  };

  const updateProgress = async (goalId, amount) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + amount, goal.target);
        return { ...goal, current: newCurrent };
      }
      return goal;
    });
    setGoals(updatedGoals);
    await offlineStorage.saveGoal(updatedGoals.find(g => g.id === goalId));
  };

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
          Wellness Goals
        </motion.h1>

        {/* Add New Goal */}
        <GlassCard className="p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Create New Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Goal title"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <input
              type="number"
              placeholder="Target"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
            />
            <input
              type="text"
              placeholder="Unit (e.g., glasses)"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50"
              value={newGoal.unit}
              onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
            />
            <select
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white"
              value={newGoal.type}
              onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
            >
              <option value="hydration">Hydration</option>
              <option value="steps">Steps</option>
              <option value="outdoorHours">Outdoor Time</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <button
            onClick={addGoal}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            Add Goal
          </button>
        </GlassCard>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">{goal.title}</h4>
                    <p className="text-white/60">
                      {goal.current} / {goal.target} {goal.unit}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {goal.type === 'hydration' && '💧'}
                    {goal.type === 'steps' && '👟'}
                    {goal.type === 'outdoorHours' && '🌳'}
                    {goal.type === 'custom' && '🎯'}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateProgress(goal.id, 1)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateProgress(goal.id, 5)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                  >
                    +5
                  </button>
                  {goal.type === 'steps' && (
                    <button
                      onClick={() => updateProgress(goal.id, 500)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                    >
                      +500
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Progress History Chart */}
        {history.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-6">7-Day Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
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
                  <Line type="monotone" dataKey="hydration" stroke="#3b82f6" name="Hydration" />
                  <Line type="monotone" dataKey="steps" stroke="#10b981" name="Steps" />
                  <Line type="monotone" dataKey="outdoorHours" stroke="#f59e0b" name="Outdoor Hours" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}
      </div>
    </motion.div>
  );
};

export default Goals;
