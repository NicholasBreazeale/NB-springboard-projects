import React from "react";
import "./Box.css";

function Box({ backgroundColor="#000000", width="20px", height="20px", removeBox }) {
  return (
    <>
      <div className="Box" style={{ backgroundColor, width, height }}></div>
      <button onClick={removeBox}>X</button>
    </>
  );
}

export default Box;
