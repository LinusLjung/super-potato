import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import isAuthorized from '../helpers/is-authorized';

const isAuthorizedHandler: RequestHandler = (req, res, next) => {
  isAuthorized(req).then((auth) => {
    if (!auth.isAuthorized) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Invalid JWT');
    }

    req.authData = auth;

    next();
  });
};

export default isAuthorizedHandler;
