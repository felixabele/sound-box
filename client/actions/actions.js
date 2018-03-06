import Spotify from 'spotify-web-api-js';
const spotifyApi = new Spotify();

// our constants
export const SPOTIFY_TOKENS = 'SPOTIFY_TOKENS';
export const SPOTIFY_ME_BEGIN = 'SPOTIFY_ME_BEGIN';
export const SPOTIFY_ME_SUCCESS = 'SPOTIFY_ME_SUCCESS';
export const SPOTIFY_ME_FAILURE = 'SPOTIFY_ME_FAILURE';
export const CARD = 'CARD';

// set the app's access and refresh tokens
export function setTokens({accessToken, refreshToken}) {
  if (accessToken) {
    spotifyApi.setAccessToken(accessToken);
  }
  return { type: SPOTIFY_TOKENS, accessToken, refreshToken };
}

// set card ID
export function setCard({cardId, playlistId}) {
  const traceError = (e) => { console.error(e); }
  let user = ''
  let type = ''
  let id = '';

  try {
    const resource = playlistId.split(':');
    [user, type, id] = [resource[resource.length-3], resource[resource.length-2], resource[resource.length-1]];
  } catch (e) {
  }

  return dispatch => {
    const setItemState = (cardData) => {
      dispatch({ type: CARD, cardId, playlistId, cardData});
    };

    if (type === 'album') {
      spotifyApi.getAlbum(id).then(setItemState, traceError);
    }
    else if (type === 'playlist') {
      spotifyApi.getPlaylist(user, id).then(setItemState, traceError);
    }
    else {
      setItemState({});
    }
  }
}

// get the user's info from the /me api
export function getMyInfo() {
  return dispatch => {
    dispatch({ type: SPOTIFY_ME_BEGIN});
    spotifyApi.getMe().then(userData => {
      dispatch({ type: SPOTIFY_ME_SUCCESS, data: userData });
    }).catch(e => {
      dispatch({ type: SPOTIFY_ME_FAILURE, error: e });
    });
  };
}
