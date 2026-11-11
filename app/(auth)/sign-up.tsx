import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { config, isDemoMode } from '@/constants/config';
import { useAuth } from '@/features/auth/auth-provider';
import { AuthLayout } from '@/features/auth/components/auth-layout';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);
    const { error, needsConfirmation } = await signUp(email.trim(), password, fullName.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Sign up failed', error);
      return;
    }
    // With email confirmation enabled in Supabase, no session is returned yet.
    if (needsConfirmation) {
      Alert.alert('Check your email', 'Confirm your email address, then sign in.');
      router.replace('/sign-in');
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle={`Start planning with ${config.appName}`}
      footerText="Already have an account? Sign in"
      footerHref="/sign-in">
      <TextField label="Full name" value={fullName} onChangeText={setFullName} autoComplete="name" />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        placeholder="At least 6 characters"
      />
      <Button
        title="Sign up"
        onPress={handleSignUp}
        loading={loading}
        disabled={!isDemoMode && (!email || password.length < 6)}
      />
    </AuthLayout>
  );
}
