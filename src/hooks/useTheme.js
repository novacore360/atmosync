import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '../services/offlineStorage';

const themeConfig = {
  sunrise: {
    hours: [5, 8],
    gradient: 'from-orange-400 via-pink-500 to-purple-600',
    textColor: 'text-white',
    accentColor: 'text-orange-300',
  },
  morning: {
    hours: [8, 12],
    gradient: 'from-blue-400 via-cyan-500 to-teal-400',
    textColor: 'text-white',
    accentColor: 'text-yellow-300',
  },
  afternoon: {
    hours: [12, 17],
    gradient: 'from-sky-500 via-blue-600 to-indigo-600',
    textColor: 'text-white',
    accentColor: 'text-cyan-300',
  },
  sunset: {
    hours: [17, 19],
    gradient: 'from-orange-500 via-pink-600 to-purple-700',
    textColor: 'text-white',
    accentColor: 'text-pink-300',
  },
  night: {
    hours: [19, 24, 0, 5],
    gradient: 'from-slate-900 via-purple-900 to-slate-900',
    textColor: 'text-white',
    accentColor: 'text-blue-300',
  },
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState('auto');
  const [themeOverride, setThemeOverride] = useState(null);

  const getTimeBasedTheme = useCallback(() => {
    const hour = new Date().getHours();
    
    for (const [theme, config] of Object.entries(themeConfig)) {
      const ranges = config.hours;
      for (let i = 0; i < ranges.length - 1; i += 2) {
        if (hour >= ranges[i] && hour < ranges[i + 1]) {
          return theme;
        }
      }
    }
    
    return 'night';
  }, []);

  const getWeatherBasedTheme = useCallback((weatherCondition) => {
    const weatherThemes = {
      Rain: {
        gradient: 'from-gray-600 via-blue-500 to-gray-700',
        overlay: 'rain',
      },
      Thunderstorm: {
        gradient: 'from-gray-800 via-purple-700 to-gray-900',
        overlay: 'storm',
      },
      Snow: {
        gradient: 'from-blue-100 via-white to-blue-200',
        overlay: 'snow',
      },
      Clouds: {
        gradient: 'from-gray-400 via-blue-300 to-gray-500',
        overlay: 'clouds',
      },
      Clear: null, // Use time-based theme
    };

    return weatherThemes[weatherCondition] || null;
  }, []);

  useEffect(() => {
    const loadThemePreference = async () => {
      const savedTheme = await offlineStorage.getPreference('theme');
      if (savedTheme) {
        setThemeOverride(savedTheme);
      }
    };
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themeOverride) {
      setCurrentTheme(themeOverride);
      return;
    }

    const updateTheme = () => {
      setCurrentTheme(getTimeBasedTheme());
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [themeOverride, getTimeBasedTheme]);

  const setTheme = async (theme) => {
    setThemeOverride(theme);
    setCurrentTheme(theme);
    await offlineStorage.savePreference('theme', theme);
  };

  const resetTheme = async () => {
    setThemeOverride(null);
    setCurrentTheme(getTimeBasedTheme());
    await offlineStorage.savePreference('theme', 'auto');
  };

  const themeStyles = themeConfig[currentTheme] || themeConfig.night;

  return {
    currentTheme,
    themeStyles,
    setTheme,
    resetTheme,
    getWeatherBasedTheme,
  };
}
