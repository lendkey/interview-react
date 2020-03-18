import { Rocket } from "../../store/rockets/types";
import moment from "moment";

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
    changed: moment(json.changed, "YYYY-MM-DD HH:mm:ss")
  };
};

// A sample response.
const FAKE_RESPONSE =
  '{"rockets":[{"id":1,"name":"Falcon 9 v1.1","configuration":"9 v1.1","defaultPads":"84,100","infoURL":null,"wikiURL":"http://en.wikipedia.org/wiki/Falcon_9","infoURLs":["http://www.spacex.com/falcon9"],"imageSizes":[320,480,640,720,768,800,960,1024,1080,1280],"imageURL":"https://s3.amazonaws.com/launchlibrary/RocketImages/Falcon9v1.1.jpg_1280.jpg","changed":"2017-02-21 00:00:00"},{"id":171,"name":"SS-520-5","configuration":"5","defaultPads":"","infoURL":"","wikiURL":"https://ja.wikipedia.org/wiki/SS-520%E3%83%AD%E3%82%B1%E3%83%83%E3%83%88","infoURLs":[""],"changed":"2017-02-21 00:00:00"},{"id":2,"name":"Atlas V 541","configuration":"541","infoURL":"","wikiURL":"http://en.wikipedia.org/wiki/Atlas_V","infoURLs":[""],"imageSizes":[320,480,640,720,768,800,960,1024,1080,1280,1440,1920],"imageURL":"https://s3.amazonaws.com/launchlibrary/RocketImages/Atlas+V+541_1920.jpg","changed":"2017-02-21 00:00:00"},{"id":3,"name":"Soyuz 2.1b","configuration":"2.1b","defaultPads":"","infoURL":"","wikiURL":"http://en.wikipedia.org/wiki/Soyuz-2_(rocket)","infoURLs":[""],"changed":"2017-02-21 00:00:00"}]}';

// Simulate calling the API endpoint https://launchlibrary.net/1.4/rocket?mode=list
export const getRockets = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5s for dramatic effect
  return FAKE_RESPONSE;
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
