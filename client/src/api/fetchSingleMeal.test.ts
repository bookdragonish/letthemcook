import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSingleRecipe } from "./fetchSingleMeal";

const MOCK_MEAL = {
  idMeal: "52772",
  strMeal: "Teriyaki Chicken Casserole",
  strCategory: "Chicken",
  strInstructions: "Some instructions",
  strMealThumb: "https://example.com/image.jpg",
  ingredients: ["Chicken", "Rice"],
  measures: ["500g", "200g"],
};

describe("getSingleRecipe", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it("fetches a meal by ID successfully", async () => {
    // Mock the global fetch function
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { meal: MOCK_MEAL } }),
    }));

    const meal = await getSingleRecipe("52772");

    expect(meal).toBeDefined();
    expect(meal.idMeal).toBe("52772");
    expect(meal.strMeal).toBe("Teriyaki Chicken Casserole");
  });

  it("throws an error if the server responds with a non-OK status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({})
    }));

    await expect(getSingleRecipe("52772")).rejects.toThrow("Response Status: 500");
  });

  it("throws an error if fetch itself fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("Network error")));

    await expect(getSingleRecipe("52772")).rejects.toThrow("Network error");
  });
});
