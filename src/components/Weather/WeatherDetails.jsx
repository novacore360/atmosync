import React from 'react';
import { motion } from 'framer-motion';
import { 
  WiHumidity, WiStrongWind, WiBarometer, WiSunrise, WiSunset,
  WiMoonFull, WiDaySunny, WiThermometer, WiRaindrop, WiDust
} from 'react-icons/wi';
import GlassCard from '../UI/GlassCard';
import { useWeather } from '../../context/WeatherContext';

const WeatherDetails = () => {
  const { currentWeather, airQuality } = useWeather();

  if (!currentWeather) return null;

  const details = [
    {
      icon: <WiThermometer className="text-3xl text-red-400" />,
      label: 'Feels Like',
      value: `${Math.round(currentWeather.feelsLike)}°C`,
      description: 'How the temperature actually feels',
    },
    {
      icon: <WiHumidity className="text-3xl text-blue-400" />,
      label: 'Humidity',
      value: `${currentWeather.humidity}%`,
      description: currentWeather.humidity > 70 ? 'High humidity' : currentWeather.humidity < 30 ? 'Low humidity' : 'Comfortable',
    },
    {
      icon: <WiStrongWind className="text-3xl text-teal-400" />,
      label: 'Wind Speed',
      value: `${currentWeather.windSpeed} m/s`,
      description: `${currentWeather.windDeg}° direction`,
    },
    {
      icon: <WiBarometer className="text-3xl text-purple-400" />,
      label: 'Pressure',
      value: `${currentWeather.pressure} hPa`,
      description: currentWeather.pressure > 1013 ? 'High pressure' : 'Low pressure',
    },
    {
      icon: <WiRaindrop className="text-3xl text-cyan-400" />,
      label: 'Visibility',
      value: `${(currentWeather.visibility / 1000).toFixed(1)} km`,
      description: currentWeather.visibility > 10000 ? 'Excellent visibility' : 'Reduced visibility',
    },
    {
      icon: <WiDust className="text-3xl text-yellow-400" />,
      label: 'Air Quality',
      value: airQuality ? `AQI ${airQuality.aqi}` : 'N/A',
      description: airQuality?.mainPollutant || 'No data',
    },
    {
      icon: <WiDaySunny className="text-3xl text-orange-400" />,
      label: 'UV Index',
      value: currentWeather.uvi?.toFixed(1) || 'N/A',
      description: currentWeather.uvi > 7 ? 'Very high' : currentWeather.uvi > 5 ? 'High' : 'Moderate',
    },
    {
      icon: <WiThermometer className="text-3xl text-indigo-400" />,
      label: 'Dew Point',
      value: `${Math.round(currentWeather.dewPoint || 0)}°C`,
      description: 'Temperature at which air becomes saturated',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Weather Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {details.map((detail, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center mb-2">
                {detail.icon}
                <span className="text-white/60 text-sm ml-2">{detail.label}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{detail.value}</div>
              <div className="text-xs text-white/50">{detail.description}</div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default WeatherDetails;
