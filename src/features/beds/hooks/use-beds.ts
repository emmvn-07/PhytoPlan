import { useAsync } from '@/hooks/use-async';
import { bedsService } from '@/services/beds.service';
import type { BedStatus, GardenBed } from '@/types/models';

export type BedStatusFilter = 'all' | BedStatus;

export function useBeds() {
  return useAsync(bedsService.listBeds);
}

export function useBedDetail(bedId: string) {
  return useAsync(bedsService.getBedDetail, bedId);
}

/** Search (bed code or crop), crop dropdown and status chips combined. */
export function filterBeds(
  beds: GardenBed[],
  { query, crop, status }: { query: string; crop: string; status: BedStatusFilter }
) {
  const q = query.trim().toLowerCase();
  return beds.filter(
    (bed) =>
      (status === 'all' || bed.status === status) &&
      (crop === 'all' || bed.cropName === crop) &&
      (!q || bed.cropName.toLowerCase().includes(q) || bed.code.toLowerCase().includes(q))
  );
}

/** Counts for the Garden beds stat card. */
export function countBeds(beds: GardenBed[]) {
  const count = (status: BedStatus) => beds.filter((bed) => bed.status === status).length;
  return { total: beds.length, healthy: count('healthy'), stressed: count('attention'), offline: count('offline') };
}
