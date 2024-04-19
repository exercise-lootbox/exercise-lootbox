import axios from "axios";

const BASE_API = process.env.REACT_APP_API_BASE;
const LOOTBOX_API = `${BASE_API}/api/lootbox`;

export const getLootboxes = async () => {
  const response = await axios.get(`${LOOTBOX_API}`);
  return response.data;
};

export const getLootbox = async (id: string) => {
  const response = await axios.get(`${LOOTBOX_API}/${id}`);
  return response.data;
};
