import type { Therapist, TherapistProfile, User } from "../types";
import { apiRequest } from "./apiRequest";

// GET ONLY THERAPISTS
export async function fetchTherapists(): Promise<Therapist[]> {
  return apiRequest<Therapist[]>("/users/therapists");
}

// GET THE LOGGED-IN THERAPIST'S PROFESSIONAL PROFILE
export function fetchMyProfile(): Promise<TherapistProfile> {
  return apiRequest<TherapistProfile>("/users/me/profile", {
    auth: true,
  });
}

// FIELDS THE LOGGED-IN USER CAN UPDATE
export interface UpdateMyUserData {
  name: string;
  phone: string | null;
  avatarUrl: string | null;
}

// UPDATE PERSONAL INFORMATION
export function updateMyUser(data: UpdateMyUserData): Promise<User> {
  return apiRequest<User>("/users/me", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(data),
  });
}

// UPDATE THE LOGGED-IN THERAPIST'S PROFESSIONAL PROFILE
export function updateMyProfile(
  data: TherapistProfile,
): Promise<TherapistProfile> {
  return apiRequest<TherapistProfile>("/users/me/profile", {
    method: "PUT",
    auth: true,
   body: JSON.stringify(data),
  });
}