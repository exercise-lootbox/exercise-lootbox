import axios from "axios";

const BASE_API = process.env.REACT_APP_API_BASE;
const STRAVA_API = `${BASE_API}/api/strava`;
const STRAVA_API_URL = "https://www.strava.com/api/v3";

export interface StravaInfo {
  _id: string;
  stravaId: string;
  accessToken: Date;
  refreshToken: Date;
  expiresAt: Date;
}

export const createStrava = async (
  strava: any,
  userId: string,
  authToken: string,
) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const response = await axios.post(
      `${STRAVA_API}/${userId}`,
      strava,
      config,
    );
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

// API call to get Strava user info
export const getStravaUser = async (userId: string, authToken: string) => {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const response = await axios.get(`${STRAVA_API}/${userId}`, config);
  return response.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const { data } = await axios.post(
      `http://localhost:4000/api/strava/refresh_token?refresh_token=${refreshToken}`,
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const updateStravaData = async (
  stravaData: any,
  userId: string,
  authToken: string,
) => {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  try {
    const response = await axios.put(
      `${STRAVA_API}/${userId}`,
      {
        accessToken: stravaData.accessToken,
        refreshToken: stravaData.refreshToken,
        expiresAt: stravaData.expiresAt,
      },
      config,
    );

    return response.data;
  } catch (error) {
    console.error("Error updating Strava data:", error);
  }
};

// API CALLS
export const getAthlete = async (token: string) => {
  try {
    const response = await axios.get(`${STRAVA_API_URL}/athlete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Athlete data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching athlete data:", error);
  }
};
