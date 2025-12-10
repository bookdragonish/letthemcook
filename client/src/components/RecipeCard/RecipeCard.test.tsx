import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const testMeal = {
  idMeal: "53049",
  strMeal: "Apam balik",
  strMealAlternate: null,
  strCategory: "Dessert",
  strArea: "Malaysian",
  strInstructions:
    "Mix milk, oil and egg together. Sift flour, baking powder and salt into the mixture. Stir well until all ingredients are combined evenly.\r\n\r\nSpread some batter onto the pan. Spread a thin layer of batter to the side of the pan. Cover the pan for 30-60 seconds until small air bubbles appear.\r\n\r\nAdd butter, cream corn, crushed peanuts and sugar onto the pancake. Fold the pancake into half once the bottom surface is browned.\r\n\r\nCut into wedges and best eaten when it is warm.",
  strMealThumb:
    "https://www.themealdb.com/images/media/meals/adxcbq1619787919.jpg",
  strTags: null,
  strYoutube: "https://www.youtube.com/watch?v=6R8ffRRJcrg",
  ingredients: [
    "Milk",
    "Oil",
    "Eggs",
    "Flour",
    "Baking Powder",
    "Salt",
    "Unsalted Butter",
    "Sugar",
    "Peanut Butter",
  ],
  measures: [
    "200ml",
    "60ml",
    "2",
    "1600g",
    "3 tsp",
    "1/2 tsp",
    "25g",
    "45g",
    "3 tbs",
  ],
  strSource: "https://www.nyonyacooking.com/recipes/apam-balik~SJ5WuvsDf9WQ",
  strImageSource: null,
  strCreativeCommonsConfirmed: null,
  dateModified: null,
};

describe("Recipe Card", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <RecipeCard data={testMeal} />
      </MemoryRouter>
    );
  });
  it("loads the recipe correctly", () => {
    expect(screen.queryByText("Apam balik")).toBeInTheDocument();
    expect(screen.queryByText("Dessert")).toBeInTheDocument();
  });
  it("will render the url on click", async () => {

    const link = screen.getByRole("link", { name: /Apam balik/i });
    expect(link).toHaveAttribute('href', expect.stringContaining("53049"));
  });
});
