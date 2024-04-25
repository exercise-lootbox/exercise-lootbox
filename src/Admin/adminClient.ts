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

export const updateUserCoins = async (
  adminId: string,
  userId: string,
  coins: number,
  authToken: string,
) => {
  const response = await axios.put(
    `${ADMIN_API}/users/coins/${userId}`,
    { adminId, coins },
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
  await axios.post(
    `${ADMIN_API}/${userId}`,
    { adminId },
    config(authToken),
  );
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

export const updateLootboxPrice = async (
  adminId: string,
  lootboxId: string,
  price: number,
  authToken: string,
) => {
  const response = await axios.put(
    `${ADMIN_API}/lootbox/${lootboxId}`,
    { adminId, price },
    config(authToken),
  );
  return response.status;
};

export const getUsersMatchingSearch = async (
  adminId: string,
  searchCriteria: string,
  authToken: string,
) => {
  const response = await axios.get(
    `${ADMIN_API}/users/${adminId}/${searchCriteria}`,
    config(authToken),
  );
  return response.data;
};
