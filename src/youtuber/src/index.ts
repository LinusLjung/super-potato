import express from 'express';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { StatusCodes } from 'http-status-codes';
import HttpError from './HttpError';
import Channel from './data-types/Channel.type';
import asArray from './util/asArray';

const app = express();

const CHANNEL_URL = 'https://www.youtube.com/feeds/videos.xml';
const CHANNEL_KEY = 'channel_id';

app.get('/channel', (req, res) => {
  if (!req.query[CHANNEL_KEY]) {
    res.status(StatusCodes.BAD_REQUEST).send(`Missing ${CHANNEL_KEY} param`);
  }

  fetch(`${CHANNEL_URL}?${CHANNEL_KEY}=${req.query[CHANNEL_KEY]}`)
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
