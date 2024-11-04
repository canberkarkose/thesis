import {
  StyledBiryani, StyledRamen, StyledSalad, StyledTaco,
  StyledTurkey, StyledItalianFood
} from '@components/organisms/LandingPageIntroSection/LandingPageIntroSection.styles';
import {
  StyledAnything,
  StyledVegetarian,
  StyledVegan,
  StyledGlutenFree,
  StyledPescetarian,
  StyledKetogenic
} from '@components/pages/AccountDetails/Steps/Steps.styles';

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

export const createDietQuestions = (setDiet: (diet: string) => void) => [
  { text: 'Do you prefer a vegetarian diet?', onYes: () => setDiet('vegetarian') },
  { text: 'Are you interested in a low-carb, ketogenic diet?', onYes: () => setDiet('ketogenic') },
  { text: 'Would you like to try a vegan diet?', onYes: () => setDiet('vegan') },
  { text: 'Do you need gluten-free meals?', onYes: () => setDiet('glutenFree') },
  { text: 'Are you a pescetarian?', onYes: () => setDiet('pescetarian') },
];

export const createIntoleranceQuestions = (
  setIntolerances: React.Dispatch<React.SetStateAction<string[]>>
) => [
  {
    text: 'Do you have a gluten intolerance?',
    onYes: () => setIntolerances((prev) => [...prev, 'gluten']),
  },
  {
    text: 'Are you allergic to dairy products?',
    onYes: () => setIntolerances((prev) => [...prev, 'dairy']),
  },
  {
    text: 'Should we exclude shellfish from your meals?',
    onYes: () => setIntolerances((prev) => [...prev, 'shellfish']),
  },
  {
    text: 'Do you have a peanut allergy?',
    onYes: () => setIntolerances((prev) => [...prev, 'peanut']),
  },
  {
    text: 'Are you allergic to tree nuts?',
    onYes: () => setIntolerances((prev) => [...prev, 'tree nut']),
  },
  {
    text: 'Do you have a soy allergy?',
    onYes: () => setIntolerances((prev) => [...prev, 'soy']),
  },
];

export const createCuisineQuestions = (
  setCuisines: React.Dispatch<React.SetStateAction<string[]>>,
  setExcludeCuisines: React.Dispatch<React.SetStateAction<string[]>>
) => [
  {
    text: 'Would you like to try Italian cuisine?',
    onYes: () => setCuisines((prev) => [...prev, 'italian']),
    onNo: () => setExcludeCuisines((prev) => [...prev, 'italian']),
  },
  {
    text: 'Would you like to explore Asian cuisine?',
    onYes: () => setCuisines((prev) => [...prev, 'asian']),
    onNo: () => setExcludeCuisines((prev) => [...prev, 'asian']),
  },
  {
    text: 'How about trying Mexican cuisine?',
    onYes: () => setCuisines((prev) => [...prev, 'mexican']),
    onNo: () => setExcludeCuisines((prev) => [...prev, 'mexican']),
  },
  {
    text: 'Are you interested in Greek cuisine?',
    onYes: () => setCuisines((prev) => [...prev, 'greek']),
    onNo: () => setExcludeCuisines((prev) => [...prev, 'greek']),
  },
  {
    text: 'Would you like to try Indian cuisine?',
    onYes: () => setCuisines((prev) => [...prev, 'indian']),
    onNo: () => setExcludeCuisines((prev) => [...prev, 'indian']),
  },
];

export const createMaxReadyTimeQuestion = (setMaxReadyTime: (time: number) => void) => ({
  text: 'Do you prefer quick meals under 30 minutes?',
  onYes: () => setMaxReadyTime(30),
});
