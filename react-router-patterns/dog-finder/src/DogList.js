import React from "react";
import { Link } from "react-router-dom";
import "./DogList.css";

const DogList = ({ dogs }) => {
  return (
    <div className="DogList">
      {dogs.map(d => (
        <Link to={`/dogs/${d.name.toLowerCase()}`}>
          <img src={d.src} alt={d.name} />
          <div>{d.name}</div>
        </Link>
      ))}
    </div>
  )
};

export default DogList;
