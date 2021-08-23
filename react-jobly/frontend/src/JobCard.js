import React from "react";
import { Card, CardTitle, CardBody, Col } from "reactstrap";

function JobCard({ job }) {
  return (
    <Col sm="6" md="4" lg="3" xl="2">
      <a href={`/jobs/${job.id}`}>
        <Card className="m-2 text-center">
          <CardBody>
            <CardTitle>
              {job.title}
            </CardTitle>
          </CardBody>
        </Card>
      </a>
    </Col>
  );
}

export default JobCard;
