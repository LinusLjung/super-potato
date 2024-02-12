import { AuthDataType } from '@linusljung/google-auth';

declare global {
  namespace Express {
    export interface Request {
      authData?: AuthDataType;
    }
  }
}
