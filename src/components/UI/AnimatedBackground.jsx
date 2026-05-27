import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';

const AnimatedBackground = () => {
  const { currentWeather } = useWeather();
  const { currentTheme } = useTheme();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const condition = currentWeather?.weather[0]?.main;

      if (condition === 'Rain' || condition === 'Drizzle') {
        for (let i = 0; i < 100; i++) {
          newParticles.push({
            id: i,
            type: 'rain',
            x: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 0.5 + Math.random() * 0.5,
          });
        }
      } else if (condition === 'Snow') {
        for (let i = 0; i < 50; i++) {
          newParticles.push({
            id: i,
            type: 'snow',
            x: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
            size: 2 + Math.random() * 4,
          });
        }
      } else if (condition === 'Clear' && currentTheme === 'night') {
        for (let i = 0; i < 30; i++) {
          newParticles.push({
            id: i,
            type: 'star',
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 1 + Math.random() * 2,
          });
        }
      }

      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 10000);
    return () => clearInterval(interval);
  }, [currentWeather, currentTheme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${
              particle.type === 'rain' 
                ? 'w-0.5 h-8 bg-blue-400/30' 
                : particle.type === 'snow' 
                ? 'rounded-full bg-white/50'
                : 'w-1 h-1 rounded-full bg-yellow-200'
            }`}
            style={{
              left: `${particle.x}%`,
              top: particle.type === 'star' ? `${particle.y}%` : '-10%',
              width: particle.size ? `${particle.size}px` : undefined,
              height: particle.size ? `${particle.size}px` : undefined,
            }}
            initial={{ 
              y: particle.type === 'star' ? 0 : -10,
              opacity: 0 
            }}
            animate={{
              y: particle.type === 'star' ? [-2, 2, -2] : '110vh',
              opacity: particle.type === 'star' ? [0.3, 1, 0.3] : [0.6, 0.2],
              x: particle.type === 'rain' ? [0, -5, 0] : 0,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Lightning effect */}
      {currentWeather?.weather[0]?.main === 'Thunderstorm' && (
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: Math.random() * 5 + 2,
          }}
        />
      )}
    </div>
  );
};

export default AnimatedBackground;
