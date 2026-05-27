import React from 'react';
import { motion } from 'framer-motion';
import { WiHumidity, WiStrongWind, WiBarometer, WiSunrise, WiSunset } from 'react-icons/wi';
import GlassCard from '../UI/GlassCard';
import WeatherIcon from '../UI/WeatherIcon';
import { format } from 'date-fns';
import { useWeather } from '../../context/WeatherContext';

const CurrentWeather = () => {
  const { currentWeather, airQuality, loading, location } = useWeather();

  if (loading || !currentWeather) {
    return (
      <GlassCard className="p-8 animate-pulse">
        <div className="h-24 bg-white/10 rounded-lg mb-4"></div>
        <div className="h-8 bg-white/10 rounded w-3/4"></div>
      </GlassCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Weather Display */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Current Weather
                </h2>
                <p className="text-lg text-white/70">
                  {location ? `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°` : 'Loading location...'}
                </p>
              </div>
              <WeatherIcon 
                condition={currentWeather.weather[0]?.main} 
                size="large" 
              />
            </div>

            <div className="mb-8">
              <motion.div 
                className="text-7xl font-bold text-white mb-2"
                key={currentWeather.temp}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {currentWeather.temp}°
              </motion.div>
              <p className="text-xl text-white/80 capitalize">
                {currentWeather.weather[0]?.description}
              </p>
              <p className="text-lg text-white/60 mt-1">
                Feels like {currentWeather.feelsLike}°
              </p>
            </div>

            {/* Air Quality */}
            {airQuality && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Air Quality Index</h3>
                <div className="flex items-center space-x-3">
                  <div className={`px-4 py-2 rounded-full text-white font-bold ${
                    airQuality.aqi <= 50 ? 'bg-green-500' :
                    airQuality.aqi <= 100 ? 'bg-yellow-500' :
                    airQuality.aqi <= 150 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}>
                    {airQuality.aqi}
                  </div>
                  <span className="text-white/70">
                    {airQuality.aqi <= 50 ? 'Good' :
                     airQuality.aqi <= 100 ? 'Moderate' :
                     airQuality.aqi <= 150 ? 'Unhealthy for Sensitive Groups' :
                     'Unhealthy'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Weather Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <WiHumidity className="text-3xl" />, label: 'Humidity', value: `${currentWeather.humidity}%` },
                { icon: <WiStrongWind className="text-3xl" />, label: 'Wind', value: `${currentWeather.windSpeed} m/s` },
                { icon: <WiBarometer className="text-3xl" />, label: 'Pressure', value: `${currentWeather.pressure} hPa` },
                { icon: <WiSunrise className="text-3xl" />, label: 'UV Index', value: currentWeather.uvi?.toFixed(1) },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-blue-300 mb-2">{item.icon}</div>
                  <div className="text-sm text-white/60">{item.label}</div>
                  <div className="text-xl font-bold text-white">{item.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Sunrise/Sunset */}
            {currentWeather.sunrise && currentWeather.sunset && (
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4">
                <div className="text-center">
                  <WiSunrise className="text-3xl text-yellow-400 mx-auto mb-1" />
                  <div className="text-sm text-white/60">Sunrise</div>
                  <div className="text-lg font-bold text-white">
                    {format(new Date(currentWeather.sunrise * 1000), 'HH:mm')}
                  </div>
                </div>
                <div className="text-center">
                  <WiSunset className="text-3xl text-orange-400 mx-auto mb-1" />
                  <div className="text-sm text-white/60">Sunset</div>
                  <div className="text-lg font-bold text-white">
                    {format(new Date(currentWeather.sunset * 1000), 'HH:mm')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default CurrentWeather;
