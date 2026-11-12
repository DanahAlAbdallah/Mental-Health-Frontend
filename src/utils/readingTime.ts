
// Calculates estimated reading time assuming ~200 words per minute
export function readingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
