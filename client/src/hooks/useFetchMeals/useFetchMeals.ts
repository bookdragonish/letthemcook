import { useEffect, useState } from "react";
import { fetchMeals } from "../../api/fetchMeals";
import type {
  AllMealsArgs,
} from "../../types/fetch";
import type { MealPreview, PaginatedResult } from "../../types/meal";
import {
  storageKeyCategory,
  storageKeyOrder,
  storageKeyPageNumberOverview,
} from "../../utils/storageKeys";

/**
 * Custom hook to fetch meal data from the API based on request parameters.
 * 
 * Also sets storage
 *
 * The hook manages loading and error state internally, returning:
 * - `data` → the fetched recipe data (paginated result)
 * - `isLoading` → whether the request is currently in progress
 * - `isError` → whether the request failed
 *
 * The request runs automatically whenever `args` changes.
 *
 * @param args - Request parameters used to determine which dataset to fetch
 * @returns An object containing the data, loading state, and error state
 */

export function useFetchMeals(args: AllMealsArgs) {
  const [data, setData] = useState<PaginatedResult<MealPreview>>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    data: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Saves all fetch info to sessionstorage
  if (args.category) sessionStorage.setItem(storageKeyCategory, args.category);
  if (args.order) sessionStorage.setItem(storageKeyOrder, "" + args.order);
  if (args.page)
    sessionStorage.setItem(storageKeyPageNumberOverview, "" + args.page);

  // This useffect runs whenever the arguments passed in changes (when we want to get someting else)
  useEffect(() => {
    async function APIFetch() {
      try {
        setIsLoading(true);
        setIsError(false);
        // Runs the fetchmeal function and args.type decide if the fetch is a getAll or Search query
        const response = await fetchMeals(args);
        setData(response);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    APIFetch();
  }, [args]);
  return { data, isError, isLoading };
}