import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyArticles, deleteArticle } from "../../api/articles";
import type { Article } from "../../types";

function MyArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchMyArticles()
      .then((data) => {
        if (active) setArticles(data);
      })
      .catch(() => {
        if (active) setError("We couldn't load your articles.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this article? This can't be undone.")) return;

    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError("We couldn't delete the article. Please try again.");
    }
  }

  if (loading) return <p className="text-muted">Loading your articles...</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-heading">My articles</h1>
        <Link
          to="/dashboard/articles/new"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-button-text hover:bg-primary-hover"
        >
          New article
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="mb-3 text-muted">
            You haven't written any articles yet.
          </p>
          <Link
            to="/dashboard/articles/new"
            className="font-medium text-primary"
          >
            Write your first article
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {articles.map((article) => (
            <li
              key={article.id}
              className="flex items-center justify-between gap-4 rounded-xl border p-4"
            >
              <div className="min-w-0">
                <h2 className="truncate font-medium text-heading">
                  {article.title}
                </h2>
                <p className="text-sm text-muted">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex shrink-0 gap-3 text-sm">
                <Link
                  to={`/articles/${article.id}`}
                  className="font-medium text-heading hover:text-primary"
                >
                  View
                </Link>
                <Link
                  to={`/dashboard/articles/${article.id}/edit`}
                  className="font-medium text-primary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="cursor-pointer font-medium text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyArticles;
