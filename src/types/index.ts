// ARTICLE
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
}

// USER
export type UserRole = "client" | "therapist" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface TherapistProfile {
  userId: string;
  bio: string;
  specialties: string[];
  yearsOfExperience?: number;
  languages: string[];
  sessionPrice?: number;
  sessionType: "online" | "in-person" | "both";
  location?: string;
}

// WHAT THE THERAPISTS PAGE SHOWS: THE USER'S PUBLIC DATA PLUS THE PROFILE
export interface Therapist {
  id: string;
  name: string;
  avatarUrl?: string;
  profile: TherapistProfile;
}

// AVAILABILITY SLOTS
export interface AvailabilitySlot {
  id: string;
  therapistId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

// SESSIONS
export interface Session {
  id: string;
  therapistId: string;
  patientId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  sessionType: "online" | "in-person";
  createdAt: string;
  therapistName?: string | null; // add
  patientName?: string | null; // add
}

// SESSION DETAILS
export interface SessionDetail extends Session {
  durationMinutes: number;
  history: Pick<
    Session,
    "id" | "date" | "startTime" | "endTime" | "status" | "sessionType"
  >[];
  therapist: {
    id: string;
    name: string;
    avatarUrl: string | null;
    bio: string | null;
    specialties: string[];
    languages: string[];
    yearsOfExperience: number | null;
    sessionPrice: number | null;
    location: string | null;
  };
  patient: {
    id: string;
    name: string;
    avatarUrl: string | null;
    email?: string | null;
    phone?: string | null;
  };
}
