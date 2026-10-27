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

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    // The request never reached the server (offline, server down, CORS...)
    throw new ApiError(
      "We couldn't reach the server. Please check your connection and try again.",
      0,
    );
  }

  // Read the body as text first, so empty responses (like DELETE) don't crash
  const text = await res.text();

  // The body may not be JSON if the server or a proxy fails (for example an HTML error page)
  let data: any;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  // A 401 on a protected request means the token is missing, expired or invalid.
  // AuthContext listens for this event and logs the user out, and the route
  // guards then send them to /login. Requests without auth (like login) are
  // skipped, so a wrong password only shows its own error message.
  if (res.status === 401 && auth) {
    window.dispatchEvent(new Event("auth:expired"));
  }

  if (!res.ok) {
    throw new ApiError(
      data?.error ?? "Something went wrong. Please try again.",
      res.status,
    );
  }

  return data as T;
}
