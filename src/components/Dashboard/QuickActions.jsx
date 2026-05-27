import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../UI/GlassCard';
import { WiBarometer, WiCloud, WiDaySunny, WiStars } from 'react-icons/wi';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <WiDaySunny className="text-4xl text-yellow-400" />,
      label: 'Refresh Weather',
      description: 'Get latest updates',
      action: () => window.location.reload(),
      color: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      icon: <WiBarometer className="text-4xl text-blue-400" />,
      label: 'View Goals',
      description: 'Track wellness',
      action: () => navigate('/goals'),
      color: 'from-blue-500/20 to-purple-500/20',
    },
    {
      icon: <WiCloud className="text-4xl text-cyan-400" />,
      label: '7-Day Forecast',
      description: 'Plan ahead',
      action: () => navigate('/dashboard'),
      color: 'from-cyan-500/20 to-blue-500/20',
    },
    {
      icon: <WiStars className="text-4xl text-purple-400" />,
      label: 'Statistics',
      description: 'View analytics',
      action: () => navigate('/statistics'),
      color: 'from-purple-500/20 to-pink-500/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.action}
              className={`bg-gradient-to-br ${action.color} backdrop-blur-sm rounded-xl p-4 border border-white/10 text-left hover:scale-105 transition-transform`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="mb-2">{action.icon}</div>
              <div className="text-white font-semibold text-sm">{action.label}</div>
              <div className="text-white/50 text-xs mt-1">{action.description}</div>
            </motion.button>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default QuickActions;
