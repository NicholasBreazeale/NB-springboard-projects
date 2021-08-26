import React, { useState } from "react";
import { Alert, Col } from "reactstrap";

function FormStack({ initialState, formSubmition, children }) {
  const [formData, setFormData] = useState(initialState);
  const [alerts, setAlerts] = useState([]);

  // onChange events bubble up and trigger this handler
  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(formData => ({ ...formData, [name]: value }));
  }

  // Uses the formSubmition function passed to this component
  // If any errors occur, display them as alerts
  const handleSubmit = async event => {
    event.preventDefault();
    setAlerts([]);
    try {
      await formSubmition(formData);
    } catch (err) {
      if (Array.isArray(err)) {
        setAlerts(err);
      }
      else {
        setAlerts([err]);
      }
    }
  }

  return (
    <Col xs={{ size: 8, offset: 2 }} sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4}}>
      <form className="d-block text-center" onChange={handleChange} onSubmit={handleSubmit}>
        {alerts && alerts.map(a => (<Alert color="danger" key={a}>{a}</Alert>))}
        {children}
      </form>
    </Col>
  )
}

export default FormStack;
