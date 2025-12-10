import RecipeGrid from "../../components/RecipeGrid/RecipeGrid";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import { useFetchMeals } from "../../hooks/useFetchMeals/useFetchMeals";
import EmblaCarousel from "../../components/EmblaCarousel/EmblaCarousel";
import allFood from "../../assets/Food.jpg";
import veganFood from "../../assets/Vegan.jpg";
import vegetarianFood from "../../assets/Vegetarian.webp";
import meatFood from "../../assets/Meat.jpg";
import chickenFood from "../../assets/Chicken.jpg";
import seaFood from "../../assets/Seafood.jpg";
import dessertFood from "../../assets/Dessert.jpg";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCategory, setOrder, setPageOverview } from "../../store/filtersSlice";

import { useEffect, useMemo, useState } from "react";
import GridInteractions from "../../components/GridInteractions/GridInteractions";
const categories = [
  { label: "All", image: allFood },
  { label: "Vegan", image: veganFood },
  { label: "Vegetarian", image: vegetarianFood },
  { label: "Beef", image: meatFood },
  { label: "Chicken", image: chickenFood },
  { label: "Seafood", image: seaFood },
  { label: "Dessert", image: dessertFood },
];

function RecipeOverview() {
  const dispatch = useAppDispatch();

  const category = useAppSelector((state) => state.filters.category);
  const order = useAppSelector((state) => state.filters.order);
  const pageNumber = useAppSelector((state) => state.filters.pageOverview);

  const [categoryChanged, setCategoryChanged] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("selectedCategory", category);
    sessionStorage.setItem("order", String(order));
  }, [category, order]);

  // Uses this so that the object reference only changes when its value does,
  // Preventing unneccesary fetches due to identify differences
  const fetchArgs = useMemo(
    () => ({
      type: "all" as const,
      order,
      category,
      page: pageNumber,
    }),
    [order, category, pageNumber]
  );

  // Fetch data when the order, category or page number is changed
  const { data, isLoading, isError } = useFetchMeals(fetchArgs);

  // Setting order ascending / descending
  const handleToggleSort = (newOrder: 1 | -1) => {
    dispatch(setOrder(newOrder));
  };

  return (
    <main>
      <EmblaCarousel />

      <h1>Recipes</h1>

      <section
        role="region"
        aria-label="Recipe categories"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        <h2
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Recipe categories
        </h2>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.label}
            image={cat.image}
            label={cat.label}
            onClick={() => {
              dispatch(setCategory(cat.label));
              setCategoryChanged(!categoryChanged);
            }}
            isSelected={category === cat.label}
            aria-label={`Filter recipes by ${cat.label} category`}
          />
        ))}
      </section>

      <GridInteractions currentOrder={order} onToggleSort={handleToggleSort} />

      <RecipeGrid
        data={data}
        resetPageOnCategoryChange={categoryChanged}
        onResetHandled={() => setCategoryChanged(false)}
        isError={isError}
        setPageNumber={setPageOverview}
        isLoading={isLoading}
      />
    </main>
  );
}

export default RecipeOverview;
