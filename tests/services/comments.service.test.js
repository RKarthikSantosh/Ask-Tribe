const commentsService = require('../../src/services/comments.service');
const { CommentsRepository } = require('../../src/repositories');

jest.mock('../../src/repositories', () => ({
  CommentsRepository: {
    create: jest.fn(),
    remove: jest.fn(),
    retrieveAll: jest.fn(),
  },
}));

describe('Comments Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call CommentsRepository.create', () => {
    const newComment = { body: 'Test comment' };
    const resultCb = jest.fn();

    commentsService.create(newComment, resultCb);

    expect(CommentsRepository.create).toHaveBeenCalledWith(newComment, resultCb);
  });

  it('should call CommentsRepository.remove', () => {
    const id = 1;
    const resultCb = jest.fn();

    commentsService.remove(id, resultCb);

    expect(CommentsRepository.remove).toHaveBeenCalledWith(id, resultCb);
  });

  it('should call CommentsRepository.retrieveAll', () => {
    const postId = 10;
    const resultCb = jest.fn();

    commentsService.retrieveAll(postId, resultCb);

    expect(CommentsRepository.retrieveAll).toHaveBeenCalledWith(postId, resultCb);
  });
});
