import { MongoClient, ObjectId } from 'mongodb';
import circulationRepo, { ItemType } from './repos/circulationRepo';
import data from './circulation';
import assert from 'assert';

const url = 'mongodb://localhost:27017';
// const dbName = 'circulation';

async function main() {
  const client = new MongoClient(url);

  await client.connect();

  const results = await circulationRepo.loadData(data as ItemType[]);
  assert.strictEqual(data.length, results.insertedCount);

  const gottenData = await circulationRepo.get();
  assert.strictEqual(data.length, gottenData.length);

  const filteredData = await circulationRepo.get({ Newspaper: gottenData[4]?.Newspaper });
  assert.deepStrictEqual(filteredData[0], gottenData[4]);

  const limit = 3;
  const limitedData = await circulationRepo.get({}, limit);
  assert.strictEqual(limitedData.length, limit);

  const id: string = gottenData[1]._id.toString();
  const dataById = await circulationRepo.getById(new ObjectId(id));
  assert.deepStrictEqual(gottenData[1], dataById);

  const newItem = {
    Newspaper: 'My paper',
    'Daily Circulation, 2004': 1,
    'Daily Circulation, 2013': 2,
    'Change in Daily Circulation, 2004-2013': -10,
    'Pulitzer Prize Winners and Finalists, 1990-2003': 3,
    'Pulitzer Prize Winners and Finalists, 2004-2014': 4,
    'Pulitzer Prize Winners and Finalists, 1990-2014': 5,
  };

  const addResult = await circulationRepo.add((newItem as unknown) as ItemType);
  assert.ok(addResult?.insertedId);

  const updateResult = await circulationRepo.update(addResult.insertedId, ({
    ...newItem,
    Newspaper: 'My updated paper',
  } as unknown) as ItemType);
  assert.strictEqual(updateResult.modifiedCount, 1);

  const removeResult = await circulationRepo.remove(gottenData[0]._id);
  assert.ok(removeResult.deletedCount);

  const averageFinalists = await circulationRepo.averageFinalists();

  console.log('averageFinalists', averageFinalists);

  const averageFinalistsByChange = await circulationRepo.averageFinalistsByChange();

  console.log('averageFinalistsByChange', averageFinalistsByChange);

  // const admin = client.db(dbName).admin();

  client.close();
}

main();
