import { COLLECTION_NAMES, useDb, User } from '@linusljung/use-db';
import { DB_HOST, DB_NAME } from '../consts';

export function getSubscriptions(id: string) {
  return new Promise((resolve, reject) => {
    useDb(DB_HOST, DB_NAME, (error, db) => {
      return new Promise((dbResolve) => {
        if (error) {
          throw error;
        }

        db!
          .collection<User>(COLLECTION_NAMES.users)
          .findOne({
            id,
          })
          .then((user) => {
            resolve(user?.subscriptions);
            dbResolve();
          })
          .catch(() => reject());
      });
    });
  });
}

export function addSubscription(id: string, subscription: string) {
  return new Promise<void>((resolve, reject) => {
    useDb(DB_HOST, DB_NAME, (error, db) => {
      return new Promise((dbResolve) => {
        if (error) {
          throw error;
        }

        db!
          .collection<User>(COLLECTION_NAMES.users)
          .updateOne(
            { id },
            {
              $addToSet: { subscriptions: { id: subscription, type: 'channel' } },
            },
          )
          .then(() => {
            resolve();
            dbResolve();
          })
          .catch(() => reject());
      });
    });
  });
}
