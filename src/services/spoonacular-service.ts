/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const X_RAPIDAPI_KEY = import.meta.env.VITE_X_RAPIDAPI_KEY;
const X_RAPIDAPI_HOST = import.meta.env.VITE_X_RAPIDAPI_HOST;
const COMPLEX_SEARCH_URL_RAPIDAPI = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch';
const RANDOM_SEARCH_URL_RAPIDAPI = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random';
const GET_RECIPE_INFORMATION_URL_RAPIDAPI = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/{id}/information';
const GET_RECIPE_INFORMATION_BULK_URL_RAPIDAPI = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk';

export interface FetchRecipesParams {
  diet?: string;
  intolerances?: string;
  cuisines?: string;
  excludeCuisines?: string;
  type?: string;
  minCalories?: number;
  maxCalories?: number;
  minSugar?: number;
  maxSugar?: number;
  query?: string;
  maxReadyTime?: number;
  number?: number;
  offset?: number;
}

interface FetchRandomRecipesParams {
  numberOfRecipes: number;
}

export const fetchRecipes = async ({
  diet,
  intolerances,
  cuisines,
  excludeCuisines,
  type,
  minCalories,
  maxCalories,
  minSugar,
  maxSugar,
  query,
  maxReadyTime,
  number
}: FetchRecipesParams) => {
  try {
    const params: any = {
      diet: diet || undefined,
      intolerances: intolerances || undefined,
      cuisine: cuisines || undefined,
      excludeCuisine: excludeCuisines || undefined,
      type: type || undefined,
      query: query || undefined,
      maxReadyTime: maxReadyTime || undefined,
      minCalories: minCalories || undefined,
      maxCalories: maxCalories || undefined,
      minSugar: minSugar || undefined,
      maxSugar: maxSugar || undefined,
      number: number || 10,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    const response = await axios.get(COMPLEX_SEARCH_URL_RAPIDAPI, {
      headers: {
        'x-rapidapi-key': X_RAPIDAPI_KEY,
        'x-rapidapi-host': X_RAPIDAPI_HOST,
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch recipes. Please try again later.');
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

export const fetchRecipeInformationBulk = async (ids: number[]) => {
  try {
    const response = await axios
      .get(GET_RECIPE_INFORMATION_BULK_URL_RAPIDAPI, {
        headers: {
          'x-rapidapi-key': X_RAPIDAPI_KEY,
          'x-rapidapi-host': X_RAPIDAPI_HOST,
        },
        params: {
          ids: ids.join(','),
        },
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe information:', error);
    throw new Error('Failed to fetch recipe information. Please try again later.');
  }
};
