import { Db } from '@linusljung/use-db';

function getCollection(db: Db) {
  return db.collection('users');
}

export function getDistinctSupscriptionIDs(db: Db): Promise<string[]> {
  return getCollection(db).distinct('subscriptions.id');
}
