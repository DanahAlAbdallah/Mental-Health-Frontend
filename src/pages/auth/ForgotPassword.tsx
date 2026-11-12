import { Link } from "react-router-dom";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";

export default function ForgotPassword() {
  const { email, setEmail, submitted, loading, error, handleSubmit } =
    useForgotPassword();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f7fc] px-4 text-[#33363a]">
      {/* Subtle warm sunshine accent glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-[#f7e6a1]/35 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-[#dce7ef]">
        {/* Header with sunshine yellow accent icon badge */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7e6a1]/40 border border-[#f7e6a1] text-[#202124]">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4v-1m18-11l-5.743-5.743A6 6 0 0011 3v4"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#202124]">
            Forgot password?
          </h2>
          <p className="mt-2 text-sm text-[#707780]">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-sm leading-relaxed">
              <span className="font-semibold block mb-1">Check your inbox</span>
              If that email exists in our system, we have sent a password reset
              link.
            </div>
            <Link
              to="/login"
              className="block w-full text-center rounded-xl bg-[#f0f7fc] py-2.5 text-sm font-medium text-[#202124] hover:bg-[#dce7ef] transition"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#707780] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#dce7ef] px-4 py-2.5 text-[#202124] placeholder-[#707780]/60 focus:border-[#5ea6e1] focus:ring-1 focus:ring-[#5ea6e1] focus:outline-none transition text-sm shadow-sm"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#5ea6e1] py-2.5 text-sm cursor-pointer font-semibold text-white shadow-md shadow-[#5ea6e1]/20 hover:bg-[#86b8e0] active:scale-[0.99] transition disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-[#202124]"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending instructions...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        {!submitted && (
          <div className="mt-6 text-center text-sm">
            <Link
              to="/login"
              className="text-[#707780] hover:text-[#5ea6e1] transition font-medium inline-flex items-center gap-1.5"
            >
              ← Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
