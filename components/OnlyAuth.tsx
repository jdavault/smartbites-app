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

  console.log('OnlyAuth:', { authChecked, user });
  useEffect(() => {
    if (!authChecked) {
      console.log('Auth not checked yet, skipping user check');
      return;
    }

    const isInAuthFlow = pathname.startsWith('/(auth)');

    if (authChecked && !user && !isInAuthFlow) {
      if (!pathname || pathname === '/' || pathname === '/index') {
        router.replace(`/`);
      } else {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [user, authChecked, router]);

  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedLoader />
      </View>
    );
  }

  if (authChecked && !user) {
    return null; // router is replacing
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default OnlyAuth;
