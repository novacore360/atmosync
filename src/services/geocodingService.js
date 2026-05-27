import axios from 'axios';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const geocodingService = {
  async reverseGeocode(lat, lon) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse`,
        {
          params: {
            lat,
            lon,
            limit: 1,
            appid: OPENWEATHER_API_KEY,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return {
          city: location.name,
          state: location.state,
          country: location.country,
          fullName: `${location.name}, ${location.state || ''} ${location.country}`.trim(),
        };
      }
      
      return { city: 'Unknown', state: '', country: '', fullName: 'Unknown Location' };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return { city: 'Unknown', state: '', country: '', fullName: 'Unknown Location' };
    }
  },

  async searchLocations(query) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct`,
        {
          params: {
            q: query,
            limit: 5,
            appid: OPENWEATHER_API_KEY,
          },
        }
      );

      return response.data.map(location => ({
        name: location.name,
        state: location.state,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
        fullName: `${location.name}, ${location.state || ''} ${location.country}`.trim(),
      }));
    } catch (error) {
      console.error('Location search failed:', error);
      return [];
    }
  },

  async getTimezone(lat, lon) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat,
            lon,
            appid: OPENWEATHER_API_KEY,
          },
        }
      );
      
      return {
        timezone: response.data.timezone, // UTC offset in seconds
        timezoneName: `UTC${response.data.timezone >= 0 ? '+' : ''}${response.data.timezone / 3600}`,
      };
    } catch (error) {
      console.error('Timezone fetch failed:', error);
      return { timezone: 0, timezoneName: 'UTC+0' };
    }
  },
};
