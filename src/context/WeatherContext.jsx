import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { weatherApi } from '../services/weatherApi';
import { offlineStorage } from '../services/offlineStorage';
import { useOfflineSync } from '../hooks/useOfflineSync';

const WeatherContext = createContext();

const initialState = {
  currentWeather: null,
  hourlyForecast: [],
  weeklyForecast: [],
  airQuality: null,
  loading: true,
  error: null,
  lastUpdated: null,
  weatherAlerts: [],
  suggestions: [],
};

function weatherReducer(state, action) {
  switch (action.type) {
    case 'SET_WEATHER_DATA':
      return {
        ...state,
        currentWeather: action.payload.current,
        hourlyForecast: action.payload.hourly,
        weeklyForecast: action.payload.weekly,
        airQuality: action.payload.airQuality,
        weatherAlerts: action.payload.alerts || [],
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    case 'UPDATE_ALERTS':
      return { ...state, weatherAlerts: action.payload };
    default:
      return state;
  }
}

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const { location, error: locationError } = useGeolocation();
  const { isOnline, syncData } = useOfflineSync();

  const generateSmartSuggestions = useCallback((weatherData) => {
    const suggestions = [];
    const { main, weather, wind, visibility } = weatherData;
    
    // Temperature-based suggestions
    if (main.temp > 30) {
      suggestions.push({
        type: 'warning',
        message: 'High temperature alert',
        items: [
          'Drink plenty of water',
          'Avoid direct sunlight',
          'Use SPF 50+ sunscreen',
          'Take frequent breaks in shade'
        ]
      });
    } else if (main.temp < 10) {
      suggestions.push({
        type: 'info',
        message: 'Cold weather advisory',
        items: [
          'Wear warm layers',
          'Protect extremities',
          'Limit outdoor exposure',
          'Stay hydrated despite cold'
        ]
      });
    }

    // Weather condition suggestions
    if (weather[0].main === 'Rain') {
      suggestions.push({
        type: 'warning',
        message: 'Rain alert',
        items: [
          'Carry an umbrella',
          'Drive carefully',
          'Avoid flooded areas',
          'Wear waterproof clothing'
        ]
      });
    }

    // UV index suggestions
    if (main.uvi > 6) {
      suggestions.push({
        type: 'danger',
        message: 'High UV Index',
        items: [
          'Apply sunscreen every 2 hours',
          'Wear UV-protective sunglasses',
          'Seek shade between 10 AM - 4 PM',
          'Wear a wide-brimmed hat'
        ]
      });
    }

    return suggestions;
  }, []);

  const fetchWeatherData = useCallback(async (lat, lon) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      let weatherData;
      
      if (isOnline) {
        const [currentWeather, forecast, airQuality] = await Promise.all([
          weatherApi.getCurrentWeather(lat, lon),
          weatherApi.getForecast(lat, lon),
          weatherApi.getAirQuality(lat, lon),
        ]);

        weatherData = {
          current: currentWeather,
          hourly: forecast.hourly.slice(0, 24),
          weekly: forecast.daily,
          airQuality: airQuality,
          alerts: currentWeather.alerts || [],
        };

        // Cache data for offline use
        await offlineStorage.saveWeatherData(weatherData);
      } else {
        // Load from cache when offline
        weatherData = await offlineStorage.getWeatherData();
        if (!weatherData) {
          throw new Error('No cached weather data available');
        }
      }

      dispatch({ type: 'SET_WEATHER_DATA', payload: weatherData });
      
      // Generate smart suggestions
      const suggestions = generateSmartSuggestions(weatherData.current);
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [isOnline, generateSmartSuggestions]);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location, fetchWeatherData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (location && isOnline) {
        fetchWeatherData(location.latitude, location.longitude);
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [location, isOnline, fetchWeatherData]);

  const value = {
    ...state,
    location,
    locationError,
    refreshWeather: () => {
      if (location) {
        fetchWeatherData(location.latitude, location.longitude);
      }
    },
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
