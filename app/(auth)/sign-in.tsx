import { useState } from 'react';
import { Alert } from 'react-native';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { config, isDemoMode } from '@/constants/config';
import { useAuth } from '@/features/auth/auth-provider';
import { AuthLayout } from '@/features/auth/components/auth-layout';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) Alert.alert('Sign in failed', error);
    // On success the router guard in app/_layout.tsx switches to (tabs).
  }

  return (
    <AuthLayout
      title={config.appName}
      subtitle="Sign in to continue"
      footerText="No account yet? Create one"
      footerHref="/sign-up">
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
      />
      <Button
        title="Sign in"
        onPress={handleSignIn}
        loading={loading}
        disabled={!isDemoMode && (!email || !password)}
      />
    </AuthLayout>
  );
}
