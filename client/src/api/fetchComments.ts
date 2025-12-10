import { API_URL } from "./URL";

export const getCommentsbyRecipeID = async (recipeId: string) => {
  const query = `
      query ($recipeID: ID!) {
        commentsByRecipe(recipeID: $recipeID) {
          recipeID
          comments {
            anonymousName
            comment
            date
          }
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
      variables: { recipeID: recipeId },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(result.errors[0].message);
  }
  return result.data.commentsByRecipe.comments;
};

export const addComment = async (
  recipeID: string,
  anonymousName: string,
  comment: string
) => {
  const mutation = `
    mutation ($recipeID: ID!, $anonymousName: String!, $comment: String!) {
      addComment(recipeID: $recipeID, anonymousName: $anonymousName, comment: $comment) {
        comments {
          anonymousName
          comment
          date
        }
      }
    }
  `;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: { recipeID, anonymousName, comment },
    }),
  });
  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(result.errors[0].message);
  }
  return result.data.commentsByRecipe;
};
