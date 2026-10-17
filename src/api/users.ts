import type { Therapist } from "../types";
import { apiRequest } from "./apiRequest";

// GET ONLY THERAPISTS
export async function fetchTherapists(): Promise<Therapist[]> {
  return apiRequest<Therapist[]>("/users/therapists");
}
