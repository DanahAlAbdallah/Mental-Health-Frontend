import { Link } from "react-router-dom";
import type { Article } from "../types";

interface ArticleCardProps {
  article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link to={`/articles/${article.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-background p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <span className="inline-block text-xs font-medium text-primary-hover bg-background px-2.5 py-1 rounded-full">
          {article.category}
        </span>
        <h2
          style={{ fontFamily: "'Lora', serif" }}
          className="text-lg text-heading mt-3"
        >
          {article.title}
        </h2>
        <p className="text-text text-sm mt-2 line-clamp-2">{article.content}</p>
        <div className="text-xs text-muted mt-4 pt-3 border-t border-background">
          By {article.author} · {article.createdAt}
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
