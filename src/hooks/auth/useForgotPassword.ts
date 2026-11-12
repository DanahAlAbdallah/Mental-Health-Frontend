// src/hooks/useForgotPassword.ts
import { useState } from "react";
import { requestPasswordReset } from "../../api/auth";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    submitted,
    loading,
    error,
    handleSubmit,
  };
}