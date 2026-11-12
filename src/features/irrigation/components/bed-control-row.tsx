import { ChevronDown, Wifi, WifiOff } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { openBed } from '@/features/beds/components/bed-card';
import { useTheme } from '@/hooks/use-theme';
import { formatNumber } from '@/lib/utils';
import type { BedControl } from '@/types/models';

type BedControlRowProps = {
  control: BedControl;
  expanded: boolean;
  onToggle: () => void;
};

/** "01 Butterhead Lettuce · Smart · Pump idle · 62% VWC … 1.1 L ADSS NEED ⌄" — tap to expand. */
export function BedControlRow({ control, expanded, onToggle }: BedControlRowProps) {
  const theme = useTheme();
  const { bed } = control;
  const offline = bed.status === 'offline';
  const mode = control.mode === 'smart' ? 'Smart' : 'Manual';
  const pump = offline ? 'Device offline' : control.pumpRunning ? 'Pump running' : 'Pump idle';
  const subtitle = `${mode} · ${pump} · ${formatNumber(bed.soilMoisture ?? 0)}% VWC`;

  return (
    <Animated.View layout={LinearTransition.duration(200)}>
      <Card className="rounded-[20px]">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${bed.cropName}, ${subtitle}, ADSS need ${formatNumber(control.adssNeedLiters, 1, true)} litres`}
          accessibilityState={{ expanded }}
          onPress={onToggle}
          className="flex-row items-center gap-3 px-3 py-3 active:opacity-70">
          <View className="h-[34px] w-[34px] items-center justify-center rounded-xl bg-surface-muted">
            <Text variant="body">{bed.code.slice(2)}</Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text variant="subhead" weight="medium" numberOfLines={1}>
              {bed.cropName}
            </Text>
            <View className="flex-row items-center gap-1">
              {offline ? <WifiOff size={11} color={theme.offline} /> : <Wifi size={11} color={theme.slate} />}
              <Text variant="caption" tone="slate" numberOfLines={1} className="flex-1">
                {subtitle}
              </Text>
            </View>
          </View>
          <View className="items-end gap-0.5">
            <Text variant="subhead" weight="medium">{`${formatNumber(control.adssNeedLiters, 1, true)} L`}</Text>
            <Text variant="overline" tone="tertiary">
              ADSS need
            </Text>
          </View>
          <View style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
            <ChevronDown size={15} color={theme.iconMuted} />
          </View>
        </Pressable>

        {expanded && (
          <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
           <View className="px-3 pb-3">
            <View className="mb-3 h-px bg-border" />
            <View className="flex-row">
              {[
                { label: 'Soil moisture', value: bed.soilMoisture === null ? '—' : `${formatNumber(bed.soilMoisture)}%` },
                { label: 'Soil temp', value: bed.temperature === null ? '—' : `${formatNumber(bed.temperature, 1)}°C` },
                { label: 'Mode', value: mode },
              ].map((item) => (
                <View key={item.label} className="flex-1 gap-1">
                  <Text variant="overline" tone="tertiary">
                    {item.label}
                  </Text>
                  <Text variant="body" weight="medium">
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
            <Button className="mt-3" variant="soft" title="Open bed controls" onPress={() => openBed(bed)} />
           </View>
          </Animated.View>
        )}
      </Card>
    </Animated.View>
  );
}
