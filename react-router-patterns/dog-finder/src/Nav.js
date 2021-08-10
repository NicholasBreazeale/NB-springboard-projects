import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const Nav = ({ dogs }) => {
  return (
    <nav className="Nav">
      {dogs.map(d => (
        <Link to={`/dogs/${d.name.toLowerCase()}`}>{d.name}</Link>
      ))}
    </nav>
  )
};

export default Nav;
