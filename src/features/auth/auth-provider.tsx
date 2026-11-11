import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import { getErrorMessage } from '@/lib/utils';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';
import type { AppUser } from '@/types/models';

type Result = { error?: string };

type AuthContextValue = {
  user: AppUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<Result>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<Result & { needsConfirmation?: boolean }>;
  signOut: () => Promise<Result>;
  updateProfile: (fullName: string) => Promise<Result>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Session state for the app. All auth/profile calls go through services; screens use `useAuth()`. */
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Merge the saved profile name (if any) into the auth user.
    async function resolveUser(authUser: AppUser | null) {
      const profile = authUser
        ? await profileService.getProfile(authUser.id).catch(() => null)
        : null;
      if (!active) return;
      setUser(authUser && { ...authUser, fullName: profile?.fullName || authUser.fullName });
    }

    authService
      .getCurrentUser()
      .then(resolveUser)
      .finally(() => active && setIsLoading(false));

    // Deferred so Supabase isn't called from inside its own auth callback.
    const unsubscribe = authService.onAuthStateChange((authUser) => {
      setTimeout(() => resolveUser(authUser), 0);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,

    signIn: (email, password) => run(() => authService.signIn(email, password)),

    async signUp(email, password, fullName) {
      try {
        return await authService.signUp(email, password, fullName);
      } catch (error) {
        return { error: getErrorMessage(error) };
      }
    },

    signOut: () => run(() => authService.signOut()),

    updateProfile: (fullName) =>
      run(async () => {
        if (!user) throw new Error('Not signed in');
        await profileService.updateProfile(user.id, { fullName });
        setUser({ ...user, fullName });
      }),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

async function run(action: () => Promise<void>): Promise<Result> {
  try {
    await action();
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
