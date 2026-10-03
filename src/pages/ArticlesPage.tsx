import { useState, useEffect } from "react";
import { fetchArticles } from "../api/articles";
import ArticleCard from "../components/ArticleCard";
import type { Article } from "../types";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetchArticles(searchTerm).then((data) => {
        setArticles(data);
        setLoading(false);
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setToast(state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 text-sm w-full max-w-sm mb-6"
      />

      {loading ? (
        <div className="text-gray-500">Loading articles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default ArticlesPage;
