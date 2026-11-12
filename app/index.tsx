import { Redirect } from 'expo-router';

/** "/" has no screen of its own — the app opens on the Farm overview tab. */
export default function Index() {
  return <Redirect href="/farm-overview" />;
}
