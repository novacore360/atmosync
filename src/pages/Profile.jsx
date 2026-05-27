import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/UI/GlassCard';
import { offlineStorage } from '../services/offlineStorage';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    notifications: true,
    locationServices: true,
    dataSync: true,
    offlineMode: false,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8 pt-20 pb-24"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-8"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          Profile
        </motion.h1>

        <div className="space-y-6">
          {/* User Info */}
          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl">
                {user?.email?.[0]?.toUpperCase() || '👤'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {user?.email?.split('@')[0] || 'User'}
                </h3>
                <p className="text-white/60">{user?.email}</p>
                <p className="text-white/40 text-sm">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </GlassCard>

          {/* Account Actions */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Account</h3>
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-left">
                Change Password
              </button>
              <button className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-left">
                Email Preferences
              </button>
              <button className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-left">
                Privacy Settings
              </button>
            </div>
          </GlassCard>

          {/* Stats */}
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Goals Set', value: '12' },
                { label: 'Days Active', value: '45' },
                { label: 'Alerts Received', value: '23' },
                { label: 'Syncs', value: '156' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full px-6 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors font-semibold"
          >
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
