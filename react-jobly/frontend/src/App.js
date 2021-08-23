import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home";
import CompanyList from "./CompanyList";
import CompanyDetail from "./CompanyDetail";
import JobList from "./JobList";
import JobDetail from "./JobDetail";
import UserLogin from "./UserLogin";
import UserSignUp from "./UserSignUp";
import User from "./User";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar user={user} />
        <main>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/companies">
              <CompanyList />
            </Route>
            <Route path="/companies/:handle">
              <CompanyDetail />
            </Route>
            <Route exact path="/jobs">
              <JobList />
            </Route>
            <Route path="/jobs/:id">
              <JobDetail />
            </Route>
            <Route exact path="/login">
              <UserLogin />
            </Route>
            <Route exact path="/signup">
              <UserSignUp />
            </Route>
            <Route exact path="/profile">
              <User />
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
