import 'expo-sqlite/localStorage/install';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { config, isDemoMode } from '@/constants/config';
import type { Database } from '@/types/database';

/**
 * Supabase client, or `null` in demo mode (no keys).
 * Only import this from `src/services/*` — screens and components go through services/hooks.
 */
export const supabase: SupabaseClient<Database> | null = isDemoMode
  ? null
  : createClient<Database>(config.supabaseUrl, config.supabaseKey, {
      auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

if (isDemoMode) {
  console.warn(`[${config.appName}] Supabase env vars not set — running in demo mode.`);
}

// Only refresh tokens while the app is in the foreground.
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
