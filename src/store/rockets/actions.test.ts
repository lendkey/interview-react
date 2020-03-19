import { error, listRequest, listSuccess } from "./actions";
import { parseUrl } from "../../api/rockets/index";
import moment from "moment";

import { ActionTypes } from "./types";

//creating mock pyaloads for my action creators
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

const errorPayload = [{ message: "error" }];

//testing all action creators with expected results from the mocks
describe("actions", () => {
  describe("listRequest()", () => {
    it("should create an action to grab the list of items", () => {
      const expectedAction = {
        type: ActionTypes.LIST_REQUEST
      };
      expect(listRequest()).toEqual(expectedAction);
    });
  });

  describe("listSuccess()", () => {
    it("should create an action to grab the list of items", () => {
      const expectedAction = {
        type: ActionTypes.LIST_SUCCESS,
        payload: rocketPayload
      };
      expect(listSuccess(rocketPayload)).toEqual(expectedAction);
    });
  });

  describe("error", () => {
    it("should return a payload of errors", () => {
      const expectedAction = {
        type: ActionTypes.ERROR,
        payload: errorPayload
      };
      expect(error(errorPayload)).toEqual(expectedAction);
    });
  });
});
