import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const validateCsrfSecret: RequestHandler = function validateCsrfSecret(req, res, next) {
  if (req.query.state !== req.session.csrfSecret) {
    return res.status(StatusCodes.UNAUTHORIZED).send('CSRF secret mismatch');
  }

  next();
};

export default validateCsrfSecret;
