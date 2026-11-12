import { Droplets, FlaskConical, Play, Square } from 'lucide-react-native';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconCircle } from '@/components/ui/icon-circle';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { formatClock, formatNumber } from '@/lib/utils';
import type { IrrigationCommand } from '@/services/irrigation.service';
import type { BedDetail, IrrigationMode } from '@/types/models';

type IrrigationOverridesCardProps = {
  detail: BedDetail;
  mode: IrrigationMode;
  pumpRunning: boolean;
  /** Command currently being sent (shows a spinner on that button). */
  pending: IrrigationCommand | null;
  onCommand: (command: IrrigationCommand) => void;
};

/** Manual overrides: start/stop irrigation, dispense water or nutrients. */
export function IrrigationOverridesCard({ detail, mode, pumpRunning, pending, onCommand }: IrrigationOverridesCardProps) {
  const theme = useTheme();
  const { irrigation } = detail;
  const busy = pending !== null;

  return (
    <Card className="p-4">
      <View className="flex-row items-center gap-2.5">
        <IconCircle tone="info" size="lg">
          <Droplets size={16} color={theme.info} />
        </IconCircle>
        <Text variant="subhead" weight="medium" className="flex-1">
          Overrides
        </Text>
        <Badge label={mode === 'smart' ? 'Smart' : 'Manual'} tone="primary" dot />
        <Badge label={pumpRunning ? 'Running' : 'Idle'} tone={pumpRunning ? 'info' : 'idle'} dot />
      </View>

      <View className="mt-4 flex-row">
        <View className="flex-1 gap-1">
          <Text variant="overline" tone="tertiary">
            ADSS water need
          </Text>
          <Text variant="subhead" weight="semibold">{`${formatNumber(irrigation.adssWaterNeedLiters, 1)} L`}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text variant="overline" tone="tertiary">
            Nutrient dose
          </Text>
          <Text variant="subhead" weight="semibold">{`${formatNumber(irrigation.nutrientDoseMl)} mL`}</Text>
        </View>
      </View>

      <View className="mt-4 gap-2.5">
        <View className="flex-row gap-2.5">
          <Button
            className="flex-1"
            icon={Play}
            title="Start irrigation"
            disabled={busy || pumpRunning}
            loading={pending === 'start-irrigation'}
            onPress={() => onCommand('start-irrigation')}
          />
          <Button
            className="flex-1"
            variant="outline"
            icon={Square}
            title="Stop irrigation"
            disabled={busy || !pumpRunning}
            loading={pending === 'stop-irrigation'}
            onPress={() => onCommand('stop-irrigation')}
          />
        </View>
        <View className="flex-row gap-2.5">
          <Button
            className="flex-1"
            variant="info"
            icon={Droplets}
            title="Dispense water"
            disabled={busy}
            loading={pending === 'dispense-water'}
            onPress={() => onCommand('dispense-water')}
          />
          <Button
            className="flex-1"
            variant="nutrient"
            icon={FlaskConical}
            title="Dispense nutrients"
            disabled={busy}
            loading={pending === 'dispense-nutrients'}
            onPress={() => onCommand('dispense-nutrients')}
          />
        </View>
      </View>

      <Text variant="caption" tone="tertiary" className="mt-3">
        {`Last irrigation ${formatClock(irrigation.lastIrrigationAt)} · every override asks for confirmation.`}
      </Text>
    </Card>
  );
}
