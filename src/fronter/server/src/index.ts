import { getAuthEndpointUrl, getTokenEndpointBody, getTokenEndpointUrl, validateJWT } from '@linusljung/google-auth';
import superSession from '@linusljung/super-session';
import csurf from 'csurf';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import fetch from 'node-fetch';
import path from 'path';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, HOST, PORT, SESSION_HOST, SESSION_SECRET } from './consts';
import { getOrCreate } from './database/user';
import validateCsrfSecret from './middlewares/validate-csrf-secret';
import { AUTH_GOOGLE, ROOT, SIGN_IN } from './routes';
import fs from 'fs';
import https from 'https';

const ROOT_FOLDER = path.join(__dirname, '../../../../');
const SRC_FOLDER = path.join('./src');

const sslCert = fs.readFileSync(path.join(ROOT_FOLDER, 'ssl/localhost.crt'));
const sslKey = fs.readFileSync(path.join(ROOT_FOLDER, 'ssl/localhost.key'));

const app = express();

const httpsServer = https.createServer({ key: sslKey, cert: sslCert }, app);

app.set('view engine', 'pug');
app.set('views', SRC_FOLDER);

app.use(superSession(SESSION_HOST!, SESSION_SECRET!)());

app.use(csurf());

app.get(ROOT, (req, res) => {
  new Promise<boolean>((resolve) => {
    if (req.session.auth) {
      return validateJWT(req.session.auth.id_token, GOOGLE_CLIENT_ID!).then(({ isAuthorized }) =>
        resolve(isAuthorized),
      );
    }

    resolve(false);
  }).then((isAuthorized) =>
    res.render('layout.pug', {
      isSignedIn: isAuthorized,
      auth: JSON.stringify(req.session.auth || {}),
    }),
  );
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
        return validateJWT(response.id_token, GOOGLE_CLIENT_ID!)
          .then(({ result }) => {
            if (!result) {
              throw new Error('Validation of JWT failed');
            }

            if (!result.payload.email_verified as boolean) {
              throw new Error('Email is not verified');
            }

            return getOrCreate(result.payload.sub!, result.payload.email as string);
          })
          .then(() => response);
      })
      .then((response) => {
        req.session.auth = response;
        res.redirect(StatusCodes.MOVED_TEMPORARILY, ROOT);
      })
      .catch(() => {
        // TODO: 500
      });
  });
});

httpsServer.listen(PORT);

console.log(`Listening on port ${PORT}`);
