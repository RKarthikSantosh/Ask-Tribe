const { getRandomInt } = require('../../src/utils/math.utils');

describe('Math Utils', () => {
  describe('getRandomInt', () => {
    it('should return an integer between 1 and the specified max', () => {
      const max = 10;
      const result = getRandomInt(max);
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(max);
    });

    it('should default to max 100 if not specified', () => {
      const result = getRandomInt();
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(100);
    });
  });
});
