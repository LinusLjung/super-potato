import { randomBytes } from 'crypto';
import getOpenidConfiguration from './get-openid-configuration';

function buildUrl(
  endpoint: string,
  clientId: string,
  redirectUri: string,
  responseType: string,
  scope: string,
  state: string,
  nonce: string,
): URL {
  const url = new URL(endpoint);

  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', responseType);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);

  return url;
}

function getAuthEndpointUrl(csrfSecret: string, clientId: string, redirectUri: string): Promise<string> {
  return getOpenidConfiguration().then((config) => {
    return buildUrl(
      config.authorization_endpoint,
      clientId,
      redirectUri,
      'code',
      'https://www.googleapis.com/auth/userinfo.email',
      csrfSecret,
      randomBytes(10).toString('hex'),
    ).toString();
  });
}

export { buildUrl };

export default getAuthEndpointUrl;
