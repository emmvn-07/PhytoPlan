import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { Card } from './card';
import { IconCircle, type IconCircleTone } from './icon-circle';
import { Text } from './text';
import { ValueUnit } from './value-unit';

type MetricTileProps = {
  label: string;
  /** Number shown with a unit; or pass `children` for custom content. */
  value?: string;
  unit?: string;
  icon: LucideIcon;
  /** Tinted rounded-square icon (bed detail) instead of the plain muted icon (overview). */
  iconTone?: IconCircleTone;
  /** Plain icon color when no `iconTone` (defaults to muted). */
  iconColor?: string;
  /** Smaller value text (bed detail metrics). */
  compact?: boolean;
  children?: ReactNode;
};

/** "AIR TEMP / 30.4 °C" tile with an icon top-right. Lay out two per row. */
export function MetricTile({ label, value, unit, icon: Icon, iconTone, iconColor, compact, children }: MetricTileProps) {
  const theme = useTheme();
  const toneColor = {
    neutral: theme.primary,
    primary: theme.primary,
    danger: theme.danger,
    info: theme.info,
    nutrient: theme.nutrient,
    warning: theme.warning,
  };
  return (
    <Card className="flex-1 gap-2 rounded-[20px] p-3.5">
      <View className="flex-row items-start justify-between">
        <Text variant="overline" tone="tertiary" className="flex-1">
          {label}
        </Text>
        {iconTone ? (
          <IconCircle tone={iconTone} size="sm" square>
            <Icon size={13} color={toneColor[iconTone]} />
          </IconCircle>
        ) : (
          <Icon size={15} color={iconColor ?? theme.iconMuted} />
        )}
      </View>
      {children ?? <ValueUnit value={value ?? '—'} unit={unit} variant={compact ? 'stat' : 'metric'} />}
    </Card>
  );
}
