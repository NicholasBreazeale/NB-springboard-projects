import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { useHistory, useLocation } from "react-router-dom";

function JobSearch() {
  const [searchData, setSearchData] = useState({
    title: "",
    minSalary: "",
    hasEquity: "false"
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

  // On checkbox change, update the search data 
  const handleCheckbox = event => {
    const { name, checked } = event.target;
    setSearchData(searchData => ({...searchData, [name]: checked.toString()}));
  }

  // On submit, add the appropriate query parameters to the url
  const handleSubmit = event => {
    event.preventDefault();
    history.push(`/jobs${Object.keys(searchData).reduce((accumulator, value) => {
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
          <label htmlFor="title" className="d-block">Title</label>
          <input type="text" id="title" name="title" value={searchData.name} className="w-100" onChange={handleChange} />
        </Col>
        <Col xs="2">
          <label htmlFor="minSalary" className="d-block">Minimum Salary</label>
          <input type="number" id="minSalary" name="minSalary" value={searchData.minSalary} className="w-100" onChange={handleChange} />
        </Col>
        <Col xs="1">
          <label htmlFor="hasEquity" className="d-block">Equity?</label>
          <input type="checkbox" id="hasEquity" name="hasEquity" checked={searchData.hasEquity === "true"} onChange={handleCheckbox} />
        </Col>
      </Row>
      <Button color="primary">Search</Button>
    </form>
  );
}

export default JobSearch;
