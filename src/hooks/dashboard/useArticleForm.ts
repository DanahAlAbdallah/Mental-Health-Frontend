// src/hooks/dashboard/useArticleForm.ts
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createArticle,
  fetchArticleById,
  updateArticle,
} from "../../api/articles";

export function useArticleForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load article data when editing
  useEffect(() => {
    if (!id) return;
    let active = true;

    fetchArticleById(id)
      .then((article) => {
        if (!active) return;
        if (!article) {
          setError("Article not found.");
          return;
        }
        setTitle(article.title);
        setContent(article.content);
        setCategory(article.category);
      })
      .catch(() => {
        if (active) setError("We couldn't load this article.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required");
    if (!category.trim()) return setError("Category is required");
    if (!content.trim()) return setError("Content is required");

    const data = {
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
    };

    setSaving(true);
    try {
      if (id) await updateArticle(id, data);
      else await createArticle(data);
      navigate("/dashboard/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate("/dashboard/articles");
  }

  return {
    isEditing,
    title,
    setTitle,
    content,
    setContent,
    category,
    setCategory,
    loading,
    saving,
    error,
    handleSubmit,
    handleCancel,
  };
}