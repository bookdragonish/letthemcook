import type {
  AllMealsArgs,
  FetchMealsArgs,
  SearchMealsArgs,
} from "../types/fetch";
import { API_URL } from "./URL";

/**
 * Fetch a paginated list of meals, optionally filtered by category and/or sorted.
 *
 * @async
 * @function getAllRecipes
 * @param {AllMealsArgs} params - Request configuration.
 * @param {number} [params.order=1] - Sort order: `1` (A–Z) or `-1` (Z–A)
 * @param {string} [params.category="All"] - Category filter (e.g., "Seafood", "Vegan").
 * @param {number} [params.page=1] - Page number for pagination.
 * @param {number} [params.limit] - Optional number of items to return per page.
 * @returns {Promise<PaginatedResult<MealPreview>>}
 * A paginated result containing meal previews.
 *
 * @example
 * const meals = await getAllRecipes({ order: 1, category: "Dessert", page: 2 });
 * console.log(meals.data.length); // 20 items
 */
const getAllRecipes = async ({
  order = 1,
  category = "All",
  page = 1,
  limit,
}: AllMealsArgs) => {
  const variables: AllMealsArgs = {
    order, category, page,
    type: "all"
  };

  // Only include limit if explicitly provided
  if (limit !== undefined) variables.limit = limit;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
          query GetMeals($order: Int, $category: String, $page: Int, $limit: Int) {
            meals(order: $order, category: $category, page: $page, limit: $limit) {
              page
              limit
              total
              totalPages
              data {
                idMeal
                strMeal
                strCategory
                strMealThumb
              }
            }
          }
        `,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Response Status: ${response.status}`);
  }
  const result = await response.json();
  return result.data.meals;
};

/**
 * Search meals by keyword with optional pagination.
 *
 * @async
 * @function getRecipeBySearch
 * @param {SearchMealsArgs} params - Search request configuration.
 * @param {string} params.queryValue - The search term (e.g., "Chicken").
 * @param {number} [params.page=1] - Page number for pagination.
 * @param {number} [params.limit] - Optional page limit.
 * @returns {Promise<PaginatedResult<MealPreview>>}
 * A paginated list of meals matching the search text.
 *
 * @example
 * const results = await getRecipeBySearch({ queryValue: "Beef", page: 1 });
 * console.log(results.total); // total search matches
 */
const getRecipeBySearch = async ({
  queryValue,
  page = 1,
  limit,
}: SearchMealsArgs) => {
  // TODO: add pagination and limit to the query
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
          query SearchMeals($value: String!, $page: Int, $limit: Int) {
            searchMeals(value: $value, page: $page, limit: $limit) {
              data {
                idMeal
                strMeal
                strCategory
                strMealThumb
              }
              page
              limit
              total
              totalPages
            }
          }
        `,
      variables: {
        value: queryValue,
        page,
        limit,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Response Status: ${response.status}`);
  }
  const result = await response.json();
  return result.data.searchMeals;
};

/**
 * Fetch meals from the backend based on the request argument type.
 *
 * This function acts as a dispatcher — it inspects the `args.type`
 * and routes the request to the correct API call:
 *
 * - `type: "all"` → fetches paginated recipe list with category & sort options
 * - `type: "search"` → fetches paginated recipe results based on a text query
 *
 * @param args - Request parameters used to determine which data to fetch
 * @returns A promise resolving to paginated meal data
 */
export async function fetchMeals(args: FetchMealsArgs) {
  switch (args.type) {
    case "search":
      return getRecipeBySearch(args);
    case "all":
      return getAllRecipes(args);
    default:
      throw new Error(`Unhandled fetchMeals type`);
  }
}
