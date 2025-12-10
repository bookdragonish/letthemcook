// In this file we ignore the lint rules of any, because it's only a helper file for the mock tests

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import filtersReducer from "../store/filtersSlice";

const rootReducer = combineReducers({
  filters: filtersReducer,
});
type TestRootState = ReturnType<typeof rootReducer>;

export function renderWithProvidersAndRouter(
  ui: React.ReactElement,
  options?: {
    route?: string;
    preloadedState?: Partial<TestRootState>;
  }
) {
  const { route = "/", preloadedState } = options ?? {};

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    ),
  };
}
