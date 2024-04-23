import React from "react";
import "../css/coins.css";

export default function Coins({ coins }: { coins: number }) {
  return (
    <div className="coins">
      <p className="coins-text">💰 {coins}</p>
    </div>
  );
}
