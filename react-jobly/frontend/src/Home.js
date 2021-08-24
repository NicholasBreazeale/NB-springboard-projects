import React, { useContext } from "react";
import UserContext from "./UserContext";

function Home() {
  const user = useContext(UserContext);

  return (
    <h1 className="text-center">{user ? `Welcome back to Jobly, ${user.username}!` : "Welcome to Jobly!"}</h1>
  );
}

export default Home;
