import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { WiSunrise, WiSunset, WiMoonFull, WiMoonWaxingCrescent, WiMoonFirstQuarter } from 'react-icons/wi';
import { format } from 'date-fns';

const SunMoonCard = ({ sunrise, sunset, moonPhase }) => {
  const getMoonIcon = (phase) => {
    if (phase > 0.75) return <WiMoonFull className="text-5xl text-yellow-200" />;
    if (phase > 0.5) return <WiMoonWaxingCrescent className="text-5xl text-yellow-200" />;
    if (phase > 0.25) return <WiMoonFirstQuarter className="text-5xl text-yellow-200" />;
    return <WiMoonWaxingCrescent className="text-5xl text-yellow-200" />;
  };

  const getDayLength = () => {
    if (!sunrise || !sunset) return 'N/A';
    const diff = sunset - sunrise;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-2xl font-bold text-white mb-6">Sun & Moon</h3>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Sun Section */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-2">☀️</div>
              <p className="text-white/60">Daylight: {getDayLength()}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <div className="flex items-center">
                  <WiSunrise className="text-3xl text-yellow-400 mr-2" />
                  <span className="text-white">Sunrise</span>
                </div>
                <span className="text-white font-semibold">
                  {sunrise ? format(new Date(sunrise * 1000), 'HH:mm') : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <div className="flex items-center">
                  <WiSunset className="text-3xl text-orange-400 mr-2" />
                  <span className="text-white">Sunset</span>
                </div>
                <span className="text-white font-semibold">
                  {sunset ? format(new Date(sunset * 1000), 'HH:mm') : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Moon Section */}
          <div className="space-y-4">
            <div className="text-center">
              {getMoonIcon(moonPhase || 0.5)}
              <p className="text-white/60 mt-2">
                {moonPhase > 0.9 ? 'Full Moon' :
                 moonPhase > 0.75 ? 'Waxing Gibbous' :
                 moonPhase > 0.5 ? 'First Quarter' :
                 moonPhase > 0.25 ? 'Waxing Crescent' : 'New Moon'}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <span className="text-white">Illumination</span>
                <span className="text-white font-semibold">
                  {moonPhase ? `${Math.round(moonPhase * 100)}%` : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <span className="text-white">Phase</span>
                <span className="text-white font-semibold">
                  {moonPhase ? `${Math.round(moonPhase * 28)}/28` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default SunMoonCard;
