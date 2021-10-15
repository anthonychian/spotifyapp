require('dotenv').config()

const authEndpoint = process.env.REACT_APP_AUTH_ENDPOINT;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;

const scopes = [
  "ugc-image-upload",
  "playlist-modify-private",
  "playlist-read-private",
  "user-read-private",
  "user-read-playback-state",
  "user-library-modify",
  "user-read-playback-position",
  "app-remote-control",
  "user-read-recently-played",
  "user-modify-playback-state",
  "user-read-email",
  "user-follow-modify",
  "playlist-modify-public",
  "user-follow-read",
  "user-read-currently-playing",
  "playlist-read-collaborative",
  "user-library-read",
  "streaming",
  "user-top-read"
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}`;