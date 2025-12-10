import { useEffect, useState } from "react";
import type { Meal } from "../../types/meal";
import { getSingleRecipe } from "../../api/fetchSingleMeal";

/**
 * Custom hook to fetch single meal from the API based on request parameters.
 *
 * This hook is similar to the useFetchMeals but it returns a Meal type instead of 
 * A response and the get function is different, hence using two different functions.
 * We might combine these in the future but we found that the code was more readable this
 * way, when we did not need a lot of type resolving
 *
 * The hook manages loading and error state internally, returning:
 * - `data` → the fetched recipe data (paginated result)
 * - `isLoading` → whether the request is currently in progress
 * - `isError` → whether the request failed
 *
 * The request runs automatically whenever `args` changes.
 *
 * @param id is the id of the meal to be fetched
 * @returns An object of Meal type
 */

export function useFetchSingleMeal(id: string) {
  const [data, setData] = useState<Meal>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    async function APIFetch() {
      try {
        setIsLoading(true);
        setIsError(false);
        const response = await getSingleRecipe(id);
        setData(response);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    APIFetch();
  }, [id]);

  return { data, isError, isLoading };
}
