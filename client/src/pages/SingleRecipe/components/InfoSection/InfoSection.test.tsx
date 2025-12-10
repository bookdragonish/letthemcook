import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import InfoSection from "./InfoSection";
import testData from "../../../../data/testdata.json";

// Mocking the ingredients and instructions
vi.mock("../Ingredients/Ingredients", () => ({
  default: vi.fn(() => <div>Mocked Ingredients</div>),
}));

vi.mock("../Instructions/Instructions", () => ({
  default: vi.fn(() => <div>Mocked Instructions</div>),
}));


describe("Info section", () => {
  const mockRecipe = testData.meals[0];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads info section", () => {
    render(<InfoSection recipe={mockRecipe} />);

    expect(screen.getByText("Mocked Ingredients")).toBeInTheDocument();
    expect(screen.getByText("Mocked Instructions")).toBeInTheDocument();
  });
});
