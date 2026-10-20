import type {  Therapist, TherapistProfile } from "../types";
import { apiRequest } from "./apiRequest";

// GET ONLY THERAPISTS
export async function fetchTherapists(): Promise<Therapist[]> {
  return apiRequest<Therapist[]>("/users/therapists");
}

// GET THE PROFILE OF THE LOGGED IN THERAPIST
export function fetchMyProfile() {
  return apiRequest<TherapistProfile>("/users/me/profile", { auth: true });
}