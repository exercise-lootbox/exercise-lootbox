import * as itemClient from "../pages/Shop/itemClient";
import * as lootboxClient from "../pages/Shop/lootboxClient";
import { ItemInfo } from "../types";

export const getRandomItem = async (lootboxId: string) => {
  const items = await itemClient.getBoxItems(lootboxId);
  const randomNumber = Math.round(Math.random() * 100);

  const rarityThresholds = [
    { threshold: 2, rarity: "LEGENDARY" },
    { threshold: 10, rarity: "EPIC" },
    { threshold: 30, rarity: "UNCOMMON" },
    { threshold: 100, rarity: "COMMON" },
  ];

  let availableItems = [];

  for (const { threshold, rarity } of rarityThresholds) {
    if (randomNumber < threshold) {
      availableItems = items.filter((item: ItemInfo) => item.rarity === rarity);
      break;
    }
  }

  const randomIndex = Math.floor(Math.random() * availableItems.length);
  const randomItem = availableItems[randomIndex];
  return randomItem;
};

export const config = (authToken: string) => {
  return {
    headers: { Authorization: `Bearer ${authToken}` },
  };
};

export const getLootboxName = async (lootboxId: string) => {
  const lootbox = await lootboxClient.getLootbox(lootboxId);
  return lootbox.name;
};

export const sortInventoryItems = (items: ItemInfo[]) => {
  return items.slice().sort((a, b) => {
    if (a.lootboxId !== b.lootboxId) {
      return a.lootboxId.localeCompare(b.lootboxId);
    }

    if (a.rarity !== b.rarity) {
      const rarityOrder = {
        COMMON: 0,
        UNCOMMON: 1,
        EPIC: 2,
        LEGENDARY: 3,
      };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    }

    return a.name.localeCompare(b.name);
  });
};

export const showAdminContent = (
  adminId: string | undefined,
  actingAsAdmin: boolean,
): boolean => {
  return (adminId !== undefined) && actingAsAdmin;
};
