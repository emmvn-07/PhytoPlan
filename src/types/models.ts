/**
 * Shared app data models (camelCase, UI-facing).
 * Services map Supabase rows (src/types/database.ts, snake_case) into these.
 */

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
}

export interface Profile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  /** How often the plant should be watered. */
  wateringIntervalDays: number;
  /** ISO timestamp. */
  lastWateredAt: string;
  /** Soil moisture 0–100 %, or null when no sensor is attached. */
  moisture: number | null;
}

export type SensorType = 'soil_moisture' | 'temperature' | 'humidity' | 'light';

export interface SensorReading {
  sensorId: string;
  plantId: string;
  type: SensorType;
  value: number;
  unit: string;
  /** ISO timestamp. */
  recordedAt: string;
}
