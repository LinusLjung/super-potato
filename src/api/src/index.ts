import superSession from '@linusljung/super-session';
import bodyParser from 'body-parser';
import express from 'express';
import { SESSION_HOST, SESSION_SECRET } from './consts';
import { deleteSubscriptions, getSubscriptions, postSubscriptions } from './handlers/subscriptions';
import isAuthorized from './middlewares/is-authorized';

const app = express();

app.use(superSession(SESSION_HOST!, SESSION_SECRET!)());
app.use(bodyParser.json());

app.get('/subscriptions', isAuthorized, getSubscriptions);
app.post('/subscriptions', isAuthorized, postSubscriptions);
app.delete('/subscriptions', isAuthorized, deleteSubscriptions);

app.listen(process.env.PORT);
console.log(`Listening on port ${process.env.PORT}`);
