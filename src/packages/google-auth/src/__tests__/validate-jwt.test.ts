import { getJWKSet } from '../validate-jwt';
import * as Fetch from 'node-fetch';

const fetchSpy = jest.spyOn(Fetch, 'default');

describe('validate-jwt', () => {
  let cachedJWKSet: Function;

  describe('getJWKSet()', () => {
    it('resolves a function', async () => {
      const JWKSet = (cachedJWKSet = await getJWKSet());

      expect(JWKSet).toBeInstanceOf(Function);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('resolves the cached response', async () => {
      const JWKSet = await getJWKSet();

      expect(JWKSet).toBe(cachedJWKSet);
      expect(fetchSpy).toHaveBeenCalledTimes(0);
    });
  });
});
