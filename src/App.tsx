import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import RecipeDetailPage from "./pages/RecipeDetail";
import FavoritesPage from "./pages/Favorites";
import NavBar from "./components/NavBar";



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Vérifie l'état d'authentification dans localStorage
    const auth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(auth);
  }, []);

  return (
    <Router>
      {/* Affichage de la NavBar UNIQUEMENT si l'utilisateur est connecté */}
      {isAuthenticated && <NavBar setIsAuthenticated={setIsAuthenticated} />}

      <Routes>
        {/* Redirection vers la page login si non connecté */}
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

        {/* Si l'utilisateur est connecté, il peut accéder aux autres pages */}
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/recipe/:id" element={isAuthenticated ? <RecipeDetailPage /> : <Navigate to="/login" />} />
        <Route path="/favorites" element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/login" />} />

        {/* Redirection par défaut vers Login si aucune route ne correspond */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};




export default App;
