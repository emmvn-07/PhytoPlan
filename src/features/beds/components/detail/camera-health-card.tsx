import { Camera, CircleCheck, TriangleAlert } from 'lucide-react-native';
import { Fragment } from 'react';
import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { formatClock, formatTimeAgo } from '@/lib/utils';
import type { BedDetail } from '@/types/models';

/** Reference camera frame: 360 × 190 pt. */
const CAMERA_ASPECT = 360 / 190;

function cameraTimestamp(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

type CameraHealthCardProps = {
  detail: BedDetail;
  scanning: boolean;
  onRunScan: () => void;
};

/** Live camera tile + computer-vision detection result. */
export function CameraHealthCard({ detail, scanning, onRunScan }: CameraHealthCardProps) {
  const theme = useTheme();
  const { detection, camera, bed } = detail;
  const rows = [
    { label: 'Visible symptoms', value: detection.symptoms },
    { label: 'Captured', value: `${formatClock(detection.capturedAt)} · ${formatTimeAgo(detection.capturedAt)}` },
  ];

  return (
    <>
      <Card className="rounded-[20px]">
        <ImagePlaceholder
          aspectRatio={CAMERA_ASPECT}
          uri={bed.imageUrl}
          tone="dark"
          className="rounded-[19px]"
          accessibilityLabel={`Live camera ${camera.id} for ${bed.code}`}>
          <View className="absolute left-3 right-3 top-3 flex-row justify-between">
            <View className="flex-row items-center gap-1.5 rounded-md bg-black/40 px-1.5 py-0.5">
              <View className="h-1.5 w-1.5 rounded-full bg-danger" />
              <Text variant="micro" tone="onPrimary" weight="medium">
                {`REC  ${camera.id}`}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5 rounded-md bg-black/40 px-1.5 py-0.5">
              <View className="h-1.5 w-1.5 rounded-full bg-progress" />
              <Text variant="micro" tone="onPrimary" weight="medium">
                LIVE · 1080P
              </Text>
            </View>
          </View>
          <View className="absolute bottom-3 left-3 right-3 flex-row justify-between">
            <Text variant="micro" tone="onPrimary">
              {cameraTimestamp(camera.capturedAt)}
            </Text>
            <Text variant="micro" tone="onPrimary">
              {bed.code}
            </Text>
          </View>
        </ImagePlaceholder>
      </Card>

      <Card className="mt-3 p-4">
        <View className="flex-row items-center gap-2">
          {detection.healthy ? (
            <CircleCheck size={16} color={theme.primary} />
          ) : (
            <TriangleAlert size={16} color={theme.attention} />
          )}
          <Text variant="subhead" weight="medium" className="flex-1">
            Detection result
          </Text>
          <Badge label={detection.healthy ? 'Healthy' : 'Stressed'} tone={detection.healthy ? 'primary' : 'idle'} />
        </View>

        <View className="mt-3 flex-row justify-between">
          <Text variant="caption" tone="slate">
            Confidence score
          </Text>
          <Text variant="caption" weight="medium">{`${detection.confidence}%`}</Text>
        </View>
        <View className="mt-1.5">
          <ProgressBar value={detection.confidence / 100} label="Confidence score" gradient />
        </View>

        {rows.map((row) => (
          <Fragment key={row.label}>
            <View className="my-3 h-px bg-border" />
            <View className="flex-row justify-between gap-3">
              <Text variant="caption" tone="slate">
                {row.label}
              </Text>
              <Text variant="caption" className="flex-1 text-right">
                {row.value}
              </Text>
            </View>
          </Fragment>
        ))}

        <View className="mt-3.5 flex-row gap-2">
          {[0, 1].map((i) => (
            <View key={i} className="w-[38px]">
              <ImagePlaceholder aspectRatio={1} uri={bed.imageUrl} className="rounded-lg" />
            </View>
          ))}
        </View>

        <Button
          className="mt-3.5"
          variant="soft"
          icon={Camera}
          title={scanning ? 'Scanning…' : 'Run surface scan'}
          loading={scanning}
          onPress={onRunScan}
        />
      </Card>
    </>
  );
}
