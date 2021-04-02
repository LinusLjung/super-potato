// import loadGoogleAuth, { GoogleAuth } from './load-google-auth';

console.log('loading...');
// loadGoogleAuth().then(({ instance }) => {
//   const isSignedIn = instance.isSignedIn.get();

//   if (isSignedIn) {
//     const signedInTextElement = document.querySelector('signed-in-text');

//     if (signedInTextElement) {
//       signedInTextElement.textContent = `Signed in as ${instance.currentUser.get().getBasicProfile().getEmail()}`;
//     }
//   }
// });

// googleAuthPromise
//   .then(() => console.log('googleAuthPromise.then'))
//   .catch((...args) => console.log('googleAuthPromise.catch', ...args));

// function handleButtonClick() {
//   console.log('click', googleAuthPromise);
//   googleAuthPromise.then((googleAuth: GoogleAuth) => {
//     googleAuth.instance.signIn();
//   });
// }

// function setupButtonListeners() {
//   const loginButtons = document.querySelectorAll('.sign-in');

//   console.log(loginButtons);

//   loginButtons.forEach((button) => button.addEventListener('click', handleButtonClick));
// }

// function setupAnchorButton() {
//   const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

//   url.searchParams.set('client_id', '518159920759-gb1fph16sgup5tfscv0akjgnhbluso8i.apps.googleusercontent.com');
//   url.searchParams.set('redirect_uri', 'http://super-potato.linusljung.se:8080/test');
//   url.searchParams.set('response_type', 'code');
//   url.searchParams.set('scope', 'https://www.googleapis.com/auth/userinfo.email');

//   document.querySelectorAll('.sign-in-anchor').forEach((a) => {
//     a.setAttribute('href', url.toString());
//   });
// }

// document.addEventListener('DOMContentLoaded', function () {
//   // setupButtonListeners();
//   setupAnchorButton();
// });
