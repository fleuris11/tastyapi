import { useEffect, useState } from "react";
import { fetchRecipes } from "../api/tastyApi"; //  function to get recipes from API
import { Link } from "react-router-dom"; //  Link for navigation

// Define what a recipe looks like
interface Recipe {
  id: number;
  name: string;
  thumbnail_url: string;
}

// Main component for the home page
const Home = () => {
  // State variables to manage data
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Stores the list of recipes
  const [search, setSearch] = useState(""); // Stores the search text
  const [loading, setLoading] = useState(true); // Shows if data is loading

  // Load recipes when the page opens
  useEffect(() => {
    setLoading(true); // Start loading
    fetchRecipes() // Get recipes from API - since tastyapi
      .then(setRecipes) // Save recipes to state
      .finally(() => setLoading(false)); // Stop loading when done
  }, []); 

  // Search for recipes when button is clicked
  const handleSearch = async () => {
    setLoading(true); // Start loading
    if (search.trim() === "") { // If search is empty
      fetchRecipes() // Get all recipes
        .then(setRecipes) // Save them
        .finally(() => setLoading(false)); // Stop loading
    } else { // If search has text
      fetchRecipes(search) // Get recipes matching search
        .then(setRecipes) // Save them
        .finally(() => setLoading(false)); // Stop loading
    }
  };

  // Trigger search when Enter key is pressed
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { // Check if Enter key is pressed
      handleSearch(); 
    }
  };

  // UI for the home page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Title and description */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-blue-700">🍽️ Delicious Recipes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover hundreds of tasty recipes for everyday cooking</p>
        </div>

        {/* Search bar */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-10 max-w-2xl mx-auto">
          <div className="relative w-full">
            {/* Magnifying glass icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            {/* Input field for search */}
            <input
              type="text"
              value={search} // Shows current search text
              onChange={(e) => setSearch(e.target.value)} // Updates search text when typing
              onKeyPress={handleKeyPress} // Runs search on Enter key
              placeholder="Search for recipes..."
              className="pl-10 w-full border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          {/* Search button */}
          <button
            onClick={handleSearch} // Runs search when clicked
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 focus:outline-none flex items-center justify-center"
          >
            <span>Search</span>
          </button>
        </div>

        {/* Recipe list */}
        {loading ? ( // If loading is true
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div> {/* Show spinner */}
          </div>
        ) : ( // If loading is false
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.length > 0 ? ( // If there are recipes
              recipes.map((recipe) => (
                <Link
                  to={`/recipe/${recipe.id}`} // Link to recipe detail page
                  key={recipe.id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col h-full"
                >
                  <div className="relative">
                    {/* Recipe image */}
                    <img
                      src={recipe.thumbnail_url || 'https://via.placeholder.com/300x200?text=Image+unavailable'} // Show image or placeholder
                      alt={recipe.name}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+unavailable'; // Replace with placeholder if image fails
                      }}
                    />
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white p-4 font-medium">View recipe</p>
                    </div>
                  </div>
                  {/* Recipe name */}
                  <div className="p-4 flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {recipe.name}
                    </h2>
                  </div>
                </Link>
              ))
            ) : ( // If no recipes found
              <div className="text-center text-gray-600 text-lg col-span-full p-10">
                <p className="text-2xl mb-2">😔</p>
                <p>No recipes found</p>
                {/* Reset search button */}
                <button 
                  onClick={() => {
                    setSearch(""); // Clear search
                    handleSearch(); // Load all recipes
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Reset search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;