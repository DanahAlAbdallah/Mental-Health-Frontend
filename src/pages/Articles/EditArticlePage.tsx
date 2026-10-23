import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArticleById, updateArticle } from "../../api/articles";
import { useAuth } from "../../context/AuthContext";


// STYLE SHARED BY THE TITLE, CATEGORY AND CONTENT FIELDS, SO WE WRITE IT ONLY ONCE
const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20";

function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [author, setAuthor] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // RUNS WHEN THE PAGE OPENS: LOADS THE ARTICLE AND FILLS THE FORM WITH IT
  useEffect(() => {
    if (!id) return;

    fetchArticleById(id)
      .then((article) => {
        if (article) {
          setTitle(article.title);
          setContent(article.content);
          setCategory(article.category);
          setAuthor(article.author);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // RUNS WHEN THE USER CLICKS "SAVE CHANGES": SENDS THE UPDATED ARTICLE,
  // THEN GOES BACK TO THE ARTICLE PAGE, OR SHOWS THE ERROR IF IT FAILS
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError("");

    try {
      await updateArticle(id, {
        title,
        content,
        category,
      });

      navigate(`/articles/${id}`, {
        state: { message: "Article updated successfully" },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;

  // NO AUTHOR MEANS THE ARTICLE WAS NOT FOUND (OR FAILED TO LOAD)
  if (!author) {
    return <div className="p-8 text-heading">Article not found.</div>;
  }

  // Only the original author can edit (remove this if admins/others can too)
  if (user && user.name !== author) {
    return (
      <div className="p-8 text-heading">
        You can only edit your own articles.
      </div>
    );
  }

  // EDIT ARTICLE DESIGN
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-primary">
            Knowledge & well-being
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-heading">
            Edit Article
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Update your article and save your changes when you're ready.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8"
        >
          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* TITLE */}
          <div>
            <label
              htmlFor="article-title"
              className="mb-2 block text-sm font-medium text-heading"
            >
              Article title
            </label>
            <input
              id="article-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your article title"
              required
              className={fieldClass}
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label
              htmlFor="article-category"
              className="mb-2 block text-sm font-medium text-heading"
            >
              Category
            </label>
            <select
              id="article-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${fieldClass} cursor-pointer`}
            >
              <option value="General">General</option>
              <option value="Anxiety">Anxiety</option>
              <option value="Depression">Depression</option>
              <option value="Self-care">Self-care</option>
              <option value="Relationships">Relationships</option>
            </select>
          </div>

          {/* CONTENT */}
          <div>
            <label
              htmlFor="article-content"
              className="mb-2 block text-sm font-medium text-heading"
            >
              Article content
            </label>
            <textarea
              id="article-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article here..."
              required
              rows={10}
              className={`${fieldClass} resize-y leading-7`}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-heading transition hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditArticlePage;
