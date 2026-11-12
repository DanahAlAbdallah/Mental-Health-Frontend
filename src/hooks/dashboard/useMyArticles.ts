// src/hooks/dashboard/useMyArticles.ts
import { useState, useEffect } from "react";
import { fetchMyArticles, deleteArticle } from "../../api/articles";
import type { Article } from "../../types";

export function useMyArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchMyArticles()
      .then((data) => {
        if (active) setArticles(data);
      })
      .catch(() => {
        if (active) setError("We couldn't load your articles.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(article: Article) {
    if (!window.confirm(`Delete "${article.title}"? This can't be undone.`)) {
      return;
    }

    setError("");
    setDeletingId(article.id);
    try {
      await deleteArticle(article.id);
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
    } catch {
      setError("We couldn't delete the article. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return {
    articles,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    deletingId,
    handleDelete,
  };
}
