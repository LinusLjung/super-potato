import { createRemoteJWKSet } from 'jose/jwks/remote';
import { jwtVerify } from 'jose/jwt/verify';
import { GOOGLE_CLIENT_ID } from '../../consts';
import getOpenIDConfiguration from './get-openid-configuration';

let JWKSet: ReturnType<typeof createRemoteJWKSet>;

function getJWKSet() {
  if (JWKSet) {
    return Promise.resolve(JWKSet);
  }

  return getOpenIDConfiguration().then((config) => {
    return (JWKSet = createRemoteJWKSet(new URL(config.jwks_uri)));
  });
}

function validateJWT(token: string) {
  return getJWKSet().then((JWKSet) => {
    return jwtVerify(token, JWKSet, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: GOOGLE_CLIENT_ID,
    });
  });
}

export default validateJWT;
