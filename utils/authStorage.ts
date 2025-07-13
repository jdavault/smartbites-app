import * as SecureStore from 'expo-secure-store';

export async function saveLoggedInFlag() {
  await SecureStore.setItemAsync('isLoggedIn', 'true');
}

export async function removeLoggedInFlag() {
  await SecureStore.deleteItemAsync('isLoggedIn');
}

export async function isLoggedIn(): Promise<boolean> {
  const flag = await SecureStore.getItemAsync('isLoggedIn');
  return flag === 'true';
}
