const db = require('../../src/config/db.config');
const postsService = require('../../src/services/posts.service');
const { responseHandler, investApi } = require('../../src/helpers');
const utils = require('../../src/utils');
const {
  PostsRepository,
  AnswersRepository,
  CommentsRepository,
  PostTagRepository,
  TagsRepository,
} = require('../../src/repositories');

jest.mock('../../src/config/db.config', () => ({
  transaction: jest.fn(),
}));
jest.mock('../../src/helpers');
jest.mock('../../src/utils', () => ({
  conditional: { isNull: jest.fn() },
  array: { sequelizeResponse: jest.fn(), mergeById: jest.fn() },
}));
jest.mock('../../src/repositories', () => ({
  PostsRepository: {
    create: jest.fn(), remove: jest.fn(), retrieveOne: jest.fn(),
    incrementViews: jest.fn(), countAnswersForOne: jest.fn(),
    countCommentsForOne: jest.fn(), retrieveAll: jest.fn(), countForAll: jest.fn(),
  },
  AnswersRepository: { removePostAnswers: jest.fn() },
  CommentsRepository: { removePostComments: jest.fn() },
  PostTagRepository: { bulkCreate: jest.fn(), remove: jest.fn() },
  TagsRepository: { retrieveOne: jest.fn(), bulkCreate: jest.fn() },
}));

describe('Posts Service', () => {
  let mockTransaction;

  beforeEach(() => {
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    db.transaction.mockResolvedValue(mockTransaction);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    responseHandler.mockImplementation((success, code, message, data) => ({ success, code, message, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should reject if more than 5 tags are provided', async () => {
      const newPost = { tagName: '1,2,3,4,5,6' };
      const resultCb = jest.fn();

      await postsService.create(newPost, resultCb);

      expect(resultCb).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
      // It errors before creating the transaction or after? 
      // In the code, it creates transaction first, then returns early.
      // But it doesn't rollback in this early return branch!
    });

    it('should create post, process tags, and commit transaction', async () => {
      const newPost = { tagName: 'js,  python ' };
      const resultCb = jest.fn();

      PostsRepository.create.mockResolvedValue({ id: 1 });
      
      // First tag exists, second doesn't
      TagsRepository.retrieveOne.mockImplementation((tag) => {
        if (tag === 'js') return Promise.resolve({ id: 10 });
        return Promise.resolve(null);
      });
      utils.conditional.isNull.mockImplementation((val) => val === null);

      investApi.fetchTagDesc.mockResolvedValue([{ excerpt: 'python desc' }]);
      investApi.prepareTags.mockReturnValue([{ tagname: 'python', description: 'python desc' }]);
      TagsRepository.bulkCreate.mockResolvedValue([{ id: 20 }]);

      await postsService.create(newPost, resultCb);

      // Verify tag processing
      expect(investApi.fetchTagDesc).toHaveBeenCalledWith('python');
      expect(TagsRepository.bulkCreate).toHaveBeenCalledWith([{ tagname: 'python', description: 'python desc' }]);
      
      expect(PostTagRepository.bulkCreate).toHaveBeenCalledWith([
        { post_id: 1, tag_id: 10 },
        { post_id: 1, tag_id: 20 },
      ]);

      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(resultCb).toHaveBeenCalledWith(null, expect.any(Object)); // responseHandler mock
    });

    it('should rollback transaction on error', async () => {
      const newPost = { tagName: 'js' };
      const resultCb = jest.fn();

      PostsRepository.create.mockRejectedValue(new Error('DB error'));

      await postsService.create(newPost, resultCb);

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(resultCb).toHaveBeenCalledWith(
        expect.objectContaining({ code: 500, message: 'Something went wrong' }),
        null
      );
    });
  });

  describe('remove', () => {
    it('should remove post and its associations within a transaction', async () => {
      const id = 1;
      const resultCb = jest.fn();

      await postsService.remove(id, resultCb);

      expect(AnswersRepository.removePostAnswers).toHaveBeenCalledWith(id, mockTransaction);
      expect(CommentsRepository.removePostComments).toHaveBeenCalledWith(id, mockTransaction);
      expect(PostTagRepository.remove).toHaveBeenCalledWith(id, mockTransaction);
      expect(PostsRepository.remove).toHaveBeenCalledWith(id, mockTransaction);

      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(resultCb).toHaveBeenCalledWith(null, expect.any(Object));
    });

    it('should rollback on error during remove', async () => {
      const id = 1;
      const resultCb = jest.fn();

      PostsRepository.remove.mockRejectedValue(new Error('DB error'));

      await postsService.remove(id, resultCb);

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(resultCb).toHaveBeenCalledWith(
        expect.objectContaining({ code: 500, message: 'Something went wrong' }),
        null
      );
    });
  });

  describe('retrieveOne', () => {
    it('should retrieve a post with its answer and comment counts', async () => {
      const id = 1;
      const resultCb = jest.fn();

      PostsRepository.retrieveOne.mockResolvedValue({ id: 1, title: 'Test Post' });
      PostsRepository.countAnswersForOne.mockResolvedValue(5);
      PostsRepository.countCommentsForOne.mockResolvedValue(10);

      await postsService.retrieveOne(id, resultCb);

      expect(PostsRepository.incrementViews).toHaveBeenCalledWith(id);
      expect(resultCb).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          data: { id: 1, title: 'Test Post', answer_count: 5, comment_count: 10 }
        })
      );
    });
  });

  describe('retrieveAll', () => {
    it('should retrieve all posts and merge counts', async () => {
      const resultCb = jest.fn();

      PostsRepository.retrieveAll.mockResolvedValue([{ id: 1, title: 'Post 1' }]);
      PostsRepository.countForAll.mockResolvedValue([{ id: 1, dataValues: { answer_count: 1, comment_count: 2 } }]);
      
      utils.array.sequelizeResponse.mockReturnValue({ id: 1, answer_count: 1, comment_count: 2 });
      utils.array.mergeById.mockReturnValue([{ id: 1, title: 'Post 1', answer_count: 1, comment_count: 2 }]);

      await postsService.retrieveAll(resultCb);

      expect(utils.array.mergeById).toHaveBeenCalled();
      expect(resultCb).toHaveBeenCalledWith(null, expect.any(Object));
    });
  });

  describe('retrieveAllTag', () => {
    it('should retrieve all posts by tag and merge counts', async () => {
      const tagName = 'js';
      const resultCb = jest.fn();

      PostsRepository.retrieveAll.mockResolvedValue([{ id: 1, title: 'Post 1' }]);
      PostsRepository.countForAll.mockResolvedValue([{ id: 1, dataValues: { answer_count: 1, comment_count: 2 } }]);
      
      utils.array.sequelizeResponse.mockReturnValue({ id: 1, answer_count: 1, comment_count: 2 });
      utils.array.mergeById.mockReturnValue([{ id: 1, title: 'Post 1', answer_count: 1, comment_count: 2 }]);

      await postsService.retrieveAllTag(tagName, resultCb);

      expect(PostsRepository.retrieveAll).toHaveBeenCalledWith(tagName);
      expect(utils.array.mergeById).toHaveBeenCalled();
      expect(resultCb).toHaveBeenCalledWith(null, expect.any(Object));
    });
  });
});
