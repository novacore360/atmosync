import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          className="text-9xl mb-8"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1.1, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          🌪️
        </motion.div>
        
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl text-white/70 mb-6">Page Not Found</h2>
        <p className="text-white/50 mb-8">
          Looks like this page got swept away by a storm! 
          Let's get you back to safety.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-12 text-white/30">
          <p>Lost? Try searching for what you need:</p>
          <div className="flex gap-2 mt-4 justify-center">
            {['Weather', 'Goals', 'Stats', 'Alerts'].map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                className="px-4 py-2 bg-white/5 rounded-full text-sm hover:bg-white/10 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
