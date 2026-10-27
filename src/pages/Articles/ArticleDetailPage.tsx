import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Link2,
} from "lucide-react";
import { fetchArticleById, fetchLatestArticles } from "../../api/articles";
import type { Article } from "../../types";

// ---------- HELPERS ----------

// TURN THE DATE FROM THE DATABASE INTO SIMPLE TEXT, LIKE "Oct 16, 2026"
function formatDate(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ABOUT 200 WORDS PER MINUTE
function readingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// SPLIT THE TEXT INTO PARAGRAPHS AT EVERY BLANK LINE
function toParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function Avatar({ name, size = "h-10 w-10" }: { name: string; size?: string }) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-button-text`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

// ---------- PAGE ----------

function ArticleDetailPage() {
  const { id } = useParams();

  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // LOAD THE ARTICLE WHEN THE PAGE OPENS OR THE ID CHANGES
  useEffect(() => {
    if (!id) return;
    let active = true;

    setLoading(true);
    window.scrollTo({ top: 0 });

    fetchArticleById(id)
      .then((data) => {
        if (active) setArticle(data);
      })
      .catch(() => {
        if (active) setArticle(undefined);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // LOAD OTHER ARTICLES FOR THE "KEEP READING" SECTION
  useEffect(() => {
    let active = true;

    fetchLatestArticles()
      .then((data) => {
        if (active) setRelated(data.filter((a) => a.id !== id).slice(0, 3));
      })
      .catch(() => {
        // THIS SECTION IS OPTIONAL, SO A FAILURE IS IGNORED
      });

    return () => {
      active = false;
    };
  }, [id]);

  // READING PROGRESS BAR AT THE TOP OF THE SCREEN
  useEffect(() => {
    function onScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0,
      );
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [article]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // CLIPBOARD CAN BE BLOCKED (FOR EXAMPLE ON HTTP), SO IT FAILS QUIETLY
    }
  }

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-black/5" />
          <div className="h-6 w-24 rounded-full bg-black/5" />
          <div className="h-12 w-full rounded-xl bg-black/5" />
          <div className="h-12 w-2/3 rounded-xl bg-black/5" />
          <div className="space-y-3 pt-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 rounded bg-black/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- NOT FOUND ----------
  if (!article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-semibold text-heading">
          Article not found
        </h1>
        <p className="max-w-sm text-sm text-muted">
          This article may have been removed, or the link is incorrect.
        </p>
        <Link
          to="/articles"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-button-text hover:bg-primary-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>
      </div>
    );
  }

  const paragraphs = toParagraphs(article.content);

  return (
    <div className="min-h-screen bg-background">
      {/* READING PROGRESS */}
      <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-transparent">
        <div
          className="h-full bg-primary transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* TOP BAND */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent px-4 pb-2 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>

          {/* HEADER */}
          <header className="mt-8">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              {article.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-heading sm:text-5xl sm:leading-[1.15]">
              {article.title}
            </h1>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={article.author} />
                <div>
                  <p className="text-sm font-semibold text-heading">
                    {article.author}
                  </p>
                  <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <time dateTime={article.createdAt}>
                        {formatDate(article.createdAt)}
                      </time>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {readingTime(article.content)} min read
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyLink}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-heading transition hover:border-primary hover:text-primary"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Link copied
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </button>
            </div>
          </header>
        </div>
      </div>

      {/* CONTENT */}
      <article className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl border-t border-border py-10">
          <div className="space-y-6 text-base leading-8 text-heading/90 sm:text-lg sm:leading-9">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`whitespace-pre-line ${
                  index === 0
                    ? "text-lg font-medium text-heading sm:text-xl"
                    : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* AUTHOR CARD */}
          <div className="mt-12 flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <Avatar name={article.author} size="h-14 w-14" />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Written by
              </p>
              <p className="text-lg font-semibold text-heading">
                {article.author}
              </p>
            </div>
            <Link
              to="/therapists"
              className="ml-auto hidden shrink-0 text-sm font-medium text-primary hover:underline sm:block"
            >
              View therapists
            </Link>
          </div>

          {/* CALL TO ACTION */}
          <section className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-hover p-7 text-button-text shadow-md sm:p-9">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
            <div className="relative">
              <h2 className="text-xl font-bold sm:text-2xl">
                Ready to talk to someone?
              </h2>
              <p className="mt-2 max-w-md text-sm opacity-90 sm:text-base">
                Browse our therapists, pick a time that suits you, and book a
                session in a few clicks.
              </p>
              <Link
                to="/therapists"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
              >
                Find a therapist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </article>

      {/* KEEP READING */}
      {related.length > 0 && (
        <section className="border-t border-border bg-background-soft px-4 py-12 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-heading">
                Keep reading
              </h2>
              <Link
                to="/articles"
                className="text-sm font-medium text-primary hover:underline"
              >
                All articles
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/articles/${item.id}`}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="mb-3 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {item.category}
                  </span>
                  <h3 className="font-semibold leading-snug text-heading group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-auto pt-4 text-xs text-muted">
                    {item.author} · {formatDate(item.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ArticleDetailPage;
