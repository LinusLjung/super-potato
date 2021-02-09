import { ObjectId } from 'mongodb';
import User from './models/User.model';

type ReturnValue = { [x: string]: ObjectId[] };

function getChannelToUserMap(users: User[]): ReturnValue {
  const channels: ReturnValue = {};

  users.forEach(({ _id, subscriptions }) =>
    subscriptions
      .filter(({ type }) => type === 'channel')
      .forEach(({ id }) => {
        const channel = (channels[id] = channels[id] || []);

        channel.push(_id);
      }),
  );

  return channels;
}

export default getChannelToUserMap;
