import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { FitCoinState } from "../../store/configureStore";
import * as userClient from "../Login/userClient";
import * as itemClient from "../Shop/itemClient";
import InventoryItem from "../../components/Items/InventoryItem";
import "../../css/inventory.css";
import { ItemInfo } from "../../types";

export default function Inventory() {
  const { uid } = useParams();
  const userId = useSelector(
    (state: FitCoinState) => state.persistedReducer.userId,
  );
  const auth = useSelector(
    (state: FitCoinState) => state.persistedReducer.authToken,
  );

  const [items, setItems] = useState<ItemInfo[]>([]);

  const [user, setUser] = useState<string>("");

  useEffect(() => {
    const retrieveUserItems = async () => {
      try {
        const items = await userClient.getItems(uid ? uid : userId, auth);
        const itemPromises = items.map((item: string) =>
          itemClient.getItem(item),
        );
        const fetchedItems = await Promise.all(itemPromises);
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error retrieving user items:", error);
      }
    };

    if (uid) {
      userClient.getUser(uid, auth).then((user) => setUser(user.firstName));
    }
    retrieveUserItems();
  }, [auth, uid, userId]);

  const sortedItems = items.slice().sort((a, b) => {
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

  if (!uid) {
    return (
      <div className="inventory-container">
        <h1 className="inventory-header">Current User's Inventory</h1>
        <div className="items">
          {sortedItems.map((item) => (
            <InventoryItem key={item._id} itemId={item._id} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="inventory-container">
        <h1 className="inventory-header">{user}'s Inventory</h1>
        <div className="items">
          {sortedItems.map((item) => (
            <InventoryItem key={item._id} itemId={item._id} />
          ))}
        </div>
      </div>
    );
  }
}
