import 'express-session';

declare module 'express-session' {
  interface SessionData {
    csrfSecret: string;
    auth: {
      access_token: string;
      expires_in: number;
      id_token: string;
      scope: string;
      token_type: string;
    };
  }
}
