import { View } from 'react-native';

import { Colors } from '@/constants/theme';

import { Gradient } from './gradient';

type ProgressBarProps = {
  /** 0–1, clamped. */
  value: number;
  label: string;
  /** Light-to-dark green fill (analytics, reservoir) instead of the flat fill. */
  gradient?: boolean;
};

/** Thin rounded bar. */
export function ProgressBar({ value, label, gradient }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      className="h-[7px] overflow-hidden rounded-full bg-border">
      <View
        className={gradient ? 'h-full overflow-hidden rounded-full' : 'h-full rounded-full bg-progress'}
        style={{ width: `${pct}%` }}>
        {gradient && <Gradient from={Colors.barFrom} to={Colors.barTo} direction="horizontal" />}
      </View>
    </View>
  );
}
