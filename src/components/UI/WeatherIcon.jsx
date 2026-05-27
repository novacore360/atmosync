import React from 'react';
import { motion } from 'framer-motion';
import {
  WiDaySunny,
  WiNightClear,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiDayCloudy,
  WiNightCloudy,
  WiDayRain,
  WiNightRain,
  WiDaySnow,
  WiNightSnow,
} from 'react-icons/wi';

const WeatherIcon = ({ condition, size = 'medium', isDay = true }) => {
  const sizeClasses = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl',
  };

  const getIcon = () => {
    const iconMap = {
      Clear: isDay ? WiDaySunny : WiNightClear,
      Clouds: isDay ? WiDayCloudy : WiNightCloudy,
      Rain: isDay ? WiDayRain : WiNightRain,
      Snow: isDay ? WiDaySnow : WiNightSnow,
      Thunderstorm: WiThunderstorm,
      Drizzle: WiRain,
      Mist: WiFog,
      Fog: WiFog,
      Haze: WiFog,
    };

    const IconComponent = iconMap[condition] || WiDaySunny;
    
    return (
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: condition === 'Clear' ? [0, 5, 0] : 0,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <IconComponent className={`${sizeClasses[size]} ${
          condition === 'Clear' ? 'text-yellow-400' :
          condition === 'Rain' ? 'text-blue-400' :
          condition === 'Snow' ? 'text-white' :
          'text-gray-300'
        }`} />
      </motion.div>
    );
  };

  return getIcon();
};

export default WeatherIcon;
