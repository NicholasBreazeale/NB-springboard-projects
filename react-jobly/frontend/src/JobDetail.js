import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "./api";
import UserContext from "./UserContext";
import { Button } from "reactstrap";

function JobDetail() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState({});
  const [user, setUser] = useState({});
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    async function getValues() {
      const values = await Promise.all([JoblyApi.getJob(id), JoblyApi.getUser(currentUser)]);
      setJob(values[0]);
      setUser(values[1]);
      setIsLoading(false);
    }
    getValues();
  }, [id, currentUser]);

  const applyForJob = async () => {
    const applied = await JoblyApi.applyForJob(currentUser, id);
    setUser({...user, applications: [...user.applications, applied]});
  }

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
      <div>
        {user.applications.find(val => val.toString() === id)
        ? <p><i>You have applied for this job.</i></p>
        : <Button color="primary" onClick={applyForJob}>Apply</Button>}
      </div>
    </div>
  );
}

export default JobDetail;
