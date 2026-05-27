// Notification Worker for background push notifications and reminders

const NOTIFICATION_TYPES = {
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

class NotificationWorker {
  constructor() {
    this.activeTimers = new Map();
    this.notificationHistory = [];
    this.maxHistory = 100;
  }

  async init() {
    // Request notification permission if not granted
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    // Listen for messages from main thread
    self.addEventListener('message', (event) => {
      this.handleMessage(event.data);
    });

    // Handle notification clicks
    self.addEventListener('notificationclick', (event) => {
      this.handleNotificationClick(event);
    });

    // Handle push events (if using push API)
    self.addEventListener('push', (event) => {
      this.handlePushEvent(event);
    });

    console.log('Notification Worker initialized');
  }

  handleMessage(message) {
    switch (message.type) {
      case 'SCHEDULE_WEATHER_ALERT':
        this.scheduleWeatherAlert(message.payload);
        break;
      case 'SCHEDULE_HYDRATION_REMINDER':
        this.scheduleHydrationReminder(message.payload);
        break;
      case 'SCHEDULE_SUN_ALERT':
        this.scheduleSunAlert(message.payload);
        break;
      case 'SCHEDULE_GOAL_REMINDER':
        this.scheduleGoalReminder(message.payload);
        break;
      case 'CANCEL_ALL_REMINDERS':
        this.cancelAllReminders();
        break;
      case 'CANCEL_REMINDER':
        this.cancelReminder(message.payload);
        break;
      case 'GET_ACTIVE_REMINDERS':
        this.sendActiveReminders();
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  async sendNotification(title, options = {}) {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      timestamp: Date.now(),
      ...options,
    };

    try {
      const notification = await self.registration.showNotification(title, defaultOptions);
      
      // Add to history
      this.notificationHistory.push({
        title,
        options: defaultOptions,
        timestamp: Date.now(),
      });

      // Trim history
      if (this.notificationHistory.length > this.maxHistory) {
        this.notificationHistory = this.notificationHistory.slice(-this.maxHistory);
      }

      return notification;
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  scheduleWeatherAlert(weatherData) {
    const { temp, condition, uvi, rainProbability } = weatherData;

    // Temperature alerts
    if (temp > 35) {
      this.sendNotification('🔥 Heat Warning', {
        body: `Temperature is ${Math.round(temp)}°C. Stay hydrated and avoid direct sunlight.`,
        tag: 'heat-alert',
        data: { type: NOTIFICATION_TYPES.TEMPERATURE_ALERT, severity: 'high' },
      });
    } else if (temp < 5) {
      this.sendNotification('❄️ Cold Alert', {
        body: `Temperature is ${Math.round(temp)}°C. Bundle up and stay warm!`,
        tag: 'cold-alert',
        data: { type: NOTIFICATION_TYPES.TEMPERATURE_ALERT, severity: 'medium' },
      });
    }

    // Rain alert
    if (rainProbability > 70) {
      this.sendNotification('🌧️ Rain Alert', {
        body: `High chance of rain (${rainProbability}%). Don't forget your umbrella!`,
        tag: 'rain-alert',
        data: { type: NOTIFICATION_TYPES.RAIN_WARNING, severity: 'medium' },
      });
    }

    // UV alert
    if (uvi > 7) {
      this.sendNotification('☀️ High UV Index', {
        body: 'UV index is very high. Apply sunscreen and wear protective clothing.',
        tag: 'uv-alert',
        data: { type: NOTIFICATION_TYPES.UV_WARNING, severity: 'high' },
      });
    }

    // Severe weather alert
    if (condition === 'Thunderstorm' || condition === 'Tornado') {
      this.sendNotification('⚠️ Severe Weather Alert', {
        body: `${condition} detected in your area. Take necessary precautions immediately!`,
        tag: 'severe-weather',
        data: { type: NOTIFICATION_TYPES.EMERGENCY, severity: 'critical' },
        requireInteraction: true,
      });
    }
  }

  scheduleHydrationReminder(config = {}) {
    const interval = config.interval || 2 * 60 * 60 * 1000; // Default 2 hours
    
    // Cancel existing hydration reminders
    this.cancelReminder('hydration');

    const timerId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      
      // Only remind during waking hours (8 AM - 10 PM)
      if (hours >= 8 && hours <= 22) {
        this.sendNotification('💧 Hydration Reminder', {
          body: 'Time to drink water! Stay hydrated for better health and focus.',
          tag: 'hydration-reminder',
          data: { type: NOTIFICATION_TYPES.HYDRATION_REMINDER },
          actions: [
            { action: 'done', title: 'Done' },
            { action: 'snooze', title: 'Snooze 30min' },
          ],
        });
      }
    }, interval);

    this.activeTimers.set('hydration', timerId);
  }

  scheduleSunAlert({ sunrise, sunset }) {
    const now = Date.now() / 1000;

    // Sunrise alert (30 minutes before)
    if (sunrise && sunrise > now) {
      const timeUntilSunrise = (sunrise - now - 1800) * 1000;
      if (timeUntilSunrise > 0) {
        const timerId = setTimeout(() => {
          this.sendNotification('🌅 Sunrise Soon', {
            body: 'Beautiful sunrise in about 30 minutes!',
            tag: 'sunrise-alert',
            data: { type: NOTIFICATION_TYPES.SUNRISE_ALERT },
          });
        }, timeUntilSunrise);

        this.activeTimers.set('sunrise', timerId);
      }
    }

    // Sunset alert (30 minutes before)
    if (sunset && sunset > now) {
      const timeUntilSunset = (sunset - now - 1800) * 1000;
      if (timeUntilSunset > 0) {
        const timerId = setTimeout(() => {
          this.sendNotification('🌇 Sunset Soon', {
            body: 'Golden hour approaching! Perfect time for outdoor activities.',
            tag: 'sunset-alert',
            data: { type: NOTIFICATION_TYPES.SUNSET_ALERT },
          });
        }, timeUntilSunset);

        this.activeTimers.set('sunset', timerId);
      }
    }
  }

  scheduleGoalReminder(goal) {
    const timerId = setTimeout(() => {
      this.sendNotification('🎯 Goal Reminder', {
        body: `Don't forget: ${goal.title}! You're ${Math.round((goal.current / goal.target) * 100)}% done.`,
        tag: 'goal-reminder',
        data: { type: NOTIFICATION_TYPES.GOAL_REMINDER, goalId: goal.id },
        actions: [
          { action: 'update', title: 'Update Progress' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
      });
    }, goal.reminderTime || 3600000); // Default 1 hour

    this.activeTimers.set(`goal-${goal.id}`, timerId);
  }

  cancelReminder(id) {
    const timerId = this.activeTimers.get(id);
    if (timerId) {
      clearInterval(timerId);
      clearTimeout(timerId);
      this.activeTimers.delete(id);
    }
  }

  cancelAllReminders() {
    for (const [id, timerId] of this.activeTimers) {
      clearInterval(timerId);
      clearTimeout(timerId);
    }
    this.activeTimers.clear();
  }

  sendActiveReminders() {
    self.postMessage({
      type: 'ACTIVE_REMINDERS',
      payload: Array.from(this.activeTimers.keys()),
    });
  }

  handleNotificationClick(event) {
    event.notification.close();

    const { type, goalId } = event.notification.data || {};

    // Handle different notification actions
    switch (event.action) {
      case 'done':
        // Handle hydration done
        self.postMessage({
          type: 'HYDRATION_DONE',
          payload: { timestamp: Date.now() },
        });
        break;
      case 'snooze':
        // Reschedule hydration reminder for 30 minutes
        this.cancelReminder('hydration');
        this.scheduleHydrationReminder({ interval: 30 * 60 * 1000 });
        break;
      case 'update':
        // Open app and navigate to goals
        self.clients.openWindow(`/goals`);
        break;
      default:
        // Default action - open dashboard
        self.clients.openWindow('/dashboard');
    }
  }

  handlePushEvent(event) {
    let data = {};
    
    try {
      data = event.data?.json() || {};
    } catch {
      data = { title: 'Weather Update', body: event.data?.text() || 'New weather information available' };
    }

    event.waitUntil(
      this.sendNotification(data.title, {
        body: data.body,
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/badge-72x72.png',
        data: data.data || {},
        actions: data.actions || [],
      })
    );
  }

  getNotificationHistory() {
    return this.notificationHistory;
  }

  clearHistory() {
    this.notificationHistory = [];
  }
}

// Initialize the worker
const notificationWorker = new NotificationWorker();
notificationWorker.init();
