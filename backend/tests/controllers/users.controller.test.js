const { validationResult } = require('express-validator');
const usersController = require('../../src/controllers/users.controller');
const { usersService } = require('../../src/services');
const { responseHandler } = require('../../src/helpers');

jest.mock('express-validator');
jest.mock('../../src/services', () => ({
  usersService: {
    retrieveOne: jest.fn(),
    retrieveAll: jest.fn(),
    register: jest.fn(),
  },
}));
jest.mock('../../src/helpers', () => {
  const original = jest.requireActual('../../src/helpers');
  return { ...original, responseHandler: jest.fn() };
});

describe('Users Controller', () => {
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

  describe('getOneUser', () => {
    it('should retrieve a single user', async () => {
      req.params.id = 1;
      const successData = { code: 200, data: { id: 1, username: 'testuser' } };
      usersService.retrieveOne.mockImplementation((id, cb) => cb(null, successData));

      await usersController.getOneUser(req, res, jest.fn());

      expect(usersService.retrieveOne).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve all users', async () => {
      const successData = { code: 200, data: [{ id: 1, username: 'testuser' }] };
      usersService.retrieveAll.mockImplementation((cb) => cb(null, successData));

      await usersController.getAllUsers(req, res, jest.fn());

      expect(usersService.retrieveAll).toHaveBeenCalledWith(expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });

  describe('register', () => {
    it('should handle validation errors', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Validation error' }],
      });

      await usersController.register(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 400, message: 'Validation error' })
      );
    });

    it('should handle successful registration', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body = { username: 'testuser', password: 'password123' };
      
      const successData = { code: 201, data: { token: 'mockToken' } };
      usersService.register.mockImplementation((user, cb) => cb(null, successData));

      await usersController.register(req, res, jest.fn());

      expect(usersService.register).toHaveBeenCalledWith(
        { username: 'testuser', password: 'password123' },
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });
});
