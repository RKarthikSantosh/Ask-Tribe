const JWT = require('jsonwebtoken');
const getJwtToken = require('../../src/helpers/jwt');

jest.mock('jsonwebtoken');
jest.mock('../../src/config', () => ({
  JWT: {
    SECRET: 'testsecret',
    EXPIRES_IN: 1, // 1 day
  }
}));

describe('JWT Helper', () => {
  let mockResult;

  beforeEach(() => {
    mockResult = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  it('should pass if JWT.sign fails and verify the structure', () => {
    const error = new Error('Token generation failed');
    error.statusCode = 500;
    
    JWT.sign.mockImplementation((payload, secret, options, callback) => {
      callback(error, null);
    });

    getJwtToken({ id: 1 }, 'User logged in', mockResult);

    expect(mockResult).toHaveBeenCalledWith(
      {
        success: false,
        code: 500,
        message: 'Token generation failed',
        data: null
      },
      null
    );
  });

  it('should call result with success and token if JWT.sign succeeds', () => {
    JWT.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'mockToken');
    });

    getJwtToken({ id: 1 }, 'User logged in', mockResult);

    expect(mockResult).toHaveBeenCalledWith(
      null,
      {
        success: true,
        code: 200,
        message: 'User logged in',
        data: { token: 'mockToken' }
      }
    );
  });
});
