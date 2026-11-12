import { isoHoursAgo } from '@/lib/utils';
import type { EnvironmentSnapshot, FarmAlert, WaterUsage } from '@/types/models';

export const mockFacilityName = 'CUIA Rooftop Facility';

export const mockEnvironment: EnvironmentSnapshot = {
  airTemp: 30.4,
  humidity: 67,
  vpd: 1.4,
  ctd: 2.2,
};

export const mockWaterUsage: WaterUsage = {
  savedLiters: 1240,
  consumedLiters: 3860,
};

export const mockAlerts: FarmAlert[] = [
  { id: 'alert-1', title: 'Bed 03 has low soil moisture', bedCode: 'B-03', createdAt: isoHoursAgo(21) },
];
