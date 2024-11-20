/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
import { useEffect, useState } from 'react';

import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

import { Box } from '@mui/material';

import { getWeek } from 'date-fns';

import { StyledToggleButtonGroup, StyledToggleButton } from './GroceryList.styles';

import { GroceryTable } from '@components/organisms/GroceryTable/GroceryTable';

import { db } from '@src/firebase-config';

import { fetchRecipeInformationBulk } from '@src/services/spoonacular-service';

import { useAuth } from '@src/contexts/AuthContext';

const getCurrentWeekNumber = () => {
  const today = new Date();
  return getWeek(today, { weekStartsOn: 0 });
};

export const GroceryList = () => {
  const { user, loading } = useAuth();
  const [userMeals, setUserMeals] = useState<any>({});
  const [selectedDateRange, setSelectedDateRange] = useState<Date[]>([]);
  const [recipeIds, setRecipeIds] = useState<number[]>([]);
  const [recipesData, setRecipesData] = useState<any[]>([]);
  const [ingredientsList, setIngredientsList] = useState<any[]>([]);
  const [groupedIngredients, setGroupedIngredients] = useState<{ [key: string]: any[] }>({});
  const [isWeeklyView, setIsWeeklyView] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<{ [key: number]: boolean }>({});
  const [storedWeekNumber, setStoredWeekNumber] = useState<number | null>(null);
  const [dataCleared, setDataCleared] = useState<boolean>(false);
  const [lastInteractedIngredientId, setLastInteractedIngredientId] = useState<number | null>(null);

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

          // Fetch checked ingredients
          const groceryItems = data.GroceryItems || {};
          setCheckedIngredients(groceryItems);

          // Fetch stored week number
          const storedWeek = data.groceryWeek || null;
          setStoredWeekNumber(storedWeek);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user, selectedDateRange]);

  useEffect(() => {
    const currentWeekNumber = getCurrentWeekNumber();

    if (storedWeekNumber !== null && storedWeekNumber !== currentWeekNumber && !dataCleared) {
      // Week has changed, clear GroceryItems
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);

        updateDoc(userDocRef, {
          GroceryItems: {},
          groceryWeek: currentWeekNumber,
        })
          .then(() => {
            setCheckedIngredients({});
            setDataCleared(true); // Prevent repeated clearing
          })
          .catch((error) => {
            console.error('Error clearing GroceryItems:', error);
          });
      }
    }
  }, [storedWeekNumber, user, dataCleared]);

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

  useEffect(() => {
    const grouped = ingredientsList.reduce((acc: any, ingredient: any) => {
      const aisle = ingredient.aisle || 'Other';
      if (!acc[aisle]) {
        acc[aisle] = [];
      }
      acc[aisle].push(ingredient);
      return acc;
    }, {});

    setGroupedIngredients(grouped);
  }, [ingredientsList]);

  // Helper function to combine ingredients
  const combineIngredients = (ingredients: any[]) => {
    const combined = ingredients.reduce((acc: any, ingredient: any) => {
      const key = `${ingredient.name.toLowerCase()}-${ingredient.aisle.toLowerCase()}`;
      if (!acc[key]) {
        acc[key] = { ...ingredient };
      } else {
        acc[key].amount += ingredient.amount;
      }
      return acc;
    }, {});

    // Attach checked state
    Object.values(combined).forEach((ingredient: any) => {
      const ingredientId = ingredient.id;
      // eslint-disable-next-line no-param-reassign
      ingredient.checked = checkedIngredients[ingredientId] || false;
    });

    return Object.values(combined);
  };

  const handleIngredientCheck = (ingredientId: number, checked: boolean) => {
    setLastInteractedIngredientId(ingredientId);
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingredientId]: checked,
    }));

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedGroceryItems = {
        ...checkedIngredients,
        [ingredientId]: checked,
      };

      if (!checked) {
        delete updatedGroceryItems[ingredientId];
      }

      const currentWeekNumber = getCurrentWeekNumber();

      updateDoc(userDocRef, {
        GroceryItems: updatedGroceryItems,
        groceryWeek: currentWeekNumber,
      }).catch((error) => {
        console.error('Error updating GroceryItems:', error);
      });
    }
  };

  useEffect(() => {
    if (recipesData && recipesData.length > 0) {
      const allIngredients: any[] = [];

      recipesData.forEach((recipe: any) => {
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

      // Combine ingredients with the same name and aisle
      const combinedIngredients = combineIngredients(allIngredients);
      setIngredientsList(combinedIngredients);
    } else {
      setIngredientsList([]);
    }
  }, [recipesData]);

  // Toggle between daily and weekly view
  const handleViewToggle = (_event: any, newView: string) => {
    if (newView !== null) {
      setIsWeeklyView(newView === 'weekly');
    }
  };

  return (
    <Box>
      <Box display='flex' justifyContent='center' mb={2}>
        <StyledToggleButtonGroup
          value={isWeeklyView ? 'weekly' : 'daily'}
          exclusive
          onChange={handleViewToggle}
          aria-label='View Toggle'
          disabled={loading || loadingData}
        >
          <StyledToggleButton value='daily' aria-label='Daily View'>
            Daily
          </StyledToggleButton>
          <StyledToggleButton value='weekly' aria-label='Weekly View'>
            Weekly
          </StyledToggleButton>
        </StyledToggleButtonGroup>
      </Box>
      <GroceryTable
        groupedIngredients={groupedIngredients}
        loading={loading || loadingData}
        onIngredientCheck={handleIngredientCheck}
        lastInteractedIngredientId={lastInteractedIngredientId}
        isWeeklyView={isWeeklyView}
      />
    </Box>
  );
};
