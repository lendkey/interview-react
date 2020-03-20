import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { ActionTypes } from "./types";
import { listSuccess, error, listRequest } from "./actions";
import { getRocketsList } from "../../api/rockets";

// Calls the API endpoint to get a page of rockets whenever a LIST_REQUEST action is dispatched
export function* handleListRequest() {
  const response = yield call(getRocketsList);

  if ("errors" in response) {
    yield put(error(response.errors));
  } else {
    yield put(listSuccess({ page: response.data }));
  }
}

// Watches for a list request action
export function* watchListRequest() {
  yield takeLatest(ActionTypes.LIST_REQUEST, handleListRequest);
}

/* If this was a real app with a router like "connected-react-router", we'd watch
   for the appropriate location change action to trigger the list request action. */
export function* initialSaga() {
  yield put(listRequest());
}

// Split our saga into multiple watchers.
export function* rocketsSaga() {
  yield all([fork(watchListRequest), fork(initialSaga)]);
}
