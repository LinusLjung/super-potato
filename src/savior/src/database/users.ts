import { Db, FindOneOptions } from 'mongodb';
import User from '../models/User.model';

function getCollection(db: Db) {
  return db.collection('users');
}

export function findUsers(db: Db, options: FindOneOptions<User>): Promise<User[]> {
  return getCollection(db).find({}, options).toArray();
}

export function getDistinctSupscriptionIDs(db: Db): Promise<string[]> {
  return getCollection(db).distinct('subscriptions.id');
}
