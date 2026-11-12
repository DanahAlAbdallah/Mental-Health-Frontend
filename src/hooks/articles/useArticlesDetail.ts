// src/hooks/useArticleDetail.ts
import { useState, useEffect } from "react";
import type { Article } from "../../types";
import { fetchArticleById, fetchLatestArticles } from "../../api/articles";


export function useArticleDetail(id: string | undefined) {
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Load article & related items
  useEffect(() => {
    if (!id) return;
    let active = true;

    setLoading(true);
    window.scrollTo({ top: 0 });

    Promise.all([
      fetchArticleById(id),
      fetchLatestArticles().catch(() => []), // Optional section fallback
    ])
      .then(([articleData, latestArticles]) => {
        if (!active) return;
        setArticle(articleData);
        const filteredRelated = (latestArticles as Article[])
          .filter((a) => a.id !== id)
          .slice(0, 3);
        setRelated(filteredRelated);
      })
      .catch(() => {
        if (active) setArticle(undefined);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Reading progress scroll listener
  useEffect(() => {
    function onScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0,
      );
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [article]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked handling
    }
  }

  return {
    article,
    related,
    loading,
    progress,
    copied,
    copyLink,
  };
}
