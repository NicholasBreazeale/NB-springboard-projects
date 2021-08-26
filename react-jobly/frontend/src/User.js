import React, { useContext, useEffect, useState } from "react";
import JoblyApi from "./api";
import UserContext from "./UserContext";
import FormStack from "./FormStack";
import { Button, Input, InputGroup } from "reactstrap";

function User() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    async function getUser() {
      const user = await JoblyApi.getUser(currentUser);
      setUser(user);
      setIsLoading(false);
    }
    getUser();
  }, [currentUser]);

  const handleSubmit = async data => {
    const filteredData = {};
    for (const d in data) {
      if (data[d]) {
        filteredData[d] = data[d];
      }
    }
    setUser(await JoblyApi.patchUser(currentUser, filteredData));
  }

  if (isLoading) {
    return (
      <p>Loading&hellip;</p>
    );
  }

  return (
    <>
      <div className="text-center">
        <p><b>Name:</b> {user.firstName} {user.lastName}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>
      <h3 className="text-center">Edit Profile</h3>
      <FormStack
        initialState={{
          firstName: "",
          lastName: "",
          email: "",
          password: ""
        }}
        formSubmition={handleSubmit}
      >
        <label htmlFor="firstName">First Name</label>
        <InputGroup>
          <Input type="text" id="firstName" name="firstName" />
        </InputGroup>
        <label htmlFor="lastName">Last Name</label>
        <InputGroup>
          <Input type="text" id="lastname" name="lastName" />
        </InputGroup>
        <label htmlFor="email">Email</label>
        <InputGroup>
          <Input type="email" id="email" name="email" />
        </InputGroup>
        <label htmlFor="password">New Password</label>
        <InputGroup>
          <Input type="password" id="password" name="password" />
        </InputGroup>
        <Button color="primary">Submit</Button>
      </FormStack>
    </>
  );
}

export default User;
