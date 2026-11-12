// src/hooks/useSignup.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function useSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  function validatePassword(password: string): string | null {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "Password must contain at least one letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character (e.g. ! @ # $)";
    }
    return null;
  }

  function validateForm(): Record<string, string> {
    const next: Record<string, string> = {};

    if (!name.trim()) next.name = "Name is required";

    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      next.email = "Please enter a valid email address";

    if (!role) next.role = "Please select a role";

    if (!password) next.password = "Password is required";
    else {
      const passwordError = validatePassword(password);
      if (passwordError) next.password = passwordError;
    }

    if (!confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      next.confirmPassword = "Passwords do not match";

    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      await signup(name.trim(), email.trim(), password, role);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    setRole,
    error,
    errors,
    setErrors,
    loading,
    handleSubmit,
  };
}
