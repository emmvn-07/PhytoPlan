import { Image } from 'expo-image';
import { Leaf } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { Gradient } from './gradient';

type ImagePlaceholderProps = {
  /** width / height of the reference image, so the frame keeps its proportions at any width. */
  aspectRatio: number;
  /** Remote photo. Without it a neutral placeholder is drawn. */
  uri?: string;
  /** "light" (cards) or "dark" (behind white overlay text: hero, crops, camera). */
  tone?: 'light' | 'dark';
  /** Darken the bottom so overlaid white text stays readable. */
  scrim?: boolean;
  /** Dim the frame (offline beds). */
  dimmed?: boolean;
  /** Overlays positioned inside the frame. */
  children?: ReactNode;
  /** Corner rounding / clipping, e.g. "rounded-t-[19px]". */
  className?: string;
  accessibilityLabel?: string;
};

export function ImagePlaceholder({
  aspectRatio,
  uri,
  tone = 'light',
  scrim,
  dimmed,
  children,
  className,
  accessibilityLabel,
}: ImagePlaceholderProps) {
  const theme = useTheme();
  const dark = tone === 'dark';
  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      className={cn(
        'w-full items-center justify-center overflow-hidden',
        dark ? 'bg-primary-muted' : 'bg-surface-muted',
        className
      )}
      style={{ aspectRatio, opacity: dimmed ? 0.55 : 1 }}>
      {uri ? (
        <Image source={{ uri }} contentFit="cover" style={{ position: 'absolute', inset: 0 }} />
      ) : (
        <Leaf size={22} color={dark ? 'rgba(255,255,255,0.35)' : theme.iconMuted} />
      )}
      {scrim && <Gradient from="#000000" to="#000000" direction="vertical" fromOpacity={0} toOpacity={0.55} />}
      {children}
    </View>
  );
}
