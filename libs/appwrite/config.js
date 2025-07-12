import { Platform } from 'react-native';

import {
  Client as RNClient,
  Account as RNAccount,
  Avatars as RNAvatars,
  Databases as RNDatabases,
  Storage as RNStorage,
} from 'react-native-appwrite';

import {
  Client as WebClient,
  Account as WebAccount,
  Avatars as WebAvatars,
  Databases as WebDatabases,
  Storage as WebStorage,
} from 'appwrite';

const client = new (Platform.OS === 'web' ? WebClient : RNClient)()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('68351744000a63ee4a53');

if (Platform.OS !== 'web') {
  // ✅ Only call this for native
  client.setPlatform('com.anonymous.allergy-aware-recipe-finder');
}

export const account =
  Platform.OS === 'web' ? new WebAccount(client) : new RNAccount(client);

export const avatars =
  Platform.OS === 'web' ? new WebAvatars(client) : new RNAvatars(client);

export const databases =
  Platform.OS === 'web' ? new WebDatabases(client) : new RNDatabases(client);

export const storage =
  Platform.OS === 'web' ? new WebStorage(client) : new RNStorage(client);
