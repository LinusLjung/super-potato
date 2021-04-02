import { randomBytes } from 'crypto';
import { SessionData } from 'express-session';
import { GOOGLE_CLIENT_ID, HOST, PORT } from '../../consts';
import { AUTH_GOOGLE } from '../../routes';
import getOpenidConfiguration from './get-openid-configuration';

function getAuthEndpointUrl(csrfSecret: SessionData['csrfSecret']) {
  if (!csrfSecret) {
    throw new Error('csrfSecret is missing');
  }

  return getOpenidConfiguration().then((config) => {
    const url = new URL(config.authorization_endpoint);

    url.searchParams.set('client_id', GOOGLE_CLIENT_ID!);
    url.searchParams.set('redirect_uri', `${HOST}:${PORT}${AUTH_GOOGLE}`);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'https://www.googleapis.com/auth/userinfo.email');
    url.searchParams.set('state', csrfSecret);
    url.searchParams.set('nonce', randomBytes(10).toString('hex'));

    return url.toString();
  });
}

export default getAuthEndpointUrl;
