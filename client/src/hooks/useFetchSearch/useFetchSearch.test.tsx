import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFetchSearch } from "./useFetchSearch";
import { fetchMeals } from "../../api/fetchMeals";
import {
  storageKeyPageNumberSearch,
  storageKeySearchValue,
} from "../../utils/storageKeys";

import type { SearchMealsArgs } from "../../types/fetch";

// Mock API function
vi.mock("../../api/fetchMeals", () => ({
  fetchMeals: vi.fn(),
}));

describe("useFetchSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("returns data on success AND stores values in sessionStorage", async () => {
    const mockResponse = {
      page: 2,
      limit: 20,
      total: 1,
      totalPages: 1,
      data: [{ idMeal: "1", strMeal: "Meal", strCategory: "Test" }],
    };

    vi.mocked(fetchMeals).mockResolvedValue(mockResponse);

    const args: SearchMealsArgs = {
      type: "search",
      queryValue: "pizza",
      page: 2,
    };

    const { result } = renderHook(() => useFetchSearch(args));

    // Immediately after calling the hook, loading should be true
    expect(result.current.isLoading).toBe(true);

    // SessionStorage should be updated immediately (not async)
    expect(sessionStorage.getItem(storageKeyPageNumberSearch)).toBe("2");
    expect(sessionStorage.getItem(storageKeySearchValue)).toBe("pizza");

    // Wait for fetch to resolve
    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  it("handles errors from fetchMeals", async () => {
    vi.mocked(fetchMeals).mockRejectedValue(new Error("fail"));

    const args: SearchMealsArgs = {
      type: "search",
      queryValue: "nope",
      page: 1,
    };

    const { result } = renderHook(() => useFetchSearch(args));

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
      data: [{ idMeal: "1", strMeal: "First" }],
    };

    const second = {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      data: [{ idMeal: "2", strMeal: "Second" }],
    };

    vi.mocked(fetchMeals)
      .mockResolvedValueOnce(first) // first render
      .mockResolvedValueOnce(second); // second render

    const { result, rerender } = renderHook(
      (props: { args: SearchMealsArgs }) => useFetchSearch(props.args),
      {
        initialProps: {
          args: {
            type: "search",
            queryValue: "first",
            page: 1,
          },
        },
      }
    );

    await waitFor(() => expect(result.current.data).toEqual(first));

    rerender({
      args: {
        type: "search",
        queryValue: "second",
        page: 1,
      },
    });

    await waitFor(() => expect(result.current.data).toEqual(second));
  });

  it("writes page and search query to sessionStorage", () => {
    const args: SearchMealsArgs = {
      type: "search",
      queryValue: "pizza",
      page: 4
    };

    renderHook(() => useFetchSearch(args));

    expect(sessionStorage.getItem(storageKeyPageNumberSearch)).toBe("4");
    expect(sessionStorage.getItem(storageKeySearchValue)).toBe("pizza");
  });
});
