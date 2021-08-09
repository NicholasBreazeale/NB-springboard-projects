import React from "react";
import "./VendingMachine.css";

const VendingMachine = () => {
  return (
    <div className="VendingMachine">
      <div className="block">
        <p>Hello I am a vending machine. What would you like to eat?</p>
        <div>
          <a href="/soda">Soda</a>
          <a href="/chips">Chips</a>
          <a href="/sardines">Sardines</a>
        </div>
      </div>
    </div>
  );
}

export default VendingMachine;
