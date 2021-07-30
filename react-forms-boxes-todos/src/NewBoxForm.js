import React, { useState } from "react";

function NewBoxForm({ addBox }) {
  const INITIAL_STATE = {
    color: "#000000",
    width: "",
    height: ""
  };
  const [formData, setFormData] = useState(INITIAL_STATE);

  function handleChange (event) {
    const { name, value } = event.target;
    setFormData(fData => ({
      ...fData,
      [name]: value
    }));
  }

  function handleSubmit (event) {
    event.preventDefault();
    addBox(formData);
    setFormData(INITIAL_STATE);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="color">Color:</label>
      <input id="color" name="color" type="color" value={formData.color} onChange={handleChange} />
      <label htmlFor="width">Width:</label>
      <input id="width" name="width" type="number" value={formData.width} onChange={handleChange} />
      <label htmlFor="height">Height:</label>
      <input id="height" name="height" type="number" value={formData.height} onChange={handleChange} />
      <button data-testid="submit-btn">Add</button>
    </form>
  );
}

export default NewBoxForm;
