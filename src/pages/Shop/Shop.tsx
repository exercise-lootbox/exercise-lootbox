import React, { useEffect, useState } from "react";
import * as lootboxClient from "./lootboxClient";
import { LootboxInfo } from "../../types";
import Lootbox from "../../components/Lootbox";
import Coins from "../../components/Coins";
import "../../css/shop.css";

export default function Shop() {
  const [lootboxes, setLootboxes] = useState<LootboxInfo[]>([]);

  useEffect(() => {
    const fetchLootboxes = async () => {
      const lootboxes = await lootboxClient.getLootboxes();
      setLootboxes(lootboxes);
    };
    fetchLootboxes();
  }, []);

  return (
    <div>
      <div className="shop-header">
        <h1>Shop</h1>
        <Coins coins={1000} />
      </div>
      <div className="lootboxes">
        {lootboxes.map((lootbox) => (
          <Lootbox key={lootbox._id} lootbox={lootbox} />
        ))}
      </div>
    </div>
  );
}
