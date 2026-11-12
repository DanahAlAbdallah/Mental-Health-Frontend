import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard";
import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import { useArticlesPage } from "../../hooks/articles/useArticlesPage";


function ArticlesPage() {

  const { articles, loading, error, searchTerm, setSearchTerm } = useArticlesPage();
  const [toast, setToast] = useState<string | null>(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setToast(state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const canAddArticle = user?.role === "therapist" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-primary">Knowledge & well-being</p>
            <h1 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
              Articles
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
              Explore thoughtful reads and practical insights to support your mental well-being.
            </p>
          </div>

          {canAddArticle && (
            <Link
              to="/dashboard/articles/new"
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
          <div className="flex flex-col items-center justify-center py-20 text-center" role="status">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="mt-4 text-sm text-muted">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center text-sm text-red-600">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-5 py-16 text-center">
            <h2 className="font-semibold text-heading">No articles found</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              {searchTerm ? "Try a different search term." : "No articles to display."}
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

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}

export default ArticlesPage;