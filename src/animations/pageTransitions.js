import { motion } from 'framer-motion';
import React from 'react';

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Slide transitions
export const slideVariants = {
  slideLeft: {
    initial: { x: 300, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: { 
      x: -300, 
      opacity: 0,
      transition: { duration: 0.3 },
    },
  },
  slideRight: {
    initial: { x: -300, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: { 
      x: 300, 
      opacity: 0,
      transition: { duration: 0.3 },
    },
  },
  slideUp: {
    initial: { y: 300, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: { 
      y: -300, 
      opacity: 0,
      transition: { duration: 0.3 },
    },
  },
};

// Stagger children animations
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

// Weather-specific transitions
export const weatherTransitions = {
  // Smooth weather update
  weatherUpdate: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  },

  // Temperature change animation
  temperatureChange: {
    animate: (newTemp) => ({
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    }),
  },

  // Forecast card hover
  forecastCard: {
    rest: { 
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    hover: { 
      scale: 1.05,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  },

  // Alert notification
  alertSlide: {
    initial: { x: 400, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: { 
      x: 400, 
      opacity: 0,
      transition: { duration: 0.3 },
    },
  },
};

// Route-based transitions
export const routeTransitions = {
  '/': pageVariants,
  '/dashboard': slideVariants.slideRight,
  '/goals': slideVariants.slideLeft,
  '/statistics': slideVariants.slideUp,
  '/alerts': {
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
    exit: { scale: 0.8, opacity: 0 },
  },
  '/settings': {
    initial: { y: 50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: { y: -50, opacity: 0 },
  },
};

// Animated page wrapper component
export const PageTransition = ({ children, variant = 'default' }) => {
  const variants = {
    default: pageVariants,
    ...routeTransitions,
  };

  return (
    <motion.div
      variants={variants[variant] || pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

// Section transition
export const SectionTransition = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ 
      opacity: 1, 
      y: 0,
      transition: {
        delay,
        duration: 0.5,
        ease: 'easeOut',
      },
    }}
  >
    {children}
  </motion.div>
);

// List animation
export const ListAnimation = ({ children, staggerDelay = 0.1 }) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
  >
    {React.Children.map(children, (child, index) => (
      <motion.div
        key={index}
        variants={staggerItem}
        custom={index}
      >
        {child}
      </motion.div>
    ))}
  </motion.div>
);
