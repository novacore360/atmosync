import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Layout/Navigation';
import LoadingSpinner from './components/UI/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Goals = lazy(() => import('./pages/Goals'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WeatherProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
              <Suspense fallback={<LoadingSpinner />}>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
              <Navigation />
            </div>
          </Router>
        </WeatherProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
