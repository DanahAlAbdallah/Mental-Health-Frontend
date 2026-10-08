import type { AvailabilitySlot } from "../types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/availability`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function createSlot(data: {
  date: string;
  startTime: string;
  endTime: string;
}): Promise<AvailabilitySlot> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create slot");
  }
  return res.json();
}

export async function fetchTherapistSlots(
  therapistId: string,
): Promise<AvailabilitySlot[]> {
  const res = await fetch(`${BASE_URL}/${therapistId}`);
  if (!res.ok) throw new Error("Failed to fetch slots");
  return res.json();
}

export async function deleteSlot(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete slot");
}
