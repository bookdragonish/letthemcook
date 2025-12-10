import { useState, useEffect, useMemo } from "react";
import style from "./SearchPage.module.css";
import RecipeGrid from "../../components/RecipeGrid/RecipeGrid";
import { useFetchSearch } from "../../hooks/useFetchSearch/useFetchSearch";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPageSearch, setSearchValue } from "../../store/filtersSlice";


function SearchPage() {
  const dispatch = useAppDispatch();
  const searchValue = useAppSelector((state) => state.filters.searchValue); // This is the value to search for when search button or enter is clicked
  const pageNumber = useAppSelector((state) => state.filters.pageSearch); // This is the value to search for when search button or enter is clicked

  const [currentInputValue, setCurrentInputValue] = useState(""); // This is updated for every keychange on the input field
  const [hasSearched, setHasSearched] = useState(false); // Make sure the initial render doesnt show "no result"

  // This lets the user go back to their search if they click out the recipe they clicked on
  useEffect(() => {
    if (searchValue) {
      setCurrentInputValue(searchValue);
      setHasSearched(true);
    }
  }, [searchValue]);

  // Uses this so that the object reference only changes when its value does,
  // Preventing unneccesary fetches due to identify differences

  const fetchArgs = useMemo(
    () =>
    {
      if (searchValue && pageNumber) return ({ type: "search", page: pageNumber, queryValue: searchValue } as const);
      else if(pageNumber) return ({ type: "search", page: pageNumber, queryValue: "" } as const);
      else return ({ type: "search", page: 1, queryValue: "" } as const);
    },
    [ pageNumber, searchValue]
  );

  const { data, isLoading, isError } = useFetchSearch(fetchArgs);

  // Function called when user clicks the search button or enter.
  function handleSearch() {
    // Can't search if input is empty or if there is no saved value
    // AI GEN: the valueToUse code was suggested by AI optimalizing our written code
    const valueToUse =
      currentInputValue.trim() === ""
        ? searchValue || ""
        : currentInputValue;

    dispatch(setSearchValue(valueToUse));
    setHasSearched(true);
    dispatch(setPageSearch(1))
  }

  // Allows searching by clicking enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main
      className={style.searchPage}
      role="main"
      aria-label="Search page"
    >
      <h1> Search </h1>

      <section
        className={style.searchContainer}
        role="search"
        aria-label="Search field for recipes"
      >
        <input
          id="searchInput"
          type="text"
          placeholder="Search by category or recipe name..."
          value={currentInputValue}
          onChange={(e) => setCurrentInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className={style.searchInput}
          aria-label="Type in search words for recipes"
        />

        <button
          onClick={handleSearch}
          aria-label="Press to search"
          className={style.searchButton}
        >
          Search
        </button>
      </section>

      {!isLoading && !hasSearched && (
        <p role="status" aria-live="assertive" className={style.feedback}>Search to see your results.</p>
      )}

      {!isLoading && hasSearched && data.data.length === 0 && (
        <p role="status" aria-live="assertive" className={style.feedback}>No results found.</p>
      )}

      {hasSearched && data.data.length > 0 && (
        <RecipeGrid
          data={data}
          isError={isError}
          isLoading={isLoading}
          setPageNumber={setPageSearch}
        />
      )}
    </main>
  );
}

export default SearchPage;
