// import { MongoClient } from 'mongodb';
// import fetch from 'node-fetch';
// import getUsers from './get-users';
// import getChannelToUserMap from './getChannelToUserMap';

const apiHost = process.env.API_HOST || 'localhost';
const apiPort = process.env.API_PORT || 3000;

// const client = new MongoClient(`mongodb://${dbHost}/${dbName}`);

// client
//   .connect()
//   .then(getUsers)
//   .then(getChannelToUserMap)
//   .then((map) => {
//     Promise.all(Object.keys(map).map((key) => {
//       fetch(`${apiHost}:${apiPort}`);
//     }));
//   })
//   .finally(() => {
//     client.close();
//   });
