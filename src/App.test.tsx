import React from "react";
import { render } from "@testing-library/react";
import { App } from "./App";

test("renders the text 'Rockets'", () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/Rockets/);
  expect(headerElement).toBeInTheDocument();
});
