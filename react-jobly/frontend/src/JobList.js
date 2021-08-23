import React, { useEffect, useState } from "react";
import { CardDeck } from "reactstrap";
import { useLocation } from "react-router-dom";
import JoblyApi from "./api";
import JobCard from "./JobCard";
import JobSearch from "./JobSearch";

function JobList() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const { search } = useLocation();

  useEffect(() => {
    async function getJobs() {
      const jobs = await JoblyApi.getJobs(new URLSearchParams(search));
      setJobs(jobs);
      setIsLoading(false);
    }
    getJobs();
  }, [search]);

  if (isLoading) {
    return (
      <h1 className="d-block text-center">Loading&hellip;</h1>
    );
  }

  return (
    <>
      <JobSearch />
      <CardDeck>
        {jobs.map(j => <JobCard job={j} key={j.id} />)}
      </CardDeck>
    </>
  );
}

export default JobList;
