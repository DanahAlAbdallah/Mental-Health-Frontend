import { useState, useEffect } from "react";
import type { Article } from "../../types";
import { fetchArticles } from "../../api/articles";


const SEARCH_DELAY = 400;

export function useArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let ignore = false;

    const timer = setTimeout(() => {
      setLoading(true);
      setError("");

      fetchArticles(searchTerm)
        .then((data) => {
          if (!ignore) setArticles(data);
        })
        .catch((err) => {
          if (!ignore) {
            setError(
              err instanceof Error ? err.message : "Could not load articles",
            );
          }
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, SEARCH_DELAY);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchTerm]);

  return {
    articles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  };
}
