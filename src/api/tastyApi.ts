// API constants for making requests
const API_HOST = "tasty.p.rapidapi.com"; // The host for the Tasty API
const API_KEY = "3b7ab277d1msh6c1c4093a71472fp1e2c61jsn0977c5eef65d"; //please sir, put your api key here
const API_URL = `https://${API_HOST}`; // Base URL for API calls

// Type for a basic recipe
export interface Recipe {
  id: number;
  name: string;
  thumbnail_url: string;
}

// Type for detailed recipe info
export interface RecipeDetail {
  id: number;
  name: string;
  description?: string; // Optional description
  instructions: { display_text: string }[]; // List of steps
  sections: { components: { raw_text: string }[] }[]; // List of ingredients
  thumbnail_url: string; 
}

// Function to get a list of recipes with an optional search term
export const fetchRecipes = async (query: string = ""): Promise<Recipe[]> => {
  try {
    // Make a request to the API to get recipes
    const response = await fetch(
      `${API_URL}/recipes/list?from=0&size=20&tags=under_30_minutes&q=${query}`, // URL with search term
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY, // API key for access
          "X-RapidAPI-Host": API_HOST, // API host
        },
      }
    );

    // Check if the request failed
    if (!response.ok) {
      throw new Error("Failed to fetch recipes"); // Throw error if something goes wrong
    }

    const data = await response.json(); // Convert response to JSON
    return data.results || []; // Return recipes or empty array if no results
  } catch (error) {
    console.error("Error fetching recipes:", error); // Show error in console
    return []; // Return empty array if there’s an error
  }
};

// Function to get details of one recipe by its ID
export const fetchRecipeById = async (id: string): Promise<RecipeDetail | null> => {
  try {
    // Make a request to the API to get recipe details
    const response = await fetch(`${API_URL}/recipes/get-more-info?id=${id}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY, 
        "X-RapidAPI-Host": API_HOST,
      },
    });

    // Check if the request failed
    if (!response.ok) {
      throw new Error("Failed to fetch recipe details"); // Throw error if something goes wrong
    }

    const data: RecipeDetail = await response.json(); // Convert response to JSON
    return data; // Return the recipe details
  } catch (error) {
    console.error("Error fetching recipe details:", error); // Show error in console
    return null; // Return null if there’s an error
  }
};

// Function to get tips for a recipe by its ID
// Note: I didn’t use this in RecipeDetail.tsx because I couldn’t get it to work there
export const fetchRecipeTips = async (id: number): Promise<string[]> => {
  try {
    // Make a request to the API to get recipe tips
    const response = await fetch(
      `${API_URL}/tips/list?from=0&size=30&id=${id}`, // URL with recipe ID
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY, // API key for access
          "X-RapidAPI-Host": API_HOST, // API host
        },
      }
    );

    // Check if the request failed
    if (!response.ok) {
      throw new Error("Failed to fetch recipe tips"); // Throw error if something goes wrong
    }

    const data = await response.json(); // Convert response to JSON
    console.log("API Tips Response:", data); // Debug: show response in console

    // Check if results is an array
    if (!Array.isArray(data.results)) {
      console.error("Unexpected API response:", data); // Show error if response is wrong
      return []; // Return empty array if no tips
    }

    return data.results.map((tip: { text: string }) => tip.text); // Return list of tip texts
  } catch (error) {
    console.error("Error fetching recipe tips:", error); // Show error in console
    return []; // Return empty array if there’s an error
  }
};