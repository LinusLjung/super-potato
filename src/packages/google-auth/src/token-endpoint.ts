import getOpenidConfiguration from './get-openid-configuration';

export function getTokenEndpointUrl() {
  return getOpenidConfiguration().then((config) => {
    return config.token_endpoint;
  });
}

export function getTokenEndpointBody(code: string, clientId: string, clientSecret: string, redirectUri: string) {
  return {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };
}
