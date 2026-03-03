const JWT = require('jsonwebtoken');
const auth = require('../../src/middleware/auth');
const config = require('../../src/config');
const { responseHandler } = require('../../src/helpers');

jest.mock('jsonwebtoken');
jest.mock('../../src/helpers');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    responseHandler.mockImplementation((success, code, message, data) => ({ success, code, message, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', () => {
    req.header.mockReturnValue(null);

    auth(req, res, next);

    expect(req.header).toHaveBeenCalledWith('x-auth-token');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if token verification fails', () => {
    req.header.mockReturnValue('invalidToken');
    JWT.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    auth(req, res, next);

    expect(JWT.verify).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and set req.user if token verification succeeds', () => {
    req.header.mockReturnValue('validToken');
    const decoded = { user: { id: 1, name: 'Test' } };
    JWT.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    auth(req, res, next);

    expect(JWT.verify).toHaveBeenCalled();
    expect(req.user).toEqual(decoded.user);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 500 if an exception is thrown', () => {
    req.header.mockReturnValue('validToken');
    JWT.verify.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
