import type { Article } from "../types";
import { apiRequest, ApiError } from "./apiRequest";

// GET ALL ARTICLES WITH SEARCH
export async function fetchArticles(search?: string): Promise<Article[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<Article[]>(`/articles${query}`);
}

// GET SPECIFIC ARTICLE BY ID
export async function fetchArticleById(
  id: string,
): Promise<Article | undefined> {
  try {
    return await apiRequest<Article>(`/articles/${id}`);
  } catch (error) {
    // a missing article is not a crash, the page shows "not found"
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

// GET LATEST 3 ARTICLES (FOR SHOWING IN LANDING PAGE)
export async function fetchLatestArticles(): Promise<Article[]> {
  return apiRequest<Article[]>("/articles/latest");
}

// CREATE NEW ARTICLE
export async function createArticle(
  data: Omit<Article, "id" | "createdAt">,
): Promise<Article> {
  return apiRequest<Article>("/articles", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

// UPDATE EXISTING ARTICLE
export async function updateArticle(
  id: string,
  data: Omit<Article, "id" | "createdAt">,
): Promise<Article> {
  return apiRequest<Article>(`/articles/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(data),
  });
}

// DELETE EXISTING ARTICLE
export async function deleteArticle(id: string): Promise<void> {
  return apiRequest<void>(`/articles/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
