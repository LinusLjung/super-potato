import { Db, MongoClient } from 'mongodb';

export * from 'mongodb';
export * from './consts';
export * from './models';
export { useDb };

function useDb(host: string, dbName: string, callback: (error: Error | null, db: Db | null) => Promise<void>): void {
  const client = new MongoClient(`mongodb://${host}/${dbName}`);

  client
    .connect()
    .then(() => {
      return client.db(dbName);
    })
    .catch((e: Error) => {
      throw callback(e, null);
    })
    .then((db: Db) => {
      return callback(null, db);
    })
    .finally(() => {
      client.close();
    });
}
