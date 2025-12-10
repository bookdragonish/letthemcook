// In this file we ignore the lint rules of hooks and any, because we found it neccessary to use Redux mocks to run the tests
// without actually using the state manager functions. Because of that, we have to use any and hooks inside the mocks, which
// ESLint doesn't like

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import RecipeOverview from "./RecipeOverview";
// AI GEN: mocks written by ChatGPT
// --------------------------
// Mock Redux hooks
// --------------------------
const mockDispatch = vi.fn();

vi.mock("../../store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: any) => any) =>
    selector({
      filters: {
        category: "All",
        order: 1,
        searchValue: "",
        pageOverview: 1, // ⭐ IMPORTANT: fixes failing tests
      },
    }),
}));

// --------------------------
// Mock useFetchMeals
// --------------------------
const mockUseFetchMeals = vi.fn();

vi.mock("../../hooks/useFetchMeals/useFetchMeals.ts", () => ({
  useFetchMeals: (args: unknown) => mockUseFetchMeals(args),
}));

// --------------------------
// Mock RecipeGrid
// --------------------------
const mockRecipeGrid = vi.fn();

vi.mock("../../components/RecipeGrid/RecipeGrid", () => ({
  default: (props: any) => {
    mockRecipeGrid(props);
    return <div data-testid="recipe-grid">RecipeGrid</div>;
  },
}));

// --------------------------
// Mock EmblaCarousel
// --------------------------
vi.mock("../../components/EmblaCarousel/EmblaCarousel", () => ({
  default: () => <div data-testid="embla">Carousel</div>,
}));

// --------------------------
// Mock CategoryCard
// --------------------------
vi.mock("../../components/CategoryCard/CategoryCard", () => ({
  default: ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => {
    const [selected, setSelected] = React.useState(label === "All");
    return (
      <button
        data-testid={`category-${label}`}
        onClick={() => {
          setSelected(true);
          onClick();
        }}
      >
        {label}
        {selected ? " (selected)" : ""}
      </button>
    );
  },
}));

// --------------------------
// Mock GridInteractions
// --------------------------
vi.mock("../../components/GridInteractions/GridInteractions", () => ({
  default: ({
    currentOrder,
    onToggleSort,
  }: {
    currentOrder: 1 | -1;
    onToggleSort: (newOrder: 1 | -1) => void;
  }) => {
    return (
      <section
        data-testid="grid-interactions"
        aria-label="Sorting order recipes and get random"
      >
        <button data-testid="randomizer-btn">Random</button>

        <button
          data-testid="sort-button"
          onClick={() =>
            onToggleSort(currentOrder === 1 ? -1 : 1)
          }
        >
          {currentOrder === 1 ? "Title A-Z ↑" : "Title Z-A ↓"}
        </button>
      </section>
    );
  },
}));

// --------------------------
// Mock data returned from useFetchMeals
// --------------------------
const mockData = {
  page: 1,
  totalPages: 3,
  data: [
    {
      idMeal: "1",
      strMeal: "Spaghetti Carbonara",
      strMealThumb: "",
      strCategory: "Beef",
    },
    {
      idMeal: "2",
      strMeal: "Vegan Bowl",
      strMealThumb: "",
      strCategory: "Vegan",
    },
  ],
};

beforeEach(() => {
  sessionStorage.clear();
  mockRecipeGrid.mockClear();
  mockUseFetchMeals.mockReset();
  mockDispatch.mockReset();

  mockUseFetchMeals.mockImplementation((args) => {
    (mockUseFetchMeals as any).lastArgs = args;
    return {
      data: mockData,
      isLoading: false,
      isError: false,
    };
  });
});

// --------------------------
// Actual tests
// --------------------------
describe("RecipeOverview", () => {
  it("renders heading and all category buttons", () => {
    render(<RecipeOverview />);

    // Expect headers
    expect(
      screen.getByRole("heading", { name: /recipes/i })
    ).toBeInTheDocument();

    // Expect categories
    expect(screen.getByTestId("category-All")).toBeInTheDocument();
    expect(screen.getByTestId("category-Vegan")).toBeInTheDocument();
    expect(screen.getByTestId("category-Vegetarian")).toBeInTheDocument();
    expect(screen.getByTestId("category-Dessert")).toBeInTheDocument();
  });

  it("calls useFetchMeals with initial arguments", () => {
    render(<RecipeOverview />);

    expect(mockUseFetchMeals).toHaveBeenCalledTimes(1);

    const args = (mockUseFetchMeals as any).lastArgs;
    expect(args).toMatchObject({
      type: "all",
      order: 1,
      category: "All",
      page: 1, 
    });
  });

  it("changes selected category when a category button is clicked", async () => {
    const user = userEvent.setup();

    render(<RecipeOverview />);

    const veganBtn = screen.getByTestId("category-Vegan");

    //"All" shows selected initially
    expect(screen.getByTestId("category-All")).toHaveTextContent("(selected)");

    //Click "Vegan", then its own internal state toggles to selected
    await user.click(veganBtn);

    expect(veganBtn).toHaveTextContent("(selected)");
  });

  it("renders RecipeGrid with data from useFetchMeals", () => {
    render(<RecipeOverview />);

    expect(screen.getByTestId("recipe-grid")).toBeInTheDocument();

    // One fetch call
    expect(mockRecipeGrid).toHaveBeenCalledTimes(1);

    const propsPassed = mockRecipeGrid.mock.calls[0][0];
    expect(propsPassed.data).toEqual(mockData);
    expect(propsPassed.isLoading).toBe(false);
    expect(propsPassed.isError).toBe(false);
  });

  it("passes resetPageOnCategoryChange flag when category changes", async () => {
    const user = userEvent.setup();

    render(<RecipeOverview />);

    mockRecipeGrid.mockClear();

    // Choose vegan
    const veganBtn = screen.getByTestId("category-Vegan");
    await user.click(veganBtn);

    // See that grid is called
    expect(mockRecipeGrid).toHaveBeenCalled();
    const { resetPageOnCategoryChange } = mockRecipeGrid.mock.calls[0][0];

    expect(resetPageOnCategoryChange).toBe(true);
  });
});
