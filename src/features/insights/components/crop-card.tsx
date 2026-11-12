import { Clock, Droplets, Thermometer, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import { formatNumber } from '@/lib/utils';
import type { SuggestedCrop } from '@/types/models';

/** Reference crop photo: 360 × 104 pt. */
const CROP_IMAGE_ASPECT = 360 / 104;

/** Suggested crop: photo with name + match %, then duration / water / temperature. */
export function CropCard({ crop }: { crop: SuggestedCrop }) {
  const facts: { label: string; value: string; icon: LucideIcon; color: string }[] = [
    { label: 'Duration', value: `${crop.durationDays} d`, icon: Clock, color: Colors.primary },
    { label: 'Water / day', value: `${formatNumber(crop.waterPerDayLiters, 1)} L`, icon: Droplets, color: Colors.info },
    { label: 'Temp', value: `${crop.minTemp}–${crop.maxTemp}°`, icon: Thermometer, color: Colors.warning },
  ];

  return (
    <Card className="rounded-[20px]">
      <ImagePlaceholder
        aspectRatio={CROP_IMAGE_ASPECT}
        uri={crop.imageUrl}
        tone="dark"
        scrim
        className="rounded-t-[19px]"
        accessibilityLabel={`${crop.name}, ${crop.matchPercent}% match`}>
        <Badge
          label={`${crop.matchPercent}% match`}
          tone="light"
          className="absolute right-3 top-3 px-2.5 py-1"
        />
        <View className="absolute bottom-3 left-3.5 right-3.5">
          <Text variant="section" weight="semibold" tone="onPrimary" className="text-[15px]">
            {crop.name}
          </Text>
          <Text variant="caption" tone="onPrimary" className="opacity-90">
            {crop.scientificName}
          </Text>
        </View>
      </ImagePlaceholder>

      <View className="flex-row px-3.5 py-3">
        {facts.map(({ label, value, icon: Icon, color }) => (
          <View key={label} accessible accessibilityLabel={`${label}: ${value}`} className="flex-1 gap-1">
            <Text variant="overline" tone="tertiary">
              {label}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Icon size={12} color={color} />
              <Text variant="body" weight="regular">
                {value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
