export interface Allergen {
  $id: string;
  name: string;
  description: string;
  iconUrl?: string;
}

export type AllergenName =
  | 'Eggs'
  | 'Fish'
  | 'Milk'
  | 'Peanuts'
  | 'Sesame'
  | 'Shellfish'
  | 'Soybeans'
  | 'Tree Nuts'
  | 'Wheat (Gluten)';

type SelectedAllergens = Allergen[];
type Allergens = Allergen[];
type AllergenNames = AllergenName[];
