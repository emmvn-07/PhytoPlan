import type { AppUser } from '@/types/models';

export function createMockUser(email?: string, fullName?: string): AppUser {
  return {
    id: 'demo-user',
    email: email || 'demo@phytoplan.app',
    fullName: fullName || 'Demo User',
  };
}
