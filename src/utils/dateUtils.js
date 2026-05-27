import { format, formatDistance, parseISO, isToday, isTomorrow } from 'date-fns';

export const dateUtils = {
  formatTime(timestamp) {
    return format(new Date(timestamp * 1000), 'HH:mm');
  },

  formatDate(date) {
    return format(new Date(date), 'MMM dd, yyyy');
  },

  formatDay(date) {
    if (isToday(new Date(date))) return 'Today';
    if (isTomorrow(new Date(date))) return 'Tomorrow';
    return format(new Date(date), 'EEEE');
  },

  getTimeAgo(timestamp) {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  },

  getDayPeriod(hour) {
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  },

  getSunPosition(sunrise, sunset) {
    const now = Date.now() / 1000;
    if (now < sunrise) return 'before-sunrise';
    if (now < sunrise + 3600) return 'sunrise';
    if (now < sunset - 3600) return 'day';
    if (now < sunset) return 'sunset';
    return 'night';
  },

  formatHourlyTime(timeString) {
    const date = parseISO(timeString);
    const hour = format(date, 'HH:mm');
    const period = this.getDayPeriod(parseInt(format(date, 'H')));
    return { hour, period };
  },

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  },
};
