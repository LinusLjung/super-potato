import { RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { addSubscription, getSubscriptions as dbGetSubscriptions } from '../database/subscriptions';

function errorHandler(res: Response) {
  res.status(500).send();
}

export const getSubscriptions: RequestHandler = (req, res) => {
  dbGetSubscriptions(req.authData!.result?.payload.sub!)
    .then((subscriptions) => {
      res.status(200).send(subscriptions);
    })
    .catch(() => errorHandler(res));
};

type PostReqBody = {
  url: string;
};

export const postSubscriptions: RequestHandler = (req, res) => {
  const body: PostReqBody = req.body;

  if (!body) {
    return res.status(StatusCodes.BAD_REQUEST).send('Missing request body');
  }

  if (!body.url) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing field 'url'");
  }

  addSubscription(req.authData!.result?.payload.sub!, body.url)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => errorHandler(res));
};
