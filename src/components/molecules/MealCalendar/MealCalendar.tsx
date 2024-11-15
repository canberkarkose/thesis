/* eslint-disable @typescript-eslint/no-explicit-any */
// MealCalendar.tsx

import { useState } from 'react';
import {
  Box, Button, Grid, Typography
} from '@mui/material';

import {
  CalendarContainer,
  HeaderContainer,
  DateNavigator,
  MealSlotContainer,
  MealSlot,
  DayContainer,
  ToggleViewButton,
  EmptySlotText,
} from './MealCalendar.styles';

import { RecipeCard } from '@components/molecules/RecipeCard/RecipeCard';

interface MealSlot {
  label: string;
  recipe?: any;
}

const initialSlots: MealSlot[] = [
  { label: 'Breakfast' },
  { label: 'Lunch' },
  { label: 'Dinner' },
  { label: 'Dessert' },
];

const getLastSunday = (date: Date) => {
  const lastSunday = new Date(date);
  const day = lastSunday.getDay();
  lastSunday.setDate(lastSunday.getDate() - day);
  lastSunday.setHours(0, 0, 0, 0);
  return lastSunday;
};

const getNextSaturday = (date: Date) => {
  const nextSaturday = new Date(date);
  const day = nextSaturday.getDay();
  nextSaturday.setDate(nextSaturday.getDate() + (6 - day));
  nextSaturday.setHours(0, 0, 0, 0);
  return nextSaturday;
};

export const MealCalendar = () => {
  const today = new Date();
  const startOfCurrentWeek = getLastSunday(today);

  const [view, setView] = useState<'daily' | 'weekly'>('weekly');
  const [currentDate, setCurrentDate] = useState<Date>(startOfCurrentWeek);

  const minWeeklyDate = new Date(startOfCurrentWeek);
  minWeeklyDate.setDate(startOfCurrentWeek.getDate() - 7);

  const maxWeeklyDate = new Date(startOfCurrentWeek);
  maxWeeklyDate.setDate(startOfCurrentWeek.getDate() + 21);

  const minDailyDate = getLastSunday(minWeeklyDate);
  const maxDailyDate = getNextSaturday(maxWeeklyDate);

  const isViewDaily = view === 'daily';

  const toggleView = () => {
    setView(isViewDaily ? 'weekly' : 'daily');
    setCurrentDate(isViewDaily ? startOfCurrentWeek : today);
  };

  const changeDate = (direction: 'back' | 'forward') => {
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

  const renderMealSlots = () => (
    <MealSlotContainer isDaily={isViewDaily}>
      {initialSlots.map((slot) => (
        <MealSlot key={slot.label} isDaily={isViewDaily}>
          <Typography variant='subtitle1'>{slot.label}</Typography>
          {!slot.recipe ? (
            <EmptySlotText>Empty</EmptySlotText>
          ) : (
            <RecipeCard
              key={slot.recipe.id}
              image={slot.recipe.image}
              title={slot.recipe.title}
              onSeeMore={() => {}}
            />
          )}
        </MealSlot>
      ))}
    </MealSlotContainer>
  );

  const formatDisplayDate = () => {
    if (isViewDaily) {
      return currentDate.toDateString();
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

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
      <DateNavigator>
        <Button
          onClick={() => changeDate('back')}
          variant='outlined'
          disabled={currentDate.getTime() <= (isViewDaily
            ? minDailyDate.getTime() : minWeeklyDate.getTime())}
          sx={{
            '&:hover': {
              backgroundColor: '#6a8f17',
              color: '#fff',
            },
          }}
        >
          {isViewDaily ? 'Previous Day' : 'Previous Week'}
        </Button>
        <Typography variant='body1' sx={{ mt: 0.7 }}>
          {formatDisplayDate()}
        </Typography>
        <Button
          onClick={() => changeDate('forward')}
          variant='outlined'
          disabled={currentDate.getTime() >= (isViewDaily
            ? maxDailyDate.getTime() : maxWeeklyDate.getTime())}
          sx={{
            '&:hover': {
              backgroundColor: '#6a8f17',
              color: '#fff',
            },
          }}
        >
          {isViewDaily ? 'Next Day' : 'Next Week'}
        </Button>
      </DateNavigator>
      {isViewDaily ? (
        <Box>{renderMealSlots()}</Box>
      ) : (
        <Grid container spacing={2}>
          {Array.from({ length: 7 }).map((_, index) => {
            const dayDate = new Date(currentDate);
            dayDate.setDate(currentDate.getDate() + index);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <DayContainer item xs={12} sm={3} md={1.7} key={index}>
                <Typography variant='h6' textAlign='center'>
                  {dayDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                </Typography>
                {renderMealSlots()}
              </DayContainer>
            );
          })}
        </Grid>
      )}
    </CalendarContainer>
  );
};
