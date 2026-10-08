import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLatestArticles } from "../../api/articles";
import type { Article } from "../../types";


const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchLatestArticles();
        setArticles(data);
      } catch (error) {
        console.error("Failed to load latest articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <section className="bg-[#FBF3E4] px-6 py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-600">
              From our therapists
            </p>

            <h2 className="text-3xl font-bold text-[#2F4B42] sm:text-4xl">
              A little something to read
            </h2>

            <p className="mt-4 leading-7 text-[#6B7A72]">
              Discover helpful thoughts, insights, and guidance from our
              therapists.
            </p>
          </div>

          <Link
            to="/articles"
            className="w-fit font-semibold text-[#2F4B42] transition hover:text-amber-600"
          >
            Browse all articles →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <p className="text-[#6B7A72]">Loading articles...</p>
          </div>
        )}

        {/* Articles */}
        {!loading && articles.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col rounded-3xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Category */}
                <span className="mb-4 w-fit rounded-full bg-[#EEF1EA] px-3 py-1 text-xs font-semibold text-[#2F4B42]">
                  {article.category}
                </span>

                {/* Title */}
                <h3 className="line-clamp-2 text-xl font-semibold text-[#2F4B42]">
                  {article.title}
                </h3>

                {/* Content Preview */}
                <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-[#6B7A72]">
                  {article.content}
                </p>

                {/* Footer */}
                <div className="mt-6 border-t border-[#E5E7E2] pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#2F4B42]">
                        {article.author}
                      </p>

                      <p className="mt-1 text-xs text-[#6B7A72]">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Link
                      to={`/articles/${article.id}`}
                      className="shrink-0 text-sm font-semibold text-[#2F4B42] transition hover:text-amber-600"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No Articles */}
        {!loading && articles.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-[#6B7A72]">
              No articles available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;

