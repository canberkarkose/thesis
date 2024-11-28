import { getFormattedDate, initializeSlots } from './calendarUtils';

describe('getFormattedDate', () => {
  it('should return the formatted date in YYYY-MM-DD format', () => {
    const date = new Date(2024, 10, 25); // November 25, 2024
    const formattedDate = getFormattedDate(date);
    expect(formattedDate).toBe('2024-11-25');
  });

  it('should pad single-digit months and days with a leading zero', () => {
    const date = new Date(2024, 0, 5); // January 5, 2024
    const formattedDate = getFormattedDate(date);
    expect(formattedDate).toBe('2024-01-05');
  });
});

describe('initializeSlots', () => {
  it('should return a DateSlots object with slots for each date between startDate and endDate', () => {
    const startDate = new Date(2024, 10, 25); // November 25, 2024
    const endDate = new Date(2024, 10, 27); // November 27, 2024
    const slots = initializeSlots(startDate, endDate);

    expect(Object.keys(slots)).toEqual(['2024-11-25', '2024-11-26', '2024-11-27']);
    expect(slots['2024-11-25']).toEqual([
      { label: 'Breakfast' },
      { label: 'Lunch' },
      { label: 'Dinner' },
      { label: 'Dessert' },
    ]);
  });

  it('should return an empty object if startDate is after endDate', () => {
    const startDate = new Date(2024, 10, 28); // November 28, 2024
    const endDate = new Date(2024, 10, 27); // November 27, 2024
    const slots = initializeSlots(startDate, endDate);

    expect(slots).toEqual({});
  });

  it('should include only one date if startDate and endDate are the same', () => {
    const startDate = new Date(2024, 10, 25); // November 25, 2024
    const endDate = new Date(2024, 10, 25); // November 25, 2024
    const slots = initializeSlots(startDate, endDate);

    expect(Object.keys(slots)).toEqual(['2024-11-25']);
    expect(slots['2024-11-25']).toEqual([
      { label: 'Breakfast' },
      { label: 'Lunch' },
      { label: 'Dinner' },
      { label: 'Dessert' },
    ]);
  });

  it('should handle a single-day range correctly', () => {
    const startDate = new Date(2024, 10, 26); // November 26, 2024
    const endDate = new Date(2024, 10, 26); // November 26, 2024
    const slots = initializeSlots(startDate, endDate);

    expect(Object.keys(slots)).toEqual(['2024-11-26']);
    expect(slots['2024-11-26']).toEqual([
      { label: 'Breakfast' },
      { label: 'Lunch' },
      { label: 'Dinner' },
      { label: 'Dessert' },
    ]);
  });
});
