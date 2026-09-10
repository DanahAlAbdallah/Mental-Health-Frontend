import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArticleById, updateArticle } from "../api/articles";

function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchArticleById(id).then((article) => {
      if (article) {
        setTitle(article.title);
        setContent(article.content);
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    await updateArticle(id, {
      title,
      content,
      author: "Sarah Khalil",
      category: "General",
    });
    navigate(`/articles/${id}`);
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2 mb-3 h-32"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditArticlePage;
