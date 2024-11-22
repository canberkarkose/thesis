/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

import { toast } from 'react-toastify';

import { fetchUserData } from '../Account/Account.helpers';

import { DashboardPresentation } from './DashboardPresentation';

import { fetchRecipeInformation, fetchRecipeInformationBulk } from '@src/services/spoonacular-service';
import { useAuth } from '@src/contexts/AuthContext';
import { db } from '@src/firebase-config';

export const Dashboard = () => {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});

  // States for NutritionStats
  const [isWeeklyNutritionView, setIsWeeklyNutritionView] = useState(true);
  const [nutritionDateRange, setNutritionDateRange] = useState<Date[]>([]);
  const [nutritionRecipesData, setNutritionRecipesData] = useState<any[]>([]);
  const [loadingNutritionData, setLoadingNutritionData] = useState(true);

  // States for GroceryTable
  const [isWeeklyGroceryView, setIsWeeklyGroceryView] = useState(true);
  const [groceryDateRange, setGroceryDateRange] = useState<Date[]>([]);
  const [groceryListData, setGroceryListData] = useState<any[]>([]);
  const [groupedIngredients, setGroupedIngredients] = useState<{ [key: string]: any[] }>({});
  const [loadingGroceryData, setLoadingGroceryData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipeInfo, setSelectedRecipeInfo] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Common States
  const [userMeals, setUserMeals] = useState<any>({});

  // Helper function: Determine date range based on view
  const determineDateRange = (isWeeklyView: boolean): Date[] => {
    const today = new Date();
    const dates: Date[] = [];

    if (isWeeklyView) {
      const currentDay = today.getDay();
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - currentDay);
      for (let i = 0; i < 7; i++) {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + i);
        dates.push(date);
      }
    } else {
      dates.push(today);
    }

    return dates;
  };

  // Update date ranges based on toggles
  useEffect(() => {
    const dates = determineDateRange(isWeeklyNutritionView);
    setNutritionDateRange(dates);
  }, [isWeeklyNutritionView]);

  useEffect(() => {
    const dates = determineDateRange(isWeeklyGroceryView);
    setGroceryDateRange(dates);
  }, [isWeeklyGroceryView]);

  // Fetch user data using fetchUserData helper
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData(user);
        setUserData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setIsLoading(false);
      }
    };
    getUserData();
  }, [user]);

  // Fetch user meals data from Firebase
  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserMeals(data.Meals || {});
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  // Fetch NutritionStats data
  useEffect(() => {
    const fetchNutritionData = async () => {
      const ids: number[] = [];

      nutritionDateRange.forEach((date) => {
        const dateString = date.toISOString().split('T')[0];
        const dayMeals = userMeals[dateString] || {};
        Object.values(dayMeals).forEach((meal: any) => {
          if (meal && meal.id) {
            ids.push(meal.id);
          }
        });
      });

      const uniqueIds = Array.from(new Set(ids));

      if (uniqueIds.length > 0) {
        try {
          setLoadingNutritionData(true);
          const responseRecipesData = await fetchRecipeInformationBulk(uniqueIds);
          setNutritionRecipesData(responseRecipesData);
        } catch (err) {
          console.error('NutritionStats - Error fetching recipe information:', err);
        } finally {
          setLoadingNutritionData(false);
        }
      } else {
        setNutritionRecipesData([]);
        setLoadingNutritionData(false);
      }
    };

    fetchNutritionData();
  }, [nutritionDateRange, userMeals]);

  // Fetch GroceryTable data
  useEffect(() => {
    const fetchGroceryData = async () => {
      const ids: number[] = [];

      groceryDateRange.forEach((date) => {
        const dateString = date.toISOString().split('T')[0];
        const dayMeals = userMeals[dateString] || {};
        Object.values(dayMeals).forEach((meal: any) => {
          if (meal && meal.id) {
            ids.push(meal.id);
          }
        });
      });

      const uniqueIds = Array.from(new Set(ids));

      if (uniqueIds.length > 0) {
        try {
          setLoadingGroceryData(true);
          const responseRecipesData = await fetchRecipeInformationBulk(uniqueIds);
          setGroceryListData(responseRecipesData);
        } catch (err) {
          console.error('GroceryTable - Error fetching recipe information:', err);
        } finally {
          setLoadingGroceryData(false);
        }
      } else {
        setGroceryListData([]);
        setLoadingGroceryData(false);
      }
    };

    fetchGroceryData();
  }, [groceryDateRange, userMeals]);

  useEffect(() => {
    const processGroceryData = () => {
      const allIngredients: any[] = [];

      groceryListData.forEach((recipe: any) => {
        if (recipe.extendedIngredients && Array.isArray(recipe.extendedIngredients)) {
          recipe.extendedIngredients.forEach((ingredient: any) => {
            allIngredients.push({
              id: ingredient.id,
              name: ingredient.name || 'Unknown Ingredient',
              aisle: ingredient.aisle || 'Other',
              image: ingredient.image || '',
              amount: ingredient.measures.metric.amount || 0,
              unit: ingredient.measures.metric.unitShort || '',
            });
          });
        }
      });
      const grouped = allIngredients.reduce((acc: any, ingredient: any) => {
        const aisle = ingredient.aisle || 'Other';
        if (!acc[aisle]) {
          acc[aisle] = [];
        }
        acc[aisle].push(ingredient);
        return acc;
      }, {});
      setGroupedIngredients(grouped);
    };

    if (!loadingGroceryData) {
      processGroceryData();
    }
  }, [groceryListData, loadingGroceryData]);

  const handleSeeMore = async (id: number) => {
    try {
      setIsModalLoading(true);
      setIsModalOpen(true);
      const data = await fetchRecipeInformation(id);
      setSelectedRecipeInfo(data);
    } catch (err) {
      console.error('Failed to fetch recipe information:', err);
      setError('Failed to fetch recipe information. Please try again later.');
    } finally {
      setIsModalLoading(false);
    }
  };

  if (error) {
    toast.error(error, { position: 'bottom-left' });
  }

  return (
    <DashboardPresentation
      isLoading={isLoading || loading}
      userData={userData}
      nutritionRecipesData={nutritionRecipesData}
      loadingNutritionData={loadingNutritionData}
      setIsWeeklyNutritionView={setIsWeeklyNutritionView}
      groupedIngredients={groupedIngredients}
      loadingGroceryData={loadingGroceryData}
      isWeeklyGroceryView={isWeeklyGroceryView}
      setIsWeeklyGroceryView={setIsWeeklyGroceryView}
      onSeeMore={handleSeeMore}
      selectedRecipeInfo={selectedRecipeInfo}
      isModalOpen={isModalOpen}
      isModalLoading={isModalLoading}
      onCloseModal={() => setIsModalOpen(false)}
    />
  );
};
