import type { ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { Text } from './text';

type TextFieldProps = TextInputProps & {
  /** Uppercase label above the box ("IRRIGATE BELOW"). */
  label?: string;
  /** Small text under the box ("Trigger threshold"). */
  helper?: string;
  /** Icon inside the box, before the text (search). */
  leading?: ReactNode;
  /** Unit or icon inside the box, after the text ("%", clock). */
  trailing?: ReactNode;
  containerClassName?: string;
};

/** Bordered input box from design-references (search, schedule fields). */
export function TextField({
  label,
  helper,
  leading,
  trailing,
  containerClassName,
  className,
  accessibilityLabel,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  return (
    <View className={cn('gap-1', containerClassName)}>
      {label ? (
        <Text variant="overline" tone="tertiary">
          {label}
        </Text>
      ) : null}
      <View className="h-10 flex-row items-center gap-2 rounded-xl border border-input-border bg-surface px-3">
        {leading}
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          placeholderTextColor={theme.offline}
          className={cn('h-full flex-1 font-inter text-[13px] text-text', className)}
          {...rest}
        />
        {trailing}
      </View>
      {helper ? (
        <Text variant="micro" tone="tertiary" className="text-[10px]">
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
