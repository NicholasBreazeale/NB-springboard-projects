import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
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
import useLocalStorage from "./useLocalStorage";

function App() {
  const [currentUser, setCurrentUser, removeCurrentUser] = useLocalStorage("currentUser");
  const [token, setToken, removeToken] = useLocalStorage("token");

  const login = async data => {
    setToken(await JoblyApi.userLogin(data));
    setCurrentUser(data.username);
  }

  const signUp = async data => {
    setToken(await JoblyApi.userSignUp(data));
    setCurrentUser(data.username);
  }

  const logout = () => {
    removeCurrentUser();
    removeToken();
  }

  return (
    <UserContext.Provider value={{currentUser, token}}>
      <BrowserRouter>
        <NavBar logout={logout} />
        <main>
          <Switch>
            <Route exact path="/">
              <Home />
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
            {currentUser ?
              <Switch>
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
              </Switch>
            :
              <Redirect to="/" />
            }
          </Switch>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
