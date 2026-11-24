import type { Therapist, TherapistProfile, User } from "../types";
import { apiRequest } from "./apiRequest";

export interface TherapistsResponse {
  therapists: Therapist[];
  currentPage: number;
  totalTherapists: number;
  totalPages: number;
}

// GET ONLY THERAPISTS
export async function fetchTherapists(
  search = "",
  page = 1,
  limit = 9,
): Promise<TherapistsResponse> {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit),
  });

  return apiRequest<TherapistsResponse>(
    `/users/therapists?${params.toString()}`,
  );
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

// GET ONE THERAPIST'S PUBLIC DETAILS
export async function fetchTherapistDetails(id: string): Promise<Therapist> {
  return apiRequest<Therapist>(`/users/${id}`);
}

// UPLOAD THE LOGGED-IN USER'S PROFILE PHOTO
export function uploadMyAvatar(photo: File): Promise<User> {
  const formData = new FormData();

  formData.append("photo", photo);

  return apiRequest<User>("/users/me/avatar", {
    method: "POST",
    auth: true,
    body: formData,
  });
}
