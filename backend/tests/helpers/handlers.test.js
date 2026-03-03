const { responseHandler, asyncHandler } = require('../../src/helpers/handlers');

describe('Handlers Helper', () => {
  describe('responseHandler', () => {
    it('should return a formatted response object with default values', () => {
      const result = responseHandler(true);
      expect(result).toEqual({
        success: true,
        code: 400,
        message: 'valid',
        data: undefined,
      });
    });

    it('should return a formatted response object with provided values', () => {
      const result = responseHandler(false, 404, 'Not Found', { error: 'Item not found' });
      expect(result).toEqual({
        success: false,
        code: 404,
        message: 'Not Found',
        data: { error: 'Item not found' },
      });
    });
  });

  describe('asyncHandler', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
      mockReq = {};
      mockRes = {};
      mockNext = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should resolve the promise if the wrapped function executes successfully', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const wrappedFn = asyncHandler(fn);
      
      await wrappedFn(mockReq, mockRes, mockNext);
      expect(fn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });

    it('should catch errors and return responseHandler response on failure', async () => {
      // The original asyncHandler catches error but DOES NOT call res.send or next(error).
      // It just calls console.log and responseHandler without a return context mapped to res.
      // We test that it catches and logs correctly.
      const error = new Error('Test error');
      const fn = jest.fn().mockRejectedValue(error);
      const wrappedFn = asyncHandler(fn);
      
      await wrappedFn(mockReq, mockRes, mockNext);
      expect(fn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(console.log).toHaveBeenCalledWith(error);
    });
  });
});
