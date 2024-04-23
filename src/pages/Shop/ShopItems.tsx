import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as lootboxClient from "./lootboxClient";
import * as itemClient from "./itemClient";
import { ItemInfo, LootboxInfo } from "../../types";
import Lootbox from "../../components/Lootbox";
import Item from "../../components/Item";
import "../../css/shopitems.css";
import Coins from "../../components/Coins";
import { FitCoinState } from "../../store/configureStore";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import BackIcon from "../../components/icons/BackIcon";
import { Link } from "react-router-dom";

export default function ShopItems() {
  const { lootboxId } = useParams();
  const [items, setItems] = useState<ItemInfo[]>([]);
  const [lootbox, setLootbox] = useState<LootboxInfo | null>(null);
  const coins = useSelector(
    (state: FitCoinState) => state.persistedReducer.coins,
  );
  const navigate = useNavigate();

  const sortedItems = items.slice().sort((a, b) => {
    const rarityOrder = {
      COMMON: 0,
      UNCOMMON: 1,
      EPIC: 2,
      LEGENDARY: 3,
    };

    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

  useEffect(() => {
    const fetchBox = async () => {
      if (!lootboxId) {
        return;
      }
      const box = await lootboxClient.getLootbox(lootboxId);
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
      <div className="shop-header">
        <div className="back-header-wrapper">
          <button onClick={() => navigate(-1)} className="back-button">
            <BackIcon />
          </button>
          <h1>
            <Link to={"/shop"} className="shop-link">
              Shop
            </Link>
          </h1>
        </div>

        <Coins coins={coins} />
      </div>
      <div className="lootbox-wrapper">
        <Lootbox lootbox={lootbox} />
      </div>

      <div className="items">
        {sortedItems.map((item) => (
          <>
            <Item key={item._id} item={item} lootbox={lootbox.name} />
          </>
        ))}
      </div>
    </div>
  );
}
