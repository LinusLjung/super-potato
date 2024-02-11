import { validateJWT } from '@linusljung/google-auth';
import superSession from '@linusljung/super-session';
import assert from 'assert';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { doubleCsrf } from 'csrf-csrf';
import express from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import https from 'https';
import path from 'path';
import { GOOGLE_CLIENT_ID, PORT, SESSION_HOST, SESSION_SECRET } from './consts';
import { getOrCreate } from './database/user';
import { AUTH_GOOGLE, ROOT } from './routes';

const ROOT_FOLDER = path.join(__dirname, '../../../../');
const SRC_FOLDER = path.join('./src');

const sslCert = fs.readFileSync(path.join(ROOT_FOLDER, 'ssl/localhost.crt'));
const sslKey = fs.readFileSync(path.join(ROOT_FOLDER, 'ssl/localhost.key'));

const app = express();

const httpsServer = https.createServer({ key: sslKey, cert: sslCert }, app);

app.set('view engine', 'pug');
app.set('views', SRC_FOLDER);

const CSRF_SECRET = crypto.randomBytes(8).toString('hex');
const COOKIES_SECRET = crypto.randomBytes(8).toString('hex');
const CSRF_COOKIE_NAME = 'X-CSRF-Token';

const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  cookieName: CSRF_COOKIE_NAME,
  cookieOptions: {
    sameSite: 'strict',
    secure: true,
  },
  size: 64,
  getTokenFromRequest: (req) => req.session.csrfSecret?.split('|')[0],
});

assert(SESSION_HOST);
assert(SESSION_SECRET);

app.use(cookieParser(COOKIES_SECRET));
app.use(superSession(SESSION_HOST, SESSION_SECRET)());
app.use(doubleCsrfProtection);
app.use(express.json());

app.get(ROOT, (req, res) => {
  req.session.csrfSecret = generateToken(req, res, false, false);

  new Promise<boolean>((resolve) => {
    if (req.session.auth) {
      assert(GOOGLE_CLIENT_ID);

      return void validateJWT(req.session.auth.id_token, GOOGLE_CLIENT_ID).then(({ isAuthorized }) =>
        resolve(isAuthorized),
      );
    }

    resolve(false);
  }).then((isAuthorized) =>
    res.render('layout.pug', {
      isSignedIn: isAuthorized,
      auth: JSON.stringify(req.session.auth ?? {}),
      googleClientId: GOOGLE_CLIENT_ID,
    }),
  );
});

app.post(AUTH_GOOGLE, (req, res) => {
  assert(GOOGLE_CLIENT_ID);

  validateJWT(req.body.id_token, GOOGLE_CLIENT_ID)
    .then(({ result }) => {
      if (!result) {
        throw new Error('Validation of JWT failed');
      }

      if (!result.payload.email_verified as boolean) {
        throw new Error('Email is not verified');
      }

      return getOrCreate(result.payload.sub, result.payload.email as string);
    })
    .then(() => {
      req.session.auth = req.body;

      res.status(StatusCodes.OK).send();
    })
    .catch(() => {
      // TODO: 500
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    });
});

httpsServer.listen(PORT);

console.log(`Listening on port ${PORT}`);
