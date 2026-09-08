import { articles } from '../data/articles';
import type { Article } from '../types';

// simulates network delay, like a real API call would have
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchArticles(): Promise<Article[]> {
  await delay(500);
  return articles;
}

export async function fetchArticleById(id: string): Promise<Article | undefined> {
  await delay(300);
  return articles.find((a) => a.id === id);
}