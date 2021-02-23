import express from 'express';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { StatusCodes } from 'http-status-codes';
import Endpoints from './constants/Endpoints';
import HttpError from './HttpError';
import Channel from './data-types/Channel.type';
import asArray from './util/asArray';

const app = express();

const CHANNEL_URL = 'https://www.youtube.com/feeds/videos.xml';

app.get(`/${Endpoints.channel.name}`, (req, res) => {
  const channelIdParam = Endpoints.channel.params.channelId;

  if (!req.query[channelIdParam]) {
    res.status(StatusCodes.BAD_REQUEST).send(`Missing ${channelIdParam} param`);
  }

  fetch(`${CHANNEL_URL}?${channelIdParam}=${req.query[channelIdParam]}`)
    .then((response) => {
      if (response.status === StatusCodes.NOT_FOUND) {
        throw new HttpError(StatusCodes.NOT_FOUND);
      }

      return response.text();
    })
    .then((xmlString) =>
      parseStringPromise(xmlString, {
        explicitArray: false,
        async: true,
        attrValueProcessors: [
          (value, name) => {
            switch (name) {
              case 'count':
              case 'width':
              case 'height':
              case 'average':
              case 'min':
              case 'max':
              case 'views':
                return Number(value);
            }

            return value;
          },
        ],
        tagNameProcessors: [
          (name) => {
            if (name === 'entry') {
              return 'entries';
            }

            if (name === 'link') {
              return 'links';
            }

            return name;
          },
        ],
      }).then((xml: Channel) => {
        xml.feed.entries = asArray(xml.feed.entries);
        xml.feed.entries.forEach((entry) => (entry.links = asArray(entry.links)));

        xml.feed.links = asArray(xml.feed.links);

        xml.feed.entries = xml.feed.entries.reverse();

        return xml;
      }),
    )
    .then((xml: Channel) => res.status(StatusCodes.OK).json(xml))
    .catch((e: Error) => {
      if (e instanceof HttpError) {
        res.status(e.code).send();
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    });
});

app.listen(process.env.PORT || 3000);
