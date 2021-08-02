import React from "react";

function Cards({ image, code, offsetX, offsetY, rotation }) {
  return (
    <img className="Cards" src={image} alt={code} style={{ transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)` }} />
  )
}

export default Cards;
