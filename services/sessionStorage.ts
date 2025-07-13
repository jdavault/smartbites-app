import * as SecureStore from 'expo-secure-store';

export async function saveSessionJWT(jwt: string) {
  await SecureStore.setItemAsync('APPWRITE_SESSION_JWT', jwt);
}

export async function getSessionJWT() {
  return await SecureStore.getItemAsync('APPWRITE_SESSION_JWT');
}

export async function deleteSessionJWT() {
  await SecureStore.deleteItemAsync('APPWRITE_SESSION_JWT');
}