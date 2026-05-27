import React from 'react';
import { motion } from 'framer-motion';
import { WiDaySunny } from 'react-icons/wi';

const Header = () => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <WiDaySunny className="text-3xl text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">Atmosync</h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
