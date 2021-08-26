import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Input, InputGroup } from "reactstrap";
import FormStack from "./FormStack";

function LoginForm({ formSubmition }) {
  const history = useHistory();

  const handleSubmit = async data => {
    await formSubmition(data);
    history.push("/");
  }

  return (
  <FormStack initialState={{ username: "", password: "" }} formSubmition={handleSubmit}>
    <label htmlFor="username">Username</label>
    <InputGroup>
      <Input type="text" id="username" name="username" />
    </InputGroup>
    <label htmlFor="password">Password</label>
    <InputGroup>
      <Input type="password" id="password" name="password" />
    </InputGroup>
    <Button color="primary">Submit</Button>
  </FormStack>
  );
}

export default LoginForm;
