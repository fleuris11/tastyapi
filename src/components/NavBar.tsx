import { Link, useNavigate, useLocation } from "react-router-dom";

const NavBar = ({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-white text-gray-800 shadow-lg p-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-700 mb-4 sm:mb-0">
            <Link to="/" className="flex items-center hover:text-blue-800 transition-all">
              <span className="mr-2">🍽️</span>
              <span>Tasty App</span>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="flex gap-8 mb-4 sm:mb-0">
            <Link 
              to="/" 
              className={`flex items-center transition-all hover:text-blue-600 ${
                isActive('/') ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}
            >
              <span className="mr-2">🏠</span>
              <span>Home</span>
            </Link>
            <Link 
              to="/favorites" 
              className={`flex items-center transition-all hover:text-blue-600 ${
                isActive('/favorites') ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}
            >
              <span className="mr-2">❤️</span>
              <span>Favorites</span>
            </Link>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center"
          >
            <span className="mr-2">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
