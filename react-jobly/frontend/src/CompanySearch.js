import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { useHistory, useLocation } from "react-router-dom";

function CompanySearch() {
  const [searchData, setSearchData] = useState({
    name: "",
    minEmployees: "",
    maxEmployees: ""
  });
  const history = useHistory();
  const { search } = useLocation();

  // On loading, the form inputs will try to match the url query
  useEffect(() => {
    for (const [key, value] of new URLSearchParams(search)) {
      setSearchData(searchData => ({...searchData, [key]: value}));
    }
  }, [search]);

  // On change, update the search data
  const handleChange = event => {
    const { name, value } = event.target;
    setSearchData(searchData => ({...searchData, [name]: value}));
  }

  // On submit, add the appropriate query parameters to the url
  const handleSubmit = event => {
    event.preventDefault();
    history.push(`/companies${Object.keys(searchData).reduce((accumulator, value) => {
      if (searchData[value]) {
        return `${accumulator}${accumulator ? "&" : "?"}${value}=${searchData[value]}`;
      }
      return accumulator;
    }, "")}`)
  }

  // Render
  return (
    <form className="d-block text-center" onSubmit={handleSubmit}>
      <Row>
        <Col xs={{ size: 3, offset: 3 }}>
          <label htmlFor="name" className="d-block">Name</label>
          <input type="text" id="name" name="name" value={searchData.name} className="w-100" onChange={handleChange} />
        </Col>
        <Col xs="3">
          <label className="d-block">Employees</label>
          <Row className="justify-content-center">
            <Col xs="5">
              <input type="number" name="minEmployees" value={searchData.minEmployees} className="w-100" onChange={handleChange} />
            </Col>
            <span>-</span>
            <Col xs="5">
              <input type="number" name="maxEmployees" value={searchData.maxEmployees} className="w-100" onChange={handleChange} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Button color="primary">Search</Button>
    </form>
  );
}

export default CompanySearch;
