import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts, FontSizes } from '@/constants/Typography';

// Import Lucide icons
import {
  Home,
  Search,
  PlusCircle,
  Heart,
  User,
  BookOpen,
  Bookmark,
  ChefHat,
  UtensilsCrossed,
  CookingPot,
  Settings,
  Settings2,
} from 'lucide-react-native';
import OnlyAuth from '@/components/OnlyAuth';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { authChecked, isLoading } = useAuth();
  const { colors: theme } = useTheme();
  useEffect(() => {
    if (!isLoading && !authChecked) {
      // Redirect to auth screen if not signed in
      router.replace('/(auth)');
    }
  }, [authChecked, isLoading]);

  // Don't render tabs until we've checked auth state
  if (isLoading || !authChecked) {
    return null;
  }

  return (
    <OnlyAuth>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: Colors.dark[500],
          tabBarLabelStyle: {
            fontFamily: Fonts.body,
            fontSize: FontSizes.xs,
            marginBottom: Platform.select({
              ios: 0,
              android: 4,
              default: 4,
            }),
          },
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopColor: Colors.dark[200],
            paddingTop: 5,
            height: Platform.select({
              ios: 88,
              android: 60,
              default: 60,
            }),
            paddingBottom: Platform.select({
              ios: 28,
              android: 8,
              default: 8,
            }),
          },
          headerShown: false,
        }}
      >
        {/* <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home strokeWidth={2} color={color} size={size} />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Search strokeWidth={2} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Saved',
            tabBarIcon: ({ color, size }) => (
              <Bookmark strokeWidth={2} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Settings strokeWidth={2} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="recipe/[id]"
          options={{ href: null }} // Prevents duplicate profile tab
        />
        <Tabs.Screen
          name="addRecipes"
          options={{ href: null }} // Prevents duplicate profile tab
        />
      </Tabs>
    </OnlyAuth>
  );
}
