import axios from "axios";
import { config } from "../utils";

const BASE_API = process.env.REACT_APP_API_BASE;
const ADMIN_API = `${BASE_API}/api/admin`;

export const getAdmin = async (adminId: string, authToken: string) => {
  const response = await axios.get(
    `${ADMIN_API}/${adminId}`,
    config(authToken),
  );
  return response.data;
};

export const addUserCoins = async (
  adminId: string,
  userId: string,
  authToken: string,
) => {
  const response = await axios.put(
    `${ADMIN_API}/users/coins/${userId}`,
    { adminId },
    config(authToken),
  );
  return response.data;
};

export const resetUserStravaSync = async (
  adminId: string,
  userId: string,
  authToken: string,
) => {
  const response = await axios.put(
    `${ADMIN_API}/strava/${userId}`,
    { adminId },
    config(authToken),
  );
  return response.status;
};

export const createAdmin = async (
  adminId: string,
  userId: string,
  authToken: string,
) => {
  const response = await axios.post(
    `${ADMIN_API}/${userId}`,
    { adminId },
    config(authToken),
  );
  return response.status;
};

export const deleteAdmin = async (
  adminId: string,
  userId: string,
  authToken: string,
) => {
  const response = await axios.delete(`${ADMIN_API}/${userId}`, {
    ...config(authToken),
    data: { adminId },
  });
  return response.status;
};
