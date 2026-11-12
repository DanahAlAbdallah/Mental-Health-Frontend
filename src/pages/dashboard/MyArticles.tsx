import { Link } from "react-router-dom";
import {
  Clock,
  Eye,
  FileText,
  Pencil,
  PenLine,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { useMyArticles } from "../../hooks/dashboard/useMyArticles";
import { excerpt, readingTime, formatDate } from "../../utils/articleHelpers";
import {
  Stat,
  IconAction,
  ArticlesSkeleton,
} from "../../components/articlesDashboard/ArticleComponents";

function MyArticles() {
  const {
    articles,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    deletingId,
    handleDelete,
  } = useMyArticles();

  if (loading) return <ArticlesSkeleton />;

  // ---------- DERIVED DATA ----------
  const categories = [
    "All",
    ...Array.from(new Set(articles.map((a) => a.category))).sort(),
  ];

  const query = search.trim().toLowerCase();
  const visible = articles.filter((a) => {
    const matchesCategory = category === "All" || a.category === category;
    const matchesSearch =
      !query ||
      a.title.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const latest = articles[0]
    ? formatDate(articles[0].createdAt)
    : "No articles yet";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">My articles</h1>
          <p className="mt-1 text-sm text-muted">
            Write, edit, and manage the articles clients read on your profile.
          </p>
        </div>
        <Link
          to="/dashboard/articles/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          New article
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={FileText} label="Articles" value={articles.length} />
        <Stat
          icon={FileText}
          label="Categories"
          value={categories.length - 1}
        />
        <Stat icon={PenLine} label="Latest article" value={latest} />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {articles.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PenLine className="h-7 w-7" />
          </span>
          <h2 className="text-lg font-semibold text-heading">
            Share your first article
          </h2>
          <p className="max-w-sm text-sm text-muted">
            Articles help clients get to know your approach before they book a
            session.
          </p>
          <Link
            to="/dashboard/articles/new"
            className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-button-text hover:bg-primary-hover"
          >
            Write an article
          </Link>
        </div>
      ) : (
        <>
          {/* SEARCH AND CATEGORY FILTER */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your articles"
                aria-label="Search your articles"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-11 pr-4 text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {categories.length > 2 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      category === c
                        ? "border-primary bg-primary text-button-text"
                        : "border-border bg-background text-heading hover:border-primary hover:text-primary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LIST */}
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted">
              No articles match your search.
            </div>
          ) : (
            <ul className="space-y-4">
              {visible.map((article) => (
                <li
                  key={article.id}
                  className={`group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    deletingId === article.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {article.category}
                        </span>
                        <span className="text-xs text-muted">
                          {formatDate(article.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted">
                          <Clock className="h-3 w-3" />
                          {readingTime(article.content)} min read
                        </span>
                      </div>

                      <h2 className="text-lg font-semibold text-heading">
                        {article.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        {excerpt(article.content)}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <IconAction
                        to={`/articles/${article.id}`}
                        label="View article"
                      >
                        <Eye className="h-4 w-4" />
                      </IconAction>
                      <IconAction
                        to={`/dashboard/articles/${article.id}/edit`}
                        label="Edit article"
                      >
                        <Pencil className="h-4 w-4" />
                      </IconAction>
                      <IconAction
                        onClick={() => handleDelete(article)}
                        disabled={deletingId === article.id}
                        label="Delete article"
                        danger
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconAction>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default MyArticles;
