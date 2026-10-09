import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createArticle } from "../api/articles";

function AddArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // inside the component:
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    await createArticle({
      title,
      content,
      author: user.name,
      category: "General",
    });
    navigate("/");
  }


return (
  <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-5xl">

      {/* Header */}
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

      {/* Article form */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
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
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-heading placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />

            <p className="text-xs text-muted">
              Choose a clear title that reflects your article.
            </p>
          </div>

          {/* Content */}
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
              className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-7 text-heading placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />

            <p className="text-xs text-muted">
              Write with care, clarity, and empathy.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-muted">
              Your words may make a difference in someone's day.
            </p>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
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

              Publish article
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
);


}

export default AddArticlePage;
