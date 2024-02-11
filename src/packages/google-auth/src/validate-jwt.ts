import { createRemoteJWKSet } from 'jose/jwks/remote';
import { JWTVerifyResult, jwtVerify } from 'jose/jwt/verify';
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

type AuthDataType = {
  isAuthorized: boolean;
  result: JWTVerifyResult | null;
};

function validateJWT(token: string, clientId: string): Promise<AuthDataType> {
  return getJWKSet().then((JWKSet) => {
    return Promise.resolve(
      jwtVerify(token, JWKSet, {
        issuer: ['https://accounts.google.com', 'accounts.google.com'],
        audience: clientId,
      })
        .then((result) => ({
          result,
          isAuthorized: true,
        }))
        .catch(() => ({
          result: null,
          isAuthorized: false,
        })),
    );
  });
}

export { getJWKSet, AuthDataType };

export default validateJWT;
