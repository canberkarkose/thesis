import { RecipeInformation } from '@components/pages/App/Recipes/Recipes.types';

export const getImageSrc = (image: string, type: 'ingredient' | 'equipment') => {
  if (!image) {
    return ''; // Return an empty string if image is not available
  }
  if (image.startsWith('http')) {
    // If the image is a full URL, use it directly
    return image;
  }
  // If it's just a filename, prepend the base URL
  const baseUrl = type === 'ingredient'
    ? 'https://spoonacular.com/cdn/ingredients_100x100/'
    : 'https://spoonacular.com/cdn/equipment_100x100/';
  return `${baseUrl}${image}`;
};

export const getMealTypeOptions = (recipeInfo: RecipeInformation | null) => {
  const dishTypes = recipeInfo?.dishTypes || [];
  const mealTypes: string[] = [];

  const breakfastTypes = ['morning meal', 'brunch', 'breakfast'];
  const isBreakfast = dishTypes.some((type) => breakfastTypes.includes(type));
  const isDessert = dishTypes.includes('dessert');

  if (dishTypes.length === 0) {
    mealTypes.push('breakfast', 'lunch', 'dinner', 'dessert');
  } else {
    if (isBreakfast) mealTypes.push('breakfast');
    if (isDessert) mealTypes.push('dessert');
    if (!isBreakfast && !isDessert) mealTypes.push('lunch', 'dinner');
  }

  return mealTypes;
};
