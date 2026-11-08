import { apiRequest } from "./apiRequest";
import type { Session, SessionDetail } from "../types/index";

// CLIENT SESSION BOOKING
export async function bookSession(slotId: string): Promise<Session> {
  return apiRequest<Session>("/sessions", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ slotId }),
  });
}

// FETCHING ALL SESSIONS
export async function fetchMySessions(): Promise<Session[]> {
  return apiRequest<Session[]>("/sessions", { auth: true });
}

// UPDATING SESSION STATUS

export async function updateSessionStatus(
  sessionId: string,
  status: "confirmed" | "rejected" | "cancelled",
): Promise<Session> {
  return apiRequest<Session>(`/sessions/${sessionId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status }),
  });
}

// GET ONE SESSION WITH ALL ITS DETAILS
export async function fetchSessionById(id: string): Promise<SessionDetail> {
  return apiRequest<SessionDetail>(`/sessions/${id}`, { auth: true });
}
