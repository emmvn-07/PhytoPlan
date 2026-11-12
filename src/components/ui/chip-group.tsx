import { Pressable, ScrollView, View } from 'react-native';

import { cn } from '@/lib/utils';

import { Text } from './text';

type Option<T extends string> = { label: string; value: T };

type ChipGroupProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** outline: bordered chips (filters); muted: filled grey chips (chart metrics). */
  variant?: 'outline' | 'muted';
  /** Stretch chips to share the row equally ("15m 30m 60m 120m"). */
  fill?: boolean;
  /** Scroll horizontally when chips overflow. */
  scroll?: boolean;
  accessibilityLabel: string;
  className?: string;
};

/** Single-select pill chips. Selected = filled primary. */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  variant = 'outline',
  fill,
  scroll,
  accessibilityLabel,
  className,
}: ChipGroupProps<T>) {
  const chips = options.map((option) => {
    const selected = option.value === value;
    return (
      <Pressable
        key={option.value}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={option.label}
        onPress={() => onChange(option.value)}
        className={cn(
          'h-7 items-center justify-center rounded-full px-3.5 active:opacity-70',
          fill && 'flex-1',
          selected
            ? 'bg-primary'
            : variant === 'outline'
              ? 'border border-input-border bg-surface'
              : 'bg-surface-muted'
        )}>
        <Text variant="body" weight={selected ? 'medium' : 'regular'} tone={selected ? 'onPrimary' : 'slate'}>
          {option.label}
        </Text>
      </Pressable>
    );
  });

  if (scroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="radiogroup"
        accessibilityLabel={accessibilityLabel}
        className={className}
        contentContainerClassName="gap-2">
        {chips}
      </ScrollView>
    );
  }
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      className={cn(fill ? 'flex-row gap-2' : 'flex-row flex-wrap gap-2', className)}>
      {chips}
    </View>
  );
}
