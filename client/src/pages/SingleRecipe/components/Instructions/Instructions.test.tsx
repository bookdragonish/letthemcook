import { render, screen } from "@testing-library/react";
import Instructions from "./Instructions";
import type { Meal } from "../../../../types/meal";
import testData from "../../../../data/testdata.json";
import "@testing-library/jest-dom";

describe("Instructions", () => {
  // Mocks a recipe
  const mockRecipe = testData.meals[0];

  it("renders the header", () => {
    render(<Instructions recipe={mockRecipe} />);
    expect(screen.getByText(/Instructions/i)).toBeInTheDocument();
  });

  it("renders each instruction as a list item", () => {
    render(<Instructions recipe={mockRecipe} />);

    const items = screen.getAllByRole("listitem");

    // Check that the instructions are rendered correctly
    expect(items.length).toBeGreaterThan(1); 
    expect(items[0]).toHaveTextContent(/Preheat the oven/);
    expect(items[items.length - 1]).toHaveTextContent(
      /Serve warm with cream, crème fraiche or ice cream/
    );
  });

  it("trims whitespace and filters out empty sentences", () => {
    // Mockdata with instructions with more dots and spaces
    const recipeWithExtraDots: Meal = {
      ...mockRecipe,
      strInstructions: "Step one.   Step two..  .  Step three. ",
    };

    render(<Instructions recipe={recipeWithExtraDots} />);

    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(3);
    expect(items[0]).toHaveTextContent("Step one");
    expect(items[1]).toHaveTextContent("Step two");
    expect(items[2]).toHaveTextContent("Step three");
  });
});
