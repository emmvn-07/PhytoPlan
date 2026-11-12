import { config } from '@/constants/config';
import { delay } from '@/lib/utils';
import { mockBeds } from '@/mocks/beds';
import { mockAlerts, mockEnvironment, mockFacilityName, mockWaterUsage } from '@/mocks/farm';
import type { FarmOverview } from '@/types/models';

/**
 * Farm-level data for the overview screen.
 * PLACEHOLDER: returns mock data. Replace the body with Supabase queries (beds, latest readings,
 * water totals, open alerts) once those tables exist — hooks and screens won't need to change.
 */
export const farmService = {
  async getOverview(): Promise<FarmOverview> {
    await delay(config.mockDelayMs);
    return {
      facilityName: mockFacilityName,
      isDemoData: true,
      beds: mockBeds,
      environment: mockEnvironment,
      water: mockWaterUsage,
      alerts: mockAlerts,
    };
  },
};
