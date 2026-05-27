import axios from 'axios';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHERAPI_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

export const weatherApi = {
  async getCurrentWeather(lat, lon) {
    console.log('Fetching weather for:', lat, lon);
    console.log('API Key exists:', !!OPENWEATHER_API_KEY);
    
    try {
      // Try OpenWeather first
      const response = await axios.get(
        'https://api.openweathermap.org/data/3.0/onecall',
        {
          params: {
            lat,
            lon,
            appid: OPENWEATHER_API_KEY,
            units: 'metric',
            exclude: 'minutely,alerts',
          },
        }
      );

      const data = response.data.current;
      console.log('Weather data received:', data);
      
      return {
        temp: Math.round(data.temp),
        feelsLike: Math.round(data.feels_like),
        humidity: data.humidity,
        pressure: data.pressure,
        visibility: data.visibility || 10000,
        windSpeed: data.wind_speed,
        windDeg: data.wind_deg,
        uvi: data.uvi,
        sunrise: data.sunrise,
        sunset: data.sunset,
        weather: data.weather,
        clouds: data.clouds,
        dewPoint: data.dew_point || 0,
      };
    } catch (error) {
      console.error('OpenWeather failed, trying WeatherAPI...', error.message);
      
      // Fallback to WeatherAPI
      try {
        const response = await axios.get(
          'https://api.weatherapi.com/v1/current.json',
          {
            params: {
              key: WEATHERAPI_KEY,
              q: `${lat},${lon}`,
            },
          }
        );

        const data = response.data.current;
        return {
          temp: Math.round(data.temp_c),
          feelsLike: Math.round(data.feelslike_c),
          humidity: data.humidity,
          pressure: data.pressure_mb,
          visibility: data.vis_km * 1000,
          windSpeed: data.wind_kph / 3.6,
          windDeg: data.wind_degree,
          uvi: data.uv,
          weather: [{ main: data.condition.text, description: data.condition.text }],
          clouds: data.cloud,
          dewPoint: 0,
          sunrise: 0,
          sunset: 0,
        };
      } catch (fallbackError) {
        console.error('Both APIs failed:', fallbackError.message);
        throw new Error('Unable to fetch weather data. Please check your API keys.');
      }
    }
  },

  async getForecast(lat, lon) {
    try {
      const response = await axios.get(
        'https://api.weatherapi.com/v1/forecast.json',
        {
          params: {
            key: WEATHERAPI_KEY,
            q: `${lat},${lon}`,
            days: 7,
          },
        }
      );

      const forecastDays = response.data.forecast.forecastday;

      return {
        hourly: forecastDays[0].hour.map((hour) => ({
          time: hour.time,
          temp: hour.temp_c,
          feelsLike: hour.feelslike_c,
          humidity: hour.humidity,
          windSpeed: hour.wind_kph / 3.6,
          rainProbability: hour.chance_of_rain,
          weather: { text: hour.condition.text },
        })),
        daily: forecastDays.map((day) => ({
          date: day.date,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          avgTemp: day.day.avgtemp_c,
          humidity: day.day.avghumidity,
          windSpeed: day.day.maxwind_kph / 3.6,
          rainProbability: day.day.daily_chance_of_rain,
          uvIndex: day.day.uv,
          condition: { text: day.day.condition.text },
          sunrise: day.astro.sunrise,
          sunset: day.astro.sunset,
        })),
      };
    } catch (error) {
      console.error('Forecast fetch failed:', error.message);
      // Return empty data instead of throwing
      return {
        hourly: [],
        daily: [],
      };
    }
  },

  async getAirQuality(lat, lon) {
    try {
      const response = await axios.get(
        'https://api.airvisual.com/v2/nearest_city',
        {
          params: {
            lat,
            lon,
            key: import.meta.env.VITE_AIRVISUAL_API_KEY,
          },
        }
      );

      const data = response.data.data.current.pollution;
      return {
        aqi: data.aqius,
        mainPollutant: data.mainus,
        pollutants: {
          pm25: data.pm25,
          pm10: data.pm10,
          o3: data.o3,
          no2: data.no2,
          so2: data.so2,
          co: data.co,
        },
      };
    } catch (error) {
      console.error('Air quality fetch failed:', error.message);
      // Return mock data
      return {
        aqi: 50,
        mainPollutant: 'p2',
        pollutants: {
          pm25: 12,
          pm10: 25,
          o3: 48,
          no2: 15,
          so2: 3,
          co: 300,
        },
      };
    }
  },
};
