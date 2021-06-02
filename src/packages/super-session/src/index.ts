/// <reference path="../typings/express-session.d.ts" />
import connectRedis from 'connect-redis';
import session from 'express-session';
import redis from 'redis';

function superSession(host: string, secret: string) {
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host,
    retry_strategy: (options) => {
      return Math.min(options.attempt, 10) * 1000;
    },
  });

  return function () {
    return session({
      store: new RedisStore({ client: redisClient }),
      secret,
      resave: false,
      saveUninitialized: false,
    });
  };
}

export default superSession;
