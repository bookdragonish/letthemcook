import { API_URL } from "./URL";

/**
 * Fetch a single recipe by ID from the backend GraphQL API.
 *
 * @async
 * @function getSingleRecipe
 * @param {string} id - The recipe ID (Meal ID) to fetch.
 * @returns {Promise<Meal>} The full recipe object.
 * @throws {Error} Throws if the server response is not OK or network request fails.
 *
 * @example
 * const meal = await getSingleRecipe("52772");
 * console.log(meal.strMeal); // "Teriyaki Chicken Casserole"
 */

export const getSingleRecipe = async (id :string) => {
  //Defines the fields we want returned from the database
  const query = `
      query GetMeal($id: ID!) {
        meal(id: $id) {
          idMeal
          strMeal
          strMealAlternate
          strCategory
          strArea
          strInstructions
          strMealThumb
          strTags
          strYoutube
          ingredients
          measures
          strSource
          strImageSource
          strCreativeCommonsConfirmed
          dateModified
        }
      }
    `;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { id },
    }),
  });

  if (!response.ok) {
    throw new Error(`Response Status: ${response.status}`);
  }

  const result = await response.json();
  return result.data.meal;
};