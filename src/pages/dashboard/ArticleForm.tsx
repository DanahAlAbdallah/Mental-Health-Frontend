import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createArticle,
  fetchArticleById,
  updateArticle,
} from "../../api/articles";

function ArticleForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");

  // LOAD THE ARTICLE WHEN EDITING
  useEffect(() => {
    if (!id) return;
    let active = true;

    fetchArticleById(id)
      .then((article) => {
        if (!active) return;
        if (!article) {
          setError("Article not found.");
          return;
        }
        setTitle(article.title);
        setContent(article.content);
        setCategory(article.category);
      })
      .catch(() => {
        if (active) setError("We couldn't load this article.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required");
    if (!category.trim()) return setError("Category is required");
    if (!content.trim()) return setError("Content is required");

    const data = {
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
    };

    setSaving(true);
    try {
      if (id) await updateArticle(id, data);
      else await createArticle(data);
      navigate("/dashboard/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-heading">
        {isEditing ? "Edit article" : "New article"}
      </h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-heading"
          >
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border px-4 py-2.5"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-heading"
          >
            Category
          </label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Anxiety, Sleep"
            className="w-full rounded-xl border px-4 py-2.5"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-1.5 block text-sm font-medium text-heading"
          >
            Content
          </label>
          <textarea
            id="content"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border px-4 py-2.5"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-button-text disabled:opacity-70"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/articles")}
            className="rounded-xl border px-5 py-2.5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;
