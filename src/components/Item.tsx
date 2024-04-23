import React from "react";
import { ItemInfo } from "../types";
import "../css/item.css";

export default function Item({
  item,
  lootbox,
}: {
  item: ItemInfo;
  lootbox: string;
}) {
  const rarityColors: { [key in string]: string } = {
    LEGENDARY: "gold",
    EPIC: "purple",
    UNCOMMON: "darkblue",
    COMMON: "lightblue",
  };

  return (
    <div className={`item-container ${item.rarity}`}>
      <h2 className="item-title">{item.name}</h2>
      <img
        src={`/images/${lootbox}/${item.image}`}
        alt={item.name}
        className="item-image"
      />
      <p className="item-description">{item.description}</p>
      <div
        className="rarity-bar"
        style={{ backgroundColor: rarityColors[item.rarity] }}
      />
    </div>
  );
}
