// import { MongoClient } from 'mongodb';
// import fetch from 'node-fetch';
// import getUsers from './get-users';
// import getChannelToUserMap from './getChannelToUserMap';

import updateChannels from './jobs/update-channels';

// const apiHost = process.env.API_HOST || 'localhost';
// const apiPort = process.env.API_PORT || 3000;

// const client = new MongoClient(`mongodb://${dbHost}/${dbName}`);

switch (process.argv[process.argv.length - 1]) {
  case 'update-channels':
    updateChannels();

    break;
}

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
