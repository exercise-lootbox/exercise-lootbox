import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as lootboxClient from "./lootboxClient";
import * as itemClient from "./itemClient";
import { ItemInfo, LootboxInfo } from "../../types";
import Lootbox from "../../components/Lootbox";
import Item from "../../components/Item";
import "../../css/shopitems.css";

export default function ShopItems() {
  const { lootboxId } = useParams();
  const [items, setItems] = useState<ItemInfo[]>([]);
  const [lootbox, setLootbox] = useState<LootboxInfo | null>(null);

  useEffect(() => {
    const fetchBox = async () => {
      if (!lootboxId) {
        return;
      }
      const box = await lootboxClient.getLootbox(lootboxId);
      console.log(box);
      setLootbox(box);
    };
    const fetchItems = async () => {
      if (!lootboxId) {
        return;
      }
      const items = await itemClient.getBoxItems(lootboxId);
      setItems(items);
    };
    fetchBox();
    fetchItems();
  }, [lootboxId]);

  if (!lootbox) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Lootbox lootbox={lootbox} />
      <div className="items">
        {items.map((item) => (
          <Item key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
