import { Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { Shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { Text } from './text';

type Option<T extends string> = { label: string; value: T };

type SelectProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  accessibilityLabel: string;
  className?: string;
};

/** Dropdown box ("All crops ⌄") that opens a simple option sheet. */
export function Select<T extends string>({
  value,
  options,
  onChange,
  accessibilityLabel,
  className,
}: SelectProps<T>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? '';

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel}: ${current}`}
        accessibilityHint="Opens a list of options"
        onPress={() => setOpen(true)}
        className={cn(
          'h-10 flex-row items-center justify-between rounded-xl border border-input-border bg-surface px-3 active:opacity-70',
          className
        )}>
        <Text variant="subhead" numberOfLines={1} className="flex-1">
          {current}
        </Text>
        <ChevronDown size={15} color={theme.slate} />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          accessibilityLabel="Close"
          onPress={() => setOpen(false)}
          className="flex-1 justify-center bg-black/30 px-8">
          <View
            accessibilityRole="menu"
            className="rounded-3xl border border-highlight bg-surface py-2"
            style={{ boxShadow: Shadows.card }}>
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex-row items-center justify-between px-5 py-3 active:bg-surface-muted">
                  <Text variant="subhead" weight={selected ? 'semibold' : 'regular'}>
                    {option.label}
                  </Text>
                  {selected && <Check size={16} color={theme.primary} />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
