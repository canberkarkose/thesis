import axios from 'axios';

import {
  fetchRecipes,
  fetchRandomRecipes,
  fetchRecipeInformation,
  fetchRecipeInformationBulk,
  FetchRecipesParams,
  FetchRandomRecipesParams
} from './spoonacular-service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Functions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchRecipes', () => {
    it('should fetch recipes successfully with provided parameters', async () => {
      const mockData = { results: [{ id: 1, title: 'Spaghetti Bolognese' }] };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const params: FetchRecipesParams = {
        diet: 'vegetarian',
        intolerances: 'gluten',
        cuisines: 'Italian',
        excludeCuisines: 'Mexican',
        type: 'main course',
        minCalories: 200,
        maxCalories: 800,
        minSugar: 0,
        maxSugar: 50,
        query: 'pasta',
        maxReadyTime: 30,
        number: 5,
        offset: 0,
      };

      const data = await fetchRecipes(params);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bite-by-byte-22033d60b0f3.herokuapp.com/api/recipes/complexSearch',
        {
          params: {
            diet: 'vegetarian',
            intolerances: 'gluten',
            cuisine: 'Italian',
            excludeCuisine: 'Mexican',
            type: 'main course',
            query: 'pasta',
            maxReadyTime: 30,
            minCalories: 200,
            maxCalories: 800,
            maxSugar: 50,
            number: 5,
          },
        }
      );
      expect(data).toEqual(mockData);
    });

    it('should default number to 10 if not provided', async () => {
      const mockData = { results: [{ id: 2, title: 'Chicken Curry' }] };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const params: FetchRecipesParams = {};

      const data = await fetchRecipes(params);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bite-by-byte-22033d60b0f3.herokuapp.com/api/recipes/complexSearch',
        {
          params: {
            number: 10,
          },
        }
      );
      expect(data).toEqual(mockData);
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const params: FetchRecipesParams = { query: 'pasta' };

      await expect(fetchRecipes(params)).rejects.toThrow('Failed to fetch recipes. Please try again later.');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bite-by-byte-22033d60b0f3.herokuapp.com/api/recipes/complexSearch',
        {
          params: {
            query: 'pasta',
            number: 10,
          },
        }
      );
    });
  });

  describe('fetchRandomRecipes', () => {
    it('should fetch random recipes successfully', async () => {
      const mockData = { recipes: [{ id: 3, title: 'Beef Stew' }] };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const params: FetchRandomRecipesParams = { numberOfRecipes: 3 };

      const data = await fetchRandomRecipes(params);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bite-by-byte-22033d60b0f3.herokuapp.com/api/recipes/random',
        {
          params: { number: 3 },
        }
      );
      expect(data).toEqual(mockData);
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const params: FetchRandomRecipesParams = { numberOfRecipes: 2 };

      await expect(fetchRandomRecipes(params)).rejects.toThrow('Failed to fetch random recipes. Please try again later.');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bite-by-byte-22033d60b0f3.herokuapp.com/api/recipes/random',
        {
          params: { number: 2 },
        }
      );
    });
  });

  describe('fetchRecipeInformation', () => {
    it('should fetch recipe information successfully', async () => {
      const mockData = { id: 1, title: 'Spaghetti Bolognese', nutrition: { calories: 500 } };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const id = 1;

      const data = await fetchRecipeInformation(id);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bite-by-byte-22033d60b0f3.herokuapp.com/api/recipes/1/information',
        {
          params: { includeNutrition: true },
        }
      );
      expect(data).toEqual(mockData);
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const id = 2;

      await expect(fetchRecipeInformation(id)).rejects.toThrow('Failed to fetch recipe information. Please try again later.');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bite-by-byte-22033d60b0f3.herokuapp.com/api/recipes/2/information',
        {
          params: { includeNutrition: true },
        }
      );
    });
  });

  describe('fetchRecipeInformationBulk', () => {
    it('should fetch bulk recipe information successfully', async () => {
      const mockData = [
        { id: 1, title: 'Spaghetti Bolognese', nutrition: { calories: 500 } },
        { id: 2, title: 'Chicken Curry', nutrition: { calories: 600 } },
      ];
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const ids = [1, 2];

      const data = await fetchRecipeInformationBulk(ids);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bite-by-byte-22033d60b0f3.herokuapp.com/api/recipes/informationBulk',
        {
          params: { ids: '1,2' },
        }
      );
      expect(data).toEqual(mockData);
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const ids = [3, 4];

      await expect(fetchRecipeInformationBulk(ids)).rejects.toThrow('Failed to fetch bulk recipe information. Please try again later.');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://bite-by-byte-22033d60b0f3.herokuapp.com/api/recipes/informationBulk',
        {
          params: { ids: '3,4' },
        }
      );
    });
  });
});
