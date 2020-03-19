import { handleListRequest } from "./sagas";
import { put } from "redux-saga/effects";
import { ActionTypes } from "./types";
import { getRocketsList, parseUrl } from "../../api/rockets/index";
import moment from "moment";
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

//please excuse my naive approach to testing sagas... I'm relatively new to sagas having worked mainly in Thunks for the last 3 years
//I gave it my best shot and I'm covering 100%... I'm sure I'm missing some things.

//mocks for axios

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

//rocket payload to test saga return
const rocketPayload = {
  page: [
    {
      id: 1,
      name: "Falcon 9 v1.1",
      configuration: "9 v1.1",
      wikiURL: parseUrl("http://en.wikipedia.org/wiki/Falcon_9"),
      changed: moment("2017-02-21 00:00:00", "YYYY-MM-DD HH:mm:ss")
    }
  ]
};

//error to throw when payload is wrong
const newError = new TypeError("Cannot read property 'map' of undefined");

//error payload for mox axios call
const errorPayload = {
  message: newError
};

//testing handle request saga
describe("handleListRequest", () => {
  it("should match the payload ", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: rockets
      })
    );
    const gen = handleListRequest();
    const response = await getRocketsList();
    gen.next();
    expect(gen.next(response).value).toEqual(
      put({ type: ActionTypes.LIST_SUCCESS, payload: rocketPayload })
    );
    expect(gen.next().done).toBeTruthy();
  });
  it("should list errors in response", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: errorPayload
      })
    );
    jest.spyOn(window, "alert").mockImplementation(() => {
      return {
        alert:
          "Our apologies, the data has errors, we'll try to request it one more time."
      };
    });

    const gen = handleListRequest();
    const response = await getRocketsList();
    gen.next();
    expect(gen.next(response).value).toEqual(
      put({ type: ActionTypes.ERROR, payload: errorPayload })
    );
    expect(gen.next().done).toBeTruthy();
  });
});
