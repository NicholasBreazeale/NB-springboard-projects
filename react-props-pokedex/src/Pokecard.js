import React from 'react';
import './Pokecard.css';

const Pokecard = ({id, name, type, base_experience}) => (
  <div className="Pokecard">
    <h3>{name}</h3><br />
    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} alt={name} /><br />
    <p>Type: {type}</p><br />
    <p>EXP: {base_experience}</p>
  </div>
);

export default Pokecard;
