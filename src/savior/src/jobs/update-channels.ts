import { Db } from 'mongodb';
import fetch from 'node-fetch';
import { getDistinctSupscriptionIDs } from '../database/users';
import useDb from '../database/use-db';
import Endpoints from '../../../youtuber/src/constants/Endpoints';
import Channel from '../../../youtuber/src/data-types/Channel.type';
import { saveChannel } from '../database/channels';

const API_PROTOCOL = 'http';
const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 3000;

function getApiUrl(endpoint: string) {
  return `${API_PROTOCOL}://${API_HOST}:${API_PORT}/${endpoint}`;
}

function fetchChannel(id: string): Promise<Channel> {
  const endpoint = Endpoints.channel;
  const apiUrl = getApiUrl(endpoint.name);
  const url = new URL(apiUrl);

  url.searchParams.set(endpoint.params.channelId, id);

  return fetch(url.toString()).then((response) => response.json());
}

function updateChannels(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      useDb((error, db) => {
        return new Promise((dbResolve, dbReject) => {
          if (error) {
            return dbReject(error);
          }

          db = db as Db;

          getDistinctSupscriptionIDs(db)
            .then((subscriptionIDs) => {
              return Promise.all(
                subscriptionIDs.map((id) => fetchChannel(id).then((channel) => saveChannel({ db: db as Db, channel }))),
              );
            })
            .then(() => dbResolve());
        });
      });
    } catch (error: unknown) {
      reject(error);
    }

    resolve();
  });
}

export default updateChannels;
