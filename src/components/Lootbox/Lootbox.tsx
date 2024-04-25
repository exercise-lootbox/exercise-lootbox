import React, { useState } from "react";
import "../../css/lootbox.css";
import { Link } from "react-router-dom";
import { ItemInfo, LootboxInfo } from "../../types";
import { getRandomItem } from "../../utils";
import * as userClient from "../../pages/Login/userClient";
import * as adminClient from "../../Admin/adminClient";
import { useDispatch, useSelector } from "react-redux";
import { addCoins } from "../../pages/Login/userReducer";
import { errorToast, successToast } from "../toasts";
import { useDisclosure } from "@chakra-ui/react";
import BoughtItem from "../Items/BoughtItem";

export default function Lootbox({
  lootbox,
  forAdmin,
}: {
  lootbox: LootboxInfo;
  forAdmin: boolean;
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.persistedReducer);
  const adminId = useSelector((state: any) => state.persistedReducer.adminId);
  const authToken = useSelector(
    (state: any) => state.persistedReducer.authToken,
  );
  const isLoggedIn = useSelector(
    (state: any) => state.persistedReducer.isLoggedIn,
  );
  const [wonItem, setWonItem] = useState<ItemInfo | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(lootbox.price);
  const [preEditPrice, setPreEditPrice] = useState(lootbox.price);

  const buyItem = async () => {
    try {
      if (!isLoggedIn) {
        errorToast("You must be logged in to buy items!");
        return;
      }
      const item = await getRandomItem(lootbox._id);
      await userClient.buyItem(
        userInfo.userId,
        userInfo.authToken,
        lootbox.price,
        item._id,
      );
      setWonItem(item);
      dispatch(addCoins(-lootbox.price));
      successToast(`You Won A ${item.name}`);
      onOpen();
    } catch (error: any) {
      errorToast(error.message);
    }
  };

  const handleEditClicked = () => {
    setPreEditPrice(price);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPrice(preEditPrice);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await adminClient.updateLootboxPrice(
        adminId,
        lootbox._id,
        price,
        authToken,
      );
      setIsEditing(false);
    } catch (error: any) {
      errorToast(error.message);
    }
  };

  function lootboxPrice() {
    if (forAdmin && isEditing) {
      return (
        <input
          className="form-control w-50"
          type="number"
          value={price}
          placeholder={"Price"}
          onChange={(e) => setPrice(parseInt(e.target.value))}
        />
      );
    } else {
      return <p className="lootbox-price">{price} 💰</p>;
    }
  }

  function lootboxButtons() {
    if (forAdmin) {
      if (isEditing) {
        return (
          <div className="lootbox-buttons">
            <button className="button secondary-button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="button primary-button" onClick={handleSave}>
              Save
            </button>
          </div>
        );
      } else {
        return (
          <div className="lootbox-buttons">
            <button
              className="button primary-button flex-grow-1"
              onClick={handleEditClicked}
            >
              Edit
            </button>
          </div>
        );
      }
    } else {
      return (
        <div className="lootbox-buttons">
          <button className="button primary-button" onClick={buyItem}>
            Buy
          </button>
          <Link className="button primary-link" to={`/shop/${lootbox._id}`}>
            View
          </Link>
        </div>
      );
    }
  }

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
          {lootboxPrice()}
        </div>
        {lootboxButtons()}
      </div>
      {wonItem && (
        <BoughtItem
          item={wonItem}
          isOpen={isOpen}
          onClose={onClose}
          lootbox={lootbox.name}
        />
      )}
    </div>
  );
}
