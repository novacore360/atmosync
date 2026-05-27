import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WiDaySunny, WiCloud, WiRain, WiSnow } from 'react-icons/wi';
import AnimatedBackground from '../components/UI/AnimatedBackground';

const Home = () => {
  const features = [
    {
      icon: <WiDaySunny className="text-5xl text-yellow-400" />,
      title: 'Real-Time Weather',
      description: 'Accurate, up-to-the-minute weather data for your exact location',
    },
    {
      icon: <WiCloud className="text-5xl text-blue-400" />,
      title: 'Smart Forecasts',
      description: 'AI-powered predictions and personalized recommendations',
    },
    {
      icon: <WiRain className="text-5xl text-blue-500" />,
      title: 'Weather Alerts',
      description: 'Never get caught in the rain with instant notifications',
    },
    {
      icon: <WiSnow className="text-5xl text-white" />,
      title: 'Wellness Goals',
      description: 'Weather-adjusted health and activity recommendations',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-center max-w-4xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Atmosync
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
              Your intelligent weather companion with adaptive wellness goals, 
              real-time alerts, and immersive visualizations
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/dashboard">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Open Dashboard
                </motion.button>
              </Link>
              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold text-lg border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Trigger PWA install
                  window.dispatchEvent(new Event('beforeinstallprompt'));
                }}
              >
                Install App
              </motion.button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {[
              { label: 'Updates/Day', value: '288' },
              { label: 'Accuracy', value: '99%' },
              { label: 'Locations', value: '200K+' },
              { label: 'Users', value: '10K+' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
