export const weatherAnimations = {
  // Rain animation
  rain: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    drop: (index) => ({
      initial: { 
        y: -20, 
        x: Math.random() * 10 - 5,
        opacity: 0.6,
      },
      animate: {
        y: '100vh',
        opacity: [0.6, 0.3, 0.1],
        transition: {
          duration: 0.8 + Math.random() * 0.4,
          delay: Math.random() * 2,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    }),
  },

  // Snow animation
  snow: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 0.8 },
      exit: { opacity: 0 },
    },
    flake: (index) => ({
      initial: { 
        y: -10, 
        x: Math.random() * 100,
        rotate: 0,
        scale: 0.5 + Math.random() * 0.5,
      },
      animate: {
        y: '100vh',
        x: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ],
        rotate: 360,
        opacity: [0.8, 1, 0.6],
        transition: {
          duration: 4 + Math.random() * 4,
          delay: Math.random() * 3,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    }),
  },

  // Lightning effect
  lightning: {
    flash: {
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 0.3, 0, 0.1, 0],
        transition: {
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 3 + Math.random() * 5,
        },
      },
    },
  },

  // Cloud movement
  clouds: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 0.4 },
    },
    cloud: (index) => ({
      initial: { x: '-100%' },
      animate: {
        x: '100%',
        transition: {
          duration: 20 + Math.random() * 10,
          delay: Math.random() * 5,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    }),
  },

  // Sun glow
  sunGlow: {
    initial: { scale: 0.9, opacity: 0.8 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Star twinkle
  stars: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    star: (index) => ({
      initial: { opacity: 0.3, scale: 1 },
      animate: {
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.2, 1],
        transition: {
          duration: 1.5 + Math.random() * 2,
          delay: Math.random() * 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    }),
  },

  // Fog overlay
  fog: {
    initial: { opacity: 0 },
    animate: {
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Temperature change
  temperatureChange: (oldTemp, newTemp) => ({
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      color: newTemp > oldTemp ? '#ef4444' : '#3b82f6',
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 300,
      },
    },
  }),

  // Card hover
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    tap: { scale: 0.98 },
  },

  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  },

  // List item stagger
  listStagger: {
    container: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      initial: { opacity: 0, x: -20 },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
        },
      },
    },
  },

  // Loading spinner
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },

  // Pulse effect for alerts
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Slide in from right
  slideInRight: {
    initial: { x: 50, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: { x: 50, opacity: 0 },
  },

  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0 },
  },

  // Scale in
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  },

  // Weather icon animations
  weatherIcon: {
    sunny: {
      animate: {
        rotate: [0, 10, 0],
        scale: [1, 1.1, 1],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
    rainy: {
      animate: {
        y: [0, -3, 0],
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
    windy: {
      animate: {
        x: [0, 5, -2, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
  },
};
