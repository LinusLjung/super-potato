import csurf from 'csurf';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import fetch from 'node-fetch';
import path from 'path';
import getAuthEndpointUrl from '../../../packages/google-auth/build/get-auth-endpoint-url';
import { getTokenEndpointBody, getTokenEndpointUrl } from '../../../packages/google-auth/build/token-endpoint';
import validateJWT from '../../../packages/google-auth/build/validate-jwt';
import superSession from '../../../packages/super-session/build';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, HOST, PORT, SESSION_HOST, SESSION_SECRET } from './consts';
import validateCsrfSecret from './middlewares/validateCsrfSecret';
import { AUTH_GOOGLE, ROOT, SIGN_IN } from './routes';

const SRC_FOLDER = path.join('./src');

const app = express();

app.set('view engine', 'pug');
app.set('views', SRC_FOLDER);

app.use(superSession(SESSION_HOST!, SESSION_SECRET!)());

app.use(csurf());

app.get(ROOT, (req, res) => {
  if (req.session.auth) {
    validateJWT(req.session.auth.id_token, GOOGLE_CLIENT_ID!).then((result) => console.log('result', result));
  }

  res.render('layout.pug', {
    isSignedIn: !!req.session.auth,
    auth: JSON.stringify(req.session.auth || {}),
  });
});

app.get(SIGN_IN, (req, res) => {
  if (!req.session.csrfSecret) {
    res.status(StatusCodes.FORBIDDEN).send('Missing CSRF secret');
  }

  getAuthEndpointUrl(req.session.csrfSecret!, GOOGLE_CLIENT_ID!, `${HOST}:${PORT}${AUTH_GOOGLE}`).then((url) => {
    res.redirect(StatusCodes.MOVED_TEMPORARILY, url);
  });
});

app.get(AUTH_GOOGLE, validateCsrfSecret, (req, res) => {
  getTokenEndpointUrl().then((url) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(
        getTokenEndpointBody(
          req.query.code as string,
          GOOGLE_CLIENT_ID!,
          GOOGLE_CLIENT_SECRET!,
          `${HOST}:${PORT}${AUTH_GOOGLE}`,
        ),
      ),
    })
      .then((response) => response.json())
      .then((response) => {
        req.session.auth = response;
        res.redirect(StatusCodes.MOVED_TEMPORARILY, '/');
      });
  });
});

app.listen(PORT);

console.log(`Listening on port ${PORT}`);
