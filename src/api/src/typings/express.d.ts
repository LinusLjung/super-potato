import { AuthDataType } from '@linusljung/google-auth/validate-jwt';

declare global {
  namespace Express {
    export interface Request {
      authData?: AuthDataType;
    }
  }
}
