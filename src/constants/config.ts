/**
 * Centralized app configuration. Read env vars here only — never via process.env elsewhere.
 * Only EXPO_PUBLIC_* vars are bundled into the app (and are visible to users).
 */
export const config = {
  appName: 'PhytoPlan',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '',
  /** Artificial latency for mock services so loading states are visible during UI work. */
  mockDelayMs: 400,
} as const;

/**
 * Demo mode = no Supabase keys. Auth runs locally (any email/password works) and nothing is persisted.
 * Add the keys to .env.local to switch to real Supabase — no code changes needed.
 */
export const isDemoMode = !config.supabaseUrl || !config.supabaseKey;
