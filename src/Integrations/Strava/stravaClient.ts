import axios from "axios";

const BASE_API = process.env.REACT_APP_API_BASE;
const STRAVA_API = `${BASE_API}/api/strava`;

export const connectToStrava = async (userId: String) => {
  let response = await axios.get(`${STRAVA_API}/connect/${userId}`);
  return response.data;
};

export const getStravaId = async (userId: String) => {
  let response = await axios.get(`${STRAVA_API}/${userId}`);
  return response.data;
};
