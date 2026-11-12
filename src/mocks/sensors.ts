import type { SensorReading } from '@/types/models';

/** Fake reading generator until real hardware is connected. */
export function createMockReading(bedId: string): SensorReading {
  return {
    sensorId: `mock-${bedId}`,
    bedId,
    type: 'soil_moisture',
    value: Math.round(20 + Math.random() * 60),
    unit: '%',
    recordedAt: new Date().toISOString(),
  };
}
