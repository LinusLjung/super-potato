import express from 'express';
import Endpoints from '../../shared/youtuber/constants/Endpoints';
import channelHandler, { requiredQueryParams } from './handlers/channel';
import validateQueryParamsMiddleware from './middlewares/validateQueryParams';

const app = express();

app.get(`/${Endpoints.channel.name}`, validateQueryParamsMiddleware(requiredQueryParams), channelHandler);

app.listen(process.env.PORT || 3000);
