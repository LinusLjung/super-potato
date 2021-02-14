import { Db, MongoClient } from 'mongodb';

const dbHost = process.env.DB_HOST || 'localhost';
const dbName = process.env.DB_NAME || 'super-potato';

function useClient(callback: (error: Error | null, db: Db | null) => Promise<void>): void {
  const client = new MongoClient(`mongodb://${dbHost}/${dbName}`);

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
      console.log('closing...');
      client.close();
    });
}

export default useClient;
