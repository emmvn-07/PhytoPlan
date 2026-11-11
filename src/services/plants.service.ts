import { config } from '@/constants/config';
import { delay } from '@/lib/utils';
import { mockPlants } from '@/mocks/plants';
import type { Plant } from '@/types/models';

/**
 * Plants data access.
 * PLACEHOLDER: returns mock data. When the `plants` table exists, query it via `supabase`
 * here (map rows → Plant) — screens and hooks won't need to change.
 */
export const plantsService = {
  async listPlants(): Promise<Plant[]> {
    await delay(config.mockDelayMs);
    return mockPlants;
  },
};
