import React, { useState } from 'react';
import './ColorBoxes.css';

const ColorBoxes = ({ colors = ["green", "goldenrod", "red"], boxes = 16}) => {
  const [boxColors, setBoxColors] = useState(Array.from({ length: boxes }, () => colors[Math.floor(Math.random() * colors.length)]));
  const [changedBox, setChangedBox] = useState(-1);

  const change = () => {
    const rand = Math.floor(Math.random() * boxes);
    boxColors[rand] = colors[Math.floor(Math.random() * colors.length)];
    setBoxColors(boxColors);
    setChangedBox(rand);
  };

  return (
    <div className="ColorBoxes">
      {boxColors.map((c, idx) => <div style={{backgroundColor: c}} key={idx}>{changedBox === idx && 'Changed!'}</div>)}<br />
      <button onClick={change}>Change</button>
    </div>
  );
};

export default ColorBoxes;