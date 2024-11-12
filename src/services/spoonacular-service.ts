import axios from 'axios';

const X_RAPIDAPI_KEY = import.meta.env.VITE_X_RAPIDAPI_KEY;
const X_RAPIDAPI_HOST = import.meta.env.VITE_X_RAPIDAPI_HOST;
const COMPLEX_SEARCH_URL_RAPIDAPI = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch';
const RANDOM_SEARCH_URL_RAPIDAPI = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random';
const GET_RECIPE_INFORMATION_URL_RAPIDAPI = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/{id}/information';

interface FetchRecipesParams {
  diet?: string;
  intolerances?: string;
  cuisines?: string;
  excludeCuisines?: string;
  type?: string;
}

interface FetchRandomRecipesParams {
  numberOfRecipes: number;
}

export const fetchRecipes = async ({
  diet, intolerances, cuisines, type, excludeCuisines
}: FetchRecipesParams) => {
  try {
    const response = await axios.get(COMPLEX_SEARCH_URL_RAPIDAPI, {
      headers: {
        'x-rapidapi-key': X_RAPIDAPI_KEY,
        'x-rapidapi-host': X_RAPIDAPI_HOST,
      },
      params: {
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

export const fetchRandomRecipes = async (
  { numberOfRecipes }: FetchRandomRecipesParams
) => {
  try {
    const response = await axios.get(RANDOM_SEARCH_URL_RAPIDAPI, {
      headers: {
        'x-rapidapi-key': X_RAPIDAPI_KEY,
        'x-rapidapi-host': X_RAPIDAPI_HOST,
      },
      params: {
        number: numberOfRecipes,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw new Error('Failed to fetch random recipes. Please try again later.');
  }
};

export const fetchRecipeInformation = async (id: number) => {
  try {
    const response = await axios
      .get(GET_RECIPE_INFORMATION_URL_RAPIDAPI.replace('{id}', id.toString()), {
        headers: {
          'x-rapidapi-key': X_RAPIDAPI_KEY,
          'x-rapidapi-host': X_RAPIDAPI_HOST,
        },
        params: {
          includeNutrition: true
        },
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe information:', error);
    throw new Error('Failed to fetch recipe information. Please try again later.');
  }
};
