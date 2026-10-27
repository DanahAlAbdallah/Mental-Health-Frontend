import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Eye, PenLine, Type } from "lucide-react";
import {
  createArticle,
  fetchArticleById,
  updateArticle,
} from "../../api/articles";

// ---------- CONSTANTS AND HELPERS ----------

const DEFAULT_CATEGORIES = [
  "General",
  "Anxiety",
  "Depression",
  "Sleep",
  "Self-care",
  "Relationships",
];

const fieldClass =
  "w-full rounded-xl border bg-background px-4 py-3 text-heading outline-none transition placeholder:text-muted/70 focus:ring-2 focus:ring-primary/20";

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// ABOUT 200 WORDS PER MINUTE
function readingTime(text: string): number {
  return Math.max(1, Math.round(wordCount(text) / 200));
}

// SPLIT THE TEXT INTO PARAGRAPHS AT EVERY BLANK LINE (SAME AS THE ARTICLE PAGE)
function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

type Tab = "write" | "preview";

// ---------- PAGE ----------

function ArticleForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [tab, setTab] = useState<Tab>("write");

  const [loading, setLoading] = useState(isEditing);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // LOAD THE ARTICLE WHEN EDITING
  useEffect(() => {
    if (!id) return;
    let active = true;

    fetchArticleById(id)
      .then((article) => {
        if (!active) return;
        if (!article) {
          setLoadFailed(true);
          return;
        }
        setTitle(article.title);
        setContent(article.content);
        setCategory(article.category);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // KEEP AN OLD CATEGORY VISIBLE EVEN IF IT IS NOT IN THE DEFAULT LIST
  const categories = DEFAULT_CATEGORIES.includes(category)
    ? DEFAULT_CATEGORIES
    : [...DEFAULT_CATEGORIES, category];

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Please add a title";
    if (!category.trim()) next.category = "Please choose a category";
    if (!content.trim()) next.content = "Please write the article content";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setTab("write");
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: title.trim(),
        category: category.trim(),
        content: content.trim(),
      };
      if (id) await updateArticle(id, data);
      else await createArticle(data);
      navigate("/dashboard/articles");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setSaving(false);
    }
  }

  // ---------- LOADING AND NOT FOUND ----------
  if (loading) {
    return (
      <div className="max-w-3xl animate-pulse space-y-5">
        <div className="h-8 w-48 rounded-xl bg-black/5" />
        <div className="h-96 rounded-2xl bg-black/5" />
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
        <h1 className="text-lg font-semibold text-heading">
          We couldn't open this article
        </h1>
        <p className="text-sm text-muted">
          It may have been deleted, or it isn't one of your articles.
        </p>
        <Link
          to="/dashboard/articles"
          className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-button-text hover:bg-primary-hover"
        >
          Back to my articles
        </Link>
      </div>
    );
  }

  const words = wordCount(content);
  const paragraphs = toParagraphs(content);

  return (
    <div className="max-w-3xl">
      {/* HEADER */}
      <Link
        to="/dashboard/articles"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        My articles
      </Link>

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-heading">
          {isEditing ? "Edit article" : "New article"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {isEditing
            ? "Update your article and save when you're ready."
            : "Share your knowledge with clients. Your name is added automatically."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7"
      >
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* TITLE */}
        <div className="mb-6">
          <label
            htmlFor="article-title"
            className="mb-2 block text-sm font-medium text-heading"
          >
            Title
          </label>
          <input
            id="article-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setFieldErrors((prev) => ({ ...prev, title: "" }));
            }}
            placeholder="A clear, welcoming title"
            aria-invalid={Boolean(fieldErrors.title)}
            className={`${fieldClass} text-lg font-semibold ${
              fieldErrors.title ? "border-red-500" : "border-border"
            }`}
          />
          {fieldErrors.title && (
            <p className="mt-1.5 text-sm text-red-600">{fieldErrors.title}</p>
          )}
        </div>

        {/* CATEGORY */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-heading">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setFieldErrors((prev) => ({ ...prev, category: "" }));
                }}
                aria-pressed={category === c}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  category === c
                    ? "border-primary bg-primary text-button-text"
                    : "border-border bg-background text-heading hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {fieldErrors.category && (
            <p className="mt-1.5 text-sm text-red-600">
              {fieldErrors.category}
            </p>
          )}
        </div>

        {/* CONTENT: WRITE / PREVIEW */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="article-content"
              className="text-sm font-medium text-heading"
            >
              Content
            </label>

            <div className="flex gap-1 rounded-full bg-background-soft p-1">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  tab === "write"
                    ? "bg-surface text-primary shadow-sm"
                    : "text-muted hover:text-heading"
                }`}
              >
                <PenLine className="h-3.5 w-3.5" />
                Write
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  tab === "preview"
                    ? "bg-surface text-primary shadow-sm"
                    : "text-muted hover:text-heading"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
            </div>
          </div>

          {tab === "write" ? (
            <>
              <textarea
                id="article-content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, content: "" }));
                }}
                placeholder="Write your article here. Leave a blank line between paragraphs."
                rows={14}
                aria-invalid={Boolean(fieldErrors.content)}
                className={`${fieldClass} resize-y leading-7 ${
                  fieldErrors.content ? "border-red-500" : "border-border"
                }`}
              />
              {fieldErrors.content && (
                <p className="mt-1.5 text-sm text-red-600">
                  {fieldErrors.content}
                </p>
              )}
              <p className="mt-2 text-xs text-muted">
                Tip: leave a blank line between paragraphs so they appear
                separated on the article page.
              </p>
            </>
          ) : (
            <div className="min-h-[20rem] rounded-xl border border-border bg-background p-5 sm:p-6">
              {title.trim() || paragraphs.length > 0 ? (
                <>
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {category}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold leading-tight text-heading">
                    {title.trim() || "Untitled article"}
                  </h2>
                  <div className="mt-5 space-y-4 leading-7 text-heading/90">
                    {paragraphs.map((p, i) => (
                      <p
                        key={i}
                        className={`whitespace-pre-line ${
                          i === 0 ? "font-medium text-heading" : ""
                        }`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted">
                  Nothing to preview yet. Write something in the Write tab.
                </p>
              )}
            </div>
          )}

          {/* COUNTERS */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5" />
              {words} {words === 1 ? "word" : "words"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {words === 0 ? "0" : readingTime(content)} min read
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard/articles")}
            className="cursor-pointer rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-heading transition hover:bg-background-soft"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-button-text shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Publish article"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;
