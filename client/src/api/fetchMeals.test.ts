import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchMeals } from "./fetchMeals";

const MOCK_MEALS = {
  page: 1,
  limit: 2,
  total: 5,
  totalPages: 3,
  data: [
    {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken Casserole",
      strCategory: "Chicken",
      strMealThumb: "https://example.com/image1.jpg",
    },
    {
      idMeal: "52773",
      strMeal: "Beef Wellington",
      strCategory: "Beef",
      strMealThumb: "https://example.com/image2.jpg",
    },
  ],
};

describe("fetchMeals", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches all meals successfully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { meals: MOCK_MEALS } }),
    }));

    const result = await fetchMeals({ type: "all", page: 1, limit: 2 });

    expect(result).toBeDefined();
    expect(result.data.length).toBe(2);
    expect(result.total).toBe(5);
    expect(result.data[0].strMeal).toBe("Teriyaki Chicken Casserole");
  });

  it("fetches meals by search successfully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { searchMeals: MOCK_MEALS } }),
    }));

    const result = await fetchMeals({ type: "search", queryValue: "Chicken", page: 1 });

    expect(result).toBeDefined();
    expect(result.data[0].strCategory).toBe("Chicken");
  });

  it("throws an error if the server responds with non-OK status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    }));

    await expect(fetchMeals({ type: "all", page: 1 })).rejects.toThrow("Response Status: 500");
  });

  it("throws an error if fetch itself fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("Network error")));

    await expect(fetchMeals({ type: "all", page: 1 })).rejects.toThrow("Network error");
  });

  it("throws an error for unknown type", async () => {
    // @ts-expect-error Testing unknown type
    await expect(fetchMeals({ type: "unknown" })).rejects.toThrow("Unhandled fetchMeals type");
  });
});
