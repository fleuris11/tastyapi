import { useState, useEffect } from "react"; // Import tools to manage data and run code when page loads
import { RecipeDetail } from "../api/tastyApi"; // Import type for recipe details
import { Link, useNavigate } from "react-router-dom"; // Import tools for linking and navigation

// Main component for the favorites page
const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<RecipeDetail[]>([]); // Stores favorite recipes
  const [loading, setLoading] = useState(true); // Shows if data is loading
  const navigate = useNavigate(); // Helps move to other pages

  // Load favorites when the page opens
  useEffect(() => {
    setLoading(true); // Start loading
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]"); // Get favorites from browser storage
    setFavorites(storedFavorites); // Save favorites to state
    setLoading(false); // Stop loading
  }, []); // Runs only once when page loads

  // Remove a recipe from favorites
  const removeFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((recipe) => recipe.id !== id); // Keep only recipes that don’t match the id
    setFavorites(updatedFavorites); // Update the favorites list
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save updated list to browser storage
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Main UI for the favorites page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto">
        {/* Title and back button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">My Favorite Recipes</h1>
          <button
            onClick={() => navigate('/')} // Go back to home page
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-300 transform hover:-translate-y-1"
          >
            Back to home
          </button>
        </div>

        {/* If no favorites */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <div className="text-gray-400 text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">No favorite recipes</h2>
            <p className="text-gray-500 mb-6">You haven't added any recipes to your favorites yet.</p>
            <button
              onClick={() => navigate('/')} // Go to home page to find recipes
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
            >
              Discover recipes
            </button>
          </div>
        ) : (
          // If there are favorites, show them in a grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                {/* Recipe image */}
                <div className="relative">
                  <Link to={`/recipe/${recipe.id}`}> {/* Link to recipe detail page */}
                    <img 
                      src={recipe.thumbnail_url || 'https://via.placeholder.com/300x200?text=Image+unavailable'} // Show image or placeholder
                      alt={recipe.name} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+unavailable'; // Replace with placeholder if image fails
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white p-4 font-medium">View recipe</p>
                    </div>
                  </Link>
                </div>
                {/* Recipe name and remove button */}
                <div className="p-4">
                  <Link to={`/recipe/${recipe.id}`}>
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 mb-2">{recipe.name}</h2>
                  </Link>
                  <button
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => removeFavorite(recipe.id)} // Remove this recipe from favorites
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {/* Trash icon */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;