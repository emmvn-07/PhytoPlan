import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { createMockUser } from '@/mocks/user';
import type { AppUser } from '@/types/models';

type AuthListener = (user: AppUser | null) => void;

function toAppUser(user: User): AppUser {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: (user.user_metadata?.full_name as string | undefined) ?? '',
  };
}

// --- Demo mode: in-memory session so the UI works without a backend. ---
let demoUser: AppUser | null = null;
const demoListeners = new Set<AuthListener>();

function setDemoUser(user: AppUser | null) {
  demoUser = user;
  demoListeners.forEach((listener) => listener(user));
}

/** Authentication. Uses Supabase when configured, otherwise a local demo session. */
export const authService = {
  async getCurrentUser(): Promise<AppUser | null> {
    if (!supabase) return demoUser;
    const { data } = await supabase.auth.getSession();
    return data.session ? toAppUser(data.session.user) : null;
  },

  /** Subscribe to sign-in / sign-out. Returns an unsubscribe function. */
  onAuthStateChange(listener: AuthListener): () => void {
    if (!supabase) {
      demoListeners.add(listener);
      return () => demoListeners.delete(listener);
    }
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      listener(session ? toAppUser(session.user) : null);
    });
    return () => data.subscription.unsubscribe();
  },

  async signIn(email: string, password: string): Promise<void> {
    if (!supabase) return setDemoUser(createMockUser(email));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  /** Returns `needsConfirmation: true` when Supabase email confirmation is enabled. */
  async signUp(
    email: string,
    password: string,
    fullName: string
  ): Promise<{ needsConfirmation: boolean }> {
    if (!supabase) {
      setDemoUser(createMockUser(email, fullName));
      return { needsConfirmation: false };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  },

  async signOut(): Promise<void> {
    if (!supabase) return setDemoUser(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
