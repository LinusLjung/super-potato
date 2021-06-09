import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import getSubscriptions from '../database/get-subscriptions';
import isAuthorized from '../helpers/is-authorized';

const subscriptions: RequestHandler = function subscriptions(req, res) {
  isAuthorized(req).then((auth) => {
    if (!auth.isAuthorized) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Invalid JWT');
    }

    getSubscriptions(auth.result?.payload.sub!).then((subscriptions) => {
      res.status(200).send(subscriptions);
    });
  });
};

export default subscriptions;
