
import type { Meal } from "../../../../types/meal";
import style from "./Instructions.module.css";

function Instructions({ recipe }: { recipe: Meal }) {

    const instructionLines = recipe.strInstructions
        .split(".")
        .filter((line) => line.trim() !== "");

    return (
        <>
            <article
                className={style.instructions}
                aria-labelledby="instructions-heading">
                <h1 id="instructions-heading" className={style.instructions_header}>Instructions</h1>
                <ol>
                    {instructionLines.map((line, index) => (
                        <li key={index} tabIndex={0}>{line.trim()}</li>
                    ))}
                </ol>
            </article>
        </>
    );
}

export default Instructions;