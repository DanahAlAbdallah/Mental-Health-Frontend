import { Link } from "react-router-dom";
import type { Article } from "../types";

interface ArticleCardProps {
  article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link to={`/articles/${article.id}`}>
      <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition">
        <span className="text-xs font-medium text-blue-600">
          {article.category}
        </span>
        <h2 className="text-lg font-semibold mt-1">{article.title}</h2>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {article.content}
        </p>
        <div className="text-xs text-gray-400 mt-3">
          By {article.author} · {article.createdAt}
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
