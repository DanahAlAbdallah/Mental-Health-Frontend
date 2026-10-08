import type { Article } from "../types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/articles`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchArticles(search?: string): Promise<Article[]> {
  const url = search
    ? `${BASE_URL}?search=${encodeURIComponent(search)}`
    : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function fetchArticleById(
  id: string,
): Promise<Article | undefined> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
}

export async function fetchLatestArticles(): Promise<Article[]> {
  const res = await fetch(`${BASE_URL}/latest`);

  if (!res.ok) {
    throw new Error("Failed to fetch latest articles");
  }

  return res.json();
}

export async function createArticle(
  data: Omit<Article, "id" | "createdAt">,
): Promise<Article> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create article");
  return res.json();
}

export async function updateArticle(
  id: string,
  data: Omit<Article, "id" | "createdAt">,
): Promise<Article> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update article");
  return res.json();
}

export async function deleteArticle(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete article");
}
