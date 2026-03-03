const { validationResult } = require('express-validator');
const authController = require('../../src/controllers/auth.controller');
const { usersService } = require('../../src/services');
const { responseHandler } = require('../../src/helpers');

jest.mock('express-validator');
jest.mock('../../src/services', () => ({
  usersService: {
    loadUser: jest.fn(),
    login: jest.fn(),
  },
}));
jest.mock('../../src/helpers', () => {
  const original = jest.requireActual('../../src/helpers');
  return { ...original, responseHandler: jest.fn() };
});

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, 'log').mockImplementation(() => {});
    responseHandler.mockImplementation((success, code, message, data) => ({ success, code, message, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadUser', () => {
    it('should load user data and return success response', async () => {
      req.user.id = 1;
      const successData = { code: 200, data: { username: 'testuser' } };
      
      usersService.loadUser.mockImplementation((id, cb) => cb(null, successData));

      await authController.loadUser(req, res, jest.fn());

      expect(usersService.loadUser).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });

    it('should handle service errors', async () => {
      req.user.id = 1;
      const errorData = { code: 500, message: 'Error loading user' };
      
      usersService.loadUser.mockImplementation((id, cb) => cb(errorData, null));

      await authController.loadUser(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(errorData);
    });
  });

  describe('login', () => {
    it('should handle validation errors', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Validation error' }],
      });

      await authController.login(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 400, message: 'Validation error' })
      );
    });

    it('should log in user and return token payload', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body = { username: 'testuser', password: 'password123' };
      
      const successData = { code: 200, data: { token: 'mockToken' } };
      usersService.login.mockImplementation((user, cb) => cb(null, successData));

      await authController.login(req, res, jest.fn());

      expect(usersService.login).toHaveBeenCalledWith(
        { username: 'testuser', password: 'password123' },
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });
});
