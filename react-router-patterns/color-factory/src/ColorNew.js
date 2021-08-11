import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./ColorNew.css";

const ColorNew = ({ setColors }) => {
  const [formData, setFormData] = useState({
    name: "",
    value: ""
  });
  const history = useHistory();

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(fData => ({
      ...fData,
      [name]: value
    }));
  }

  const handleSubmit = event => {
    event.preventDefault();
    setColors(c => ({...c, [formData.name]: formData.value}));
    history.push("/colors");
  }

  return (
    <div className="ColorNew">
      <div className="container">
        <form>
          <div>
            <label htmlFor="name">Color name</label>
            <input type="text" name="name" onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="value">Color value</label>
            <input type="color" name="value" onChange={handleChange} />
          </div>
          <div>
            <button onClick={handleSubmit}>Add this color</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ColorNew;
