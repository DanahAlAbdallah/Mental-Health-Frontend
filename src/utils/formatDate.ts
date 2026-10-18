// TURN THE DATE FROM THE DATABASE INTO SIMPLE TEXT, LIKE "Oct 16, 2026"
export function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
