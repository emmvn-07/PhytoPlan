import { config } from '@/constants/config';
import { delay } from '@/lib/utils';
import { mockBeds } from '@/mocks/beds';
import { mockBedControls, mockExecutions, mockIrrigationStatus } from '@/mocks/irrigation';
import type { BedControl, IrrigationExecution, IrrigationSchedule, IrrigationStatus } from '@/types/models';

export type IrrigationCommand =
  | 'start-irrigation'
  | 'stop-irrigation'
  | 'dispense-water'
  | 'dispense-nutrients'
  | 'run-smart-check'
  | 'run-surface-scan';

/**
 * Irrigation / fertigation (IoT gateway).
 * PLACEHOLDER: reads return mocks and commands only simulate latency. Real commands go to the
 * gateway (see src/sensors) — keep the confirmation prompts in the UI when wiring them.
 */
export const irrigationService = {
  async getControlPanel(): Promise<{
    status: IrrigationStatus;
    controls: BedControl[];
    executions: IrrigationExecution[];
  }> {
    await delay(config.mockDelayMs);
    return {
      status: mockIrrigationStatus,
      controls: mockBeds.map((bed) => ({
        bed,
        pumpRunning: false,
        ...(mockBedControls[bed.id] ?? { mode: 'smart', adssNeedLiters: 0 }),
      })),
      executions: mockExecutions,
    };
  },

  async getStatus(): Promise<IrrigationStatus> {
    await delay(config.mockDelayMs);
    return mockIrrigationStatus;
  },

  async sendCommand(_bedId: string, _command: IrrigationCommand): Promise<void> {
    await delay(config.mockDelayMs);
  },

  async saveSchedule(_bedId: string, _schedule: IrrigationSchedule): Promise<void> {
    await delay(config.mockDelayMs);
  },

  async setAutomation(_enabled: boolean): Promise<void> {
    await delay(config.mockDelayMs);
  },
};
