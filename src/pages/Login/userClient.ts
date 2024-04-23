import axios from "axios";

const BASE_API = process.env.REACT_APP_API_BASE;
const USERS_API = `${BASE_API}/api/users`;

export interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  dob: Date;
}

const config = (authToken: string) => {
  return {
    headers: { Authorization: `Bearer ${authToken}` },
  };
};

export const createUser = async (user: UserInfo) => {
  const response = await axios.post(`${USERS_API}`, user);
  return response.data;
};

export const getUser = async (id: string, authToken: string) => {
  const response = await axios.get(`${USERS_API}/${id}`, config(authToken));
  return response.data;
};

export const buyItem = async (
  uid: string,
  authToken: string,
  coins: number,
  itemId: string,
) => {
  const response = await axios.post(
    `${USERS_API}/buy/${uid}`,
    { itemId, coins },
    config(authToken),
  );
  return response.data;
};
