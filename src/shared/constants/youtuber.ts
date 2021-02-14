const CHANNEL_KEY = 'channel_id';

type Channel = {
  name: 'channel';
  params: {
    channelId: typeof CHANNEL_KEY;
  };
};

export class ENDPOINTS {
  static channel: Channel = {
    name: 'channel',
    params: {
      channelId: 'channel_id',
    },
  };
}