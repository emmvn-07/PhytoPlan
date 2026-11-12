import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';

import { Colors } from '@/constants/theme';
import { cn } from '@/lib/utils';

import { Text, type TextTone } from './text';

/** Button styles from design-references (detail, calendar, insights screens). */
const variants = {
  primary: { box: 'bg-primary', tone: 'onPrimary', icon: Colors.onPrimary },
  /** Calendar "Suggested plants" CTA */
  muted: { box: 'bg-primary-muted border border-primary', tone: 'onPrimary', icon: Colors.onPrimary },
  outline: { box: 'bg-surface border border-primary-border', tone: 'default', icon: Colors.text },
  soft: { box: 'bg-primary-soft border border-primary-border', tone: 'primary', icon: Colors.primary },
  info: { box: 'bg-info-soft border border-info-border', tone: 'info', icon: Colors.info },
  nutrient: { box: 'bg-nutrient-soft border border-nutrient-border', tone: 'nutrient', icon: Colors.nutrient },
  danger: { box: 'bg-danger-soft border border-danger-border', tone: 'danger', icon: Colors.danger },
} satisfies Record<string, { box: string; tone: TextTone; icon: string }>;

const sizes = {
  sm: { box: 'h-8 rounded-xl px-3', text: 'subhead' as const, icon: 14 },
  md: { box: 'h-10 rounded-xl px-3', text: 'subhead' as const, icon: 15 },
  lg: { box: 'h-11 rounded-2xl px-4', text: 'section' as const, icon: 17 },
};

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  icon?: LucideIcon;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
};

export function Button({
  title,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const v = variants[variant];
  const s = sizes[size];
  const isDisabled = !!disabled || !!loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center gap-2 active:opacity-70',
        s.box,
        v.box,
        isDisabled && 'opacity-60',
        className
      )}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={v.icon} />
      ) : (
        <>
          {Icon ? (
            <View>
              <Icon size={s.icon} color={v.icon} />
            </View>
          ) : null}
          <Text variant={s.text} weight={size === 'lg' ? 'semibold' : 'medium'} tone={v.tone}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
