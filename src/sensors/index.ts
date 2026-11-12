/**
 * Sensors module — reserved for future hardware integration (e.g. BLE / Wi-Fi soil sensors).
 *
 * Swap `mockSensorClient` for a real implementation of `SensorClient` later.
 * Native hardware libraries require a development build (not Expo Go).
 */
import { createMockReading } from '@/mocks/sensors';
import type { SensorReading } from '@/types/models';

export interface SensorClient {
  /** Latest reading for a garden bed's attached sensor, or null if none. */
  getLatestReading(bedId: string): Promise<SensorReading | null>;
}

const mockSensorClient: SensorClient = {
  async getLatestReading(bedId) {
    return createMockReading(bedId);
  },
};

export const sensorClient: SensorClient = mockSensorClient;
