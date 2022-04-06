import { AuthDataType, validateJWT } from '@linusljung/google-auth';
import { Request } from 'express';
import { GOOGLE_CLIENT_ID } from '../consts';

export { AuthDataType };

function isAuthorized(req: Request) {
  return new Promise<AuthDataType>((resolve) => {
    if (!req.session.auth?.id_token) {
      resolve({ isAuthorized: false, result: null });
    }

    validateJWT(req.session.auth!.id_token, GOOGLE_CLIENT_ID!).then((auth) => resolve(auth));
  });
}

export default isAuthorized;
