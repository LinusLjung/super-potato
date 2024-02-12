import { AuthDataType, validateJWT } from '@linusljung/google-auth';
import assert from 'assert';
import { Request } from 'express';
import { GOOGLE_CLIENT_ID } from '../consts';

export { AuthDataType };

function isAuthorized(req: Request): Promise<AuthDataType> {
  return new Promise<AuthDataType>((resolve) => {
    if (!req.session.auth?.id_token) {
      return void resolve({ isAuthorized: false, result: null });
    }

    assert(GOOGLE_CLIENT_ID);

    validateJWT(req.session.auth.id_token, GOOGLE_CLIENT_ID).then((auth) => resolve(auth));
  });
}

export default isAuthorized;
