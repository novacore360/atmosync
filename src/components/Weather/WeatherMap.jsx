import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';

const WeatherMap = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Weather Radar</h3>
        <div className="relative h-96 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-white/60">
              Interactive weather map coming soon!
            </p>
            <p className="text-white/40 text-sm mt-2">
              Premium feature - upgrade to access live radar
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default WeatherMap;
