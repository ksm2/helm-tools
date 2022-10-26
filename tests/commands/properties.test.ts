import { formatProperties } from '../../src/commands/properties';

describe('properties', () => {
  describe('formatProperties', () => {
    it('should format an empty object', () => {
      expect(formatProperties({})).toBe('');
    });

    it('should format an object with one entry', () => {
      expect(formatProperties({ lorem: 'ipsum' })).toBe('lorem=ipsum\n');
    });

    it('should format an object with multiple entries', () => {
      expect(formatProperties({ a: '1', b: '2', c: '3' })).toBe('a=1\nb=2\nc=3\n');
    });
  });
});
