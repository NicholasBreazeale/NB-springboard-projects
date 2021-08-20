import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "./api";

function CompanyDetail() {
  const { handle } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState({});

  useEffect(() => {
    async function getCompany() {
      const company = await JoblyApi.getCompany(handle);
      setCompany(company);
      setIsLoading(false);
    }
    getCompany();
  }, [handle]);

  if (isLoading) {
    return (
      <p>Loading&hellip;</p>
    );
  }

  return (
    <div className="text-center">
      <img src={company.logo_url} alt="logo" />
      <p><b>Name:</b> {company.name}</p>
      <p><b>Employees:</b> {company.numEmployees}</p>
      <p><b>Description:</b> {company.description}</p>
    </div>
  );
}

export default CompanyDetail;
