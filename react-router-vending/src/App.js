import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import VendingMachine from './VendingMachine';
import Soda from "./Soda";
import Chips from "./Chips";
import Sardines from "./Sardines";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/">
          <VendingMachine />
        </Route>
        <Route exact path="/soda">
          <Soda />
        </Route>
        <Route exact path="/chips">
          <Chips />
        </Route>
        <Route exact path="/sardines">
          <Sardines />
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
