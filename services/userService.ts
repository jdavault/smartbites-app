import { AccountClient, UserDocument } from '@/libs/appwrite/accountClient';
import { User } from '@/types/user';
import { saveUserAllergens } from './allergenServices';
import { Allergen } from '@/types/allergen';
import { UserClient } from '@/libs/appwrite/userClient';

export async function login(email: string, password: string): Promise<User> {
  await AccountClient.deleteSession().catch((e) => {
    if (e.code !== 401) throw e;
  });

  await AccountClient.createSession(email, password);
  return await fetchCurrentUser();
}

export async function logout(): Promise<void> {
  await AccountClient.deleteSession();
}

export async function create(email: string, password: string): Promise<User> {
  await AccountClient.create(email, password);
  const user = await login(email, password); // login includes fetchUser
  return user;
}

export async function updateUserName(name: string): Promise<UserDocument> {
  const userDoc = await AccountClient.updateName(name);
  return userDoc;
}

export async function fetchCurrentUser(): Promise<User> {
  const res = await AccountClient.get();
  return {
    $id: res.$id,
    email: res.email,
    name: res.name,
    firstName: res.name?.split(' ')[0],
    lastName: res.name?.split(' ').slice(1).join(' '),
  };
}

export async function registerFullUser(
  email: string,
  password: string,
  name: string,
  allergens: Allergen[] = []
): Promise<User> {
  await create(email, password);
  const userDoc = await updateUserName(name);

  const user: User = {
    $id: userDoc.$id,
    email: userDoc.email,
    name: userDoc.name,
    firstName: userDoc.name?.split(' ')[0],
    lastName: userDoc.name?.split(' ').slice(1).join(' '),
  };

  if (allergens.length > 0 && user?.$id) {
    await saveUserAllergens(user.$id, allergens);
  }
  console.debug('DEBUG-4: userService:registerFullUser()', {
    user,
  });

  return user;
}

export async function updateUserAllergens(
  userId: string,
  allergens: Allergen[]
) {
  return await UserClient.updateUserAllergens(userId, allergens);
}

export async function getUserAllergens(userId: string) {
  return await UserClient.getUserAllergens(userId);
}
