import React from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import "./ColorDetail.css";

const ColorDetail = ({ colors }) => {
  const { color } = useParams();
  const colorVal = colors[color];
  if (!colorVal) return (<Redirect to="/colors" />);

  return (
    <div className="ColorDetail" style={{backgroundColor: colorVal}}>
      <p>This is {color}.</p>
      <p>Isn't it beautiful?</p>
      <div><Link to={"/colors"}>Go back</Link></div>
    </div>
  );
}

export default ColorDetail;
