import getOpenIDConfiguration from '../get-openid-configuration';
import * as Fetch from 'node-fetch';
import openidConfiguration from '../../jest/openid-configuration.json';

const fetchSpy = jest.spyOn(Fetch, 'default');

describe('get-openid-configuration', () => {
  let cachedConfiguration: Partial<typeof openidConfiguration>;

  it('it should return a fetch response', async () => {
    const configuration = (cachedConfiguration = await getOpenIDConfiguration());

    expect(configuration).toEqual(openidConfiguration);
  });

  it('should cache the request response', async () => {
    const configuration = await getOpenIDConfiguration();

    expect(configuration).toBe(cachedConfiguration);
    expect(fetchSpy).toHaveBeenCalledTimes(0);
  });
});
