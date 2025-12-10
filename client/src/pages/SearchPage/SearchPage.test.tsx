// In this file we ignore the lint rules of any, because it's only used in mocks

/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SearchPage from "./SearchPage";

// AI GEN: The mocks are ai gen by Chat GPT

// ---------------------------------------------
// Mock Redux hooks
// ---------------------------------------------
const mockDispatch = vi.fn();
let mockSearchValue = "";
let mockPageSearch = 1;

vi.mock("../../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: any) => any) =>
    selector({
      filters: {
        searchValue: mockSearchValue,
        category: "All",
        order: 1,
        pageSearch: mockPageSearch,
      },
    }),
}));

// ---------------------------------------------
// Mock useFetchMeals
// MUST MATCH FILE EXTENSION to override correctly
// ---------------------------------------------
const mockUseFetchMealsSearch = vi.fn();

vi.mock("../../hooks/useFetchSearch/useFetchSearch", () => ({
  useFetchSearch: (args: unknown) => mockUseFetchMealsSearch(args),
}));

// ---------------------------------------------
// Mock RecipeGrid
// ---------------------------------------------
const mockRecipeGrid = vi.fn();

vi.mock("../../components/RecipeGrid/RecipeGrid", () => ({
  default: (props: any) => {
    mockRecipeGrid(props);
    return <div data-testid="recipe-grid">RecipeGrid</div>;
  },
}));

// ---------------------------------------------
// Shared "has results" mock data
// ---------------------------------------------
const mockResultData = {
  page: 1,
  totalPages: 1,
  data: [
    {
      idMeal: "1",
      strMeal: "Test Meal",
      strMealThumb: "",
      strCategory: "Test",
    },
  ],
};

beforeEach(() => {
  sessionStorage.clear();
  mockUseFetchMealsSearch.mockReset();
  mockRecipeGrid.mockReset();
  mockDispatch.mockReset();
  mockSearchValue = "";
  mockPageSearch = 1;

  // Store search value when SearchPage dispatches setSearchValue
  mockDispatch.mockImplementation((action: any) => {
    if (action?.type === "filters/setSearchValue") {
      mockSearchValue = action.payload;
    }
    if (action?.type === "filters/setPageSearch") {
      mockPageSearch = action.payload;
    }
  });

  // Default → NO RESULTS
  mockUseFetchMealsSearch.mockImplementation((args) => {
    (mockUseFetchMealsSearch as any).lastArgs = args;
    return {
      data: { page: 1, totalPages: 1, data: [] },
      isLoading: false,
      isError: false,
    };
  });
});

// ---------------------------------------------
// Actual tests
// ---------------------------------------------
describe("SearchPage", () => {
  it("renders heading, input and search button", () => {
    render(<SearchPage />);

    expect(
      screen.getByRole("heading", { name: /search/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/search by category or recipe name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /search/i })
    ).toBeInTheDocument();
  });

  it("triggers a new search when clicking Search with empty input", async () => {
    const user = userEvent.setup();

    render(<SearchPage />);

    // first render = first fetch
    expect(mockUseFetchMealsSearch).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /search/i }));

    // clicking search triggers dispatch + rerender → second fetch
    expect(mockUseFetchMealsSearch).toHaveBeenCalledTimes(2);
  });

  it("shows 'No results found.' after searching with no results", async () => {
    const user = userEvent.setup();

    render(<SearchPage />);

    const input = screen.getByPlaceholderText(
      /search by category or recipe name/i
    );

    await user.type(input, "pasta");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(
      screen.getByText(/no results found/i)
    ).toBeInTheDocument();
  });

  it("renders RecipeGrid when search returns results", async () => {
    const user = userEvent.setup();

    // ⭐ Override ONLY for pizza
    mockUseFetchMealsSearch.mockImplementation((args: any) => {
      (mockUseFetchMealsSearch as any).lastArgs = args;

      if (args.queryValue === "pizza") {
        return {
          data: mockResultData,
          isLoading: false,
          isError: false,
        };
      }

      return {
        data: { page: 1, totalPages: 1, data: [] },
        isLoading: false,
        isError: false,
      };
    });

    render(<SearchPage />);

    const input = screen.getByPlaceholderText(
      /search by category or recipe name/i
    );

    await user.type(input, "pizza");
    await user.click(screen.getByRole("button", { name: /search/i }));

    // Wait for grid to appear
    const grid = await screen.findByTestId("recipe-grid");
    expect(grid).toBeInTheDocument();

    expect(mockRecipeGrid).toHaveBeenCalled();
    const propsPassed = mockRecipeGrid.mock.calls[0][0];

    expect(propsPassed.data).toEqual(mockResultData);
    expect(propsPassed.isLoading).toBe(false);
    expect(propsPassed.isError).toBe(false);
  });
});
