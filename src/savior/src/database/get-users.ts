import { MongoClient } from 'mongodb';
import User from '../models/User.model';

function getUsers(client: MongoClient): Promise<User[]> {
  return client.db('super-potato').collection('users').find({}).toArray();
}

export default getUsers;
