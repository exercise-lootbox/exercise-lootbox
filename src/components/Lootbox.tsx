import React from "react";
import "../css/lootbox.css";
import { Link } from "react-router-dom";
import { LootboxInfo } from "../types";

export default function Lootbox({ lootbox }: { lootbox: LootboxInfo }) {
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
          <button className="button primary-button">Buy</button>
          <Link className="button primary-link" to={`/shop/${lootbox._id}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
