import React from "react";
import { Link, useParams } from "react-router-dom";
import "./DogDetails.css";

const DogDetails = ({ dogs }) => {
  const { name } = useParams();
  const dog = dogs.find(d => d.name.toLowerCase() === name);

  return (
    <div className="DogDetails">
      <img src={dog.src} alt={dog.name} />
      <p>Name: {dog.name}</p>
      <p>Age: {dog.age}</p>
      <div>Facts:<br />
        <ul>
          {dog.facts.map(f => <li>{f}</li>)}
        </ul>
      </div>
      <Link to={"/dogs"}><button>Back</button></Link>
    </div>
  )
};

export default DogDetails;
