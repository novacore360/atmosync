import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { weatherApi } from '../services/weatherApi';
import { offlineStorage } from '../services/offlineStorage';

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
        hourlyForecast: action.payload.hourly || [],
        weeklyForecast: action.payload.weekly || [],
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
    default:
      return state;
  }
}

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const { location, error: locationError } = useGeolocation();

  const generateSmartSuggestions = useCallback((weatherData) => {
    if (!weatherData) return [];
    
    const suggestions = [];
    const temp = weatherData.temp;
    const condition = weatherData.weather?.[0]?.main;

    if (temp > 30) {
      suggestions.push({
        type: 'warning',
        message: 'High temperature alert',
        items: ['Drink plenty of water', 'Avoid direct sunlight', 'Use SPF 50+ sunscreen', 'Take frequent breaks in shade'],
      });
    } else if (temp < 10) {
      suggestions.push({
        type: 'info',
        message: 'Cold weather advisory',
        items: ['Wear warm layers', 'Protect extremities', 'Limit outdoor exposure', 'Stay hydrated despite cold'],
      });
    }

    if (condition === 'Rain') {
      suggestions.push({
        type: 'warning',
        message: 'Rain alert',
        items: ['Carry an umbrella', 'Drive carefully', 'Avoid flooded areas', 'Wear waterproof clothing'],
      });
    }

    return suggestions;
  }, []);

  const fetchWeatherData = useCallback(async (lat, lon) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      console.log('Fetching weather data...');
      
      const currentWeather = await weatherApi.getCurrentWeather(lat, lon);
      console.log('Current weather:', currentWeather);
      
      const forecast = await weatherApi.getForecast(lat, lon);
      console.log('Forecast:', forecast);
      
      const airQuality = await weatherApi.getAirQuality(lat, lon);
      console.log('Air quality:', airQuality);

      const weatherData = {
        current: currentWeather,
        hourly: forecast?.hourly || [],
        weekly: forecast?.daily || [],
        airQuality: airQuality,
        alerts: [],
      };

      await offlineStorage.saveWeatherData(weatherData);
      dispatch({ type: 'SET_WEATHER_DATA', payload: weatherData });

      const suggestions = generateSmartSuggestions(currentWeather);
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
    } catch (error) {
      console.error('Weather fetch error:', error);
      
      // Try to load cached data
      const cachedData = await offlineStorage.getWeatherData();
      if (cachedData) {
        console.log('Using cached weather data');
        dispatch({ type: 'SET_WEATHER_DATA', payload: cachedData });
      } else {
        dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load weather data' });
      }
    }
  }, [generateSmartSuggestions]);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude);
    }
  }, [location, fetchWeatherData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (location) {
        fetchWeatherData(location.latitude, location.longitude);
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [location, fetchWeatherData]);

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
