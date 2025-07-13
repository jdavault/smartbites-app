import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function AuthLayout() {
  const { user, authChecked, isLoading } = useAuth();

  const isSignedIn = !!user;

  // While loading, don't render anything
  if (isLoading || !authChecked) return null;

  // If authenticated, redirect to main app
  if (isSignedIn) return <Redirect href="/(tabs)" />;

  // Otherwise, show auth flow
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="login" options={{ title: 'Sign In' }} />
      <Stack.Screen name="register" options={{ title: 'Sign Up' }} />
    </Stack>
  );
}
