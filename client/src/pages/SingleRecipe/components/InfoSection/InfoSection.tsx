import type { Meal } from "../../../../types/meal";
import Ingredients from "../Ingredients/Ingredients";
import Instructions from "../Instructions/Instructions";
import style from "./InfoSection.module.css";

function InfoSection({ recipe }: { recipe: Meal }) {
  return (
    <>
      <section
        className={style.info_section}
        role="region"
        aria-labelledby="recipe-details-heading"
      >
        {/* Screen reader header, not visible to user */}
        <h2 id="recipe-details-heading" className={style.sr_only_header}>
          Recipe details
        </h2>
        <Ingredients recipe={recipe} />

        <Instructions recipe={recipe} />
      </section>
    </>
  );
}

export default InfoSection;
