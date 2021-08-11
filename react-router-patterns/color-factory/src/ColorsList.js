import React from "react";
import { Link } from "react-router-dom";
import "./ColorsList.css";

const ColorsList = ({ colors }) => {
  return (
    <div className="ColorsList">
      <div className="header">
        <h2>Welcome to the color factory.</h2>
        <h1>
          <Link to={"/colors/new"}>Add a color</Link>
        </h1>
      </div>
      <div className="list">
        <p>Please select a color.</p>
        <div>
          {Object.keys(colors).map(c => (
            <div><Link to={`/colors/${c}`}>{c}</Link></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColorsList;
