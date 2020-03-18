import { getRocketsList, getRockets, parseUrl } from "./";
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
import moment from "moment";

// describe("getRocketsList()", () => {
//   it("returns an array of Rockets", async () => {
//     const response = await getRocketsList();
//     if (response.data) {
//       expect(response.data.length).toEqual(30);
//       expect(response.data[0]).toEqual({
//         changed: moment("2017-02-21 00:00:00", "YYYY-MM-DD HH:mm:ss"),
//         configuration: "9 v1.1",
//         id: 1,
//         name: "Falcon 9 v1.1",
//         wikiURL: new URL("http://en.wikipedia.org/wiki/Falcon_9")
//       });
//     }
//   });
//   it("returns an error message", async () => {
//     try {
//       await getRocketsList();
//     } catch (e) {
//       expect(e).toMatch("error");
//     }
//   });
// });

//Even though the above test was actually passing the test cases and getting back data from axios
//we do not want to actually hit the API EVERY time we test.  This would cause additional API calls,
//and could end up being a costly mistake.  ALso, we want to stay away from testing the actual api calls,
//for perforance reasons.  Uneccessary HTTP requests are usually public enemy number one when we are looking
//for ways to optimize our application.

//I will instead mock axios and test the async calls with a mocked version of axios...

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

describe("getRockets()", () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: rockets
      })
    );
  });
  describe("when an API call is made", () => {
    it("should render a list of rockets from the API call", async () => {
      const results = await getRockets();
      expect(results).toEqual(rockets);
    });
    it("function should have been called once", () => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
    it("function should have been called with the correct API endpoint ", () => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://launchlibrary.net/1.4/rocket?mode=list"
      );
    });
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
