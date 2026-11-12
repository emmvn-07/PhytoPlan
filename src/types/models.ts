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

export type BedStatus = 'healthy' | 'attention' | 'offline';

export interface GardenBed {
  id: string;
  /** Display code, e.g. "B-01". */
  code: string;
  cropName: string;
  status: BedStatus;
  /** Soil moisture %, null when the bed's sensor is offline. */
  soilMoisture: number | null;
  /** Soil temperature °C, null when offline. */
  temperature: number | null;
  /** Remote photo; a placeholder is shown when missing. */
  imageUrl?: string;
}

export interface EnvironmentSnapshot {
  /** °C */
  airTemp: number;
  /** % relative humidity */
  humidity: number;
  /** Vapour pressure deficit, kPa */
  vpd: number;
  /** Canopy temperature differential, °C */
  ctd: number;
}

export interface WaterUsage {
  /** Litres saved this month. */
  savedLiters: number;
  /** Litres consumed this month. */
  consumedLiters: number;
}

export interface FarmAlert {
  id: string;
  title: string;
  bedCode: string;
  /** ISO timestamp. */
  createdAt: string;
}

export interface FarmOverview {
  facilityName: string;
  /** True while the data comes from src/mocks. */
  isDemoData: boolean;
  beds: GardenBed[];
  environment: EnvironmentSnapshot;
  water: WaterUsage;
  alerts: FarmAlert[];
}

/** A dated value for charts. */
export interface TrendPoint {
  /** ISO date (yyyy-mm-dd). */
  date: string;
  value: number;
}

// ── Bed detail ───────────────────────────────────────────────────────────────

export type IrrigationMode = 'smart' | 'manual';

export interface IrrigationSchedule {
  mode: IrrigationMode;
  /** Start irrigating when soil moisture drops below this %. */
  irrigateBelow: number;
  /** Stop when moisture reaches this %. */
  stopAt: number;
  evaluateEveryMinutes: 15 | 30 | 60 | 120;
  /** "06:00 AM" */
  windowStart: string;
  windowEnd: string;
  maxCyclesPerDay: number;
}

export type BedTrendMetric = 'moisture' | 'soilTemp' | 'airTemp' | 'humidity' | 'vpd';

export interface BedDetail {
  bed: GardenBed;
  scientificName: string;
  /** "Rooftop Bay A · Rack 1" */
  location: string;
  /** ISO date. */
  plantedAt: string;
  connected: boolean;
  camera: { id: string; capturedAt: string };
  detection: {
    healthy: boolean;
    /** 0–100 */
    confidence: number;
    symptoms: string;
    capturedAt: string;
  };
  irrigation: {
    pumpRunning: boolean;
    adssWaterNeedLiters: number;
    nutrientDoseMl: number;
    lastIrrigationAt: string;
    nextCheckAt: string;
    lastCheckAt: string;
  };
  schedule: IrrigationSchedule;
  metrics: {
    soilMoisture: number;
    soilTemp: number;
    airTemp: number;
    humidity: number;
    vpd: number;
    ctd: number;
    ec: number;
    /** "42–18–38" ppm */
    npk: string;
  };
  trends: Record<BedTrendMetric, TrendPoint[]>;
}

export interface Reservoir {
  capacityLiters: number;
  remainingLiters: number;
}

// ── Calendar ─────────────────────────────────────────────────────────────────

export interface WeatherConditions {
  /** °C */
  temperature: number;
  summary: string;
  humidity: number;
  advisories: { kind: 'warning' | 'sun'; text: string }[];
}

export type RecordKind = 'irrigation' | 'nutrients' | 'scan';

export interface CalendarRecord {
  id: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  /** "06:20" */
  time: string;
  kind: RecordKind;
  title: string;
  description: string;
  bedCode: string;
}

// ── Insights ─────────────────────────────────────────────────────────────────

export interface GrowingConditions {
  season: string;
  waterAvailable: string;
  temperature: string;
  humidity: string;
  soilMoisture: string;
  sunlight: string;
}

export interface SuggestedCrop {
  id: string;
  name: string;
  scientificName: string;
  /** 0–100 */
  matchPercent: number;
  durationDays: number;
  waterPerDayLiters: number;
  minTemp: number;
  maxTemp: number;
  imageUrl?: string;
}

export type AnalyticsPeriod = 7 | 14 | 30;
export type FarmTrendMetric = 'soilMoisture' | 'temperature' | 'humidity' | 'vpd';

export interface FarmAnalytics {
  water: { consumedLiters: number; savedLiters: number };
  survivability: { monitored: number; healthy: number; stressed: number };
  trends: Record<FarmTrendMetric, TrendPoint[]>;
}

// ── Irrigation control ───────────────────────────────────────────────────────

export interface IrrigationStatus {
  pumpConnected: boolean;
  lastSyncAt: string;
  activeBeds: number;
  automationOn: boolean;
  reservoir: Reservoir;
  waterDispensedLiters: number;
  nutrientsDosedMl: number;
}

export interface BedControl {
  bed: GardenBed;
  mode: IrrigationMode;
  pumpRunning: boolean;
  adssNeedLiters: number;
}

export interface IrrigationExecution {
  id: string;
  bedCode: string;
  kind: 'water' | 'nutrients';
  /** "1.1 L", "18 mL" */
  amount: string;
  at: string;
  source: string;
  status: 'completed' | 'failed';
}

export type SensorType = 'soil_moisture' | 'temperature' | 'humidity' | 'light';

export interface SensorReading {
  sensorId: string;
  bedId: string;
  type: SensorType;
  value: number;
  unit: string;
  /** ISO timestamp. */
  recordedAt: string;
}
