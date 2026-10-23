import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createArticle } from "../../api/articles";


// STYLE SHARED BY THE TITLE AND CONTENT FIELDS, SO WE WRITE IT ONLY ONCE
const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-heading placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function AddArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // RUNS WHEN THE USER CLICKS "PUBLISH ARTICLE": SENDS THE ARTICLE,
  // THEN GOES TO THE HOME PAGE, OR SHOWS THE ERROR IF IT FAILS
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setError("");
    setLoading(true);

    try {
      await createArticle({
        title,
        content,
        category: "General",
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  // ADD ARTICLE DESIGN
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <header className="mb-8 space-y-3">
          <p className="text-sm font-medium text-primary">
            Share something meaningful
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
            Add Article
          </h1>

          <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
            Create a thoughtful article to inform, inspire, and support
            someone's mental well-being.
          </p>
        </header>

        {/* ARTICLE FORM */}
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* TITLE */}
            <div className="space-y-2">
              <label
                htmlFor="article-title"
                className="block text-sm font-medium text-heading"
              >
                Article title
              </label>
              <input
                id="article-title"
                type="text"
                placeholder="Give your article a meaningful title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={fieldClass}
                required
              />
              <p className="text-xs text-muted">
                Choose a clear title that reflects your article.
              </p>
            </div>

            {/* CONTENT */}
            <div className="space-y-2">
              <label
                htmlFor="article-content"
                className="block text-sm font-medium text-heading"
              >
                Article content
              </label>
              <textarea
                id="article-content"
                placeholder="Start writing your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className={`${fieldClass} resize-y leading-7`}
                required
              />
              <p className="text-xs text-muted">
                Write with care, clarity, and empathy.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted">
                Your words may make a difference in someone's day.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                </svg>
                {loading ? "Publishing..." : "Publish article"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddArticlePage;
