const { validationResult } = require('express-validator');
const commentsController = require('../../src/controllers/comments.controller');
const { commentsService } = require('../../src/services');
const { responseHandler } = require('../../src/helpers');

jest.mock('express-validator');
jest.mock('../../src/services', () => ({
  commentsService: {
    retrieveAll: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  },
}));
jest.mock('../../src/helpers', () => {
  const original = jest.requireActual('../../src/helpers');
  return { ...original, responseHandler: jest.fn() };
});

describe('Comments Controller', () => {
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

  describe('getComments', () => {
    it('should retrieve comments and return success response', async () => {
      req.params.id = 1;
      const successData = { code: 200, data: [{ id: 1, body: 'test comment' }] };
      
      commentsService.retrieveAll.mockImplementation((id, cb) => cb(null, successData));

      await commentsController.getComments(req, res, jest.fn());

      expect(commentsService.retrieveAll).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });

    it('should handle service errors', async () => {
      req.params.id = 1;
      const errorData = { code: 404, message: 'Not found' };
      
      commentsService.retrieveAll.mockImplementation((id, cb) => cb(errorData, null));

      await commentsController.getComments(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(errorData);
    });
  });

  describe('addComment', () => {
    it('should handle validation errors', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Validation error' }],
      });

      await commentsController.addComment(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 400, message: 'Validation error' })
      );
    });

    it('should handle successful creation', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body.body = 'My comment';
      req.user.id = 1;
      req.params.id = 10;
      
      const successData = { code: 201, data: 'Comment Created' };
      commentsService.create.mockImplementation((comment, cb) => cb(null, successData));

      await commentsController.addComment(req, res, jest.fn());

      expect(commentsService.create).toHaveBeenCalledWith(
        { body: 'My comment', userId: 1, postId: 10 },
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });

  describe('deleteComment', () => {
    it('should remove comment successfully', async () => {
      req.params.id = 1;
      const successData = { code: 200, message: 'Comment Deleted' };
      
      commentsService.remove.mockImplementation((id, cb) => cb(null, successData));

      await commentsController.deleteComment(req, res, jest.fn());

      expect(commentsService.remove).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });
});
