const { isArrayEmpty, isNull } = require('../../src/utils/conditional.utils');

describe('Conditional Utils', () => {
  describe('isArrayEmpty', () => {
    it('should return true if array is empty', () => {
      expect(isArrayEmpty([])).toBe(true);
    });

    it('should return false if array is not empty', () => {
      expect(isArrayEmpty([1])).toBe(false);
    });
  });

  describe('isNull', () => {
    it('should return true if object is null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false if object is not null', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull({})).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull(0)).toBe(false);
    });
  });
});
