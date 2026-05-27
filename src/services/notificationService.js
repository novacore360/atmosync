export const notificationService = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  async sendNotification(title, options = {}) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      const defaultOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'weather-alert',
        renotify: true,
        ...options,
      };

      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, defaultOptions);
    }
  },

  async scheduleWeatherAlert(weatherData) {
    const alerts = [];

    // Rain alert
    if (weatherData.rainProbability > 70) {
      alerts.push({
        title: '🌧️ Rain Alert',
        body: `High chance of rain (${weatherData.rainProbability}%). Don't forget your umbrella!`,
        tag: 'rain-alert',
      });
    }

    // Temperature alert
    if (weatherData.temp > 35) {
      alerts.push({
        title: '🔥 Heat Warning',
        body: `Temperature is ${weatherData.temp}°C. Stay hydrated and avoid direct sunlight.`,
        tag: 'heat-alert',
      });
    } else if (weatherData.temp < 5) {
      alerts.push({
        title: '❄️ Cold Alert',
        body: `Temperature is ${weatherData.temp}°C. Bundle up and stay warm!`,
        tag: 'cold-alert',
      });
    }

    // UV alert
    if (weatherData.uvi > 8) {
      alerts.push({
        title: '☀️ High UV Index',
        body: 'UV index is very high. Apply sunscreen and wear protective clothing.',
        tag: 'uv-alert',
      });
    }

    // Send all alerts
    for (const alert of alerts) {
      await this.sendNotification(alert.title, { body: alert.body, tag: alert.tag });
    }
  },

  // Hydration reminders
  scheduleHydrationReminder() {
    const now = new Date();
    const hours = now.getHours();
    
    // Remind during active hours (8 AM - 8 PM)
    if (hours >= 8 && hours <= 20) {
      setInterval(() => {
        this.sendNotification('💧 Hydration Reminder', {
          body: 'Time to drink water! Stay hydrated for better health.',
          tag: 'hydration-reminder',
          renotify: true,
        });
      }, 2 * 60 * 60 * 1000); // Every 2 hours
    }
  },

  // Sunrise/Sunset alerts
  scheduleSunAlert(sunrise, sunset) {
    const now = Date.now() / 1000;
    
    // Alert 30 minutes before sunrise
    if (sunrise - now < 1800 && sunrise - now > 0) {
      this.sendNotification('🌅 Sunrise Soon', {
        body: 'Beautiful sunrise in about 30 minutes!',
        tag: 'sunrise-alert',
      });
    }

    // Alert 30 minutes before sunset
    if (sunset - now < 1800 && sunset - now > 0) {
      this.sendNotification('🌇 Sunset Soon', {
        body: 'Golden hour approaching! Perfect time for photos.',
        tag: 'sunset-alert',
      });
    }
  },
};
