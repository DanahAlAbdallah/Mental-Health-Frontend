import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

interface RequireRoleProps {
  allowed: UserRole[];
  children: ReactNode;
}

// PROTECTS A PAGE: SHOWS IT ONLY TO LOGGED IN USERS WITH ONE OF THE ALLOWED ROLES.
// EVERYONE ELSE IS SENT AWAY (VISITORS TO LOGIN, WRONG ROLE TO THE HOME PAGE)
function RequireRole({ allowed, children }: RequireRoleProps) {
  const { user } = useAuth();
  const location = useLocation();

  // NOT LOGGED IN: GO TO LOGIN AND REMEMBER THE PAGE THEY WANTED
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // LOGGED IN BUT WITH THE WRONG ROLE: GO TO THE HOME PAGE
  if (!allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default RequireRole;
