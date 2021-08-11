import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ColorDetail from "./ColorDetail";
import ColorNew from "./ColorNew";
import ColorsList from "./ColorsList";

const Routes = () => {
  const [colors, setColors] = useState({red: "#ff0000", green: "#00ff00", blue: "#0000ff"});

  return (
    <Switch>
      <Route exact path="/colors">
        <ColorsList colors={colors} />
      </Route>
      <Route exact path="/colors/new">
        <ColorNew setColors={setColors} />
      </Route>
      <Route path="/colors/:color">
        <ColorDetail colors={colors} />
      </Route>
      <Redirect to="/colors" />
    </Switch>
  )
}

export default Routes;
