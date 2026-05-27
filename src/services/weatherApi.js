import axios from 'axios';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHERAPI_KEY = import.meta.env.VITE_WEATHERAPI_KEY;
const AIRVISUAL_API_KEY = import.meta.env.VITE_AIRVISUAL_API_KEY;

const openWeatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/3.0',
  params: {
    appid: OPENWEATHER_API_KEY,
    units: 'metric',
  },
});

const weatherApiClient = axios.create({
  baseURL: 'https://api.weatherapi.com/v1',
  params: {
    key: WEATHERAPI_KEY,
  },
});

export const weatherApi = {
  async getCurrentWeather(lat, lon) {
    try {
      const response = await openWeatherClient.get('/onecall', {
        params: { lat, lon, exclude: 'minutely,alerts' },
      });
      
      const data = response.data.current;
      return {
        temp: Math.round(data.temp),
        feelsLike: Math.round(data.feels_like),
        humidity: data.humidity,
        pressure: data.pressure,
        visibility: data.visibility,
        windSpeed: data.wind_speed,
        windDeg: data.wind_deg,
        uvi: data.uvi,
        sunrise: data.sunrise,
        sunset: data.sunset,
        weather: data.weather,
        clouds: data.clouds,
        dewPoint: data.dew_point,
      };
    } catch (error) {
      // Fallback to WeatherAPI
      const response = await weatherApiClient.get('/current.json', {
        params: { q: `${lat},${lon}` },
      });
      
      const data = response.data.current;
      return {
        temp: data.temp_c,
        feelsLike: data.feelslike_c,
        humidity: data.humidity,
        pressure: data.pressure_mb,
        visibility: data.vis_km * 1000,
        windSpeed: data.wind_kph / 3.6,
        windDeg: data.wind_degree,
        uvi: data.uv,
        weather: [{ main: data.condition.text, icon: data.condition.icon }],
        clouds: data.cloud,
      };
    }
  },

  async getForecast(lat, lon) {
    try {
      const response = await weatherApiClient.get('/forecast.json', {
        params: { q: `${lat},${lon}`, days: 7 },
      });
      
      const forecastDays = response.data.forecast.forecastday;
      
      return {
        hourly: forecastDays[0].hour.map(hour => ({
          time: hour.time,
          temp: hour.temp_c,
          feelsLike: hour.feelslike_c,
          humidity: hour.humidity,
          windSpeed: hour.wind_kph / 3.6,
          rainProbability: hour.chance_of_rain,
          weather: hour.condition,
        })),
        daily: forecastDays.map(day => ({
          date: day.date,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          avgTemp: day.day.avgtemp_c,
          humidity: day.day.avghumidity,
          windSpeed: day.day.maxwind_kph / 3.6,
          rainProbability: day.day.daily_chance_of_rain,
          uvIndex: day.day.uv,
          condition: day.day.condition,
          sunrise: day.astro.sunrise,
          sunset: day.astro.sunset,
        })),
      };
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  async getAirQuality(lat, lon) {
    try {
      const response = await axios.get(
        `https://api.airvisual.com/v2/nearest_city`,
        {
          params: {
            lat,
            lon,
            key: AIRVISUAL_API_KEY,
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
      // Return mock data if API fails
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

  async getWeatherAlerts(lat, lon) {
    try {
      const response = await openWeatherClient.get('/onecall', {
        params: {
          lat,
          lon,
          exclude: 'current,minutely,hourly,daily',
        },
      });
      
      return response.data.alerts || [];
    } catch (error) {
      return [];
    }
  },
};
