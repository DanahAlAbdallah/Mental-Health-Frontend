import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Clock,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import gsap from "gsap";

import { fetchLatestArticles } from "../../api/articles";
import type { Article } from "../../types";

// ---------- HELPERS ----------

// Calculate estimated reading time
function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ---------- MAIN COMPONENT ----------

function LatestArticles() {
  const sectionRef = useRef<HTMLElement>(null);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  // ---------- FETCH LATEST ARTICLES ----------

  useEffect(() => {
    let cancelled = false;

    async function loadArticles() {
      try {
        setLoading(true);
        setError(false);

        const data = await fetchLatestArticles();

        if (cancelled) return;

        console.log("Latest articles loaded:", data);

        // Display only the 3 newest articles
        setArticles(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load latest articles:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      cancelled = true;
    };
  }, [retry]);

  // ---------- GSAP ANIMATIONS ----------

  useEffect(() => {
    if (loading || error || articles.length === 0) return;

    const section = sectionRef.current;

    if (!section) return;

    // Respect accessibility preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      const heading = section.querySelector(".articles-heading");
      const cards = section.querySelectorAll(".article-card");

      // Heading animation
      if (heading) {
        gsap.fromTo(
          heading,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
        );
      }

      // Cards appear one after another
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
        },
      );
    }, section);

    return () => context.revert();
  }, [articles, loading, error]);

  // ---------- LOADING STATE ----------

  if (loading) {
    return (
      <section className="bg-background px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 h-3 w-24 animate-pulse rounded bg-primary/10" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-primary/10" />
            <div className="mt-4 h-4 w-full max-w-md animate-pulse rounded bg-primary/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-xl bg-surface-soft"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ---------- ERROR STATE ----------

  if (error) {
    return (
      <section className="bg-background px-6 py-20">
        <div className="mx-auto max-w-2xl py-10 text-center">
          <BookOpen className="mx-auto mb-4 h-8 w-8 text-primary" />

          <h2 className="mb-3 text-2xl font-semibold text-heading">
            Articles are temporarily unavailable
          </h2>

          <p className="mb-6 text-sm leading-7 text-muted">
            We couldn't load the latest articles. Please try again.
          </p>

          <button
            onClick={() => setRetry((previous) => previous + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </section>
    );
  }

  // ---------- EMPTY STATE ----------

  if (articles.length === 0) {
    return (
      <section className="bg-background px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <BookOpen className="mx-auto mb-4 h-8 w-8 text-primary" />

          <h2 className="mb-3 text-2xl font-semibold text-heading">
            Something meaningful is coming.
          </h2>

          <p className="text-sm leading-7 text-muted">
            We're preparing thoughtful articles for you. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  // ---------- ARTICLES SECTION ----------

  return (
    <section ref={sectionRef} className="bg-background px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* SECTION HEADING */}

        <div className="articles-heading mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Our articles
          </p>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-heading sm:text-4xl">
            A space to learn and grow.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted">
            Explore helpful insights and thoughtful perspectives on mental
            health and well-being.
          </p>
        </div>

        {/* ARTICLES GRID */}

        <div className="articles-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="article-card group flex min-h-[280px] flex-col rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {/* CATEGORY */}

              <span className="mb-5 w-fit rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                {article.category}
              </span>

              {/* TITLE */}

              <h3 className="mb-3 text-xl font-semibold leading-snug text-heading transition-colors group-hover:text-primary">
                {article.title}
              </h3>

              {/* DESCRIPTION */}

              <p className="line-clamp-3 flex-1 text-sm leading-7 text-muted">
                {article.content}
              </p>

              {/* FOOTER */}

              <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
                <span className="flex items-center gap-2 text-xs text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {readingTime(article.content)} min read
                </span>

                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read article
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* VIEW ALL ARTICLES */}

        <div className="mt-10 flex justify-center">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-heading transition-colors hover:border-primary hover:bg-primary hover:text-white"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LatestArticles;
