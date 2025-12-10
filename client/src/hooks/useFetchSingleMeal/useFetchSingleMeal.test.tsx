import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFetchSingleMeal } from "./useFetchSingleMeal";
import { getSingleRecipe } from "../../api/fetchSingleMeal";
import { testMeals } from "../../data/testMeals";
import type { Meal } from "../../types/meal";

// Mock API
vi.mock("../../api/fetchSingleMeal", () => ({
  getSingleRecipe: vi.fn(),
}));
// AI GEN
describe("useFetchSingleMeal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches a single meal successfully", async () => {
    const meal: Meal = testMeals[0];

    vi.mocked(getSingleRecipe).mockResolvedValue(meal);

    const { result } = renderHook(() => useFetchSingleMeal(meal.idMeal));

    expect(result.current.isLoading).toBe(true);

    // Check that hook render correct info
    await waitFor(() => {
      expect(result.current.data).toEqual(meal);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  it("handles errors correctly", async () => {
    vi.mocked(getSingleRecipe).mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useFetchSingleMeal("999"));

    // Error is true
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  it("refetches when id changes", async () => {
    const meal1 = testMeals[0];
    const meal2 = testMeals[1];

    vi.mocked(getSingleRecipe)
      .mockResolvedValueOnce(meal1)
      .mockResolvedValueOnce(meal2);

    const { result, rerender } = renderHook(
      (props: { id: string }) => useFetchSingleMeal(props.id),
      {
        initialProps: { id: meal1.idMeal },
      }
    );

    // Check the first is mocked
    await waitFor(() => {
      expect(result.current.data).toEqual(meal1);
    });

    rerender({ id: meal2.idMeal });

    // Check that it mocks second
    await waitFor(() => {
      expect(result.current.data).toEqual(meal2);
    });
  });
});
