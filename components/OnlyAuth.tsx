import React, { useEffect, ReactNode } from 'react';
import { View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import ThemedLoader from '@/components/ThemedLoader';

interface OnlyAuthProps {
  children: ReactNode;
}

const OnlyAuth: React.FC<OnlyAuthProps> = ({ children }) => {
  const { user, authChecked } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace(`/login?redirect?to=${encodeURIComponent(pathname)}`);
    }
  }, [user, authChecked, router]);

  if (!authChecked || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedLoader />
      </View>
    );
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default OnlyAuth;
