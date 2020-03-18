import { getRocketsList, parseUrl } from "./";
import moment from "moment";

describe("getRocketsList()", () => {
  it("returns an array of Rockets", async () => {
    const response = await getRocketsList();
    if (response.data) {
      expect(response.data.length).toEqual(4);
      expect(response.data[0]).toEqual({
        changed: moment("2017-02-21 00:00:00", "YYYY-MM-DD HH:mm:ss"),
        configuration: "9 v1.1",
        id: 1,
        name: "Falcon 9 v1.1",
        wikiURL: new URL("http://en.wikipedia.org/wiki/Falcon_9")
      });
    }
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
