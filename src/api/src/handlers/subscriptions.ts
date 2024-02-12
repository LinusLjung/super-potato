import { RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { addSubscription, deleteSubscription, getSubscriptions as dbGetSubscriptions } from '../database/subscriptions';
import assert from 'assert';

function errorHandler(res: Response) {
  res.status(500).send();
}

export const getSubscriptions: RequestHandler = (req, res) => {
  assert(req.authData?.result?.payload?.sub);

  dbGetSubscriptions(req.authData.result.payload.sub)
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

  assert(req.authData?.result?.payload.sub);

  addSubscription(req.authData.result.payload.sub, body.url)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => errorHandler(res));
};

type DeleteReqBody = {
  id: string;
};

export const deleteSubscriptions: RequestHandler = (req, res) => {
  const body: DeleteReqBody = req.body;

  if (!body) {
    return res.status(StatusCodes.BAD_REQUEST).send('Missing request body');
  }

  if (!body.id) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing field 'id'");
  }

  assert(req.authData?.result?.payload.sub);

  deleteSubscription(req.authData.result.payload.sub, body.id)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => errorHandler(res));
};
