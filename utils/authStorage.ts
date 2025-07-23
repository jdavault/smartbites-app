import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export async function saveLoggedInFlag() {
  if (Platform.OS === 'web') {
    localStorage.setItem('isLoggedIn', 'true');
  } else {
    await SecureStore.setItemAsync('isLoggedIn', 'true');
  }
}

export async function removeLoggedInFlag() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('isLoggedIn');
  } else {
    await SecureStore.deleteItemAsync('isLoggedIn');
  }
}

export async function isLoggedIn(): Promise<boolean> {
  let flag: string | null;
  if (Platform.OS === 'web') {
    flag = localStorage.getItem('isLoggedIn');
  } else {
    flag = await SecureStore.getItemAsync('isLoggedIn');
  }
  return flag === 'true';
}
