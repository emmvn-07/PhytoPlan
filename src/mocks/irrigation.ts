import { isoHoursAgo } from '@/lib/utils';
import type { IrrigationExecution, IrrigationMode, IrrigationStatus } from '@/types/models';

/** One shared reservoir (design-references/7 values) — also shown on bed detail. */
export const mockIrrigationStatus: IrrigationStatus = {
  pumpConnected: true,
  lastSyncAt: isoHoursAgo(21),
  activeBeds: 0,
  automationOn: true,
  reservoir: { capacityLiters: 120, remainingLiters: 70 },
  waterDispensedLiters: 3860,
  nutrientsDosedMl: 1420,
};

/** Per-bed ADSS need and mode, keyed by bed id. */
export const mockBedControls: Record<string, { mode: IrrigationMode; adssNeedLiters: number }> = {
  'bed-01': { mode: 'smart', adssNeedLiters: 1.1 },
  'bed-02': { mode: 'smart', adssNeedLiters: 2.5 },
  'bed-03': { mode: 'smart', adssNeedLiters: 14.8 },
  'bed-04': { mode: 'smart', adssNeedLiters: 0 },
  'bed-05': { mode: 'smart', adssNeedLiters: 23.4 },
  'bed-06': { mode: 'manual', adssNeedLiters: 12.2 },
};

export const mockExecutions: IrrigationExecution[] = [
  { id: 'exe-1', bedCode: 'B-04', kind: 'nutrients', amount: '18 mL', at: isoHoursAgo(26), source: 'ADSS automatic', status: 'completed' },
  { id: 'exe-2', bedCode: 'B-01', kind: 'water', amount: '1.1 L', at: isoHoursAgo(28), source: 'ADSS automatic', status: 'completed' },
  { id: 'exe-3', bedCode: 'B-02', kind: 'water', amount: '1.3 L', at: isoHoursAgo(29), source: 'ADSS automatic', status: 'completed' },
];
