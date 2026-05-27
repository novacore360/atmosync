export const weatherToTheme = (weather, currentTheme) => {
  const condition = weather?.weather[0]?.main;
  const isDay = currentTheme !== 'night';

  const themes = {
    Clear: {
      day: {
        gradient: 'from-blue-400 via-cyan-300 to-blue-500',
        overlay: 'bg-gradient-to-b from-yellow-400/20 to-transparent',
      },
      night: {
        gradient: 'from-slate-900 via-blue-900 to-purple-900',
        overlay: 'bg-gradient-to-b from-blue-500/10 to-transparent',
      },
    },
    Clouds: {
      day: {
        gradient: 'from-gray-400 via-blue-300 to-gray-500',
        overlay: 'bg-gradient-to-b from-gray-400/30 to-transparent',
      },
      night: {
        gradient: 'from-slate-800 via-gray-900 to-slate-900',
        overlay: 'bg-gradient-to-b from-gray-600/20 to-transparent',
      },
    },
    Rain: {
      day: {
        gradient: 'from-gray-600 via-blue-500 to-gray-700',
        overlay: 'bg-gradient-to-b from-blue-500/40 to-transparent',
      },
      night: {
        gradient: 'from-slate-900 via-blue-900 to-gray-900',
        overlay: 'bg-gradient-to-b from-blue-700/30 to-transparent',
      },
    },
    Snow: {
      day: {
        gradient: 'from-blue-100 via-white to-blue-200',
        overlay: 'bg-gradient-to-b from-white/60 to-transparent',
      },
      night: {
        gradient: 'from-slate-700 via-blue-900 to-slate-800',
        overlay: 'bg-gradient-to-b from-white/20 to-transparent',
      },
    },
    Thunderstorm: {
      day: {
        gradient: 'from-gray-800 via-purple-700 to-gray-900',
        overlay: 'bg-gradient-to-b from-yellow-500/10 to-transparent',
      },
      night: {
        gradient: 'from-gray-900 via-purple-900 to-black',
        overlay: 'bg-gradient-to-b from-purple-800/20 to-transparent',
      },
    },
  };

  const weatherTheme = themes[condition] || themes.Clear;
  return isDay ? weatherTheme.day : weatherTheme.night;
};

export const getThemeClasses = (theme) => {
  const themeMap = {
    sunrise: {
      bg: 'from-orange-400 via-pink-500 to-purple-600',
      text: 'text-white',
      glass: 'bg-white/10',
      accent: 'text-orange-300',
    },
    morning: {
      bg: 'from-blue-400 via-cyan-500 to-teal-400',
      text: 'text-white',
      glass: 'bg-white/20',
      accent: 'text-yellow-300',
    },
    afternoon: {
      bg: 'from-sky-500 via-blue-600 to-indigo-600',
      text: 'text-white',
      glass: 'bg-white/15',
      accent: 'text-cyan-300',
    },
    sunset: {
      bg: 'from-orange-500 via-pink-600 to-purple-700',
      text: 'text-white',
      glass: 'bg-white/10',
      accent: 'text-pink-300',
    },
    night: {
      bg: 'from-slate-900 via-purple-900 to-slate-900',
      text: 'text-white',
      glass: 'bg-white/5',
      accent: 'text-blue-300',
    },
  };

  return themeMap[theme] || themeMap.night;
};
