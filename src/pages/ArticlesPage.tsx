import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchArticles } from "../api/articles";
import ArticleCard from "../components/ArticleCard";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import type { Article } from "../types";

// HOW LONG TO WAIT AFTER THE USER STOPS TYPING BEFORE SEARCHING (IN MILLISECONDS)
const SEARCH_DELAY = 400;

function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { user } = useAuth();

  // RUNS WHEN THE SEARCH TEXT CHANGES: WAITS A MOMENT, THEN LOADS THE MATCHING
  // ARTICLES, OR SHOWS AN ERROR IF IT FAILS
  useEffect(() => {
    // IF THE USER TYPES AGAIN BEFORE THE ANSWER ARRIVES, WE IGNORE THE OLD ANSWER
    let ignore = false;

    const timer = setTimeout(() => {
      setLoading(true);
      setError("");

      fetchArticles(searchTerm)
        .then((data) => {
          if (!ignore) setArticles(data);
        })
        .catch((err) => {
          if (!ignore) {
            setError(
              err instanceof Error ? err.message : "Could not load articles",
            );
          }
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, SEARCH_DELAY);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // RUNS WHEN WE ARRIVE FROM ANOTHER PAGE WITH A MESSAGE (EXAMPLE: "ARTICLE DELETED"),
  // SHOWS IT AS A TOAST, THEN CLEARS IT SO IT DOES NOT SHOW AGAIN ON REFRESH
  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setToast(state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ONLY THERAPISTS AND ADMINS SEE THE "ADD ARTICLE" BUTTON
  const canAddArticle = user?.role === "therapist" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-primary">
              Knowledge & well-being
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
              Articles
            </h1>

            <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
              Explore thoughtful reads and practical insights to support your
              mental well-being.
            </p>
          </div>

          {canAddArticle && (
            <Link
              to="/articles/new"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
            >
              <span className="text-lg leading-none">+</span>
              Add article
            </Link>
          )}
        </header>

        {/* SEARCH + ARTICLE COUNT */}
        <section className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search articles"
              className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-heading placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <p className="text-sm text-muted">Discover something meaningful</p>
        </section>

        {/* ARTICLE LIST */}
        {loading ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            role="status"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="mt-4 text-sm text-muted">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center text-sm text-red-600">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-5 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-soft text-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path d="M5 3h11l4 4v14H5z" />
                <path d="M16 3v5h4M8 12h8M8 16h8" />
              </svg>
            </div>

            <h2 className="font-semibold text-heading">No articles found</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              {searchTerm
                ? "Try a different search term to find what you're looking for."
                : "There are no articles to display right now. Please check back soon."}
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-heading transition hover:bg-surface-soft"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* TOAST MESSAGE */}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}

export default ArticlesPage;
