const tagsController = require('../../src/controllers/tags.controller');
const { tagsService } = require('../../src/services');
const { responseHandler } = require('../../src/helpers');

jest.mock('../../src/services', () => ({
  tagsService: {
    retrieveAll: jest.fn(),
    retrieveOne: jest.fn(),
  },
}));
jest.mock('../../src/helpers', () => {
  const original = jest.requireActual('../../src/helpers');
  return { ...original, responseHandler: jest.fn() };
});

describe('Tags Controller', () => {
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

  describe('getTags', () => {
    it('should retrieve all tags and return success response', async () => {
      const successData = { code: 200, data: [{ id: 1, tagname: 'js' }] };
      tagsService.retrieveAll.mockImplementation((cb) => cb(null, successData));

      await tagsController.getTags(req, res, jest.fn());

      expect(tagsService.retrieveAll).toHaveBeenCalledWith(expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });

  describe('getSingleTag', () => {
    it('should retrieve a single tag', async () => {
      req.params.tagname = 'js';
      const successData = { code: 200, data: { id: 1, tagname: 'js' } };
      tagsService.retrieveOne.mockImplementation((tagname, cb) => cb(null, successData));

      await tagsController.getSingleTag(req, res, jest.fn());

      expect(tagsService.retrieveOne).toHaveBeenCalledWith('js', expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(successData);
    });
  });
});
