import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RecipeGrid from "./RecipeGrid";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import testdata from "./testFetchData.json";
import type { MealPreview } from "../../types/meal";
import { Provider } from "react-redux";
import type { ActionCreatorWithPayload, Store } from "@reduxjs/toolkit";

// AI GEN the mocks are ai generated
// --------------------------------------------
// Mock Redux dispatch
// --------------------------------------------
const mockDispatch = vi.fn();

// --------------------------------------------
// Mock Redux hooks
// --------------------------------------------
vi.mock("../../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({}),
}));

// --------------------------------------------
// Mock action creator
// --------------------------------------------
const mockSetPageNumber: ActionCreatorWithPayload<number, string> =
  Object.assign(
    (page: number) => ({
      type: "filters/setPageNumber",
      payload: page,
    }),
    {
      type: "filters/setPageNumber",
      match(_action: unknown): _action is { payload: number; type: string } {
        return false; // Always false (we do not need real matching for tests)
      },
    }
  );

vi.mock("../../store/filtersSlice", () => ({
  setPageNumber: (page: number) => mockSetPageNumber(page),
}));

// --------------------------------------------
// Mock RecipeCard
// --------------------------------------------
vi.mock("../RecipeCard/RecipeCard", () => ({
  default: ({ data }: { data: MealPreview }) => (
    <div data-testid="recipe-card">
      <h3>{data.strMeal}</h3>
    </div>
  ),
}));

// --------------------------------------------
// Minimal fully valid Redux mock store
// (Fixes TS error: missing replaceReducer & Symbol.observable)
// --------------------------------------------
const createMockStore = (): Store => ({
  getState: () => ({}),
  dispatch: mockDispatch,
  subscribe: () => () => {},
  replaceReducer: () => {},
  [Symbol.observable]: () => ({
    subscribe: () => ({ unsubscribe() {} }),
    [Symbol.observable]() {
      return this;
    },
  }),
});
describe("Recipe Grid", () => {
  // Start each test with a clean session storage
  beforeEach(() => {
    sessionStorage.clear();
    mockDispatch.mockClear();
  });

  it("loads the recipes correctly", () => {
    //Render component
    const mockStore = createMockStore();

    const grid = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RecipeGrid
            data={testdata}
            setPageNumber={mockSetPageNumber}
            isLoading={false}
            isError={false}
          />
        </MemoryRouter>
      </Provider>
    );

    //Check that two heades are visible
    const headers = grid.getAllByRole("heading", { level: 3 });
    expect(headers).toHaveLength(5);

    expect(headers[0]).toHaveTextContent("Spaghetti Carbonara");
    expect(headers[1]).toHaveTextContent("Vegan Bowl");
  });

  it("Renders pagination correctly", () => {
    const mockStore = createMockStore();

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RecipeGrid
            data={testdata}
            setPageNumber={mockSetPageNumber}
            isLoading={false}
            isError={false}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("1 / 6")).toBeInTheDocument();
  });

  it("It is possible to click next", async () => {
    const mockStore = createMockStore();

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RecipeGrid
            data={testdata}
            setPageNumber={mockSetPageNumber}
            isLoading={false}
            isError={false}
          />
        </MemoryRouter>
      </Provider>
    );

    //Check userinteraction when clicking the next and previous
    const user = userEvent.setup();
    const previous = screen.getByRole("button", { name: /previous/i });
    const next = screen.getByRole("button", { name: /next/i });

    expect(previous).toBeDisabled();
    expect(next).not.toBeDisabled();

    await user.click(next); // 1/3 -> 2/3

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "filters/setPageNumber",
      payload: 2,
    });
  });

  it("disables previous button on first page", () => {
    const mockStore = createMockStore();
    const td = { ...testdata, page: 1 };

    render(
      <Provider store={mockStore}>
        <RecipeGrid
          data={td}
          isLoading={false}
          isError={false}
          setPageNumber={mockSetPageNumber}
        />
      </Provider>
    );

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("disables next button on last page", () => {
    const mockStore = createMockStore();
    const td = { ...testdata, page: 6 };

    render(
      <Provider store={mockStore}>
        <RecipeGrid
          data={td}
          isLoading={false}
          isError={false}
          setPageNumber={mockSetPageNumber}
        />
      </Provider>
    );

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("shows loader when loading", () => {
    const mockStore = createMockStore();

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RecipeGrid
            data={testdata}
            isLoading={true}
            isError={false}
            setPageNumber={mockSetPageNumber}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
  vi.mock("../ErrorMessage/ErrorMessage", () => ({
    default: () => <div data-testid="err">Error!</div>,
  }));

  it("shows error message", () => {
    const mockStore = createMockStore();

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RecipeGrid
            data={testdata}
            isLoading={false}
            isError={true}
            setPageNumber={mockSetPageNumber}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("err")).toBeInTheDocument();
  });
});
