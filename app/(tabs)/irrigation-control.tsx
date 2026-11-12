import { Activity, Clock, Droplet, FlaskConical, Power, ShieldCheck } from 'lucide-react-native';
import { Fragment, useState } from 'react';
import { ActivityIndicator, Alert, Switch, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { IconCircle } from '@/components/ui/icon-circle';
import { MetricTile } from '@/components/ui/metric-tile';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Text } from '@/components/ui/text';
import { BedControlRow } from '@/features/irrigation/components/bed-control-row';
import { ReservoirCard } from '@/features/irrigation/components/reservoir-card';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { confirm } from '@/lib/confirm';
import { formatNumber, formatTimeAgo, getErrorMessage } from '@/lib/utils';
import { irrigationService } from '@/services/irrigation.service';

export default function IrrigationControlScreen() {
  const theme = useTheme();
  const { data, isLoading, error } = useAsync(irrigationService.getControlPanel);
  const [automation, setAutomation] = useState<boolean | null>(null);
  const [savingAutomation, setSavingAutomation] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const automationOn = automation ?? data?.status.automationOn ?? false;

  async function toggleAutomation(next: boolean) {
    // Turning automation off stops ADSS from watering — confirm first.
    if (!next && !(await confirm('Turn off automated irrigation?', 'ADSS will stop scheduling cycles until you turn it back on.', 'Turn off', true))) {
      return;
    }
    setSavingAutomation(true);
    try {
      await irrigationService.setAutomation(next);
      setAutomation(next);
    } catch (e) {
      Alert.alert('Could not update', getErrorMessage(e));
    } finally {
      setSavingAutomation(false);
    }
  }

  return (
    <Screen withTabBar contentClassName="px-4 pt-4">
      <ScreenHeader
        title="Irrigation control"
        subtitle="IoT fertigation management"
        right={
          data ? (
            <Badge
              label={data.status.pumpConnected ? 'Gateway online' : 'Gateway offline'}
              tone={data.status.pumpConnected ? 'primary' : 'idle'}
              dot
              className="mt-1 px-2.5 py-1"
            />
          ) : null
        }
      />

      {isLoading ? (
        <View className="mt-10">
          <ActivityIndicator color={theme.primary} accessibilityLabel="Loading irrigation control" />
        </View>
      ) : error || !data ? (
        <Text tone="danger" className="mt-6 px-2">
          {error ?? 'Could not load irrigation control.'}
        </Text>
      ) : (
        <>
          <View className="mt-4 flex-row gap-2.5">
            <MetricTile label="Pump" icon={Power} iconColor={theme.primary}>
              <View className="gap-0.5">
                <Text variant="value" weight="medium">
                  {data.status.pumpConnected ? 'Connected' : 'Disconnected'}
                </Text>
                <Text variant="caption" tone="slate">
                  {`Last sync ${formatTimeAgo(data.status.lastSyncAt)}`}
                </Text>
              </View>
            </MetricTile>
            <MetricTile label="Active irrigation" icon={Activity} iconColor={theme.text}>
              <View className="gap-0.5">
                <Text variant="value">{`${data.status.activeBeds} beds`}</Text>
                <Text variant="caption" tone="slate">
                  {`ADSS automation ${automationOn ? 'on' : 'off'}`}
                </Text>
              </View>
            </MetricTile>
          </View>

          <View className="mt-3">
            <ReservoirCard reservoir={data.status.reservoir}>
              <View className="my-3.5 h-px bg-border" />
              <View className="flex-row">
                {[
                  { label: 'Water dispensed', value: `${formatNumber(data.status.waterDispensedLiters)} L`, icon: Droplet },
                  { label: 'Nutrients dosed', value: `${formatNumber(data.status.nutrientsDosedMl)} mL`, icon: FlaskConical },
                ].map(({ label, value, icon: Icon }) => (
                  <View key={label} accessible accessibilityLabel={`${label}: ${value}`} className="flex-1 gap-1">
                    <View className="flex-row items-center gap-1">
                      <Icon size={11} color={theme.textTertiary} />
                      <Text variant="overline" tone="tertiary" className="tracking-[0.4px]">
                        {label}
                      </Text>
                    </View>
                    <Text variant="value">{value}</Text>
                  </View>
                ))}
              </View>
            </ReservoirCard>
          </View>

          <Card className="mt-3 flex-row items-center gap-3 px-4 py-3.5">
            <ShieldCheck size={18} color={theme.primary} />
            <View className="flex-1 gap-0.5">
              <Text variant="subhead" weight="medium">
                Automated irrigation
              </Text>
              <Text variant="caption" tone="slate">
                ADSS schedules cycles from live soil moisture
              </Text>
            </View>
            <Switch
              accessibilityLabel="Automated irrigation"
              value={automationOn}
              disabled={savingAutomation}
              onValueChange={toggleAutomation}
              trackColor={{ true: theme.toggle, false: theme.idle }}
              thumbColor={theme.highlight}
              ios_backgroundColor={theme.idle}
            />
          </Card>

          <SectionHeader
            title="Garden bed controls"
            right={
              <Text variant="caption" tone="tertiary">
                Tap to expand
              </Text>
            }
            className="mt-6"
          />
          <View className="mt-3 gap-2.5">
            {data.controls.map((control) => (
              <BedControlRow
                key={control.bed.id}
                control={control}
                expanded={expanded === control.bed.id}
                onToggle={() => setExpanded(expanded === control.bed.id ? null : control.bed.id)}
              />
            ))}
          </View>

          <View className="mt-6 flex-row items-center gap-2 px-3">
            <Clock size={15} color={theme.slate} />
            <Text variant="section" accessibilityRole="header">
              Recent executions
            </Text>
          </View>
          <Card className="mt-3 px-3.5 py-1">
            {data.executions.map((exe, i) => (
              <Fragment key={exe.id}>
                {i > 0 && <View className="h-px bg-border" />}
                <View className="flex-row items-center gap-3 py-3">
                  <IconCircle tone={exe.kind === 'water' ? 'info' : 'nutrient'}>
                    {exe.kind === 'water' ? (
                      <Droplet size={15} color={theme.info} />
                    ) : (
                      <FlaskConical size={15} color={theme.nutrient} />
                    )}
                  </IconCircle>
                  <View className="flex-1 gap-0.5">
                    <Text variant="body" weight="regular">
                      {`${exe.bedCode} · ${exe.amount} ${exe.kind === 'water' ? 'water' : 'nutrients'}`}
                    </Text>
                    <Text variant="caption" tone="slate">
                      {`${formatTimeAgo(exe.at)} · ${exe.source}`}
                    </Text>
                  </View>
                  <Badge label={exe.status} tone={exe.status === 'completed' ? 'primary' : 'idle'} />
                </View>
              </Fragment>
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}
