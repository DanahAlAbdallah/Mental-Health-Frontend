import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLatestArticles } from "../../api/articles";
import type { Article } from "../../types";

// THE LANDING PAGE SECTION THAT SHOWS THE 3 NEWEST ARTICLES
function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  // RUNS WHEN THE PAGE OPENS: LOADS THE LATEST ARTICLES FROM THE BACKEND.
  // IF IT FAILS WE SHOW NOTHING, BECAUSE AN ERROR BOX WOULD LOOK BAD ON THE LANDING PAGE
  useEffect(() => {
    fetchLatestArticles()
      .then(setArticles)
      .catch(() => setArticles([]));
  }, []);

  // NO ARTICLES (OR A FAILED REQUEST) MEANS THE WHOLE SECTION STAYS HIDDEN
  if (articles.length === 0) return null;

  // ARTICLES DESIGN
  return (
    <section className="bg-background-soft px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* HEADING */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-muted">
            KNOWLEDGE & WELL-BEING
          </p>
          <h2 className="text-3xl text-heading">Read something that helps</h2>
        </div>

        {/* ARTICLE CARDS */}
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="group rounded-2xl bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <span className="mb-3 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-heading">
                {article.category}
              </span>

              <h3 className="mb-2 text-lg font-semibold text-heading">
                {article.title}
              </h3>

              <p className="line-clamp-3 text-sm text-muted">
                {article.content}
              </p>

              <span className="mt-4 inline-block text-sm font-medium text-heading group-hover:underline">
                Read more →
              </span>
            </Link>
          ))}
        </div>

        {/* LINK TO ALL ARTICLES */}
        <div className="mt-10 text-center">
          <Link
            to="/articles"
            className="inline-block rounded-full bg-accent px-8 py-3 font-semibold text-white transition hover:bg-accent-hover"
          >
            See all articles →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LatestArticles;
