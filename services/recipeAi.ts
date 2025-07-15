import { Difficulty, GeneratedRecipe } from '@/types/recipes';
import { postRequest, axios, AxiosError } from '@/libs/axios/apiClient';
import { ChatCompletionResponse, ChatImageResponse } from '@/types/openai';
import { retryWithBackoff } from '@/libs/axios/retryWithBackOff';
import { all } from 'axios';

export async function generateRecipe(
  query: string,
  allergens: string[]
): Promise<GeneratedRecipe> {
  try {
    // Format the allergens for the prompt
    const allergensText =
      allergens.length > 0
        ? `The recipe must avoid these allergens: ${allergens.join(', ')}.`
        : 'No specific allergens to avoid.';

    // Create a prompt for OpenAI

    console.log('DEBUG --- RecipeAI: query:', query);
    console.log('DEBUG --- RecipeAI: rawAllergens:', allergens);
    console.log('DEBUG --- RecipeAI: formattedAllergens:', allergensText);
    const prompt = `
      You are a professional culinary recipe writer. Create a detailed, well-structured recipe for "${query}".
      
      - ${allergensText}.
      - Do not include any ingredients or instructions that contain these allergens.
      - The "allergens" field must still list any potential allergens naturally present in the final recipe.
      - Use the exact casing and spelling for each allergen as provided: Eggs, Fish, Milk, Peanuts, Sesame, Shellfish, Soybeans, Tree Nuts, Wheat (Gluten).
      
      Your goal is to write this recipe clearly and concisely, following best practices for real-world publication:

        - Use consistent, standard culinary terms.
        - Be specific with ingredient quantities, measurements, and units (e.g., "1 cup chopped fresh parsley").
        - Include realistic prep and cook times in minutes (e.g., "15 minutes").
        - Write clear, step-by-step instructions that guide any home cook to succeed — explain what to do, what to watch for, and how to fix common issues when possible.
        - Use a descriptive, direct recipe title that is clear, searchable, and accurate — avoid ambiguity, mystery, or inaccurate dish names.
        - Follow proper recipe title grammar: capitalize all words except articles, conjunctions, and prepositions.
        - Avoid ambiguous title -- "what is loaded cauliflower casserole.  Be descriptive "Cauliflower and Broccoli Gratin with Garlic Breadcrumbs"
        Return ONLY a valid JSON object in the following exact structure. Do not include any text or commentary outside the JSON:
        - In recipe titles, all words except articles, propositions, and conjunctions should be capitalized -- e.g. Pigs in a Blanket, Scallion Dressing, Patty Melt with Cabbage on Rye
        - Use Direct, descriptive Title - e.g. Avocado Toast with Smoked Salmon, Black Bean and Corn Quinoa
        - Titles should highlight cooking method -- e.g. Roast Cauliflower, Grilled Sea Bass
        - Use region or promotional title -- e.g. New England Johnny Cakes, Persian Rice, Ultimate Fudge Brownies
        - Title can/should also highlight saving time - 10-minute salad, no-bake trail mix
        - Title can/should reflect ingredients or health focus - Gluten-Free Mac n Cheese, Vegan Chocolate Chip Cookies
        - Add “Rise Time” to recipes as needed. Ie hamburger buns, breads, pizza dough, etc.
        
      Format the response as a JSON object with the following structure:
      {
        "title": "Recipe Title",
        "headNote": "Brief, enticing description that explains the dish - context or extra tips",
        "description": "Brief, enticing description that explains the dish - context or extra tips",
        "ingredients": ["Ingredient 1", "Ingredient 2", ...],
        "instructions": ["Step 1", "Step 2", ...],
        "prepTime": "Time needed for preparation",
        "cookTime": "Time needed for cooking",
        "servings": number of servings,
        "difficulty": "easy/medium/hard",
        "tags": ["tag1", "tag2", ...],
        "searchQuery": "search query used to generate this recipe",
        "allergens": [${allergens}]
        "notes": "for substitutions or troubleshooting"
        "nutritionInfo": "nutrition information"
      }
      
    - The JSON must be syntactically valid — no trailing commas, no extra commentary.
    - Ingredient names and instructions must be clear and practical.
    - Titles must be direct, descriptive, and not misleading.
    - Always be mindful that your recipe should teach and guide any home cook to success, regardless of their skill level.
    `;

    const response = await retryWithBackoff(() =>
      postRequest<ChatCompletionResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful culinary assistant that specializes in creating recipes. You always ensure recipes are detailed, practical, and follow proper cooking techniques. You are particularly mindful of allergens and dietary restrictions.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      )
    );

    // Parse the response content as JSON
    const content = response.choices[0].message.content;
    console.log('DEBUG --- RecipeAI: content:', content);
    const recipeData = cleanAndParse(content);
    //console.log('DEBUG --- RecipeAI: Parsed Recipe Data:', recipeData);
    const generatedRecipeData = {
      ...recipeData,
      searchQuery: query,
    };
    //console.log('FULL:', generatedRecipeData);
    return generatedRecipeData;
  } catch (error) {
    console.error('Error generating recipe:', error);

    // Log detailed error information
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('OpenAI API Error:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
      });

      // If the API key is invalid or there are authentication issues, fall back to mock data
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        console.log('API authentication error');
        //return generateMockRecipe(query, allergens);
        throw new Error('Failed to generate recipe', error);
      }
    }

    // For all other errors, fall back to mock data
    console.log('Falling back to mock recipe generation');
    return generateMockRecipe(query, allergens);
  }
}

export async function generateRecipeImage(title: string): Promise<string> {
  const defaultImageUrl = '../../assets/images/defaultPhoto.png';
  try {
    const response = await retryWithBackoff(() =>
      postRequest<ChatImageResponse>(
        'https://api.openai.com/v1/images/generations',
        {
          prompt: `High quality food photo of ${title}, professional lighting, styled on a plate`,
          n: 1,
          size: '512x512',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      )
    );

    return response?.data?.[0]?.url ?? defaultImageUrl;
  } catch (error) {
    console.error('Error generating recipe image:', error);
    return defaultImageUrl;
  }
}

function cleanAndParse(content: string): GeneratedRecipe {
  // Step 1: Remove code block markers (```json ... ```)
  const cleaned = content.replace(/```json\s*([\s\S]*?)\s*```/, '$1');

  // Step 2: Parse the resulting string as JSON
  return JSON.parse(cleaned);
}

// Mock function for testing and fallback purposes
function generateMockRecipe(
  query: string,
  allergens: string[]
): GeneratedRecipe {
  const title = `${query} Recipe`;
  const options = {
    gluten: ['flour', 'bread', 'pasta', 'wheat'],
    milk: ['milk'],
    eggs: ['egg', 'mayonnaise'],
    nuts: ['almonds', 'walnuts', 'cashews', 'pistachios'],
    peanuts: ['peanut butter', 'peanuts'],
    shellfish: ['shrimp', 'crab', 'lobster'],
    fish: ['salmon', 'tuna', 'cod'],
    soy: ['tofu', 'soy sauce', 'edamame'],
    sesame: ['sesame seeds', 'tahini'],
  };

  const ingredients = [
    'Salt and pepper to taste',
    'Olive oil',
    '1 onion, diced',
    '2 cloves garlic, minced',
  ];

  if (!allergens.includes('gluten') && query.toLowerCase().includes('pasta')) {
    ingredients.push('8 oz pasta');
  }

  if (!allergens.includes('milk') && Math.random() > 0.5) {
    ingredients.push('1/2 cup grated parmesan cheese');
  }

  if (!allergens.includes('nuts') && Math.random() > 0.7) {
    ingredients.push('1/4 cup chopped walnuts');
  }

  const presentAllergens: string[] = [];
  Object.keys(options).forEach((allergen) => {
    if (!allergens.includes(allergen) && Math.random() > 0.7) {
      presentAllergens.push(allergen);
    }
  });

  return {
    title,
    headNote: `A delicious ${query} recipe that's easy to make and full of flavor.`,
    ingredients,
    instructions: [
      'Prep all ingredients before starting.',
      'In a large pan, heat olive oil over medium heat.',
      'Add onions and garlic, cook until translucent.',
      'Add remaining ingredients and cook according to your taste.',
      'Serve hot and enjoy!',
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: Difficulty.Easy,
    tags: [query, 'homemade', 'easy'],
    allergens: presentAllergens,
    searchQuery: query,
  };
}
