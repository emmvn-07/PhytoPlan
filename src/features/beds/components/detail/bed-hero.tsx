import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Text } from '@/components/ui/text';
import { formatMediumDate } from '@/lib/utils';
import type { BedDetail } from '@/types/models';

import { bedStatusDisplay } from '../bed-card';

/** Reference hero photo: 360 × 164 pt. */
const HERO_ASPECT = 360 / 164;

export function BedHero({ detail }: { detail: BedDetail }) {
  const { bed } = detail;
  const status = bedStatusDisplay[bed.status];
  return (
    <>
      <Card className="rounded-[20px]">
        <ImagePlaceholder
          aspectRatio={HERO_ASPECT}
          uri={bed.imageUrl}
          tone="dark"
          scrim
          className="rounded-[19px]"
          accessibilityLabel={`${bed.cropName} photo`}>
          <View className="absolute bottom-3.5 left-3.5 right-3.5">
            <View className="flex-row gap-1.5">
              <Badge label={bed.code} tone="glass" />
              <Badge label={detail.connected ? 'Connected' : 'Offline'} tone="glass" dot />
            </View>
            <Text variant="value" weight="semibold" tone="onPrimary" className="mt-2 text-[18px] leading-[22px]">
              {bed.cropName}
            </Text>
            <Text variant="caption" tone="onPrimary" className="italic opacity-90">
              {detail.scientificName}
            </Text>
          </View>
        </ImagePlaceholder>
      </Card>

      <Card className="mt-3 flex-row items-center justify-between rounded-2xl px-3.5 py-2.5">
        <Text variant="caption" tone="slate">
          {`Planted ${formatMediumDate(detail.plantedAt)}`}
        </Text>
        <Badge label={status.label} tone={bed.status === 'healthy' ? 'primary' : 'idle'} />
      </Card>
    </>
  );
}
