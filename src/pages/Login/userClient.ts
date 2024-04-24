import axios from "axios";
import { config } from "../../utils";

const BASE_API = process.env.REACT_APP_API_BASE;
const USERS_API = `${BASE_API}/api/users`;

export interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
}

export const createUser = async (user: UserInfo) => {
  const response = await axios.post(`${USERS_API}`, user);
  return response.data;
};

export const updateUser = async (
  id: string,
  user: UserInfo,
  authToken: string,
) => {
  const response = await axios.put(
    `${USERS_API}/${id}`,
    user,
    config(authToken),
  );
  return response.data;
};

export const updateEmail = async (
  id: string,
  email: string,
  authToken: string,
) => {
  const response = await axios.put(
    `${USERS_API}/email/${id}`,
    { email },
    config(authToken),
  );
  return response.data;
};

export const getUser = async (id: string, authToken: string) => {
  const response = await axios.get(`${USERS_API}/${id}`, config(authToken));
  return response.data;
};

export const getOtherUser = async (id: string) => {
  const response = await axios.get(`${USERS_API}/other/${id}`);
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
