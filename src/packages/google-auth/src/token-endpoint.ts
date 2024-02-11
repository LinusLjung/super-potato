import getOpenidConfiguration from './get-openid-configuration';

export function getTokenEndpointUrl(): Promise<string> {
  return getOpenidConfiguration().then((config) => {
    return config.token_endpoint;
  });
}

export function getTokenEndpointBody(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Record<'code' | 'client_id' | 'client_secret' | 'redirect_uri' | 'grant_type', string> {
  return {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };
}
