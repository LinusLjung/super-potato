import { AuthDataType } from '@linusljung/google-auth/dist/validate-jwt';

declare global {
  namespace Express {
    export interface Request {
      authData?: AuthDataType;
    }
  }
}
