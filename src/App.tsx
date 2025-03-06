import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; // Tools for routing and navigation
import { useState, useEffect } from "react"; // Tools to manage state and run code when the app starts
import LoginPage from "./pages/Login"; // Login page component
import HomePage from "./pages/Home"; // Home page component
import RecipeDetailPage from "./pages/RecipeDetail"; // Recipe detail page component
import FavoritesPage from "./pages/Favorites"; // Favorites page component
import NavBar from "./components/NavBar"; // Navigation bar component

// Main App component
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Tracks if user is logged in

  // Check login status when the app starts
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true"; // Get login status from browser storage
    setIsAuthenticated(auth); // Set the login state
  }, []); // Runs only once when app loads

  // App structure with routing
  return (
    <Router> {/* Sets up routing for the app */}
      {/* Show NavBar only if user is logged in */}
      {isAuthenticated && <NavBar setIsAuthenticated={setIsAuthenticated} />}

      <Routes> {/* Defines all the pages the user can visit */}
        {/* Login page - anyone can see this */}
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />

        {/* Home page - only for logged-in users, otherwise go to login */}
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />

        {/* Recipe detail page - only for logged-in users, otherwise go to login */}
        <Route path="/recipe/:id" element={isAuthenticated ? <RecipeDetailPage /> : <Navigate to="/login" />} />

        {/* Favorites page - only for logged-in users, otherwise go to login */}
        <Route path="/favorites" element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/login" />} />

        {/* Any other URL - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;