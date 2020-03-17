import { createCustomAction } from "typesafe-actions";
import { ActionTypes, Rocket } from "./types";
import { ApiError } from "../../api/types";

// Dispatched to request a list of rockets
export const listRequest = createCustomAction(ActionTypes.LIST_REQUEST);

// Dispatched when the list of rockets is retrieved successfully
export const listSuccess = createCustomAction(
  ActionTypes.LIST_SUCCESS,
  (payload: { page: Rocket[] }) => ({
    payload: payload
  })
);

// Dispatched when an error is encountered while interacting with the backend
export const error = createCustomAction(
  ActionTypes.ERROR,
  (errors: ApiError[]) => ({ payload: errors })
);
