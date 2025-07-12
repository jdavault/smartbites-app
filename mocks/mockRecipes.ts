import { Recipe, RecipeContextType } from '@/types/recipes';
import { mockAllergens7, mockAllergens2, mockAllergens } from './mockAllergens';
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export const mockRecipe: Recipe = {
  $id: '665f8c2e9e8a0a8e2b1d1',
  title: 'Gluten-Free Pancakes',
  description:
    'Fluffy pancakes made without any gluten. Perfect for a cozy breakfast.',
  ingredients: [
    '1 cup gluten-free flour',
    '2 eggs',
    '1 cup almond milk',
    '1 tsp baking powder',
  ],
  instructions: [
    'Whisk together dry ingredients.',
    'Add eggs and almond milk, mix until smooth.',
    'Heat a pan and cook pancakes until golden.',
  ],
  allergens: [...mockAllergens],
  prepTime: 10,
  cookTime: 15,
  servings: 2,
  difficulty: Difficulty.Easy,
  tags: ['gluten-free', 'breakfast'],
  searchQuery: 'gluten free pancakes breakfast',
  isFavorite: true,
  imageUrl: 'https://source.unsplash.com/800x600/?pancakes',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockRecipes: Recipe[] = [
  {
    $id: '665f8c2e9e8a0a8e2b1d1',
    title: 'Gluten-Free Pancakes',
    description:
      'Fluffy pancakes made without any gluten. Perfect for a cozy breakfast.',
    ingredients: [
      '1 cup gluten-free flour',
      '2 eggs',
      '1 cup almond milk',
      '1 tsp baking powder',
    ],
    instructions: [
      'Whisk together dry ingredients.',
      'Add eggs and almond milk, mix until smooth.',
      'Heat a pan and cook pancakes until golden.',
    ],
    allergens: [...mockAllergens2],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: Difficulty.Easy,
    tags: ['gluten-free', 'breakfast'],
    searchQuery: 'gluten free pancakes breakfast',
    isFavorite: true,
    imageUrl: 'https://source.unsplash.com/800x600/?pancakes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    $id: '665f8c2e9e8a0a8e2b1d2',
    title: 'Dairy-Free Mac & Cheese',
    description:
      'Creamy and cheesy without the dairy! Great for sensitive stomachs.',
    ingredients: [
      '1 cup elbow pasta',
      '1 cup cashew cream',
      '1 tbsp nutritional yeast',
      'Salt to taste',
    ],
    instructions: [
      'Boil the pasta until al dente.',
      'Heat cashew cream and mix in nutritional yeast and salt.',
      'Combine pasta with the sauce and serve warm.',
    ],
    allergens: [...mockAllergens7],
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    difficulty: Difficulty.Medium,
    tags: ['dairy-free', 'comfort food'],
    searchQuery: 'dairy free mac and cheese',
    isFavorite: true,
    imageUrl: 'https://source.unsplash.com/800x600/?mac-cheese',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    $id: '665f8c2e9e8a0a8e2b1d3',
    title: 'Egg-Free French Toast',
    description:
      'Classic French toast without eggs, made with a chickpea flour batter.',
    ingredients: [
      '4 slices of bread',
      '1/4 cup chickpea flour',
      '1 cup plant milk',
      '1 tsp cinnamon',
    ],
    instructions: [
      'Whisk together chickpea flour, milk, and cinnamon.',
      'Dip bread slices into the mixture.',
      'Cook on a non-stick pan until golden brown on each side.',
    ],
    allergens: [...mockAllergens7],
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    tags: ['egg-free', 'breakfast', 'vegan'],
    searchQuery: 'egg free french toast vegan',
    difficulty: Difficulty.Easy,
    isFavorite: true,
    imageUrl: 'https://source.unsplash.com/800x600/?french-toast',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
