import { useState } from "react"; //  useState to manage input data
import { useNavigate } from "react-router-dom"; //  useNavigate to move to other pages

// LoginPage component that takes a function to set authentication status
const LoginPage = ({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) => {
  // State variables to manage data
  const [username, setUsername] = useState(""); // Stores the username typed
  const [password, setPassword] = useState(""); // Stores the password typed
  const [error, setError] = useState(""); // Stores error message if login fails
  const navigate = useNavigate(); // Helps move to another page after login

  // Function to handle login when button is clicked
  const handleLogin = () => {
    const correctUsername = "admin"; // The user username to login
    const correctPassword = "123"; // The user password to login

    // Check if username and password match
    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem("isAuthenticated", "true"); // Save login status in browser
      setIsAuthenticated(true); // Tell the app the user is logged in
      navigate("/"); // Go to the home page
    } else {
      setError("Invalid username or password"); // Show error if login fails
    }
  };

  // the login page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-500 to-blue-700">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 transition-all duration-300 hover:shadow-blue-400/30">
        {/* Title and description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Tasty App</h1>
          <p className="text-gray-500 mt-2">Sign in to discover delicious recipes</p>
        </div>
        
        {/* Error message if login fails */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Username and password inputs */}
        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              placeholder="admin" // Hint for the user
              value={username} // Shows current username
              onChange={(e) => setUsername(e.target.value)} // Updates username when typing
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password" // Hides the password
              placeholder="********" // Hint for the user
              value={password} // Shows current password (hidden)
              onChange={(e) => setPassword(e.target.value)} // Updates password when typing
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          
          {/* Sign in button */}
          <button 
            onClick={handleLogin} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;