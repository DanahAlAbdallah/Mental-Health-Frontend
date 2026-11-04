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
  <div className="mx-auto max-w-3xl">
    {/* Header Section */}
    <div className="mb-8 border-b border-gray-100 pb-5 dark:border-gray-800">
      <span className="text-xs font-bold uppercase tracking-wider text-primary">
        {isEditing ? "Management" : "Content Creation"}
      </span>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-heading">
        {isEditing ? "Edit Article" : "Create New Article"}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {isEditing
          ? "Update your published article details and content."
          : "Draft and publish a new article for your clients and readers."}
      </p>
    </div>

    {/* Form Container */}
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-sm text-red-700 backdrop-blur-sm dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
          <svg className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Inputs Group */}
      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
        {/* Title & Category Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Article Title */}
          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-heading"
            >
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 Mindful Strategies for Overcoming Daily Anxiety"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-heading transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-heading"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Anxiety, Sleep"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-heading transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-primary"
            />
          </div>
        </div>

        {/* Article Body Content */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="content"
              className="block text-xs font-semibold uppercase tracking-wider text-heading"
            >
              Content Body <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-400">
              {content.length > 0 ? `${content.split(/\s+/).filter(Boolean).length} words` : "Supports standard formatting"}
            </span>
          </div>
          <textarea
            id="content"
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article thoughts and detailed insights here..."
            className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-heading transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-primary"
          />
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/articles")}
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && (
            <svg
              className="h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Publish Article"}
        </button>
      </div>
    </form>
  </div>
);
}

export default ArticleForm;
