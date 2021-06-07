import Base from './Base';

type Subscription = {
  type: 'channel';
  id: string;
};

type User = Base & {
  id: string;
  email: string;
  subscriptions: Subscription[];
};

export default User;
