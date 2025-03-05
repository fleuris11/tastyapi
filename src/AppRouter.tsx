import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import RecipeDetailPage from "./pages/RecipeDetail";
import FavoritesPage from "./pages/Favorites";
import NavBar from "./components/NavBar";

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Vérifie si l'utilisateur est connecté en regardant le localStorage
    const auth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(auth);
  }, []);

  return (
    <Router>
      {/* Affichage de la NavBar UNIQUEMENT si l'utilisateur est connecté */}
      {isAuthenticated && <NavBar setIsAuthenticated={setIsAuthenticated} />}

      <Routes>
        {/* Page de connexion */}
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protection des routes : accès uniquement si connecté */}
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/recipe/:id" element={isAuthenticated ? <RecipeDetailPage /> : <Navigate to="/login" />} />
        <Route path="/favorites" element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/login" />} />

        {/* Redirection par défaut vers login si la route n'existe pas */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
