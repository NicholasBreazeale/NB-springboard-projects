import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button, Col, Input, InputGroup } from "reactstrap";

function LoginForm({ formSubmition }) {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
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
        <Button color="primary">Submit</Button>
      </form>
    </Col>
  );
}

export default LoginForm;
