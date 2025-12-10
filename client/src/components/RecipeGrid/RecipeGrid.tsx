import { useEffect } from "react";
import RecipeCard from "../RecipeCard/RecipeCard";
import style from "./RecipeGrid.module.css";
import type { MealPreview, PaginatedResult } from "../../types/meal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useAppDispatch } from "../../store/hooks";
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";

type GridInfo = {
  data: PaginatedResult<MealPreview>;
  resetPageOnCategoryChange?: boolean;
  onResetHandled?: () => void;
  setPageNumber: ActionCreatorWithPayload<number, string>;
  isLoading: boolean;
  isError: boolean;
};

function RecipeGrid({
  data,
  resetPageOnCategoryChange = false,
  onResetHandled,
  isError,
  isLoading,
  setPageNumber,
}: GridInfo) {
  const dispatch = useAppDispatch();

  // Make sure the page number is reset upon changing category, but not when clicking out of a recipe on that page
  useEffect(() => {
    if (!resetPageOnCategoryChange) return;

    dispatch(setPageNumber(1));
    onResetHandled?.();
  }, [resetPageOnCategoryChange, onResetHandled, data.page, dispatch, setPageNumber]);

  if (isLoading)
    return (
      <section
        className={style.loader_container}
        role="status"
        aria-live="assertive"
      >
        <div className={style.loader} aria-label="Loading recipes"></div>
      </section>
    );

  if (isError)
    return (
      <section role="alert" aria-live="assertive">
        <ErrorMessage />
      </section>
    );

  return (
    <>
      <section className={style.gridview} role="region" aria-label="Recipes">
        {data.data.map((meal: MealPreview) => (
          <RecipeCard data={meal} key={meal.idMeal} />
        ))}
      </section>

      <section
        className={style.page_nav}
        role="region"
        aria-label="Page navigation"
      >
        <button
          onClick={() => {
            dispatch(setPageNumber(data.page - 1));
          }}
          disabled={data.page <= 1}
          className={style.prev_button}
          aria-label="previous page"
          aria-disabled={data.page <= 1}
        >
          <p> &laquo;</p>
        </button>
        <p aria-live="polite" aria-atomic="true">
          {data.page} / {data.totalPages}
        </p>
        <button
          onClick={() => {
            dispatch(setPageNumber(data.page + 1));
          }}
          disabled={data.page == data.totalPages}
          className={style.next_button}
          aria-label="next page"
          aria-disabled={data.page == data.totalPages}
        >
          <p>&raquo; </p>
        </button>
      </section>
    </>
  );
}

export default RecipeGrid;
