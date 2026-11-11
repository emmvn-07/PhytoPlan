/**
 * Sensors module — reserved for future hardware integration (e.g. BLE / Wi-Fi soil sensors).
 *
 * Swap `mockSensorClient` for a real implementation of `SensorClient` later.
 * Native hardware libraries require a development build (not Expo Go).
 */
import { createMockReading } from '@/mocks/sensors';
import type { SensorReading } from '@/types/models';

export interface SensorClient {
  /** Latest reading for a plant's attached sensor, or null if none. */
  getLatestReading(plantId: string): Promise<SensorReading | null>;
}

const mockSensorClient: SensorClient = {
  async getLatestReading(plantId) {
    return createMockReading(plantId);
  },
};

export const sensorClient: SensorClient = mockSensorClient;
