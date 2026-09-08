import { useState, useEffect } from "react";
import { fetchArticles } from "../api/articles";
import ArticleCard from "../components/ArticleCard";
import type { Article } from "../types";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    fetchArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8">Loading articles...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Articles</h1>
      <div className="flex justify-between items-center mb-6">
        {(user?.role === "therapist" || user?.role === "admin") && (
          <Link
            to="/articles/new"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Article
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default ArticlesPage;
