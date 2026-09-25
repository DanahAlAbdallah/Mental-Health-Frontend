import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-white border-b p-4 flex justify-between items-center">
      <Link to="/" className="font-bold">
        Mental health
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-200 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="text-sm bg-gray-200 px-3 py-1 rounded"
            >
              SignUp
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
