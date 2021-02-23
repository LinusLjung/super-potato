const CHANNEL_KEY = 'channel_id';

type Channel = {
  name: 'channel';
  params: {
    channelId: typeof CHANNEL_KEY;
  };
};

class Endpoints {
  static channel: Channel = {
    name: 'channel',
    params: {
      channelId: 'channel_id',
    },
  };
}

export default Endpoints;
