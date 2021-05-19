import fetch from 'node-fetch';

let _config: Config;

type Config = {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
};

function getOpenIDConfiguration(): Promise<Config> {
  if (_config) {
    return Promise.resolve(_config);
  }

  return new Promise((resolve) => {
    resolve(
      fetch('https://accounts.google.com/.well-known/openid-configuration')
        .then((response) => response.json())
        .then((response) => (_config = response)),
    );
  });
}

export default getOpenIDConfiguration;
