import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, HOST, PORT } from '../../consts';
import { AUTH_GOOGLE } from '../../routes';
import getOpenidConfiguration from './get-openid-configuration';

export function getTokenEndpointUrl() {
  return getOpenidConfiguration().then((config) => {
    return config.token_endpoint;
  });
}

export function getTokenEndpointBody(code: string) {
  return {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: `${HOST}:${PORT}${AUTH_GOOGLE}`,
    grant_type: 'authorization_code',
  };
}
