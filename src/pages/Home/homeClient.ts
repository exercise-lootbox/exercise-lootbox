import axios from "axios";

const BASE_API = process.env.REACT_APP_API_BASE;
const SPOTLIGHT_API = `${BASE_API}/api/spotlight`;

export const getMemberSpotlight = async () => {
  const response = await axios.get(`${SPOTLIGHT_API}`);
  return response.data;
};
