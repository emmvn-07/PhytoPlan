import { config } from '@/constants/config';
import { delay } from '@/lib/utils';
import { createMockBedDetail } from '@/mocks/bed-details';
import { mockBeds } from '@/mocks/beds';
import type { BedDetail, GardenBed } from '@/types/models';

/**
 * Garden beds.
 * PLACEHOLDER: mock data. Swap the bodies for Supabase queries when the beds tables exist.
 */
export const bedsService = {
  async listBeds(): Promise<GardenBed[]> {
    await delay(config.mockDelayMs);
    return mockBeds;
  },

  async getBedDetail(bedId: string): Promise<BedDetail> {
    await delay(config.mockDelayMs);
    const index = mockBeds.findIndex((bed) => bed.id === bedId);
    if (index === -1) throw new Error(`Bed not found: ${bedId}`);
    return createMockBedDetail(mockBeds[index], index);
  },
};
