import { combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";

import { RocketsState } from "./rockets/types";
import { rocketsSaga } from "./rockets/sagas";
import { rocketsReducer } from "./rockets/reducer";

// The top-level state object
export interface ApplicationState {
  rockets: RocketsState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const createRootReducer = () =>
  combineReducers({
    rockets: rocketsReducer
  });

// Here we use `redux-saga` to trigger actions asynchronously. `redux-saga` uses something called a
// "generator function", which you can read about here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
export function* rootSaga() {
  yield all([fork(rocketsSaga)]);
}
