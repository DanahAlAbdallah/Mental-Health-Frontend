import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArticleById, updateArticle } from "../api/articles";

function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchArticleById(id).then((article) => {
      if (article) {
        setTitle(article.title);
        setContent(article.content);
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    await updateArticle(id, {
      title,
      content,
      author: "Sarah Khalil",
      category: "General",
    });
    navigate(`/articles/${id}`, {
      state: { message: "Article updated successfully" },
    });
  }

  if (loading) return <div className="p-8">Loading...</div>;


return (
  <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-2xl">
      {/* Header */}
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8"
      >
        {/* Title */}
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
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-heading outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Content */}
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
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-7 text-heading outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-heading transition hover:bg-surface-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
);


}

export default EditArticlePage;
