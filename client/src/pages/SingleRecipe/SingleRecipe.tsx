import CommentSection from "../../components/CommentSection/CommentSection";
import CrossButton from "./components/CrossButton/CrossButton";
import RecipeMedia from "./components/RecipeMedia/RecipeMedia";
import InfoSection from "./components/InfoSection/InfoSection";
import { useFetchSingleMeal } from "../../hooks/useFetchSingleMeal/useFetchSingleMeal";
import style from "./SingleRecipe.module.css";
import { useEffect } from "react";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

function SingleRecipe({ recipeId }: { recipeId: string }) {
  // Fetch data when the order, category or page number is changed
  const { data, isLoading, isError } = useFetchSingleMeal(recipeId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [recipeId]);

  if (isLoading) return (
    <main
      className={style.loader_container}
      role="main"
      aria-label="Loading recipe"
    >
      <div
        className={style.loader}
        role="status"
        aria-live="assertive"
        aria-label="Loading recipe"
      >
        <span className={style.sr_only_header}>Loading recipe, please wait…</span>
      </div>
    </main>
  );

  if (isError || !data) return (
    <ErrorMessage />
  );

  return (
    <main
      role="main"
      aria-labelledby="recipe-title"
    >
      <CrossButton />

      <RecipeMedia recipe={data} />

      <InfoSection recipe={data} />

      <CommentSection recipeId={recipeId} />
    </main>
  );
}
export default SingleRecipe;
