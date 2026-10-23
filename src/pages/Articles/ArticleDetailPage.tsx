import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { fetchArticleById, deleteArticle } from "../../api/articles";
import { useAuth } from "../../context/AuthContext";
import type { Article } from "../../types";

// TURN THE DATE FROM THE DATABASE INTO SIMPLE TEXT, LIKE "Oct 16, 2026"
function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


function ArticleDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // RUNS WHEN THE PAGE OPENS: LOADS THE ARTICLE FROM THE BACKEND
  useEffect(() => {
    if (!id) return;

    fetchArticleById(id)
      .then(setArticle)
      .catch(() => setArticle(undefined))
      .finally(() => setLoading(false));
  }, [id]);

  // RUNS WHEN WE ARRIVE FROM ANOTHER PAGE WITH A MESSAGE (EXAMPLE: "ARTICLE UPDATED"),
  // SHOWS IT AS A TOAST, THEN CLEARS IT SO IT DOES NOT SHOW AGAIN ON REFRESH
  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setToast(state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // RUNS WHEN THE USER CONFIRMS THE DELETE: DELETES THE ARTICLE,
  // THEN GOES TO THE HOME PAGE, OR SHOWS AN ERROR IF IT FAILS
  async function handleConfirmDelete() {
    if (!article) return;
    setOpenDialog(false);

    try {
      await deleteArticle(article.id);
      navigate("/", { state: { message: "Article deleted successfully" } });
    } catch {
      setToast("Could not delete the article. Please try again.");
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!article) {
    return <div className="p-8">Article not found.</div>;
  }

  // ONLY THERAPISTS AND ADMINS SEE THE EDIT AND DELETE BUTTONS
  const canManage = user?.role === "therapist" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
      <article className="mx-auto max-w-3xl">
        {/* BACK NAVIGATION */}
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <span aria-hidden="true">←</span>
          Back to articles
        </Link>

        {/* HEADER */}
        <header className="mt-8 border-b border-border pb-7">
          <p className="mb-4 text-sm font-medium text-primary">
            Knowledge & well-being
          </p>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-heading sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <span>
              By{" "}
              <span className="font-medium text-heading">{article.author}</span>
            </span>

            <span aria-hidden="true" className="text-border">
              ·
            </span>

            <time dateTime={article.createdAt}>
              {formatDate(article.createdAt)}
            </time>
          </div>
        </header>

        {/* CONTENT */}
        <div className="py-8">
          <p className="whitespace-pre-line text-base leading-8 text-heading/90 sm:text-lg sm:leading-9">
            {article.content}
          </p>
        </div>

        {/* ACTIONS */}
        {/* {canManage && (
          <footer className="mt-4 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted">Manage this article</p>

              <div className="flex items-center gap-3">
                <Link
                  to={`/articles/${article.id}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-heading transition hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => setOpenDialog(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </footer>
        )} */}
      </article>

      {/* DELETE DIALOG
      <ConfirmDialog
        open={openDialog}
        title="Delete article"
        message="Are you sure you want to delete this article?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDialog(false)}
      />

      {/* TOAST MESSAGE */}
      {/* {toast && <Toast message={toast} onClose={() => setToast(null)} />}  */}
    </div>
  );
}

export default ArticleDetailPage;