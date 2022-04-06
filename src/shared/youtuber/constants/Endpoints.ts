const CHANNEL_KEY = 'channel_id';

type Channel = {
  name: 'channel';
  searchParams: {
    channelId: typeof CHANNEL_KEY;
  };
};

class Endpoints {
  static channel: Channel = {
    name: 'channel',
    searchParams: {
      channelId: 'channel_id',
    },
  };
}

export default Endpoints;
