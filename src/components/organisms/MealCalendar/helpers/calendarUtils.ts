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

export const getLastSunday = (date: Date) => {
  const lastSunday = new Date(date);
  const day = lastSunday.getDay();
  lastSunday.setDate(lastSunday.getDate() - day);
  lastSunday.setHours(0, 0, 0, 0);
  return lastSunday;
};

export const getNextSaturday = (date: Date) => {
  const nextSaturday = new Date(date);
  const day = nextSaturday.getDay();
  nextSaturday.setDate(nextSaturday.getDate() + (6 - day));
  nextSaturday.setHours(0, 0, 0, 0);
  return nextSaturday;
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
