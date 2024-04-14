import axios from "axios";
import { getHashParams, getUserIdAndAuthToken } from "../utils";
import { useEffect } from "react";

const BASE_API = process.env.REACT_APP_API_BASE;
const STRAVA_API = `${BASE_API}/api/strava`;
const EXPIRATION_DURATION = 3600000;

export interface StravaInfo {
  _id: string;
  stravaId: string;
  accessToken: Date;
  refreshToken: Date;
  expiresAt: Date;
}

export const createStrava = async (strava: StravaInfo, userId: string) => {
  const headers = await getHeaders();
  const response = await axios.post(`${STRAVA_API}/${userId}`, strava, {
    headers,
  });
  return response.data;
};

// API call to get Strava user info
export const getStravaUser = async (userId: string) => {
  const headers = await getHeaders();
  const response = await axios.get(`${STRAVA_API}/${userId}`, { headers });
  return response.data;
};

const setTokenTimestamp = () => {
  window.localStorage.setItem("tokenTimestamp", String(Date.now()));
};

const setLocalAccessToken = (accessToken: string) => {
  setTokenTimestamp();
  window.localStorage.setItem("accessToken", accessToken);
};

const setLocalRefreshToken = (refreshToken: string) => {
  window.localStorage.setItem("refreshToken", refreshToken);
};

const getTokenTimestamp = () => {
  const timestamp = window.localStorage.getItem("tokenTimestamp");
  return timestamp ? parseInt(timestamp) : 0;
};

const getLocalAccessToken = () => {
  return window.localStorage.getItem("accessToken");
};

const getLocalRefreshToken = () => {
  return window.localStorage.getItem("refreshToken");
};

const refreshAccessToken = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/strava/refresh_token?refresh_token=${getLocalRefreshToken()}`,
    );
    console.log("data", data);
    const { access_token } = data;
    setLocalAccessToken(access_token);
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};

const getAccessToken = async () => {
  const { error, access_token, refresh_token } = getHashParams();
  console.log("error", error);
  console.log("access_token", access_token);
  console.log("refresh_token", refresh_token);

  if (error) {
    console.error(error);
    refreshAccessToken();
  }

  if (Date.now() - getTokenTimestamp() > EXPIRATION_DURATION) {
    console.log("refreshing token");
    refreshAccessToken();
  }

  const localAccessToken = getLocalAccessToken();

  if ((!localAccessToken || localAccessToken === "undefined") && access_token) {
    setLocalAccessToken(access_token);
    setLocalRefreshToken(refresh_token);
    return access_token;
  }

  return localAccessToken;
};

// const EXPIRATION_DURATION = getExpiresAt(); // 1 hour (Get from MONGODB)

const getHeaders = async () => {
  const { authToken } = await getUserIdAndAuthToken();
  console.log("authToken", authToken);
  return {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };
};

export const token = await getAccessToken();

export const getActivities = async () => {
  console.log("get activities token", token);
  const res = await axios.get(
    "https://www.strava.com/api/v3/athlete/activities?before=56&after=56&page=1&per_page=15",
    { headers: { Authorization: `Bearer ${token}` } },
  );
  console.log("res", res);
  return res;
};
