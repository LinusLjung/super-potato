import { buildUrl } from '../get-auth-endpoint-url';

describe('get-auth-endpoint', () => {
  describe('buildUrl()', () => {
    it('should build a URL for the Google auth endpoint', () => {
      const endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      const clientId = 'clientId';
      const redirectUri = 'redirectUri';
      const responseType = 'responseType';
      const scope = 'scope';
      const state = 'state';
      const nonce = 'nonce';

      expect(buildUrl(endpoint, clientId, redirectUri, responseType, scope, state, nonce).toString()).toEqual(
        `${endpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}&nonce=${nonce}`,
      );
    });
  });
});
