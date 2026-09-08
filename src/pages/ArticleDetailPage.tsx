import { useParams, Link } from "react-router-dom";
import { articles } from "../data/articles";
import { useAuth } from "../context/AuthContext";

function ArticleDetailPage() {
  const { id } = useParams();
  const article = articles.find((a) => a.id === id);
  const { user } = useAuth();
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
            onClick={() => console.log("Delete article", article.id)}
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
