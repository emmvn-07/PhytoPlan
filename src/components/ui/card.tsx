import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export function Card({ className, ...rest }: ViewProps) {
  return <View className={cn('gap-2 rounded-3xl bg-background-element p-6', className)} {...rest} />;
}
