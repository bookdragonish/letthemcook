import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import RecipeMedia from "./RecipeMedia";
import testData from "../../../../data/testdata.json";

describe("RecipeMedia", () => {
  const mockRecipe = testData.meals[0];

  // All below are render tests to see if all info render correctly

  it("renders the meal name in an <h1>", () => {
    render(<RecipeMedia recipe={mockRecipe} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Apple Frangipan Tart");
  });

  it("renders an image with correct src and alt", () => {
    render(<RecipeMedia recipe={mockRecipe} />);
    const img = screen.getByRole("img", { name: /image of Apple Frangipan Tart/i });
    expect(img).toHaveAttribute("src", "https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg");
    expect(img).toHaveAttribute("alt", "image of Apple Frangipan Tart");
  });

  it("renders wrapper section with proper class", () => {
    const { container } = render(<RecipeMedia recipe={mockRecipe} />);
    const section = container.querySelector("section");
    expect(section).toHaveClass(/recipe_media/i);
  });
});
