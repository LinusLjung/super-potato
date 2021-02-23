import updateChannels from './jobs/update-channels';

switch (process.argv[process.argv.length - 1]) {
  case 'update-channels':
    updateChannels();

    break;
}
