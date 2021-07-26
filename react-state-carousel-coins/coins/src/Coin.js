import React, { useState } from "react";
import headImg from "./2017-D_Roosevelt_dime_obverse_transparent.png";
import tailImg from "./2017-D_Roosevelt_dime_reverse_transparent.png";
import "./Coin.css";

function Coin() {
  // heads = 1, tails = 0
  const [coinFace, setCoinFace] = useState(1);
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);

  function flip() {
    const face = Math.floor(Math.random() * 2);
    setCoinFace(face);
    if (face === 1) setHeads(heads + 1);
    else setTails(tails + 1);
  };

  return (
    <div className="Coin">
      {(heads + tails !== 0) && <><img src={coinFace ? headImg : tailImg} data-testid="coin-img" alt="" /><br /></>}
      <button onClick={flip} data-testid="flip-btn">FLIP MEEEE</button>
      <p>Out of {heads + tails} flips, there have been {heads} heads and {tails} tails.</p>
    </div>
  );
};

export default Coin;