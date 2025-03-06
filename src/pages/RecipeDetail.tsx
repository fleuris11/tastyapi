import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecipeById, RecipeDetail } from "../api/tastyApi";

// API constants for making requests
const API_HOST = "tasty.p.rapidapi.com";
const API_KEY = "3b7ab277d1msh6c1c4093a71472fp1e2c61jsn0977c5eef65d";
const API_URL = `https://${API_HOST}`;

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'tips'>('ingredients');

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

          // Load tips
          // Note: I tried using fetchRecipeTips here, but I couldn’t get the data to load properly,
          // so I decided to do the API call and get tips directly in RecipeDetail.tsx
          try {
            const response = await fetch(
              `${API_URL}/tips/list?from=0&size=30&id=${id}`,
              {
                method: "GET",
                headers: {
                  "X-RapidAPI-Key": API_KEY,
                  "X-RapidAPI-Host": API_HOST,
                },
              }
            );
            const data = await response.json();// Convert response to JSON
            console.log("Tips response:", data); // Debug: show tips in console
            setTips(data.results ? data.results.map((tip: { tip_body: string }) => tip.tip_body) : []);
          } catch (tipError) {
            console.error("Error fetching tips:", tipError);
            setTips([]); // Set empty array if there’s an error
          }
        } else {
          setError("Recipe not found.");
        }
      } catch (err) {
        setError("Unable to load recipe details.");
      } finally {
        setLoading(false);// Stop loading
      }
    };

    getRecipeDetails();
  }, [id]);// Runs when ID changes

  const checkIfFavorite = (recipeId: number) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: RecipeDetail) => fav.id === recipeId));
  };

// Add or remove recipe from favorites
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
// Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }
  // Show error 
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-6xl text-center mb-4">😕</div>
          <h2 className="text-2xl font-bold text-center mb-4">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }
  //Show "not found"
  if (!recipe) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-gray-500 text-6xl text-center mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-center mb-4">Recipe not found</h2>
          <p className="text-gray-600 text-center">We couldn't find this recipe.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }
// Main UI with recipe details
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header with image and title */}
        <div className="relative">
          <img
            src={recipe.thumbnail_url || 'https://via.placeholder.com/800x400?text=Image+unavailable'}
            alt={recipe.name}
            className="w-full h-72 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+unavailable';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="p-6 w-full">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{recipe.name}</h1>
            </div>
          </div>
          
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-all duration-200 ${
              isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-white/90 hover:bg-white'
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFavorite ? 'text-white' : 'text-gray-700'}`} fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === 'ingredients' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === 'instructions' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Instructions
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === 'tips' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tips
          </button>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {/* Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Ingredients:</h3>
              <ul className="space-y-3">
                {recipe.sections?.map((section, index) => (
                  <li key={index} className="pl-0">
                    <ul className="space-y-2">
                      {section.components.map((component, i) => (
                        <li key={i} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          <span className="text-gray-800">{component.raw_text}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Instructions */}
          {activeTab === 'instructions' && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Instructions:</h3>
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold">
                        {index + 1}
                      </span>
                      <p className="text-gray-700">{step.display_text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          {/* Tips */}
          {activeTab === 'tips' && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">User Tips:</h3>
              {tips.length > 0 ? (
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex">
                        <span className="text-yellow-500 mr-3">💡</span>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-2xl mb-2">🤔</p>
                  <p>No tips available for this recipe</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;