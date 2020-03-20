import { createReducer, ActionType } from "typesafe-actions";
import { RocketsState } from "./types";
import * as actions from "./actions";

// Union type of all actions
export type RocketAction = ActionType<typeof import("./actions")>;

export const initialState: RocketsState = {
  loading: false,
  page: [],
  errors: []
};

// Create the reducer
export const rocketsReducer = createReducer<RocketsState, RocketAction>(
  initialState
)
  // Every *Request action updates the state in exactly the same way
  .handleAction([actions.listRequest], state => {
    return { ...state, loading: true, errors: [] };
  })
  .handleAction(actions.listSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      page: action.payload.page
    };
  })
  //this was missing, added it so it correctly renders errors on our frontend
  .handleAction(actions.error, (state, action) => {
    return {
      ...state,
      loading: false,
      errors: action.payload
    };
  });
