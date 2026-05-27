import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database schema types
/*
Tables:
- profiles (id, email, created_at, preferences)
- weather_history (id, user_id, location, data, timestamp)
- goals (id, user_id, type, target, current, created_at)
- sync_queue (id, user_id, action, status, timestamp)
- alerts (id, user_id, type, message, read, created_at)
*/

// Auth helper functions
export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
};

// Database helper functionsexport const db = {
  // Goals
  saveGoal: async (goal) => {
    const { data, error } = await supabase
      .from('goals')
      .upsert(goal)
      .select();
    return { data, error };
  },

  getGoals: async (userId) => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },

  // Weather History
  saveWeatherHistory: async (history) => {
    const { data, error } = await supabase
      .from('weather_history')
      .insert(history)
      .select();
    return { data, error };
  },

  getWeatherHistory: async (userId, limit = 30) => {
    const { data, error } = await supabase
      .from('weather_history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // User Preferences
  savePreferences: async (userId, preferences) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, preferences })
      .select();
    return { data, error };
  },

  getPreferences: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single();
    return { data, error };
  },
};
