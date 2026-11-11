import type { SensorReading } from '@/types/models';

/** Fake reading generator until real hardware is connected. */
export function createMockReading(plantId: string): SensorReading {
  return {
    sensorId: `mock-${plantId}`,
    plantId,
    type: 'soil_moisture',
    value: Math.round(20 + Math.random() * 60),
    unit: '%',
    recordedAt: new Date().toISOString(),
  };
}
