import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import yellowLineVideo from "../assets/yellow_line_loop.webm";

// STYLE SHARED BY ALL TEXT FIELDS, SO WE WRITE IT ONLY ONCE
const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-heading placeholder:text-muted outline-none transition focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10";

function SignupPage() {
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
  // RUNS WHEN THE USER CLICKS "CREATE ACCOUNT": SENDS THE DATA,
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
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF2F9] flex items-center justify-center px-4 py-8">
      <video
        src={yellowLineVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 w-[900px] max-w-none opacity-40"
      />

      <video
        src={yellowLineVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute -right-64 top-1/2 -translate-y-1/2 -scale-x-100 w-[900px] max-w-none opacity-40 hidden md:block"
      />

      {/* SIGNUP CARD */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl px-6 py-7 sm:px-9 sm:py-8">
          {/* LOGO + HEADING */}
          <div className="text-center mb-5">
            <h1 className="text-xl font-semibold text-heading">EUPHORIA</h1>
            <h2 className="text-2xl font-serif text-heading mt-2">
              Create your account
            </h2>
            <p className="text-sm text-text">Start your journey with us.</p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* GENERAL / SERVER ERROR */}
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {/* FULL NAME */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-heading mb-1.5"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="Your name"
                aria-invalid={!!errors.name}
                className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-heading mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-heading mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="Create a password"
                aria-invalid={!!errors.password}
                className={`${inputClass} ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password ? (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              ) : (
                <p className="mt-1.5 text-xs text-muted">
                  At least 8 characters, with letters, numbers, and a special
                  character.
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-heading mb-1.5"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                placeholder="Re-enter your password"
                aria-invalid={!!errors.confirmPassword}
                className={`${inputClass} ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* ROLE */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-heading mb-1.5"
              >
                I am a
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setErrors((prev) => ({ ...prev, role: "" }));
                }}
                aria-invalid={!!errors.role}
                className={`${inputClass} cursor-pointer ${errors.role ? "border-red-500" : ""}`}
              >
                <option value="client">Client</option>
                <option value="therapist">Therapist</option>
              </select>
              {errors.role && (
                <p className="mt-1.5 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl cursor-pointer bg-primary hover:bg-primary-hover text-button-text font-semibold py-3 transition duration-200 hover:-translate-y-0.5 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-button-text/30 border-t-button-text rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-muted mt-5">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-heading hover:text-primary-hover transition cursor-pointer"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
