import { useState } from 'react';
import { Alert, View } from 'react-native';

import { DemoBanner } from '@/components/demo-banner';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useAuth } from '@/features/auth/auth-provider';

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaving(true);
    const { error } = await updateProfile(fullName.trim());
    setSaving(false);
    if (error) Alert.alert('Could not save', error);
    else Alert.alert('Saved');
  }

  async function handleSignOut() {
    const { error } = await signOut();
    if (error) Alert.alert('Could not sign out', error);
  }

  return (
    <Screen withTabBar>
      <View className="mb-2 mt-6 gap-0.5">
        <Text variant="subtitle" accessibilityRole="header">
          Profile
        </Text>
        <Text variant="small" tone="muted">
          {user?.email}
        </Text>
      </View>

      <DemoBanner />

      <TextField label="Full name" value={fullName} onChangeText={setFullName} />
      <Button title="Save" onPress={saveProfile} loading={saving} />
      <Button title="Sign out" variant="secondary" onPress={handleSignOut} />
    </Screen>
  );
}
