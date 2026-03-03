const { validationResult } = require('express-validator');
const answersController = require('../../src/controllers/answers.controller');
const { answersService } = require('../../src/services');
const { responseHandler } = require('../../src/helpers');

jest.mock('express-validator');
jest.mock('../../src/services', () => ({
  answersService: {
    retrieveAll: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  },
}));
jest.mock('../../src/helpers', () => {
  const original = jest.requireActual('../../src/helpers');
  return {
    ...original,
    responseHandler: jest.fn(),
  };
});

describe('Answers Controller', () => {
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

  describe('getAnswers', () => {
    it('should retrieve answers and return success response', async () => {
      req.params.id = 1;
      const successData = { code: 200, data: [{ id: 1, body: 'test answer' }] };
      
      answersService.retrieveAll.mockImplementation((id, cb) => {
        cb(null, successData);
      });

      // answersController.getAnswers is wrapped in asyncHandler, so we pass mock next.
      const mockNext = jest.fn();
      await answersController.getAnswers(req, res, mockNext);

      expect(answersService.retrieveAll).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });

    it('should handle service errors', async () => {
      req.params.id = 1;
      const errorData = { code: 404, message: 'Not found' };
      
      answersService.retrieveAll.mockImplementation((id, cb) => {
        cb(errorData, null);
      });

      await answersController.getAnswers(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(errorData);
    });
  });

  describe('addAnswer', () => {
    it('should handle validation errors', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Validation error' }],
      });

      await answersController.addAnswer(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 400, message: 'Validation error', success: false })
      );
      expect(answersService.create).not.toHaveBeenCalled();
    });

    it('should handle successful creation', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body.text = 'My great answer';
      req.user.id = 1;
      req.params.id = 10;
      
      const successData = { code: 201, data: 'Answer Created' };
      answersService.create.mockImplementation((answer, cb) => {
        cb(null, successData);
      });

      await answersController.addAnswer(req, res, jest.fn());

      expect(answersService.create).toHaveBeenCalledWith(
        { body: 'My great answer', userId: 1, postId: 10 },
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });

  describe('deleteAnswer', () => {
    it('should remove answer successfully', async () => {
      req.params.id = 1;
      const successData = { code: 200, message: 'Answer Deleted' };
      
      answersService.remove.mockImplementation((id, cb) => {
        cb(null, successData);
      });

      await answersController.deleteAnswer(req, res, jest.fn());

      expect(answersService.remove).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });
});
