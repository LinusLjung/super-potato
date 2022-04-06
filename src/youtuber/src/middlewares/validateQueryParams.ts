import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';

const validateQueryParamsMiddleware: (requiredQueryParams: string[]) => Handler = (requiredQueryParams = []) => (
  req,
  res,
  next,
) => {
  for (let i = 0; i < requiredQueryParams.length; i++) {
    if (!req.query[requiredQueryParams[i]]) {
      return res.status(StatusCodes.BAD_REQUEST).send(`Missing ${requiredQueryParams[i]} param`);
    }
  }

  next();
};

export default validateQueryParamsMiddleware;
