import style from "./CategoryCard.module.css";

type CategoryInfo = {
  image: string;
  label: string;
  onClick?: () => void;
  isSelected?: boolean;
};

const CategoryCard: React.FC<CategoryInfo> = ({ image, label, onClick, isSelected }) => {

  return (
    <button
      type="button"
      className={`${style.categoryCard} ${isSelected ? style.selected : ""}`}
      onClick={onClick}
      aria-pressed={isSelected ?? false}
    >
      <img src={image} alt={"Image of " + label} />
      <p>{label}</p>
    </button>
  );
};

export default CategoryCard;