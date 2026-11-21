import { useState, useEffect } from "react";
import type { Article } from "../../types";
import { fetchArticles } from "../../api/articles";

const SEARCH_DELAY = 400;

export function useArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset pagination when searching
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    let ignore = false;

    const timer = setTimeout(() => {
      setLoading(true);
      setError("");

      fetchArticles(searchTerm, currentPage)
        .then((data) => {
          console.log("API response:", data);
          if (!ignore) {
            setArticles(data.articles);
            setTotalPages(data.totalPages);
          }
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
  }, [searchTerm, currentPage]);

  return {
    articles,
    loading,
    error,
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage,
    totalPages,
    setCurrentPage,
  };
}
