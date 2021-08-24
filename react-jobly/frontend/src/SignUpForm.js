import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button, Col, Input, InputGroup } from "reactstrap";

function SignUpForm({ formSubmition }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: ""
  });
  const [alerts, setAlerts] = useState([]);
  const history = useHistory();

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(formData => ({...formData, [name]: value}));
  }

  const handleSubmit = async event => {
    event.preventDefault();
    setAlerts([]);
    try {
      await formSubmition(formData);
      history.push("/");
    } catch (err) {
      setAlerts(err);
    }
  }

  return (
    <Col xs={{ size: 8, offset: 2 }} sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
      <form className="d-block text-center" onSubmit={handleSubmit}>
        {alerts && alerts.map(a => (<Alert color="danger" key={a}>{a}</Alert>))}
        <label htmlFor="username">Username</label>
        <InputGroup>
          <Input type="text" id="username" name="username" onChange={handleChange} />
        </InputGroup>
        <label htmlFor="password">Password</label>
        <InputGroup>
          <Input type="password" id="password" name="password" onChange={handleChange} />
        </InputGroup>
        <label htmlFor="firstName">First Name</label>
        <InputGroup>
          <Input type="text" id="firstName" name="firstName" onChange={handleChange} />
        </InputGroup>
        <label htmlFor="lastName">Last Name</label>
        <InputGroup>
          <Input type="text" id="lastName" name="lastName" onChange={handleChange} />
        </InputGroup>
        <label htmlFor="email">email</label>
        <InputGroup>
          <Input type="email" id="email" name="email" onChange={handleChange} />
        </InputGroup>
        <Button color="primary">Submit</Button>
      </form>
    </Col>
  );
}

export default SignUpForm;
