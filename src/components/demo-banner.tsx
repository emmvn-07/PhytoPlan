import { Info } from 'lucide-react-native';
import { View } from 'react-native';

import { isDemoMode } from '@/constants/config';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './ui/text';

/** Shown only when Supabase keys are missing. */
export function DemoBanner() {
  const theme = useTheme();
  if (!isDemoMode) return null;

  return (
    <View
      accessibilityRole="alert"
      className="flex-row items-start gap-2 rounded-2xl bg-background-selected p-4">
      <Info size={18} color={theme.text} />
      <Text variant="small" className="flex-1">
        Demo mode: Supabase is not configured, so any email and password will work and nothing is
        saved.
      </Text>
    </View>
  );
}
