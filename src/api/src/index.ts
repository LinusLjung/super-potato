import superSession from '@linusljung/super-session';
import express from 'express';
import { SESSION_HOST, SESSION_SECRET } from './consts';
import subscriptions from './handlers/subscriptions';

const app = express();

app.use(superSession(SESSION_HOST!, SESSION_SECRET!)());

app.get('/subscriptions', subscriptions);

app.listen(process.env.PORT);
console.log(`Listening on port ${process.env.PORT}`);
