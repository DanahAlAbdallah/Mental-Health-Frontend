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
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // RUNS WHEN THE USER CLICKS "CREATE ACCOUNT": SENDS THE DATA,
  // THEN GOES TO THE HOME PAGE, OR SHOWS THE ERROR IF IT FAILS
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(name, email, password, role);
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className={inputClass}
              />
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={inputClass}
              />
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className={inputClass}
              />
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
                onChange={(e) => setRole(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="client">Client</option>
                <option value="therapist">Therapist</option>
              </select>
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
