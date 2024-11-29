import { getImageSrc, getMealTypeOptions } from './helpers';

import { RecipeInformation } from '@components/pages/App/Recipes/Recipes.types';

describe('Helper Functions', () => {
  /**
   * Tests for getImageSrc function
   */
  describe('getImageSrc', () => {
    it('returns an empty string when image is empty', () => {
      expect(getImageSrc('', 'ingredient')).toBe('');
      expect(getImageSrc('', 'equipment')).toBe('');
    });

    it('returns the image URL as is when image starts with "http"', () => {
      const imageUrl = 'http://example.com/image.jpg';
      expect(getImageSrc(imageUrl, 'ingredient')).toBe(imageUrl);
      expect(getImageSrc(imageUrl, 'equipment')).toBe(imageUrl);
    });

    it('prepends the ingredient base URL when type is "ingredient"', () => {
      const imageFilename = 'sugar.png';
      const expectedUrl = 'https://spoonacular.com/cdn/ingredients_100x100/sugar.png';
      expect(getImageSrc(imageFilename, 'ingredient')).toBe(expectedUrl);
    });

    it('prepends the equipment base URL when type is "equipment"', () => {
      const imageFilename = 'blender.png';
      const expectedUrl = 'https://spoonacular.com/cdn/equipment_100x100/blender.png';
      expect(getImageSrc(imageFilename, 'equipment')).toBe(expectedUrl);
    });
  });

  /**
   * Tests for getMealTypeOptions function
   */
  describe('getMealTypeOptions', () => {
    it('returns all meal types when recipeInfo is null', () => {
      expect(getMealTypeOptions(null)).toEqual(['breakfast', 'lunch', 'dinner', 'dessert']);
    });

    it('returns all meal types when dishTypes is undefined', () => {
      const recipeInfo: RecipeInformation = {
        id: 1,
        title: 'Test Recipe',
        image: 'test-image.jpg',
        summary: 'Test summary',
        nutrition: {
          caloricBreakdown: {
            percentProtein: 20,
            percentFat: 30,
            percentCarbs: 50,
          },
          nutrients: [{ name: 'Calories', amount: 500, unit: 'kcal' }],
        },
        readyInMinutes: 30,
        servings: 4,
        extendedIngredients: [],
        analyzedInstructions: [],
        // dishTypes is undefined
      };

      expect(getMealTypeOptions(recipeInfo)).toEqual(['breakfast', 'lunch', 'dinner', 'dessert']);
    });

    it('returns all meal types when dishTypes is an empty array', () => {
      const recipeInfo: RecipeInformation = {
        id: 2,
        title: 'Empty Dish Types Recipe',
        image: 'empty-dish-types.jpg',
        summary: 'No dish types',
        nutrition: {
          caloricBreakdown: {
            percentProtein: 25,
            percentFat: 25,
            percentCarbs: 50,
          },
          nutrients: [{ name: 'Calories', amount: 600, unit: 'kcal' }],
        },
        readyInMinutes: 45,
        servings: 6,
        extendedIngredients: [],
        analyzedInstructions: [],
        dishTypes: [],
      };

      expect(getMealTypeOptions(recipeInfo)).toEqual(['breakfast', 'lunch', 'dinner', 'dessert']);
    });

    it('includes "breakfast" when dishTypes includes a breakfast type', () => {
      const recipeInfo: RecipeInformation = {
        id: 3,
        title: 'Breakfast Recipe',
        image: 'breakfast.jpg',
        summary: 'A delicious breakfast',
        nutrition: {
          caloricBreakdown: {
            percentProtein: 15,
            percentFat: 35,
            percentCarbs: 50,
          },
          nutrients: [{ name: 'Calories', amount: 400, unit: 'kcal' }],
        },
        readyInMinutes: 20,
        servings: 2,
        extendedIngredients: [],
        analyzedInstructions: [],
        dishTypes: ['breakfast'],
      };

      expect(getMealTypeOptions(recipeInfo)).toEqual(['breakfast']);
    });

    it('includes "dessert" when dishTypes includes "dessert"', () => {
      const recipeInfo: RecipeInformation = {
        id: 4,
        title: 'Dessert Recipe',
        image: 'dessert.jpg',
        summary: 'A sweet dessert',
        nutrition: {
          caloricBreakdown: {
            percentProtein: 10,
            percentFat: 40,
            percentCarbs: 50,
          },
          nutrients: [{ name: 'Calories', amount: 300, unit: 'kcal' }],
        },
        readyInMinutes: 25,
        servings: 3,
        extendedIngredients: [],
        analyzedInstructions: [],
        dishTypes: ['dessert'],
      };

      expect(getMealTypeOptions(recipeInfo)).toEqual(['dessert']);
    });

    it('includes both "breakfast" and "dessert" when dishTypes includes both', () => {
      const recipeInfo: RecipeInformation = {
        id: 5,
        title: 'Breakfast and Dessert Recipe',
        image: 'breakfast-dessert.jpg',
        summary: 'A recipe that serves both breakfast and dessert',
        nutrition: {
          caloricBreakdown: {
            percentProtein: 20,
            percentFat: 30,
            percentCarbs: 50,
          },
          nutrients: [{ name: 'Calories', amount: 450, unit: 'kcal' }],
        },
        readyInMinutes: 35,
        servings: 4,
        extendedIngredients: [],
        analyzedInstructions: [],
        dishTypes: ['breakfast', 'dessert'],
      };

      expect(getMealTypeOptions(recipeInfo)).toEqual(['breakfast', 'dessert']);
    });

    it('includes "lunch" and "dinner" when dishTypes includes neither breakfast nor dessert', () => {
      const recipeInfo: RecipeInformation = {
        id: 6,
        title: 'Lunch and Dinner Recipe',
        image: 'lunch-dinner.jpg',
        summary: 'A hearty meal for lunch and dinner',
        nutrition: {
          caloricBreakdown: {
            percentProtein: 30,
            percentFat: 30,
            percentCarbs: 40,
          },
          nutrients: [{ name: 'Calories', amount: 700, unit: 'kcal' }],
        },
        readyInMinutes: 50,
        servings: 5,
        extendedIngredients: [],
        analyzedInstructions: [],
        dishTypes: ['lunch'],
      };

      expect(getMealTypeOptions(recipeInfo)).toEqual(['lunch', 'dinner']);
    });

    it('includes "breakfast" when dishTypes includes a brunch type', () => {
      const recipeInfo: RecipeInformation = {
        id: 7,
        title: 'Brunch Recipe',
        image: 'brunch.jpg',
        summary: 'A delightful brunch',
        nutrition: {
          caloricBreakdown: {
            percentProtein: 25,
            percentFat: 25,
            percentCarbs: 50,
          },
          nutrients: [{ name: 'Calories', amount: 500, unit: 'kcal' }],
        },
        readyInMinutes: 30,
        servings: 3,
        extendedIngredients: [],
        analyzedInstructions: [],
        dishTypes: ['brunch'],
      };

      expect(getMealTypeOptions(recipeInfo)).toEqual(['breakfast']);
    });
  });
});
