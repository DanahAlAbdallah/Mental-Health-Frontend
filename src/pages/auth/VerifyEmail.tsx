import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function handleVerification() {
      const params = new URLSearchParams(location.search);

      const token = params.get("token");
      const returnTo =
        params.get("returnTo") === "/therapists" ? "/therapists" : "/";

      if (!token) {
        setError("Verification token is missing.");
        setMessage("");
        return;
      }

      try {
        await verifyEmail(token);
        navigate(returnTo, { replace: true });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Email verification failed.",
        );
        setMessage("");
      }
    }

    handleVerification();
  }, [location.search, verifyEmail, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{message}</h1>
        {error && <p className="mt-3 text-red-500">{error}</p>}
      </div>
    </div>
  );
}