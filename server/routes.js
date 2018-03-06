'use strict';

const Spotify       = require('spotify-web-api-node');
const querystring   = require('querystring');
const express       = require('express');
const expRouter = new express.Router();

// configure the express server
const CLIENT_ID     = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI  = process.env.REDIRECT_URI
const STATE_KEY     = 'spotify_auth_state';
// your application requests authorizationnpm run build
const scopes = ['user-read-private', 'user-read-email', 'user-library-read', 'playlist-read-private'];

// configure spotify
const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
});

/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N => (Math.random().toString(36)+Array(N).join('0')).slice(2, N+2);

function routerFn (onAssignList) {

  expRouter.get('/login', (_, res) => {
    const state = generateRandomString(16);
    res.cookie(STATE_KEY, state);
    res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
  });

  expRouter.post('/assign_list', (req, res) => {
    onAssignList(null, req.body.playlistId)
    res.send(req.body);
  });

  expRouter.get('/callback', (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

    if (state === null || state !== storedState) {
      res.redirect('/#/error/state mismatch');
    } else {
      res.clearCookie(STATE_KEY);
      spotifyApi.authorizationCodeGrant(code).then(data => {
        const { expires_in, access_token, refresh_token } = data.body;

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        res.redirect(`/#/user/${access_token}/${refresh_token}`);
      }).catch(err => {
        res.redirect('/#/error/invalid token');
      });
    }
  });
  return expRouter;
}

module.exports = routerFn;
