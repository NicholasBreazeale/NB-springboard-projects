import React from "react";
import { Card, CardTitle, CardBody, CardImg, Col } from "reactstrap";

function CompanyCard({ company }) {
  return (
    <Col sm="6" md="4" lg="3" xl="2">
      <a href={`/companies/${company.handle}`}>
        <Card className="m-2 text-center">
          <CardImg src={company.logo_url} alt="logo" className="w-100" />
          <CardBody>
            <CardTitle>
              {company.name}
            </CardTitle>
          </CardBody>
        </Card>
      </a>
    </Col>
  );
}

export default CompanyCard;
