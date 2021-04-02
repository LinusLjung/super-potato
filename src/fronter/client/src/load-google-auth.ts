import loadScript from './load-script';

export type GoogleAuth = {
  instance: gapi.auth2.GoogleAuth;
};

function loadGoogleAuth(): Promise<GoogleAuth> {
  return new Promise((resolve) => {
    loadScript('https://apis.google.com/js/api.js')
      .then(() => {
        gapi.load('client:auth2', () => {
          // console.log('initClient()', initClient());
          // initClient().catch((e) => console.log('initClient().catch', e));
          resolve(initClient());
        });
      })
      .catch((e) => {
        console.log('e', e);
      });
  });
}

function getGoogleAuth() {
  console.log(gapi.auth2?.getAuthInstance);
  const instance = gapi.auth2?.getAuthInstance();

  console.log('instance', instance);

  return { instance };
}

function initClient(): Promise<GoogleAuth> {
  console.log('init client');
  return new Promise((resolve) => {
    gapi.client
      .init({
        clientId: '518159920759-gb1fph16sgup5tfscv0akjgnhbluso8i.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/userinfo.email',
        discoveryDocs: [],
      })
      // .catch((e) => console.log('catch catch', e))
      .then(
        function () {
          console.log('resolve');
          resolve(getGoogleAuth());
        },
        function (e) {
          console.debug('Google authentication init failed', e);
          resolve(getGoogleAuth());
        },
      );
  });
}

export default loadGoogleAuth;
