import { getLastSunday, getNextSaturday } from './dateHelpers';

describe('Date Helpers', () => {
  describe('getLastSunday', () => {
    it('returns the same date if it is Sunday', () => {
      const sunday = new Date('2024-04-28T15:30:00'); // Sunday
      const expected = new Date('2024-04-28T00:00:00');
      expect(getLastSunday(sunday)).toEqual(expected);
    });

    it('returns the previous Sunday if the date is not Sunday', () => {
      const wednesday = new Date('2024-04-24T10:00:00'); // Wednesday
      const expected = new Date('2024-04-21T00:00:00'); // Previous Sunday
      expect(getLastSunday(wednesday)).toEqual(expected);
    });

    it('handles dates at the beginning of the month', () => {
      const tuesday = new Date('2024-05-01T09:00:00'); // Wednesday
      const expected = new Date('2024-04-28T00:00:00'); // Previous Sunday
      expect(getLastSunday(tuesday)).toEqual(expected);
    });

    it('handles leap year dates', () => {
      const monday = new Date('2020-02-24T12:00:00'); // Monday in a leap year
      const expected = new Date('2020-02-23T00:00:00'); // Previous Sunday
      expect(getLastSunday(monday)).toEqual(expected);
    });

    it('handles year boundaries', () => {
      const friday = new Date('2023-01-06T08:00:00'); // Friday
      const expected = new Date('2023-01-01T00:00:00'); // Previous Sunday (start of the year)
      expect(getLastSunday(friday)).toEqual(expected);
    });
  });

  describe('getNextSaturday', () => {
    it('returns the same date if it is Saturday', () => {
      const saturday = new Date('2024-04-27T20:45:00'); // Saturday
      const expected = new Date('2024-04-27T00:00:00');
      expect(getNextSaturday(saturday)).toEqual(expected);
    });

    it('returns the next Saturday if the date is not Saturday', () => {
      const thursday = new Date('2024-04-25T14:15:00'); // Thursday
      const expected = new Date('2024-04-27T00:00:00'); // Next Saturday
      expect(getNextSaturday(thursday)).toEqual(expected);
    });

    it('handles dates at the end of the month', () => {
      const friday = new Date('2024-04-26T11:00:00'); // Friday
      const expected = new Date('2024-04-27T00:00:00'); // Next Saturday
      expect(getNextSaturday(friday)).toEqual(expected);
    });

    it('handles leap year dates', () => {
      const sunday = new Date('2020-02-23T07:30:00'); // Sunday in a leap year
      const expected = new Date('2020-02-29T00:00:00'); // Next Saturday (Feb 29)
      expect(getNextSaturday(sunday)).toEqual(expected);
    });

    it('handles year boundaries', () => {
      const sunday = new Date('2023-12-31T23:59:59'); // Sunday, last day of the year
      const expected = new Date('2024-01-06T00:00:00'); // Next Saturday in the new year
      expect(getNextSaturday(sunday)).toEqual(expected);
    });
  });
});
