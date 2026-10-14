export interface Session {
  id: string;
  therapistId: string;
  patientId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/sessions`;

interface ApiError {
  error?: string;
}

// ERROR MESSAGE
async function getErrorMessage(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as ApiError;
  return data.error ?? "Something went wrong. Please try again.";
}

// CLIENT SESSION BOOKING
export async function bookSession(
  slotId: string,
  token: string,
): Promise<Session> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ slotId }),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json() as Promise<Session>;
}

// FETCHING ALL SESSIONS
export async function fetchMySessions(token: string): Promise<Session[]> {
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json() as Promise<Session[]>;
}

// UPDATING SESSION STATUS
export async function updateSessionStatus(
  sessionId: string,
  status: "confirmed" | "rejected",
  token: string,
): Promise<Session> {
  const res = await fetch(`${BASE_URL}/${sessionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json() as Promise<Session>;
}
