import React from "react";
import { render, wait, within } from "@testing-library/react";
import { RocketTable } from "./";
import { Provider } from "react-redux";
import configureStore from "../../store/configureStore";
import { UnconnectedRocketTable } from "./RocketTable";

describe("RocketTable component", () => {
  jest.useFakeTimers();

  describe("with a successful API call", () => {
    it("displays a table of rockets", async () => {
      const store = configureStore();
      const { findByTestId } = render(
        <Provider store={store}>
          <RocketTable />
        </Provider>
      );

      // The loading indicator should appear, then disappear
      const loading = await findByTestId("loading");
      jest.advanceTimersByTime(500); // Wait for the fake API call to finish
      await wait(() => {
        expect(loading).not.toBeInTheDocument();
      });

      const table = await findByTestId("rockets");
      const { getAllByRole } = within(table);
      expect(getAllByRole("columnheader")).toHaveLength(3);
      expect(getAllByRole("row")).toHaveLength(5);
    });
  });

  describe("with no results", () => {
    it("displays a message", async () => {
      const { container } = render(
        <UnconnectedRocketTable loading={false} page={[]} errors={[]} />
      );
      expect(container).toHaveTextContent("Sorry, no rockets found.");
    });
  });

  describe("with errors", () => {
    it("displays the errors", async () => {
      const errors = [{ message: "Oh no!" }, { message: "Terrible!" }];
      const { findByTestId } = render(
        <UnconnectedRocketTable loading={false} page={[]} errors={errors} />
      );
      const alerts = await findByTestId("alerts");
      expect(alerts).toHaveTextContent("Oh no!Terrible!");
    });
  });
});
