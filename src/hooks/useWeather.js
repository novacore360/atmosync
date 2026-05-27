import { useState, useEffect, useCallback } from 'react';
import { weatherApi } from '../services/weatherApi';
import { offlineStorage } from '../services/offlineStorage';

export function useWeather(lat, lon) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    try {
      let currentWeather, forecastData, airQualityData;

      if (navigator.onLine) {
        [currentWeather, forecastData, airQualityData] = await Promise.all([
          weatherApi.getCurrentWeather(lat, lon),
          weatherApi.getForecast(lat, lon),
          weatherApi.getAirQuality(lat, lon),
        ]);

        // Cache data for offline use
        await offlineStorage.saveWeatherData({
          current: currentWeather,
          forecast: forecastData,
          airQuality: airQualityData,
        });
      } else {
        // Use cached data when offline
        const cachedData = await offlineStorage.getWeatherData();
        if (cachedData) {
          currentWeather = cachedData.current;
          forecastData = cachedData.forecast;
          airQualityData = cachedData.airQuality;
        } else {
          throw new Error('No internet connection and no cached data available');
        }
      }

      setWeather(currentWeather);
      setForecast(forecastData);
      setAirQuality(airQualityData);
    } catch (err) {
      setError(err.message);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    fetchWeather();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchWeather]);

  return {
    weather,
    forecast,
    airQuality,
    loading,
    error,
    refetch: fetchWeather,
  };
}
