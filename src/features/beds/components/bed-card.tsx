import { router } from 'expo-router';
import { Droplets, Thermometer, Wifi, WifiOff } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { StatusDot } from '@/components/ui/status-dot';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { formatNumber } from '@/lib/utils';
import type { BedStatus, GardenBed } from '@/types/models';

/** Reference photo frame: 138 × 72 pt (Farm overview) ≈ 173 × 88 pt (Garden beds). */
export const BED_IMAGE_ASPECT = 138 / 72;

export const bedStatusDisplay: Record<BedStatus, { label: string; tone: 'primary' | 'danger' | 'offline' }> = {
  healthy: { label: 'Healthy', tone: 'primary' },
  attention: { label: 'Needs attention', tone: 'danger' },
  offline: { label: 'Offline', tone: 'offline' },
};

export function openBed(bed: GardenBed) {
  router.push({ pathname: '/butterhead-lettuce', params: { id: bed.id } });
}

type BedCardProps = {
  bed: GardenBed;
  /** compact: Farm overview carousel. grid: Garden beds (connection badge + readings). */
  variant?: 'compact' | 'grid';
  /** Fixed width for carousels; grid cards stretch. */
  width?: number;
};

export function BedCard({ bed, variant = 'compact', width }: BedCardProps) {
  const theme = useTheme();
  const status = bedStatusDisplay[bed.status];
  const offline = bed.status === 'offline';
  const grid = variant === 'grid';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${bed.code}, ${bed.cropName}, ${status.label}`}
      accessibilityHint="Opens bed details"
      onPress={() => openBed(bed)}
      className={grid ? 'flex-1 active:opacity-80' : 'active:opacity-80'}
      style={width ? { width } : undefined}>
      <Card className="rounded-[20px]">
        <ImagePlaceholder
          aspectRatio={BED_IMAGE_ASPECT}
          uri={bed.imageUrl}
          dimmed={offline}
          className="rounded-t-[19px]">
          <Badge label={bed.code} tone="light" className="absolute left-2 top-2 h-[18px] justify-center px-1.5" />
          {grid && (
            <View className="absolute right-2 top-2 h-5 w-5 items-center justify-center rounded-full bg-highlight">
              {offline ? <WifiOff size={11} color={theme.offline} /> : <Wifi size={11} color={theme.primary} />}
            </View>
          )}
        </ImagePlaceholder>

        <View className={grid ? 'px-2.5 pb-3 pt-3' : 'gap-1 px-3 pb-3.5 pt-3'}>
          <Text variant={grid ? 'subhead' : 'body'} weight="medium" numberOfLines={1}>
            {bed.cropName}
          </Text>
          <StatusDot label={status.label} tone={status.tone} className={grid ? 'mt-1' : undefined} />

          {grid && (
            <>
              <View className="my-2.5 h-px bg-border" />
              <View className="flex-row gap-4">
                <View className="flex-row items-center gap-1">
                  <Droplets size={13} color={theme.primary} />
                  <Text variant="caption" tone="slate">
                    {bed.soilMoisture === null ? '—' : `${formatNumber(bed.soilMoisture)}%`}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Thermometer size={13} color={theme.warning} />
                  <Text variant="caption" tone="slate">
                    {bed.temperature === null ? '—' : `${formatNumber(bed.temperature, 1)}°`}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </Card>
    </Pressable>
  );
}
