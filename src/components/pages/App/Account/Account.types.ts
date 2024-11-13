interface CuisinePreferences {
  includedCuisines: string[];
  excludedCuisines: string[];
}

interface AccountDetails {
  diet: string;
  intolerances: string[];
  cuisinePreferences?: CuisinePreferences;
}

export interface UserData {
  username: string;
  email: string;
  accountDetails?: AccountDetails;
}
