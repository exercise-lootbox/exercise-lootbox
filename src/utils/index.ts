import * as itemClient from "../pages/Shop/itemClient";
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
