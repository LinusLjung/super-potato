import { Db, COLLECTION_NAMES } from '@linusljung/use-db';

function getCollection(db: Db) {
  return db.collection(COLLECTION_NAMES.users);
}

export function getDistinctSupscriptionIDs(db: Db): Promise<string[]> {
  return getCollection(db).distinct('subscriptions.id');
}
