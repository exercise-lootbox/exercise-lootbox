import axios from "axios";

const BASE_API = process.env.REACT_APP_API_BASE;
const USERS_API = `${BASE_API}/api/users`;

export interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  dob: Date;
}

export const createUser = async (user: UserInfo) => {
  const response = await axios.post(`${USERS_API}`, user);
  return response.data;
};

export const getUser = async (id: string, authToken: string) => {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };

  const response = await axios.get(`${USERS_API}/${id}`, config);
  return response.data;
};

export const updateStravaId = async (
  id: string,
  stravaId: string,
  authToken: string,
) => {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const response = await axios.put(`${USERS_API}/${id}`, { stravaId }, config);
  return response.data;
};
