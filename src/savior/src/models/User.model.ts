import Base from "./Base.model";

type Subscription = {
  type: 'channel';
  id: string;
}

type User = Base & {
  subscriptions: Subscription[];
}

export default User;