import { ActivityIndicator, View } from 'react-native';

import { DemoBanner } from '@/components/demo-banner';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/features/auth/auth-provider';
import { PlantCard } from '@/features/plants/components/plant-card';
import { usePlants } from '@/features/plants/hooks/use-plants';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const { plants, isLoading, error } = usePlants();
  const theme = useTheme();

  return (
    <Screen withTabBar>
      <View className="mt-6 gap-0.5">
        <Text variant="small" tone="muted">
          Welcome back
        </Text>
        <Text variant="subtitle" accessibilityRole="header">
          {user?.fullName || user?.email}
        </Text>
      </View>

      <DemoBanner />

      <Text variant="smallBold" accessibilityRole="header">
        Your plants
      </Text>

      {isLoading ? (
        <ActivityIndicator color={theme.primary} accessibilityLabel="Loading plants" />
      ) : error ? (
        <Text tone="danger">{error}</Text>
      ) : plants.length === 0 ? (
        <Card>
          <Text variant="small" tone="muted">
            No plants yet.
          </Text>
        </Card>
      ) : (
        plants.map((plant) => <PlantCard key={plant.id} plant={plant} />)
      )}
    </Screen>
  );
}
