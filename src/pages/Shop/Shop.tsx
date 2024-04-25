import React, { useEffect, useState } from "react";
import * as lootboxClient from "./lootboxClient";
import { LootboxInfo } from "../../types";
import Lootbox from "../../components/Lootbox/Lootbox";
import Coins from "../../components/Coins";
import "../../css/shop.css";
import { useSelector } from "react-redux";
import { FitCoinState } from "../../store/configureStore";
import { showAdminContent } from "../../utils";

export default function Shop() {
  const [lootboxes, setLootboxes] = useState<LootboxInfo[]>([]);
  const coins = useSelector(
    (state: FitCoinState) => state.persistedReducer.coins,
  );
  const adminId = useSelector(
    (state: FitCoinState) => state.persistedReducer.adminId,
  );
  const actingAsAdmin = useSelector(
    (state: FitCoinState) => state.persistedReducer.actingAsAdmin,
  );
  const isLoggedIn = useSelector(
    (state: FitCoinState) => state.persistedReducer.isLoggedIn,
  );
  const adminActive = showAdminContent(adminId, actingAsAdmin);

  useEffect(() => {
    const fetchLootboxes = async () => {
      const lootboxes = await lootboxClient.getLootboxes();
      setLootboxes(lootboxes);
    };
    fetchLootboxes();
  }, []);

  const shopTitle: JSX.Element = (
    <div>
      {adminActive &&
        <div className="shop-header">
          <h1>Edit Shop</h1>
        </div>
      }
      {!adminActive &&
        <div className="shop-header">
          <h1>Shop</h1>
          {isLoggedIn && <Coins coins={coins} />}
        </div>
      }
    </div>
  )

  return (
    <div>
      {shopTitle}
      <div className="lootboxes">
        {lootboxes.map((lootbox) => (
          <Lootbox key={lootbox._id} lootbox={lootbox} forAdmin={adminActive} />
        ))}
      </div>
    </div>
  );
}
