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
    <nav className="flex items-center justify-between px-10 py-5 bg-[#FBF3E4]">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-3xl">🌻</span>
        <div>
          <p className="font-semibold text-[#2F4B42] text-lg leading-tight">
            Bloom Again
          </p>
          <p className="text-xs text-[#6B7A72]">Your mind matters</p>
        </div>
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <Link to="/articles" className="text-[#2F4B42] text-sm font-medium">
            Articles
          </Link>
          <Link to="/therapists" className="text-[#2F4B42] text-sm font-medium">
            Therapists
          </Link>
          {user.role === "therapist" && (
            <Link to="/availability" className="text-sm font-medium">
              My Availability
            </Link>
          )}
          <span className="text-sm text-[#6B7A72]">
            {user.name} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-200 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/articles" className="text-[#2F4B42] text-sm font-medium">
            Articles
          </Link>
          <Link
            to="/login"
            className="text-sm bg-amber-400 text-[#3D2B0F] font-semibold px-4 py-2 rounded-full"
          >
            Login
          </Link>
          <Link to="/signup" className="text-sm bg-gray-200 px-3 py-1 rounded">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
