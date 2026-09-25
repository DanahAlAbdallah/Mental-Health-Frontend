import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import backgroundImage from "../assets/back.png";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const success = await signup(name, email, password, role);

    if (success) {
      navigate("/");
    } else {
      setError("Signup failed — email may already be in use");
      setLoading(false);
    }
  }

  return (
    <main
      className="
        h-screen
        overflow-hidden
        bg-cover
        bg-center
        bg-no-repeat
        flex
        items-center
        justify-center
        px-4
      "
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-heading/30" />

      {/* Signup card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="
            bg-white/95
            backdrop-blur-sm
            rounded-3xl
            shadow-2xl
            px-6
            py-7
            sm:px-9
            sm:py-8
          "
        >
          {/* Logo */}
          <div className="text-center mb-5">
            <h1 className="text-xl font-semibold text-heading">Bloom Again</h1>
          </div>

          {/* Heading */}
          <div className="text-center mb-5">
            <h2 className="text-2xl font-serif text-heading mb-1">
              Create your account
            </h2>
            <p className="text-sm text-text">Start your journey with us.</p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="
                mb-4
                rounded-xl
                bg-red-50
                border
                border-red-100
                px-4
                py-2.5
                text-sm
                text-red-600
              "
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
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
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  text-sm
                  text-heading
                  placeholder:text-muted
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                "
              />
            </div>

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
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  text-sm
                  text-heading
                  placeholder:text-muted
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                "
              />
            </div>

            {/* Password */}
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
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  text-sm
                  text-heading
                  placeholder:text-muted
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                "
              />
            </div>

            {/* Role */}
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
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                  text-sm
                  text-heading
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                  cursor-pointer
                "
              >
                <option value="client">Client</option>
                <option value="therapist">Therapist</option>
              </select>
            </div>

            {/* Signup */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                cursor-pointer
                bg-primary
                hover:bg-primary-hover
                text-button-text
                font-semibold
                py-3
                transition
                duration-200
                hover:-translate-y-0.5
                shadow-sm
                disabled:opacity-70
                disabled:cursor-not-allowed
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {loading ? (
                <>
                  <span
                    className="
                      w-4
                      h-4
                      border-2
                      border-button-text/30
                      border-t-button-text
                      rounded-full
                      animate-spin
                    "
                  />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-muted mt-5">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                font-semibold
                text-heading
                hover:text-primary-hover
                transition
                cursor-pointer
              "
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
