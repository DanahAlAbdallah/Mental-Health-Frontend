import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

interface RequireRoleProps {
  allowed: UserRole[];
  children: ReactNode;
}

function RequireRole({ allowed, children }: RequireRoleProps) {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default RequireRole;
