import { useEffect, useState } from "react";
import { fetchRecipes } from "../api/tastyApi";
import { Link } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  thumbnail_url: string;
}

const Home = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);

  const handleSearch = async () => {
    if (search.trim() === "") {
      fetchRecipes().then(setRecipes);
    } else {
      const results = await fetchRecipes(search);
      setRecipes(results);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🍽️ Delicious Recipes</h1>

      {/* Barre de recherche */}
      <div className="flex justify-center gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          className="border p-3 rounded-lg w-full max-w-md shadow-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          🔍 Search
        </button>
      </div>

      {/* Liste des recettes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Link
              to={`/recipe/${recipe.id}`}
              key={recipe.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition hover:shadow-xl hover:scale-105"
            >
              <img
                src={recipe.thumbnail_url}
                alt={recipe.name}
                className="w-full h-56 object-cover"
              />
              <h2 className="text-lg font-semibold text-center py-3 px-2 text-gray-800">
                {recipe.name}
              </h2>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-500 text-lg col-span-full">
            No recipes found 😔
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
