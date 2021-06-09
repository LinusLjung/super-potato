import { Collection, COLLECTION_NAMES, Db, FilterQuery, useDb, User } from '@linusljung/use-db';
import { DB_HOST, DB_NAME } from '../consts';

function getCollection(db: Db) {
  return db.collection<User>(COLLECTION_NAMES.users);
}

function create(collection: Collection<User>, id: string, email: string) {
  const document: Omit<User, '_id'> = {
    id,
    email,
    subscriptions: [],
  };

  return collection.insertOne(document).then((user) => user.ops[0]);
}

export function getOrCreate(id: string, email: string) {
  return new Promise<User>((resolve, reject) => {
    useDb(DB_HOST!, DB_NAME!, (error, db) => {
      return new Promise((useDbResolve, useDbReject) => {
        if (error) {
          reject(error);
          useDbReject(error);

          return;
        }

        db = db!;

        const filter: FilterQuery<User> = {
          id,
        };

        const collection = getCollection(db);

        collection.findOne<User>(filter).then((user) => {
          if (!user) {
            return resolve(create(collection, id, email));
          }

          resolve(user);
          useDbResolve();
        });
      });
    });
  });
}
