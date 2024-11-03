import axios from 'axios';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';

interface FetchRecipesParams {
  diet?: string;
  intolerances?: string;
  cuisines?: string;
  excludeCuisines?: string;
  type?: string;
}

export const fetchRecipes = async ({
  diet, intolerances, cuisines, type, excludeCuisines
}: FetchRecipesParams) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apiKey: API_KEY,
        diet: diet ?? undefined,
        intolerances: intolerances ?? undefined,
        cuisine: cuisines ?? undefined,
        excludeCuisine: excludeCuisines ?? undefined,
        type: type ?? undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw new Error('Failed to fetch recipes. Please try again later.');
  }
};
