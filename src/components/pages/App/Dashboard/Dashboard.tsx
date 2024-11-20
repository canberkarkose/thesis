/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { doc, onSnapshot } from 'firebase/firestore';

import { fetchRecipeInformationBulk } from '@src/services/spoonacular-service';
import { useAuth } from '@src/contexts/AuthContext';
import { db } from '@src/firebase-config';
import { NutritionStats } from '@components/molecules/NutritionStats/NutritionStats';

export const Dashboard = () => {
  const { user, loading } = useAuth();
  const [loadingData, setLoadingData] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState<Date[]>([]);
  const [recipeIds, setRecipeIds] = useState<number[]>([]);
  const [recipesData, setRecipesData] = useState<any[]>([]);
  const [userMeals, setUserMeals] = useState<any>({});
  const [isWeeklyView, setIsWeeklyView] = useState(true);

  // Determine the selected date range based on view (daily or weekly)
  useEffect(() => {
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

    setSelectedDateRange(dates);
  }, [isWeeklyView]);

  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const meals = data.Meals || {};
          const selectedMeals: any = {};
          selectedDateRange.forEach((date) => {
            const dateString = date.toISOString().split('T')[0];
            if (meals[dateString]) {
              selectedMeals[dateString] = meals[dateString];
            }
          });
          setUserMeals(selectedMeals);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user, selectedDateRange]);

  useEffect(() => {
    const ids: number[] = [];

    Object.values(userMeals).forEach((dayMeals: any) => {
      Object.values(dayMeals).forEach((meal: any) => {
        if (meal && meal.id) {
          ids.push(meal.id);
        }
      });
    });

    // Remove duplicate IDs
    const uniqueIds = Array.from(new Set(ids));
    setRecipeIds(uniqueIds);
  }, [userMeals]);

  useEffect(() => {
    if (recipeIds.length > 0) {
      const fetchIngredients = async () => {
        try {
          setLoadingData(true);
          const responseRecipesData = await fetchRecipeInformationBulk(recipeIds);
          setRecipesData(responseRecipesData);
        } catch (error) {
          console.error('Error fetching recipe information:', error);
          // Handle error state
        } finally {
          setLoadingData(false);
        }
      };

      fetchIngredients();
    } else {
      setRecipesData([]);
      setLoadingData(false);
    }
  }, [recipeIds]);

  return (
    <Box>
      <NutritionStats
        recipesData={recipesData}
        loading={loadingData || loading}
        setIsWeeklyView={setIsWeeklyView}
      />
    </Box>
  );
};
