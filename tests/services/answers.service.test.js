const answersService = require('../../src/services/answers.service');
const { AnswersRepository } = require('../../src/repositories');

jest.mock('../../src/repositories', () => ({
  AnswersRepository: {
    create: jest.fn(),
    remove: jest.fn(),
    retrieveAll: jest.fn(),
  },
}));

describe('Answers Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call AnswersRepository.create', () => {
    const newAnswer = { body: 'Test answer' };
    const resultCb = jest.fn();

    answersService.create(newAnswer, resultCb);

    expect(AnswersRepository.create).toHaveBeenCalledWith(newAnswer, resultCb);
  });

  it('should call AnswersRepository.remove', () => {
    const id = 1;
    const resultCb = jest.fn();

    answersService.remove(id, resultCb);

    expect(AnswersRepository.remove).toHaveBeenCalledWith(id, resultCb);
  });

  it('should call AnswersRepository.retrieveAll', () => {
    const postId = 10;
    const resultCb = jest.fn();

    answersService.retrieveAll(postId, resultCb);

    expect(AnswersRepository.retrieveAll).toHaveBeenCalledWith(postId, resultCb);
  });
});
