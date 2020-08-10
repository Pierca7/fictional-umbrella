/* eslint-disable no-case-declarations */
import React, { useContext } from "react";
import { User } from "../models/user";

export interface UserState {
  user?: User;
  loading?: boolean;
}

export enum UserActionTypes {
  FetchUserStarted = "FETCH_USER_STARTED",
  FetchUserFinished = "FETCH_USER_FINISHED",
}

export type UserActions =
  | {
      type: UserActionTypes.FetchUserStarted;
    }
  | {
      type: UserActionTypes.FetchUserFinished;
      data: User;
    };

export type UserContext = {
  userState: UserState;
  setUserState: React.Dispatch<UserActions>;
};

const initialState: UserState = {};

const initialContext: UserContext = {
  userState: initialState,
  setUserState: () => {},
};

const Context = React.createContext(initialContext);

export const reducer = (state: UserState, action: UserActions): UserState => {
  switch (action.type) {
    default:
      return state;
    case UserActionTypes.FetchUserStarted:
      state.loading = true;

      return state;
    case UserActionTypes.FetchUserFinished:
      state.user = action.data;
      state.loading = false;

      return state;
  }
};

export const UserContext = ({ children }: { children: JSX.Element }): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return <Context.Provider value={{ userState: state, setUserState: dispatch }}>{children}</Context.Provider>;
};

export const useUserContext = (): UserContext => useContext(Context);
