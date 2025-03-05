import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link to="/" className="hover:text-yellow-400 transition">🍽️ TastyRecipes</Link>
      </div>

      {/* Liens de navigation */}
      <div className="flex gap-6">
        <Link to="/" className="hover:text-yellow-400 transition">🏠 Home</Link>
        <Link to="/favorites" className="hover:text-yellow-400 transition">❤️ Favorites</Link>
      </div>

      {/* Bouton Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
      >
        🚪 Logout
      </button>
    </nav>
  );
};

export default NavBar;
