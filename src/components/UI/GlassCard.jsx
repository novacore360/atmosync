import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', onClick, whileHover = true }) => {
  return (
    <motion.div
      className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={whileHover ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
