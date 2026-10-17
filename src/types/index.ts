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
  status: string;
  createdAt: string;
}

//THERAPIST
export interface Therapist {
  id: string;
  name: string;
}
