import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function RootRedirect() {
  const { authChecked, user } = useAuth();

  if (!authChecked) return null;

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
