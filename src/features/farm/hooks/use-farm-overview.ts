import { useAsync } from '@/hooks/use-async';
import { farmService } from '@/services/farm.service';
import type { GardenBed } from '@/types/models';

export function useFarmOverview() {
  return useAsync(farmService.getOverview);
}

/** Bed counts for the overview card. Health % = share of beds that are healthy. */
export function summarizeBeds(beds: GardenBed[]) {
  const healthy = beds.filter((bed) => bed.status === 'healthy').length;
  return {
    total: beds.length,
    healthy,
    attention: beds.length - healthy,
    healthPercent: beds.length ? Math.round((healthy / beds.length) * 100) : 0,
  };
}
