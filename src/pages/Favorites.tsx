import { useState, useEffect } from "react";
import { RecipeDetail } from "../api/tastyApi";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<RecipeDetail[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((recipe) => recipe.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Favorite Recipes</h1>

      {favorites.length === 0 ? (
        <p>No favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favorites.map((recipe) => (
            <div key={recipe.id} className="border p-4 rounded-lg">
              <Link to={`/recipe/${recipe.id}`}>
                <h2 className="text-lg font-bold">{recipe.name}</h2>
                <img src={recipe.thumbnail_url} alt={recipe.name} className="w-full h-32 object-cover rounded my-2" />
              </Link>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => removeFavorite(recipe.id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
