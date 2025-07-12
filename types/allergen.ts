export interface Allergen {
  $id: string;
  name: string;
  description: string;
  iconUrl?: string;
}

export type AllergenName =
  | 'Gluten'
  | 'Dairy'
  | 'Eggs'
  | 'Soy'
  | 'Shellfish'
  | 'Fish'
  | 'Sesame'
  | 'Peanuts'
  | 'Tree Nuts';

type SelectedAllergens = Allergen[];
type Allergens = Allergen[];
type AllergenNames = AllergenName[];
