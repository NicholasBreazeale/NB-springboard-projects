import React from "react";
import { Button, Input, InputGroup } from "reactstrap";
import FormStack from "./FormStack";

function LoginForm({ formSubmition }) {
  return (
  <FormStack initialState={{ username: "", password: "" }} formSubmition={formSubmition}>
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
