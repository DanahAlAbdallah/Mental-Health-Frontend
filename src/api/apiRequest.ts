const API_URL = import.meta.env.VITE_API_URL;

// An error that also remembers the HTTP status (404, 401, 500...)
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiRequestOptions extends RequestInit {
  auth?: boolean; // true = send the logged-in user's token
}

export async function apiRequest<T>(
  path: string,
  { auth = false, headers, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  // Read the body as text first, so empty responses (like DELETE) don't crash
  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    throw new ApiError(
      data?.error ?? "Something went wrong. Please try again.",
      res.status,
    );
  }

  return data as T;
}
