import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "./api";

function JobDetail() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState({});

  useEffect(() => {
    async function getJob() {
      const job = await JoblyApi.getJob(id);
      setJob(job);
      setIsLoading(false);
    }
    getJob();
  }, [id]);

  if (isLoading) {
    return (
      <p>Loading&hellip;</p>
    );
  }

  return (
    <div className="text-center">
      <p><b>Title:</b> {job.title}</p>
      <p><b>Salary:</b> {`$${job.salary || 0}`}</p>
      <p><b>Equity:</b> {`${job.equity || 0}%`}</p>
      <p><b>Company:</b> <a href={`/companies/${job.company.handle}`}>{job.company.name}</a></p>
      <img src={job.company.logo_url} alt="logo" />
    </div>
  );
}

export default JobDetail;
