import React, { useContext } from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Button, Navbar, Nav, NavItem } from "reactstrap";
import UserContext from "./UserContext";

function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext);

  return (
    <div>
      <Navbar className="justify-content-between" expand="md">
        <NavLink exact to="/" className="navbar-brand">
          Jobly
        </NavLink>

        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink to="/companies">Companies</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/jobs">Jobs</NavLink>
          </NavItem>
          {currentUser ?
            <>
              <NavItem>
                <NavLink to="/profile">{currentUser}</NavLink>
              </NavItem>
              <NavItem>
                <Button onClick={logout}>Logout</Button>
              </NavItem>
            </>
            :
            <>
              <NavItem>
                <NavLink to="/signup">Sign Up</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/login">Login</NavLink>
              </NavItem>
            </>
          }
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
