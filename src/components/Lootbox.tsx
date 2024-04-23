import React from "react";
import "../css/lootbox.css";
import { Link } from "react-router-dom";
import { LootboxInfo } from "../types";
import { getRandomItem } from "../utils";
import * as userClient from "../pages/Login/userClient";
import { useDispatch, useSelector } from "react-redux";
import { updateCoins } from "../pages/Login/userReducer";
import { errorToast, successToast } from "./toasts";

export default function Lootbox({ lootbox }: { lootbox: LootboxInfo }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.persistedReducer);
  const buyItem = async () => {
    try {
      const item = await getRandomItem(lootbox._id);
      await userClient.buyItem(
        userInfo.userId,
        userInfo.authToken,
        lootbox.price,
        item._id,
      );
      dispatch(updateCoins(lootbox.price));
      successToast(`You bought ${item.name}`);
    } catch (error: any) {
      errorToast(error.response.data.error);
    }
  };

  return (
    <div className="lootbox">
      <Link to={`/shop/${lootbox._id}`} className="lootbox-image-link">
        <img
          src={`/images/lootbox/${lootbox.image}`}
          alt={lootbox.name}
          className="lootbox-image"
        />
      </Link>

      <div className="lootbox-footer">
        <div className="lootbox-info">
          <h3 className="lootbox-name">{lootbox.name}</h3>
          <p className="lootbox-price">{lootbox.price} 💰</p>
        </div>
        <div className="lootbox-buttons">
          <button className="button primary-button" onClick={buyItem}>
            Buy
          </button>
          <Link className="button primary-link" to={`/shop/${lootbox._id}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
