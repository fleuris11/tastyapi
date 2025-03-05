
const API_HOST = "tasty.p.rapidapi.com";
const API_KEY = "3b7ab277d1msh6c1c4093a71472fp1e2c61jsn0977c5eef65d"; // Remplace par ta clé
const API_URL = `https://${API_HOST}`;

// Type pour une recette basique
export interface Recipe {
  id: number;
  name: string;
  thumbnail_url: string;
}

// Type pour les détails d'une recette
export interface RecipeDetail {
  id: number;
  name: string;
  description?: string;
  instructions: { display_text: string }[];
  sections: { components: { raw_text: string }[] }[];
  thumbnail_url: string;
}

// Fonction pour récupérer une liste de recettes avec un terme de recherche
export const fetchRecipes = async (query: string = ""): Promise<Recipe[]> => {
  try {
    const response = await fetch(
      `${API_URL}/recipes/list?from=0&size=20&tags=under_30_minutes&q=${query}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

// Fonction pour récupérer les détails d'une recette par ID
export const fetchRecipeById = async (id: string): Promise<RecipeDetail | null> => {
  try {
    const response = await fetch(`${API_URL}/recipes/get-more-info?id=${id}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe details");
    }

    const data: RecipeDetail = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return null;
  }
};

// Fonction pour récupérer les conseils d'une recette par ID
export const fetchRecipeTips = async (id: number): Promise<string[]> => {
  try {
    const response = await fetch(
      `${API_URL}/tips/list?id=${id}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipe tips");
    }

    const data = await response.json();
    console.log("API Tips Response:", data); // <-- Vérifier ce qui est retourné

    return data.results ? data.results.map((tip: { text: string }) => tip.text) : [];
  } catch (error) {
    console.error("Error fetching recipe tips:", error);
    return [];
  }
};



