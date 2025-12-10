import RecipeOverview from "./pages/RecipeOverview/RecipeOverview";
import { Outlet, Route, Routes } from "react-router-dom";
import SingleRecipe from "./pages/SingleRecipe/SingleRecipe.tsx";
import { useParams } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.tsx";
import SearchPage from "./pages/SearchPage/SearchPage";
import Footer from "./components/Footer/Footer.tsx";

function RouteWrapper() {
  const { id } = useParams<{ id: string }>(); // Retrieves id from URL and sends it as prop to SingleMovie
  return <SingleRecipe recipeId={id as string} />;
}

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  //Set session storage for remembering previous name
  if (!sessionStorage.getItem("anonymosName")) {
    sessionStorage.setItem("anonymosName", "");
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RecipeOverview />} />
        <Route path="recipe/:id" element={<RouteWrapper />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="search/recipe/:id" element={<RouteWrapper />} />
      </Route>
    </Routes>
  );
}

export default App;
