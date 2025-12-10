import type { Meal } from "../../../../types/meal";
import style from "./RecipeMedia.module.css"


function RecipeMedia({ recipe }: { recipe: Meal }) {

    return (
        <>
            <section
                className={style.recipe_media}
                aria-labelledby="recipe-title"
                role="region"
            >
                <h1 id="recipe-title" className={style.recipe_name}>{recipe.strMeal}</h1>
                <img
                    className={style.recipe_image}
                    src={recipe.strMealThumb}
                    alt={`image of ${recipe.strMeal}`}
                />
            </section>
        </>
    );

}

export default RecipeMedia;
