import type { AnalyticsPeriod, FarmAnalytics, GrowingConditions, SuggestedCrop } from '@/types/models';

import { series } from './trends';

export const mockGrowingConditions: GrowingConditions = {
  season: 'Transitional season',
  waterAvailable: '53% reservoir',
  temperature: '30.4°C',
  humidity: '67% · VPD 1.40',
  soilMoisture: '48% avg',
  sunlight: '6–8 h · open rooftop',
};

/** First four as in design-references/5; the rest fill the "8 crops" count. */
export const mockSuggestedCrops: SuggestedCrop[] = [
  { id: 'crop-1', name: 'Siling Labuyo', scientificName: 'Capsicum frutescens', matchPercent: 100, durationDays: 75, waterPerDayLiters: 1.2, minTemp: 22, maxTemp: 34 },
  { id: 'crop-2', name: 'Eggplant', scientificName: 'Solanum melongena', matchPercent: 90, durationDays: 80, waterPerDayLiters: 2.6, minTemp: 22, maxTemp: 32 },
  { id: 'crop-3', name: 'Cherry Tomato', scientificName: 'Solanum lycopersicum', matchPercent: 88, durationDays: 65, waterPerDayLiters: 2.4, minTemp: 20, maxTemp: 30 },
  { id: 'crop-4', name: 'Sweet Basil', scientificName: 'Ocimum basilicum', matchPercent: 86, durationDays: 40, waterPerDayLiters: 1.0, minTemp: 20, maxTemp: 32 },
  { id: 'crop-5', name: 'Okra', scientificName: 'Abelmoschus esculentus', matchPercent: 82, durationDays: 55, waterPerDayLiters: 1.8, minTemp: 22, maxTemp: 35 },
  { id: 'crop-6', name: 'Pechay', scientificName: 'Brassica rapa subsp. chinensis', matchPercent: 80, durationDays: 30, waterPerDayLiters: 0.8, minTemp: 18, maxTemp: 30 },
  { id: 'crop-7', name: 'Kangkong', scientificName: 'Ipomoea aquatica', matchPercent: 78, durationDays: 30, waterPerDayLiters: 1.5, minTemp: 24, maxTemp: 35 },
  { id: 'crop-8', name: 'Butterhead Lettuce', scientificName: 'Lactuca sativa', matchPercent: 72, durationDays: 45, waterPerDayLiters: 0.9, minTemp: 16, maxTemp: 26 },
];

const lastDay = new Date(2026, 10, 9);
const scale = { 7: 1, 14: 2, 30: 4.3 } as const;

/** design-references/6 shows the 7-day view; longer periods scale totals and extend the series. */
export function createMockAnalytics(period: AnalyticsPeriod): FarmAnalytics {
  const k = scale[period];
  return {
    water: { consumedLiters: Math.round(3860 * k), savedLiters: Math.round(1240 * k) },
    survivability: { monitored: 6, healthy: 3, stressed: 2 },
    trends: {
      soilMoisture: series([47, 47, 46, 38.5, 38.7, 38.7, 31], lastDay, period),
      temperature: series([29.4, 30.1, 30.8, 31.2, 30.6, 30.9, 30.4], lastDay, period),
      humidity: series([71, 69, 66, 64, 65, 66, 67], lastDay, period, 0),
      vpd: series([1.21, 1.28, 1.36, 1.44, 1.39, 1.42, 1.4], lastDay, period, 2),
    },
  };
}
