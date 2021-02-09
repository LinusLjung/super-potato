import { MongoClient } from 'mongodb';

const dbHost = process.env.DB_HOST || 'localhost';
const dbName = process.env.DB_NAME || 'super-potato';

function useClient(callback: (error: Error | null, client: MongoClient | null) => Promise<void>): void {
  const client = new MongoClient(`mongodb://${dbHost}/${dbName}`);

  client
    .connect()
    .catch((e: Error) => {
      throw callback(e, null);
    })
    .then(() => {
      return callback(null, client);
    })
    .finally(() => {
      client.close();
    });
}

export default useClient;
