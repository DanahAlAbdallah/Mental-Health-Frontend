import type { Article } from "../types";
import { apiRequest, ApiError } from "./apiRequest";

export interface ArticlesResponse {
  articles: Article[];
  currentPage: number;
  totalArticles: number;
  totalPages: number;
}

// GET ALL ARTICLES WITH PAGING
export async function fetchArticles(
  search?: string,
  page = 1,
  limit = 10,
): Promise<ArticlesResponse> {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  return apiRequest<ArticlesResponse>(`/articles?${params.toString()}`);
}

// GET SPECIFIC THERAPIST'S ARTICLES
export async function fetchMyArticles(): Promise<Article[]> {
  return apiRequest<Article[]>("/articles/mine", { auth: true });
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
export type ArticleInput = {
  title: string;
  content: string;
  category: string;
};

export async function createArticle(data: ArticleInput): Promise<Article> {
  return apiRequest<Article>("/articles", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

// UPDATE EXISTING ARTICLE
export async function updateArticle(
  id: string,
  data: ArticleInput,
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
