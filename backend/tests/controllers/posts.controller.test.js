const { validationResult } = require('express-validator');
const postsController = require('../../src/controllers/posts.controller');
const { postsService } = require('../../src/services');
const { responseHandler } = require('../../src/helpers');

jest.mock('express-validator');
jest.mock('../../src/services', () => ({
  postsService: {
    retrieveAll: jest.fn(),
    retrieveAllTag: jest.fn(),
    retrieveOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  },
}));
jest.mock('../../src/helpers', () => {
  const original = jest.requireActual('../../src/helpers');
  return { ...original, responseHandler: jest.fn() };
});

describe('Posts Controller', () => {
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

  describe('getPosts', () => {
    it('should retrieve all posts and return success response', async () => {
      const successData = { code: 200, data: [{ id: 1, title: 'test post' }] };
      postsService.retrieveAll.mockImplementation((cb) => cb(null, successData));

      await postsController.getPosts(req, res, jest.fn());

      expect(postsService.retrieveAll).toHaveBeenCalledWith(expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });

  describe('getTagPosts', () => {
    it('should retrieve posts by tag', async () => {
      req.params.tagname = 'js';
      const successData = { code: 200, data: [{ id: 1, title: 'js post' }] };
      postsService.retrieveAllTag.mockImplementation((tag, cb) => cb(null, successData));

      await postsController.getTagPosts(req, res, jest.fn());

      expect(postsService.retrieveAllTag).toHaveBeenCalledWith('js', expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });

  describe('getSinglePost', () => {
    it('should retrieve a single post', async () => {
      req.params.id = 1;
      const successData = { code: 200, data: { id: 1, title: 'test post' } };
      postsService.retrieveOne.mockImplementation((id, cb) => cb(null, successData));

      await postsController.getSinglePost(req, res, jest.fn());

      expect(postsService.retrieveOne).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });

  describe('addPost', () => {
    it('should handle validation errors', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Validation error' }],
      });

      await postsController.addPost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 400, message: 'Validation error' })
      );
    });

    it('should handle successful creation', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      req.body = { title: 'New post', body: 'Post content', tagname: 'js' };
      req.user.id = 1;
      
      const successData = { code: 201, data: 'Post Created' };
      postsService.create.mockImplementation((post, cb) => cb(null, successData));

      await postsController.addPost(req, res, jest.fn());

      expect(postsService.create).toHaveBeenCalledWith(
        { title: 'New post', body: 'Post content', userId: 1, tagName: 'js' },
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });

  describe('deletePost', () => {
    it('should remove post successfully', async () => {
      req.params.id = 1;
      const successData = { code: 200, message: 'Post Deleted' };
      
      postsService.remove.mockImplementation((id, cb) => cb(null, successData));

      await postsController.deletePost(req, res, jest.fn());

      expect(postsService.remove).toHaveBeenCalledWith(1, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });
});
