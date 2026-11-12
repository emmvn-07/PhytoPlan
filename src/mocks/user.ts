import type { AppUser } from '@/types/models';

export function createMockUser(email?: string, fullName?: string): AppUser {
  return {
    id: 'demo-user',
    email: email || 'demo@phytoplan.app',
    fullName: fullName || 'Demo User',
  };
}

/** Signed-in user shown in the UI while login is disabled ("Good evening, Angel" / "AA"). */
export const mockCurrentUser = createMockUser('angel@phytoplan.app', 'Angel A.');
