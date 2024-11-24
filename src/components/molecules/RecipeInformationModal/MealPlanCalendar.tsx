/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, Button, CircularProgress
} from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import { addMealToUserPlan } from '@src/services/auth-service';

import { getLastSunday, getNextSaturday } from '@src/helpers/dateHelpers';

import { db } from '@src/firebase-config';

import { useAuth } from '@src/contexts/AuthContext';
import { RecipeInformation } from '@components/pages/App/Recipes/Recipes.types';

interface MealPlanCalendarProps {
  onClose: () => void;
  mealType: string;
  recipeInfo: RecipeInformation | null;
}

export const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({
  onClose,
  mealType,
  recipeInfo,
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchDisabledDates = async () => {
      if (!user) return;
      try {
        const today = new Date();
        const startOfCurrentWeek = getLastSunday(today);

        const minWeeklyDate = today;

        const maxWeeklyDate = new Date(startOfCurrentWeek);
        maxWeeklyDate.setDate(startOfCurrentWeek.getDate() + 21);

        const calculatedMinDate = getLastSunday(minWeeklyDate);
        const calculatedMaxDate = getNextSaturday(maxWeeklyDate);
        setMinDate(calculatedMinDate);
        setMaxDate(calculatedMaxDate);

        // Fetch user's meal plan to find occupied slots
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        const occupiedDates: Date[] = [];

        if (userDoc.exists()) {
          const data = userDoc.data();
          const meals = data.Meals || {};

          for (const dateStr in meals) {
            if (Object.prototype.hasOwnProperty.call(meals, dateStr)) {
              const mealDate = new Date(dateStr);
              const mealSlots = meals[dateStr];

              if (mealSlots[mealType]) {
                occupiedDates.push(mealDate);
              }
            }
          }
        }

        setDisabledDates(occupiedDates);
      } catch (error) {
        console.error('Error fetching disabled dates:', error);
        toast.error('Failed to fetch calendar data. Please try again later.', { position: 'bottom-left' });
      } finally {
        setLoading(false);
      }
    };

    fetchDisabledDates();
  }, [user, mealType]);

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) {
      return true;
    }
    if (maxDate && date > maxDate) {
      return true;
    }
    return disabledDates.some(
      (disabledDate) => disabledDate.toDateString() === date.toDateString()
    );
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleAddMeal = async () => {
    if (!user || !selectedDate || !recipeInfo) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    try {
      await addMealToUserPlan(user.uid, dateStr, mealType, recipeInfo);
      // make first letter uppercase
      toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} added to your plan!`, { position: 'bottom-left' });
      onClose();
    } catch (error) {
      console.error('Error adding meal to plan:', error);
      toast.error('Failed to add meal to your plan. Please try again.', { position: 'bottom-left' });
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        Select a date for your
        {' '}
        {mealType}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              shouldDisableDate={isDateDisabled}
              minDate={minDate || undefined}
              maxDate={maxDate || undefined}
            />
          </LocalizationProvider>
        )}
        <Box display='flex' justifyContent='flex-end'>
          <Button
            onClick={onClose}
            sx={{
              mr: 1,
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleAddMeal}
            sx={{
              backgroundColor: '#5b9d3e',
              '&:hover': {
                backgroundColor: '#4a8c34',
              },
            }}
            disabled={!selectedDate || isDateDisabled(selectedDate)}
          >
            Add Meal
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
