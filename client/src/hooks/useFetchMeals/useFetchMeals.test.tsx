import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFetchMeals } from "./useFetchMeals";
import { fetchMeals } from "../../api/fetchMeals";
import type { AllMealsArgs, FetchMealsArgs } from "../../types/fetch";

import {
  storageKeyCategory,
  storageKeyOrder,
  storageKeyPageNumberOverview
} from "../../utils/storageKeys";

// AI GEN
vi.mock("../../api/fetchMeals", () => ({
  fetchMeals: vi.fn(),
}));

describe("useFetchMeals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
     sessionStorage.clear();
  });

  it("returns data on success", async () => {
    // Mock the response on the fetch functions
    const mockResponse = {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      data: [{ id: "1", title: "Meal", category: "Test" }],
    };

    vi.mocked(fetchMeals).mockResolvedValue(mockResponse);

    const args: FetchMealsArgs = {
      type: "all",
      category: "test",
      page: 1,
      limit: 20,
    };

    // Render the hook
    const { result } = renderHook(() => useFetchMeals(args));

    // Expect loading to be triggered
    expect(result.current.isLoading).toBe(true);

    // Check that correct result is updated
    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  it("handles errors from fetchMeals", async () => {
    vi.mocked(fetchMeals).mockRejectedValue(new Error("fail"));

    const args: FetchMealsArgs = {
      type: "all",
      category: "test",
      page: 1,
      limit: 20,
    };

    // Render with error
    const { result } = renderHook(() => useFetchMeals(args));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("refetches when args change", async () => {
    const first = {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      data: [{ id: "1", title: "First" }],
    };

    const second = {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      data: [{ id: "2", title: "Second" }],
    };

    // First call → first result
    // Second call → second result
    vi.mocked(fetchMeals)
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(second);

    const { result, rerender } = renderHook(
      (props: { args: AllMealsArgs }) => useFetchMeals(props.args),
      {
        initialProps: {
          args: {
            type: "all",
            category: "first",
            page: 1,
            limit: 20,
          },
        },
      }
    );

    await waitFor(() => expect(result.current.data).toEqual(first));
 
    // Rerender when args uppdated
    rerender({
      args: {
        type: "all",
        category: "second",
        page: 1,
        limit: 20,
      },
    });

    await waitFor(() => expect(result.current.data).toEqual(second));
  });

    it("writes category, order and page to sessionStorage", () => {
    const args: AllMealsArgs = {
      type: "all",
      category: "Beef",
      order: 1,
      page: 3,
      limit: 20
    };

    renderHook(() => useFetchMeals(args));

    expect(sessionStorage.getItem(storageKeyCategory)).toBe("Beef");
    expect(sessionStorage.getItem(storageKeyOrder)).toBe("1");
    expect(sessionStorage.getItem(storageKeyPageNumberOverview)).toBe("3");
  });

  
});
