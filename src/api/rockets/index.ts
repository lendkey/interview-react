import { Rocket } from "../../store/rockets/types";
import { getRockets } from "./getRockets";

/* This is the API adapter for Launch Library's rocket endpoint:
   https://launchlibrary.net/docs/1.4.1/api.html#rocket

   This adapter provides a layer of abstraction by:
     - transforming requests into the format supported by the API
     - making API calls
     - transforming responses into the format our app expects
     - handling errors
*/

export interface JsonRocket {
  id: number;
  name: string;
  configuration?: string;
  wikiURL?: string;
  changed: string;
}

export interface JsonResponse {
  rockets: JsonRocket[];
}

// Transform a string into a URL
export const parseUrl = (url: string | undefined) => {
  let result;
  try {
    if (url) {
      result = new URL(url);
    }
  } catch (e) {
    // Oh no!
  }
  return result;
};

// Transform a JsonRocket to a Rocket
const transformResponseRecord = (json: JsonRocket): Rocket => {
  return {
    id: json.id,
    name: json.name,
    configuration: json.configuration,
    wikiURL: parseUrl(json.wikiURL),
    changed: new Date(json.changed)
  };
};

// Call the API endpoint and return the response body
export const getRocketsList = async () => {
  try {
    const data: JsonResponse = JSON.parse(await getRockets());
    const apiRockets: JsonRocket[] = data.rockets;
    const rockets = apiRockets.map(record => transformResponseRecord(record));
    return { data: rockets };
  } catch (error) {
    return { errors: { message: error } };
  }
};
