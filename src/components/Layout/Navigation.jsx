import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  WiDaySunny, 
  WiCloud, 
  WiBarometer, 
  WiStars,
  WiRaindrop,
  WiSunrise 
} from 'react-icons/wi';

const Navigation = () => {
  const navItems = [
    { path: '/', icon: <WiStars className="text-2xl" />, label: 'Home' },
    { path: '/dashboard', icon: <WiDaySunny className="text-2xl" />, label: 'Weather' },
    { path: '/goals', icon: <WiBarometer className="text-2xl" />, label: 'Goals' },
    { path: '/statistics', icon: <WiCloud className="text-2xl" />, label: 'Stats' },
    { path: '/alerts', icon: <WiRaindrop className="text-2xl" />, label: 'Alerts' },
    { path: '/settings', icon: <WiSunrise className="text-2xl" />, label: 'Settings' },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-xl transition-all ${
                  isActive 
                    ? 'text-blue-400 bg-white/10' 
                    : 'text-white/50 hover:text-white/80'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 w-1 h-1 bg-blue-400 rounded-full"
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
