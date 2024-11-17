/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
// MealCalendar.tsx
/* eslint-disable import/no-cycle */

import { useEffect, useState } from 'react';
import {
  Box, CircularProgress, Grid, Typography,
} from '@mui/material';

import { doc, onSnapshot } from 'firebase/firestore';

import {
  CalendarContainer,
  HeaderContainer,
  MealSlotContainer,
  DayContainer,
  ToggleViewButton,
} from './MealCalendar.styles';

import {
  getLastSunday, getNextSaturday, initializeSlots, getFormattedDate
} from './helpers/calendarUtils';

import { useAuth } from '@src/contexts/AuthContext';

import { addMealToUserPlan, deleteMealFromUserPlan } from '@src/services/auth-service';
import { MealSlot } from '@components/molecules/MealSlot/MealSlot';
import { DateNavigator } from '@components/molecules/DateNavigator/DateNavigator';
import { db } from '@src/firebase-config';

export interface Recipe {
  id: number;
  title: string;
  image?: string;
}
interface MealCalendarProps {
  recipeToAdd: Recipe | null;
  onRecipeAdded: () => void;
  type: string;
  onSeeMore: (recipeId: number) => void;
}

interface MealSlot {
  label: string;
  recipe?: Recipe;
}

interface DateSlots {
  [date: string]: MealSlot[];
}

const initialSlots: MealSlot[] = [
  { label: 'Breakfast' },
  { label: 'Lunch' },
  { label: 'Dinner' },
  { label: 'Dessert' },
];

export const MealCalendar = (
  {
    recipeToAdd, onRecipeAdded, type, onSeeMore
  }
  : MealCalendarProps
) => {
  const today = new Date();
  const startOfCurrentWeek = getLastSunday(today);

  const minWeeklyDate = new Date(startOfCurrentWeek);
  minWeeklyDate.setDate(startOfCurrentWeek.getDate() - 7);

  const maxWeeklyDate = new Date(startOfCurrentWeek);
  maxWeeklyDate.setDate(startOfCurrentWeek.getDate() + 21);

  const minDailyDate = getLastSunday(minWeeklyDate);
  const maxDailyDate = getNextSaturday(maxWeeklyDate);

  const [view, setView] = useState<'daily' | 'weekly'>('weekly');
  const [currentDate, setCurrentDate] = useState<Date>(startOfCurrentWeek);
  const [dateSlots, setDateSlots] = useState<DateSlots>(
    () => initializeSlots(minDailyDate, maxDailyDate)
  );
  const [editMode, setEditMode] = useState(false);
  const { user, loading } = useAuth();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const meals = data.Meals || {};

          setDateSlots((prevDateSlots) => {
            const updatedSlots = { ...prevDateSlots };

            Object.keys(meals).forEach((date) => {
              if (!updatedSlots[date]) {
                updatedSlots[date] = initialSlots.map((slot) => ({ ...slot }));
              }
              const dayMeals = meals[date];
              updatedSlots[date] = updatedSlots[date].map((slot) => {
                const meal = dayMeals[slot.label.toLowerCase()];
                return {
                  ...slot,
                  recipe: meal
                    ? {
                      id: meal.id,
                      title: meal.title,
                      image: meal.image,
                    }
                    : undefined,
                };
              });
            });
            return updatedSlots;
          });
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    if (recipeToAdd) {
      setEditMode(false);
    }
  }, [recipeToAdd]);

  const handleSlotClick = async (slotIndex: number, date: string) => {
    if (recipeToAdd && user) {
      const daySlots = dateSlots[date];
      if (!daySlots) {
        console.error(`No slots found for date: ${date}`);
        return;
      }
      const slotLabel = daySlots[slotIndex].label.toLowerCase();
      try {
        await addMealToUserPlan(user.uid, date, slotLabel, recipeToAdd);
        onRecipeAdded();
      } catch (error) {
        console.error('Error saving meal to Firebase:', error);
      }
    }
  };

  const handleDeleteClick = async (slotIndex: number, date: string) => {
    setEditMode(false);
    if (user) {
      const daySlots = dateSlots[date];
      if (!daySlots) {
        console.error(`No slots found for date: ${date}`);
        return;
      }
      const slotLabel = daySlots[slotIndex].label.toLowerCase();

      try {
        await deleteMealFromUserPlan(user.uid, date, slotLabel);
      } catch (error) {
        console.error('Error deleting meal from Firebase:', error);
      }
    }
  };

  const isViewDaily = view === 'daily';

  const toggleView = () => {
    setEditMode(false);
    setView(isViewDaily ? 'weekly' : 'daily');
    setCurrentDate(isViewDaily ? startOfCurrentWeek : today);
  };

  const changeDate = (direction: 'back' | 'forward') => {
    setEditMode(false);
    const newDate = new Date(currentDate);
    const increment = isViewDaily ? 1 : 7;
    newDate.setDate(currentDate.getDate() + (direction === 'back' ? -increment : increment));

    const alignedDate = isViewDaily ? newDate : getLastSunday(newDate);

    const minDate = isViewDaily ? minDailyDate : minWeeklyDate;
    const maxDate = isViewDaily ? maxDailyDate : maxWeeklyDate;

    const alignedTime = alignedDate.setHours(0, 0, 0, 0);
    const minTime = minDate.setHours(0, 0, 0, 0);
    const maxTime = maxDate.setHours(0, 0, 0, 0);

    if (alignedTime >= minTime && alignedTime <= maxTime) {
      setCurrentDate(alignedDate);
    }
  };

  const hasMealsInView = () => {
    if (isViewDaily) {
      const dateString = getFormattedDate(currentDate);
      const daySlots = dateSlots[dateString];
      return daySlots?.some((slot) => slot.recipe);
    }
    // Weekly view
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentDate.getTime());
      dayDate.setDate(currentDate.getDate() + i);
      const dateString = getFormattedDate(dayDate);
      const daySlots = dateSlots[dateString];
      if (daySlots?.some((slot) => slot.recipe)) {
        return true;
      }
    }
    return false;
  };

  const showEditButton = hasMealsInView();

  const renderMealSlots = (date: string) => {
    const daySlots = dateSlots[date] || initialSlots;
    return (
      <MealSlotContainer isDaily={isViewDaily}>
        {daySlots.map((slot, index) => {
          const isAddable = (type === 'main course' && (slot.label === 'Lunch' || slot.label === 'Dinner'))
            || (type === 'breakfast' && slot.label === 'Breakfast')
            || (type === 'dessert' && slot.label === 'Dessert');

          const slotOpacity = recipeToAdd ? (isAddable ? 1 : 0.5) : 1;

          return (
            <MealSlot
              key={slot.label}
              slot={slot}
              index={index}
              date={date}
              isDaily={isViewDaily}
              isAddable={isAddable}
              slotOpacity={slotOpacity}
              recipeToAdd={recipeToAdd}
              handleSlotClick={handleSlotClick}
              onSeeMore={onSeeMore}
              handleDeleteClick={handleDeleteClick}
              editMode={editMode}
            />
          );
        })}
      </MealSlotContainer>
    );
  };

  const formatDisplayDate = () => {
    if (isViewDaily) {
      return currentDate.toDateString();
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <CalendarContainer>
        <Box display='flex' justifyContent='center' alignItems='center' minHeight='675px'>
          <CircularProgress />
        </Box>
      </CalendarContainer>
    );
  }

  return (
    <CalendarContainer>
      <HeaderContainer>
        <Typography variant='h5'>Meal Calendar</Typography>
        <ToggleViewButton onClick={toggleView}>
          Switch to
          {' '}
          {isViewDaily ? 'Weekly' : 'Daily'}
          {' '}
          View
        </ToggleViewButton>
      </HeaderContainer>
      <DateNavigator
        isViewDaily={isViewDaily}
        currentDate={currentDate}
        minDailyDate={minDailyDate}
        minWeeklyDate={minWeeklyDate}
        maxDailyDate={maxDailyDate}
        maxWeeklyDate={maxWeeklyDate}
        formatDisplayDate={formatDisplayDate}
        changeDate={changeDate}
        showEditButton={showEditButton}
        editMode={editMode}
        setEditMode={setEditMode}
        recipeToAdd={recipeToAdd}
      />
      {isViewDaily ? (
        <Box>{renderMealSlots(getFormattedDate(currentDate))}</Box>
      ) : (
        <Grid container spacing={2}>
          {Array.from({ length: 7 }).map((_, index) => {
            const dayDate = new Date(currentDate.getTime());
            dayDate.setDate(currentDate.getDate() + index);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <DayContainer item xs={12} sm={3} md={1.7} key={index}>
                <Typography variant='h6' textAlign='center'>
                  {dayDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                </Typography>
                {renderMealSlots(getFormattedDate(dayDate))}
              </DayContainer>
            );
          })}
        </Grid>
      )}
    </CalendarContainer>
  );
};
