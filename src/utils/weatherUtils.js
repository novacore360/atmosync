export const weatherUtils = {
  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  },

  getUVLevel(uvi) {
    if (uvi <= 2) return { level: 'Low', color: '#10b981' };
    if (uvi <= 5) return { level: 'Moderate', color: '#f59e0b' };
    if (uvi <= 7) return { level: 'High', color: '#f97316' };
    if (uvi <= 10) return { level: 'Very High', color: '#ef4444' };
    return { level: 'Extreme', color: '#7c3aed' };
  },

  getAQILevel(aqi) {
    if (aqi <= 50) return { level: 'Good', color: '#10b981', message: 'Air quality is satisfactory' };
    if (aqi <= 100) return { level: 'Moderate', color: '#f59e0b', message: 'Acceptable for most' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#f97316', message: 'Sensitive groups may experience effects' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#ef4444', message: 'Everyone may experience effects' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#7c3aed', message: 'Health alert' };
    return { level: 'Hazardous', color: '#6b21a8', message: 'Emergency conditions' };
  },

  getComfortLevel(temp, humidity) {
    // Heat index calculation (simplified)
    const heatIndex = temp + (humidity / 100) * 5;
    
    if (heatIndex < 0) return { level: 'Freezing', icon: '🥶' };
    if (heatIndex < 10) return { level: 'Cold', icon: '😨' };
    if (heatIndex < 20) return { level: 'Cool', icon: '😊' };
    if (heatIndex < 25) return { level: 'Comfortable', icon: '😌' };
    if (heatIndex < 30) return { level: 'Warm', icon: '😅' };
    if (heatIndex < 35) return { level: 'Hot', icon: '🥵' };
    return { level: 'Very Hot', icon: '🔥' };
  },

  getWeatherEmoji(condition) {
    const emojiMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️',
    };
    return emojiMap[condition] || '🌤️';
  },

  getClothingSuggestion(temp, condition) {
    const suggestions = [];
    
    if (temp <= 5) {
      suggestions.push('Heavy coat', 'Gloves', 'Scarf', 'Boots');
    } else if (temp <= 15) {
      suggestions.push('Jacket', 'Sweater', 'Long pants');
    } else if (temp <= 25) {
      suggestions.push('Light jacket', 'Long sleeve shirt');
    } else {
      suggestions.push('T-shirt', 'Shorts', 'Sunglasses');
    }

    if (condition === 'Rain' || condition === 'Drizzle') {
      suggestions.push('Umbrella', 'Raincoat', 'Waterproof shoes');
    }

    return suggestions;
  },

  isGoodForOutdoor(temp, windSpeed, condition) {
    if (condition === 'Thunderstorm' || condition === 'Rain') return false;
    if (temp < 0 || temp > 38) return false;
    if (windSpeed > 30) return false;
    return true;
  },
};
