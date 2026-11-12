import { Clock, Droplets, Hand, RefreshCw, Save, Zap } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip-group';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useTheme } from '@/hooks/use-theme';
import { formatClock, formatTimeAgo } from '@/lib/utils';
import type { BedDetail, IrrigationSchedule } from '@/types/models';

const FREQUENCIES: { label: string; value: `${IrrigationSchedule['evaluateEveryMinutes']}` }[] = [
  { label: '15m', value: '15' },
  { label: '30m', value: '30' },
  { label: '60m', value: '60' },
  { label: '120m', value: '120' },
];

/** Digits only, clamped to 0–100 (moisture %). Empty stays empty while typing. */
function percentInput(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 3);
  return digits === '' ? NaN : Math.min(100, Number(digits));
}

type ScheduleCardProps = {
  detail: BedDetail;
  schedule: IrrigationSchedule;
  onChange: (schedule: IrrigationSchedule) => void;
  saving: boolean;
  checking: boolean;
  onSave: () => void;
  onRunCheck: () => void;
};

/** "Automated irrigation schedule" form. Validation happens in the screen before saving. */
export function ScheduleCard({ detail, schedule, onChange, saving, checking, onSave, onRunCheck }: ScheduleCardProps) {
  const theme = useTheme();
  const set = (patch: Partial<IrrigationSchedule>) => onChange({ ...schedule, ...patch });
  const moisture = detail.metrics.soilMoisture;
  const inRange = moisture >= schedule.irrigateBelow && moisture <= schedule.stopAt;
  const smart = schedule.mode === 'smart';

  return (
    <Card className="p-4">
      <SegmentedControl
        options={[
          { label: 'Smart mode', value: 'smart', icon: Zap },
          { label: 'Manual mode', value: 'manual', icon: Hand },
        ]}
        value={schedule.mode}
        onChange={(mode) => set({ mode })}
      />
      <Text variant="caption" tone="slate" className="mt-2.5">
        {smart
          ? 'ADSS irrigates when moisture drops below your threshold'
          : 'Irrigation runs only when you start it from Overrides'}
      </Text>

      <View className="mt-4 flex-row gap-2.5" style={{ opacity: smart ? 1 : 0.5 }} pointerEvents={smart ? 'auto' : 'none'}>
        <TextField
          containerClassName="flex-1"
          label="Irrigate below"
          helper="Trigger threshold"
          keyboardType="number-pad"
          value={Number.isNaN(schedule.irrigateBelow) ? '' : String(schedule.irrigateBelow)}
          onChangeText={(t) => set({ irrigateBelow: percentInput(t) })}
          trailing={<Text variant="caption" tone="tertiary">%</Text>}
        />
        <TextField
          containerClassName="flex-1"
          label="Stop at"
          helper="Target moisture"
          keyboardType="number-pad"
          value={Number.isNaN(schedule.stopAt) ? '' : String(schedule.stopAt)}
          onChangeText={(t) => set({ stopAt: percentInput(t) })}
          trailing={<Text variant="caption" tone="tertiary">%</Text>}
        />
      </View>

      <View style={{ opacity: smart ? 1 : 0.5 }} pointerEvents={smart ? 'auto' : 'none'}>
        <Text variant="overline" tone="tertiary" className="mt-3">
          Evaluate moisture every
        </Text>
        <ChipGroup
          className="mt-1.5"
          fill
          options={FREQUENCIES}
          value={`${schedule.evaluateEveryMinutes}`}
          onChange={(v) => set({ evaluateEveryMinutes: Number(v) as IrrigationSchedule['evaluateEveryMinutes'] })}
          accessibilityLabel="Evaluate moisture every"
        />

        <View className="mt-3 flex-row gap-2.5">
          <TextField
            containerClassName="flex-1"
            label="Window start"
            value={schedule.windowStart}
            onChangeText={(windowStart) => set({ windowStart })}
            trailing={<Clock size={14} color={theme.slate} />}
          />
          <TextField
            containerClassName="flex-1"
            label="Window end"
            value={schedule.windowEnd}
            onChangeText={(windowEnd) => set({ windowEnd })}
            trailing={<Clock size={14} color={theme.slate} />}
          />
        </View>

        <TextField
          containerClassName="mt-3"
          label="Max cycles per day"
          keyboardType="number-pad"
          value={Number.isNaN(schedule.maxCyclesPerDay) ? '' : String(schedule.maxCyclesPerDay)}
          onChangeText={(t) => {
            const digits = t.replace(/\D/g, '').slice(0, 2);
            set({ maxCyclesPerDay: digits === '' ? NaN : Number(digits) });
          }}
        />
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Droplets size={13} color={theme.primary} />
          <Text variant="caption" tone="slate">
            {`Now ${moisture}% · ${inRange ? 'within range' : moisture < schedule.irrigateBelow ? 'below threshold' : 'above target'}`}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Clock size={13} color={theme.slate} />
          <Text variant="caption" tone="slate">
            {`Next ${formatClock(detail.irrigation.nextCheckAt)}`}
          </Text>
        </View>
      </View>

      <View className="mt-3.5 flex-row gap-2.5">
        <Button className="flex-1" icon={Save} title="Save schedule" loading={saving} disabled={checking} onPress={onSave} />
        <Button
          className="flex-1"
          variant="outline"
          icon={RefreshCw}
          title="Run smart check"
          loading={checking}
          disabled={saving}
          onPress={onRunCheck}
        />
      </View>
      <Text variant="caption" tone="tertiary" className="mt-3">
        {`Smart checks evaluate soil moisture against the threshold whenever you open this bed or run a check. Last check ${formatClock(detail.irrigation.lastCheckAt)} · ${formatTimeAgo(detail.irrigation.lastCheckAt)}.`}
      </Text>
    </Card>
  );
}

/** Returns an error message, or null when the schedule can be saved. */
export function validateSchedule(s: IrrigationSchedule): string | null {
  if (Number.isNaN(s.irrigateBelow) || Number.isNaN(s.stopAt)) return 'Enter both moisture thresholds.';
  if (s.irrigateBelow >= s.stopAt) return '"Irrigate below" must be lower than "Stop at".';
  if (Number.isNaN(s.maxCyclesPerDay) || s.maxCyclesPerDay < 1 || s.maxCyclesPerDay > 24)
    return 'Max cycles per day must be between 1 and 24.';
  const time = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;
  if (!time.test(s.windowStart.trim()) || !time.test(s.windowEnd.trim()))
    return 'Enter window times like 06:00 AM.';
  return null;
}
