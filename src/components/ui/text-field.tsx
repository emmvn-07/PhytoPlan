import { TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { Text } from './text';

type TextFieldProps = TextInputProps & { label: string };

export function TextField({ label, className, ...rest }: TextFieldProps) {
  const theme = useTheme();

  return (
    <View className="gap-1">
      <Text variant="small" tone="muted">
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        className={cn(
          'min-h-12 rounded-2xl border border-border bg-background-element px-4 text-base text-text',
          className
        )}
        {...rest}
      />
    </View>
  );
}
