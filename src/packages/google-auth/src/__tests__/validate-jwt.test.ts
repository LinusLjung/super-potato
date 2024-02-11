import { getJWKSet } from '../validate-jwt';

const fetchSpy = jest.spyOn(global, 'fetch');

describe('validate-jwt', () => {
  let cachedJWKSet: Awaited<ReturnType<typeof getJWKSet>>;

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
