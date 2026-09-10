import type { Article } from "../types";

const BASE_URL = "http://localhost:3001/api/articles";

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(BASE_URL);
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

export async function createArticle(
  data: Omit<Article, "id" | "createdAt">,
): Promise<Article> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update article");
  return res.json();
}

export async function deleteArticle(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete article");
}
