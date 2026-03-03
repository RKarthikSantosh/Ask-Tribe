const bcrypt = require('bcryptjs');
const usersService = require('../../src/services/users.service');
const { UsersRepository } = require('../../src/repositories');
const { responseHandler, getJwtToken } = require('../../src/helpers');

jest.mock('bcryptjs');
jest.mock('../../src/repositories', () => ({
  UsersRepository: {
    create: jest.fn(),
    retrieveOne: jest.fn(),
    retrieveAll: jest.fn(),
    incrementViews: jest.fn(),
    retrieveOneWithCounts: jest.fn(),
  },
}));
jest.mock('../../src/helpers');

describe('Users Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should hash password, create user, and return token payload', async () => {
      const newUser = { username: 'testuser', password: 'password123' };
      const resultCb = jest.fn();

      bcrypt.genSalt.mockResolvedValue('randomsalt');
      bcrypt.hash.mockResolvedValue('hashedpassword');
      UsersRepository.create.mockResolvedValue({ dataValues: { id: 1 } });

      const payload = await usersService.register(newUser, resultCb);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'randomsalt');
      expect(UsersRepository.create).toHaveBeenCalledWith({ username: 'testuser', password: 'hashedpassword' });
      expect(getJwtToken).toHaveBeenCalledWith({ user: { id: 1 } }, 'User registered', resultCb);
      expect(payload).toEqual({ user: { id: 1 } });
    });
  });

  describe('login', () => {
    it('should return 404 if user does not exist', async () => {
      const userCredentials = { username: 'testuser', password: 'password123' };
      const resultCb = jest.fn();

      UsersRepository.retrieveOne.mockResolvedValue(null);
      responseHandler.mockReturnValue('notFoundResponse');

      const result = await usersService.login(userCredentials, resultCb);

      expect(UsersRepository.retrieveOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(resultCb).toHaveBeenCalledWith('notFoundResponse', null);
      expect(result).toBeNull();
    });

    it('should return 400 if password does not match', async () => {
      const userCredentials = { username: 'testuser', password: 'wrongpassword' };
      const resultCb = jest.fn();

      UsersRepository.retrieveOne.mockResolvedValue({ id: 1, password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(false);
      responseHandler.mockReturnValue('incorrectPasswordResponse');

      const result = await usersService.login(userCredentials, resultCb);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(resultCb).toHaveBeenCalledWith('incorrectPasswordResponse', null);
      expect(result).toBeNull();
    });

    it('should return token payload if login successful', async () => {
      const userCredentials = { username: 'testuser', password: 'correctpassword' };
      const resultCb = jest.fn();

      UsersRepository.retrieveOne.mockResolvedValue({ id: 1, password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(true);

      const payload = await usersService.login(userCredentials, resultCb);

      expect(getJwtToken).toHaveBeenCalledWith({ user: { id: 1 } }, 'User logged in', resultCb);
      expect(payload).toEqual({ user: { id: 1 } });
    });
  });

  describe('retrieveAll', () => {
    it('should call UsersRepository.retrieveAll', () => {
      const resultCb = jest.fn();
      usersService.retrieveAll(resultCb);
      expect(UsersRepository.retrieveAll).toHaveBeenCalledWith(resultCb);
    });
  });

  describe('retrieveOne', () => {
    it('should increment views and return the user', async () => {
      const id = 1;
      const resultCb = jest.fn();

      UsersRepository.retrieveOneWithCounts.mockResolvedValue({ id: 1, username: 'testuser' });
      responseHandler.mockReturnValue('successResponse');

      await usersService.retrieveOne(id, resultCb);

      expect(UsersRepository.incrementViews).toHaveBeenCalledWith(id);
      expect(UsersRepository.retrieveOneWithCounts).toHaveBeenCalledWith(id);
      expect(resultCb).toHaveBeenCalledWith(null, 'successResponse');
    });
  });

  describe('loadUser', () => {
    it('should load user data and return response', async () => {
      const userId = 1;
      const resultCb = jest.fn();

      UsersRepository.retrieveOne.mockResolvedValue({ id: 1, username: 'testuser' });
      responseHandler.mockReturnValue('successResponse');

      await usersService.loadUser(userId, resultCb);

      expect(UsersRepository.retrieveOne).toHaveBeenCalledWith({ id: userId }, resultCb);
      expect(resultCb).toHaveBeenCalledWith(null, 'successResponse');
    });
  });
});
