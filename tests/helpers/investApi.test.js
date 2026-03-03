const axios = require('axios');
const investApi = require('../../src/helpers/investApi');

jest.mock('axios');
jest.mock('../../src/constants', () => ({
  API_BASE_URL: 'http://test.api'
}));

describe('InvestApi Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('fetchTagDesc', () => {
    it('should return response data items on success', async () => {
      const mockData = { items: [{ tag_name: 'test', excerpt: 'Test excerpt' }] };
      axios.get.mockResolvedValueOnce({ data: mockData });

      const tags = 'test';
      const result = await investApi.fetchTagDesc(tags);

      expect(axios.get).toHaveBeenCalledWith(
        `http://test.api/tags/${tags}/wikis?site=stackoverflow`,
        expect.any(Object)
      );
      expect(result).toEqual(mockData.items);
    });

    it('should return undefined and log error on failure', async () => {
      const error = new Error('API Error');
      axios.get.mockRejectedValueOnce(error);

      const result = await investApi.fetchTagDesc('test');

      expect(console.log).toHaveBeenCalledWith('error:', error);
      expect(result).toBeUndefined();
    });
  });

  describe('prepareTags', () => {
    it('should properly map tags with found excerpts', () => {
      const tags = ['js', 'css'];
      const response = [
        { tag_name: 'js', excerpt: 'JavaScript info' }
      ];

      const result = investApi.prepareTags(tags, response);

      expect(result).toEqual([
        { tagname: 'js', description: 'JavaScript info' },
        { tagname: 'css', description: 'A css is a keyword or term assigned to a piece of information' }
      ]);
    });

    it('should handle undefined response gracefully if response is empty array', () => {
      const tags = ['html'];
      const response = [];

      const result = investApi.prepareTags(tags, response);

      expect(result).toEqual([
        { tagname: 'html', description: 'A html is a keyword or term assigned to a piece of information' }
      ]);
    });
  });
});
