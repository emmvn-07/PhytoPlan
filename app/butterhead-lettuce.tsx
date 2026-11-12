import { router, useLocalSearchParams } from 'expo-router';
import { CircleCheck, Scissors } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { TrendChartCard } from '@/components/trend-chart-card';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import { BedHero } from '@/features/beds/components/detail/bed-hero';
import { BedMetricsGrid } from '@/features/beds/components/detail/bed-metrics-grid';
import { CameraHealthCard } from '@/features/beds/components/detail/camera-health-card';
import { IrrigationOverridesCard } from '@/features/beds/components/detail/irrigation-overrides-card';
import { ScheduleCard, validateSchedule } from '@/features/beds/components/detail/schedule-card';
import { useBedDetail } from '@/features/beds/hooks/use-beds';
import { ReservoirCard } from '@/features/irrigation/components/reservoir-card';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { confirm } from '@/lib/confirm';
import { formatClock, getErrorMessage } from '@/lib/utils';
import { irrigationService, type IrrigationCommand } from '@/services/irrigation.service';
import type { BedTrendMetric, IrrigationSchedule } from '@/types/models';

const TREND_METRICS: { label: string; value: BedTrendMetric; caption: string }[] = [
  { label: 'Moisture', value: 'moisture', caption: 'Moisture (%)' },
  { label: 'Soil temp', value: 'soilTemp', caption: 'Soil temperature (°C)' },
  { label: 'Air temp', value: 'airTemp', caption: 'Air temperature (°C)' },
  { label: 'Humidity', value: 'humidity', caption: 'Humidity (%)' },
  { label: 'VPD', value: 'vpd', caption: 'VPD (kPa)' },
];

const COMMAND_COPY: Record<IrrigationCommand, { title: string; message: string; done: string }> = {
  'start-irrigation': { title: 'Start irrigation?', message: 'The pump will run until the target moisture is reached.', done: 'Irrigation started.' },
  'stop-irrigation': { title: 'Stop irrigation?', message: 'The pump will stop immediately.', done: 'Irrigation stopped.' },
  'dispense-water': { title: 'Dispense water?', message: 'Dispense the ADSS water need now.', done: 'Water dispensed.' },
  'dispense-nutrients': { title: 'Dispense nutrients?', message: 'Dose the nutrient solution now.', done: 'Nutrients dispensed.' },
  'run-smart-check': { title: 'Run smart check?', message: 'Evaluate soil moisture against the threshold now.', done: 'Smart check complete.' },
  'run-surface-scan': { title: 'Run surface scan?', message: 'Capture a new camera scan for plant health.', done: 'Surface scan captured.' },
};

/** Bed detail (design-references/3). Route name follows the reference; `?id=` selects the bed. */
export default function BedDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const bedId = id ?? 'bed-01';
  const { data: detail, isLoading, error } = useBedDetail(bedId);
  const { data: status } = useAsync(irrigationService.getStatus);

  const [draft, setDraft] = useState<IrrigationSchedule | null>(null);
  const [pumpRunning, setPumpRunning] = useState(false);
  const [pending, setPending] = useState<IrrigationCommand | null>(null);
  const [saving, setSaving] = useState(false);
  const [trend, setTrend] = useState<BedTrendMetric>('moisture');

  async function runCommand(command: IrrigationCommand) {
    const copy = COMMAND_COPY[command];
    if (!(await confirm(copy.title, copy.message))) return;
    setPending(command);
    try {
      await irrigationService.sendCommand(bedId, command);
      if (command === 'start-irrigation') setPumpRunning(true);
      if (command === 'stop-irrigation') setPumpRunning(false);
      Alert.alert(copy.done, 'Demo data — no device was contacted.');
    } catch (e) {
      Alert.alert('Command failed', getErrorMessage(e));
    } finally {
      setPending(null);
    }
  }

  async function saveSchedule(schedule: IrrigationSchedule) {
    const problem = validateSchedule(schedule);
    if (problem) return Alert.alert('Check the schedule', problem);
    setSaving(true);
    try {
      await irrigationService.saveSchedule(bedId, schedule);
      Alert.alert('Schedule saved', 'Demo data — saved on this device only.');
    } catch (e) {
      Alert.alert('Could not save', getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function confirmBedAction(kind: 'done' | 'harvest') {
    const ok =
      kind === 'done'
        ? await confirm('Mark as done?', 'Record today’s tasks for this bed as complete.', 'Mark as done')
        : await confirm('Harvest / remove?', 'This ends the crop cycle for this bed.', 'Harvest', true);
    if (!ok) return;
    Alert.alert(kind === 'done' ? 'Marked as done' : 'Bed harvested', 'Demo data — nothing was changed.');
    if (kind === 'harvest') router.back();
  }

  if (isLoading || !detail) {
    return (
      <Screen contentClassName="px-4 pt-4">
        <ScreenHeader back title={bedId.replace('bed-', 'B-')} />
        <View className="mt-10">
          {error ? (
            <Text tone="danger" className="px-2">
              {error}
            </Text>
          ) : (
            <ActivityIndicator color={theme.primary} accessibilityLabel="Loading bed" />
          )}
        </View>
      </Screen>
    );
  }

  const schedule = draft ?? detail.schedule;
  const trendMetric = TREND_METRICS.find((m) => m.value === trend)!;

  return (
    <Screen contentClassName="px-4 pt-4">
      <ScreenHeader back title={detail.bed.code} subtitle={detail.location} />

      <View className="mt-4">
        <BedHero detail={detail} />
      </View>

      <SectionHeader title="Camera & plant health" className="mt-6" />
      <View className="mt-3">
        <CameraHealthCard
          detail={detail}
          scanning={pending === 'run-surface-scan'}
          onRunScan={() => runCommand('run-surface-scan')}
        />
      </View>

      <SectionHeader title="Irrigation control" className="mt-6" />
      <View className="mt-3">
        <IrrigationOverridesCard
          detail={detail}
          mode={schedule.mode}
          pumpRunning={pumpRunning}
          pending={pending}
          onCommand={runCommand}
        />
      </View>

      <SectionHeader title="Automated irrigation schedule" className="mt-6" />
      <View className="mt-3">
        <ScheduleCard
          detail={detail}
          schedule={schedule}
          onChange={setDraft}
          saving={saving}
          checking={pending === 'run-smart-check'}
          onSave={() => saveSchedule(schedule)}
          onRunCheck={() => runCommand('run-smart-check')}
        />
      </View>

      <SectionHeader title="Environmental metrics" className="mt-6" />
      <View className="mt-3">
        <BedMetricsGrid metrics={detail.metrics} />
      </View>

      <SectionHeader title="Temperature & trends" className="mt-6" />
      <View className="mt-3">
        <TrendChartCard
          metrics={TREND_METRICS}
          metric={trend}
          onMetricChange={setTrend}
          data={detail.trends[trend]}
          caption={`Last ${detail.trends[trend].length} daily readings · ${trendMetric.caption}`}
        />
      </View>

      {status && (
        <>
          <SectionHeader title="Water reservoir" className="mt-6" />
          <View className="mt-3">
            <ReservoirCard reservoir={status.reservoir} />
          </View>
        </>
      )}

      <SectionHeader title="Bed actions" className="mt-6" />
      <View className="mt-3 flex-row gap-2.5">
        <Button className="flex-1" size="lg" icon={CircleCheck} title="Mark as done" onPress={() => confirmBedAction('done')} />
        <Button
          className="flex-1"
          size="lg"
          variant="danger"
          icon={Scissors}
          title="Harvest / remove"
          onPress={() => confirmBedAction('harvest')}
        />
      </View>
      <Text variant="caption" tone="tertiary" className="mt-3 text-center">
        {`Last irrigation ${formatClock(detail.irrigation.lastIrrigationAt)} · Demonstration data`}
      </Text>
    </Screen>
  );
}
