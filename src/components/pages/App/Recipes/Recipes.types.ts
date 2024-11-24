export interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
}

export interface RecipeInformation extends Recipe {
  nutrition: {
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
      any?: number;
    };
    nutrients: {
      name: string;
      amount: number;
      unit: string;
    }[];
  };
  extendedIngredients: {
    id: number;
    original: string;
    image: string;
    name: string;
  }[];
  analyzedInstructions: {
    steps: {
      number: number;
      step: string;
      ingredients: {
        id: number;
        name: string;
        image: string;
      }[];
      equipment: {
        id: number;
        name: string;
        image: string;
      }[];
    }[];
  }[];
  dishTypes?: string[];
  readyInMinutes: number;
  servings: number;
}
