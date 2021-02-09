/* eslint-disable no-async-promise-executor */
import {
  AggregationCursor,
  Db,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  MongoClient,
  ObjectId,
  UpdateWriteOpResult,
} from 'mongodb';

export type ItemType = {
  [x: string]: string | number;
} & {
  _id: ObjectId;
};

function circulationRepo() {
  const url = 'mongodb://localhost:27017';
  const dbName = 'circulation';
  const collection = 'newspapers';

  function connector<T>(callback: (db: Db) => T) {
    return new Promise<T>(async (resolve, reject) => {
      const client = new MongoClient(url);

      try {
        await client.connect();
        const db = client.db(dbName);

        resolve(await callback(db));
      } catch (e) {
        reject(e);
      } finally {
        client.close();
      }
    });
  }

  function loadData(data: ItemType[]) {
    return connector<Promise<InsertWriteOpResult<ItemType>>>(async (db) => {
      await db.collection(collection).deleteMany({});

      return db.collection(collection).insertMany(data);
    });
  }

  function get(query?: { [x: string]: any }, limit?: number) {
    return connector<Promise<Array<ItemType>>>(async (db) => {
      const items = db.collection(collection).find(query);

      if (limit && limit > 0) {
        items.limit(limit);
      }

      return items.toArray();
    });
  }

  function getById(id: ObjectId) {
    return connector<Promise<ItemType | null>>(async (db) => {
      return await db.collection(collection).findOne({ _id: id });
    });
  }

  function add(item: ItemType) {
    return connector<Promise<InsertOneWriteOpResult<ItemType>>>(async (db) => {
      return db.collection(collection).insertOne(item);
    });
  }

  function update(id: ObjectId, data: ItemType) {
    return connector<Promise<UpdateWriteOpResult>>(async (db) => {
      return db.collection(collection).updateOne({ _id: id }, { $set: data });
    });
  }

  function remove(id: ObjectId) {
    return connector<Promise<DeleteWriteOpResultObject>>(async (db) => {
      return db.collection(collection).deleteOne({ _id: id });
    });
  }

  function averageFinalists() {
    return connector(async (db) => {
      const average: AggregationCursor<{ _id: never; averageFinalists: number }> = db
        .collection(collection)
        .aggregate([
          { $group: { _id: null, averageFinalists: { $avg: '$Pulitzer Prize Winners and Finalists, 1990-2014' } } },
        ]);

      return (await average.toArray())?.[0].averageFinalists;
    });
  }

  function averageFinalistsByChange() {
    return connector(async (db) => {
      const average: AggregationCursor<{ _id: 'positive' | 'negative'; averageFinalists: number }> = db
        .collection(collection)
        .aggregate([
          {
            $project: {
              Newspaper: 1,
              'Pulitzer Prize Winners and Finalists, 1990-2014': 1,
              'Change in Daily Circulation, 2004-2013': 1,
              overallChange: {
                $cond: {
                  if: { $gte: ['$Change in Daily Circulation, 2004-2013', 0] },
                  then: 'positive',
                  else: 'negative',
                },
              },
            },
          },
          {
            $group: {
              _id: '$overallChange',
              averageFinalists: { $avg: '$Pulitzer Prize Winners and Finalists, 1990-2014' },
            },
          },
        ]);

      return (await average.toArray())?.[0];
    });
  }

  return { loadData, get, getById, add, update, remove, averageFinalists, averageFinalistsByChange };
}

export default circulationRepo();
