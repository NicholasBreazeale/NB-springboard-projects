import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "./Home";
import CompanyList from "./CompanyList";
import CompanyDetail from "./CompanyDetail";
import JobList from "./JobList";
import JobDetail from "./JobDetail";
import User from "./User";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import UserContext from "./UserContext";
import JoblyApi from "./api";

function App() {
  const [user, setUser] = useState(null);

  const login = async data => {
    const token = await JoblyApi.userLogin(data);
    setUser({username: data.username, token});
  }

  const signUp = async data => {
    const token = await JoblyApi.userSignUp(data);
    setUser({username: data.username, token});
  }

  const logout = () => {
    setUser(null);
  }

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <NavBar logout={logout} />
        <main>
          <Switch>
            <Route exact path="/">
              <Home user={user} />
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
              <LoginForm formSubmition={login} />
            </Route>
            <Route exact path="/signup">
              <SignUpForm formSubmition={signUp} />
            </Route>
            <Route exact path="/profile">
              <User />
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
