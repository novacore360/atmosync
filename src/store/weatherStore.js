import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWeatherStore = create(
  persist(
    (set, get) => ({
      // Weather data
      currentWeather: null,
      forecast: null,
      airQuality: null,
      
      // User preferences
      preferences: {
        unit: 'metric',
        theme: 'auto',
        notifications: true,
        locationServices: true,
      },
      
      // Goals
      goals: [],
      
      // Offline queue
      syncQueue: [],
      
      // Actions
      setWeatherData: (data) => set({
        currentWeather: data.current,
        forecast: data.forecast,
        airQuality: data.airQuality,
      }),
      
      updatePreferences: (newPreferences) => set((state) => ({
        preferences: { ...state.preferences, ...newPreferences },
      })),
      
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Date.now(), createdAt: new Date().toISOString() }],
      })),
      
      updateGoal: (goalId, updates) => set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === goalId ? { ...goal, ...updates } : goal
        ),
      })),
      
      removeGoal: (goalId) => set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== goalId),
      })),
      
      addToSyncQueue: (action) => set((state) => ({
        syncQueue: [...state.syncQueue, { ...action, timestamp: Date.now() }],
      })),
      
      clearSyncQueue: () => set({ syncQueue: [] }),
      
      getWeatherSummary: () => {
        const { currentWeather, forecast } = get();
        if (!currentWeather) return null;
        
        return {
          temperature: currentWeather.temp,
          condition: currentWeather.weather[0]?.main,
          highTemp: Math.max(...(forecast?.daily?.map(d => d.maxTemp) || [])),
          lowTemp: Math.min(...(forecast?.daily?.map(d => d.minTemp) || [])),
          rainChance: forecast?.daily?.[0]?.rainProbability || 0,
        };
      },
    }),
    {
      name: 'weather-store',
      getStorage: () => localStorage,
    }
  )
);

export default useWeatherStore;
