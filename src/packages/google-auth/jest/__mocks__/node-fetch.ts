import { Response } from 'node-fetch';
import openidConfiguration from '../openid-configuration.json';

function fetch(url: string) {
  if (url === 'https://accounts.google.com/.well-known/openid-configuration') {
    return Promise.resolve(new Response(JSON.stringify(openidConfiguration)));
  }

  return Promise.resolve(new Response(JSON.stringify({})));
}

export default fetch;
