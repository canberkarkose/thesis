/* istanbul ignore file */
import {
  StyledAnything,
  StyledGlutenFree,
  StyledKetogenic,
  StyledVegetarian,
  StyledLactoVegetarian,
  StyledOvoVegetarian,
  StyledVegan,
  StyledPescetarian,
  StyledPaleo,
  StyledWhole30
} from './Steps.styles';

import {
  StyledBiryani, StyledRamen, StyledSalad, StyledTaco,
  StyledTurkey, StyledItalianFood
} from '@components/organisms/LandingPageIntroSection/LandingPageIntroSection.styles';

export const dietOptions = [
  {
    value: 'anything', label: 'Anything', description: 'No specific dietary preference, adjustable anytime.', icon: <StyledAnything />
  },
  {
    value: 'vegetarian', label: 'Vegetarian', description: 'Excludes meat and meat by-products.', icon: <StyledVegetarian />
  },
  {
    value: 'vegan', label: 'Vegan', description: 'Excludes meat, dairy, eggs, and honey.', icon: <StyledVegan />
  },
  {
    value: 'glutenFree', label: 'Gluten Free', description: 'Avoids gluten-containing grains and foods.', icon: <StyledGlutenFree />
  },
  {
    value: 'pescetarian', label: 'Pescetarian', description: 'Excludes meat except fish and seafood.', icon: <StyledPescetarian />
  },
  {
    value: 'ketogenic', label: 'Ketogenic', description: 'Low carb, high fat, focusing on protein.', icon: <StyledKetogenic />
  },
  {
    value: 'paleo', label: 'Paleo', description: 'Emphasizes whole foods; excludes grains, processed items.', icon: <StyledPaleo />
  },
  {
    value: 'whole30', label: 'Whole30', description: 'Whole foods diet, excludes sugar and processed foods.', icon: <StyledWhole30 />
  },
  {
    value: 'lactoVegetarian', label: 'Lacto-Vegetarian', description: 'Vegetarian diet excluding eggs.', icon: <StyledLactoVegetarian />
  },
  {
    value: 'ovoVegetarian', label: 'Ovo-Vegetarian', description: 'Vegetarian diet excluding dairy.', icon: <StyledOvoVegetarian />
  }
];

export const findDietLabel = (dietValue: string) => {
  const diet = dietOptions.find((option) => option.value === dietValue);
  return diet ? diet.label : 'Unknown';
};

export const intolerancesTypes = [
  'Dairy',
  'Egg',
  'Gluten',
  'Grain',
  'Peanut',
  'Seafood',
  'Sesame',
  'Shellfish',
  'Soy',
  'Sulfite',
  'Tree Nut',
  'Wheat'
];

export const cuisines = [
  'African',
  'Asian',
  'American',
  'British',
  'Caribbean',
  'Chinese',
  'Eastern European',
  'European',
  'French',
  'German',
  'Greek',
  'Indian',
  'Italian',
  'Japanese',
  'Jewish',
  'Korean',
  'Latin American',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Southern',
  'Spanish',
  'Thai',
  'Vietnamese',
];

export const demoDietOptions = [
  { value: 'anything', label: 'Anything', icon: <StyledAnything /> },
  { value: 'vegetarian', label: 'Vegetarian', icon: <StyledVegetarian /> },
  { value: 'vegan', label: 'Vegan', icon: <StyledVegan /> },
  { value: 'glutenFree', label: 'Gluten Free', icon: <StyledGlutenFree /> },
  { value: 'pescetarian', label: 'Pescetarian', icon: <StyledPescetarian /> },
  { value: 'ketogenic', label: 'Ketogenic', icon: <StyledKetogenic /> },
];

export const demoIntolerances = ['Dairy', 'Egg', 'Gluten', 'Peanut', 'Soy', 'Tree Nut'];

export const demoCuisines = [
  { value: 'asian', label: 'Asian', icon: <StyledRamen /> },
  { value: 'american', label: 'American', icon: <StyledTurkey /> },
  { value: 'italian', label: 'Italian', icon: <StyledItalianFood /> },
  { value: 'mexican', label: 'Mexican', icon: <StyledTaco /> },
  { value: 'greek', label: 'Greek', icon: <StyledSalad /> },
  { value: 'indian', label: 'Indian', icon: <StyledBiryani /> },
];
