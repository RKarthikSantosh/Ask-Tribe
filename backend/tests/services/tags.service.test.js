const tagsService = require('../../src/services/tags.service');
const { TagsRepository } = require('../../src/repositories');

jest.mock('../../src/repositories', () => ({
  TagsRepository: {
    retrieveAll: jest.fn(),
    retrieveOneWithCount: jest.fn(),
  },
}));

describe('Tags Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call TagsRepository.retrieveAll', () => {
    const resultCb = jest.fn();

    tagsService.retrieveAll(resultCb);

    expect(TagsRepository.retrieveAll).toHaveBeenCalledWith(resultCb);
  });

  it('should call TagsRepository.retrieveOneWithCount', () => {
    const tagName = 'javascript';
    const resultCb = jest.fn();

    tagsService.retrieveOne(tagName, resultCb);

    expect(TagsRepository.retrieveOneWithCount).toHaveBeenCalledWith(tagName, resultCb);
  });
});
