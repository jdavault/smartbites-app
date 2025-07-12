import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useRouter } from 'expo-router';

import { User } from '@/types/user';
import {
  fetchCurrentUser,
  login as loginService,
  logout as logoutService,
  registerFullUser,
} from '@/services/userService';
import { Allergen } from '@/types/allergen';
const router = useRouter();

type AuthContextType = {
  user: User | null;
  authChecked: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    allergens: Allergen[]
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  const refreshUser = async () => {
    const currUser = await fetchCurrentUser();
    setUser(currUser);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const currentUser = await loginService(email, password);
      setUser(currentUser);
    } catch (error: any) {
      console.error('Error logging in:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    allergens: Allergen[] = []
  ) => {
    try {
      setIsLoading(true);
      const newUser = await registerFullUser(email, password, name, allergens);
      await login(email, password);
      setUser(newUser);
    } catch (error: any) {
      console.error('DEBUG: AuthContext:register()', {
        error,
      });
      throw new Error(error.message ?? 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('DEBUG: AuthContext:logout()');
      await logoutService();
      setUser(null);
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  };

  // const updateUserProfile = async (userData: Partial<User>) => {
  //   if (!user) return;

  //   const updatedUser = { ...user, ...userData };
  //   setUser(updatedUser);
  // };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      authChecked,
      isLoading,
      refreshUser,
      login,
      logout,
      register,
    }),
    [user, authChecked]
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) {
          const mappedUser: User = {
            $id: user.$id,
            email: user.email,
            name: user.name,
            firstName: user.name?.split(' ')[0],
            lastName: user.name?.split(' ').slice(1).join(' '),
          };
          setUser(mappedUser);
        }
        setIsLoading(false);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false); // ✅ ALWAYS set it
        setAuthChecked(true);
      }
    };

    loadUser();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
