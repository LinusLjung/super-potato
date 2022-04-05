import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import fetch, { Response as FetchResponse } from 'node-fetch';
import Endpoints from '../../../shared/youtuber/constants/Endpoints';
import { CHANNEL_URL } from '../consts';
import HttpError from '../HttpError';
import { buildUrl } from '../util/buildUrl';
import parseChannelXml from '../util/parsers/channel';

export const requiredQueryParams = Object.values(Endpoints.channel.searchParams);

export function handleChannelResponse(response: FetchResponse) {
  if (response.status < 200 || response.status >= 300) {
    throw new HttpError(StatusCodes.NOT_FOUND);
  }

  return response.text();
}

const channelHandler: Handler = (req, res) => {
  const channelId = Endpoints.channel.searchParams.channelId;

  return fetch(buildUrl(CHANNEL_URL, { [channelId]: req.query[channelId] }))
    .then(handleChannelResponse)
    .then(parseChannelXml)
    .then((xml) => res.status(StatusCodes.OK).json(xml))
    .catch((e: Error) => {
      if (e instanceof HttpError) {
        res.status(e.code).send();
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    });
};

export default channelHandler;
