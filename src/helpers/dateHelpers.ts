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
