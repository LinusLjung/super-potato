import { COLLECTION_NAMES, useDb, User } from '@linusljung/use-db';
import assert from 'assert';
import { DB_HOST, DB_NAME } from '../consts';

export function getSubscriptions(id: string): Promise<User['subscriptions']> {
  return new Promise((resolve, reject) => {
    useDb(DB_HOST, DB_NAME, (error, db) => {
      return new Promise((dbResolve) => {
        if (error) {
          throw error;
        }

        assert(db);

        db.collection<User>(COLLECTION_NAMES.users)
          .findOne({
            id,
          })
          .then((user) => {
            resolve(user?.subscriptions ?? []);
            dbResolve();
          })
          .catch(() => reject());
      });
    });
  });
}

export function addSubscription(id: string, subscription: string): Promise<void> {
  return new Promise((resolve, reject) => {
    useDb(DB_HOST, DB_NAME, (error, db) => {
      return new Promise((dbResolve) => {
        if (error) {
          throw error;
        }

        assert(db);

        db.collection<User>(COLLECTION_NAMES.users)
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

export function deleteSubscription(userId: string, subscriptionId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    useDb(DB_HOST, DB_NAME, (error, db) => {
      return new Promise((dbResolve) => {
        if (error) {
          throw error;
        }

        assert(db);

        db.collection<User>(COLLECTION_NAMES.users)
          .updateOne(
            { id: userId },
            {
              $pull: {
                subscriptions: { id: subscriptionId },
              },
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
