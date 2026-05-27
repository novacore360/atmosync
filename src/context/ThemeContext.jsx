import React, { createContext, useContext, useState, useEffect } from 'react';
import { weatherToTheme } from '../utils/themeUtils';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('auto');
  const [currentTheme, setCurrentTheme] = useState('night');

  useEffect(() => {
    // Detect time-based theme
    const updateTheme = () => {
      const hour = new Date().getHours();
      if (theme === 'auto') {
        if (hour >= 5 && hour < 8) setCurrentTheme('sunrise');
        else if (hour >= 8 && hour < 12) setCurrentTheme('morning');
        else if (hour >= 12 && hour < 17) setCurrentTheme('afternoon');
        else if (hour >= 17 && hour < 19) setCurrentTheme('sunset');
        else setCurrentTheme('night');
      } else {
        setCurrentTheme(theme);
      }
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, [theme]);

  // Apply theme classes to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themes = {
      sunrise: 'from-orange-400 via-pink-500 to-purple-600',
      morning: 'from-blue-400 via-cyan-500 to-teal-400',
      afternoon: 'from-sky-500 via-blue-600 to-indigo-600',
      sunset: 'from-orange-500 via-pink-600 to-purple-700',
      night: 'from-slate-900 via-purple-900 to-slate-900',
    };

    document.documentElement.style.setProperty(
      '--gradient-theme',
      themes[currentTheme] || themes.night
    );
  }, [currentTheme]);

  const value = {
    theme,
    currentTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
