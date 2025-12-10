import { useEffect, useState } from "react";
import { getCommentsbyRecipeID, addComment } from "../../api/fetchComments";
import type { Comment } from "../../types/comment";

export function useComments(recipeId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // --- Fetch comments whenever recipeId changes ---
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setIsError(false);

        const data = await getCommentsbyRecipeID(recipeId);
        setComments(data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [recipeId]);

  // --- Add a comment and then refresh the list ---
  async function submitComment(anonymousName: string, comment: string) {
    if(!anonymousName || !comment){
      setIsError(true)
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setIsError(false);

      await addComment(recipeId, anonymousName, comment);

      // Re-fetch to update UI
      const refreshed = await getCommentsbyRecipeID(recipeId);
      setComments(refreshed);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return { comments, isLoading, isError, submitComment };
}