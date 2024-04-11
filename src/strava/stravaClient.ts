import axios from "axios";

const BASE_API = process.env.REACT_APP_API_BASE;
const STRAVA_API = `${BASE_API}/api/strava`;

export interface StravaInfo {
  _id: string;
  stravaId: string;
  accessToken: Date;
  refreshToken: Date;
  expiresAt: Date;
}

export const createStrava = async (
  strava: StravaInfo,
  userId: string,
  authToken: string,
) => {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const response = await axios.post(`${STRAVA_API}/${userId}`, strava, config);
  return response.data;
};

export const getStravaUser = async (userId: string, authToken: string) => {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const response = await axios.get(`${STRAVA_API}/${userId}`, config);
  return response.data;
};

// TODO: get the user id and at it to the requests

const setRefreshToken = async (userId: string, refreshToken: string) => {
  const body = {
    refreshToken: refreshToken,
  };

  const response = await axios.put(`${STRAVA_API}/${userId}`, body);
  return response.data.refreshToken;
};

const setAccessToken = async (userId: string, accessToken: string) => {
  const body = {
    accessToken: accessToken,
  };

  const response = await axios.put(`${STRAVA_API}/${userId}`, body);
  return response.data.accessToken;
};

const setExpiresAt = async (userId: string, expiresAt: string) => {
  const body = {
    expiresAt: expiresAt,
  };

  const response = await axios.put(`${STRAVA_API}/${userId}`, body);
  return response.data.expiresAt;
};

const getRefreshToken = async (userId: string) => {
  const response = await axios.get(`${STRAVA_API}/${userId}`);
  return response.data.refreshToken;
};

const getExpiresAt = async (userId: string) => {
  const response = await axios.get(`${STRAVA_API}/${userId}`);
  return response.data.expiresAt;
};

const refreshAccessToken = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/strava/refresh_token?refresh_token=${getRefreshToken("userId")}`,
    );
    const { access_token, expires_at, refresh_token } = data;
    setRefreshToken("userId", refresh_token);
    setAccessToken("userId", access_token);
    setExpiresAt("userId", expires_at);
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};

const getAccessToken = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/strava/token");
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

// const EXPIRATION_DURATION = getExpiresAt(); // 1 hour (Get from MONGODB)
// const token = getAccessToken();
