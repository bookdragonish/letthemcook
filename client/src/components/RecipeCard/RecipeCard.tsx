import { Link } from "react-router-dom";
import style from "./RecipeCard.module.css";
import type { MealPreview } from "../../types/meal";

type RecipeCardProps = {
  data: MealPreview;
};

/**
 * This returns cards with information of recipes
 * @param data object of single meal
 * @returns grid view of recipe
 */
function RecipeCard(data: RecipeCardProps) {

  const recipe = data.data;

  //handling too long names
  let recipeTitle = recipe.strMeal
  if (recipe.strMeal.length > 25) {
    recipeTitle = recipe.strMeal.substring(0, 25) + "...";
  }

  return (
    <Link
      to={`recipe/${recipe.idMeal}`}
      className={style.link}
      aria-label={`View recipe details for ${recipe.strMeal}`}
    >

      <article
        className={style.recipe_card}
        role="article"
        aria-labelledby={`recipe-title-${recipe.idMeal}`}
      >
        <div className={style.image_container}>
          <img src={recipe.strMealThumb ?? ""} loading="lazy" alt={`image of ${recipe.strMeal}`} />
        </div>
        <h3 className={style.category}>{recipe.strCategory}</h3>
        <h4 id={`recipe-title-${recipe.idMeal}`} className={style.title}>{recipeTitle}</h4>
      </article>
    </Link>
  );
}

export default RecipeCard;
