// src/hooks/useLogin.ts
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.role === "therapist") {
        navigate("/dashboard", { replace: true });
      } else {
        const returnTo =
          location.state?.from === "/therapists" ? "/therapists" : "/";

        navigate(returnTo, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  };
}
