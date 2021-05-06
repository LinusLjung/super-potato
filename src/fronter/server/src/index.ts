import csurf from 'csurf';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import fetch from 'node-fetch';
import path from 'path';
import superSession from '../../../packages/super-session/build';
import getAuthEndpointUrl from './auth/google/get-auth-endpoint-url';
import { getTokenEndpointBody, getTokenEndpointUrl } from './auth/google/token-endpoint';
import validateJWT from './auth/google/validate-jwt';
import { SESSION_HOST, SESSION_SECRET } from './consts';
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
    validateJWT(req.session.auth.id_token).then((result) => console.log('result', result));
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

  getAuthEndpointUrl(req.session.csrfSecret!).then((url) => {
    res.redirect(StatusCodes.MOVED_TEMPORARILY, url);
  });
});

app.get(AUTH_GOOGLE, validateCsrfSecret, (req, res) => {
  getTokenEndpointUrl().then((url) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(getTokenEndpointBody(req.query.code as string)),
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
