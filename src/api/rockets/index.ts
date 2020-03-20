import { Rocket } from "../../store/rockets/types";
import moment from "moment";
import axios from "axios";

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
export const transformResponseRecord = (json: JsonRocket): Rocket => {
  return {
    id: json.id,
    name: json.name,
    configuration: json.configuration,
    wikiURL: parseUrl(json.wikiURL),
    changed: moment(json.changed, "YYYY-MM-DD HH:mm:ss")
  };
};

export const getRockets = async () => {
  //saving my api call to a variable for ease of reading
  const url = "https://launchlibrary.net/1.4/rocket?mode=list";
  //Using the JsonResponse TYPE as generic for my axios call
  const response = await axios.get<JsonResponse>(url);
  //axios returns a promise with a "data" field on the response, passing this to getRocketsList function
  return response.data;
};

// Call the API endpoint and return the response body
export const getRocketsList = async () => {
  try {
    const data: JsonResponse = await getRockets();
    const apiRockets: JsonRocket[] = data.rockets;
    const rockets = apiRockets.map(record => transformResponseRecord(record));
    return { data: rockets };
  } catch (error) {
    alert(
      "Our apologies, the data has errors, we'll try to request it one more time."
    );
    //I'm changing this to return an array because our TYPE is expecting an array, easier to change this than rewrite all the type defs
    return { errors: [{ message: error }] };
  }
};
