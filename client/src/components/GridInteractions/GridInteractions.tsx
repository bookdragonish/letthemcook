import { FaDice } from "react-icons/fa";
import style from "./GridInteractions.module.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface SortButtonProps {
  currentOrder: 1 | -1;
  onToggleSort: (newOrder: 1 | -1) => void;
}

function GridInteractions({ onToggleSort, currentOrder }: SortButtonProps) {
  // Logic for sorting button
  const label = currentOrder === 1 ? "Title A-Z ↑" : "Title Z-A ↓";

  const isAscending = currentOrder === 1;

  // Logic for randomizer
  const navigate = useNavigate();

  const category = useAppSelector((s) => s.filters.category) || "All";

  async function handleClick() {
    navigate(`/recipe/${category}`);
  }

  return (
    <section
      className={style.button_container}
      role="region"
      aria-label="Sorting order recipes and get random"
      aria-live="polite"
    >
      <button
        className={style.random_button}
        onClick={handleClick}
        aria-label="Random recipe"
        title="Want a random recipe?"
      >
        Random
        <FaDice className={style.icon} />
        <span className={style.label}></span>
      </button>

      <button
        className={style.sort_button}
        onClick={() => {
          onToggleSort(currentOrder === 1 ? -1 : 1);
        }}
        aria-label={
          isAscending
            ? "Sorted ascending. Click to sort descending."
            : "Sorted descending. Click to sort ascending."
        }
        aria-pressed={!isAscending}
      >
        {label}
      </button>
    </section>
  );
}
export default GridInteractions;
