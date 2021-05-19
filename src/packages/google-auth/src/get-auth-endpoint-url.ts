import { randomBytes } from 'crypto';
import getOpenidConfiguration from './get-openid-configuration';

function getAuthEndpointUrl(csrfSecret: string, clientId: string, redirectUri: string) {
  if (!csrfSecret) {
    throw new Error('csrfSecret is missing');
  }

  return getOpenidConfiguration().then((config) => {
    const url = new URL(config.authorization_endpoint);

    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'https://www.googleapis.com/auth/userinfo.email');
    url.searchParams.set('state', csrfSecret);
    url.searchParams.set('nonce', randomBytes(10).toString('hex'));

    return url.toString();
  });
}

export default getAuthEndpointUrl;
