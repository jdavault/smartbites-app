import { Allergen } from './allergen';
export interface User {
  $id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar?: string;
}

// export type User = {
//   id: string;
//   username: string;
//   email: string;
//   allergies: string[];
//   preferences: {
//     vegetarian: boolean;
//     vegan: boolean;
//     pescatarian: boolean;
//   };
// };

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  authChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    allergens: Allergen[]
  ) => Promise<void>;
  logout: () => Promise<void>;
}
