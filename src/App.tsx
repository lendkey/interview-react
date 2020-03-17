import React from "react";
import Container from "react-bootstrap/Container";
import { RocketTable } from "./components/rocketTable";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

const store = configureStore();

export const App = () => (
  <Provider store={store}>
    <Container>
      <main role="main">
        <h1>Rockets</h1>
        <RocketTable />
      </main>
    </Container>
  </Provider>
);
