@@ .. @@
 import * as SecureStore from 'expo-secure-store';
+import { Platform } from 'react-native';

 export async function saveSessionJWT(jwt: string) {
-  await SecureStore.setItemAsync('APPWRITE_SESSION_JWT', jwt);
+  if (Platform.OS === 'web') {
+    localStorage.setItem('APPWRITE_SESSION_JWT', jwt);
+  } else {
+    await SecureStore.setItemAsync('APPWRITE_SESSION_JWT', jwt);
+  }
 }

 export async function getSessionJWT() {
-  return await SecureStore.getItemAsync('APPWRITE_SESSION_JWT');
+  if (Platform.OS === 'web') {
+    return localStorage.getItem('APPWRITE_SESSION_JWT');
+  } else {
+    return await SecureStore.getItemAsync('APPWRITE_SESSION_JWT');
+  }
 }

 export async function deleteSessionJWT() {
-  await SecureStore.deleteItemAsync('APPWRITE_SESSION_JWT');
+  if (Platform.OS === 'web') {
+    localStorage.removeItem('APPWRITE_SESSION_JWT');
+  } else {
+    await SecureStore.deleteItemAsync('APPWRITE_SESSION_JWT');
+  }
 }