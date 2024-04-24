import axios from "axios";

const BASE_API = process.env.REACT_APP_API_BASE;
const ITEM_API = `${BASE_API}/api/items`;

export const getItems = async () => {
  const response = await axios.get(`${ITEM_API}`);
  return response.data;
};

export const getItem = async (itemId: string) => {
  const response = await axios.get(`${ITEM_API}/${itemId}`);
  return response.data;
};

export const getBoxItems = async (lootboxId: string) => {
  const response = await axios.get(`${ITEM_API}/lootbox/${lootboxId}`);
  return response.data;
};
