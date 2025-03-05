import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecipeById, fetchRecipeTips, RecipeDetail } from "../api/tastyApi";

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;

    const getRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedRecipe = await fetchRecipeById(id);
        if (fetchedRecipe) {
          setRecipe(fetchedRecipe);
          checkIfFavorite(fetchedRecipe.id);

          // Charger les conseils
          const fetchedTips = await fetchRecipeTips(Number(id));
          setTips(fetchedTips);
        } else {
          setError("Recipe not found.");
        }
      } catch (err) {
        setError("Failed to fetch recipe details.");
      } finally {
        setLoading(false);
      }
    };

    getRecipeDetails();
  }, [id]);

  const checkIfFavorite = (recipeId: number) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: RecipeDetail) => fav.id === recipeId));
  };

  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      favorites = favorites.filter((fav: RecipeDetail) => fav.id !== recipe?.id);
    } else {
      favorites.push(recipe);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!recipe) return <p className="text-center">No recipe found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Bouton Retour */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
      >
        ← Back
      </button>

      {/* Titre et image */}
      <h1 className="text-3xl font-bold text-center mb-4">{recipe.name}</h1>
      <img
        src={recipe.thumbnail_url}
        alt={recipe.name}
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />

      {/* Bouton Favori */}
      <div className="flex justify-center my-4">
        <button
          className={`px-6 py-2 text-white font-semibold rounded-lg shadow-md transition ${
            isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={toggleFavorite}
        >
          {isFavorite ? "Remove from Favorites ❤️" : "Add to Favorites 💙"}
        </button>
      </div>

      {/* Ingrédients */}
      <h3 className="text-2xl font-semibold mt-6">Ingredients:</h3>
      <ul className="bg-gray-100 p-4 rounded-md shadow-md mt-2">
        {recipe.sections?.map((section, index) => (
          <li key={index} className="mb-1">
            {section.components.map((component, i) => (
              <span key={i} className="block text-gray-700">
                {component.raw_text}
              </span>
            ))}
          </li>
        ))}
      </ul>

      {/* Instructions */}
      <h3 className="text-2xl font-semibold mt-6">Instructions:</h3>
      <ol className="bg-gray-100 p-4 rounded-md shadow-md mt-2 list-decimal pl-6">
        {recipe.instructions.map((step, index) => (
          <li key={index} className="mb-2 text-gray-700">{step.display_text}</li>
        ))}
      </ol>

      {/* Conseils des utilisateurs */}
      <h3 className="text-2xl font-semibold mt-6">User Tips:</h3>
      {tips.length > 0 ? (
        <ul className="bg-yellow-100 p-4 rounded-md shadow-md mt-2">
          {tips.map((tip, index) => (
            <li key={index} className="p-2 bg-white rounded-md shadow-sm my-1">
              {tip}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2">No tips available for this recipe.</p>
      )}
    </div>
  );
};

export default RecipeDetailPage;
