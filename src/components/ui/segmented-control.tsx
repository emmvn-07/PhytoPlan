import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { Text } from './text';

type Option<T extends string> = { label: string; value: T; icon?: LucideIcon };

type SegmentedControlProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** md: "Crops | Analytics"; sm: "7D | 14D | 30D". */
  size?: 'md' | 'sm';
  className?: string;
};

/** Track with a raised white segment for the selected option. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        'flex-row rounded-[18px] bg-surface-muted p-1',
        size === 'md' ? 'h-[38px]' : 'h-8',
        className
      )}>
      {options.map(({ label, value: optionValue, icon: Icon }) => {
        const selected = optionValue === value;
        return (
          <Pressable
            key={optionValue}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={label}
            onPress={() => onChange(optionValue)}
            className={cn(
              'flex-1 flex-row items-center justify-center gap-1.5 rounded-[14px]',
              selected && 'bg-highlight'
            )}
            style={selected ? { boxShadow: Shadows.segment } : undefined}>
            {Icon ? <Icon size={13} color={selected ? theme.text : theme.slate} /> : null}
            <Text
              variant={size === 'md' ? 'subhead' : 'body'}
              weight={selected ? 'medium' : 'regular'}
              tone={selected ? 'default' : 'slate'}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
