import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import yellowLineVideo from "../assets/yellow_line_loop.webm";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  // setLoading(true);

  try {
    await login(email, password);
    navigate("/");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong");
    // setLoading(false);
  }
}

  return (
    <main className="relative h-screen overflow-hidden bg-[#EAF2F9] flex items-center justify-center px-4">
      {/* Animated line – left */}
      <video
        src={yellowLineVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 w-[900px] max-w-none opacity-40"
      />

      {/* Animated line – right (mirrored) */}
      <video
        src={yellowLineVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none absolute -right-64 top-1/2 -translate-y-1/2 -scale-x-100 w-[900px] max-w-none opacity-40 hidden md:block"
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl px-6 py-7 sm:px-9 sm:py-8">
          {/* Logo */}
          <div className="text-center mb-5">
            <h1 className="text-xl font-semibold text-heading">EUPHORIA</h1>
          </div>
          {/* Heading */}
          <div className="text-center mb-5">
            <h2 className="text-2xl font-serif text-heading mb-1">
              Welcome back
            </h2>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-heading placeholder:text-muted outline-none transition focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-heading"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-muted cursor-pointer hover:text-primary-hover transition"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-heading placeholder:text-muted outline-none transition focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {/* Login */}
            <button
              type="submit"
              className="w-full rounded-xl cursor-pointer bg-primary hover:bg-primary-hover text-button-text font-semibold py-3 transition duration-200 hover:-translate-y-0.5 shadow-sm"
            >
              Log in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-muted">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-heading hover:bg-gray-50 transition"
          >
            Continue with Google
          </button>

          {/* Register */}
          <p className="text-center text-sm text-muted mt-5">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-heading hover:text-primary-hover transition cursor-pointer"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
