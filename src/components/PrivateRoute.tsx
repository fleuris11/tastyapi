import { Navigate, Outlet } from "react-router-dom"; // Tools for navigation and rendering child routes
import { useAuth } from "../context/AuthContext"; // Custom hook to get authentication status

// Component to protect routes
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth(); // Get login status from AuthContext

  // Check if user is logged in
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  // If logged in, show the protected page; if not, go to login
};

export default PrivateRoute;