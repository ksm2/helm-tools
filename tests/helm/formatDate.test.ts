import { formatDate } from '../../src/helm/formatDate';

describe('formatDate', () => {
  const tz = jest.spyOn(Date.prototype, 'getTimezoneOffset');

  it('should print a UTC date', () => {
    const date = new Date(2134, 11, 31, 23, 59, 48, 987);
    tz.mockReturnValue(0);

    expect(formatDate(date)).toBe('2134-12-31T23:59:48.987000000+00:00');
  });

  it('should print a +02:00 date', () => {
    const date = new Date(2134, 11, 31, 23, 59, 48, 987);
    tz.mockReturnValue(-120);

    expect(formatDate(date)).toBe('2134-12-31T23:59:48.987000000+02:00');
  });

  it('should print a -02:00 date', () => {
    const date = new Date(2134, 11, 31, 23, 59, 48, 987);
    tz.mockReturnValue(+270);

    expect(formatDate(date)).toBe('2134-12-31T23:59:48.987000000-04:30');
  });
});
