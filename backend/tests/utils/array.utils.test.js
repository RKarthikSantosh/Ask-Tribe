const { sequelizeResponse, mergeById } = require('../../src/utils/array.utils');

describe('Array Utils', () => {
  describe('sequelizeResponse', () => {
    it('should extract specified parameters from model data values', () => {
      const model = {
        getDataValue: jest.fn((key) => {
          const data = { id: 1, name: 'Test', status: 'active' };
          return data[key];
        }),
      };

      const result = sequelizeResponse(model, 'id', 'name');
      expect(result).toEqual({ id: 1, name: 'Test' });
      expect(model.getDataValue).toHaveBeenCalledWith('id');
      expect(model.getDataValue).toHaveBeenCalledWith('name');
      expect(model.getDataValue).toHaveBeenCalledTimes(2);
    });
  });

  describe('mergeById', () => {
    it('should merge two arrays of objects by id properties', () => {
      const arr1 = [{ id: 1, valA: 'A1' }, { id: 2, valA: 'A2' }];
      const arr2 = [{ id: 1, valB: 'B1' }, { id: 3, valB: 'B3' }];

      const result = mergeById(arr1, arr2);
      expect(result).toEqual([
        { id: 1, valA: 'A1', valB: 'B1' },
        { id: 2, valA: 'A2' }, // No matching id in arr2
      ]);
    });
  });
});
