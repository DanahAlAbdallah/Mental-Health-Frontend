import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import type { Article } from "../types";

interface ArticleCardProps {
  article: Article;
}

// ONE ARTICLE AS A CARD (CATEGORY, TITLE, SHORT PREVIEW, AUTHOR AND DATE)
// THAT OPENS THE FULL ARTICLE WHEN CLICKED
function ArticleCard({ article }: ArticleCardProps) {
  // ARTICLE CARD DESIGN
  return (
    <Link
      to={`/articles/${article.id}`}
      className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <div className="rounded-2xl border border-background bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <span className="inline-block rounded-full bg-background px-2.5 py-1 text-xs font-medium text-primary-hover">
          {article.category}
        </span>

        <h2 className="mt-3 text-lg text-heading">{article.title}</h2>

        <p className="mt-2 line-clamp-2 text-sm text-text">{article.content}</p>

        <div className="mt-4 border-t border-background pt-3 text-xs text-muted">
          By {article.author} · {formatDate(article.createdAt)}
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
