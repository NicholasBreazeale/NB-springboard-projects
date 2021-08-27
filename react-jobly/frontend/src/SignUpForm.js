import React from "react";
import { Button, Input, InputGroup } from "reactstrap";
import FormStack from "./FormStack";

function SignUpForm({ formSubmition }) {
  return (
    <FormStack
      initialState={{
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
      }}
      formSubmition={formSubmition}
    >
      <label htmlFor="username">Username</label>
      <InputGroup>
        <Input type="text" id="username" name="username" />
      </InputGroup>
      <label htmlFor="password">Password</label>
      <InputGroup>
        <Input type="password" id="password" name="password" />
      </InputGroup>
      <label htmlFor="firstName">First Name</label>
      <InputGroup>
        <Input type="text" id="firstName" name="firstName" />
      </InputGroup>
      <label htmlFor="lastName">Last Name</label>
      <InputGroup>
        <Input type="text" id="lastName" name="lastName" />
      </InputGroup>
      <label htmlFor="email">Email</label>
      <InputGroup>
        <Input type="email" id="email" name="email" />
      </InputGroup>
      <Button color="primary">Submit</Button>
    </FormStack>
  );
}

export default SignUpForm;
