// Define Preferences and Target types locally if needed, or import from public API if available
type Preferences = Record<string, any>;
type Target = any;
import { account } from './config'; // where you initialize your Appwrite SDK
import { ID } from 'react-native-appwrite';

export type UserDocument = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  password?: string;
  hash?: string;
  hashOptions?: object;
  registration: string;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: Preferences;
  targets: Target[];
  accessedAt: string;
};
export const AccountClient = {
  get: () => account.get(),
  create: (email: string, password: string) =>
    account.create(ID.unique(), email, password),
  createSession: (email: string, password: string) =>
    account.createEmailPasswordSession(email, password),
  deleteSession: () => account.deleteSession('current'),
  updateName: (name: string): Promise<UserDocument> => account.updateName(name),
};
