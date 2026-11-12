import { isoHoursAgo } from '@/lib/utils';
import type { BedDetail, GardenBed } from '@/types/models';

import { series } from './trends';

const scientificNames: Record<string, string> = {
  'Butterhead Lettuce': 'Lactuca sativa',
  'Cherry Tomato': 'Solanum lycopersicum',
  'Curly Kale': 'Brassica oleracea',
  'Sweet Basil': 'Ocimum basilicum',
  'Siling Labuyo': 'Capsicum frutescens',
  Eggplant: 'Solanum melongena',
};

/** Detail for any bed, modelled on B-01 in design-references/3. */
export function createMockBedDetail(bed: GardenBed, index: number): BedDetail {
  const moisture = bed.soilMoisture ?? 0;
  const lastReading = new Date(2026, 10, 8);
  return {
    bed,
    scientificName: scientificNames[bed.cropName] ?? '',
    location: `Rooftop Bay ${index < 3 ? 'A' : 'B'} · Rack ${(index % 3) + 1}`,
    plantedAt: '2026-10-21T08:00:00',
    connected: bed.status !== 'offline',
    camera: { id: `CAM-0${index + 1}`, capturedAt: isoHoursAgo(21) },
    detection: {
      healthy: bed.status === 'healthy',
      confidence: bed.status === 'healthy' ? 96 : 81,
      symptoms: bed.status === 'healthy' ? 'None observed' : 'Leaf curl, mild wilting',
      capturedAt: isoHoursAgo(21),
    },
    irrigation: {
      pumpRunning: false,
      adssWaterNeedLiters: 1.1,
      nutrientDoseMl: 9,
      lastIrrigationAt: isoHoursAgo(28),
      nextCheckAt: isoHoursAgo(-3),
      lastCheckAt: isoHoursAgo(21),
    },
    schedule: {
      mode: 'smart',
      irrigateBelow: 45,
      stopAt: 65,
      evaluateEveryMinutes: 30,
      windowStart: '06:00 AM',
      windowEnd: '06:00 PM',
      maxCyclesPerDay: 4,
    },
    metrics: {
      soilMoisture: moisture,
      soilTemp: 24.1,
      airTemp: bed.temperature ?? 29.2,
      humidity: 72,
      vpd: 1.12,
      ctd: 2.4,
      ec: 1.6,
      npk: '42–18–38',
    },
    trends: {
      moisture: series([61, 64, 64, 64, 67, 67, 66, 69, 69, 69], lastReading, 10, 0),
      soilTemp: series([23.6, 23.9, 24.2, 24.0, 23.8, 24.4, 24.1, 24.3, 24.0, 24.1], lastReading, 10),
      airTemp: series([28.4, 29.1, 29.6, 30.2, 29.8, 29.0, 28.7, 29.3, 29.5, 29.2], lastReading, 10),
      humidity: series([70, 68, 71, 73, 74, 72, 69, 71, 73, 72], lastReading, 10, 0),
      vpd: series([1.05, 1.18, 1.2, 1.1, 1.02, 1.08, 1.21, 1.15, 1.1, 1.12], lastReading, 10, 2),
    },
  };
}
