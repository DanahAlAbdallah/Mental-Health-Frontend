import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchArticleById, deleteArticle } from "../api/articles";
import type { Article } from "../types";

function ArticleDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchArticleById(id).then((data) => {
      setArticle(data);
      setLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    if (!article) return;
    await deleteArticle(article.id);
    navigate("/");
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!article) {
    return <div className="p-8">Article not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link to="/" className="text-blue-600 text-sm">
        ← Back to articles
      </Link>
      <h1 className="text-2xl font-bold mt-4">{article.title}</h1>
      <div className="text-sm text-gray-400 mt-1">
        By {article.author} · {article.createdAt}
      </div>
      <p className="text-gray-700 mt-4">{article.content}</p>

      {(user?.role === "therapist" || user?.role === "admin") && (
        <div className="mt-6 flex gap-3">
          <Link
            to={`/articles/${article.id}/edit`}
            className="bg-gray-200 px-3 py-1 rounded text-sm"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ArticleDetailPage;