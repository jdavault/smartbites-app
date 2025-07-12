import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function AuthLayout() {
  const { isSignedIn, isLoading } = useAuth();

  // While loading auth state, don't render anything
  if (isLoading) return null;

  // If authenticated, redirect to the main app screen
  if (isSignedIn) return <Redirect href="/tabs/explore" />;

  // Otherwise, show the auth flow
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
