import React, { useEffect, ReactNode } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import ThemedLoader from '@/components/ThemedLoader';

interface OnlyGuestProps {
  children: ReactNode;
}

const OnlyGuest: React.FC<OnlyGuestProps> = ({ children }) => {
  const { user, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user !== null) {
      router.replace('/recipes');
    }
  }, [user, authChecked, router]);

  if (!authChecked || user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedLoader />
      </View>
    );
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default OnlyGuest;
