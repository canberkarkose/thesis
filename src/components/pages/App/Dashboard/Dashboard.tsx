/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  Box,
} from '@mui/material';

import { doc, onSnapshot } from 'firebase/firestore';

import { fetchRecipeInformationBulk } from '@src/services/spoonacular-service';
import { useAuth } from '@src/contexts/AuthContext';
import { db } from '@src/firebase-config';
import { NutritionStats } from '@components/molecules/NutritionStats/NutritionStats';
import { GroceryTable } from '@components/organisms/GroceryTable/GroceryTable';

export const Dashboard = () => {
  const { user, loading } = useAuth();
  const [loadingNutritionData, setLoadingNutritionData] = useState(true);
  const [loadingGroceryData, setLoadingGroceryData] = useState(true);

  // States for NutritionStats
  const [isWeeklyNutritionView, setIsWeeklyNutritionView] = useState(true);
  const [nutritionDateRange, setNutritionDateRange] = useState<Date[]>([]);
  const [nutritionRecipesData, setNutritionRecipesData] = useState<any[]>([]);

  // States for GroceryTable
  const [isWeeklyGroceryView, setIsWeeklyGroceryView] = useState(true);
  const [groceryDateRange, setGroceryDateRange] = useState<Date[]>([]);
  const [groupedIngredients, setGroupedIngredients] = useState<{ [key: string]: any[] }>({});
  const [groceryListData, setGroceryListData] = useState<any[]>([]);

  // Common States
  const [userMeals, setUserMeals] = useState<any>({});

  // Function to determine the selected date range based on view (daily or weekly)
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
    setNutritionDateRange(determineDateRange(isWeeklyNutritionView));
  }, [isWeeklyNutritionView]);

  useEffect(() => {
    setGroceryDateRange(determineDateRange(isWeeklyGroceryView));
  }, [isWeeklyGroceryView]);

  // Fetch user meals data
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
      const fetchRecipes = async () => {
        try {
          setLoadingNutritionData(true);
          const responseRecipesData = await fetchRecipeInformationBulk(uniqueIds);
          setNutritionRecipesData(responseRecipesData);
        } catch (error) {
          console.error('Error fetching recipe information:', error);
        } finally {
          setLoadingNutritionData(false);
        }
      };

      fetchRecipes();
    } else {
      setNutritionRecipesData([]);
      setLoadingNutritionData(false);
    }
  }, [nutritionDateRange]);

  useEffect(() => {
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
      const fetchRecipes = async () => {
        try {
          setLoadingGroceryData(true);
          const responseRecipesData = await fetchRecipeInformationBulk(uniqueIds);
          setGroceryListData(responseRecipesData);
        } catch (error) {
          console.error('Error fetching recipe information:', error);
        } finally {
          setLoadingGroceryData(false);
        }
      };

      fetchRecipes();
    } else {
      setGroceryListData([]);
      setLoadingGroceryData(false);
    }
  }, [groceryDateRange]);

  // Fetch GroceryTable data
  useEffect(() => {
    setLoadingGroceryData(true);
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
    setLoadingGroceryData(false);
  }, [groceryListData]);

  return (
    <Box
      sx={{
        display: 'flex',
        padding: '16px',
        gap: '16px',
        justifyContent: 'space-between',
      }}
    >
      {/* Nutrition Stats */}
      <Box sx={{ flex: '1 1 40%' }}>
        <NutritionStats
          recipesData={nutritionRecipesData}
          loading={loadingNutritionData || loading}
          setIsWeeklyView={setIsWeeklyNutritionView}
        />
      </Box>

      {/* Grocery Table */}
      <Box sx={{ flex: '1 1 35%' }}>
        <GroceryTable
          groupedIngredients={groupedIngredients}
          loading={loadingGroceryData || loading}
          showControls
          isWeeklyView={isWeeklyGroceryView}
          setIsWeeklyView={setIsWeeklyGroceryView}
        />
      </Box>
    </Box>
  );
};
