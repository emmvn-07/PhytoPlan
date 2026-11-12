import { View, type ViewProps } from 'react-native';

import { Shadows } from '@/constants/theme';
import { cn } from '@/lib/utils';

/**
 * Surface with the design's 1px light edge and soft shadow. No default padding or radius
 * override conflicts: pass layout (padding, radius) via className.
 * Don't add `overflow-hidden` here — it clips the shadow on iOS; clip an inner View instead.
 */
export function Card({ className, style, ...rest }: ViewProps) {
  return (
    <View
      className={cn('rounded-3xl border border-highlight bg-surface', className)}
      style={[{ boxShadow: Shadows.card }, style]}
      {...rest}
    />
  );
}
