const checkExistence = require('../../src/middleware/checkExistence');
const { UsersRepository } = require('../../src/repositories');
const { responseHandler } = require('../../src/helpers');

jest.mock('../../src/repositories', () => ({
  UsersRepository: { retrieveOne: jest.fn() },
}));
jest.mock('../../src/helpers');

describe('CheckExistence Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: { username: 'testuser' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    responseHandler.mockImplementation((success, code, message, data) => ({ success, code, message, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if user already exists', async () => {
    UsersRepository.retrieveOne.mockResolvedValue({ id: 1, username: 'testuser' });

    await checkExistence(req, res, next);

    expect(UsersRepository.retrieveOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user does not exist', async () => {
    UsersRepository.retrieveOne.mockResolvedValue(null);

    await checkExistence(req, res, next);

    expect(UsersRepository.retrieveOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
