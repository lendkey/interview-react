import React, { FC } from "react";
import { connect } from "react-redux";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { ApplicationState } from "../../store";
import { RocketsState } from "../../store/rockets/types";
import styled from "styled-components";
import { ApiError } from "../../api/types";
import { RocketRow } from ".";

interface AlertsProps {
  errors: ApiError[];
}

const Alerts: FC<AlertsProps> = ({ errors }) => (
  <div data-testid="alerts">
    {errors.map((error, index) => (
      <Alert key={index} variant="warning">
        {error.message}
      </Alert>
    ))}
  </div>
);

const StyledSpinner = styled(Spinner)`
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const Loading = () => (
  <StyledSpinner animation="border" role="status" data-testid="loading">
    <span className="sr-only">Loading...</span>
  </StyledSpinner>
);

export const UnconnectedRocketTable: FC<RocketsState> = ({
  page,
  loading,
  errors
}) => {
  if (errors.length > 0) {
    return <Alerts errors={errors} />;
  } else if (loading) {
    return <Loading />;
  } else if (page.length === 0) {
    return <p data-testid="sorry">Sorry, no rockets found.</p>;
  }

  return (
    <Table striped bordered hover data-testid="rockets">
      <thead>
        <tr>
          <th>Name</th>
          <th>Configuration</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {page.map((rocket, index) => (
          <RocketRow key={index} rocket={rocket} />
        ))}
      </tbody>
    </Table>
  );
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    errors: state.rockets.errors,
    page: state.rockets.page,
    loading: state.rockets.loading
  };
};

export const RocketTable = connect(mapStateToProps)(UnconnectedRocketTable);
