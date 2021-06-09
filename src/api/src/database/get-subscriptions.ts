import { COLLECTION_NAMES, useDb, User } from '@linusljung/use-db';
import { DB_HOST, DB_NAME } from '../consts';

function getSubscriptions(id: string) {
  return new Promise((resolve) => {
    useDb(DB_HOST, DB_NAME, (error, db) => {
      return new Promise((dbResolve) => {
        if (error) {
          throw error;
        }

        db?.collection(COLLECTION_NAMES.users)
          .findOne<User>({
            id,
          })
          .then((user) => {
            resolve(user?.subscriptions);
            dbResolve();
          });
      });
    });
  });
}

export default getSubscriptions;
