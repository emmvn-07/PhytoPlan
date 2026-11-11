import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { Text } from './text';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
};

export function Button({
  title,
  variant = 'primary',
  loading,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  const isDisabled = !!disabled || !!loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      disabled={isDisabled}
      className={cn(
        'min-h-12 items-center justify-center rounded-2xl px-6 active:opacity-60',
        isPrimary ? 'bg-primary' : 'bg-background-element',
        isDisabled && 'opacity-60',
        className
      )}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? theme.onPrimary : theme.text} />
      ) : (
        <Text variant="smallBold" tone={isPrimary ? 'onPrimary' : 'default'}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
