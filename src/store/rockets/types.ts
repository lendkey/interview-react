import { ApiError } from "../../api/types";

// This file holds our state type, as well as any other types related to the rockets Redux store.

// The Rocket type, adapted from https://launchlibrary.net/docs/1.4.1/api.html#rocket. Omits some fields.
export interface Rocket {
  id: number;
  name: string;
  configuration?: string;
  wikiURL?: URL;
  changed: Date;
}

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in the compiled code.
export enum ActionTypes {
  LIST_REQUEST = "@@rockets/LIST_REQUEST",
  LIST_SUCCESS = "@@rockets/LIST_SUCCESS",
  ERROR = "@@rockets/ERROR"
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface RocketsState {
  readonly loading: boolean;
  readonly page: Rocket[]; // A page of rockets
  readonly errors: ApiError[];
}
