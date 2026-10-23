import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TherapistRoute() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "therapist") return <Navigate to="/" replace />;

  return <Outlet />;
}

export default TherapistRoute;
