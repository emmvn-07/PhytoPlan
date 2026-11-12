import { Droplet, FlaskConical, ScanLine, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { IconCircle, type IconCircleTone } from '@/components/ui/icon-circle';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import type { CalendarRecord, RecordKind } from '@/types/models';

const KIND: Record<RecordKind, { label: string; icon: LucideIcon; tone: IconCircleTone & BadgeTone; color: string }> = {
  irrigation: { label: 'Irrigation', icon: Droplet, tone: 'info', color: Colors.info },
  nutrients: { label: 'Nutrients', icon: FlaskConical, tone: 'nutrient', color: Colors.nutrient },
  scan: { label: 'Scan', icon: ScanLine, tone: 'primary', color: Colors.primary },
};

/** Vertical timeline of a day's records: icon rail on the left, cards on the right. */
export function RecordTimeline({ records }: { records: CalendarRecord[] }) {
  if (records.length === 0) {
    return (
      <Text variant="caption" tone="slate" className="px-3">
        No records on this day.
      </Text>
    );
  }
  return (
    <View>
      {records.map((record, i) => {
        const kind = KIND[record.kind];
        const Icon = kind.icon;
        const last = i === records.length - 1;
        return (
          <View key={record.id} className="flex-row gap-3">
            <View className="items-center">
              <IconCircle tone={kind.tone} size="lg">
                <Icon size={16} color={kind.color} />
              </IconCircle>
              {!last && <View className="w-px flex-1 bg-border" />}
            </View>
            <Card className={last ? 'flex-1 rounded-[20px] p-3' : 'mb-3 flex-1 rounded-[20px] p-3'}>
              <View className="flex-row items-start gap-2">
                <Text variant="body" tone="ink" className="flex-1">
                  {record.title}
                </Text>
                <Text variant="caption" tone="offline">
                  {record.time}
                </Text>
              </View>
              <Text variant="caption" tone="slate" className="mt-1">
                {record.description}
              </Text>
              <View className="mt-2 flex-row items-center gap-1.5">
                <Badge label={kind.label} tone={kind.tone} />
                <Text variant="caption" tone="offline">
                  {`· ${record.bedCode}`}
                </Text>
              </View>
            </Card>
          </View>
        );
      })}
    </View>
  );
}
