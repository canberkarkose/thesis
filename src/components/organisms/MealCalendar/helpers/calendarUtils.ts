/* eslint-disable import/no-cycle */
import { Recipe } from '../MealCalendar';

interface MealSlot {
  label: string;
  recipe?: Recipe;
}

interface DateSlots {
  [date: string]: MealSlot[];
}

export const getFormattedDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const initializeSlots = (startDate: Date, endDate: Date): DateSlots => {
  const slots: DateSlots = {};

  const date = new Date(startDate);
  while (date <= endDate) {
    const dateString = getFormattedDate(date);
    slots[dateString] = [
      { label: 'Breakfast' },
      { label: 'Lunch' },
      { label: 'Dinner' },
      { label: 'Dessert' },
    ];
    date.setDate(date.getDate() + 1);
  }

  return slots;
};
