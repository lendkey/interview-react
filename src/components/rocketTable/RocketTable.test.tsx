import React from "react";
import { render, wait, within } from "@testing-library/react";
import { RocketTable } from "./";
import { Provider } from "react-redux";
import configureStore from "../../store/configureStore";
import { UnconnectedRocketTable } from "./RocketTable";
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

//adding rocket axios mock to test react front end
const rockets = {
  rockets: [
    {
      id: 1,
      name: "Falcon 9 v1.1",
      configuration: "9 v1.1",
      defaultPads: "84,100",
      infoURL: null,
      wikiURL: "http://en.wikipedia.org/wiki/Falcon_9",
      infoURLs: ["http://www.spacex.com/falcon9"],
      imageSizes: [320, 480, 640, 720, 768, 800, 960, 1024, 1080, 1280],
      imageURL:
        "https://s3.amazonaws.com/launchlibrary/RocketImages/Falcon9v1.1.jpg_1280.jpg",
      changed: "2017-02-21 00:00:00"
    }
  ]
};

describe("RocketTable component", () => {
  jest.useFakeTimers();
  mockedAxios.get.mockImplementation(() =>
    Promise.resolve({
      data: rockets
    })
  );

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

      expect(getAllByRole("row")).toHaveLength(2);
    });
  });

  describe("with no results", () => {
    it("displays a message", async () => {
      mockedAxios.get.mockImplementation(() =>
        Promise.resolve({
          data: []
        })
      );
      const { container } = render(
        <UnconnectedRocketTable loading={false} page={[]} errors={[]} />
      );
      expect(container).toHaveTextContent("Sorry, no rockets found.");
    });
  });

  describe("with errors", () => {
    it("displays the errors", async () => {
      const errors = [{ message: "Oh no!" }, { message: "Terrible!" }];
      mockedAxios.get.mockImplementation(() =>
        Promise.resolve({
          data: errors
        })
      );

      const { findByTestId } = render(
        <UnconnectedRocketTable loading={false} page={[]} errors={errors} />
      );
      const alerts = await findByTestId("alerts");
      expect(alerts).toHaveTextContent("Oh no!Terrible!");
    });
  });
});
