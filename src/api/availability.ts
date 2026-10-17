import type { AvailabilitySlot } from "../types";
import { apiRequest } from "./apiRequest";

// CREATE A NEW SLOT
export async function createSlot(data: {
  date: string;
  startTime: string;
  endTime: string;
}): Promise<AvailabilitySlot> {
  return apiRequest<AvailabilitySlot>("/availability", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

// GET SPECIFIC THERAPIST SLOTS
export async function fetchTherapistSlots(
  therapistId: string,
): Promise<AvailabilitySlot[]> {
  return apiRequest<AvailabilitySlot[]>(`/availability/${therapistId}`);
}

// DELETE EXISTING SLOT
export async function deleteSlot(id: string): Promise<void> {
  return apiRequest<void>(`/availability/${id}`, {
    method: "DELETE",
    auth: true,
  });
}