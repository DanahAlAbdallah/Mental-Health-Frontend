import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ClientRoute() {
  const { user } = useAuth();

  console.log("role in guard:", user?.role);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "client") return <Navigate to="/" replace />;

  return <Outlet />;
}

export default ClientRoute;
