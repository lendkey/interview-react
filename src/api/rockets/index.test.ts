import {
  getRocketsList,
  getRockets,
  parseUrl,
  transformResponseRecord,
  JsonResponse,
  JsonRocket
} from "./";
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
import moment from "moment";

//We expect an array of rockets from our API call, below is a mock of what that return actually looks like
//I am saving it to a constant for ease of reading
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

//our transform function return this converted object
const transformedRocket = {
  id: 1,
  name: "Falcon 9 v1.1",
  configuration: "9 v1.1",
  wikiURL: parseUrl("http://en.wikipedia.org/wiki/Falcon_9"),
  changed: moment("2017-02-21 00:00:00", "YYYY-MM-DD HH:mm:ss")
};

//I want to also test getRockets() which was not in the original implentation.  We should test all our functions
// as unit tests to catch any unforseen problems or side effects in our integrations.
describe("getRockets()", () => {
  //mocking the api call before every test runs
  beforeEach(() => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: rockets
      })
    );
  });
  describe("when an API call is made", () => {
    it("should render a list of rockets from the API call", async () => {
      //liftoff!  do we get rockets back?
      const results = await getRockets();
      expect(results).toEqual(rockets);
    });
    //no run away functions... testing if the function is called once to track down unecessary api calls
    it("function should have been called once", () => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
    //here I want to double check the api is being called with the right url
    it("function should have been called with the correct API endpoint ", () => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://launchlibrary.net/1.4/rocket?mode=list"
      );
    });
  });
});

describe("getRocketsList()", () => {
  //here I simply copied the original test case and replaced the api response with the mocked version
  // getRocketsList() calls getRockets() in its function body, now that we've separated that unit into
  // its own test above, we can safely assert getRocketsList() is receiving the correct data.
  beforeEach(() => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: rockets
      })
    );
  });
  it("returns an array of Rockets", async () => {
    const response = await getRocketsList();
    if (response.data) {
      expect(response.data.length).toEqual(1);
      expect(response.data[0]).toEqual({
        changed: moment("2017-02-21 00:00:00", "YYYY-MM-DD HH:mm:ss"),
        configuration: "9 v1.1",
        id: 1,
        name: "Falcon 9 v1.1",
        wikiURL: new URL("http://en.wikipedia.org/wiki/Falcon_9")
      });
    }
  });

  //added test for throw error as well as network error
  it("returns an error message on the catch", async () => {
    //had some trouble here, but this is as close as I can get to mocking a global.window alert
    jest.spyOn(window, "alert").mockImplementation(() => {
      return {
        alert:
          "Our apologies, the data has errors, we'll try to request it one more time."
      };
    });
    //error message to be retunred by catch
    const error = {
      errors: [{ message: "Network error: Something went wrong" }]
    };
    //mock error call
    mockedAxios.get.mockRejectedValue(error.errors[0].message);
    const response = await getRocketsList();
    //matches error
    expect(response).toEqual(error);
    //alert has been called
    expect(alert).toHaveBeenCalledTimes(1);
  });
});

describe("parseUrl()", () => {
  describe("when passed a valid URL", () => {
    it("returns URL object", async () => {
      const url = parseUrl("https://launchlibrary.net/");
      expect(url?.protocol).toEqual("https:");
    });
  });
  describe("when passed an invalid URL", () => {
    it("returns undefined", async () => {
      const url = parseUrl("");
      expect(url).toBeUndefined();
    });
  });
  describe("when passed undefined", () => {
    it("returns undefined", async () => {
      const url = parseUrl(undefined);
      expect(url).toBeUndefined();
    });
  });
});

//added testing for TS interfaces, wasn't sure if this was necessary but I'm trying to go for as much coverage as possible
describe("TypeScript Interfaces - JsonRocket, JsonResponse", () => {
  it("JsonResponse should look for the correct JSON response ", () => {
    const tsInterface: JsonResponse = { rockets: rockets.rockets };
    expect(tsInterface.rockets).toEqual(rockets.rockets);
  });
  it("JsonRocket should look for the correct JSON response ", () => {
    const tsInterface: JsonRocket = rockets.rockets[0];
    expect(tsInterface).toEqual(rockets.rockets[0]);
  });
});

//testing the transform function with the expected contant "transformedRocket"
describe("transformRespondRecord", () => {
  it("should return the correct transformed JSON object ", () => {
    const result = transformResponseRecord(rockets.rockets[0]);
    expect(result).toEqual(transformedRocket);
  });
});
