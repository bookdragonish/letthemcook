import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import Ingredients from "./Ingredients";
import testData from "../../../../data/testdata.json";

describe("Ingredients", () => {
  const testRecipe = testData.meals[0];
  it("render header", () => {
    render(<Ingredients recipe={testRecipe} />);

    expect(screen.getByText(/Ingredients/i)).toBeInTheDocument();
  });

  it("renders all ingredients with corresponding measures", () => {
    render(<Ingredients recipe={testRecipe} />);

    // Check some ingredients
    expect(screen.getByText("butter")).toBeInTheDocument();
    expect(screen.getByText("Salted Butter")).toBeInTheDocument();
    expect(screen.getByText("ground almonds")).toBeInTheDocument();

    // Check some measures
    expect(screen.getByText("175g/6oz")).toBeInTheDocument();
    expect(screen.getByText("200g/7oz")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

});
