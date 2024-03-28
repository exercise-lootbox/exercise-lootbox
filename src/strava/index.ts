import axios from 'axios';

const setRefreshToken = (refreshToken: string) => {
  // Save to mongodb
  return refreshToken;
};
const setAccessToken = (accessToken: string) => {
  // Save to mongodb
  return accessToken;
};
const setExpiresAt = (expiresAt: string) => {
  // Save to mongodb
  return expiresAt;
};

const getRefreshToken = () => {
  // Get from mongodb
  return 'refresh_token';
};

const getExpiresAt = () => {
  // Get from mongodb
  return 'expires_at';
};

const refreshAccessToken = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/strava/refresh_token?refresh_token=${getRefreshToken()}`
    );
    const { access_token, expires_at, refresh_token } = data;
    setRefreshToken(refresh_token);
    setAccessToken(access_token);
    setExpiresAt(expires_at);
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};

const getAccessToken = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/strava/token');
    const data = await response.json();

    if (data.expires_at < Date.now()) {
      const newToken = await refreshAccessToken();
      return newToken;
    }

    return data.access_token;
  } catch (error) {
    console.error(error);
  }
};

const EXPIRATION_DURATION = getExpiresAt(); // 1 hour (Get from MONGODB)
const token = getAccessToken();
