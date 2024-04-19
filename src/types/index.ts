export interface LootboxInfo {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export interface ItemInfo {
  _id: string;
  lootboxId: string;
  name: string;
  description: string;
  image: string;
  rarity: Rarity;
}

enum Rarity {
  COMMON = "common",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}
