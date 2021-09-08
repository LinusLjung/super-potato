import { Db, useDb } from '@linusljung/use-db';
import fetch from 'node-fetch';
import Endpoints from '../../../shared/youtuber/constants/Endpoints';
import Channel from '../../../shared/youtuber/data-types/Channel.type';
import { saveChannel } from '../database/channels';
import { getDistinctSupscriptionIDs } from '../database/users';
import { API_HOST, API_PORT, API_PROTOCOL, DB_HOST, DB_NAME } from './consts';

function getApiUrl(endpoint: string) {
  if (!endpoint) {
    throw new Error(`Invalid endpoint: ${endpoint}`);
  }

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
      useDb(DB_HOST, DB_NAME, (error, db) => {
        return new Promise((dbResolve, dbReject) => {
          if (error) {
            return dbReject(error);
          }

          db = db!;

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

export { getApiUrl, fetchChannel };

export default updateChannels;
