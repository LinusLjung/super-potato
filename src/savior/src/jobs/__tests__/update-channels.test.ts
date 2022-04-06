import { API_HOST, API_PORT, API_PROTOCOL } from '../consts';
import { getApiUrl, fetchChannel } from '../update-channels';
import * as Fetch from 'node-fetch';

const fetchSpy = jest.spyOn(Fetch, 'default');

describe('update-channels', () => {
  describe('getApiUrl()', () => {
    it('should return a URL based on env variables', () => {
      const endpoint = 'endpoint';

      expect(getApiUrl(endpoint)).toBe(`${API_PROTOCOL}://${API_HOST}:${API_PORT}/${endpoint}`);
    });

    it('should throw if the endpoint is invalid', () => {
      expect(() => getApiUrl('')).toThrow();
    });
  });

  describe('fetchChannel()', () => {
    const mockedResponseData = {
      someData: 1,
    };
    const id = '1337';

    fetchSpy.mockImplementation(() => {
      return Promise.resolve({
        async json() {
          return { ...mockedResponseData };
        },
      } as Fetch.Response);
    });

    it('should request a channel with the given ID', () => {
      fetchChannel(id);

      const fetchArg = fetchSpy.mock.calls[0][0].toString();

      expect(new URL(fetchArg).searchParams.get('channel_id')).toEqual(id);
    });

    it('should resolve with the requested json', async () => {
      const response = await fetchChannel(id);

      expect(response).toEqual(mockedResponseData);
    });
  });
});
