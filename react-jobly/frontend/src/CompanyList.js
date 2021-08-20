import React, { useEffect, useState } from "react";
import { CardDeck } from "reactstrap";
import { useLocation } from "react-router-dom";
import JoblyApi from "./api";
import CompanyCard from "./CompanyCard";
import CompanySearch from "./CompanySearch";

function CompanyList() {
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const { search } = useLocation();

  useEffect(() => {
    async function getCompanies() {
      const companies = await JoblyApi.getCompanies(new URLSearchParams(search));
      setCompanies(companies);
      setIsLoading(false);
    }
    getCompanies();
  }, [search]);

  if (isLoading) {
    return (
      <h1 className="d-block text-center">Loading&hellip;</h1>
    );
  }

  return (
    <>
      <CompanySearch />
      <CardDeck>
        {companies.map(c => <CompanyCard company={c} key={c.handle} />)}
      </CardDeck>
    </>
  );
}

export default CompanyList;
