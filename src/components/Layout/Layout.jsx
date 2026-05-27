import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import AnimatedBackground from '../UI/AnimatedBackground';
import ErrorBoundary from '../UI/ErrorBoundary';

const Layout = ({ children }) => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
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
      },
    },
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AnimatedBackground />
        <Header />
        
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        
        <Navigation />
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
