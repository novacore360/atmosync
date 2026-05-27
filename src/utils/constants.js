// API Configuration
export const API_CONFIG = {
  OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/3.0',
  WEATHERAPI_BASE_URL: 'https://api.weatherapi.com/v1',
  AIRVISUAL_BASE_URL: 'https://api.airvisual.com/v2',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  
  ENDPOINTS: {
    CURRENT_WEATHER: '/onecall',
    FORECAST: '/forecast.json',
    AIR_QUALITY: '/nearest_city',
    GEOCODING: '/geo/1.0',
    REVERSE_GEOCODING: '/geo/1.0/reverse',
  },
  
  REFRESH_INTERVALS: {
    WEATHER: 5 * 60 * 1000, // 5 minutes
    FORECAST: 30 * 60 * 1000, // 30 minutes
    AIR_QUALITY: 60 * 60 * 1000, // 1 hour
    ALERTS: 15 * 60 * 1000, // 15 minutes
  },
  
  CACHE_TTL: {
    WEATHER: 30 * 60 * 1000, // 30 minutes
    FORECAST: 2 * 60 * 60 * 1000, // 2 hours
    AIR_QUALITY: 60 * 60 * 1000, // 1 hour
    STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

// Weather Thresholds
export const WEATHER_THRESHOLDS = {
  TEMPERATURE: {
    FREEZING: 0,
    COLD: 10,
    COOL: 15,
    MILD: 20,
    WARM: 25,
    HOT: 30,
    VERY_HOT: 35,
    EXTREME: 40,
  },
  HUMIDITY: {
    DRY: 30,
    COMFORTABLE: 50,
    HUMID: 70,
    VERY_HUMID: 85,
  },
  WIND: {
    CALM: 1,
    LIGHT: 5,
    MODERATE: 11,
    STRONG: 19,
    GALE: 28,
    STORM: 38,
    HURRICANE: 50,
  },
  UV_INDEX: {
    LOW: 2,
    MODERATE: 5,
    HIGH: 7,
    VERY_HIGH: 10,
    EXTREME: 11,
  },
  AQI: {
    GOOD: 50,
    MODERATE: 100,
    UNHEALTHY_SENSITIVE: 150,
    UNHEALTHY: 200,
    VERY_UNHEALTHY: 300,
    HAZARDOUS: 500,
  },
  VISIBILITY: {
    POOR: 1000,
    MODERATE: 4000,
    GOOD: 10000,
    EXCELLENT: 20000,
  },
};

// Theme Configuration
export const THEME_CONFIG = {
  SUNRISE: { start: 5, end: 8, gradient: 'from-orange-400 via-pink-500 to-purple-600' },
  MORNING: { start: 8, end: 12, gradient: 'from-blue-400 via-cyan-500 to-teal-400' },
  AFTERNOON: { start: 12, end: 17, gradient: 'from-sky-500 via-blue-600 to-indigo-600' },
  SUNSET: { start: 17, end: 19, gradient: 'from-orange-500 via-pink-600 to-purple-700' },
  NIGHT: { start: 19, end: 5, gradient: 'from-slate-900 via-purple-900 to-slate-900' },
};

// Wellness Goals Defaults
export const DEFAULT_GOALS = {
  HYDRATION: {
    target: 8,
    unit: 'glasses',
    type: 'hydration',
    icon: '💧',
    weatherAdjustment: {
      hot: { multiplier: 1.5, threshold: 30 },
      mild: { multiplier: 1.2, threshold: 25 },
    },
  },
  STEPS: {
    target: 10000,
    unit: 'steps',
    type: 'steps',
    icon: '👟',
  },
  OUTDOOR_HOURS: {
    target: 2,
    unit: 'hours',
    type: 'outdoor',
    icon: '🌳',
  },
  SLEEP: {
    target: 8,
    unit: 'hours',
    type: 'sleep',
    icon: '😴',
  },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  WEATHER_ALERT: 'weather_alert',
  RAIN_WARNING: 'rain_warning',
  TEMPERATURE_ALERT: 'temperature_alert',
  UV_WARNING: 'uv_warning',
  HYDRATION_REMINDER: 'hydration_reminder',
  SUNRISE_ALERT: 'sunrise_alert',
  SUNSET_ALERT: 'sunset_alert',
  GOAL_REMINDER: 'goal_reminder',
  EMERGENCY: 'emergency',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  GOALS: '/goals',
  STATISTICS: '/statistics',
  ALERTS: '/alerts',
  SETTINGS: '/settings',
  AUTH: '/auth',
  PROFILE: '/profile',
  EMERGENCY: '/emergency',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  LAST_LOCATION: 'last-location',
  WEATHER_CACHE: 'weather-cache',
  USER_PREFERENCES: 'user-preferences',
  EMERGENCY_CONTACTS: 'emergency-contacts',
  THEME: 'theme-preference',
  UNIT_SYSTEM: 'unit-system',
  GOALS: 'saved-goals',
  AUTH_TOKEN: 'auth-token',
};

// Chart Colors
export const CHART_COLORS = {
  TEMPERATURE: '#ef4444',
  HUMIDITY: '#3b82f6',
  PRESSURE: '#8b5cf6',
  WIND: '#10b981',
  UV: '#f59e0b',
  RAIN: '#06b6d4',
  PRIMARY: '#3b82f6',
  SECONDARY: '#8b5cf6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
};

// Error Messages
export const ERROR_MESSAGES = {
  LOCATION_DENIED: 'Location access was denied. Please enable location services to get accurate weather data.',
  LOCATION_UNAVAILABLE: 'Unable to determine your location. Please check your device settings.',
  NETWORK_ERROR: 'Unable to connect to weather services. Please check your internet connection.',
  API_ERROR: 'Weather data is temporarily unavailable. Please try again later.',
  CACHE_ERROR: 'No cached weather data available. Please connect to the internet to fetch fresh data.',
  AUTH_ERROR: 'Authentication failed. Please check your credentials and try again.',
  SYNC_ERROR: 'Failed to sync data. Changes will be saved locally and synced when connection is restored.',
};
