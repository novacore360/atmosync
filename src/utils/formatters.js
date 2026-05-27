export const formatters = {
  // Temperature formatting
  temperature(value, unit = 'celsius') {
    if (value === null || value === undefined) return '--';
    
    const rounded = Math.round(value);
    
    switch(unit) {
      case 'fahrenheit':
        return `${Math.round((rounded * 9/5) + 32)}°F`;
      case 'kelvin':
        return `${Math.round(rounded + 273.15)}K`;
      default:
        return `${rounded}°C`;
    }
  },

  // Wind speed formatting
  windSpeed(speed, unit = 'metric') {
    if (speed === null || speed === undefined) return '--';
    
    switch(unit) {
      case 'imperial':
        return `${(speed * 2.237).toFixed(1)} mph`;
      case 'knots':
        return `${(speed * 1.944).toFixed(1)} knots`;
      default:
        return `${speed.toFixed(1)} m/s`;
    }
  },

  // Distance formatting
  distance(meters, unit = 'metric') {
    if (meters === null || meters === undefined) return '--';
    
    switch(unit) {
      case 'imperial':
        const miles = meters / 1609.34;
        return miles >= 1 ? `${miles.toFixed(1)} mi` : `${Math.round(meters * 3.28084)} ft`;
      default:
        return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
    }
  },

  // Pressure formatting
  pressure(hPa) {
    if (hPa === null || hPa === undefined) return '--';
    return `${Math.round(hPa)} hPa`;
  },

  // Percentage formatting
  percentage(value) {
    if (value === null || value === undefined) return '--';
    return `${Math.round(value)}%`;
  },

  // UV Index with level
  uvIndex(uvi) {
    if (uvi === null || uvi === undefined) return { value: '--', level: 'Unknown' };
    
    const levels = {
      low: uvi <= 2,
      moderate: uvi > 2 && uvi <= 5,
      high: uvi > 5 && uvi <= 7,
      veryHigh: uvi > 7 && uvi <= 10,
      extreme: uvi > 10,
    };
    
    let level = 'Unknown';
    if (levels.low) level = 'Low';
    else if (levels.moderate) level = 'Moderate';
    else if (levels.high) level = 'High';
    else if (levels.veryHigh) level = 'Very High';
    else if (levels.extreme) level = 'Extreme';
    
    return { value: uvi.toFixed(1), level };
  },

  // AQI formatting
  aqi(value) {
    if (value === null || value === undefined) return { value: '--', level: 'Unknown', color: '#gray' };
    
    const levels = {
      good: { max: 50, level: 'Good', color: '#10b981' },
      moderate: { max: 100, level: 'Moderate', color: '#f59e0b' },
      unhealthySensitive: { max: 150, level: 'Unhealthy for Sensitive Groups', color: '#f97316' },
      unhealthy: { max: 200, level: 'Unhealthy', color: '#ef4444' },
      veryUnhealthy: { max: 300, level: 'Very Unhealthy', color: '#7c3aed' },
      hazardous: { max: Infinity, level: 'Hazardous', color: '#6b21a8' },
    };
    
    let result = levels.hazardous;
    for (const [key, data] of Object.entries(levels)) {
      if (value <= data.max) {
        result = data;
        break;
      }
    }
    
    return { value: Math.round(value), ...result };
  },

  // Time formatting
  timeAgo(timestamp) {
    if (!timestamp) return '';
    
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  },

  // File size formatting
  fileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  // Number formatting with commas
  numberWithCommas(x) {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
  },

  // Truncate text
  truncate(text, length = 100) {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  },
};
