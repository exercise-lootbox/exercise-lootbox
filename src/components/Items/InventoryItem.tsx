import React, { useEffect, useState } from "react";
import "../../css/item.css";
import { ItemInfo } from "../../types";
import * as itemClient from "../../pages/Shop/itemClient";
import * as lootboxClient from "../../pages/Shop/lootboxClient";
import Item from "./Item";

export default function InventoryItem({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<ItemInfo | null>(null);
  const [lootboxName, setLootboxName] = useState<string>("");

  useEffect(() => {
    const fetchItem = async () => {
      const inventoryItem = await itemClient.getItem(itemId);
      setItem(inventoryItem);
      const lootbox = await lootboxClient.getLootbox(inventoryItem.lootbox_id);
      setLootboxName(lootbox.name);
    };
    fetchItem();
  }, [itemId]);

  if (!item) {
    return null;
  }

  return <Item item={item} lootbox={lootboxName} />;
}
