import style from "./Ingredients.module.css";
import type { Meal } from "../../../../types/meal";

function Ingredients({ recipe }: { recipe: Meal }) {
    return (
        <>
            <article
                className={style.ingredients}
                aria-labelledby="ingredients-heading"
                role="region"
            >
                <h1 id="ingredients-heading" className={style.ingredients_header}>Ingredients</h1>
                <table
                    className={style.ingredients_table}
                    aria-describedby="ingredients-heading">

                    <thead className={style.sr_only_header}>
                        <tr>
                            <th scope="col">Ingredient</th>
                            <th scope="col">Measurement</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recipe.ingredients.map((ingredient, index) => (
                            <tr key={index}>
                                <td className={style.ingredient_cell}>{ingredient}</td>
                                <td className={style.measure_cell}>
                                    {recipe.measures[index] || ""}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </article>
        </>
    );
}

export default Ingredients;