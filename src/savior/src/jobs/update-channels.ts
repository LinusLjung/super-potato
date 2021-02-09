import useClient from '../database/use-client';

function updateChannels(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      useClient((error, client) => {
        return new Promise((resolve) => {
          if (error) {
            return reject(error);
          }

          client?.db.

          resolve();
        });
      });
    } catch (error: unknown) {
      reject(error);
    }
  });
}

export default updateChannels;
