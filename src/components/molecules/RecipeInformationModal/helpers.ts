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
