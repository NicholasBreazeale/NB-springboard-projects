import React, { useContext } from "react";
import UserContext from "./UserContext";

function Home() {
  const { currentUser } = useContext(UserContext);

  return (
    <h1 className="text-center">{currentUser ? `Welcome back to Jobly, ${currentUser}!` : "Welcome to Jobly!"}</h1>
  );
}

export default Home;
